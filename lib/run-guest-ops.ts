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
  buildGuestSchedule,
} from './utec-api';
import {
  createQueueItem,
  recordFailure,
  isReady,
  findPending,
  type QueueItem,
} from './utec-retry';
import { checkOut as poolCheckOut, release as poolRelease } from './pin-pool';
import { deliverPin, type PinMessageData } from './messaging';
import { getPropertyName } from './hostex-api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a unique 6-digit PIN that doesn't collide with existing active PINs.
 */
function generatePin(existingPins: Set<number>): number {
  let pin: number;
  do {
    pin = Math.floor(100000 + Math.random() * 900000); // 100000–999999
  } while (existingPins.has(pin));
  return pin;
}

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

/**
 * Process a new reservation: generate PIN, try to program the lock, deliver.
 *
 * Called fire-and-forget from the Hostex webhook (must not block the 3s ACK).
 */
export async function handleNewReservation(
  reservation: {
    code: string;
    guestName: string;
    guestEmail?: string;
    guestPhone?: string;
    propertyId: string;
    checkIn: string;
    checkOut: string;
    channel: string;
    conversationId?: string;
  },
  dryRun = false
): Promise<GuestOpsReport> {
  const errors: string[] = [];
  console.log(`[guest-ops] handleNewReservation ${reservation.code} (${reservation.guestName})`);

  try {
    const state = await loadState();

    // Skip if already processed
    const existing = state.pinAssignments[reservation.code];
    if (existing && existing.lockStatus === 'synced') {
      return { job: 'new-reservation', success: true, details: 'Already synced', at: new Date().toISOString() };
    }

    // Generate PIN
    const activePins = getActivePins(state);
    const pin = generatePin(activePins);
    const propertyName = getPropertyName(reservation.propertyId);

    // Create the assignment record
    const assignment: PinAssignment = {
      reservationCode: reservation.code,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      guestPhone: reservation.guestPhone,
      propertyId: reservation.propertyId,
      propertyName,
      channel: reservation.channel,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      pin,
      lockStatus: 'retrying',
      channels: [],
      retryAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newState = upsertAssignment(state, assignment);

    if (dryRun) {
      console.log(`[guest-ops dry-run] Would program PIN ${pin} for ${reservation.guestName}`);
      return {
        job: 'new-reservation',
        success: true,
        details: `Dry-run: PIN ${pin} generated for ${reservation.guestName}`,
        at: new Date().toISOString(),
      };
    }

    // Try to program the lock
    const deviceId = await findDeviceForProperty(reservation.propertyId);
    if (!deviceId) {
      errors.push('No U-tec device found — is the lock registered?');
      assignment.lockStatus = 'failed';
      newState = upsertAssignment(state, assignment);
      await saveState(newState);
      // Still deliver the PIN — it may be a manual-entry lock scenario
      await deliverThePin(newState, reservation.code);
      return { job: 'new-reservation', success: false, details: 'No lock device', errors, at: new Date().toISOString() };
    }

    // Dedup check: does a user with this name (reservation code) already exist?
    const users = await listUsers(deviceId);
    const existingUser = users.find(u => u.name === reservation.code);
    if (existingUser) {
      // Already programmed — mark synced
      assignment.lockStatus = 'synced';
      assignment.lockUserId = existingUser.id;
      newState = upsertAssignment(state, assignment);
      await saveState(newState);
      await deliverThePin(newState, reservation.code);
      return { job: 'new-reservation', success: true, details: 'PIN already on lock', at: new Date().toISOString() };
    }

    // Attempt to add the temporary user
    const schedule = buildGuestSchedule(reservation.checkIn, reservation.checkOut);
    try {
      await addTemporaryUser(deviceId, reservation.code, pin, schedule);

      // Poll to confirm (add returns no ID)
      const userId = await confirmUserAdded(deviceId, reservation.code);
      if (userId) {
        assignment.lockStatus = 'synced';
        assignment.lockUserId = userId;
        newState = upsertAssignment(state, assignment);
        await saveState(newState);
        await deliverThePin(newState, reservation.code);
        console.log(`[guest-ops] ✅ PIN ${pin} synced to lock for ${reservation.code}`);
        return { job: 'new-reservation', success: true, details: `PIN synced (user ${userId})`, at: new Date().toISOString() };
      } else {
        // Add succeeded but we couldn't confirm — enqueue for retry confirmation
        errors.push('Add command sent but confirmation timed out — will verify on next sweep');
        assignment.lockStatus = 'retrying';
        newState = upsertAssignment(state, assignment);

        // Enqueue a confirmation check
        const queueItem = createQueueItem(reservation.code, 'add', deviceId, {
          schedule,
          pin,
        });
        newState = updateRetryQueue(newState, q => [...q, queueItem]);
        await saveState(newState);
        await deliverThePin(newState, reservation.code);
      }
    } catch (err) {
      // Lock programming failed — enqueue for Fibonacci retry
      console.error(`[guest-ops] Lock programming failed for ${reservation.code}:`, err);
      const queueItem = createQueueItem(reservation.code, 'add', deviceId, {
        schedule,
        pin,
      });
      const failedItem = recordFailure(queueItem, err);
      newState = updateRetryQueue(newState, q => [...q, failedItem]);
      assignment.retryAttempts = failedItem.attempts;
      newState = upsertAssignment(newState, assignment);
      await saveState(newState);

      // Still deliver — guest needs to know their code
      await deliverThePin(newState, reservation.code);

      errors.push(`Lock programming failed: ${err instanceof Error ? err.message : String(err)}`);
      return { job: 'new-reservation', success: false, details: 'Enqueued for retry', errors, at: new Date().toISOString() };
    }

    return { job: 'new-reservation', success: true, details: 'Processed', at: new Date().toISOString() };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error('[guest-ops] handleNewReservation error:', err);
    await sendPricingAlert(`⚠️ [guest-ops] Failed to process reservation ${reservation.code}: ${msg}`);
    return { job: 'new-reservation', success: false, details: 'Error', errors, at: new Date().toISOString() };
  }
}

// ─── Deliver PIN (internal helper) ───────────────────────────────────────────

async function deliverThePin(state: GuestOpsState, reservationCode: string): Promise<void> {
  const assignment = state.pinAssignments[reservationCode];
  if (!assignment || !assignment.pin) return;

  const data: PinMessageData = {
    guestName: assignment.guestName,
    pin: assignment.pin,
    propertyName: assignment.propertyName,
    checkIn: assignment.checkIn,
    checkOut: assignment.checkOut,
  };

  const results = await deliverPin(data, {
    guestPhone: assignment.guestPhone,
    guestEmail: assignment.guestEmail,
    conversationId: undefined, // TODO: pass conversationId from reservation
  });

  // Update the assignment with delivery results
  const updated: PinAssignment = {
    ...assignment,
    channels: results,
    updatedAt: new Date().toISOString(),
  };
  const newState = upsertAssignment(state, updated);
  await saveState(newState);
}

// ─── Cron jobs ───────────────────────────────────────────────────────────────

/**
 * Process the retry queue — attempt items whose nextAttemptAt has passed.
 * Called by cron every 15 minutes.
 */
export async function processRetryQueue(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] processRetryQueue');
  let state = await loadState();
  let processed = 0;
  const errors: string[] = [];
  const now = new Date();

  const readyItems = state.retryQueue.filter(q => isReady(q, now));
  if (!readyItems.length) {
    return { job: 'retries', success: true, details: 'No items ready', processed: 0, at: now.toISOString() };
  }

  for (const item of readyItems) {
    processed++;
    try {
      if (dryRun) {
        console.log(`[guest-ops dry-run] Would retry ${item.operation} for ${item.reservationCode}`);
        continue;
      }

      const assignment = state.pinAssignments[item.reservationCode];
      if (!assignment) {
        // Assignment was cleaned up — remove from queue
        state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
        continue;
      }

      if (item.operation === 'add') {
        // Check dedup first
        const users = await listUsers(item.deviceId);
        const existing = users.find(u => u.name === item.reservationCode);
        if (existing) {
          // Already synced — mark and remove from queue
          const synced: PinAssignment = {
            ...assignment,
            lockStatus: 'synced',
            lockUserId: existing.id,
            updatedAt: now.toISOString(),
          };
          state = upsertAssignment(state, synced);
          state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
          continue;
        }

        // Retry the add
        const schedule = buildGuestSchedule(assignment.checkIn, assignment.checkOut);
        await addTemporaryUser(item.deviceId, item.reservationCode, assignment.pin!, schedule);
        const userId = await confirmUserAdded(item.deviceId, item.reservationCode);

        if (userId) {
          const synced: PinAssignment = {
            ...assignment,
            lockStatus: 'synced',
            lockUserId: userId,
            updatedAt: now.toISOString(),
          };
          state = upsertAssignment(state, synced);
          state = updateRetryQueue(state, q => q.filter(qi => qi !== item));
          console.log(`[guest-ops] ✅ Retry succeeded for ${item.reservationCode}`);
        } else {
          // Record failure and advance Fibonacci
          const failed = recordFailure(item, new Error('Confirmation timed out'));
          if (failed) {
            state = updateRetryQueue(state, q => q.map(qi => qi === item ? failed : qi));
            const updated: PinAssignment = { ...assignment, retryAttempts: failed.attempts };
            state = upsertAssignment(state, updated);
          }
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
          state = upsertAssignment(state, { ...assignment, retryAttempts: failed.attempts });
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

/**
 * Pre-checkin sweep — ensure PINs are ready for check-ins within 24h.
 * If lock sync is still failing, fall back to backup PIN pool.
 * Called by cron hourly.
 */
export async function runPreCheckinSweep(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] runPreCheckinSweep');
  let state = await loadState();
  const upcoming = Object.values(state.pinAssignments).filter(a => {
    const checkIn = new Date(a.checkIn).getTime();
    const now = Date.now();
    const in24h = now + 24 * 3600 * 1000;
    return checkIn > now && checkIn < in24h && a.lockStatus !== 'synced' && a.lockStatus !== 'revoked';
  });

  let processed = 0;
  for (const assignment of upcoming) {
    processed++;
    if (assignment.lockStatus === 'backup') continue; // already using backup

    // Check if the lock sync has failed or is still retrying close to check-in
    if (assignment.lockStatus === 'failed' || assignment.lockStatus === 'retrying') {
      if (dryRun) {
        console.log(`[guest-ops dry-run] Would assign backup PIN for ${assignment.reservationCode}`);
        continue;
      }

      // Assign a backup PIN
      const result = poolCheckOut(state, assignment.reservationCode);
      if ('error' in result) {
        await sendPricingAlert(
          `🔴 [guest-ops] Backup PIN pool EXHAUSTED — cannot cover ${assignment.guestName} (${assignment.reservationCode}). Manual intervention needed!`
        );
        continue;
      }

      state = { ...state, backupPool: result.pool };
      const updated: PinAssignment = {
        ...assignment,
        lockStatus: 'backup',
        backupPinIndex: result.index,
        pin: result.pin, // override with the backup PIN
        updatedAt: new Date().toISOString(),
      };
      state = upsertAssignment(state, updated);

      // Re-deliver the backup PIN to the guest
      await deliverThePin(state, assignment.reservationCode);

      await sendPricingAlert(
        `🟡 [guest-ops] Using BACKUP PIN for ${assignment.guestName} — lock sync didn't complete in time.`
      );
    }
  }

  await saveState(state);
  return { job: 'pre-checkin', success: true, details: `${upcoming.length} upcoming, ${processed} processed`, processed, at: new Date().toISOString() };
}

// findDeviceForProperty already caches via deviceIdCache declared above it.

/**
 * Post-checkout sweep — revoke PINs and recycle backup PINs after checkout.
 * Called by cron hourly.
 */
export async function runPostCheckoutSweep(dryRun = false): Promise<GuestOpsReport> {
  console.log('[guest-ops] runPostCheckoutSweep');
  let state = await loadState();
  const now = Date.now();
  let processed = 0;

  const recent = Object.values(state.pinAssignments).filter(a => {
    const checkOut = new Date(a.checkOut).getTime();
    return checkOut < now && checkOut > now - 6 * 3600 * 1000 && a.lockStatus !== 'revoked';
  });

  for (const assignment of recent) {
    processed++;
    if (dryRun) {
      console.log(`[guest-ops dry-run] Would revoke PIN for ${assignment.reservationCode}`);
      continue;
    }

    // If synced to lock, delete the user
    if (assignment.lockUserId) {
      try {
        const deviceId = await findDeviceForProperty(assignment.propertyId);
        if (deviceId) {
          await deleteUser(deviceId, assignment.lockUserId);
        }
      } catch (err) {
        console.error(`[guest-ops] Failed to revoke ${assignment.reservationCode}:`, err);
        // Enqueue for retry
        const deviceId = await findDeviceForProperty(assignment.propertyId);
        if (deviceId) {
          const queueItem = createQueueItem(assignment.reservationCode, 'delete', deviceId, { id: assignment.lockUserId });
          const failedItem = recordFailure(queueItem, err);
          state = updateRetryQueue(state, q => [...q, failedItem]);
        }
      }
    }

    // If using a backup PIN, recycle it
    if (assignment.lockStatus === 'backup') {
      const pool = poolRelease(state, assignment.reservationCode);
      state = { ...state, backupPool: pool };
    }

    // Mark as revoked
    const revoked: PinAssignment = {
      ...assignment,
      lockStatus: 'revoked',
      updatedAt: new Date().toISOString(),
    };
    state = upsertAssignment(state, revoked);
    console.log(`[guest-ops] 🔒 Revoked PIN for ${assignment.reservationCode}`);
  }

  await saveState(state);
  return { job: 'post-checkout', success: true, details: `${processed} checked out`, processed, at: new Date().toISOString() };
}

// findDeviceForProperty already caches via deviceIdCache declared above it.

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
            // Orphaned user — not in our assignments. Clean up if older than checkout.
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
export async function runGuestOpsJob(job: string, dryRun = false): Promise<GuestOpsReport> {
  switch (job) {
    case 'retries':
      return processRetryQueue(dryRun);
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
        await updateUser(deviceId, assignment.lockUserId, assignment.guestName, newPin);

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
