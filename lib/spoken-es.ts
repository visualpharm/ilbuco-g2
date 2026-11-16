/**
 * Spanish (rioplatense) words for phone answers: the voice agent reads numbers
 * and dates the way a person says them, never "1706271" digit by digit.
 */

const UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho',
  'veintinueve'];
const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos',
  'setecientos', 'ochocientos', 'novecientos'];

function below100(n: number): string {
  if (n < 30) return UNITS[n];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${TENS[t]} y ${UNITS[u]}` : TENS[t];
}

function below1000(n: number): string {
  if (n === 100) return 'cien';
  const h = Math.floor(n / 100), r = n % 100;
  return [HUNDREDS[h], r ? below100(r) : ''].filter(Boolean).join(' ');
}

/** "uno" before a masculine noun is "un"; "veintiuno" → "veintiún". */
function apocope(words: string): string {
  return words.replace(/veintiuno$/, 'veintiún').replace(/(^|\s)uno$/, '$1un');
}

/** Cardinal in words. `beforeNoun` apocopates a trailing "uno" (un dólar, veintiún pesos). */
export function numeroEnPalabras(n: number, beforeNoun = false): string {
  n = Math.round(n);
  if (n < 0) return `menos ${numeroEnPalabras(-n, beforeNoun)}`;
  if (n === 0) return 'cero';
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions) parts.push(millions === 1 ? 'un millón' : `${apocope(numeroEnPalabras(millions))} millones`);
  if (thousands) parts.push(thousands === 1 ? 'mil' : `${apocope(below1000(thousands))} mil`);
  if (rest) parts.push(below1000(rest));
  const words = parts.join(' ');
  return beforeNoun ? apocope(words) : words;
}

/** "quinientos cincuenta y dos dólares", "un dólar", "un millón de pesos". */
export function dineroEnPalabras(amount: number, currency: 'USD' | 'ARS'): string {
  const n = Math.round(amount);
  const noun = currency === 'USD' ? (n === 1 ? 'dólar' : 'dólares') : (n === 1 ? 'peso' : 'pesos');
  const words = numeroEnPalabras(n, true);
  const de = n >= 1_000_000 && n % 1_000_000 === 0 ? 'de ' : '';
  return `${words} ${de}${noun}`;
}

const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre',
  'noviembre', 'diciembre'];

function parts(iso: string): { y: number; m: number; d: number; wd: number } {
  const dt = new Date(`${iso}T12:00:00Z`);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), wd: dt.getUTCDay() };
}

/** "sábado 5 de diciembre" */
export function fechaHablada(iso: string): string {
  const p = parts(iso);
  return `${WEEKDAYS[p.wd]} ${p.d} de ${MONTHS[p.m]}`;
}

/** "del sábado 5 al lunes 7 de diciembre" / "del miércoles 30 de diciembre al domingo 3 de enero". */
export function rangoHablado(checkIn: string, checkOut: string): string {
  const a = parts(checkIn), b = parts(checkOut);
  const from = a.m === b.m && a.y === b.y ? `${WEEKDAYS[a.wd]} ${a.d}` : fechaHablada(checkIn);
  return `del ${from} al ${fechaHablada(checkOut)}`;
}

/** "una noche", "cuatro noches" */
export function nochesHabladas(n: number): string {
  return n === 1 ? 'una noche' : `${numeroEnPalabras(n)} noches`;
}

/** Alias read slowly, letter by letter, as a person dictates it on the phone. */
export const ALIAS_PAGO = 'ilbuco.carilo';
export function aliasDeletreado(alias: string = ALIAS_PAGO): string {
  const NAMES: Record<string, string> = {
    a: 'a', b: 'be larga', c: 'ce', d: 'de', e: 'e', f: 'efe', g: 'ge', h: 'hache', i: 'i', j: 'jota', k: 'ka', l: 'ele',
    m: 'eme', n: 'ene', o: 'o', p: 'pe', q: 'cu', r: 'ere', s: 'ese', t: 'te', u: 'u', v: 've corta', w: 'doble ve',
    x: 'equis', y: 'ye', z: 'zeta', '.': 'punto',
  };
  return alias.toLowerCase().split('').map(ch => NAMES[ch] ?? ch).join(', ');
}

/** Spanish syllables of the alias, for dictating it slowly: "il, bu, co, punto, ca, ri, lo". */
export function aliasPorSilabas(alias: string = ALIAS_PAGO): string {
  return alias.toLowerCase().split('.').map(silabas).map(s => s.join(', ')).join(', punto, ');
}

/** Rough Spanish syllabification, enough for plain words like ilbuco or carilo (V, CV, VC, CVC). */
function silabas(word: string): string[] {
  const V = /[aeiouáéíóú]/;
  const out: string[] = [];
  let cur = '';
  for (let i = 0; i < word.length; i++) {
    cur += word[i];
    const next = word[i + 1], after = word[i + 2];
    if (!V.test(word[i]) || next === undefined) continue;
    // vowel: close the syllable unless one consonant follows that has no vowel after it (il-bu, car-ne)
    if (!V.test(next) && after !== undefined && !V.test(after)) { cur += next; i++; }
    else if (!V.test(next) && after === undefined) { cur += next; i++; }
    out.push(cur);
    cur = '';
  }
  if (cur) out.push(cur);
  return out;
}
