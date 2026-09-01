/**
 * Direct-booking (Mercado Pago checkout) activation gate.
 *
 * Real payments and a signature-verified webhook are a package deal: the Hostex
 * reservation only exists because the MP webhook creates it (see
 * app/api/mp/webhook/route.ts), and that webhook only accepts notifications
 * signed with MERCADO_PAGO_WEBHOOK_SECRET. While the secret is absent from the
 * environment, direct booking stays dark — /reservar URLs redirect to the Hostex
 * booking engine (see proxy.ts) — so no guest can pay into a flow that would
 * strand their reservation.
 *
 * Activation = set MERCADO_PAGO_WEBHOOK_SECRET in Vercel env vars + redeploy.
 * Pure module (no Node APIs) so proxy.ts can import it on the edge runtime.
 */

/** Suite slug → Hostex booking-engine listing (the pre-direct-booking links). */
const HOSTEX_LISTINGS: Record<string, string> = {
  giardino: '110800',
  terrazzo: '110801',
  paraiso: '110802',
  penthouse: '110803',
};

const HOSTEX_BOOKING_HOME = 'https://book.ilbuco.com.ar/';

export function isDirectBookingEnabled(): boolean {
  return Boolean(process.env.MERCADO_PAGO_WEBHOOK_SECRET);
}

/** Where to send a guest while direct booking is dark. */
export function hostexBookingUrlFor(suite?: string): string {
  const listing = suite ? HOSTEX_LISTINGS[suite] : undefined;
  return listing ? `${HOSTEX_BOOKING_HOME}listing/${listing}` : HOSTEX_BOOKING_HOME;
}
