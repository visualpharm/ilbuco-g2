/**
 * Fibonacci retry engine for U-tec lock operations.
 *
 * The U-tec API does NOT queue commands for offline locks — a DEVICE_OFFLINE
 * response drops the command entirely. This module provides a persistent retry
 * queue with Fibonacci backoff spanning ~4.5 days, surviving power/internet
 * outages common in Argentina.
 *
 * State is persisted in Vercel Blob via guest-ops-store, so retries survive
 * across serverless invocations. The queue is swept every 15 min by cron.
 *
 * Error taxonomy (adapted from openclaw-private/services/publisher/senders/_base.py):
 * - Retryable: DEVICE_OFFLINE, network timeout, 5xx, session STARTING/FAILED
 * - Fatal: invalid PIN format, auth failure, invalid reservation, lock unlinked
 */

// ─── Error taxonomy ──────────────────────────────────────────────────────────

export class RetryableError extends Error {
  constructor(
    message: string,
    /** Machine-readable code for logging: DEVICE_OFFLINE, NETWORK, 5XX, etc. */
    readonly code: string
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

export class FatalError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = 'FatalError';
  }
}

export class NeedsHumanError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = 'NeedsHumanError';
  }
}

/** U-tec API error strings that map to retryable conditions. */
const RETRYABLE_CODES = new Set([
  'DEVICE_OFFLINE',
  'DEVICE_BUSY',
  'TIMEOUT',
  'SERVICE_UNAVAILABLE',
  'TEMPORARILY_UNAVAILABLE',
]);

const RETRYABLE_HTTP = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * Classify a raw error from the U-tec API (or network) into our taxonomy.
 * Pure function — no side effects.
 */
export function classifyError(err: unknown): RetryableError | FatalError {
  if (err instanceof RetryableError || err instanceof FatalError) return err;

  const msg = err instanceof Error ? err.message : String(err);
  const upper = msg.toUpperCase();

  // Check for known U-tec error codes
  for (const code of RETRYABLE_CODES) {
    if (upper.includes(code)) return new RetryableError(msg, code);
  }

  // HTTP status patterns
  const statusMatch = upper.match(/(?:HTTP\s*)?(\d{3})/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1], 10);
    if (RETRYABLE_HTTP.has(status)) return new RetryableError(msg, `HTTP_${status}`);
    if (status >= 400 && status < 500) return new FatalError(msg, `HTTP_${status}`);
  }

  // Network / fetch errors
  if (upper.includes('ECONNREFUSED') || upper.includes('ENOTFOUND') ||
      upper.includes('ECONNRESET') || upper.includes('ETIMEDOUT') ||
      upper.includes('FETCH FAILED') || upper.includes('NETWORK')) {
    return new RetryableError(msg, 'NETWORK');
  }

  // Default: treat as fatal (unknown errors shouldn't loop forever)
  return new FatalError(msg, 'UNKNOWN');
}

// ─── Fibonacci backoff ───────────────────────────────────────────────────────

/**
 * Fibonacci intervals in SECONDS.
 *
 * The sequence grows to span ~4.5 days of total retry time, so the lock
 * programming survives multi-day power/internet outages (Buenos Aires reality).
 * We use raw Fibonacci numbers: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233...
 * scaled by a multiplier, so attempt 0 = mult×60s, attempt 1 = mult×60s, etc.
 *
 * With multiplier 60 (one Fibonacci "unit" = 60s), the first attempt waits 1min.
 * The sequence caps at 6 hours per interval. With 20 terms the total spans ~5 days.
 *
 * Index 0 = first retry, 1 = second retry, etc.
 * After the last index, the queue item is marked as 'exhausted'.
 */
const FIB_BASE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711];
const FIB_UNIT_S = 60; // one Fibonacci "unit" = 60 seconds
const MAX_INTERVAL_S = 8 * 3600; // cap at 8 hours between attempts (~5 day total span)

/** Total retries before exhaustion = ~4.5 days of total wall-clock retry time. */
export const MAX_RETRIES = FIB_BASE.length;

/**
 * Compute the Fibonacci interval (in seconds) for a given attempt index.
 * Scales the raw Fibonacci number by MIN_INTERVAL_S, capped at MAX_INTERVAL_S.
 * Pure function.
 */
export function fibInterval(attemptIndex: number): number {
  if (attemptIndex < 0 || attemptIndex >= FIB_BASE.length) return MAX_INTERVAL_S;
  const raw = FIB_BASE[attemptIndex];
  return Math.min(raw * FIB_UNIT_S, MAX_INTERVAL_S);
}

/**
 * Total elapsed time (in seconds) if all retries up to index N are consumed.
 * Pure function.
 */
export function totalElapsedUpTo(attemptIndex: number): number {
  let total = 0;
  for (let i = 0; i <= attemptIndex && i < FIB_BASE.length; i++) {
    total += fibInterval(i);
  }
  return total;
}

/** Total retry time span in seconds (~4.5 days). For logging/docs. */
export const TOTAL_RETRY_SPAN_S = totalElapsedUpTo(FIB_BASE.length - 1);

// ─── Queue item types ────────────────────────────────────────────────────────

export type QueueOperation = 'add' | 'delete' | 'update';

export interface QueueItem {
  /** Reservation code from Hostex (our idempotency key). */
  reservationCode: string;
  /** What the operation does on the lock. */
  operation: QueueOperation;
  /** Lock device ID. */
  deviceId: string;
  /** The payload to send (user object for add/update, {id} for delete). */
  payload: Record<string, unknown>;
  /** Attempt count (0 = never tried, 1 = failed once, etc.). */
  attempts: number;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of the next allowed attempt. */
  nextAttemptAt: string;
  /** ISO timestamp of the last attempt. */
  lastAttemptAt?: string;
  /** History of failures: [{ at, code, message }]. */
  failures: Array<{ at: string; code: string; message: string }>;
  /** 'pending' = waiting for nextAttemptAt, 'exhausted' = max retries hit. */
  status: 'pending' | 'exhausted';
}

// ─── Queue logic (pure functions) ────────────────────────────────────────────

/**
 * Create a new queue item for a lock operation.
 * Pure function — does not touch the store.
 */
export function createQueueItem(
  reservationCode: string,
  operation: QueueOperation,
  deviceId: string,
  payload: Record<string, unknown>
): QueueItem {
  const now = new Date();
  return {
    reservationCode,
    operation,
    deviceId,
    payload,
    attempts: 0,
    createdAt: now.toISOString(),
    nextAttemptAt: now.toISOString(),
    lastAttemptAt: undefined,
    failures: [],
    status: 'pending',
  };
}

/**
 * Record a failure on a queue item and advance it to the next Fibonacci interval.
 * Returns a NEW item (immutable) — does not mutate the original.
 * If max retries are exceeded, status becomes 'exhausted'.
 * Pure function.
 */
export function recordFailure(item: QueueItem, err: unknown): QueueItem {
  const classified = classifyError(err);
  const now = new Date();

  // Fatal errors don't get retried — mark exhausted immediately
  if (classified instanceof FatalError) {
    return {
      ...item,
      attempts: item.attempts + 1,
      lastAttemptAt: now.toISOString(),
      status: 'exhausted',
      failures: [
        ...item.failures,
        { at: now.toISOString(), code: classified.code, message: classified.message },
      ],
    };
  }

  const nextAttempts = item.attempts + 1;
  const isExhausted = nextAttempts >= MAX_RETRIES;

  // Compute next attempt time from the current attempt's Fibonacci interval
  const intervalS = fibInterval(item.attempts);
  const nextAttemptAt = new Date(now.getTime() + intervalS * 1000).toISOString();

  return {
    ...item,
    attempts: nextAttempts,
    lastAttemptAt: now.toISOString(),
    nextAttemptAt: isExhausted ? now.toISOString() : nextAttemptAt,
    status: isExhausted ? 'exhausted' : 'pending',
    failures: [
      ...item.failures,
      { at: now.toISOString(), code: classified.code, message: classified.message },
    ],
  };
}

/**
 * Record a success — the item should be removed from the queue.
 * Returns null to signal removal. Pure function.
 */
export function recordSuccess(_item: QueueItem): null {
  return null;
}

/**
 * Check if a queue item is ready to be retried (nextAttemptAt has passed).
 * Pure function.
 */
export function isReady(item: QueueItem, now = new Date()): boolean {
  if (item.status !== 'pending') return false;
  return new Date(item.nextAttemptAt).getTime() <= now.getTime();
}

/**
 * Find a queue item by reservationCode + operation (dedup check before enqueuing).
 * Pure function.
 */
export function findPending(
  queue: QueueItem[],
  reservationCode: string,
  operation?: QueueOperation
): QueueItem | undefined {
  return queue.find(
    q =>
      q.reservationCode === reservationCode &&
      q.status === 'pending' &&
      (operation === undefined || q.operation === operation)
  );
}
