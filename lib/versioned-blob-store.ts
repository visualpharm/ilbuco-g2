/**
 * Versioned state persistence on Vercel Blob — shared by guest-ops-store,
 * crm-store and pricing-config.
 *
 * Threat model (security audit 2026-09-03, finding 1): these blobs hold guest
 * door PINs and PII. They are written `access: 'public'` (the load path does a
 * plain `fetch(blob.url)`, so the URL itself is the capability), which is only
 * acceptable if the URL is unguessable. The old scheme —
 * `<prefix><14-digit-ms>.json`, `addRandomSuffix: false` — had the millisecond
 * timestamp as its ONLY entropy, writes cluster seconds after known cron fires
 * (vercel.json), and the store domain is published in the live site's own
 * image URLs. That made the live state enumerable.
 *
 * Fix: saves go to a NEW generation prefix with a 128-bit crypto-random
 * pathname segment:
 *
 *   <generationPrefix><14-digit-ms>-<32 hex chars>.json
 *   e.g. guest-ops-v2/01725378213456-9f86d081884c7d659a2feaa0c55ad015.json
 *
 * 2^128 candidates is not enumerable, and we do NOT rely on the SDK's
 * `addRandomSuffix` (kept false so pathname ordering stays deterministic).
 *
 * Backward compatibility: loads list BOTH generations. Vercel Blob's list
 * prefix is a plain string prefix, so listing `guest-ops-v` matches the legacy
 * `guest-ops-v/...` blobs and the new `guest-ops-v2/...` ones. The winner is
 * the blob with the highest embedded millisecond timestamp (ties: highest
 * generation, then pathname), so:
 *   - a store that only has legacy blobs keeps reading them (no migration
 *     cliff — existing bookings keep working the moment this deploys), and
 *   - the first save after deploy creates a v2 snapshot, and the existing
 *     best-effort pruning retires the oldest blobs first — so every legacy
 *     URL (and its guessable name) disappears within KEEP_VERSIONS saves,
 *     done in-app on Vercel, never by an operator poking prod from a shell.
 *
 * Long-term home (audit escalation): a private blob store with signed reads
 * or KV/DB. Needs a check of what the current Vercel plan supports — this
 * module is written so the IO is injectable and that swap stays local.
 */

import { randomBytes } from 'crypto';
import { put, list, del } from '@vercel/blob';

// ─── IO surface (injectable for tests / future private-store swap) ───────────

export interface BlobMeta {
  pathname: string;
  url: string;
}

export interface PutOptions {
  access: 'public';
  addRandomSuffix: boolean;
  contentType: string;
}

export interface BlobIO {
  list(prefix: string, limit: number): Promise<{ blobs: BlobMeta[] }>;
  put(pathname: string, body: string, opts: PutOptions): Promise<unknown>;
  del(urls: string[]): Promise<unknown>;
  fetchJson<T>(url: string): Promise<T>;
}

export const defaultBlobIO: BlobIO = {
  list: (prefix, limit) => list({ prefix, limit }),
  put: (pathname, body, opts) => put(pathname, body, opts),
  del: urls => del(urls),
  fetchJson: async <T>(url: string): Promise<T> => {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    return (await res.json()) as T;
  },
};

// ─── Pure pathname helpers ───────────────────────────────────────────────────

/** 32 hex chars = 16 bytes from crypto RNG = 128 bits of URL entropy. */
export const RANDOM_SEGMENT_LENGTH = 32;

/**
 * Monotonic ms clock for save() pathnames. `Date.now()` is not guaranteed to
 * advance between two calls in the same process — two saves issued back to
 * back can land in the same millisecond, and when they share a generation
 * prefix the ordering tie-break in comparePathnames() falls through to the
 * random hex segment, which carries no relation to save order (surfaced as a
 * ~50% flake in a tight-loop test: 6 successive saves, 2 landing in the same
 * ms, the wrong one sorted "newest"). Track the last value handed out and
 * bump by 1ms on a same-ms call so within-process saves stay strictly
 * orderable by pathname alone; real wall-clock saves (network-latency apart,
 * the normal case) are unaffected.
 */
let lastMs = 0;
export function monotonicNowMs(): number {
  const now = Date.now();
  lastMs = now > lastMs ? now : lastMs + 1;
  return lastMs;
}

/** `<generationPrefix><14-digit ms>-<32 hex>.json` */
export function makeStatePathname(
  generationPrefix: string,
  nowMs: number,
  randHex: string = randomBytes(16).toString('hex')
): string {
  return `${generationPrefix}${String(nowMs).padStart(14, '0')}-${randHex}.json`;
}

/** The embedded millisecond timestamp of either generation, or null. */
export function parseStateMs(pathname: string): number | null {
  const base = pathname.split('/').pop() ?? '';
  const m = /^\d+/.exec(base);
  return m ? Number(m[0]) : null;
}

function generationRank(pathname: string, generationPrefix: string): number {
  return pathname.startsWith(generationPrefix) ? 1 : 0;
}

function comparePathnames(a: string, b: string, generationPrefix: string): number {
  const msA = parseStateMs(a) ?? 0;
  const msB = parseStateMs(b) ?? 0;
  if (msA !== msB) return msA - msB;
  const genDiff = generationRank(a, generationPrefix) - generationRank(b, generationPrefix);
  if (genDiff !== 0) return genDiff;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The blob whose snapshot should be treated as current: highest embedded
 * millisecond timestamp wins (ordering is chronological, not
 * generation-first, so a rollback window of legacy writes is never silently
 * superseded by an older v2 blob on re-upgrade).
 */
export function newestPathname(
  pathnames: string[],
  generationPrefix: string
): string | undefined {
  if (!pathnames.length) return undefined;
  return [...pathnames].sort((a, b) => comparePathnames(a, b, generationPrefix)).pop();
}

/** Pathnames to prune (all but the newest `keep`, oldest first). */
export function stalePathnames(
  pathnames: string[],
  keep: number,
  generationPrefix: string
): string[] {
  if (pathnames.length <= keep) return [];
  return [...pathnames]
    .sort((a, b) => comparePathnames(a, b, generationPrefix))
    .slice(0, pathnames.length - keep);
}

// ─── Store factory ───────────────────────────────────────────────────────────

export interface VersionedStoreOptions<T> {
  /** New-write generation prefix, e.g. 'guest-ops-v2/' (with trailing slash). */
  generationPrefix: string;
  /**
   * List prefix that matches BOTH generations, e.g. 'guest-ops-v' (no
   * trailing slash — it is a string prefix of the legacy 'guest-ops-v/' and
   * of generationPrefix).
   */
  listPrefix: string;
  keepVersions: number;
  defaults: () => T;
  /** Merge raw JSON over defaults so missing/new fields never come back undefined. */
  merge: (defaults: T, raw: Partial<T>) => T;
  io?: BlobIO;
  listLimit?: number;
}

export interface VersionedStore<T> {
  load(): Promise<T>;
  save(state: T): Promise<void>;
}

export function createVersionedStore<T>(opts: VersionedStoreOptions<T>): VersionedStore<T> {
  const io = opts.io ?? defaultBlobIO;
  const listLimit = opts.listLimit ?? 1000;

  return {
    async load(): Promise<T> {
      const { blobs } = await io.list(opts.listPrefix, listLimit);
      if (!blobs.length) return opts.defaults();
      const newest = newestPathname(
        blobs.map(b => b.pathname),
        opts.generationPrefix
      );
      const url = blobs.find(b => b.pathname === newest)?.url;
      if (!url) throw new Error(`newest blob ${newest} lost from listing`);
      const raw = await io.fetchJson<Partial<T>>(url);
      return opts.merge(opts.defaults(), raw);
    },

    async save(state: T): Promise<void> {
      const pathname = makeStatePathname(opts.generationPrefix, monotonicNowMs());
      await io.put(pathname, JSON.stringify(state, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      // Prune old versions across BOTH generations (best-effort). Oldest
      // first, so legacy guessable-URL blobs are retired before anything new.
      try {
        const { blobs } = await io.list(opts.listPrefix, listLimit);
        const stale = stalePathnames(
          blobs.map(b => b.pathname),
          opts.keepVersions,
          opts.generationPrefix
        );
        if (stale.length) {
          const urls = stale
            .map(p => blobs.find(b => b.pathname === p)?.url)
            .filter((u): u is string => Boolean(u));
          if (urls.length) await io.del(urls);
        }
      } catch {
        /* pruning failure is harmless */
      }
    },
  };
}
