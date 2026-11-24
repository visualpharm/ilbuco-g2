import { NextResponse } from 'next/server';
import { sweepRecent } from '@/lib/late-checkout-io';

export const dynamic = 'force-dynamic';

/** Vercel Cron: announce late checkouts paid in the last hour (the hub drops repeats). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json({ announced: await sweepRecent() });
  } catch (e) {
    console.error('[late-checkout] sweep failed', e);
    return NextResponse.json({ error: 'sweep failed' }, { status: 500 });
  }
}
