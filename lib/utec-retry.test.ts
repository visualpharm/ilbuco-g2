/**
 * Fibonacci retry engine tests — pins the backoff schedule, error taxonomy,
 * and queue state transitions. Runs on Node's built-in test runner: `npm test`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RetryableError,
  FatalError,
  classifyError,
  fibInterval,
  totalElapsedUpTo,
  MAX_RETRIES,
  TOTAL_RETRY_SPAN_S,
  createQueueItem,
  recordFailure,
  isReady,
  findPending,
  type QueueItem,
} from './utec-retry.ts';

// ─── Error classification ────────────────────────────────────────────────────

test('classifyError: DEVICE_OFFLINE is retryable', () => {
  const err = classifyError(new Error('DEVICE_OFFLINE: lock not reachable'));
  assert.ok(err instanceof RetryableError);
  assert.equal(err.code, 'DEVICE_OFFLINE');
});

test('classifyError: network errors are retryable', () => {
  const err = classifyError(new Error('fetch failed: ECONNREFUSED'));
  assert.ok(err instanceof RetryableError);
  assert.equal(err.code, 'NETWORK');
});

test('classifyError: 503 is retryable', () => {
  const err = classifyError(new Error('HTTP 503: Service Unavailable'));
  assert.ok(err instanceof RetryableError);
  assert.equal(err.code, 'HTTP_503');
});

test('classifyError: 429 is retryable', () => {
  const err = classifyError(new Error('HTTP 429: Too Many Requests'));
  assert.ok(err instanceof RetryableError);
  assert.equal(err.code, 'HTTP_429');
});

test('classifyError: 401 is fatal (auth failure)', () => {
  const err = classifyError(new Error('HTTP 401: Unauthorized'));
  assert.ok(err instanceof FatalError);
  assert.equal(err.code, 'HTTP_401');
});

test('classifyError: 400 is fatal (bad request)', () => {
  const err = classifyError(new Error('HTTP 400: Invalid PIN format'));
  assert.ok(err instanceof FatalError);
});

test('classifyError: passthrough RetryableError', () => {
  const original = new RetryableError('test', 'CUSTOM');
  const err = classifyError(original);
  assert.equal(err, original);
});

test('classifyError: unknown errors default to fatal', () => {
  const err = classifyError(new Error('something weird'));
  assert.ok(err instanceof FatalError);
  assert.equal(err.code, 'UNKNOWN');
});

// ─── Fibonacci intervals ─────────────────────────────────────────────────────

test('fibInterval: first attempt is at least 60s', () => {
  assert.ok(fibInterval(0) >= 60);
});

test('fibInterval: sequence is monotonically non-decreasing', () => {
  for (let i = 0; i < MAX_RETRIES - 1; i++) {
    assert.ok(
      fibInterval(i) <= fibInterval(i + 1),
      `fibInterval(${i})=${fibInterval(i)} should be <= fibInterval(${i + 1})=${fibInterval(i + 1)}`
    );
  }
});

test('fibInterval: capped at 8 hours', () => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    assert.ok(fibInterval(i) <= 8 * 3600, `fibInterval(${i}) exceeds 8h`);
  }
});

test('fibInterval: out-of-range returns max', () => {
  assert.equal(fibInterval(-1), 8 * 3600);
  assert.equal(fibInterval(MAX_RETRIES), 8 * 3600);
});

test('totalElapsedUpTo: full span is at least 3 days (259200s)', () => {
  assert.ok(TOTAL_RETRY_SPAN_S >= 259200, `span is only ${TOTAL_RETRY_SPAN_S}s`);
});

test('totalElapsedUpTo: full span is at most 7 days (604800s)', () => {
  assert.ok(TOTAL_RETRY_SPAN_S <= 604800, `span is ${TOTAL_RETRY_SPAN_S}s, exceeds 7 days`);
});

// ─── Queue item lifecycle ────────────────────────────────────────────────────

test('createQueueItem: starts at 0 attempts, status pending', () => {
  const item = createQueueItem('RES123', 'add', 'device-1', { password: 123456 });
  assert.equal(item.attempts, 0);
  assert.equal(item.status, 'pending');
  assert.equal(item.failures.length, 0);
  assert.equal(item.reservationCode, 'RES123');
  assert.equal(item.operation, 'add');
});

test('recordFailure: increments attempts and sets nextAttemptAt in the future', () => {
  const item = createQueueItem('RES123', 'add', 'dev', {});
  const failed = recordFailure(item, new Error('DEVICE_OFFLINE'));
  assert.equal(failed.attempts, 1);
  assert.equal(failed.status, 'pending');
  assert.equal(failed.failures.length, 1);
  assert.equal(failed.failures[0].code, 'DEVICE_OFFLINE');
  // nextAttemptAt should be in the future
  assert.ok(new Date(failed.nextAttemptAt).getTime() > Date.now());
});

test('recordFailure: fatal error immediately exhausts', () => {
  const item = createQueueItem('RES123', 'add', 'dev', {});
  const failed = recordFailure(item, new Error('HTTP 400: Invalid PIN'));
  assert.equal(failed.attempts, 1);
  assert.equal(failed.status, 'exhausted');
  assert.ok(failed.failures[0].code.startsWith('HTTP_4'));
});

test('recordFailure: exhaustion after MAX_RETRIES', () => {
  let item = createQueueItem('RES123', 'add', 'dev', {});
  for (let i = 0; i < MAX_RETRIES; i++) {
    item = recordFailure(item, new Error('DEVICE_OFFLINE'));
  }
  assert.equal(item.status, 'exhausted');
  assert.equal(item.attempts, MAX_RETRIES);
});

test('recordFailure: does not mutate original item (immutability)', () => {
  const item = createQueueItem('RES123', 'add', 'dev', {});
  const originalAttempts = item.attempts;
  recordFailure(item, new Error('DEVICE_OFFLINE'));
  assert.equal(item.attempts, originalAttempts); // unchanged
});

import { recordSuccess } from './utec-retry.ts';

test('recordSuccess: returns null (signals removal)', () => {
  const item = createQueueItem('RES123', 'add', 'dev', {});
  const result = recordSuccess(item);
  assert.equal(result, null);
});

// ─── Queue scheduling ────────────────────────────────────────────────────────

test('isReady: fresh item is ready (nextAttemptAt = now)', () => {
  const item = createQueueItem('RES', 'add', 'dev', {});
  assert.ok(isReady(item)); // nextAttemptAt was set to creation time
});

test('isReady: not ready when nextAttemptAt is in the future', () => {
  const item = createQueueItem('RES', 'add', 'dev', {});
  const failed = recordFailure(item, new Error('DEVICE_OFFLINE'));
  // Immediately after failure, nextAttemptAt is in the future → not ready
  assert.ok(!isReady(failed));
});

test('isReady: exhausted items are never ready', () => {
  let item: QueueItem = createQueueItem('RES', 'add', 'dev', {});
  // Exhaust it with a fatal error
  item = recordFailure(item, new Error('HTTP 400: Bad'));
  assert.ok(!isReady(item));
});

test('findPending: finds matching pending item', () => {
  const queue = [
    createQueueItem('RES1', 'add', 'dev', {}),
    createQueueItem('RES2', 'add', 'dev', {}),
  ];
  const found = findPending(queue, 'RES2');
  assert.ok(found);
  assert.equal(found.reservationCode, 'RES2');
});

test('findPending: returns undefined when not found', () => {
  const queue = [createQueueItem('RES1', 'add', 'dev', {})];
  const found = findPending(queue, 'RES999');
  assert.equal(found, undefined);
});

test('findPending: filters by operation type', () => {
  const queue = [
    createQueueItem('RES1', 'add', 'dev', {}),
    createQueueItem('RES1', 'delete', 'dev', {}),
  ];
  const found = findPending(queue, 'RES1', 'delete');
  assert.ok(found);
  assert.equal(found.operation, 'delete');
});

test('findPending: ignores exhausted items', () => {
  const item = createQueueItem('RES1', 'add', 'dev', {});
  const exhausted = recordFailure(item, new Error('HTTP 400: Bad'));
  const found = findPending([exhausted], 'RES1');
  assert.equal(found, undefined);
});
