/**
 * Fetch-mocked integration tests for the close-only inventory protection sync.
 * Runs on Node's built-in test runner: `npm test`.
 *
 * The mock simulates Hostex v3: reservation queries, the async availability
 * write queue, and both readbacks (property availabilities + booking_site
 * listing calendars) — the readbacks derive from what the sync actually POSTed,
 * so a 'verified' status can only be earned by real closures.
 */
process.env.HOSTEX_API_KEY = 'test-token';

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { syncInventories } from './inventory-sync.ts';
import { getOverlappingReservations, closePropertyAvailabilities } from './hostex-api.ts';

const TODAY = '2026-09-07';
const PROP = { giardino: 12282945, terrazzo: 12282946, paraiso: 12282947, penthouse: 12282948, casa: 12299611 };
const LISTING_TO_PROPERTY: Record<string, number> = {
  '110800-13274': PROP.giardino,
  '110801-13274': PROP.terrazzo,
  '110802-13274': PROP.paraiso,
  '110803-13274': PROP.penthouse,
  '113182-13274': PROP.casa,
};

const CHANNELS = Object.entries(LISTING_TO_PROPERTY).map(([id, prop]) => ({id: prop, channels: [
  {channel_type: 'booking_site', listing_id: id},
  {channel_type: 'airbnb', listing_id: `airbnb-${prop}`},
  {channel_type: 'booking.com', listing_id: `booking-${prop}-a`},
  {channel_type: 'booking.com', listing_id: `booking-${prop}-b`},
  {channel_type: 'booking.com', listing_id: `booking-${prop}-c`},
]}));
for (const p of CHANNELS) for (const c of p.channels) LISTING_TO_PROPERTY[c.listing_id] = p.id;

// ── mock harness ──────────────────────────────────────────────────────────────

type AnyObj = Record<string, any>;
type HandlerResult = AnyObj | { status: number; json: AnyObj };

function isStatusResult(r: any): r is { status: number; json: AnyObj } {
  return !!r && typeof r === 'object' && typeof r.status === 'number' && 'json' in r;
}

interface RecordedCall {
  method: string;
  path: string;
  query: URLSearchParams;
  body?: AnyObj;
}

let calls: RecordedCall[] = [];
const originalFetch = globalThis.fetch;

function mockFetch(handler: (url: URL, method: string, body: AnyObj | undefined) => HandlerResult): void {
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    const method = (init?.method ?? 'GET').toUpperCase();
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ method, path: url.pathname, query: url.searchParams, body });
    const result = handler(url, method, body);
    if (isStatusResult(result)) {
      return new Response(JSON.stringify(result.json), { status: result.status });
    }
    return new Response(JSON.stringify(result), { status: 200 });
  }) as typeof fetch;
}

function envelope(data: unknown): AnyObj {
  return { request_id: 'req-1', error_code: 200, error_msg: 'Done.', data };
}

function resRow(o: {
  code?: string;
  property_id: number;
  ci: string;
  co: string;
  status?: string;
  cancelled_at?: string | null;
}): AnyObj {
  return {
    reservation_code: o.code ?? 'R1',
    stay_code: o.code ?? 'R1',
    channel_id: 'ch-1',
    channel_type: 'booking_site',
    listing_id: '110800-13274',
    property_id: o.property_id,
    check_in_date: o.ci,
    check_out_date: o.co,
    number_of_guests: 2,
    status: o.status ?? 'accepted',
    cancelled_at: o.cancelled_at ?? null,
    booked_at: '2026-01-01T00:00:00+00:00',
    created_at: '2026-01-01T00:00:00+00:00',
  };
}

function eachDate(start: string, end: string): string[] {
  const out: string[] = [];
  for (let d = new Date(start + 'T00:00:00Z'); d <= new Date(end + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

interface WorldOpts {
  reservations?: AnyObj[];
  /** corrupt the property-level readback: (propertyId, date, actuallyClosed) => readsClosed */
  propsOverride?: (prop: number, date: string, isClosed: boolean) => boolean;
  /** corrupt the listing readback: (listingId, date, actuallyClosed) => readsClosed */
  listingsOverride?: (listing: string, date: string, isClosed: boolean) => boolean;
}

/**
 * A world whose readbacks reflect exactly what the sync POSTed (unless an
 * override hook corrupts them). This is the key honest-verification property:
 * 'verified' can only come back when the writes really landed in the mock.
 */
function makeWorld(opts: WorldOpts = {}) {
  const closed = new Map<number, Set<string>>();
  const handler = (url: URL, method: string, body: AnyObj | undefined): HandlerResult => {
    if (url.pathname === '/v3/properties') return envelope({properties: CHANNELS});
    if (url.pathname === '/v3/reservations' && method === 'GET') {
      return envelope({ reservations: opts.reservations ?? [] });
    }
    if (url.pathname === '/v3/availabilities' && method === 'POST') {
      if (body?.available !== false) {
        throw new Error('TEST GUARD: sync tried to write available !== false');
      }
      for (const id of body.property_ids as number[]) {
        const s = closed.get(id) ?? new Set<string>();
        for (const d of body.dates as string[]) s.add(d);
        closed.set(id, s);
      }
      return envelope({ task_id: 'task-1' });
    }
    if (url.pathname === '/v3/availabilities' && method === 'GET') {
      const ids = (url.searchParams.get('property_ids') ?? '').split(',').map(Number);
      const dates = eachDate(url.searchParams.get('start_date')!, url.searchParams.get('end_date')!);
      return envelope({
        properties: ids.map(id => ({
          id,
          availabilities: dates.map(d => {
            const isClosed = closed.get(id)?.has(d) ?? false;
            const readsClosed = opts.propsOverride ? opts.propsOverride(id, d, isClosed) : isClosed;
            return { date: d, available: !readsClosed, remarks: '' };
          }),
        })),
      });
    }
    if (url.pathname === '/v3/listings/calendar' && method === 'POST') {
      const dates = eachDate(body.start_date, body.end_date);
      return envelope({
        listings: (body.listings as AnyObj[]).map(l => ({
          listing_id: l.listing_id,
          channel_type: l.channel_type,
          calendar: dates.map(d => {
            const prop = LISTING_TO_PROPERTY[l.listing_id];
            const isClosed = closed.get(prop)?.has(d) ?? false;
            const readsClosed = opts.listingsOverride ? opts.listingsOverride(l.listing_id, d, isClosed) : isClosed;
            return { date: d, price: 100, inventory: readsClosed ? 0 : 1 };
          }),
        })),
      });
    }
    throw new Error(`TEST: unexpected ${method} ${url.pathname}`);
  };
  return { closed, handler };
}

/** Union of dates the sync asked to close for a given property, across all POSTs. */
function closedDatesFor(prop: number): Set<string> {
  const out = new Set<string>();
  for (const c of calls) {
    if (c.method === 'POST' && c.path === '/v3/availabilities' && (c.body?.property_ids ?? []).includes(prop)) {
      for (const d of c.body.dates) out.add(d);
    }
  }
  return out;
}

function availabilityPosts(): RecordedCall[] {
  return calls.filter(c => c.method === 'POST' && c.path === '/v3/availabilities');
}

beforeEach(() => {
  calls = [];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

// ── 1. close-only invariant ───────────────────────────────────────────────────

test('never reopens: every availability write is available:false, no listing-inventory writes, free dates untouched', async () => {
  mockFetch(makeWorld({ reservations: [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-09-15', co: '2026-09-18' })] }).handler);

  const result = await syncInventories(TODAY, 30, undefined, false);

  const posts = availabilityPosts();
  assert.ok(posts.length > 0, 'expected at least one closure POST');
  for (const p of posts) {
    assert.equal(p.body.available, false, 'availability write must always be available:false');
  }
  // The old sync pushed listing inventories with inventory:1 for free nights — banned.
  assert.ok(
    calls.every(c => !c.path.endsWith('/listings/inventories')),
    'sync must never touch listing-inventory endpoints'
  );
  // A night with no reservation, no casa stay, no policy reason stays untouched.
  for (const p of posts) {
    assert.ok(!p.body.dates.includes('2026-09-25'), 'free dates must not appear in any write');
  }
  assert.equal(result.verification?.status, 'verified');
});

test('with zero reservations and no policy window in range, nothing is written and verification is skipped', async () => {
  // Policy window (Dec 1 2026–Feb 28 2027) starts after this short horizon.
  mockFetch(makeWorld().handler);

  const result = await syncInventories(TODAY, 30, undefined, false);

  assert.equal(availabilityPosts().length, 0);
  assert.deepEqual(result.pushed, { 'Whole House': 0, Giardino: 0, Terrazzo: 0, Paraiso: 0, Penthouse: 0 });
  assert.equal(result.verification?.status, 'skipped');
});

// ── 2. all-channel property-level blocks ─────────────────────────────────────

test('suite booked → whole-house PROPERTY closed for those nights (checkout-exclusive), suite itself untouched', async () => {
  mockFetch(makeWorld({ reservations: [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03' })] }).handler);

  const result = await syncInventories(TODAY, 30, undefined, false);

  const casaClosed = [...closedDatesFor(PROP.casa)].sort();
  assert.deepEqual(casaClosed, ['2026-10-01', '2026-10-02'], 'casa closed for nights of the stay, not checkout day');
  assert.equal(closedDatesFor(PROP.giardino).size, 0, 'own-reservation nights are skipped, not re-closed');

  // The closure is a property_ids POST (protects every channel), not a listing push.
  const casaPosts = availabilityPosts().filter(p => p.body.property_ids.includes(PROP.casa));
  assert.ok(casaPosts.length > 0);
  assert.deepEqual(casaPosts[0].body.property_ids, [PROP.casa]);

  assert.equal(result.suiteBookedDates, 2);
  assert.equal(result.verification?.status, 'verified');
});

test('whole house booked → all four suite properties closed, whole house itself untouched', async () => {
  mockFetch(makeWorld({ reservations: [resRow({ code: 'C1', property_id: PROP.casa, ci: '2026-09-10', co: '2026-09-13' })] }).handler);

  const result = await syncInventories(TODAY, 30, undefined, false);

  for (const suite of [PROP.giardino, PROP.terrazzo, PROP.paraiso, PROP.penthouse]) {
    assert.deepEqual([...closedDatesFor(suite)].sort(), ['2026-09-10', '2026-09-11', '2026-09-12'], `suite ${suite} closed while casa is booked`);
  }
  assert.equal(closedDatesFor(PROP.casa).size, 0, 'casa own nights are skipped');
  // Suites share one date-set → batched into a single multi-property POST.
  const suitePosts = availabilityPosts().filter(p => p.body.property_ids.includes(PROP.giardino));
  assert.equal(suitePosts.length, 1);
  assert.deepEqual(suitePosts[0].body.property_ids.sort(), [PROP.giardino, PROP.terrazzo, PROP.paraiso, PROP.penthouse]);
  assert.equal(result.casaBookedDates, 3);
});

test('stay-policy window closes every suite property but never the whole house', async () => {
  // No reservations at all: today (2026-09-07) < wholeHouseOnly.until (2026-11-01),
  // so Dec 1 2026–Feb 28 2027 is whole-house-only. Horizon end = 2027-01-05.
  mockFetch(makeWorld().handler);

  const result = await syncInventories(TODAY, 120, undefined, false);

  assert.equal(closedDatesFor(PROP.casa).size, 0, 'policy never closes the whole house');
  for (const suite of [PROP.giardino, PROP.terrazzo, PROP.paraiso, PROP.penthouse]) {
    const dates = closedDatesFor(suite);
    assert.ok(dates.has('2026-12-01'), 'window start closed');
    assert.ok(dates.has('2027-01-05'), 'window closed through horizon end');
    assert.ok(!dates.has('2026-11-30'), 'night before the window stays untouched');
    assert.equal(dates.size, 36); // Dec 1 – Jan 5 inclusive
  }
  assert.equal(result.verification?.status, 'verified');
});

// ── 3. failed / partial reads prevent writes ─────────────────────────────────

test('reservation read failures and malformed payloads abort the sync before any write', async () => {
  const cases: Array<{ name: string; respond: AnyObj | { status: number; json: AnyObj } }> = [
    { name: 'error_code != 200', respond: { request_id: 'r', error_code: 40100, error_msg: 'bad request' } },
    { name: 'HTTP 500', respond: { status: 500, json: envelope({}) } },
    { name: 'malformed success: data.reservations missing', respond: envelope({}) },
    {
      name: 'malformed row: check_out_date missing',
      respond: envelope({
        reservations: [
          {
            reservation_code: 'R1', stay_code: 'R1', channel_id: 'ch', channel_type: 'booking_site',
            listing_id: '110800-13274', property_id: PROP.giardino, check_in_date: '2026-10-01',
            number_of_guests: 2, status: 'accepted', cancelled_at: null,
            booked_at: '2026-01-01T00:00:00+00:00', created_at: '2026-01-01T00:00:00+00:00',
          },
        ],
      }),
    },
  ];
  for (const c of cases) {
    calls = [];
    mockFetch(() => c.respond as HandlerResult);
    await assert.rejects(syncInventories(TODAY, 30, undefined, false), Error, c.name);
    assert.equal(availabilityPosts().length, 0, `${c.name}: no writes may leave the sync`);
  }
});

// ── 4. dry run ────────────────────────────────────────────────────────────────

test('dry run computes closures but performs no writes and no readbacks', async () => {
  mockFetch(makeWorld({
    reservations: [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03' })],
  }).handler);

  const result = await syncInventories(TODAY, 120, undefined, true);

  assert.equal(calls.length, 1, 'only the reservation read happens');
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].path, '/v3/reservations');
  assert.equal(result.pushed['Whole House'], 2, 'dry-run still reports what would close');
  assert.equal(result.pushed.Giardino, 36, 'policy window counted for suites');
  assert.equal(result.verification, undefined);
});

// ── 5. whole-house ∩ suite conflicts ─────────────────────────────────────────

test('casa and suite booked the same night → conflict reported, night skipped on both sides', async () => {
  // casa nights: Oct 10, 11 · paraiso nights: Oct 11, 12 → overlap: Oct 11
  mockFetch(makeWorld({
    reservations: [
      resRow({ code: 'C1', property_id: PROP.casa, ci: '2026-10-10', co: '2026-10-12' }),
      resRow({ code: 'P1', property_id: PROP.paraiso, ci: '2026-10-11', co: '2026-10-13' }),
    ],
  }).handler);

  const result = await syncInventories(TODAY, 40, undefined, false);

  assert.deepEqual(result.conflicts, { count: 1, dates: ['2026-10-11'] });
  // Oct 11 is skipped everywhere; each side keeps only its non-own cross-block nights.
  assert.deepEqual([...closedDatesFor(PROP.casa)].sort(), ['2026-10-12'], 'casa closed only for paraiso-only night');
  assert.deepEqual([...closedDatesFor(PROP.paraiso)].sort(), ['2026-10-10'], 'paraiso closed only for casa-only night');
});

// ── 6. overlap query semantics ───────────────────────────────────────────────

test('reservations are queried by overlap (check_out > start), not by a lookback window on check-in', async () => {
  mockFetch(makeWorld().handler);
  await syncInventories(TODAY, 120, undefined, false);

  const q = calls[0].query;
  assert.equal(q.get('start_check_out_date'), null);
  assert.equal(q.get('end_check_in_date'), null);
  assert.equal(q.get('start_check_in_date'), null, 'no check-in lookback heuristic');
});

test('ongoing long reservation (checked in months ago) is captured and clamped to the window', async () => {
  // Checked in 2026-06-01, checks out 2026-12-31 — invisible to the old 35-day lookback.
  mockFetch(makeWorld({
    reservations: [resRow({ code: 'L1', property_id: PROP.penthouse, ci: '2026-06-01', co: '2026-12-31' })],
  }).handler);

  const result = await syncInventories(TODAY, 120, undefined, false);

  const casaClosed = closedDatesFor(PROP.casa);
  assert.ok(casaClosed.has(TODAY), 'window start clamps the long stay');
  assert.ok(casaClosed.has('2026-12-30'), 'stay nights through Dec 30 close the casa');
  assert.ok(!casaClosed.has('2026-12-31'), 'checkout day is not a night');
  const phClosed = closedDatesFor(PROP.penthouse);
  for (const d of eachDate(TODAY, '2026-12-30')) {
    assert.ok(!phClosed.has(d), `penthouse own night ${d} must be skipped`);
  }
  assert.ok(phClosed.has('2026-12-31'), 'post-checkout policy night still closes the suite');
  assert.equal(result.suiteBookedDates, 115); // 2026-09-07 … 2026-12-30 inclusive
});

// ── 7. verification honesty ──────────────────────────────────────────────────

test('failed property readback → unverified, never verified, with the error surfaced', async () => {
  mockFetch((url, method, body) => {
    if (url.pathname === '/v3/availabilities' && method === 'GET') {
      return { status: 500, json: envelope({}) };
    }
    return makeWorld({ reservations: [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03' })] })
      .handler(url, method, body);
  });

  const result = await syncInventories(TODAY, 30, undefined, false);

  assert.equal(result.verification?.status, 'unverified');
  assert.match(result.verification?.error ?? '', /HTTP 500/);
  assert.deepEqual(result.verification?.openProperties, []);
});

test('dates still open at readback → pending with explicit property and listing mismatches', async () => {
  const reservations = [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03' })];

  // Property level reads open on 2026-10-01 (async task "not landed").
  mockFetch(makeWorld({
    reservations,
    propsOverride: (prop, date, isClosed) => (prop === PROP.casa && date === '2026-10-01' ? false : isClosed),
  }).handler);
  let result = await syncInventories(TODAY, 30, undefined, false);
  assert.equal(result.verification?.status, 'pending');
  assert.deepEqual(result.verification?.openProperties, [`${PROP.casa} 2026-10-01`]);

  // Channel level still shows inventory 1 on 2026-10-02.
  calls = [];
  mockFetch(makeWorld({
    reservations,
    listingsOverride: (listing, date, isClosed) => (listing === '113182-13274' && date === '2026-10-02' ? false : isClosed),
  }).handler);
  result = await syncInventories(TODAY, 30, undefined, false);
  assert.equal(result.verification?.status, 'pending');
  assert.deepEqual(result.verification?.openListings, [`113182-13274 2026-10-02`]);
});

test('malformed readback payload (property missing) → unverified, not silently verified', async () => {
  mockFetch((url, method, body) => {
    if (url.pathname === '/v3/availabilities' && method === 'GET') {
      // Drop the whole-house property from the response.
      return envelope({ properties: [{ id: PROP.giardino, availabilities: [] }] });
    }
    return makeWorld({ reservations: [resRow({ code: 'G1', property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03' })] })
      .handler(url, method, body);
  });

  const result = await syncInventories(TODAY, 30, undefined, false);
  assert.equal(result.verification?.status, 'unverified');
  assert.match(result.verification?.error ?? '', /property/);
});

// ── 8. strict reservation helper: pagination guards ──────────────────────────

test('getOverlappingReservations pages through a complete stable snapshot', async () => {
  const pageRows: Record<number, AnyObj[]> = {
    0: Array.from({ length: 100 }, (_, i) => resRow({ code: `R${i}`, property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-02' })),
    100: [
      ...Array.from({ length: 3 }, (_, i) => resRow({ code: `N${i}`, property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-02' })), // new
    ],
  };
  mockFetch(url => envelope({ reservations: pageRows[Number(url.searchParams.get('offset'))] ?? [] }));

  const out = await getOverlappingReservations(TODAY, '2026-10-31');

  assert.equal(out.length, 103, '100 first page + 3 new');
  const offsets = calls.filter(c => c.path === '/v3/reservations').map(c => Number(c.query.get('offset')));
  assert.deepEqual(offsets, [0, 100]);
});

test('getOverlappingReservations throws on non-progressing pagination (full page of duplicates)', async () => {
  const same = Array.from({ length: 100 }, (_, i) => resRow({ code: `R${i}`, property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-02' }));
  mockFetch(() => envelope({ reservations: same }));

  await assert.rejects(getOverlappingReservations(TODAY, '2026-10-31'), /not progressing/);
});

test('getOverlappingReservations refuses to page past the hard bound', async () => {
  mockFetch(url => {
    const offset = Number(url.searchParams.get('offset'));
    return envelope({
      reservations: Array.from({ length: 100 }, (_, i) =>
        resRow({ code: `R${offset + i}`, property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-02' })),
    });
  });

  await assert.rejects(getOverlappingReservations(TODAY, '2026-10-31'), /exceeded 50 pages/);
});

// ── 9. write helper chunking ─────────────────────────────────────────────────

test('closePropertyAvailabilities chunks 150 dates into 100+50 and is a no-op on dry run', async () => {
  const dates = eachDate('2026-09-07', '2027-02-03'); // 150 dates
  assert.equal(dates.length, 150);

  mockFetch(makeWorld().handler);
  const live = await closePropertyAvailabilities([PROP.casa], dates, false);
  assert.equal(live.submitted, 150);
  const posts = availabilityPosts();
  assert.equal(posts.length, 2);
  assert.equal(posts[0].body.dates.length, 100);
  assert.equal(posts[1].body.dates.length, 50);
  assert.deepEqual(posts[0].body.property_ids, [PROP.casa]);
  assert.equal(posts[0].body.available, false);

  calls = [];
  const dry = await closePropertyAvailabilities([PROP.casa], dates, true);
  assert.deepEqual(dry, { submitted: 0, skipped: 150 });
  assert.equal(availabilityPosts().length, 0);
});

test('a Booking.com rate plan still open prevents verified status', async () => {
  mockFetch(makeWorld({
    reservations: [resRow({property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03'})],
    listingsOverride: (listing, date, closed) => listing === `booking-${PROP.casa}-b` ? false : closed,
  }).handler);
  const result = await syncInventories(TODAY, 30);
  assert.equal(result.verification?.status, 'pending');
  assert.ok(result.verification?.openListings.some(x => x.includes(`booking-${PROP.casa}-b`)));
});

test('missing channel mapping aborts before writes', async () => {
  const world = makeWorld({reservations: [resRow({property_id: PROP.giardino, ci: '2026-10-01', co: '2026-10-03'})]});
  mockFetch((url, method, body) => url.pathname === '/v3/properties' ? envelope({properties: []}) : world.handler(url, method, body));
  await assert.rejects(syncInventories(TODAY, 30), /mappings/);
  assert.equal(availabilityPosts().length, 0);
});

test('conflicting duplicate stay identity fails before writes', async () => {
  mockFetch(() => envelope({reservations: [
    resRow({code:'same', property_id:PROP.casa, ci:'2026-10-01',co:'2026-10-03'}),
    resRow({code:'same', property_id:PROP.casa, ci:'2026-10-01',co:'2026-10-10'}),
  ]}));
  await assert.rejects(syncInventories(TODAY,30), /duplicate stay/);
  assert.equal(availabilityPosts().length,0);
});

test('contradictory duplicated calendar night cannot report verified', async () => {
  const world = makeWorld({reservations: [resRow({property_id:PROP.giardino,ci:'2026-10-01',co:'2026-10-03'})]});
  mockFetch((url,method,body) => {
    const r = world.handler(url,method,body) as AnyObj;
    if (url.pathname === '/v3/listings/calendar') r.data.listings[0].calendar.push({date:'2026-10-01',inventory:1});
    return r;
  });
  const result = await syncInventories(TODAY,30);
  assert.equal(result.verification?.status,'unverified');
  assert.match(result.verification?.error ?? '', /duplicate/);
});
