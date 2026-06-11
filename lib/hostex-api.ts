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
 * Hostex caps the check-in range at 180 days — caller should keep it under that.
 */
export async function getReservations(start: string, end: string): Promise<ReservationSpan[]> {
  const out: ReservationSpan[] = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(
      `${HOSTEX_BASE}/reservations?start_check_in_date=${start}&end_check_in_date=${end}&offset=${offset}&limit=100`,
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
  return out;
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
