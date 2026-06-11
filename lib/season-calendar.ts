/**
 * Cariló season calendar + Argentine public holidays.
 *
 * Season tiers reflect coastal AR demand, not generic months:
 *   peak     — Dec 20–Jan 31 + Carnaval week. Market median (Cariló cap≤6) $190–245/night.
 *   high     — Feb (after Carnaval window), Dec 1–19.
 *   shoulder — Mar, Apr 1–15, Nov. Market ratio ~0.85 of high.
 *   off      — Apr 16–Oct 31. Market off/high ratio 0.40–0.55 (paired-listing medians).
 *
 * Holiday premiums: feriado long weekends + Semana Santa + July winter break are the
 * only real demand spikes inside shoulder/off — they get a per-night premium instead
 * of a tier change.
 */

export type SeasonTier = 'peak' | 'high' | 'shoulder' | 'off';

/** Argentine public holidays (national feriados, incl. movable ones on their observed date). */
export const FERIADOS: string[] = [
  // 2026 H2
  '2026-06-17', '2026-06-20', '2026-07-09', '2026-08-17', '2026-10-12',
  '2026-11-20', '2026-12-07', '2026-12-08', '2026-12-25',
  // 2027
  '2027-01-01', '2027-02-08', '2027-02-09', // Carnaval
  '2027-03-24', '2027-03-26', // Memoria, Viernes Santo (Easter Mar 28)
  '2027-04-02', '2027-05-01', '2027-05-25', '2027-06-17', '2027-06-20',
  '2027-07-09', '2027-08-16', '2027-10-11', '2027-11-22', '2027-12-08', '2027-12-25',
  // 2028 Q1–Q2
  '2028-01-01', '2028-02-28', '2028-02-29', // Carnaval
  '2028-03-24', '2028-04-14', // Memoria, Viernes Santo (Easter Apr 16)
];

/** Date ranges (inclusive) treated as holiday windows beyond single feriados. */
const HOLIDAY_WINDOWS: Array<{ start: string; end: string }> = [
  { start: '2026-07-18', end: '2026-08-02' }, // vacaciones de invierno PBA 2026 (approx)
  { start: '2027-03-25', end: '2027-03-28' }, // Semana Santa 2027
  { start: '2027-07-17', end: '2027-08-01' }, // vacaciones de invierno PBA 2027 (approx)
  { start: '2028-04-13', end: '2028-04-16' }, // Semana Santa 2028
];

/** Carnaval weeks get full peak treatment (they behave like mini high season). */
const CARNAVAL_WINDOWS: Array<{ start: string; end: string }> = [
  { start: '2027-02-05', end: '2027-02-10' },
  { start: '2028-02-25', end: '2028-03-01' },
];

// ─── Date helpers (all in AR civil dates, no TZ math on YYYY-MM-DD strings) ───

function toUTC(dateStr: string): Date {
  return new Date(dateStr + 'T12:00:00Z');
}

export function addDays(dateStr: string, n: number): string {
  const d = toUTC(dateStr);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0];
}

/** 0=Sun … 6=Sat */
function dayOfWeek(dateStr: string): number {
  return toUTC(dateStr).getUTCDay();
}

function inWindow(dateStr: string, w: { start: string; end: string }): boolean {
  return dateStr >= w.start && dateStr <= w.end;
}

const FERIADO_SET = new Set(FERIADOS);

// ─── Season tier ──────────────────────────────────────────────────────────────

export function getSeasonTier(dateStr: string): SeasonTier {
  if (CARNAVAL_WINDOWS.some(w => inWindow(dateStr, w))) return 'peak';

  const m = Number(dateStr.slice(5, 7));
  const day = Number(dateStr.slice(8, 10));

  if ((m === 12 && day >= 20) || m === 1) return 'peak';
  if (m === 2 || (m === 12 && day < 20)) return 'high';
  if (m === 3 || (m === 4 && day <= 15) || m === 11) return 'shoulder';
  return 'off';
}

// ─── Night classification ─────────────────────────────────────────────────────

/** Fri/Sat nights — the standard weekend premium nights. */
export function isWeekendNight(dateStr: string): boolean {
  const dow = dayOfWeek(dateStr);
  return dow === 5 || dow === 6;
}

/**
 * A night gets the holiday premium when it sits inside a long-weekend block
 * (a run of ≥3 consecutive non-working days formed by weekends + feriados,
 * counting all nights except the run's final day — guests check out that day),
 * or inside an explicit holiday window (Semana Santa, winter break).
 */
export function isHolidayNight(dateStr: string): boolean {
  if (HOLIDAY_WINDOWS.some(w => inWindow(dateStr, w))) return true;

  const isFree = (d: string) => FERIADO_SET.has(d) || dayOfWeek(d) === 0 || dayOfWeek(d) === 6;
  if (!isFree(dateStr)) return false;

  // Find the run of consecutive free days containing this date
  let start = dateStr;
  while (isFree(addDays(start, -1))) start = addDays(start, -1);
  let end = dateStr;
  while (isFree(addDays(end, 1))) end = addDays(end, 1);

  const runLen = (toUTC(end).getTime() - toUTC(start).getTime()) / 86_400_000 + 1;
  if (runLen < 3) return false;

  // All nights of the block except the final day (checkout day) carry the premium
  return dateStr < end;
}
