/**
 * Guest-ops state persistence — Vercel Blob (store: ilbuco-guest-ops).
 *
 * Holds all state for the guest PIN automation:
 *   - pinAssignments: reservation_code → { guest, property, dates, pin, lockStatus, ... }
 *   - retryQueue: pending/exhausted lock operations with Fibonacci backoff
 *   - backupPool: static backup PINs available for fallback
 *   - contacts: phone → { name, email, optInAt, reservations }
 *
 * Uses the shared versioned-blob-store: each save creates a NEW pathname with a
 * 128-bit crypto-random segment (guest-ops-v2/<ms>-<rand>.json) so Vercel Blob's
 * CDN doesn't serve stale data on read-after-write AND the URL holding guest
 * PINs/PII is not enumerable (security audit 2026-09-03, finding 1). Legacy
 * guest-ops-v/<ms>.json blobs keep loading until pruning retires them.
 */

import { createVersionedStore } from './versioned-blob-store';
import type { QueueItem } from './utec-retry';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LockStatus = 'synced' | 'retrying' | 'failed' | 'revoked' | 'backup';
export type DeliveryChannel = 'whatsapp' | 'email' | 'hostex';

export interface ChannelStatus {
  channel: DeliveryChannel;
  sent: boolean;
  sentAt?: string;
  error?: string;
}

export interface PinAssignment {
  /** Hostex reservation code (our primary key). For manual PINs, a generated ID like "manual-<uuid>". */
  reservationCode: string;
  /** Guest details from Hostex. */
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  /** Property ID + name from Hostex. */
  propertyId: string;
  propertyName: string;
  /** Booking source channel. */
  channel: string;
  /** ISO dates. */
  checkIn: string;
  checkOut: string;
  /** The PIN (4-8 digit). Null if not yet generated. */
  pin: number | null;
  /** Whether this PIN is programmed on the lock. */
  lockStatus: LockStatus;
  /** U-tec user ID once the PIN is synced. */
  lockUserId?: string;
  /** If using a backup PIN, which one from the pool. */
  backupPinIndex?: number;
  /** Per-channel delivery status. */
  channels: ChannelStatus[];
  /** Retry attempts for lock sync. */
  retryAttempts: number;
  /** ISO timestamps. */
  createdAt: string;
  updatedAt: string;
  /** Who created/modified this (role from getCaller). */
  createdBy?: string;
  /** True if created manually from the admin panel (not from a reservation). */
  isManual?: boolean;
  /** True if the PIN is permanent (type 0, no time limit). Manual PINs default to this. */
  isPermanent?: boolean;
}

export interface BackupPin {
  /** The actual PIN digits, provisioned manually on the lock. */
  pin: number;
  /** Whether this PIN is currently checked out to a reservation. */
  inUse: boolean;
  /** Which reservation is using it. */
  reservationCode?: string;
  /** When it was assigned. */
  assignedAt?: string;
}

export interface Contact {
  /** Normalized phone (country code + number, no +, no spaces). */
  phone: string;
  name: string;
  email?: string;
  /** When they opted in by messaging us first. */
  optInAt: string;
  /** Reservation codes linked to this contact. */
  reservations: string[];
}

export interface GuestOpsState {
  version: number;
  pinAssignments: Record<string, PinAssignment>;
  retryQueue: QueueItem[];
  backupPool: BackupPin[];
  contacts: Record<string, Contact>;
  updatedAt?: string;
  updatedBy?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export function defaultState(): GuestOpsState {
  return {
    version: 1,
    pinAssignments: {},
    retryQueue: [],
    backupPool: [],
    contacts: {},
  };
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const KEEP_VERSIONS = 6;

// Security audit 2026-09-03, finding 1: this state holds active door PINs and
// guest PII, and the blob store domain is public, so the blob URL is the
// capability — it must not be enumerable. New writes go to guest-ops-v2/ with
// a 128-bit crypto-random pathname segment; loads still see legacy
// guest-ops-v/<ms>.json blobs (the list prefix 'guest-ops-v' matches both),
// so existing bookings keep working across the migration, and best-effort
// pruning retires the guessable legacy URLs within KEEP_VERSIONS saves.
const guestOpsStore = createVersionedStore<GuestOpsState>({
  generationPrefix: 'guest-ops-v2/',
  listPrefix: 'guest-ops-v',
  keepVersions: KEEP_VERSIONS,
  defaults: defaultState,
  // Merge with defaults so new fields never come back undefined
  merge: (def, state) => ({
    ...def,
    ...state,
    pinAssignments: state.pinAssignments ?? {},
    retryQueue: state.retryQueue ?? [],
    backupPool: state.backupPool ?? [],
    contacts: state.contacts ?? {},
  }),
});

/**
 * Load the latest state from Vercel Blob.
 * Returns defaults on first run or transient error.
 */
export async function loadState(): Promise<GuestOpsState> {
  try {
    return await guestOpsStore.load();
  } catch {
    return defaultState();
  }
}

/**
 * Save state to Vercel Blob with a versioned, unguessable pathname.
 * Old versions are pruned to KEEP_VERSIONS.
 */
export async function saveState(state: GuestOpsState, by?: string): Promise<void> {
  state.updatedAt = new Date().toISOString();
  if (by) state.updatedBy = by;
  await guestOpsStore.save(state);
}

// ─── Pure update helpers (return new state, don't mutate) ─────────────────────

/**
 * Upsert a PIN assignment into the state.
 * Returns a NEW state object (immutable update).
 */
export function upsertAssignment(
  state: GuestOpsState,
  assignment: PinAssignment
): GuestOpsState {
  return {
    ...state,
    pinAssignments: {
      ...state.pinAssignments,
      [assignment.reservationCode]: {
        ...assignment,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/**
 * Remove a PIN assignment (used after checkout cleanup).
 * Returns a NEW state object.
 */
export function removeAssignment(
  state: GuestOpsState,
  reservationCode: string
): GuestOpsState {
  const { [reservationCode]: _, ...rest } = state.pinAssignments;
  return { ...state, pinAssignments: rest };
}

/**
 * Update the retry queue (replace or remove items).
 * Returns a NEW state object.
 */
export function updateRetryQueue(
  state: GuestOpsState,
  updater: (queue: QueueItem[]) => QueueItem[]
): GuestOpsState {
  return { ...state, retryQueue: updater([...state.retryQueue]) };
}

/**
 * Upsert a contact into the state.
 * Returns a NEW state object.
 */
export function upsertContact(state: GuestOpsState, contact: Contact): GuestOpsState {
  return {
    ...state,
    contacts: {
      ...state.contacts,
      [contact.phone]: contact,
    },
  };
}

/**
 * Seed the backup PIN pool with initial codes.
 * Returns a NEW state object.
 */
export function seedBackupPool(state: GuestOpsState, pins: number[]): GuestOpsState {
  return {
    ...state,
    backupPool: pins.map(pin => ({ pin, inUse: false })),
  };
}

// ─── Query helpers ───────────────────────────────────────────────────────────

/**
 * Get all assignments as an array, sorted by check-in date (ascending).
 */
export function listAssignments(state: GuestOpsState): PinAssignment[] {
  return Object.values(state.pinAssignments).sort(
    (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
  );
}

/**
 * Find assignments by various filters. Pure function.
 */
export function filterAssignments(
  state: GuestOpsState,
  filters: {
    propertyId?: string;
    status?: LockStatus;
    checkInAfter?: string;
    checkInBefore?: string;
  }
): PinAssignment[] {
  return listAssignments(state).filter(a => {
    if (filters.propertyId && a.propertyId !== filters.propertyId) return false;
    if (filters.status && a.lockStatus !== filters.status) return false;
    if (filters.checkInAfter && a.checkIn < filters.checkInAfter) return false;
    if (filters.checkInBefore && a.checkIn > filters.checkInBefore) return false;
    return true;
  });
}

/**
 * Get assignments that are checking in within the next N hours.
 * Used by the pre-checkin sweep.
 */
export function getUpcomingCheckins(state: GuestOpsState, withinHours: number): PinAssignment[] {
  const now = Date.now();
  const cutoff = now + withinHours * 3600 * 1000;
  return listAssignments(state).filter(a => {
    const checkIn = new Date(a.checkIn).getTime();
    return checkIn >= now && checkIn <= cutoff;
  });
}

/**
 * Get assignments that checked out within the last N hours.
 * Used by the post-checkout sweep.
 */
export function getRecentCheckouts(state: GuestOpsState, withinHours: number): PinAssignment[] {
  const now = Date.now();
  const cutoff = now - withinHours * 3600 * 1000;
  return listAssignments(state).filter(a => {
    const checkOut = new Date(a.checkOut).getTime();
    return checkOut <= now && checkOut >= cutoff;
  });
}
