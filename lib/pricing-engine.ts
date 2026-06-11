/**
 * Il Buco Pricing Engine v2 — seasonal base table + modifiers.
 *
 * v1 had two structural bugs (see openclaw domains/il-buco/comp-research/ANALYSIS-v2-seasonal.md):
 *   1. Season multipliers were applied ON TOP of per-season comp medians (double-counted
 *      seasonality), and
 *   2. comp data was read from a relative path that doesn't exist on Vercel, silently
 *      falling back to Il Buco's own historical ADR — self-referential pricing.
 *
 * v2 model, per night:
 *   price = BASE[tier][suite]
 *         × weekend premium (Fri/Sat)
 *         × feriado / holiday-window premium
 *         × demand pacing factor (forward occupancy vs last season's curve)
 *   clamped to [floor, ceiling[tier]]
 *
 * The base table is the policy — explicit numbers a human can read and override —
 * anchored to the Cariló cap≤6 comp corridor (Apify scrape 2026-05-26, n=68:
 * median high $245 / shoulder $176 / off $111; proven A-tier peers $190–236 high).
 */

import { getSeasonTier, isWeekendNight, isHolidayNight, type SeasonTier } from './season-calendar';

export type { SeasonTier };
export { getSeasonTier };

// ─── Policy: base nightly USD per suite per tier ─────────────────────────────

export const BASE_PRICES: Record<SeasonTier, Record<string, number>> = {
  //            Giardino Terrazzo Paraiso Penthouse
  peak:     { Giardino: 160, Terrazzo: 170, Paraiso: 155, Penthouse: 185 },
  high:     { Giardino: 130, Terrazzo: 140, Paraiso: 125, Penthouse: 150 },
  shoulder: { Giardino: 105, Terrazzo: 112, Paraiso: 100, Penthouse: 120 },
  off:      { Giardino: 90,  Terrazzo: 98,  Paraiso: 86,  Penthouse: 105 },
};

/** Per-tier price ceilings (≈ Cariló cap≤6 p75 of the season, sanity cap). */
const CEILINGS: Record<SeasonTier, number> = { peak: 300, high: 250, shoulder: 200, off: 140 };

/** Hard floor: infra cost ($50) × 1.3, overridable. */
const FLOOR = Number(process.env.PRICING_FLOOR ?? '65');

// ─── Modifiers ────────────────────────────────────────────────────────────────

const WEEKEND_PREMIUM: Record<SeasonTier, number> = {
  peak: 1.10, high: 1.10, shoulder: 1.15, off: 1.15,
};

/** Feriado long weekends / Semana Santa / winter break. Not stacked with weekend premium. */
const HOLIDAY_PREMIUM = 1.25;

/**
 * Expected final occupancy by month (from 2025/26 realized Hostex history).
 * Used as the pacing reference for demand adjustment.
 */
const EXPECTED_OCC: Record<number, number> = {
  1: 0.95, 2: 0.90, 3: 0.55, 4: 0.12, 5: 0.14, 6: 0.12,
  7: 0.15, 8: 0.12, 9: 0.12, 10: 0.30, 11: 0.45, 12: 0.62,
};

export interface DemandContext {
  /** Occupancy of the ±7-day window around the date for this room, 0–1. */
  windowOccupancy: number;
  /** Days from today to the date. */
  leadDays: number;
}

/**
 * Demand pacing factor. Compares booked share against where last season's curve
 * says we should be at this lead time. Conservative: ±15% max.
 */
export function demandFactor(dateStr: string, ctx: DemandContext): number {
  if (ctx.leadDays > 90) return 1.0; // too far out, hold policy price

  const month = Number(dateStr.slice(5, 7));
  const expectedFinal = EXPECTED_OCC[month] ?? 0.2;
  // AR coast books late: assume linear pickup over the last ~120 days
  const expectedNow = expectedFinal * Math.max(0.15, 1 - ctx.leadDays / 120);

  if (expectedNow <= 0) return 1.0;
  const pace = ctx.windowOccupancy / expectedNow;

  if (pace >= 1.4) return 1.15;
  if (pace >= 1.1) return 1.08;
  if (pace < 0.5 && ctx.leadDays <= 21) return 0.88;
  if (pace < 0.5 && ctx.leadDays <= 45) return 0.93;
  return 1.0;
}

// ─── Per-night price ──────────────────────────────────────────────────────────

export interface NightPrice {
  date: string;
  tier: SeasonTier;
  base: number;
  factors: { weekend: number; holiday: number; demand: number };
  price: number;
}

export function computeNightPrice(roomName: string, dateStr: string, ctx: DemandContext): NightPrice {
  const tier = getSeasonTier(dateStr);
  const base = BASE_PRICES[tier][roomName];
  if (base === undefined) throw new Error(`No base price for room ${roomName}`);

  const holiday = isHolidayNight(dateStr) ? HOLIDAY_PREMIUM : 1.0;
  // Holiday premium replaces (not stacks with) the weekend premium
  const weekend = holiday === 1.0 && isWeekendNight(dateStr) ? WEEKEND_PREMIUM[tier] : 1.0;
  const demand = demandFactor(dateStr, ctx);

  const raw = base * weekend * holiday * demand;
  const price = Math.round(Math.min(CEILINGS[tier], Math.max(FLOOR, raw)));

  return { date: dateStr, tier, base, factors: { weekend, holiday, demand }, price };
}

// ─── Schedule builder ─────────────────────────────────────────────────────────

import { addDays } from './season-calendar';

export interface DayPriceEntry {
  date: string;
  tier: SeasonTier;
  price: number;
}

/**
 * Build a day-by-day price schedule for [startDate, endDate) for one room.
 * occupancyByDate: date → 1 (booked) / 0 (available), used for demand pacing.
 */
export function buildPriceSchedule(
  roomName: string,
  startDate: string,
  endDate: string,
  occupancyByDate: Record<string, number> = {}
): DayPriceEntry[] {
  const result: DayPriceEntry[] = [];

  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    // ±7-day occupancy window
    let booked = 0, days = 0;
    for (let i = -7; i <= 7; i++) {
      const key = addDays(d, i);
      if (key < startDate || key >= endDate) continue;
      booked += occupancyByDate[key] ?? 0;
      days++;
    }
    const windowOccupancy = days ? booked / days : 0;
    const leadDays = Math.round((Date.parse(d) - Date.parse(startDate)) / 86_400_000);

    const night = computeNightPrice(roomName, d, { windowOccupancy, leadDays });
    result.push({ date: night.date, tier: night.tier, price: night.price });
  }

  return result;
}

// ─── Room config ──────────────────────────────────────────────────────────────

export interface RoomConfig {
  name: string;
  /** Hostex booking_site listing_id */
  listingId: string;
}

/** The four suites (booking_site channel = Hostex direct). */
export const IL_BUCO_ROOMS: RoomConfig[] = [
  { name: 'Giardino',  listingId: '110800-13274' },
  { name: 'Terrazzo',  listingId: '110801-13274' },
  { name: 'Paraiso',   listingId: '110802-13274' },
  { name: 'Penthouse', listingId: '110803-13274' },
];

/** Whole-house listing: priced as bundle of the 4 suites. */
export const WHOLE_HOUSE = { name: 'Whole House', listingId: '113182-13274' };

/** Whole house = sum of suites × bundle factor (books all 4 at once → small discount). */
export const WHOLE_HOUSE_FACTOR = Number(process.env.PRICING_WHOLE_HOUSE_FACTOR ?? '0.92');
