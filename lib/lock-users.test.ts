/**
 * Guest lock users: the readable "Guest DD-MM Unit" name, matching by stored id,
 * and sync_status — a code only in the U-tec cloud (0) is not on the door yet.
 * Lara Desmaras' code sat at sync_status 0 on 2026-11-07 while the server
 * reported it synced and sent it to her.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  guestLockName, isGuestLockName, parseSyncStatus, isOnLock, findOwnLockUser, lockUserVerdict, LOCK_NAME_MAX,
  manualLockAction, MANUAL_SETTLE_MIN, doorStateOf,
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

test('lockUserVerdict: an old name on a working code is only a rename, never "not on the lock"', () => {
  // 2026-11-07: renaming Cecilia Ostuni's code (sync 1) waited 30 s for the lock, timed out,
  // demoted her to retrying and sent a false "lock is not accepting the code" alert.
  const name = 'Cecilia Ostuni 08-11 Giardino';
  assert.equal(lockUserVerdict({ id: '1', name, sync_status: 1 }, name), 'ok');
  assert.equal(lockUserVerdict({ id: '1', name: '9-6575276122-iipd7wpzgl', sync_status: 1 }, name), 'rename');
  assert.equal(lockUserVerdict({ id: '1', name, sync_status: 0 }, name), 'push');
  assert.equal(lockUserVerdict({ id: '1', name: 'old', sync_status: 0 }, name), 'push');
  assert.equal(lockUserVerdict(undefined, name), 'missing');
});

test('opensIlBucoDoor: the suites and the whole house, not Recharge Retreat', async () => {
  const { opensIlBucoDoor } = await import('./lock-users.ts');
  for (const id of ['12282945', '12282946', '12282947', '12282948', '12299611']) assert.equal(opensIlBucoDoor(id), true, id);
  assert.equal(opensIlBucoDoor('12282949'), false); // the rancho: its own padlocks
  assert.equal(opensIlBucoDoor('default'), false);
});

test('placeholderStays: a $0 hold under a paid booking of the same guest gets no code', async () => {
  const { placeholderStays } = await import('./lock-users.ts');
  const stay = (code: string, amount: number | undefined, extra: Record<string, unknown> = {}) => ({
    reservation_code: code, status: 'accepted', cancelled_at: null, property_id: 12282945,
    guest_name: 'Silvia Krauel', check_in_date: '2026-11-20', check_out_date: '2026-11-23',
    rates: amount === undefined ? undefined : { total_rate: { amount } }, ...extra,
  });
  // 2026-11-07: Giardino held two codes for Silvia Krauel — Booking 9-6861866133 ($416, 4 guests)
  // and a hand-made hold 5-6AHHVU3CU from 30.03 ($0, 1 guest).
  const silvia = [stay('9-6861866133-iguzfn7k2g', 416), stay('5-6AHHVU3CU', 0)];
  assert.deepEqual([...placeholderStays(silvia)], ['5-6AHHVU3CU']);
  // Same pattern with only the first name typed on the hold (Vanesa / Vanesa Moya, December).
  assert.deepEqual([...placeholderStays([
    stay('9-6827504390', 2632.5, { guest_name: 'Vanesa Moya', property_id: 12299611, check_in_date: '2026-12-22', check_out_date: '2026-12-28' }),
    stay('5-6BT25MYLB', 0, { guest_name: 'Vanesa', property_id: 12299611, check_in_date: '2026-12-22', check_out_date: '2026-12-28' }),
  ])], ['5-6BT25MYLB']);
  // A free stay with no paid twin is real (friends, family): keeps its code.
  assert.equal(placeholderStays([stay('5-6CIPR80FI', 0, { guest_name: 'Amiga Jenny' })]).size, 0);
  // Another unit, another guest, back-to-back dates, a cancelled twin, an unknown amount: not a hold.
  assert.equal(placeholderStays([stay('A', 416, { property_id: 12282946 }), stay('B', 0)]).size, 0);
  assert.equal(placeholderStays([stay('A', 416, { guest_name: 'Otra Persona' }), stay('B', 0)]).size, 0);
  assert.equal(placeholderStays([stay('A', 416, { check_in_date: '2026-11-23', check_out_date: '2026-11-25' }), stay('B', 0)]).size, 0);
  assert.equal(placeholderStays([stay('A', 416, { status: 'cancelled' }), stay('B', 0)]).size, 0);
  assert.equal(placeholderStays([stay('A', 416), stay('B', undefined)]).size, 0);
});

test('manualLockAction: a stuck admin code is written again only on an online lock, after it had time to land', () => {
  const stuck = { id: '7', name: 'Huespedes 16-11', sync_status: 0 };
  assert.equal(manualLockAction({ ...stuck, sync_status: 1 }, { online: false, minutesSinceWrite: 0 }), 'ok');
  assert.equal(manualLockAction(stuck, { online: false, minutesSinceWrite: 120 }), 'wait');
  assert.equal(manualLockAction(stuck, { online: true, minutesSinceWrite: MANUAL_SETTLE_MIN - 1 }), 'wait');
  assert.equal(manualLockAction(stuck, { online: true, minutesSinceWrite: MANUAL_SETTLE_MIN }), 'push');
  assert.equal(manualLockAction(undefined, { online: true, minutesSinceWrite: 120 }), 'missing');
});

test('doorStateOf: the admin shows what the door holds, not what U-tec accepted', () => {
  const users = [{ id: '1', name: 'Melody', sync_status: 1 }, { id: '2', name: 'Huespedes 16-11', sync_status: 0 }];
  assert.equal(doorStateOf('1', users), 'door');
  assert.equal(doorStateOf('2', users), 'cloud');
  assert.equal(doorStateOf('3', users), 'gone');
  assert.equal(doorStateOf(undefined, users), undefined);
  assert.equal(doorStateOf('1', []), undefined); // the lock answered no users: unknown, not «gone»
});
