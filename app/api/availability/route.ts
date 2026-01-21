import { NextResponse } from 'next/server';

// Hostex API endpoint for fetching calendar availability
const HOSTEX_API_URL = 'https://api.hostex.io/v3/listings/calendar';

const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse' },
  { channel_type: 'booking_site', listing_id: '113182-13274', name: 'Whole House' },
];

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const apiKey = process.env.HOSTEX_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'HOSTEX_API_KEY not configured' },
        { status: 500 }
      );
    }

    const today = getTodayDate();

    const response = await fetch(HOSTEX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Hostex-Access-Token': apiKey,
      },
      body: JSON.stringify({
        start_date: today,
        end_date: today,
        listings: LISTINGS.map(l => ({
          channel_type: l.channel_type,
          listing_id: l.listing_id
        })),
      }),
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch from Hostex', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error_code !== 200) {
      return NextResponse.json(
        { error: 'Hostex API error', details: data },
        { status: 500 }
      );
    }

    // Parse availability and prices
    const listings = data.data?.listings || [];
    let availableSuites = 0;
    let wholeHouseAvailable = false;
    const availablePrices: number[] = [];

    for (const listing of listings) {
      const todayCalendar = listing.calendar?.[0];
      const isAvailable = todayCalendar?.inventory === 1;
      const price = todayCalendar?.price;

      if (listing.listing_id === '113182-13274') {
        wholeHouseAvailable = isAvailable;
      } else if (isAvailable) {
        availableSuites++;
        if (price && price > 0) {
          availablePrices.push(price);
        }
      }
    }

    const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;

    return NextResponse.json({
      date: today,
      availableSuites,
      wholeHouseAvailable,
      totalSuites: 4,
      minPrice,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
