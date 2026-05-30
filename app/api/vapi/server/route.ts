import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const HOSTEX_API_URL = 'https://api.hostex.io/v3/listings/calendar';

const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse' },
];

// Log directory for conversations
const LOG_DIR = path.join(process.cwd(), 'logs', 'conversations');

interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface VapiServerMessage {
  message: {
    type: string;
    call?: {
      id: string;
      customer?: {
        number?: string;
      };
      monitor?: {
        controlUrl?: string;
      };
      controlUrl?: string;
    };
    assistant?: {
      id: string;
      name: string;
    };
    // For function calls (legacy format)
    functionCall?: {
      id: string;
      name: string;
      parameters: Record<string, unknown>;
    };
    // For tool-calls (current Vapi format)
    toolCallList?: ToolCall[];
    toolWithToolCallList?: Array<{
      tool: unknown;
      toolCall: ToolCall;
    }>;
    // For end-of-call-report
    artifact?: {
      transcript?: string;
      messages?: Array<{
        role: string;
        message: string;
        time: number;
      }>;
      recordingUrl?: string;
    };
    // For status-update
    status?: string;
  };
}

function parseToolArguments(rawArgs: unknown): Record<string, unknown> {
  if (!rawArgs) return {};
  if (typeof rawArgs === 'string') {
    try {
      return JSON.parse(rawArgs) as Record<string, unknown>;
    } catch (e) {
      console.error('[Vapi Server] Failed to parse arguments:', e);
      return {};
    }
  }
  if (typeof rawArgs === 'object') {
    return rawArgs as Record<string, unknown>;
  }
  return {};
}

function normalizeDateInput(dateInput?: string): string | null {
  if (!dateInput) return null;
  const trimmed = dateInput.trim();
  if (!trimmed) return null;

  // YYYYMMDD
  const compactMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const [, year, month, day] = compactMatch;
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD, YYYY/MM/DD, YYYY MM DD, etc
  const match = trimmed.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return null;

  const [, year, monthRaw, dayRaw] = match;
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  if (Number.isNaN(month) || Number.isNaN(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const monthPadded = String(month).padStart(2, '0');
  const dayPadded = String(day).padStart(2, '0');
  return `${year}-${monthPadded}-${dayPadded}`;
}

// Get today's availability from Hostex
async function getTodayAvailability(): Promise<{ available: string[]; minPrice: number | null }> {
  const hostexKey = process.env.HOSTEX_API_KEY;
  if (!hostexKey) {
    return { available: [], minPrice: null };
  }

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  try {
    const response = await fetch(HOSTEX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hostex-Access-Token': hostexKey,
      },
      body: JSON.stringify({
        start_date: today,
        end_date: tomorrowStr,
        listings: LISTINGS.map(l => ({
          channel_type: l.channel_type,
          listing_id: l.listing_id
        })),
      }),
    });

    if (!response.ok) {
      console.error('[Vapi Server] Hostex API error:', response.status);
      return { available: [], minPrice: null };
    }

    const data = await response.json();
    if (data.error_code !== 200) {
      console.error('[Vapi Server] Hostex error code:', data.error_code);
      return { available: [], minPrice: null };
    }

    const availableRooms: string[] = [];
    let minPrice: number | null = null;

    for (const listing of data.data?.listings || []) {
      const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
      if (!listingInfo) continue;

      const todayData = listing.calendar?.find((d: { date: string }) => d.date === today);
      if (todayData?.inventory === 1) {
        availableRooms.push(listingInfo.name);
        if (todayData.price && (minPrice === null || todayData.price < minPrice)) {
          minPrice = todayData.price;
        }
      }
    }

    return { available: availableRooms, minPrice };
  } catch (error) {
    console.error('[Vapi Server] Error fetching availability:', error);
    return { available: [], minPrice: null };
  }
}

// Generate dynamic first message with today's availability
async function generateDynamicGreeting(): Promise<string> {
  const { available, minPrice } = await getTodayAvailability();

  let greeting = 'Hola, soy el asistente virtual de Il Buco. ';

  if (available.length === 0) {
    greeting += 'Para hoy está todo ocupado, pero puedo ayudarte con otras fechas. ';
  } else if (available.length === 1) {
    greeting += `Para hoy tenemos ${available[0]} disponible`;
    if (minPrice) {
      greeting += ` desde ${minPrice} dólares la noche`;
    }
    greeting += '. ';
  } else if (available.length === 4) {
    greeting += 'Hoy tenemos toda la casa disponible';
    if (minPrice) {
      greeting += `, desde ${minPrice} dólares la noche`;
    }
    greeting += '. ';
  } else {
    const roomList = available.slice(0, -1).join(', ') + ' y ' + available[available.length - 1];
    greeting += `Hoy tenemos ${roomList} disponibles`;
    if (minPrice) {
      greeting += `, desde ${minPrice} dólares la noche`;
    }
    greeting += '. ';
  }

  greeting += '¿Querés reservar para hoy u otras fechas?';

  return greeting;
}

// Log conversation to file
async function logConversation(callId: string, data: {
  type: 'voice' | 'chat';
  timestamp: string;
  transcript?: string;
  messages?: Array<{ role: string; message: string; time?: number }>;
  customerNumber?: string;
  recordingUrl?: string;
  status?: string;
}) {
  try {
    // Ensure log directory exists
    await fs.mkdir(LOG_DIR, { recursive: true });

    const logFile = path.join(LOG_DIR, `${data.type}-${new Date().toISOString().split('T')[0]}.jsonl`);
    const logEntry = {
      callId,
      ...data,
      loggedAt: new Date().toISOString(),
    };

    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    console.log(`[Vapi Server] Logged conversation: ${callId}`);
  } catch (error) {
    console.error('[Vapi Server] Error logging conversation:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VapiServerMessage = await request.json();
    const messageType = body.message?.type;
    const callId = body.message?.call?.id || 'unknown';

    // Detailed logging for debugging
    console.log(`[Vapi Server] Received: ${messageType}`, callId);
    console.log(`[Vapi Server] Full body:`, JSON.stringify(body, null, 2));

    // Handle assistant-request: Generate dynamic first message
    if (messageType === 'assistant-request') {
      const greeting = await generateDynamicGreeting();
      console.log(`[Vapi Server] Dynamic greeting: ${greeting}`);

      return NextResponse.json({
        assistant: {
          firstMessage: greeting,
        }
      });
    }

    // Handle end-of-call-report: Log the conversation
    if (messageType === 'end-of-call-report') {
      const artifact = body.message.artifact;

      await logConversation(callId, {
        type: 'voice',
        timestamp: new Date().toISOString(),
        transcript: artifact?.transcript,
        messages: artifact?.messages,
        customerNumber: body.message.call?.customer?.number,
        recordingUrl: artifact?.recordingUrl,
      });

      return NextResponse.json({ status: 'logged' });
    }

    // Handle tool-calls (current Vapi format)
    if (messageType === 'tool-calls') {
      const toolCalls = body.message.toolCallList ||
        body.message.toolWithToolCallList?.map(t => t.toolCall) || [];

      console.log(`[Vapi Server] Processing ${toolCalls.length} tool calls`);

      const results = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const params = parseToolArguments(toolCall.function.arguments);

        if (functionName === 'transfer_to_operator') {
          const { reason } = params as { reason?: string };
          console.log(`[Vapi Server] Transfer requested. Reason: ${reason}`);

          // Get operator SIP/phone from environment
          const operatorDestination = process.env.OPERATOR_SIP_URI || process.env.OPERATOR_PHONE;
          const controlUrl = body.message.call?.monitor?.controlUrl || body.message.call?.controlUrl;
          console.log('[Vapi Server] Transfer controlUrl present:', Boolean(controlUrl));

          if (!operatorDestination) {
            results.push({
              name: functionName,
              toolCallId: toolCall.id,
              result: 'Lo siento, no puedo transferir la llamada en este momento. Por favor contactanos por WhatsApp o email.'
            });
            continue;
          }

          if (!controlUrl) {
            results.push({
              name: functionName,
              toolCallId: toolCall.id,
              result: 'No puedo transferir la llamada en este momento. Por favor intentá de nuevo más tarde.'
            });
            continue;
          }

          // Execute transfer via call control URL
          const isSip = operatorDestination.includes('@');
          const transferPayload = {
            type: 'transfer',
            destination: isSip
              ? { type: 'sip', sipUri: operatorDestination }
              : { type: 'number', number: operatorDestination },
            message: reason || 'Transferring to operator'
          };

          const transferResponse = await fetch(controlUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferPayload),
          });

          if (!transferResponse.ok) {
            const responseText = await transferResponse.text();
            console.error('[Vapi Server] Transfer failed:', transferResponse.status, responseText);
            results.push({
              name: functionName,
              toolCallId: toolCall.id,
              result: 'Lo siento, hubo un problema transfiriendo la llamada. Por favor intentá de nuevo.'
            });
            continue;
          }

          const responseText = await transferResponse.text();
          console.log('[Vapi Server] Transfer response:', responseText);
          results.push({
            name: functionName,
            toolCallId: toolCall.id,
            result: 'Te transfiero con un operador ahora.'
          });
          continue;
        }

        if (functionName === 'check_availability') {
          const { check_in, check_out, listing_id } = params as {
            check_in: string;
            check_out: string;
            listing_id?: string;
          };

          const normalizedCheckIn = normalizeDateInput(check_in);
          const normalizedCheckOut = normalizeDateInput(check_out);

          if (!normalizedCheckIn || !normalizedCheckOut) {
            results.push({
              name: functionName,
              toolCallId: toolCall.id,
              result: 'Necesito las fechas de entrada y salida para verificar disponibilidad.'
            });
            continue;
          }

          console.log(`[Vapi Server] Checking availability: ${normalizedCheckIn} to ${normalizedCheckOut}`);
          const availability = await getDetailedAvailability(normalizedCheckIn, normalizedCheckOut, listing_id);

          results.push({
            name: functionName,
            toolCallId: toolCall.id,
            result: availability
          });
        }
      }

      const response = { results };
      console.log(`[Vapi Server] Returning:`, JSON.stringify(response));
      return NextResponse.json(response);
    }

    // Handle function-call (legacy format)
    const functionCall = body.message.functionCall || (body.message as { toolCall?: { id: string; name: string; parameters: Record<string, unknown> } }).toolCall;
    if (messageType === 'function-call' && functionCall) {

      if (functionCall.name === 'check_availability') {
        const { check_in, check_out, listing_id } = functionCall.parameters as {
          check_in: string;
          check_out: string;
          listing_id?: string;
        };

        const normalizedCheckIn = normalizeDateInput(check_in);
        const normalizedCheckOut = normalizeDateInput(check_out);

        // Validate dates
        if (!normalizedCheckIn || !normalizedCheckOut) {
          return NextResponse.json({
            results: [{
              name: functionCall.name,
              toolCallId: functionCall.id,
              result: 'Necesito las fechas de entrada y salida para verificar disponibilidad.'
            }]
          });
        }

        // Fetch availability from Hostex
        console.log(`[Vapi Server] Checking availability: ${normalizedCheckIn} to ${normalizedCheckOut}`);
        const availability = await getDetailedAvailability(normalizedCheckIn, normalizedCheckOut, listing_id);

        const response = {
          results: [{
            name: functionCall.name,
            toolCallId: functionCall.id,
            result: availability
          }]
        };
        console.log(`[Vapi Server] Returning:`, JSON.stringify(response));
        return NextResponse.json(response);
      }
    }

    // Handle status-update
    if (messageType === 'status-update') {
      console.log(`[Vapi Server] Status: ${body.message.status}`);
      return NextResponse.json({ status: 'ok' });
    }

    // Default response
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('[Vapi Server] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get detailed availability for function calls
async function getDetailedAvailability(startDate: string, endDate: string, listingId?: string): Promise<string> {
  const hostexKey = process.env.HOSTEX_API_KEY;
  if (!hostexKey) {
    return 'Lo siento, no puedo verificar la disponibilidad en este momento. Visitá book punto ilbuco punto com punto ar para ver las fechas disponibles.';
  }

  try {
    const listingsToCheck = listingId
      ? LISTINGS.filter(l => l.listing_id === listingId)
      : LISTINGS;

    const addDays = (dateStr: string, days: number): string => {
      const date = new Date(`${dateStr}T12:00:00`);
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    };

    const daysBetween = getDatesBetween(startDate, endDate).length;

    const fetchCalendar = async (rangeStart: string, rangeEnd: string) => {
      const response = await fetch(HOSTEX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Hostex-Access-Token': hostexKey,
        },
        body: JSON.stringify({
          start_date: rangeStart,
          end_date: rangeEnd,
          listings: listingsToCheck.map(l => ({
            channel_type: l.channel_type,
            listing_id: l.listing_id
          })),
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (data.error_code !== 200) {
        return null;
      }

      return data;
    };

    const findOptionsInRange = (
      data: { data?: { listings?: Array<{ listing_id: string; calendar?: Array<{ date: string; inventory: number; price?: number }> }> } },
      rangeStart: string,
      rangeEnd: string,
      preferredNights: number[]
    ) => {
      const options: Array<{ name: string; start: string; end: string; price: number | null; nights: number }> = [];
      const listings = data.data?.listings || [];

      for (const listing of listings) {
        const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
        if (!listingInfo) continue;

        const calendar = listing.calendar || [];
        const calendarByDate: Record<string, { inventory: number; price: number }> = {};
        for (const day of calendar) {
          calendarByDate[day.date] = {
            inventory: day.inventory,
            price: day.price || 0
          };
        }

        for (const nights of preferredNights) {
          const lastStart = addDays(rangeEnd, -nights);
          let cursor = rangeStart;
          let windowFound: { start: string; end: string; price: number | null } | null = null;

          while (cursor <= lastStart) {
            let ok = true;
            let minPrice: number | null = null;
            for (let i = 0; i < nights; i++) {
              const dayKey = addDays(cursor, i);
              const dayInfo = calendarByDate[dayKey];
              if (!dayInfo || dayInfo.inventory !== 1) {
                ok = false;
                break;
              }
              if (dayInfo.price > 0 && (minPrice === null || dayInfo.price < minPrice)) {
                minPrice = dayInfo.price;
              }
            }

            if (ok) {
              windowFound = {
                start: cursor,
                end: addDays(cursor, nights),
                price: minPrice
              };
              break;
            }

            cursor = addDays(cursor, 1);
          }

          if (windowFound) {
            options.push({
              name: listingInfo.name,
              start: windowFound.start,
              end: windowFound.end,
              price: windowFound.price,
              nights
            });
            break;
          }
        }
      }

      return options;
    };

    const findLongestRunsInRange = (
      data: { data?: { listings?: Array<{ listing_id: string; calendar?: Array<{ date: string; inventory: number; price?: number }> }> } }
    ) => {
      const runs: Array<{ name: string; start: string; end: string; nights: number; minPrice: number | null }> = [];
      const listings = data.data?.listings || [];

      for (const listing of listings) {
        const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
        if (!listingInfo) continue;

        const calendar = (listing.calendar || []).slice().sort((a, b) => a.date.localeCompare(b.date));
        let currentStart: string | null = null;
        let currentEnd: string | null = null;
        let currentNights = 0;
        let currentMinPrice: number | null = null;
        let best: { start: string; end: string; nights: number; minPrice: number | null } | null = null;
        let lastDate: string | null = null;

        for (const day of calendar) {
          if (day.inventory === 1) {
            const isConsecutive = lastDate ? addDays(lastDate, 1) === day.date : false;
            if (!currentStart || !isConsecutive) {
              if (currentStart && (!best || currentNights > best.nights)) {
                best = {
                  start: currentStart,
                  end: currentEnd || addDays(currentStart, currentNights),
                  nights: currentNights,
                  minPrice: currentMinPrice
                };
              }
              currentStart = day.date;
              currentEnd = addDays(day.date, 1);
              currentNights = 1;
              currentMinPrice = day.price || 0;
            } else {
              currentEnd = addDays(currentEnd, 1);
              currentNights += 1;
              if (day.price && (currentMinPrice === null || day.price < currentMinPrice)) {
                currentMinPrice = day.price;
              }
            }
            lastDate = day.date;
          } else if (currentStart) {
            if (!best || currentNights > best.nights) {
              best = {
                start: currentStart,
                end: currentEnd || addDays(currentStart, currentNights),
                nights: currentNights,
                minPrice: currentMinPrice
              };
            }
            currentStart = null;
            currentEnd = null;
            currentNights = 0;
            currentMinPrice = null;
            lastDate = null;
          }
        }

        if (currentStart) {
          if (!best || currentNights > best.nights) {
            best = {
              start: currentStart,
              end: currentEnd || addDays(currentStart, currentNights),
              nights: currentNights,
              minPrice: currentMinPrice
            };
          }
        }

        if (best) {
          runs.push({
            name: listingInfo.name,
            start: best.start,
            end: best.end,
            nights: best.nights,
            minPrice: best.minPrice
          });
        }
      }

      return runs;
    };

    let data = await fetchCalendar(startDate, endDate);
    if (!data) {
      return 'No pude verificar la disponibilidad. Por favor intentá de nuevo o visitá book punto ilbuco punto com punto ar.';
    }

    // Parse availability
    const requestedDates = getDatesBetween(startDate, endDate);
    const availableRooms: Array<{ name: string; price: number }> = [];
    const bookedRooms: string[] = [];

    for (const listing of data.data?.listings || []) {
      const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
      if (!listingInfo) continue;

      const calendar = listing.calendar || [];
      const calendarByDate: Record<string, { inventory: number; price: number }> = {};
      for (const day of calendar) {
        calendarByDate[day.date] = {
          inventory: day.inventory,
          price: day.price || 0
        };
      }

      if (daysBetween > 10) {
        continue;
      }

      const availableDates = calendar
        .filter((d: { inventory: number; date: string }) => d.inventory === 1)
        .map((d: { date: string }) => d.date);

      const fullyAvailable = requestedDates.every(d => availableDates.includes(d));

      if (fullyAvailable) {
        const minPrice = calendar
          .filter((d: { inventory: number; price: number }) => d.inventory === 1 && d.price > 0)
          .reduce((min: number, d: { price: number }) => Math.min(min, d.price), Infinity);

        availableRooms.push({
          name: listingInfo.name,
          price: minPrice === Infinity ? 0 : minPrice
        });
      } else {
        bookedRooms.push(listingInfo.name);
      }
    }

    // Format response for voice (spelled out, no special characters)
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr + 'T12:00:00');
      const day = date.getDate();
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const month = months[date.getMonth()];
      return `${day} de ${month}`;
    };

    const checkInFormatted = formatDate(startDate);
    const checkOutFormatted = formatDate(endDate);

    if (daysBetween > 10) {
      const preferredNights = [4, 3, 2];
      const maxSearchDays = 180;
      let collectedOptions: Array<{ name: string; start: string; end: string; price: number | null; nights: number }> = [];
      let collectedRuns: Array<{ name: string; start: string; end: string; nights: number; minPrice: number | null }> = [];

      for (let offset = 0; offset < maxSearchDays; offset += 30) {
        const rangeStart = addDays(startDate, offset);
        const rangeEnd = addDays(rangeStart, 30);
        const rangeData = offset === 0 ? data : await fetchCalendar(rangeStart, rangeEnd);
        if (!rangeData) continue;

        const rangeOptions = findOptionsInRange(rangeData, rangeStart, rangeEnd, preferredNights);
        const rangeRuns = findLongestRunsInRange(rangeData);
        collectedOptions = collectedOptions.concat(rangeOptions);
        collectedRuns = collectedRuns.concat(rangeRuns);

        if (rangeOptions.some(option => option.nights === 4)) {
          break;
        }
      }

      if (collectedOptions.length === 0) {
        return 'En las proximas semanas no encuentro ventanas de dos noches disponibles. ¿Querés probar otras fechas o una estadia mas larga?';
      }

      const longRuns = collectedRuns
        .filter(run => run.nights >= 7)
        .sort((a, b) => b.nights - a.nights)
        .slice(0, 3);

      const optionLines = longRuns.length > 0
        ? longRuns.map(run => {
          const startFormatted = formatDate(run.start);
          const endFormatted = formatDate(run.end);
          let line = `${run.name} del ${startFormatted} al ${endFormatted}`;
          if (run.minPrice && run.minPrice > 0) {
            line += ` desde ${run.minPrice} dolares por noche`;
          }
          return line;
        })
        : (() => {
          const maxNights = Math.max(...collectedOptions.map(option => option.nights));
          const optionsForNights = collectedOptions.filter(option => option.nights === maxNights);
          const sortedOptions = [...optionsForNights].sort((a, b) => a.start.localeCompare(b.start));
          const topOptions = sortedOptions.slice(0, 3);
          return topOptions.map(option => {
            const startFormatted = formatDate(option.start);
            const endFormatted = formatDate(option.end);
            let line = `${option.name} del ${startFormatted} al ${endFormatted}`;
            if (option.price && option.price > 0) {
              line += ` desde ${option.price} dolares por noche`;
            }
            return line;
          });
        })();

      let response_text = '';
      if (longRuns.length > 0) {
        response_text += 'En las proximas fechas tengo disponibilidad extendida: ';
      } else {
        const maxNights = Math.max(...collectedOptions.map(option => option.nights));
        if (maxNights === 4) {
          response_text += 'En las proximas fechas con cuatro noches seguidas tengo estas opciones: ';
        } else if (maxNights === 3) {
          response_text += 'No encuentro cuatro noches seguidas en los proximos treinta dias, pero tengo opciones de tres noches: ';
        } else {
          response_text += 'No encuentro cuatro ni tres noches seguidas en los proximos treinta dias, pero tengo opciones de dos noches: ';
        }
      }

      response_text += `${optionLines.join('. ')}. `;
      response_text += 'Si me decís un rango aproximado, reviso algo mas preciso. ¿Querés que lo haga?';
      return response_text;
    }

    if (availableRooms.length === 0) {
      // No rooms fully available - find best partial availability within the range
      const partialOptions: Array<{ name: string; start: string; end: string; nights: number; price: number }> = [];

      for (const listing of data.data?.listings || []) {
        const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
        if (!listingInfo || listingInfo.name === 'Whole House') continue;

        const calendar = (listing.calendar || []).slice().sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date));

        // Find longest consecutive run within requested dates
        let currentStart: string | null = null;
        let currentNights = 0;
        let currentMinPrice = 0;
        let best: { start: string; end: string; nights: number; price: number } | null = null;
        let lastDate: string | null = null;

        for (const day of calendar) {
          if (!requestedDates.includes(day.date)) continue;

          if (day.inventory === 1) {
            const isConsecutive = lastDate ? addDays(lastDate, 1) === day.date : false;
            if (!currentStart || !isConsecutive) {
              if (currentStart && currentNights >= 2 && (!best || currentNights > best.nights)) {
                best = { start: currentStart, end: addDays(currentStart, currentNights), nights: currentNights, price: currentMinPrice };
              }
              currentStart = day.date;
              currentNights = 1;
              currentMinPrice = day.price || 0;
            } else {
              currentNights++;
              if (day.price && day.price > 0 && (currentMinPrice === 0 || day.price < currentMinPrice)) {
                currentMinPrice = day.price;
              }
            }
            lastDate = day.date;
          } else {
            if (currentStart && currentNights >= 2 && (!best || currentNights > best.nights)) {
              best = { start: currentStart, end: addDays(currentStart, currentNights), nights: currentNights, price: currentMinPrice };
            }
            currentStart = null;
            currentNights = 0;
            currentMinPrice = 0;
            lastDate = null;
          }
        }

        if (currentStart && currentNights >= 2 && (!best || currentNights > best.nights)) {
          best = { start: currentStart, end: addDays(currentStart, currentNights), nights: currentNights, price: currentMinPrice };
        }

        if (best && best.nights >= 2) {
          partialOptions.push({ name: listingInfo.name, ...best });
        }
      }

      if (partialOptions.length > 0) {
        partialOptions.sort((a, b) => b.nights - a.nights);
        const bestOption = partialOptions[0];
        const startFormatted = formatDate(bestOption.start);
        const endFormatted = formatDate(bestOption.end);

        let response = `Para el ${checkInFormatted} al ${checkOutFormatted}, ninguna suite tiene todas las noches. `;
        response += `Pero ${bestOption.name} está libre del ${startFormatted} al ${endFormatted}, son ${bestOption.nights} noches`;
        if (bestOption.price > 0) {
          response += ` a ${bestOption.price} dólares por noche`;
        }
        response += '. ';

        const otherGood = partialOptions.filter(o => o.name !== bestOption.name && o.nights >= bestOption.nights - 1).slice(0, 2);
        if (otherGood.length > 0) {
          const otherNames = otherGood.map(o => `${o.name} del ${formatDate(o.start)} al ${formatDate(o.end)}`).join(', ');
          response += `También: ${otherNames}. `;
        }

        response += '¿Te sirve?';
        return response;
      }

      return `Para el ${checkInFormatted} al ${checkOutFormatted}, lamentablemente todas las suites están ocupadas. ¿Querés probar otras fechas?`;
    }

    let response_text = `Para el ${checkInFormatted} al ${checkOutFormatted}: `;

    if (availableRooms.length === 1) {
      const room = availableRooms[0];
      response_text += `tenemos ${room.name} disponible`;
      if (room.price > 0) {
        response_text += ` a ${room.price} dólares por noche`;
      }
      response_text += '.';
    } else if (availableRooms.length === 4) {
      const minPrice = Math.min(...availableRooms.map(r => r.price).filter(p => p > 0));
      response_text += `toda la casa está disponible`;
      if (minPrice > 0) {
        response_text += `, desde ${minPrice} dólares por noche`;
      }
      response_text += '.';
    } else {
      const roomNames = availableRooms.map(r => r.name);
      const roomList = roomNames.slice(0, -1).join(', ') + ' y ' + roomNames[roomNames.length - 1];
      const minPrice = Math.min(...availableRooms.map(r => r.price).filter(p => p > 0));
      response_text += `tenemos ${roomList} disponibles`;
      if (minPrice > 0) {
        response_text += `, desde ${minPrice} dólares por noche`;
      }
      response_text += '.';
    }

    if (bookedRooms.length > 0 && bookedRooms.length < 4) {
      const bookedList = bookedRooms.join(' y ');
      response_text += ` ${bookedList} ${bookedRooms.length === 1 ? 'está ocupada' : 'están ocupadas'}.`;
    }

    response_text += ' ¿Querés reservar?';

    return response_text;
  } catch (error) {
    console.error('[Vapi Server] Error in getDetailedAvailability:', error);
    return 'Hubo un problema al verificar la disponibilidad. Por favor visitá book punto ilbuco punto com punto ar.';
  }
}

function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Il Buco Vapi Server Webhook',
    endpoint: '/api/vapi/server'
  });
}
