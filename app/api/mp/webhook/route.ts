import { NextResponse } from 'next/server';
import { getPayment, verifyWebhookSignature } from '@/lib/mercadopago-client';
import { createReservation, type CreateReservationParams } from '@/lib/hostex-api';
import { sendPricingAlert } from '@/lib/pricing-alerts';

/**
 * POST /api/mp/webhook
 *
 * Mercado Pago payment notification handler.
 * Receives { type: "payment", data: { id: 12345 } } when a payment status changes.
 *
 * On approved payment:
 *   1. Parse the external_reference (encodes suite, propertyId, dates, guests, total)
 *   2. Create a Hostex direct-booking reservation (pay-first → received_amount = rate_amount)
 *   3. Hostex fires reservation_created webhook → existing guest-ops automation kicks in
 *
 * Always returns 200 so MP doesn't retry — we handle errors via Telegram alerts.
 */

// In-memory dedup — good enough for serverless (retries/replays arrive within minutes),
// same pattern as app/api/hostex-webhook/route.ts's isDuplicate(). Prevents a duplicate
// Hostex reservation if MP redelivers the notification or a request is replayed.
const processedPayments = new Map<string, number>();

function isProcessed(paymentId: string): boolean {
  const now = Date.now();
  processedPayments.forEach((ts, id) => {
    if (now - ts > 30 * 60 * 1000) processedPayments.delete(id);
  });
  if (processedPayments.has(paymentId)) return true;
  processedPayments.set(paymentId, now);
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // MP sends different notification shapes; we only care about payment events
    if (body.type !== 'payment' && body.topic !== 'payment') {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const paymentId = body.data?.id ?? body.resource;
    if (!paymentId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Verify x-signature when the secret is configured. Fails closed (rejects) on a
    // bad signature; if MERCADO_PAGO_WEBHOOK_SECRET isn't set yet, logs loudly and
    // continues — getPayment() below is still the real source of truth for status/amount.
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const xSignature = req.headers.get('x-signature') || '';
      const xRequestId = req.headers.get('x-request-id') || '';
      const valid = verifyWebhookSignature(String(paymentId), xSignature, xRequestId, webhookSecret);
      if (!valid) {
        console.error('[mp/webhook] invalid x-signature — rejecting', { paymentId });
        return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
      }
    } else {
      console.warn('[mp/webhook] MERCADO_PAGO_WEBHOOK_SECRET not set — signature NOT verified');
    }

    // Skip if we've already processed this payment ID in this lambda instance
    if (isProcessed(String(paymentId))) {
      console.log(`[mp/webhook] payment ${paymentId} already processed — skipping`);
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Fetch the payment to get the real status and external_reference
    const payment = await getPayment(paymentId);

    // Only act on approved payments (pending/rejected = no reservation)
    if (payment.status !== 'approved') {
      console.log(`[mp/webhook] payment ${paymentId} status=${payment.status} — skipping`);
      return NextResponse.json({ ok: true, status: payment.status });
    }

    // ─── Parse external_reference ──────────────────────────────────────────────
    // Format: "ilbuco:{suite}:{propertyId}:{checkIn}:{checkOut}:{guests}:{total}"
    const ref = payment.external_reference;
    if (!ref || !ref.startsWith('ilbuco:')) {
      console.error('[mp/webhook] unexpected external_reference:', ref);
      return NextResponse.json({ ok: true, ignored: true });
    }

    const parts = ref.split(':');
    const [, suite, propertyIdStr, checkIn, checkOut, guestsStr, totalStr] = parts;
    const propertyId = Number(propertyIdStr);
    const guests = Number(guestsStr);
    const total = Number(totalStr);

    // ─── Create Hostex reservation ─────────────────────────────────────────────
    const suiteLabel = suite === 'whole-house'
      ? 'Whole House'
      : suite.charAt(0).toUpperCase() + suite.slice(1);

    const reservationParams: CreateReservationParams = {
      property_id: propertyId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      guest_name: [payment.payer.first_name, payment.payer.last_name].filter(Boolean).join(' ') || 'Guest',
      rate_amount: total,
      received_amount: total,
      currency: payment.currency_id || 'USD',
      number_of_guests: guests,
      email: payment.payer.email || undefined,
      remarks: `Direct booking via ilbuco.com.ar — MP payment ${paymentId} (${payment.payment_method_id}). Amount: ${payment.transaction_amount} ${payment.currency_id}.`,
    };

    const reservation = await createReservation(reservationParams);

    // Alert Ivan that a direct booking landed
    await sendPricingAlert(
      `🎉 Direct booking paid via website!\n` +
      `${suiteLabel} · ${checkIn} → ${checkOut}\n` +
      `${guests} guests · $${total} USD\n` +
      `Reservation: ${reservation.reservation_code}\n` +
      `MP payment: ${paymentId} (${payment.payment_method_id})`
    ).catch(() => {});

    return NextResponse.json({
      ok: true,
      reservation_code: reservation.reservation_code,
      payment_id: paymentId,
    });
  } catch (error) {
    console.error('[mp/webhook] error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Alert on failure so Ivan knows to check manually
    await sendPricingAlert(
      `⚠️ MP webhook error — check manually!\n${message}`
    ).catch(() => {});

    // Return 200 to stop MP retries; we'll catch up manually
    return NextResponse.json({ ok: false, error: message });
  }
}
