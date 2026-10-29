import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync } from 'fs';
import path from 'path';
import { appendConversationLog } from './conversation-log';

test('on Vercel the entry goes to the function log, not the read-only project dir', async () => {
  const prev = process.env.VERCEL;
  const lines: string[] = [];
  const orig = console.log;
  process.env.VERCEL = '1';
  console.log = (...a: unknown[]) => { lines.push(a.join(' ')); };
  const before = existsSync(path.join(process.cwd(), 'logs', 'conversations'));
  try {
    await appendConversationLog('voice', { callId: 'c1' });
  } finally {
    console.log = orig;
    if (prev === undefined) delete process.env.VERCEL; else process.env.VERCEL = prev;
  }
  assert.equal(lines.length, 1);
  const entry = JSON.parse(lines[0].replace('[conversation-log] ', ''));
  assert.equal(entry.callId, 'c1');
  assert.equal(entry.kind, 'voice');
  assert.equal(existsSync(path.join(process.cwd(), 'logs', 'conversations')), before);
});
