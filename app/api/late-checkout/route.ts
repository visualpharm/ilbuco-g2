import { NextResponse } from 'next/server';
import { roomByKey, type RoomKey } from '@/lib/late-checkout';
import { departingList, roomOfStay, offerFor, startPayment, LateCheckoutError } from '@/lib/late-checkout-io';

export const dynamic = 'force-dynamic';

/** GET (no params) → guests leaving, "Maria G." only. GET ?guest=<id> or ?room=giardino (QR in the room) → what this room can buy now (no reservation code, no guest data). */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  try {
    if (!q.get('room') && !q.get('guest')) {
      const guests = (await departingList()).map(({ id, label }) => ({ id, label }));
      return NextResponse.json({ guests }, { headers: { 'Cache-Control': 'no-store' } });
    }
  } catch (e) {
    console.error('[late-checkout] list failed', e);
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
  const room = q.get('guest') ? await roomOfStay(q.get('guest')!) : q.get('room');
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
  const room = body?.guest ? String((await roomOfStay(String(body.guest))) ?? '') : String(body?.room ?? '');
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
