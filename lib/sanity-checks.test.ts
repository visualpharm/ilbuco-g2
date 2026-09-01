/**
 * prePushGates tests — pins the price sanity gates that must abort a live
 * Hostex push: per-night bounds, tier ordering, fiestas floor, casa factor
 * band, and churn vs. current prices. postPushVerify is NOT covered here (it
 * reads the live Hostex API). Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prePushGates, SUITE_MIN, SUITE_MAX, type GateViolation } from './sanity-checks.ts';
import { BASE_PRICES, type DayPriceEntry, type SeasonTier } from './pricing-engine.ts';
import { addDays } from './season-calendar.ts';

const START = '2026-09-01';

function entry(date: string, price: number, tier: SeasonTier = 'off', overrideId?: string): DayPriceEntry {
  return { date, tier, engine: price, price, booked: false, overrideId };
}

function run(
  schedules: Record<string, DayPriceEntry[]>,
  wholeHouseDays: Array<{ date: string; value: number }> = [],
  currentByRoom: Record<string, Map<string, number>> = {},
  wholeHouseFactor = 0.95
): GateViolation[] {
  return prePushGates(schedules, wholeHouseDays, currentByRoom, BASE_PRICES, wholeHouseFactor, START);
}

// ─── All-clear ───────────────────────────────────────────────────────────────

test('prePushGates: in-band prices pass with no violations', () => {
  const v = run({
    Paraiso: [entry('2026-09-01', 90), entry('2026-09-02', 95)],
  });
  assert.deepEqual(v, []);
});

// ─── Per-night bounds ────────────────────────────────────────────────────────

test(`prePushGates: suite price below $${SUITE_MIN} is a bounds violation`, () => {
  const v = run({ Paraiso: [entry('2026-09-01', SUITE_MIN - 1)] });
  assert.equal(v.length, 1);
  assert.equal(v[0].gate, 'bounds');
  assert.ok(v[0].detail.includes('Paraiso'));
});

test(`prePushGates: suite price above $${SUITE_MAX} is a bounds violation`, () => {
  const v = run({ Paraiso: [entry('2026-09-01', SUITE_MAX + 1)] });
  assert.equal(v[0].gate, 'bounds');
});

test('prePushGates: whole-house price outside the casa band is a bounds violation', () => {
  const v = run({ Paraiso: [entry('2026-09-01', 90)] }, [{ date: '2026-09-01', value: 200 }]);
  assert.equal(v.length, 1);
  assert.equal(v[0].gate, 'bounds');
  assert.ok(v[0].detail.includes('Casa'));
});

// ─── Tier ordering ───────────────────────────────────────────────────────────

test('prePushGates: avg peak not above avg shoulder is a tier-order violation', () => {
  const v = run({
    Paraiso: [entry('2026-07-10', 100, 'peak'), entry('2026-07-11', 100, 'peak'), entry('2026-09-10', 150, 'shoulder')],
  });
  assert.ok(v.some(x => x.gate === 'tier-order' && x.detail.includes('Paraiso')));
});

test('prePushGates: correctly ordered tiers pass', () => {
  const v = run({
    Paraiso: [entry('2026-07-10', 200, 'peak'), entry('2026-09-10', 110, 'shoulder'), entry('2026-09-11', 90, 'off')],
  });
  assert.deepEqual(v, []);
});

// ─── Fiestas floor ───────────────────────────────────────────────────────────

test('prePushGates: fiestas night priced below peak base is a fiestas violation', () => {
  const v = run({ Paraiso: [entry('2026-12-25', 150)] }); // peak base for Paraiso is 195
  assert.equal(v.length, 1);
  assert.equal(v[0].gate, 'fiestas');
});

test('prePushGates: a manual override may price a fiestas night below peak base', () => {
  const v = run({ Paraiso: [entry('2026-12-25', 150, 'peak', 'manual-override')] });
  assert.deepEqual(v, []);
});

test('prePushGates: fiestas night at peak base passes', () => {
  const v = run({ Paraiso: [entry('2026-12-25', 195, 'peak')] });
  assert.deepEqual(v, []);
});

// ─── Casa factor ─────────────────────────────────────────────────────────────

test('prePushGates: whole-house factor outside 0.8–1.05 is a casa-factor violation', () => {
  const v = run({ Paraiso: [entry('2026-09-01', 90)] }, [], {}, 1.2);
  assert.equal(v.length, 1);
  assert.equal(v[0].gate, 'casa-factor');
});

// ─── Churn vs. current prices ────────────────────────────────────────────────

/** 60 dated entries from START, priced `price`; current map at `current`. */
function churnFixture(price: number, current: number) {
  const schedule = Array.from({ length: 60 }, (_, i) => entry(addDays(START, i), price));
  const currentByRoom = { Paraiso: new Map(schedule.map(e => [e.date, current])) };
  return { schedules: { Paraiso: schedule }, currentByRoom };
}

test('prePushGates: most dates moving >40% vs. current is a churn violation', () => {
  const { schedules, currentByRoom } = churnFixture(100, 200); // 50% move on every date
  const v = run(schedules, [], currentByRoom);
  assert.equal(v.length, 1);
  assert.equal(v[0].gate, 'churn');
  assert.ok(v[0].detail.includes('60/60'));
});

test('prePushGates: dates moving ≤40% vs. current raise no churn violation', () => {
  const { schedules, currentByRoom } = churnFixture(100, 150); // 33% move
  const v = run(schedules, [], currentByRoom);
  assert.deepEqual(v, []);
});
