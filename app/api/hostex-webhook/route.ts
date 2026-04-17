import { NextRequest, NextResponse } from 'next/server';
import { getConversation, sendMessage, getPropertyName, getCalendarAvailability } from '@/lib/hostex-api';
import { generateAutoResponse } from '@/lib/openrouter-client';
import { buildAutoresponderPrompt } from '@/lib/autoresponder-prompt';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// In-memory deduplication (good enough for serverless — duplicates arrive within ms)
const recentMessages = new Map<string, number>();

function isDuplicate(messageId: string): boolean {
  const now = Date.now();
  // Clean entries older than 5 minutes
  recentMessages.forEach((ts, id) => {
    if (now - ts > 5 * 60 * 1000) recentMessages.delete(id);
  });
  if (recentMessages.has(messageId)) return true;
  recentMessages.set(messageId, now);
  return false;
}

// Log interaction — console.log for Vercel's log viewer, file for local dev
function logInteraction(entry: Record<string, unknown>) {
  const logEntry = { ...entry, timestamp: new Date().toISOString(), _type: 'autoresponder' };
  // Structured log for Vercel log viewer
  console.log(JSON.stringify(logEntry));
  // Also try file-based logging (works locally, may fail on Vercel — that's fine)
  try {
    const logDir = join(process.cwd(), 'data');
    mkdirSync(logDir, { recursive: true });
    const logFile = join(logDir, 'autoresponder-log.jsonl');
    appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  } catch {
    // Expected to fail on Vercel (read-only filesystem) — logs go to console instead
  }
}

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const secret = request.headers.get('x-hostex-webhook-secret') || request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.HOSTEX_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
  }

  const body = await request.json();

  // Extract message data from webhook payload
  // Hostex webhook format may vary — handle common structures
  const messageId = body.data?.message?.id || body.message_id || body.id || '';
  const conversationId = body.data?.conversation_id || body.conversation_id || '';
  const senderRole = body.data?.message?.sender_role || body.sender_role || '';
  const messageContent = body.data?.message?.content || body.content || body.message || '';

  // Ignore host messages
  if (senderRole === 'host') {
    return NextResponse.json({ ok: true, skipped: 'host_message' });
  }

  // Ignore if no conversation ID
  if (!conversationId) {
    console.log('Webhook received without conversation_id:', JSON.stringify(body).slice(0, 200));
    return NextResponse.json({ ok: true, skipped: 'no_conversation_id' });
  }

  // Dedup
  if (messageId && isDuplicate(messageId)) {
    return NextResponse.json({ ok: true, skipped: 'duplicate' });
  }

  // TESTING MODE: only respond to whitelisted guests
  // TODO: remove this filter when going live
  const TESTING_WHITELIST = ['ivan', 'andrés', 'andres', 'duffau'];
  const guestName = (body.data?.guest?.name || '').toLowerCase();
  // Fetch guest name from conversation if not in webhook payload
  let resolvedGuestName = guestName;
  if (!resolvedGuestName && conversationId) {
    try {
      const conv = await getConversation(conversationId);
      resolvedGuestName = (conv.guest?.name || '').toLowerCase();
    } catch { /* proceed without name */ }
  }
  if (!TESTING_WHITELIST.some(w => resolvedGuestName.includes(w))) {
    console.log(`Skipping message from "${resolvedGuestName}" — not in testing whitelist`);
    return NextResponse.json({ ok: true, skipped: 'not_in_whitelist', guest: resolvedGuestName });
  }

  // Process synchronously (Vercel allows up to 60s on Pro, 10s on Hobby)
  const startTime = Date.now();
  try {
    await processMessage(conversationId, messageContent, startTime);
    return NextResponse.json({ ok: true, processed: true, ms: Date.now() - startTime });
  } catch (e) {
    console.error('Autoresponder error:', e);
    logInteraction({
      conversation_id: conversationId,
      error: String(e),
      response_time_ms: Date.now() - startTime,
    });
    return NextResponse.json({ ok: true, error: String(e).slice(0, 200) }, { status: 200 });
  }
}

async function processMessage(conversationId: string, incomingMessage: string, startTime: number) {
  // 1. Fetch conversation context
  const conversation = await getConversation(conversationId);

  const guest = conversation.guest;
  const activity = conversation.activities?.[0];
  const propertyId = activity?.property?.id;
  const suiteName = propertyId ? getPropertyName(propertyId) : (activity?.property?.title || 'Unknown');
  const checkIn = activity?.check_in_date || '';
  const checkOut = activity?.check_out_date || '';
  const channel = conversation.channel_type || 'unknown';

  // Use the actual latest guest message from conversation if incoming was empty
  const messages = [...(conversation.messages || [])].reverse(); // chronological
  const latestGuestMessage = incomingMessage ||
    messages.filter(m => m.sender_role === 'guest' && m.display_type === 'Text')
      .pop()?.content || '';

  if (!latestGuestMessage) {
    logInteraction({
      conversation_id: conversationId,
      guest_name: guest?.name,
      skipped: 'empty_message',
    });
    return;
  }

  // 2. Build conversation history (last 10 messages for context)
  const recentMessages = messages.slice(-10);
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const m of recentMessages) {
    if (m.display_type !== 'Text') continue;
    if (m.content === latestGuestMessage && m.sender_role === 'guest') continue; // skip the current message
    history.push({
      role: m.sender_role === 'guest' ? 'user' : 'assistant',
      content: m.content,
    });
  }

  // 3. Check if message might be about availability (fetch calendar if so)
  let availabilityText: string | undefined;
  const availKeywords = ['disponib', 'available', 'fecha', 'extend', 'más noches', 'more nights', 'otra habitación', 'other room'];
  if (availKeywords.some(kw => latestGuestMessage.toLowerCase().includes(kw))) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const avail = await getCalendarAvailability(today, endDate);
      const available = avail.rooms.filter(r => r.available);
      if (available.length > 0) {
        availabilityText = available.map(r =>
          `${r.name}: available, from $${r.price}/night`
        ).join('\n');
      } else {
        availabilityText = 'No rooms currently available in the next 90 days.';
      }
    } catch {
      // Non-critical, proceed without availability data
    }
  }

  // 4. Build prompt and generate response
  const systemPrompt = buildAutoresponderPrompt({
    guestName: guest?.name || 'Guest',
    suiteName,
    checkIn,
    checkOut,
    channel,
    availabilityText,
  });

  const result = await generateAutoResponse(systemPrompt, history, latestGuestMessage);
  const responseTime = Date.now() - startTime;

  // 5. Act on the result
  if (result.confidence === 'auto' && result.reply.trim()) {
    await sendMessage(conversationId, result.reply);
  }

  // 6. Log everything
  logInteraction({
    conversation_id: conversationId,
    guest_name: guest?.name,
    property: suiteName,
    channel,
    check_in: checkIn,
    guest_message: latestGuestMessage,
    ai_response: result.reply,
    confidence: result.confidence,
    escalation_reason: result.escalation_reason,
    response_time_ms: responseTime,
    language: result.language,
    model: process.env.AUTORESPONDER_MODEL || 'gemini-2.5-pro-preview-05-06',
    sent: result.confidence === 'auto' && !!result.reply.trim(),
  });
}
