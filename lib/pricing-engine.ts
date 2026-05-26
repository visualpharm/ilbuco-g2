/**
 * Il Buco Pricing Engine
 *
 * Logic:
 *   floor   = infra_cost_per_night × FLOOR_MULTIPLIER   (default 1.3)
 *   ceiling = median_competitor_nightly × CEILING_MULTIPLIER (default 2.0)
 *   price   = clamp(demand_adjusted_price, floor, ceiling)
 *
 * Demand signal: occupancy of each room over next 30 days.
 *   >80%  → aim for 85% of ceiling
 *   50-80% → midpoint of floor..ceiling
 *   30-50% → 25th percentile of floor..ceiling
 *   <30%  → floor × 1.05 (keep room moving; never below floor)
 *
 * Monthly refresh: re-reads comp data, recalculates medians, pushes to Hostex.
 */

// ─── Config ──────────────────────────────────────────────────────────────────

/** Per-room nightly infrastructure cost in USD.
 *  Covers cleaning, consumables, amortised maintenance, fixed overhead per room.
 *  Override per room via INFRA_COST_<ROOM> env vars (e.g. INFRA_COST_PENTHOUSE).
 *  Default $50 derived from Nov-Apr 2025/26 break-even analysis.
 */
const DEFAULT_INFRA_COST = Number(process.env.INFRA_COST_DEFAULT ?? '50');

const FLOOR_MULTIPLIER = Number(process.env.PRICING_FLOOR_MULTIPLIER ?? '1.3');
const CEILING_MULTIPLIER = Number(process.env.PRICING_CEILING_MULTIPLIER ?? '2.0');

/** Minimum absolute price regardless of any multiplier. */
const ABSOLUTE_MIN_PRICE = Number(process.env.PRICING_ABSOLUTE_MIN ?? '55');

// ─── Seasonal calendar ────────────────────────────────────────────────────────

export type SeasonTier = 'peak' | 'high' | 'shoulder' | 'off';

/** Return the season tier for a given YYYY-MM-DD date. */
export function getSeasonTier(dateStr: string): SeasonTier {
  const d = new Date(dateStr + 'T12:00:00-03:00');
  const m = d.getMonth() + 1; // 1-12
  const day = d.getDate();

  // Peak: Christmas / NYE / Carnival run (Dec 20 – Feb 15)
  if ((m === 12 && day >= 20) || m === 1 || (m === 2 && day <= 15)) return 'peak';

  // High: Shoulder-peak shoulder (Feb 16–28, Nov 15–Dec 19)
  if ((m === 2 && day >= 16) || (m === 11 && day >= 15) || (m === 12 && day < 20)) return 'high';

  // Shoulder: Mar, Apr, Nov 1-14
  if (m === 3 || m === 4 || (m === 11 && day < 15)) return 'shoulder';

  // Off-peak: May – Oct
  return 'off';
}

/** Season-tier multiplier applied to the demand-adjusted price (relative to median price). */
export const SEASON_MULTIPLIERS: Record<SeasonTier, number> = {
  peak: 1.6,
  high: 1.2,
  shoulder: 0.85,
  off: 0.70,
};

// ─── Competitor data ──────────────────────────────────────────────────────────

/** Raw entry from Airbnb/Booking comp-research JSON. */
export interface CompEntry {
  pricing: { price: string; total?: string | null };
  checkIn: string;
  checkOut: string;
}

/** Parse "$512" or "$511,06" (Spanish decimal) → number */
function parsePriceStr(s: string): number {
  // Replace comma decimal separator FIRST, then strip non-numeric chars
  return parseFloat(s.replace(',', '.').replace(/[^0-9.]/g, ''));
}

/** Compute nightly rate from a comp entry (total price ÷ nights). */
function nightly(entry: CompEntry): number | null {
  const raw = entry.pricing?.total ?? entry.pricing?.price;
  if (!raw) return null;
  const total = parsePriceStr(raw);
  const nights =
    (new Date(entry.checkOut).getTime() - new Date(entry.checkIn).getTime()) /
    86_400_000;
  if (!nights) return null;
  return total / nights;
}

/** Compute median of an array of numbers. */
function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export interface CompDataset {
  tier: SeasonTier;
  entries: CompEntry[];
}

/** Compute the median nightly rate for each season tier from comp datasets. */
export function computeCompMedians(datasets: CompDataset[]): Record<SeasonTier, number> {
  const byTier: Record<SeasonTier, number[]> = { peak: [], high: [], shoulder: [], off: [] };

  for (const ds of datasets) {
    for (const entry of ds.entries) {
      const n = nightly(entry);
      if (n && n > 0) byTier[ds.tier].push(n);
    }
  }

  // Fall back to adjacent tier if a tier has no data
  const raw: Record<SeasonTier, number> = {
    peak: median(byTier.peak) || 0,
    high: median(byTier.high) || 0,
    shoulder: median(byTier.shoulder) || 0,
    off: median(byTier.off) || 0,
  };

  // Fill gaps: use neighbour or historical fallback (from Nov 2025–Apr 2026 actuals)
  const HISTORICAL_FALLBACK: Record<SeasonTier, number> = {
    peak: 138,   // Feb 2026 actual median
    high: 105,   // Il Buco baseline
    shoulder: 73, // Mar 2026 actual
    off: 57,     // Nov 2025 actual
  };

  return {
    peak: raw.peak || raw.high || HISTORICAL_FALLBACK.peak,
    high: raw.high || raw.peak || HISTORICAL_FALLBACK.high,
    shoulder: raw.shoulder || HISTORICAL_FALLBACK.shoulder,
    off: raw.off || raw.shoulder || HISTORICAL_FALLBACK.off,
  };
}

// ─── Pricing logic ────────────────────────────────────────────────────────────

export interface RoomConfig {
  /** Room name (Giardino, Terrazzo, Paraiso, Penthouse) */
  name: string;
  /** Hostex booking_site listing_id */
  listingId: string;
  /** Override infra cost for this room if set */
  infraCostOverride?: number;
}

export interface PricingParams {
  /** 0.0–1.0: fraction of next-30-days slots that are already booked */
  occupancy30d: number;
  /** Median competitor nightly for the target tier */
  compMedian: number;
  /** Infra cost per night for this room */
  infraCost: number;
}

export interface PricingResult {
  floor: number;
  ceiling: number;
  demandTarget: number;
  finalPrice: number;
  /** Reason string for audit log */
  reason: string;
}

export function computePrice(p: PricingParams): PricingResult {
  const floor = Math.max(ABSOLUTE_MIN_PRICE, Math.round(p.infraCost * FLOOR_MULTIPLIER));
  const ceiling = Math.round(p.compMedian * CEILING_MULTIPLIER);

  // Demand-adjusted target
  let demandTarget: number;
  let reason: string;

  if (p.occupancy30d >= 0.8) {
    demandTarget = Math.round(ceiling * 0.85);
    reason = `high demand (${Math.round(p.occupancy30d * 100)}% occ) → 85% of ceiling`;
  } else if (p.occupancy30d >= 0.5) {
    demandTarget = Math.round(floor + (ceiling - floor) * 0.6);
    reason = `medium demand (${Math.round(p.occupancy30d * 100)}% occ) → 60th pct of range`;
  } else if (p.occupancy30d >= 0.3) {
    demandTarget = Math.round(floor + (ceiling - floor) * 0.3);
    reason = `low demand (${Math.round(p.occupancy30d * 100)}% occ) → 30th pct of range`;
  } else {
    demandTarget = Math.round(floor * 1.05);
    reason = `very low demand (${Math.round(p.occupancy30d * 100)}% occ) → floor +5%`;
  }

  const finalPrice = Math.max(floor, Math.min(ceiling, demandTarget));

  return { floor, ceiling, demandTarget, finalPrice, reason };
}

// ─── Date schedule builder ────────────────────────────────────────────────────

export interface DayPriceEntry {
  date: string;         // YYYY-MM-DD
  tier: SeasonTier;
  price: number;
}

/**
 * Build a day-by-day price schedule for [startDate, endDate) (exclusive end).
 * occupancyByDate: optional map of date → 0/1 (1=booked) for demand calculation.
 */
export function buildPriceSchedule(
  startDate: string,
  endDate: string,
  compMedians: Record<SeasonTier, number>,
  infraCost: number,
  occupancyByDate: Record<string, number> = {}
): DayPriceEntry[] {
  const result: DayPriceEntry[] = [];
  const cur = new Date(startDate + 'T12:00:00-03:00');
  const end = new Date(endDate + 'T12:00:00-03:00');

  while (cur < end) {
    const dateStr = cur.toISOString().split('T')[0];
    const tier = getSeasonTier(dateStr);

    // 30-day occupancy window centred on this date
    const window30: number[] = [];
    for (let i = -15; i < 15; i++) {
      const d = new Date(cur.getTime() + i * 86_400_000);
      const key = d.toISOString().split('T')[0];
      window30.push(occupancyByDate[key] ?? 0);
    }
    const occ30 = window30.reduce((a, b) => a + b, 0) / window30.length;

    const result30 = computePrice({
      occupancy30d: occ30,
      compMedian: compMedians[tier] * SEASON_MULTIPLIERS[tier],
      infraCost,
    });

    result.push({ date: dateStr, tier, price: result30.finalPrice });
    cur.setDate(cur.getDate() + 1);
  }

  return result;
}

// ─── Room config ──────────────────────────────────────────────────────────────

/** Per-room infra cost override from env (INFRA_COST_GIARDINO, etc.). */
function infraCostForRoom(roomName: string): number {
  const envKey = `INFRA_COST_${roomName.toUpperCase()}`;
  const override = process.env[envKey];
  return override ? Number(override) : DEFAULT_INFRA_COST;
}

/** All four Il Buco rooms (booking_site channel = Hostex direct). */
export const IL_BUCO_ROOMS: RoomConfig[] = [
  { name: 'Giardino',   listingId: '110800-13274' },
  { name: 'Terrazzo',   listingId: '110801-13274' },
  { name: 'Paraiso',    listingId: '110802-13274' },
  { name: 'Penthouse',  listingId: '110803-13274' },
];

export function getRoomInfraCost(room: RoomConfig): number {
  return room.infraCostOverride ?? infraCostForRoom(room.name);
}
