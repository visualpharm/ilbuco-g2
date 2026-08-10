/**
 * Backup PIN pool — static fallback PINs for when the lock can't be programmed
 * with a per-guest time-limited code.
 *
 * These PINs are provisioned MANUALLY on the lock (by Ivan) and stored here.
 * When the Fibonacci retry queue exhausts or a check-in is imminent and the
 * lock is still offline, we check out a backup PIN, deliver it to the guest,
 * and recycle it back to the pool at checkout.
 *
 * The pool is small (5 PINs) — if exhausted, we alert Ivan via Telegram.
 * All logic is pure; state is persisted via guest-ops-store.
 */

import type { GuestOpsState, BackupPin } from './guest-ops-store';

export const DEFAULT_POOL_SIZE = 5;

/**
 * Find the first available (not in-use) backup PIN.
 * Returns the index in the pool array, or null if exhausted.
 * Pure function.
 */
export function findAvailable(state: GuestOpsState): number | null {
  for (let i = 0; i < state.backupPool.length; i++) {
    if (!state.backupPool[i].inUse) return i;
  }
  return null;
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
  return state.backupPool.map(bp =>
    bp.reservationCode === reservationCode
      ? { pin: bp.pin, inUse: false } // clear assignment data, keep the PIN
      : bp
  );
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
export function poolStats(state: GuestOpsState): { available: number; inUse: number; total: number } {
  const inUse = state.backupPool.filter(bp => bp.inUse).length;
  return {
    total: state.backupPool.length,
    inUse,
    available: state.backupPool.length - inUse,
  };
}
