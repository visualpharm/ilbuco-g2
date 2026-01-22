import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LISTINGS, buildSystemPrompt, buildBookingDeepLink } from '@/lib/chat-prompt';

const HOSTEX_API_URL = 'https://api.hostex.io/v3/listings/calendar';

async function getAvailability(startDate: string, endDate: string) {
  const hostexKey = process.env.HOSTEX_API_KEY;
  if (!hostexKey) return null;

  try {
    const response = await fetch(HOSTEX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hostex-Access-Token': hostexKey,
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        listings: LISTINGS.map(l => ({
          channel_type: l.channel_type,
          listing_id: l.listing_id
        })),
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.error_code !== 200) return null;

    const listings = data.data?.listings || [];
    const availability: Record<string, { available: boolean; price: number | null; dates: Record<string, { available: boolean; price: number }> }> = {};

    for (const listing of listings) {
      const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
      if (!listingInfo) continue;

      const dates: Record<string, { available: boolean; price: number }> = {};
      let hasAvailability = false;
      let minPrice: number | null = null;

      for (const day of listing.calendar || []) {
        const isAvailable = day.inventory === 1;
        dates[day.date] = {
          available: isAvailable,
          price: day.price || 0
        };
        if (isAvailable) {
          hasAvailability = true;
          if (day.price && (minPrice === null || day.price < minPrice)) {
            minPrice = day.price;
          }
        }
      }

      availability[listingInfo.name] = {
        available: hasAvailability,
        price: minPrice,
        dates
      };
    }

    return availability;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return null;
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Format date for display
function formatDateRange(dates: string[]): string {
  if (dates.length === 0) return '';
  if (dates.length === 1) return dates[0];

  // Sort dates
  const sorted = [...dates].sort();

  // Group consecutive dates into ranges
  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(rangeEnd);
    const currDate = new Date(sorted[i]);
    const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      rangeEnd = sorted[i];
    } else {
      ranges.push(rangeStart === rangeEnd ? rangeStart : `${rangeStart} to ${rangeEnd}`);
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }
  ranges.push(rangeStart === rangeEnd ? rangeStart : `${rangeStart} to ${rangeEnd}`);

  return ranges.join(', ');
}

export async function POST(request: NextRequest) {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { messages, language = 'es' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Fetch real-time availability for the next 90 days (covers ~3 months)
    const today = getTodayDate();
    const endDate = getDatePlusDays(90);
    const availability = await getAvailability(today, endDate);

    let availabilityContext = '';
    if (availability) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Helper to get next day
      const getNextDay = (dateStr: string): string => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      };

      // Build TODAY's availability
      availabilityContext = `\n\n## REAL-TIME AVAILABILITY DATA (as of ${today}):\n`;
      availabilityContext += `\n### TODAY (${today}):\n`;
      const tomorrow = getNextDay(today);
      for (const [suiteName, info] of Object.entries(availability)) {
        if (suiteName === 'Whole House') continue;
        const todayData = info.dates[today];
        const isAvailableToday = todayData?.available || false;
        const todayPrice = todayData?.price || 0;
        const deepLink = buildBookingDeepLink(today, tomorrow);
        availabilityContext += `- ${suiteName}: ${isAvailableToday ? `✅ AVAILABLE at $${todayPrice}/night` : '❌ BOOKED'}`;
        if (isAvailableToday) availabilityContext += ` | Book: ${deepLink}`;
        availabilityContext += '\n';
      }

      // Build month-by-month availability for the next 3 months
      for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const targetMonth = (currentMonth + monthOffset) % 12;
        const targetYear = currentYear + Math.floor((currentMonth + monthOffset) / 12);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[targetMonth];

        availabilityContext += `\n### ${monthName} ${targetYear}:\n`;

        for (const [suiteName, info] of Object.entries(availability)) {
          if (suiteName === 'Whole House') continue;

          // Get available dates for this month (sorted)
          const monthDates = Object.entries(info.dates)
            .filter(([date, d]) => {
              const dateObj = new Date(date);
              return dateObj.getMonth() === targetMonth &&
                     dateObj.getFullYear() === targetYear &&
                     d.available;
            })
            .map(([date]) => date)
            .sort();

          // Get price for available dates
          const prices = Object.entries(info.dates)
            .filter(([date, d]) => {
              const dateObj = new Date(date);
              return dateObj.getMonth() === targetMonth &&
                     dateObj.getFullYear() === targetYear &&
                     d.available && d.price > 0;
            })
            .map(([, d]) => d.price);

          const minPrice = prices.length > 0 ? Math.min(...prices) : null;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

          if (monthDates.length > 0) {
            const priceStr = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`;
            const firstAvailable = monthDates[0];
            const checkOut = getNextDay(firstAvailable);
            const deepLink = buildBookingDeepLink(firstAvailable, checkOut);
            availabilityContext += `- ${suiteName}: ✅ ${monthDates.length} nights available at ${priceStr}/night\n`;
            availabilityContext += `  Available dates: ${formatDateRange(monthDates)}\n`;
            availabilityContext += `  First available: ${firstAvailable} | Book: ${deepLink}\n`;
          } else {
            availabilityContext += `- ${suiteName}: ❌ Fully booked for ${monthName}\n`;
          }
        }
      }
    }

    // Build system prompt from external file
    const systemPrompt = buildSystemPrompt(language, availabilityContext);

    const openai = new OpenAI({ apiKey: openaiKey });
    const model = 'gpt-5.2-chat-latest';
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ],
      max_completion_tokens: 1000,
    });

    const responseTime = Date.now() - startTime;
    const reply = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    // Detect response language from content
    const detectLanguage = (text: string): string => {
      // Check for Spanish indicators
      if (/\b(disponible|reservar|habitación|playa|semana|noches?|tenés|querés)\b/i.test(text)) return 'es';
      // Check for Portuguese indicators
      if (/\b(disponível|reservar|quarto|praia|semana|noites?|você|quer)\b/i.test(text)) return 'pt';
      // Check for Russian indicators
      if (/[а-яА-Я]/.test(text)) return 'ru';
      // Default to English
      return 'en';
    };
    const detectedLanguage = detectLanguage(reply);

    return NextResponse.json({
      message: reply,
      language: detectedLanguage,
      availability: availability ? Object.fromEntries(
        Object.entries(availability).map(([name, info]) => [name, { available: info.available, price: info.price }])
      ) : null,
      // Dev info - only meaningful in development
      devInfo: {
        model,
        promptTokens: usage?.prompt_tokens || 0,
        completionTokens: usage?.completion_tokens || 0,
        totalTokens: usage?.total_tokens || 0,
        responseTimeMs: responseTime,
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: errorMessage },
      { status: 500 }
    );
  }
}
