/**
 * /api/pricing — Il Buco dynamic pricing API (engine v2.1, config-driven)
 *
 * GET  → invoked by the Vercel weekly cron (Bearer CRON_SECRET) → LIVE update.
 *        Vercel crons can only issue GET — v1 mapped GET to dry-run, so the
 *        auto-pricer never wrote a price. Manual GET (admin token / UI cookie)
 *        stays a dry-run unless ?live=1.
 * POST → compute + push prices to Hostex (live). Body: { dry_run?, days_ahead? }
 *
 * Each run: load config (base prices, overrides, learned coefs from the
 * /admin/pricing UI) → build schedules → LEARN from overridden nights →
 * push to Hostex → save updated learned coefs + push audit.
 *
 * Safety rails: never touches the next 2 days; prices clamped per-tier in the engine.
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  buildPriceSchedule,
  computeLearning,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  type DayPriceEntry,
} from '@/lib/pricing-engine';

import { loadConfig, saveConfig } from '@/lib/pricing-config';
import { getCaller } from '@/lib/pricing-auth';
import { getCalendarAvailability, updateListingPrices, type PriceEntry } from '@/lib/hostex-api';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

// ─── Convert day schedule → Hostex price ranges ───────────────────────────────

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

// ─── Main handler ─────────────────────────────────────────────────────────────

async function runPricingUpdate(dryRun: boolean, daysAhead: number, by: string) {
  // Safety rail: leave the immediate 2 days untouched (in-progress stays, same-day bookings)
  const startDate = addDays(todayAR(), 2);
  const endDate = addDays(startDate, daysAhead);

  const config = await loadConfig();

  // Fetch calendar: occupancy for demand pacing + current prices for the change report
  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const occByRoom: Record<string, Record<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    occByRoom[room.name] = {};
    for (const d of byRoom.get(room.name)?.dates ?? []) {
      occByRoom[room.name][d.date] = d.available ? 0 : 1;
    }
  }

  const settings = { basePrices: config.basePrices, learned: config.learned, overrides: config.overrides };
  const schedules: Record<string, DayPriceEntry[]> = {};
  const results: Array<Record<string, unknown>> = [];
  let totalRanges = 0;

  for (const room of IL_BUCO_ROOMS) {
    const schedule = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    schedules[room.name] = schedule;

    const ranges = collapseToRanges(schedule);
    totalRanges += ranges.length;
    const pushResult = await updateListingPrices(room.listingId, ranges, dryRun);

    // Change report: avg current vs avg new per tier
    const currentByDate = new Map((byRoom.get(room.name)?.dates ?? []).map(d => [d.date, d.price]));
    const tierStats: Record<string, { n: number; avg_new: number; avg_current: number; overridden: number }> = {};
    for (const e of schedule) {
      const t = (tierStats[e.tier] ??= { n: 0, avg_new: 0, avg_current: 0, overridden: 0 });
      t.n++;
      t.avg_new += e.price;
      t.avg_current += currentByDate.get(e.date) ?? 0;
      if (e.overrideId) t.overridden++;
    }
    for (const t of Object.values(tierStats)) {
      t.avg_new = Math.round(t.avg_new / t.n);
      t.avg_current = Math.round(t.avg_current / t.n);
    }

    results.push({
      room: room.name,
      listing_id: room.listingId,
      by_tier: tierStats,
      price_ranges: ranges.length,
      push: pushResult,
    });
  }

  // Whole house: per-date sum of the 4 suites × bundle factor
  const suiteNames = IL_BUCO_ROOMS.map(r => r.name);
  const wholeHouseSchedule = schedules[suiteNames[0]].map((entry, i) => ({
    date: entry.date,
    price: Math.round(suiteNames.reduce((acc, n) => acc + schedules[n][i].price, 0) * config.wholeHouseFactor),
  }));
  const whRanges = collapseToRanges(wholeHouseSchedule);
  const whPush = await updateListingPrices(WHOLE_HOUSE.listingId, whRanges, dryRun);
  results.push({
    room: WHOLE_HOUSE.name,
    listing_id: WHOLE_HOUSE.listingId,
    price_ranges: whRanges.length,
    push: whPush,
  });

  // Learn from manual overrides (live runs only — keeps dry-runs side-effect-free)
  const learning = computeLearning(schedules, config.learned);
  if (!dryRun) {
    for (const u of learning) {
      (config.learned[u.room] ??= {})[u.tier] = Number(u.newCoef.toFixed(3));
      (config.learnedMeta[u.room] ??= {})[u.tier] = {
        nights: u.nights,
        medianRatio: Number(u.medianRatio.toFixed(3)),
        updatedAt: new Date().toISOString(),
      };
    }
    config.lastPush = { at: new Date().toISOString(), by, ranges: totalRanges };
    await saveConfig(config, by);
  }

  return {
    engine: 'v2.1-config',
    dry_run: dryRun,
    run_at: new Date().toISOString(),
    start_date: startDate,
    end_date: endDate,
    learning_updates: learning,
    rooms: results,
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Cron → live. Everyone else's GET → dry-run unless ?live=1.
  const live = caller === 'cron' || req.nextUrl.searchParams.get('live') === '1';
  try {
    const report = await runPricingUpdate(!live, 300, caller);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing GET] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { dry_run?: boolean; days_ahead?: number } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  try {
    const report = await runPricingUpdate(body.dry_run ?? false, body.days_ahead ?? 300, caller);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing POST] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
