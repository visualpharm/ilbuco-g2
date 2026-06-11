/**
 * /api/pricing/preview — day-by-day computed schedule for the /admin/pricing UI.
 *
 * GET ?days=300 → {
 *   role, start_date, end_date,
 *   rooms: { <name>: [DayCell] },        // 4 suites
 *   whole_house: [DayCell]               // derived: sum × factor
 * }
 * DayCell: { date, tier, engine, price, booked, closed, holiday, fiestas, minStay,
 *            overrideId?, current }
 *   booked = real reservation; closed = blocked (whole-house-only window or
 *   cross-block), current = price now in Hostex.
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
import { getCalendarAvailability, getReservations } from '@/lib/hostex-api';
import { isHolidayNight, isFiestasNight, getSeasonTier, addDays } from '@/lib/season-calendar';
import { minStayForDate, DEFAULT_STAY_POLICY } from '@/lib/stay-policy';
import { todayAR } from '@/lib/run-pricing';

const LISTING_TO_PROPERTY: Record<string, number> = {
  '110800-13274': 12282945,
  '110801-13274': 12282946,
  '110802-13274': 12282947,
  '110803-13274': 12282948,
  '113182-13274': 12299611,
};

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = Math.min(366, Math.max(30, Number(req.nextUrl.searchParams.get('days') ?? 300)));
  const today = todayAR();
  const startDate = addDays(today, 2);
  const endDate = addDays(startDate, days);

  const config = await loadConfig();
  const stayPolicy = { ...DEFAULT_STAY_POLICY, ...(config.stayPolicy ?? {}) };
  const [cal, reservations] = await Promise.all([
    getCalendarAvailability(startDate, endDate),
    getReservations(addDays(startDate, -35), endDate),
  ]);
  const byRoom = new Map(cal.rooms.map(r => [r.name, r]));

  // Real bookings per property (to distinguish "reservado" from "cerrado")
  const bookedByProperty = new Map<number, Set<string>>();
  for (const r of reservations) {
    const set = bookedByProperty.get(r.property_id) ?? new Set<string>();
    for (let d = r.check_in_date; d < r.check_out_date; d = addDays(d, 1)) set.add(d);
    bookedByProperty.set(r.property_id, set);
  }

  const occByRoom: Record<string, Record<string, number>> = {};
  const currentByRoom: Record<string, Record<string, number>> = {};
  for (const room of IL_BUCO_ROOMS) {
    const calRoom = byRoom.get(room.name);
    occByRoom[room.name] = {};
    currentByRoom[room.name] = {};
    for (const d of calRoom?.dates ?? []) {
      // demand pacing should see REAL bookings, not cross-block closures
      const booked = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId])?.has(d.date) ?? false;
      occByRoom[room.name][d.date] = booked ? 1 : 0;
      currentByRoom[room.name][d.date] = d.price;
    }
  }

  // Per-date flags computed once
  const flags = new Map<string, { holiday: boolean; fiestas: boolean; minStay: number }>();
  for (let d = startDate; d < endDate; d = addDays(d, 1)) {
    flags.set(d, {
      holiday: isHolidayNight(d),
      fiestas: isFiestasNight(d),
      minStay: minStayForDate(d, today, stayPolicy),
    });
  }

  const settings = { basePrices: config.basePrices, learned: config.learned, overrides: config.overrides };
  const schedules: Record<string, DayPriceEntry[]> = {};
  const rooms: Record<string, unknown[]> = {};

  for (const room of IL_BUCO_ROOMS) {
    const schedule = buildPriceSchedule(room.name, startDate, endDate, occByRoom, settings);
    schedules[room.name] = schedule;
    const calInv = new Map((byRoom.get(room.name)?.dates ?? []).map(d => [d.date, d.available]));
    const bookedSet = bookedByProperty.get(LISTING_TO_PROPERTY[room.listingId]) ?? new Set<string>();

    rooms[room.name] = schedule.map(e => {
      const f = flags.get(e.date)!;
      const booked = bookedSet.has(e.date);
      const closed = !booked && calInv.get(e.date) === false;
      return {
        ...e,
        booked,
        closed,
        holiday: f.holiday,
        fiestas: f.fiestas,
        minStay: f.minStay,
        current: currentByRoom[room.name][e.date] ?? null,
      };
    });
  }

  // Whole house: derived prices + own booked/closed state
  const whCal = byRoom.get(WHOLE_HOUSE.name);
  const whCurrent = new Map((whCal?.dates ?? []).map(d => [d.date, d.price]));
  const whInv = new Map((whCal?.dates ?? []).map(d => [d.date, d.available]));
  const whBooked = bookedByProperty.get(LISTING_TO_PROPERTY[WHOLE_HOUSE.listingId]) ?? new Set<string>();
  const names = IL_BUCO_ROOMS.map(r => r.name);

  const whole_house = schedules[names[0]].map((e, i) => {
    const f = flags.get(e.date)!;
    const booked = whBooked.has(e.date);
    const closed = !booked && whInv.get(e.date) === false;
    return {
      date: e.date,
      tier: getSeasonTier(e.date),
      engine: 0,
      price: Math.round(names.reduce((a, n) => a + schedules[n][i].price, 0) * config.wholeHouseFactor),
      booked,
      closed,
      holiday: f.holiday,
      fiestas: f.fiestas,
      minStay: f.minStay,
      current: whCurrent.get(e.date) ?? null,
    };
  });

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
