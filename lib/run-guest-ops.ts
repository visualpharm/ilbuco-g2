/**
 * Guest-ops orchestrator — the core logic that ties everything together.
 *
 * Mirrors the run-pricing.ts pattern: a framework-agnostic core invoked from
 * thin route handlers (cron + webhook). Returns typed reports.
 *
 * Entry points:
 *   handleNewReservation(code) — triggered by Hostex webhook on new booking
 *   processRetryQueue()        — Fibonacci retry sweep (cron every 15 min)
 *   runPreCheckinSweep()       — ensure PINs are ready for imminent check-ins (hourly)
 *   runPostCheckoutSweep()     — revoke PINs after checkout (hourly)
 *   reconcileLocks()           — clean up orphaned lock users (daily)
 */

import { sendPricingAlert } from './pricing-alerts';
import {
  loadState,
  saveState,
  upsertAssignment,
  removeAssignment,
  updateRetryQueue,
  type PinAssignment,
  type GuestOpsState,
  type DeliveryChannel,
  type BackupPin,
  isReservationCodeName,
} from './guest-ops-store';
import {
  listDevices,
  getDeviceStatus,
  listUsers,
  addTemporaryUser,
  addPermanentUser,
  updateUser,
  deleteUser,
  confirmUserAdded,
  getUser,
  waitForLockUser,
  buildGuestSchedule,
  type UtecUser,
} from './utec-api';
import { guestLockName, findOwnLockUser, isOnLock, isGuestLockName, lockUserVerdict, opensIlBucoDoor } from './lock-users';
import {
  createQueueItem,
  recordFailure,
  isReady,
  findPending,
  RetryableError,
  type QueueItem,
} from './utec-retry';
import {
  checkOut as poolCheckOut, release as poolRelease, generatePin, needsNewPin,
  missingBackupNames, reconcileBackupSlot, poolStats,
} from './pin-pool';
import { deliverPin, keyBoxCodeFor, type PinMessageData } from './messaging';
import { getPropertyName, getFullReservations, getReservation, ILBUCO_PROPERTY_IDS } from './hostex-api';
import { stayBoundary, hoursUntil, isDeliveryDue, PIN_TIMEZONE } from './guest-pin-times';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Collect all active PINs to avoid collisions.
 */
function getActivePins(state: GuestOpsState): Set<number> {
  const pins = new Set<number>();
  for (const a of Object.values(state.pinAssignments)) {
    if (a.pin && a.lockStatus !== 'revoked') pins.add(a.pin);
  }
  for (const bp of state.backupPool) {
    pins.add(bp.pin);
  }
  return pins;
}

// Cache device ID lookups to avoid repeated listDevices calls
const deviceIdCache = new Map<string, string>();

/**
 * Find the U-tec device for a property. Cached after first lookup.
 * TODO: map propertyId → deviceId once the lock is registered in U-tec.
 */
async function findDeviceForProperty(propertyId: string): Promise<string | null> {
  if (deviceIdCache.has(propertyId)) return deviceIdCache.get(propertyId)!;
  const devices = await listDevices();
  if (!devices.length) return null;
  // TODO: maintain a propertyId → deviceId mapping. For now, use the first device
  // (single-lock setup). When multiple locks are added, this needs a config map.
  console.log(`[guest-ops] Looking for device for property ${propertyId}, found ${devices.length} devices`);
  const id = devices[0].id;
  deviceIdCache.set(propertyId, id);
  return id;
}

/** Lock user ids held by other assignments — never adopt one of those by name. */
function lockUserIdsInUse(state: GuestOpsState, exceptCode: string): Set<string> {
  const ids = new Set<string>();
  for (const a of Object.values(state.pinAssignments)) {
    if (a.reservationCode !== exceptCode && a.lockUserId) ids.add(a.lockUserId);
  }
  return ids;
}

function lockNameFor(a: Pick<PinAssignment, 'guestName' | 'checkIn' | 'propertyName'>): string {
  return guestLockName(a.guestName, a.checkIn, a.propertyName);
}

/** The lock has not taken the code yet — worth retrying, never fatal. */
function notOnLockError(what: string): RetryableError {
  return new RetryableError(`${what} — the lock has not taken the code yet (sync_status 0)`, 'NOT_ON_LOCK');
}

/**
 * Make sure an existing lock user is on the physical lock under its expected name.
 * A user stuck in the U-tec cloud (sync_status 0) or carrying an old name is
 * written again — U-tec then pushes it to the lock. It is written with the
 * assignment's PIN and stay window: the code the guest gets is the code on the lock.
 * @returns true once the lock has it
 */
async function settleLockUser(
  deviceId: string,
  user: UtecUser,
  a: Pick<PinAssignment, 'guestName' | 'checkIn' | 'checkOut' | 'propertyName' | 'pin'>
): Promise<boolean> {
  const expectedName = lockNameFor(a);
  if (isOnLock(user) && user.name === expectedName) return true;
  if (!a.pin) throw new Error(`No PIN to write for lock user ${user.id}`);
  await updateUser(deviceId, user.id, expectedName, a.pin, buildGuestSchedule(a.checkIn, a.checkOut));
  const after = await waitForLockUser(deviceId, u => u.id === user.id && u.name === expectedName);
  return !!after && isOnLock(after);
}

// ─── Report types ────────────────────────────────────────────────────────────

export interface GuestOpsReport {
  job: string;
  success: boolean;
  details: string;
  processed?: number;
  errors?: string[];
  at: string;
}

// ─── Main flow: handle new reservation ───────────────────────────────────────

export interface ReservationInput {
  code: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyId: string;
  /** Date-only ("2026-10-11") or ISO timestamp. */
  checkIn: string;
  checkOut: string;
  channel: string;
  conversationId?: string;
}

function datesChanged(a: PinAssignment, checkIn: string, checkOut: string): boolean {
  return new Date(a.checkIn).getTime() !== new Date(checkIn).getTime()
    || new Date(a.checkOut).getTime() !== new Date(checkOut).getTime();
}

/**
 * Process a reservation (new or updated): make sure a PIN exists, is programmed
 * on the lock for the stay's dates, and is delivered when due. Idempotent —
 * Hostex repeats events, and the hourly sweep re-runs it for upcoming stays.
 */
export async function handleNewReservation(
  reservation: ReservationInput,
  dryRun = false
): Promise<GuestOpsReport> {
  const errors: string[] = [];
  console.log(`[guest-ops] handleNewReservation ${reservation.code} (${reservation.guestName})`);
  if (!opensIlBucoDoor(reservation.propertyId)) {
    return { job: 'new-reservation', success: true, details: 'Not an Il Buco stay', at: new Date().toISOString() };
  }
  const checkIn = stayBoundary(reservation.checkIn);
  const checkOut = stayBoundary(reservation.checkOut);

  try {
    let state = await loadState();
    const existing = state.pinAssignments[reservation.code];

    // Same stay already handled: just make sure delivery happened.
    if (existing && existing.lockStatus !== 'revoked' && !datesChanged(existing, checkIn, checkOut)) {
      if (existing.lockStatus === 'synced' || existing.lockStatus === 'backup') {
        if (!dryRun) await deliverAndSave(state, reservation.code);
        return { job: 'new-reservation', success: true, details: 'Already handled', at: new Date().toISOString() };
      }
      // An exhausted item is not a sync in progress: fall through and try the lock again.
      if (findPending(state.retryQueue, reservation.code)) {
        return { job: 'new-reservation', success: true, details: 'Lock sync already queued', at: new Date().toISOString() };
      }
    }

    const propertyName = getPropertyName(reservation.propertyId);
    const pin = existing?.pin && existing.lockStatus !== 'revoked'
        && !needsNewPin(existing.pin, existing.channels.length > 0)
      ? existing.pin
      : generatePin(getActivePins(state));

    if (dryRun) {
      return {
        job: 'new-reservation',
        success: true,
        details: `Dry-run: would program a PIN for ${reservation.guestName} (${reservation.code}) ${checkIn} → ${checkOut}`,
        at: new Date().toISOString(),
      };
    }

    const deviceId = await findDeviceForProperty(reservation.propertyId);

    // Dates moved: remove the old lock user first, it is re-added with the new schedule.
    if (existing?.lockUserId && datesChanged(existing, checkIn, checkOut) && deviceId) {
      try {
        await deleteUser(deviceId, existing.lockUserId);
      } catch (err) {
        errors.push(`Could not remove old lock user: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const assignment: PinAssignment = {
      reservationCode: reservation.code,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      guestPhone: reservation.guestPhone,
      propertyId: reservation.propertyId,
      propertyName,
      channel: reservation.channel,
      checkIn,
      checkOut,
      pin,
      lockStatus: 'retrying',
      conversationId: reservation.conversationId ?? existing?.conversationId,
      // A moved stay is a new message to the guest.
      channels: existing && !datesChanged(existing, checkIn, checkOut) ? existing.channels : [],
      alertedAt: existing?.alertedAt,
      retryAttempts: 0,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state = upsertAssignment(state, assignment);
    // Drop stale queued ops for this reservation; a fresh one is queued below if needed.
    state = updateRetryQueue(state, q => q.filter(qi => qi.reservationCode !== reservation.code));

    if (!deviceId) {
      errors.push('No U-tec device found — is the lock registered?');
      assignment.lockStatus = 'failed';
      state = upsertAssignment(state, assignment);
      await saveState(state);
      return { job: 'new-reservation', success: false, details: 'No lock device', errors, at: new Date().toISOString() };
    }

    const schedule = buildGuestSchedule(checkIn, checkOut);
    try {
      // Lock offline (bridge down): don't burn the confirmation timeout per stay —
      // queue the add; the 15-min retry sweep programs it when the lock is back.
      const lockStatus = await getDeviceStatus(deviceId);
      if (!lockStatus.online) {
        throw new RetryableError('Lock is offline in U-tec', 'DEVICE_OFFLINE');
      }

      // Dedup: our lock user may already exist (stored id, its name, or the legacy
      // reservation-code name). It counts only once the physical lock has it.
      const lockName = lockNameFor(assignment);
      const takenIds = lockUserIdsInUse(state, reservation.code);
      const users = await listUsers(deviceId);
      const existingUser = existing && datesChanged(existing, checkIn, checkOut)
        ? undefined
        : findOwnLockUser(users, { lockUserId: existing?.lockUserId, expectedName: lockName, reservationCode: reservation.code, takenIds });
      if (existingUser) {
        assignment.lockUserId = existingUser.id;
        if (await settleLockUser(deviceId, existingUser, assignment)) {
          assignment.lockStatus = 'synced';
          state = upsertAssignment(state, assignment);
          await saveState(state);
          await deliverAndSave(state, reservation.code);
          return { job: 'new-reservation', success: true, details: 'PIN already on lock', at: new Date().toISOString() };
        }
        errors.push('Lock user exists but the lock has not taken it — re-sent, the retry sweep verifies it');
      } else {
        await addTemporaryUser(deviceId, lockName, pin, schedule);
        const added = await waitForLockUser(deviceId, u => u.name === lockName && !takenIds.has(u.id));
        if (added) assignment.lockUserId = added.id;
        if (added && isOnLock(added)) {
          assignment.lockStatus = 'synced';
          state = upsertAssignment(state, assignment);
          await saveState(state);
          await deliverAndSave(state, reservation.code);
          console.log(`[guest-ops] PIN synced to lock for ${reservation.code}`);
          return { job: 'new-reservation', success: true, details: `PIN synced (user ${added.id})`, at: new Date().toISOString() };
        }
        errors.push(added
          ? 'Lock user added but the lock has not taken it yet — the retry sweep verifies it'
          : 'Add command sent but confirmation timed out — will verify on next sweep');
      }

      // Not on the lock yet — the retry queue verifies (and re-sends) it.
      state = upsertAssignment(state, assignment);
      state = updateRetryQueue(state, q => [...q, createQueueItem(reservation.code, 'add', deviceId, { schedule, pin })]);
      await saveState(state);
    } catch (err) {
      console.error(`[guest-ops] Lock programming failed for ${reservation.code}:`, err);
      const failedItem = recordFailure(createQueueItem(reservation.code, 'add', deviceId, { schedule, pin }), err);
      state = updateRetryQueue(state, q => [...q, failedItem]);
      state = upsertAssignment(state, { ...assignment, retryAttempts: failedItem.attempts });
      await saveState(state);
      errors.push(`Lock programming failed: ${err instanceof Error ? err.message : String(err)}`);
      return { job: 'new-reservation', success: false, details: 'Enqueued for retry', errors, at: new Date().toISOString() };
    }

    return { job: 'new-reservation', success: false, details: 'Enqueued for confirmation', errors, at: new Date().toISOString() };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error('[guest-ops] handleNewReservation error:', err);
    await sendPricingAlert(`⚠️ [guest-ops] Failed to process reservation ${reservation.code}: ${msg}`);
    return { job: 'new-reservation', success: false, details: 'Error', errors, at: new Date().toISOString() };
  }
}

/**
 * Cancelled reservation: take the code off the lock and mark it revoked.
 */
export async function handleCancelledReservation(code: string, dryRun = false): Promise<GuestOpsReport> {
  const at = new Date().toISOString();
  const state = await loadState();
  const a = state.pinAssignments[code];
  if (!a || a.lockStatus === 'revoked') {
    return { job: 'cancel', success: true, details: 'Nothing to revoke', at };
  }
  if (dryRun) return { job: 'cancel', success: true, details: `Dry-run: would revoke ${code}`, at };
  return { ...(await revokeAssignment(state, a)), job: 'cancel' };
}

/**
 * Remove an assignment's lock user (queueing a retry on failure), recycle a
 * backup PIN, mark it revoked and persist.
 */
async function revokeAssignment(state: GuestOpsState, assignment: PinAssignment): Promise<GuestOpsReport> {
  let s = state;
  const errors: string[] = [];
  // Cancel any pending add for it.
  s = updateRetryQueue(s, q => q.filter(qi => !(qi.reservationCode === assignment.reservationCode && qi.operation === 'add')));

  const deviceId = await findDeviceForProperty(assignment.propertyId).catch(() => null);
  if (assignment.lockUserId && deviceId) {
    try {
      await deleteUser(deviceId, assignment.lockUserId);
    } catch (err) {
      errors.push(`Revoke failed (queued): ${err instanceof Error ? err.message : String(err)}`);
      const failed = recordFailure(
        createQueueItem(assignment.reservationCode, 'delete', deviceId, { id: assignment.lockUserId }), err);
      s = updateRetryQueue(s, q => [...q, failed]);
    }
  }
  if (assignment.lockStatus === 'backup') {
    s = { ...s, backupPool: poolRelease(s, assignment.reservationCode) };
  }
  s = upsertAssignment(s, { ...assignment, lockStatus: 'revoked' });
  await saveState(s);
  console.log(`[guest-ops] Revoked PIN for ${assignment.reservationCode}`);
  return { job: 'revoke', success: errors.length === 0, details: `Revoked ${assignment.reservationCode}`, errors, at: new Date().toISOString() };
}

// ─── Deliver PIN (internal helper) ───────────────────────────────────────────

/**
 * Deliver the PIN to the guest — only when it is usable and due:
 *   - the code is on the lock (synced) or a backup PIN is assigned,
 *   - check-in is within the delivery window (earlier bookings get it later;
 *     stays already under way are never messaged retroactively),
 *   - the stay has not ended.
 * Channels that already succeeded are not repeated.
 */
async function deliverIfDue(state: GuestOpsState, reservationCode: string): Promise<GuestOpsState> {
  const a = state.pinAssignments[reservationCode];
  if (!a || !a.pin || a.isManual) return state;
  if (a.lockStatus !== 'synced' && a.lockStatus !== 'backup') return state;
  if (!isDeliveryDue(a.checkIn) || hoursUntil(a.checkOut) < 0) return state;

  const wanted: DeliveryChannel[] = ['email', 'hostex'];
  const pending = wanted.filter(ch => !a.channels.some(c => c.channel === ch && c.sent));
  if (!pending.length) return state;

  const data: PinMessageData = {
    guestName: a.guestName,
    pin: a.pin,
    propertyName: a.propertyName,
    checkIn: a.checkIn,
    checkOut: a.checkOut,
    keyBoxCode: keyBoxCodeFor(a.propertyName),
  };
  const results = await deliverPin(data, {
    guestEmail: a.guestEmail,
    conversationId: a.conversationId,
    channels: pending,
  });

  const merged = [
    ...a.channels.filter(c => !pending.includes(c.channel)),
    ...results,
  ];
  let updated: PinAssignment = { ...a, channels: merged };
  const delivered = merged.some(c => c.sent);

  // Nobody got the code and check-in is close: tell the owner once.
  if (!delivered && !a.alertedAt && hoursUntil(a.checkIn) < 24) {
    await sendPricingAlert(
      `🟡 [guest-ops] Code for ${a.guestName} (${a.reservationCode}, check-in ${a.checkIn.slice(0, 10)}) ` +
      `could not be sent to the guest: ${results.map(r => `${r.channel}: ${r.error ?? 'failed'}`).join('; ')}. Send it manually.`
    );
    updated = { ...updated, alertedAt: new Date().toISOString() };
  }
  return upsertAssignment(state, updated);
}

/** deliverIfDue + persist (for single-reservation flows). */
async function deliverAndSave(state: GuestOpsState, reservationCode: string): Promise<void> {
  await saveState(await deliverIfDue(state, reservationCode));
}

// ─── Cron jobs ───────────────────────────────────────────────────────────────

/**
 * Process the retry queue — attempt items whose nextAttemptAt has passed.
 * Called by cron every 15 minutes.
 */
export async function processRetryQueue(dryRun = false, force = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] processRetryQueue');
  let state = await loadState();
  let processed = 0;
  const errors: string[] = [];
  const now = new Date();

  // force: the lock just came back — don't wait out the backoff of attempts made while it was away.
  const readyItems = state.retryQueue.filter(q => (force ? q.status === 'pending' : isReady(q, now)));
  if (!readyItems.length) {
    return { job: 'retries', success: true, details: 'No items ready', processed: 0, at: now.toISOString() };
  }

  // One status check per lock per sweep: an offline lock would otherwise cost the
  // 30s confirmation poll per queued item and burn retry attempts for nothing.
  const lockOnline = new Map<string, boolean>();
  const isLockOnline = async (deviceId: string): Promise<boolean> => {
    if (!lockOnline.has(deviceId)) {
      lockOnline.set(deviceId, await getDeviceStatus(deviceId).then(st => st.online, () => false));
    }
    return lockOnline.get(deviceId)!;
  };

  for (const item of readyItems) {
    if (!dryRun && !(await isLockOnline(item.deviceId))) {
      console.log(`[guest-ops] lock ${item.deviceId} offline — leaving ${item.reservationCode} queued`);
      continue;
    }
    processed++;
    try {
      if (dryRun) {
        console.log(`[guest-ops dry-run] Would retry ${item.operation} for ${item.reservationCode}`);
        continue;
      }

      let assignment = state.pinAssignments[item.reservationCode];
      if (!assignment) {
        // Assignment was cleaned up — remove from queue
        state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
        continue;
      }

      if (item.operation === 'add') {
        // Check dedup first: our user may be in U-tec already, maybe not yet on the lock.
        const lockName = lockNameFor(assignment);
        const takenIds = lockUserIdsInUse(state, item.reservationCode);
        const users = await listUsers(item.deviceId);
        const existing = findOwnLockUser(users, {
          lockUserId: assignment.lockUserId, expectedName: lockName, reservationCode: item.reservationCode, takenIds,
        });
        if (existing) {
          const onLock = await settleLockUser(item.deviceId, existing, assignment);
          if (onLock) {
            const synced: PinAssignment = {
              ...assignment,
              lockStatus: 'synced',
              lockUserId: existing.id,
              updatedAt: now.toISOString(),
            };
            state = upsertAssignment(state, synced);
            state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
            state = await deliverIfDue(state, item.reservationCode);
            continue;
          }
          // Re-sent; still only in the cloud. Count the attempt, check again later.
          throw Object.assign(notOnLockError(`Lock user ${existing.id}`), { lockUserId: existing.id });
        }

        // Retry the add
        if (needsNewPin(assignment.pin, assignment.channels.length > 0)) {
          const activePins = getActivePins(state);
          activePins.delete(assignment.pin!);
          assignment = { ...assignment, pin: generatePin(activePins), updatedAt: now.toISOString() };
          state = upsertAssignment(state, assignment);
        }
        const schedule = buildGuestSchedule(assignment.checkIn, assignment.checkOut);
        await addTemporaryUser(item.deviceId, lockName, assignment.pin!, schedule);
        const added = await waitForLockUser(item.deviceId, u => u.name === lockName && !takenIds.has(u.id));

        if (added && isOnLock(added)) {
          const synced: PinAssignment = {
            ...assignment,
            lockStatus: 'synced',
            lockUserId: added.id,
            updatedAt: now.toISOString(),
          };
          state = upsertAssignment(state, synced);
          state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
          console.log(`[guest-ops] ✅ Retry succeeded for ${item.reservationCode}`);

          state = await deliverIfDue(state, item.reservationCode);
        } else {
          // Not on the lock yet (or not even in U-tec): advance Fibonacci, keep retrying.
          throw Object.assign(
            added ? notOnLockError(`Lock user ${added.id}`) : new RetryableError('Confirmation timed out', 'NOT_CONFIRMED'),
            { lockUserId: added?.id },
          );
        }
      } else if (item.operation === 'delete') {
        if (item.payload.id) {
          await deleteUser(item.deviceId, String(item.payload.id));
        }
        state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
      }
    } catch (err) {
      const failed = recordFailure(item, err);
      if (failed) {
        state = updateRetryQueue(state, q => q.map(qi => qi === item ? failed : qi));
        const assignment = state.pinAssignments[item.reservationCode];
        if (assignment) {
          // Remember a user that reached U-tec, so the next attempt re-sends it instead of adding a twin.
          const lockUserId = (err as { lockUserId?: string }).lockUserId ?? assignment.lockUserId;
          state = upsertAssignment(state, { ...assignment, lockUserId, retryAttempts: failed.attempts });
        }
        if (failed.status === 'exhausted') {
          errors.push(`${item.reservationCode} exhausted after ${failed.attempts} retries`);
          await sendPricingAlert(
            `🔴 [guest-ops] Lock sync EXHAUSTED for ${item.reservationCode} after ${failed.attempts} attempts. ` +
            `Backup PIN will be assigned on next pre-checkin sweep.`
          );
        }
      }
    }
  }

  await saveState(state);
  return { job: 'retries', success: errors.length === 0, details: `Processed ${processed} items`, processed, errors, at: now.toISOString() };
}

/** Upcoming-stay window the hourly sweep keeps programmed on the lock. */
const SYNC_AHEAD_DAYS = 14;

function arDate(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: PIN_TIMEZONE }).format(d);
}

/**
 * Source-of-truth sync with Hostex (webhooks are thin, can be dropped, and are
 * never replayed): accepted stays checking in within SYNC_AHEAD_DAYS get a PIN;
 * stays we hold that Hostex now reports cancelled lose it.
 */
async function syncWithHostex(dryRun: boolean): Promise<{ ensured: number; revoked: number; errors: string[] }> {
  const errors: string[] = [];
  let ensured = 0;
  let revoked = 0;

  const upcoming = await getFullReservations(arDate(-1), arDate(SYNC_AHEAD_DAYS));
  const seen = new Set<string>();
  for (const r of upcoming) {
    if (seen.has(r.reservation_code)) continue; // multi-room stays share one code
    seen.add(r.reservation_code);
    if (r.status !== 'accepted' || r.cancelled_at) continue;
    if (!opensIlBucoDoor(String(r.property_id))) continue; // the rancho has its own padlocks
    const res = await handleNewReservation({
      code: r.reservation_code,
      guestName: r.guest_name,
      guestEmail: r.guest_email ?? undefined,
      guestPhone: r.guest_phone ?? undefined,
      propertyId: String(r.property_id),
      checkIn: r.check_in_date,
      checkOut: r.check_out_date,
      channel: r.channel_type,
      conversationId: r.conversation_id ?? undefined,
    }, dryRun);
    if (res.details !== 'Already handled' && res.details !== 'Lock sync already queued') ensured++;
    if (res.errors?.length) errors.push(...res.errors.map(e => `${r.reservation_code}: ${e}`));
  }

  // Cancellations / date moves for stays we already hold.
  const state = await loadState();
  for (const a of Object.values(state.pinAssignments)) {
    if (a.isManual || a.lockStatus === 'revoked' || seen.has(a.reservationCode)) continue;
    if (hoursUntil(a.checkOut) < 0) continue;
    try {
      const r = await getReservation(a.reservationCode);
      if (r && r.status !== 'accepted') {
        if (!dryRun) await handleCancelledReservation(a.reservationCode);
        revoked++;
      } else if (r && r.status === 'accepted' && datesChanged(a, stayBoundary(r.check_in_date), stayBoundary(r.check_out_date))) {
        await handleNewReservation({
          code: r.reservation_code, guestName: r.guest_name,
          guestEmail: r.guest_email ?? undefined, guestPhone: r.guest_phone ?? undefined,
          propertyId: String(r.property_id), checkIn: r.check_in_date, checkOut: r.check_out_date,
          channel: r.channel_type, conversationId: a.conversationId,
        }, dryRun);
        ensured++;
      }
    } catch (err) {
      errors.push(`${a.reservationCode}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { ensured, revoked, errors };
}

/**
 * Check the codes we consider synced against the lock itself (one list call per
 * lock): a code stuck in the U-tec cloud (sync_status 0) is written again, one
 * under an old name gets its "Guest DD-MM Unit" name, one that vanished from the
 * lock is queued to be added again. PINs and schedules are never changed here.
 */
async function verifyLockUsers(
  state: GuestOpsState,
  dryRun: boolean
): Promise<{ state: GuestOpsState; fixed: number; errors: string[] }> {
  const errors: string[] = [];
  let fixed = 0;
  let s = state;
  const watched = Object.values(s.pinAssignments).filter(a =>
    !a.isManual && a.lockUserId && a.lockStatus === 'synced'
    && hoursUntil(a.checkOut) > 0 && hoursUntil(a.checkIn) < SYNC_AHEAD_DAYS * 24);
  const usersByDevice = new Map<string, UtecUser[]>();
  const settleDeadline = Date.now() + 120_000; // the cron function has 300 s in total

  for (const a of watched) {
    try {
      const deviceId = await findDeviceForProperty(a.propertyId);
      if (!deviceId) continue;
      if (!usersByDevice.has(deviceId)) usersByDevice.set(deviceId, await listUsers(deviceId));
      const users = usersByDevice.get(deviceId)!;
      if (!users.length) continue; // offline lock answers an empty list — nothing to judge
      const expected = lockNameFor(a);
      const user = users.find(u => u.id === a.lockUserId);
      const verdict = lockUserVerdict(user, expected);
      if (verdict === 'ok') continue;
      fixed++;
      if (dryRun) continue;

      if (verdict === 'rename' && user && a.pin) {
        // The code already opens the door: rename with the same PIN and stay, don't wait —
        // the lock applies queued writes one by one, and waiting here made renames look like failures.
        await updateUser(deviceId, user.id, expected, a.pin, buildGuestSchedule(a.checkIn, a.checkOut));
        console.log(`[guest-ops] lock user ${user.id} renamed to "${expected}" for ${a.reservationCode}`);
        continue;
      }
      // Each wait below can take 30 s; past the budget, queue the rest for the 15-min retry job.
      if (user && Date.now() < settleDeadline && await settleLockUser(deviceId, user, a)) {
        console.log(`[guest-ops] lock user ${user.id} settled for ${a.reservationCode}`);
        continue;
      }
      // Still not on the lock (or gone from it): back to the retry queue, no delivery until it is.
      console.warn(`[guest-ops] ${a.reservationCode}: lock user ${a.lockUserId} ${user ? 'not on the lock (sync_status 0)' : 'missing from the lock'}`);
      s = upsertAssignment(s, {
        ...a,
        lockStatus: 'retrying',
        lockUserId: user ? a.lockUserId : undefined,
        updatedAt: new Date().toISOString(),
      });
      if (!findPending(s.retryQueue, a.reservationCode)) {
        const schedule = buildGuestSchedule(a.checkIn, a.checkOut);
        s = updateRetryQueue(s, q => [
          ...q.filter(qi => qi.reservationCode !== a.reservationCode),
          createQueueItem(a.reservationCode, 'add', deviceId, { schedule, pin: a.pin ?? undefined }),
        ]);
      }
    } catch (err) {
      errors.push(`${a.reservationCode}: lock check failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { state: s, fixed, errors };
}

/**
 * Keep DEFAULT_POOL_SIZE permanent "Respaldo N" codes on the lock:
 * - a slot handed to a guest who has left gets a new PIN (the old one stops opening);
 * - a slot is ready only once a later run reads our PIN back from the lock;
 * - a missing slot is added; the next run adopts it by name with the PIN U-tec holds.
 * Slots in use are never touched.
 */
async function maintainBackupPool(
  current: BackupPin[],
  deviceId: string,
  dryRun: boolean,
): Promise<{ pool: BackupPin[]; added: number; rotated: number; errors: string[] }> {
  const errors: string[] = [];
  const users = await listUsers(deviceId);
  // An offline lock answers with no users: that is not "every slot is gone".
  if (!users.length) return { pool: current, added: 0, rotated: 0, errors: ['Backup pool: lock returned no users'] };
  const byId = new Map(users.map(u => [u.id, u]));
  const state = await loadState();
  const pool: BackupPin[] = [];
  const written: number[] = [];
  const used = () => new Set([...getActivePins(state), ...pool.map(b => b.pin), ...written]);
  let rotated = 0;
  let added = 0;

  for (const slot of current) {
    if (!slot.lockUserId || slot.inUse) { pool.push(slot); continue; }
    const user = byId.get(slot.lockUserId);
    if (!user) continue; // gone from the lock: added again below under its name
    if (slot.rotate) {
      if (dryRun) { pool.push(slot); rotated++; continue; }
      const pin = generatePin(used());
      try {
        await updateUser(deviceId, slot.lockUserId, slot.name ?? user.name, pin);
        pool.push({ ...slot, pin, rotate: false, ready: false });
        rotated++;
      } catch (err) {
        pool.push(slot);
        errors.push(`${slot.name}: new PIN failed: ${err instanceof Error ? err.message : String(err)}`);
      }
      continue;
    }
    if (slot.ready && isOnLock(user)) { pool.push(slot); continue; }
    const read = await getUser(deviceId, slot.lockUserId).catch(() => null);
    pool.push(reconcileBackupSlot(slot, isOnLock(user), read?.password));
  }

  const taken = new Set(pool.map(b => b.lockUserId));
  for (const name of missingBackupNames(pool)) {
    const user = users.find(u => u.name === name && !taken.has(u.id));
    if (user) {
      const read = await getUser(deviceId, user.id).catch(() => null);
      if (read?.password) {
        pool.push(reconcileBackupSlot({ pin: read.password, inUse: false, name, lockUserId: user.id }, isOnLock(user), read.password));
        taken.add(user.id);
      }
      continue;
    }
    if (dryRun) { added++; continue; }
    try {
      const pin = generatePin(used());
      await addPermanentUser(deviceId, name, pin);
      written.push(pin);
      added++;
    } catch (err) {
      errors.push(`${name}: add failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { pool, added, rotated, errors };
}

/**
 * Pre-checkin sweep (hourly):
 *   1. sync with Hostex (create missing PINs, revoke cancelled),
 *   2. deliver codes that are now due,
 *   3. within 24h of check-in, fall back to a backup PIN when the lock still isn't synced.
 */
export async function runPreCheckinSweep(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] runPreCheckinSweep');
  const errors: string[] = [];

  // First the lock itself: a code the lock never took must not count as synced
  // when the Hostex sync below re-checks the stay and delivers due codes.
  let lockCheck = { fixed: 0 };
  try {
    const checked = await verifyLockUsers(await loadState(), dryRun);
    lockCheck = checked;
    errors.push(...checked.errors);
    if (!dryRun && checked.fixed) await saveState(checked.state);
  } catch (err) {
    errors.push(`Lock check: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Backup codes on the door, so the fallback below has something to hand out.
  let pool = 'backup pool unchecked';
  try {
    const deviceId = await findDeviceForProperty(ILBUCO_PROPERTY_IDS[0]);
    if (deviceId) {
      const m = await maintainBackupPool((await loadState()).backupPool, deviceId, dryRun);
      errors.push(...m.errors);
      if (!dryRun) await saveState({ ...(await loadState()), backupPool: m.pool });
      const st = poolStats({ backupPool: m.pool });
      pool = `backup pool ${st.available}/${st.total} ready (${m.added} added, ${m.rotated} new PINs)`;
    }
  } catch (err) {
    errors.push(`Backup pool: ${err instanceof Error ? err.message : String(err)}`);
  }

  let sync = { ensured: 0, revoked: 0, errors: [] as string[] };
  try {
    sync = await syncWithHostex(dryRun);
    errors.push(...sync.errors);
  } catch (err) {
    errors.push(`Hostex sync: ${err instanceof Error ? err.message : String(err)}`);
  }

  let state = await loadState();
  let processed = 0;

  if (!dryRun) {
    for (const code of Object.keys(state.pinAssignments)) {
      state = await deliverIfDue(state, code);
    }
  }

  const upcoming = Object.values(state.pinAssignments).filter(a => {
    const h = hoursUntil(a.checkIn);
    return !a.isManual && h > 0 && h < 24 && a.lockStatus !== 'synced' && a.lockStatus !== 'revoked' && a.lockStatus !== 'backup';
  });

  for (const assignment of upcoming) {
    processed++;
    if (dryRun) continue;

    const result = poolCheckOut(state, assignment.reservationCode);
    if ('error' in result) {
      if (!assignment.alertedAt) {
        await sendPricingAlert(
          `🔴 [guest-ops] Lock is not accepting the code for ${assignment.guestName} (${assignment.reservationCode}, ` +
          `check-in ${assignment.checkIn.slice(0, 10)}) and no backup PIN is ready. Check the lock's Wi-Fi.`
        );
        state = upsertAssignment(state, { ...assignment, alertedAt: new Date().toISOString() });
      }
      continue;
    }

    state = { ...state, backupPool: result.pool };
    state = upsertAssignment(state, {
      ...assignment,
      lockStatus: 'backup',
      backupPinIndex: result.index,
      pin: result.pin,
      channels: [], // new code → send again
    });
    state = await deliverIfDue(state, assignment.reservationCode);
    await sendPricingAlert(`🟡 [guest-ops] Using BACKUP PIN for ${assignment.guestName} — lock sync didn't complete in time.`);
  }

  if (!dryRun) await saveState(state);
  return {
    job: 'pre-checkin',
    success: errors.length === 0,
    details: `${lockCheck.fixed} lock users fixed, ${pool}, ${sync.ensured} ensured, ${sync.revoked} revoked, ${processed} on backup path`,
    processed: sync.ensured + sync.revoked + processed,
    errors,
    at: new Date().toISOString(),
  };
}

/**
 * Post-checkout sweep — revoke PINs and recycle backup PINs after checkout.
 * Called by cron hourly; looks back 48h so a missed run still catches up.
 */
export async function runPostCheckoutSweep(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] runPostCheckoutSweep');
  const state = await loadState();
  const errors: string[] = [];
  let processed = 0;

  const due = Object.values(state.pinAssignments).filter(a => {
    const out = new Date(a.checkOut).getTime();
    return !a.isPermanent && out < Date.now() && out > Date.now() - 48 * 3600_000 && a.lockStatus !== 'revoked';
  });

  let s = state;
  for (const a of due) {
    processed++;
    if (dryRun) {
      console.log(`[guest-ops dry-run] Would revoke PIN for ${a.reservationCode}`);
      continue;
    }
    const rep = await revokeAssignment(s, a);
    if (rep.errors?.length) errors.push(...rep.errors);
    s = await loadState(); // revokeAssignment persisted
  }

  return { job: 'post-checkout', success: errors.length === 0, details: `${processed} checked out`, processed, errors, at: new Date().toISOString() };
}

/**
 * Reconciliation sweep — clean up orphaned lock users.
 * Lists all users on each lock, removes any that don't correspond to active reservations.
 * Called by cron daily.
 */
export async function reconcileLocks(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] reconcileLocks');
  let state = await loadState();
  let processed = 0;
  const errors: string[] = [];

  try {
    const devices = await listDevices();
    for (const device of devices) {
      try {
        const users = await listUsers(device.id);
        // Find users that are temporary (type 2) and whose reservation is no longer active
        for (const user of users) {
          if (user.type !== 2) continue; // Only clean up temporary users
          const assignment = Object.values(state.pinAssignments).find(
            a => a.reservationCode === user.name || a.lockUserId === user.id
          );
          if (!assignment) {
            // Not in our assignments: clean up only leftovers of our own guest PINs —
            // legacy reservation-code names always, "Guest DD-MM Unit" names once their
            // stay is over (a name like that could also be typed by hand in the app).
            if (!isGuestLockName(user.name)) continue;
            if (!isReservationCodeName(user.name)) {
              const end = (await getUser(device.id, user.id)).schedule?.daterange[1];
              if (!end || new Date(`${end.replace(' ', 'T')}:00-03:00`).getTime() > Date.now()) continue;
            }
            console.log(`[guest-ops] Found orphaned lock user: ${user.name} (${user.id})`);
            if (!dryRun) {
              try {
                await deleteUser(device.id, user.id);
                processed++;
              } catch (err) {
                errors.push(`Failed to delete orphan ${user.id}: ${err instanceof Error ? err.message : String(err)}`);
              }
            } else {
              processed++;
            }
          } else if (assignment.lockStatus === 'revoked' && assignment.lockUserId === user.id) {
            // Already revoked in our state but still on the lock
            if (!dryRun) {
              try {
                await deleteUser(device.id, user.id);
                processed++;
              } catch (err) {
                errors.push(`Failed to delete revoked ${user.id}: ${err instanceof Error ? err.message : String(err)}`);
              }
            } else {
              processed++;
            }
          }
        }
      } catch (err) {
        errors.push(`Device ${device.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } catch (err) {
    errors.push(`listDevices: ${err instanceof Error ? err.message : String(err)}`);
  }

  await saveState(state);
  return { job: 'reconcile', success: errors.length === 0, details: `${processed} cleaned up`, processed, errors, at: new Date().toISOString() };
}

/**
 * Master dispatcher — called by the /api/guest-ops cron route.
 */
export async function runGuestOpsJob(job: string, dryRun = false, force = false): Promise<GuestOpsReport> {
  switch (job) {
    case 'retries':
      return processRetryQueue(dryRun, force);
    case 'pre-checkin':
      return runPreCheckinSweep(dryRun);
    case 'post-checkout':
      return runPostCheckoutSweep(dryRun);
    case 'reconcile':
      return reconcileLocks(dryRun);
    default:
      return { job, success: false, details: `Unknown job: ${job}`, at: new Date().toISOString() };
  }
}

// ─── Admin actions (manual PIN management) ───────────────────────────────────

export interface ManualPinInput {
  name: string;
  pin: number;
  propertyId?: string;
  checkIn?: string;  // optional — omit for permanent
  checkOut?: string; // optional — omit for permanent
  permanent?: boolean; // default true if no dates
}

/**
 * Create a manual PIN on the lock. Used from the admin panel.
 * Defaults to permanent (type 0, unlimited time) unless dates are provided.
 */
export async function createManualPin(
  input: ManualPinInput,
  createdBy: string
): Promise<GuestOpsReport> {
  console.log(`[guest-ops] createManualPin: ${input.name} (${input.pin})`);
  const errors: string[] = [];

  try {
    const state = await loadState();
    const deviceId = await findDeviceForProperty(input.propertyId || 'default');
    if (!deviceId) {
      return { job: 'create-pin', success: false, details: 'No lock device found', errors: ['No U-tec device'], at: new Date().toISOString() };
    }

    const permanent = input.permanent ?? (!input.checkIn || !input.checkOut);
    const code = `manual-${crypto.randomUUID().slice(0, 8)}`;

    // Program the lock
    if (permanent) {
      await addPermanentUser(deviceId, input.name, input.pin);
    } else {
      const schedule = buildGuestSchedule(input.checkIn!, input.checkOut!);
      await addTemporaryUser(deviceId, input.name, input.pin, schedule);
    }

    // Poll for the user ID
    const userId = await confirmUserAdded(deviceId, input.name);

    // Save to state
    const assignment: PinAssignment = {
      reservationCode: code,
      guestName: input.name,
      propertyId: input.propertyId || 'default',
      propertyName: input.propertyId ? getPropertyName(input.propertyId) : 'Manual',
      channel: 'manual',
      checkIn: input.checkIn || new Date().toISOString(),
      checkOut: input.checkOut || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      pin: input.pin,
      lockStatus: userId ? 'synced' : 'retrying',
      lockUserId: userId ?? undefined,
      channels: [],
      retryAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      isManual: true,
      isPermanent: permanent,
    };

    const newState = upsertAssignment(state, assignment);
    await saveState(newState, createdBy);

    return {
      job: 'create-pin',
      success: true,
      details: `PIN ${input.pin} created for ${input.name}${permanent ? ' (permanent)' : ''}`,
      at: new Date().toISOString(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error('[guest-ops] createManualPin error:', err);
    return { job: 'create-pin', success: false, details: 'Error', errors, at: new Date().toISOString() };
  }
}

/**
 * Delete a single PIN from the lock and state. Used from the admin panel.
 */
export async function deletePin(
  reservationCode: string,
  deletedBy: string
): Promise<GuestOpsReport> {
  console.log(`[guest-ops] deletePin: ${reservationCode}`);
  const errors: string[] = [];

  try {
    const state = await loadState();
    const assignment = state.pinAssignments[reservationCode];
    if (!assignment) {
      return { job: 'delete-pin', success: false, details: 'Not found', errors: ['Assignment not found'], at: new Date().toISOString() };
    }

    // Delete from lock if synced
    if (assignment.lockUserId) {
      try {
        const deviceId = await findDeviceForProperty(assignment.propertyId);
        if (deviceId) {
          await deleteUser(deviceId, assignment.lockUserId);
        }
      } catch (err) {
        errors.push(`Lock delete failed: ${err instanceof Error ? err.message : String(err)}`);
        // Continue anyway — we still want to remove from state
      }
    }

    // Recycle backup PIN if applicable
    let newState = state;
    if (assignment.lockStatus === 'backup') {
      const pool = poolRelease(state, reservationCode);
      newState = { ...state, backupPool: pool };
    }

    // Remove from state
    newState = removeAssignment(newState, reservationCode);
    await saveState(newState, deletedBy);

    return {
      job: 'delete-pin',
      success: errors.length === 0,
      details: `Deleted PIN for ${assignment.guestName}`,
      errors: errors.length ? errors : undefined,
      at: new Date().toISOString(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    return { job: 'delete-pin', success: false, details: 'Error', errors, at: new Date().toISOString() };
  }
}

/**
 * Roll (rotate) all active PINs. Generates a new PIN for each active assignment
 * and updates the lock. Used for security rotation.
 *
 * @param deletedBy  Who triggered the roll
 * @param includeManual  Whether to also roll manual/permanent PINs (default false)
 */
export async function rollAllPins(
  rolledBy: string,
  includeManual = false
): Promise<GuestOpsReport> {
  console.log(`[guest-ops] rollAllPins (includeManual=${includeManual})`);
  const errors: string[] = [];
  let rolled = 0;

  try {
    let state = await loadState();
    const active = Object.values(state.pinAssignments).filter(a => {
      if (a.lockStatus === 'revoked' || a.lockStatus === 'failed') return false;
      if (!includeManual && a.isManual) return false;
      return a.lockUserId !== undefined; // only roll PINs that are on the lock
    });

    for (const assignment of active) {
      try {
        const deviceId = await findDeviceForProperty(assignment.propertyId);
        if (!deviceId || !assignment.lockUserId) continue;

        // Generate new PIN
        const activePins = getActivePins(state);
        if (assignment.pin) activePins.delete(assignment.pin); // free the old one
        const newPin = generatePin(activePins);

        // Update on lock
        // Guest PINs live on the lock as "Guest DD-MM Unit" with their stay window;
        // manual ones under the label typed in the admin.
        const temporary = !assignment.isManual || assignment.isPermanent === false;
        await updateUser(
          deviceId,
          assignment.lockUserId,
          assignment.isManual ? assignment.guestName : lockNameFor(assignment),
          newPin,
          temporary ? buildGuestSchedule(assignment.checkIn, assignment.checkOut) : undefined
        );

        // Update state
        const updated: PinAssignment = {
          ...assignment,
          pin: newPin,
          updatedAt: new Date().toISOString(),
        };
        state = upsertAssignment(state, updated);
        rolled++;
        console.log(`[guest-ops] Rolled PIN for ${assignment.guestName}: ${newPin}`);
      } catch (err) {
        errors.push(`${assignment.guestName}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    await saveState(state, rolledBy);

    if (rolled > 0) {
      await sendPricingAlert(`🔄 [guest-ops] Rolled ${rolled} PIN${rolled > 1 ? 's' : ''} by ${rolledBy}`);
    }

    return {
      job: 'roll-pins',
      success: errors.length === 0,
      details: `Rolled ${rolled} PIN${rolled > 1 ? 's' : ''}`,
      processed: rolled,
      errors: errors.length ? errors : undefined,
      at: new Date().toISOString(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    return { job: 'roll-pins', success: false, details: 'Error', errors, at: new Date().toISOString() };
  }
}
