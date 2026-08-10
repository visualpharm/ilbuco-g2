/**
 * /api/nimda/crm/outreach/send — Send a WhatsApp campaign to selected guests.
 *
 * POST { guestIds: string[], template: string }
 * → Sends personalized messages via WAHA with anti-ban rate limiting.
 *
 * This is a long-running endpoint (each send has a 15-45s delay).
 * Vercel maxDuration is set to 300s (5 min), which allows ~8-12 sends max.
 * For larger campaigns, the client should batch the guestIds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadCrmState, listGuests } from '@/lib/crm-store';
import { sendCampaign, buildTargets } from '@/lib/outreach-engine';

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { guestIds, template, useSpintax = true } = body as { guestIds: string[]; template: string; useSpintax?: boolean };

    if (!Array.isArray(guestIds) || guestIds.length === 0 || !template) {
      return NextResponse.json({ error: 'guestIds (non-empty) and template required' }, { status: 400 });
    }

    // Safety: cap per request (each send takes 15-45s + delays)
    const MAX_PER_REQUEST = 8;
    const capped = guestIds.slice(0, MAX_PER_REQUEST);
    if (guestIds.length > MAX_PER_REQUEST) {
      return NextResponse.json({
        error: `Max ${MAX_PER_REQUEST} guests per send request (anti-ban). You selected ${guestIds.length}. Send in batches.`,
        maxPerRequest: MAX_PER_REQUEST,
      }, { status: 400 });
    }

    const state = await loadCrmState();
    const allGuests = listGuests(state);
    const selectedGuests = allGuests.filter(g => capped.includes(g.id));

    // Build targets (only guests with phone numbers)
    const targets = await buildTargets(selectedGuests, { onlyWithPhone: true });

    if (targets.length === 0) {
      return NextResponse.json({
        error: 'None of the selected guests have phone numbers',
      }, { status: 400 });
    }

    // Send the campaign
    const report = await sendCampaign(targets, template, undefined, useSpintax);

    return NextResponse.json({
      success: true,
      report,
      sentBy: caller,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
