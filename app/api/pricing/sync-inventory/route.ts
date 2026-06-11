/**
 * /api/pricing/sync-inventory — suite↔casa cross-block sync.
 *
 * GET → run the inventory sync (live). Auth: cron secret, admin token, or UI cookie.
 * Called by the daily Vercel cron and on demand; the Hostex webhook also triggers
 * the same sync on reservation events.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadConfig, saveConfig } from '@/lib/pricing-config';
import { syncInventories } from '@/lib/inventory-sync';
import { DEFAULT_STAY_POLICY } from '@/lib/stay-policy';
import { todayAR } from '@/lib/run-pricing';

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const config = await loadConfig();
    const stayPolicy = { ...DEFAULT_STAY_POLICY, ...(config.stayPolicy ?? {}) };
    const result = await syncInventories(todayAR(), 300, stayPolicy, false);
    config.lastSync = new Date().toISOString();
    await saveConfig(config);
    return NextResponse.json({ ok: true, run_at: config.lastSync, ...result });
  } catch (err) {
    console.error('[sync-inventory] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
