#!/usr/bin/env python3
"""Relay: Hostex guest message (via ilbuco.com.ar webhook) -> instant wake of the hub session noe.

Vercel cannot reach the tailnet, so the webhook (lib/hub-wake.ts) POSTs here through the
Cloudflare tunnel. This server listens on 127.0.0.1 only and accepts one thing:
POST /hostex-wake with an HMAC-SHA256 signature over "<ts>.<body>" (key from 1Password),
timestamp within 5 minutes. It then runs `hub agent-send noe … --as hostex-webhook
--id hostex-<message id>` — the hub drops a repeated id, and so does this process.
It cannot do anything else with the hub: the text is built here from fixed words.

The same path also carries voice-agent notices ({"type": "voice_notice", …}, lib/hub-wake.ts
notifyVoice): a caller who wants Ivan, a phone hold that expired unpaid, a paid booking. They go
to noe, and the payment ones to agent-payments too; the text is again built here from checked
fields (name, phone, dates, amount, hold id), de-duplicated by `voice-<id>`. The Cloudflare
tunnel host only forwards /hostex-wake, so the notices share it.

Env: HUB_WAKE_PORT (7391), HUB_WAKE_OP_ITEM (1Password item id, vault AI, field password)
or HUB_WAKE_SECRET (tests only), HUB_WAKE_HUB (hub binary), HUB_WAKE_TO (noe),
HUB_WAKE_AGENT_URL + HUB_WAKE_AGENT_KEY_FILE (urgent delivery, see AGENT_URL below).
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
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PATH = '/hostex-wake'
MAX_BODY = 16 * 1024
SKEW = 300
SEEN_TTL = 24 * 3600
ID_RE = re.compile(r'^[A-Za-z0-9_.:\-]{1,128}$')
HUB = os.environ.get('HUB_WAKE_HUB', '/Users/ivan/agents-hub-main/bin/hub')
TO = os.environ.get('HUB_WAKE_TO', 'noe')
# Urgent path (hub module hubbahub-agent-send 0.4.0 + core right message.rush): POST /api/send/agent with now:true,
# signed with the agent's key file (the same file the module reads, 0600). Both unset -> the CLI path (no --now).
AGENT_URL = os.environ.get('HUB_WAKE_AGENT_URL', '')
AGENT_KEY_FILE = os.environ.get('HUB_WAKE_AGENT_KEY_FILE', '')
AGENT = 'hostex-webhook'
UNANSWERED = '~/.claude/artifacts/comms/scripts/hostex_unanswered.py'
PAYMENTS = 'agent-payments'
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
PHONE_RE = re.compile(r'^\+?[0-9 ]{6,20}$')
# kind -> (recipients, what happened, what to do). Payment kinds also reach agent-payments.
VOICE_KINDS = {
    'callback': ((TO,), 'Звонивший на Il Buco просит связаться',
                 'Бот сказал «le paso tu número a Iván y te escribe». Ответь гостю от имени Ивана или поставь Ивану пункт.'),
    'hold_expired': ((TO, PAYMENTS), 'Удержание по телефону снято через 10 минут: перевод на точную сумму не найден',
                     'Бот сказал гостю «lo reviso y te escribo». agent-payments: проверь Ripio — могла прийти другая сумма; '
                     'noe: напиши гостю.'),
    'payment_unverified': ((TO, PAYMENTS), 'Бот не смог проверить перевод (мост Ripio не ответил)',
                           'Бот сказал «apenas lo vea te confirmo por WhatsApp». Проверь поступление и подтверди гостю.'),
    'paid': ((TO, PAYMENTS), 'Бронь по телефону оплачена и создана в Hostex', 'Ничего делать не нужно, только сверка.'),
    'paid_unbooked': ((TO, PAYMENTS), 'Перевод пришёл, но бронь в Hostex не создалась — даты пока закрыты удержанием',
                      'Создай бронь вручную в Hostex (Booking Site) на эти даты и подтверди гостю.'),
    'release_failed': ((TO,), 'Удержание по телефону не снялось — даты остаются закрытыми',
                       'Открой эти даты в Hostex вручную, если там нет брони.'),
    # Website, not the phone agent: a guest paid a late checkout through the room's QR (lib/late-checkout.ts).
    'late_checkout': ((TO,), 'Гость оплатил поздний выезд на сайте (QR в комнате)',
                      'Передай Мелоди: комната, день и до какого часа гость остаётся — уборку этой комнаты '
                      'начать после этого часа. Гостю ничего писать не нужно, сайт уже подтвердил ему.'),
}
SOURCE = {'late_checkout': 'Сайт Il Buco'}


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


def is_voice(raw):
    try:
        d = json.loads(raw)
    except ValueError:
        return False
    return isinstance(d, dict) and d.get('type') == 'voice_notice'


def parse_voice(raw):
    """Voice-notice fields, or None. Every field is checked or cut here — the text is built from them."""
    try:
        d = json.loads(raw)
    except ValueError:
        return None
    if not isinstance(d, dict) or d.get('type') != 'voice_notice' or d.get('kind') not in VOICE_KINDS:
        return None
    nid = str(d.get('id') or '')
    if not ID_RE.match(nid):
        return None
    clean = lambda v, n: ' '.join(str(v or '').split())[:n]
    phone = clean(d.get('phone'), 24)
    v = {'id': nid, 'kind': d['kind'], 'name': clean(d.get('name'), 80), 'phone': phone if PHONE_RE.match(phone) else '',
         'unit': clean(d.get('unit'), 40), 'reason': clean(d.get('reason'), 500), 'hold_id': '', 'reservation': '',
         'check_in': '', 'check_out': '', 'amount': None, 'call_id': '', 'test': d.get('test') is True}
    for k in ('hold_id', 'reservation', 'call_id'):
        x = str(d.get(k) or '')
        v[k] = x if ID_RE.match(x) else ''
    for k in ('check_in', 'check_out'):
        x = str(d.get(k) or '')
        v[k] = x if DATE_RE.match(x) else ''
    a = d.get('amount')
    v['amount'] = a if isinstance(a, int) and not isinstance(a, bool) and 0 < a < 10**9 else None
    return v


def voice_text(v):
    _, what, todo = VOICE_KINDS[v['kind']]
    source = SOURCE.get(v['kind'], 'Голосовой агент Il Buco')
    if v['test']:
        return (f"[ТЕСТ: {source}] {what}. Это проверка канала: гостю и Ивану не пиши, Hostex не трогай, "
                f"ответь «—». (id {v['id']})")
    facts = []
    if v['name'] or v['phone']:
        facts.append(f"кто: {v['name'] or 'имя не назвал'}, {v['phone'] or 'номер не известен'}")
    if v['unit']:
        facts.append(f"что: {v['unit']}")
    if v['check_in'] and v['check_out']:
        facts.append(f"даты: {v['check_in']} → {v['check_out']}")
    if v['amount']:
        facts.append(f"сумма: {v['amount']:,} ARS".replace(',', ' '))
    if v['hold_id']:
        facts.append(f"hold {v['hold_id']}")
    if v['reservation']:
        facts.append(f"бронь Hostex {v['reservation']}")
    if v['reason']:
        facts.append(f"суть: «{v['reason']}»")
    if v['call_id']:
        facts.append(f"звонок Vapi {v['call_id']}")
    return f"{source}: {what}. " + '; '.join(facts) + f".\n{todo}"


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
        self.run = run or (self._agent_post if AGENT_URL and AGENT_KEY_FILE else self._agent_send)
        self.seen, self.inflight, self.lock = {}, set(), threading.Lock()

    @staticmethod
    def _agent_send(text, cid, to=TO):
        env = {k: v for k, v in os.environ.items() if k not in ('HUB_SESSION', 'HUB_TREE')}
        p = subprocess.run([HUB, 'agent-send', to, text, '--as', 'hostex-webhook', '--id', cid],
                           capture_output=True, text=True, timeout=20, env=env)
        return p.returncode, (p.stdout + p.stderr).strip()[-200:]

    @staticmethod
    def _agent_post(text, cid, to=TO, url=None, key_file=None, opener=urllib.request.urlopen, clock=time.time):
        """Urgent delivery: the hub types it into the session mid-turn. -> (0, '') on 202, else (code, reason)."""
        key = Path(key_file or AGENT_KEY_FILE).expanduser().read_bytes().strip()
        raw = json.dumps({'agent': AGENT, 'to': to, 'text': text, 'client_id': cid, 'now': True},
                         ensure_ascii=False).encode()
        ts = str(int(clock()))
        sig = hmac.new(key, ts.encode() + b'.' + raw, hashlib.sha256).hexdigest()
        req = urllib.request.Request(url or AGENT_URL, raw, method='POST', headers={
            'Content-Type': 'application/json', 'X-Hub': '1', 'X-Agent-Timestamp': ts, 'X-Agent-Signature': sig})
        try:
            with opener(req, timeout=10) as r:
                return (0, '') if r.status == 202 else (r.status, r.read(200).decode('utf-8', 'replace'))
        except urllib.error.HTTPError as e:
            return e.code, e.read(200).decode('utf-8', 'replace')
        except OSError as e:
            return 1, f'{type(e).__name__}'

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
        if is_voice(raw):
            return self.handle_voice(raw, now)
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

    def handle_voice(self, raw, now):
        v = parse_voice(raw)
        if not v:
            return 400, {'error': 'bad_payload'}
        key = f"voice-{v['id']}"
        with self.lock:
            if key in self.seen or key in self.inflight:
                return 200, {'ok': True, 'duplicate': True, 'message_id': key, 'test': v['test']}
            self.inflight.add(key)
        text, failed = voice_text(v), []
        recipients = (TO,) if v['test'] else VOICE_KINDS[v['kind']][0]
        for to in recipients:
            try:
                code, out = self.run(text, f'{key}-{to}', to)
            except (OSError, subprocess.TimeoutExpired) as e:
                code, out = -1, str(e)[:200]
            if code != 0:
                failed.append((to, code, out))
        with self.lock:
            self.inflight.discard(key)
            if not failed:
                self.seen[key] = now
        if failed:
            to, code, out = failed[0]
            return 502, {'error': 'hub_failed', 'code': code, 'out': out, 'message_id': key, 'to': to}
        return 200, {'ok': True, 'message_id': key, 'test': v['test'], 'to': list(recipients)}


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
