/**
 * /api/guest-ops — cron dispatcher for the guest PIN automation.
 *
 * GET → invoked by Vercel Cron (Bearer CRON_SECRET) with ?job=<name>.
 *       Cron calls are always live. Manual GET (admin token / UI cookie)
 *       is dry-run unless ?live=1.
 * POST → manual trigger by admin. Body: { job, dry_run? }
 *
 * Jobs:
 *   retries       — Fibonacci retry queue sweep (every 15 min)
 *   pre-checkin   — ensure PINs ready for imminent check-ins (hourly)
 *   post-checkout — revoke PINs after checkout (hourly)
 *   reconcile     — clean up orphaned lock users (daily)
 */

import { NextRequest, NextResponse } from 'next/server';
import { runGuestOpsJob } from '@/lib/run-guest-ops';
import { getCaller } from '@/lib/pricing-auth';

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const job = req.nextUrl.searchParams.get('job');
  if (!job) {
    return NextResponse.json({ error: 'Missing ?job= parameter' }, { status: 400 });
  }

  // Cron → live. Everyone else's GET → dry-run unless ?live=1.
  const dryRun = caller !== 'cron' && req.nextUrl.searchParams.get('live') !== '1';

  try {
    const report = await runGuestOpsJob(job, dryRun);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[guest-ops GET] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { job?: string; dry_run?: boolean } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  if (!body.job) {
    return NextResponse.json({ error: 'Missing job in body' }, { status: 400 });
  }

  try {
    const report = await runGuestOpsJob(body.job, body.dry_run ?? false);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[guest-ops POST] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
