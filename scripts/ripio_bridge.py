#!/usr/bin/env python3
"""Bridge: the Il Buco voice agent asks munk "did a transfer of exactly N pesos arrive since T?".

The site (lib/payment-bridge.ts, on Vercel) cannot hold the Ripio key — it can move money — so the
check runs here, on munk, behind Tailscale Funnel (https://munk.<tailnet>.ts.net:10000/ripio-find).
This server listens on 127.0.0.1 only and does exactly one thing:

  POST /ripio-find  {"amount": 412037, "since": "2026-11-16T12:00:00-03:00", "wait": 3, "mode": "watch"}

signed with HMAC-SHA256 over "<ts>.<body>" (its own key, 1Password AI), timestamp within 5 minutes.
It runs agent-payments' read-only `ripio-deposit-find.py` and answers only
{"found": true, "amount": "412037.00", "at": "<ISO>"} or {"found": false} — never the sender's
CVU, the bank, the key or the script output.

Modes (a phone caller hangs up if check_payment takes 20 s — the script needs ~5 s just to start):
- "watch": keep one warm `--wait 660` script per (amount, since) polling Ripio every 5 s in the
  background — started by the first ask (hold_booking asks with wait 0 right after the hold) — and
  answer from it within `wait` seconds: found as soon as the watcher saw it, else {"found": false}.
- "once" (default, the sweep's last check before releasing a hold): one synchronous run; a watcher
  that already saw the deposit answers at once.

Env: RIPIO_BRIDGE_PORT (7392), RIPIO_BRIDGE_OP_ITEM (1Password item id, vault AI, field password)
or RIPIO_BRIDGE_SECRET (tests only), RIPIO_FIND (path to ripio-deposit-find.py).
Log: one line per request on stdout (LaunchAgent -> ~/Library/Logs/ilbuco-ripio-bridge.log).
"""
import datetime as dt
import hashlib
import hmac
import json
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PATH = '/ripio-find'
MAX_BODY = 1024
SKEW = 300
MAX_WAIT = 20            # seconds the script may keep polling inside one request
MAX_AGE = 14 * 24 * 3600  # `since` no older than 14 days
MIN_AMOUNT, MAX_AMOUNT = 1000, 100_000_000
MAX_INFLIGHT = 3
WATCH_SEC = 660          # a watcher outlives the 10-minute hold and the sweep's minute
MAX_WATCHES = 8
KEEP_WATCH = 30 * 60     # forget a finished watcher after this
MODES = ('once', 'watch')
FIND = os.environ.get('RIPIO_FIND', '/Users/ivan/projects/agent-payments/scripts/ripio-deposit-find.py')


def load_secret():
    s = os.environ.get('RIPIO_BRIDGE_SECRET', '')
    if s:
        return s
    item = os.environ.get('RIPIO_BRIDGE_OP_ITEM', '')
    if not item:
        return ''
    opx = str(Path.home() / '.claude/bin/opx')
    r = subprocess.run([opx, 'item', 'get', item, '--vault', 'AI', '--fields', 'password', '--reveal'],
                       capture_output=True, text=True, timeout=60)
    return r.stdout.strip() if r.returncode == 0 else ''


def sign(secret, ts, raw):
    return hmac.new(secret.encode(), f'{ts}.'.encode() + raw, hashlib.sha256).hexdigest()


def check(secret, headers, raw, now):
    """'' when the request is authentic, else the reason."""
    ts = headers.get('X-Bridge-Timestamp', '')
    sig = headers.get('X-Bridge-Signature', '')
    if not ts.isdigit() or not sig:
        return 'unsigned'
    if abs(now - int(ts)) > SKEW:
        return 'stale'
    if not hmac.compare_digest(sign(secret, ts, raw), sig):
        return 'bad_signature'
    return ''


def parse(raw, now):
    """(amount, since ISO, wait, mode) or None when the request is not a sane deposit question."""
    try:
        d = json.loads(raw)
    except ValueError:
        return None
    if not isinstance(d, dict) or set(d) - {'amount', 'since', 'wait', 'mode'}:
        return None
    amount, since, wait, mode = d.get('amount'), d.get('since'), d.get('wait', 0), d.get('mode', 'once')
    if mode not in MODES:
        return None
    if not isinstance(amount, int) or isinstance(amount, bool) or not MIN_AMOUNT <= amount <= MAX_AMOUNT:
        return None
    if not isinstance(wait, int) or isinstance(wait, bool) or not 0 <= wait <= MAX_WAIT:
        return None
    if not isinstance(since, str) or len(since) > 40:
        return None
    try:
        t = dt.datetime.fromisoformat(since)
    except ValueError:
        return None
    if t.tzinfo is None or not -60 <= now - t.timestamp() <= MAX_AGE:
        return None
    return amount, t.isoformat(), wait, mode


def run_find(amount, since, wait):
    """(found dict | None, error str). Exit 0 = found, 1 = not found, anything else = could not check."""
    p = subprocess.run([sys.executable, '-I', FIND, '--amount', str(amount), '--since', since,
                        '--wait', str(wait), '--every', '5'],
                       capture_output=True, text=True, timeout=wait + 45)
    if p.returncode not in (0, 1):
        return None, f'find_exit_{p.returncode}'
    try:
        out = json.loads(p.stdout.strip().splitlines()[-1])
    except (ValueError, IndexError):
        return None, 'find_bad_output'
    if p.returncode == 1 or not out.get('found'):
        return {'found': False}, ''
    return {'found': True, 'amount': str(out.get('amount')), 'at': str(out.get('at'))}, ''


class Watches:
    """Warm background checks, one per (amount, since): the script polls Ripio every 5 s for WATCH_SEC."""

    def __init__(self, find=run_find, clock=time.time, spawn=None):
        self.find, self.clock = find, clock
        self.spawn = spawn or (lambda fn: threading.Thread(target=fn, daemon=True).start())
        self.cv = threading.Condition()
        self.items = {}  # key -> {'res': dict|None, 'err': str, 'alive': bool, 'at': float}

    def _run(self, key):
        amount, since = key
        try:
            res, err = self.find(amount, since, WATCH_SEC)
        except (OSError, subprocess.TimeoutExpired) as e:
            res, err = None, type(e).__name__
        with self.cv:
            w = self.items[key]
            w['alive'], w['err'], w['at'] = False, err, self.clock()
            if res is not None and res.get('found'):
                w['res'] = res
            self.cv.notify_all()

    def seen(self, amount, since):
        """The deposit a watcher already saw, else None."""
        with self.cv:
            w = self.items.get((amount, since))
            return w['res'] if w and w['res'] else None

    def ask(self, amount, since, wait):
        """(result, error): found as soon as seen, {'found': False} while not, None + why when the check cannot run."""
        key = (amount, since)
        with self.cv:
            now = self.clock()
            for k in [k for k, w in self.items.items() if not w['alive'] and now - w['at'] > KEEP_WATCH]:
                del self.items[k]
            w = self.items.get(key)
            if w and w['res']:
                return w['res'], ''
            failed = w['err'] if w and not w['alive'] else ''
            if not w or not w['alive']:
                if sum(1 for x in self.items.values() if x['alive']) >= MAX_WATCHES:
                    return None, 'busy'
                w = self.items[key] = {'res': None, 'err': '', 'alive': True, 'at': now}
                self.spawn(lambda: self._run(key))
            deadline = time.monotonic() + wait
            while w['alive'] and not w['res']:
                left = deadline - time.monotonic()
                if left <= 0:
                    break
                self.cv.wait(left)
            if w['res']:
                return w['res'], ''
            # the last watcher could not check: say so (while a new one starts) rather than "not yet"
            if w['err'] or failed:
                return None, w['err'] or failed
            return {'found': False}, ''


class Bridge:
    def __init__(self, secret, find=run_find, clock=time.time, watches=None):
        self.secret, self.find, self.clock = secret, find, clock
        self.watches = watches or Watches(find, clock)
        self.inflight, self.lock = 0, threading.Lock()

    def handle(self, path, headers, raw):
        """(status, result dict). Pure apart from self.find — the tests drive it directly."""
        now = self.clock()
        if path != PATH:
            return 404, {'error': 'not_found'}
        if len(raw) > MAX_BODY:
            return 413, {'error': 'too_big'}
        why = check(self.secret, headers, raw, now)
        if why:
            return 401, {'error': why}
        q = parse(raw, now)
        if not q:
            return 400, {'error': 'bad_request'}
        amount, since, wait, mode = q
        if mode == 'watch':
            res, err = self.watches.ask(amount, since, wait)
            return (200, res) if res is not None else (502, {'error': 'check_failed', 'why': err})
        seen = self.watches.seen(amount, since)
        if seen:
            return 200, seen
        with self.lock:
            if self.inflight >= MAX_INFLIGHT:
                return 429, {'error': 'busy'}
            self.inflight += 1
        try:
            res, err = self.find(amount, since, wait)
        except (OSError, subprocess.TimeoutExpired) as e:
            res, err = None, type(e).__name__
        finally:
            with self.lock:
                self.inflight -= 1
        if res is None:
            return 502, {'error': 'check_failed', 'why': err}
        return 200, res


def serve(bridge, port):
    class H(BaseHTTPRequestHandler):
        def do_POST(self):
            t0 = time.time()
            try:
                n = int(self.headers.get('Content-Length') or 0)
            except ValueError:
                n = -1
            if n < 0 or n > MAX_BODY:
                status, res = 413, {'error': 'too_big'}
            else:
                status, res = bridge.handle(self.path, self.headers, self.rfile.read(n))
            body = json.dumps(res).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            log = {k: res.get(k) for k in ('found', 'error', 'why') if k in res}
            print(time.strftime('%Y-%m-%dT%H:%M:%S%z'), status, self.path[:40], json.dumps(log),
                  f'ms={int((time.time() - t0) * 1000)}', flush=True)

        def do_GET(self):
            self.send_response(404)
            self.send_header('Content-Length', '0')
            self.end_headers()

        def log_message(self, *a):
            pass

    srv = ThreadingHTTPServer(('127.0.0.1', port), H)
    print(time.strftime('%Y-%m-%dT%H:%M:%S%z'), f'listening 127.0.0.1:{port}', flush=True)
    srv.serve_forever()


def main():
    secret = load_secret()
    if len(secret) < 32:
        print('no HMAC secret (RIPIO_BRIDGE_OP_ITEM / opx) — refusing to start', file=sys.stderr, flush=True)
        return 78
    serve(Bridge(secret), int(os.environ.get('RIPIO_BRIDGE_PORT', '7392')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
