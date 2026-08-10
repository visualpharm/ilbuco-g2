/**
 * /api/nimda/crm/outreach/ota — Send post-stay messages via OTA channels
 * (Airbnb/Booking.com) through Hostex.
 *
 * IMPORTANT POLICY: This is ONLY for compliant post-stay messages —
 * thank-you notes, review requests. It MUST NOT be used to solicit
 * direct bookings or off-platform contact. Airbnb Article 2799 and
 * Booking.com's terms prohibit using OTA messaging to steer guests
 * to direct bookings. Violations can result in listing suspension.
 *
 * POST { guestIds: string[], template: string }
 * → Sends messages via Hostex conversation API.
 * → Only works for guests with a conversationId on their reservation.
 * → Booking.com threads close 7 days after checkout; messages will fail after.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadCrmState, listGuests } from '@/lib/crm-store';
import { sendMessage } from '@/lib/hostex-api';
import { renderMessage } from '@/lib/outreach-engine';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { guestIds, template, useSpintax = true } = body as {
      guestIds: string[];
      template: string;
      useSpintax?: boolean;
    };

    if (!Array.isArray(guestIds) || guestIds.length === 0 || !template) {
      return NextResponse.json({ error: 'guestIds and template required' }, { status: 400 });
    }

    const state = await loadCrmState();
    const allGuests = listGuests(state);
    const selectedGuests = allGuests.filter(g => guestIds.includes(g.id));

    // Find conversation IDs from reservations
    const results: Array<{
      guestId: string;
      name: string;
      conversationId?: string;
      status: 'sent' | 'skipped' | 'failed';
      reason?: string;
    }> = [];

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const guest of selectedGuests) {
      // Find the most recent reservation with a conversationId
      const ressWithConv = guest.reservations.filter(r => r.conversationId);
      if (ressWithConv.length === 0) {
        results.push({
          guestId: guest.id,
          name: guest.name,
          status: 'skipped',
          reason: 'no_conversation_id',
        });
        skipped++;
        continue;
      }

      const conversationId = ressWithConv[ressWithConv.length - 1].conversationId!;

      try {
        const message = renderMessage(template, guest, useSpintax);
        await sendMessage(conversationId, message);
        results.push({
          guestId: guest.id,
          name: guest.name,
          conversationId,
          status: 'sent',
        });
        sent++;

        // Small delay between sends to be gentle
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        results.push({
          guestId: guest.id,
          name: guest.name,
          conversationId,
          status: 'failed',
          reason,
        });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      failed,
      total: selectedGuests.length,
      results,
      sentBy: caller,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
