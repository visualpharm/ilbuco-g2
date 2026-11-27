import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildOffer, priceFor, priceRule, LATE_CHECKOUT_PRICE, makeRef, parseRef, artNow, offeredHours, type Stay } from './late-checkout';

const GIARDINO = 12282945;
const TERRAZZO = 12282946;
const HOUSE = 12299611;
// 2026-11-25 09:30 ART
const NOW = Date.parse('2026-11-25T12:30:00Z');

const stay = (code: string, pid: number, ci: string, co: string): Stay => ({ reservation_code: code, property_id: pid, check_in_date: ci, check_out_date: co });

test('ART date and hour', () => {
  assert.deepEqual(artNow(NOW), { date: '2026-11-25', hour: 9, minute: 30 });
});

test('room leaving today with no arrival: open, per-hour prices', () => {
  const o = buildOffer({ room: 'giardino', stays: [stay('A', GIARDINO, '2026-11-22', '2026-11-25')], now: NOW, rule: { kind: 'perHour', ars: 20000 }, paid: [] });
  assert.equal(o.closed, null);
  assert.equal(o.date, '2026-11-25');
  assert.deepEqual(o.options.map(x => [x.until, x.ars, x.past]), [['12:00', 20000, false], ['13:00', 40000, false]]);
});

test('same-day arrival in the room closes it', () => {
  const stays = [stay('A', GIARDINO, '2026-11-22', '2026-11-25'), stay('B', GIARDINO, '2026-11-25', '2026-11-27')];
  assert.equal(buildOffer({ room: 'giardino', stays, now: NOW, rule: null, paid: [] }).closed, 'arrival');
});

test('whole-house arrival closes a suite; another suite arrival does not', () => {
  const leaving = stay('A', GIARDINO, '2026-11-22', '2026-11-25');
  assert.equal(buildOffer({ room: 'giardino', stays: [leaving, stay('H', HOUSE, '2026-11-25', '2026-11-26')], now: NOW, rule: null, paid: [] }).closed, 'arrival');
  assert.equal(buildOffer({ room: 'giardino', stays: [leaving, stay('T', TERRAZZO, '2026-11-25', '2026-11-26')], now: NOW, rule: null, paid: [] }).closed, null);
});

test('whole house leaving: any suite arrival closes every room', () => {
  const stays = [stay('H', HOUSE, '2026-11-22', '2026-11-25'), stay('T', TERRAZZO, '2026-11-25', '2026-11-26')];
  assert.equal(buildOffer({ room: 'giardino', stays, now: NOW, rule: null, paid: [] }).closed, 'arrival');
});

test('a stay ending tomorrow is offered the evening before; none → no_checkout', () => {
  const o = buildOffer({ room: 'giardino', stays: [stay('A', GIARDINO, '2026-11-24', '2026-11-26')], now: NOW, rule: null, paid: [] });
  assert.equal(o.date, '2026-11-26');
  assert.equal(o.closed, null);
  assert.equal(buildOffer({ room: 'giardino', stays: [stay('A', GIARDINO, '2026-11-24', '2026-11-28')], now: NOW, rule: null, paid: [] }).closed, 'no_checkout');
});

test('already bought → closed with the hour', () => {
  const o = buildOffer({ room: 'giardino', stays: [stay('A', GIARDINO, '2026-11-22', '2026-11-25')], now: NOW, rule: null, paid: [{ room: 'giardino', date: '2026-11-25', until: '13:00' }] });
  assert.equal(o.closed, 'already_paid');
  assert.equal(o.paidUntil, '13:00');
});

test('an hour already passed today is marked past', () => {
  const late = Date.parse('2026-11-25T15:10:00Z'); // 12:10 ART
  const o = buildOffer({ room: 'giardino', stays: [stay('A', GIARDINO, '2026-11-22', '2026-11-25')], now: late, rule: { kind: 'perHour', ars: 20000 }, paid: [] });
  assert.deepEqual(o.options.map(x => x.past), [true, false]);
});

test('price rules: none → no number; flat → one option at 13:00; percent of the night', () => {
  assert.equal(priceFor(null, 13, 100000), null);
  assert.deepEqual(offeredHours({ kind: 'flat', ars: 50000 }), [13]);
  assert.equal(priceFor({ kind: 'flat', ars: 50000 }, 13, null), 50000);
  assert.equal(priceFor({ kind: 'percentNight', percent: 25 }, 13, 141_300), 35000);
  assert.equal(priceFor({ kind: 'percentNight', percent: 25 }, 13, null), null);
});

test('env price rule is validated', () => {
  assert.deepEqual(priceRule('{"kind":"perHour","ars":20000}'), { kind: 'perHour', ars: 20000 });
  assert.deepEqual(priceRule('{"kind":"flat","ars":-1}'), LATE_CHECKOUT_PRICE);
  assert.deepEqual(priceRule('nonsense'), LATE_CHECKOUT_PRICE);
  assert.deepEqual(priceRule(''), { kind: 'flat', ars: 50000 });
});

test('reference round-trips and rejects junk', () => {
  const ref = makeRef({ room: 'paraiso', date: '2026-11-25', until: '13:00', reservation: '5-6CIPR80FI', ars: 50000 });
  assert.equal(ref, 'ilbuco-late:paraiso:2026-11-25:1300:5-6CIPR80FI:50000');
  assert.deepEqual(parseRef(ref), { room: 'paraiso', date: '2026-11-25', until: '13:00', reservation: '5-6CIPR80FI', ars: 50000 });
  assert.equal(parseRef('ilbuco:giardino:1:2'), null);
  assert.equal(parseRef('ilbuco-late:kitchen:2026-11-25:1300:X:1'), null);
});

test('guest label: first name + surname initial only', async () => {
  const { guestLabel, departingGuests } = await import('./late-checkout');
  assert.equal(guestLabel('maría de los Ángeles gómez'), 'María G.');
  assert.equal(guestLabel('JOHN'), 'John');
  assert.equal(guestLabel(''), 'Huésped');
  const stays = [{ ...stay('A', GIARDINO, '2026-11-22', '2026-11-25'), guest_name: 'Ana Pérez' }, { ...stay('H', HOUSE, '2026-11-20', '2026-11-25'), guest_name: 'Luis Ruiz' }];
  assert.deepEqual(departingGuests(stays, '2026-11-25').map(g => g.label), ['Ana P.', 'Luis R.']);
});
