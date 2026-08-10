'use client';

/**
 * Il Buco CRM panel — guest history table with sort, search, filter,
 * and multi-select (with shift-click).
 *
 * Tabla de historial de huéspedes con búsqueda, filtros, selección múltiple,
 * y motor de outreach por WhatsApp.
 *
 * Shown as a tab inside /nimda. Data comes from /api/nimda/crm/guests.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGE_FLAGS, type CrmGuest as CrmGuestType } from '@/lib/crm-store';
import { getPropertyGroup } from '@/lib/hostex-api';

interface GuestReservation {
  code: string;
  property: string;
  checkIn: string;
  checkOut: string;
  status: string;
  guests: number;
  totalRate?: number;
  currency?: string;
  conversationId?: string;
  channel: string;
}

interface GuestMessage {
  source: string;
  direction: string;
  text: string;
  timestamp: string;
}

interface GuestSummary {
  happinessScore: number;
  sentiment: string;
  summary: string;
  keyMoments: string[];
  language: string;
  recommendedOffer: string;
  generatedAt: string;
}

interface CrmGuest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  language: string;
  channels: string[];
  reservations: GuestReservation[];
  messages: GuestMessage[];
  reviewScore?: number;
  reviewContent?: string;
  summary?: GuestSummary;
  firstBookedAt?: string;
}

type SortField = 'name' | 'language' | 'whatsapp' | 'stays' | 'lastStay' | 'happiness' | 'channel' | 'property';
type SortDir = 'asc' | 'desc';

function fmtDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function fmtDateTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function happinessColor(score?: number): string {
  if (score === undefined) return 'text-slate-300';
  if (score >= 4.5) return 'text-emerald-600 font-bold';
  if (score >= 3.5) return 'text-amber-600 font-medium';
  if (score >= 2.5) return 'text-orange-600';
  return 'text-red-600 font-bold';
}

// Determine which property group a guest belongs to (for filtering)
function guestPropertyGroup(g: CrmGuest): 'ilbuco' | 'recharge' | 'mixed' | 'other' {
  const groups = new Set(g.reservations.map(r => getPropertyGroup(r.property)));
  if (groups.size === 0) return 'other';
  if (groups.size === 1) return [...groups][0] as 'ilbuco' | 'recharge' | 'other';
  return 'mixed';
}

// Quick message templates for the outreach composer
const TEMPLATES: Record<string, { name: string; template: string; description: string }> = {
  post_stay_review: {
    name: '📋 Pedir reseña',
    description: 'Después del checkout',
    template: `¡{Hola|Hey|Buenas} {name}! {Espero|Esperamos} que hayas llegado bien a casa 🌲 ¿Nos {dejarías|dejan} una reseña? {Ayuda mucho|Significa mucho} 🙏`,
  },
  return_repeat: {
    name: '🔄 Huésped recurrente',
    description: 'Ya vino varias veces',
    template: `¡{Hola|Hey} {name}! {Qué bueno|Nos alegra} verte de nuevo. {Ya es|Vienen siendo} {stays} estadías en {property} 🌲 Si {querés|tenés ganas de} volver, tenemos algo especial para vos.`,
  },
  off_season_nomad: {
    name: '🏝️ Nómada baja temporada',
    description: 'Tarifa mensual mayo-septiembre',
    template: `{Hola|Hey} {name}! {Hace|Ya van} {monthsAgo} {meses|mes} desde tu última visita a {property}. Si {querés|tenés ganas de} volver a trabajar al bosque, tenemos tarifa nómada para estadas largas. ¿Te {interesa|mando} los precios?`,
  },
  return_discount: {
    name: '🎁 Descuento retorno',
    description: '15% off para huéspedes que vuelven',
    template: `¡{Hola|Hey} {name}! {Como ya nos conocemos|Como ya estuviste acá {stays} {vez|veces}}, te {ofrecemos|damos} 15% off en tu próxima reserva directa. Código VOLVER15 en book.ilbuco.com.ar 🌲`,
  },
  holiday: {
    name: '🎉 Feriado disponible',
    description: 'Avisar fechas libres',
    template: `{Hola|Hey} {name}! {Quedan|Tenemos} fechas libres para {el feriado|Semana Santa} en {property}. Si {querés|pensás} volver a Cariló, {avisanos|escribinos} pronto que se llenan rápido 🌊`,
  },
  referral: {
    name: '👥 Referido',
    description: 'Pedir que recomienden',
    template: `{Hola|Hey} {name}! Si {conocés|tenés} alguien que le {gustaría|encantaría} {property}, {mandalos|mándalos}. A vos y a ellos les {damos|hacemos} una noche gratis 🌲✨`,
  },
  we_miss_you: {
    name: '💭 Te extrañamos',
    description: 'Hace mucho que no vuelve',
    template: `{Hola|Hey} {name}! {Hace|Ya pasaron} {monthsAgo} {meses|mes} desde tu estadía en {property} 🌲 {¿Cómo estás?|¿Todo bien?} Si {extrañás|extrañan} el bosque, {tenemos|hay} disponibilidad este {year}.`,
  },
};

// Placeholders the user can insert into the template
const PLACEHOLDERS: { key: string; label: string; description: string }[] = [
  { key: 'name', label: '{name}', description: 'Nombre de pila (ej: Maria)' },
  { key: 'fullName', label: '{fullName}', description: 'Nombre completo' },
  { key: 'stays', label: '{stays}', description: 'Cantidad de estadías (ej: 3)' },
  { key: 'staysWord', label: '{staysWord}', description: 'Estadías en palabras (ej: tres)' },
  { key: 'property', label: '{property}', description: 'Propiedad última (ej: Terrazzo)' },
  { key: 'monthsAgo', label: '{monthsAgo}', description: 'Meses desde última visita (ej: 4)' },
  { key: 'monthsAgoWord', label: '{monthsAgoWord}', description: 'Meses en palabras (ej: cuatro)' },
  { key: 'lastStay', label: '{lastStay}', description: 'Fecha última estadía (ej: 03/05/26)' },
  { key: 'year', label: '{year}', description: 'Año actual (ej: 2026)' },
  { key: 'channel', label: '{channel}', description: 'Canal de reserva (ej: airbnb)' },
];

export default function CrmPanel() {
  const [guests, setGuests] = useState<CrmGuest[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Table state
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('lastStay');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [filterContact, setFilterContact] = useState('all'); // all / whatsapp / email

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const lastCheckedRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Outreach state
  const [showOutreach, setShowOutreach] = useState(false);
  const [outreachStep, setOutreachStep] = useState<'compose' | 'preview' | 'sending'>('compose');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [useSpintax, setUseSpintax] = useState(true);
  const [previewData, setPreviewData] = useState<Array<{ name: string; phone: string | null; rendered: string }>>([]);
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const [generatingSummaries, setGeneratingSummaries] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ done: number; total: number } | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 5000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nimda/crm/guests');
      if (res.status === 401) return;
      const data = await res.json();
      setGuests(data.guests ?? []);
      setLastSyncAt(data.lastSyncAt ?? null);
    } catch {
      flash('Error al cargar huéspedes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function syncGuests() {
    setSyncing(true);
    flash('Sincronizando desde Hostex + WhatsApp... (tarda 1-5 min)');
    try {
      const res = await fetch('/api/nimda/crm/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success || data.totalGuests !== undefined) {
        flash(`✓ Sincronizado: ${data.totalGuests} huéspedes, ${data.reservations} reservas, ${data.conversations} conversaciones, ${data.reviews} reseñas`);
        await load();
      } else {
        flash(`Error de sync: ${data.error || 'desconocido'}`);
      }
    } catch (err) {
      flash('Falló la sincronización');
    } finally {
      setSyncing(false);
    }
  }

  async function generateSummaries() {
    setGeneratingSummaries(true);
    flash('Generando resúmenes de felicidad con IA... (hasta 20 huéspedes, ~1 min)');
    try {
      const res = await fetch('/api/nimda/crm/summaries', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        flash(`✓ ${data.updated} resúmenes generados`);
        await load();
      } else {
        flash(`Error: ${data.error || 'desconocido'}`);
      }
    } catch {
      flash('Falló la generación de resúmenes');
    } finally {
      setGeneratingSummaries(false);
    }
  }

  // Outreach: count how many selected guests have phone numbers
  const selectedGuests = guests.filter(g => selected.has(g.id));
  const selectedWithPhone = selectedGuests.filter(g => g.phone);

  /** Insert a placeholder at cursor position in the textarea */
  function insertPlaceholder(key: string) {
    const ta = textareaRef.current;
    const placeholder = `{${key}}`;
    if (!ta) {
      setMessageTemplate(messageTemplate + placeholder);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newText = messageTemplate.slice(0, start) + placeholder + messageTemplate.slice(end);
    setMessageTemplate(newText);
    // Restore cursor after the inserted text
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + placeholder.length;
    }, 0);
  }

  /** Step 2: fetch preview from API for all selected guests */
  async function fetchPreview() {
    if (!messageTemplate.trim()) { flash('Escribí un mensaje primero'); return; }
    if (selectedWithPhone.length === 0) { flash('Ninguno de los seleccionados tiene teléfono'); return; }

    setOutreachStep('preview');
    try {
      const res = await fetch('/api/nimda/crm/outreach/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestIds: selectedWithPhone.map(g => g.id),
          template: messageTemplate,
          useSpintax,
        }),
      });
      const data = await res.json();
      if (data.previews) {
        setPreviewData(data.previews.map((p: { name: string; phone: string | null; renderedMessage: string | null }) => ({
          name: p.name,
          phone: p.phone,
          rendered: p.renderedMessage ?? '(sin teléfono)',
        })));
      }
    } catch {
      flash('Error al generar vista previa');
      setOutreachStep('compose');
    }
  }

  /** Step 3: actually send the campaign */
  async function sendOutreach() {
    setOutreachStep('sending');
    setSendingOutreach(true);
    setSendProgress({ done: 0, total: selectedWithPhone.length });
    try {
      const res = await fetch('/api/nimda/crm/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestIds: selectedWithPhone.map(g => g.id),
          template: messageTemplate,
          useSpintax,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.report;
        flash(`✓ Enviados ${r.sent}/${r.total} (${r.skipped} salteados, ${r.failed} fallidos)`);
        setShowOutreach(false);
        setOutreachStep('compose');
      } else {
        flash(`Error de envío: ${data.error || 'desconocido'}`);
        setOutreachStep('preview');
      }
    } catch {
      flash('Falló el envío');
      setOutreachStep('preview');
    } finally {
      setSendingOutreach(false);
      setSendProgress(null);
    }
  }

  /** Quick inline preview for compose step (first selected guest) */
  function quickPreview(): string {
    if (selectedWithPhone.length === 0 || !messageTemplate.trim()) return '';
    const g = selectedWithPhone[0];
    const firstName = g.name.split(/\s+/)[0] || g.name;
    const lastRes = g.reservations[g.reservations.length - 1];
    const stays = String(g.reservations.length);
    const property = lastRes?.property ?? 'Il Buco';
    let result = messageTemplate
      .replace(/\{name\}/g, firstName)
      .replace(/\{fullName\}/g, g.name)
      .replace(/\{stays\}/g, stays)
      .replace(/\{property\}/g, property)
      .replace(/\{year\}/g, String(new Date().getFullYear()));
    // Expand spintax
    if (useSpintax) {
      result = result.replace(/\{([^{}]*\|[^{}]*)\}/g, (_, content) => {
        const opts = content.split('|');
        return opts[Math.floor(Math.random() * opts.length)];
      });
    } else {
      result = result.replace(/\{([^{}]*\|[^{}]*)\}/g, (_, content) => content.split('|')[0]);
    }
    return result.slice(0, 300);
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const channels = useMemo(() => [...new Set(guests.flatMap(g => g.channels))].sort(), [guests]);
  const languages = useMemo(() => [...new Set(guests.map(g => g.language))].sort(), [guests]);

  const filtered = useMemo(() => {
    let result = [...guests];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        g.phone?.includes(q) ||
        g.reservations.some(r => r.code.toLowerCase().includes(q))
      );
    }

    // Channel filter
    if (filterChannel !== 'all') {
      result = result.filter(g => g.channels.includes(filterChannel));
    }

    // Language filter
    if (filterLanguage !== 'all') {
      result = result.filter(g => g.language === filterLanguage);
    }

    // Property filter (Il Buco vs Recharge)
    if (filterProperty !== 'all') {
      result = result.filter(g => {
        const group = guestPropertyGroup(g);
        if (filterProperty === 'ilbuco') return group === 'ilbuco' || group === 'mixed';
        if (filterProperty === 'recharge') return group === 'recharge' || group === 'mixed';
        return true;
      });
    }

    // Contact filter (has WhatsApp / has email)
    if (filterContact === 'whatsapp') {
      result = result.filter(g => g.phone && g.channels.includes('whatsapp'));
    } else if (filterContact === 'email') {
      result = result.filter(g => g.email);
    } else if (filterContact === 'phone') {
      result = result.filter(g => g.phone);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'language': cmp = a.language.localeCompare(b.language); break;
        case 'whatsapp': cmp = (a.phone ?? 'z').localeCompare(b.phone ?? 'z'); break;
        case 'property': cmp = (a.reservations[0]?.property ?? 'z').localeCompare(b.reservations[0]?.property ?? 'z'); break;
        case 'stays': cmp = a.reservations.length - b.reservations.length; break;
        case 'lastStay':
          cmp = (a.reservations[a.reservations.length - 1]?.checkOut ?? '')
            .localeCompare(b.reservations[b.reservations.length - 1]?.checkOut ?? '');
          break;
        case 'happiness':
          cmp = (a.summary?.happinessScore ?? a.reviewScore ?? -1) -
                (b.summary?.happinessScore ?? b.reviewScore ?? -1);
          break;
        case 'channel': cmp = (a.channels[0] ?? '').localeCompare(b.channels[0] ?? ''); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [guests, search, filterChannel, filterLanguage, filterProperty, filterContact, sortField, sortDir]);

  // ── Selection handlers ──────────────────────────────────────────────────────
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function toggleSelect(id: string, shiftKey: boolean) {
    const newSelected = new Set(selected);
    if (shiftKey && lastCheckedRef.current) {
      const ids = filtered.map(g => g.id);
      const startIdx = ids.indexOf(lastCheckedRef.current);
      const endIdx = ids.indexOf(id);
      if (startIdx >= 0 && endIdx >= 0) {
        const [from, to] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
        const allChecked = selected.has(id);
        for (let i = from; i <= to; i++) {
          if (allChecked) newSelected.delete(ids[i]);
          else newSelected.add(ids[i]);
        }
      }
    } else {
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
    }
    lastCheckedRef.current = id;
    setSelected(newSelected);
  }

  function selectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(g => g.id)));
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400">Cargando CRM...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-3 flex flex-wrap gap-2 items-center text-sm">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar nombre, email, teléfono..."
          className="border rounded-lg px-3 py-1.5 flex-1 min-w-[12rem]"
        />
        <select value={filterProperty} onChange={e => setFilterProperty(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">Todas las propiedades</option>
          <option value="ilbuco">🌲 Il Buco</option>
          <option value="recharge">🌿 Recharge Retreat</option>
        </select>
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">Todos los canales</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">Todos los idiomas</option>
          {languages.map(l => <option key={l} value={l}>{LANGUAGE_FLAGS[l as keyof typeof LANGUAGE_FLAGS] || '🌐'} {l}</option>)}
        </select>
        <select value={filterContact} onChange={e => setFilterContact(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">Todo contacto</option>
          <option value="whatsapp">📱 Solo con WhatsApp</option>
          <option value="phone">☎️ Solo con teléfono</option>
          <option value="email">✉️ Solo con email</option>
        </select>
        <span className="text-slate-400 text-xs">
          {filtered.length} / {guests.length}
        </span>
        <button
          onClick={syncGuests}
          disabled={syncing}
          className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
        >
          {syncing ? 'Sincronizando...' : '↻ Sincronizar'}
        </button>
        <button
          onClick={generateSummaries}
          disabled={generatingSummaries}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
        >
          {generatingSummaries ? '🧠 IA...' : '🧠 Felicidad'}
        </button>
      </div>

      {lastSyncAt && (
        <div className="text-xs text-slate-400 px-1">
          Última sincronización: {fmtDateTime(lastSyncAt)}
        </div>
      )}

      {/* Guest table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-slate-400 mb-2">
            {guests.length === 0
              ? 'Sin huéspedes todavía. Tocá "Sincronizar" para traerlos de Hostex.'
              : 'Ningún huéspede coincide con los filtros.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4"
                  />
                </th>
                <SortHeader label="Nombre" field="name" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Idioma" field="language" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="WhatsApp" field="whatsapp" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Propiedad" field="property" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Estadías" field="stays" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Última" field="lastStay" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Canal" field="channel" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Felicidad" field="happiness" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const isExpanded = expanded === g.id;
                const isSelected = selected.has(g.id);
                const happiness = g.summary?.happinessScore ?? g.reviewScore;
                const lastStay = g.reservations[g.reservations.length - 1];
                const propGroup = guestPropertyGroup(g);
                const propLabel = propGroup === 'ilbuco' ? '🌲 Il Buco'
                  : propGroup === 'recharge' ? '🌿 Recharge'
                  : propGroup === 'mixed' ? '🌲🌿 Ambas'
                  : '—';
                return (
                  <>
                    <tr
                      key={g.id}
                      className={`border-t hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(g.id, e.shiftKey);
                          }}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td
                        className="px-3 py-2.5 font-medium cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : g.id)}
                      >
                        {g.name}
                      </td>
                      <td className="px-3 py-2.5 text-center" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {LANGUAGE_FLAGS[g.language as keyof typeof LANGUAGE_FLAGS] || '🌐'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs font-mono" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.phone ? (
                          <span className="inline-flex items-center gap-1">
                            {g.channels.includes('whatsapp') && <span title="Verificado en WhatsApp">✅</span>}
                            {g.phone}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {propLabel}
                      </td>
                      <td className="px-3 py-2.5 text-center" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.reservations.length || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {fmtDate(lastStay?.checkOut)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 capitalize text-xs" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.channels.join(', ') || '—'}
                      </td>
                      <td className={`px-3 py-2.5 ${happinessColor(happiness)}`} onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {happiness !== undefined ? `${happiness}/5` : '—'}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={g.id + '-detail'} className="bg-slate-50">
                        <td colSpan={9} className="px-6 py-4">
                          {/* === ALL guest info === */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                            {g.email && (
                              <div><b className="text-slate-500">Email:</b><br />{g.email}</div>
                            )}
                            {g.phone && (
                              <div><b className="text-slate-500">Teléfono:</b><br />{g.phone}</div>
                            )}
                            {g.country && (
                              <div><b className="text-slate-500">País:</b><br />{g.country}</div>
                            )}
                            <div>
                              <b className="text-slate-500">Idioma:</b><br />
                              {LANGUAGE_FLAGS[g.language as keyof typeof LANGUAGE_FLAGS]} {g.language}
                            </div>
                            {g.firstBookedAt && (
                              <div><b className="text-slate-500">Primera reserva:</b><br />{fmtDate(g.firstBookedAt)}</div>
                            )}
                            <div>
                              <b className="text-slate-500">Canales:</b><br />
                              <span className="capitalize">{g.channels.join(', ')}</span>
                            </div>
                          </div>

                          {/* AI Summary */}
                          {g.summary ? (
                            <div className="bg-white rounded-lg p-3 mb-4 text-sm border border-indigo-100">
                              <div className="flex items-center gap-2 mb-1">
                                <b>🧠 Resumen IA</b>
                                <span className={happinessColor(g.summary.happinessScore)}>
                                  Felicidad: {g.summary.happinessScore}/5
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({g.summary.sentiment}) · {fmtDate(g.summary.generatedAt)}
                                </span>
                              </div>
                              <p className="text-slate-600">{g.summary.summary}</p>
                              {g.summary.keyMoments?.length > 0 && (
                                <ul className="mt-2 text-xs text-slate-500 list-disc list-inside">
                                  {g.summary.keyMoments.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                              )}
                              {g.summary.recommendedOffer && (
                                <div className="mt-2 text-xs text-indigo-600">
                                  <b>Oferta recomendada:</b> {g.summary.recommendedOffer}
                                </div>
                              )}
                            </div>
                          ) : g.reviewContent ? (
                            <div className="bg-white rounded-lg p-3 mb-4 text-sm">
                              <b>Reseña ({g.reviewScore}/5):</b>
                              <p className="text-slate-600 mt-1">{g.reviewContent}</p>
                            </div>
                          ) : null}

                          {/* Reservations — ALL */}
                          {g.reservations.length > 0 && (
                            <div className="mb-4">
                              <b className="text-xs text-slate-500">Estadías ({g.reservations.length})</b>
                              <div className="space-y-1 mt-1">
                                {g.reservations.map(r => (
                                  <div key={r.code} className="text-xs flex flex-wrap gap-x-3 gap-y-1 bg-white rounded px-2 py-1">
                                    <span className="font-mono text-slate-400">{r.code}</span>
                                    <span className="font-medium">{r.property}</span>
                                    <span className="text-slate-500">{fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}</span>
                                    <span className="text-slate-400">{r.guests} pers.</span>
                                    <span className="text-slate-400 capitalize">{r.channel}</span>
                                    {r.totalRate && <span className="text-slate-400">{r.currency} {r.totalRate}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Messages — ALL, no truncation */}
                          {g.messages.length > 0 && (
                            <div>
                              <b className="text-xs text-slate-500">
                                Mensajes ({g.messages.length})
                              </b>
                              <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                                {g.messages.map((m, i) => (
                                  <div key={i} className="text-xs flex gap-2 bg-white rounded px-2 py-1">
                                    <span className={`font-mono w-14 shrink-0 ${m.direction === 'inbound' ? 'text-blue-500' : 'text-slate-400'}`}>
                                      {m.direction === 'inbound' ? '← huésped' : '→ host'}
                                    </span>
                                    <span className="text-slate-500 w-28 shrink-0">{fmtDateTime(m.timestamp)}</span>
                                    <span className="text-slate-400 w-16 shrink-0 capitalize">{m.source}</span>
                                    <span className="text-slate-700 flex-1 whitespace-pre-wrap break-words">{m.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* If no data at all */}
                          {g.reservations.length === 0 && g.messages.length === 0 && !g.reviewContent && !g.summary && (
                            <p className="text-xs text-slate-400 italic">Sin datos adicionales para este huésped.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl text-sm z-50 flex items-center gap-3">
          <span className="font-medium">{selected.size} sel.</span>
          {selectedWithPhone.length !== selected.size && (
            <span className="text-amber-400 text-xs">
              ({selectedWithPhone.length} c/tel)
            </span>
          )}
          <button
            onClick={() => { setShowOutreach(true); setOutreachStep('compose'); }}
            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            ✏️ Componer
          </button>
          <button
            onClick={() => { setShowOutreach(true); setOutreachStep('compose'); }}
            disabled={selectedWithPhone.length === 0}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            👁️ Vista previa
          </button>
          <button
            onClick={() => { setShowOutreach(true); setOutreachStep('compose'); }}
            disabled={selectedWithPhone.length === 0}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            📤 Enviar
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-slate-400 hover:text-white px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Outreach composer modal — 3-step wizard */}
      {showOutreach && selected.size > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !sendingOutreach && (() => { setShowOutreach(false); setOutreachStep('compose'); })()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              {/* Header with step indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">📱 Outreach WhatsApp</h2>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={outreachStep === 'compose' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} style={{ borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                    <span className="text-slate-300">—</span>
                    <span className={outreachStep === 'preview' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} style={{ borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                    <span className="text-slate-300">—</span>
                    <span className={outreachStep === 'sending' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} style={{ borderRadius: '50%', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {outreachStep === 'compose' ? 'Componer' : outreachStep === 'preview' ? 'Vista previa' : 'Enviando'}
                  </span>
                </div>
                <button
                  onClick={() => { setShowOutreach(false); setOutreachStep('compose'); }}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                  disabled={sendingOutreach}
                >
                  ✕
                </button>
              </div>

              {/* === STEP 1: COMPOSE === */}
              {outreachStep === 'compose' && (
                <>
                  {/* Quick templates */}
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 font-medium">Plantillas:</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(TEMPLATES).map(([key, t]) => (
                        <button
                          key={key}
                          onClick={() => setMessageTemplate(t.template)}
                          className="border rounded-lg px-2 py-1 text-xs hover:bg-emerald-50 hover:border-emerald-300"
                          title={t.description}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message editor */}
                  <div className="mb-2">
                    <label className="text-xs text-slate-500 font-medium">Mensaje:</label>
                    <textarea
                      ref={textareaRef}
                      value={messageTemplate}
                      onChange={e => setMessageTemplate(e.target.value)}
                      rows={5}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                      placeholder="Escribí el mensaje o usá una plantilla..."
                    />
                  </div>

                  {/* Placeholder chips */}
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 font-medium">Insertar dato del huésped:</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {PLACEHOLDERS.map(p => (
                        <button
                          key={p.key}
                          onClick={() => insertPlaceholder(p.key)}
                          className="bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded px-2 py-0.5 text-xs font-mono"
                          title={p.description}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {`{Hola|Hey}`} = variación aleatoria al enviar · tocá un chip para insertarlo donde está el cursor
                    </p>
                  </div>

                  {/* Random variation checkbox */}
                  <div className="mb-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={useSpintax}
                        onChange={e => setUseSpintax(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>🎲 Variación aleatoria ({`{Hola|Hey}`} → elige uno al azar por huésped)</span>
                    </label>
                  </div>

                  {/* Inline preview */}
                  {messageTemplate.trim() && selectedWithPhone.length > 0 && (
                    <div className="mb-3">
                      <label className="text-xs text-slate-500 font-medium">Vista previa rápida:</label>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-1 text-sm">
                        <div className="text-xs text-slate-400 mb-1">
                          Para: {selectedWithPhone[0]?.name} ({selectedWithPhone[0]?.phone ?? 'sin teléfono'})
                        </div>
                        <div className="whitespace-pre-wrap">{quickPreview()}</div>
                      </div>
                    </div>
                  )}

                  {/* Recipients summary */}
                  <div className="mb-4 text-sm bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Destinatarios con teléfono:</span>
                      <span className="font-medium">{selectedWithPhone.length}</span>
                    </div>
                    {selectedWithPhone.length > 8 && (
                      <div className="text-xs text-amber-600 mt-1">
                        ⚠️ Máximo 8 por envío. Seleccioná menos o enviá en lotes.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setShowOutreach(false); setOutreachStep('compose'); }}
                      className="border rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={fetchPreview}
                      disabled={!messageTemplate.trim() || selectedWithPhone.length === 0 || selectedWithPhone.length > 8}
                      className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
                    >
                      Ver vista previa →
                    </button>
                  </div>
                </>
              )}

              {/* === STEP 2: PREVIEW === */}
              {outreachStep === 'preview' && (
                <>
                  <p className="text-sm text-slate-500 mb-3">
                    Revisá cómo queda cada mensaje antes de enviar. Si usaste variación aleatoria,
                    cada huésped verá una versión distinta.
                  </p>

                  <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                    {previewData.map((p, i) => (
                      <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
                        <div className="text-xs text-slate-400 mb-1 flex justify-between">
                          <span><b>{p.name}</b> · {p.phone ?? 'sin teléfono'}</span>
                        </div>
                        <div className="whitespace-pre-wrap text-slate-700">{p.rendered}</div>
                      </div>
                    ))}
                  </div>

                  {/* Safety notice */}
                  <div className="mb-4 text-xs text-slate-400 bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <b>⚠️ Antes de enviar:</b> Cada mensaje sale con 15-45s de delay.
                    Se respeta horario de descanso (22:00-08:00).
                    Solo enviar a huéspedes que te conocen.
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-between">
                    <button
                      onClick={() => setOutreachStep('compose')}
                      disabled={sendingOutreach}
                      className="border rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
                    >
                      ← Editar
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowOutreach(false); setOutreachStep('compose'); }}
                        disabled={sendingOutreach}
                        className="border rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={sendOutreach}
                        disabled={sendingOutreach}
                        className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
                      >
                        ✓ Confirmar y enviar a {selectedWithPhone.length}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* === STEP 3: SENDING === */}
              {outreachStep === 'sending' && (
                <div className="py-8 text-center">
                  <div className="text-4xl mb-4">📤</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {sendingOutreach ? 'Enviando...' : '¡Listo!'}
                  </h3>
                  {sendProgress && (
                    <div className="text-sm text-slate-500 mb-4">
                      {sendProgress.done} / {sendProgress.total} enviados
                    </div>
                  )}
                  {sendingOutreach && (
                    <p className="text-xs text-slate-400">
                      Cada mensaje tiene 15-45s de delay. No cierres esta ventana.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Sortable column header ──────────────────────────────────────────────────

function SortHeader({
  label,
  field,
  sortField,
  sortDir,
  onClick,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onClick: (field: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <th
      className={`text-left px-3 py-2 font-medium cursor-pointer select-none ${active ? 'text-slate-900' : ''}`}
      onClick={() => onClick(field)}
    >
      {label} {active && (sortDir === 'asc' ? '↑' : '↓')}
    </th>
  );
}
