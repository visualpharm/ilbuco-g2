/**
 * Multi-channel PIN delivery dispatcher.
 *
 * Channels:
 *   - Hostex thread (Airbnb / Booking.com / direct-site chat via sendMessage) — primary
 *   - Email (Mailgun, when configured)
 * WhatsApp is not a server-side channel: WAHA was removed (2026-10-08) and
 * WhatsApp Web is only reachable from the owner's Mac, not from Vercel.
 *
 * Each channel is independent — a failure in one doesn't block the others.
 * Results are recorded per-channel for the Nimda dashboard.
 */

import { sendEmail, isMailConfigured } from './mail';
import { sendMessage } from './hostex-api';
import type { ChannelStatus, DeliveryChannel } from './guest-ops-store';

// ─── Message templates ───────────────────────────────────────────────────────

export interface PinMessageData {
  guestName: string;
  pin: number | string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  /** WhatsApp number for the guest to message us (for contact capture) */
  wabaNumber?: string;
  address?: string;
}

/**
 * Build the PIN delivery message text (WhatsApp / Hostex thread).
 * Bilingual ES/EN since most guests are Spanish or English speakers.
 */
export function buildPinText(data: PinMessageData): string {
  const dateStr = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let msg = `🔑 *${data.propertyName} — Check-in*\n\n`;
  msg += `Hola ${data.guestName}! / Hi ${data.guestName}!\n\n`;
  msg += `Your door code: *${data.pin}*\n`;
  msg += `Tu código de puerta: *${data.pin}*\n\n`;
  msg += `Check-in: ${dateStr(data.checkIn)}\n`;
  msg += `Check-out: ${dateStr(data.checkOut)}\n`;
  if (data.address) {
    msg += `Address: ${data.address}\n`;
    msg += `Dirección: ${data.address}\n`;
  }
  msg += `\nThe code works during your stay only.\n`;
  msg += `El código funciona solo durante tu estadía.\n`;
  if (data.wabaNumber) {
    msg += `\n📱 Questions? WhatsApp us: https://wa.me/${data.wabaNumber.replace(/[^\d]/g, '')}`;
  }
  return msg;
}

/**
 * Build the PIN delivery email HTML.
 */
export function buildPinEmail(data: PinMessageData): { subject: string; html: string; text: string } {
  const dateStr = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const subject = `🔑 Your door code for ${data.propertyName} / Tu código de acceso`;
  const text = buildPinText(data);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1e293b;">🔑 ${data.propertyName}</h2>
      <p style="color: #475569; font-size: 16px;">Hola ${data.guestName}! / Hi ${data.guestName}!</p>
      <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 16px 0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px;">Your door code / Tu código</p>
        <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0f172a; margin: 0;">${data.pin}</p>
      </div>
      <table style="width: 100%; color: #475569; font-size: 14px;">
        <tr><td style="padding: 4px 0;">Check-in:</td><td style="font-weight: 600;">${dateStr(data.checkIn)}</td></tr>
        <tr><td style="padding: 4px 0;">Check-out:</td><td style="font-weight: 600;">${dateStr(data.checkOut)}</td></tr>
        ${data.address ? `<tr><td style="padding: 4px 0;">Address:</td><td style="font-weight: 600;">${data.address}</td></tr>` : ''}
      </table>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
        The code works during your stay only. El código funciona solo durante tu estadía.
      </p>
      ${data.wabaNumber ? `<p style="color: #64748b; font-size: 14px;"><a href="https://wa.me/${data.wabaNumber.replace(/[^\d]/g, '')}">📱 Questions? WhatsApp us</a></p>` : ''}
    </div>
  `;

  return { subject, html, text };
}

// ─── Delivery ────────────────────────────────────────────────────────────────

export interface DeliveryResult {
  channel: DeliveryChannel;
  sent: boolean;
  error?: string;
}

/**
 * Attempt to deliver the PIN via a single channel.
 */
async function deliverViaChannel(
  channel: DeliveryChannel,
  data: PinMessageData,
  opts: { conversationId?: string }
): Promise<DeliveryResult> {
  try {
    switch (channel) {
      case 'whatsapp':
        return { channel, sent: false, error: 'WhatsApp is not available from the server' };

      case 'email':
        // Sent by deliverPin() once it has the guest's address; reaching here means it could not.
        return { channel, sent: false, error: isMailConfigured() ? 'No guest email' : 'Mailgun not configured' };

      case 'hostex': {
        if (!opts.conversationId) return { channel, sent: false, error: 'No conversation ID' };
        await sendMessage(opts.conversationId, buildPinText(data));
        return { channel, sent: true };
      }

      default:
        return { channel, sent: false, error: `Unknown channel: ${channel}` };
    }
  } catch (err) {
    return { channel, sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface DeliverPinOptions {
  guestEmail?: string;
  conversationId?: string;
  /** Which channels to try. Default: email + hostex. */
  channels?: DeliveryChannel[];
}

/**
 * Deliver the PIN across all configured channels.
 * Returns per-channel results. Each channel is independent.
 */
export async function deliverPin(
  data: PinMessageData,
  opts: DeliverPinOptions
): Promise<ChannelStatus[]> {
  const channels = opts.channels ?? ['email', 'hostex'];
  const results: ChannelStatus[] = [];

  // Run all channels in parallel — they're independent
  const deliveries = channels.map(async (channel) => {
    const result = await deliverViaChannel(channel, data, {
      conversationId: opts.conversationId,
    });

    // Special case: email needs guestEmail injected from opts
    if (channel === 'email' && opts.guestEmail && isMailConfigured()) {
      try {
        const email = buildPinEmail(data);
        await sendEmail({ to: opts.guestEmail, ...email });
        return {
          channel: 'email' as const,
          sent: true,
          sentAt: new Date().toISOString(),
        } satisfies ChannelStatus;
      } catch (err) {
        return {
          channel: 'email' as const,
          sent: false,
          error: err instanceof Error ? err.message : String(err),
        } satisfies ChannelStatus;
      }
    }

    return {
      channel: result.channel,
      sent: result.sent,
      sentAt: result.sent ? new Date().toISOString() : undefined,
      error: result.error,
    } satisfies ChannelStatus;
  });

  const settled = await Promise.all(deliveries);
  results.push(...settled);

  return results;
}
