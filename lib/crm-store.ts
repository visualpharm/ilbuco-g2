/**
 * Il Buco CRM store — Vercel Blob (store: ilbuco-crm).
 *
 * Holds the unified guest directory merged from Hostex (reservations +
 * conversations + reviews), WAHA (WhatsApp contacts), and Telegram.
 *
 * Uses the same versioned-pathname pattern as guest-ops-store and
 * pricing-config: each save creates a new pathname so Vercel Blob's CDN
 * doesn't serve stale reads.
 */

import { put, list, del } from '@vercel/blob';

// ─── Types ───────────────────────────────────────────────────────────────────

export type GuestLanguage = 'es' | 'en' | 'ru' | 'pt' | 'unknown';

export interface GuestReservation {
  code: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: string;
  guests: number;
  totalRate?: number;
  currency?: string;
  conversationId?: string;
  channel: string;
}

export interface GuestMessage {
  source: 'hostex' | 'waha' | 'telegram';
  direction: 'inbound' | 'outbound';
  text: string;
  timestamp: string;
}

export interface GuestSummary {
  happinessScore: number;  // 1-5 (5 = very happy)
  sentiment: 'happy' | 'neutral' | 'unhappy';
  summary: string;
  keyMoments: string[];
  language: string;
  recommendedOffer: string;
  generatedAt: string;
}

export interface CrmGuest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  language: GuestLanguage;
  channels: string[];        // ['airbnb', 'booking_site', 'whatsapp', 'telegram']
  reservations: GuestReservation[];
  messages: GuestMessage[];
  reviewScore?: number;
  reviewContent?: string;
  summary?: GuestSummary;
  firstBookedAt?: string;
  lastUpdatedAt?: string;
}

export interface CrmState {
  version: number;
  guests: Record<string, CrmGuest>;  // keyed by guest id
  lastSyncAt?: string;
  updatedAt?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export function defaultCrmState(): CrmState {
  return { version: 1, guests: {} };
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const VERSION_PREFIX = 'ilbuco-crm-v/';
const KEEP_VERSIONS = 6;

export async function loadCrmState(): Promise<CrmState> {
  try {
    const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
    if (!blobs.length) return defaultCrmState();
    const latest = blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b));
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    const state = (await res.json()) as CrmState;
    return { ...defaultCrmState(), ...state, guests: state.guests ?? {} };
  } catch {
    return defaultCrmState();
  }
}

export async function saveCrmState(state: CrmState): Promise<void> {
  state.updatedAt = new Date().toISOString();
  const key = `${VERSION_PREFIX}${String(Date.now()).padStart(14, '0')}.json`;
  await put(key, JSON.stringify(state, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });

  try {
    const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
    const stale = blobs
      .sort((a, b) => b.pathname.localeCompare(a.pathname))
      .slice(KEEP_VERSIONS);
    if (stale.length) await del(stale.map(b => b.url));
  } catch { /* pruning failure is harmless */ }
}

// ─── Query helpers ───────────────────────────────────────────────────────────

export function listGuests(state: CrmState): CrmGuest[] {
  return Object.values(state.guests);
}

export function upsertGuest(state: CrmState, guest: CrmGuest): CrmState {
  return { ...state, guests: { ...state.guests, [guest.id]: guest } };
}

// ─── Language detection (heuristic) ──────────────────────────────────────────

const CYRILLIC = /[\u0400-\u04FF]/;
const SPANISH_WORDS = /\b(hola|gracias|buenas|disponible|disponibilidad|precio|noches|habitaci[oó]n|bienvenida|consulta|fechas|estad[ií]a|reserva|apartamento|alojamiento|hermoso|hermosa|lugar|impecable|recomendable|recomiendo|excelente|incre[ií]ble|maravilloso|perfecto|genial|casa|bosque|playa|playa|todo|muy|super|caril[oó]|estuvimos|pasamos|volver[ií]amos|nos encant[oó]| Attention|atenci[oó]n|anfitri[oó]n|limpio|c[oó]modo|tranquilo|relajante|vacaciones|descanso)\b/i;
const PORTUGUESE_WORDS = /\b(ol[aá]|obrigad|dispon[ií]vel|pre[cç]o|quart|reserv|estadi|alojament|lind|maravilh|perfeit|excellent|incr[ií]vel|casa|praia|bosque|muito|super|tudo|passamos|voltar|recomend|limp|c[oô]mod|tranquil|relax|f[eé]rias|descanso)\b/i;
const ENGLISH_WORDS = /\b(the|this|that|with|very|really|amazing|beautiful|wonderful|perfect|great|place|house|house|beach|forest|loved|would|stay|again|clean|comfortable|quiet|relaxing|vacation|highly|recommend|everything|host|thanks|thank)\b/i;

export function detectLanguage(texts: string[]): GuestLanguage {
  const combined = texts.join(' ').toLowerCase();
  if (!combined.trim()) return 'unknown';
  if (CYRILLIC.test(combined)) return 'ru';

  // Count matches to disambiguate (PT and ES share some words)
  const hasPt = PORTUGUESE_WORDS.test(combined);
  const hasEs = SPANISH_WORDS.test(combined);
  const hasEn = ENGLISH_WORDS.test(combined);

  // Portuguese-specific markers that don't appear in Spanish
  const PT_ONLY = /\b(obrigad|dispon[ií]vel|praia|lind|maravilh|perfeit|incr[ií]vel|muito|tudo|voltar|f[eé]rias|c[oô]mod|relax)\b/i;
  if (PT_ONLY.test(combined)) return 'pt';
  if (hasEs) return 'es';
  if (hasPt) return 'pt';
  if (hasEn) return 'en';

  // Default to English for Latin script that isn't ES/PT
  return 'en';
}

export const LANGUAGE_FLAGS: Record<GuestLanguage, string> = {
  es: '🇦🇷', en: '🇬🇧', ru: '🇷🇺', pt: '🇧🇷', unknown: '🌐',
};

export const LANGUAGE_NAMES: Record<GuestLanguage, string> = {
  es: 'Spanish', en: 'English', ru: 'Russian', pt: 'Portuguese', unknown: 'Unknown',
};
