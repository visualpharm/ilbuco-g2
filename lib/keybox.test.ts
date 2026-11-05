import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyBoxCodeFor, buildPinText } from './messaging';

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
