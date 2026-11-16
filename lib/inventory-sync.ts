/**
 * Inventory protection sync — CLOSE-ONLY suite ↔ whole-house reconciliation
 * (Ivan, 2026-09-07):
 *
 *   - Any suite booked on a night  → whole-house property CLOSED that night
 *   - Whole house booked on a night → all suite properties CLOSED that night
 *   - Whole-house-only window (stay policy): suite properties closed while active
 *
 * Closures are PROPERTY-level (POST /v3/availabilities, available:false), so
 * they cascade to every channel mapped to the property (Airbnb, Booking.com,
 * booking_site, …). The previous implementation pushed listing inventories for
 * booking_site only and unconditionally wrote inventory=1 for "free" nights,
 * which (a) left the OTA channels unprotected and (b) silently reopened manual
 * closures made in the Hostex UI.
 *
 * This sync NEVER opens a date — it only closes. Nights are skipped, not
 * fought over: nights covered by a property's OWN reservation belong to Hostex
 * (native parent-child linking releases them automatically on cancellation),
 * and manual/policy closures stay closed even after their reason disappears.
 * Reopening is a human or Hostex-native decision, never this sync.
 *
 * Nights where the whole house AND a suite are both booked are double-bookings:
 * reported as `conflicts` and skipped on both sides (both are protected by
 * their own reservations there).
 *
 * Live runs first read the current calendar (property availabilities and every
 * linked channel listing) and post only intended nights that still read open,
 * so an unchanged run writes nothing. Re-posting every closure on every webhook
 * fed a loop of its own calendar webhooks (2026-11-16: 3,000 Hostex tasks in
 * 82 minutes, channel pushes ~30 min late). A failed pre-read posts every
 * intended night (protection first).
 *
 * Hostex queues availability writes asynchronously — acceptance ≠ applied.
 * Live runs re-read property availabilities (GET /v3/availabilities) and the
 * all linked channel calendars (POST /v3/listings/calendar) and report a
 * verification status:
 *   'verified'   — every intended close reads closed at both levels
 *   'pending'    — readbacks succeeded but some dates still read open
 *                  (async task may not have landed; next run re-closes)
 *   'unverified' — a readback itself failed; nothing is claimed
 *
 * Triggers: pricing run, Hostex webhook reservation events only (lib/webhook-inventory-trigger.ts), daily cron.
 */

import {
  getOverlappingReservations,
  closePropertyAvailabilities,
  getPropertyAvailabilities,
  getListingInventories,
  getProtectionListings,
} from './hostex-api';
import { suitesClosedForDate, DEFAULT_STAY_POLICY, type StayPolicy } from './stay-policy';
import { addDays } from './season-calendar';
import { IL_BUCO_ROOMS, WHOLE_HOUSE } from './pricing-engine';

const LISTING_TO_PROPERTY: Record<string, number> = {
  '110800-13274': 12282945, // Giardino
  '110801-13274': 12282946, // Terrazzo
  '110802-13274': 12282947, // Paraiso
  '110803-13274': 12282948, // Penthouse
  '113182-13274': 12299611, // Whole House
};

/** Whole-house and suite reservations colliding on the same night. */
export interface SyncConflict {
  count: number;
  /** Sorted nights where the whole house and a suite are both booked */
  dates: string[];
}

export type SyncVerificationStatus = 'verified' | 'pending' | 'unverified' | 'skipped';

export interface SyncVerification {
  status: SyncVerificationStatus;
  /** nights submitted for closing, summed across properties (not deduped) */
  closedDatesChecked: number;
  /** `${property_id} ${date}` entries still reading open at the property level */
  openProperties: string[];
  /** `${listing_id} ${date}` entries whose channel inventory is not 0 */
  openListings: string[];
  /** set when a readback itself failed (status 'unverified') */
  error?: string;
}

export interface SyncResult {
  /** property name → number of nights submitted for closing (0 = nothing to close) */
  pushed: Record<string, number>;
  suiteBookedDates: number;
  casaBookedDates: number;
  conflicts?: SyncConflict;
  verification?: SyncVerification;
}

export async function syncInventories(
  today: string,
  daysAhead: number,
  stayPolicy: StayPolicy = DEFAULT_STAY_POLICY,
  dryRun = false
): Promise<SyncResult> {
  if (!Number.isInteger(daysAhead) || daysAhead < 0 || daysAhead > 365) throw new Error('Invalid sync horizon');
  const start = today;
  const end = addDays(today, daysAhead);

  // Every stay overlapping [start, end], checkout-exclusive. No lookback
  // heuristic: all reservations are paginated and locally filtered, so long stays
  // already in progress are included however far back they checked in
  // (the old 35-day pad missed anything earlier).
  const reservations = await getOverlappingReservations(start, end);

  const bookedByProperty = new Map<number, Set<string>>();
  for (const r of reservations) {
    const set = bookedByProperty.get(r.property_id) ?? new Set<string>();
    for (let d = r.check_in_date < start ? start : r.check_in_date; d < r.check_out_date && d <= end; d = addDays(d, 1)) {
      if (d >= start) set.add(d);
    }
    bookedByProperty.set(r.property_id, set);
  }

  const casaProp = LISTING_TO_PROPERTY[WHOLE_HOUSE.listingId];
  const casaBooked = bookedByProperty.get(casaProp) ?? new Set<string>();

  // Union of all suite-booked nights
  const anySuiteBooked = new Set<string>();
  for (const room of IL_BUCO_ROOMS) {
    const set = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]);
    if (set) for (const d of set) anySuiteBooked.add(d);
  }

  // Double-bookings: casa and a suite both hold the same night. Reported,
  // never written on either side — both are covered by their own reservations.
  const conflictDates = [...casaBooked].filter(d => anySuiteBooked.has(d)).sort();
  const conflicts: SyncConflict | undefined = conflictDates.length
    ? { count: conflictDates.length, dates: conflictDates }
    : undefined;

  // Intended closures per property, own-reservation nights skipped.
  const casaClose = new Set<string>();
  for (const d of anySuiteBooked) {
    if (!casaBooked.has(d)) casaClose.add(d);
  }

  const suiteClose = new Map<number, Set<string>>();
  for (const room of IL_BUCO_ROOMS) {
    const prop = LISTING_TO_PROPERTY[room.listingId];
    const own = bookedByProperty.get(prop) ?? new Set<string>();
    const dates = new Set<string>();
    for (let d = start; d <= end; d = addDays(d, 1)) {
      if (own.has(d)) continue;
      if (casaBooked.has(d) || suitesClosedForDate(d, today, stayPolicy)) dates.add(d);
    }
    suiteClose.set(prop, dates);
  }

  const pushed: Record<string, number> = { [WHOLE_HOUSE.name]: 0 };
  for (const room of IL_BUCO_ROOMS) pushed[room.name] = 0;
  const nameByProperty = new Map<number, string>([
    [casaProp, WHOLE_HOUSE.name],
    ...IL_BUCO_ROOMS.map(r => [LISTING_TO_PROPERTY[r.listingId], r.name] as const),
  ]);

  const intendedByProperty = new Map<number, Set<string>>();
  if (casaClose.size) intendedByProperty.set(casaProp, casaClose);
  for (const [prop, dates] of suiteClose) if (dates.size) intendedByProperty.set(prop, dates);

  // Dry run: report every intended night, no reads beyond reservations.
  if (dryRun) {
    for (const g of groupByDateSet(intendedByProperty)) {
      const res = await closePropertyAvailabilities(g.propertyIds, g.dates, true);
      for (const prop of g.propertyIds) pushed[nameByProperty.get(prop)!] = res.submitted + res.skipped;
    }
    return { pushed, suiteBookedDates: anySuiteBooked.size, casaBookedDates: casaBooked.size, ...(conflicts ? { conflicts } : {}) };
  }

  const closedDatesChecked = [...intendedByProperty.values()].reduce((n, s) => n + s.size, 0);
  let verification: SyncVerification;
  if (!closedDatesChecked) {
    verification = { status: 'skipped', closedDatesChecked: 0, openProperties: [], openListings: [] };
  } else {
    // Resolve channel mappings before any write; partial mappings fail closed.
    const listingByProperty = await getProtectionListings([...intendedByProperty.keys()]);

    // Diff against the live calendar: post only nights that still read open at
    // the property or on any linked channel listing. Re-posting closed nights
    // made Hostex calendar webhooks that triggered the next sync (2026-11-16 loop).
    // A failed pre-read falls back to posting every intended night.
    let toWrite = intendedByProperty;
    let preRead: OpenReadback | undefined;
    try {
      preRead = await readOpenNights(intendedByProperty, listingByProperty, start, end);
      toWrite = new Map();
      for (const [prop, dates] of intendedByProperty) {
        const open = new Set([...dates].filter(d => preRead!.openNights.get(prop)?.has(d)));
        if (open.size) toWrite.set(prop, open);
      }
    } catch (e) {
      console.error('[inventory-sync] pre-read failed, closing every intended night:', e instanceof Error ? e.message : e);
    }

    for (const g of groupByDateSet(toWrite)) {
      const res = await closePropertyAvailabilities(g.propertyIds, g.dates, false);
      for (const prop of g.propertyIds) pushed[nameByProperty.get(prop)!] = res.submitted + res.skipped;
    }

    try {
      // Nothing written and the fresh pre-read shows every night closed: that read is the verification.
      const readback = preRead && !toWrite.size ? preRead : await readOpenNights(intendedByProperty, listingByProperty, start, end);
      verification = {
        status: readback.openProperties.length || readback.openListings.length ? 'pending' : 'verified',
        closedDatesChecked,
        openProperties: readback.openProperties.sort(),
        openListings: readback.openListings.sort(),
      };
    } catch (e) {
      verification = {
        status: 'unverified',
        closedDatesChecked,
        openProperties: [],
        openListings: [],
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return {
    pushed,
    suiteBookedDates: anySuiteBooked.size,
    casaBookedDates: casaBooked.size,
    ...(conflicts ? { conflicts } : {}),
    verification,
  };
}

/** One POST per unique date-set (suites usually share the policy set). */
function groupByDateSet(byProperty: Map<number, Set<string>>): Array<{ propertyIds: number[]; dates: string[] }> {
  const groups = new Map<string, { propertyIds: number[]; dates: string[] }>();
  for (const [prop, dates] of byProperty) {
    const sorted = [...dates].sort();
    if (!sorted.length) continue;
    const key = sorted.join(',');
    const g = groups.get(key) ?? { propertyIds: [], dates: sorted };
    g.propertyIds.push(prop);
    groups.set(key, g);
  }
  return [...groups.values()];
}

interface OpenReadback {
  /** property → intended nights still reading open at the property or on any listing */
  openNights: Map<number, Set<string>>;
  openProperties: string[];
  openListings: string[];
}

/** Read property availability and every linked channel calendar for the intended nights. Throws on any read failure. */
async function readOpenNights(
  intendedByProperty: Map<number, Set<string>>,
  listingByProperty: Map<number, Array<{ channel_type: string; listing_id: string }>>,
  start: string,
  end: string
): Promise<OpenReadback> {
  const openNights = new Map<number, Set<string>>();
  const openProperties: string[] = [];
  const openListings: string[] = [];
  const markOpen = (prop: number, d: string) => {
    const s = openNights.get(prop) ?? new Set<string>();
    s.add(d);
    openNights.set(prop, s);
  };
  // Short windows avoid stale long-range Hostex calendar responses.
  for (let windowStart = start; windowStart <= end; windowStart = addDays(windowStart, 60)) {
    const windowEnd = addDays(windowStart, 59) < end ? addDays(windowStart, 59) : end;
    if (![...intendedByProperty.values()].some(ds => [...ds].some(d => d >= windowStart && d <= windowEnd))) continue;
    const propAvail = await getPropertyAvailabilities([...intendedByProperty.keys()], windowStart, windowEnd);
    const listingInv = await getListingInventories([...listingByProperty.values()].flat(), windowStart, windowEnd);
    for (const [prop, dates] of intendedByProperty) {
      const byDate = propAvail.get(prop);
      for (const d of dates) {
        if (d < windowStart || d > windowEnd) continue;
        if (!byDate || byDate.get(d) !== false) {
          openProperties.push(`${prop} ${d}`);
          markOpen(prop, d);
        }
        for (const listing of listingByProperty.get(prop) ?? []) {
          const inv = listingInv.get(`${listing.channel_type}:${listing.listing_id}`)?.get(d);
          if (inv !== 0) {
            openListings.push(`${listing.listing_id} ${d}`);
            markOpen(prop, d);
          }
        }
      }
    }
  }
  return { openNights, openProperties, openListings };
}
