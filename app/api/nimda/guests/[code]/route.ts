/**
 * /api/nimda/guests/[code] — per-guest admin actions.
 *
 * DELETE → remove a PIN from the lock and state.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { deletePin } from '@/lib/run-guest-ops';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code } = await params;
  const report = await deletePin(code, caller);

  return NextResponse.json(report, { status: report.success ? 200 : 500 });
}
