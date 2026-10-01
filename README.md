![Il Buco — forest-side eco-lodge](public/photo/exterior/exterior1.jpg)

**Il Buco** is an expansive luxury house for **tech founders** and **remote professionals** to get their long-standing plans done. 

This repo is the Il Buco website — a trilingual Next.js app (Spanish/English/Portuguese) with live availability, direct-booking checkout, an AI chat assistant, and an internal admin/CRM panel. Deployed on Vercel at [ilbuco.com.ar](https://ilbuco.com.ar/).

## How it works

- **Next.js App Router, one tree per language**: Spanish (default) at `/app/`, English at `/app/en/`, Portuguese at `/app/pt/`; per-language SEO landing pages stay out of the main navigation.
- **Custom translation layer (no next-intl)**: `/translations/*.ts` hold nested `es`/`en`/`pt` objects rendered by `<Translate text={…} themeAware={…} />`; language state in `contexts/language-context.tsx` with geolocation-based detection.
- **Two content themes** — `default` and `techBillionaire` (`context/ThemeContext.tsx`) swap copy and tone; next-themes handles dark/light.
- **Availability**: `app/api/availability` reads live suite calendars from Hostex (`lib/hostex-api.ts`); booking buttons deep-link to the Hostex booking site book.ilbuco.com.ar per suite and to Airbnb listings.
- **Direct booking**: the `/reservar` flow charges through Mercado Pago (`lib/mercadopago-client.ts`, `app/api/mp/*`); an HMAC-verified, fail-closed webhook confirms payment before a booking counts.
- **AI chat**: `app/api/chat` answers in the visitor's language from the curated knowledge base (`lib/chat-prompt.ts`, `lib/local-businesses.ts`) with Google Places fallback, running on its own capped OpenRouter key.
- **Nimda admin panel** (`/nimda`, login-protected): CRM guest history synced from Hostex, guest ops with automated per-guest lock PINs, OTA-compliant outreach, pricing engine.
- **State lives in versioned Vercel Blob stores** with non-enumerable random pathnames (`lib/crm-store.ts`, `lib/guest-ops-store.ts`) — there is no SQL database.
- **Booking protection**: `lib/inventory-sync.ts` closes-only sync plus `scripts/booking_guard.py` repair cross-channel double-bookings; the journal lives under `~/.local/share/ilbuco-booking-guard/`.
- **Images** scale through the ImageKit CDN (`ik.imagekit.io/icons8/ilbuco/…?tr=w-400,h-300`); icons are genuine Icons8 SVGs in `public/icons/icons8/`.

## Run

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run start      # production server
```

Runtime keys (`HOSTEX_API_KEY`, `GOOGLE_MAPS_API_KEY`, Mercado Pago, OpenRouter, Vercel Blob) come from `.env.local`.

## Test

```bash
npm run test               # unit tests (tsx --test over lib/*.test.ts)
npm run lint               # ESLint
~/.claude/bin/local-ci     # full local gate: booking-guard tests + unit tests + production build (see .local-ci.json)
```

### About Il Buco

Solid build, 500 Mbps fiber to the house, server rack space, ergonomic chairs, and all the luxuries of four- and five-star hotels. 

Plus the autonomy of your own home: 
- private washer
- full kitchen
- dedicated workspace
- green terraces (work best for concentration).

### Links

- 🇺🇸 [Il Buco — Coliving in the beach forest in Argentina](https://ilbuco.com.ar/)
- 🇦🇷 [Il Buco — Alquiler de una casa tecnológica en Cariló](https://ilbuco.com.ar/es)
- 🇧🇷 [Il Buco — Coliving na praia na Argentina](https://ilbuco.com.ar/pt)

### Built by

Built by [Ivan Braun — AI Keynote Speaker](https://aiandtractors.com) to bring like-minded people closer together.
