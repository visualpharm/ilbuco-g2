/**
 * Guest lock users: the readable "Guest DD-MM Unit" name, matching by stored id,
 * and sync_status — a code only in the U-tec cloud (0) is not on the door yet.
 * Lara Desmaras' code sat at sync_status 0 on 2026-11-07 while the server
 * reported it synced and sent it to her.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  guestLockName, isGuestLockName, parseSyncStatus, isOnLock, findOwnLockUser, LOCK_NAME_MAX,
} from './lock-users.ts';

test('guestLockName: guest, check-in day-month, unit', () => {
  assert.equal(guestLockName('Bruno Sergio', '2026-11-07T12:00:00-03:00', 'Penthouse'), 'Bruno Sergio 07-11 Penthouse');
  assert.equal(guestLockName('Silvia Krauel', '2026-11-20T12:00:00-03:00', 'Giardino'), 'Silvia Krauel 20-11 Giardino');
});

test('guestLockName: one-case names are capitalised, mixed case is kept', () => {
  assert.equal(guestLockName('maria laura salar', '2026-11-28T12:00:00-03:00', 'Il Buco (Whole House)'), 'Maria Laura Salar 28-11 Casa');
  assert.equal(guestLockName('CECILIA OSTUNI', '2026-11-08T12:00:00-03:00', 'Giardino'), 'Cecilia Ostuni 08-11 Giardino');
  assert.equal(guestLockName('quillen fariña espinosa', '2026-11-06T12:00:00-03:00', 'Giardino'), 'Quillen Fariña Espinosa 06-11 Giardino');
  assert.equal(guestLockName('Juan McDonald', '2026-12-01T12:00:00-03:00', 'Terrazzo'), 'Juan McDonald 01-12 Terrazzo');
});

test('guestLockName: the date is the Argentina calendar day', () => {
  // 02:00 UTC on the 7th is 23:00 on the 6th in Argentina.
  assert.equal(guestLockName('Ana', '2026-11-07T02:00:00Z', 'Paraiso'), 'Ana 06-11 Paraiso');
});

test('guestLockName: long names shrink, the date and unit stay', () => {
  const name = guestLockName('Maria de los Angeles Fernandez Etchegaray Bustamante', '2026-01-03T12:00:00-03:00', 'Penthouse');
  assert.ok(name.length <= LOCK_NAME_MAX, name);
  assert.ok(name.endsWith(' 03-01 Penthouse'), name);
  assert.ok(name.startsWith('Maria '), name);
  const one = guestLockName('Bartholomew-Alexandervonhohenzollern', '2026-01-03T12:00:00-03:00', 'Penthouse', 30);
  assert.ok(one.length <= 30, one);
  assert.ok(one.endsWith(' 03-01 Penthouse'), one);
});

test('guestLockName: emoji and symbols from OTA profiles are dropped', () => {
  assert.equal(guestLockName('Lara 🌸 Desmaras!', '2026-11-07T12:00:00-03:00', 'Terrazzo'), 'Lara Desmaras 07-11 Terrazzo');
});

test('isGuestLockName: our names yes, names typed in the app no', () => {
  for (const n of ['Bruno Sergio 07-11 Penthouse', 'Maria Laura Salar 28-11 Casa', '24-MV2EMNQG-ihxk53n5gc', '5-6AHHVU3CU']) {
    assert.equal(isGuestLockName(n), true, n);
  }
  for (const n of ['Mantenimiento 09-11', 'Jennifer', 'Andresduffau@gmail.com', 'Ivan Boyko', 'Limpieza 2']) {
    assert.equal(isGuestLockName(n), false, n);
  }
});

test('parseSyncStatus: 0 survives (it used to become undefined = "fine")', () => {
  assert.equal(parseSyncStatus(0), 0);
  assert.equal(parseSyncStatus('0'), 0);
  assert.equal(parseSyncStatus(1), 1);
  assert.equal(parseSyncStatus(undefined), undefined);
  assert.equal(parseSyncStatus(null), undefined);
});

test('isOnLock: only an explicit 0 holds a code back', () => {
  assert.equal(isOnLock({ id: '1', name: 'x', sync_status: 0 }), false);
  assert.equal(isOnLock({ id: '1', name: 'x', sync_status: 1 }), true);
  assert.equal(isOnLock({ id: '1', name: 'x' }), true);
});

test('findOwnLockUser: stored id first, then the new name, then the legacy reservation code', () => {
  const users = [
    { id: '10', name: 'Silvia Krauel 20-11 Giardino', sync_status: 1 },
    { id: '11', name: 'Silvia Krauel 20-11 Giardino', sync_status: 1 },
    { id: '12', name: '9-5800932542-iio8bsglgk', sync_status: 0 },
  ];
  const ref = { expectedName: 'Silvia Krauel 20-11 Giardino', reservationCode: 'R1' };
  assert.equal(findOwnLockUser(users, { ...ref, lockUserId: '11' })?.id, '11');
  // Same guest, same unit, same day, two bookings: never adopt the other booking's user.
  assert.equal(findOwnLockUser(users, { ...ref, takenIds: new Set(['10']) })?.id, '11');
  assert.equal(findOwnLockUser(users, { ...ref, takenIds: new Set(['10', '11']) }), undefined);
  assert.equal(findOwnLockUser(users, { expectedName: 'Bruno Sergio 07-11 Penthouse', reservationCode: '9-5800932542-iio8bsglgk' })?.id, '12');
  // A stored id that is gone from the lock falls back to the name.
  assert.equal(findOwnLockUser(users, { ...ref, lockUserId: '99' })?.id, '10');
});
