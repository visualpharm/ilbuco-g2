/**
 * U-tec command shape tests — pins the st.lockUser body to the documented
 * `{id, command: {capability, name, arguments}}` form. The flat shape was
 * silently ignored by U-tec, so no automated PIN ever reached the lock.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lockUserCommand, buildGuestSchedule } from './utec-api.ts';

test('lockUserCommand: list nests the command and sends no arguments', () => {
  assert.deepEqual(lockUserCommand('AA:BB', 'list'), {
    devices: [{ id: 'AA:BB', command: { capability: 'st.lockUser', name: 'list' } }],
  });
});

test('lockUserCommand: add puts the user object under arguments', () => {
  const schedule = buildGuestSchedule('2026-11-06T17:00:00.000Z', '2026-11-10T13:00:00.000Z');
  const body = lockUserCommand('AA:BB', 'add', { type: 2, name: 'HM123', password: 482915, ...schedule });
  const device = (body.devices as Array<Record<string, unknown>>)[0];
  assert.equal(device.id, 'AA:BB');
  assert.equal('capability' in device, false);
  const command = device.command as Record<string, unknown>;
  assert.equal(command.capability, 'st.lockUser');
  assert.equal(command.name, 'add');
  const args = command.arguments as Record<string, unknown>;
  assert.equal(args.type, 2);
  assert.equal(args.password, 482915);
  for (const field of ['daterange', 'weeks', 'timerange', 'limit']) assert.ok(field in args, field);
});

test('lockUserCommand: delete carries the numeric user id', () => {
  const body = lockUserCommand('AA:BB', 'delete', { id: Number('8606451') });
  const command = (body.devices as Array<{ command: { arguments: { id: unknown } } }>)[0].command;
  assert.equal(command.arguments.id, 8606451);
});

test('isReservationCodeName: Hostex codes yes, names typed in the Xthings app no', async () => {
  const { isReservationCodeName } = await import('./guest-ops-store.ts');
  for (const code of ['24-MV13EMXB-ihwhxlecdq', '9-5937823233-ihbygpu2hc', '5-6CS9E569R']) {
    assert.equal(isReservationCodeName(code), true, code);
  }
  for (const name of ['Jennifer', 'Andresduffau@gmail.com', 'Limpieza 2', 'E2E-TEST-10291721', 'Guest']) {
    assert.equal(isReservationCodeName(name), false, name);
  }
});
