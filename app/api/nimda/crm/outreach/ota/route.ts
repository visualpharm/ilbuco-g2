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
import { scanOtaCompliance } from '@/lib/ota-compliance';

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

    // ─── Template-level compliance check ──────────────────────────────
    // Scan the TEMPLATE (before rendering) for policy violations.
    // This catches direct-booking URLs, discount codes, etc.
    const templateScan = scanOtaCompliance(template);
    if (!templateScan.compliant) {
      const blocks = templateScan.violations.filter(v => v.severity === 'block');
      if (blocks.length > 0) {
        return NextResponse.json({
          error: 'Política OTA violada — envío bloqueado',
          violations: blocks.map(v => v.message),
          details: 'El mensaje contiene contenido que viola las políticas de Airbnb/Booking.com (Art. 2799). No se pueden ofrecer reservas directas, descuentos off-platform, ni datos de contacto por este canal.',
        }, { status: 403 });
      }
    }

    const state = await loadCrmState();
    const allGuests = listGuests(state);
    const selectedGuests = allGuests.filter(g => guestIds.includes(g.id));

    const results: Array<{
      guestId: string;
      name: string;
      conversationId?: string;
      status: 'sent' | 'skipped' | 'failed' | 'blocked';
      reason?: string;
    }> = [];

    let sent = 0;
    let skipped = 0;
    let failed = 0;
    let blocked = 0;

    for (const guest of selectedGuests) {
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

      // Render the message for THIS guest
      const message = renderMessage(template, guest, useSpintax);

      // ─── Per-message compliance scan (post-render) ─────────────────
      // Re-scan after rendering, because placeholders like {property}
      // might have introduced content that triggers violations.
      const msgScan = scanOtaCompliance(message);
      if (!msgScan.compliant) {
        results.push({
          guestId: guest.id,
          name: guest.name,
          conversationId,
          status: 'blocked',
          reason: msgScan.violations.filter(v => v.severity === 'block').map(v => v.message).join('; '),
        });
        blocked++;
        continue;
      }

      try {
        await sendMessage(conversationId, message);
        results.push({
          guestId: guest.id,
          name: guest.name,
          conversationId,
          status: 'sent',
        });
        sent++;
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
      success: blocked === 0 || sent > 0,
      sent,
      skipped,
      failed,
      blocked,
      total: selectedGuests.length,
      results,
      sentBy: caller,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
