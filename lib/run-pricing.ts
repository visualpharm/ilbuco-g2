/**
 * Shared pricing-run core — used by /api/pricing (cron + UI push) and
 * scripts/pricing-run.ts (CLI). One live run does, per listing:
 *
 *   1. prices       — engine v2.1 schedule (seasons, fiestas, feriados, demand, overrides)
 *   2. restrictions — min-stay ladder (fiestas 14, super-high 14→7 from Sep, default 2)
 *   3. inventories  — whole-house-only: suites closed for high-season dates until Nov 1,
 *                     then auto-reopened (reservation-aware: never touches booked dates)
 *   4. learning     — manual overrides move learned coefficients (live runs only)
 */

import {
  buildPriceSchedule,
  computeLearning,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  type DayPriceEntry,
} from './pricing-engine';
import { loadConfig, saveConfig } from './pricing-config';
import { minStayForDate, suitesClosedForDate, DEFAULT_STAY_POLICY, type StayPolicy } from './stay-policy';
import {
  getCalendarAvailability,
  updateListingPrices,
  updateListingRestrictions,
  updateListingInventories,
  getReservations,
  type PriceEntry,
  type RestrictionEntry,
  type InventoryEntry,
} from './hostex-api';
import { addDays } from './season-calendar';

/** booking_site listing_id → Hostex property_id (for reservation matching). */
const LISTING_TO_PROPERTY: Record<string, number> = {
  '110800-13274': 12282945, // Giardino
  '110801-13274': 12282946, // Terrazzo
  '110802-13274': 12282947, // Paraiso
  '110803-13274': 12282948, // Penthouse
  '113182-13274': 12299611, // Whole House
};

export function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

/** Run-length-encode consecutive days with equal value. */
function collapse<T extends string | number>(
  days: Array<{ date: string; value: T }>
): Array<{ start_date: string; end_date: string; value: T }> {
  if (!days.length) return [];
  const out: Array<{ start_date: string; end_date: string; value: T }> = [];
  let cur = { start_date: days[0].date, end_date: days[0].date, value: days[0].value };
  for (let i = 1; i < days.length; i++) {
    if (days[i].value === cur.value) {
      cur.end_date = days[i].date;
    } else {
      out.push({ ...cur });
      cur = { start_date: days[i].date, end_date: days[i].date, value: days[i].value };
    }
  }
  out.push(cur);
  return out;
}

export interface RunReport {
  engine: string;
  dry_run: boolean;
  run_at: string;
  start_date: string;
  end_date: string;
  learning_updates: ReturnType<typeof computeLearning>;
  rooms: Array<Record<string, unknown>>;
  restrictions: Record<string, number>;
  inventories: Record<string, { closed: number; reopened: number }>;
}

export async function runPricingUpdate(dryRun: boolean, daysAhead: number, by: string): Promise<RunReport> {
  // Safety rail: leave the immediate 2 days untouched (in-progress stays, same-day bookings)
  const today = todayAR();
  const startDate = addDays(today, 2);
  const endDate = addDays(startDate, daysAhead);

  const config = await loadConfig();
  const stayPolicy: StayPolicy = { ...DEFAULT_STAY_POLICY, ...(config.stayPolicy ?? {}) };

  // Calendar: occupancy for demand pacing + current prices for the change report
  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const occByRoom: Record<string, Record<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    occByRoom[room.name] = {};
    for (const d of byRoom.get(room.name)?.dates ?? []) {
      occByRoom[room.name][d.date] = d.available ? 0 : 1;
    }
  }

  // ── 1. Prices ────────────────────────────────────────────────────────────────
  const settings = { basePrices: config.basePrices, learned: config.learned, overrides: config.overrides };
  const schedules: Record<string, DayPriceEntry[]> = {};
  const results: Array<Record<string, unknown>> = [];
  let totalRanges = 0;

  for (const room of IL_BUCO_ROOMS) {
    const schedule = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    schedules[room.name] = schedule;

    const ranges: PriceEntry[] = collapse(schedule.map(e => ({ date: e.date, value: e.price })))
      .map(r => ({ start_date: r.start_date, end_date: r.end_date, price: r.value }));
    totalRanges += ranges.length;
    const pushResult = await updateListingPrices(room.listingId, ranges, dryRun);

    const currentByDate = new Map((byRoom.get(room.name)?.dates ?? []).map(d => [d.date, d.price]));
    const tierStats: Record<string, { n: number; avg_new: number; avg_current: number; overridden: number }> = {};
    for (const e of schedule) {
      const t = (tierStats[e.tier] ??= { n: 0, avg_new: 0, avg_current: 0, overridden: 0 });
      t.n++;
      t.avg_new += e.price;
      t.avg_current += currentByDate.get(e.date) ?? 0;
      if (e.overrideId) t.overridden++;
    }
    for (const t of Object.values(tierStats)) {
      t.avg_new = Math.round(t.avg_new / t.n);
      t.avg_current = Math.round(t.avg_current / t.n);
    }

    results.push({ room: room.name, listing_id: room.listingId, by_tier: tierStats, price_ranges: ranges.length, push: pushResult });
  }

  // Whole house: per-date sum of the 4 suites × bundle factor
  const suiteNames = IL_BUCO_ROOMS.map(r => r.name);
  const wholeHouseDays = schedules[suiteNames[0]].map((entry, i) => ({
    date: entry.date,
    value: Math.round(suiteNames.reduce((acc, n) => acc + schedules[n][i].price, 0) * config.wholeHouseFactor),
  }));
  const whRanges: PriceEntry[] = collapse(wholeHouseDays)
    .map(r => ({ start_date: r.start_date, end_date: r.end_date, price: r.value }));
  const whPush = await updateListingPrices(WHOLE_HOUSE.listingId, whRanges, dryRun);
  results.push({ room: WHOLE_HOUSE.name, listing_id: WHOLE_HOUSE.listingId, price_ranges: whRanges.length, push: whPush });

  // ── 2. Min-stay restrictions (same ladder for all 5 listings) ────────────────
  const minStayDays: Array<{ date: string; value: number }> = [];
  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    minStayDays.push({ date: d, value: minStayForDate(d, today, stayPolicy) });
  }
  const restrictionEntries: RestrictionEntry[] = collapse(minStayDays)
    .map(r => ({ start_date: r.start_date, end_date: r.end_date, min_stay_on_arrival: r.value }));

  const restrictions: Record<string, number> = {};
  for (const listing of [...IL_BUCO_ROOMS, WHOLE_HOUSE]) {
    const res = await updateListingRestrictions(listing.listingId, restrictionEntries, dryRun);
    restrictions[listing.name] = res.updated + res.skipped;
  }

  // ── 3. Whole-house-only inventory window ─────────────────────────────────────
  const inventories: Record<string, { closed: number; reopened: number }> = {};
  const whoRange = stayPolicy.wholeHouseOnly;
  const windowStart = whoRange.start > startDate ? whoRange.start : startDate;
  const windowEnd = whoRange.end < endDate ? whoRange.end : addDays(endDate, -1);

  if (windowStart <= windowEnd) {
    if (today < whoRange.until) {
      // Close suites for the whole window (closing booked dates is a no-op)
      const entries: InventoryEntry[] = [{ start_date: windowStart, end_date: windowEnd, inventory: 0 }];
      for (const room of IL_BUCO_ROOMS) {
        await updateListingInventories(room.listingId, entries, dryRun);
        inventories[room.name] = { closed: 1, reopened: 0 };
      }
    } else {
      // Reopen — reservation-aware: never reopen a date covered by a real booking
      const reservations = await getReservations(addDays(windowStart, -30), windowEnd);
      for (const room of IL_BUCO_ROOMS) {
        const propId = LISTING_TO_PROPERTY[room.listingId];
        const bookedDates = new Set<string>();
        for (const r of reservations) {
          if (r.property_id !== propId) continue;
          for (let d = r.check_in_date; d < r.check_out_date; d = addDays(d, 1)) bookedDates.add(d);
        }
        const days: Array<{ date: string; value: number }> = [];
        for (let d = windowStart; d <= windowEnd; d = addDays(d, 1)) {
          if (!bookedDates.has(d)) days.push({ date: d, value: 1 });
        }
        // collapse only contiguous runs (gaps at booked dates split ranges)
        const entries: InventoryEntry[] = [];
        let run: { start: string; end: string } | null = null;
        for (const day of days) {
          if (run && addDays(run.end, 1) === day.date) run.end = day.date;
          else { if (run) entries.push({ start_date: run.start, end_date: run.end, inventory: 1 }); run = { start: day.date, end: day.date }; }
        }
        if (run) entries.push({ start_date: run.start, end_date: run.end, inventory: 1 });
        await updateListingInventories(room.listingId, entries, dryRun);
        inventories[room.name] = { closed: 0, reopened: entries.length };
      }
    }
  }

  // ── 4. Learning from manual overrides (live runs only) ───────────────────────
  const learning = computeLearning(schedules, config.learned);
  if (!dryRun) {
    for (const u of learning) {
      (config.learned[u.room] ??= {})[u.tier] = Number(u.newCoef.toFixed(3));
      (config.learnedMeta[u.room] ??= {})[u.tier] = {
        nights: u.nights,
        medianRatio: Number(u.medianRatio.toFixed(3)),
        updatedAt: new Date().toISOString(),
      };
    }
    config.lastPush = { at: new Date().toISOString(), by, ranges: totalRanges };
    await saveConfig(config, by);
  }

  return {
    engine: 'v2.2-restrictions',
    dry_run: dryRun,
    run_at: new Date().toISOString(),
    start_date: startDate,
    end_date: endDate,
    learning_updates: learning,
    rooms: results,
    restrictions,
    inventories,
  };
}
