import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface LogEntry {
  timestamp: string;
  conversation_id: string;
  guest_name: string;
  property: string;
  channel: string;
  guest_message: string;
  ai_response: string;
  confidence: 'auto' | 'escalate';
  escalation_reason?: string;
  response_time_ms: number;
  language: string;
  model: string;
  sent: boolean;
  error?: string;
}

function readLog(): LogEntry[] {
  const logFile = join(process.cwd(), 'data', 'autoresponder-log.jsonl');
  if (!existsSync(logFile)) return [];
  const content = readFileSync(logFile, 'utf-8');
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as LogEntry[];
}

export async function GET(request: NextRequest) {
  // Simple password protection
  const password = request.nextUrl.searchParams.get('key');
  if (password !== process.env.DASHBOARD_KEY && password !== 'ilbuco2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = readLog();

  if (entries.length === 0) {
    return NextResponse.json({
      total: 0,
      message: 'No autoresponder interactions logged yet',
    });
  }

  // Calculate metrics
  const autoEntries = entries.filter(e => e.confidence === 'auto' && e.sent);
  const escalatedEntries = entries.filter(e => e.confidence === 'escalate');
  const errorEntries = entries.filter(e => e.error);

  const responseTimes = entries
    .filter(e => e.response_time_ms > 0)
    .map(e => e.response_time_ms);

  const avgResponseTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  const medianResponseTime = responseTimes.length > 0
    ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length / 2)]
    : 0;

  // Escalation reasons breakdown
  const escalationReasons: Record<string, number> = {};
  for (const e of escalatedEntries) {
    const reason = e.escalation_reason || 'unknown';
    escalationReasons[reason] = (escalationReasons[reason] || 0) + 1;
  }

  // By channel
  const byChannel: Record<string, number> = {};
  for (const e of entries) {
    byChannel[e.channel] = (byChannel[e.channel] || 0) + 1;
  }

  // By property
  const byProperty: Record<string, number> = {};
  for (const e of entries) {
    if (e.property) byProperty[e.property] = (byProperty[e.property] || 0) + 1;
  }

  // Daily volume (last 30 days)
  const dailyVolume: Record<string, { auto: number; escalated: number }> = {};
  for (const e of entries) {
    const day = e.timestamp?.split('T')[0];
    if (!day) continue;
    if (!dailyVolume[day]) dailyVolume[day] = { auto: 0, escalated: 0 };
    if (e.confidence === 'auto' && e.sent) dailyVolume[day].auto++;
    if (e.confidence === 'escalate') dailyVolume[day].escalated++;
  }

  // Recent conversations
  const recent = entries.slice(-20).reverse().map(e => ({
    timestamp: e.timestamp,
    guest: e.guest_name,
    property: e.property,
    channel: e.channel,
    message: e.guest_message?.slice(0, 100),
    response: e.ai_response?.slice(0, 100),
    confidence: e.confidence,
    escalation_reason: e.escalation_reason,
    response_time_ms: e.response_time_ms,
    sent: e.sent,
  }));

  return NextResponse.json({
    summary: {
      total: entries.length,
      auto_responded: autoEntries.length,
      escalated: escalatedEntries.length,
      errors: errorEntries.length,
      auto_rate: entries.length > 0 ? Math.round((autoEntries.length / entries.length) * 100) : 0,
    },
    response_time: {
      avg_ms: avgResponseTime,
      median_ms: medianResponseTime,
      avg_seconds: Math.round(avgResponseTime / 1000),
    },
    escalation_reasons: escalationReasons,
    by_channel: byChannel,
    by_property: byProperty,
    daily_volume: dailyVolume,
    recent,
  });
}
