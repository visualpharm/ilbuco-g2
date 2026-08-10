/**
 * U-tec OpenAPI client — thin TypeScript client for Ultraloq smart locks.
 *
 * The U-tec API is NOT REST — it uses a single-command endpoint (POST /action)
 * where routing is via the JSON body (header.namespace + header.name + payload).
 *
 * Auth: OAuth2 authorization-code flow with refresh tokens.
 * Gotcha: the /token endpoint wraps fields under {data:{...}} rather than
 * top-level — we unwrap both shapes.
 *
 * Time-limited guest PINs: type:2 with a schedule quartet (daterange, weeks,
 * timerange, limit). U-tec rejects type:2 if any quartet field is omitted.
 *
 * The `add` command returns only a deferred ack — no user ID. To get the ID
 * of a created user, list users afterward and match by name (reservation code).
 *
 * Env:
 *   UTEC_CLIENT_ID     — OAuth client ID (from U-tec developer registration)
 *   UTEC_CLIENT_SECRET — OAuth client secret
 *   UTEC_REFRESH_TOKEN — long-lived refresh token (from initial OAuth flow)
 *
 * No npm library exists for U-tec. Patterns adapted from:
 *   DevonCash/corvmc-svelte/src/lib/server/lock/ultraloc-client.ts
 */

import { RetryableError } from './utec-retry';

// ─── Config ──────────────────────────────────────────────────────────────────

const OAUTH_BASE = 'https://oauth.u-tec.com';
const API_BASE = 'https://api.u-tec.com';

function getClientId(): string {
  const id = process.env.UTEC_CLIENT_ID;
  if (!id) throw new Error('UTEC_CLIENT_ID not configured');
  return id;
}

function getClientSecret(): string {
  const secret = process.env.UTEC_CLIENT_SECRET;
  if (!secret) throw new Error('UTEC_CLIENT_SECRET not configured');
  return secret;
}

function getRefreshToken(): string {
  const token = process.env.UTEC_REFRESH_TOKEN;
  if (!token) throw new Error('UTEC_REFRESH_TOKEN not configured');
  return token;
}

// ─── Token management ────────────────────────────────────────────────────────

interface TokenEnvelope {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

/** Cached access token with expiry. */
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * The U-tec /token endpoint wraps fields under {data:{...}} — non-standard.
 * This helper unwraps both the wrapped and top-level shapes.
 */
function unwrapTokenResponse(body: unknown): TokenEnvelope {
  const wrapped = body as { data?: TokenEnvelope; access_token?: string; expires_in?: number; refresh_token?: string };
  if (wrapped.data?.access_token) {
    return {
      access_token: wrapped.data.access_token,
      expires_in: wrapped.data.expires_in ?? 3600,
      refresh_token: wrapped.data.refresh_token ?? getRefreshToken(),
    };
  }
  if (wrapped.access_token) {
    return {
      access_token: wrapped.access_token,
      expires_in: wrapped.expires_in ?? 3600,
      refresh_token: wrapped.refresh_token ?? getRefreshToken(),
    };
  }
  throw new Error(`Unexpected token response shape: ${JSON.stringify(body).slice(0, 200)}`);
}

/**
 * Refresh the access token using the long-lived refresh token.
 * Sets the cache and returns the new access token.
 */
async function refreshAccessToken(): Promise<string> {
  const res = await fetch(
    `${OAUTH_BASE}/token?grant_type=refresh_token&client_id=${getClientId()}&client_secret=${getClientSecret()}&refresh_token=${getRefreshToken()}`,
    { method: 'GET' }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new RetryableError(`Token refresh failed: HTTP ${res.status}: ${body}`, 'AUTH_REFRESH');
  }
  const envelope = unwrapTokenResponse(await res.json());
  cachedToken = {
    token: envelope.access_token,
    expiresAt: Date.now() + (envelope.expires_in - 60) * 1000, // 60s safety margin
  };
  return envelope.access_token;
}

/**
 * Get a valid access token, refreshing if expired.
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  return refreshAccessToken();
}

// ─── Low-level API call ─────────────────────────────────────────────────────

interface ActionHeader {
  namespace: string;
  name: string;
  payloadVersion?: number;
  messageID?: string;
}

interface ActionRequest {
  header: ActionHeader;
  payload: Record<string, unknown>;
}

/**
 * Send a command to the U-tec API (single-endpoint POST /action pattern).
 */
async function sendAction(
  namespace: string,
  name: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const token = await getAccessToken();
  const body = {
    header: { namespace, name },
    payload,
  };

  const res = await fetch(`${API_BASE}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status >= 500 || res.status === 429) {
      throw new RetryableError(`U-tec HTTP ${res.status}: ${text}`, `HTTP_${res.status}`);
    }
    throw new Error(`U-tec HTTP ${res.status}: ${text}`);
  }

  const data = (await res.json()) as Record<string, unknown>;

  // Check for error in the payload
  const payloadData = data.payload as Record<string, unknown> | undefined;
  const error = payloadData?.error as { code?: string; message?: string } | undefined;
  if (error?.code) {
    if (error.code === 'DEVICE_OFFLINE' || error.code === 'DEVICE_BUSY') {
      throw new RetryableError(error.message || error.code, error.code);
    }
    throw new Error(`U-tec error: ${error.code}: ${error.message}`);
  }

  // Also check for per-device errors array
  const errors = payloadData?.errors as Array<{ code: string; message: string }> | undefined;
  if (errors?.length) {
    const err = errors[0];
    if (err.code === 'DEVICE_OFFLINE' || err.code === 'DEVICE_BUSY') {
      throw new RetryableError(err.message || err.code, err.code);
    }
    throw new Error(`U-tec error: ${err.code}: ${err.message}`);
  }

  return data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UtecDevice {
  id: string;
  name: string;
  type: string;
  serial?: string;
  online: boolean;
}

export interface UtecUser {
  id: string;
  name: string;
  type: number; // 0=Normal, 2=Temporary, 3=Admin
  status?: string;
  sync_status?: string;
  /** Only present on `get` (not `list`) */
  password?: number;
}

export interface TemporaryUserSchedule {
  /** [start, end] as "YYYY-MM-DD HH:mm" strings */
  daterange: [string, string];
  /** Days of week: 0=Sun ... 6=Sat. Use [0,1,2,3,4,5,6] for all days. */
  weeks: number[];
  /** ["HH:mm", "HH:mm"] daily active window. Use ["00:00","23:59"] for all day. */
  timerange: [string, string];
  /** Max opens. 0 = unlimited. */
  limit: number;
}

// ─── Device operations ───────────────────────────────────────────────────────

/**
 * List all devices/locks on the account.
 */
export async function listDevices(): Promise<UtecDevice[]> {
  const data = await sendAction('Uhome.Device', 'Discovery', {
    discoveryType: 'all',
  });
  const payload = data.payload as { devices?: unknown[] } | undefined;
  const devices = (payload?.devices ?? []) as unknown[];
  return devices.map((d) => {
    const dev = d as Record<string, unknown>;
    return {
      id: String(dev.id ?? ''),
      name: String(dev.name ?? 'Unknown'),
      type: String(dev.category ?? dev.type ?? ''),
      serial: dev.deviceInfo ? String((dev.deviceInfo as Record<string, unknown>).model ?? '') : undefined,
      online: true, // Discovery only returns registered devices; check getDeviceStatus for live status
    };
  });
}

/**
 * Query a device's current status (online/offline, lock state, battery).
 */
export async function getDeviceStatus(deviceId: string): Promise<{
  online: boolean;
  locked?: boolean;
  battery?: number;
}> {
  const data = await sendAction('Uhome.Device', 'Query', {
    devices: [{ id: deviceId, capability: 'st.healthCheck' }],
  });
  const payload = data.payload as { devices?: Array<{ states?: Array<{ capability: string; name: string; value: string | number }> }> };
  const states = payload?.devices?.[0]?.states ?? [];
  const getState = (cap: string, name: string) =>
    states.find(s => s.capability === cap && s.name === name)?.value;
  const status = String(getState('st.healthCheck', 'status') ?? 'Offline');
  const lockState = getState('st.lock', 'lockState');
  const battery = getState('st.batteryLevel', 'level');
  return {
    online: status === 'Online',
    locked: lockState ? String(lockState) === 'Locked' : undefined,
    battery: battery !== undefined ? Number(battery) : undefined,
  };
}

// ─── Lock user (PIN) management ──────────────────────────────────────────────

/**
 * Build the schedule quartet for a time-limited guest PIN.
 * U-tec rejects type:2 if any of these fields are missing.
 *
 * @param checkIn  ISO date string for check-in
 * @param checkOut ISO date string for check-out
 */
export function buildGuestSchedule(checkIn: string, checkOut: string): TemporaryUserSchedule {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  return {
    daterange: [fmt(checkIn), fmt(checkOut)],
    weeks: [0, 1, 2, 3, 4, 5, 6], // all days
    timerange: ['00:00', '23:59'], // all day
    limit: 0, // unlimited opens
  };
}

/**
 * List all PIN users on a lock.
 * Note: the list response does NOT include the password — use getUser() for that.
 * Returns empty array if the lock is offline (can't query users remotely).
 */
export async function listUsers(deviceId: string): Promise<UtecUser[]> {
  const data = await sendAction('Uhome.Device', 'Command', {
    devices: [{ id: deviceId, capability: 'st.lockUser', command: 'list' }],
  });
  const payload = data.payload as { devices?: Array<Record<string, unknown>> };
  const devEntry = payload?.devices?.[0];
  if (!devEntry) return []; // offline lock returns empty devices array
  const users = (devEntry.users ?? devEntry.lockUsers ?? []) as unknown[];
  return users.map((u) => {
    const usr = u as Record<string, unknown>;
    return {
      id: String(usr.id ?? usr.lockUserId ?? ''),
      name: String(usr.name ?? ''),
      type: Number(usr.type ?? 0),
      status: usr.status ? String(usr.status) : undefined,
      sync_status: usr.sync_status ? String(usr.sync_status) : undefined,
    };
  });
}

/**
 * Get a single PIN user (includes the password/PIN digit).
 */
export async function getUser(deviceId: string, userId: string): Promise<UtecUser> {
  const data = await sendAction('Uhome.Device', 'Command', {
    devices: [
      {
        id: deviceId,
        capability: 'st.lockUser',
        command: 'get',
        params: { id: userId },
      },
    ],
  });
  const usr = (data.payload?.devices?.[0] ?? data) as Record<string, unknown>;
  return {
    id: String(usr.id ?? userId),
    name: String(usr.name ?? ''),
    type: Number(usr.type ?? 0),
    password: usr.password ? Number(usr.password) : undefined,
    status: usr.status ? String(usr.status) : undefined,
    sync_status: usr.sync_status ? String(usr.sync_status) : undefined,
  };
}

/**
 * Add a temporary (time-limited) PIN user to the lock.
 *
 * WARNING: U-tec's `add` returns only a deferred ack — NO user ID.
 * After calling this, you must listUsers() and match by name to find the ID.
 * This module handles dedup; see utec-retry.ts for the retry queue.
 *
 * @param deviceId   Lock device ID
 * @param name       Guest identifier (we use the reservation code)
 * @param password   4-8 digit PIN
 * @param schedule   Time-limited schedule (daterange, weeks, timerange, limit)
 */
export async function addTemporaryUser(
  deviceId: string,
  name: string,
  password: number,
  schedule: TemporaryUserSchedule
): Promise<void> {
  await sendAction('Uhome.Device', 'Command', {
    devices: [
      {
        id: deviceId,
        capability: 'st.lockUser',
        command: 'add',
        params: {
          type: 2, // Temporary
          name,
          password,
          daterange: schedule.daterange,
          weeks: schedule.weeks,
          timerange: schedule.timerange,
          limit: schedule.limit,
        },
      },
    ],
  });
}

/**
 * Add a permanent (unlimited) PIN user to the lock. Used for manual PINs
 * created from the admin panel — no time limit, no schedule.
 *
 * WARNING: same as addTemporaryUser — no user ID returned.
 * Use confirmUserAdded() to poll for the ID.
 *
 * @param deviceId   Lock device ID
 * @param name       Label for this PIN (guest name, "cleaner", etc.)
 * @param password   4-8 digit PIN
 */
export async function addPermanentUser(
  deviceId: string,
  name: string,
  password: number
): Promise<void> {
  await sendAction('Uhome.Device', 'Command', {
    devices: [
      {
        id: deviceId,
        capability: 'st.lockUser',
        command: 'add',
        params: {
          type: 0, // Normal / Permanent
          name,
          password,
        },
      },
    ],
  });
}

/**
 * Update an existing lock user (used for rolling/rotating a PIN).
 * Changes the password digit on an existing user.
 *
 * @param deviceId   Lock device ID
 * @param userId     Existing user ID to update
 * @param name       Updated name (pass existing to keep)
 * @param password   New PIN digit
 */
export async function updateUser(
  deviceId: string,
  userId: string,
  name: string,
  password: number
): Promise<void> {
  await sendAction('Uhome.Device', 'Command', {
    devices: [
      {
        id: deviceId,
        capability: 'st.lockUser',
        command: 'update',
        params: {
          id: userId,
          name,
          password,
        },
      },
    ],
  });
}

/**
 * Delete a PIN user from the lock (revoke access).
 */
export async function deleteUser(deviceId: string, userId: string): Promise<void> {
  await sendAction('Uhome.Device', 'Command', {
    devices: [
      {
        id: deviceId,
        capability: 'st.lockUser',
        command: 'delete',
        params: { id: userId },
      },
    ],
  });
}

// ─── Webhook registration ────────────────────────────────────────────────────

/**
 * Register a webhook URL to receive device events (lock/unlock, etc.).
 * The U-tec cloud will POST to this URL with the access_token as Bearer.
 *
 * @param url        HTTPS URL (must have a trusted CA cert, no self-signed)
 * @param token      Bearer token U-tec will use when calling your webhook
 */
export async function registerWebhook(url: string, token: string): Promise<void> {
  await sendAction('Uhome.Configure', 'Set', {
    configure: {
      notification: {
        access_token: token,
        url,
      },
    },
  });
}

// ─── Confirmation polling ────────────────────────────────────────────────────

/**
 * After addTemporaryUser, poll listUsers to confirm the PIN was created.
 * The `add` command is async — it returns a deferred ack and the lock applies
 * the change later. This function polls until the user appears or times out.
 *
 * @param deviceId     Lock device ID
 * @param name         The name we used (reservation code) to match against
 * @param timeoutMs    Total time to poll (default 30s)
 * @param intervalMs   Poll interval (default 3s)
 * @returns The user ID if found, null on timeout
 */
export async function confirmUserAdded(
  deviceId: string,
  name: string,
  timeoutMs = 30_000,
  intervalMs = 3_000
): Promise<string | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const users = await listUsers(deviceId);
      const match = users.find(u => u.name === name);
      if (match) return match.id;
    } catch {
      // Transient error during polling — keep trying until deadline
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return null;
}
