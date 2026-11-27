/**
 * Paid late checkout (meeting Ivan · Jennifer · Melody, 2026-11-24).
 *
 * A sign in every room carries a QR to /late-checkout?room=<room>. The guest picks how late
 * they leave (latest 13:00 — Melody keeps two hours before the 15:00 check-in) and pays at
 * once through Mercado Pago. A room that has a check-in the same day is closed: "aunque pagues
 * un millón, no se puede porque está llegando gente". Melody hears about every purchase
 * through noe (lib/hub-wake.ts notifyLateCheckout) and sees the list on /late-checkout/staff.
 *
 * The price is Ivan's decision — one rule, LATE_CHECKOUT_PRICE below (env LATE_CHECKOUT_PRICE,
 * JSON, overrides it for tests). Set to null and the page shows availability but takes no payment.
 *
 * Pure rules here; Hostex / Mercado Pago IO lives in lib/late-checkout-io.ts.
 */

export type PriceRule =
  /** One price to stay until the latest hour. */
  | { kind: 'flat'; ars: number }
  /** A price for every hour past the standard checkout. */
  | { kind: 'perHour'; ars: number }
  /** A share of the stay's average night, to stay until the latest hour. */
  | { kind: 'percentNight'; percent: number };

/** Ivan's decision (meeting 2026-11-24): $50.000 to stay until 13:00. null = no price, no payment. */
export const LATE_CHECKOUT_PRICE: PriceRule | null = { kind: 'flat', ars: 50000 };

export function priceRule(env: string | undefined = process.env.LATE_CHECKOUT_PRICE): PriceRule | null {
  if (env) {
    try {
      const r = JSON.parse(env);
      if (r?.kind === 'flat' && r.ars > 0) return { kind: 'flat', ars: Number(r.ars) };
      if (r?.kind === 'perHour' && r.ars > 0) return { kind: 'perHour', ars: Number(r.ars) };
      if (r?.kind === 'percentNight' && r.percent > 0 && r.percent <= 100) return { kind: 'percentNight', percent: Number(r.percent) };
    } catch { /* fall through to the code value */ }
  }
  return LATE_CHECKOUT_PRICE;
}

/** Standard checkout and the latest paid one (the house rules on /guest say 11:00). */
export const STANDARD_CHECKOUT_HOUR = 11;
export const LATEST_CHECKOUT_HOUR = 13;

export const WHOLE_HOUSE_ID = 12299611;

export const ROOMS = [
  { key: 'giardino', name: 'Giardino', propertyId: 12282945 },
  { key: 'terrazzo', name: 'Terrazzo', propertyId: 12282946 },
  { key: 'paraiso', name: 'Paraíso', propertyId: 12282947 },
  { key: 'penthouse', name: 'Penthouse', propertyId: 12282948 },
] as const;

export type RoomKey = (typeof ROOMS)[number]['key'];

export function roomByKey(key: string | null | undefined) {
  return ROOMS.find(r => r.key === key);
}

export interface Stay {
  reservation_code: string;
  property_id: number;
  check_in_date: string;
  check_out_date: string;
  guest_name?: string;
}

export type ClosedReason =
  /** No stay in this room ends today or tomorrow. */
  | 'no_checkout'
  /** Someone checks in to this room (or the whole house) that day. */
  | 'arrival'
  /** Already bought for this departure. */
  | 'already_paid';

export interface LateOption {
  /** "12:00" */
  until: string;
  hour: number;
  /** null while Ivan has not set the price */
  ars: number | null;
  /** The hour has already passed today. */
  past: boolean;
}

export interface LateOffer {
  room: RoomKey;
  /** Departure date, YYYY-MM-DD (ART). */
  date: string | null;
  closed: ClosedReason | null;
  reservationCode: string | null;
  options: LateOption[];
  /** Bought already: until when. */
  paidUntil?: string;
}

export function addDays(d: string, n: number): string {
  const dt = new Date(d + 'T12:00:00Z');
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

/** Date and hour in Argentina (UTC−3, no DST). */
export function artNow(now = Date.now()): { date: string; hour: number; minute: number } {
  const t = new Date(now - 3 * 3600 * 1000);
  return { date: t.toISOString().slice(0, 10), hour: t.getUTCHours(), minute: t.getUTCMinutes() };
}

export function hhmm(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

/** The stay leaving this room today, else tomorrow (a guest may scan the evening before). */
export function departingStay(room: RoomKey, stays: Stay[], today: string): Stay | null {
  const pid = roomByKey(room)!.propertyId;
  const mine = stays.filter(s => s.property_id === pid || s.property_id === WHOLE_HOUSE_ID);
  for (const date of [today, addDays(today, 1)]) {
    const s = mine.find(x => x.check_out_date === date && x.check_in_date < date);
    if (s) return s;
  }
  return null;
}

/** "Maria G." — first name and the first letter of the surname; nothing else about the guest is shown. */
export function guestLabel(full: string | undefined): string {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'Huésped';
  const cap = (w: string) => w.charAt(0).toLocaleUpperCase('es-AR') + w.slice(1).toLocaleLowerCase('es-AR');
  const first = cap(parts[0]);
  return parts.length > 1 ? `${first} ${parts[parts.length - 1].charAt(0).toLocaleUpperCase('es-AR')}.` : first;
}

export interface DepartingGuest { id: string; label: string; room: RoomKey }

/** Guests leaving today or tomorrow, one entry per stay (a whole-house stay appears once). */
export function departingGuests(stays: Stay[], today: string): DepartingGuest[] {
  const out: DepartingGuest[] = [];
  for (const r of ROOMS) {
    const s = departingStay(r.key, stays, today);
    if (s && !out.some(g => g.id === s.reservation_code)) out.push({ id: s.reservation_code, label: guestLabel(s.guest_name), room: r.key });
  }
  return out;
}

/** Someone arrives that day in this room — or anywhere, when the whole house is leaving. */
export function hasArrival(room: RoomKey, leaving: Stay, stays: Stay[], date: string): boolean {
  const pid = roomByKey(room)!.propertyId;
  const blocking = leaving.property_id === WHOLE_HOUSE_ID
    ? new Set<number>([WHOLE_HOUSE_ID, ...ROOMS.map(r => r.propertyId)])
    : new Set<number>([pid, WHOLE_HOUSE_ID]);
  return stays.some(s => s.check_in_date === date && blocking.has(s.property_id) && s.reservation_code !== leaving.reservation_code);
}

/** ARS for staying until `hour`, rounded to the thousand. */
export function priceFor(rule: PriceRule | null, hour: number, nightArs: number | null): number | null {
  if (!rule) return null;
  const hours = hour - STANDARD_CHECKOUT_HOUR;
  if (hours <= 0) return null;
  const round = (n: number) => Math.round(n / 1000) * 1000;
  if (rule.kind === 'flat') return round(rule.ars);
  if (rule.kind === 'perHour') return round(rule.ars * hours);
  if (nightArs === null || nightArs <= 0) return null;
  return round((nightArs * rule.percent) / 100);
}

/** Hours offered: one price to the latest hour, or every hour when priced by the hour. */
export function offeredHours(rule: PriceRule | null): number[] {
  if (rule?.kind === 'perHour' || rule === null) {
    const out: number[] = [];
    for (let h = STANDARD_CHECKOUT_HOUR + 1; h <= LATEST_CHECKOUT_HOUR; h++) out.push(h);
    return out;
  }
  return [LATEST_CHECKOUT_HOUR];
}

export interface Paid { room: RoomKey; date: string; until: string }

export function buildOffer(args: {
  room: RoomKey;
  stays: Stay[];
  now: number;
  rule: PriceRule | null;
  /** The departing stay's average night in ARS (percentNight only). */
  nightArs?: number | null;
  paid: Paid[];
}): LateOffer {
  const { room, stays, now, rule } = args;
  const t = artNow(now);
  const leaving = departingStay(room, stays, t.date);
  const base = { room, options: [] as LateOption[] };
  if (!leaving) return { ...base, date: null, closed: 'no_checkout', reservationCode: null };
  const date = leaving.check_out_date;
  const already = args.paid.find(p => p.room === room && p.date === date);
  if (already) return { ...base, date, closed: 'already_paid', reservationCode: leaving.reservation_code, paidUntil: already.until };
  if (hasArrival(room, leaving, stays, date)) return { ...base, date, closed: 'arrival', reservationCode: leaving.reservation_code };
  const options = offeredHours(rule).map(hour => ({
    until: hhmm(hour),
    hour,
    ars: priceFor(rule, hour, args.nightArs ?? null),
    past: date === t.date && t.hour >= hour,
  }));
  return { ...base, date, closed: null, reservationCode: leaving.reservation_code, options };
}

/** Mercado Pago external_reference: "ilbuco-late:<room>:<date>:<until HHMM>:<reservation>:<ars>". */
export const REF_PREFIX = 'ilbuco-late:';

export interface LateRef { room: RoomKey; date: string; until: string; reservation: string; ars: number }

export function makeRef(r: LateRef): string {
  return [REF_PREFIX.slice(0, -1), r.room, r.date, r.until.replace(':', ''), r.reservation, r.ars].join(':');
}

export function parseRef(ref: string | null | undefined): LateRef | null {
  if (!ref || !ref.startsWith(REF_PREFIX)) return null;
  const [, room, date, until, reservation, ars] = ref.split(':');
  if (!roomByKey(room) || !/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !/^\d{4}$/.test(until || '')) return null;
  const amount = Number(ars);
  if (!reservation || !(amount > 0)) return null;
  return { room: room as RoomKey, date, until: `${until.slice(0, 2)}:${until.slice(2)}`, reservation, ars: amount };
}

/** "martes 25 de noviembre" */
export function fechaLarga(date: string): string {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}

/** "$ 50.000" */
export function pesos(ars: number): string {
  return '$ ' + Math.round(ars).toLocaleString('es-AR');
}
