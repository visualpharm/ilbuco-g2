/**
 * WAHA (WhatsApp HTTP API) client — ported from openclaw-private/platforms/
 * whatsapp-agent/ilbuco-bridge/index.js.
 *
 * WAHA runs on the remote Mac "lobo" as Docker containers, one per WhatsApp
 * number. The Il Buco number (+54 9 11 2127 5492) is on port 3002.
 *
 * Auth: X-Api-Key header (shared WAHA_API_KEY across all containers).
 * Transport: HTTP over Tailscale (lobo.taila9b9c5.ts.net).
 *
 * Env:
 *   WAHA_API_KEY      — shared API key for all WAHA containers
 *   WAHA_ILBUCO_URL   — base URL for the Il Buco container (default: http://lobo.taila9b9c5.ts.net:3002)
 *   WAHA_SESSION      — session name (default: "default")
 */

const WAHA_API_KEY = process.env.WAHA_API_KEY;
const WAHA_BASE_URL =
  process.env.WAHA_ILBUCO_URL ||
  process.env.ILBUCO_WAHA_URL ||
  'http://lobo.taila9b9c5.ts.net:3002';
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';

export function isWahaConfigured(): boolean {
  return !!WAHA_API_KEY;
}

// ─── Low-level fetch with retry on 5xx ───────────────────────────────────────

async function wahaFetch(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (WAHA_API_KEY) headers['X-Api-Key'] = WAHA_API_KEY;

  let lastError: Error | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${WAHA_BASE_URL}${path}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (res.ok) {
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }
      if (res.status >= 500) {
        lastError = new Error(`WAHA ${res.status}: ${await res.text()}`);
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }
      // 4xx — don't retry (e.g. 422 SESSION_NOT_WORKING is handled by caller)
      throw new Error(`WAHA ${res.status}: ${await res.text()}`);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('WAHA ')) throw err;
      lastError = err instanceof Error ? err : new Error(String(err));
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw lastError || new Error('WAHA request failed');
}

// ─── Session management ──────────────────────────────────────────────────────

export type SessionStatus = 'WORKING' | 'STARTING' | 'FAILED' | 'STOPPED' | 'SCAN_QR_CODE';

/**
 * Get the current WAHA session status.
 * Only send messages when status is WORKING.
 */
export async function getSessionStatus(): Promise<SessionStatus> {
  try {
    const data = (await wahaFetch('/api/sessions/default')) as { status?: string };
    return (data.status as SessionStatus) || 'FAILED';
  } catch {
    return 'FAILED';
  }
}

/**
 * Check if WAHA is ready to send messages.
 */
export async function isSessionReady(): Promise<boolean> {
  return (await getSessionStatus()) === 'WORKING';
}

// ─── Send messages ───────────────────────────────────────────────────────────

/**
 * Send a text message via WhatsApp.
 *
 * @param chatId  WhatsApp chat ID (e.g. "5491112345678@c.us")
 * @param text    Message body
 * @returns       Message object with key.id on success
 */
export async function sendText(
  chatId: string,
  text: string
): Promise<{ id?: string }> {
  const data = (await wahaFetch('/api/sendText', {
    method: 'POST',
    body: { session: WAHA_SESSION, chatId, text },
  })) as { key?: { id?: string } };
  return { id: data.key?.id };
}

/**
 * Convert a phone number to a WhatsApp chat ID.
 * Handles the Argentina mobile quirk (54 → 549 for mobiles).
 */
export function phoneToChatId(phone: string): string {
  let cleaned = phone.replace(/[^\d]/g, '');
  // Argentina mobile: if starts with 54 and not already 549, insert the 9
  if (cleaned.startsWith('54') && !cleaned.startsWith('549') && cleaned.length >= 12) {
    cleaned = '549' + cleaned.slice(2);
  }
  return `${cleaned}@c.us`;
}

// ─── Chat history ────────────────────────────────────────────────────────────

export interface WahaMessage {
  id: string;
  fromMe: boolean;
  text: string;
  timestamp: number;
}

/**
 * Fetch recent chat history for a conversation.
 * Used to check if the guest has messaged us (24h window open).
 */
export async function getChatHistory(
  chatId: string,
  limit = 10
): Promise<WahaMessage[]> {
  try {
    const data = (await wahaFetch(
      `/api/default/chats/${encodeURIComponent(chatId)}/messages?limit=${limit}&downloadMedia=false`
    )) as Array<Record<string, unknown>>;
    return (data || [])
      .filter((m) => m)
      .map((m) => ({
        id: String(m.id?.id ?? m.id ?? ''),
        fromMe: Boolean(m.fromMe ?? m.fromMe === true),
        text: String(m.message?.conversation ?? m.text ?? m.body ?? ''),
        timestamp: Number(m.timestamp ?? 0),
      }))
      .reverse(); // WAHA returns newest-first; we want chronological
  } catch {
    return [];
  }
}

/**
 * Check if a guest has an open 24-hour window by looking for their inbound messages.
 * WhatsApp's free-form messaging window opens when the guest messages us first.
 */
export async function hasOpenWindow(chatId: string): Promise<boolean> {
  const history = await getChatHistory(chatId, 20);
  if (!history.length) return false;
  // If the most recent message is from the guest, window is open
  const lastGuest = [...history].reverse().find(m => !m.fromMe);
  if (!lastGuest) return false;
  const elapsed = Date.now() - lastGuest.timestamp * 1000;
  return elapsed < 24 * 3600 * 1000; // 24 hours
}
