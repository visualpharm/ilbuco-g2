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

import { put, head } from '@vercel/blob';
import { BASE_PRICES, type SeasonTier, type PriceOverride } from './pricing-engine';

export type { PriceOverride };

const BLOB_KEY = 'pricing-config.json';

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
    const meta = await head(BLOB_KEY);
    const res = await fetch(`${meta.url}?ts=${Date.now()}`, { cache: 'no-store' });
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
  await put(BLOB_KEY, JSON.stringify(cfg, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

