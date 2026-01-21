import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const HOSTEX_API_URL = 'https://api.hostex.io/v3/listings/calendar';

const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino', bookingUrl: 'https://book.ilbuco.com.ar/listing/110800' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo', bookingUrl: 'https://book.ilbuco.com.ar/listing/110801' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso', bookingUrl: 'https://book.ilbuco.com.ar/listing/110802' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse', bookingUrl: 'https://book.ilbuco.com.ar/listing/110803' },
  { channel_type: 'booking_site', listing_id: '113182-13274', name: 'Whole House', bookingUrl: 'https://book.ilbuco.com.ar/' },
];

const PROPERTY_INFO = `
# Il Buco - Tech Villa in Cariló, Argentina

## Location
- Address: Paraíso 324, Cariló, Buenos Aires Province, Argentina
- 5 minutes walk from the beach
- Located in a pine forest
- Cariló is an exclusive beach town, known as Argentina's most expensive destination

## Property Overview
- Modern tech-focused villa designed for remote workers and founders
- 4 private suites, each with private bathroom, kitchen, and washer
- Can accommodate 2 people per suite (8 total, plus futons if needed)
- Whole house can be rented for groups of 8-16 people

## Suites (each with private entrance, bathroom, kitchenette, washer):
1. **Giardino** - Ground floor, private garden terrace with live plants
2. **Terrazzo** - Ground floor, largest terrace with outdoor dining
3. **Paraiso** - Second floor, corner suite with two-sided windows
4. **Penthouse** - Top floor, forest views, access to green roof

## Amenities
- 500 Mbps fiber internet with mesh WiFi throughout
- Underfloor heating + 8 air conditioners (climate control in each room)
- Green rooftop with BBQ area
- Large living room and full kitchen for common use
- Smart TVs in each suite
- Luxury bedding and towels
- Water softener system

## Nearby Activities
- Beach (5 min walk)
- Restaurants and cafes
- Golf courses
- Tennis courts
- Horse riding
- Surfing/windsurfing
- Cycling paths
- Gym facilities

## Languages
- We speak English, Spanish, Portuguese, and Russian
- We accept payments via credit cards (Visa, Mastercard, Amex), PayPal, and USDT

## Booking
- Main booking: https://book.ilbuco.com.ar/
- Direct booking gives best rates
- Also available on Airbnb

## Contact
- Website: https://ilbuco.com.ar
- WhatsApp available for inquiries
`;

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

    // Fetch real-time availability for the next 30 days
    const today = getTodayDate();
    const endDate = getDatePlusDays(30);
    const availability = await getAvailability(today, endDate);

    let availabilityContext = '';
    if (availability) {
      // Build TODAY's availability separately
      availabilityContext = `\n\n## TODAY'S Availability (${today}):\n`;
      let todayAvailableCount = 0;
      for (const [suiteName, info] of Object.entries(availability)) {
        if (suiteName === 'Whole House') continue;
        const todayData = info.dates[today];
        const isAvailableToday = todayData?.available || false;
        const todayPrice = todayData?.price || 0;
        if (isAvailableToday) todayAvailableCount++;
        const bookingInfo = LISTINGS.find(l => l.name === suiteName);
        availabilityContext += `- ${suiteName}: ${isAvailableToday ? `AVAILABLE TODAY at $${todayPrice}/night` : 'BOOKED TODAY'}`;
        if (bookingInfo) availabilityContext += ` - ${bookingInfo.bookingUrl}`;
        availabilityContext += '\n';
      }
      availabilityContext += `\nTOTAL: ${todayAvailableCount} of 4 suites available TODAY.\n`;

      // Add future availability summary
      availabilityContext += `\n## Future Availability (next 30 days):\n`;
      for (const [suiteName, info] of Object.entries(availability)) {
        if (suiteName === 'Whole House') continue;
        const availableDates = Object.entries(info.dates)
          .filter(([_, d]) => d.available)
          .map(([date, _]) => date);
        if (availableDates.length > 0) {
          availabilityContext += `- ${suiteName}: Available on ${availableDates.length} days, from $${info.price}/night\n`;
        } else {
          availabilityContext += `- ${suiteName}: Fully booked for next 30 days\n`;
        }
      }
    }

    const languageInstructions: Record<string, string> = {
      es: 'Respond in Spanish (Argentinian Spanish preferred). Be friendly and use "vos" instead of "tú".',
      en: 'Respond in English. Be friendly and professional.',
      pt: 'Respond in Brazilian Portuguese. Be friendly and welcoming.',
      ru: 'Respond in Russian. Be friendly and helpful.',
    };

    const systemPrompt = `You are a helpful concierge assistant for Il Buco, a modern tech villa in Cariló, Argentina.

${languageInstructions[language] || languageInstructions.es}

Your role is to:
- Answer questions about the property, rooms, amenities, and location
- Help with availability inquiries and booking information
- Provide information about things to do in Cariló
- Be concise but helpful - keep responses under 150 words unless more detail is needed

${PROPERTY_INFO}
${availabilityContext}

Important guidelines:
- Always be accurate about the property features - don't invent amenities
- If asked about exact prices for specific dates not in your data, suggest they check the booking page
- For booking, always provide the direct booking link: https://book.ilbuco.com.ar/
- Be warm and welcoming, but professional
- If you don't know something, say so and suggest contacting us directly
- IMPORTANT: When asked about TODAY's availability, use the TODAY'S Availability section which shows real-time data
- Use **bold** for suite names and important info
- Don't use markdown links like [text](url) - instead just say "book at book.ilbuco.com.ar"
- Keep responses conversational and easy to read`;

    const openai = new OpenAI({ apiKey: openaiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      message: reply,
      availability: availability ? Object.fromEntries(
        Object.entries(availability).map(([name, info]) => [name, { available: info.available, price: info.price }])
      ) : null
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
