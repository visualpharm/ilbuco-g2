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
  getReservations,
  updateListingPrices,
  updateListingRestrictions,
  type PriceEntry,
  type RestrictionEntry,
} from './hostex-api';
import { syncInventories, type SyncResult } from './inventory-sync';
import { prePushGates, postPushVerify, type GateViolation, type VerifyResult } from './sanity-checks';
import { sendPricingAlert } from './pricing-alerts';
import { addDays } from './season-calendar';

const ENGINE_VERSION = 'v2.4-gated';

/** booking_site listing_id → Hostex property_id. */
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
  aborted?: boolean;
  gate_violations?: GateViolation[];
  verify?: VerifyResult | null;
  run_at: string;
  start_date: string;
  end_date: string;
  learning_updates: ReturnType<typeof computeLearning>;
  rooms: Array<Record<string, unknown>>;
  restrictions: Record<string, number>;
  inventories: SyncResult;
}

export async function runPricingUpdate(dryRun: boolean, daysAhead: number, by: string): Promise<RunReport> {
  // Safety rail: leave the immediate 2 days untouched (in-progress stays, same-day bookings)
  const today = todayAR();
  const startDate = addDays(today, 2);
  const endDate = addDays(startDate, daysAhead);

  const config = await loadConfig();
  const stayPolicy: StayPolicy = { ...DEFAULT_STAY_POLICY, ...(config.stayPolicy ?? {}) };

  // Calendar (current prices for the change report) + reservations (occupancy).
  // Demand pacing must see REAL bookings only — calendar inventory also goes to 0
  // for our own cross-block/whole-house-only closures, which is not demand.
  const [cal, reservations] = await Promise.all([
    getCalendarAvailability(startDate, endDate),
    getReservations(addDays(startDate, -35), endDate),
  ]);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const bookedByProperty = new Map<number, Set<string>>();
  for (const r of reservations) {
    const set = bookedByProperty.get(r.property_id) ?? new Set<string>();
    for (let d = r.check_in_date; d < r.check_out_date; d = addDays(d, 1)) set.add(d);
    bookedByProperty.set(r.property_id, set);
  }

  const occByRoom: Record<string, Record<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    occByRoom[room.name] = {};
    const booked = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]) ?? new Set<string>();
    for (let d = startDate; d < endDate; d = addDays(d, 1)) {
      occByRoom[room.name][d] = booked.has(d) ? 1 : 0;
    }
  }

  // ── 1a. Compute everything BEFORE touching Hostex ────────────────────────────
  const settings = { basePrices: config.basePrices, learned: config.learned, overrides: config.overrides };
  const schedules: Record<string, DayPriceEntry[]> = {};
  const currentByRoom: Record<string, Map<string, number>> = {};

  for (const room of IL_BUCO_ROOMS) {
    schedules[room.name] = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    currentByRoom[room.name] = new Map((byRoom.get(room.name)?.dates ?? []).map(d => [d.date, d.price]));
  }

  const suiteNames = IL_BUCO_ROOMS.map(r => r.name);
  const wholeHouseDays = schedules[suiteNames[0]].map((entry, i) => ({
    date: entry.date,
    value: Math.round(suiteNames.reduce((acc, n) => acc + schedules[n][i].price, 0) * config.wholeHouseFactor),
  }));

  // ── 1b. Sanity gates — a violation aborts the live push ─────────────────────
  const gates = prePushGates(schedules, wholeHouseDays, currentByRoom, config.basePrices, config.wholeHouseFactor, startDate);
  if (gates.length && !dryRun) {
    const detail = gates.map(g => `[${g.gate}] ${g.detail}`).join('\n');
    await sendPricingAlert(`🛑 Il Buco pricing: push ABORTED by sanity gates\n${detail}\nNothing was written to Hostex.`);
    return {
      engine: ENGINE_VERSION,
      dry_run: dryRun,
      aborted: true,
      gate_violations: gates,
      run_at: new Date().toISOString(),
      start_date: startDate,
      end_date: endDate,
      learning_updates: [],
      rooms: [],
      restrictions: {},
      inventories: { pushed: {}, suiteBookedDates: 0, casaBookedDates: 0 },
    };
  }

  // ── 1c. Push prices ──────────────────────────────────────────────────────────
  const results: Array<Record<string, unknown>> = [];
  let totalRanges = 0;

  for (const room of IL_BUCO_ROOMS) {
    const schedule = schedules[room.name];
    const ranges: PriceEntry[] = collapse(schedule.map(e => ({ date: e.date, value: e.price })))
      .map(r => ({ start_date: r.start_date, end_date: r.end_date, price: r.value }));
    totalRanges += ranges.length;
    const pushResult = await updateListingPrices(room.listingId, ranges, dryRun);

    const currentByDate = currentByRoom[room.name];
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

  // ── 3. Inventory sync: suite↔casa cross-blocking + whole-house-only window ───
  const inventories = await syncInventories(today, daysAhead, stayPolicy, dryRun);

  // ── 4. Post-push verification (live only) ────────────────────────────────────
  let verify: VerifyResult | null = null;
  if (!dryRun) {
    const expectedByListing: Record<string, Map<string, number>> = {};
    for (const room of IL_BUCO_ROOMS) {
      expectedByListing[room.name] = new Map(schedules[room.name].map(e => [e.date, e.price]));
    }
    expectedByListing[WHOLE_HOUSE.name] = new Map(wholeHouseDays.map(d => [d.date, d.value]));

    const suiteBookedDates = new Set<string>();
    for (const room of IL_BUCO_ROOMS) {
      const set = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]);
      if (set) for (const d of set) suiteBookedDates.add(d);
    }

    verify = await postPushVerify(startDate, expectedByListing, suiteBookedDates);
    if (verify.mismatches.length || verify.crossBlockViolations.length) {
      await sendPricingAlert(
        `⚠️ Il Buco pricing: post-push verification failed\n` +
        [...verify.mismatches, ...verify.crossBlockViolations].slice(0, 8).join('\n')
      );
    }
  }

  // ── 5. Learning from manual overrides (live runs only) ───────────────────────
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

  // ── 6. Weekly one-line summary after the cron run ─────────────────────────────
  if (!dryRun && by === 'cron') {
    const peakAvg = (r: string) => {
      const s = schedules[r].filter(e => e.tier === 'peak');
      return s.length ? Math.round(s.reduce((a, e) => a + e.price, 0) / s.length) : 0;
    };
    const ok = verify && !verify.mismatches.length && !verify.crossBlockViolations.length;
    await sendPricingAlert(
      `✅ Il Buco pricing semanal: 5 listings actualizados (${totalRanges} rangos), ` +
      `peak avg G$${peakAvg('Giardino')}/PH$${peakAvg('Penthouse')}, ` +
      `${config.overrides.length} ajustes manuales, ${learning.length} learning updates, ` +
      `verificación ${ok ? `OK (${verify!.sampled} muestras)` : 'CON FALLAS'}`
    );
  }

  return {
    engine: ENGINE_VERSION,
    dry_run: dryRun,
    run_at: new Date().toISOString(),
    start_date: startDate,
    end_date: endDate,
    gate_violations: gates,
    verify,
    learning_updates: learning,
    rooms: results,
    restrictions,
    inventories,
  };
}
