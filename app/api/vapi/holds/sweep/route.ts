/**
 * Release phone-booking holds past their 10 minutes (Vercel cron, every minute).
 * Tool calls sweep too; this covers a caller who hung up mid-hold.
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
  const deps = liveHoldDeps({ findDeposit: (a, s, w) => findDeposit(a, s, w), notify: n => notifyVoice(n) });
  const { released } = await sweepHolds(deps);
  if (released.length) console.log('[voice-holds] released', released.join(','));
  return NextResponse.json({ released });
}
