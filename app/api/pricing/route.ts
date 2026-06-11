/**
 * /api/pricing — Il Buco dynamic pricing API (engine v2)
 *
 * GET  → invoked by the Vercel monthly cron (Bearer CRON_SECRET) → LIVE update.
 *        Vercel crons can only issue GET — v1 mapped GET to dry-run, so the
 *        auto-pricer never wrote a price. Manual GET with ADMIN_TOKEN stays a
 *        dry-run unless ?live=1.
 * POST → compute + push prices to Hostex (live). Body: { dry_run?, days_ahead? }
 *
 * Safety rails: never touches the next 2 days; prices clamped per-tier in the engine.
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  buildPriceSchedule,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  WHOLE_HOUSE_FACTOR,
  type DayPriceEntry,
} from '@/lib/pricing-engine';

import { getCalendarAvailability, updateListingPrices, type PriceEntry } from '@/lib/hostex-api';

// ─── Auth ─────────────────────────────────────────────────────────────────────

function getToken(req: NextRequest): string | null {
  return req.headers.get('x-admin-token')
    || req.headers.get('authorization')?.replace('Bearer ', '')
    || null;
}

function isCron(req: NextRequest): boolean {
  const t = getToken(req);
  return !!process.env.CRON_SECRET && t === process.env.CRON_SECRET;
}

function isAdmin(req: NextRequest): boolean {
  const t = getToken(req);
  return !!process.env.ADMIN_TOKEN && t === process.env.ADMIN_TOKEN;
}

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

// ─── Main handler ─────────────────────────────────────────────────────────────

async function runPricingUpdate(dryRun: boolean, daysAhead: number) {
  // Safety rail: leave the immediate 2 days untouched (in-progress stays, same-day bookings)
  const startDate = addDays(todayAR(), 2);
  const endDate = addDays(startDate, daysAhead);

  // Fetch calendar: occupancy for demand pacing + current prices for the change report
  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const schedules: Record<string, DayPriceEntry[]> = {};
  const results: Array<Record<string, unknown>> = [];

  for (const room of IL_BUCO_ROOMS) {
    const calRoom = byRoom.get(room.name);
    const occ: Record<string, number> = {};
    for (const d of calRoom?.dates ?? []) occ[d.date] = d.available ? 0 : 1;

    const schedule = buildPriceSchedule(room.name, startDate, endDate, occ);
    schedules[room.name] = schedule;

    const ranges = collapseToRanges(schedule);
    const pushResult = await updateListingPrices(room.listingId, ranges, dryRun);

    // Change report: avg current vs avg new per tier
    const currentByDate = new Map((calRoom?.dates ?? []).map(d => [d.date, d.price]));
    const tierStats: Record<string, { n: number; avg_new: number; avg_current: number }> = {};
    for (const e of schedule) {
      const t = (tierStats[e.tier] ??= { n: 0, avg_new: 0, avg_current: 0 });
      t.n++;
      t.avg_new += e.price;
      t.avg_current += currentByDate.get(e.date) ?? 0;
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
  const wholeHouseSchedule: DayPriceEntry[] = schedules[suiteNames[0]].map((entry, i) => {
    const sum = suiteNames.reduce((acc, n) => acc + schedules[n][i].price, 0);
    return { date: entry.date, tier: entry.tier, price: Math.round(sum * WHOLE_HOUSE_FACTOR) };
  });
  const whRanges = collapseToRanges(wholeHouseSchedule);
  const whPush = await updateListingPrices(WHOLE_HOUSE.listingId, whRanges, dryRun);
  results.push({
    room: WHOLE_HOUSE.name,
    listing_id: WHOLE_HOUSE.listingId,
    sample: wholeHouseSchedule.filter((_, i) => i % 30 === 0).map(e => ({ date: e.date, price: e.price })),
    price_ranges: whRanges.length,
    push: whPush,
  });

  return {
    engine: 'v2-seasonal',
    dry_run: dryRun,
    run_at: new Date().toISOString(),
    start_date: startDate,
    end_date: endDate,
    rooms: results,
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const cron = isCron(req);
  if (!cron && !isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Cron → live. Manual admin GET → dry-run unless ?live=1.
  const live = cron || req.nextUrl.searchParams.get('live') === '1';
  try {
    const report = await runPricingUpdate(!live, 300);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing GET] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isCron(req) && !isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: { dry_run?: boolean; days_ahead?: number } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  try {
    const report = await runPricingUpdate(body.dry_run ?? false, body.days_ahead ?? 300);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing POST] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
