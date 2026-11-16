import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkPayment, createHold, holdProperties, releaseHold, reopenable, sweepHolds, uniqueAmount, FINAL_CHECK_GRACE_MS, HOLD_MS,
  type Hold, type HoldDeps, type HoldState,
} from './voice-hold.ts';
import { CASA, unitByKey, type Offer } from './voice-quote.ts';
import type { StrictReservationSpan } from './hostex-api.ts';
import type { DepositCheck } from './payment-bridge.ts';

const T0 = Date.parse('2026-11-16T15:00:00Z');
const SUITES = [12282945, 12282946, 12282947, 12282948];
const GIARDINO = unitByKey('giardino')!;

function offer(unit = CASA, checkIn = '2027-05-10', checkOut = '2027-05-12', ars = 1_078_783.7): Offer {
  return { id: `${unit.key}:${checkIn}:${checkOut}:6`, unit, checkIn, checkOut, guests: 6, nights: 2,
    usdTotal: 698, arsTotal: ars, usdNight: 349, usdNightAvg: 349 };
}

/** Fake Hostex: open[property][date]; reservations; a deposit answer. */
function world(opts: { closedAlready?: string[]; deposit?: DepositCheck; failCreate?: number } = {}) {
  let now = T0;
  let state: HoldState = { holds: [] };
  const open = new Map<string, boolean>();
  const isOpen = (p: number, d: string) => open.get(`${p}:${d}`) ?? !(opts.closedAlready ?? []).includes(`${p}:${d}`);
  const reservations: StrictReservationSpan[] = [];
  const notices: Array<{ kind: string; id: string; reason?: string }> = [];
  const asks: Array<{ amount: number; since: string; wait: number; mode: string }> = [];
  const created: unknown[] = [];
  let failCreate = opts.failCreate ?? 0;
  let deposit: DepositCheck = 'deposit' in opts ? (opts.deposit as DepositCheck) : { found: false };
  const deps: HoldDeps = {
    store: { load: async () => structuredClone(state), save: async s => { state = structuredClone(s); } },
    availability: async (ids, start, end) => {
      const m = new Map<number, Map<string, boolean>>();
      for (const p of ids) {
        const days = new Map<string, boolean>();
        for (let d = start; d <= end; d = new Date(Date.parse(`${d}T12:00:00Z`) + 864e5).toISOString().slice(0, 10)) days.set(d, isOpen(p, d));
        m.set(p, days);
      }
      return m;
    },
    close: async (ids, dates) => { for (const p of ids) for (const d of dates) open.set(`${p}:${d}`, false); },
    open: async (ids, dates) => { for (const p of ids) for (const d of dates) open.set(`${p}:${d}`, true); },
    reservations: async () => reservations,
    createReservation: async p => {
      if (failCreate-- > 0) throw new Error('Hostex create-reservation error: unavailable');
      created.push(p);
      return { reservation_code: 'R-1', status: 'accepted' };
    },
    findDeposit: async (amount, since, wait, mode) => { asks.push({ amount, since, wait, mode }); return deposit; },
    notify: async n => { notices.push({ kind: n.kind, id: n.id, reason: n.reason }); },
    now: () => now,
    rand: () => 0.42,
  };
  return {
    deps, isOpen, reservations, notices, created, asks,
    state: () => state,
    tick: (ms: number) => { now += ms; },
    setDeposit: (d: DepositCheck) => { deposit = d; },
  };
}

test('unique amount: site pesos up to the hundred plus a 1–99 tail, never reused within 15 minutes', () => {
  const a = uniqueAmount(1_078_783.7, [], T0, () => 0.42);
  assert.equal(a, 1_078_800 + 42);
  const holds = [{ amount: a, createdAt: T0 - 60_000 }] as Hold[];
  const b = uniqueAmount(1_078_783.7, holds, T0, () => 0.42);
  assert.notEqual(b, a);
  assert.ok(b > 1_078_800 && b < 1_078_900);
  const old = [{ amount: a, createdAt: T0 - 16 * 60_000 }] as Hold[];
  assert.equal(uniqueAmount(1_078_783.7, old, T0, () => 0.42), a);
});

test('the house holds itself and the suites; a suite holds itself and the house', () => {
  assert.deepEqual(holdProperties(CASA.propertyId), [CASA.propertyId, ...SUITES]);
  assert.deepEqual(holdProperties(GIARDINO.propertyId), [GIARDINO.propertyId, CASA.propertyId]);
});

test('hold closes every open night of the house and the suites; release reopens exactly those', async () => {
  // Terrazzo already closed on the 10th by someone else: the hold must not reopen it
  const w = world({ closedAlready: ['12282946:2027-05-10'] });
  const r = await createHold(offer(), { name: 'Ana', phone: '+54 9 223 432-2010', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  const h = r.hold;
  assert.equal(h.phone, '+5492234322010');
  assert.equal(h.expiresAt - h.createdAt, HOLD_MS);
  assert.equal(h.closed.length, 9);
  for (const p of [CASA.propertyId, ...SUITES]) for (const d of ['2027-05-10', '2027-05-11']) assert.equal(w.isOpen(p, d), false);
  await releaseHold(h.id, 'test', w.deps);
  assert.equal(w.state().holds[0].status, 'released');
  assert.equal(w.isOpen(12282946, '2027-05-10'), false, 'a night closed before the hold stays closed');
  assert.equal(w.isOpen(12282946, '2027-05-11'), true);
  assert.equal(w.isOpen(CASA.propertyId, '2027-05-10'), true);
});

test('no hold when the asked unit is not open', async () => {
  const w = world({ closedAlready: [`${CASA.propertyId}:2027-05-11`] });
  const r = await createHold(offer(), { name: 'Ana', phone: '2234322010' }, w.deps);
  assert.deepEqual(r, { ok: false, why: 'taken' });
  assert.equal(w.state().holds.length, 0);
});

test('a second hold_booking in the same call returns the same hold', async () => {
  const w = world();
  const a = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  const b = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(a.ok && b.ok && a.hold.id === b.hold.id);
  assert.equal(w.state().holds.length, 1);
});

test('release never reopens a night someone booked during the hold', () => {
  const closed = [
    { propertyId: CASA.propertyId, date: '2027-05-10' }, { propertyId: 12282945, date: '2027-05-10' },
    { propertyId: 12282946, date: '2027-05-10' }, { propertyId: 12282946, date: '2027-05-11' },
  ];
  const giardinoBooked = [{ property_id: 12282945, check_in_date: '2027-05-10', check_out_date: '2027-05-11' }] as StrictReservationSpan[];
  const { open, keep } = reopenable(closed, giardinoBooked);
  // the house can't be sold that night (a suite is taken), Giardino is booked; Terrazzo is free again
  assert.deepEqual(keep.map(p => `${p.propertyId}:${p.date}`), [`${CASA.propertyId}:2027-05-10`, '12282945:2027-05-10']);
  assert.deepEqual(open.map(p => `${p.propertyId}:${p.date}`), ['12282946:2027-05-10', '12282946:2027-05-11']);
  const houseBooked = [{ property_id: CASA.propertyId, check_in_date: '2027-05-10', check_out_date: '2027-05-12' }] as StrictReservationSpan[];
  assert.equal(reopenable(closed, houseBooked).open.length, 0);
});

test('unpaid after 10 minutes: the sweep releases the hold and tells noe and agent-payments once', async () => {
  const w = world();
  const r = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.tick(5 * 60_000);
  assert.deepEqual((await sweepHolds(w.deps)).released, []);
  const pending = await checkPayment(r.hold.id, w.deps);
  assert.equal(pending.state, 'pending');
  w.tick(5 * 60_000 + 1);
  assert.deepEqual((await sweepHolds(w.deps)).released, [r.hold.id]);
  await sweepHolds(w.deps);
  assert.deepEqual(w.notices.map(n => n.kind), ['hold_expired']);
  assert.equal(w.isOpen(CASA.propertyId, '2027-05-10'), true);
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'expired');
});

test('paid: the exact amount books the stay in Hostex in pesos and keeps the dates closed', async () => {
  const w = world();
  const r = await createHold(offer(), { name: 'Ana', phone: '+5492234322010', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.setDeposit({ found: true, amount: `${r.hold.amount}.00`, at: '2026-11-16T12:03:00-03:00' });
  const p = await checkPayment(r.hold.id, w.deps);
  assert.equal(p.state, 'booked');
  const c = w.created[0] as Record<string, unknown>;
  assert.equal(c.currency, 'ARS');
  assert.equal(c.rate_amount, r.hold.amount);
  assert.equal(c.received_amount, r.hold.amount);
  assert.equal(c.property_id, CASA.propertyId);
  assert.deepEqual(w.notices.map(n => n.kind), ['paid']);
  w.tick(HOLD_MS * 2);
  await sweepHolds(w.deps);
  assert.equal(w.isOpen(12282945, '2027-05-10'), false, 'a booked hold is never released');
});

test('paid but Hostex refuses twice: paid_unbooked, noe and payments told, dates stay held', async () => {
  const w = world({ failCreate: 2 });
  const r = await createHold(offer(GIARDINO), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.setDeposit({ found: true, amount: String(r.hold.amount), at: '2026-11-16T12:03:00-03:00' });
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'paid_unbooked');
  assert.deepEqual(w.notices.map(n => n.kind), ['paid_unbooked']);
  assert.equal(w.isOpen(CASA.propertyId, '2027-05-10'), false);
});

test('paid and the first create is refused: open the unit itself, retry once, booked', async () => {
  const w = world({ failCreate: 1 });
  const r = await createHold(offer(GIARDINO), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.setDeposit({ found: true, amount: String(r.hold.amount), at: '2026-11-16T12:03:00-03:00' });
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'booked');
  assert.equal(w.isOpen(CASA.propertyId, '2027-05-10'), false, 'the house stays closed for the booked suite');
});

test('the bridge cannot check: unverified, noe told once; the sweep keeps the hold a few minutes, then releases', async () => {
  const w = world({ deposit: null });
  const r = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'unverified');
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'unverified');
  assert.deepEqual(w.notices.map(n => n.kind), ['payment_unverified']);
  w.tick(HOLD_MS + 1);
  await sweepHolds(w.deps);
  assert.equal(w.state().holds[0].status, 'held', 'no blind release while the last check cannot run');
  w.tick(FINAL_CHECK_GRACE_MS);
  await sweepHolds(w.deps);
  assert.equal(w.state().holds[0].status, 'released');
  assert.deepEqual(w.notices.map(n => n.kind), ['payment_unverified', 'hold_expired']);
  assert.match(w.notices[1].reason ?? '', /проверка Ripio/);
});

test('hold_booking warms the bridge watcher; check_payment asks it for a few seconds only', async () => {
  const w = world();
  const r = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  const since = new Date(T0 - 2 * 60_000).toISOString();
  assert.deepEqual(w.asks, [{ amount: r.hold.amount, since, wait: 0, mode: 'watch' }]);
  await checkPayment(r.hold.id, w.deps);
  assert.deepEqual(w.asks[1], { amount: r.hold.amount, since, wait: 3, mode: 'watch' });
  w.tick(HOLD_MS);
  await checkPayment(r.hold.id, w.deps);
  assert.equal(w.asks[2].mode, 'once', 'past the 10 minutes: a fresh run before release');
});

test('sweep: paid after the caller hung up — the last check books instead of releasing, noe and payments told', async () => {
  const w = world();
  const r = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.setDeposit({ found: true, amount: String(r.hold.amount), at: '2026-11-16T12:09:00-03:00' });
  w.tick(HOLD_MS + 1);
  const s = await sweepHolds(w.deps);
  assert.deepEqual(s, { released: [], booked: [r.hold.id] });
  assert.equal(w.asks.at(-1)!.mode, 'once');
  assert.equal(w.asks.at(-1)!.since, new Date(T0 - 2 * 60_000).toISOString());
  assert.equal(w.state().holds[0].status, 'booked');
  assert.equal(w.created.length, 1);
  assert.deepEqual(w.notices.map(n => n.kind), ['paid']);
  assert.match(w.notices[0].reason ?? '', /последней проверке/);
  assert.equal(w.isOpen(CASA.propertyId, '2027-05-10'), false);
  await sweepHolds(w.deps);
  assert.equal(w.created.length, 1, 'booked once');
});

test('sweep: not paid at the last check — released as before', async () => {
  const w = world();
  const r = await createHold(offer(), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.tick(HOLD_MS + 1);
  assert.deepEqual(await sweepHolds(w.deps), { released: [r.hold.id], booked: [] });
  assert.equal(w.asks.at(-1)!.mode, 'once');
});

test('paid but a reservation already sits on the nights: never a second reservation, paid_unbooked', async () => {
  const w = world();
  const r = await createHold(offer(GIARDINO), { name: 'Ana', phone: '1', callId: 'c1' }, w.deps);
  assert.ok(r.ok);
  w.reservations.push({ reservation_code: 'R-0', stay_code: 'S', property_id: GIARDINO.propertyId,
    check_in_date: '2027-05-10', check_out_date: '2027-05-12', status: 'accepted', cancelled_at: null });
  w.setDeposit({ found: true, amount: String(r.hold.amount), at: '2026-11-16T12:03:00-03:00' });
  assert.equal((await checkPayment(r.hold.id, w.deps)).state, 'paid_unbooked');
  assert.equal(w.created.length, 0);
  assert.match(w.notices[0].reason ?? '', /R-0/);
});

test('a failed close releases what was closed and reports an error', async () => {
  const w = world();
  w.deps.close = async () => { throw new Error('Hostex 500'); };
  const r = await createHold(offer(), { name: 'Ana', phone: '1' }, w.deps);
  assert.equal(r.ok, false);
  assert.equal(w.state().holds[0].status, 'released');
});
