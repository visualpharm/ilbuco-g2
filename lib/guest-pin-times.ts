/**
 * Stay-boundary helpers for guest PINs.
 *
 * Hostex gives check-in/out as date-only strings ("2026-10-11"). `new Date()` on
 * those is UTC midnight = 21:00 the evening before in Argentina, which revoked
 * codes a night early. A guest PIN is valid from 12:00 on check-in day to 12:00
 * on check-out day, Argentina time (check-in is 15:00, check-out 11:00 — an hour
 * of grace after check-out, noon arrivals for early check-in).
 */

export const PIN_TIMEZONE = 'America/Argentina/Buenos_Aires';
const AR_OFFSET = '-03:00'; // Argentina has no DST
const BOUNDARY_HOUR = '12:00:00';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Date-only → ISO timestamp at 12:00 Argentina time. Full timestamps pass through. */
export function stayBoundary(dateOrIso: string): string {
  return DATE_ONLY.test(dateOrIso) ? `${dateOrIso}T${BOUNDARY_HOUR}${AR_OFFSET}` : dateOrIso;
}

/** "YYYY-MM-DD HH:mm" wall-clock in Argentina time, the format U-tec schedules take. */
export function formatLockTime(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PIN_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find(p => p.type === t)!.value;
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

/** Hours until check-in (negative once started). */
export function hoursUntil(iso: string, now: Date = new Date()): number {
  return (new Date(iso).getTime() - now.getTime()) / 3600_000;
}

/** How long before check-in the code is sent to the guest. */
export const DELIVERY_LEAD_HOURS = 48;

/** After this many hours past the 12:00 boundary (≈ 15:00 check-in) the guest is already in; no code message. */
const ARRIVED_AFTER_HOURS = 3;

/**
 * Is the guest's code message due? Within DELIVERY_LEAD_HOURS before check-in,
 * until check-in time on arrival day. Stays already under way got their
 * instructions another way and are never messaged retroactively.
 */
export function isDeliveryDue(checkIn: string, now: Date = new Date()): boolean {
  const h = hoursUntil(checkIn, now);
  return h <= DELIVERY_LEAD_HOURS && h >= -ARRIVED_AFTER_HOURS;
}
