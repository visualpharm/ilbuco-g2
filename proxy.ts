import { NextRequest, NextResponse } from 'next/server';
import { isDirectBookingEnabled, hostexBookingUrlFor } from '@/lib/direct-booking';

/**
 * Direct-booking activation gate (Next.js proxy — the renamed middleware).
 *
 * The /reservar flow takes real payments, and the Hostex reservation only lands
 * via the Mercado Pago webhook, which requires MERCADO_PAGO_WEBHOOK_SECRET to
 * verify x-signature. Until that secret is configured in the environment, every
 * /reservar URL redirects to the existing Hostex booking engine so live traffic
 * keeps using the proven flow. Setting the secret in Vercel env vars and
 * redeploying activates direct booking with no further code change.
 */
export default function proxy(req: NextRequest) {
  if (isDirectBookingEnabled()) return NextResponse.next();

  // /reservar/{suite}/... → the matching Hostex listing; bare /reservar → engine home.
  const suite = req.nextUrl.pathname.split('/')[2];
  return NextResponse.redirect(hostexBookingUrlFor(suite), 307);
}

export const config = {
  matcher: ['/reservar', '/reservar/:path*'],
};
