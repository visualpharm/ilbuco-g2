/**
 * Direct-booking activation gate tests. Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDirectBookingEnabled, hostexBookingUrlFor } from './direct-booking.ts';

test('direct booking is disabled while the webhook secret is absent', () => {
  const saved = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  try {
    assert.equal(isDirectBookingEnabled(), false);
  } finally {
    if (saved !== undefined) process.env.MERCADO_PAGO_WEBHOOK_SECRET = saved;
  }
});

test('direct booking activates once the webhook secret is configured', () => {
  const saved = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  process.env.MERCADO_PAGO_WEBHOOK_SECRET = 'test-secret';
  try {
    assert.equal(isDirectBookingEnabled(), true);
  } finally {
    if (saved === undefined) delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    else process.env.MERCADO_PAGO_WEBHOOK_SECRET = saved;
  }
});

test('hostex fallback maps known suites to their listings', () => {
  assert.equal(hostexBookingUrlFor('giardino'), 'https://book.ilbuco.com.ar/listing/110800');
  assert.equal(hostexBookingUrlFor('terrazzo'), 'https://book.ilbuco.com.ar/listing/110801');
  assert.equal(hostexBookingUrlFor('paraiso'), 'https://book.ilbuco.com.ar/listing/110802');
  assert.equal(hostexBookingUrlFor('penthouse'), 'https://book.ilbuco.com.ar/listing/110803');
});

test('hostex fallback falls back home for unknown or absent suites', () => {
  assert.equal(hostexBookingUrlFor(), 'https://book.ilbuco.com.ar/');
  assert.equal(hostexBookingUrlFor('nope'), 'https://book.ilbuco.com.ar/');
  assert.equal(hostexBookingUrlFor('whole-house'), 'https://book.ilbuco.com.ar/');
});
