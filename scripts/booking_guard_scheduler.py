#!/usr/bin/env python3
"""15-minute scheduler for the booking guard (LaunchAgent com.openclaw.ilbuco-booking-guard).

Runs the guard prompt on ZCode GLM Flash. If Flash fails, runs the guard
directly so protection never lapses. Alerts and new executor failures become
one Noe card each, deduplicated by signature; unchanged runs stay quiet.
"""
import datetime as dt
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.parse
import urllib.request

STATE = Path.home() / '.local/share/ilbuco-booking-guard'
PROMPT = STATE / 'flash-prompt.txt'
EXECUTOR_STATUS = STATE / 'flash-executor-status.json'
REPO = Path('/Users/ivan/projects/ilbuco-g2')
FLASH = '/Users/ivan/.claude/bin/zcode-flash-task'
NOE = 'http://127.0.0.1:8766/task/new'
FLASH_FAILURES_BEFORE_CARD = 3


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def load(path):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        return {}


def last_json_object(text):
    """ZCode's final message may wrap the JSON in prose or a code fence."""
    for start in [i for i, c in enumerate(text) if c == '{'][::-1]:
        try:
            obj, _ = json.JSONDecoder().raw_decode(text[start:])
        except ValueError:
            continue
        if isinstance(obj, dict) and 'checked_at' in obj:
            return obj
    return None


def strings(node):
    """Every string in the ZCode report, in document order (the final message is last)."""
    if isinstance(node, str):
        yield node
    elif isinstance(node, dict):
        for v in node.values():
            yield from strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from strings(v)


def card(title, body):
    data = urllib.parse.urlencode({'title': title[:80], 'project': 'ilbuco-g2', 'comment': body,
                                   'state': 'awaiting-ivan', 'priority': 'high'}).encode()
    try:
        urllib.request.urlopen(urllib.request.Request(NOE, data=data), timeout=20).read()
        return True
    except OSError as e:
        print(f'Noe card failed: {e}', file=sys.stderr)
        return False


def log_line(text):
    """One line per tick; stdout is wired to scheduler.log by the LaunchAgent.
    Without it a Flash failure leaves no local trace (only the deduped Noe card),
    and failure frequency cannot be established after the fact."""
    path = STATE / 'scheduler.log'
    try:
        if path.exists() and path.stat().st_size > 1_000_000:
            path.replace(STATE / 'scheduler.log.old')
    except OSError:
        pass
    print(f'{now()} {text}', flush=True)


def run_flash():
    env = dict(os.environ, ZCODE_FLASH_TIMEOUT=os.environ.get('ZCODE_FLASH_TIMEOUT', '600'))
    try:
        p = subprocess.run([FLASH, str(REPO), str(PROMPT)], capture_output=True, text=True, env=env, timeout=900)
    except subprocess.TimeoutExpired:
        # A hung wrapper (e.g. ZCode risk-control stall) must degrade to the
        # direct fallback like any other Flash failure, not crash the tick.
        return None, 'Flash wrapper exceeded outer 900s timeout'
    if p.returncode:
        return None, (p.stderr.strip().splitlines() or [f'exit {p.returncode}'])[-1][:300]
    try:
        report = json.loads(p.stdout)
    except ValueError:
        return None, 'Flash wrapper returned non-JSON output'
    parsed = next(filter(None, map(last_json_object, reversed(list(strings(report))))), None)
    if not parsed:
        return None, 'Flash run returned no guard JSON'
    return parsed, None


def run_direct():
    try:
        p = subprocess.run(['python3', str(REPO / 'scripts/booking_guard.py'), '--apply'],
                           capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        # A hung direct run must degrade to the failure card and log line like
        # any other failure, not crash the tick with no trace (seen 2026-10-14).
        return False, 'direct run exceeded 600s timeout'
    # The guard prints its own failure JSON as the last stdout line; without it
    # the card cannot say why the direct run failed (status.json gets overwritten
    # by the next successful run before anyone reads it).
    reason = ''
    for line in reversed((p.stdout or '').strip().splitlines()):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if isinstance(d, dict) and d.get('status') == 'failed':
            reason = str(d.get('reason', ''))[:300]
            break
    if not reason and p.returncode:
        reason = ((p.stderr or '').strip().splitlines() or [f'exit {p.returncode}'])[-1][:300]
    return p.returncode == 0, reason


def main():
    lock = open(STATE / 'scheduler.lock', 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        return
    prior = load(EXECUTOR_STATUS)
    result, error = run_flash()
    status = {'checked_at': now(), 'state': 'ok' if result else 'failed', 'error': error,
              'alert_signatures': prior.get('alert_signatures', [])[-50:],
              'failure_card_open': bool(prior.get('failure_card_open'))}
    if result:
        status['failure_card_open'] = False
        alert = result.get('alert')
        sig = result.get('signature') or (hashlib.sha256(alert.encode()).hexdigest()[:16] if alert else None)
        if alert and sig not in status['alert_signatures']:
            if card(f'Il Buco booking guard: {alert}', f'{alert}\n\nGuard result:\n{json.dumps(result, indent=1)}'):
                status['alert_signatures'].append(sig)
    else:
        status['new_failure'] = prior.get('state') != 'failed' or prior.get('error') != error
        status['fallback_success'], direct_reason = run_direct()
        status['fallback_reason'] = direct_reason or None
        status['fallback_checked_at'] = load(STATE / 'status.json').get('checked_at')
        status['consecutive_failures'] = (prior.get('consecutive_failures', 0) if prior.get('state') == 'failed' else 0) + 1
        # A lone Flash timeout that the direct run covered is not worth a card;
        # board only when the guard itself did not run, or Flash stays down.
        # One open failure card per episode: repeat ticks stay quiet until a
        # successful run clears the flag (2026-10-14: four cards in two hours).
        if ((not status['fallback_success'] or status['consecutive_failures'] == FLASH_FAILURES_BEFORE_CARD)
                and not status['failure_card_open']):
            body = (f'Flash error: {error}\nConsecutive Flash failures: {status["consecutive_failures"]}\n'
                    f'Direct guard run succeeded: {status["fallback_success"]}')
            if direct_reason:
                body += f'\nDirect failure reason: {direct_reason}'
            if card('Il Buco booking guard: Flash run failed'
                    + ('' if status['fallback_success'] else ', direct run failed too'), body):
                status['failure_card_open'] = True
    EXECUTOR_STATUS.write_text(json.dumps(status, indent=1))
    if result:
        log_line('flash=ok')
    else:
        log_line(f'flash=failed error={error!r} fallback={status["fallback_success"]}')


if __name__ == '__main__':
    main()
