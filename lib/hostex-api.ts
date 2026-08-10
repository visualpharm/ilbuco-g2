// Centralized Hostex API client for Il Buco autoresponder

const HOSTEX_BASE = 'https://api.hostex.io/v3';

function getApiKey(): string {
  const key = process.env.HOSTEX_API_KEY;
  if (!key) throw new Error('HOSTEX_API_KEY not configured');
  return key;
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Hostex-Access-Token': getApiKey(),
  };
}

// Property ID → suite name mapping
export const PROPERTY_NAMES: Record<string, string> = {
  '12282945': 'Giardino',
  '12282946': 'Terrazzo',
  '12282947': 'Paraiso',
  '12282948': 'Penthouse',
  '12299611': 'Il Buco (Whole House)',
};

export function getPropertyName(propertyId: string | number): string {
  return PROPERTY_NAMES[String(propertyId)] || `Property ${propertyId}`;
}

// Listing IDs for calendar queries
const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse' },
  { channel_type: 'booking_site', listing_id: '113182-13274', name: 'Whole House' },
];

// ─── Price update ─────────────────────────────────────────────────────────────

export interface PriceEntry {
  /** YYYY-MM-DD */
  start_date: string;
  /** YYYY-MM-DD (inclusive) */
  end_date: string;
  /** USD nightly price, rounded to integer */
  price: number;
}

/**
 * Push nightly prices to Hostex for one listing.
 * Endpoint: POST /v3/listings/prices
 * Body: { channel_type, listing_id, prices: [{start_date, end_date, price}] }
 *
 * Hostex merges ranges — safe to send overlapping entries; last write wins per date.
 * Chunk into batches of 90 days max to stay under API payload limits.
 */
export async function updateListingPrices(
  listingId: string,
  prices: PriceEntry[],
  dryRun = false
): Promise<{ updated: number; skipped: number }> {
  if (!prices.length) return { updated: 0, skipped: 0 };
  if (dryRun) {
    console.log(`[pricing dry-run] ${listingId}: would push ${prices.length} price entries`);
    return { updated: 0, skipped: prices.length };
  }

  // Chunk into 90-entry batches
  const CHUNK = 90;
  let updated = 0;
  for (let i = 0; i < prices.length; i += CHUNK) {
    const chunk = prices.slice(i, i + CHUNK);
    const res = await fetch(`${HOSTEX_BASE}/listings/prices`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        channel_type: 'booking_site',
        listing_id: listingId,
        prices: chunk,
      }),
    });
    const data = await res.json();
    if (data.error_code !== 200) {
      throw new Error(`Hostex price update error for ${listingId}: ${data.error_msg}`);
    }
    updated += chunk.length;
  }
  return { updated, skipped: 0 };
}

// ─── Restrictions (min stay) + inventories (open/close dates) ─────────────────

export interface RestrictionEntry {
  start_date: string;
  end_date: string;
  /** Minimum nights for arrivals on these dates */
  min_stay_on_arrival: number;
}

/** Push min-stay restrictions. Endpoint: POST /v3/listings/restrictions */
export async function updateListingRestrictions(
  listingId: string,
  restrictions: RestrictionEntry[],
  dryRun = false
): Promise<{ updated: number; skipped: number }> {
  if (!restrictions.length) return { updated: 0, skipped: 0 };
  if (dryRun) {
    console.log(`[restrictions dry-run] ${listingId}: would push ${restrictions.length} entries`);
    return { updated: 0, skipped: restrictions.length };
  }
  const CHUNK = 90;
  let updated = 0;
  for (let i = 0; i < restrictions.length; i += CHUNK) {
    const chunk = restrictions.slice(i, i + CHUNK);
    const res = await fetch(`${HOSTEX_BASE}/listings/restrictions`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ channel_type: 'booking_site', listing_id: listingId, restrictions: chunk }),
    });
    const data = await res.json();
    if (data.error_code !== 200) {
      throw new Error(`Hostex restrictions error for ${listingId}: ${data.error_msg}`);
    }
    updated += chunk.length;
  }
  return { updated, skipped: 0 };
}

export interface InventoryEntry {
  start_date: string;
  end_date: string;
  /** 0 = closed, 1 = open */
  inventory: 0 | 1;
}

/** Open/close dates. Endpoint: POST /v3/listings/inventories */
export async function updateListingInventories(
  listingId: string,
  inventories: InventoryEntry[],
  dryRun = false
): Promise<{ updated: number; skipped: number }> {
  if (!inventories.length) return { updated: 0, skipped: 0 };
  if (dryRun) {
    console.log(`[inventories dry-run] ${listingId}: would push ${inventories.length} entries`);
    return { updated: 0, skipped: inventories.length };
  }
  const CHUNK = 90;
  let updated = 0;
  for (let i = 0; i < inventories.length; i += CHUNK) {
    const chunk = inventories.slice(i, i + CHUNK);
    const res = await fetch(`${HOSTEX_BASE}/listings/inventories`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ channel_type: 'booking_site', listing_id: listingId, inventories: chunk }),
    });
    const data = await res.json();
    if (data.error_code !== 200) {
      throw new Error(`Hostex inventories error for ${listingId}: ${data.error_msg}`);
    }
    updated += chunk.length;
  }
  return { updated, skipped: 0 };
}

/** Reservation dates per property (for safe re-opening of closed dates). */
export interface ReservationSpan {
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

/**
 * Fetch accepted reservations whose check-in falls within [start, end].
 * Hostex caps each check-in range at 180 days — long ranges are chunked here.
 */
export async function getReservations(start: string, end: string): Promise<ReservationSpan[]> {
  const out: ReservationSpan[] = [];

  const addDaysLocal = (d: string, n: number) => {
    const dt = new Date(d + 'T12:00:00Z');
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().split('T')[0];
  };

  for (let winStart = start; winStart <= end; winStart = addDaysLocal(winStart, 170)) {
    const winEnd = addDaysLocal(winStart, 169) < end ? addDaysLocal(winStart, 169) : end;
    for (let offset = 0; ; offset += 100) {
      const res = await fetch(
        `${HOSTEX_BASE}/reservations?start_check_in_date=${winStart}&end_check_in_date=${winEnd}&offset=${offset}&limit=100`,
        { headers: headers() }
      );
      const data = await res.json();
      if (data.error_code !== 200) {
        throw new Error(`Hostex reservations error: ${data.error_msg}`);
      }
      const page = data.data?.reservations ?? [];
      for (const r of page) {
        if (r.status === 'accepted' && !r.cancelled_at) {
          out.push({
            property_id: r.property_id,
            check_in_date: r.check_in_date,
            check_out_date: r.check_out_date,
            status: r.status,
          });
        }
      }
      if (page.length < 100) break;
    }
  }
  return out;
}

export interface HostexReservation {
  reservation_code: string;
  status: string;
  channel_type: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  property_id: number;
  property_name: string;
  check_in_date: string;
  check_out_date: string;
  check_in_details?: {
    arrival_at?: { hour: number; minute: number };
    departure_at?: { hour: number; minute: number };
  };
}

/**
 * Fetch a single reservation by its code.
 * Used by the guest-ops webhook to get full booking details (guest info, dates).
 */
export async function getReservation(reservationCode: string): Promise<HostexReservation | null> {
  const res = await fetch(
    `${HOSTEX_BASE}/reservations?reservation_code=${encodeURIComponent(reservationCode)}`,
    { headers: headers() }
  );
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex reservation lookup error: ${data.error_msg}`);
  }
  const r = data.data?.reservations?.[0];
  if (!r) return null;
  return {
    reservation_code: r.reservation_code,
    status: r.status,
    channel_type: r.channel_type ?? 'unknown',
    guest_name: r.guest_name || 'Guest',
    guest_email: r.guest_email ?? null,
    guest_phone: r.guest_phone ?? null,
    property_id: r.property_id,
    property_name: getPropertyName(r.property_id),
    check_in_date: r.check_in_date,
    check_out_date: r.check_out_date,
    check_in_details: r.check_in_details,
  };
}

export interface HostexMessage {
  id: string;
  sender_role: 'guest' | 'host';
  display_type: string;
  content: string;
  attachment: unknown;
  created_at: string;
}

export interface HostexConversation {
  id: string;
  channel_type: string;
  guest: { name: string; phone: string; email: string };
  activities: Array<{
    activity_type: string;
    reservation_code: string | null;
    check_in_date: string;
    check_out_date: string;
    property: { id: number; title: string };
  }>;
  messages: HostexMessage[];
}

export async function getConversation(conversationId: string): Promise<HostexConversation> {
  const res = await fetch(`${HOSTEX_BASE}/conversations/${conversationId}`, {
    headers: headers(),
  });
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex API error: ${data.error_msg}`);
  }
  return data.data;
}

export async function sendMessage(conversationId: string, message: string): Promise<void> {
  const res = await fetch(`${HOSTEX_BASE}/conversations/${conversationId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex send error: ${data.error_msg}`);
  }
}

export interface AvailabilityResult {
  rooms: Array<{
    name: string;
    available: boolean;
    price: number | null;
    dates: Array<{ date: string; available: boolean; price: number }>;
  }>;
}

export async function getCalendarAvailability(
  startDate: string,
  endDate: string
): Promise<AvailabilityResult> {
  const res = await fetch(`${HOSTEX_BASE}/listings/calendar`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      listings: LISTINGS.map(l => ({
        channel_type: l.channel_type,
        listing_id: l.listing_id,
      })),
    }),
  });
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex calendar error: ${data.error_msg}`);
  }

  const listings = data.data?.listings || [];
  return {
    rooms: listings.map((listing: { listing_id: string; calendar: Array<{ date: string; inventory: number; price: number }> }) => {
      const info = LISTINGS.find(l => l.listing_id === listing.listing_id);
      const calendar = listing.calendar || [];
      const availableDays = calendar.filter((d: { inventory: number }) => d.inventory === 1);
      return {
        name: info?.name || listing.listing_id,
        available: availableDays.length > 0,
        price: availableDays.length > 0 ? Math.min(...availableDays.map((d: { price: number }) => d.price)) : null,
        dates: calendar.map((d: { date: string; inventory: number; price: number }) => ({
          date: d.date,
          available: d.inventory === 1,
          price: d.price,
        })),
      };
    }),
  };
}

// ─── CRM: Full reservations, conversations list, reviews ─────────────────────

export interface FullReservation {
  reservation_code: string;
  status: string;
  channel_type: string;
  conversation_id?: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests?: number;
  number_of_adults?: number;
  number_of_children?: number;
  guests?: Array<{
    name?: string;
    phone?: string;
    email?: string;
    country?: string;
    is_booker?: boolean;
  }>;
  rates?: { total_rate?: { currency?: string; amount?: number } };
  payment?: { status?: string };
  cancelled_at?: string | null;
  booked_at?: string;
}

/**
 * Fetch ALL reservations with full detail (for CRM).
 * Returns every field Hostex exposes — unlike getReservations() which only
 * returns minimal spans for inventory sync.
 * Chunked in 170-day windows (Hostex caps at 180).
 */
export async function getFullReservations(start: string, end: string): Promise<FullReservation[]> {
  const out: FullReservation[] = [];
  const addDaysLocal = (d: string, n: number) => {
    const dt = new Date(d + 'T12:00:00Z');
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().split('T')[0];
  };

  for (let winStart = start; winStart <= end; winStart = addDaysLocal(winStart, 170)) {
    const winEnd = addDaysLocal(winStart, 169) < end ? addDaysLocal(winStart, 169) : end;
    for (let offset = 0; ; offset += 100) {
      const res = await fetch(
        `${HOSTEX_BASE}/reservations?start_check_in_date=${winStart}&end_check_in_date=${winEnd}&offset=${offset}&limit=100`,
        { headers: headers() }
      );
      const data = await res.json();
      if (data.error_code !== 200) {
        throw new Error(`Hostex reservations error: ${data.error_msg}`);
      }
      const page = data.data?.reservations ?? [];
      for (const r of page) {
        out.push({
          reservation_code: r.reservation_code,
          status: r.status,
          channel_type: r.channel_type ?? 'unknown',
          conversation_id: r.conversation_id,
          guest_name: r.guest_name || 'Guest',
          guest_email: r.guest_email ?? null,
          guest_phone: r.guest_phone ?? null,
          property_id: r.property_id,
          check_in_date: r.check_in_date,
          check_out_date: r.check_out_date,
          number_of_guests: r.number_of_guests,
          number_of_adults: r.number_of_adults,
          number_of_children: r.number_of_children,
          guests: r.guests,
          rates: r.rates,
          payment: r.payment,
          cancelled_at: r.cancelled_at,
          booked_at: r.booked_at,
        });
      }
      if (page.length < 100) break;
    }
  }
  return out;
}

export interface ConversationListItem {
  id: string;
  channel_type: string;
  guest: { name?: string; email?: string; phone?: string };
  last_message_at?: string;
  property_title?: string;
}

/**
 * List ALL conversations (for CRM inbox view).
 * No filters available on the API — pages through everything.
 */
export async function listConversations(): Promise<ConversationListItem[]> {
  const out: ConversationListItem[] = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(
      `${HOSTEX_BASE}/conversations?offset=${offset}&limit=100`,
      { headers: headers() }
    );
    const data = await res.json();
    if (data.error_code !== 200) {
      throw new Error(`Hostex conversations error: ${data.error_msg}`);
    }
    const page = data.data?.conversations ?? [];
    out.push(...page);
    if (page.length < 100) break;
  }
  return out;
}

export interface HostexReview {
  reservation_code: string;
  property_id: number;
  channel_type: string;
  check_in_date: string;
  check_out_date: string;
  guest_review?: { score?: number; content?: string; created_at?: string };
  host_review?: { score?: number; content?: string };
}

/**
 * Fetch reviews (host + guest) for the CRM happiness scoring.
 * Chunked in 170-day windows by checkout date.
 */
export async function getReviews(start: string, end: string): Promise<HostexReview[]> {
  const out: HostexReview[] = [];
  const addDaysLocal = (d: string, n: number) => {
    const dt = new Date(d + 'T12:00:00Z');
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().split('T')[0];
  };

  for (let winStart = start; winStart <= end; winStart = addDaysLocal(winStart, 170)) {
    const winEnd = addDaysLocal(winStart, 169) < end ? addDaysLocal(winStart, 169) : end;
    for (let offset = 0; ; offset += 100) {
      const res = await fetch(
        `${HOSTEX_BASE}/reviews?start_check_out_date=${winStart}&end_check_out_date=${winEnd}&offset=${offset}&limit=100`,
        { headers: headers() }
      );
      const data = await res.json();
      if (data.error_code !== 200) {
        throw new Error(`Hostex reviews error: ${data.error_msg}`);
      }
      const page = data.data?.reviews ?? [];
      out.push(...page);
      if (page.length < 100) break;
    }
  }
  return out;
}

