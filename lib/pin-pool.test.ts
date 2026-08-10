/**
 * Backup PIN pool tests — checkout/release/recycle lifecycle and exhaustion.
 * Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findAvailable,
  checkOut,
  release,
  isExhausted,
  poolStats,
} from './pin-pool.ts';
import { defaultState, seedBackupPool, type GuestOpsState } from './guest-ops-store.ts';

function seededState(pins: number[] = [1111, 2222, 3333, 4444, 5555]): GuestOpsState {
  return seedBackupPool(defaultState(), pins);
}

// ─── findAvailable ───────────────────────────────────────────────────────────

test('findAvailable: returns first free index on a fresh pool', () => {
  const state = seededState();
  assert.equal(findAvailable(state), 0);
});

test('findAvailable: returns null when all PINs are in use', () => {
  const state = seededState([1111]);
  const checked = checkOut(state, 'RES1');
  assert.ok('pool' in checked);
  const newState = { ...state, backupPool: checked.pool };
  assert.equal(findAvailable(newState), null);
});

test('findAvailable: skips in-use PINs and finds the next free one', () => {
  let state = seededState();
  const c1 = checkOut(state, 'RES1');
  assert.ok('pool' in c1);
  state = { ...state, backupPool: c1.pool };
  // index 0 is now in use → next available is 1
  assert.equal(findAvailable(state), 1);
});

// ─── checkOut ───────────────────────────────────────────────────────────────

test('checkOut: marks the PIN as in use with reservation code', () => {
  const state = seededState();
  const result = checkOut(state, 'RES123');
  assert.ok('pool' in result);
  assert.equal(result.index, 0);
  assert.equal(result.pin, 1111);
  assert.equal(result.pool[0].inUse, true);
  assert.equal(result.pool[0].reservationCode, 'RES123');
  assert.ok(result.pool[0].assignedAt);
});

test('checkOut: does not mutate original state', () => {
  const state = seededState();
  checkOut(state, 'RES123');
  assert.equal(state.backupPool[0].inUse, false); // unchanged
});

test('checkOut: returns exhausted when pool is empty', () => {
  const state = seededState([1111]);
  const r1 = checkOut(state, 'RES1');
  assert.ok('pool' in r1);
  const state2 = { ...state, backupPool: r1.pool };
  const r2 = checkOut(state2, 'RES2');
  assert.deepEqual(r2, { error: 'exhausted' });
});

// ─── release ────────────────────────────────────────────────────────────────

test('release: returns PIN to pool and clears assignment', () => {
  let state = seededState();
  const checked = checkOut(state, 'RES123');
  assert.ok('pool' in checked);
  state = { ...state, backupPool: checked.pool };

  assert.equal(state.backupPool[0].inUse, true);
  const released = release(state, 'RES123');
  assert.equal(released[0].inUse, false);
  assert.equal(released[0].reservationCode, undefined);
  // PIN digit is preserved
  assert.equal(released[0].pin, 1111);
});

test('release: only releases the matching reservation', () => {
  let state = seededState();
  const c1 = checkOut(state, 'RES1');
  assert.ok('pool' in c1);
  state = { ...state, backupPool: c1.pool };
  const c2 = checkOut(state, 'RES2');
  assert.ok('pool' in c2);
  state = { ...state, backupPool: c2.pool };

  // Release only RES1
  const released = release(state, 'RES1');
  assert.equal(released[0].inUse, false); // RES1 released
  assert.equal(released[1].inUse, true);  // RES2 still in use
});

test('release: no-op if reservation code not found in pool', () => {
  const state = seededState();
  const released = release(state, 'NONEXIST');
  assert.equal(released[0].inUse, false); // unchanged
  assert.equal(released.length, state.backupPool.length);
});

// ─── isExhausted ─────────────────────────────────────────────────────────────

test('isExhausted: false on fresh pool', () => {
  const state = seededState();
  assert.equal(isExhausted(state), false);
});

test('isExhausted: true when all PINs checked out', () => {
  const state = seededState([1111]);
  const checked = checkOut(state, 'RES1');
  assert.ok('pool' in checked);
  const newState = { ...state, backupPool: checked.pool };
  assert.equal(isExhausted(newState), true);
});

// ─── poolStats ───────────────────────────────────────────────────────────────

test('poolStats: fresh pool has all available', () => {
  const state = seededState();
  const stats = poolStats(state);
  assert.equal(stats.total, 5);
  assert.equal(stats.inUse, 0);
  assert.equal(stats.available, 5);
});

test('poolStats: reflects partial checkout', () => {
  let state = seededState();
  const checked = checkOut(state, 'RES1');
  assert.ok('pool' in checked);
  state = { ...state, backupPool: checked.pool };
  const stats = poolStats(state);
  assert.equal(stats.inUse, 1);
  assert.equal(stats.available, 4);
});
