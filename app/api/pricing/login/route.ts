import { NextRequest, NextResponse } from 'next/server';
import { roleForPassword, signRole, ROLE_COOKIE } from '@/lib/pricing-auth';

export async function POST(req: NextRequest) {
  let body: { password?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }

  const role = roleForPassword(body.password ?? '');
  if (!role) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const res = NextResponse.json({ role });
  res.cookies.set(ROLE_COOKIE, signRole(role), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: '/',
  });
  return res;
}
