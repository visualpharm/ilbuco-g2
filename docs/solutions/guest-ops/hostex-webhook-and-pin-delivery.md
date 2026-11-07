# Hostex webhook → lock PIN → guest delivery

Production project: Vercel `ilbuco` (ilbuco.com.ar). The `ilbuco-g2` project has no U-tec or cron env; never point webhooks at it.

- Hostex authenticates a webhook with the per-webhook `Hostex-Webhook-Secret-Token` header. The secret is returned once by `POST /webhooks`, never again; lost = delete and recreate. Current webhook id 5859; secret in 1Password (AI, "ilbuco-g2 HOSTEX_WEBHOOK_SECRET") and Vercel `ilbuco` production env `HOSTEX_WEBHOOK_SECRET`.
- Hostex waits 5s and never retries on an error status. Webhook work runs in `after()`; the hourly `pre-checkin` job re-syncs the next 14 days from Hostex and revokes cancelled stays, so a dropped event self-heals.
- Stay window is 12:00 → 12:00 Argentina time (`lib/guest-pin-times.ts`). Date-only dates read as UTC midnight revoked codes the evening before checkout.
- Delivery: Hostex booking thread (+ Mailgun email when configured) once the code is on the lock, from 48h before check-in until check-in time. No WhatsApp from the server (WAHA removed 2026-10-08).
- One lock ("Il Buco Front Door", U-tec Latch-5-F, via a Wi-Fi bridge). When U-tec reports it Offline nothing can be programmed; codes queue and sync when it returns. Backup PIN pool is empty — seed it in /nimda.

## Lock offline: getting it back on Wi-Fi (2026-10-29)

- Wi-Fi is set only from the **owner** account in Xthings Home (formerly U home), over Bluetooth at the door: lock → Settings → WiFi → Switch WiFi. Shared users (Andrés) don't get that menu. The OpenAPI has no Wi-Fi command.
- Owner account: iboyko8@gmail.com, password in 1Password AI «u home». If it fails, reset it at oauth.u-tec.com/forgot-password (code arrives in Ivan's Gmail from noreply@system.xthings.com), then store the new one in 1P. Resetting the password does not revoke the OpenAPI refresh token — the PIN automation keeps working. On the login form, code 21014 = wrong password, 21004 = unknown account; don't retry stale passwords.
- Never transfer ownership to someone else: the OpenAPI token belongs to the owner account, so the lock would vanish from the PIN automation.
- Network: SSID «Il Buco» (2.4 GHz), password in 1P AI «Il Buco WiFi (Paraíso 324)»; the source is the Hostex wifi fields of Giardino/Terrazzo/Paraiso. The Il Buco irrigation controller in Home Assistant (`binary_sensor.il_buco_connectivity`) shows whether the house internet is up.
- `battery` in the device status is 0–5 bars, not percent.

## Lock user command shape (2026-10-29)

- `st.lockUser` commands go as `{"devices":[{"id":<device>,"command":{"capability":"st.lockUser","name":"list|get|add|update|delete","arguments":{…}}}]}` with numeric user ids; header carries `messageId` and `payloadVersion: "1"`. Source: U-tec Postman docs (collection 42799536/2sAYk8v3Eb, «Lock User Management»).
- The flat `{id, capability, command}` shape is accepted with HTTP 200 and `devices: []` — no error, nothing happens. Until this fix no automated or admin PIN ever reached the lock; check a new command against the live `list`, not the HTTP status.
- `get` returns `devices[0].user` (with `password`); `add/update/delete` return only `st.deferredResponse` — confirm through `list`. `update` takes the full user object: a temporary user needs `type: 2` and the schedule again or it turns permanent.
- Nightly reconcile deletes unknown temporary users named like a Hostex reservation code, and unknown "Guest DD-MM Unit" users once their stay is over; codes added by hand in Xthings Home stay.

## Code in U-tec ≠ code on the door: sync_status (2026-11-07)

- `list` gives each user `sync_status`: **1 = on the physical lock, 0 = only in the U-tec cloud**. Lara Desmaras' code sat at 0 on check-in day while the server called it synced and had sent it to her; the old parser turned 0 into `undefined`.
- A user stuck at 0 reaches the lock when it is written again: `update` with the same PIN and schedule (and any name). Seconds later `list` shows 1.
- The server now counts a code as synced and sends it only at `sync_status` 1. The hourly `pre-checkin` job first checks every synced upcoming code against `list`: 0 → written again; still 0 → back to the retry queue (no delivery; within 24h of check-in the backup path); gone from the lock → added again. "Not on the lock yet" and "confirmation timed out" are retryable — they used to exhaust the queue on the second attempt.
- Lock users are named "Guest DD-MM Unit" (`lib/lock-users.ts`, e.g. "Bruno Sergio 07-11 Penthouse", whole house = "Casa"); matching is by the stored U-tec user id, with the old reservation-code name as fallback. U-tec took a 66-character name in a test; we cap at 40. Renaming = `update` with the same PIN and schedule.

## Hostex must not hand out a fixed door code (2026-11-07)

- The guest-facing code is only the personal PIN from the «🔑 Check-in» message. The automation template «Il Buco - Check In <unit>» (sent 1 day before check-in at 07:00, after the PIN message) used to say the code was 8649, which is not on the lock.
- Hostex property → Check-in Guide → Door lock: a «Fixed code» there is copied into every reservation's `check_in_details.lock_code` and shown in the guest's check-in guide after 12:00. Giardino and Paraiso had 8649; removed (saved with «apply to existing reservations», `extend_exist_reservation: 1`). Recharge Retreat still has a fixed code — a separate place, left as is.
