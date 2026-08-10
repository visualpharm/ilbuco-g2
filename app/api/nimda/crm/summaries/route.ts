/**
 * /api/nimda/crm/summaries — Generate AI happiness summaries for guests.
 *
 * POST → triggers batch summary generation for guests without summaries
 * (or with stale ones >7 days old). Processes up to 20 per run to avoid
 * rate limits and Vercel timeout.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadCrmState, saveCrmState, listGuests } from '@/lib/crm-store';
import { generateBatchSummaries } from '@/lib/crm-summary';

export const maxDuration = 300; // 5 minutes for batch processing

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const state = await loadCrmState();
    const guests = listGuests(state);

    const summaries = await generateBatchSummaries(guests, undefined, 20);

    // Merge summaries into guest records
    const updatedGuests = { ...state.guests };
    let updated = 0;
    for (const [guestId, summary] of summaries) {
      if (updatedGuests[guestId]) {
        updatedGuests[guestId] = { ...updatedGuests[guestId], summary };
        updated++;
      }
    }

    await saveCrmState({ ...state, guests: updatedGuests });

    return NextResponse.json({
      success: true,
      processed: summaries.size,
      updated,
      totalGuests: guests.length,
      at: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
