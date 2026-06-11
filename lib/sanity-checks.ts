/**
 * Sanity gates for the auto-pricer.
 *
 * prePushGates  — run BEFORE any Hostex write; a violation aborts the live push
 *                 (better stale prices than garbage prices).
 * postPushVerify — after a live push, read back sampled dates (short calendar
 *                 windows — long reads are stale) and check that what Hostex
 *                 stores is what we sent, plus the suite↔casa cross-block invariant.
 */

import { BASE_PRICES, IL_BUCO_ROOMS, WHOLE_HOUSE, type DayPriceEntry, type SeasonTier } from './pricing-engine';
import { isFiestasNight, addDays } from './season-calendar';
import { getCalendarAvailability } from './hostex-api';

export interface GateViolation {
  gate: string;
  detail: string;
}

const SUITE_MIN = 65;
const SUITE_MAX = 400;
const CASA_MIN = 250;
const CASA_MAX = 1300;
/** Churn gate: abort if more than this fraction of comparable dates move >40%. */
const CHURN_FRACTION = 0.4;
const CHURN_DELTA = 0.4;
/** Only compare against current prices within this horizon (longer reads are stale). */
const CHURN_HORIZON_DAYS = 180;

export function prePushGates(
  schedules: Record<string, DayPriceEntry[]>,
  wholeHouseDays: Array<{ date: string; value: number }>,
  currentByRoom: Record<string, Map<string, number>>,
  basePrices: Record<SeasonTier, Record<string, number>>,
  wholeHouseFactor: number,
  startDate: string
): GateViolation[] {
  const v: GateViolation[] = [];

  // 1. Per-night bounds
  for (const [room, schedule] of Object.entries(schedules)) {
    for (const e of schedule) {
      if (e.price < SUITE_MIN || e.price > SUITE_MAX) {
        v.push({ gate: 'bounds', detail: `${room} ${e.date}: $${e.price} outside $${SUITE_MIN}–${SUITE_MAX}` });
        break; // one example per room is enough
      }
    }
  }
  for (const d of wholeHouseDays) {
    if (d.value < CASA_MIN || d.value > CASA_MAX) {
      v.push({ gate: 'bounds', detail: `Casa ${d.date}: $${d.value} outside $${CASA_MIN}–${CASA_MAX}` });
      break;
    }
  }

  // 2. Tier ordering: avg peak > avg shoulder > avg off, per room
  for (const [room, schedule] of Object.entries(schedules)) {
    const avg: Record<string, { sum: number; n: number }> = {};
    for (const e of schedule) {
      const a = (avg[e.tier] ??= { sum: 0, n: 0 });
      a.sum += e.price; a.n++;
    }
    const mean = (t: string) => (avg[t] ? avg[t].sum / avg[t].n : null);
    const peak = mean('peak'), shoulder = mean('shoulder'), off = mean('off');
    if (peak !== null && shoulder !== null && peak <= shoulder) {
      v.push({ gate: 'tier-order', detail: `${room}: avg peak $${Math.round(peak)} ≤ avg shoulder $${Math.round(shoulder)}` });
    }
    if (shoulder !== null && off !== null && shoulder <= off) {
      v.push({ gate: 'tier-order', detail: `${room}: avg shoulder $${Math.round(shoulder)} ≤ avg off $${Math.round(off)}` });
    }
  }

  // 3. Fiestas nights must price at or above the room's peak base
  for (const [room, schedule] of Object.entries(schedules)) {
    const peakBase = basePrices.peak[room] ?? BASE_PRICES.peak[room];
    for (const e of schedule) {
      if (isFiestasNight(e.date) && !e.overrideId && e.price < peakBase) {
        v.push({ gate: 'fiestas', detail: `${room} ${e.date}: fiestas night $${e.price} < peak base $${peakBase}` });
        break;
      }
    }
  }

  // 4. Whole-house factor in a sane band
  if (wholeHouseFactor < 0.8 || wholeHouseFactor > 1.05) {
    v.push({ gate: 'casa-factor', detail: `wholeHouseFactor ${wholeHouseFactor} outside 0.8–1.05` });
  }

  // 5. Churn vs current Hostex prices (first CHURN_HORIZON_DAYS only)
  const horizon = addDays(startDate, CHURN_HORIZON_DAYS);
  let compared = 0, moved = 0;
  for (const [room, schedule] of Object.entries(schedules)) {
    const cur = currentByRoom[room];
    if (!cur) continue;
    for (const e of schedule) {
      if (e.date >= horizon) break;
      const c = cur.get(e.date);
      if (!c) continue;
      compared++;
      if (Math.abs(e.price - c) / c > CHURN_DELTA) moved++;
    }
  }
  if (compared > 50 && moved / compared > CHURN_FRACTION) {
    v.push({
      gate: 'churn',
      detail: `${moved}/${compared} dates would move >${CHURN_DELTA * 100}% — looks like a config error, not a reprice`,
    });
  }

  return v;
}

// ─── Post-push verification ───────────────────────────────────────────────────

export interface VerifyResult {
  sampled: number;
  mismatches: string[];
  crossBlockViolations: string[];
}

/**
 * Read back sampled dates after a live push. expectedByListing: listing name →
 * date → expected price. suiteBookedDates: dates where ≥1 suite has a real
 * reservation (casa must be closed there).
 */
export async function postPushVerify(
  startDate: string,
  expectedByListing: Record<string, Map<string, number>>,
  suiteBookedDates: Set<string>
): Promise<VerifyResult> {
  const offsets = [3, 7, 30, 60, 120, 200];
  const mismatches: string[] = [];
  const crossBlockViolations: string[] = [];
  let sampled = 0;

  for (const off of offsets) {
    const d = addDays(startDate, off);
    let cal;
    try {
      cal = await getCalendarAvailability(d, addDays(d, 1));
    } catch (e) {
      mismatches.push(`${d}: calendar read failed (${String(e).slice(0, 80)})`);
      continue;
    }
    for (const room of cal.rooms) {
      const day = room.dates.find(x => x.date === d);
      if (!day) continue;
      sampled++;
      const expected = expectedByListing[room.name]?.get(d);
      if (expected !== undefined && day.price !== expected) {
        mismatches.push(`${room.name} ${d}: pushed $${expected}, Hostex has $${day.price}`);
      }
      if (room.name === WHOLE_HOUSE.name && suiteBookedDates.has(d) && day.available) {
        crossBlockViolations.push(`${d}: suite booked but casa still open`);
      }
    }
  }

  return { sampled, mismatches, crossBlockViolations };
}

export const SUITE_NAMES = IL_BUCO_ROOMS.map(r => r.name);
