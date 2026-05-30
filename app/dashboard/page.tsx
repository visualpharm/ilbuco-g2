'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  summary: {
    total: number;
    auto_responded: number;
    escalated: number;
    errors: number;
    auto_rate: number;
  };
  response_time: {
    avg_ms: number;
    median_ms: number;
    avg_seconds: number;
  };
  escalation_reasons: Record<string, number>;
  by_channel: Record<string, number>;
  by_property: Record<string, number>;
  daily_volume: Record<string, { auto: number; escalated: number }>;
  recent: Array<{
    timestamp: string;
    guest: string;
    property: string;
    channel: string;
    message: string;
    response: string;
    confidence: string;
    escalation_reason?: string;
    response_time_ms: number;
    sent: boolean;
  }>;
  message?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/autoresponder-dashboard?key=${encodeURIComponent(key)}`);
      if (res.status === 401) {
        setError('Invalid key');
        setData(null);
      } else {
        const json = await res.json();
        setData(json);
        setError(null);
      }
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Il Buco Autoresponder Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Guest message automation metrics</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="password"
          placeholder="Dashboard key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchData()}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, flex: 1 }}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data?.message && <p style={{ color: '#666' }}>{data.message}</p>}

      {data?.summary && data.summary.total > 0 && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <Card label="Total Messages" value={data.summary.total} />
            <Card label="Auto-Responded" value={data.summary.auto_responded} color="#22c55e" />
            <Card label="Escalated" value={data.summary.escalated} color="#f59e0b" />
            <Card label="Auto Rate" value={`${data.summary.auto_rate}%`} color="#3b82f6" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <Card label="Avg Response" value={`${data.response_time.avg_seconds}s`} />
            <Card label="Median Response" value={`${Math.round(data.response_time.median_ms / 1000)}s`} />
            <Card label="Errors" value={data.summary.errors} color={data.summary.errors > 0 ? '#ef4444' : '#22c55e'} />
          </div>

          {/* Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Section title="By Channel">
              {Object.entries(data.by_channel).map(([ch, count]) => (
                <div key={ch} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{ch}</span><span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </Section>
            <Section title="By Property">
              {Object.entries(data.by_property).map(([prop, count]) => (
                <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{prop}</span><span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </Section>
            <Section title="Escalation Reasons">
              {Object.entries(data.escalation_reasons).map(([reason, count]) => (
                <div key={reason} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span>{reason.slice(0, 40)}</span><span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
              {Object.keys(data.escalation_reasons).length === 0 && <span style={{ color: '#999' }}>None yet</span>}
            </Section>
          </div>

          {/* Recent Conversations */}
          <Section title="Recent Conversations">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Time</th>
                  <th style={{ padding: '8px 4px' }}>Guest</th>
                  <th style={{ padding: '8px 4px' }}>Message</th>
                  <th style={{ padding: '8px 4px' }}>Response</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                  <th style={{ padding: '8px 4px' }}>Speed</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '6px 4px', whiteSpace: 'nowrap' }}>
                      {r.timestamp ? new Date(r.timestamp).toLocaleDateString('es-AR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td style={{ padding: '6px 4px' }}>{r.guest?.split(' ')[0] || '-'}</td>
                    <td style={{ padding: '6px 4px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.message}</td>
                    <td style={{ padding: '6px 4px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.response}</td>
                    <td style={{ padding: '6px 4px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: r.confidence === 'auto' ? '#dcfce7' : '#fef3c7',
                        color: r.confidence === 'auto' ? '#166534' : '#92400e',
                      }}>
                        {r.sent ? 'AUTO' : r.confidence === 'escalate' ? 'ESCALATED' : 'SKIPPED'}
                      </span>
                    </td>
                    <td style={{ padding: '6px 4px', whiteSpace: 'nowrap' }}>
                      {r.response_time_ms ? `${(r.response_time_ms / 1000).toFixed(1)}s` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </>
      )}
    </div>
  );
}

function Card({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || '#333' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#666' }}>{title}</h3>
      {children}
    </div>
  );
}
