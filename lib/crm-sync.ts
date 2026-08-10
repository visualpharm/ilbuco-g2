/**
 * Il Buco CRM sync — pulls guests from Hostex + WAHA + Telegram,
 * merges them into unified CrmGuest records.
 *
 * This is the "Sync Guests" button handler. It's slow (multiple paginated
 * API calls) but only runs on demand from the admin panel.
 */

import {
  getFullReservations,
  listConversations,
  getReviews,
  getConversation,
  getPropertyName,
  type FullReservation,
  type HostexReview,
} from './hostex-api';
import {
  loadCrmState,
  saveCrmState,
  upsertGuest,
  detectLanguage,
  type CrmGuest,
  type CrmState,
  type GuestReservation,
  type GuestMessage,
} from './crm-store';
import { loadState as loadGuestOpsState } from './guest-ops-store';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a stable guest ID from phone or email or name.
 * Deduplicates across sources.
 */
function guestId(phone?: string | null, email?: string | null, name?: string): string {
  if (phone) return `phone:${phone.replace(/[^\d]/g, '')}`;
  if (email) return `email:${email.toLowerCase().trim()}`;
  return `name:${(name || 'unknown').toLowerCase().trim()}`;
}

/**
 * Normalize phone for comparison (last 8 digits).
 */
function phoneMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const na = a.replace(/[^\d]/g, '').slice(-8);
  const nb = b.replace(/[^\d]/g, '').slice(-8);
  return na.length === 8 && na === nb;
}

/**
 * Normalize a name for fuzzy comparison (remove accents, lowercase, alnum only).
 */
function normalizeName(name?: string | null): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Check if two names are similar enough to be the same person.
 * Matches on exact normalized form, or one being a substring of the other
 * (e.g. "Jose Garcia" matches "Jose Maria Garcia").
 */
function nameMatch(a?: string | null, b?: string | null): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb || na.length < 4 || nb.length < 4) return false;
  if (na === nb) return true;
  // Check if one fully contains the other (handles middle name differences)
  if (na.length > nb.length) return na.includes(nb);
  return nb.includes(na);
}

/**
 * Merge two CrmGuest records into one, preferring the richer data.
 * The "primary" ID wins (phone > email > name).
 */
function mergeGuests(a: CrmGuest, b: CrmGuest): CrmGuest {
  // Pick the preferred ID (phone-based is most stable)
  const id = a.id.startsWith('phone:') ? a.id
    : b.id.startsWith('phone:') ? b.id
    : a.id.startsWith('email:') ? a.id
    : b.id;

  // Merge reservations (dedup by code)
  const reservations = [...a.reservations];
  for (const r of b.reservations) {
    if (!reservations.find(x => x.code === r.code)) reservations.push(r);
  }
  reservations.sort((x, y) => x.checkIn.localeCompare(y.checkIn));

  // Merge messages (dedup by timestamp+text)
  const messages = [...a.messages];
  for (const m of b.messages) {
    if (!messages.find(x => x.timestamp === m.timestamp && x.text === m.text)) {
      messages.push(m);
    }
  }
  messages.sort((x, y) => x.timestamp.localeCompare(y.timestamp));

  // Merge channels
  const channels = [...new Set([...a.channels, ...b.channels])];

  // Prefer the more specific language (not 'unknown')
  const language = a.language !== 'unknown' ? a.language : b.language;

  return {
    id,
    name: a.name !== 'Guest' && a.name !== 'unknown' ? a.name : (b.name !== 'Guest' ? b.name : a.name),
    email: a.email ?? b.email,
    phone: a.phone ?? b.phone,
    country: a.country ?? b.country,
    language,
    channels,
    reservations,
    messages,
    reviewScore: a.reviewScore ?? b.reviewScore,
    reviewContent: a.reviewContent ?? b.reviewContent,
    summary: a.summary ?? b.summary,
    firstBookedAt: a.firstBookedAt && b.firstBookedAt
      ? (a.firstBookedAt < b.firstBookedAt ? a.firstBookedAt : b.firstBookedAt)
      : a.firstBookedAt ?? b.firstBookedAt,
    lastUpdatedAt: new Date().toISOString(),
  };
}

/**
 * Post-hoc deduplication pass: merges guests that are the same person
 * but ended up with different IDs (phone vs email vs name, or slightly
 * different phone formats).
 *
 * Uses union-find style clustering: iteratively merge any two guests that
 * match on phone (last 8 digits), email, or fuzzy name.
 */
function deduplicateGuests(guestMap: Map<string, CrmGuest>): Map<string, CrmGuest> {
  const guests = [...guestMap.values()];
  const removed = new Set<string>();

  for (let i = 0; i < guests.length; i++) {
    if (removed.has(guests[i].id)) continue;
    for (let j = i + 1; j < guests.length; j++) {
      if (removed.has(guests[j].id)) continue;
      const a = guests[i];
      const b = guests[j];

      const samePhone = phoneMatch(a.phone, b.phone);
      const sameEmail = a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase();
      const sameName = nameMatch(a.name, b.name);

      // Merge if they share phone, email, or (name AND at least one other signal)
      const sharedReservation = a.reservations.some(r => b.reservations.some(br => br.code === r.code));
      if (samePhone || sameEmail || (sameName && (a.country === b.country || sharedReservation))) {
        const merged = mergeGuests(a, b);
        guests[i] = merged;
        removed.add(b.id);
      }
    }
  }

  // Rebuild map with merged guests
  const result = new Map<string, CrmGuest>();
  for (const g of guests) {
    if (!removed.has(g.id)) {
      result.set(g.id, g);
    }
  }
  return result;
}

// ─── Main sync ───────────────────────────────────────────────────────────────

export interface SyncReport {
  success: boolean;
  totalGuests: number;
  newGuests: number;
  reservations: number;
  conversations: number;
  reviews: number;
  errors?: string[];
  at: string;
}

export async function syncAllGuests(): Promise<SyncReport> {
  console.log('[crm-sync] Starting full sync');
  const errors: string[] = [];
  let reservations: FullReservation[] = [];
  let reviews: HostexReview[] = [];
  let conversationCount = 0;

  // Pull 2 years of history + 1 year future
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(start.getFullYear() - 2);
  const end = new Date(today);
  end.setFullYear(end.getFullYear() + 1);
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  // 1. Fetch all reservations
  try {
    reservations = await getFullReservations(startStr, endStr);
    console.log(`[crm-sync] ${reservations.length} reservations`);
  } catch (err) {
    errors.push(`Reservations: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Fetch reviews
  try {
    reviews = await getReviews(startStr, endStr);
    console.log(`[crm-sync] ${reviews.length} reviews`);
  } catch (err) {
    errors.push(`Reviews: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 3. Build guest map from reservations
  const state = await loadCrmState();
  const prevState = state;
  let newState: CrmState = { ...state, guests: { ...state.guests } };
  const guestMap = new Map<string, CrmGuest>();

  // Initialize from existing state
  for (const [id, guest] of Object.entries(newState.guests)) {
    guestMap.set(id, { ...guest, reservations: [], messages: [] });
  }

  // Process reservations
  for (const r of reservations) {
    // Skip cancelled
    if (r.status === 'cancelled' || r.status === 'denied') continue;

    const id = guestId(r.guest_phone, r.guest_email, r.guest_name);
    let guest = guestMap.get(id);

    // Also try to match by phone if the id was email-based but phone exists
    if (!guest && r.guest_phone) {
      for (const [_, g] of guestMap) {
        if (phoneMatch(g.phone, r.guest_phone)) { guest = g; break; }
      }
    }

    if (!guest) {
      guest = {
        id,
        name: r.guest_name || 'Guest',
        email: r.guest_email ?? undefined,
        phone: r.guest_phone ?? undefined,
        language: 'unknown',
        channels: [],
        reservations: [],
        messages: [],
      };
    }

    // Enrich guest data
    if (r.guest_email && !guest.email) guest.email = r.guest_email;
    if (r.guest_phone && !guest.phone) guest.phone = r.guest_phone;

    // Country from guests array
    if (r.guests) {
      const booker = r.guests.find(g => g.is_booker) || r.guests[0];
      if (booker?.country && !guest.country) guest.country = booker.country;
    }

    // Add channel
    const ch = r.channel_type || 'unknown';
    if (!guest.channels.includes(ch)) guest.channels.push(ch);

    // Add reservation
    const res: GuestReservation = {
      code: r.reservation_code,
      property: getPropertyName(r.property_id),
      checkIn: r.check_in_date,
      checkOut: r.check_out_date,
      status: r.status,
      guests: r.number_of_guests ?? r.number_of_adults ?? 1,
      totalRate: r.rates?.total_rate?.amount,
      currency: r.rates?.total_rate?.currency,
      conversationId: r.conversation_id,
      channel: ch,
    };
    // Avoid duplicates
    if (!guest.reservations.find(x => x.code === res.code)) {
      guest.reservations.push(res);
    }

    // Track first booked date
    if (r.booked_at && (!guest.firstBookedAt || r.booked_at < guest.firstBookedAt)) {
      guest.firstBookedAt = r.booked_at;
    }

    guestMap.set(guest.id, guest);
  }

  // 4. Merge review scores
  for (const review of reviews) {
    const res = reservations.find(r => r.reservation_code === review.reservation_code);
    if (!res) continue;
    const id = guestId(res.guest_phone, res.guest_email, res.guest_name);
    const guest = guestMap.get(id);
    if (guest && review.guest_review?.score) {
      guest.reviewScore = review.guest_review.score;
      guest.reviewContent = review.guest_review.content;
    }
  }

  // 5. Pull conversations for guests with conversation IDs (limit to avoid timeout)
  // Only fetch conversations for the last 50 guests to stay within Vercel's 60s limit
  const guestsWithConv = [...guestMap.values()]
    .filter(g => g.reservations.some(r => r.conversationId))
    .sort((a, b) => {
      const aLast = a.reservations[a.reservations.length - 1]?.checkOut ?? '';
      const bLast = b.reservations[b.reservations.length - 1]?.checkOut ?? '';
      return bLast.localeCompare(aLast);
    })
    .slice(0, 50);

  for (const guest of guestsWithConv) {
    for (const res of guest.reservations) {
      if (!res.conversationId) continue;
      try {
        const conv = await getConversation(res.conversationId);
        conversationCount++;
        for (const msg of conv.messages || []) {
          // Avoid duplicates
          const exists = guest.messages.find(m =>
            m.timestamp === msg.created_at && m.text === msg.content
          );
          if (exists) continue;

          const gm: GuestMessage = {
            source: 'hostex',
            direction: msg.sender_role === 'guest' ? 'inbound' : 'outbound',
            text: msg.content || '',
            timestamp: msg.created_at,
          };
          guest.messages.push(gm);
        }
      } catch (err) {
        // Non-critical — continue without conversation data
        console.error(`[crm-sync] Conversation ${res.conversationId} failed:`, err);
      }
    }
  }

  // 6. Merge WAHA contacts (from guest-ops-store)
  try {
    const guestOpsState = await loadGuestOpsState();
    for (const [phone, contact] of Object.entries(guestOpsState.contacts)) {
      const id = guestId(phone);
      let guest = guestMap.get(id);

      // Try to match by phone last-8
      if (!guest) {
        for (const [_, g] of guestMap) {
          if (phoneMatch(g.phone, phone)) { guest = g; break; }
        }
      }

      if (!guest) {
        guest = {
          id,
          name: contact.name,
          phone,
          email: contact.email,
          language: 'unknown',
          channels: ['whatsapp'],
          reservations: [],
          messages: [],
        };
      } else {
        if (!guest.phone) guest.phone = phone;
        if (!guest.email && contact.email) guest.email = contact.email;
        if (!guest.channels.includes('whatsapp')) guest.channels.push('whatsapp');
      }

      guestMap.set(guest.id, guest);
    }
  } catch (err) {
    errors.push(`WAHA contacts: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 7. Detect language for each guest based on their messages and reviews
  for (const guest of guestMap.values()) {
    // Collect all guest-produced text: inbound messages + review content
    const textsForDetection: string[] = [];

    if (guest.messages.length > 0) {
      const inboundTexts = guest.messages
        .filter(m => m.direction === 'inbound')
        .map(m => m.text)
        .filter(Boolean);
      textsForDetection.push(...inboundTexts);
    }

    // Reviews are guest-written text too — strong language signal
    if (guest.reviewContent) {
      textsForDetection.push(guest.reviewContent);
    }

    if (textsForDetection.length > 0) {
      guest.language = detectLanguage(textsForDetection);
    }

    // If still unknown, infer from country
    if (guest.language === 'unknown' && guest.country) {
      const countryLang: Record<string, string> = {
        AR: 'es', MX: 'es', ES: 'es', CL: 'es', UY: 'es', CO: 'es', PE: 'es',
        BR: 'pt', PT: 'pt',
        RU: 'ru', BY: 'ru', KZ: 'ru',
        US: 'en', GB: 'en', AU: 'en', CA: 'en', IE: 'en',
      };
      const lang = countryLang[guest.country];
      if (lang) guest.language = lang as CrmGuest['language'];
    }
    guest.lastUpdatedAt = new Date().toISOString();
  }

  // 8. Deduplicate — merge guests that are the same person but ended up
  //    with different IDs (phone vs email vs name, different phone formats)
  const beforeDedup = guestMap.size;
  const deduped = deduplicateGuests(guestMap);
  const mergedCount = beforeDedup - deduped.size;
  if (mergedCount > 0) {
    console.log(`[crm-sync] Merged ${mergedCount} duplicate guests`);
  }

  // 9. Save
  newState = { ...newState, guests: Object.fromEntries(deduped) };
  newState.lastSyncAt = new Date().toISOString();
  await saveCrmState(newState);

  const newGuests = [...deduped.values()].filter(g =>
    !prevState.guests[g.id]
  ).length;

  return {
    success: errors.length === 0,
    totalGuests: deduped.size,
    newGuests,
    reservations: reservations.length,
    conversations: conversationCount,
    reviews: reviews.length,
    errors: errors.length ? errors : undefined,
    at: new Date().toISOString(),
  };
}
