import { NextResponse } from 'next/server';
import { confirmPayment } from '@/lib/late-checkout-io';

export const dynamic = 'force-dynamic';

/** GET ?payment_id=… — the guest is back from Mercado Pago; MP itself says whether it is paid. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('payment_id') ?? '';
  try {
    const { status, purchase } = await confirmPayment(id);
    return NextResponse.json({
      status,
      ...(purchase && { room: purchase.room, date: purchase.date, until: purchase.until, ars: purchase.ars }),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[late-checkout] confirm failed', e);
    return NextResponse.json({ status: 'unknown' }, { status: 503 });
  }
}
