/**
 * Phone booking hold for the Il Buco voice agent (Ivan, 2026-11-16).
 *
 * The caller agrees → the dates are held for 10 minutes so no other channel can sell them, the
 * agent says a unique peso amount and dictates the alias, and checks the transfer while the
 * caller waits on the line.
 *
 * Hold = property-level availability CLOSED in Hostex (cascades to Airbnb, Booking.com and the
 * booking site), not a reservation: a reservation would fire guest-ops (door PIN, guest messages).
 * The whole house holds the house and the 4 suites; a suite holds itself and the house. Before
 * closing we read what is open and record exactly which (property, night) pairs we flipped;
 * release reopens only those, and never a night someone booked meanwhile (a house night when any
 * reservation covers it, a suite night when that suite or the house is reserved).
 *
 * Amount = the booking site's ARS total rounded up to 100, plus a random tail of 1–99 pesos,
 * unique among holds of the last 15 minutes — Ripio shows no sender name, only the amount.
 *
 * Paid (exact amount found) → a Hostex direct-booking reservation (Booking Site channel, ARS,
 * received = amount); the hold closures stay, the reservation occupies the nights anyway.
 * Not paid in 10 minutes → the server releases the hold (cron sweep each minute and on every
 * tool call) and noe + agent-payments get the summary. Before releasing, the sweep asks the bridge
 * once more for the exact amount since the hold began: a transfer that landed after the caller
 * hung up books the stay exactly like check_payment would.
 *
 * Speed: hold_booking starts a warm watcher on the bridge (mode watch), so check_payment answers
 * in a few seconds from its last poll instead of starting the Ripio script (~20 s) mid-call.
 */
import { createVersionedStore, type VersionedStore } from './versioned-blob-store';
import {
  closePropertyAvailabilities, createReservation, getOverlappingReservations, getPropertyAvailabilities,
  hostexFetch, HOSTEX_USER_AGENT, type CreateReservationParams, type CreatedReservation, type StrictReservationSpan,
} from './hostex-api';
import { stayNights } from './price-floor';
import type { DepositCheck, DepositMode } from './payment-bridge';
import type { VoiceNotice } from './hub-wake';
import { CASA, SUITE_UNITS, type Offer, unitByKey, type UnitKey } from './voice-quote';

export const HOLD_MS = 10 * 60_000;
export const AMOUNT_WINDOW_MS = 15 * 60_000;
/** The bridge cannot answer the sweep's last check: keep the hold this much longer before releasing blind */
export const FINAL_CHECK_GRACE_MS = 5 * 60_000;
/** check_payment waits this long on the warm watcher: the caller is on the line */
export const LIVE_CHECK_WAIT_SEC = 3;
const KEEP_FINISHED_MS = 14 * 24 * 3600_000;

export type HoldStatus = 'held' | 'booked' | 'paid_unbooked' | 'released' | 'release_failed' | 'failed';

export interface ClosedPair { propertyId: number; date: string }

export interface Hold {
  id: string;
  status: HoldStatus;
  createdAt: number;
  expiresAt: number;
  callId: string;
  name: string;
  phone: string;
  unit: UnitKey;
  propertyId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  usdTotal: number;
  arsBase: number;
  amount: number;
  /** Exactly the (property, night) pairs this hold switched from open to closed */
  closed: ClosedPair[];
  reservationCode?: string;
  paidAt?: string;
  releasedAt?: number;
  releaseReason?: string;
  /** Pairs left closed at release because a reservation took them meanwhile */
  keptClosed?: ClosedPair[];
  notified: string[];
  test?: boolean;
}

export interface HoldState { holds: Hold[] }

export const holdStore: VersionedStore<HoldState> = createVersionedStore<HoldState>({
  generationPrefix: 'voice-holds-v2/',
  listPrefix: 'voice-holds-v',
  keepVersions: 20,
  defaults: () => ({ holds: [] }),
  merge: (d, raw) => ({ holds: Array.isArray(raw.holds) ? raw.holds : d.holds }),
});

// ─── pure rules ─────────────────────────────────────────────────────────────

/** The unique transfer amount: site ARS total up to the next 100, plus 1–99 not used in the last 15 min. */
export function uniqueAmount(arsBase: number, holds: Hold[], now: number, rand: () => number = Math.random): number {
  const base = Math.ceil(arsBase / 100) * 100;
  const used = new Set(holds.filter(h => now - h.createdAt < AMOUNT_WINDOW_MS).map(h => h.amount));
  const start = 1 + Math.floor(rand() * 99);
  for (let i = 0; i < 99; i++) {
    const tail = ((start - 1 + i) % 99) + 1;
    if (!used.has(base + tail)) return base + tail;
  }
  // 99 live holds on one base: move to the next hundred
  return uniqueAmount(base + 100, holds, now, rand);
}

/** Properties a stay must close: the house takes the suites with it, a suite takes the house. */
export function holdProperties(propertyId: number): number[] {
  return propertyId === CASA.propertyId
    ? [CASA.propertyId, ...SUITE_UNITS.map(u => u.propertyId)]
    : [propertyId, CASA.propertyId];
}

/** Pairs currently open among the stay's properties — what the hold will close and later reopen. */
export function pairsToClose(avail: Map<number, Map<string, boolean>>, properties: number[], nights: string[]): ClosedPair[] {
  const out: ClosedPair[] = [];
  for (const p of properties) for (const d of nights) if (avail.get(p)?.get(d) === true) out.push({ propertyId: p, date: d });
  return out;
}

/** Release: the closed pairs that may open again — none a reservation took meanwhile. */
export function reopenable(closed: ClosedPair[], reservations: StrictReservationSpan[]): { open: ClosedPair[]; keep: ClosedPair[] } {
  const covers = (r: StrictReservationSpan, d: string) => r.check_in_date <= d && r.check_out_date > d;
  const open: ClosedPair[] = [], keep: ClosedPair[] = [];
  for (const pair of closed) {
    const taken = reservations.some(r => covers(r, pair.date) && (
      pair.propertyId === CASA.propertyId || r.property_id === pair.propertyId || r.property_id === CASA.propertyId));
    (taken ? keep : open).push(pair);
  }
  return { open, keep };
}

/** Group pairs into one write per identical night set. */
export function groupPairs(pairs: ClosedPair[]): Array<{ propertyIds: number[]; dates: string[] }> {
  const byProp = new Map<number, string[]>();
  for (const p of pairs) byProp.set(p.propertyId, [...(byProp.get(p.propertyId) ?? []), p.date]);
  const bySet = new Map<string, { propertyIds: number[]; dates: string[] }>();
  for (const [prop, dates] of byProp) {
    const sorted = [...dates].sort();
    const key = sorted.join(',');
    const g = bySet.get(key) ?? { propertyIds: [], dates: sorted };
    g.propertyIds.push(prop);
    bySet.set(key, g);
  }
  return [...bySet.values()];
}

export function holdId(now: number, rand: () => number = Math.random): string {
  return `h${now.toString(36)}${Math.floor(rand() * 36 ** 4).toString(36).padStart(4, '0')}`;
}

export function normalizePhone(p: string): string {
  const digits = String(p || '').replace(/[^\d+]/g, '');
  return /^\+?\d{6,15}$/.test(digits) ? digits : '';
}

// ─── IO ─────────────────────────────────────────────────────────────────────

/**
 * Reopen property-level availability. Deliberately here, not in lib/hostex-api.ts: protection code
 * there must not be able to open dates (docs/decisions.md). Only releaseHold calls it, and only
 * with pairs this hold closed itself.
 */
async function openPropertyAvailabilities(propertyIds: number[], dates: string[]): Promise<void> {
  const res = await hostexFetch('https://api.hostex.io/v3/availabilities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Hostex-Access-Token': process.env.HOSTEX_API_KEY ?? '', 'User-Agent': HOSTEX_USER_AGENT },
    body: JSON.stringify({ property_ids: propertyIds, dates, available: true }),
  });
  const data = await res.json().catch(() => ({}));
  if (data.error_code !== 200) throw new Error(`Hostex availabilities(open): ${data.error_msg ?? res.status}`);
}

export interface HoldDeps {
  store: Pick<VersionedStore<HoldState>, 'load' | 'save'>;
  availability: (propertyIds: number[], start: string, end: string) => Promise<Map<number, Map<string, boolean>>>;
  close: (propertyIds: number[], dates: string[]) => Promise<unknown>;
  open: (propertyIds: number[], dates: string[]) => Promise<unknown>;
  reservations: (startNight: string, endNight: string) => Promise<StrictReservationSpan[]>;
  createReservation: (p: CreateReservationParams) => Promise<CreatedReservation>;
  findDeposit: (amount: number, sinceIso: string, waitSec: number, mode: DepositMode) => Promise<DepositCheck>;
  notify: (n: Omit<VoiceNotice, 'type'>) => Promise<unknown>;
  now: () => number;
  rand: () => number;
}

export function liveHoldDeps(extra: Pick<HoldDeps, 'findDeposit' | 'notify'>): HoldDeps {
  return {
    store: holdStore,
    availability: getPropertyAvailabilities,
    close: (ids, dates) => closePropertyAvailabilities(ids, dates),
    open: openPropertyAvailabilities,
    reservations: getOverlappingReservations,
    createReservation,
    now: Date.now,
    rand: Math.random,
    ...extra,
  };
}

function noticeFor(h: Hold, kind: VoiceNotice['kind'], reason = ''): Omit<VoiceNotice, 'type'> {
  return {
    id: `${h.id}-${kind}`, kind, name: h.name, phone: h.phone, unit: unitByKey(h.unit)?.spoken ?? h.unit,
    check_in: h.checkIn, check_out: h.checkOut, amount: h.amount, hold_id: h.id,
    ...(h.reservationCode ? { reservation: h.reservationCode } : {}),
    ...(reason ? { reason } : {}), ...(h.callId ? { call_id: h.callId } : {}), ...(h.test ? { test: true } : {}),
  };
}

async function tell(h: Hold, kind: VoiceNotice['kind'], deps: HoldDeps, reason = ''): Promise<void> {
  if (h.notified.includes(kind)) return;
  h.notified.push(kind);
  await deps.notify(noticeFor(h, kind, reason)).catch(() => undefined);
}

// ─── flows ──────────────────────────────────────────────────────────────────

/** A transfer counts from 2 minutes before the hold: a quick caller may pay while the bot still talks. */
export function holdSince(h: Pick<Hold, 'createdAt'>): string {
  return new Date(h.createdAt - 2 * 60_000).toISOString();
}

export type CreateHoldResult = { ok: true; hold: Hold } | { ok: false; why: 'taken' | 'busy' | 'error'; detail?: string };

/** Hold the offer's nights for 10 minutes. The offer must come from a fresh quote. */
export async function createHold(
  offer: Offer,
  who: { name: string; phone: string; callId?: string; test?: boolean },
  deps: HoldDeps,
): Promise<CreateHoldResult> {
  await sweepHolds(deps).catch(() => undefined);
  const now = deps.now();
  const nights = stayNights(offer.checkIn, offer.checkOut);
  const props = holdProperties(offer.unit.propertyId);
  const state = await deps.store.load();
  const mine = state.holds.find(h => h.status === 'held' && h.callId && h.callId === who.callId);
  if (mine) return { ok: true, hold: mine };

  const avail = await deps.availability(props, nights[0], nights[nights.length - 1]);
  if (nights.some(d => avail.get(offer.unit.propertyId)?.get(d) !== true)) return { ok: false, why: 'taken' };
  const closed = pairsToClose(avail, props, nights);

  const hold: Hold = {
    id: holdId(now, deps.rand), status: 'held', createdAt: now, expiresAt: now + HOLD_MS,
    callId: who.callId ?? '', name: who.name.trim().slice(0, 80), phone: normalizePhone(who.phone),
    unit: offer.unit.key, propertyId: offer.unit.propertyId, checkIn: offer.checkIn, checkOut: offer.checkOut,
    guests: offer.guests, usdTotal: offer.usdTotal, arsBase: offer.arsTotal,
    amount: uniqueAmount(offer.arsTotal, state.holds, now, deps.rand),
    closed, notified: [], ...(who.test ? { test: true } : {}),
  };
  // record first, then close: a crash between the two leaves a hold the sweep can release
  state.holds = [...state.holds.filter(h => h.status === 'held' || now - h.createdAt < KEEP_FINISHED_MS), hold];
  await deps.store.save(state);
  try {
    for (const g of groupPairs(closed)) await deps.close(g.propertyIds, g.dates);
  } catch (e) {
    await releaseHold(hold.id, 'close_failed', deps).catch(() => undefined);
    return { ok: false, why: 'error', detail: String(e).slice(0, 200) };
  }
  // warm the bridge: its watcher polls Ripio from now on, so check_payment answers in seconds
  await deps.findDeposit(hold.amount, holdSince(hold), 0, 'watch').catch(() => null);
  return { ok: true, hold };
}

/** Reopen what the hold closed (minus anything booked meanwhile). Idempotent. */
export async function releaseHold(id: string, reason: string, deps: HoldDeps): Promise<Hold | undefined> {
  const state = await deps.store.load();
  const h = state.holds.find(x => x.id === id);
  if (!h || (h.status !== 'held' && h.status !== 'release_failed')) return h;
  const nights = stayNights(h.checkIn, h.checkOut);
  try {
    const res = await deps.reservations(nights[0], nights[nights.length - 1]);
    const { open, keep } = reopenable(h.closed, res);
    for (const g of groupPairs(open)) await deps.open(g.propertyIds, g.dates);
    h.status = 'released';
    h.keptClosed = keep;
  } catch (e) {
    h.status = 'release_failed';
    h.releaseReason = `${reason}: ${String(e).slice(0, 160)}`;
    await deps.store.save(state);
    await tell(h, 'release_failed', deps, h.releaseReason);
    await deps.store.save(state);
    return h;
  }
  h.releasedAt = deps.now();
  h.releaseReason = reason;
  await deps.store.save(state);
  if (reason === 'expired' || reason === 'expired_unverified') {
    await tell(h, 'hold_expired', deps,
      reason === 'expired_unverified' ? 'последняя проверка Ripio перед снятием не прошла — сверь поступление вручную' : '');
    await deps.store.save(state);
  }
  return h;
}

/**
 * Release every hold past its 10 minutes (cron each minute + every tool call); retry failed releases.
 * A held stay gets one last bridge check first: paid → booked (and noe + agent-payments told),
 * not paid → released; the bridge cannot answer → kept up to FINAL_CHECK_GRACE_MS, then released.
 */
export async function sweepHolds(deps: HoldDeps): Promise<{ released: string[]; booked: string[] }> {
  const now = deps.now();
  const state = await deps.store.load();
  const due = state.holds.filter(h => (h.status === 'held' && now >= h.expiresAt) || h.status === 'release_failed');
  const released: string[] = [], booked: string[] = [];
  for (const h of due) {
    let reason = 'expired';
    if (h.status === 'held') {
      const dep = await deps.findDeposit(h.amount, holdSince(h), 0, 'once').catch(() => null);
      if (dep?.found) {
        const b = await bookPaid(h.id, dep, deps, 'перевод нашёлся при последней проверке перед снятием удержания; гость мог уже повесить трубку — подтверди ему');
        if (b.state === 'booked') booked.push(h.id);
        continue;
      }
      if (dep === null) {
        if (now < h.expiresAt + FINAL_CHECK_GRACE_MS) continue;
        reason = 'expired_unverified';
      }
    }
    const r = await releaseHold(h.id, reason, deps);
    if (r?.status === 'released') released.push(h.id);
  }
  return { released, booked };
}

export type PaymentResult =
  | { state: 'booked'; hold: Hold }
  | { state: 'paid_unbooked'; hold: Hold }
  | { state: 'pending'; hold: Hold; secondsLeft: number }
  | { state: 'expired'; hold: Hold }
  | { state: 'unverified'; hold: Hold }
  | { state: 'unknown' };

/** check_payment: ask the warm watcher for the exact amount (a few seconds at most), book when it is there. */
export async function checkPayment(id: string, deps: HoldDeps, waitSec = LIVE_CHECK_WAIT_SEC): Promise<PaymentResult> {
  let state = await deps.store.load();
  let h: Hold | undefined = state.holds.find(x => x.id === id);
  if (!h) return { state: 'unknown' };
  if (h.status === 'booked') return { state: 'booked', hold: h };
  if (h.status === 'paid_unbooked') return { state: 'paid_unbooked', hold: h };
  if (h.status !== 'held') return { state: 'expired', hold: h };

  // past the 10 minutes this is the last check before release: a fresh run, not the watcher's last poll
  const late = deps.now() >= h.expiresAt;
  const dep = await deps.findDeposit(h.amount, holdSince(h), late ? 0 : waitSec, late ? 'once' : 'watch');

  if (dep === null) {
    // the check itself could not run: the agent promises a WhatsApp confirmation, noe gets the summary once
    state = await deps.store.load();
    h = state.holds.find(x => x.id === id) ?? h;
    await tell(h, 'payment_unverified', deps);
    await deps.store.save(state);
    return { state: 'unverified', hold: h };
  }

  if (!dep.found) {
    if (deps.now() >= h.expiresAt) {
      const r = await releaseHold(id, 'expired', deps);
      return { state: 'expired', hold: r ?? h };
    }
    return { state: 'pending', hold: h, secondsLeft: Math.max(0, Math.floor((h.expiresAt - deps.now()) / 1000)) };
  }

  return bookPaid(id, dep, deps);
}

/**
 * The exact amount arrived: book it in Hostex (direct booking channel). The hold closures stay; the
 * reservation occupies the nights. Shared by check_payment and the sweep's last check. A reservation
 * already on the unit's nights (another run of this, or a sale elsewhere) is never doubled: paid_unbooked.
 */
async function bookPaid(id: string, dep: { found: true; amount: string; at: string }, deps: HoldDeps, note = ''): Promise<PaymentResult> {
  const state = await deps.store.load();
  const h = state.holds.find(x => x.id === id);
  if (!h) return { state: 'unknown' };
  if (h.status === 'booked' || h.status === 'paid_unbooked') return { state: h.status, hold: h };
  if (h.status !== 'held') return { state: 'expired', hold: h };
  h.paidAt = dep.at;
  const nights = stayNights(h.checkIn, h.checkOut);
  const taken = await deps.reservations(nights[0], nights[nights.length - 1]).then(
    rs => rs.filter(r => r.check_in_date < h.checkOut && r.check_out_date > h.checkIn &&
      (h.propertyId === CASA.propertyId || r.property_id === h.propertyId || r.property_id === CASA.propertyId)),
    () => null,
  );
  if (taken === null || taken.length) {
    h.status = 'paid_unbooked';
    await deps.store.save(state);
    const why = taken === null ? 'не удалось проверить брони Hostex перед созданием' : `на эти ночи уже есть бронь ${taken.map(r => r.reservation_code).join(', ')}`;
    await tell(h, 'paid_unbooked', deps, [note, why].filter(Boolean).join('; '));
    await deps.store.save(state);
    return { state: 'paid_unbooked', hold: h };
  }
  const params: CreateReservationParams = {
    property_id: h.propertyId, check_in_date: h.checkIn, check_out_date: h.checkOut,
    guest_name: h.name || 'Huésped por teléfono', rate_amount: h.amount, received_amount: h.amount, currency: 'ARS',
    number_of_guests: h.guests, ...(h.phone ? { mobile: h.phone } : {}),
    remarks: `Reserva por teléfono (agente de voz Il Buco). Transferencia Ripio ilbuco.carilo ${h.amount} ARS ${dep.at}. Hold ${h.id}.`,
  };
  try {
    const r = await deps.createReservation(params).catch(async e => {
      // Hostex may refuse nights closed at property level: open the unit's own nights and try once more
      const own = h!.closed.filter(p => p.propertyId === h!.propertyId);
      for (const g of groupPairs(own)) await deps.open(g.propertyIds, g.dates);
      h!.closed = h!.closed.filter(p => p.propertyId !== h!.propertyId);
      try { return await deps.createReservation(params); } catch { throw e; }
    });
    h.status = 'booked';
    h.reservationCode = r.reservation_code;
    await deps.store.save(state);
    await tell(h, 'paid', deps, note);
    await deps.store.save(state);
    return { state: 'booked', hold: h };
  } catch (e) {
    h.status = 'paid_unbooked';
    await deps.store.save(state);
    await tell(h, 'paid_unbooked', deps, [note, String(e).slice(0, 200)].filter(Boolean).join('; '));
    await deps.store.save(state);
    return { state: 'paid_unbooked', hold: h };
  }
}
