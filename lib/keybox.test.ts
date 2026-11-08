import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyBoxCodeFor, buildPinText, buildPinEmail } from './messaging';

const RAW = JSON.stringify({ Giardino: '1111', Paraíso: '2222', Penthouse: 3333 });

test('key box code matches unit name ignoring case and accents', () => {
  assert.equal(keyBoxCodeFor('Paraiso', RAW), '2222');
  assert.equal(keyBoxCodeFor('giardino', RAW), '1111');
  assert.equal(keyBoxCodeFor('Penthouse', RAW), '3333');
});

test('no code without env, with bad JSON or unknown unit', () => {
  assert.equal(keyBoxCodeFor('Giardino', undefined), undefined);
  assert.equal(keyBoxCodeFor('Giardino', '{bad'), undefined);
  assert.equal(keyBoxCodeFor('Il Buco entero', RAW), undefined);
});

test('check-in text carries the key box code only when present', () => {
  const base = { guestName: 'Ana', pin: 4821, propertyName: 'Giardino', checkIn: '2026-11-06', checkOut: '2026-11-08' };
  assert.ok(!buildPinText(base).includes('Caja de llaves'));
  const t = buildPinText({ ...base, keyBoxCode: '1111' });
  assert.ok(t.includes('Caja de llaves (Giardino): *1111*'));
  assert.ok(t.includes('Tu código de puerta: *4821*'));
});

test('door code message says how to enter it: panel, code, ↵, video', () => {
  const base = { guestName: 'Ana', pin: 4821, propertyName: 'Giardino', checkIn: '2026-11-08T15:00:00Z', checkOut: '2026-11-10T15:00:00Z' };
  const t = buildPinText(base);
  assert.ok(t.includes('marcá *4821* y apretá ↵'));
  assert.ok(t.includes('type *4821* and press ↵'));
  assert.ok(t.includes('youtube.com/shorts/pNSzziDel-w'));
  const { html } = buildPinEmail(base);
  assert.ok(html.includes('apretá <b>↵</b>'));
  assert.ok(html.includes('pNSzziDel-w'));
});
