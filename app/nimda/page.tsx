'use client';

/**
 * /nimda — Il Buco admin panel (admin spelled backwards).
 *
 * Two tabs:
 *   - PINs: lock PIN management (guest PINs, manual PINs, backup pool)
 *   - CRM: guest history, AI summaries, mass messaging
 *
 * Ivan and Andrés log in with their shared passwords.
 */

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';

// CRM panel is loaded dynamically (client-only, keeps initial bundle small)
const CrmPanel = dynamic(() => import('./crm-panel'), { ssr: false });

interface ChannelStatus {
  channel: 'whatsapp' | 'email' | 'hostex';
  sent: boolean;
  sentAt?: string;
  error?: string;
}

interface Guest {
  reservationCode: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyName: string;
  channel: string;
  checkIn: string;
  checkOut: string;
  pin: number | null;
  lockStatus: 'synced' | 'retrying' | 'failed' | 'revoked' | 'backup';
  lockUserId?: string;
  backupPinIndex?: number;
  channels: ChannelStatus[];
  retryAttempts: number;
  createdAt: string;
  updatedAt: string;
  isManual?: boolean;
  isPermanent?: boolean;
}

interface PoolStats {
  total: number;
  inUse: number;
  available: number;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  synced: { label: '🟢 Sincronizado', color: 'text-emerald-600 bg-emerald-50' },
  retrying: { label: '🟡 Reintentando', color: 'text-amber-600 bg-amber-50' },
  failed: { label: '🔴 Falló', color: 'text-red-600 bg-red-50' },
  backup: { label: '🟠 PIN backup', color: 'text-orange-600 bg-orange-50' },
  revoked: { label: '⚫ Revocado', color: 'text-slate-500 bg-slate-100' },
};

function fmtDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function fmtChannel(ch: ChannelStatus): string {
  const icon = ch.channel === 'whatsapp' ? '📱' : ch.channel === 'email' ? '✉️' : '💬';
  const status = ch.sent ? '✓' : '✗';
  return `${icon}${status}`;
}

export default function NimdaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Cargando…</div>}>
      <NimdaPanel />
    </Suspense>
  );
}

function NimdaPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [manualPins, setManualPins] = useState<Guest[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [contactCount, setContactCount] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [busy, setBusy] = useState('');
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', pin: '', permanent: true, checkIn: '', checkOut: '' });

  // Tab state persisted in URL (?tab=crm) so refresh stays on the same view
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pins' | 'crm'>(
    searchParams.get('tab') === 'crm' ? 'crm' : 'pins'
  );

  function switchTab(tab: 'pins' | 'crm') {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'crm') params.set('tab', 'crm');
    else params.delete('tab');
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  }

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 5000); };

  const load = useCallback(async () => {
    const res = await fetch('/api/nimda/guests');
    if (res.status === 401) { setAuthed(false); return; }
    const data = await res.json();
    setGuests(data.guests ?? []);
    setManualPins(data.manualPins ?? []);
    setPoolStats(data.poolStats ?? null);
    setContactCount(data.contactCount ?? 0);
    setAuthed(true);
  }, []);

  useEffect(() => { load().catch(() => setAuthed(false)); }, [load]);

  async function login() {
    setLoginError('');
    const res = await fetch('/api/nimda/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setLoginError('Contraseña incorrecta'); return; }
    await load();
  }

  async function createPin() {
    setBusy('create');
    try {
      const pinNum = Number(createForm.pin);
      if (!createForm.name || !Number.isFinite(pinNum) || pinNum < 1000) {
        flash('Name and 4-8 digit PIN required');
        return;
      }
      const res = await fetch('/api/nimda/create-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name,
          pin: pinNum,
          permanent: createForm.permanent,
          checkIn: createForm.permanent ? undefined : createForm.checkIn,
          checkOut: createForm.permanent ? undefined : createForm.checkOut,
        }),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error || data.details}`); return; }
      flash(`✓ PIN ${createForm.pin} created for ${createForm.name}`);
      setCreateForm({ name: '', pin: '', permanent: true, checkIn: '', checkOut: '' });
      setShowCreate(false);
      await load();
    } finally { setBusy(''); }
  }

  async function deletePinEntry(code: string, name: string) {
    if (!confirm(`Delete PIN for ${name}? This removes it from the lock.`)) return;
    setBusy(`del-${code}`);
    try {
      const res = await fetch(`/api/nimda/guests/${encodeURIComponent(code)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error || data.details}`); return; }
      flash(`✓ Deleted PIN for ${name}`);
      await load();
    } finally { setBusy(''); }
  }

  async function rollPins() {
    const includeManual = confirm('Roll ALL active reservation PINs? This generates new codes for every guest currently synced to the lock.') ?
      confirm('Also roll manual/permanent PINs?') : false;
    if (includeManual === null) return;
    setBusy('roll');
    try {
      const res = await fetch('/api/nimda/roll-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ includeManual }),
      });
      const data = await res.json();
      if (!res.ok) { flash(`Error: ${data.error || data.details}`); return; }
      flash(`✓ ${data.details}`);
      await load();
    } finally { setBusy(''); }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando…</div>
    );
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  if (authed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-1">Nimda — Il Buco</h1>
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

  // ── Filters ─────────────────────────────────────────────────────────────────
  const properties = [...new Set(guests.map(g => g.propertyName))];
  const filtered = guests.filter(g => {
    if (filterStatus !== 'all' && g.lockStatus !== filterStatus) return false;
    if (filterProperty !== 'all' && g.propertyName !== filterProperty) return false;
    return true;
  });

  const activeGuests = guests.filter(g => g.lockStatus !== 'revoked').length;
  const syncedCount = guests.filter(g => g.lockStatus === 'synced').length;
  const retryingCount = guests.filter(g => g.lockStatus === 'retrying').length;
  const failedCount = guests.filter(g => g.lockStatus === 'failed').length;

  // ── Main panel ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex flex-wrap items-center gap-3">
        <h1 className="font-semibold text-lg">Nimda — Il Buco</h1>
        {/* Tab switcher */}
        <div className="flex gap-1">
          <button
            onClick={() => switchTab('pins')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'pins' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            🔑 PINs
          </button>
          <button
            onClick={() => switchTab('crm')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'crm' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            📋 CRM
          </button>
        </div>
        {activeTab === 'pins' && (
          <div className="ml-auto flex gap-3 items-center">
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-600">{syncedCount} sync</span>
              <span className="text-amber-600">{retryingCount} reint.</span>
              <span className="text-red-600">{failedCount} falló</span>
              {poolStats && (
                <span className="text-slate-500">Pool: {poolStats.available}/{poolStats.total}</span>
              )}
              <span className="text-slate-400">{contactCount} contactos</span>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              + Nuevo PIN
            </button>
            <button
              onClick={rollPins}
              disabled={busy === 'roll'}
              className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
            >
              🔄 Rotar todos
            </button>
          </div>
        )}
      </header>

      {/* CRM tab */}
      {activeTab === 'crm' && (
        <main className="max-w-6xl mx-auto p-4">
          <CrmPanel />
        </main>
      )}

      {/* PINs tab */}
      {activeTab === 'pins' && (
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-3 flex flex-wrap gap-3 items-center text-sm">
          <span className="text-slate-500">Filtrar:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border rounded-lg px-2 py-1.5"
          >
            <option value="all">Todos los estados</option>
            <option value="synced">🟢 Sincronizado</option>
            <option value="retrying">🟡 Reintentando</option>
            <option value="failed">🔴 Falló</option>
            <option value="backup">🟠 Backup</option>
            <option value="revoked">⚫ Revocado</option>
          </select>
          <select
            value={filterProperty}
            onChange={e => setFilterProperty(e.target.value)}
            className="border rounded-lg px-2 py-1.5"
          >
            <option value="all">Todas las suites</option>
            {properties.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <span className="ml-auto text-slate-400">
            {filtered.length} / {guests.length} reservas · {activeGuests} activas
          </span>
        </div>

        {/* Guest table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-400">
            No hay reservas que mostrar.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Huésped</th>
                  <th className="text-left px-3 py-2 font-medium">Suite</th>
                  <th className="text-left px-3 py-2 font-medium">Check-in</th>
                  <th className="text-left px-3 py-2 font-medium">Check-out</th>
                  <th className="text-left px-3 py-2 font-medium">PIN</th>
                  <th className="text-left px-3 py-2 font-medium">Estado</th>
                  <th className="text-left px-3 py-2 font-medium">Enviado</th>
                  <th className="text-left px-3 py-2 font-medium">Origen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => {
                  const meta = STATUS_META[g.lockStatus] || STATUS_META.failed;
                  const isExpanded = expanded === g.reservationCode;
                  return (
                    <>
                      <tr
                        key={g.reservationCode}
                        className="border-t hover:bg-slate-50 cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : g.reservationCode)}
                      >
                        <td className="px-3 py-2.5 font-medium">{g.guestName}</td>
                        <td className="px-3 py-2.5 text-slate-600">{g.propertyName}</td>
                        <td className="px-3 py-2.5">{fmtDate(g.checkIn)}</td>
                        <td className="px-3 py-2.5">{fmtDate(g.checkOut)}</td>
                        <td className="px-3 py-2.5 font-mono font-bold tracking-wider">
                          {g.pin ?? '—'}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                            {meta.label}
                            {g.lockStatus === 'retrying' && g.retryAttempts > 0 && ` (${g.retryAttempts})`}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {g.channels.length > 0
                            ? g.channels.map(fmtChannel).join(' ')
                            : '—'}
                        </td>
                        <td className="px-3 py-2.5 text-slate-400 capitalize">{g.channel}</td>
                      </tr>
                      {isExpanded && (
                        <tr key={g.reservationCode + '-detail'} className="bg-slate-50">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <b className="text-slate-500">Reserva:</b>{' '}
                                <code className="bg-white px-1 rounded">{g.reservationCode}</code>
                              </div>
                              {g.lockUserId && (
                                <div>
                                  <b className="text-slate-500">ID cerradura:</b>{' '}
                                  <code className="bg-white px-1 rounded">{g.lockUserId}</code>
                                </div>
                              )}
                              {g.guestEmail && (
                                <div>
                                  <b className="text-slate-500">Email:</b> {g.guestEmail}
                                </div>
                              )}
                              {g.guestPhone && (
                                <div>
                                  <b className="text-slate-500">Teléfono:</b> {g.guestPhone}
                                </div>
                              )}
                              {g.backupPinIndex !== undefined && (
                                <div>
                                  <b className="text-slate-500">Índice backup:</b> {g.backupPinIndex}
                                </div>
                              )}
                              <div>
                                <b className="text-slate-500">Creado:</b> {fmtDate(g.createdAt)}
                              </div>
                              <div>
                                <b className="text-slate-500">Actualizado:</b> {fmtDate(g.updatedAt)}
                              </div>
                            </div>
                            {g.channels.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <b className="text-xs text-slate-500">Detalles de envío:</b>
                                {g.channels.map((ch, i) => (
                                  <div key={i} className="text-xs text-slate-600 flex gap-2">
                                    <span className="font-mono w-20">{ch.channel}</span>
                                    <span className={ch.sent ? 'text-emerald-600' : 'text-red-500'}>
                                      {ch.sent ? '✓ enviado' : `✗ ${ch.error || 'no enviado'}`}
                                    </span>
                                    {ch.sentAt && (
                                      <span className="text-slate-400">{fmtDate(ch.sentAt)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => deletePinEntry(g.reservationCode, g.guestName)}
                                disabled={busy === `del-${g.reservationCode}`}
                                className="text-red-500 text-xs border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-40"
                              >
                                {busy === `del-${g.reservationCode}` ? 'Eliminando…' : 'Eliminar PIN'}
                              </button>
                            </div>
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

        {/* Create PIN form */}
        {showCreate && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Crear PIN manual</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-400">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="text-slate-500 text-xs">Nombre / Etiqueta</label>
                <input
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Cleaner, Ivan, Friend"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs">PIN (4-8 dígitos)</label>
                <input
                  value={createForm.pin}
                  onChange={e => setCreateForm({ ...createForm, pin: e.target.value.replace(/[^\d]/g, '') })}
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="e.g. 123456"
                  className="w-full border rounded-lg px-3 py-2 mt-1 font-mono"
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createForm.permanent}
                    onChange={e => setCreateForm({ ...createForm, permanent: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Tiempo ilimitado
                </label>
              </div>
              {!createForm.permanent && (
                <>
                  <div>
                    <label className="text-slate-500 text-xs">Válido desde</label>
                    <input
                      type="date"
                      value={createForm.checkIn}
                      onChange={e => setCreateForm({ ...createForm, checkIn: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs">Válido hasta</label>
                    <input
                      type="date"
                      value={createForm.checkOut}
                      onChange={e => setCreateForm({ ...createForm, checkOut: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={createPin}
                disabled={busy === 'create' || !createForm.name || !createForm.pin}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
              >
                {busy === 'create' ? 'Creando…' : 'Crear PIN'}
              </button>
            </div>
          </div>
        )}

        {/* Manual PINs (non-reservation) */}
        {manualPins.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-medium">PINs manuales ({manualPins.length})</h2>
              <p className="text-xs text-slate-400">PINs creados directamente — sin reserva asociada</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Nombre</th>
                  <th className="text-left px-3 py-2 font-medium">PIN</th>
                  <th className="text-left px-3 py-2 font-medium">Tipo</th>
                  <th className="text-left px-3 py-2 font-medium">Estado</th>
                  <th className="text-left px-3 py-2 font-medium">Creado</th>
                  <th className="text-left px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {manualPins.map(g => {
                  const meta = STATUS_META[g.lockStatus] || STATUS_META.failed;
                  return (
                    <tr key={g.reservationCode} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium">{g.guestName}</td>
                      <td className="px-3 py-2.5 font-mono font-bold tracking-wider">{g.pin ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {g.isPermanent ? '♾️ Permanente' : fmtDate(g.checkIn) + ' → ' + fmtDate(g.checkOut)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400">{fmtDate(g.createdAt)}</td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => deletePinEntry(g.reservationCode, g.guestName)}
                          disabled={busy === `del-${g.reservationCode}`}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Backup PIN pool status */}
        {poolStats && poolStats.total > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-medium mb-2">Pool de PINs backup</h2>
            <div className="flex gap-6 text-sm text-slate-600">
              <span>Disponibles: <b className={poolStats.available > 0 ? 'text-emerald-600' : 'text-red-600'}>{poolStats.available}</b></span>
              <span>En uso: <b>{poolStats.inUse}</b></span>
              <span>Total: <b>{poolStats.total}</b></span>
            </div>
          </div>
        )}
      </main>
      )} {/* end PINs tab */}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
