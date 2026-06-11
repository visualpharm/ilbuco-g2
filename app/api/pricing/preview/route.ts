/**
 * /api/pricing/preview — day-by-day computed schedule for the /admin/pricing UI.
 *
 * GET ?days=300 → {
 *   role, start_date, end_date,
 *   rooms: { <name>: [{ date, tier, engine, price, booked, overrideId?, current }] },
 *   whole_house: [{ date, price, current }]
 * }
 * `current` = price currently in Hostex (so the UI can show pending diffs).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadConfig } from '@/lib/pricing-config';
import {
  buildPriceSchedule,
  IL_BUCO_ROOMS,
  WHOLE_HOUSE,
  type DayPriceEntry,
} from '@/lib/pricing-engine';
import { getCalendarAvailability } from '@/lib/hostex-api';

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

function todayAR(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' }).split(' ')[0];
}

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = Math.min(366, Math.max(30, Number(req.nextUrl.searchParams.get('days') ?? 300)));
  const startDate = addDays(todayAR(), 2);
  const endDate = addDays(startDate, days);

  const config = await loadConfig();
  const cal = await getCalendarAvailability(startDate, endDate);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  const occByRoom: Record<string, Record<string, number>> = {};
  const currentByRoom: Record<string, Record<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    const calRoom = byRoom.get(room.name);
    occByRoom[room.name] = {};
    currentByRoom[room.name] = {};
    for (const d of calRoom?.dates ?? []) {
      occByRoom[room.name][d.date] = d.available ? 0 : 1;
      currentByRoom[room.name][d.date] = d.price;
    }
  }

  const settings = { basePrices: config.basePrices, learned: config.learned, overrides: config.overrides };
  const rooms: Record<string, Array<DayPriceEntry & { current: number | null }>> = {};
  const schedules: Record<string, DayPriceEntry[]> = {};

  for (const room of IL_BUCO_ROOMS) {
    const schedule = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    schedules[room.name] = schedule;
    rooms[room.name] = schedule.map(e => ({
      ...e,
      current: currentByRoom[room.name][e.date] ?? null,
    }));
  }

  const whCal = byRoom.get(WHOLE_HOUSE.name);
  const whCurrent = new Map((whCal?.dates ?? []).map(d => [d.date, d.price]));
  const names = IL_BUCO_ROOMS.map(r => r.name);
  const whole_house = schedules[names[0]].map((e, i) => ({
    date: e.date,
    price: Math.round(names.reduce((a, n) => a + schedules[n][i].price, 0) * config.wholeHouseFactor),
    current: whCurrent.get(e.date) ?? null,
  }));

  return NextResponse.json({
    role: caller,
    start_date: startDate,
    end_date: endDate,
    config_updated_at: config.updatedAt ?? null,
    last_push: config.lastPush ?? null,
    rooms,
    whole_house,
  });
}
