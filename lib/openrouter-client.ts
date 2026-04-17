// AI client for Il Buco autoresponder — Gemini primary, OpenAI fallback

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const MODEL = process.env.AUTORESPONDER_MODEL || 'gemini-2.5-pro';
const FALLBACK_MODEL = 'gemini-2.5-flash';
const OPENAI_MODEL = 'gpt-4.1-mini';

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  return new GoogleGenerativeAI(apiKey);
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
  return new OpenAI({ apiKey });
}

export interface AutoresponderResult {
  confidence: 'auto' | 'escalate';
  reply: string;
  escalation_reason?: string;
  language: string;
  model?: string;
}

function buildGeminiHistory(conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>) {
  let history = conversationHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  // Drop leading 'model' messages (Gemini requires first to be 'user')
  while (history.length > 0 && history[0].role === 'model') {
    history = history.slice(1);
  }

  // Ensure alternating roles (merge consecutive same-role messages)
  const clean: typeof history = [];
  for (const msg of history) {
    if (clean.length > 0 && clean[clean.length - 1].role === msg.role) {
      clean[clean.length - 1].parts[0].text += '\n' + msg.parts[0].text;
    } else {
      clean.push(msg);
    }
  }
  return clean;
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
    errMsg.includes('high demand') || errMsg.includes('overloaded');
}

async function tryGemini(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  latestMessage: string
): Promise<AutoresponderResult | null> {
  const client = getGeminiClient();
  const history = buildGeminiHistory(conversationHistory);

  for (const modelId of [MODEL, FALLBACK_MODEL]) {
    try {
      const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          responseMimeType: 'application/json',
        },
        systemInstruction: systemPrompt,
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(latestMessage);
      const raw = result.response.text();
      return parseResult(raw, modelId);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (isTransientError(errMsg)) {
        console.log(`Gemini ${modelId} unavailable (${errMsg.slice(0, 100)}), trying next...`);
        continue;
      }
      throw e;
    }
  }
  return null; // All Gemini models failed
}

async function tryOpenAI(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  latestMessage: string
): Promise<AutoresponderResult> {
  const client = getOpenAIClient();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content,
    })),
    { role: 'user', content: latestMessage },
  ];

  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '{}';
  return parseResult(raw, OPENAI_MODEL);
}

export async function generateAutoResponse(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  latestMessage: string
): Promise<AutoresponderResult> {
  // Try Gemini first (cheaper)
  const geminiResult = await tryGemini(systemPrompt, conversationHistory, latestMessage).catch(e => {
    console.log(`Gemini failed entirely: ${String(e).slice(0, 100)}`);
    return null;
  });
  if (geminiResult) return geminiResult;

  // Fall back to OpenAI
  console.log('All Gemini models exhausted, falling back to OpenAI...');
  return tryOpenAI(systemPrompt, conversationHistory, latestMessage);
}
