/**
 * Auth for /vanish and its API routes (channel-descriptions.md editor).
 *
 * The password is checked here, server-side, against VANISH_PASSWORD — never
 * trust a client-side check. Fails closed (rejects) if VANISH_PASSWORD isn't
 * configured, matching the fail-closed pattern used elsewhere in this repo
 * (see lib/utec-api.ts, lib/pricing-auth.ts).
 */

import { timingSafeEqual } from 'crypto';

export const VANISH_PASSWORD_HEADER = 'x-vanish-password';

export function verifyVanishPassword(candidate: string | null | undefined): boolean {
  const expected = process.env.VANISH_PASSWORD;
  if (!expected || !candidate) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
