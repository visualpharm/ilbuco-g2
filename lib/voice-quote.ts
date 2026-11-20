/**
 * Phone quotes for the Il Buco voice agent (app/api/vapi/server, tool check_availability).
 *
 * One answer, said the way a person says it: free or not, what exactly (the whole house or
 * which suites), the price per night and the total — the same money the booking site
 * (book.ilbuco.com.ar) charges, in dollars and pesos.
 *
 * Sources: the Hostex booking_site calendar (open nights, price, min stay, closed on
 * arrival/departure; nights under the hard floor are not for sale) and the booking-site
 * quote API for the exact totals (fees, extra guests, the site's ARS rate). A stay is
 * offered only when both say it is bookable.
 *
 * New Year rule (Ivan, 2026-11-16): the whole house is never sold for a single night around
 * New Year — a whole-house stay touching the nights 30.12–02.01 must take the whole free
 * block of those nights. The rule lives here, not only in the prompt.
 */
import { hostexFetch, HOSTEX_USER_AGENT } from './hostex-api';
import { guestNightPrice, stayNights } from './price-floor';
import { dineroEnPalabras, fechaHablada, nochesHabladas, numeroEnPalabras, rangoHablado } from './spoken-es';

export type UnitKey = 'casa' | 'giardino' | 'terrazzo' | 'paraiso' | 'penthouse';

export interface UnitInfo {
  key: UnitKey;
  /** Name in lib/price-floor.ts and lib/hostex-api.ts */
  listing: 'Whole House' | 'Giardino' | 'Terrazzo' | 'Paraiso' | 'Penthouse';
  spoken: string;
  listingId: string;
  siteId: string;
  propertyId: number;
  maxGuests: number;
}

export const UNITS: UnitInfo[] = [
  { key: 'casa', listing: 'Whole House', spoken: 'la casa entera', listingId: '113182-13274', siteId: '113182', propertyId: 12299611, maxGuests: 16 },
  { key: 'giardino', listing: 'Giardino', spoken: 'Giardino', listingId: '110800-13274', siteId: '110800', propertyId: 12282945, maxGuests: 4 },
  { key: 'terrazzo', listing: 'Terrazzo', spoken: 'Terrazzo', listingId: '110801-13274', siteId: '110801', propertyId: 12282946, maxGuests: 4 },
  { key: 'paraiso', listing: 'Paraiso', spoken: 'Paraíso', listingId: '110802-13274', siteId: '110802', propertyId: 12282947, maxGuests: 4 },
  { key: 'penthouse', listing: 'Penthouse', spoken: 'Penthouse', listingId: '110803-13274', siteId: '110803', propertyId: 12282948, maxGuests: 4 },
];
export const CASA = UNITS[0];
export const SUITE_UNITS = UNITS.slice(1);
export const unitByKey = (k: string): UnitInfo | undefined => UNITS.find(u => u.key === k);

export interface NightCell { open: boolean; usd: number | null; minStay: number; cta: boolean; ctd: boolean }
/** unit key → date → night */
export type VoiceCalendar = Record<UnitKey, Map<string, NightCell>>;

export interface StayRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
  /** 'casa' | 'suite' | a suite key | 'any' */
  unit: string;
}

export interface Offer {
  /** `${unit}:${checkIn}:${checkOut}:${guests}` — hold_booking re-quotes it from scratch */
  id: string;
  unit: UnitInfo;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  usdTotal: number;
  arsTotal: number;
  /** Night price in USD; null when the nights differ (then the average is said) */
  usdNight: number | null;
  usdNightAvg: number;
  /** Cleaning fee and the like: the site total minus the night prices (0 for the whole house) */
  usdFees?: number;
}

export interface VoiceQuote {
  ok: boolean;
  /** What the agent says, one or two sentences */
  say: string;
  offers: Offer[];
  /** For the model only, never read out: a fixed rule it must hold when the caller pushes back */
  note?: string;
}

// ─── dates ──────────────────────────────────────────────────────────────────

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function todayArt(now = Date.now()): string {
  return new Date(now - 3 * 3600_000).toISOString().slice(0, 10);
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

// ─── the New Year block ─────────────────────────────────────────────────────

/** The New Year nights: 30.12, 31.12, 01.01, 02.01 (check-out 03.01). */
export function newYearNights(yearOfDec: number): string[] {
  return [`${yearOfDec}-12-30`, `${yearOfDec}-12-31`, `${yearOfDec + 1}-01-01`, `${yearOfDec + 1}-01-02`];
}

function nyYearFor(night: string): number | null {
  const [y, m, d] = night.split('-').map(Number);
  if (m === 12 && d >= 30) return y;
  if (m === 1 && d <= 2) return y - 1;
  return null;
}

/**
 * Whole-house New Year rule. null = the stay is fine as asked. Otherwise the stay the house
 * can be sold for: the asked stay stretched over the free run of New Year nights it touches.
 */
export function newYearBlock(cal: VoiceCalendar, checkIn: string, checkOut: string): { checkIn: string; checkOut: string } | null {
  const nights = stayNights(checkIn, checkOut);
  const touched = nights.find(n => nyYearFor(n) !== null);
  if (!touched) return null;
  const ny = newYearNights(nyYearFor(touched)!);
  const open = (d: string) => cal.casa.get(d)?.open === true;
  // the free run of New Year nights that contains the asked New Year nights
  const asked = ny.filter(n => nights.includes(n));
  let lo = ny.indexOf(asked[0]), hi = ny.indexOf(asked[asked.length - 1]);
  while (lo > 0 && open(ny[lo - 1])) lo--;
  while (hi < ny.length - 1 && open(ny[hi + 1])) hi++;
  const blockIn = ny[lo] < checkIn ? ny[lo] : checkIn;
  const blockOut = addDays(ny[hi], 1) > checkOut ? addDays(ny[hi], 1) : checkOut;
  if (blockIn === checkIn && blockOut === checkOut) return null;
  return { checkIn: blockIn, checkOut: blockOut };
}

// ─── availability (pure) ────────────────────────────────────────────────────

/** Why a unit cannot be sold for the stay, or '' when Hostex says it can. */
export function stayBlocker(cal: VoiceCalendar, unit: UnitInfo, checkIn: string, checkOut: string, guests: number): string {
  if (guests > unit.maxGuests) return 'capacity';
  const nights = stayNights(checkIn, checkOut);
  const days = cal[unit.key];
  if (nights.some(n => days.get(n)?.open !== true)) return 'taken';
  if (unit.key === 'casa' && newYearBlock(cal, checkIn, checkOut)) return 'new_year_block';
  const first = days.get(checkIn)!;
  if (first.cta) return 'closed_arrival';
  if (days.get(checkOut)?.ctd) return 'closed_departure';
  if (nights.length < first.minStay) return `min_stay:${first.minStay}`;
  return '';
}

/** The caller wants the whole house: asked for it, or too many people for one suite. */
export function wantsCasa(req: StayRequest): boolean {
  const u = req.unit.toLowerCase();
  return u === 'casa' || (!unitByKey(u) && u !== 'suite' && req.guests > 4);
}

/** Units to look at for a request, the most fitting first (suites stay as the fallback for the house). */
export function candidateUnits(req: StayRequest): UnitInfo[] {
  const u = req.unit.toLowerCase();
  const one = unitByKey(u);
  if (one && u !== 'casa') return [one];
  if (u === 'suite') return SUITE_UNITS;
  return wantsCasa(req) ? [CASA, ...SUITE_UNITS] : [...SUITE_UNITS, CASA];
}

/** Nearest stays of the same length that Hostex can sell, at most `limit`, never before today. */
export function nearestStays(cal: VoiceCalendar, unit: UnitInfo, req: StayRequest, today: string, limit = 2): Array<{ checkIn: string; checkOut: string }> {
  const n = stayNights(req.checkIn, req.checkOut).length;
  const out: Array<{ checkIn: string; checkOut: string }> = [];
  for (let step = 1; step <= 21 && out.length < limit; step++) {
    for (const shift of [step, -step]) {
      const ci = addDays(req.checkIn, shift), co = addDays(ci, n);
      if (ci < today || !cal[unit.key].has(ci) || !cal[unit.key].has(addDays(co, -1))) continue;
      if (!stayBlocker(cal, unit, ci, co, req.guests) && out.length < limit) out.push({ checkIn: ci, checkOut: co });
    }
  }
  return out.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

// ─── speech ─────────────────────────────────────────────────────────────────

/** ARS said rounded to the thousand — the exact peso amount comes with the hold. */
export function pesosRedondo(ars: number): string {
  return dineroEnPalabras(Math.round(ars / 1000) * 1000, 'ARS');
}

/** "quinientos cincuenta y dos dólares la noche, mil ciento cuatro en total por dos noches[, en pesos …]" */
export function offerSentence(o: Offer, withName = true, withPesos = true): string {
  const night = o.usdNight !== null
    ? `${dineroEnPalabras(o.usdNight, 'USD')} la noche`
    : `${dineroEnPalabras(o.usdNightAvg, 'USD')} la noche en promedio`;
  const fees = (o.usdFees ?? 0) >= 1;
  const total = o.nights === 1
    ? (fees ? `, ${dineroEnPalabras(o.usdTotal, 'USD')} en total con la limpieza` : '')
    : `, ${dineroEnPalabras(o.usdTotal, 'USD')} en total por ${nochesHabladas(o.nights)}${fees ? ' con la limpieza' : ''}`;
  const pesos = withPesos ? `, o sea ${pesosRedondo(o.arsTotal)}` : '';
  return `${withName ? `${o.unit.spoken}, ` : ''}${night}${total}${pesos}`;
}

function listNames(names: string[]): string {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The machine part of the tool answer: offer ids the model passes to hold_booking. */
export function offersForModel(offers: Offer[]): string {
  return offers.map(o => `${o.id} = ${o.unit.spoken} ${o.checkIn}→${o.checkOut}, ${o.guests} personas, ` +
    `USD ${Math.round(o.usdTotal)} total, ARS ${Math.round(o.arsTotal)}`).join('; ');
}

// ─── IO ─────────────────────────────────────────────────────────────────────

interface RawCell { date: string; price: number; inventory: number; restrictions?: { min_stay_on_arrival?: number | null; closed_on_arrival?: boolean | null; closed_on_departure?: boolean | null } }

/** Hostex booking_site calendar for the 5 units; nights under the floor are not open. */
export async function fetchVoiceCalendar(start: string, end: string): Promise<VoiceCalendar> {
  const res = await hostexFetch('https://api.hostex.io/v3/listings/calendar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Hostex-Access-Token': process.env.HOSTEX_API_KEY ?? '',
      'User-Agent': HOSTEX_USER_AGENT,
    },
    body: JSON.stringify({
      start_date: start,
      end_date: end,
      listings: UNITS.map(u => ({ channel_type: 'booking_site', listing_id: u.listingId })),
    }),
  });
  const data = await res.json();
  if (data.error_code !== 200) throw new Error(`Hostex calendar error: ${data.error_msg}`);
  return calendarFromHostex(data.data?.listings ?? []);
}

export function calendarFromHostex(listings: Array<{ listing_id: string; calendar: RawCell[] }>): VoiceCalendar {
  const cal = Object.fromEntries(UNITS.map(u => [u.key, new Map<string, NightCell>()])) as VoiceCalendar;
  for (const l of listings) {
    const unit = UNITS.find(u => u.listingId === l.listing_id);
    if (!unit) continue;
    for (const c of l.calendar ?? []) {
      const usd = guestNightPrice(unit.listing, c.date, c.price);
      cal[unit.key].set(c.date, {
        open: c.inventory === 1 && usd !== null,
        usd,
        minStay: Math.max(1, Number(c.restrictions?.min_stay_on_arrival) || 1),
        cta: c.restrictions?.closed_on_arrival === true,
        ctd: c.restrictions?.closed_on_departure === true,
      });
    }
  }
  return cal;
}

const SITE_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export interface SiteQuote { bookable: boolean; usdTotal: number | null; arsTotal: number | null; arsPerUsd: number | null }

/** The booking site's own total for the stay, in USD and ARS (what a guest pays on book.ilbuco.com.ar). */
export async function siteQuote(unit: UnitInfo, checkIn: string, checkOut: string, guests: number, fetchImpl: typeof fetch = fetch): Promise<SiteQuote> {
  const get = async (currency: 'USD' | 'ARS') => {
    const url = `https://book.ilbuco.com.ar/api/guest/listing/${unit.siteId}?language=en&target_currency=${currency}` +
      `&check_in=${checkIn}&check_out=${checkOut}&number_of_adult=${guests}&number_of_child=0`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetchImpl(url, { headers: { 'User-Agent': SITE_UA, Accept: 'application/json' }, signal: ctrl.signal });
      const body = res.ok ? await res.json() : null;
      const rate = (body?.data?.rates ?? [])[0];
      return {
        bookable: rate?.status === 1 && Number(rate?.total) > 0,
        total: rate?.total ? Number(rate.total) / 100 : null,
        quote: Number(body?.data?.quote) || null,
      };
    } finally {
      clearTimeout(timer);
    }
  };
  const [u, a] = await Promise.all([get('USD'), get('ARS')]);
  const rate = a.quote;
  const consistent = Boolean(u.total && a.total && rate && rate > 300 && rate < 20000 && Math.abs(a.total / u.total / rate - 1) < 0.03);
  return { bookable: u.bookable && a.bookable && consistent, usdTotal: u.total, arsTotal: a.total, arsPerUsd: rate };
}

export function makeOffer(unit: UnitInfo, cal: VoiceCalendar, checkIn: string, checkOut: string, guests: number, q: SiteQuote): Offer | null {
  if (!q.bookable || q.usdTotal === null || q.arsTotal === null) return null;
  const nights = stayNights(checkIn, checkOut);
  const prices = nights.map(n => cal[unit.key].get(n)?.usd ?? 0);
  const floorOk = prices.every(p => p > 0) && q.usdTotal >= prices.reduce((s, p) => s + p, 0) - 0.5;
  if (!floorOk) return null;
  const same = prices.every(p => p === prices[0]);
  return {
    id: `${unit.key}:${checkIn}:${checkOut}:${guests}`,
    unit, checkIn, checkOut, guests,
    nights: nights.length,
    usdTotal: q.usdTotal,
    arsTotal: q.arsTotal,
    usdNight: same ? prices[0] : null,
    usdNightAvg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
    usdFees: Math.round(q.usdTotal - prices.reduce((s, p) => s + p, 0)),
  };
}

export function parseOfferId(id: string): StayRequest | null {
  const m = /^(casa|giardino|terrazzo|paraiso|penthouse):(\d{4}-\d{2}-\d{2}):(\d{4}-\d{2}-\d{2}):(\d{1,2})$/.exec(String(id || '').trim());
  if (!m) return null;
  return { unit: m[1], checkIn: m[2], checkOut: m[3], guests: Number(m[4]) };
}

export interface QuoteDeps {
  calendar?: (start: string, end: string) => Promise<VoiceCalendar>;
  quote?: (unit: UnitInfo, checkIn: string, checkOut: string, guests: number) => Promise<SiteQuote>;
  now?: number;
}

/** Validation shared with hold_booking: '' when the request is a usable stay. */
export function requestProblem(req: StayRequest, today: string): string {
  if (!ISO_RE.test(req.checkIn) || !ISO_RE.test(req.checkOut)) return 'Necesito la fecha de entrada y la de salida.';
  if (req.checkIn < today) return 'Esa fecha de entrada ya pasó, decime otra.';
  if (req.checkOut <= req.checkIn) return 'La salida tiene que ser después de la entrada.';
  if (stayNights(req.checkIn, req.checkOut).length > 30) return 'Por teléfono tomo estadías de hasta treinta noches.';
  if (!Number.isInteger(req.guests) || req.guests < 1) return '¿Para cuántas personas sería?';
  if (req.guests > 16) return 'La casa entera es para hasta dieciséis personas.';
  return '';
}

/** check_availability: free or not, what exactly, price per night and total. */
export async function voiceQuote(req: StayRequest, deps: QuoteDeps = {}): Promise<VoiceQuote> {
  const today = todayArt(deps.now);
  const problem = requestProblem(req, today);
  if (problem) return { ok: false, say: problem, offers: [] };
  const getCal = deps.calendar ?? fetchVoiceCalendar;
  const getQuote = deps.quote ?? ((u, ci, co, g) => siteQuote(u, ci, co, g));
  const safeQuote = (u: UnitInfo, ci: string, co: string): Promise<SiteQuote> =>
    getQuote(u, ci, co, req.guests).catch(() => ({ bookable: false, usdTotal: null, arsTotal: null, arsPerUsd: null }));

  const winStart = addDays(req.checkIn, -21) < today ? today : addDays(req.checkIn, -21);
  const cal = await getCal(winStart, addDays(req.checkOut, 21));
  const units = candidateUnits(req);
  const casaAsked = wantsCasa(req);
  const asked = rangoHablado(req.checkIn, req.checkOut);
  const who = `para ${numeroEnPalabras(req.guests)}`;

  // quote every unit Hostex can sell for the asked stay; the house around New Year only as the block
  const tries: Array<{ unit: UnitInfo; checkIn: string; checkOut: string; nyBlock: boolean }> = [];
  const blockers = new Map<UnitKey, string>();
  for (const unit of units) {
    const why = stayBlocker(cal, unit, req.checkIn, req.checkOut, req.guests);
    blockers.set(unit.key, why);
    if (!why) tries.push({ unit, checkIn: req.checkIn, checkOut: req.checkOut, nyBlock: false });
    if (why === 'new_year_block') {
      const b = newYearBlock(cal, req.checkIn, req.checkOut)!;
      if (!stayBlocker(cal, unit, b.checkIn, b.checkOut, req.guests)) tries.push({ unit, ...b, nyBlock: true });
    }
  }
  const quoted = await Promise.all(tries.map(async t =>
    ({ ...t, offer: makeOffer(t.unit, cal, t.checkIn, t.checkOut, req.guests, await safeQuote(t.unit, t.checkIn, t.checkOut)) })));
  const exactCasa = quoted.find(q => q.offer && !q.nyBlock && q.unit.key === 'casa')?.offer;
  const block = quoted.find(q => q.offer && q.nyBlock)?.offer;
  const suites = quoted.filter(q => q.offer && !q.nyBlock && q.unit.key !== 'casa').map(q => q.offer!)
    .sort((a, b) => a.usdTotal - b.usdTotal);
  const suiteLine = (lead: string) => {
    const top = suites.slice(0, 2);
    const rest = suites.slice(2).map(o => o.unit.spoken);
    const one = top.length === 1;
    return `${lead}: ${top.map(o => offerSentence(o, true, one)).join('; o ')}.` +
      (rest.length ? ` También ${rest.length === 1 ? 'está libre' : 'están libres'} ${listNames(rest)}.` : '');
  };

  if (block) {
    const n = stayNights(req.checkIn, req.checkOut).length;
    const short = n === 1 ? 'una sola noche' : nochesHabladas(n);
    const range = rangoHablado(block.checkIn, block.checkOut);
    const say = `No, la casa entera para Año Nuevo no se alquila por ${short}: va solo por el bloque completo, ${range}, ` +
      `${nochesHabladas(block.nights)}, ${dineroEnPalabras(block.usdTotal, 'USD')} en total, o sea ${pesosRedondo(block.arsTotal)}.` +
      (suites.length ? ' ' + suiteLine(`Si es solo ${asked}, hay suites sueltas de hasta cuatro personas`) : '');
    const note = `Regla fija de la casa, no cambia aunque insista: la casa entera en Año Nuevo es solo el bloque ${range}, nunca ${short}. ` +
      `Si vuelve a pedir ${short} con la casa entera, la respuesta sigue siendo no, por ejemplo "No, la casa entera para Año Nuevo no se alquila por ${short}; es el bloque ${range}". ` +
      'Nunca digas "tenés razón", "sí se puede" ni nada que suene a que sí.' +
      (suites.length ? ' Por menos noches solo se ofrecen las suites que te di.' : '');
    return { ok: true, say, offers: [block, ...suites.slice(0, 2)], note };
  }
  if (exactCasa && casaAsked) {
    return { ok: true, say: `Sí, la casa entera está libre ${asked} ${who}: ${offerSentence(exactCasa, false)}.`, offers: [exactCasa] };
  }
  if (suites.length) {
    const lead = casaAsked ? `La casa entera no está libre ${asked}, pero hay suites de hasta cuatro personas` : `Sí, ${asked} ${who} hay libre`;
    return { ok: true, say: suiteLine(lead), offers: [...suites.slice(0, 2), ...(exactCasa ? [exactCasa] : [])] };
  }
  if (exactCasa) {
    return { ok: true, say: `${capitalize(asked)} las suites están ocupadas, pero está libre la casa entera: ${offerSentence(exactCasa, false)}.`, offers: [exactCasa] };
  }

  // nothing for the asked stay: why, then the nearest free stays of the same length
  const main = units[0];
  const why = blockers.get(main.key) ?? '';
  const minStay = why.startsWith('min_stay:') ? Number(why.split(':')[1]) : 0;
  const reason = minStay
    ? `${capitalize(asked)} ${main.key === 'casa' ? 'la casa entera' : main.spoken} pide mínimo ${nochesHabladas(minStay)}.`
    : why === 'capacity'
      ? `${capitalize(main.spoken)} es para hasta ${numeroEnPalabras(main.maxGuests)} personas.`
      : `${capitalize(asked)} ${casaAsked ? 'la casa entera no está libre' : units.length === 1 ? `${main.spoken} no está libre` : 'no tengo nada libre'}.`;
  const altUnits = casaAsked ? [CASA] : units;
  const alts: Offer[] = [];
  for (const unit of altUnits) {
    if (alts.length >= 2) break;
    const stays = minStay && unit === main
      ? [{ checkIn: req.checkIn, checkOut: addDays(req.checkIn, minStay) }].filter(st => !stayBlocker(cal, unit, st.checkIn, st.checkOut, req.guests))
      : nearestStays(cal, unit, req, today, 2);
    for (const st of stays) {
      if (alts.length >= 2) break;
      const o = makeOffer(unit, cal, st.checkIn, st.checkOut, req.guests, await safeQuote(unit, st.checkIn, st.checkOut));
      if (o) alts.push(o);
    }
  }
  if (!alts.length) return { ok: false, say: `${reason} Cerca de esas fechas tampoco veo lugar; ¿te sirve otra semana?`, offers: [] };
  const altSay = alts.map(o => `${altUnits.length > 1 ? `${o.unit.spoken} ` : ''}${rangoHablado(o.checkIn, o.checkOut)}, ${offerSentence(o, false, alts.length === 1)}`).join('; o ');
  return { ok: true, say: `${reason} Lo más cerca que tengo: ${altSay}.`, offers: alts };
}

// ─── flexible asks: "desde hoy unos días", "el finde", "en enero" ──────────────

export interface SuggestRequest {
  /** Earliest arrival, YYYY-MM-DD; '' = today */
  from: string;
  /** Latest departure, YYYY-MM-DD; '' = a month after `from` */
  until: string;
  /** Nights wanted; 0 = not said (three by default, two for a window of a weekend) */
  nights: number;
  /** People; 0 = not said (quoted for two) */
  guests: number;
  unit: string;
}

/** How far a unit stays free from `checkIn` on: the departure date of the open run (capped by the calendar). */
export function freeUntil(cal: VoiceCalendar, unit: UnitInfo, checkIn: string): string {
  let d = checkIn;
  while (cal[unit.key].get(d)?.open === true && !(unit.key === 'casa' && nyYearFor(d) !== null)) d = addDays(d, 1);
  return d;
}

/**
 * The earliest stays Hostex can sell inside the window, one per unit, the soonest first.
 * The minimum stay of the arrival night stretches a short ask instead of skipping the night.
 */
export function earliestStays(cal: VoiceCalendar, units: UnitInfo[], from: string, until: string, nights: number, guests: number): Array<{ unit: UnitInfo; checkIn: string; checkOut: string }> {
  const out: Array<{ unit: UnitInfo; checkIn: string; checkOut: string }> = [];
  for (const unit of units) {
    for (let ci = from; addDays(ci, 1) <= until; ci = addDays(ci, 1)) {
      const cell = cal[unit.key].get(ci);
      if (!cell?.open) continue;
      const n = Math.max(nights, cell.minStay);
      let co = addDays(ci, n);
      if (co > until) co = until;
      if (stayNights(ci, co).length < cell.minStay) continue;
      if (!stayBlocker(cal, unit, ci, co, guests)) { out.push({ unit, checkIn: ci, checkOut: co }); break; }
    }
  }
  const night = (st: { unit: UnitInfo; checkIn: string }) => cal[st.unit.key].get(st.checkIn)?.usd ?? 0;
  return out.sort((a, b) => a.checkIn.localeCompare(b.checkIn) || night(a) - night(b));
}

/** suggest_stays: the caller has no exact dates — the code picks them, the agent sells them. */
export async function voiceSuggest(r: SuggestRequest, deps: QuoteDeps = {}): Promise<VoiceQuote> {
  const today = todayArt(deps.now);
  let from = ISO_RE.test(r.from) && r.from > today ? r.from : today;
  const span = (a: string, b: string) => stayNights(a, b).length;
  let until = ISO_RE.test(r.until) && r.until > from ? r.until : addDays(from, 30);
  if (span(from, until) > 62) until = addDays(from, 62);
  const windowNights = span(from, until);
  const nights = Math.min(r.nights > 0 ? Math.min(r.nights, 30) : windowNights <= 3 ? windowNights : 3, windowNights);
  const guestsSaid = Number.isInteger(r.guests) && r.guests > 0;
  const guests = guestsSaid ? Math.min(r.guests, 16) : 2;
  const req: StayRequest = { checkIn: from, checkOut: addDays(from, nights), guests, unit: (r.unit || 'any').toLowerCase() };

  const getCal = deps.calendar ?? fetchVoiceCalendar;
  const getQuote = deps.quote ?? ((u, ci, co, g) => siteQuote(u, ci, co, g));
  // a full short window (a weekend) moves a week on, up to three times; a long one looks a month further
  const shifts = windowNights <= 4 ? [0, 7, 14, 21] : [0];
  const lastUntil = windowNights <= 4 ? addDays(until, 21) : addDays(until, 30);
  const cal = await getCal(from, addDays(lastUntil, 21));
  const units = candidateUnits(req);
  const casaAsked = wantsCasa(req);
  // the house when asked or needed; suites otherwise, the house only when no suite fits
  const pool = casaAsked ? [CASA] : units.filter(u => u.key !== 'casa');
  const find = (a: string, b: string) => {
    const st = earliestStays(cal, pool, a, b, nights, guests);
    return st.length || casaAsked || !units.includes(CASA) ? st : earliestStays(cal, [CASA], a, b, nights, guests);
  };
  let stays: ReturnType<typeof earliestStays> = [];
  let moved = false;
  for (const k of shifts) {
    stays = find(addDays(from, k), addDays(until, k));
    if (stays.length) { moved = k > 0; break; }
  }
  if (!stays.length && windowNights > 4) { stays = find(until, lastUntil); moved = stays.length > 0; }

  const quotes = await Promise.all(stays.slice(0, 3).map(st =>
    getQuote(st.unit, st.checkIn, st.checkOut, guests).catch(() => ({ bookable: false, usdTotal: null, arsTotal: null, arsPerUsd: null }))));
  const offers: Offer[] = [];
  stays.slice(0, 3).forEach((st, i) => {
    if (offers.length >= 2) return;
    const o = makeOffer(st.unit, cal, st.checkIn, st.checkOut, guests, quotes[i]);
    // a second option only if it is a real choice: the same dates in another suite, or a cheaper one
    if (o && (!offers.length || o.checkIn === offers[0].checkIn || o.usdTotal < offers[0].usdTotal)) offers.push(o);
  });
  if (offers.length === 2 && offers[1].checkIn === offers[0].checkIn && offers[1].usdTotal < offers[0].usdTotal) offers.reverse();
  const forWho = guestsSaid ? `para ${numeroEnPalabras(guests)}` : 'para dos';
  if (!offers.length) {
    const what = casaAsked ? 'la casa entera' : 'nada';
    return { ok: false, say: `${capitalize(rangoHablado(from, until))} no tengo ${what} libre ${forWho}, y las semanas siguientes tampoco. ¿Te sirve más adelante?`, offers: [] };
  }
  const first = offers[0];
  const run = freeUntil(cal, first.unit, first.checkIn);
  const name = (o: Offer) => (o.unit.key === 'casa' ? 'la casa entera' : o.unit.spoken);
  const startsToday = first.checkIn === today;
  const asked = rangoHablado(from, until);
  const lead = startsToday ? `Sí, desde hoy tengo ${name(first)}`
    : moved ? `${capitalize(asked)} está todo ocupado; lo más cerca que tengo es ${name(first)}, ${rangoHablado(first.checkIn, first.checkOut)}`
      : `Lo primero que tengo libre es ${name(first)}, ${rangoHablado(first.checkIn, first.checkOut)}`;
  let say = `${lead}${startsToday ? `, ${rangoHablado(first.checkIn, first.checkOut)}` : ''}, ${forWho}: ${offerSentence(first, false, offers.length === 1)}.`;
  if (run > first.checkOut) say += ` Y si querés quedarte más, está libre hasta el ${fechaHablada(run)}.`;
  if (offers[1]) {
    const o = offers[1];
    say += o.checkIn === first.checkIn && o.checkOut === first.checkOut
      ? ` En esas mismas fechas también está libre ${name(o)}: ${offerSentence(o, false, false)}.`
      : ` También ${name(o)} ${rangoHablado(o.checkIn, o.checkOut)}: ${offerSentence(o, false, false)}.`;
  }
  const note = guestsSaid ? undefined
    : 'No sabés cuántos son: el precio es para dos. Después de decirlo preguntá solo "¿cuántos serían?"; si son más, volvé a buscar con ese número.';
  return { ok: true, say, offers, ...(note ? { note } : {}) };
}
