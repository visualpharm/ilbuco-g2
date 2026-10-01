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
