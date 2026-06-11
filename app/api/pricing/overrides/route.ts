/**
 * /api/pricing/overrides — manual date-range price overrides.
 *
 * POST   → add { start, end, rooms, mode: 'fixed'|'coef', value, note? }
 * DELETE → ?id=<override id>
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadConfig, saveConfig } from '@/lib/pricing-config';
import { BASE_PRICES, type PriceOverride } from '@/lib/pricing-engine';

const ROOMS = Object.keys(BASE_PRICES.peak);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Partial<PriceOverride>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { start, end, mode, value } = body;
  const rooms = Array.isArray(body.rooms) && body.rooms.length ? body.rooms : ['*'];

  if (!start || !end || !DATE_RE.test(start) || !DATE_RE.test(end) || start > end) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
  }
  if (rooms.some(r => r !== '*' && !ROOMS.includes(r))) {
    return NextResponse.json({ error: 'Unknown room' }, { status: 400 });
  }
  if (mode !== 'fixed' && mode !== 'coef') {
    return NextResponse.json({ error: 'mode must be fixed|coef' }, { status: 400 });
  }
  const v = Number(value);
  if (mode === 'fixed' && !(v >= 40 && v <= 2000)) {
    return NextResponse.json({ error: 'Fixed price must be $40–2000' }, { status: 400 });
  }
  if (mode === 'coef' && !(v >= 0.4 && v <= 3)) {
    return NextResponse.json({ error: 'Coefficient must be 0.4–3.0' }, { status: 400 });
  }

  const config = await loadConfig();
  const override: PriceOverride = {
    id: `ov_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    start, end, rooms, mode, value: v,
    note: typeof body.note === 'string' ? body.note.slice(0, 200) : undefined,
    author: caller,
    createdAt: new Date().toISOString(),
  };
  config.overrides.push(override);
  // Keep the list bounded: drop overrides whose end date is >1y in the past
  const cutoff = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);
  config.overrides = config.overrides.filter(o => o.end >= cutoff);

  await saveConfig(config, caller);
  return NextResponse.json({ ok: true, override });
}

export async function DELETE(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const config = await loadConfig();
  const before = config.overrides.length;
  config.overrides = config.overrides.filter(o => o.id !== id);
  if (config.overrides.length === before) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await saveConfig(config, caller);
  return NextResponse.json({ ok: true });
}
