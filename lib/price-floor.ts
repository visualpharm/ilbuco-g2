/**
 * Hard per-night price floor — the absurd-price stop for everything a guest sees.
 *
 * Guests get Hostex prices straight from automation (noe, the site chat, the voice
 * line, checkout). Selling a bit cheaper than Ivan would is fine; a formula bug
 * that quotes $30/night is not (Ivan 2026-10-22, m734035). A night below its floor
 * is never shown or sent: callers get an error instead of a price.
 *
 * Derivation (Hostex booking history: accepted USD reservations with check-in
 * 2025-06 → 2027-02, pulled 2026-10-22 — 128 reservations, 426 sold nights; a night's price is its
 * stay's accommodation total / nights, the reservation total when Hostex has no
 * accommodation line):
 *
 *   tier      suites: cheapest / median sold   casa: cheapest / median sold
 *   peak      $75 / $145   (240 nights)        $526 / $650  (11 nights)
 *   high      $102 / $106  (9)                  —
 *   shoulder  $72 / $102   (112)               $475         (3)
 *   off       $72 / $95    (50)                $360         (1)
 *
 *   floor = half the tier's (lower) median sold night, capped at the cheapest night
 *           ever actually sold (never block a price we have really taken), rounded
 *           down to $5, and never under the cost floor: suites $65 (the engine's
 *           PRICING_FLOOR, infra $50 × 1.3), casa $250 (the pre-push gate's CASA_MIN).
 *           A tier without history (casa high) takes the cost floor.
 *
 * Nights over $1500 are skipped as data-entry errors. Suites are pooled: per-suite
 * tier samples are thin, and the suites' base prices differ by under 20%.
 * Re-derive with `scripts/price-check derive` when history grows.
 */

import { getSeasonTier, type SeasonTier } from './season-calendar';

export const SUITES = ['Giardino', 'Terrazzo', 'Paraiso', 'Penthouse'] as const;
export const WHOLE_HOUSE_NAME = 'Whole House';
export type ListingName = (typeof SUITES)[number] | typeof WHOLE_HOUSE_NAME;
export const LISTING_NAMES: ListingName[] = [...SUITES, WHOLE_HOUSE_NAME];

/** Cost floors: below these a night loses money regardless of season. */
export const SUITE_COST_FLOOR = 65;
export const CASA_COST_FLOOR = 250;

/** Above these a quote is not a price but a currency mix-up (pesos labelled dollars). */
export const ABSURD_NIGHT_USD: Record<ListingName, number> = {
  Giardino: 1000, Terrazzo: 1000, Paraiso: 1000, Penthouse: 1000, 'Whole House': 4000,
};

const suites = (v: number) => Object.fromEntries(SUITES.map(s => [s, v])) as Record<(typeof SUITES)[number], number>;

/** USD per night, by season tier and listing. */
export const PRICE_FLOORS: Record<SeasonTier, Record<ListingName, number>> = {
  peak:     { ...suites(70), [WHOLE_HOUSE_NAME]: 325 },
  high:     { ...suites(65), [WHOLE_HOUSE_NAME]: 250 },
  shoulder: { ...suites(65), [WHOLE_HOUSE_NAME]: 250 },
  off:      { ...suites(65), [WHOLE_HOUSE_NAME]: 250 },
};

/** Accepts Hostex names, slugs and the Spanish/Italian spellings guests and agents use. */
export function normalizeListing(name: string): ListingName {
  const k = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  const found = SUITES.find(s => s.toLowerCase() === k);
  if (found) return found;
  if (['wholehouse', 'casa', 'house', 'ilbucowholehouse', 'ilbuco', 'casacompleta', 'todalacasa'].includes(k)) {
    return WHOLE_HOUSE_NAME;
  }
  throw new Error(`Unknown Il Buco listing "${name}" (expected ${LISTING_NAMES.join(', ')})`);
}

export function priceFloor(listing: string, date: string): number {
  return PRICE_FLOORS[getSeasonTier(date)][normalizeListing(listing)];
}

export class PriceBelowFloorError extends Error {
  constructor(readonly listing: string, readonly date: string, readonly price: number, readonly floor: number) {
    super(`${listing} ${date}: $${price}/night is below the $${floor} floor — not a price to send`);
    this.name = 'PriceBelowFloorError';
  }
}

/** Throws PriceBelowFloorError when a USD nightly price is under its floor (0/missing included). */
export function assertAboveFloor(listing: string, date: string, priceUsd: number): void {
  const floor = priceFloor(listing, date);
  if (!(priceUsd >= floor)) throw new PriceBelowFloorError(normalizeListing(listing), date, priceUsd, floor);
}

/**
 * Guest-facing nightly price: the price itself, or null when it is under the floor.
 * Callers treat null like "no price" (they never quote it); the breach is logged.
 */
export function guestNightPrice(listing: string, date: string, priceUsd: number | null | undefined): number | null {
  if (!priceUsd) return null;
  try {
    assertAboveFloor(listing, date, priceUsd);
    return priceUsd;
  } catch (e) {
    console.error(`[price-floor] ${(e as Error).message}`);
    return null;
  }
}

/**
 * Nightly prices written in an outbound message ("$30/night", "US$ 45 por noche",
 * "40 USD la noche") that sit under the lowest floor of any listing. Whatever the
 * currency, a two-digit nightly figure under $65 is never a real Il Buco price.
 */
export function subFloorNightlyMentions(text: string): number[] {
  const lowest = Math.min(...LISTING_NAMES.flatMap(l => Object.values(PRICE_FLOORS).map(t => t[l])));
  const night = String.raw`\s*(?:\/|per|por|a|la|x|each|cada)?\s*(?:la\s+)?(?:night|noche|nite)`;
  const patterns = [
    new RegExp(String.raw`(?:US\$|U\$S|USD|\$)\s?(\d[\d.,]*)` + night, 'gi'),
    new RegExp(String.raw`(\d[\d.,]*)\s?(?:USD|US\$|dólares|dolares|dollars|pesos)` + night, 'gi'),
  ];
  const found: number[] = [];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      // "1.234" / "1,234" are thousands; a trailing ",50" / ".50" is cents
      const n = Number(m[1].replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.'));
      if (Number.isFinite(n) && n < lowest) found.push(n);
    }
  }
  return found;
}

// ─── Quote check (what noe runs before a price goes to a guest) ──────────────

export interface QuoteInput {
  listing: string;
  /** YYYY-MM-DD, first night */
  checkIn: string;
  /** YYYY-MM-DD, departure day (not a night) */
  checkOut: string;
  /** Stay total in `currency` (fees included is fine — they only raise it). */
  total?: number;
  /** Price per night in `currency`, when quoting a nightly rate instead of a total. */
  nightly?: number;
  currency?: 'USD' | 'ARS';
  /** ARS per USD; required when currency is ARS. */
  arsPerUsd?: number;
  /** Live Hostex nightly prices (USD) for the same nights, date → price. */
  hostexNights?: Record<string, number | null | undefined>;
}

export interface QuoteCheck {
  ok: boolean;
  listing: ListingName;
  nights: number;
  /** Sum of the per-night floors, USD */
  floorTotal: number;
  /** Quoted stay total converted to USD (null when nothing was quoted) */
  quotedUsd: number | null;
  /** Sum of the live Hostex nightly prices, USD (null when not supplied/incomplete) */
  hostexTotal: number | null;
  errors: string[];
}

function addDay(d: string): string {
  const t = new Date(d + 'T12:00:00Z');
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10);
}

export function stayNights(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDay(d)) out.push(d);
  return out;
}

export function checkQuote(q: QuoteInput): QuoteCheck {
  const listing = normalizeListing(q.listing);
  const dates = stayNights(q.checkIn, q.checkOut);
  const errors: string[] = [];
  if (!dates.length) errors.push(`check-out ${q.checkOut} is not after check-in ${q.checkIn}`);

  const floors = dates.map(d => priceFloor(listing, d));
  const floorTotal = floors.reduce((a, b) => a + b, 0);

  // Each quoted night must clear the floor on its own. A total can't be split by
  // night, so its average must clear the stay's highest nightly floor.
  let quotedUsd: number | null = null;
  const cur = q.currency ?? 'USD';
  const toUsd = (n: number) => (cur === 'ARS' ? n / q.arsPerUsd! : n);
  const fmt = (n: number) => n.toFixed(n < 10 ? 2 : 0);
  const maxFloor = floors.length ? Math.max(...floors) : 0;
  if ((q.total !== undefined || q.nightly !== undefined) && dates.length) {
    if (cur === 'ARS' && !(q.arsPerUsd && q.arsPerUsd > 0)) {
      errors.push('ARS quote without an ARS/USD rate — cannot verify');
    } else {
      const amounts: Array<[string, number]> = [];
      if (q.nightly !== undefined) amounts.push(['nightly', toUsd(q.nightly)]);
      if (q.total !== undefined) amounts.push(['total', toUsd(q.total) / dates.length]);
      for (const [kind, perNight] of amounts) {
        const what = kind === 'nightly' ? `quoted $${fmt(perNight)}/night` :
          `quoted $${fmt(perNight * dates.length)} for ${dates.length} night(s) ($${fmt(perNight)}/night)`;
        if (!(perNight >= maxFloor)) errors.push(`${what} is below the $${maxFloor}/night floor`);
        else if (perNight > ABSURD_NIGHT_USD[listing]) errors.push(`${what} is not a nightly price — check the currency`);
      }
      quotedUsd = q.total !== undefined ? toUsd(q.total) : toUsd(q.nightly!) * dates.length;
    }
  }

  let hostexTotal: number | null = null;
  if (q.hostexNights) {
    let sum = 0, complete = true;
    dates.forEach((d, i) => {
      const p = q.hostexNights![d];
      if (!p) { complete = false; errors.push(`Hostex ${d}: no price`); return; }
      sum += p;
      if (p < floors[i]) errors.push(`Hostex ${d}: $${p}/night is below the $${floors[i]} floor`);
    });
    hostexTotal = complete ? sum : null;
  }

  return { ok: errors.length === 0, listing, nights: dates.length, floorTotal, quotedUsd, hostexTotal, errors };
}

// ─── Derivation (re-run against live history: scripts/price-check.ts derive) ─

export interface SoldNight {
  listing: ListingName;
  date: string;
  /** Accommodation USD for this night */
  price: number;
}

export function deriveFloors(nights: SoldNight[]): Record<SeasonTier, { suites: number | null; casa: number | null }> {
  const tiers: SeasonTier[] = ['peak', 'high', 'shoulder', 'off'];
  const pick = (prices: number[], cost: number): number | null => {
    if (!prices.length) return null;
    const s = [...prices].sort((a, b) => a - b);
    const median = s[Math.floor((s.length - 1) / 2)];
    return Math.max(cost, Math.floor(Math.min(median / 2, s[0]) / 5) * 5);
  };
  const out = {} as Record<SeasonTier, { suites: number | null; casa: number | null }>;
  for (const t of tiers) {
    const inTier = nights.filter(n => getSeasonTier(n.date) === t);
    out[t] = {
      suites: pick(inTier.filter(n => n.listing !== WHOLE_HOUSE_NAME).map(n => n.price), SUITE_COST_FLOOR),
      casa: pick(inTier.filter(n => n.listing === WHOLE_HOUSE_NAME).map(n => n.price), CASA_COST_FLOOR),
    };
  }
  return out;
}
