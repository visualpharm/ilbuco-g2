/**
 * Which Hostex webhooks run the inventory sync, and how bursts are folded.
 *
 * Only reservation events (created / updated / cancelled) change which nights
 * must be closed. Calendar and availability events are mostly the sync's own
 * writes echoing back; syncing on them made a self-sustaining loop (2026-11-16).
 */

export function isInventorySyncEvent(event: unknown): boolean {
  return typeof event === 'string' && event.startsWith('reservation_');
}

/**
 * Wrap a job so concurrent triggers never overlap and are never dropped:
 * a trigger during a run schedules exactly one more run after it, so the last
 * reservation change of a burst is always reflected.
 */
export function coalesce(job: () => Promise<void>): () => Promise<void> {
  let running: Promise<void> | null = null;
  let again = false;
  const loop = async () => {
    do {
      again = false;
      try { await job(); } catch (e) { console.error('[coalesce] job failed:', e); }
    } while (again);
    running = null;
  };
  return () => {
    if (running) { again = true; return running; }
    running = loop();
    return running;
  };
}
