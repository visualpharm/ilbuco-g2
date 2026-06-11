/**
 * Stay policy — min-stay ladder + whole-house-only window (Ivan, 2026-06-11).
 *
 * Goal: no 3-day Navidad/Año-Nuevo bookings fragmenting the calendar. Fill the
 * fiestas with long stays, ideally the whole house.
 *
 *  - Until Nov 1: high-season dates (Dec–Feb) bookable ONLY as the whole house —
 *    the 4 suites are closed (inventory 0) for those dates.
 *  - Super-high window (Dec 15–Jan 31): min stay 14 nights now; from Sep 1 it
 *    relaxes to 7 nights.
 *  - Fiestas (Dec 24–Jan 2): min stay 14 nights ALWAYS (no relaxation).
 *  - Everywhere else: default min stay 2.
 *
 * All dates are config-overridable via the pricing config (stayPolicy key).
 */

export interface StayPolicy {
  /** Suites closed (whole-house-only) for this stay-date range while today < until */
  wholeHouseOnly: { start: string; end: string; until: string };
  /** Super-high min-stay ladder */
  superHigh: { start: string; end: string; minStayNow: number; relaxFrom: string; minStayLater: number };
  /** Fiestas: strict min stay, never relaxes */
  fiestas: { start: string; end: string; minStay: number };
  defaultMinStay: number;
}

export const DEFAULT_STAY_POLICY: StayPolicy = {
  wholeHouseOnly: { start: '2026-12-01', end: '2027-02-28', until: '2026-11-01' },
  superHigh: { start: '2026-12-15', end: '2027-01-31', minStayNow: 14, relaxFrom: '2026-09-01', minStayLater: 7 },
  fiestas: { start: '2026-12-24', end: '2027-01-02', minStay: 14 },
  defaultMinStay: 2,
};

function inRange(d: string, r: { start: string; end: string }): boolean {
  return d >= r.start && d <= r.end;
}

/** Min stay (nights) required for an arrival on `date`, evaluated as of `today`. */
export function minStayForDate(date: string, today: string, p: StayPolicy): number {
  if (inRange(date, p.fiestas)) return p.fiestas.minStay;
  if (inRange(date, p.superHigh)) {
    return today >= p.superHigh.relaxFrom ? p.superHigh.minStayLater : p.superHigh.minStayNow;
  }
  return p.defaultMinStay;
}

/** True if suites must be closed (whole-house-only) for stay date `date` as of `today`. */
export function suitesClosedForDate(date: string, today: string, p: StayPolicy): boolean {
  return today < p.wholeHouseOnly.until && inRange(date, p.wholeHouseOnly);
}
