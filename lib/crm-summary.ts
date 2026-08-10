/**
 * AI-powered guest happiness summary generator.
 *
 * Analyzes a guest's reservation history + message conversations + reviews
 * to produce a GuestSummary with happiness score (1-5), sentiment, key
 * moments, and a recommended outreach offer.
 *
 * Uses OpenRouter (Gemini → Claude fallback) via the same client pattern
 * as the autoresponder.
 */

import OpenAI from 'openai';
import type { CrmGuest, GuestSummary } from './crm-store';

const PRIMARY_MODEL = 'google/gemini-3.1-pro-preview';
const FALLBACK_MODEL = 'anthropic/claude-opus-4.7';

function getClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');
  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://ilbuco.com.ar',
      'X-Title': 'Il Buco CRM',
    },
  });
}

const SYSTEM_PROMPT = `You are a hospitality CRM analyst for Il Buco, a luxury tech-focused rental villa in Cariló, Argentina.

You analyze a guest's conversation history, reservations, and reviews to produce a concise happiness assessment.

Your output MUST be valid JSON (no markdown, no code fences) with this exact shape:
{
  "happinessScore": <number 1-5, where 5 = very happy, 1 = very unhappy>,
  "sentiment": "<happy|neutral|unhappy>",
  "summary": "<1-2 sentence summary of the guest's experience and personality>",
  "keyMoments": ["<short bullet>", "<short bullet>"],
  "recommendedOffer": "<one specific outreach offer that fits this guest>",
  "language": "<es|en|pt|ru — the language the guest communicates in>"
}

Scoring guide (1-5 scale, NOT 1-10):
  5 = Enthusiastic, left glowing review, wants to return, referred others
  4 = Clearly satisfied, positive review, smooth stay
  3 = Neutral/adequate, no complaints but no enthusiasm
  2 = Some issues or complaints, muted satisfaction
  1 = Unhappy, complaints, problems during stay

Be concise. The recommendedOffer should be actionable (e.g., "off-season monthly rate", "return discount", "team retreat package"). Respond in the guest's language for summary and recommendedOffer.`;

function buildGuestContext(guest: CrmGuest): string {
  const parts: string[] = [];

  parts.push(`Guest: ${guest.name}`);
  if (guest.country) parts.push(`Country: ${guest.country}`);
  parts.push(`Language: ${guest.language}`);
  parts.push(`Channels: ${guest.channels.join(', ')}`);

  // Reservations
  if (guest.reservations.length > 0) {
    parts.push(`\nReservations (${guest.reservations.length}):`);
    for (const r of guest.reservations) {
      parts.push(`  - ${r.code}: ${r.property}, ${r.checkIn} → ${r.checkOut}, ${r.guests} guests, ${r.channel}${r.totalRate ? `, ${r.currency} ${r.totalRate}` : ''}`);
    }
  }

  // Review
  if (guest.reviewScore !== undefined || guest.reviewContent) {
    parts.push(`\nReview:`);
    if (guest.reviewScore !== undefined) parts.push(`  Score: ${guest.reviewScore}/5`);
    if (guest.reviewContent) parts.push(`  Content: "${guest.reviewContent}"`);
  }

  // Messages (last 30 to keep prompt manageable)
  if (guest.messages.length > 0) {
    const recent = guest.messages.slice(-30);
    parts.push(`\nRecent messages (${recent.length} of ${guest.messages.length}):`);
    for (const m of recent) {
      const dir = m.direction === 'inbound' ? 'GUEST' : 'HOST';
      parts.push(`  [${dir}] ${m.text}`);
    }
  }

  return parts.join('\n');
}

function parseSummary(raw: string): GuestSummary {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);

  // Clamp happiness to 1-5
  let happiness = Number(parsed.happinessScore);
  if (!Number.isFinite(happiness)) happiness = 3;
  happiness = Math.max(1, Math.min(5, Math.round(happiness * 10) / 10));

  let sentiment: GuestSummary['sentiment'] = 'neutral';
  if (parsed.sentiment === 'happy') sentiment = 'happy';
  else if (parsed.sentiment === 'unhappy') sentiment = 'unhappy';

  return {
    happinessScore: happiness,
    sentiment,
    summary: String(parsed.summary || '').slice(0, 500),
    keyMoments: Array.isArray(parsed.keyMoments)
      ? parsed.keyMoments.map(String).slice(0, 5)
      : [],
    language: String(parsed.language || 'es'),
    recommendedOffer: String(parsed.recommendedOffer || '').slice(0, 300),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate a happiness summary for a single guest.
 * Falls back gracefully if AI is unavailable.
 */
export async function generateGuestSummary(guest: CrmGuest): Promise<GuestSummary | null> {
  // Skip guests with no data to analyze
  if (guest.messages.length === 0 && guest.reviewContent === undefined && guest.reservations.length === 0) {
    return null;
  }

  const client = getClient();
  const context = buildGuestContext(guest);

  for (const modelId of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const response = await client.chat.completions.create({
        model: modelId,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this guest and produce the JSON happiness summary:\n\n${context}` },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      const raw = response.choices[0]?.message?.content || '';
      return parseSummary(raw);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('500')) {
        console.log(`[crm-summary] ${modelId} unavailable, trying fallback...`);
        continue;
      }
      console.error(`[crm-summary] Error generating summary for ${guest.id}:`, errMsg);
      return null;
    }
  }

  return null;
}

/**
 * Generate summaries for all guests that don't have one yet (or are stale).
 * Processes in small batches to avoid rate limits.
 *
 * @param guests  All CRM guests
 * @param onUpdate Optional callback after each summary is generated
 * @param maxToProcess Cap on how many to process in one run (default 20)
 * @returns Map of guestId → GuestSummary
 */
export async function generateBatchSummaries(
  guests: CrmGuest[],
  onUpdate?: (done: number, total: number) => void,
  maxToProcess = 20
): Promise<Map<string, GuestSummary>> {
  const results = new Map<string, GuestSummary>();

  // Only generate for guests with enough data and no (or stale) summary
  const STALE_MS = 7 * 24 * 3600 * 1000; // 7 days
  const now = Date.now();
  const candidates = guests.filter(g => {
    if (g.messages.length === 0 && !g.reviewContent) return false;
    if (!g.summary) return true;
    const age = now - new Date(g.summary.generatedAt).getTime();
    return age > STALE_MS;
  });

  const toProcess = candidates.slice(0, maxToProcess);
  console.log(`[crm-summary] ${candidates.length} candidates, processing ${toProcess.length}`);

  for (let i = 0; i < toProcess.length; i++) {
    const guest = toProcess[i];
    try {
      const summary = await generateGuestSummary(guest);
      if (summary) results.set(guest.id, summary);
    } catch (err) {
      console.error(`[crm-summary] Failed for ${guest.id}:`, err);
    }

    // Small delay between requests to be gentle on rate limits
    if (i < toProcess.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }

    onUpdate?.(i + 1, toProcess.length);
  }

  return results;
}
