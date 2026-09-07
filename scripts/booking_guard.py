#!/usr/bin/env python3
"""Close-only booking guard. Private journal; no guest messages or cancellations.

Run with --apply to close exposed nights. Without it all Hostex calls are reads.
Booking notification emails are triggers, never authoritative stay details: the
current Booking template omits room and checkout. Missing imports stay unresolved
until independent details are available. See docs/booking-protection.md.
"""
import argparse
import datetime as dt
import email.utils
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import urllib.parse
from zoneinfo import ZoneInfo

HOUSE = 12299611
SUITES = (12282945, 12282946, 12282947, 12282948)
PROPERTIES = (*SUITES, HOUSE)
STATE = Path.home() / '.local/share/ilbuco-booking-guard'
GOG = '/Users/ivan/.claude/bin/gogx'
OP = '/Users/ivan/.claude/bin/opx'
ACCOUNT = os.environ.get('BOOKING_GUARD_ACCOUNT', '')


def dates(start, checkout):
    a, b = dt.date.fromisoformat(start), dt.date.fromisoformat(checkout)
    if a >= b or (b-a).days > 1827:
        raise ValueError('Invalid or excessive stay interval')
    return [(a+dt.timedelta(days=i)).isoformat() for i in range((b-a).days)]


def command_json(args):
    p = subprocess.run(args, capture_output=True, text=True, timeout=90)
    if p.returncode:
        raise RuntimeError('Read failed: ' + Path(args[0]).name)
    return json.loads(p.stdout)


class Hostex:
    def __init__(self):
        # Credential source is 1Password, never a project environment file.
        p = subprocess.run([OP, 'document', 'get', 'env-backup: projects/ilbuco-g2/.env.local',
                            '--vault', 'AI'], capture_output=True, text=True, timeout=90)
        if p.returncode:
            raise RuntimeError('Hostex credential unavailable from 1Password')
        m = re.search(r'^HOSTEX_API_KEY=["\']?([^\r\n"\']+)', p.stdout, re.M)
        if not m:
            raise RuntimeError('Hostex credential missing from vault document')
        self.key = m.group(1)

    def request(self, path, body=None):
        # stdin keeps the token out of process arguments and log files. curl is
        # used because this host's Python HTTP client is rejected by the edge.
        cfg = 'header = '+json.dumps('Hostex-Access-Token: '+self.key)+'\n'
        cfg += 'header = "Content-Type: application/json"\n'
        if body is not None:
            cfg += 'request = "POST"\ndata = '+json.dumps(json.dumps(body))+'\n'
        p = subprocess.run(['curl', '-sS', '--fail-with-body', '--max-time', '40',
                            '--config', '-', 'https://api.hostex.io/v3'+path],
                           input=cfg, text=True, capture_output=True, timeout=45)
        if p.returncode:
            raise RuntimeError('Hostex HTTP request failed')
        d = json.loads(p.stdout)
        if not isinstance(d, dict) or d.get('error_code') != 200 or (body is None and 'data' not in d):
            raise RuntimeError('Hostex rejected or malformed response')
        return d.get('data', {})

    def reservations(self):
        result, seen = [], set()
        for offset in range(0, 10000, 100):
            # No date filters: Hostex requires paired date filters and a paired
            # check-in window misses arbitrarily long stays already in progress.
            d = self.request('/reservations?limit=100&offset='+str(offset))
            page = d.get('reservations')
            if not isinstance(page, list):
                raise ValueError('Incomplete Hostex reservations')
            for r in page:
                validate_span(r)
                identity = (r['reservation_code'], r.get('stay_code'), r['property_id'])
                if identity in seen:
                    raise ValueError('Repeated reservation page or allocation')
                seen.add(identity)
            result.extend(page)
            if len(page) < 100:
                return result
        raise ValueError('Hostex pagination exceeded bound')


def validate_span(r):
    if (not isinstance(r, dict) or not isinstance(r.get('property_id'), int)
            or not isinstance(r.get('reservation_code'), str)
            or not isinstance(r.get('status'), str)):
        raise ValueError('Malformed Hostex reservation')
    dates(r['check_in_date'], r['check_out_date'])


def protection_plan(reservations, start, end):
    expected = {p: set() for p in PROPERTIES}
    owners = {}
    for r in reservations:
        validate_span(r)
        p = r['property_id']
        if p not in PROPERTIES or r['status'] != 'accepted' or r.get('cancelled_at'):
            continue
        targets = PROPERTIES if p == HOUSE else (p, HOUSE)
        for day in dates(r['check_in_date'], r['check_out_date']):
            if start <= day <= end:
                for target in targets:
                    expected[target].add(day)
                owners.setdefault(day, []).append(r)
    conflicts = []
    for day, rows in owners.items():
        for i, a in enumerate(rows):
            for b in rows[i+1:]:
                if a['property_id'] == b['property_id'] or HOUSE in (a['property_id'], b['property_id']):
                    conflicts.append({'date': day, 'reservations': sorted([
                        a['reservation_code'], b['reservation_code']])})
    return expected, conflicts


def notification(d):
    """Only accept Booking identity from Gmail's top Authentication-Results.

    Even authenticated emails cannot mutate dates/status: they only request a
    fresh read. Forwarded/manual text and arbitrary instructions are ignored.
    """
    msg = d.get('message', {})
    headers = msg.get('payload', {}).get('headers', [])
    auth = next((h['value'] for h in headers if h['name'].lower() == 'authentication-results'), '')
    sender = email.utils.parseaddr(d.get('headers', {}).get('from', ''))[1].lower()
    if sender != 'noreply@booking.com' or not auth.startswith('mx.google.com;'):
        return None
    if not re.search(r'dkim=pass[^;]*header\.i=@booking\.com(?:\s|;)', auth):
        return None
    if not re.search(r'dmarc=pass[^;]*header\.from=booking\.com(?:\s|;|$)', auth):
        return None
    body = re.sub(r'\s+', '', d.get('body', ''))
    hotel_ids = set(re.findall(r'hotel_id=(\d+)', body))
    booking_ids = set(re.findall(r'res_id=(\d+)', body))
    if hotel_ids != {'14399118'} or len(booking_ids) != 1:
        return None
    return {'message_id': msg['id'], 'booking_id': next(iter(booking_ids)),
            'received_at': int(msg['internalDate'])}


def read_notifications(db):
    if not ACCOUNT:
        raise ValueError('Independent mailbox account is not configured')
    q = ('from:noreply@booking.com newer_than:365d '
         '(subject:reservation OR subject:reserva OR subject:booking) '
         '-subject:"verification code" -subject:"sign-in" -subject:password')
    page = command_json([GOG, 'gmail', 'messages', 'search', q, '--account', ACCOUNT,
                         '--max', '100', '--all', '--json', '--no-input', '--gmail-no-send'])
    if not isinstance(page.get('messages'), list) or page.get('nextPageToken'):
        raise ValueError('Incomplete Gmail search')
    for m in page['messages']:
        if db.execute('select 1 from mail_seen where id=?', (m['id'],)).fetchone():
            continue
        d = command_json([GOG, 'gmail', 'get', m['id'], '--account', ACCOUNT,
                          '--json', '--no-input', '--gmail-no-send'])
        n = notification(d)
        with db:
            if n:
                db.execute('insert or ignore into notices values(?,?,?)',
                           (n['message_id'], n['booking_id'], n['received_at']))
            db.execute('insert into mail_seen values(?)', (m['id'],))


def calendar_gaps(api, expected, properties):
    channels, listing_owner = {}, {}
    for p in properties:
        if p.get('id') not in PROPERTIES:
            continue
        if p['id'] in channels or not isinstance(p.get('channels'), list):
            raise ValueError('Duplicate or malformed property mapping')
        channels[p['id']] = p['channels']
        for c in p['channels']:
            key = (c.get('channel_type'), c.get('listing_id'))
            if not all(isinstance(v, str) and v for v in key) or key in listing_owner:
                raise ValueError('Duplicate or malformed listing ownership')
            listing_owner[key] = p['id']
    if set(channels) != set(PROPERTIES):
        raise ValueError('Missing property mapping')
    for listings in channels.values():
        if not {'booking.com', 'airbnb', 'booking_site'} <= {c['channel_type'] for c in listings}:
            raise ValueError('A required booking channel is unlinked')
    missing = []
    all_days = sorted(set().union(*expected.values()))
    if not all_days:
        return []
    start, end = dt.date.fromisoformat(all_days[0]), dt.date.fromisoformat(all_days[-1])
    while start <= end:
        stop = min(start+dt.timedelta(days=59), end)
        listing_owners = {(c['channel_type'], c['listing_id']): p
                          for p, cs in channels.items() for c in cs}
        d = api.request('/listings/calendar', {
            'listings': [{'channel_type': c, 'listing_id': l} for c, l in listing_owners],
            'start_date': start.isoformat(), 'end_date': stop.isoformat()})
        rows = d.get('listings')
        if not isinstance(rows, list):
            raise ValueError('Missing listing calendars')
        found = {}
        for r in rows:
            key = (r.get('channel_type'), r.get('listing_id'))
            if key not in listing_owners or key in found or not isinstance(r.get('calendar'), list):
                raise ValueError('Unexpected or duplicate calendar listing')
            nights = {}
            for night in r['calendar']:
                if night.get('date') in nights or type(night.get('inventory')) is not int:
                    raise ValueError('Malformed listing night')
                nights[night['date']] = night['inventory']
            found[key] = nights
        if set(found) != set(listing_owners):
            raise ValueError('Partial listing calendar response')
        for key, p in listing_owners.items():
            for day in sorted(expected[p]):
                if start.isoformat() <= day <= stop.isoformat():
                    if day not in found[key]:
                        raise ValueError('A required night was omitted by Hostex')
                    if found[key][day] != 0:
                        missing.append({'property_id': p, 'date': day,
                                        'channel_type': key[0], 'listing_id': key[1]})
        start = stop+dt.timedelta(days=1)
    return missing


def run(db, api, apply):
    today = dt.datetime.now(ZoneInfo('America/Argentina/Buenos_Aires')).date()
    end = today+dt.timedelta(days=365)
    source_error = None
    try:
        read_notifications(db)
    except Exception as e:
        source_error = str(e)
    # A mailbox outage must not disable protection of known reservations.
    reservations = api.reservations()
    properties = api.request('/properties').get('properties')
    if not isinstance(properties, list):
        raise ValueError('Incomplete properties response')
    expected, conflicts = protection_plan(reservations, str(today), str(end))
    # Finish all source/calendar reads before any writes.
    gaps = calendar_gaps(api, expected, properties)
    submitted, attempts, repair_error = 0, [], None
    if apply and gaps:
        try:
            for p in PROPERTIES:
                nights = sorted({g['date'] for g in gaps if g['property_id'] == p})
                for i in range(0, len(nights), 60):
                    attempt = {'property_id': p, 'dates': nights[i:i+60], 'status': 'unknown'}
                    attempts.append(attempt)
                    api.request('/availabilities', {'property_ids': [p], 'dates': nights[i:i+60],
                                'available': False, 'remarks': 'Il Buco booking protection; never auto-reopen.'})
                    attempt['status'] = 'accepted'
                    submitted += len(nights[i:i+60])
            gaps = calendar_gaps(api, expected, properties)
        except Exception as e:
            # Timeout may follow a successful remote write; retain intent and
            # do not claim rollback or verified protection.
            repair_error = str(e)
    by_id = {str(r.get('channel_id')) for r in reservations if r.get('channel_type') == 'booking.com'}
    notices = db.execute('select booking_id, max(received_at) from notices group by booking_id').fetchall()
    notice_ids = {x[0] for x in notices}
    upcoming_ota = {str(r.get('channel_id')) for r in reservations
                    if r.get('channel_type') == 'booking.com' and r['status'] == 'accepted'
                    and not r.get('cancelled_at') and r['check_out_date'] > str(today)}
    activated = int(db.execute("select value from meta where key='activated_at_ms'").fetchone()[0])
    missing_imports = sorted({bid for bid, received in notices if received >= activated}-by_id)
    source_gap = sorted(upcoming_ota-notice_ids)
    return {'schema': 1, 'checked_at': dt.datetime.now(dt.timezone.utc).isoformat(),
            'mode': 'apply' if apply else 'read-only', 'reservations_read': len(reservations),
            'source_error': source_error, 'repair_error': repair_error, 'write_attempts': attempts,
            'protection_nights': sum(map(len, expected.values())),
            'submitted_nights': submitted, 'unverified_channel_nights': gaps,
            'conflicts': conflicts, 'notifications_registered': len(notices),
            'notifications_without_hostex_record': missing_imports,
            'upcoming_booking_ids_without_independent_notification': source_gap,
            'independent_source_complete': False,
            'source_limitation': 'Booking emails omit room and checkout; full Booking source is required for missing-import recovery.'}


def main():
    global ACCOUNT
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--apply', action='store_true')
    p.add_argument('--state-dir', type=Path, default=STATE)
    args = p.parse_args()
    os.umask(0o077)
    args.state_dir.mkdir(parents=True, exist_ok=True, mode=0o700)
    settings = args.state_dir/'settings.json'
    if not ACCOUNT and settings.exists():
        ACCOUNT = json.loads(settings.read_text()).get('gmail_account', '')
    with (args.state_dir/'run.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print(json.dumps({'status': 'already-running'}))
            return
        db = sqlite3.connect(args.state_dir/'journal.sqlite3')
        db.executescript('create table if not exists mail_seen(id text primary key);'
                        'create table if not exists notices(message_id text primary key,booking_id text,received_at integer);'
                        'create table if not exists meta(key text primary key,value text);')
        with db:
            db.execute("insert or ignore into meta values('activated_at_ms',?)",
                       (str(int(dt.datetime.now(dt.timezone.utc).timestamp()*1000)),))
        try:
            result = run(db, Hostex(), args.apply)
        except Exception as e:
            result = {'checked_at': dt.datetime.now(dt.timezone.utc).isoformat(),
                      'status': 'failed', 'reason': str(e), 'independent_source_complete': False}
        finally:
            db.close()
        signature_data = {k: v for k, v in result.items() if k not in ('checked_at', 'submitted_nights', 'write_attempts')}
        signature = hashlib.sha256(json.dumps(signature_data, sort_keys=True).encode()).hexdigest()
        status_path = args.state_dir/'status.json'
        previous = json.loads(status_path.read_text()) if status_path.exists() else {}
        result['changed'] = previous.get('signature') != signature
        result['signature'] = signature
        temp = args.state_dir/'status.tmp'
        temp.write_text(json.dumps(result, indent=2)+'\n')
        temp.replace(status_path)
        print(json.dumps(result))
        if result.get('status') == 'failed' or result.get('repair_error'):
            raise SystemExit(1)


if __name__ == '__main__':
    main()
