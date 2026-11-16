import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isInventorySyncEvent, coalesce } from './webhook-inventory-trigger.ts';

test('only reservation events trigger the inventory sync, never its own calendar/availability echoes', () => {
  for (const e of ['reservation_created', 'reservation_updated', 'reservation_cancelled']) assert.equal(isInventorySyncEvent(e), true, e);
  for (const e of ['listing_calendar_updated', 'property_availability_updated', 'message_created', 'review_created', '', undefined]) {
    assert.equal(isInventorySyncEvent(e), false, String(e));
  }
});

test('coalesce: a trigger during a run is never dropped, a burst costs one extra run', async () => {
  let runs = 0;
  let release!: () => void;
  const run = coalesce(async () => {
    runs++;
    if (runs === 1) await new Promise<void>(r => { release = r; });
  });
  const first = run();
  const during = [run(), run(), run()];
  await new Promise(r => setImmediate(r));
  release();
  await Promise.all([first, ...during]);
  assert.equal(runs, 2, 'first run + one rerun for the whole burst');
  await run();
  assert.equal(runs, 3, 'an idle trigger runs immediately');
});
