'use client';

/**
 * Il Buco CRM panel — guest history table with sort, search, filter,
 * and multi-select (with shift-click range).
 *
 * Shown as a tab inside /nimda. Data comes from /api/nimda/crm/guests.
 * "Sync Guests" button triggers /api/nimda/crm/sync.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGE_FLAGS } from '@/lib/crm-store';

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

type SortField = 'name' | 'language' | 'country' | 'stays' | 'lastStay' | 'happiness' | 'channel';
type SortDir = 'asc' | 'desc';

function fmtDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

function happinessColor(score?: number): string {
  if (score === undefined) return 'text-slate-300';
  if (score >= 8) return 'text-emerald-600 font-bold';
  if (score >= 6) return 'text-amber-600 font-medium';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600 font-bold';
}

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

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const lastCheckedRef = useRef<string | null>(null);

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
      flash('Failed to load guests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function syncGuests() {
    setSyncing(true);
    flash('Syncing from Hostex + WhatsApp... (this takes 30-60s)');
    try {
      const res = await fetch('/api/nimda/crm/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success || data.totalGuests !== undefined) {
        flash(`✓ Synced: ${data.totalGuests} guests, ${data.reservations} reservations, ${data.conversations} conversations, ${data.reviews} reviews`);
        await load();
      } else {
        flash(`Sync error: ${data.error || 'unknown'}`);
      }
    } catch (err) {
      flash('Sync failed');
    } finally {
      setSyncing(false);
    }
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

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'language': cmp = a.language.localeCompare(b.language); break;
        case 'country': cmp = (a.country ?? 'zz').localeCompare(b.country ?? 'zz'); break;
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
  }, [guests, search, filterChannel, filterLanguage, sortField, sortDir]);

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
      // Range select from lastChecked to this row
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
    return <div className="flex items-center justify-center py-20 text-slate-400">Loading CRM...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-3 flex flex-wrap gap-3 items-center text-sm">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, phone..."
          className="border rounded-lg px-3 py-1.5 flex-1 min-w-[12rem]"
        />
        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">All channels</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)}
          className="border rounded-lg px-2 py-1.5">
          <option value="all">All languages</option>
          {languages.map(l => <option key={l} value={l}>{LANGUAGE_FLAGS[l as keyof typeof LANGUAGE_FLAGS] || '🌐'} {l}</option>)}
        </select>
        <span className="text-slate-400">
          {filtered.length} / {guests.length} guests
        </span>
        <button
          onClick={syncGuests}
          disabled={syncing}
          className="ml-auto bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
        >
          {syncing ? 'Syncing...' : '↻ Sync Guests'}
        </button>
      </div>

      {lastSyncAt && (
        <div className="text-xs text-slate-400 px-1">
          Last sync: {fmtDate(lastSyncAt)}
        </div>
      )}

      {/* Guest table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-slate-400 mb-2">
            {guests.length === 0
              ? 'No guests yet. Click "Sync Guests" to pull from Hostex.'
              : 'No guests match your filters.'}
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
                <SortHeader label="Name" field="name" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Lang" field="language" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Country" field="country" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Stays" field="stays" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Last stay" field="lastStay" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Channel" field="channel" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
                <SortHeader label="Happiness" field="happiness" sortField={sortField} sortDir={sortDir} onClick={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const isExpanded = expanded === g.id;
                const isSelected = selected.has(g.id);
                const happiness = g.summary?.happinessScore ?? g.reviewScore;
                const lastStay = g.reservations[g.reservations.length - 1];
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
                      <td className="px-3 py-2.5 text-slate-500" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.country || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.reservations.length || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {fmtDate(lastStay?.checkOut)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 capitalize" onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {g.channels.join(', ') || '—'}
                      </td>
                      <td className={`px-3 py-2.5 ${happinessColor(happiness)}`} onClick={() => setExpanded(isExpanded ? null : g.id)}>
                        {happiness !== undefined ? `${happiness}/10` : '—'}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={g.id + '-detail'} className="bg-slate-50">
                        <td colSpan={8} className="px-6 py-4">
                          {/* Guest details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                            {g.email && <div><b className="text-slate-500">Email:</b> {g.email}</div>}
                            {g.phone && <div><b className="text-slate-500">Phone:</b> {g.phone}</div>}
                            {g.country && <div><b className="text-slate-500">Country:</b> {g.country}</div>}
                            <div><b className="text-slate-500">Language:</b> {LANGUAGE_FLAGS[g.language as keyof typeof LANGUAGE_FLAGS]} {g.language}</div>
                          </div>

                          {/* AI Summary */}
                          {g.summary ? (
                            <div className="bg-white rounded-lg p-3 mb-4 text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <b>AI Summary</b>
                                <span className={happinessColor(g.summary.happinessScore)}>
                                  {g.summary.happinessScore}/10
                                </span>
                                <span className="text-xs text-slate-400">
                                  {g.summary.sentiment} · {fmtDate(g.summary.generatedAt)}
                                </span>
                              </div>
                              <p className="text-slate-600">{g.summary.summary}</p>
                              {g.summary.keyMoments?.length > 0 && (
                                <ul className="mt-2 text-xs text-slate-500 list-disc list-inside">
                                  {g.summary.keyMoments.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                              )}
                            </div>
                          ) : g.reviewContent ? (
                            <div className="bg-white rounded-lg p-3 mb-4 text-sm">
                              <b>Review ({g.reviewScore}/10):</b>
                              <p className="text-slate-600 mt-1">{g.reviewContent}</p>
                            </div>
                          ) : null}

                          {/* Reservations */}
                          {g.reservations.length > 0 && (
                            <div className="mb-4">
                              <b className="text-xs text-slate-500">Stays ({g.reservations.length})</b>
                              <div className="space-y-1 mt-1">
                                {g.reservations.map(r => (
                                  <div key={r.code} className="text-xs flex gap-3">
                                    <span className="font-mono text-slate-400">{r.code}</span>
                                    <span>{r.property}</span>
                                    <span className="text-slate-500">{fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}</span>
                                    <span className="text-slate-400">{r.guests} guests</span>
                                    {r.totalRate && <span className="text-slate-400">{r.currency} {r.totalRate}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Messages preview (last 5) */}
                          {g.messages.length > 0 && (
                            <div>
                              <b className="text-xs text-slate-500">
                                Messages ({g.messages.length}) — last 5:
                              </b>
                              <div className="space-y-1 mt-1 max-h-40 overflow-y-auto">
                                {g.messages.slice(-5).map((m, i) => (
                                  <div key={i} className="text-xs flex gap-2">
                                    <span className={`font-mono w-14 ${m.direction === 'inbound' ? 'text-blue-500' : 'text-slate-400'}`}>
                                      {m.direction === 'inbound' ? '← guest' : '→ host'}
                                    </span>
                                    <span className="text-slate-500 w-16">{fmtDate(m.timestamp)}</span>
                                    <span className="text-slate-600 flex-1 truncate">{m.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl text-sm z-50 flex items-center gap-4">
          <span>{selected.size} selected</span>
          <button
            onClick={() => setSelected(new Set())}
            className="text-slate-400 hover:text-white"
          >
            Clear
          </button>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 text-xs">Mass messaging coming in Phase 3</span>
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
