/**
 * /api/nimda/lock — the live lock for the Nimda admin panel, loaded after the guest list
 * (U-tec takes ~7 s): whether the lock is online and where each held code stands on the door —
 * on it (sync_status 1), only in the U-tec cloud (0), or gone. The stored «synced» only says
 * U-tec accepted the code. Protected by getCaller.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadState, listAssignments } from '@/lib/guest-ops-store';
import { listDevices, listUsers, getDeviceStatus } from '@/lib/utec-api';
import { doorStateOf, type DoorState } from '@/lib/lock-users';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [device] = await listDevices().catch(() => []);
  if (!device) return NextResponse.json({ lockOnline: null, door: {} });
  // U-tec now and then answers 500/504 or an empty list: one more try before showing no door states.
  const readUsers = async () => {
    const first = await listUsers(device.id).catch(() => []);
    return first.length ? first : listUsers(device.id).catch(() => []);
  };
  const [users, status, state] = await Promise.all([
    readUsers(),
    getDeviceStatus(device.id).catch(() => null),
    loadState(),
  ]);
  const door: Record<string, DoorState> = {};
  for (const a of listAssignments(state)) {
    if (a.lockStatus === 'revoked') continue;
    const d = doorStateOf(a.lockUserId, users);
    if (d) door[a.reservationCode] = d;
  }
  return NextResponse.json({ lockOnline: status ? status.online : null, door });
}
