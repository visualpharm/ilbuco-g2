# Hostex webhook → lock PIN → guest delivery

Production project: Vercel `ilbuco` (ilbuco.com.ar). The `ilbuco-g2` project has no U-tec or cron env; never point webhooks at it.

- Hostex authenticates a webhook with the per-webhook `Hostex-Webhook-Secret-Token` header. The secret is returned once by `POST /webhooks`, never again; lost = delete and recreate. Current webhook id 5859; secret in 1Password (AI, "ilbuco-g2 HOSTEX_WEBHOOK_SECRET") and Vercel `ilbuco` production env `HOSTEX_WEBHOOK_SECRET`.
- Hostex waits 5s and never retries on an error status. Webhook work runs in `after()`; the hourly `pre-checkin` job re-syncs the next 14 days from Hostex and revokes cancelled stays, so a dropped event self-heals.
- Stay window is 12:00 → 12:00 Argentina time (`lib/guest-pin-times.ts`). Date-only dates read as UTC midnight revoked codes the evening before checkout.
- Delivery: Hostex booking thread + Mailgun email (when the guest has an address) once the code is on the lock, from 48h before check-in until check-in time. No WhatsApp from the server (WAHA removed 2026-10-08).
- One lock ("Il Buco Front Door", U-tec Latch-5-F, Wi-Fi built in — there is no bridge). When U-tec reports it Offline nothing can be programmed; codes queue and sync when it returns, and the five permanent backup codes «Respaldo 1–5» still open the door (see below).

## Lock offline: getting it back on Wi-Fi (2026-10-29)

- Wi-Fi is set only from the **owner** account in Xthings Home (formerly U home), over Bluetooth at the door: lock → Settings → WiFi → Switch WiFi. Shared users (Andrés) don't get that menu. The OpenAPI has no Wi-Fi command.
- Owner account: iboyko8@gmail.com, password in 1Password AI «u home». If it fails, reset it at oauth.u-tec.com/forgot-password (code arrives in Ivan's Gmail from noreply@system.xthings.com), then store the new one in 1P. Resetting the password does not revoke the OpenAPI refresh token — the PIN automation keeps working. On the login form, code 21014 = wrong password, 21004 = unknown account; don't retry stale passwords.
- Never transfer ownership to someone else: the OpenAPI token belongs to the owner account, so the lock would vanish from the PIN automation.
- Network: SSID «Buco» (2.4 GHz), password in 1P AI «Il Buco WiFi (Paraíso 324)». The source of truth is the check-in template guests have connected with since Feb 2026 (in Nov 2025 a guest tried the old password from the Hostex wifi fields and the host corrected him). On 2026-11-07 the same value went into every Il Buco check-in guide in Hostex (all five listings), 1P and Vercel `WIFI_PASSWORD` (sensitive, write-only — it cannot be read back to compare, only overwritten). The router is TP-Link Omada; TP-Link mail (Tether, Omada controller) goes to iboyko8@gmail.com, so that is the TP-Link ID for the cloud login. 1P «TP Link Omada Access Points 2025» holds a local login (user «signal»); which house it belongs to is not recorded. The Il Buco irrigation controller in Home Assistant (`binary_sensor.il_buco_connectivity`) shows whether the house internet is up.
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
- Hostex property → Check-in Guide → Door lock: a «Fixed code» there is copied into every reservation's `check_in_details.lock_code` and shown in the guest's check-in guide after 12:00. Giardino and Paraiso had 8649; removed (saved with «apply to existing reservations», `extend_exist_reservation: 1`). Recharge Retreat (the rancho, its own padlocks via its own message rule) had a copy of the Il Buco guide — 8649, the Il Buco Wi-Fi and greeting; cleared the same way on 2026-11-07.

## Lock offline, admin codes and the guest chat (2026-11-08)

- Lock Offline (`st.healthCheck`): codes already at `sync_status` 1 keep opening; new or changed codes sit at 0 and deletes stay pending until it is back. 8.11 it went offline at ~09:20 ART together with a water outage at the house (power or the router suspected).
- Admin codes — «Mantenimiento DD-MM» (staff) and «Huespedes DD-MM» (weekly guest fallback for when a personal code fails), created by noe's Monday 08:30 script `~/.claude/artifacts/comms/scripts/ilbuco_weekly_code.py` through `/api/nimda/create-pin` — used to be skipped by the hourly check. Now one stuck at 0 is written again (same PIN, name, window) once the lock is online and 20 min have passed since the last write (`manualLockAction`, lib/lock-users.ts); never renamed or re-added. The script waits for `sync_status` 1 before posting the code to the staff group; an unknown flag prints usage and creates nothing (a `--help` run on 8.11 created and posted a code).
- Door instructions: the «🔑 Check-in» message and email say how to enter the code — touch the black panel, type it, press ↵ (bottom right), green light, handle down — with the picture `public/images/door-keypad.jpg` and the host's video.
- On 7.11 at 17:04 ART a host reply in Hostex carried the old Wi-Fi name «IlBucco» and an old door code; the host said the app filled it in. On 8.11 every Hostex source was clean: check-in guides of all five listings, `quick_message/list`, `auto_reply/content_list`, automation rules (`automation/message/v3_rule_detail`), HostGPT knowledge (`host_knowledge/list`), and each reservation's `guide_info.lock` / `v2_locks`. The guides had been fixed at 16:55, before that reply — so the text came from the sender's phone (a saved phrase), not Hostex. Re-check script (web login, prints only hits): `~/.claude/artifacts/ilbuco/hostex-browser/hxscan.mjs`.

## Only Il Buco stays get a door code (2026-11-07)

- The lock is Il Buco's front door, but the webhook and the hourly Hostex sync handled every property: a Recharge Retreat booking would have been sent an Il Buco door code. `opensIlBucoDoor(propertyId)` (lib/lock-users.ts, `ILBUCO_PROPERTY_IDS`) now gates `handleNewReservation` and the sync.

## Backup codes «Respaldo 1–5» (2026-11-07)

- The pool had been empty since launch («seed it in /nimda» never happened), so the 24h fallback could only alert. The hourly `pre-checkin` job now keeps five permanent lock users «Respaldo 1…5»: adds a missing one, adopts it on the next run by name with the PIN U-tec holds, and marks a slot ready only when a later run reads our PIN back at `sync_status` 1.
- A slot handed to a guest is released at checkout with `rotate`: the next run writes a new PIN, so the guest's code stops opening the door. Slots in use are never touched. Names don't match `isGuestLockName`, so the orphan sweep leaves them alone.


## A $0 hold under a paid booking gets no code (2026-11-07)

- Hosts block dates by hand ($0, 1 guest, guest's name) and the guest later books on Booking.com: Silvia Krauel had Giardino 5-6AHHVU3CU ($0, from 30.03) plus Booking 9-6861866133 ($416) — two codes for one door. Vanesa / Vanesa Moya repeat the pattern on Casa in December.
- `placeholderStays()` (lib/lock-users.ts): accepted, amount exactly 0, overlapping an accepted paid stay on the same property with the same first name. The hourly sync (looking a month back for the paid twin) and the webhook revoke and skip such holds. A $0 stay with no paid twin (friends, family) keeps its code; an unknown amount is not a hold.

## A same-day booking gets its code after 15:00 too (2026-11-07)

- Alejandro Supital booked Giardino at 16:43 for the same night. The lock took his code in seconds, but `isDeliveryDue` treated anyone past check-in time + 3 h as "already in, instructions came another way" and never sent it; staff gave him a personal code instead.
- Now a stay we learned of (assignment `createdAt`) less than 24 h before check-in is delivered whenever the lock has the code, until checkout. Stays known for longer keep the old "never retroactive" rule.

## Email channel: mg.ilbuco.com.ar (2026-11-07)

- Until 2026-11-07 Vercel `ilbuco` had no `MAILGUN_*` env, so every email attempt ended "Mailgun not configured" and guests got the code only in the Hostex thread.
- Now: domain `mg.ilbuco.com.ar` on the shared Mailgun account (US region), DNS in the Cloudflare zone ilbuco.com.ar (SPF + DKIM `mailo._domainkey` TXT, `email.mg` CNAME, MX for bounces; the root MX stays ImprovMX). Vercel production env `MAILGUN_API_KEY` (a sending key limited to this domain, 1P AI «Mailgun sending key — mg.ilbuco.com.ar (Vercel ilbuco)»), `MAILGUN_DOMAIN`, `MAILGUN_FROM` = `Il Buco <ciao@ilbuco.com.ar>` (the public contact; replies go to ImprovMX). Env changes need a redeploy.
- Pending email channels are retried by the next job, so stays already inside the delivery window got the email right after the switch. Check sends with `GET /v3/mg.ilbuco.com.ar/events`.

