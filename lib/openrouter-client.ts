// AI client for Il Buco autoresponder — all models via OpenRouter

import OpenAI from 'openai';

const PRIMARY_MODEL = 'google/gemini-2.5-pro-preview';
const FALLBACK_MODEL = 'anthropic/claude-opus-4-6';

function getClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');
  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://ilbuco.com.ar',
      'X-Title': 'Il Buco Autoresponder',
    },
  });
}

export interface AutoresponderResult {
  confidence: 'auto' | 'escalate';
  reply: string;
  escalation_reason?: string;
  language: string;
  model?: string;
}

function parseResult(raw: string, modelUsed: string): AutoresponderResult {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    const reply = typeof parsed.reply === 'string' ? parsed.reply : '';
    // Sanity check: reply should look like a human message, not JSON/code
    if (reply && (reply.startsWith('{') || reply.startsWith('[') || reply.length < 2)) {
      console.log(`Suspicious reply from ${modelUsed}: ${reply.slice(0, 50)}`);
      return { confidence: 'escalate', reply: '', escalation_reason: 'malformed_ai_response', language: parsed.language || 'es', model: modelUsed };
    }
    return {
      confidence: parsed.confidence === 'escalate' ? 'escalate' : 'auto',
      reply,
      escalation_reason: parsed.escalation_reason || undefined,
      language: parsed.language || 'es',
      model: modelUsed,
    };
  } catch {
    // JSON parse failed — if the raw text looks like a real message (not code/JSON), use it
    if (cleaned.length > 5 && !cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      return { confidence: 'auto', reply: cleaned, language: 'es', model: modelUsed };
    }
    // Otherwise escalate rather than send garbage
    console.log(`Unparseable response from ${modelUsed}: ${cleaned.slice(0, 80)}`);
    return { confidence: 'escalate', reply: '', escalation_reason: 'unparseable_ai_response', language: 'es', model: modelUsed };
  }
}

// Check if error is transient and should trigger fallback
function isTransientError(errMsg: string): boolean {
  return errMsg.includes('429') || errMsg.includes('404') || errMsg.includes('quota') ||
    errMsg.includes('503') || errMsg.includes('500') || errMsg.includes('Service Unavailable') ||
    errMsg.includes('high demand') || errMsg.includes('overloaded') || errMsg.includes('rate_limit');
}

export async function generateAutoResponse(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  latestMessage: string
): Promise<AutoresponderResult> {
  const client = getClient();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content,
    })),
    { role: 'user', content: latestMessage },
  ];

  for (const modelId of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const response = await client.chat.completions.create({
        model: modelId,
        messages,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const raw = response.choices[0]?.message?.content || '{}';
      return parseResult(raw, modelId);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (isTransientError(errMsg)) {
        console.log(`${modelId} unavailable (${errMsg.slice(0, 100)}), trying fallback...`);
        continue;
      }
      throw e;
    }
  }

  throw new Error('All models exhausted');
}
