import { NextResponse } from 'next/server';

const HOSTEX_RESERVATIONS_URL = 'https://api.hostex.io/v3/reservations';

export async function GET() {
  const hostexKey = process.env.HOSTEX_API_KEY;
  if (!hostexKey) {
    return NextResponse.json({ error: 'No API key' });
  }

  const today = new Date().toISOString().split('T')[0];
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
  const startDate = threeMonthsAgo.toISOString().split('T')[0];

  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);
  const endDate = threeMonthsFromNow.toISOString().split('T')[0];

  const url = `${HOSTEX_RESERVATIONS_URL}?start_date=${startDate}&end_date=${endDate}&limit=100`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Hostex-Access-Token': hostexKey,
      },
    });

    const data = await response.json();

    // Filter for active reservations
    const reservations = data.data?.reservations || [];
    const activeGuests = reservations.filter((res: Record<string, unknown>) => {
      const checkIn = (res.check_in_date || res.check_in) as string;
      const checkOut = (res.check_out_date || res.check_out) as string;
      return checkIn && checkOut && checkIn <= today && today < checkOut;
    }).map((res: Record<string, unknown>) => ({
      name: res.guest_name,
      checkIn: res.check_in_date || res.check_in,
      checkOut: res.check_out_date || res.check_out,
      listingId: res.listing_id,
    }));

    return NextResponse.json({
      today,
      startDate,
      url,
      responseStatus: response.status,
      errorCode: data.error_code,
      totalReservations: reservations.length,
      activeGuests,
      rawReservations: reservations.slice(0, 5), // First 5 for debugging
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
