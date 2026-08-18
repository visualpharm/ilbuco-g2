import { NextResponse } from 'next/server';
import { getCalendarAvailability, SUITE_PROPERTY_IDS, PROPERTY_NAMES } from '@/lib/hostex-api';
import { createPreference } from '@/lib/mercadopago-client';
import { minStayForDate, suitesClosedForDate, DEFAULT_STAY_POLICY } from '@/lib/stay-policy';

/**
 * POST /api/mp/create-preference
 *
 * Pay-first flow: compute the total from live Hostex calendar prices, create a
 * Mercado Pago preference, and return the init_point URL for redirect.
 *
 * The Hostex reservation is NOT created here — it's created in the webhook
 * handler only after MP confirms payment. The booking details travel through
 * the MP external_reference so the webhook can reconstruct them.
 *
 * Body: { suite, checkIn, checkOut, guests, name, email, phone, remarks? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { suite, checkIn, checkOut, guests, name, email, phone, remarks } = body;

    // ─── Validate ──────────────────────────────────────────────────────────────
    if (!suite || !checkIn || !checkOut || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const propertyId = SUITE_PROPERTY_IDS[suite];
    if (!propertyId) {
      return NextResponse.json({ error: `Unknown suite: ${suite}` }, { status: 400 });
    }

    // Date validation
    const today = new Date().toISOString().split('T')[0];
    if (checkIn < today) {
      return NextResponse.json({ error: 'Check-in date is in the past' }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    // Min-stay validation
    const minStay = minStayForDate(checkIn, today, DEFAULT_STAY_POLICY);
    const nights = Math.round(
      (Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000
    );
    if (nights < minStay) {
      return NextResponse.json(
        { error: `Minimum stay for this arrival date is ${minStay} nights` },
        { status: 400 }
      );
    }

    // Whole-house-only check
    if (suite !== 'whole-house' && suitesClosedForDate(checkIn, today, DEFAULT_STAY_POLICY)) {
      return NextResponse.json(
        { error: 'Suites are closed for this date — only whole-house booking available' },
        { status: 400 }
      );
    }

    // ─── Compute total from live Hostex prices ─────────────────────────────────
    const calendar = await getCalendarAvailability(checkIn, checkOut);
    const suiteName = suite === 'whole-house' ? 'Whole House' : suite.charAt(0).toUpperCase() + suite.slice(1);
    const roomData = calendar.rooms.find((r) => r.name.toLowerCase().replace(/\s+/g, '-') === suite);

    if (!roomData) {
      return NextResponse.json({ error: 'Suite not found in calendar' }, { status: 500 });
    }

    // Check availability for every night in the range
    const unavailableDates = roomData.dates.filter((d) => !d.available && d.date >= checkIn && d.date < checkOut);
    if (unavailableDates.length > 0) {
      return NextResponse.json(
        {
          error: 'Selected dates are not available',
          unavailableDates: unavailableDates.map((d) => d.date),
        },
        { status: 409 }
      );
    }

    // Sum nightly prices
    const nightlyPrices = roomData.dates
      .filter((d) => d.date >= checkIn && d.date < checkOut)
      .map((d) => d.price);

    const total = nightlyPrices.reduce((sum, p) => sum + (p || 0), 0);

    if (total <= 0) {
      return NextResponse.json({ error: 'Could not compute total — prices missing' }, { status: 500 });
    }

    // ─── Create MP preference ──────────────────────────────────────────────────
    // external_reference encodes booking details for the webhook to reconstruct.
    // Format: "ilbuco:{suite}:{propertyId}:{checkIn}:{checkOut}:{guests}:{total}"
    const externalReference = [
      'ilbuco',
      suite,
      propertyId,
      checkIn,
      checkOut,
      guests || 2,
      total,
    ].join(':');

    const origin = new URL(req.url).origin;
    const preference = await createPreference({
      items: [
        {
          id: suite,
          title: `Il Buco — ${suiteName} (${nights} ${nights === 1 ? 'night' : 'nights'})`,
          description: `${checkIn} → ${checkOut} · ${guests || 2} guests`,
          quantity: 1,
          unit_price: total,
          currency_id: 'USD',
        },
      ],
      external_reference: externalReference,
      success_url: `${origin}/reservar/confirmacion?ref=${externalReference}`,
      pending_url: `${origin}/reservar/confirmacion?ref=${externalReference}&status=pending`,
      failure_url: `${origin}/reservar?payment_failed=1`,
      payer: { name, email, phone },
      statement_descriptor: 'IL BUCO Carilo',
    });

    return NextResponse.json({
      init_point: preference.init_point,
      preference_id: preference.id,
      total,
      nights,
      suite: suiteName,
      check_in: checkIn,
      check_out: checkOut,
    });
  } catch (error) {
    console.error('[mp/create-preference] error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
