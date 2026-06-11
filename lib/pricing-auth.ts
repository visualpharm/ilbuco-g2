/**
 * Auth for the /admin/pricing UI — two shared passwords (Ivan + Andrés) → signed
 * role cookie. The role is the override author, which feeds the learning loop.
 * API calls may alternatively present X-Admin-Token / CRON_SECRET (scripts, cron).
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const ROLE_COOKIE = 'pricing_role';

function secret(): string {
  return process.env.ADMIN_TOKEN || 'dev-secret';
}

export function signRole(role: string): string {
  const sig = createHmac('sha256', secret()).update(role).digest('hex').slice(0, 32);
  return `${role}.${sig}`;
}

export function verifyRoleCookie(value: string | undefined): string | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot < 1) return null;
  const role = value.slice(0, dot);
  const expected = signRole(role);
  try {
    if (timingSafeEqual(Buffer.from(value), Buffer.from(expected))) return role;
  } catch { /* length mismatch */ }
  return null;
}

export function roleForPassword(password: string): string | null {
  if (process.env.PRICING_PASSWORD_IVAN && password === process.env.PRICING_PASSWORD_IVAN) return 'ivan';
  if (process.env.PRICING_PASSWORD_ANDRES && password === process.env.PRICING_PASSWORD_ANDRES) return 'andres';
  return null;
}

/** Resolve the caller: role-cookie user, or 'admin' via token header, or null. */
export function getCaller(req: NextRequest): string | null {
  const cookieRole = verifyRoleCookie(req.cookies.get(ROLE_COOKIE)?.value);
  if (cookieRole) return cookieRole;

  const token = req.headers.get('x-admin-token')
    || req.headers.get('authorization')?.replace('Bearer ', '');
  if (token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return 'admin';
  if (token && process.env.CRON_SECRET && token === process.env.CRON_SECRET) return 'cron';
  return null;
}
