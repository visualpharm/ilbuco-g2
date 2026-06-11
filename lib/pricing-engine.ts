/**
 * Il Buco Pricing Engine v2.1 — seasonal base table + modifiers + manual overrides + learning.
 *
 * Per night:
 *   engine = BASE[tier][suite]                      (config-editable via /admin/pricing)
 *          × learned[suite][tier]                   (adapted from manual overrides, see below)
 *          × weekend premium (Fri/Sat)
 *          × feriado / holiday-window premium
 *          × demand factor (pacing vs last season's curve + cross-suite house demand)
 *   clamped to [floor, ceiling[tier]]
 *   final  = manual override if one covers the date (fixed price wins, coef multiplies engine)
 *
 * Demand signals (small-town reality: no SaaS market data, so we use our own):
 *   - pacing: forward occupancy vs where last season's curve says we should be → ±12–15%
 *   - house demand: if the OTHER suites are mostly booked for a date, demand is proven → raise
 *   - feriado calendar: known demand spikes (long weekends, Carnaval, Semana Santa, winter break)
 *
 * Learning: at each pricing run, for every overridden night we compare the manual price to the
 * engine price. If the median ratio per suite×tier deviates ≥5% over ≥5 nights, the learned
 * coefficient moves 50% of the way toward it (clamped 0.8–1.25). Overrides therefore teach the
 * engine; as the engine converges, the ratio → 1 and learning stabilises.
 *
 * History/v1 bugs: see openclaw domains/il-buco/comp-research/ANALYSIS-v2-seasonal.md.
 * Base table anchored to Cariló cap≤6 comp corridor (Apify 2026-05-26, n=68:
 * median high $245 / shoulder $176 / off $111; proven A-tier peers $190–236 high).
 */

import { getSeasonTier, isWeekendNight, isHolidayNight, isFiestasNight, addDays, type SeasonTier } from './season-calendar';

export type { SeasonTier };
export { getSeasonTier };

// ─── Policy defaults: base nightly USD per suite per tier ────────────────────

/**
 * Peak anchored to what Il Buco ACTUALLY charged Jan–Feb 2026 (Ivan, 2026-06-11):
 * Giardino $190, Terrazzo $180, Penthouse $190, whole house $650 (≈ sum × 0.92 ✓).
 * Paraíso was listed at $90 — inconsistent with the others (below winter pricing),
 * kept at the engine's $155; adjust in the UI if the $90 was deliberate.
 */
export const BASE_PRICES: Record<SeasonTier, Record<string, number>> = {
  peak:     { Giardino: 190, Terrazzo: 180, Paraiso: 155, Penthouse: 190 },
  high:     { Giardino: 130, Terrazzo: 140, Paraiso: 125, Penthouse: 150 },
  shoulder: { Giardino: 105, Terrazzo: 112, Paraiso: 100, Penthouse: 120 },
  off:      { Giardino: 90,  Terrazzo: 98,  Paraiso: 86,  Penthouse: 105 },
};

/** Per-tier price ceilings (sanity cap; fiestas can exceed the peak cap by design). */
export const CEILINGS: Record<SeasonTier, number> = { peak: 320, high: 250, shoulder: 200, off: 140 };

/** Hard floor: infra cost ($50) × 1.3, overridable. */
const FLOOR = Number(process.env.PRICING_FLOOR ?? '65');

// ─── Modifiers ────────────────────────────────────────────────────────────────

const WEEKEND_PREMIUM: Record<SeasonTier, number> = {
  peak: 1.10, high: 1.10, shoulder: 1.15, off: 1.15,
};

/** Feriado long weekends / Semana Santa / winter break. Not stacked with weekend premium. */
const HOLIDAY_PREMIUM = 1.25;

/** Navidad + Año Nuevo (Dec 24–Jan 2): carísimo. Replaces holiday/weekend premiums. */
const FIESTAS_PREMIUM = 1.45;

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
  /** Fraction of the OTHER suites booked on this exact date, 0–1. */
  houseOccupancy?: number;
}

/**
 * Demand factor = pacing × house-demand boost, clamped to [0.85, 1.30].
 *  - empty vs pace → lower (down to −12% close-in)
 *  - ahead of pace → raise
 *  - other suites booked the same date → proven demand → raise
 */
export function demandFactor(dateStr: string, ctx: DemandContext): number {
  let pacing = 1.0;
  if (ctx.leadDays <= 90) {
    const month = Number(dateStr.slice(5, 7));
    const expectedFinal = EXPECTED_OCC[month] ?? 0.2;
    // AR coast books late: assume linear pickup over the last ~120 days
    const expectedNow = expectedFinal * Math.max(0.15, 1 - ctx.leadDays / 120);
    const pace = expectedNow > 0 ? ctx.windowOccupancy / expectedNow : 1;

    if (pace >= 1.4) pacing = 1.15;
    else if (pace >= 1.1) pacing = 1.08;
    else if (pace < 0.5 && ctx.leadDays <= 21) pacing = 0.88;
    else if (pace < 0.5 && ctx.leadDays <= 45) pacing = 0.93;
  }

  // Cross-suite signal: the rest of the house filling up is direct proof of demand
  let house = 1.0;
  const ho = ctx.houseOccupancy ?? 0;
  if (ho >= 0.99) house = 1.15;      // we're the last suite available
  else if (ho >= 0.66) house = 1.08; // 2 of 3 others booked

  return Math.min(1.3, Math.max(0.85, pacing * house));
}

// ─── Manual overrides ─────────────────────────────────────────────────────────

export interface PriceOverride {
  id: string;
  /** YYYY-MM-DD inclusive */
  start: string;
  /** YYYY-MM-DD inclusive */
  end: string;
  /** Suite names; ['*'] = all suites */
  rooms: string[];
  mode: 'fixed' | 'coef';
  /** fixed: USD/night. coef: multiplier on the engine price (e.g. 0.9, 1.25) */
  value: number;
  note?: string;
  author: string;
  createdAt: string;
}

/** Resolve the active override for a room+date. Later-created overrides win. */
export function findOverride(
  overrides: PriceOverride[],
  room: string,
  date: string
): PriceOverride | null {
  let winner: PriceOverride | null = null;
  for (const o of overrides) {
    if (date < o.start || date > o.end) continue;
    if (!o.rooms.includes('*') && !o.rooms.includes(room)) continue;
    if (!winner || o.createdAt > winner.createdAt) winner = o;
  }
  return winner;
}

export function applyOverride(o: PriceOverride, enginePrice: number): number {
  return o.mode === 'fixed' ? Math.round(o.value) : Math.round(enginePrice * o.value);
}

// ─── Per-night price ──────────────────────────────────────────────────────────

export interface EngineSettings {
  basePrices?: Record<SeasonTier, Record<string, number>>;
  /** room → tier → learned coefficient */
  learned?: Record<string, Partial<Record<SeasonTier, number>>>;
  overrides?: PriceOverride[];
}

export interface NightPrice {
  date: string;
  tier: SeasonTier;
  base: number;
  factors: { learned: number; weekend: number; holiday: number; demand: number };
  /** Engine price before manual overrides */
  engine: number;
  /** Final price after manual override (== engine when no override applies) */
  price: number;
  overrideId?: string;
}

export function computeNightPrice(
  roomName: string,
  dateStr: string,
  ctx: DemandContext,
  settings: EngineSettings = {}
): NightPrice {
  const tier = getSeasonTier(dateStr);
  const base = (settings.basePrices ?? BASE_PRICES)[tier][roomName];
  if (base === undefined) throw new Error(`No base price for room ${roomName}`);

  const learned = settings.learned?.[roomName]?.[tier] ?? 1.0;
  const fiestas = isFiestasNight(dateStr);
  // Fiestas premium replaces holiday premium, which replaces the weekend premium
  const holiday = fiestas ? FIESTAS_PREMIUM : isHolidayNight(dateStr) ? HOLIDAY_PREMIUM : 1.0;
  const weekend = holiday === 1.0 && isWeekendNight(dateStr) ? WEEKEND_PREMIUM[tier] : 1.0;
  const demand = demandFactor(dateStr, ctx);

  // Fiestas nights skip the ceiling — they're supposed to be carísimos
  const raw = base * learned * weekend * holiday * demand;
  const capped = fiestas ? Math.max(FLOOR, raw) : Math.min(CEILINGS[tier], Math.max(FLOOR, raw));
  const engine = Math.round(capped);

  const o = settings.overrides ? findOverride(settings.overrides, roomName, dateStr) : null;
  const price = o ? Math.max(FLOOR, applyOverride(o, engine)) : engine;

  return {
    date: dateStr,
    tier,
    base,
    factors: { learned, weekend, holiday, demand },
    engine,
    price,
    ...(o ? { overrideId: o.id } : {}),
  };
}

// ─── Schedule builder ─────────────────────────────────────────────────────────

export interface DayPriceEntry {
  date: string;
  tier: SeasonTier;
  /** Engine price before manual overrides */
  engine: number;
  /** Final price (after overrides) — what gets pushed to Hostex */
  price: number;
  booked: boolean;
  overrideId?: string;
}

/**
 * Build a day-by-day price schedule for [startDate, endDate) for one room.
 * occByRoom: roomName → date → 1 (booked) / 0 (available), all suites — used for
 * both pacing (own room) and the cross-suite house-demand signal.
 */
export function buildPriceSchedule(
  roomName: string,
  startDate: string,
  endDate: string,
  occByRoom: Record<string, Record<string, number>> = {},
  settings: EngineSettings = {}
): DayPriceEntry[] {
  const result: DayPriceEntry[] = [];
  const own = occByRoom[roomName] ?? {};
  const otherRooms = Object.keys(occByRoom).filter(r => r !== roomName);

  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    // ±7-day occupancy window for pacing
    let booked = 0, days = 0;
    for (let i = -7; i <= 7; i++) {
      const key = addDays(d, i);
      if (key < startDate || key >= endDate) continue;
      booked += own[key] ?? 0;
      days++;
    }
    const windowOccupancy = days ? booked / days : 0;
    const leadDays = Math.round((Date.parse(d) - Date.parse(startDate)) / 86_400_000);
    const houseOccupancy = otherRooms.length
      ? otherRooms.reduce((a, r) => a + (occByRoom[r]?.[d] ?? 0), 0) / otherRooms.length
      : 0;

    const night = computeNightPrice(roomName, d, { windowOccupancy, leadDays, houseOccupancy }, settings);
    result.push({
      date: night.date,
      tier: night.tier,
      engine: night.engine,
      price: night.price,
      booked: (own[d] ?? 0) === 1,
      ...(night.overrideId ? { overrideId: night.overrideId } : {}),
    });
  }

  return result;
}

// ─── Learning from manual overrides ───────────────────────────────────────────

export interface LearningUpdate {
  room: string;
  tier: SeasonTier;
  nights: number;
  medianRatio: number;
  oldCoef: number;
  newCoef: number;
}

/**
 * Compare overridden prices to engine prices across all rooms' schedules and
 * move the learned coefficients 50% of the way toward the median ratio.
 * Conservative: needs ≥5 overridden nights per room×tier and ≥5% deviation.
 */
export function computeLearning(
  schedules: Record<string, DayPriceEntry[]>,
  learned: Record<string, Partial<Record<SeasonTier, number>>>
): LearningUpdate[] {
  const ratios: Record<string, Record<string, number[]>> = {};
  for (const [room, schedule] of Object.entries(schedules)) {
    for (const e of schedule) {
      if (!e.overrideId || !e.engine) continue;
      ((ratios[room] ??= {})[e.tier] ??= []).push(e.price / e.engine);
    }
  }

  const updates: LearningUpdate[] = [];
  for (const [room, byTier] of Object.entries(ratios)) {
    for (const [tier, list] of Object.entries(byTier)) {
      if (list.length < 5) continue;
      const sorted = [...list].sort((a, b) => a - b);
      const medianRatio = sorted[Math.floor(sorted.length / 2)];
      if (Math.abs(medianRatio - 1) < 0.05) continue;

      const oldCoef = learned[room]?.[tier as SeasonTier] ?? 1.0;
      const newCoef = Math.min(1.25, Math.max(0.8, oldCoef * (1 + (medianRatio - 1) * 0.5)));
      if (Math.abs(newCoef - oldCoef) < 0.01) continue;

      updates.push({ room, tier: tier as SeasonTier, nights: list.length, medianRatio, oldCoef, newCoef });
    }
  }
  return updates;
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
