/**
 * Pricing config persistence — Vercel Blob (store: ilbuco-pricing).
 *
 * One JSON document holds the human-editable pricing policy:
 *   - basePrices: per-suite per-tier nightly USD (the policy knob)
 *   - overrides: date-range manual adjustments (fixed price or coefficient)
 *   - learned: per-suite per-tier coefficients derived from manual overrides
 *   - lastPush: audit of the most recent Hostex write
 *
 * The blob is public (prices only, no secrets); writes need BLOB_READ_WRITE_TOKEN.
 */

import { put, list, del } from '@vercel/blob';
import { BASE_PRICES, type SeasonTier, type PriceOverride } from './pricing-engine';

export type { PriceOverride };

/**
 * Versioned writes: each save creates a NEW pathname (pricing-config-v/<ms>.json)
 * and old versions get pruned. Overwriting a fixed pathname doesn't work here —
 * Vercel Blob serves overwritten URLs from CDN cache for 60s+, which breaks
 * read-after-write for the UI (override saved → next request can't see it).
 * Unique URLs are immediately consistent.
 */
const VERSION_PREFIX = 'pricing-config-v/';
const KEEP_VERSIONS = 4;

export interface LearnedMeta {
  nights: number;
  updatedAt: string;
  medianRatio: number;
}

export interface PricingConfig {
  version: number;
  basePrices: Record<SeasonTier, Record<string, number>>;
  /** room → tier → coefficient (1 = neutral), adapted from manual overrides */
  learned: Record<string, Partial<Record<SeasonTier, number>>>;
  learnedMeta: Record<string, Partial<Record<SeasonTier, LearnedMeta>>>;
  overrides: PriceOverride[];
  wholeHouseFactor: number;
  lastPush?: { at: string; by: string; ranges: number };
  updatedAt?: string;
  updatedBy?: string;
}

export function defaultConfig(): PricingConfig {
  return {
    version: 1,
    basePrices: JSON.parse(JSON.stringify(BASE_PRICES)),
    learned: {},
    learnedMeta: {},
    overrides: [],
    wholeHouseFactor: Number(process.env.PRICING_WHOLE_HOUSE_FACTOR ?? '0.92'),
  };
}

export async function loadConfig(): Promise<PricingConfig> {
  try {
    const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
    if (!blobs.length) return defaultConfig();
    const latest = blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b));
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    const cfg = (await res.json()) as PricingConfig;
    // Merge with defaults so new fields/rooms never come back undefined
    const def = defaultConfig();
    return {
      ...def,
      ...cfg,
      basePrices: { ...def.basePrices, ...cfg.basePrices },
      learned: cfg.learned ?? {},
      learnedMeta: cfg.learnedMeta ?? {},
      overrides: cfg.overrides ?? [],
    };
  } catch {
    // First run (blob doesn't exist yet) or transient error → defaults
    return defaultConfig();
  }
}

export async function saveConfig(cfg: PricingConfig, by?: string): Promise<void> {
  cfg.updatedAt = new Date().toISOString();
  if (by) cfg.updatedBy = by;
  const key = `${VERSION_PREFIX}${String(Date.now()).padStart(14, '0')}.json`;
  await put(key, JSON.stringify(cfg, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });

  // Prune old versions (best-effort; keep the newest KEEP_VERSIONS)
  try {
    const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
    const stale = blobs
      .sort((a, b) => b.pathname.localeCompare(a.pathname))
      .slice(KEEP_VERSIONS);
    if (stale.length) await del(stale.map(b => b.url));
  } catch { /* pruning failure is harmless */ }
}

