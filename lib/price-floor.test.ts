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
  PriceBelowFloorError,
  type SoldNight,
} from './price-floor.ts';
import { computeNightPrice, BASE_PRICES, type PriceOverride } from './pricing-engine.ts';
import { prePushGates } from './sanity-checks.ts';

const PEAK = '2027-01-15';
const OFF = '2026-10-27';

test('a $30/night suite quote is an error, in peak and off season', () => {
  for (const [checkIn, checkOut] of [[PEAK, '2027-01-17'], [OFF, '2026-10-29']]) {
    assert.throws(() => assertAboveFloor('Giardino', checkIn, 30), PriceBelowFloorError);
    const q = checkQuote({ listing: 'Giardino', checkIn, checkOut, nightly: 30 });
    assert.equal(q.ok, false);
    assert.match(q.errors[0], /below the \$\d+ floor/);
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
