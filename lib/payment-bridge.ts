/**
 * "Did a transfer of exactly N pesos arrive since T?" — asked of munk (scripts/ripio_bridge.py,
 * behind Tailscale Funnel). The Ripio key can move money, so it never leaves munk; the bridge
 * answers only found / amount / time.
 *
 * Env: RIPIO_BRIDGE_URL (…/ripio-find), RIPIO_BRIDGE_SECRET (HMAC key, 1Password AI
 * "ilbuco-g2 RIPIO_BRIDGE_SECRET").
 */
import { createHmac } from 'node:crypto';

export type DepositCheck = { found: true; amount: string; at: string } | { found: false } | null;

export function signBridge(secret: string, ts: number, raw: string): string {
  return createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
}

/** The deposit, {found:false}, or null when the check itself could not run (bridge down, not configured). */
export async function findDeposit(
  amount: number,
  sinceIso: string,
  waitSec: number,
  opts: { url?: string; secret?: string; fetchImpl?: typeof fetch; now?: () => number } = {},
): Promise<DepositCheck> {
  const url = opts.url ?? process.env.RIPIO_BRIDGE_URL;
  const secret = opts.secret ?? process.env.RIPIO_BRIDGE_SECRET;
  if (!url || !secret) return null;
  const raw = JSON.stringify({ amount: Math.round(amount), since: sinceIso, wait: Math.max(0, Math.min(20, Math.round(waitSec))) });
  const ts = Math.floor((opts.now ?? Date.now)() / 1000);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), (waitSec + 25) * 1000);
  try {
    const res = await (opts.fetchImpl ?? fetch)(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Bridge-Timestamp': String(ts), 'X-Bridge-Signature': signBridge(secret, ts, raw) },
      body: raw,
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (body?.found === true) return { found: true, amount: String(body.amount), at: String(body.at) };
    if (body?.found === false) return { found: false };
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
