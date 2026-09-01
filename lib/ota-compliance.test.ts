/**
 * OTA compliance scanner tests — pins what blocks a send (direct-booking
 * solicitation, discount codes, external URLs) vs. what only warns (phones,
 * emails, which the platforms mask anyway). Runs on Node's built-in test
 * runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanOtaCompliance, isTemplateOtaSafe } from './ota-compliance.ts';

/** True when the result carries at least one violation of the given type. */
function has(result: ReturnType<typeof scanOtaCompliance>, type: string): boolean {
  return result.violations.some(v => v.type === type);
}

// ─── Clean messages ──────────────────────────────────────────────────────────

test('scanOtaCompliance: clean message is compliant with no violations', () => {
  const result = scanOtaCompliance('Hi! Check-in is at Av. Cariló 324 from 3pm. See you soon!');
  assert.equal(result.compliant, true);
  assert.equal(result.violations.length, 0);
});

test('scanOtaCompliance: short digit runs are not flagged as phone numbers', () => {
  const result = scanOtaCompliance('Your suite is number 324 on floor 2.');
  assert.equal(result.violations.length, 0);
});

test('scanOtaCompliance: platform (Airbnb/Booking) URLs are allowed', () => {
  const result = scanOtaCompliance('Details: https://www.airbnb.com/rooms/123 and https://www.booking.com/hotel/x');
  assert.equal(has(result, 'external_url'), false);
  assert.equal(result.compliant, true);
});

// ─── Direct-booking solicitation (block) ─────────────────────────────────────

test('scanOtaCompliance: Spanish direct-booking phrasing blocks', () => {
  const result = scanOtaCompliance('Si querés te paso los datos para una reserva directa.');
  assert.equal(has(result, 'direct_booking'), true);
  assert.equal(result.compliant, false);
  assert.equal(result.violations.find(v => v.type === 'direct_booking')?.severity, 'block');
});

test('scanOtaCompliance: direct-booking site URL blocks', () => {
  const result = scanOtaCompliance('Puedes ver las fechas en book.ilbuco.com.ar');
  assert.equal(has(result, 'direct_booking'), true);
});

test('scanOtaCompliance: English direct-booking phrasing blocks', () => {
  const result = scanOtaCompliance('You could book directly with us next time.');
  assert.equal(has(result, 'direct_booking'), true);
  assert.equal(result.compliant, false);
});

// ─── Discounts (block) ───────────────────────────────────────────────────────

test('scanOtaCompliance: discount code blocks', () => {
  const result = scanOtaCompliance('Usa el codigo VERANO10 para tu próxima estadía.');
  assert.equal(has(result, 'discount_offplatform'), true);
  assert.equal(result.compliant, false);
});

test('scanOtaCompliance: percentage-off blocks', () => {
  const result = scanOtaCompliance('This week you get 15% off.');
  assert.equal(has(result, 'discount_offplatform'), true);
  assert.equal(result.compliant, false);
});

test('scanOtaCompliance: VOLVER promo code blocks', () => {
  const result = scanOtaCompliance('Recuerda que tienes el código VOLVER5 disponible.');
  assert.equal(has(result, 'discount_offplatform'), true);
});

// ─── External URLs (block) ───────────────────────────────────────────────────

test('scanOtaCompliance: non-platform URL blocks', () => {
  const result = scanOtaCompliance('Mira las fotos: https://example.com/gallery');
  const v = result.violations.find(x => x.type === 'external_url');
  assert.ok(v);
  assert.equal(v.severity, 'block');
  assert.equal(v.matchedText, 'https://example.com/gallery');
  assert.equal(result.compliant, false);
});

// ─── Contact info (warn only — does not block) ───────────────────────────────

test('scanOtaCompliance: phone number warns but stays compliant', () => {
  const result = scanOtaCompliance('For anything call us at +54 9 11 5878-3996');
  const v = result.violations.find(x => x.type === 'contact_info');
  assert.ok(v);
  assert.equal(v.severity, 'warn');
  assert.ok(v.matchedText?.includes('5878-3996'));
  assert.equal(result.compliant, true);
});

test('scanOtaCompliance: email warns but stays compliant', () => {
  const result = scanOtaCompliance('You can write to host@ilbuco.com.ar anytime');
  const v = result.violations.find(x => x.type === 'contact_info');
  assert.ok(v);
  assert.equal(v.severity, 'warn');
  assert.equal(result.compliant, true);
});

// ─── Repeat off-platform language (block) ────────────────────────────────────

test('scanOtaCompliance: inviting a repeat direct booking blocks', () => {
  const result = scanOtaCompliance('La próxima puedes volver a reservar direct con nosotros.');
  assert.equal(has(result, 'repeat_offplatform'), true);
  assert.equal(result.compliant, false);
});

// ─── Template-level helper ───────────────────────────────────────────────────

test('isTemplateOtaSafe: true for a safe template, false for a violating one', () => {
  assert.equal(isTemplateOtaSafe('Hola {{nombre}}, tu suite está lista.'), true);
  assert.equal(isTemplateOtaSafe('Escríbenos por WhatsApp para una reserva directa.'), false);
});
