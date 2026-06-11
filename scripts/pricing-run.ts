/**
 * CLI runner for the v2.1 pricing engine — dry-run by default, --live to push.
 *
 *   npx ts-node -T --compilerOptions '{"module":"commonjs","moduleResolution":"node"}' \
 *     scripts/pricing-run.ts [--live] [--days 300]
 *
 * Same logic as /api/pricing, runnable from munk without deploying.
 * Loads the shared pricing config (base prices, overrides, learned) from Vercel Blob.
 */

import { config as dotenv } from 'dotenv';
import { join } from 'path';
dotenv({ path: join(__dirname, '..', '.env.local') });

import {
  buildPriceSchedule,
  computeLearning,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  type DayPriceEntry,
} from '../lib/pricing-engine';
import { loadConfig } from '../lib/pricing-config';
import { getCalendarAvailability, updateListingPrices, type PriceEntry } from '../lib/hostex-api';

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

function collapseToRanges(days: Array<{ date: string; price: number }>): PriceEntry[] {
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

  const cfg = await loadConfig();
  console.log(`Config: ${cfg.overrides.length} overrides, learned coefs for ${Object.keys(cfg.learned).length} rooms, updated ${cfg.updatedAt ?? 'never'}\n`);

  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const occByRoom: Record<string, Record<string, number>> = {};
  const currentByRoom: Record<string, Map<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    occByRoom[room.name] = {};
    currentByRoom[room.name] = new Map();
    for (const d of byRoom.get(room.name)?.dates ?? []) {
      occByRoom[room.name][d.date] = d.available ? 0 : 1;
      currentByRoom[room.name].set(d.date, d.price);
    }
  }

  const settings = { basePrices: cfg.basePrices, learned: cfg.learned, overrides: cfg.overrides };
  const schedules: Record<string, DayPriceEntry[]> = {};

  for (const room of IL_BUCO_ROOMS) {
    const schedule = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    schedules[room.name] = schedule;

    const byMonth: Record<string, { n: number; cur: number; nw: number; ov: number }> = {};
    for (const e of schedule) {
      const m = e.date.slice(0, 7);
      const b = (byMonth[m] ??= { n: 0, cur: 0, nw: 0, ov: 0 });
      b.n++;
      b.cur += currentByRoom[room.name].get(e.date) ?? 0;
      b.nw += e.price;
      if (e.overrideId) b.ov++;
    }
    console.log(`── ${room.name}`);
    for (const [m, b] of Object.entries(byMonth)) {
      const cur = Math.round(b.cur / b.n);
      const nw = Math.round(b.nw / b.n);
      const delta = cur ? Math.round(((nw - cur) / cur) * 100) : 0;
      console.log(`   ${m}  $${cur} → $${nw}  (${delta >= 0 ? '+' : ''}${delta}%)${b.ov ? `  [${b.ov} overridden]` : ''}`);
    }

    const ranges = collapseToRanges(schedule);
    const res = await updateListingPrices(room.listingId, ranges, !live);
    console.log(`   ${ranges.length} ranges, push: ${JSON.stringify(res)}\n`);
  }

  // Whole house = sum of suites × factor
  const names = IL_BUCO_ROOMS.map(r => r.name);
  const wh = schedules[names[0]].map((e, i) => ({
    date: e.date,
    price: Math.round(names.reduce((a, n) => a + schedules[n][i].price, 0) * cfg.wholeHouseFactor),
  }));
  const whByMonth: Record<string, { n: number; nw: number }> = {};
  for (const e of wh) {
    const b = (whByMonth[e.date.slice(0, 7)] ??= { n: 0, nw: 0 });
    b.n++; b.nw += e.price;
  }
  console.log(`── ${WHOLE_HOUSE.name} (sum × ${cfg.wholeHouseFactor})`);
  for (const [m, b] of Object.entries(whByMonth)) console.log(`   ${m}  $${Math.round(b.nw / b.n)}`);
  const whRanges = collapseToRanges(wh);
  const whRes = await updateListingPrices(WHOLE_HOUSE.listingId, whRanges, !live);
  console.log(`   ${whRanges.length} ranges, push: ${JSON.stringify(whRes)}`);

  const learning = computeLearning(schedules, cfg.learned);
  if (learning.length) {
    console.log(`\nLearning updates (applied on next live API run):`);
    for (const u of learning) {
      console.log(`   ${u.room}/${u.tier}: coef ${u.oldCoef} → ${u.newCoef} (median override ratio ${u.medianRatio}, ${u.nights} nights)`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
