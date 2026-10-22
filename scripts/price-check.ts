/**
 * price-check — the last stop before a price goes to an Il Buco guest.
 *
 *   scripts/price-check <listing> <check-in> <check-out> [--total N | --nightly N] [--ars] [--guests N] [--json]
 *   scripts/price-check scan [--days 365]      every listing's live Hostex calendar vs the floor
 *   scripts/price-check derive                 floors re-derived from live booking history
 *
 * Quote mode reads the live Hostex calendar and the booking-site quote for the stay,
 * checks every night and the quoted amount (if given) against the hard floor
 * (lib/price-floor.ts), and prints the prices that are safe to send.
 *
 * Exit: 0 = OK to send · 1 = STOP, a price is under the floor · 2 = could not verify (don't send either).
 * Env:  HOSTEX_API_KEY or HOSTEX_API_TOKEN; falls back to the repo's .env.local.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import {
  checkQuote,
  deriveFloors,
  normalizeListing,
  priceFloor,
  stayNights,
  LISTING_NAMES,
  PRICE_FLOORS,
  WHOLE_HOUSE_NAME,
  type ListingName,
  type SoldNight,
} from '../lib/price-floor';

/** Booking-site listing ids (book.ilbuco.com.ar/listing/<id>). */
const SITE_IDS: Record<ListingName, string> = {
  Giardino: '110800', Terrazzo: '110801', Paraiso: '110802', Penthouse: '110803', [WHOLE_HOUSE_NAME]: '113182',
};
const PROPERTY_LISTING: Record<number, ListingName> = {
  12282945: 'Giardino', 12282946: 'Terrazzo', 12282947: 'Paraiso', 12282948: 'Penthouse', 12299611: WHOLE_HOUSE_NAME,
};
const SITE_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

class CannotVerify extends Error {}

function loadKey(): void {
  if (process.env.HOSTEX_API_KEY) return;
  if (process.env.HOSTEX_API_TOKEN) { process.env.HOSTEX_API_KEY = process.env.HOSTEX_API_TOKEN; return; }
  for (const p of [join(__dirname, '..', '.env.local'), join(homedir(), 'projects', 'ilbuco-g2', '.env.local')]) {
    if (!existsSync(p)) continue;
    const m = readFileSync(p, 'utf8').match(/^\s*HOSTEX_API_KEY\s*=\s*["']?([^\r\n"']+)/m);
    if (m) { process.env.HOSTEX_API_KEY = m[1]; return; }
  }
  throw new CannotVerify('HOSTEX_API_KEY not set and not found in .env.local');
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function num(name: string): number | undefined {
  const v = arg(name);
  if (v === undefined) return undefined;
  const n = Number(v.replace(/[\s,_]/g, ''));
  if (!Number.isFinite(n)) throw new CannotVerify(`${name} "${v}" is not a number`);
  return n;
}

const usd = (n: number) => `US$${Math.round(n).toLocaleString('en-US')}`;
const ars = (n: number) => `ARS ${Math.round(n).toLocaleString('es-AR')}`;

interface SiteQuote { usdTotal: number | null; arsTotal: number | null; arsPerUsd: number | null }

/** Booking-site quote (what a guest pays on book.ilbuco.com.ar: nights + cleaning + extra guests). */
async function siteQuote(listing: ListingName, checkIn: string, checkOut: string, guests: number): Promise<SiteQuote> {
  const get = async (currency: string) => {
    const url = `https://book.ilbuco.com.ar/api/guest/listing/${SITE_IDS[listing]}?language=en&target_currency=${currency}` +
      `&check_in=${checkIn}&check_out=${checkOut}&number_of_adult=${guests}&number_of_child=0`;
    const res = await fetch(url, { headers: { 'User-Agent': SITE_UA, Accept: 'application/json' } });
    if (!res.ok) throw new Error(`site quote ${res.status}`);
    const data = (await res.json()).data ?? {};
    const rate = (data.rates ?? [])[0];
    return { total: rate?.total ? rate.total / 100 : null, quote: Number(data.quote) || null };
  };
  try {
    const [u, a] = await Promise.all([get('USD'), get('ARS')]);
    return { usdTotal: u.total, arsTotal: a.total, arsPerUsd: a.quote };
  } catch {
    return { usdTotal: null, arsTotal: null, arsPerUsd: null };
  }
}

async function quoteMode(): Promise<number> {
  const [listingArg, checkIn, checkOut] = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !all[i - 1]?.startsWith('--'));
  if (!listingArg || !/^\d{4}-\d\d-\d\d$/.test(checkIn ?? '') || !/^\d{4}-\d\d-\d\d$/.test(checkOut ?? '')) {
    throw new CannotVerify('usage: price-check <listing> <check-in YYYY-MM-DD> <check-out YYYY-MM-DD> [--total N | --nightly N] [--ars] [--guests N]');
  }
  const listing = normalizeListing(listingArg);
  const guests = num('--guests') ?? 2;
  const currency = process.argv.includes('--ars') || arg('--currency')?.toUpperCase() === 'ARS' ? 'ARS' : 'USD';

  loadKey();
  const { getCalendarAvailability } = await import('../lib/hostex-api');
  const [cal, site] = await Promise.all([
    getCalendarAvailability(checkIn, checkOut).catch(e => { throw new CannotVerify(`Hostex calendar: ${(e as Error).message}`); }),
    siteQuote(listing, checkIn, checkOut, guests),
  ]);
  const room = cal.rooms.find(r => r.name === listing);
  if (!room) throw new CannotVerify(`Hostex calendar has no ${listing}`);
  const nights = stayNights(checkIn, checkOut);
  const byDate = new Map(room.dates.map(d => [d.date, d]));
  const hostexNights = Object.fromEntries(nights.map(d => [d, byDate.get(d)?.price]));
  const unavailable = nights.filter(d => byDate.get(d) && !byDate.get(d)!.available);

  const arsPerUsd = num('--rate') ?? site.arsPerUsd ?? undefined;
  const result = checkQuote({
    listing, checkIn, checkOut, hostexNights,
    total: num('--total'), nightly: num('--nightly'), currency, arsPerUsd,
  });
  // The booking-site total is a guest-facing price too — it must clear the floor
  if (site.usdTotal !== null && site.usdTotal < result.floorTotal) {
    result.errors.push(`booking-site quote ${usd(site.usdTotal)} is below the ${usd(result.floorTotal)} floor`);
    result.ok = false;
  }

  const report = {
    ...result,
    checkIn, checkOut, guests,
    nightly: nights.map(d => ({ date: d, hostex: hostexNights[d] ?? null, floor: priceFloor(listing, d) })),
    unavailable,
    siteQuote: site,
  };
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const head = `${listing} ${checkIn} → ${checkOut} (${result.nights} night${result.nights === 1 ? '' : 's'}, ${guests} guests)`;
    if (result.ok) {
      console.log(`OK ${head}`);
      console.log(`  floor        ${usd(result.floorTotal)}`);
      console.log(`  Hostex       ${result.hostexTotal !== null ? usd(result.hostexTotal) : '—'}  (${nights.map(d => hostexNights[d] ?? '?').join(' + ')} per night)`);
      if (site.usdTotal !== null) {
        console.log(`  site quote   ${usd(site.usdTotal)}${site.arsTotal !== null ? ` / ${ars(site.arsTotal)}` : ''}  (nights + cleaning + extra guests)`);
      } else {
        console.log('  site quote   not bookable online for these dates (min stay, closed or booked)');
      }
      if (result.quotedUsd !== null) console.log(`  your quote   ${usd(result.quotedUsd)}`);
    } else {
      console.log(`STOP ${head} — do not send this price to the guest:`);
      for (const e of result.errors) console.log(`  - ${e}`);
    }
    if (unavailable.length) console.log(`  note: not available on ${unavailable.join(', ')}`);
  }
  return result.ok ? 0 : 1;
}

async function scanMode(): Promise<number> {
  loadKey();
  const { getCalendarAvailability } = await import('../lib/hostex-api');
  const days = num('--days') ?? 365;
  const start = new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
  const problems: string[] = [];
  let checked = 0;
  // Hostex calendar reads cap around 180 days — read in windows
  for (let off = 0; off < days; off += 90) {
    const a = addDaysISO(start, off);
    const b = addDaysISO(start, Math.min(days, off + 90));
    const cal = await getCalendarAvailability(a, addDaysISO(b, -1));
    for (const room of cal.rooms) {
      if (!(LISTING_NAMES as string[]).includes(room.name)) continue;
      for (const d of room.dates) {
        if (d.date < a || d.date >= b) continue;
        checked++;
        const floor = priceFloor(room.name, d.date);
        if (!(d.price >= floor)) problems.push(`${room.name} ${d.date}: $${d.price} < $${floor}`);
      }
    }
  }
  if (problems.length) {
    console.log(`STOP — ${problems.length} of ${checked} Hostex nights under the floor:`);
    for (const p of problems.slice(0, 40)) console.log(`  - ${p}`);
    return 1;
  }
  console.log(`OK — ${checked} Hostex nights (${LISTING_NAMES.length} listings, ${days} days from ${start}) all at or above the floor.`);
  return 0;
}

function addDaysISO(d: string, n: number): string {
  const t = new Date(d + 'T12:00:00Z');
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

async function deriveMode(): Promise<number> {
  loadKey();
  const { getFullReservations } = await import('../lib/hostex-api');
  const res = await getFullReservations('2024-01-01', addDaysISO(new Date().toISOString().slice(0, 10), 540));
  const nights: SoldNight[] = [];
  for (const r of res) {
    const listing = PROPERTY_LISTING[r.property_id];
    const rates = r.rates as { total_rate?: { currency?: string; amount?: number }; details?: Array<{ type: string; amount: number }> } | undefined;
    if (!listing || r.status !== 'accepted' || rates?.total_rate?.currency !== 'USD') continue;
    const acc = (rates.details ?? []).filter(x => x.type === 'ACCOMMODATION').reduce((a, x) => a + x.amount, 0) || rates.total_rate.amount || 0;
    const dates = stayNights(r.check_in_date, r.check_out_date);
    if (!dates.length || !acc) continue;
    const perNight = acc / dates.length;
    if (perNight > 1500) continue; // data-entry outliers
    for (const date of dates) nights.push({ listing, date, price: perNight });
  }
  const derived = deriveFloors(nights);
  console.log(`Derived from ${nights.length} sold nights (accepted USD reservations):`);
  for (const [tier, d] of Object.entries(derived)) {
    const cur = PRICE_FLOORS[tier as keyof typeof PRICE_FLOORS];
    console.log(`  ${tier.padEnd(9)} suites ${d.suites ?? '—'} (in code ${cur.Giardino})   casa ${d.casa ?? '—'} (in code ${cur[WHOLE_HOUSE_NAME]})`);
  }
  return 0;
}

async function main() {
  const mode = process.argv[2];
  try {
    const code = mode === 'scan' ? await scanMode() : mode === 'derive' ? await deriveMode() : await quoteMode();
    process.exit(code);
  } catch (e) {
    console.log(`CANNOT VERIFY — do not send: ${(e as Error).message}`);
    process.exit(2);
  }
}

main();
