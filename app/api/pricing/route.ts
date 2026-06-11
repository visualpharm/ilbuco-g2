/**
 * /api/pricing — Il Buco dynamic pricing API (engine v2.2, config-driven)
 *
 * GET  → invoked by the Vercel weekly cron (Bearer CRON_SECRET) → LIVE update.
 *        Vercel crons can only issue GET — v1 mapped GET to dry-run, so the
 *        auto-pricer never wrote a price. Manual GET (admin token / UI cookie)
 *        stays a dry-run unless ?live=1.
 * POST → compute + push to Hostex (live). Body: { dry_run?, days_ahead? }
 *
 * A live run pushes prices + min-stay restrictions + whole-house-only inventory
 * windows and applies override learning. See lib/run-pricing.ts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runPricingUpdate } from '@/lib/run-pricing';
import { getCaller } from '@/lib/pricing-auth';

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
