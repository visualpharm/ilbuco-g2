# Decisions

Append-only log, newest last. Before changing an existing behavior, grep this file; contradicting a logged Ivan decision needs his Yes.

Format:
```
## YYYY-MM-DD · <title>
Decided: … · Why: … · Rejected: … · Undo: … · By: Ivan | agent
Source: <commit / file>
```

## 2025-05-22 · Stack: v0-generated Next.js app as the website base
Decided: build the Il Buco site on the v0-generated Next.js project (package name "my-v0-project"), since upgraded through Next 15 to Next 16. · Why: not recorded. · Rejected: not recorded. · Undo: replace the app with another stack. · By: Ivan
Source: commit 0998875 "Initialized repository for project Il Buco Frontpage Design"; package.json.

## 2025-05-23 · Custom translation architecture instead of next-intl
Decided: keep translations in `/translations/*.ts` as nested objects with `en`/`es`/`pt` keys, rendered by a custom `<Translate>` component; do not adopt next-intl. · Why: not recorded. · Rejected: next-intl. · Undo: migrate to next-intl and delete the custom layer. · By: not recorded
Source: commit a40c4f5 (adds translations/common.ts); CLAUDE.md architecture notes (now docs/rules/architecture.md).

## 2025-05-24 · Three public languages, Spanish default at the root
Decided: Spanish at `/app/`, English at `/app/en/`, Portuguese at `/app/pt/`, identical page structure per language; Spanish is the default language. · Why: not recorded. · Rejected: not recorded. · Undo: restructure the language routing. · By: not recorded
Source: commit 07a348b "feat: add Brazilian Portuguese language support".

## 2025-06-07 · SEO landing pages are independently written per language
Decided: SEO landing pages exist for one language only (e.g. /alquiler-carilo Spanish-only, /en/coliving-argentina English-only), are independently written — not translations of one another — and stay out of the user-facing navigation; regular pages are translated and synchronized. · Why: each language targets its own local search keywords. · Rejected: shared or directly translated landing pages. · Undo: consolidate landing pages across languages. · By: Ivan
Source: commit 5527171 "Landing pages in pt"; CLAUDE.md "SEO Strategy and Content Notes" (now docs/rules/seo.md).

## 2026-01-21 · AI chat widget on the public site
Decided: add an AI chat widget answering availability and property-info questions in the visitor's language. · Why: not recorded. · Rejected: not recorded. · Undo: remove app/api/chat and the widget. · By: not recorded
Source: commit 1846285 "feat: add AI chat widget with availability and property info".

## 2026-05-26 · Hostex as channel manager and availability source
Decided: all calendar/availability reads go through the Hostex API (lib/hostex-api.ts); booking buttons deep-link to the Hostex booking site book.ilbuco.com.ar per suite; app/api/hostex-webhook reacts to channel events. · Why: not recorded. · Rejected: not recorded. · Undo: point availability and booking links at a different channel manager. · By: not recorded
Source: commit 210eb4f (adds lib/hostex-api.ts); booking links in CLAUDE.md (now docs/rules/booking-guests.md).

## 2026-08-10 · Nimda admin panel, guest PIN automation, CRM on Vercel Blob
Decided: add the login-protected /nimda admin panel — guest ops with automated per-guest lock PINs, CRM guest history synced from Hostex, outreach engine with OTA-compliance guardrails; CRM and guest-ops state in versioned Vercel Blob stores with non-enumerable random pathnames. · Why: centralize guest operations; non-enumerable URLs came from security audit 2026-09-03 finding 1. · Rejected: not recorded. · Undo: remove /nimda, lib/crm-store.ts, lib/guest-ops-store.ts. · By: agent
Source: commits 15ac92f, c81c18a, fcca46f; lib/crm-store.ts and lib/guest-ops-store.ts headers.

## 2026-08-18 · Direct-booking checkout via Mercado Pago
Decided: direct booking charges through Mercado Pago (preference creation + webhook); the webhook verifies HMAC signatures, dedupes payments, and fails closed; booking confirmation is gated on the MP webhook secret. · Why: let guests book and pay directly without OTA commissions; fail-closed hardening. · Rejected: not recorded. · Undo: revert to link-out-only booking. · By: agent
Source: commits 4c51044, b90071f, 4d32947; lib/mercadopago-client.ts.

## 2026-09-07 · Booking protection guard is close-only
Decided: the website's inventory sync only closes dates; scripts/booking_guard.py --apply additionally repairs exposed nights and reads back. No guest messages, reservation creations, cancellations or opening writes. · Why: prevent cross-channel double-bookings without risking open-date mutations. · Rejected: symmetric open/close sync. · Undo: re-enable opening writes (needs Ivan's Yes). · By: agent
Source: docs/booking-protection.md; docs/solutions/hostex/booking-protection.md.

## 2026-09-29 · Website chat on its own capped OpenRouter key, model gpt-6-sol
Decided: route the public chat through a dedicated capped OpenRouter key, move the model to gpt-6-sol, and remove guest roster/Wi-Fi data from the public chat prompt. · Why: gpt-5.2-chat-latest was retired by OpenAI and the OpenAI org was out of credits; roster removal closes a data leak. · Rejected: paying into the OpenAI org. · Undo: switch chat back to a direct OpenAI key. · By: agent
Source: commits b8ca9b4, d523235, e1d428e.

## 2026-10-10 · Guest PIN automation: webhook secret header, Hostex-thread delivery, no WAHA
Decided: the Hostex webhook points at ilbuco.com.ar and is authenticated by `Hostex-Webhook-Secret-Token`; PIN work runs in `after()`; stays are 12:00→12:00 Argentina time; codes reach guests through the Hostex booking thread (email when Mailgun is configured) once synced and within 48h of check-in; hourly sync with Hostex creates missing PINs and revokes cancelled stays. · Why: every webhook since August was rejected 401 (wrong header, wrong project), WAHA was removed, and date-only stays expired a night early. · Rejected: WhatsApp from the server (no path from Vercel). · Undo: revert the commit; recreate the webhook. · By: agent
Source: docs/solutions/guest-ops/hostex-webhook-and-pin-delivery.md.

## 2026-10-22 · Hard per-night price floor on every guest-facing price
Decided: `lib/price-floor.ts` holds a per-season × per-listing USD floor (suites $70 peak / $65 otherwise; whole house $325 peak / $250 otherwise), derived from Hostex booking history as half the tier's median sold night, capped at the cheapest night actually sold, never under cost ($65 / $250). A night under it is never quoted: the engine clamps to it, the pre-push gate aborts, the site/chat/voice/autoresponder drop the price, checkout errors. noe runs `scripts/price-check <listing> <in> <out> [--total N] [--ars]` before sending a price (exit 0 send · 1 stop · 2 cannot verify). · Why: guests now get Hostex prices from noe directly; cheaper than Ivan would quote is fine, an absurd $30/night is not (Ivan m734035). · Rejected: a single flat floor (ignores season); floors above the cheapest real sale (would block prices we have taken). · Undo: revert the commit. · By: agent
Source: lib/price-floor.ts, lib/price-floor.test.ts; re-derive with `scripts/price-check derive`.

## 2026-10-26 · One component per repeated page part; language from the URL on the server
Decided: every photo viewer is `components/image-lightbox.tsx` (swipe/drag left-right, swipe down closes, trackpad two-finger, keys); home and /location render one component for es/en/pt/ru with per-language SEO phrases passed in; header and phone menu share `useNavItems`; booking options (popup + /contacts) are `BookingOptions`; contacts come from `lib/contact.ts`. The language is derived from the pathname during render (no state/effect), so the server sends the right language. Local photos go through the ImageKit loader (`lib/imagekit-loader.ts`); the sitemap is generated from app/ routes (`lib/site-routes.ts`). lucide-react on public pages is replaced by `components/icons8-lucide.tsx` (Icons8 SF Regular art, same names). · Why: Ivan m976375 — gallery did not swipe; per-language copies had drifted (en/pt booking CTA and header link were 404, 8 of 42 sitemap URLs were 404, /en rendered Spanish first). · Rejected: patching each copy. · Undo: revert the 2026-10-26 polish commits. · By: agent
Source: task d976498.

## 2026-10-29 · 3D model of the house at /3d as one static page
Decided: the Three.js model of the house (built outside this repo in the hub workspace ilbuco-3d) ships as a self-contained `public/3d/index.html` plus the walk-through video `public/3d/walk.mp4`; `next.config.mjs` rewrites `/3d` to it. No React page, no build step for it. · Why: Ivan m1262140 — publish the model on the Il Buco site on its own page. · Rejected: an app/ route wrapping the canvas (would duplicate the standalone viewer and its touch handling). · Undo: delete public/3d and the rewrite. · By: agent
Source: task d1200939.

## 2026-11-05 · 3D model v9: ground floor fixed by the walk-through video; a light copy lives in hub Pages
Decided: the ground floor follows the walk-through video and photos — one room from the entrance (kitchen on the left, hall on the right), Paraiso door closed, fridge in the niche of the white column at the west wall next to the glass garden door, windows of the west corridor and its south end. The same model is published in the hub's Pages as `ilbuco-3d` (built by `build9p.py` in the hub workspace ilbuco-3d): ≤2 MB, photos recompressed, no walk video (Pages CSP blocks external media), so its blue points show the viewpoint and photos only. · Why: Ivan m1756537/m1756623 (task d1758142). · Undo: restore the previous public/3d/index.html from git; `pages_cli.py rm ilbuco-3d`. · By: agent

## 2026-11-10 · Guest message in Hostex wakes the hub's guest session at once
Decided: on `message_created` from a guest (not host, not a Hostex "Bot:" auto-message) `/api/hostex-webhook` POSTs a signed wake (HMAC-SHA256 over "ts.body", key `HUB_WAKE_SECRET`, 1Password AI) to `HUB_WAKE_URL` = https://hooks.aiandtractors.com/hostex-wake — a host on the hub machine's Cloudflare tunnel limited to that path — where `scripts/hub_wake_relay.py` (LaunchAgent `deploy/com.openclaw.ilbuco-hub-wake-relay.plist`, 127.0.0.1:7391) runs `hub agent-send noe … --as hostex-webhook --id hostex-<message id>`. Why: guests with a broken door code or an early arrival need a reply in minutes; the 2-minute poll stays as fallback. Not the hub's full Cloudflare client token in Vercel: the relay can only wake one session with fixed words. A test event (`"test": true`) wakes with "do nothing" and never reaches the autoresponder.
Limit: when the session is mid-turn the hub delivers after the turn ends (median turn ~50 s).
Rollback: delete `HUB_WAKE_URL` in Vercel (code skips the wake) or `launchctl bootout gui/501/com.openclaw.ilbuco-hub-wake-relay`.
Source: task d2248857.

## 2026-11-12 · 3D tour in the site menu, in four languages, with the suites' real names
Decided: the menu (header and phone menu, es/en/pt/ru) gets "Tour 3D / 3D Tour / 3D-тур" after The House, rendered as a plain `<a>` (`plain: true` in `useNavItems`) because the tour is a static file outside the app router — `next/link` would prefetch 2 MB of HTML. The tour has one address per language (`/3d`, `/en/3d`, `/pt/3d`, `/ru/3d`, rewrites in `next.config.mjs`, all four in the sitemap with hreflang) and reads its language from the path; every label, shooting point and photo caption is translated in the page's own dictionary. Rooms carry the names we use: Giardino (ground floor), Paraiso (1st floor, street side), Terrazzo (1st floor, balcony with plants), Penthouse (top floor); old `?n=` links keep working. The builder's footnote and "approximate position" remarks are gone from the public page; "IL BUCO" in the tour's menu leads back to the site. · Why: Ivan m2463510 — make the tour reachable from the menu; Ivan m2268806 — name the rooms in the model the way we call them. · Rejected: an app/ page wrapping the tour (see 2026-10-29); one Spanish tour for every language (the menu item would lead ru/en/pt visitors to a page they cannot read).
Undo: remove the `tour3d` item in `components/use-nav-items.ts`; the previous tour is `public/3d/index.html` one commit back. Sources of the tour: hub workspace ilbuco-3d (`build11.sh`, `tools/patch11.py`, `app/i18n11.js`).
Source: task d2463546.

## 2026-11-12 · Sources of the 3D tour live in the repo (tour3d/)
Decided: everything the tour is built from — scene, page code, dictionary, photos as JPEG files, three.js — is in `tour3d/`; `python3 tour3d/build.py` writes `public/3d/index.html` byte for byte as it was served, and local CI fails when the committed page and the sources disagree. The built page stays committed and Vercel builds nothing for it (2026-10-29 stands). The architect's plans, full-size photo originals and earlier versions stay out of this public repo; a copy is on the hub machine in `~/.claude/artifacts/ilbuco-3d/workspace-archive/`. · Why: the sources existed only in a hub working folder with no version control and would have been lost with it (task d2465878). · Rejected: Git LFS (nothing needed for the build is heavy: 2 MB of photos; LFS on Vercel needs its own setup); keeping photos as one base64 file (cannot be reviewed or replaced one by one).
Undo: delete `tour3d/` and the `--check` line in `scripts/local-ci.sh`; the page keeps working.
Source: task d2465878.

## 2026-11-12 · Terrazzo is on the first floor (primer piso), next to Paraiso
Decided: the chat, autoresponder and voice assistant say Terrazzo is one floor up, not on the ground floor (`lib/knowledge-base.ts`, `lib/voice-config.ts`, `app/api/vapi/check-availability/route.ts`). Checked against what is tied to each suite: the site photos (Terrazzo — open plan with a bed alcove and a door to the wooden deck with a glass rail, seen from above the neighbours' roofs; Paraiso — separate bedroom with twin beds and the tall corner window), the architect's plans (ground floor: one suite, Giardino; first floor: two suites, the south one opens to the terrace above Giardino, the north one faces Calle Paraíso), and Ivan's words of 2026-11-10 (ground floor Giardino, upstairs facing the street Paraiso, the one with the balcony and plants Terrazzo, top floor Penthouse). The 3D tour already had it this way and stays as is.
Undo: put `Ground floor` back in the three files.
Source: hub message m2466812.

## 2026-11-12 · 3D tour follows the built house: open garage approach, flush walls, real furniture, baked geometry
Decided: the model is corrected against the site photos and the walk-through video where they disagree with the architect's plan. North end: the common hall on the ground floor reaches the north facade, the garage gate sits right under its slatted window, and the approach is an open apron and ramp between retaining walls with a cable rail on the east one — no lawn over it. South and west walls of the ground floor are flush with the floors above. Window frames are plain rectangles set into the opening; windows were moved off partitions and slabs; outer corners are closed. Chairs stand around tables without touching them (`roundTable`, `longTable`, gap `CH`), chairs have round seats and curved backs, sofas and beds have rounded edges. Terrace: light pine deck up to the parapets, a large planter along the west parapet into the north-west corner and a small one on the east, table for 6; balcony: a pine island with planted mulch up to the corners. Every floor's static geometry is merged into one mesh per material (`bake`): 162 draw calls instead of 2855, 0.24 ms per frame instead of 4.5 ms on desktop. · Why: Ivan m2467188 — chairs grown into tables, low-poly furniture, the garage approach drawn as a tunnel under grass, a ledge on the wall opposite the garage gate, slabs crossing windows, notched window frames, planter shapes on the roof and terrace. · Rejected: following the plan for the north end (hall ending 3.7 m short of the facade with a canopy on columns) — the photos and the video at 0:14–0:48 show it was not built that way.
Undo: `git revert` of this commit and `python3 tour3d/build.py`.
Source: task d2467621.

## 2026-11-12 · 3D tour rebuilt to the construction album of 10.2024: real footprint, floor heights, stepped north facade
Decided: the model is rebuilt from the working drawings the house was built from (construction album, 10.2024), checked against the walk-through video (0:33, 0:40, 0:52, 0:58) and the site photos. The earlier model was measured from the 2022 project, which is larger than the built house, and the entry above patched its north end by eye — that part of it is replaced. Now: the west strip is 7.31 × 15.51 m on the ground floor with the east wing to 12.75 × 7.51 m; the 1st floor reaches 16.9 m (slabs to 18.0 m), the 2nd floor is the 7.51 m deep block with the terrace north of it; the basement ends at 12.62 m. Levels: basement −3.0, ground 0, 1st floor 3.5, 2nd floor 6.5, roof 9.5. North facade is stepped as built: garage gate in the basement wall, the hall with the slatted window 2.9 m over it, the 1st floor 2.5 m further out; the approach stays an open apron and ramp (Ivan: not a tunnel, no grass over it). South and west walls stay flush, planters still reach the corners, furniture and chair rules of the entry above stay. Stairs, rooms, labels, the 24 shooting points and the 26 menu views moved to the new coordinates; the origin of the plan is the outer south-west corner of the concrete. The "whole house" view now looks from the east — entrance patio, balcony and terrace — because from the south-west the pines covered the house. · Why: Ivan m2467188 — «проверит ещё геометрию»; the album matched the video where the 2022 project did not. · Rejected: keeping the 2022 dimensions and patching only what Ivan listed (the wing, floor heights and north facade would stay wrong); putting the album into this repo (public repo, private document).
Undo: `git revert` of this commit and `python3 tour3d/build.py`.
Source: task d2467621.

## 2026-11-12 · 3D tour: on a phone the menu folds after every pick

- **Decided:** picking any item of the tour's menu on a phone (floor, suite or room) folds the menu, so the camera's target is not left under it; on desktop the menu stays open. The "Planta" switch moves the camera too and folds the menu the same way.
- **Why:** Ivan (m2514072): the picked floor or suite must be visible on screen on phone and computer; on the phone the menu should hide, on the computer it may stay. Before, the menu folded only for items without children, so a picked floor or suite stayed under it (18 of 52 phone picks measured).
- **Rejected:** keeping the menu open and fitting the view into the strip below it — on a phone that strip is under half the screen.
- **Undo:** restore the `!kids` condition in the menu click handler in `tour3d/src/app.js`.
- **Source:** task d2514160.

## 2026-11-12 · Paraiso has two separate single beds

- **Decided:** the Paraiso bedroom has two separate single beds, heads to the west wall, the north one against the window wall, a passage between them; dark grey bedspreads, a rolled towel at the foot, no headboards or bedside tables (as in `public/photo/paraiso/paraiso7.jpg`). The 3D tour draws them with `singleBed()` and looks at the bedroom from the east, because from the south-west the wall hides the south bed. Texts that described Paraiso with one big bed or with a single mattress now say two single beds that can be pushed together: channel descriptions (root, es, en, pt), llms.txt, the autoresponder, the Spanish knowledge-base line, and the landing pages that said every room has a double/queen bed.
- **Why:** Ivan (m2514147): «В Параисо две раздельные кровати».
- **Undo:** `git revert` of these commits and `python3 tour3d/build.py`.
- **Source:** task d2514187.

## 2026-11-13 · 3D tour: walk mode, cable railing on the balcony, one table in the hall
Decided: the tour gets a first-person walk mode on the same page (button «Recorrer caminando», `/3d?walk`): arrows/WASD or a touch pad, drag to look, tap the floor to walk there; doors swing open when you walk into them or tap them; clouds over openings and stairs carry you into the next room or up and down the stairs. Walls and furniture stop you (a collision grid built from the model itself). Corrections from Ivan: the balcony railing is a cable railing like the garage ramp and the roof terrace, not glass; the ground-floor hall has no indoor plants and only one round table with chairs. · Why: Ivan m2601500 — «чтоб можно было по нему ходить, двери открывать… активные облачки… в другую комнату перейти»; Ivan m2602440 — railings, plants, table. · Rejected: a separate page or game engine for the walk (a second copy of the model to keep in sync; the light copy would not fit 2 MiB); free walking through walls (rooms lose their shape); automatic tour only (Ivan asked to walk with the arrows).
Undo: `git revert` of this commit and `python3 tour3d/build.py`.
Source: task d2601590.


## 2026-11-13 · Suites reopened after the whole-house-only window expired

- **Decided:** the suite nights that stayed closed only because of the whole-house-only policy (`wholeHouseOnly.until` 2026-11-01) are open again in Hostex at property level, so every channel follows: Giardino 37 nights, Terrazzo 38, Paraiso 25, Penthouse 38 (Dec 15–21, Dec 28–29, Jan 3–31; Paraiso Dec 15–21 and Jan 14–31; Giardino from Dec 16). Kept closed: nights of each suite's own booking, every night the whole house is booked or held (Dec 22–27 with the known double-booking, Dec 30–Jan 2), closures with a Hostex parent/child remark. A night was released only with no live or pending stay on that suite or on the whole house and an unlabelled policy closure. The whole house was not touched. Readback: all 138 nights open at property level, every other night unchanged; 672 of 690 channel nights open, Paraiso on Airbnb stays closed Jan 14–31 (as it already was Feb 11–28) — a setting on the Airbnb side, not a Hostex closure. The sync code stays close-only; the release was a one-off reviewed write.
- **Why:** the policy's stated end (Ivan's design: suites closed until Nov 1, then reopened reservation-aware; Andrés 2026-10-22: «para el 1/11 vamos a abrir los alquileres individuales»); the booking guard flagged the expired closures for this review.
- **Rejected:** a blanket `available:true` sweep (would reopen booked and conflict nights); adding an open helper to `lib/hostex-api.ts` (the protection code must not be able to open dates).
- **Undo:** close the same dates again with POST `/v3/availabilities` `available:false` per suite; the list is in `~/.claude/artifacts/ilbuco/policy-release-20261113/plan.json`.
- **Source:** booking guard one-time flag; noe task 2026-11-13.
