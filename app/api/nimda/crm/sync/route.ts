/**
 * /api/nimda/crm/sync — trigger a full CRM sync from Hostex + WAHA.
 * POST → pulls all reservations, conversations, reviews, and WAHA contacts.
 *
 * This is slow (multiple paginated API calls) — may take 30-60s for large histories.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { syncAllGuests } from '@/lib/crm-sync';

export const maxDuration = 300; // 5 minutes — enough for ~150 conversations

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const report = await syncAllGuests();
    return NextResponse.json(report, { status: report.success ? 200 : 500 });
  } catch (err) {
    console.error('[crm-sync] error:', err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
