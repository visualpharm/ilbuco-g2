import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { buildWake, signWake, wakeHub } from './hub-wake.ts';

const guestEvent = (over: Record<string, unknown> = {}, msg: Record<string, unknown> = {}) => ({
  event: 'message_created',
  data: {
    conversation_id: 'conv-1',
    guest: { name: 'Ana' },
    message: { id: 'm-1', sender_role: 'guest', sender_name: 'Ana', content: 'El código no funciona', ...msg },
  },
  ...over,
});

test('guest message builds a wake with ids and text', () => {
  assert.deepEqual(buildWake(guestEvent()), {
    message_id: 'm-1', conversation_id: 'conv-1', guest: 'Ana', text: 'El código no funciona', test: false,
  });
});

test('host, bot and non-message events do not wake', () => {
  assert.equal(buildWake(guestEvent({}, { sender_role: 'host' })), null);
  assert.equal(buildWake(guestEvent({}, { sender_name: 'Bot: Check-in' })), null);
  assert.equal(buildWake(guestEvent({ event: 'reservation_created' })), null);
  assert.equal(buildWake({ event: 'message_created', data: { message: { id: 'x', sender_role: 'guest' } } }), null);
  assert.equal(buildWake(guestEvent({}, { id: '' })), null);
});

test('test flag passes through only when literally true', () => {
  assert.equal(buildWake(guestEvent({ test: true }))?.test, true);
  assert.equal(buildWake(guestEvent({ test: 'yes' }))?.test, false);
});

test('long text is cut', () => {
  assert.equal(buildWake(guestEvent({}, { content: 'a'.repeat(5000) }))?.text.length, 1500);
});

test('signature is HMAC-SHA256 over "ts.body" and sent with the body', async () => {
  let seen: { url: string; init: RequestInit } | null = null;
  const fake = (async (url: string, init: RequestInit) => { seen = { url, init }; return new Response('{}', { status: 200 }); }) as unknown as typeof fetch;
  const p = buildWake(guestEvent())!;
  const r = await wakeHub(p, { url: 'https://relay.test/hostex-wake', secret: 's3', fetchImpl: fake, now: () => 1_700_000_000_000 });
  assert.equal(r.ok, true);
  const h = seen!.init.headers as Record<string, string>;
  assert.equal(h['X-Hub-Wake-Timestamp'], '1700000000');
  const expected = createHmac('sha256', 's3').update(`1700000000.${seen!.init.body}`).digest('hex');
  assert.equal(h['X-Hub-Wake-Signature'], expected);
  assert.equal(signWake('s3', 1700000000, String(seen!.init.body)), expected);
});

test('not configured or failing relay never throws', async () => {
  const p = buildWake(guestEvent())!;
  assert.deepEqual(await wakeHub(p, { url: '', secret: '' }), { ok: false, error: 'not_configured' });
  const boom = (async () => { throw new Error('down'); }) as unknown as typeof fetch;
  const r = await wakeHub(p, { url: 'https://x', secret: 's', fetchImpl: boom });
  assert.equal(r.ok, false);
});

test('slow relay is aborted by the timeout', async () => {
  const slow = ((_u: string, init: RequestInit) => new Promise((_, rej) => {
    init.signal!.addEventListener('abort', () => rej(new Error('aborted')));
  })) as unknown as typeof fetch;
  const t0 = Date.now();
  const r = await wakeHub(buildWake(guestEvent())!, { url: 'https://x', secret: 's', fetchImpl: slow, timeoutMs: 50 });
  assert.equal(r.ok, false);
  assert.ok(Date.now() - t0 < 1000);
});
