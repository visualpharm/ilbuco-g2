#!/usr/bin/env node
/**
 * verify-pricing.mjs — live sanity check of the Il Buco Hostex booking-site pricing.
 *
 * Why this exists: the auto-pricer (lib/run-pricing.ts) only pushes NIGHTLY prices,
 * so its sanity gates (lib/sanity-checks.ts) never see the per-listing guest-fee
 * config. On 2026-07-03 a Hostex dashboard misconfig charged the extra-guest fee
 * from guest #1 (instead of beyond 2) and inflated a single-guest booking past $300.
 * That class of bug is invisible to the engine. This script reads the live listing
 * metadata + calendar straight from Hostex and flags the drift.
 *
 * Policy (lib/knowledge-base.ts): base price includes 2 guests; $10/night for each
 * guest beyond 2. Nightly price band = pricing-engine FLOOR..CEILING (65..320).
 *
 * Run:  node scripts/verify-pricing.mjs [--days 60]
 * Exit: 0 = all green, 1 = at least one anomaly (usable as a cron guard).
 * Env:  HOSTEX_API_KEY (falls back to parsing .env.local).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOSTEX_BASE = 'https://api.hostex.io/v3';

// Policy constants (keep in sync with lib/knowledge-base.ts + lib/pricing-engine.ts).
const EXTRA_GUEST_FEE_USD = 10; // per night, per guest beyond 2
const GUESTS_INCLUDED = 2;
// Every suite has a sofa bed sleeping 2 extra (lib/knowledge-base.ts): base 2 + 2 = 4.
const EXPECTED_CAPACITY = 4;
const NIGHT_FLOOR = 65;
const NIGHT_CEILING = 320;

// The four suites + whole house on the Hostex booking_site channel.
const SUITES = [
  { name: 'Giardino', listingId: '110800-13274' },
  { name: 'Terrazzo', listingId: '110801-13274' },
  { name: 'Paraiso', listingId: '110802-13274' },
  { name: 'Penthouse', listingId: '110803-13274' },
];

function getApiKey() {
  if (process.env.HOSTEX_API_KEY) return process.env.HOSTEX_API_KEY;
  const here = dirname(fileURLToPath(import.meta.url));
  for (const p of [join(here, '..', '.env.local'), join(here, '..', '.env')]) {
    try {
      const m = readFileSync(p, 'utf8').match(/^\s*HOSTEX_API_KEY\s*=\s*(.+?)\s*$/m);
      if (m) return m[1].replace(/^['"]|['"]$/g, '');
    } catch { /* keep looking */ }
  }
  throw new Error('HOSTEX_API_KEY not set and not found in .env.local');
}

const KEY = getApiKey();
const headers = { 'Content-Type': 'application/json', 'Hostex-Access-Token': KEY };

async function hostex(path, init = {}) {
  const res = await fetch(`${HOSTEX_BASE}${path}`, { ...init, headers });
  const data = await res.json();
  if (data.error_code !== 200) throw new Error(`Hostex ${path}: ${res.status} ${data.error_msg || ''}`);
  return data.data;
}

function isoAddDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const days = Number((process.argv.find(a => a.startsWith('--days='))?.split('=')[1]) ??
    (process.argv[process.argv.indexOf('--days') + 1]) ?? 60);
  // No Date.now() dependence in the engine, but we anchor the window on the first
  // available night Hostex returns rather than "today" to stay deterministic-ish.
  const today = new Date().toISOString().slice(0, 10);
  const end = isoAddDays(today, days);

  const problems = [];

  // 1) Per-listing guest-fee config from live metadata.
  const listingsData = await hostex('/listings');
  const listings = listingsData.listings || [];
  console.log(`\nGuest-fee config (policy: base incl. ${GUESTS_INCLUDED} guests, $${EXTRA_GUEST_FEE_USD}/night beyond):`);
  for (const suite of SUITES) {
    const L = listings.find(x => x.channel_type === 'booking_site' && x.listing_id === suite.listingId);
    if (!L) { problems.push(`${suite.name}: listing not found on booking_site channel`); continue; }
    const m = L.metadata || {};
    const pl = (m.price_list || [])[0] || {};
    const fee = pl.extra_tenant_price;
    const cap = m.person_capacity;
    let flag = fee !== EXTRA_GUEST_FEE_USD ? `  ⚠ extra_tenant_price $${fee} != $${EXTRA_GUEST_FEE_USD}` : '';
    if (cap !== EXPECTED_CAPACITY) flag += `  ⚠ cap ${cap} != ${EXPECTED_CAPACITY}`;
    console.log(`  ${suite.name.padEnd(10)} cap=${cap}  base=$${pl.daily_price}  weekend=$${pl.weekend_price}  cleaning=$${pl.cleaning_fee}  extraGuest=$${fee}${flag}`);
    if (fee !== EXTRA_GUEST_FEE_USD) problems.push(`${suite.name}: extra_tenant_price is $${fee}, expected $${EXTRA_GUEST_FEE_USD}`);
    if (cap !== EXPECTED_CAPACITY) problems.push(`${suite.name}: person_capacity ${cap}, expected ${EXPECTED_CAPACITY} (base ${GUESTS_INCLUDED} + 2 sofa bed) — 3-4 guest bookings blocked`);
  }

  // 2) Nightly prices from live calendar — flag anything outside the engine band.
  const cal = await hostex('/listings/calendar', {
    method: 'POST',
    body: JSON.stringify({
      start_date: today,
      end_date: end,
      listings: SUITES.map(s => ({ channel_type: 'booking_site', listing_id: s.listingId })),
    }),
  });
  console.log(`\nNightly prices ${today}..${end} (band $${NIGHT_FLOOR}..$${NIGHT_CEILING}):`);
  for (const suite of SUITES) {
    const L = (cal.listings || []).find(x => x.listing_id === suite.listingId);
    const nights = (L?.calendar || []).filter(c => c.price);
    if (!nights.length) { console.log(`  ${suite.name.padEnd(10)} no priced nights`); continue; }
    const prices = nights.map(c => c.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const oob = nights.filter(c => c.price < NIGHT_FLOOR || c.price > NIGHT_CEILING);
    const flag = oob.length ? `  ⚠ ${oob.length} night(s) out of band (e.g. ${oob[0].date} $${oob[0].price})` : '';
    console.log(`  ${suite.name.padEnd(10)} n=${nights.length}  min=$${min}  avg=$${avg}  max=$${max}${flag}`);
    if (oob.length) problems.push(`${suite.name}: ${oob.length} night(s) outside $${NIGHT_FLOOR}..$${NIGHT_CEILING}`);
  }

  console.log('');
  if (problems.length) {
    console.log(`FAIL — ${problems.length} anomaly(ies):`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log('OK — guest-fee config and nightly prices are within policy.');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(2); });
