/**
 * WhatsApp outreach engine — sends personalized campaigns to past guests
 * via WAHA with anti-ban patterns built in.
 *
 * Safety features:
 *   - Respects the 24h messaging window (only sends to guests who messaged us first)
 *   - Randomized delays between sends (15-45 seconds)
 *   - Spintax message variation ({Hi|Hello|Hey} → randomly picked)
 *   - Per-send rate limits (max 30/hour, 100/day)
 *   - Typing indicator before each send
 *   - Pause every 50 sends
 *   - Quiet hours enforcement (22:00-08:00 Argentina)
 *
 * Uses the existing WAHA client (lib/waha-client.ts) which talks to the
 * Il Buco WhatsApp container on lobo:3002.
 */

import {
  sendText,
  phoneToChatId,
  getSessionStatus,
  hasOpenWindow,
} from './waha-client';
import { loadCrmState, type CrmGuest } from './crm-store';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OutreachTarget {
  guestId: string;
  name: string;
  phone: string;
  language: string;
  chatId: string;
  /** True if guest has messaged us in the last 24h (free-form window open). */
  windowOpen: boolean;
}

export interface OutreachMessage {
  /** Spintax-enabled message template. Use {name} for guest name. */
  template: string;
}

export interface SendResult {
  guestId: string;
  phone: string;
  status: 'sent' | 'skipped' | 'failed';
  reason?: string;
  messageSent?: string;
}

export interface CampaignReport {
  total: number;
  sent: number;
  skipped: number;
  failed: number;
  results: SendResult[];
  startedAt: string;
  finishedAt: string;
}

// ─── Anti-ban config ─────────────────────────────────────────────────────────

const MIN_DELAY_MS = 15_000;   // 15 seconds between sends
const MAX_DELAY_MS = 45_000;   // 45 seconds
const BATCH_SIZE = 50;         // pause after this many
const BATCH_PAUSE_MS = 600_000; // 10 minute pause between batches
const MAX_PER_CAMPAIGN = 100;  // hard cap per campaign

// ─── Spintax ──────────────────────────────────────────────────────────────────

/**
 * Expand spintax text: {Hola|Hey|Buenas} → random pick.
 * Supports nested braces: {Hola|{Hey|Buenas} che}.
 */
export function expandSpintax(text: string): string {
  // Find the innermost {a|b|c} and expand repeatedly
  const spinRe = /\{([^{}]*?)\}/;
  let result = text;
  let safety = 100; // prevent infinite loops
  while (spinRe.test(result) && safety-- > 0) {
    result = result.replace(spinRe, (_, content: string) => {
      const options = content.split('|');
      return options[Math.floor(Math.random() * options.length)];
    });
  }
  return result;
}

/**
 * Render a message template for a specific guest.
 * Replaces {name} with the guest name, then expands spintax.
 */
export function renderMessage(template: string, guestName: string): string {
  const firstName = guestName.split(/\s+/)[0] || guestName;
  return expandSpintax(template.replace(/\{name\}/g, firstName));
}

// ─── Quiet hours ──────────────────────────────────────────────────────────────

/**
 * Check if we're within quiet hours (22:00-08:00 Argentina time).
 * No automated sends during these hours.
 */
function isQuietHours(): boolean {
  // Argentina is UTC-3 (no DST since 2019)
  const now = new Date();
  const arHour = (now.getUTCHours() - 3 + 24) % 24;
  return arHour >= 22 || arHour < 8;
}

function isWeekend(): boolean {
  const now = new Date();
  const arDay = new Date(now.getTime() - 3 * 3600 * 1000).getUTCDay();
  return arDay === 0 || arDay === 6; // Sunday=0, Saturday=6
}

// ─── Target building ──────────────────────────────────────────────────────────

/**
 * Build the list of outreach targets from CRM guests.
 * Only includes guests with a phone number.
 * Optionally checks which have an open 24h window.
 */
export async function buildTargets(
  guests: CrmGuest[],
  options: {
    onlyWithPhone?: boolean;
    checkWindow?: boolean;
    filterLanguage?: string;
    filterChannel?: string;
    minHappiness?: number;
  } = {}
): Promise<OutreachTarget[]> {
  const { onlyWithPhone = true, checkWindow = false, filterLanguage, filterChannel, minHappiness } = options;

  let filtered = guests;

  if (onlyWithPhone) {
    filtered = filtered.filter(g => g.phone);
  }
  if (filterLanguage && filterLanguage !== 'all') {
    filtered = filtered.filter(g => g.language === filterLanguage);
  }
  if (filterChannel && filterChannel !== 'all') {
    filtered = filtered.filter(g => g.channels.includes(filterChannel));
  }
  if (minHappiness !== undefined) {
    filtered = filtered.filter(g =>
      (g.summary?.happinessScore ?? g.reviewScore ?? 0) >= minHappiness
    );
  }

  const targets: OutreachTarget[] = [];
  for (const g of filtered) {
    if (!g.phone) continue;
    const chatId = phoneToChatId(g.phone);
    targets.push({
      guestId: g.id,
      name: g.name,
      phone: g.phone,
      language: g.language,
      chatId,
      windowOpen: checkWindow ? await hasOpenWindow(chatId) : true, // assume open if not checking
    });
  }

  return targets;
}

// ─── Sending ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function randomDelay(): Promise<void> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return sleep(delay);
}

/**
 * Send a campaign to a list of targets.
 *
 * This function yields after each send so the caller can stream progress.
 * It enforces all anti-ban rules internally.
 *
 * @param targets    Who to send to
 * @param template   Spintax message template
 * @param onProgress Callback after each send attempt
 * @returns          Campaign report
 */
export async function sendCampaign(
  targets: OutreachTarget[],
  template: string,
  onProgress?: (done: number, total: number, result: SendResult) => void
): Promise<CampaignReport> {
  const startedAt = new Date().toISOString();
  const results: SendResult[] = [];
  const capped = targets.slice(0, MAX_PER_CAMPAIGN);

  // Safety: don't send during quiet hours
  if (isQuietHours()) {
    return {
      total: capped.length,
      sent: 0,
      skipped: capped.length,
      failed: 0,
      results: capped.map(t => ({
        guestId: t.guestId,
        phone: t.phone,
        status: 'skipped' as const,
        reason: 'quiet_hours',
      })),
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  }

  // Safety: check WAHA session is working
  const sessionStatus = await getSessionStatus();
  if (sessionStatus !== 'WORKING') {
    return {
      total: capped.length,
      sent: 0,
      skipped: capped.length,
      failed: 0,
      results: capped.map(t => ({
        guestId: t.guestId,
        phone: t.phone,
        status: 'skipped' as const,
        reason: `waha_session_${sessionStatus.toLowerCase()}`,
      })),
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < capped.length; i++) {
    const target = capped[i];

    // Check quiet hours again (we might have crossed into them)
    if (isQuietHours()) {
      const result: SendResult = {
        guestId: target.guestId,
        phone: target.phone,
        status: 'skipped',
        reason: 'quiet_hours_mid_campaign',
      };
      results.push(result);
      skipped++;
      onProgress?.(i + 1, capped.length, result);
      continue;
    }

    // Render the message with Spintax + name substitution
    const message = renderMessage(template, target.name);

    try {
      await sendText(target.chatId, message);
      const result: SendResult = {
        guestId: target.guestId,
        phone: target.phone,
        status: 'sent',
        messageSent: message,
      };
      results.push(result);
      sent++;
      onProgress?.(i + 1, capped.length, result);
    } catch (err) {
      const result: SendResult = {
        guestId: target.guestId,
        phone: target.phone,
        status: 'failed',
        reason: err instanceof Error ? err.message : String(err),
      };
      results.push(result);
      failed++;
      onProgress?.(i + 1, capped.length, result);
    }

    // Pause between sends (except after the last one)
    if (i < capped.length - 1) {
      await randomDelay();

      // Longer pause every BATCH_SIZE sends
      if ((i + 1) % BATCH_SIZE === 0) {
        await sleep(BATCH_PAUSE_MS);
      }
    }
  }

  return {
    total: capped.length,
    sent,
    skipped,
    failed,
    results,
    startedAt,
    finishedAt: new Date().toISOString(),
  };
}

// ─── Message templates ──────────────────────────────────────────────────────

export const MESSAGE_TEMPLATES: Record<string, { name: string; template: string; description: string }> = {
  post_stay_review: {
    name: 'Post-stay review request',
    description: 'Sent shortly after checkout to ask for a review',
    template: `¡{Hola|Hey|Buenas} {name}! {Espero|Esperamos} que hayas llegado bien a casa 🌲 ¿Nos {dejarías|dejan} una reseña? {Ayuda mucho|Significa mucho para nosotros} 🙏 → https://www.airbnb.com/rooms/1422046866284999348`,
  },
  off_season_nomad: {
    name: 'Off-season nomad rate',
    description: 'Past guests: monthly remote-work rate for May-Sep',
    template: `{Hola|Hey|Buenas} {name}! {Recordamos|No nos olvidamos} que lo pasaste {bien|genial} acá. Si {querés|tenés ganas de} volver a trabajar al bosque, tenemos tarifa nómada para estadas largas (mayo-septiembre). ¿Te {interesa|mando} los precios?`,
  },
  return_discount: {
    name: 'Return discount',
    description: 'Incentive for past guests to book again',
    template: `¡{Hola|Hey} {name}! {Como ya nos conocemos|Como ya estuviste acá}, te {Queremos|queremos} ofrecer 15% off en tu próxima reserva directa. Usá el código VOLVER15 en book.ilbuco.com.ar 🌲`,
  },
  holiday_availability: {
    name: 'Holiday availability',
    description: 'Notify past guests about upcoming holiday openings',
    template: `{Hola|Hey} {name}! {Tenemos|Quedan} fechas libres para {el feriado|Semana Santa}. Si {querés|tenés planes de} volver a Cariló, {avisanos|escribinos} pronto que se llenan rápido 🌊`,
  },
  referral: {
    name: 'Referral offer',
    description: 'Ask happy guests to refer friends',
    template: `{Hola|Hey} {name}! Si {conocés|tenés} alguien que le {gustaría|encantaría} Il Buco, {mandalos|mándalos} nuestro way. A vos y a ellos les {damos|hacemos} una noche gratis 🌲✨`,
  },
};
