/**
 * Backup PIN pool — permanent fallback codes for when the lock can't be
 * programmed with a per-guest time-limited code in time.
 *
 * Each slot is a permanent lock user "Respaldo 1…5" that the hourly sweep
 * creates, reads back and keeps on the lock (maintainBackupPool in
 * run-guest-ops). Within 24h of check-in, a stay whose code never reached the
 * lock gets a ready slot's PIN; at checkout the slot is released and gets a new
 * PIN before it is handed out again, so a past guest's code stops opening the door.
 *
 * If no slot is ready, we alert Ivan via Telegram.
 * All logic here is pure; state is persisted via guest-ops-store.
 */

import type { GuestOpsState, BackupPin } from './guest-ops-store';

export const DEFAULT_POOL_SIZE = 5;

/** Lock user name of backup slot n (1-based): "Respaldo 1". */
export function backupLockName(n: number): string {
  return `Respaldo ${n}`;
}

/** Slot names missing from the pool, in order. */
export function missingBackupNames(pool: BackupPin[], size = DEFAULT_POOL_SIZE): string[] {
  const have = new Set(pool.map(b => b.name).filter(Boolean));
  const out: string[] = [];
  for (let n = 1; n <= size; n++) if (!have.has(backupLockName(n))) out.push(backupLockName(n));
  return out;
}

/**
 * A slot can be handed out: free, not waiting for a new PIN, and — for slots we
 * manage on the lock — read back from the lock with this PIN.
 */
export function isAvailable(bp: BackupPin): boolean {
  if (bp.inUse || bp.rotate) return false;
  return bp.lockUserId === undefined || bp.ready === true;
}

/**
 * A managed slot after reading the lock: `readPin` is what U-tec holds for the
 * user, `onLock` its sync_status. Ready only when the lock has exactly our PIN;
 * if someone changed it in the app, follow the lock and confirm on a later run.
 */
export function reconcileBackupSlot(slot: BackupPin, onLock: boolean, readPin: number | undefined): BackupPin {
  if (slot.inUse || slot.rotate) return slot;
  if (readPin !== undefined && readPin !== slot.pin) return { ...slot, pin: readPin, ready: false };
  return { ...slot, ready: onLock && readPin === slot.pin };
}

/**
 * Find the first available backup PIN.
 * Returns the index in the pool array, or null if exhausted.
 * Pure function.
 */
export function findAvailable(state: GuestOpsState): number | null {
  const i = state.backupPool.findIndex(isAvailable);
  return i === -1 ? null : i;
}

/**
 * Check out a backup PIN for a reservation.
 * Returns { newIndex, newPin, updatedPool } or { error: 'exhausted' }.
 * Pure function — returns new objects, doesn't mutate input.
 */
export function checkOut(
  state: GuestOpsState,
  reservationCode: string
): { pool: BackupPin[]; index: number; pin: number } | { error: 'exhausted' } {
  const idx = findAvailable(state);
  if (idx === null) return { error: 'exhausted' };

  const pool = state.backupPool.map((bp, i) =>
    i === idx
      ? {
          ...bp,
          inUse: true,
          reservationCode,
          assignedAt: new Date().toISOString(),
        }
      : bp
  );

  return { pool, index: idx, pin: pool[idx].pin };
}

/**
 * Release a backup PIN back to the pool (at checkout or when the guest leaves).
 * Returns the updated pool.
 * Pure function.
 */
export function release(state: GuestOpsState, reservationCode: string): BackupPin[] {
  return state.backupPool.map(bp => {
    if (bp.reservationCode !== reservationCode) return bp;
    // Legacy hand-provisioned PIN: nothing we can rotate, keep it as it was.
    if (!bp.lockUserId) return { pin: bp.pin, inUse: false };
    // Our slot: the guest knows this PIN, so it gets a new one before reuse.
    return { pin: bp.pin, inUse: false, name: bp.name, lockUserId: bp.lockUserId, ready: false, rotate: true };
  });
}

/**
 * Check if the pool is exhausted (all PINs in use).
 * Pure function.
 */
export function isExhausted(state: GuestOpsState): boolean {
  return findAvailable(state) === null;
}

/**
 * Count how many PINs are available vs in use.
 * Pure function.
 */
export function poolStats(state: Pick<GuestOpsState, 'backupPool'>): { available: number; inUse: number; total: number } {
  return {
    total: state.backupPool.length,
    inUse: state.backupPool.filter(bp => bp.inUse).length,
    available: state.backupPool.filter(isAvailable).length,
  };
}

/**
 * Generate a unique 4-digit PIN (Ivan 2026-10-29: four digits are enough at the
 * door; U-tec takes 4–8). Skips codes already in use and the guessable ones —
 * one repeated digit (1111) or a straight run (1234, 9876).
 */
export function generatePin(existingPins: Set<number>, random: () => number = Math.random): number {
  for (;;) {
    const pin = 1000 + Math.floor(random() * 9000); // 1000–9999
    if (!existingPins.has(pin) && !isGuessablePin(pin)) return pin;
  }
}

/**
 * A PIN the guest hasn't been sent yet keeps its number only if it is still in the
 * current format; older 6-digit ones are swapped before they reach the lock.
 */
export function needsNewPin(pin: number | undefined, delivered: boolean): boolean {
  if (delivered || pin === undefined) return false;
  return pin < 1000 || pin > 9999 || isGuessablePin(pin);
}

export function isGuessablePin(pin: number): boolean {
  const d = String(pin).split('').map(Number);
  const steps = d.slice(1).map((x, i) => x - d[i]);
  return steps.every(s => s === 0) || steps.every(s => s === 1) || steps.every(s => s === -1);
}
