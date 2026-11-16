#!/usr/bin/env node
/**
 * Il Buco phone agent (+54 223 432-2010) — Vapi assistant configuration.
 *
 *   node scripts/configure_vapi_assistant.js            # PATCH the live assistant
 *   node scripts/configure_vapi_assistant.js --dry-run  # print the config without secrets
 *
 * Reads VAPI_PRIVATE_KEY, VAPI_WEBHOOK_SECRET, VAPI_ASSISTANT_ID from the environment or
 * .env.local (main checkout); never prints them. Optional overrides for side-by-side tests:
 * VAPI_MODEL_PROVIDER / VAPI_MODEL, VAPI_VOICE (beto-flash | beto-turbo | tomas-azure).
 *
 * Tone (Ivan, 2026-11-16): someone from the house, rioplatense, "vos", short lines, says
 * "dejame que me fijo" and looks it up; never presents itself as an assistant, admits being
 * a bot in one sentence when asked seriously; no transfer to a person — takes name and
 * number for Iván. Facts: lib/knowledge-base.ts. Tools: app/api/vapi/server/route.ts.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

function loadEnv() {
  const env = { ...process.env };
  for (const p of [path.join(process.cwd(), '.env.local'), path.join(process.env.HOME || '', 'projects/ilbuco-g2/.env.local')]) {
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !env[m[1]]) env[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    }
    break;
  }
  return env;
}

const env = loadEnv();
const DRY = process.argv.includes('--dry-run');
for (const k of ['VAPI_PRIVATE_KEY', 'VAPI_WEBHOOK_SECRET', 'VAPI_ASSISTANT_ID']) {
  if (!env[k] && !DRY) { console.error(`${k} not configured (.env.local or the environment)`); process.exit(1); }
}

const SERVER = {
  url: env.VAPI_SERVER_URL || 'https://ilbuco.com.ar/api/vapi/server',
  timeoutSeconds: 40,
  // static header Vapi sends back on every webhook call, checked in lib/vapi-auth.ts
  headers: { 'x-vapi-webhook-secret': env.VAPI_WEBHOOK_SECRET || '<secret>' },
};

const MODELS = {
  'openai:gpt-4.1': { provider: 'openai', model: 'gpt-4.1' },
  'anthropic:claude-haiku-5-5': { provider: 'anthropic', model: 'claude-haiku-5-5' },
  'google:gemini-3.8-flash': { provider: 'google', model: 'gemini-3.8-flash' },
};
const MODEL = { provider: env.VAPI_MODEL_PROVIDER || 'openai', model: env.VAPI_MODEL || 'gpt-4.1' };

const VOICES = {
  // Beto — Argentine male, ElevenLabs
  'beto-flash': { provider: '11labs', voiceId: 'ukupJ4zdf9bo1Py6MiO6', model: 'eleven_flash_v2_5', stability: 0.45, similarityBoost: 0.8, style: 0.2, useSpeakerBoost: true },
  'beto-turbo': { provider: '11labs', voiceId: 'ukupJ4zdf9bo1Py6MiO6', model: 'eleven_turbo_v2_5', stability: 0.45, similarityBoost: 0.8, style: 0.2, useSpeakerBoost: true },
  'tomas-azure': { provider: 'azure', voiceId: 'es-AR-TomasNeural' },
};
const VOICE = VOICES[env.VAPI_VOICE || 'beto-flash'];
if (!VOICE) { console.error(`unknown VAPI_VOICE ${env.VAPI_VOICE}; one of ${Object.keys(VOICES).join(', ')}`); process.exit(1); }

const PROMPT = `Atendés el teléfono de Il Buco, una casa con cuatro suites en Cariló, calle Paraíso 324. Sos alguien de la casa: hablás rioplatense, de vos, cálido y directo, como una persona que conoce la casa. Frases cortas, una o dos por turno. Nada de "estimado", "¿en qué más puedo ayudarle?" ni formalidades.

QUIÉN SOS
- No te presentes como asistente, ni virtual, ni inteligencia artificial.
- Si te preguntan en serio si sos un robot o una máquina, decí la verdad en una frase, por ejemplo "Sí, soy un asistente automático de la casa, pero te resuelvo casi todo", y seguí ayudando. Nunca lo niegues.
- No ofrezcas pasar con una persona. Resolvé vos.
- Si piden hablar con alguien, o es algo que no podés resolver (algo roto en la casa, una queja, un pedido especial, algo que no sabés): pedí el nombre, preguntá si el número desde el que llama le sirve para que le escriban, llamá take_message con el motivo y decí "le paso tu número a Iván y te escribe".

FECHA
Hoy es {{"now" | date: "%A %Y-%m-%d", "America/Argentina/Buenos_Aires"}}. Las fechas para las herramientas van en formato año-mes-día, siempre hoy o futuras, con el año correcto. "Del 5 al 7" es entrada el 5 y salida el 7. "Esta noche" es entrada hoy y salida mañana. "Solo la noche del 31" es entrada el 31 de diciembre y salida el 1 de enero.

PRECIOS Y LUGAR
- Si preguntan cuánto sale o si hay lugar, pedí solo lo que falta: fecha de entrada, fecha de salida y cuántas personas. Apenas lo tenés, llamá check_availability. Nunca digas "tengo que buscar" sin buscar.
- No digas nada antes de llamar a una herramienta: la frase de espera ("dejame que me fijo, un segundito") sale sola.
- La herramienta devuelve "DECÍ: …". Decilo casi tal cual, natural, sin cambiar números, fechas ni qué está libre. No agregues precios ni disponibilidad que no te dio la herramienta.
- unit: "casa" si quieren la casa entera; "suite" si quieren una suite o habitación; el nombre si nombran una (giardino, terrazzo, paraiso, penthouse); "any" si no está claro.
- Año Nuevo: la casa entera se alquila solo por el bloque completo que dice la herramienta. Si piden solo el 31, explicalo así de simple y ofrecé el bloque o las suites sueltas.
- Los números decilos como una persona ("quinientos cincuenta y dos dólares"), nunca dígito por dígito.

RESERVAR POR TELÉFONO
1. Si quiere reservar una de las OFERTAS que te dio check_availability: pedí el nombre. Preguntá si el número desde el que llama ({{customer.number}}) es el suyo para WhatsApp; si da otro, usá ese.
2. Llamá hold_booking con offer_id, name y phone.
3. Decí lo que devuelve, despacio y con pausas: que se lo apartás diez minutos, el monto exacto en pesos y el alias por sílabas. Si te piden repetir, repetí el monto y el alias letra por letra: i, ele, be larga, u, ce, o, punto, ce, a, ere, i, ele, o.
4. Solo ese alias: ilbuco punto carilo, en Ripio, a nombre de Ivan Boyko. Nunca des otro alias, CBU, CVU ni cuenta.
5. Quedate en línea. Cuando diga que ya transfirió, llamá check_payment con el HOLD_ID. Si todavía no llegó, decí algo corto y volvé a probar en un ratito. Mientras espera podés charlar de la casa.
6. Confirmá la reserva solo si check_payment dice que llegó. Si no llega, decí lo que te indica la herramienta.

LA CASA
- Cuatro suites, cada una con entrada propia, baño, cocina y lavarropas:
  Giardino: planta baja, jardín propio, cama queen.
  Terrazzo: primer piso, la terraza más grande, con mesa afuera, cama queen.
  Paraíso: primer piso, suite de esquina con ventanas a dos lados, dos camas de una plaza.
  Penthouse: último piso, vista al bosque, terraza verde, cama queen.
- Cada suite tiene un sofá cama de 1,82 metros para dos personas más; hay dos camas plegables extra. Hasta 4 personas por suite y 16 en la casa entera.
- Nunca inventes otras habitaciones.

WIFI
Solo para huéspedes. Pedí el nombre primero. Red "Il Buco", clave "terminator uno".

NEGOCIOS Y LUGARES
No inventes nombres ni direcciones. Decí que en ilbuco punto com punto ar barra places nearby hay una guía con recomendaciones.

TERMINAR
Si dicen chau, gracias, listo o similar, despedite corto ("dale, chau chau") y cortá. Si no responden después de dos intentos, despedite y cortá.

Sin emojis ni símbolos. Solo hablamos de Il Buco, Cariló y la estadía.`;

const fn = (name, description, properties, required, messages) => ({
  type: 'function',
  server: SERVER,
  async: false,
  ...(messages ? { messages } : {}),
  function: { name, description, parameters: { type: 'object', properties, required } },
});
const waitMsg = (start, delayed) => [
  { type: 'request-start', content: start, blocking: false },
  { type: 'request-response-delayed', content: delayed, timingMilliseconds: 6000 },
];

const tools = [
  fn('check_availability',
    'Disponibilidad y precio real para una estadía: si está libre, qué unidad, precio por noche y total (USD y pesos), o las fechas libres más cercanas. Llamala antes de hablar de lugar o precios.',
    {
      check_in: { type: 'string', description: 'Entrada, YYYY-MM-DD' },
      check_out: { type: 'string', description: 'Salida, YYYY-MM-DD' },
      guests: { type: 'integer', description: 'Cantidad de personas' },
      unit: { type: 'string', enum: ['any', 'casa', 'suite', 'giardino', 'terrazzo', 'paraiso', 'penthouse'], description: 'Qué quieren: casa entera, una suite, una suite por nombre, o any' },
    },
    ['check_in', 'check_out', 'guests'],
    waitMsg('Dale, dejame que me fijo… un segundito… a ver.', 'Ya casi, un toque más.')),
  fn('hold_booking',
    'Aparta la oferta elegida por diez minutos y devuelve el monto exacto a transferir, el alias y el HOLD_ID. Solo con una OFERTA de check_availability y el nombre.',
    {
      offer_id: { type: 'string', description: 'Id de OFERTAS, por ejemplo casa:2027-05-10:2027-05-12:6' },
      name: { type: 'string', description: 'Nombre de quien reserva' },
      phone: { type: 'string', description: 'Teléfono para WhatsApp; vacío si es el mismo desde el que llama' },
    },
    ['offer_id', 'name'],
    waitMsg('Dale, te lo aparto, un segundito.', 'Ahí va, ya casi.')),
  fn('check_payment',
    'Se fija si ya llegó la transferencia del monto exacto del HOLD_ID; si llegó, confirma la reserva.',
    { hold_id: { type: 'string', description: 'HOLD_ID que devolvió hold_booking' } },
    ['hold_id'],
    waitMsg('A ver, me fijo si ya entró…', 'Sigo mirando, un segundito.')),
  fn('take_message',
    'Pasa a Iván el nombre, el número y lo que necesita la persona, para que le escriba.',
    {
      name: { type: 'string', description: 'Nombre' },
      phone: { type: 'string', description: 'Número para escribirle; vacío si es el mismo desde el que llama' },
      reason: { type: 'string', description: 'Qué necesita, en una o dos frases' },
    },
    ['name', 'reason']),
];

const assistantConfig = {
  name: 'Il Buco Voice Assistant',
  model: { ...MODEL, temperature: 0.5, maxTokens: 300, messages: [{ role: 'system', content: PROMPT }], tools },
  voice: VOICE,
  transcriber: { provider: 'deepgram', model: 'nova-2', language: 'es' },
  firstMessage: 'Hola, Il Buco, ¿qué tal?',
  firstMessageMode: 'assistant-speaks-first',
  firstMessageInterruptionsEnabled: true,
  // the caller is silent (their audio may not reach us, or they are making the transfer): ask once in a while
  messagePlan: { idleTimeoutSeconds: 8, idleMessageMaxSpokenCount: 3, idleMessages: ['¿Seguís ahí?'] },
  hooks: [],
  startSpeakingPlan: {
    waitSeconds: 0.3,
    smartEndpointingEnabled: true,
    transcriptionEndpointingPlan: { onPunctuationSeconds: 0.1, onNoPunctuationSeconds: 1.2, onNumberSeconds: 0.5 },
  },
  stopSpeakingPlan: {
    numWords: 0, voiceSeconds: 0.15, backoffSeconds: 0.5,
    acknowledgementPhrases: ['ok', 'okay', 'dale', 'si', 'sí', 'aja', 'ajá', 'uh huh', 'mhmm', 'perfecto', 'bárbaro'],
    interruptionPhrases: ['para', 'espera', 'esperá', 'no', 'pero', 'un segundo', 'un momento', 'perdón'],
  },
  server: SERVER,
  serverMessages: ['end-of-call-report', 'status-update', 'hang', 'tool-calls'],
  clientMessages: ['transcript', 'hang', 'tool-calls', 'speech-update', 'status-update', 'conversation-update'],
  // long enough for a caller who is silent while making the transfer
  silenceTimeoutSeconds: 120,
  // a phone booking waits on the line for the transfer: 10 minutes of hold + the talk
  maxDurationSeconds: 900,
  endCallFunctionEnabled: true,
  endCallPhrases: ['chau chau', 'hasta luego entonces', 'que tengas buen día', 'que te vaya bien', 'nos vemos'],
  endCallMessage: 'Dale, chau chau.',
  backgroundSound: 'off',
  backchannelingEnabled: true,
  hipaaEnabled: false,
};

function redacted(cfg) {
  return JSON.parse(JSON.stringify(cfg, (k, v) => (k === 'headers' ? '<redacted>' : v)));
}

async function main() {
  if (DRY) { console.log(JSON.stringify(redacted(assistantConfig), null, 2)); return; }
  try {
    const res = await axios.patch(`https://api.vapi.ai/assistant/${env.VAPI_ASSISTANT_ID}`, assistantConfig, {
      headers: { Authorization: `Bearer ${env.VAPI_PRIVATE_KEY}`, 'Content-Type': 'application/json' },
    });
    const a = res.data;
    console.log(`assistant ${a.id} updated: model ${a.model?.provider}/${a.model?.model}, voice ${a.voice?.provider}/${a.voice?.voiceId}/${a.voice?.model ?? ''}, tools ${a.model?.tools?.length ?? 0}`);
  } catch (e) {
    console.error('Vapi PATCH failed:', e.response?.status, JSON.stringify(e.response?.data?.message ?? e.message).slice(0, 600));
    process.exit(1);
  }
}

module.exports = { assistantConfig, MODELS, VOICES };
if (require.main === module) main();
