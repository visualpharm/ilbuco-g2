/**
 * CLI runner for the v2 pricing engine — dry-run by default, --live to push.
 *
 *   npx ts-node -T --compilerOptions '{"module":"commonjs","moduleResolution":"node"}' \
 *     scripts/pricing-run.ts [--live] [--days 300]
 *
 * Same logic as /api/pricing, runnable from munk without deploying.
 */

import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '..', '.env.local') });

import {
  buildPriceSchedule,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  WHOLE_HOUSE_FACTOR,
  type DayPriceEntry,
} from '../lib/pricing-engine';
import { getCalendarAvailability, updateListingPrices, type PriceEntry } from '../lib/hostex-api';

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

function collapseToRanges(days: DayPriceEntry[]): PriceEntry[] {
  if (!days.length) return [];
  const ranges: PriceEntry[] = [];
  let cur = { start_date: days[0].date, end_date: days[0].date, price: days[0].price };
  for (let i = 1; i < days.length; i++) {
    if (days[i].price === cur.price) {
      cur.end_date = days[i].date;
    } else {
      ranges.push({ ...cur });
      cur = { start_date: days[i].date, end_date: days[i].date, price: days[i].price };
    }
  }
  ranges.push(cur);
  return ranges;
}

async function main() {
  const live = process.argv.includes('--live');
  const daysIdx = process.argv.indexOf('--days');
  const daysAhead = daysIdx > -1 ? Number(process.argv[daysIdx + 1]) : 300;

  const startDate = addDays(todayAR(), 2);
  const endDate = addDays(startDate, daysAhead);
  console.log(`Pricing run ${live ? 'LIVE' : 'dry-run'}: ${startDate} → ${endDate}\n`);

  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const schedules: Record<string, DayPriceEntry[]> = {};

  for (const room of IL_BUCO_ROOMS) {
    const calRoom = byRoom.get(room.name);
    const occ: Record<string, number> = {};
    const currentByDate = new Map<string, number>();
    for (const d of calRoom?.dates ?? []) {
      occ[d.date] = d.available ? 0 : 1;
      currentByDate.set(d.date, d.price);
    }

    const schedule = buildPriceSchedule(room.name, startDate, endDate, occ);
    schedules[room.name] = schedule;

    // Monthly summary: current → new
    const byMonth: Record<string, { n: number; cur: number; nw: number }> = {};
    for (const e of schedule) {
      const m = e.date.slice(0, 7);
      const b = (byMonth[m] ??= { n: 0, cur: 0, nw: 0 });
      b.n++;
      b.cur += currentByDate.get(e.date) ?? 0;
      b.nw += e.price;
    }
    console.log(`── ${room.name}`);
    for (const [m, b] of Object.entries(byMonth)) {
      const cur = Math.round(b.cur / b.n);
      const nw = Math.round(b.nw / b.n);
      const delta = cur ? Math.round(((nw - cur) / cur) * 100) : 0;
      console.log(`   ${m}  $${cur} → $${nw}  (${delta >= 0 ? '+' : ''}${delta}%)`);
    }

    const ranges = collapseToRanges(schedule);
    const res = await updateListingPrices(room.listingId, ranges, !live);
    console.log(`   ${ranges.length} ranges, push: ${JSON.stringify(res)}\n`);
  }

  // Whole house = sum of suites × factor
  const names = IL_BUCO_ROOMS.map(r => r.name);
  const wh: DayPriceEntry[] = schedules[names[0]].map((e, i) => ({
    date: e.date,
    tier: e.tier,
    price: Math.round(names.reduce((a, n) => a + schedules[n][i].price, 0) * WHOLE_HOUSE_FACTOR),
  }));
  const whByMonth: Record<string, { n: number; nw: number }> = {};
  for (const e of wh) {
    const b = (whByMonth[e.date.slice(0, 7)] ??= { n: 0, nw: 0 });
    b.n++; b.nw += e.price;
  }
  console.log(`── ${WHOLE_HOUSE.name} (sum × ${WHOLE_HOUSE_FACTOR})`);
  for (const [m, b] of Object.entries(whByMonth)) console.log(`   ${m}  $${Math.round(b.nw / b.n)}`);
  const whRanges = collapseToRanges(wh);
  const whRes = await updateListingPrices(WHOLE_HOUSE.listingId, whRanges, !live);
  console.log(`   ${whRanges.length} ranges, push: ${JSON.stringify(whRes)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
