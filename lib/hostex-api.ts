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
  '12282949': 'Recharge Retreat',
  '12299611': 'Il Buco (Whole House)',
};

export function getPropertyName(propertyId: string | number): string {
  return PROPERTY_NAMES[String(propertyId)] || `Property ${propertyId}`;
}

/**
 * Classify a property into a group for filtering:
 *   - "ilbuco" — the 4 suites + whole house
 *   - "recharge" — Recharge Retreat (the rancho)
 */
export const ILBUCO_PROPERTY_IDS = ['12282945', '12282946', '12282947', '12282948', '12299611'];
export const RECHARGE_PROPERTY_IDS = ['12282949'];

export function getPropertyGroup(propertyName: string): 'ilbuco' | 'recharge' | 'other' {
  if (propertyName === 'Recharge Retreat') return 'recharge';
  if (ILBUCO_PROPERTY_IDS.some(id => PROPERTY_NAMES[id] === propertyName)) return 'ilbuco';
  return 'other';
}

// Listing IDs for calendar queries
export const LISTINGS = [
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

// ─── Direct-booking reservation creation ──────────────────────────────────────

/**
 * Stable Hostex IDs for direct bookings on ilbuco.com.ar.
 * Fetched once from GET /v3/custom_channels and GET /v3/income_methods.
 *
 *  - custom_channel_id 29 = "Booking Site" (the booking_site channel_type used
 *    by all our listings; this is how Hostex tags direct-booking reservations).
 *  - income_method_id 198 = "Other" (no Mercado Pago option exists in Hostex;
 *    payments arrive via MP but are recorded generically).
 *  - 34 = "Stripe", 35 = "Paypal", 195 = "Debit Card", 196 = "Credit Card",
 *    197 = "Cash" — available if we want finer payment-method tracking later.
 */
export const DIRECT_BOOKING_CHANNEL_ID = 29;
export const DIRECT_BOOKING_INCOME_METHOD_ID = 198;

/** Suite slug → Hostex property_id (for direct-booking creation). */
export const SUITE_PROPERTY_IDS: Record<string, number> = {
  giardino: 12282945,
  terrazzo: 12282946,
  paraiso: 12282947,
  penthouse: 12282948,
  'whole-house': 12299611,
};

export const PROPERTY_ID_BY_LISTING: Record<string, number> = {
  '110800-13274': 12282945, // Giardino
  '110801-13274': 12282946, // Terrazzo
  '110802-13274': 12282947, // Paraiso
  '110803-13274': 12282948, // Penthouse
  '113182-13274': 12299611, // Whole House
};

export interface CreateReservationParams {
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  guest_name: string;
  /** Total rate in the reservation currency (integer). */
  rate_amount: number;
  /** Commission — 0 for direct bookings. */
  commission_amount?: number;
  /** Amount already collected (full rate for pay-first flow). */
  received_amount: number;
  currency?: string;
  income_method_id?: number;
  custom_channel_id?: number;
  number_of_guests?: number;
  email?: string;
  mobile?: string;
  remarks?: string;
}

export interface CreatedReservation {
  reservation_code: string;
  status: string;
}

/**
 * Create a direct-booking reservation in Hostex.
 * Endpoint: POST /v3/reservations
 *
 * Pay-first flow: only called after Mercado Pago confirms payment, so
 * received_amount always equals rate_amount. The reservation_created webhook
 * then fires guest-ops automation (PIN, locks, messages) automatically.
 */
export async function createReservation(
  params: CreateReservationParams
): Promise<CreatedReservation> {
  const body = {
    property_id: params.property_id,
    custom_channel_id: params.custom_channel_id ?? DIRECT_BOOKING_CHANNEL_ID,
    check_in_date: params.check_in_date,
    check_out_date: params.check_out_date,
    guest_name: params.guest_name,
    currency: params.currency ?? 'USD',
    rate_amount: params.rate_amount,
    commission_amount: params.commission_amount ?? 0,
    received_amount: params.received_amount,
    income_method_id: params.income_method_id ?? DIRECT_BOOKING_INCOME_METHOD_ID,
    ...(params.number_of_guests && { number_of_guests: params.number_of_guests }),
    ...(params.email && { email: params.email }),
    ...(params.mobile && { mobile: params.mobile }),
    ...(params.remarks && { remarks: params.remarks }),
  };

  const res = await fetch(`${HOSTEX_BASE}/reservations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex create-reservation error: ${data.error_msg}`);
  }

  const r = data.data?.reservation ?? data.data;
  return {
    reservation_code: r.reservation_code ?? r.code,
    status: r.status ?? 'accepted',
  };
}

/**
 * Cancel a direct-booking reservation.
 * Endpoint: DELETE /v3/reservations/{reservation_code}
 *
 * Only works for direct bookings (not OTA channel bookings).
 * Used for manual cancellations from /nimda — not for the booking flow itself.
 */
export async function cancelReservation(reservationCode: string): Promise<void> {
  const res = await fetch(
    `${HOSTEX_BASE}/reservations/${encodeURIComponent(reservationCode)}`,
    { method: 'DELETE', headers: headers() }
  );
  const data = await res.json();
  if (data.error_code !== 200) {
    throw new Error(`Hostex cancel-reservation error: ${data.error_msg}`);
  }
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

// ─── Safety sync: strict availability helpers (inventory protection) ──────────
//
// These back lib/inventory-sync.ts (the close-only protection sync). They are
// deliberately STRICTER than the legacy helpers above: every response is
// validated for HTTP status, error_code and payload completeness, and a
// partial/malformed read THROWS instead of degrading to an empty result — a
// silently-empty read would make the sync believe nothing needs closing, which
// is the exact failure mode the protection sync exists to prevent.

/** Raw Hostex v3 envelope shared by all endpoints. */
interface HostexEnvelope {
  request_id?: string;
  error_code?: number;
  error_msg?: string;
}

async function strictRequest<T>(
  label: string,
  url: string,
  init: RequestInit,
  validate: (body: HostexEnvelope) => T
): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(45000), cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Hostex ${label}: HTTP ${res.status} ${res.statusText}`);
  }
  let body: HostexEnvelope;
  try {
    body = (await res.json()) as HostexEnvelope;
  } catch {
    throw new Error(`Hostex ${label}: response is not JSON`);
  }
  if (body.error_code !== 200) {
    throw new Error(`Hostex ${label}: error_code ${body.error_code} (${body.error_msg ?? 'no message'})`);
  }
  return validate(body);
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function assertIsoDate(label: string, d: unknown): asserts d is string {
  if (typeof d !== 'string' || !ISO_DATE_RE.test(d) || !Number.isFinite(Date.parse(d + 'T00:00:00Z')) || new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) !== d) {
    throw new Error(`Hostex ${label}: malformed date ${JSON.stringify(d)}`);
  }
}

/** Validated reservation span (safety-sync scope only). */
export interface StrictReservationSpan {
  reservation_code: string;
  stay_code: string;
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  cancelled_at: string | null;
}

/**
 * Fetch ALL accepted reservations whose stay overlaps the night window
 * [startNight, endNight] — checkout-exclusive: a stay overlaps iff
 * check_in <= endNight && check_out > startNight.
 *
 * Unlike getReservations() (check-in window keyed, 35-day pad upstream), this
 * reads all pages without date filters, then filters overlaps locally.
 * Live Hostex rejects unpaired start_check_out_date / end_check_in_date filters;
 * paired check-in windows would still miss long stays already in progress.
 * Pagination is bounded with duplicate/non-progress guards that throw: a
 * looping or silently-truncated page sequence must fail loudly, never look
 * like "no overlapping reservations".
 */
export async function getOverlappingReservations(
  startNight: string,
  endNight: string
): Promise<StrictReservationSpan[]> {
  const out: StrictReservationSpan[] = [];
  const seen = new Set<string>();
  const MAX_PAGES = 50; // 5,000 stays — far beyond anything real for 5 properties

  let offset = 0;
  for (let page = 0; ; page++) {
    if (page >= MAX_PAGES) {
      throw new Error(`Hostex reservations(overlap): exceeded ${MAX_PAGES} pages — refusing to guess`);
    }
    const url =
      `${HOSTEX_BASE}/reservations?offset=${offset}&limit=100`;
    const spans = await strictRequest('reservations(overlap)', url, { headers: headers() }, body => {
      const rows = (body as { data?: { reservations?: unknown } }).data?.reservations;
      if (!Array.isArray(rows)) {
        throw new Error('Hostex reservations(overlap): success envelope missing data.reservations');
      }
      return rows.map(raw => {
        const r = raw as Record<string, unknown>;
        if (
          typeof r.reservation_code !== 'string' || !r.reservation_code ||
          typeof r.stay_code !== 'string' || !r.stay_code ||
          typeof r.property_id !== 'number' ||
          typeof r.status !== 'string'
        ) {
          throw new Error('Hostex reservations(overlap): malformed reservation row');
        }
        assertIsoDate('reservations(overlap).check_in_date', r.check_in_date);
        assertIsoDate('reservations(overlap).check_out_date', r.check_out_date);
        if (r.check_out_date <= r.check_in_date) throw new Error('Hostex invalid stay interval');
        return {
          reservation_code: r.reservation_code,
          stay_code: r.stay_code,
          property_id: r.property_id,
          check_in_date: r.check_in_date,
          check_out_date: r.check_out_date,
          status: r.status,
          cancelled_at: typeof r.cancelled_at === 'string' ? r.cancelled_at : null,
        } satisfies StrictReservationSpan;
      });
    });

    let newRows = 0;
    for (const span of spans) {
      if (seen.has(span.stay_code)) throw new Error('Hostex reservations(overlap): duplicate stay; snapshot not progressing safely');
      seen.add(span.stay_code);
      out.push(span);
      newRows++;
    }
    if (spans.length < 100) break;
    if (newRows === 0) {
      throw new Error(`Hostex reservations(overlap): pagination not progressing at offset ${offset} (full page of duplicates)`);
    }
    offset += spans.length;
  }

  // Server-side filters are not trusted for correctness — re-apply the exact
  // overlap + liveness semantics client-side.
  return out.filter(
    r =>
      r.status === 'accepted' &&
      !r.cancelled_at &&
      r.property_id !== 0 &&
      r.check_in_date <= endNight &&
      r.check_out_date > startNight
  );
}

/**
 * Close (never open) property-level availability. Endpoint: POST /v3/availabilities
 *
 * Property-level closures cascade to every channel listing mapped to the
 * property (Airbnb, Booking.com, booking_site, …) — unlike listing-inventory
 * writes, which touch one channel and get overwritten again by property
 * availability. `available` is typed `false`: this helper CANNOT reopen a date.
 *
 * A 200 only queues an asynchronous task — acceptance is not success. Verify
 * with getPropertyAvailabilities() / getListingInventories().
 */
export async function closePropertyAvailabilities(
  propertyIds: number[],
  dates: string[],
  dryRun = false
): Promise<{ submitted: number; skipped: number }> {
  if (!dates.length) return { submitted: 0, skipped: 0 };
  if (dryRun) {
    console.log(`[availabilities dry-run] properties ${propertyIds.join(',')}: would close ${dates.length} dates`);
    return { submitted: 0, skipped: dates.length };
  }
  const available: false = false;
  const CHUNK = 100;
  let submitted = 0;
  for (let i = 0; i < dates.length; i += CHUNK) {
    const chunk = dates.slice(i, i + CHUNK);
    // Per docs the 200 response is the bare CommonResponse envelope (no data).
    await strictRequest('availabilities(update)', `${HOSTEX_BASE}/availabilities`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ property_ids: propertyIds, dates: chunk, available }),
    }, () => true);
    submitted += chunk.length;
  }
  return { submitted, skipped: 0 };
}

/** Property-level availability readback: property_id → (date → available). */
export async function getPropertyAvailabilities(
  propertyIds: number[],
  startDate: string,
  endDate: string
): Promise<Map<number, Map<string, boolean>>> {
  const url =
    `${HOSTEX_BASE}/availabilities?property_ids=${propertyIds.join(',')}` +
    `&start_date=${startDate}&end_date=${endDate}`;
  return strictRequest('availabilities(query)', url, { headers: headers() }, body => {
    const props = (body as { data?: { properties?: unknown } }).data?.properties;
    if (!Array.isArray(props)) {
      throw new Error('Hostex availabilities(query): success envelope missing data.properties');
    }
    const out = new Map<number, Map<string, boolean>>();
    for (const p of props as Array<Record<string, unknown>>) {
      if (typeof p.id !== 'number' || !Array.isArray(p.availabilities)) {
        throw new Error('Hostex availabilities(query): malformed property entry');
      }
      if (!propertyIds.includes(p.id) || out.has(p.id)) throw new Error('Hostex duplicate or unexpected property availability');
      const byDate = new Map<string, boolean>();
      for (const a of p.availabilities as Array<Record<string, unknown>>) {
        assertIsoDate('availabilities(query).date', a.date);
        if (typeof a.available !== 'boolean') {
          throw new Error('Hostex availabilities(query): malformed availability entry');
        }
        if (byDate.has(a.date)) throw new Error('Hostex duplicate availability date');
        byDate.set(a.date, a.available);
      }
      out.set(p.id, byDate);
    }
    for (const id of propertyIds) {
      if (!out.has(id)) {
        throw new Error(`Hostex availabilities(query): requested property ${id} missing from response`);
      }
    }
    return out;
  });
}

/** Listing-level inventory readback: `${channel_type}:${listing_id}` → (date → inventory). */
export async function getListingInventories(
  listings: Array<{ channel_type: string; listing_id: string }>,
  startDate: string,
  endDate: string
): Promise<Map<string, Map<string, number>>> {
  return strictRequest('listings(calendar)', `${HOSTEX_BASE}/listings/calendar`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ start_date: startDate, end_date: endDate, listings }),
  }, body => {
    const rows = (body as { data?: { listings?: unknown } }).data?.listings;
    if (!Array.isArray(rows)) {
      throw new Error('Hostex listings(calendar): success envelope missing data.listings');
    }
    const out = new Map<string, Map<string, number>>();
    for (const l of rows as Array<Record<string, unknown>>) {
      if (typeof l.listing_id !== 'string' || typeof l.channel_type !== 'string' || !Array.isArray(l.calendar)) {
        throw new Error('Hostex listings(calendar): malformed listing entry');
      }
      if (out.has(`${l.channel_type}:${l.listing_id}`) || !listings.some(w => w.channel_type === l.channel_type && w.listing_id === l.listing_id)) throw new Error('Hostex duplicate or unexpected listing');
      const byDate = new Map<string, number>();
      for (const day of l.calendar as Array<Record<string, unknown>>) {
        assertIsoDate('listings(calendar).date', day.date);
        if (typeof day.inventory !== 'number' || !Number.isInteger(day.inventory) || day.inventory < 0) {
          throw new Error('Hostex listings(calendar): malformed calendar entry');
        }
        if (byDate.has(day.date)) throw new Error('Hostex duplicate calendar date');
        byDate.set(day.date, day.inventory);
      }
      out.set(`${l.channel_type}:${l.listing_id}`, byDate);
    }
    for (const l of listings) {
      if (!out.has(`${l.channel_type}:${l.listing_id}`)) {
        throw new Error(`Hostex listings(calendar): requested listing ${l.listing_id} missing from response`);
      }
    }
    return out;
  });
}


/** Live property mapping: verify all connected rate plans, not just direct booking. */
export async function getProtectionListings(propertyIds: number[]): Promise<Map<number, Array<{channel_type: string; listing_id: string}>>> {
  return strictRequest('properties', `${HOSTEX_BASE}/properties`, { headers: headers() }, body => {
    const rows = (body as {data?: {properties?: unknown}}).data?.properties;
    if (!Array.isArray(rows)) throw new Error('Hostex missing property mappings');
    const out = new Map<number, Array<{channel_type: string; listing_id: string}>>();
    const owners = new Set<string>();
    for (const r of rows) {
      if (!propertyIds.includes(r.id)) continue;
      if (out.has(r.id) || !Array.isArray(r.channels)) throw new Error('Hostex invalid property mapping');
      const channels = r.channels.map((c: {channel_type: unknown; listing_id: unknown}) => {
        if (typeof c.channel_type !== 'string' || typeof c.listing_id !== 'string') throw new Error('Hostex invalid channel mapping');
        const key = `${c.channel_type}:${c.listing_id}`;
        if (owners.has(key)) throw new Error('Hostex duplicate listing ownership');
        owners.add(key);
        return {channel_type: c.channel_type, listing_id: c.listing_id};
      });
      for (const c of ['airbnb', 'booking.com', 'booking_site']) {
        if (!channels.some((l: {channel_type: string}) => l.channel_type === c)) throw new Error(`Hostex ${r.id} missing ${c} mapping`);
      }
      out.set(r.id, channels);
    }
    if (out.size !== propertyIds.length) throw new Error('Hostex incomplete property mappings');
    return out;
  });
}
