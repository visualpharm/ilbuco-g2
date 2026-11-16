/**
 * Release phone-booking holds past their 10 minutes (Vercel cron, every minute).
 * Tool calls sweep too; this covers a caller who hung up mid-hold. Each due hold gets one last
 * bridge check for its amount: a transfer that arrived after the call books the stay instead.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { notifyVoice } from '@/lib/hub-wake';
import { findDeposit } from '@/lib/payment-bridge';
import { liveHoldDeps, sweepHolds } from '@/lib/voice-hold';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (caller !== 'cron' && caller !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const deps = liveHoldDeps({ findDeposit: (a, s, w, m) => findDeposit(a, s, w, m), notify: n => notifyVoice(n) });
  const { released, booked } = await sweepHolds(deps);
  if (released.length) console.log('[voice-holds] released', released.join(','));
  if (booked.length) console.log('[voice-holds] paid at the last check, booked', booked.join(','));
  return NextResponse.json({ released, booked });
}
