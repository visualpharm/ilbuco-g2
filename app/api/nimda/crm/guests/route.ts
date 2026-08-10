/**
 * /api/nimda/crm/guests — CRM guest list for the admin panel.
 * GET → returns all guests with their reservations, messages, and summaries.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadCrmState, listGuests } from '@/lib/crm-store';

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const state = await loadCrmState();
  const guests = listGuests(state);

  return NextResponse.json({
    guests,
    totalGuests: guests.length,
    lastSyncAt: state.lastSyncAt,
    caller,
  });
}
