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

import { createVersionedStore } from './versioned-blob-store';
import { BASE_PRICES, type SeasonTier, type PriceOverride } from './pricing-engine';
import { DEFAULT_STAY_POLICY, type StayPolicy } from './stay-policy';

export type { PriceOverride };

/**
 * Versioned writes: each save creates a NEW pathname and old versions get
 * pruned. Overwriting a fixed pathname doesn't work here — Vercel Blob serves
 * overwritten URLs from CDN cache for 60s+, which breaks read-after-write for
 * the UI (override saved → next request can't see it). Unique URLs are
 * immediately consistent.
 *
 * Since the security audit (2026-09-03) new writes also carry a 128-bit
 * crypto-random pathname segment (pricing-config-v2/<ms>-<rand>.json): this
 * blob holds no secrets (prices only) but shares the public store with the
 * guest PIN/PII state, so it gets the same unguessable-URL treatment. Legacy
 * pricing-config-v/<ms>.json blobs keep loading until pruning retires them.
 */
const KEEP_VERSIONS = 4;

const pricingStore = createVersionedStore<PricingConfig>({
  generationPrefix: 'pricing-config-v2/',
  listPrefix: 'pricing-config-v',
  keepVersions: KEEP_VERSIONS,
  defaults: defaultConfig,
  // Merge with defaults so new fields/rooms never come back undefined
  merge: (def, cfg) => ({
    ...def,
    ...cfg,
    basePrices: { ...def.basePrices, ...cfg.basePrices },
    learned: cfg.learned ?? {},
    learnedMeta: cfg.learnedMeta ?? {},
    overrides: cfg.overrides ?? [],
  }),
});

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
  stayPolicy?: StayPolicy;
  lastPush?: { at: string; by: string; ranges: number };
  /** Set by the daily /api/pricing/sync-inventory cron (watchdog checks its age) */
  lastSync?: string;
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
    stayPolicy: DEFAULT_STAY_POLICY,
  };
}

export async function loadConfig(): Promise<PricingConfig> {
  try {
    return await pricingStore.load();
  } catch {
    // First run (blob doesn't exist yet) or transient error → defaults
    return defaultConfig();
  }
}

export async function saveConfig(cfg: PricingConfig, by?: string): Promise<void> {
  cfg.updatedAt = new Date().toISOString();
  if (by) cfg.updatedBy = by;
  await pricingStore.save(cfg);
}

