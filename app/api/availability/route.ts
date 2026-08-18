import { NextResponse } from 'next/server';
import { getCalendarAvailability } from '@/lib/hostex-api';

/**
 * GET /api/availability
 *
 * Without query params: returns today's snapshot (backward-compatible with the
 * hero badge / availability indicator).
 *   → { date, availableSuites, wholeHouseAvailable, totalSuites, minPrice }
 *
 * With ?start=YYYY-MM-DD&end=YYYY-MM-DD:
 *   returns per-suite availability + price for every night in the range.
 *   → { start, end, rooms: [{ name, slug, available, price, nights, dates: [{date, available, price}] }] }
 *
 * The booking page uses the range mode to render the search results.
 */
export async function GET(req: Request) {
  try {
    const apiKey = process.env.HOSTEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'HOSTEX_API_KEY not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // ─── Range mode ─────────────────────────────────────────────────────────────
    if (start && end) {
      const today = new Date().toISOString().split('T')[0];
      if (start < today) {
        return NextResponse.json({ error: 'Start date is in the past' }, { status: 400 });
      }
      if (end <= start) {
        return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
      }

      const calendar = await getCalendarAvailability(start, end);

      const rooms = calendar.rooms.map((room) => {
        const slug = room.name.toLowerCase().replace(/\s+/g, '-');
        const dates = room.dates.filter((d) => d.date >= start && d.date < end);
        const allAvailable = dates.length > 0 && dates.every((d) => d.available);
        const minPrice = dates.filter((d) => d.available && d.price > 0).map((d) => d.price);
        return {
          name: room.name,
          slug,
          available: allAvailable,
          price: minPrice.length > 0 ? Math.min(...minPrice) : null,
          nights: dates.length,
          dates: dates.map((d) => ({ date: d.date, available: d.available, price: d.price })),
        };
      });

      return NextResponse.json(
        { start, end, rooms },
        { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
      );
    }

    // ─── Today snapshot (original behavior) ─────────────────────────────────────
    const today = new Date().toISOString().split('T')[0];

    const calendar = await getCalendarAvailability(today, today);
    let availableSuites = 0;
    let wholeHouseAvailable = false;
    const availablePrices: number[] = [];

    for (const room of calendar.rooms) {
      const todayData = room.dates.find((d) => d.date === today);
      const isAvailable = todayData?.available ?? false;
      const price = todayData?.price;

      if (room.name.toLowerCase().replace(/\s+/g, '-') === 'whole-house') {
        wholeHouseAvailable = isAvailable;
      } else if (isAvailable) {
        availableSuites++;
        if (price && price > 0) {
          availablePrices.push(price);
        }
      }
    }

    const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;

    return NextResponse.json(
      { date: today, availableSuites, wholeHouseAvailable, totalSuites: 4, minPrice },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('[availability] error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
