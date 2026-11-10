/**
 * Instant wake of the hub's guest-messaging session on a new guest message.
 *
 * Hostex calls /api/hostex-webhook on `message_created`; for a message written by
 * the guest (not the host, not a Hostex "Bot:" auto-message) we POST a signed
 * request to the hub relay on munk (scripts/hub_wake_relay.py, behind the
 * Cloudflare tunnel). The relay checks the HMAC and runs `hub agent-send`,
 * de-duplicated by the Hostex message id. The 2-minute poll stays as fallback.
 *
 * Env: HUB_WAKE_URL (relay endpoint), HUB_WAKE_SECRET (HMAC key, 1Password).
 */
import { createHmac } from 'node:crypto';

export interface WakePayload {
  message_id: string;
  conversation_id: string;
  guest: string;
  text: string;
  test: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildWake(body: any): WakePayload | null {
  const msg = body?.data?.message || {};
  const event = body?.event || body?.data?.event || '';
  if (event && event !== 'message_created') return null;
  const conversationId = String(body?.data?.conversation_id || body?.conversation_id || '');
  const messageId = String(msg.id || body?.message_id || body?.id || '');
  const senderRole = msg.sender_role || body?.sender_role || '';
  const senderName = String(msg.sender_name || body?.sender_name || '');
  if (!conversationId || !messageId) return null;
  if (senderRole !== 'guest') return null;
  if (senderName.startsWith('Bot:')) return null;
  const text = String(msg.content || body?.content || body?.message || '');
  return {
    message_id: messageId,
    conversation_id: conversationId,
    guest: String(body?.data?.guest?.name || senderName || ''),
    text: text.slice(0, 1500),
    test: body?.test === true,
  };
}

export function signWake(secret: string, ts: number, raw: string): string {
  return createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
}

export async function wakeHub(
  payload: WakePayload,
  opts: { url?: string; secret?: string; fetchImpl?: typeof fetch; timeoutMs?: number; now?: () => number } = {},
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const url = opts.url ?? process.env.HUB_WAKE_URL;
  const secret = opts.secret ?? process.env.HUB_WAKE_SECRET;
  if (!url || !secret) return { ok: false, error: 'not_configured' };
  const raw = JSON.stringify(payload);
  const ts = Math.floor((opts.now ?? Date.now)() / 1000);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 3000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Wake-Timestamp': String(ts),
        'X-Hub-Wake-Signature': signWake(secret, ts, raw),
      },
      body: raw,
      signal: ctrl.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }
}
