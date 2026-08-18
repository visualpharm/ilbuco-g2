/**
 * Mercado Pago Checkout Pro client (fetch-based, no SDK).
 *
 * Uses MP's REST API directly — consistent with the codebase pattern
 * (cf. lib/mail.ts, lib/pricing-alerts.ts which also use raw fetch).
 *
 * Flow:
 *   1. createPreference() → returns init_point URL (redirect guest there)
 *   2. MP redirects back to success_url after payment
 *   3. getPayment() in the webhook → confirms payment status
 *
 * Env:
 *   MERCADO_PAGO_ACCESS_TOKEN — from https://www.mercadopago.com.ar/developers/panel
 *   MERCADO_PAGO_PUBLIC_KEY   — public key (for frontend SDK if needed later)
 *   MERCADO_PAGO_WEBHOOK_SECRET — "Firma secreta" from Tus Integraciones → Webhooks
 */

import { createHmac, timingSafeEqual } from 'crypto';

const MP_API = 'https://api.mercadopago.com';

function getAccessToken(): string {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured');
  return token;
}

export interface PreferenceItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  /** Unit price in the preference currency. */
  unit_price: number;
  currency_id?: string;
}

export interface CreatePreferenceParams {
  items: PreferenceItem[];
  /** Booking reference stored on MP for reconciliation in the webhook. */
  external_reference: string;
  /** Full URL to redirect after successful payment. */
  success_url: string;
  /** Full URL for pending payment (e.g. ticket issued). */
  pending_url: string;
  /** Full URL if guest cancels. */
  failure_url: string;
  payer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  /** Seconds — if guest doesn't pay in time, preference expires. */
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  statement_descriptor?: string;
}

export interface CreatedPreference {
  id: string;
  /** Checkout Pro redirect URL (prod init_point). */
  init_point: string;
  /** Sandbox URL (for testing). */
  sandbox_init_point?: string;
}

/**
 * Create a Checkout Pro preference.
 * Guests are redirected to init_point (MP's hosted checkout page),
 * then back to success_url after paying.
 *
 * Docs: https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/create-payment-preference
 */
export async function createPreference(
  params: CreatePreferenceParams
): Promise<CreatedPreference> {
  const body: Record<string, unknown> = {
    items: params.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      quantity: item.quantity,
      currency_id: item.currency_id ?? 'USD',
      unit_price: item.unit_price,
    })),
    external_reference: params.external_reference,
    back_urls: {
      success: params.success_url,
      pending: params.pending_url,
      failure: params.failure_url,
    },
    auto_return: 'approved',
    binary_mode: false, // allow pending status (ticket/transfer)
    ...(params.payer && {
      payer: {
        name: params.payer.name,
        email: params.payer.email,
        phone: params.payer.phone
          ? { number: params.payer.phone, area_code: '' }
          : undefined,
      },
    }),
    ...(params.expires && {
      expires: true,
      expiration_date_from: params.expiration_date_from,
      expiration_date_to: params.expiration_date_to,
    }),
    statement_descriptor: params.statement_descriptor ?? 'IL BUCO Carilo',
  };

  const res = await fetch(`${MP_API}/checkout/preferences?access_token=${getAccessToken()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Mercado Pago preference error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  };
}

export interface PaymentInfo {
  id: number;
  status: 'approved' | 'pending' | 'rejected' | 'in_process' | 'cancelled';
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  external_reference: string | null;
  payment_method_id: string;
  payer: { email?: string; first_name?: string; last_name?: string };
  date_approved: string | null;
}

/**
 * Fetch a payment by its MP payment ID.
 * Used in the webhook handler to verify payment before creating the Hostex reservation.
 */
export async function getPayment(paymentId: number | string): Promise<PaymentInfo> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}?access_token=${getAccessToken()}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Mercado Pago get-payment error (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    status: data.status,
    status_detail: data.status_detail,
    transaction_amount: data.transaction_amount,
    currency_id: data.currency_id,
    external_reference: data.external_reference,
    payment_method_id: data.payment_method_id,
    payer: {
      email: data.payer?.email,
      first_name: data.payer?.first_name,
      last_name: data.payer?.last_name,
    },
    date_approved: data.date_approved,
  };
}

/**
 * Verify the x-signature header on MP webhook notifications.
 *
 * MP signs with HMAC-SHA256 over the manifest "id:{data.id};request-id:{x-request-id};ts:{ts};"
 * using the per-application webhook secret (Tus Integraciones → Webhooks → "Firma secreta").
 * Docs: https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/payment-notifications
 */
export function verifyWebhookSignature(
  dataId: string,
  xSignature: string,
  xRequestId: string,
  secret: string
): boolean {
  if (!secret || !xSignature || !xRequestId || !dataId) return false;
  try {
    const parts = Object.fromEntries(
      xSignature.split(',').map((p) => {
        const [key, ...val] = p.trim().split('=');
        return [key, val.join('=')];
      })
    );
    const ts = parts.ts;
    const v1 = parts.v1;
    if (!ts || !v1) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = createHmac('sha256', secret).update(manifest).digest('hex');

    const receivedBuf = Buffer.from(v1, 'utf8');
    const expectedBuf = Buffer.from(expected, 'utf8');
    if (receivedBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(receivedBuf, expectedBuf);
  } catch {
    return false;
  }
}
