'use client';

/**
 * /admin/pricing — Il Buco price management UI (Ivan + Andrés).
 *
 * PriceLabs-style: month calendars with per-night computed prices, click a start
 * and end date to select a range, then override it (fixed $ or % coefficient) or
 * revert to the engine suggestion. Base-price matrix and learned coefficients are
 * editable below. "Publicar" pushes the schedule to Hostex (all channels).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

type Tier = 'peak' | 'high' | 'shoulder' | 'off';

interface DayEntry {
  date: string;
  tier: Tier;
  engine: number;
  price: number;
  booked: boolean;
  closed?: boolean;
  holiday?: boolean;
  fiestas?: boolean;
  minStay?: number;
  overrideId?: string;
  current: number | null;
}

interface Override {
  id: string;
  start: string;
  end: string;
  rooms: string[];
  mode: 'fixed' | 'coef';
  value: number;
  note?: string;
  author: string;
  createdAt: string;
}

interface Config {
  basePrices: Record<Tier, Record<string, number>>;
  learned: Record<string, Partial<Record<Tier, number>>>;
  learnedMeta: Record<string, Partial<Record<Tier, { nights: number; medianRatio: number; updatedAt: string }>>>;
  overrides: Override[];
  wholeHouseFactor: number;
  lastPush?: { at: string; by: string; ranges: number };
}

interface Preview {
  role: string;
  start_date: string;
  end_date: string;
  last_push: Config['lastPush'] | null;
  rooms: Record<string, DayEntry[]>;
  whole_house: DayEntry[];
}

const ROOMS = ['Giardino', 'Terrazzo', 'Paraiso', 'Penthouse'];
const CASA = 'Casa entera';
const TABS = [...ROOMS, CASA];
const TIERS: Tier[] = ['peak', 'high', 'shoulder', 'off'];
const TIER_LABEL: Record<Tier, string> = { peak: 'Pico (20 dic–feb)', high: 'Alta (1–19 dic)', shoulder: 'Media (mar–abr, nov)', off: 'Baja (may–oct)' };
const TIER_BG: Record<Tier, string> = {
  peak: 'bg-red-50', high: 'bg-orange-50', shoulder: 'bg-yellow-50', off: 'bg-slate-50',
};
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function PricingAdmin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [room, setRoom] = useState<string>('Giardino');
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const [ovMode, setOvMode] = useState<'fixed' | 'coef'>('fixed');
  const [ovValue, setOvValue] = useState('');
  const [ovRooms, setOvRooms] = useState<string[]>([]);
  const [ovNote, setOvNote] = useState('');
  const [busy, setBusy] = useState('');
  const [toast, setToast] = useState('');
  const [showBase, setShowBase] = useState(false);
  const [baseDraft, setBaseDraft] = useState<Record<Tier, Record<string, number>> | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 5000); };

  const loadAll = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/pricing/preview?days=300'),
      fetch('/api/pricing/config'),
    ]);
    if (pRes.status === 401) { setAuthed(false); return; }
    const p = await pRes.json();
    const c = await cRes.json();
    setPreview(p);
    setConfig(c.config);
    setBaseDraft(JSON.parse(JSON.stringify(c.config.basePrices)));
    setAuthed(true);
  }, []);

  useEffect(() => { loadAll().catch(() => setAuthed(false)); }, [loadAll]);

  async function login() {
    setLoginError('');
    const res = await fetch('/api/pricing/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setLoginError('Contraseña incorrecta'); return; }
    await loadAll();
  }

  // ── Range selection ────────────────────────────────────────────────────────
  function clickDay(date: string) {
    if (room === CASA) return; // casa = suma de suites; se ajusta vía las suites
    if (!selStart || (selStart && selEnd)) { setSelStart(date); setSelEnd(null); return; }
    if (date < selStart) { setSelStart(date); return; }
    setSelEnd(date);
    setOvRooms([room]);
  }
  const inSelection = (d: string) => selStart && (selEnd ? d >= selStart && d <= selEnd : d === selStart);

  async function saveOverride(mode?: 'suggested') {
    if (!selStart) return;
    const end = selEnd ?? selStart;
    setBusy('override');
    try {
      if (mode === 'suggested') {
        // Revert: delete overrides fully inside the selection for the selected rooms
        const targets = (config?.overrides ?? []).filter(o =>
          o.start >= selStart && o.end <= end &&
          (o.rooms.includes('*') || o.rooms.some(r => ovRooms.includes(r))));
        for (const o of targets) {
          await fetch(`/api/pricing/overrides?id=${o.id}`, { method: 'DELETE' });
        }
        flash(`${targets.length} ajuste(s) eliminados`);
      } else {
        const v = Number(ovValue.replace(',', '.'));
        if (!Number.isFinite(v)) { flash('Valor inválido'); setBusy(''); return; }
        const res = await fetch('/api/pricing/overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start: selStart, end,
            rooms: ovRooms.length === ROOMS.length ? ['*'] : ovRooms,
            mode: ovMode,
            value: ovMode === 'coef' ? v / 100 + 1 : v,
            note: ovNote || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) { flash(`Error: ${data.error}`); setBusy(''); return; }
        flash('Ajuste guardado. Tocá Publicar para enviarlo a Hostex.');
      }
      setSelStart(null); setSelEnd(null); setOvValue(''); setOvNote('');
      await loadAll();
    } finally { setBusy(''); }
  }

  async function deleteOverride(id: string) {
    setBusy(id);
    await fetch(`/api/pricing/overrides?id=${id}`, { method: 'DELETE' });
    await loadAll();
    setBusy('');
    flash('Ajuste eliminado. Tocá Publicar para actualizar Hostex.');
  }

  async function saveBase() {
    setBusy('base');
    const res = await fetch('/api/pricing/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ basePrices: baseDraft }),
    });
    setBusy('');
    if (res.ok) { flash('Precios base guardados. Tocá Publicar para enviarlos a Hostex.'); await loadAll(); }
    else flash('Error guardando precios base');
  }

  async function resetLearned(r: string, t: Tier) {
    await fetch('/api/pricing/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetLearned: [{ room: r, tier: t }] }),
    });
    await loadAll();
  }

  async function pushToHostex() {
    if (!confirm('¿Publicar los precios en Hostex (Airbnb + Booking + sitio)?')) return;
    setBusy('push');
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error}`); return; }
      flash(`Publicado ✓ (${data.rooms?.length ?? 0} listings actualizados)`);
      await loadAll();
    } finally { setBusy(''); }
  }

  // ── Calendar data ──────────────────────────────────────────────────────────
  const months = useMemo(() => {
    if (!preview) return [];
    const days = room === CASA ? (preview.whole_house ?? []) : (preview.rooms[room] ?? []);
    const byMonth = new Map<string, DayEntry[]>();
    for (const d of days) {
      const m = d.date.slice(0, 7);
      if (!byMonth.has(m)) byMonth.set(m, []);
      byMonth.get(m)!.push(d);
    }
    return [...byMonth.entries()];
  }, [preview, room]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (authed === null) return <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando…</div>;

  if (authed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-1">Il Buco — Precios</h1>
          <p className="text-sm text-slate-500 mb-4">Ingresá la contraseña</p>
          <input
            type="password" value={password} autoFocus
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            placeholder="Contraseña"
          />
          {loginError && <p className="text-sm text-red-600 mb-2">{loginError}</p>}
          <button onClick={login} className="w-full bg-slate-900 text-white rounded-lg py-2 font-medium">Entrar</button>
        </div>
      </div>
    );
  }

  const cfg = config!;
  const totalOverrides = cfg.overrides.length;

  return (
    <div className="min-h-screen bg-slate-100 pb-40">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex flex-wrap items-center gap-3">
        <h1 className="font-semibold text-lg">Il Buco — Precios</h1>
        <div className="flex gap-1 flex-wrap">
          {TABS.map(r => (
            <button key={r} onClick={() => { setRoom(r); setSelStart(null); setSelEnd(null); }}
              className={`px-3 py-1.5 rounded-full text-sm ${room === r ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {preview?.last_push && (
            <span className="text-xs text-slate-400 hidden sm:block">
              Última publicación: {new Date(preview.last_push.at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })} ({preview.last_push.by})
            </span>
          )}
          <button onClick={pushToHostex} disabled={busy === 'push'}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">
            {busy === 'push' ? 'Publicando…' : 'Publicar en Hostex'}
          </button>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg z-50 shadow-lg text-sm">
          {toast}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {TIERS.map(t => (
            <span key={t} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${TIER_BG[t]} border`} /> {TIER_LABEL[t]}
            </span>
          ))}
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-amber-500" /> ajuste manual</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-800" /> reservado</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> feriado / finde largo</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Navidad/Año Nuevo (mín 14 noches)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300" /> cerrado (solo casa entera)</span>
        </div>
        <p className="text-sm text-slate-500 -mt-3">
          {room === CASA
            ? `La casa entera se cotiza como la suma de las 4 suites × ${cfg.wholeHouseFactor}. Para ajustarla, editá las suites o el factor.`
            : 'Tocá una fecha de inicio y una de fin para ajustar un período. Los precios sugeridos ya incluyen temporada, feriados, findes y demanda.'}
        </p>

        {/* Calendars */}
        <div className="grid sm:grid-cols-2 gap-4">
          {months.map(([m, days]) => {
            const [yy, mm] = m.split('-').map(Number);
            // Pad from the first day actually present (first month starts mid-month)
            const firstDow = (new Date(days[0].date + 'T12:00:00Z').getUTCDay() + 6) % 7; // Mon=0
            return (
              <div key={m} className="bg-white rounded-xl shadow-sm p-3">
                <h3 className="font-medium mb-2 capitalize">{MONTH_NAMES[mm - 1]} {yy}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
                  {DOW.map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDow }).map((_, i) => <div key={`pad${i}`} />)}
                  {days.map(d => {
                    const selected = inSelection(d.date);
                    const changed = d.current !== null && d.current !== d.price;
                    return (
                      <button key={d.date} onClick={() => clickDay(d.date)}
                        className={`rounded-lg border p-1 text-center leading-tight min-h-[3.2rem] relative
                          ${d.closed ? 'bg-slate-200 opacity-70' : TIER_BG[d.tier]}
                          ${d.overrideId ? 'border-amber-500 border-2' : 'border-slate-200'}
                          ${selected ? 'ring-2 ring-blue-500' : ''}`}
                        title={[
                          d.fiestas ? 'Navidad/Año Nuevo' : d.holiday ? 'Feriado / finde largo' : '',
                          d.minStay && d.minStay > 2 ? `mínimo ${d.minStay} noches` : '',
                          d.booked ? 'reservado' : d.closed ? 'cerrado (solo casa entera)' : '',
                        ].filter(Boolean).join(' · ')}>
                        <div className="text-[10px] text-slate-400 flex justify-center items-center gap-0.5">
                          {Number(d.date.slice(8, 10))}
                          {d.fiestas
                            ? <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                            : d.holiday && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />}
                          {d.booked && <span className="w-1.5 h-1.5 rounded-full bg-slate-800 inline-block" />}
                        </div>
                        <div className={`text-xs font-semibold ${d.overrideId ? 'text-amber-700' : d.closed ? 'text-slate-400' : 'text-slate-800'}`}>${d.price}</div>
                        {changed && <div className="text-[9px] text-slate-400 line-through">${d.current}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Base prices */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <button onClick={() => setShowBase(!showBase)} className="font-medium w-full text-left">
            Precios base por temporada {showBase ? '▾' : '▸'}
          </button>
          {showBase && baseDraft && (
            <div className="mt-3 overflow-x-auto">
              <table className="text-sm w-full">
                <thead><tr className="text-slate-400 text-left">
                  <th className="py-1 pr-3">Temporada</th>
                  {ROOMS.map(r => <th key={r} className="py-1 pr-3">{r}</th>)}
                </tr></thead>
                <tbody>
                  {TIERS.map(t => (
                    <tr key={t} className="border-t">
                      <td className="py-2 pr-3">{TIER_LABEL[t]}</td>
                      {ROOMS.map(r => (
                        <td key={r} className="py-2 pr-3">
                          <input type="number" value={baseDraft[t][r]}
                            onChange={e => setBaseDraft({ ...baseDraft, [t]: { ...baseDraft[t], [r]: Number(e.target.value) } })}
                            className="w-20 border rounded px-2 py-1" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-2">Casa entera = suma de las 4 suites × {cfg.wholeHouseFactor}.</p>
              <button onClick={saveBase} disabled={busy === 'base'}
                className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                Guardar precios base
              </button>
            </div>
          )}
        </section>

        {/* Learned coefficients */}
        {Object.keys(cfg.learned).length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-medium mb-2">Aprendido de tus ajustes</h2>
            <div className="space-y-1 text-sm">
              {Object.entries(cfg.learned).flatMap(([r, byTier]) =>
                Object.entries(byTier).map(([t, coef]) => {
                  const meta = cfg.learnedMeta?.[r]?.[t as Tier];
                  return (
                    <div key={`${r}${t}`} className="flex items-center gap-2">
                      <span className="flex-1">{r} · {TIER_LABEL[t as Tier]}: <b>{coef && coef > 1 ? '+' : ''}{Math.round(((coef ?? 1) - 1) * 100)}%</b>
                        {meta && <span className="text-slate-400"> (de {meta.nights} noches ajustadas)</span>}</span>
                      <button onClick={() => resetLearned(r, t as Tier)} className="text-xs text-red-500">reset</button>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">El motor aprende de los ajustes manuales y mueve los precios sugeridos hacia lo que ustedes fijan.</p>
          </section>
        )}

        {/* Overrides list */}
        {totalOverrides > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-medium mb-2">Ajustes manuales activos ({totalOverrides})</h2>
            <div className="space-y-2 text-sm">
              {[...cfg.overrides].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(o => (
                <div key={o.id} className="flex items-center gap-2 border-t pt-2 first:border-0 first:pt-0">
                  <span className="flex-1">
                    <b>{o.start === o.end ? o.start : `${o.start} → ${o.end}`}</b> · {o.rooms.includes('*') ? 'todas las suites' : o.rooms.join(', ')} ·{' '}
                    {o.mode === 'fixed' ? `$${o.value} fijo` : `${o.value > 1 ? '+' : ''}${Math.round((o.value - 1) * 100)}%`}
                    {o.note && <span className="text-slate-400"> — {o.note}</span>}
                    <span className="text-slate-300"> ({o.author})</span>
                  </span>
                  <button onClick={() => deleteOverride(o.id)} disabled={busy === o.id} className="text-red-500 text-xs">eliminar</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Range action panel */}
      {selStart && selEnd && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t shadow-2xl p-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <b>{selStart} → {selEnd}</b>
              <button onClick={() => { setSelStart(null); setSelEnd(null); }} className="text-slate-400">✕ cancelar</button>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-slate-500">Suites:</span>
              {ROOMS.map(r => (
                <button key={r}
                  onClick={() => setOvRooms(ovRooms.includes(r) ? ovRooms.filter(x => x !== r) : [...ovRooms, r])}
                  className={`px-2 py-1 rounded-full text-xs ${ovRooms.includes(r) ? 'bg-slate-900 text-white' : 'bg-slate-200'}`}>
                  {r}
                </button>
              ))}
              <button onClick={() => setOvRooms([...ROOMS])} className="text-xs text-blue-600">todas</button>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <select value={ovMode} onChange={e => setOvMode(e.target.value as 'fixed' | 'coef')} className="border rounded-lg px-2 py-1.5">
                <option value="fixed">Precio fijo USD</option>
                <option value="coef">Ajuste % sobre sugerido</option>
              </select>
              <input value={ovValue} onChange={e => setOvValue(e.target.value)} inputMode="decimal"
                placeholder={ovMode === 'fixed' ? 'ej: 120' : 'ej: 15 o -10'}
                className="border rounded-lg px-3 py-1.5 w-28" />
              <input value={ovNote} onChange={e => setOvNote(e.target.value)} placeholder="nota (opcional)"
                className="border rounded-lg px-3 py-1.5 flex-1 min-w-[8rem]" />
              <button onClick={() => saveOverride()} disabled={busy === 'override' || !ovRooms.length || !ovValue}
                className="bg-slate-900 text-white px-4 py-1.5 rounded-lg disabled:opacity-40">Guardar</button>
              <button onClick={() => saveOverride('suggested')} disabled={busy === 'override'}
                className="text-sm text-blue-600">volver al sugerido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
