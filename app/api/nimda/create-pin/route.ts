/**
 * /api/nimda/create-pin — manually create a PIN on the lock.
 *
 * POST → { name, pin, propertyId?, checkIn?, checkOut?, permanent? }
 * Defaults to permanent (unlimited) if no dates provided.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { createManualPin } from '@/lib/run-guest-ops';

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, pin, propertyId, checkIn, checkOut, permanent } = body;

  if (!name || !pin) {
    return NextResponse.json({ error: 'Missing name or pin' }, { status: 400 });
  }

  const pinNum = Number(pin);
  if (!Number.isFinite(pinNum) || pinNum < 1000 || pinNum > 99999999) {
    return NextResponse.json({ error: 'PIN must be 4-8 digits' }, { status: 400 });
  }

  const report = await createManualPin(
    { name, pin: pinNum, propertyId, checkIn, checkOut, permanent },
    caller
  );

  return NextResponse.json(report, { status: report.success ? 200 : 500 });
}
