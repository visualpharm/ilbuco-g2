/**
 * /api/nimda/login — auth for the Nimda admin panel.
 *
 * Identical to /api/pricing/login: shared passwords → signed role cookie.
 * The cookie (path=/) authenticates both /admin/pricing and /nimda.
 */

import { NextRequest, NextResponse } from 'next/server';
import { roleForPassword, signRole, ROLE_COOKIE } from '@/lib/pricing-auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const role = roleForPassword(password);
  if (!role) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ role });
  res.cookies.set(ROLE_COOKIE, signRole(role), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 90 * 24 * 60 * 60, // 90 days
  });
  return res;
}
