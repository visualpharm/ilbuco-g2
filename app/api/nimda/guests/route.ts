/**
 * /api/nimda/guests — guest list for the Nimda admin panel.
 *
 * GET → returns all PIN assignments with their status, dates, and delivery info,
 * plus where each code stands on the door right now (`door`) and whether the lock is online.
 * Protected by getCaller (cookie auth for the UI, token for scripts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCaller } from '@/lib/pricing-auth';
import { loadState, listAssignments } from '@/lib/guest-ops-store';
import { poolStats as computePoolStats } from '@/lib/pin-pool';
import { listDevices, listUsers, getDeviceStatus, type UtecUser } from '@/lib/utec-api';
import { doorStateOf } from '@/lib/lock-users';

/** The live lock (single-lock setup): its users and online state; null when U-tec doesn't answer in time. */
async function readLock(): Promise<{ online: boolean; users: UtecUser[] } | null> {
  const read = (async () => {
    const [device] = await listDevices();
    if (!device) return null;
    const [users, status] = await Promise.all([listUsers(device.id), getDeviceStatus(device.id)]);
    return { online: status.online, users };
  })();
  const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 8000));
  return Promise.race([read, timeout]).catch(() => null);
}

export async function GET(req: NextRequest) {
  const caller = getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [state, lock] = await Promise.all([loadState(), readLock()]);
  const assignments = listAssignments(state).map(a => ({
    ...a,
    door: a.lockStatus === 'revoked' ? undefined : doorStateOf(a.lockUserId, lock?.users ?? []),
  }));
  const { backupPool, contacts } = state;

  // Split into reservation-based and manual PINs for the UI
  const reservationGuests = assignments.filter(a => !a.isManual);
  const manualPins = assignments.filter(a => a.isManual);

  const poolStats = computePoolStats({ backupPool });

  return NextResponse.json({
    guests: reservationGuests,
    manualPins,
    poolStats,
    lockOnline: lock ? lock.online : null,
    contactCount: Object.keys(contacts).length,
    caller,
  });
}
