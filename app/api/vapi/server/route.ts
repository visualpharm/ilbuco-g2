/**
 * Vapi server for the Il Buco phone agent (+54 223 432-2010).
 *
 * Tools (scripts/configure_vapi_assistant.js defines them for the model):
 * - check_availability: free or not, what exactly, price per night and total (lib/voice-quote.ts)
 * - suggest_stays: no exact dates yet — the earliest free stays in a window, priced, and how long it stays free
 * - hold_booking: hold an offer for 10 minutes, the unique peso amount, the Ripio alias (lib/voice-hold.ts)
 * - check_payment: did the exact amount arrive (munk bridge); paid → booked in Hostex
 * - take_message: name, number and what they need → noe; "le paso tu número a Iván y te escribe"
 *
 * No transfer to a person (Ivan, 2026-11-16). After every tool call the server sweeps expired holds
 * (after the answer: the sweep's last Ripio check of a due hold takes seconds the caller must not
 * wait); the cron /api/vapi/holds/sweep does the same each minute.
 */
import { NextRequest, NextResponse, after } from 'next/server';
import { verifyVapiWebhookSecret, VAPI_WEBHOOK_SECRET_HEADER } from '@/lib/vapi-auth';
import { appendConversationLog } from '@/lib/conversation-log';
import { notifyVoice } from '@/lib/hub-wake';
import { findDeposit } from '@/lib/payment-bridge';
import { checkPayment, createHold, liveHoldDeps, normalizePhone, sweepHolds, type Hold } from '@/lib/voice-hold';
import {
  fetchVoiceCalendar, makeOffer, offersForModel, parseOfferId, requestProblem, siteQuote, todayArt, unitByKey, voiceQuote, voiceSuggest,
} from '@/lib/voice-quote';
import { ALIAS_PAGO, aliasPorSilabas, dineroEnPalabras, rangoHablado } from '@/lib/spoken-es';

export const maxDuration = 60;

/** Our own AR line: calls from it are self-tests (notices marked test, never a real booking). */
const SELF_TEST_NUMBERS = new Set(['+542234322010']);
const GREETING = 'Hola, Il Buco, ¿qué tal?';

interface ToolCall { id: string; function: { name: string; arguments: unknown } }

interface VapiServerMessage {
  message: {
    type: string;
    call?: { id: string; customer?: { number?: string } };
    toolCallList?: ToolCall[];
    toolWithToolCallList?: Array<{ toolCall: ToolCall }>;
    artifact?: { transcript?: string; messages?: Array<{ role: string; message: string; time: number }>; recordingUrl?: string };
    status?: string;
  };
}

function parseToolArguments(rawArgs: unknown): Record<string, unknown> {
  if (!rawArgs) return {};
  if (typeof rawArgs === 'string') {
    try { return JSON.parse(rawArgs) as Record<string, unknown>; } catch { return {}; }
  }
  return typeof rawArgs === 'object' ? rawArgs as Record<string, unknown> : {};
}

/** "2026-12-05", "2026/12/5", "20261205" → "2026-12-05"; anything else → '' */
function normalizeDateInput(dateInput: unknown): string {
  const s = String(dateInput ?? '').trim();
  const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
  const m = compact ?? /(\d{4})\D+(\d{1,2})\D+(\d{1,2})/.exec(s);
  if (!m) return '';
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return '';
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

interface CallCtx { callId: string; caller: string; test: boolean }

const str = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);

function holdDeps(ctx: CallCtx) {
  return liveHoldDeps({
    findDeposit: (amount, since, wait, mode) => findDeposit(amount, since, wait, mode),
    notify: n => notifyVoice({ ...n, ...(ctx.test ? { test: true } : {}) }),
  });
}

/** Pesos only in words: digits in the spoken line come out of the voice as English ("one point…"). */
function montoHablado(h: Hold): string {
  return dineroEnPalabras(h.amount, 'ARS');
}

function quoteAnswer(q: { say: string; offers: Parameters<typeof offersForModel>[0]; note?: string }): string {
  return `DECÍ: ${q.say}` +
    (q.offers.length ? `\nOFERTAS para hold_booking: ${offersForModel(q.offers)}` : '') +
    (q.note ? `\nNO LO LEAS, REGLA: ${q.note}` : '');
}

async function toolCheckAvailability(p: Record<string, unknown>): Promise<string> {
  const guests = Number(p.guests) || 0;
  const req = {
    checkIn: normalizeDateInput(p.check_in),
    checkOut: normalizeDateInput(p.check_out),
    // people not said yet: quote for two and ask after the price, not before
    guests: guests || 2,
    unit: str(p.unit, 20).toLowerCase() || 'any',
  };
  const q = await voiceQuote(req);
  const note = guests ? q.note : [q.note, 'No sabés cuántos son: el precio es para dos. Después preguntá solo "¿cuántos serían?" y, si son más, volvé a buscar.'].filter(Boolean).join(' ');
  return quoteAnswer({ ...q, note });
}

/** No exact dates ("desde hoy unos días", "el finde", "en enero"): the code picks the stays. */
async function toolSuggestStays(p: Record<string, unknown>): Promise<string> {
  const q = await voiceSuggest({
    from: normalizeDateInput(p.from),
    until: normalizeDateInput(p.until),
    nights: Number(p.nights) || 0,
    guests: Number(p.guests) || 0,
    unit: str(p.unit, 20).toLowerCase() || 'any',
  });
  return quoteAnswer(q);
}

async function toolHoldBooking(p: Record<string, unknown>, ctx: CallCtx): Promise<string> {
  const req = parseOfferId(str(p.offer_id, 60));
  const name = str(p.name, 80);
  if (!req) return 'ERROR: offer_id inválido. Volvé a llamar check_availability y usá un id de OFERTAS.';
  if (!name) return 'FALTA: preguntale el nombre antes de reservar.';
  const problem = requestProblem(req, todayArt());
  if (problem) return `DECÍ: ${problem}`;
  const unit = unitByKey(req.unit)!;
  const [cal, q] = await Promise.all([
    fetchVoiceCalendar(req.checkIn, req.checkOut),
    siteQuote(unit, req.checkIn, req.checkOut, req.guests),
  ]);
  const offer = makeOffer(unit, cal, req.checkIn, req.checkOut, req.guests, q);
  if (!offer) return 'DECÍ: Uy, justo esas fechas se acaban de ocupar. ¿Te busco otras?';
  const phone = normalizePhone(str(p.phone, 30)) || ctx.caller;
  const r = await createHold(offer, { name, phone, callId: ctx.callId, test: ctx.test }, holdDeps(ctx));
  if (!r.ok) {
    return r.why === 'taken'
      ? 'DECÍ: Uy, justo esas fechas se acaban de ocupar. ¿Te busco otras?'
      : 'DECÍ: No pude dejarlo apartado ahora. Le paso tus datos a Iván y te escribe enseguida. (Llamá take_message con el motivo.)';
  }
  const h = r.hold;
  return `DECÍ, despacio: Listo, ${name}, te aparto ${unit.key === 'casa' ? 'la casa entera' : unit.spoken} ${rangoHablado(h.checkIn, h.checkOut)} por diez minutos. ` +
    `Para confirmarla transferí exactamente ${montoHablado(h)}, justo ese número, así reconozco tu transferencia. ` +
    `El alias te lo dicto por sílabas: ${aliasPorSilabas()}. Está en Ripio, a nombre de Ivan Boyko. ` +
    `Avisame cuando la hagas y me quedo en línea mientras llega.\n` +
    `(No lo leas: monto en dígitos ${h.amount.toLocaleString('es-AR')}, alias escrito ${ALIAS_PAGO}, por si te lo piden por escrito.)\n` +
    `HOLD_ID para check_payment: ${h.id}. Teléfono guardado: ${h.phone || 'ninguno'}.`;
}

async function toolCheckPayment(p: Record<string, unknown>, ctx: CallCtx): Promise<string> {
  const id = str(p.hold_id, 40);
  const r = await checkPayment(id, holdDeps(ctx));
  switch (r.state) {
    case 'booked':
      return `DECÍ: ¡Llegó! Listo, quedó reservado ${rangoHablado(r.hold.checkIn, r.hold.checkOut)}. Te escribimos por WhatsApp con todos los detalles. ¡Gracias!`;
    case 'paid_unbooked':
      return 'DECÍ: La transferencia llegó, gracias. Termino de cargar la reserva y te la confirmo por WhatsApp en un rato.';
    case 'pending':
      return `TODAVÍA NO LLEGÓ (quedan ${Math.ceil(r.secondsLeft / 60)} minutos del apartado). Decile algo corto como "todavía no me aparece, a veces tarda un minutito" ` +
        'y, si ya transfirió, volvé a llamar check_payment. No repitas el alias salvo que te lo pida.';
    case 'expired':
      return 'DECÍ: Todavía no me aparece la transferencia. Lo reviso y te escribo por WhatsApp apenas la vea.';
    case 'unverified':
      return 'DECÍ: Ahora no lo puedo ver desde acá. Apenas lo vea te confirmo por WhatsApp.';
    default:
      return 'ERROR: hold_id desconocido. Usá el HOLD_ID que devolvió hold_booking.';
  }
}

async function toolTakeMessage(p: Record<string, unknown>, ctx: CallCtx): Promise<string> {
  const name = str(p.name, 80);
  const phone = normalizePhone(str(p.phone, 30)) || ctx.caller;
  const reason = str(p.reason, 500);
  const res = await notifyVoice({
    id: `${ctx.callId}-callback-${Date.now().toString(36)}`, kind: 'callback', name, phone, reason,
    call_id: ctx.callId, ...(ctx.test ? { test: true } : {}),
  });
  if (!res.ok) console.error('[Vapi Server] take_message notify failed:', res.status ?? res.error);
  return `DECÍ: Dale${name ? `, ${name}` : ''}, le paso tu número a Iván y te escribe.`;
}

async function runTool(name: string, params: Record<string, unknown>, ctx: CallCtx): Promise<string> {
  try {
    // a hold carries its own test flag: the sweep's notices must not take this call's
    if (name !== 'check_availability' && name !== 'suggest_stays') after(() => sweepHolds(holdDeps({ ...ctx, test: false })).then(() => undefined, () => undefined));
    switch (name) {
      case 'check_availability': return await toolCheckAvailability(params);
      case 'suggest_stays': return await toolSuggestStays(params);
      case 'hold_booking': return await toolHoldBooking(params, ctx);
      case 'check_payment': return await toolCheckPayment(params, ctx);
      case 'take_message': return await toolTakeMessage(params, ctx);
      default: return `ERROR: herramienta desconocida ${name}`;
    }
  } catch (e) {
    console.error(`[Vapi Server] ${name} failed:`, e);
    return 'DECÍ: Se me trabó el sistema justo ahora. Dejame tu nombre y te escribimos enseguida. (Después llamá take_message.)';
  }
}

export async function POST(request: NextRequest) {
  if (!verifyVapiWebhookSecret(request.headers.get(VAPI_WEBHOOK_SECRET_HEADER))) {
    console.error('[Vapi Server] Rejected request: missing/invalid webhook secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: VapiServerMessage = await request.json();
    const m = body.message;
    const callId = m?.call?.id || 'unknown';
    const caller = normalizePhone(m?.call?.customer?.number ?? '');
    const ctx: CallCtx = { callId, caller, test: SELF_TEST_NUMBERS.has(caller) };
    console.log(`[Vapi Server] ${m?.type}`, callId);

    if (m?.type === 'assistant-request') {
      return NextResponse.json({ assistant: { firstMessage: GREETING } });
    }

    if (m?.type === 'end-of-call-report') {
      await appendConversationLog('voice', {
        callId,
        type: 'voice',
        timestamp: new Date().toISOString(),
        transcript: m.artifact?.transcript,
        messages: m.artifact?.messages,
        customerNumber: m.call?.customer?.number,
        recordingUrl: m.artifact?.recordingUrl,
      });
      return NextResponse.json({ status: 'logged' });
    }

    if (m?.type === 'tool-calls') {
      const calls = m.toolCallList || m.toolWithToolCallList?.map(t => t.toolCall) || [];
      const results = [];
      for (const call of calls) {
        const name = call.function.name;
        const t0 = Date.now();
        const result = await runTool(name, parseToolArguments(call.function.arguments), ctx);
        console.log(`[Vapi Server] ${name} ${Date.now() - t0}ms`, result.slice(0, 160));
        results.push({ name, toolCallId: call.id, result });
      }
      return NextResponse.json({ results });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Vapi Server] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/vapi/server' });
}
