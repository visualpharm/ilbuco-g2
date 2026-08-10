/**
 * /api/nimda/guests — guest list for the Nimda admin panel.
 *
 * GET → returns all PIN assignments with their status, dates, and delivery info.
 * Protected by getCaller (cookie auth for the UI, token for scripts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadState, listAssignments } from '@/lib/guest-ops-store';

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const state = await loadState();
  const assignments = listAssignments(state);
  const { backupPool, contacts } = state;

  // Split into reservation-based and manual PINs for the UI
  const reservationGuests = assignments.filter(a => !a.isManual);
  const manualPins = assignments.filter(a => a.isManual);

  const poolStats = {
    total: backupPool.length,
    inUse: backupPool.filter(p => p.inUse).length,
    available: backupPool.filter(p => !p.inUse).length,
  };

  return NextResponse.json({
    guests: reservationGuests,
    manualPins,
    poolStats,
    contactCount: Object.keys(contacts).length,
    caller,
  });
}
