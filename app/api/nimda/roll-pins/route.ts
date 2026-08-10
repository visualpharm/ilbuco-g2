/**
 * /api/nimda/roll-pins — rotate all active PINs for security.
 *
 * POST → { includeManual?: boolean }
 * Generates a new PIN for each active assignment and updates the lock.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { rollAllPins } from '@/lib/run-guest-ops';

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { includeManual?: boolean } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  const report = await rollAllPins(caller, body.includeManual ?? false);

  return NextResponse.json(report, { status: report.success ? 200 : 500 });
}
