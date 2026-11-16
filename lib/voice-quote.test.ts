import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays, newYearBlock, stayBlocker, voiceQuote, CASA, UNITS, unitByKey,
  type NightCell, type SiteQuote, type UnitInfo, type UnitKey, type VoiceCalendar,
} from './voice-quote.ts';

const RATE = 1545.54;
const NOW = Date.parse('2026-11-16T15:00:00Z');
const PRICE: Record<UnitKey, number> = { casa: 552, giardino: 138, terrazzo: 150, paraiso: 140, penthouse: 160 };

/** Every unit open from start to end at its price; `closed` = 'unit:date' pairs taken. */
function calendar(start: string, end: string, closed: string[] = [], over: Partial<Record<string, Partial<NightCell>>> = {}): VoiceCalendar {
  const cal = Object.fromEntries(UNITS.map(u => [u.key, new Map<string, NightCell>()])) as VoiceCalendar;
  for (let d = start; d <= end; d = addDays(d, 1)) {
    for (const u of UNITS) {
      cal[u.key].set(d, { open: !closed.includes(`${u.key}:${d}`), usd: PRICE[u.key], minStay: 1, cta: false, ctd: false, ...over[`${u.key}:${d}`] });
    }
  }
  return cal;
}

function deps(cal: VoiceCalendar) {
  const quoted: string[] = [];
  return {
    quoted,
    d: {
      now: NOW,
      calendar: async () => cal,
      quote: async (u: UnitInfo, ci: string, co: string): Promise<SiteQuote> => {
        quoted.push(`${u.key}:${ci}:${co}`);
        let usd = 0;
        for (let d = ci; d < co; d = addDays(d, 1)) usd += cal[u.key].get(d)!.usd!;
        return { bookable: true, usdTotal: usd, arsTotal: usd * RATE, arsPerUsd: RATE };
      },
    },
  };
}

test('the whole house is quoted at the house price, not a suite price (the 138 bug)', async () => {
  const cal = calendar('2026-11-16', '2027-01-10');
  const q = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 6, unit: 'casa' }, deps(cal).d);
  assert.equal(q.ok, true);
  assert.equal(q.offers[0].unit.key, 'casa');
  assert.equal(q.offers[0].usdTotal, 1104);
  assert.match(q.say, /^Sí, la casa entera está libre del sábado 5 al lunes 7 de diciembre para seis: quinientos cincuenta y dos dólares la noche, mil ciento cuatro dólares en total por dos noches, o sea un millón setecientos seis mil pesos\.$/);
  assert.doesNotMatch(q.say, /ciento treinta y ocho/);
});

test('a suite total with the cleaning fee says so, so the sum adds up to the ear', async () => {
  const cal = calendar('2026-11-16', '2027-01-10');
  const d = deps(cal).d;
  const plain = d.quote;
  d.quote = async (u, ci, co) => {
    const q = await plain(u, ci, co);
    return { ...q, usdTotal: q.usdTotal! + 10, arsTotal: (q.usdTotal! + 10) * RATE };
  };
  const two = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 2, unit: 'paraiso' }, d);
  assert.match(two.say, /ciento cuarenta dólares la noche, doscientos noventa dólares en total por dos noches con la limpieza/);
  const one = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-06', guests: 2, unit: 'paraiso' }, d);
  assert.match(one.say, /ciento cuarenta dólares la noche, ciento cincuenta dólares en total con la limpieza/);
});

test('six people with no unit named means the whole house', async () => {
  const cal = calendar('2026-11-16', '2027-01-10');
  const q = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 6, unit: 'any' }, deps(cal).d);
  assert.equal(q.offers[0].unit.key, 'casa');
});

test('New Year: the house is never sold for the single night of the 31st, only the free block', async () => {
  const cal = calendar('2026-11-16', '2027-01-20');
  assert.equal(stayBlocker(cal, CASA, '2026-12-31', '2027-01-01', 8), 'new_year_block');
  assert.deepEqual(newYearBlock(cal, '2026-12-31', '2027-01-01'), { checkIn: '2026-12-30', checkOut: '2027-01-03' });
  const { d, quoted } = deps(cal);
  const q = await voiceQuote({ checkIn: '2026-12-31', checkOut: '2027-01-01', guests: 8, unit: 'casa' }, d);
  assert.ok(!quoted.includes('casa:2026-12-31:2027-01-01'), 'the single night is never even quoted');
  assert.equal(q.offers[0].checkIn, '2026-12-30');
  assert.equal(q.offers[0].checkOut, '2027-01-03');
  assert.match(q.say, /^La casa entera para Año Nuevo va solo por el bloque completo: del miércoles 30 de diciembre al domingo 3 de enero, cuatro noches/);
  assert.ok(q.offers.every(o => !(o.unit.key === 'casa' && o.nights === 1)));
});

test('New Year block shrinks to the free run: a booked 30th leaves 31.12–03.01', async () => {
  const cal = calendar('2026-11-16', '2027-01-20', ['casa:2026-12-30']);
  assert.deepEqual(newYearBlock(cal, '2026-12-31', '2027-01-01'), { checkIn: '2026-12-31', checkOut: '2027-01-03' });
});

test('New Year: a stay that already covers the whole block is fine as asked', async () => {
  const cal = calendar('2026-11-16', '2027-01-20');
  assert.equal(newYearBlock(cal, '2026-12-28', '2027-01-04'), null);
  assert.equal(stayBlocker(cal, CASA, '2026-12-28', '2027-01-04', 10), '');
});

test('New Year: suites follow the normal site rules, one night is fine', async () => {
  const cal = calendar('2026-11-16', '2027-01-20');
  assert.equal(stayBlocker(cal, unitByKey('giardino')!, '2026-12-31', '2027-01-01', 2), '');
  const q = await voiceQuote({ checkIn: '2026-12-31', checkOut: '2027-01-01', guests: 2, unit: 'giardino' }, deps(cal).d);
  assert.equal(q.offers[0].unit.key, 'giardino');
  assert.equal(q.offers[0].nights, 1);
});

test('taken dates give the nearest free alternatives', async () => {
  const cal = calendar('2026-11-16', '2027-01-10', ['casa:2026-12-05', 'casa:2026-12-06',
    ...UNITS.slice(1).flatMap(u => [`${u.key}:2026-12-05`, `${u.key}:2026-12-06`])]);
  const q = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 6, unit: 'casa' }, deps(cal).d);
  assert.match(q.say, /la casa entera no está libre\. Lo más cerca que tengo: /);
  assert.equal(q.offers.length, 2);
  for (const o of q.offers) assert.ok(o.checkIn >= '2026-12-07' || o.checkOut <= '2026-12-05');
});

test('a house stay too short for the minimum gets the minimum offered', async () => {
  const cal = calendar('2026-11-16', '2027-01-10', [], { 'casa:2026-12-05': { minStay: 3 } });
  const q = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 8, unit: 'casa' }, deps(cal).d);
  assert.match(q.say, /pide mínimo tres noches/);
  assert.equal(q.offers[0].checkOut, '2026-12-08');
});

test('requests that cannot be quoted say what is missing', async () => {
  const cal = calendar('2026-11-16', '2027-01-10');
  const past = await voiceQuote({ checkIn: '2026-11-01', checkOut: '2026-11-03', guests: 2, unit: 'any' }, deps(cal).d);
  assert.equal(past.ok, false);
  assert.match(past.say, /ya pasó/);
  const many = await voiceQuote({ checkIn: '2026-12-05', checkOut: '2026-12-07', guests: 20, unit: 'any' }, deps(cal).d);
  assert.match(many.say, /dieciséis/);
});
