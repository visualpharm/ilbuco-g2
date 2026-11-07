/**
 * A new front-door code for a code made by hand (/nimda create-pin): a staff
 * member's own code (Melody, Andrés) or a temporary one ("Mantenimiento 09-11"),
 * e.g. after it was handed to a guest. Guest codes and «Respaldo» slots are
 * managed by guest-ops and refused here.
 *
 *   npx tsx --env-file=.env.local scripts/lock-staff-pin.mts "Melody"           # what would change
 *   npx tsx --env-file=.env.local scripts/lock-staff-pin.mts "Melody" --apply   # change it
 *
 * --apply writes a fresh 4-digit code (not guessable, not used by anyone on the
 * lock), keeps a temporary code's dates, updates the code /nimda shows, waits
 * until the lock reads it back, and prints it once so it can be passed on.
 * The old code stops working at that moment.
 */
import { listDevices, listUsers, getUser, updateUser, buildGuestSchedule } from '../lib/utec-api';
import { loadState, saveState, upsertAssignment } from '../lib/guest-ops-store';
import { isGuestLockName } from '../lib/lock-users';
import { generatePin } from '../lib/pin-pool';

const [name, flag] = process.argv.slice(2);
if (!name) {
  console.error('usage: lock-staff-pin.mts "<lock user name>" [--apply]');
  process.exit(2);
}

// One lock today: the front door (guest-ops assumes the same).
const [device] = await listDevices();
if (!device) throw new Error('Front-door lock not found in U-tec');
const users = await listUsers(device.id);
if (!users.length) throw new Error('The lock answers with no users: it is offline, try later');

const matches = users.filter(u => u.name.trim().toLowerCase() === name.trim().toLowerCase());
if (matches.length !== 1) {
  console.error(matches.length ? `${matches.length} lock users are called "${name}"` : `No lock user "${name}". Users: ${users.map(u => u.name).join(', ')}`);
  process.exit(1);
}
const user = matches[0];
if (isGuestLockName(user.name) || /^Respaldo \d+$/.test(user.name)) {
  console.error(`"${user.name}" is managed by guest-ops; not touching it`);
  process.exit(1);
}

const state = await loadState();
const record = Object.values(state.pinAssignments).find(a => a.isManual && a.lockUserId === user.id && a.lockStatus !== 'revoked');
const temporary = user.type === 2;
if (temporary && !record) {
  console.error(`"${user.name}" is a temporary code made in the app: its dates are unknown here, change it in the app`);
  process.exit(1);
}
const schedule = temporary && record ? buildGuestSchedule(record.checkIn, record.checkOut) : undefined;
console.log(`Lock user "${user.name}" (id ${user.id}, ${temporary ? `valid ${record!.checkIn.slice(0, 10)} – ${record!.checkOut.slice(0, 10)}` : 'permanent'}, on the lock: ${user.sync_status !== 0 ? 'yes' : 'not yet'}, in /nimda: ${record ? 'yes' : 'no'})`);
if (flag !== '--apply') process.exit(0);

const used = new Set<number>();
for (const a of Object.values(state.pinAssignments)) if (a.pin && a.lockStatus !== 'revoked') used.add(a.pin);
for (const bp of state.backupPool) used.add(bp.pin);
for (const u of users) {
  const g = await getUser(device.id, u.id).catch(() => null);
  const pin = Number(g?.password);
  if (Number.isFinite(pin) && pin > 0) used.add(pin);
}
const pin = generatePin(used);
await updateUser(device.id, user.id, user.name, pin, schedule);
if (record) {
  const fresh = await loadState();
  const cur = fresh.pinAssignments[record.reservationCode];
  await saveState(upsertAssignment(fresh, { ...cur, pin, updatedAt: new Date().toISOString() }), 'lock-staff-pin');
}

for (let i = 0; i < 18; i++) {
  await new Promise(r => setTimeout(r, 10_000));
  const now = (await listUsers(device.id)).find(u => u.id === user.id);
  const g = await getUser(device.id, user.id).catch(() => null);
  if (now && now.sync_status !== 0 && Number(g?.password) === pin) {
    console.log(`New code for ${user.name}: ${pin} — on the lock now; the old one no longer opens the door.`);
    process.exit(0);
  }
}
console.log(`New code for ${user.name}: ${pin} — sent to the lock, not confirmed yet after 3 min (check the lock's Wi-Fi).`);
