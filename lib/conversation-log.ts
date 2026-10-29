import { promises as fs } from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs', 'conversations');

/**
 * Append one conversation entry to the day's JSONL log.
 * Vercel functions have a read-only project directory, so there the entry goes
 * to the function log as one JSON line; locally it is appended to logs/conversations.
 */
export async function appendConversationLog(kind: string, entry: Record<string, unknown>): Promise<void> {
  const line = JSON.stringify({ ...entry, kind, loggedAt: new Date().toISOString() });
  if (process.env.VERCEL) {
    console.log(`[conversation-log] ${line.slice(0, 16000)}`);
    return;
  }
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(path.join(LOG_DIR, `${kind}-${new Date().toISOString().split('T')[0]}.jsonl`), line + '\n');
  } catch (error) {
    console.error('[conversation-log] write failed:', error);
  }
}
