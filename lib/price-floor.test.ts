/**
 * Hard price floor tests — the absurd-price stop (Ivan 2026-10-22, m734035):
 * a $30/night quote must come back as an error, never as a price, on every path
 * (noe's quote check, guest-facing calendars, the engine, the pre-push gate).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PRICE_FLOORS,
  LISTING_NAMES,
  priceFloor,
  normalizeListing,
  assertAboveFloor,
  guestNightPrice,
  checkQuote,
  deriveFloors,
  subFloorNightlyMentions,
  TURNOVER_COST_USD,
  SUITE_COST_FLOOR,
  CASA_COST_FLOOR,
  PriceBelowFloorError,
  type SoldNight,
} from './price-floor.ts';
import { computeNightPrice, BASE_PRICES, type PriceOverride } from './pricing-engine.ts';
import { prePushGates } from './sanity-checks.ts';
import { guestSafeCalendar } from './hostex-api.ts';

const PEAK = '2027-01-15';
const OFF = '2026-10-27';

test('a $30/night suite quote is an error, in peak and off season', () => {
  for (const [checkIn, checkOut] of [[PEAK, '2027-01-17'], [OFF, '2026-10-29']]) {
    assert.throws(() => assertAboveFloor('Giardino', checkIn, 30), PriceBelowFloorError);
    const q = checkQuote({ listing: 'Giardino', checkIn, checkOut, nightly: 30 });
    assert.equal(q.ok, false);
    assert.match(q.errors[0], /below the \$\d+\/night floor/);
  }
});

test('a $30/night whole-house quote is an error', () => {
  const q = checkQuote({ listing: 'casa', checkIn: PEAK, checkOut: '2027-01-17', total: 60 });
  assert.equal(q.ok, false);
  assert.equal(q.floorTotal, 2 * PRICE_FLOORS.peak['Whole House']);
});

test('real historical prices pass: cheapest peak sale ($75) and off-season ($72)', () => {
  assert.doesNotThrow(() => assertAboveFloor('Penthouse', PEAK, 75));
  assert.doesNotThrow(() => assertAboveFloor('Paraiso', OFF, 72));
  assert.doesNotThrow(() => assertAboveFloor('Whole House', PEAK, 526));
});

test('every listing has a floor in every tier, peak ≥ the rest, cost floors respected', () => {
  for (const tier of ['peak', 'high', 'shoulder', 'off'] as const) {
    for (const l of LISTING_NAMES) {
      const f = PRICE_FLOORS[tier][l];
      assert.ok(f >= (l === 'Whole House' ? 250 : 65), `${tier} ${l} $${f}`);
      assert.ok(PRICE_FLOORS.peak[l] >= f);
    }
  }
});

test('the floor stays well under normal pricing: every base price ≥ 1.3× its floor', () => {
  // A base price close to its floor would mean the floor bites into normal pricing.
  for (const [tier, rooms] of Object.entries(BASE_PRICES)) {
    for (const [room, base] of Object.entries(rooms)) {
      assert.ok(base >= PRICE_FLOORS[tier as keyof typeof PRICE_FLOORS][room as 'Giardino'] * 1.3, `${tier} ${room}`);
    }
  }
});

test('ARS quotes convert at the given rate; ARS without a rate cannot be verified', () => {
  const ok = checkQuote({ listing: 'Terrazzo', checkIn: OFF, checkOut: '2026-10-29', total: 320_000, currency: 'ARS', arsPerUsd: 1525 });
  assert.equal(ok.ok, true, ok.errors.join('; '));
  // Hostex USD figure pasted as pesos: 210 "ARS" ≈ $0.14 → stop
  const swapped = checkQuote({ listing: 'Terrazzo', checkIn: OFF, checkOut: '2026-10-29', total: 210, currency: 'ARS', arsPerUsd: 1525 });
  assert.equal(swapped.ok, false);
  const noRate = checkQuote({ listing: 'Terrazzo', checkIn: OFF, checkOut: '2026-10-29', total: 320_000, currency: 'ARS' });
  assert.equal(noRate.ok, false);
});

test('a sub-floor or missing live Hostex night fails the check even with a good quote', () => {
  const q = checkQuote({
    listing: 'Paraiso', checkIn: OFF, checkOut: '2026-10-29', total: 200,
    hostexNights: { '2026-10-27': 30, '2026-10-28': 100 },
  });
  assert.equal(q.ok, false);
  assert.match(q.errors.join(' '), /Hostex 2026-10-27: \$30\/night/);
  const missing = checkQuote({ listing: 'Paraiso', checkIn: OFF, checkOut: '2026-10-29', hostexNights: { '2026-10-27': 100 } });
  assert.equal(missing.ok, false);
  assert.equal(missing.hostexTotal, null);
});

test('guest-facing price: below floor or zero → null (never quoted), valid → unchanged', () => {
  assert.equal(guestNightPrice('Giardino', PEAK, 30), null);
  assert.equal(guestNightPrice('Giardino', PEAK, 0), null);
  assert.equal(guestNightPrice('Unknown suite', PEAK, 200), null);
  assert.equal(guestNightPrice('Giardino', PEAK, 180), 180);
});

test('listing names: Hostex, slugs and Spanish spellings', () => {
  assert.equal(normalizeListing('Paraíso'), 'Paraiso');
  assert.equal(normalizeListing('whole-house'), 'Whole House');
  assert.equal(normalizeListing('Il Buco (Whole House)'), 'Whole House');
  assert.equal(normalizeListing('Casa completa'), 'Whole House');
  assert.throws(() => normalizeListing('Recharge Retreat'));
  assert.equal(priceFloor('penthouse', PEAK), PRICE_FLOORS.peak.Penthouse);
});

test('engine: a $30 fixed override clamps up to the season floor', () => {
  const o: PriceOverride = {
    id: 'bad', start: PEAK, end: PEAK, rooms: ['*'], mode: 'fixed', value: 30, author: 't', createdAt: '2026-10-22',
  };
  const n = computeNightPrice('Giardino', PEAK, { windowOccupancy: 0, leadDays: 200 }, { overrides: [o] });
  assert.equal(n.price, PRICE_FLOORS.peak.Giardino);
});

test('pre-push gate: a peak suite night under the peak floor aborts the push', () => {
  const v = prePushGates(
    { Giardino: [{ date: PEAK, tier: 'peak', engine: 66, price: 66, booked: false }] },
    [], {}, BASE_PRICES, 0.92, '2026-10-22',
  );
  assert.ok(v.some(g => g.gate === 'bounds'), JSON.stringify(v));
});

test('deriveFloors: half the median, capped at the cheapest sale, never under cost', () => {
  const n = (listing: SoldNight['listing'], date: string, price: number): SoldNight => ({ listing, date, price });
  const d = deriveFloors([
    n('Giardino', PEAK, 75), n('Terrazzo', PEAK, 145), n('Paraiso', PEAK, 200),
    n('Whole House', PEAK, 526), n('Whole House', PEAK, 650), n('Whole House', PEAK, 810),
    n('Paraiso', OFF, 95),
  ]);
  assert.equal(d.peak.suites, 70);   // 145/2 = 72.5 → 70
  assert.equal(d.peak.casa, 325);    // 650/2
  assert.equal(d.off.suites, 65);    // 47.5 → cost floor
  assert.equal(d.high.suites, null); // no history
});

test('each quoted night clears its own floor: a stay into peak is held to the peak floor', () => {
  // Dec 19 (high, $65) + Dec 20 (peak, $70): $135 total = $67.50/night → stop
  const q = checkQuote({ listing: 'Giardino', checkIn: '2026-12-19', checkOut: '2026-12-21', total: 135 });
  assert.equal(q.ok, false);
  // total and nightly both given: both are checked
  const both = checkQuote({ listing: 'Giardino', checkIn: OFF, checkOut: '2026-10-29', total: 400, nightly: 30 });
  assert.equal(both.ok, false);
  assert.match(both.errors.join(' '), /\$30\/night/);
});

test('pesos labelled as dollars are stopped as a currency mix-up', () => {
  const q = checkQuote({ listing: 'Terrazzo', checkIn: OFF, checkOut: '2026-10-29', total: 320_000, currency: 'USD' });
  assert.equal(q.ok, false);
  assert.match(q.errors[0], /check the currency/);
});

test('outbound text: nightly figures under the floor are found, fees and real prices are not', () => {
  assert.deepEqual(subFloorNightlyMentions('Giardino is free, $30/night.'), [30]);
  assert.deepEqual(subFloorNightlyMentions('Te queda a US$ 45 por noche'), [45]);
  assert.deepEqual(subFloorNightlyMentions('40 USD la noche'), [40]);
  assert.deepEqual(subFloorNightlyMentions('Penthouse $251/night, cleaning $10, extra guest $10'), []);
  assert.deepEqual(subFloorNightlyMentions('$160.000 por noche'), []);
  assert.deepEqual(subFloorNightlyMentions('US$105 per night'), []);
});

test('guest calendar: a sub-floor night is neither priced nor available', () => {
  const cal = guestSafeCalendar({
    rooms: [{
      name: 'Paraiso', available: true, price: 30,
      dates: [
        { date: OFF, available: true, price: 30 },
        { date: '2026-10-28', available: true, price: 100 },
      ],
    }],
  });
  const r = cal.rooms[0];
  assert.deepEqual(r.dates[0], { date: OFF, available: false, price: 0 });
  assert.equal(r.price, 100);
  assert.equal(r.available, true);
});

test('every night floor pays for a full turnover clean, so a one-night stay covers it', () => {
  for (const tier of Object.values(PRICE_FLOORS)) {
    for (const l of LISTING_NAMES) {
      const clean = l === 'Whole House' ? TURNOVER_COST_USD.casa : TURNOVER_COST_USD.suite;
      assert.ok(tier[l] > clean, `${l} $${tier[l]} vs clean $${clean}`);
    }
  }
  assert.ok(SUITE_COST_FLOOR > TURNOVER_COST_USD.suite && CASA_COST_FLOOR > TURNOVER_COST_USD.casa);
});
