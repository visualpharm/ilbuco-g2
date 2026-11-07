/**
 * Guest lock users — pure helpers shared by the U-tec client and the guest-ops
 * orchestrator: how a guest code is named on the lock, how we recognise our own
 * users, and whether the physical lock has actually accepted a code.
 *
 * Names are for people reading the lock's user list ("Bruno Sergio 07-11 Giardino");
 * matching is by the U-tec user id we store. The reservation code is only a
 * fallback for users created before ids were tracked.
 */

import { formatLockTime } from './guest-pin-times';
import { isReservationCodeName } from './guest-ops-store';

/** Lock user names stay readable in the Xthings app list. U-tec itself took 66 chars in a test. */
export const LOCK_NAME_MAX = 40;

/** Short unit label on the lock (the whole-house listing is just "Casa"). */
const UNIT_LABELS: Record<string, string> = {
  'Il Buco (Whole House)': 'Casa',
  'Recharge Retreat': 'Recharge',
};

export function unitLabel(propertyName: string): string {
  return UNIT_LABELS[propertyName] ?? propertyName;
}

const UNIT_SUFFIX = ['Giardino', 'Terrazzo', 'Paraiso', 'Penthouse', 'Casa', 'Recharge'].join('|');
const GUEST_NAME_RE = new RegExp(` \\d{2}-\\d{2} (${UNIT_SUFFIX})$`);

/** Guest names arrive as typed on the OTA: "maria laura salar", "BRUNO SERGIO". */
function tidyGuestName(raw: string): string {
  const words = raw
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}' .-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const oneCase = words.every(w => w === w.toLowerCase()) || words.every(w => w === w.toUpperCase());
  const named = oneCase
    ? words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    : words;
  return named.join(' ') || 'Huésped';
}

/** "Bruno Sergio 07-11 Giardino" — guest, check-in day-month (Argentina time), unit. */
export function guestLockName(guestName: string, checkIn: string, propertyName: string, max = LOCK_NAME_MAX): string {
  const [, month, day] = formatLockTime(checkIn).slice(0, 10).split('-');
  const tail = ` ${day}-${month} ${unitLabel(propertyName)}`;
  const room = max - tail.length;
  const words = tidyGuestName(guestName).split(' ');
  // Too long: drop middle names, then shorten the surname to an initial, then cut.
  const candidates = [
    words.join(' '),
    words.length > 2 ? `${words[0]} ${words[words.length - 1]}` : '',
    words.length > 1 ? `${words[0]} ${words[words.length - 1][0]}.` : '',
    words[0],
  ].filter(Boolean);
  const name = candidates.find(c => c.length <= room) ?? words[0].slice(0, Math.max(1, room));
  return name + tail;
}

/** Name of a guest code we created: new style or the legacy reservation code. */
export function isGuestLockName(name: string): boolean {
  return GUEST_NAME_RE.test(name) || isReservationCodeName(name);
}

// ─── Lock users as U-tec returns them ────────────────────────────────────────

export interface LockUserLike {
  id: string;
  name: string;
  /** 1 = on the physical lock, 0 = only in the U-tec cloud (the lock has not taken it yet). */
  sync_status?: number;
}

/** U-tec sends sync_status as 0/1 (number or string); 0 must survive parsing. */
export function parseSyncStatus(raw: unknown): number | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * The guest can open the door with this code. Only an explicit 0 means "not yet":
 * a missing field (older API answers) is not a reason to withhold a code.
 */
export function isOnLock(user: LockUserLike): boolean {
  return user.sync_status !== 0;
}

/**
 * What a code we consider synced needs, judged from the lock's user list:
 * - ok: on the door under its name;
 * - rename: on the door, old name — rename with the same PIN, the door keeps working,
 *   so the code stays synced even if the rename takes minutes to reach the lock;
 * - push: only in the U-tec cloud (sync_status 0) — write it again, no delivery until it lands;
 * - missing: gone from the lock — add it again.
 */
export type LockUserVerdict = 'ok' | 'rename' | 'push' | 'missing';

export function lockUserVerdict(user: LockUserLike | undefined, expectedName: string): LockUserVerdict {
  if (!user) return 'missing';
  if (!isOnLock(user)) return 'push';
  return user.name === expectedName ? 'ok' : 'rename';
}

/** Find our lock user: stored id first, then the expected name, then the legacy reservation-code name. */
export function findOwnLockUser<U extends LockUserLike>(
  users: U[],
  ref: { lockUserId?: string; expectedName: string; reservationCode: string; takenIds?: Set<string> },
): U | undefined {
  if (ref.lockUserId) {
    const byId = users.find(u => u.id === ref.lockUserId);
    if (byId) return byId;
  }
  const free = (u: U) => !ref.takenIds?.has(u.id);
  return users.find(u => u.name === ref.expectedName && free(u))
    ?? users.find(u => u.name === ref.reservationCode && free(u));
}
