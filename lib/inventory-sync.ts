/**
 * Inventory sync — keeps suite ↔ whole-house availability consistent (Ivan, 2026-06-11):
 *
 *   - Any suite booked on a date  → whole house CLOSED that date
 *   - Whole house booked on a date → all suites CLOSED that date
 *   - Whole-house-only window (stay policy): suites closed for high-season dates
 *     until the policy's `until` date
 *   - Everything else → open
 *
 * The push is unconditional and idempotent (desired state, run-length-encoded),
 * which sidesteps Hostex's stale long-window calendar reads. Dates covered by a
 * listing's OWN reservation are skipped — Hostex owns those.
 *
 * ⚠️ Manual closures made directly in the Hostex UI will be reopened by this sync.
 * Block dates via a (zero-price) reservation or extend the stay policy instead.
 *
 * Triggers: weekly pricing run, Hostex webhook reservation events, daily cron.
 */

import { getReservations, updateListingInventories, type InventoryEntry } from './hostex-api';
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

export interface SyncResult {
  /** listing name → number of pushed (start,end,inventory) ranges */
  pushed: Record<string, number>;
  suiteBookedDates: number;
  casaBookedDates: number;
}

/** Collapse a sorted day→inventory map into ranges, skipping `skip` dates. */
function collapseInventory(
  start: string,
  end: string,
  desired: (d: string) => 0 | 1,
  skip: Set<string>
): InventoryEntry[] {
  const out: InventoryEntry[] = [];
  let run: { start: string; end: string; inv: 0 | 1 } | null = null;
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (skip.has(d)) {
      if (run) { out.push({ start_date: run.start, end_date: run.end, inventory: run.inv }); run = null; }
      continue;
    }
    const inv = desired(d);
    if (run && run.inv === inv) run.end = d;
    else {
      if (run) out.push({ start_date: run.start, end_date: run.end, inventory: run.inv });
      run = { start: d, end: d, inv };
    }
  }
  if (run) out.push({ start_date: run.start, end_date: run.end, inventory: run.inv });
  return out;
}

export async function syncInventories(
  today: string,
  daysAhead: number,
  stayPolicy: StayPolicy = DEFAULT_STAY_POLICY,
  dryRun = false
): Promise<SyncResult> {
  const start = today;
  const end = addDays(today, daysAhead);

  // Reservations: pad 35 days back to catch stays already in progress
  const reservations = await getReservations(addDays(start, -35), end);

  const bookedByProperty = new Map<number, Set<string>>();
  for (const r of reservations) {
    const set = bookedByProperty.get(r.property_id) ?? new Set<string>();
    for (let d = r.check_in_date; d < r.check_out_date; d = addDays(d, 1)) {
      if (d >= start && d <= end) set.add(d);
    }
    bookedByProperty.set(r.property_id, set);
  }

  const casaProp = LISTING_TO_PROPERTY[WHOLE_HOUSE.listingId];
  const casaBooked = bookedByProperty.get(casaProp) ?? new Set<string>();

  // Union of all suite-booked dates
  const anySuiteBooked = new Set<string>();
  for (const room of IL_BUCO_ROOMS) {
    const set = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]);
    if (set) for (const d of set) anySuiteBooked.add(d);
  }

  const pushed: Record<string, number> = {};

  // Whole house: closed where any suite is booked; skip its own booked dates
  const casaEntries = collapseInventory(
    start, end,
    d => (anySuiteBooked.has(d) ? 0 : 1),
    casaBooked
  );
  await updateListingInventories(WHOLE_HOUSE.listingId, casaEntries, dryRun);
  pushed[WHOLE_HOUSE.name] = casaEntries.length;

  // Suites: closed where casa is booked or whole-house-only window applies;
  // skip each suite's own booked dates
  for (const room of IL_BUCO_ROOMS) {
    const ownBooked = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]) ?? new Set<string>();
    const entries = collapseInventory(
      start, end,
      d => (casaBooked.has(d) || suitesClosedForDate(d, today, stayPolicy) ? 0 : 1),
      ownBooked
    );
    await updateListingInventories(room.listingId, entries, dryRun);
    pushed[room.name] = entries.length;
  }

  return { pushed, suiteBookedDates: anySuiteBooked.size, casaBookedDates: casaBooked.size };
}
