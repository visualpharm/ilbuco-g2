import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stayBoundary, formatLockTime, hoursUntil } from './guest-pin-times.ts';
import { buildGuestSchedule } from './utec-api.ts';

test('date-only boundary is noon Argentina, not UTC midnight', () => {
  assert.equal(stayBoundary('2026-10-11'), '2026-10-11T12:00:00-03:00');
  assert.equal(new Date(stayBoundary('2026-10-11')).toISOString(), '2026-10-11T15:00:00.000Z');
});

test('full timestamps pass through', () => {
  assert.equal(stayBoundary('2026-10-11T09:00:00.000Z'), '2026-10-11T09:00:00.000Z');
});

test('lock time is Argentina wall-clock regardless of server tz', () => {
  assert.equal(formatLockTime('2026-10-11T15:00:00.000Z'), '2026-10-11 12:00');
  assert.equal(formatLockTime('2026-10-11T02:30:00.000Z'), '2026-10-10 23:30');
});

test('guest schedule spans noon check-in day to noon check-out day', () => {
  const s = buildGuestSchedule(stayBoundary('2026-10-09'), stayBoundary('2026-10-11'));
  assert.deepEqual(s.daterange, ['2026-10-09 12:00', '2026-10-11 12:00']);
});

test('hoursUntil', () => {
  const now = new Date('2026-10-10T00:00:00Z');
  assert.equal(hoursUntil('2026-10-10T12:00:00Z', now), 12);
});

import { isDeliveryDue } from './guest-pin-times.ts';
test('delivery window: 48h before check-in until check-in time, never retroactive', () => {
  const ci = stayBoundary('2026-10-12'); // 12:00 AR = 15:00Z
  assert.equal(isDeliveryDue(ci, new Date('2026-10-09T00:00:00Z')), false); // >48h
  assert.equal(isDeliveryDue(ci, new Date('2026-10-10T16:00:00Z')), true);  // <48h
  assert.equal(isDeliveryDue(ci, new Date('2026-10-12T16:00:00Z')), true);  // arrival day, before 15:00 check-in
  assert.equal(isDeliveryDue(ci, new Date('2026-10-12T20:00:00Z')), false); // already in
});
