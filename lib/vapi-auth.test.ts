/**
 * Vapi webhook auth + SSRF guard tests — pins the shared-secret gate and the
 * controlUrl allowlist (only Vapi's own https hosts may ever be fetched).
 * Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyVapiWebhookSecret,
  isAllowedVapiControlUrl,
  VAPI_WEBHOOK_SECRET_HEADER,
} from './vapi-auth.ts';

const SECRET = 'vapi-webhook-secret-1';

/** Run fn with VAPI_WEBHOOK_SECRET forced to value, restoring the original after. */
function withSecret(value: string | undefined, fn: () => void): void {
  const saved = process.env.VAPI_WEBHOOK_SECRET;
  if (value === undefined) delete process.env.VAPI_WEBHOOK_SECRET;
  else process.env.VAPI_WEBHOOK_SECRET = value;
  try {
    fn();
  } finally {
    if (saved === undefined) delete process.env.VAPI_WEBHOOK_SECRET;
    else process.env.VAPI_WEBHOOK_SECRET = saved;
  }
}

// ─── Header name ─────────────────────────────────────────────────────────────

test('VAPI_WEBHOOK_SECRET_HEADER is the documented custom header', () => {
  assert.equal(VAPI_WEBHOOK_SECRET_HEADER, 'x-vapi-webhook-secret');
});

// ─── Secret verification (fail closed) ───────────────────────────────────────

test('verifyVapiWebhookSecret: fails closed when VAPI_WEBHOOK_SECRET is not configured', () => {
  withSecret(undefined, () => {
    assert.equal(verifyVapiWebhookSecret(SECRET), false);
  });
});

test('verifyVapiWebhookSecret: rejects a missing candidate', () => {
  withSecret(SECRET, () => {
    assert.equal(verifyVapiWebhookSecret(null), false);
    assert.equal(verifyVapiWebhookSecret(undefined), false);
    assert.equal(verifyVapiWebhookSecret(''), false);
  });
});

test('verifyVapiWebhookSecret: accepts the correct secret, rejects wrong ones', () => {
  withSecret(SECRET, () => {
    assert.equal(verifyVapiWebhookSecret(SECRET), true);
    assert.equal(verifyVapiWebhookSecret('vapi-webhook-secret-2'), false);
    assert.equal(verifyVapiWebhookSecret('short'), false);
  });
});

// ─── controlUrl SSRF allowlist ───────────────────────────────────────────────

test('isAllowedVapiControlUrl: allows Vapi https hosts', () => {
  assert.equal(isAllowedVapiControlUrl('https://vapi.ai/api/call'), true);
  assert.equal(isAllowedVapiControlUrl('https://api.vapi.ai/public/call'), true);
});

test('isAllowedVapiControlUrl: rejects non-https protocols', () => {
  assert.equal(isAllowedVapiControlUrl('http://vapi.ai/api/call'), false);
});

test('isAllowedVapiControlUrl: rejects other hosts', () => {
  assert.equal(isAllowedVapiControlUrl('https://api.openai.com/v1'), false);
  assert.equal(isAllowedVapiControlUrl('https://localhost:8080/debug'), false);
});

test('isAllowedVapiControlUrl: rejects lookalike hosts that merely contain vapi.ai', () => {
  assert.equal(isAllowedVapiControlUrl('https://vapi.ai.evil.com/api'), false);
  assert.equal(isAllowedVapiControlUrl('https://evilvapi.ai/api'), false);
  assert.equal(isAllowedVapiControlUrl('https://notvapi.ai.attacker.io'), false);
});

test('isAllowedVapiControlUrl: rejects unparseable input', () => {
  assert.equal(isAllowedVapiControlUrl(''), false);
  assert.equal(isAllowedVapiControlUrl('not a url'), false);
});
