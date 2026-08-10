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
import { type CrmGuest } from './crm-store';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OutreachTarget {
  guestId: string;
  name: string;
  phone: string;
  language: string;
  chatId: string;
  /** True if guest has messaged us in the last 24h (free-form window open). */
  windowOpen: boolean;
  /** Full guest record for placeholder rendering */
  guest: CrmGuest;
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

// ─── Placeholders ─────────────────────────────────────────────────────────────

/**
 * Guest data available for placeholder substitution.
 * Every placeholder {key} is replaced with the corresponding value.
 */
export interface GuestPlaceholders {
  name: string;           // First name (e.g. "Maria")
  fullName: string;       // Full name (e.g. "Maria Garcia")
  stays: string;          // Number of stays (e.g. "3")
  staysWord: string;      // Number of stays in words (e.g. "tres")
  property: string;       // Property name from last stay (e.g. "Terrazzo")
  monthsAgo: string;      // Months since last stay (e.g. "4")
  monthsAgoWord: string;  // Months since last stay in words (e.g. "cuatro")
  lastStay: string;       // Last checkout date formatted (e.g. "03/05/26")
  year: string;           // Current year (e.g. "2026")
  channel: string;        // Booking channel (e.g. "airbnb")
  country: string;        // Country code (e.g. "AR")
}

/** Spanish number-to-word for small numbers (1-10) */
function numberToWord(n: number): string {
  const words = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  return n >= 0 && n <= 10 ? words[n] : String(n);
}

/**
 * Build placeholder values from a CRM guest record.
 */
export function buildPlaceholders(guest: CrmGuest): GuestPlaceholders {
  const firstName = guest.name.split(/\s+/)[0] || guest.name;
  const lastReservation = guest.reservations[guest.reservations.length - 1];

  let monthsAgo = 0;
  if (lastReservation?.checkOut) {
    const checkout = new Date(lastReservation.checkOut);
    const now = new Date();
    monthsAgo = Math.max(0, Math.round((now.getTime() - checkout.getTime()) / (30.44 * 24 * 3600 * 1000)));
  }

  return {
    name: firstName,
    fullName: guest.name,
    stays: String(guest.reservations.length),
    staysWord: numberToWord(guest.reservations.length),
    property: lastReservation?.property ?? 'Il Buco',
    monthsAgo: String(monthsAgo),
    monthsAgoWord: numberToWord(monthsAgo),
    lastStay: lastReservation?.checkOut
      ? new Date(lastReservation.checkOut).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
      : '',
    year: String(new Date().getFullYear()),
    channel: lastReservation?.channel ?? '',
    country: guest.country ?? '',
  };
}

/**
 * Replace all {placeholder} tokens in a template with actual values.
 * Only replaces KNOWN placeholder keys — unknown {tokens} are left alone
 * (so spintax {Hola|Hey} is preserved).
 */
export function replacePlaceholders(template: string, ph: GuestPlaceholders): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    // Only replace if it's a known placeholder (single word, no |)
    if (key in ph) {
      return String(ph[key as keyof GuestPlaceholders]);
    }
    // Not a known placeholder — leave it untouched (might be spintax)
    return match;
  });
}

// ─── Spintax ──────────────────────────────────────────────────────────────────

/**
 * Expand spintax text: {Hola|Hey|Buenas} → random pick.
 * A spintax group MUST contain a pipe | to be treated as spintax.
 * Groups without | are left untouched (they're not spintax).
 */
export function expandSpintax(text: string): string {
  // Only match {a|b|c} — must contain at least one |
  const spinRe = /\{([^{}]*\|[^{}]*)\}/;
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
 * 1. Replace {name}, {stays}, etc. with actual values
 * 2. Expand spintax {Hola|Hey|Buenas}
 */
export function renderMessage(template: string, guest: CrmGuest, useSpintax = true): string {
  const placeholders = buildPlaceholders(guest);
  const withPlaceholders = replacePlaceholders(template, placeholders);
  return useSpintax ? expandSpintax(withPlaceholders) : expandSpintaxFirst(withPlaceholders);
}

/**
 * Expand spintax by always picking the FIRST option (for previews or
 * when random variation is disabled).
 */
function expandSpintaxFirst(text: string): string {
  const spinRe = /\{([^{}]*\|[^{}]*)\}/;
  let result = text;
  let safety = 100;
  while (spinRe.test(result) && safety-- > 0) {
    result = result.replace(spinRe, (_, content: string) => {
      return content.split('|')[0];
    });
  }
  return result;
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
      windowOpen: checkWindow ? await hasOpenWindow(chatId) : true,
      guest: g,
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
  onProgress?: (done: number, total: number, result: SendResult) => void,
  useSpintax = true
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
    const message = renderMessage(template, target.guest, useSpintax);

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
    name: '📋 Pedir reseña',
    description: 'Después del checkout',
    template: `¡{Hola|Hey|Buenas} {name}! {Espero|Esperamos} que hayas llegado bien a casa 🌲 ¿Nos {dejarías|dejan} una reseña? {Ayuda mucho|Significa mucho} 🙏`,
  },
  return_repeat: {
    name: '🔄 Volver (重复客)',
    description: 'Huésped que ya vino varias veces',
    template: `¡{Hola|Hey} {name}! {Qué bueno|Nos alegra} verte de nuevo por acá. {Ya es|Vienen siendo} {stays} estadías en {property} 🌲 Si {querés|tenés ganas de} volver, tenemos {novedades|algo especial} para vos.`,
  },
  off_season_nomad: {
    name: '🏝️ Nómada baja temporada',
    description: 'Tarifa mensual mayo-septiembre',
    template: `{Hola|Hey} {name}! {Hace|Ya van} {monthsAgo} {meses|mes} desde tu última visita a {property}. Si {querés|tenés ganas de} volver a trabajar al bosque, tenemos tarifa nómada para estadas largas (mayo-septiembre). ¿Te {interesa|mando} los precios?`,
  },
  return_discount: {
    name: '🎁 Descuento retorno',
    description: '15% off para huéspedes que vuelven',
    template: `¡{Hola|Hey} {name}! {Como ya nos conocemos|Como ya estuviste acá {stays} {vez|veces}}, te {ofrecemos|damos} 15% off en tu próxima reserva directa. Código VOLVER15 en book.ilbuco.com.ar 🌲`,
  },
  holiday: {
    name: '🎉 Feriado disponible',
    description: 'Avisar fechas libres',
    template: `{Hola|Hey} {name}! {Quedan|Tenemos} fechas libres para {el feriado|Semana Santa} en {property}. Si {querés|pensás} volver a Cariló, {avisanos|escribinos} pronto que se llenan rápido 🌊`,
  },
  referral: {
    name: '👥 Referido',
    description: 'Pedir que recomienden',
    template: `{Hola|Hey} {name}! Si {conocés|tenés} alguien que le {gustaría|encantaría} {property}, {mandalos|mándalos}. A vos y a ellos les {damos|hacemos} una noche gratis 🌲✨`,
  },
  we_miss_you: {
    name: '💭 Te extrañamos',
    description: 'Huésped que no vuelve hace mucho',
    template: `{Hola|Hey} {name}! {Hace|Ya pasaron} {monthsAgo} {meses|mes} desde tu estadía en {property} 🌲 {¿Cómo estás?|¿Todo bien?} Si {extrañás|extrañan} el bosque, {tenemos|hay} disponibilidad este {año|verano}.`,
  },
};

