#!/usr/bin/env python3
"""Relay: Hostex guest message (via ilbuco.com.ar webhook) -> instant wake of the hub session noe.

Vercel cannot reach the tailnet, so the webhook (lib/hub-wake.ts) POSTs here through the
Cloudflare tunnel. This server listens on 127.0.0.1 only and accepts one thing:
POST /hostex-wake with an HMAC-SHA256 signature over "<ts>.<body>" (key from 1Password),
timestamp within 5 minutes. It then runs `hub agent-send noe … --as hostex-webhook
--id hostex-<message id>` — the hub drops a repeated id, and so does this process.
It cannot do anything else with the hub: the text is built here from fixed words.

Env: HUB_WAKE_PORT (7391), HUB_WAKE_OP_ITEM (1Password item id, vault AI, field password)
or HUB_WAKE_SECRET (tests only), HUB_WAKE_HUB (hub binary), HUB_WAKE_TO (noe).
Log: one line per request on stdout (LaunchAgent -> ~/Library/Logs/hub-wake-relay.log);
no guest text in the log.
"""
import hashlib
import hmac
import json
import os
import re
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PATH = '/hostex-wake'
MAX_BODY = 16 * 1024
SKEW = 300
SEEN_TTL = 24 * 3600
ID_RE = re.compile(r'^[A-Za-z0-9_.:\-]{1,128}$')
HUB = os.environ.get('HUB_WAKE_HUB', '/Users/ivan/agents-hub-main/bin/hub')
TO = os.environ.get('HUB_WAKE_TO', 'noe')
UNANSWERED = '~/.claude/artifacts/comms/scripts/hostex_unanswered.py'


def load_secret():
    s = os.environ.get('HUB_WAKE_SECRET', '')
    if s:
        return s
    item = os.environ.get('HUB_WAKE_OP_ITEM', '')
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
    ts = headers.get('X-Hub-Wake-Timestamp', '')
    sig = headers.get('X-Hub-Wake-Signature', '')
    if not ts.isdigit() or not sig:
        return 'unsigned'
    if abs(now - int(ts)) > SKEW:
        return 'stale'
    if not hmac.compare_digest(sign(secret, ts, raw), sig):
        return 'bad_signature'
    return ''


def parse(raw):
    """The wake fields, or None when the payload is not a usable guest message."""
    try:
        d = json.loads(raw)
    except ValueError:
        return None
    if not isinstance(d, dict):
        return None
    mid, conv = str(d.get('message_id') or ''), str(d.get('conversation_id') or '')
    if not ID_RE.match(mid) or not ID_RE.match(conv):
        return None
    clean = lambda v, n: ' '.join(str(v or '').split())[:n]
    return {'message_id': mid, 'conversation_id': conv, 'guest': clean(d.get('guest'), 80),
            'text': clean(d.get('text'), 1500), 'test': d.get('test') is True}


def wake_text(w):
    where = f"разговор {w['conversation_id']}, сообщение {w['message_id']}"
    if w['test']:
        return (f"[ТЕСТ вебхука Hostex] Поддельное событие для проверки мгновенного подъёма: гостю, Мелоди и "
                f"никому не пиши, Hostex не трогай, ничего не делай — ответь «—». ({where})")
    who = f"гость {w['guest']}, " if w['guest'] else ''
    return (f"Гость Il Buco только что написал в Hostex ({who}{where}): «{w['text']}»\n"
            f"Мгновенный вызов от вебхука Hostex — сделай сейчас то же, что расписание noe-hostex-guests, "
            f"не дожидаясь опроса: `python3 -I {UNANSWERED} --list`, ответь через Hostex; срочное "
            f"(код/вход, вода/свет/газ, ранний заезд или поздний выезд) — первым делом. "
            f"Уже ответил по сути — ничего не делай.")


class Relay:
    def __init__(self, secret, run=None, clock=time.time):
        self.secret, self.clock = secret, clock
        self.run = run or self._agent_send
        self.seen, self.inflight, self.lock = {}, set(), threading.Lock()

    @staticmethod
    def _agent_send(text, cid):
        env = {k: v for k, v in os.environ.items() if k not in ('HUB_SESSION', 'HUB_TREE')}
        p = subprocess.run([HUB, 'agent-send', TO, text, '--as', 'hostex-webhook', '--id', cid],
                           capture_output=True, text=True, timeout=20, env=env)
        return p.returncode, (p.stdout + p.stderr).strip()[-200:]

    def handle(self, path, headers, raw):
        """(status, result dict). Pure apart from self.run — the tests drive it directly."""
        now = self.clock()
        if path != PATH:
            return 404, {'error': 'not_found'}
        if len(raw) > MAX_BODY:
            return 413, {'error': 'too_big'}
        why = check(self.secret, headers, raw, now)
        if why:
            return 401, {'error': why}
        w = parse(raw)
        if not w:
            return 400, {'error': 'bad_payload'}
        mid = w['message_id']
        with self.lock:
            for k in [k for k, t in self.seen.items() if now - t > SEEN_TTL]:
                del self.seen[k]
            if mid in self.seen or mid in self.inflight:
                return 200, {'ok': True, 'duplicate': True, 'message_id': mid, 'test': w['test']}
            self.inflight.add(mid)
        try:
            code, out = self.run(wake_text(w), f'hostex-{mid}')
        except (OSError, subprocess.TimeoutExpired) as e:
            code, out = -1, str(e)[:200]
        with self.lock:
            self.inflight.discard(mid)
            if code == 0:
                self.seen[mid] = now
        if code != 0:
            return 502, {'error': 'hub_failed', 'code': code, 'out': out, 'message_id': mid}
        return 200, {'ok': True, 'message_id': mid, 'test': w['test'], 'hub': out[-80:]}


def serve(relay, port):
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
                status, res = relay.handle(self.path, self.headers, self.rfile.read(n))
            body = json.dumps(res).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            log = {k: res.get(k) for k in ('message_id', 'test', 'duplicate', 'error', 'code') if k in res}
            print(time.strftime('%Y-%m-%dT%H:%M:%S%z'), status, self.path[:40], json.dumps(log),
                  f'ms={int((time.time() - t0) * 1000)}', flush=True)

        def do_GET(self):
            self.send_response(404 if self.path != '/health' else 200)
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
        print('no HMAC secret (HUB_WAKE_OP_ITEM / opx) — refusing to start', file=sys.stderr, flush=True)
        return 78
    serve(Relay(secret), int(os.environ.get('HUB_WAKE_PORT', '7391')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
