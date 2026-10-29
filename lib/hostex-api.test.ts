import test from 'node:test';
import assert from 'node:assert/strict';
import { hostexFetch, hostexBlockedFor, HostexRateLimitError, retryAfterSeconds, HOSTEX_USER_AGENT } from './hostex-api';

test('retryAfterSeconds: header, default and cap', () => {
  assert.equal(retryAfterSeconds('1498'), 1498);
  assert.equal(retryAfterSeconds(null), 60);
  assert.equal(retryAfterSeconds('junk'), 60);
  assert.equal(retryAfterSeconds('99999'), 3600);
});

test('hostexFetch: sends User-Agent, pauses after a 429 envelope', async () => {
  const realFetch = globalThis.fetch;
  let calls = 0;
  let ua: string | null = null;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    calls++;
    ua = new Headers(init.headers).get('User-Agent');
    return new Response(JSON.stringify({ error_code: 429, error_msg: 'Too Many Attempts.' }), {
      status: 200,
      headers: { 'retry-after': '120' },
    });
  }) as typeof fetch;
  try {
    const res = await hostexFetch('https://api.hostex.io/v3/properties');
    assert.equal((await res.json()).error_code, 429);
    assert.equal(ua, HOSTEX_USER_AGENT);
    assert.ok(hostexBlockedFor() > 100);
    await assert.rejects(hostexFetch('https://api.hostex.io/v3/properties'), HostexRateLimitError);
    assert.equal(calls, 1, 'second call must not reach Hostex');
  } finally {
    globalThis.fetch = realFetch;
  }
});
