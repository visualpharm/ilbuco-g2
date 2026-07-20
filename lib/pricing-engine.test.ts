/**
 * Pricing-engine regression tests — encode the Airbnb/Cariló comp pricing rules
 * so a future edit that breaks them fails loudly. Runs on Node's built-in test
 * runner (Node ≥ 22 strips TS types): `npm test`.
 *
 * Context (card 2026-07-03-il-buco-booking-fix-broken-pricing…): a guest
 * (Konstantin Sapo) reported "a single guest is billed as an extra guest and one
 * room shows >$300". Investigation: this engine prices PER NIGHT only — it has no
 * guest/occupancy input at all (see the `computeNightPrice` signature). The
 * extra-guest surcharge lives in the Hostex listing settings (base "guests
 * included" + per-guest fee), NOT in this repo, and is not reachable via the
 * Hostex v3 API this repo uses. These tests therefore pin the two things that ARE
 * in-repo: (a) the engine never invents a per-guest term, and (b) a non-fiestas
 * night never exceeds its tier ceiling — so ">$300" is only ever a deliberate
 * peak (≤$320) or fiestas price, never a runaway bug.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_PRICES,
  CEILINGS,
  computeNightPrice,
  demandFactor,
  findOverride,
  applyOverride,
  buildPriceSchedule,
  computeLearning,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE_FACTOR,
  type PriceOverride,
  type DemandContext,
} from './pricing-engine.ts';
import {
  getSeasonTier,
  isWeekendNight,
  isHolidayNight,
  isFiestasNight,
  addDays,
} from './season-calendar.ts';

const ROOMS = IL_BUCO_ROOMS.map(r => r.name); // Giardino, Terrazzo, Paraiso, Penthouse
const TIERS = ['peak', 'high', 'shoulder', 'off'] as const;
const FLOOR = 65; // PRICING_FLOOR default

/** Demand-neutral context: pacing=1 (leadDays>90), house=1 (0 occ) → demand=1. */
const NEUTRAL: DemandContext = { windowOccupancy: 0, leadDays: 200, houseOccupancy: 0 };
/** Max-demand context: close-in + fully paced + rest of house booked → demand=1.30. */
const HOT: DemandContext = { windowOccupancy: 1, leadDays: 5, houseOccupancy: 1 };

/** First date on/after `from` for which `pred` holds (bounded scan). */
function findDate(from: string, pred: (d: string) => boolean, span = 730): string {
  let d = from;
  for (let i = 0; i < span; i++) {
    if (pred(d)) return d;
    d = addDays(d, 1);
  }
  throw new Error(`no date satisfying predicate within ${span} days of ${from}`);
}

// ─── Base table: the Airbnb/Cariló comp corridor ────────────────────────────

test('base table ranks peak ≥ high ≥ shoulder ≥ off for every room', () => {
  for (const room of ROOMS) {
    assert.ok(BASE_PRICES.peak[room] >= BASE_PRICES.high[room], `${room} peak≥high`);
    assert.ok(BASE_PRICES.high[room] >= BASE_PRICES.shoulder[room], `${room} high≥shoulder`);
    assert.ok(BASE_PRICES.shoulder[room] >= BASE_PRICES.off[room], `${room} shoulder≥off`);
  }
});

test('peak bases sit inside the Cariló cap≤6 comp corridor (competitive vs Airbnb)', () => {
  // Comp corridor: median high $245, proven A-tier peers $190–236; guard $180–260
  // so a future edit that makes us non-competitive (e.g. $400) fails here.
  for (const room of ROOMS) {
    const p = BASE_PRICES.peak[room];
    assert.ok(p >= 180 && p <= 260, `${room} peak base $${p} outside competitive $180–260`);
  }
});

test('no base price exceeds its tier ceiling', () => {
  for (const tier of TIERS) {
    for (const room of ROOMS) {
      assert.ok(BASE_PRICES[tier][room] <= CEILINGS[tier], `${room} ${tier} base > ceiling`);
    }
  }
});

// ─── Per-night engine: modifier rules ───────────────────────────────────────

test('a plain off-season night with neutral demand prices at exactly the base', () => {
  const d = findDate('2026-09-01', x =>
    getSeasonTier(x) === 'off' && !isWeekendNight(x) && !isHolidayNight(x) && !isFiestasNight(x));
  for (const room of ROOMS) {
    const n = computeNightPrice(room, d, NEUTRAL);
    assert.equal(n.engine, BASE_PRICES.off[room], `${room} ${d} should equal off base`);
    assert.equal(n.factors.weekend, 1);
    assert.equal(n.factors.holiday, 1);
    assert.equal(n.factors.demand, 1);
  }
});

test('Fri/Sat off-season night applies only the weekend premium', () => {
  const d = findDate('2026-09-01', x =>
    getSeasonTier(x) === 'off' && isWeekendNight(x) && !isHolidayNight(x) && !isFiestasNight(x));
  for (const room of ROOMS) {
    const n = computeNightPrice(room, d, NEUTRAL);
    // off-season weekend premium = 1.15
    assert.equal(n.engine, Math.round(BASE_PRICES.off[room] * 1.15), `${room} ${d} weekend`);
    assert.equal(n.factors.holiday, 1, 'weekend must not stack with holiday');
  }
});

test('a long-weekend holiday night applies the holiday premium and NOT the weekend one', () => {
  const d = findDate('2026-07-01', x =>
    isHolidayNight(x) && !isFiestasNight(x) && getSeasonTier(x) === 'off');
  for (const room of ROOMS) {
    const n = computeNightPrice(room, d, NEUTRAL);
    assert.equal(n.factors.weekend, 1, 'holiday replaces weekend, never stacks');
    assert.equal(n.factors.holiday, 1.25);
    assert.equal(n.engine, Math.round(BASE_PRICES.off[room] * 1.25), `${room} ${d} holiday`);
  }
});

test('a fiestas night (Navidad/Año Nuevo) prices ABOVE peak base and may exceed the ceiling', () => {
  const d = '2026-12-28'; // inside the 2026-12-24..2027-01-02 fiestas window
  assert.ok(isFiestasNight(d));
  for (const room of ROOMS) {
    const n = computeNightPrice(room, d, NEUTRAL);
    assert.ok(n.engine >= BASE_PRICES.peak[room], `${room} fiestas ≥ peak base`);
    // fiestas premium is 1.45 on top of the peak base
    assert.equal(n.engine, Math.round(BASE_PRICES.peak[room] * 1.45), `${room} fiestas = peak×1.45`);
  }
});

// ─── The bug-report invariants ──────────────────────────────────────────────

test('the engine has NO guest/occupancy term — price is per-night, not per-guest', () => {
  // The reported "single guest billed as an extra guest" cannot originate here:
  // computeNightPrice takes only (room, date, demandCtx) — no guest count. Same
  // inputs → identical price. The extra-guest fee is a Hostex listing setting.
  const d = '2026-01-15';
  for (const room of ROOMS) {
    const a = computeNightPrice(room, d, NEUTRAL);
    const b = computeNightPrice(room, d, NEUTRAL);
    assert.equal(a.price, b.price, 'pricing must be deterministic per night');
    assert.ok(!('guests' in a) && !('occupancy' in a), 'NightPrice carries no guest field');
  }
});

test('non-fiestas nights never exceed the tier ceiling, even at max demand (≤$320 → ">$300" is bounded)', () => {
  let d = '2026-07-04';
  const end = addDays(d, 400);
  for (; d < end; d = addDays(d, 1)) {
    const fiestas = isFiestasNight(d);
    const tier = getSeasonTier(d);
    for (const room of ROOMS) {
      const n = computeNightPrice(room, d, HOT);
      assert.ok(n.engine >= FLOOR, `${room} ${d} below floor: $${n.engine}`);
      if (!fiestas) {
        assert.ok(n.engine <= CEILINGS[tier],
          `${room} ${d} (${tier}) $${n.engine} exceeds ceiling $${CEILINGS[tier]}`);
        assert.ok(n.engine <= 320, `${room} ${d} non-fiestas $${n.engine} > $320`);
      }
    }
  }
});

test('demand factor stays clamped to [0.70, 1.30]', () => {
  const samples: DemandContext[] = [
    NEUTRAL, HOT,
    { windowOccupancy: 0, leadDays: 5, houseOccupancy: 0 },   // dead close-in → low
    { windowOccupancy: 1, leadDays: 10, houseOccupancy: 0 },
    { windowOccupancy: 0.2, leadDays: 40, houseOccupancy: 0.7 },
  ];
  for (const d of ['2026-01-10', '2026-07-10', '2026-11-15']) {
    for (const ctx of samples) {
      const f = demandFactor(d, ctx);
      assert.ok(f >= 0.70 && f <= 1.30, `demand ${f} out of band on ${d}`);
    }
  }
});

test('last-minute ladder: unsold behind-pace nights discount harder as check-in nears', () => {
  const d = '2026-07-25'; // winter-break off-season date, expected occ > 0 → pace 0 when empty
  const empty = (leadDays: number): number =>
    demandFactor(d, { windowOccupancy: 0, leadDays, houseOccupancy: 0 });
  assert.equal(empty(2), 0.70);
  assert.equal(empty(6), 0.75);
  assert.equal(empty(12), 0.82);
  assert.equal(empty(20), 0.88);
  assert.equal(empty(40), 0.93);
  assert.equal(empty(80), 0.97);
  assert.equal(empty(200), 1.0, 'beyond 90 days lead there is no last-minute cut');
  // Monotone: closer check-in never prices higher than farther out
  let prev = 0;
  for (const lead of [2, 6, 12, 20, 40, 80, 200]) {
    const f = empty(lead);
    assert.ok(f >= prev, `ladder must be monotone non-decreasing in lead (${lead}d → ${f})`);
    prev = f;
  }
});

test('overrides with learn:false are excluded from override learning', () => {
  const promo: PriceOverride = {
    id: 'promo', start: '2026-08-01', end: '2026-08-31', rooms: ['*'], mode: 'coef',
    value: 0.9, author: 'test', createdAt: '2026-07-20T00:00:00Z', learn: false,
  };
  const sched = buildPriceSchedule('Giardino', '2026-08-01', '2026-08-31', {}, { overrides: [promo] });
  assert.ok(sched.every(e => e.overrideId === 'promo'), 'promo override must cover the window');
  const updates = computeLearning({ Giardino: sched }, {}, [promo]);
  assert.equal(updates.length, 0, 'a learn:false promo must not move learned coefficients');
  // Same schedule WITH learning allowed → the coefficient would move (sanity of the guard)
  const updatesLearnable = computeLearning({ Giardino: sched }, {}, []);
  assert.ok(updatesLearnable.length > 0, 'guard must be the only thing preventing learning here');
});

// ─── Manual overrides ───────────────────────────────────────────────────────

test('a fixed override wins over the engine; a coef override multiplies it; floor respected', () => {
  const d = '2026-09-16';
  const room = 'Giardino';
  const fixed: PriceOverride = {
    id: 'o1', start: d, end: d, rooms: [room], mode: 'fixed', value: 199,
    author: 'test', createdAt: '2026-07-01T00:00:00Z',
  };
  const coef: PriceOverride = {
    id: 'o2', start: d, end: d, rooms: ['*'], mode: 'coef', value: 1.5,
    author: 'test', createdAt: '2026-07-02T00:00:00Z', // later → wins on overlap
  };

  const nFixed = computeNightPrice(room, d, NEUTRAL, { overrides: [fixed] });
  assert.equal(nFixed.price, 199);
  assert.equal(nFixed.overrideId, 'o1');

  const nCoef = computeNightPrice(room, d, NEUTRAL, { overrides: [coef] });
  assert.equal(nCoef.price, Math.round(nCoef.engine * 1.5));

  // Later-created override wins when two overlap.
  const both = computeNightPrice(room, d, NEUTRAL, { overrides: [fixed, coef] });
  assert.equal(both.overrideId, 'o2');

  // A punishing coef can't push a price below the floor.
  const crush: PriceOverride = { ...coef, id: 'o3', mode: 'coef', value: 0.01 };
  const nCrush = computeNightPrice(room, d, NEUTRAL, { overrides: [crush] });
  assert.ok(nCrush.price >= FLOOR);
});

test('findOverride respects room scope, date range, and recency; applyOverride computes both modes', () => {
  const list: PriceOverride[] = [
    { id: 'a', start: '2026-08-01', end: '2026-08-10', rooms: ['Giardino'], mode: 'fixed', value: 150, author: 't', createdAt: '2026-07-01T00:00:00Z' },
    { id: 'b', start: '2026-08-05', end: '2026-08-20', rooms: ['*'], mode: 'coef', value: 1.2, author: 't', createdAt: '2026-07-03T00:00:00Z' },
  ];
  assert.equal(findOverride(list, 'Giardino', '2026-08-02')?.id, 'a');    // only 'a' covers
  assert.equal(findOverride(list, 'Giardino', '2026-08-07')?.id, 'b');    // both cover → later wins
  assert.equal(findOverride(list, 'Terrazzo', '2026-08-02'), null);       // out of room scope
  assert.equal(findOverride(list, 'Giardino', '2026-09-01'), null);       // out of date range
  assert.equal(applyOverride(list[0], 999), 150);                          // fixed ignores engine
  assert.equal(applyOverride(list[1], 100), 120);                          // coef multiplies
});

// ─── Schedule builder + whole-house factor ──────────────────────────────────

test('buildPriceSchedule yields one dated, floored entry per night in range', () => {
  const start = '2026-09-01', end = '2026-09-08';
  const sched = buildPriceSchedule('Terrazzo', start, end);
  assert.equal(sched.length, 7);
  assert.equal(sched[0].date, start);
  for (const e of sched) {
    assert.ok(e.price >= FLOOR && e.engine >= FLOOR);
    assert.ok(['peak', 'high', 'shoulder', 'off'].includes(e.tier));
  }
});

test('whole-house bundle factor is a sane <1 discount', () => {
  assert.ok(WHOLE_HOUSE_FACTOR >= 0.8 && WHOLE_HOUSE_FACTOR <= 1.05, 'factor band');
  assert.equal(WHOLE_HOUSE_FACTOR, 0.92, 'documented default bundle discount');
});
