/**
 * Versioned blob store tests — pins the security-audit 2026-09-03 finding-1 fix:
 * new writes land at unguessable (128-bit crypto-random) pathnames while legacy
 * deterministic `guest-ops-v/<ms>.json` blobs keep loading, and pruning retires
 * legacy URLs oldest-first. Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeStatePathname,
  parseStateMs,
  newestPathname,
  stalePathnames,
  createVersionedStore,
  RANDOM_SEGMENT_LENGTH,
  type BlobIO,
  type PutOptions,
} from './versioned-blob-store.ts';

const GEN = 'guest-ops-v2/';
const LIST = 'guest-ops-v';

interface FakeState {
  version: number;
  value: string;
}

const HEX32 = 'a'.repeat(32);

function legacyKey(ms: number): string {
  return `${LIST}/${String(ms).padStart(14, '0')}.json`;
}

function v2Key(ms: number, hex: string): string {
  return `${GEN}${String(ms).padStart(14, '0')}-${hex}.json`;
}

/** In-memory BlobIO mirroring the list/put/del/fetchJson contract. */
function makeFakeIo(seed: Record<string, unknown> = {}) {
  const bodies = new Map<string, unknown>(Object.entries(seed));
  const puts: { pathname: string; body: string; opts: PutOptions }[] = [];
  const deletedUrls: string[] = [];
  let failFetch = false;
  const io: BlobIO = {
    async list(prefix, limit) {
      const blobs = [...bodies.keys()]
        .filter(p => p.startsWith(prefix))
        .sort()
        .slice(0, limit)
        .map(pathname => ({ pathname, url: `https://fake.blob/${pathname}` }));
      return { blobs };
    },
    async put(pathname, body, opts) {
      puts.push({ pathname, body, opts });
      bodies.set(pathname, JSON.parse(body));
      return {};
    },
    async del(urls) {
      deletedUrls.push(...urls);
      for (const u of urls) bodies.delete(u.replace('https://fake.blob/', ''));
      return {};
    },
    async fetchJson<T>(url: string): Promise<T> {
      if (failFetch) throw new Error('blob fetch 404');
      const p = url.replace('https://fake.blob/', '');
      if (!bodies.has(p)) throw new Error('blob fetch 404');
      return bodies.get(p) as T;
    },
  };
  return { io, bodies, puts, deletedUrls, setFailFetch: (v: boolean) => { failFetch = v; } };
}

function makeStore(io: BlobIO, keepVersions = 6) {
  return createVersionedStore<FakeState>({
    generationPrefix: GEN,
    listPrefix: LIST,
    keepVersions,
    defaults: () => ({ version: 1, value: 'default' }),
    merge: (def, raw) => ({
      ...def,
      ...raw,
      version: raw.version ?? 1,
      value: raw.value ?? def.value,
    }),
    io,
  });
}

// ─── Pathname generation (the unguessability property) ───────────────────────

test('makeStatePathname: v2 pathname = generation prefix + 14-digit ms + 32-hex segment', () => {
  const p = makeStatePathname(GEN, 1756900000123);
  assert.match(p, /^guest-ops-v2\/01756900000123-[0-9a-f]{32}\.json$/);
});

test('makeStatePathname: 32 hex chars = 16 crypto-random bytes = 128 bits of URL entropy', () => {
  assert.equal(RANDOM_SEGMENT_LENGTH, 32);
  const rand = makeStatePathname(GEN, 0).match(/-([0-9a-f]{32})\.json$/)?.[1];
  assert.ok(rand, 'random segment present');
  assert.equal(rand!.length * 4, 128, 'hex chars × 4 bits = 128 bits');
});

test('makeStatePathname: same-millisecond saves never collide', () => {
  const seen = new Set(
    Array.from({ length: 200 }, () => makeStatePathname(GEN, 1756900000123))
  );
  assert.equal(seen.size, 200);
});

// ─── Ordering across generations ──────────────────────────────────────────────

test('parseStateMs: reads the embedded timestamp of both generations', () => {
  assert.equal(parseStateMs(legacyKey(1756900000123)), 1756900000123);
  assert.equal(parseStateMs(v2Key(1756900000123, HEX32)), 1756900000123);
  assert.equal(parseStateMs('guest-ops-v2/garbage.json'), null);
});

test('newestPathname: chronological across generations — highest embedded ms wins', () => {
  const names = [legacyKey(100), legacyKey(300), v2Key(200, HEX32)];
  assert.equal(newestPathname(names, GEN), legacyKey(300));
});

test('newestPathname: same-ms tie goes to the newest generation', () => {
  const names = [legacyKey(1756900000123), v2Key(1756900000123, HEX32)];
  assert.equal(newestPathname(names, GEN), v2Key(1756900000123, HEX32));
});

test('newestPathname: empty listing has no newest', () => {
  assert.equal(newestPathname([], GEN), undefined);
});

test('stalePathnames: prunes oldest-first across generations', () => {
  const names = [
    legacyKey(100), legacyKey(200), legacyKey(300),
    v2Key(400, 'b'.repeat(32)), v2Key(500, 'c'.repeat(32)),
    v2Key(600, 'd'.repeat(32)), v2Key(700, 'e'.repeat(32)),
  ];
  const stale = stalePathnames(names, 4, GEN);
  assert.deepEqual(stale.sort(), [legacyKey(100), legacyKey(200), legacyKey(300)]);
});

test('stalePathnames: nothing to prune under keep', () => {
  assert.deepEqual(stalePathnames([legacyKey(100), legacyKey(200)], 6, GEN), []);
});

// ─── Store behavior: backward compat + migration ─────────────────────────────

test('load: a store with ONLY legacy blobs returns the newest legacy snapshot (old links keep working)', async () => {
  const fake = makeFakeIo({
    [legacyKey(100)]: { version: 1, value: 'old-1' },
    [legacyKey(200)]: { version: 1, value: 'old-2' },
    [legacyKey(300)]: { version: 1, value: 'old-3' },
  });
  const store = makeStore(fake.io);
  // Merge also fills fields a legacy snapshot can't have
  assert.deepEqual(await store.load(), { version: 1, value: 'old-3' });
  assert.equal(fake.deletedUrls.length, 0);
});

test('save: writes the v2 pathname, public access, no SDK random suffix', async () => {
  const fake = makeFakeIo({ [legacyKey(100)]: { version: 1, value: 'legacy' } });
  const store = makeStore(fake.io);
  await store.save({ version: 1, value: 'new' });
  assert.equal(fake.puts.length, 1);
  const { pathname, opts } = fake.puts[0];
  assert.match(pathname, /^guest-ops-v2\/\d{14,}-[0-9a-f]{32}\.json$/);
  assert.equal(opts.access, 'public');
  assert.equal(opts.addRandomSuffix, false);
  assert.equal(opts.contentType, 'application/json');
  const saved = JSON.parse(fake.puts[0].body);
  assert.equal(saved.value, 'new');
});

test('migration: first save after deploy wins over legacy blobs on the next load', async () => {
  const fake = makeFakeIo({
    [legacyKey(100)]: { version: 1, value: 'legacy-state' },
  });
  const store = makeStore(fake.io);
  await store.save({ version: 1, value: 'v2-state' });
  assert.deepEqual(await store.load(), { version: 1, value: 'v2-state' });
});

test('migration: load prefers the newer v2 snapshot while legacy blobs still exist', async () => {
  const fake = makeFakeIo();
  fake.bodies.set(legacyKey(1000), { version: 1, value: 'legacy' });
  const store = makeStore(fake.io);
  await store.save({ version: 1, value: 'v2' }); // v2 ms >> legacy ms
  assert.deepEqual(await store.load(), { version: 1, value: 'v2' });
});

test('migration: pruning retires every legacy URL within KEEP_VERSIONS saves', async () => {
  const fake = makeFakeIo({
    [legacyKey(100)]: { version: 1, value: 'old-1' },
    [legacyKey(200)]: { version: 1, value: 'old-2' },
    [legacyKey(300)]: { version: 1, value: 'old-3' },
  });
  const store = makeStore(fake.io, 6);
  for (let i = 1; i <= 6; i++) await store.save({ version: 1, value: `v2-${i}` });
  const legacyUrls = [100, 200, 300].map(ms => `https://fake.blob/${legacyKey(ms)}`);
  for (const u of legacyUrls) {
    assert.ok(fake.deletedUrls.includes(u), `legacy ${u} pruned`);
  }
  const v2Left = [...fake.bodies.keys()].filter(p => p.startsWith(GEN));
  assert.equal(v2Left.length, 6, 'exactly KEEP_VERSIONS v2 snapshots remain');
  assert.equal([...fake.bodies.keys()].filter(p => !p.startsWith(GEN)).length, 0);
  assert.deepEqual(await store.load(), { version: 1, value: 'v2-6' });
});

test('round-trip: realistic guest-ops state survives save/load through the merge', async () => {
  const fake = makeFakeIo();
  const store = makeStore(fake.io);
  const state = {
    version: 1,
    value: 'state',
    extra: { pinAssignments: { HBX123: { pin: 4821, guestName: 'Guest' } } },
  };
  await store.save(state as unknown as FakeState);
  const loaded = (await store.load()) as unknown as typeof state;
  assert.deepEqual(loaded.extra, state.extra);
});

// ─── Error semantics preserved ────────────────────────────────────────────────

test('load: rejects on blob fetch failure (stores keep their catch → defaults wrapper)', async () => {
  const fake = makeFakeIo({ [legacyKey(100)]: { version: 1, value: 'old' } });
  const store = makeStore(fake.io);
  fake.setFailFetch(true);
  await assert.rejects(store.load(), /blob fetch 404/);
});

test('load: empty store returns defaults without touching blob URLs', async () => {
  const fake = makeFakeIo();
  const store = makeStore(fake.io);
  assert.deepEqual(await store.load(), { version: 1, value: 'default' });
  assert.equal(fake.puts.length, 0);
});
