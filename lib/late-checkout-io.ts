/**
 * Late checkout IO: Hostex stays, Mercado Pago payments, the notice to noe → Melody.
 * Rules are in lib/late-checkout.ts. Mercado Pago itself is the record of who bought:
 * every purchase is an approved payment whose external_reference starts with "ilbuco-late:".
 */
import { getOverlappingReservations, getReservation } from './hostex-api';
import { createPreference, getPayment, searchRecentPayments, type PaymentInfo } from './mercadopago-client';
import { notifyVoice } from './hub-wake';
import {
  addDays, artNow, buildOffer, makeRef, parseRef, priceRule, roomByKey,
  type LateOffer, type LateRef, type Paid, type RoomKey, type Stay,
} from './late-checkout';

let stayCache: { at: number; key: string; stays: Stay[] } | null = null;

async function staysAround(today: string): Promise<Stay[]> {
  // Local end-to-end checks only: a made-up departure, never in production.
  if (process.env.NODE_ENV !== 'production' && process.env.LATE_CHECKOUT_TEST_STAYS) {
    return JSON.parse(process.env.LATE_CHECKOUT_TEST_STAYS) as Stay[];
  }
  const key = today;
  if (stayCache && stayCache.key === key && Date.now() - stayCache.at < 60_000) return stayCache.stays;
  const stays = await getOverlappingReservations(addDays(today, -1), addDays(today, 1));
  stayCache = { at: Date.now(), key, stays };
  return stays;
}

export interface LatePurchase extends LateRef {
  paymentId: number;
  payer: string;
  approvedAt: string | null;
}

export function purchaseOf(p: PaymentInfo): LatePurchase | null {
  if (p.status !== 'approved') return null;
  const ref = parseRef(p.external_reference);
  if (!ref) return null;
  return {
    ...ref,
    paymentId: p.id,
    payer: [p.payer.first_name, p.payer.last_name].filter(Boolean).join(' '),
    approvedAt: p.date_approved,
  };
}

/** Approved late checkouts paid in the last `days` days. */
export async function recentPurchases(days = 7): Promise<LatePurchase[]> {
  const payments = await searchRecentPayments(days);
  return payments.map(purchaseOf).filter((x): x is LatePurchase => x !== null);
}

/** USD → ARS at the booking site's own rate (what guests pay there). */
async function arsPerUsd(): Promise<number | null> {
  const ci = addDays(artNow().date, 30);
  const url = `https://book.ilbuco.com.ar/api/guest/listing/110800?language=en&target_currency=ARS&check_in=${ci}&check_out=${addDays(ci, 1)}&number_of_adult=2&number_of_child=0`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 ilbuco-website' } });
    const q = Number((await res.json())?.data?.quote);
    return q > 300 && q < 20000 ? q : null;
  } catch {
    return null;
  }
}

async function nightArs(reservationCode: string): Promise<number | null> {
  const r = await getReservation(reservationCode);
  const amount = r?.rates?.total_rate?.amount;
  if (!r || !amount) return null;
  const nights = Math.round((Date.parse(r.check_out_date) - Date.parse(r.check_in_date)) / 86_400_000);
  if (nights <= 0) return null;
  const cur = r.rates?.total_rate?.currency ?? 'USD';
  const perNight = amount / nights;
  if (cur === 'ARS') return perNight;
  if (cur !== 'USD') return null;
  const rate = await arsPerUsd();
  return rate ? perNight * rate : null;
}

export async function offerFor(room: RoomKey, now = Date.now()): Promise<LateOffer> {
  const today = artNow(now).date;
  const rule = priceRule();
  const [stays, purchases] = await Promise.all([staysAround(today), recentPurchases(3)]);
  const paid: Paid[] = purchases.map(p => ({ room: p.room, date: p.date, until: p.until }));
  const draft = buildOffer({ room, stays, now, rule, paid });
  if (rule?.kind !== 'percentNight' || draft.closed || !draft.reservationCode) return draft;
  return buildOffer({ room, stays, now, rule, paid, nightArs: await nightArs(draft.reservationCode) });
}

export class LateCheckoutError extends Error {
  constructor(public code: 'closed' | 'no_price' | 'past' | 'bad_hour', message: string) { super(message); }
}

/** Re-check everything and open a Mercado Pago checkout for this room and hour. */
export async function startPayment(room: RoomKey, until: string, requestOrigin: string): Promise<{ init_point: string; ars: number }> {
  // Mercado Pago refuses localhost return addresses; a local run returns to the live site.
  const origin = /\/\/(localhost|127\.0\.0\.1)(:|$)/.test(requestOrigin) ? 'https://ilbuco.com.ar' : requestOrigin;
  const offer = await offerFor(room);
  if (offer.closed || !offer.date || !offer.reservationCode) throw new LateCheckoutError('closed', offer.closed ?? 'closed');
  const opt = offer.options.find(o => o.until === until);
  if (!opt) throw new LateCheckoutError('bad_hour', `no option ${until}`);
  if (opt.ars === null) throw new LateCheckoutError('no_price', 'price not set');
  if (opt.past) throw new LateCheckoutError('past', 'hour passed');
  const ref = makeRef({ room, date: offer.date, until, reservation: offer.reservationCode, ars: opt.ars });
  const name = roomByKey(room)!.name;
  // The checkout link dies at the hour the guest would leave — no paying for a past hour.
  const expiresAt = `${offer.date}T${String(opt.hour).padStart(2, '0')}:00:00.000-03:00`;
  const pref = await createPreference({
    items: [{
      id: `late-${room}`,
      title: `Il Buco · ${name} · salida hasta las ${until}`,
      description: `Late checkout ${offer.date}`,
      quantity: 1,
      unit_price: opt.ars,
      currency_id: 'ARS',
    }],
    external_reference: ref,
    success_url: `${origin}/late-checkout/listo`,
    pending_url: `${origin}/late-checkout/listo`,
    failure_url: `${origin}/late-checkout?room=${room}`,
    excluded_payment_types: ['ticket', 'atm'],
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: expiresAt,
    statement_descriptor: 'IL BUCO Carilo',
  });
  return { init_point: pref.init_point, ars: opt.ars };
}

/** Tell noe (→ Melody). The hub drops a repeated id, so calling this twice is safe. */
export async function announce(p: LatePurchase): Promise<boolean> {
  const r = await notifyVoice({
    id: `late-${p.paymentId}`,
    kind: 'late_checkout',
    name: p.payer || undefined,
    unit: roomByKey(p.room)!.name,
    reason: `выезд ${p.date} до ${p.until}`,
    amount: Math.round(p.ars),
    reservation: p.reservation,
  });
  return r.ok;
}

/** The guest came back from Mercado Pago: check the payment with MP itself, announce it. */
export async function confirmPayment(paymentId: string): Promise<{ status: string; purchase: LatePurchase | null }> {
  if (!/^\d{1,20}$/.test(paymentId)) return { status: 'invalid', purchase: null };
  const p = await getPayment(paymentId);
  const purchase = purchaseOf(p);
  if (purchase) await announce(purchase).catch(() => false);
  return { status: purchase ? 'approved' : (parseRef(p.external_reference) ? p.status : 'invalid'), purchase };
}

/** Cron: announce purchases approved in the last hour (guest closed the tab before coming back). */
export async function sweepRecent(now = Date.now()): Promise<number> {
  const list = await recentPurchases(1);
  const fresh = list.filter(p => p.approvedAt && now - Date.parse(p.approvedAt) < 60 * 60 * 1000);
  let n = 0;
  for (const p of fresh) if (await announce(p).catch(() => false)) n++;
  return n;
}

