#!/usr/bin/env python3
"""15-minute scheduler for the booking guard (LaunchAgent com.openclaw.ilbuco-booking-guard).

Runs the guard directly first (deterministic: protection never depends on
Flash), then asks ZCode GLM Flash to judge the fresh status.json for an alert.
Flash no longer runs the guard itself: under load the guard takes over 126 s,
ZCode's Bash tool limit, and Flash then polled the backgrounded run until the
600 s wrapper timeout (three ticks in a row on 2026-11-06). Alerts and new executor failures become
one message to the hub session noe each, deduplicated by signature; unchanged runs stay quiet.

When Flash does not answer (2026-11-07: three ticks stalled on its second model
request), the scheduler judges status.json itself with fixed rules and pages
noe only for a real problem in the guard's data; Flash's own failure is a log
line, and Flash is asked again on the next tick.
"""
import datetime as dt
import fcntl
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time

STATE = Path.home() / '.local/share/ilbuco-booking-guard'
PROMPT = STATE / 'flash-prompt.txt'
EXECUTOR_STATUS = STATE / 'flash-executor-status.json'
REPO = Path('/Users/ivan/projects/ilbuco-g2')
FLASH = '/Users/ivan/.claude/bin/zcode-flash-task'
# The Noe board on :8766 was archived 2026-10-14; alerts go to the hub session noe.
HUB = '/Users/ivan/agents-hub-main/bin/hub'
# status.json older than this means the guard has stopped updating it (ticks
# run every 15-20 min; a held run lock may skip one).
STALE_AFTER = 3600


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
    text = f'{title}\n\n{body}'[:3000]
    # Stable client id: a retried tick never posts the same alert twice.
    cid = 'ilbuco-guard-' + hashlib.sha256(text.encode()).hexdigest()[:16]
    try:
        p = subprocess.run([HUB, 'agent-send', 'noe', text, '--as', 'ilbuco-booking-guard', '--id', cid],
                           capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as e:
        print(f'Hub alert failed: {e}', file=sys.stderr)
        return False
    if p.returncode:
        print(f'Hub alert failed: exit {p.returncode} {p.stderr.strip()[-200:]}', file=sys.stderr)
        return False
    return True


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
    # Flash only reads status.json now; a run past 300 s is a hang, not work.
    env = dict(os.environ, ZCODE_FLASH_TIMEOUT=str(min(int(os.environ.get('ZCODE_FLASH_TIMEOUT', '300')), 300)))
    try:
        p = subprocess.run([FLASH, str(REPO), str(PROMPT)], capture_output=True, text=True, env=env, timeout=660)
    except subprocess.TimeoutExpired:
        # A hung wrapper (e.g. a credential or ZCode stall) must become a logged
        # Flash failure like any other, not crash the tick.
        return None, 'Flash wrapper exceeded outer 660s timeout'
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
    """Returns (ok, reason, ran). ran=False: another guard run held run.lock
    for the whole wait, so this tick did not check anything itself."""
    deadline = time.monotonic() + 300
    while True:
        try:
            p = subprocess.run(['python3', str(REPO / 'scripts/booking_guard.py'), '--apply'],
                               capture_output=True, text=True, timeout=600)
        except subprocess.TimeoutExpired:
            # A hung direct run must degrade to the failure card and log line like
            # any other failure, not crash the tick with no trace (seen 2026-10-14).
            return False, 'direct run exceeded 600s timeout', True
        # The guard prints its own failure JSON as the last stdout line; without it
        # the card cannot say why the direct run failed (status.json gets overwritten
        # by the next successful run before anyone reads it).
        reason, busy = '', False
        for line in reversed((p.stdout or '').strip().splitlines()):
            try:
                d = json.loads(line)
            except ValueError:
                continue
            if isinstance(d, dict) and d.get('status') == 'failed':
                reason = str(d.get('reason', ''))[:300]
                break
            if isinstance(d, dict) and d.get('status') == 'already-running':
                busy = True
                break
        if busy:
            # Another guard run (a manual one, or a leftover of an old Flash run)
            # holds run.lock: wait for it instead of reporting a check that did not happen.
            if time.monotonic() < deadline:
                time.sleep(10)
                continue
            return p.returncode == 0, 'guard run.lock held by another run for 300s', False
        if not reason and p.returncode:
            reason = ((p.stderr or '').strip().splitlines() or [f'exit {p.returncode}'])[-1][:300]
        return p.returncode == 0, reason, True


def conflict_key(c):
    return json.dumps({'date': c.get('date'), 'reservations': sorted(map(str, c.get('reservations') or []))},
                      sort_keys=True)


def local_problems(st, prior):
    """Deterministic stand-in for Flash's verdict on status.json.

    Returns (problems, known_conflicts, known_source_error): problems is a list
    of one-line texts worth a card; the known_* values are the baseline to
    keep once those problems are reported. Known limits (Booking iCal without
    an independent notification, manual block overlaps) and conflicts or a
    source error Flash already judged stay quiet."""
    if not st:
        return ['status.json is missing or unreadable'], prior.get('known_conflicts'), prior.get('known_source_error')
    problems = []
    if st.get('status') == 'failed':
        problems.append(f'guard run failed: {st.get("reason")}')
    try:
        age = (dt.datetime.now(dt.timezone.utc) - dt.datetime.fromisoformat(st['checked_at'])).total_seconds()
    except (KeyError, TypeError, ValueError):
        age = None
    if age is None or age > STALE_AFTER:
        problems.append(f'status.json not updated since {st.get("checked_at")}')
    if st.get('repair_error'):
        problems.append(f'protective block repair failed: {st["repair_error"]}')
    if st.get('unverified_channel_nights'):
        nights = st['unverified_channel_nights']
        problems.append(f'{len(nights)} protective block night(s) unverified on the channel: '
                        + ', '.join(sorted({str(n.get("date")) for n in nights}))[:300])
    if st.get('notifications_without_hostex_record'):
        missing = st['notifications_without_hostex_record']
        problems.append(f'{len(missing)} booking notification(s) without a Hostex reservation')
    current = sorted(conflict_key(c) for c in st.get('conflicts') or [])
    known = prior.get('known_conflicts')
    if known is None:  # first fallback ever: no verdict to compare with, take what is there as known
        known = current
    new = [json.loads(k) for k in current if k not in known]
    if new:
        problems.append('new booking conflict: ' + '; '.join(f'{c["date"]} ({", ".join(c["reservations"])})'
                                                            for c in new)[:300])
    source = st.get('source_error')
    known_source = prior.get('known_source_error', source)
    if source and source != known_source:
        problems.append(f'source error: {source}'[:300])
    return problems, sorted(set(known) | set(current)) if new else current, source


def main():
    lock = open(STATE / 'scheduler.lock', 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        log_line('skip: previous tick still running')
        return
    prior = load(EXECUTOR_STATUS)
    started = time.monotonic()
    direct_ok, direct_reason, ran = run_direct()
    direct_secs = time.monotonic() - started
    result, error = run_flash()
    status = {'checked_at': now(), 'state': 'ok' if result else 'failed', 'error': error,
              'alert_signatures': prior.get('alert_signatures', [])[-50:],
              'failure_card_open': bool(prior.get('failure_card_open')),
              'direct_success': direct_ok, 'direct_reason': direct_reason or None,
              'direct_ran': ran, 'direct_seconds': round(direct_secs),
              'direct_checked_at': load(STATE / 'status.json').get('checked_at')}
    if result:
        alert = result.get('alert')
        sig = result.get('signature') or (hashlib.sha256(alert.encode()).hexdigest()[:16] if alert else None)
        if alert and sig not in status['alert_signatures']:
            if card(f'Il Buco booking guard: {alert}', f'{alert}\n\nGuard result:\n{json.dumps(result, indent=1)}'):
                status['alert_signatures'].append(sig)
    guard = load(STATE / 'status.json')
    local = None
    if result:
        # Flash judged the current conflicts and source error: they are the baseline.
        status['known_conflicts'] = sorted(conflict_key(c) for c in guard.get('conflicts') or [])
        status['known_source_error'] = guard.get('source_error')
    else:
        status['new_failure'] = prior.get('state') != 'failed' or prior.get('error') != error
        status['consecutive_failures'] = (prior.get('consecutive_failures', 0) if prior.get('state') == 'failed' else 0) + 1
        problems, known_conflicts, known_source = local_problems(guard, prior)
        if not direct_ok:  # the direct-failure card below already tells it
            problems = [p for p in problems if not p.startswith('guard run failed')]
        sent = True
        for problem in problems:
            sig = 'local:' + hashlib.sha256(problem.encode()).hexdigest()[:16]
            if sig in status['alert_signatures']:
                continue
            body = (f'{problem}\n\nJudged by the scheduler itself: Flash did not answer ({error}).\n'
                    f'Guard status:\n{json.dumps(guard, indent=1)[:4000]}')
            if card(f'Il Buco booking guard: {problem}', body):
                status['alert_signatures'].append(sig)
            else:
                sent = False
        # Keep the old baseline when a card did not go out, so the next tick retries it.
        status['known_conflicts'] = known_conflicts if sent else prior.get('known_conflicts')
        status['known_source_error'] = known_source if sent else prior.get('known_source_error')
        local = 'alert:' + '|'.join(problems) if problems else 'clean'
    if direct_ok:
        status['failure_card_open'] = False
    # Flash's own failure is not worth a card: the guard ran directly and the
    # scheduler judged status.json above. Board only when the guard itself
    # failed; one open failure card per episode (2026-10-14: four cards in two hours).
    if not direct_ok and not status['failure_card_open']:
        body = (f'Direct guard run succeeded: {direct_ok} ({round(direct_secs)}s)\n'
                f'Flash error: {error}\nConsecutive Flash failures: {status.get("consecutive_failures", 0)}')
        if direct_reason:
            body += f'\nDirect failure reason: {direct_reason}'
        if card('Il Buco booking guard: direct guard run failed', body):
            status['failure_card_open'] = True
    EXECUTOR_STATUS.write_text(json.dumps(status, indent=1))
    log_line(f'direct={"ok" if direct_ok else "failed"} {round(direct_secs)}s'
             + (f' reason={direct_reason!r}' if direct_reason else '')
             + (' flash=ok' if result else f' flash=failed n={status["consecutive_failures"]} error={error!r}')
             + (f' local={local[:300]}' if local else ''))


if __name__ == '__main__':
    main()
