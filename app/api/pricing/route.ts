/**
 * /api/pricing — Il Buco dynamic pricing API
 *
 * GET  → compute & return proposed prices (dry-run, no writes)
 * POST → compute + push prices to Hostex (live update)
 *        Body (optional): { dry_run: true, days_ahead: 180 }
 *
 * Authentication: requires X-Admin-Token header matching ADMIN_TOKEN env var.
 *
 * Called monthly by a Vercel cron (see vercel.json) to auto-adjust rates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  getSeasonTier,
  computeCompMedians,
  buildPriceSchedule,
  IL_BUCO_ROOMS,
  getRoomInfraCost,
  type CompEntry,
  type CompDataset,
  type DayPriceEntry,
} from '@/lib/pricing-engine';

import { getCalendarAvailability, updateListingPrices, type PriceEntry } from '@/lib/hostex-api';

// ─── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorised(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return false;
  // Accept either ADMIN_TOKEN (manual calls) or Vercel's CRON_SECRET (cron runner)
  return token === process.env.ADMIN_TOKEN || token === process.env.CRON_SECRET;
}

// ─── Load comp data ───────────────────────────────────────────────────────────

/** Load comp JSON datasets from disk. Falls back gracefully if files are missing. */
function loadCompDatasets(): CompDataset[] {
  const basePath = join(process.cwd(), '..', 'openclaw', 'domains', 'il-buco', 'comp-research', 'data');
  const files: Array<{ file: string; tier: CompDataset['tier'] }> = [
    { file: 'airbnb_off.json',      tier: 'off' },
    { file: 'airbnb_shoulder.json', tier: 'shoulder' },
    { file: 'airbnb_high.json',     tier: 'high' },
  ];

  return files.flatMap(({ file, tier }) => {
    try {
      const raw = readFileSync(join(basePath, file), 'utf-8');
      const entries: CompEntry[] = JSON.parse(raw);
      return [{ tier, entries }];
    } catch {
      console.warn(`[pricing] comp file not found: ${file} — using historical fallback`);
      return [];
    }
  });
}

// ─── Occupancy fetch ──────────────────────────────────────────────────────────

/** Fetch occupancy from Hostex calendar and return per-date map (1 = booked). */
async function fetchOccupancyMap(
  startDate: string,
  endDate: string
): Promise<Record<string, Record<string, number>>> {
  let calResult;
  try {
    calResult = await getCalendarAvailability(startDate, endDate);
  } catch (err) {
    console.warn('[pricing] failed to fetch calendar occupancy:', err);
    return {};
  }

  const occupancyByRoom: Record<string, Record<string, number>> = {};
  for (const room of calResult.rooms) {
    occupancyByRoom[room.name] = {};
    for (const day of room.dates) {
      // inventory=0 → booked (occupied), inventory=1 → available
      occupancyByRoom[room.name][day.date] = day.available ? 0 : 1;
    }
  }
  return occupancyByRoom;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

// ─── Convert day schedule → Hostex price ranges ───────────────────────────────

/**
 * Collapse a day-by-day list into run-length-encoded ranges.
 * Hostex accepts {start_date, end_date, price} ranges — fewer API calls.
 */
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
  const startDate = todayAR();
  const endDate   = addDays(startDate, daysAhead);

  // 1. Load competitor data and compute medians per tier
  const compDatasets = loadCompDatasets();
  const compMedians  = computeCompMedians(compDatasets);

  // 2. Fetch occupancy for demand signal
  const occupancyByRoom = await fetchOccupancyMap(startDate, endDate);

  // 3. Build price schedules and push for each room
  const results: Array<{
    room: string;
    listingId: string;
    infraCost: number;
    floor: number;
    ceiling: number;
    ranges: PriceEntry[];
    sampleByTier: Record<string, number>;
    pushResult: { updated: number; skipped: number };
  }> = [];

  for (const room of IL_BUCO_ROOMS) {
    const infraCost = getRoomInfraCost(room);
    const occ = occupancyByRoom[room.name] ?? {};

    // Build day-by-day schedule
    const schedule = buildPriceSchedule(startDate, endDate, compMedians, infraCost, occ);

    // Sample: one price per tier for the report
    const sampleByTier: Record<string, number> = {};
    for (const entry of schedule) {
      if (!sampleByTier[entry.tier]) sampleByTier[entry.tier] = entry.price;
    }

    // Compute floor/ceiling for the report (using off-tier as reference)
    const FLOOR_M = Number(process.env.PRICING_FLOOR_MULTIPLIER ?? '1.3');
    const CEIL_M  = Number(process.env.PRICING_CEILING_MULTIPLIER ?? '2.0');
    const refMedian = compMedians.off;
    const floor   = Math.round(infraCost * FLOOR_M);
    const ceiling = Math.round(refMedian * CEIL_M);

    // Collapse to ranges and push
    const ranges = collapseToRanges(schedule);
    const pushResult = await updateListingPrices(room.listingId, ranges, dryRun);

    results.push({
      room: room.name,
      listingId: room.listingId,
      infraCost,
      floor,
      ceiling,
      ranges,
      sampleByTier,
      pushResult,
    });
  }

  return {
    dry_run: dryRun,
    run_at: new Date().toISOString(),
    start_date: startDate,
    end_date: endDate,
    days_ahead: daysAhead,
    comp_medians: compMedians,
    rooms: results.map(r => ({
      room: r.room,
      listing_id: r.listingId,
      infra_cost: r.infraCost,
      floor: r.floor,
      ceiling: r.ceiling,
      sample_prices_by_tier: r.sampleByTier,
      price_ranges_count: r.ranges.length,
      push: r.pushResult,
    })),
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const report = await runPricingUpdate(true /* dry_run */, 180);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing GET] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: { dry_run?: boolean; days_ahead?: number } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  const dryRun   = body.dry_run ?? false;
  const daysAhead = body.days_ahead ?? 180;

  try {
    const report = await runPricingUpdate(dryRun, daysAhead);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[pricing POST] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
