import { NextResponse } from 'next/server';
import { roomByKey, type RoomKey } from '@/lib/late-checkout';
import { offerFor, startPayment, LateCheckoutError } from '@/lib/late-checkout-io';

export const dynamic = 'force-dynamic';

/** GET ?room=giardino → what this room can buy now (no reservation code, no guest data). */
export async function GET(req: Request) {
  const room = new URL(req.url).searchParams.get('room');
  if (!roomByKey(room)) return NextResponse.json({ error: 'unknown room' }, { status: 400 });
  try {
    const { reservationCode: _drop, ...offer } = await offerFor(room as RoomKey); // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json(offer, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[late-checkout] offer failed', e);
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}

/** POST { room, until } → { init_point } (Mercado Pago checkout). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const room = String(body?.room ?? '');
  const until = String(body?.until ?? '');
  if (!roomByKey(room) || !/^\d{2}:00$/.test(until)) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  try {
    const origin = new URL(req.url).origin;
    const r = await startPayment(room as RoomKey, until, origin);
    return NextResponse.json(r);
  } catch (e) {
    if (e instanceof LateCheckoutError) return NextResponse.json({ error: e.code }, { status: 409 });
    console.error('[late-checkout] payment start failed', e);
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
