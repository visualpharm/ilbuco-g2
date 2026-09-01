/**
 * /api/waha-webhook — receives inbound WhatsApp messages from WAHA.
 *
 * When a guest messages the Il Buco WhatsApp number, WAHA fires this webhook.
 * We capture the contact (phone + opt-in) for marketing, and if the PIN is
 * already synced to the lock, we deliver it via WhatsApp (opening the 24h window).
 *
 * WAHA can be configured to send webhooks here by setting WHATSAPP_WEBHOOK_URL
 * on the container, OR by configuring ilbuco-bridge to forward to this endpoint.
 *
 * Auth: validates WAHA_API_KEY via X-Api-Key header (same key the container uses).
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadState, saveState, upsertContact, upsertAssignment, type Contact } from '@/lib/guest-ops-store';
import { sendText, phoneToChatId, isWahaConfigured } from '@/lib/waha-client';
import { buildPinText, type PinMessageData } from '@/lib/messaging';

// In-memory dedup (duplicates arrive within ms in serverless)
const recentMessages = new Map<string, number>();

function isDuplicate(messageId: string): boolean {
  const now = Date.now();
  recentMessages.forEach((ts, id) => {
    if (now - ts > 5 * 60 * 1000) recentMessages.delete(id);
  });
  if (recentMessages.has(messageId)) return true;
  recentMessages.set(messageId, now);
  return false;
}

export async function POST(request: NextRequest) {
  // Validate API key - fail closed if unset
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.WAHA_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ error: 'Server misconfigured: WAHA_API_KEY not set' }, { status: 500 });
  }
  if (apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const body = await request.json();

  // Only process message events
  const event = body.event;
  if (event !== 'message') {
    return NextResponse.json({ ok: true, skipped: `event=${event}` });
  }

  // Extract message fields
  const payload = body.payload || body;
  const messageId = payload.id?.id || payload.id || body.id || '';
  const fromMe = payload.fromMe ?? payload.fromMe === true;
  const fromPhone = (payload.from || payload.chatId || '').replace(/@c\.us$|@s\.whatsapp\.net$/g, '');
  const text = payload.body || payload.message?.conversation || payload.text || '';

  // Skip host's own messages and group chats
  if (fromMe) return NextResponse.json({ ok: true, skipped: 'fromMe' });
  if (!fromPhone || fromPhone.includes('@g.us')) {
    return NextResponse.json({ ok: true, skipped: 'group_or_empty' });
  }

  // Dedup
  if (messageId && isDuplicate(messageId)) {
    return NextResponse.json({ ok: true, skipped: 'duplicate' });
  }

  console.log(`[waha-webhook] Inbound from ${fromPhone}: ${text.slice(0, 80)}`);

  // Capture the contact
  try {
    const state = await loadState();

    // Try to match this phone to an existing reservation
    const matchingAssignment = Object.values(state.pinAssignments).find(a => {
      if (!a.guestPhone) return false;
      const normalizedGuest = a.guestPhone.replace(/[^\d]/g, '');
      const normalizedInbound = fromPhone.replace(/[^\d]/g, '');
      // Match on last 8 digits (handles country code variations)
      return normalizedGuest.slice(-8) === normalizedInbound.slice(-8);
    });

    // Upsert contact
    const existingContact = state.contacts[fromPhone];
    const contact: Contact = {
      phone: fromPhone,
      name: existingContact?.name || matchingAssignment?.guestName || `Guest ${fromPhone.slice(-4)}`,
      email: existingContact?.email || matchingAssignment?.guestEmail,
      optInAt: existingContact?.optInAt || new Date().toISOString(),
      reservations: existingContact?.reservations || (matchingAssignment ? [matchingAssignment.reservationCode] : []),
    };
    let newState = upsertContact(state, contact);

    // If there's a matching assignment with a synced PIN, deliver it via WhatsApp now
    if (matchingAssignment && matchingAssignment.lockStatus === 'synced' && matchingAssignment.pin) {
      if (isWahaConfigured()) {
        try {
          const chatId = phoneToChatId(fromPhone);
          const data: PinMessageData = {
            guestName: matchingAssignment.guestName,
            pin: matchingAssignment.pin,
            propertyName: matchingAssignment.propertyName,
            checkIn: matchingAssignment.checkIn,
            checkOut: matchingAssignment.checkOut,
          };
          await sendText(chatId, buildPinText(data));

          // Mark WhatsApp as delivered
          const updated = {
            ...matchingAssignment,
            channels: [
              ...(matchingAssignment.channels?.filter(c => c.channel !== 'whatsapp') || []),
              { channel: 'whatsapp' as const, sent: true, sentAt: new Date().toISOString() },
            ],
            updatedAt: new Date().toISOString(),
          };
          newState = upsertAssignment(newState, updated);
          console.log(`[waha-webhook] ✅ Delivered PIN to ${fromPhone} for ${matchingAssignment.guestName}`);
        } catch (err) {
          console.error(`[waha-webhook] Failed to send PIN to ${fromPhone}:`, err);
        }
      }
    }

    await saveState(newState);
  } catch (err) {
    console.error('[waha-webhook] Error processing:', err);
  }

  return NextResponse.json({ ok: true, processed: true });
}
