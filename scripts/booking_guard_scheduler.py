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


def run_flash():
    env = dict(os.environ, ZCODE_FLASH_TIMEOUT=os.environ.get('ZCODE_FLASH_TIMEOUT', '600'))
    p = subprocess.run([FLASH, str(REPO), str(PROMPT)], capture_output=True, text=True, env=env, timeout=900)
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
    p = subprocess.run(['python3', str(REPO / 'scripts/booking_guard.py'), '--apply'],
                       capture_output=True, text=True, timeout=600)
    return p.returncode == 0


def main():
    lock = open(STATE / 'scheduler.lock', 'w')
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        return
    prior = load(EXECUTOR_STATUS)
    result, error = run_flash()
    status = {'checked_at': now(), 'state': 'ok' if result else 'failed', 'error': error,
              'alert_signatures': prior.get('alert_signatures', [])[-50:]}
    if result:
        alert = result.get('alert')
        sig = result.get('signature') or (hashlib.sha256(alert.encode()).hexdigest()[:16] if alert else None)
        if alert and sig not in status['alert_signatures']:
            if card(f'Il Buco booking guard: {alert}', f'{alert}\n\nGuard result:\n{json.dumps(result, indent=1)}'):
                status['alert_signatures'].append(sig)
    else:
        status['new_failure'] = prior.get('state') != 'failed' or prior.get('error') != error
        status['fallback_success'] = run_direct()
        status['fallback_checked_at'] = load(STATE / 'status.json').get('checked_at')
        if status['new_failure'] or not status['fallback_success']:
            card('Il Buco booking guard: Flash run failed' + ('' if status['fallback_success'] else ', direct run failed too'),
                 f'Flash error: {error}\nDirect guard run succeeded: {status["fallback_success"]}')
    EXECUTOR_STATUS.write_text(json.dumps(status, indent=1))


if __name__ == '__main__':
    main()
