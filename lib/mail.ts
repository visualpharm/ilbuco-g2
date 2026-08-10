/**
 * Mailgun email sender — copied from lira/lib/mail.ts.
 *
 * Sends transactional email via Mailgun's HTTP API (no SDK needed).
 * Best-effort: throws on failure, caller decides whether to retry.
 *
 * Env:
 *   MAILGUN_API_KEY — Mailgun API key
 *   MAILGUN_DOMAIN   — sending domain (e.g. mg.ilbuco.com)
 *   MAILGUN_FROM     — From address (defaults to noreply@<domain>)
 */

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_FROM = process.env.MAILGUN_FROM || (MAILGUN_DOMAIN ? `noreply@${MAILGUN_DOMAIN}` : '');

export function isMailConfigured(): boolean {
  return !!(MAILGUN_API_KEY && MAILGUN_DOMAIN);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  if (!isMailConfigured()) {
    console.warn('[mail] MAILGUN_API_KEY/MAILGUN_DOMAIN not set; skipping email to', to);
    return;
  }

  const body = new URLSearchParams({ from: MAILGUN_FROM, to, subject, html, text });

  const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mailgun error ${res.status}: ${err}`);
  }
}
