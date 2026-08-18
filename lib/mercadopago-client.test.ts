/**
 * MP webhook signature verification tests. Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'crypto';
import { verifyWebhookSignature } from './mercadopago-client.ts';

function sign(dataId: string, requestId: string, ts: string, secret: string): string {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = createHmac('sha256', secret).update(manifest).digest('hex');
  return `ts=${ts},v1=${hash}`;
}

test('verifyWebhookSignature: accepts a correctly signed notification', () => {
  const secret = 'test-secret';
  const xSignature = sign('123456', 'req-1', '1700000000', secret);
  assert.equal(verifyWebhookSignature('123456', xSignature, 'req-1', secret), true);
});

test('verifyWebhookSignature: rejects a tampered data id', () => {
  const secret = 'test-secret';
  const xSignature = sign('123456', 'req-1', '1700000000', secret);
  assert.equal(verifyWebhookSignature('999999', xSignature, 'req-1', secret), false);
});

test('verifyWebhookSignature: rejects a mismatched secret', () => {
  const xSignature = sign('123456', 'req-1', '1700000000', 'right-secret');
  assert.equal(verifyWebhookSignature('123456', xSignature, 'req-1', 'wrong-secret'), false);
});

test('verifyWebhookSignature: rejects missing/malformed header', () => {
  assert.equal(verifyWebhookSignature('123456', '', 'req-1', 'secret'), false);
  assert.equal(verifyWebhookSignature('123456', 'ts=1700000000', 'req-1', 'secret'), false);
});

test('verifyWebhookSignature: rejects when secret is empty', () => {
  const xSignature = sign('123456', 'req-1', '1700000000', 'a-secret');
  assert.equal(verifyWebhookSignature('123456', xSignature, 'req-1', ''), false);
});
