/**
 * /api/nimda/crm/outreach/preview — Preview rendered messages for selected guests.
 *
 * POST { guestIds: string[], template: string }
 * → Returns array of { guestId, name, phone, renderedMessage, windowOpen }
 *
 * Does NOT send anything. Just shows what would be sent.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadCrmState, listGuests } from '@/lib/crm-store';
import { renderMessage, buildPlaceholders, replacePlaceholders, expandSpintax } from '@/lib/outreach-engine';

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { guestIds, template, useSpintax = true } = body as { guestIds: string[]; template: string; useSpintax?: boolean };

    if (!Array.isArray(guestIds) || !template) {
      return NextResponse.json({ error: 'guestIds and template required' }, { status: 400 });
    }

    const state = await loadCrmState();
    const allGuests = listGuests(state);

    // Preview for the selected guests (up to 5)
    const selectedGuests = allGuests.filter(g => guestIds.includes(g.id)).slice(0, 5);
    const previews = selectedGuests.map(g => ({
      guestId: g.id,
      name: g.name,
      phone: g.phone ?? null,
      language: g.language,
      placeholders: buildPlaceholders(g),
      renderedMessage: g.phone ? renderMessage(template, g, useSpintax) : null,
      canSend: !!g.phone,
    }));

    return NextResponse.json({ previews });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
