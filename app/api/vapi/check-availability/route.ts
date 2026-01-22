import { NextRequest, NextResponse } from 'next/server';

const HOSTEX_API_URL = 'https://api.hostex.io/v3/listings/calendar';

const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino', description: 'Ground floor suite with private garden terrace' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo', description: 'Ground floor suite with the largest terrace' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso', description: 'Second floor corner suite with two-sided windows' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse', description: 'Top floor suite with forest views and rooftop access' },
];

interface VapiRequest {
  message: {
    type: string;
    call?: {
      id: string;
    };
    functionCall?: {
      id: string;
      name: string;
      parameters: {
        check_in: string;
        check_out: string;
        listing_id?: string;
      };
    };
  };
}

async function getAvailability(startDate: string, endDate: string, listingId?: string) {
  const hostexKey = process.env.HOSTEX_API_KEY;
  if (!hostexKey) {
    return { error: 'API not configured' };
  }

  try {
    const listingsToCheck = listingId
      ? LISTINGS.filter(l => l.listing_id === listingId)
      : LISTINGS;

    const response = await fetch(HOSTEX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hostex-Access-Token': hostexKey,
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        listings: listingsToCheck.map(l => ({
          channel_type: l.channel_type,
          listing_id: l.listing_id
        })),
      }),
    });

    if (!response.ok) {
      return { error: 'Failed to fetch availability' };
    }

    const data = await response.json();
    if (data.error_code !== 200) {
      return { error: 'API error' };
    }

    const listings = data.data?.listings || [];
    const availability: Array<{
      name: string;
      description: string;
      available: boolean;
      price: number | null;
      availableDates: string[];
    }> = [];

    for (const listing of listings) {
      const listingInfo = LISTINGS.find(l => l.listing_id === listing.listing_id);
      if (!listingInfo) continue;

      const availableDates: string[] = [];
      let minPrice: number | null = null;
      let isAvailable = true;

      for (const day of listing.calendar || []) {
        if (day.inventory === 1) {
          availableDates.push(day.date);
          if (day.price && (minPrice === null || day.price < minPrice)) {
            minPrice = day.price;
          }
        } else {
          isAvailable = false;
        }
      }

      // A room is fully available only if ALL requested dates are available
      const requestedDates = getDatesBetween(startDate, endDate);
      const fullyAvailable = requestedDates.every(d => availableDates.includes(d));

      availability.push({
        name: listingInfo.name,
        description: listingInfo.description,
        available: fullyAvailable,
        price: minPrice,
        availableDates
      });
    }

    return {
      checkIn: startDate,
      checkOut: endDate,
      rooms: availability
    };
  } catch (error) {
    console.error('Error fetching availability:', error);
    return { error: 'Failed to check availability' };
  }
}

function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  // Don't include checkout date
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function formatAvailabilityResponse(availability: {
  checkIn: string;
  checkOut: string;
  rooms: Array<{
    name: string;
    description: string;
    available: boolean;
    price: number | null;
  }>;
}): string {
  const availableRooms = availability.rooms.filter(r => r.available);
  const unavailableRooms = availability.rooms.filter(r => !r.available);

  let response = `For ${availability.checkIn} to ${availability.checkOut}:\n`;

  if (availableRooms.length === 0) {
    response += 'Unfortunately, all rooms are booked for those dates.';
    if (unavailableRooms.length > 0) {
      response += ' Our rooms include: ' + unavailableRooms.map(r => r.name).join(', ') + '.';
    }
    response += ' Would you like to check different dates?';
  } else {
    response += `${availableRooms.length} room${availableRooms.length > 1 ? 's are' : ' is'} available:\n`;
    for (const room of availableRooms) {
      response += `- ${room.name}: ${room.description}. ${room.price ? `$${room.price} per night.` : ''}\n`;
    }
    if (unavailableRooms.length > 0) {
      response += `\nThe ${unavailableRooms.map(r => r.name).join(' and ')} ${unavailableRooms.length > 1 ? 'are' : 'is'} booked for those dates.`;
    }
    response += '\nWould you like to book one of the available rooms?';
  }

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body: VapiRequest = await request.json();
    console.log('[Vapi] Received request:', JSON.stringify(body, null, 2));

    // Handle function call from Vapi
    if (body.message?.type === 'function-call' && body.message.functionCall) {
      const { functionCall } = body.message;

      if (functionCall.name === 'check_availability') {
        const { check_in, check_out, listing_id } = functionCall.parameters;

        // Validate dates
        if (!check_in || !check_out) {
          return NextResponse.json({
            results: [{
              toolCallId: functionCall.id,
              result: 'I need both check-in and check-out dates to check availability. What dates are you interested in?'
            }]
          });
        }

        // Fetch availability
        const availability = await getAvailability(check_in, check_out, listing_id);

        if ('error' in availability) {
          return NextResponse.json({
            results: [{
              toolCallId: functionCall.id,
              result: 'I apologize, but I am having trouble checking availability right now. Please try again or visit book.ilbuco.com.ar directly.'
            }]
          });
        }

        const formattedResponse = formatAvailabilityResponse(availability);

        return NextResponse.json({
          results: [{
            toolCallId: functionCall.id,
            result: formattedResponse
          }]
        });
      }
    }

    // Default response for other message types
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('[Vapi] Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Il Buco Vapi Integration',
    endpoint: '/api/vapi/check-availability'
  });
}
