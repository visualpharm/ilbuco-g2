/**
 * Auth + SSRF guard for the Vapi voice webhook (app/api/vapi/server/route.ts).
 *
 * Vapi's `Server` config has no plain `secret` field anymore (see
 * https://docs.vapi.ai/server-url/server-authentication) — the modern way to
 * attach a shared secret without dashboard-managed OAuth/HMAC credentials is
 * a static custom header on the assistant/tool `server.headers` config
 * (see scripts/configure_vapi_assistant.js), which Vapi echoes back on every
 * webhook call. We verify that header here, constant-time, fail closed if
 * VAPI_WEBHOOK_SECRET isn't configured.
 */

import { timingSafeEqual } from 'crypto';

export const VAPI_WEBHOOK_SECRET_HEADER = 'x-vapi-webhook-secret';

export function verifyVapiWebhookSecret(candidate: string | null | undefined): boolean {
  const expected = process.env.VAPI_WEBHOOK_SECRET;
  if (!expected || !candidate) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * `controlUrl` is attacker-influenceable input from the (now-authenticated,
 * but still not fully trusted) request body. Only ever fetch it if it points
 * at Vapi's own infrastructure — never follow a URL taken verbatim from the
 * request body without this check (that's the SSRF).
 */
export function isAllowedVapiControlUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  return parsed.hostname === 'vapi.ai' || parsed.hostname.endsWith('.vapi.ai');
}
