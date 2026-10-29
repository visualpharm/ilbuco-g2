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
- Nightly reconcile deletes only unknown temporary users named like a Hostex reservation code; codes added by hand in Xthings Home stay.
