/**
 * /api/pricing/config — pricing policy CRUD for the /admin/pricing UI.
 *
 * GET    → { role, config }
 * PUT    → update basePrices / wholeHouseFactor / learned (reset)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadConfig, saveConfig } from '@/lib/pricing-config';
import { BASE_PRICES, type SeasonTier } from '@/lib/pricing-engine';

const TIERS: SeasonTier[] = ['peak', 'high', 'shoulder', 'off'];
const ROOMS = Object.keys(BASE_PRICES.peak);

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const config = await loadConfig();
  return NextResponse.json({ role: caller, config });
}

export async function PUT(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: {
    basePrices?: Record<string, Record<string, number>>;
    wholeHouseFactor?: number;
    resetLearned?: Array<{ room: string; tier: SeasonTier }>;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const config = await loadConfig();

  if (body.basePrices) {
    for (const tier of TIERS) {
      for (const room of ROOMS) {
        const v = Number(body.basePrices?.[tier]?.[room]);
        if (Number.isFinite(v) && v >= 40 && v <= 1000) {
          config.basePrices[tier][room] = Math.round(v);
        }
      }
    }
  }

  if (body.wholeHouseFactor !== undefined) {
    const f = Number(body.wholeHouseFactor);
    if (Number.isFinite(f) && f >= 0.5 && f <= 1.2) config.wholeHouseFactor = f;
  }

  if (body.resetLearned) {
    for (const { room, tier } of body.resetLearned) {
      if (config.learned[room]) delete config.learned[room][tier];
      if (config.learnedMeta[room]) delete config.learnedMeta[room][tier];
    }
  }

  await saveConfig(config, caller);
  return NextResponse.json({ ok: true, config });
}
