# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This file stays thin: principles, what Ivan decides, and how we work. Detailed rules live verbatim in `docs/rules/*.md` — read the file for any area you touch. `docs/decisions.md` is append-only; grep it before changing existing behavior.

## Principles

- **Three languages by directory, Spanish default**: root `/app/` is Spanish, `/app/en/` English, `/app/pt/` Portuguese; identical page structure per language, plus per-language-only SEO landing pages kept out of navigation.
- **Custom translation layer, not next-intl**: `/translations/*.ts` hold nested `es`/`en`/`pt` objects, rendered via `<Translate text={…} themeAware={…} />`; language state in `/contexts/language-context.tsx`, geolocation detection in `/hooks/use-language-detection.ts`.
- **Two content themes** — `default` and `techBillionaire` (`/context/ThemeContext.tsx`) swap copy and tone; next-themes handles dark/light.
- **Facts only from the real house**: every claim traces to /the-house, /rooms, /places-nearby, /location or was typed by Ivan — never invented (docs/rules/content.md).
- **SEO landing pages are per-language and independent**, invisible in navigation, and never affect the main site's structure or appearance (docs/rules/seo.md).
- **Builds ignore ESLint and TypeScript errors** (`next.config.mjs`) — a green build proves nothing; run lint and tests explicitly.

## Ivan decides

- New house facts (testimonials, prices, daily rates, amenities, features) — only when Ivan types them.
- Location claims need at least 2 independent confirming sources before publishing.
- SEO keyword → landing-page mapping and footer link distribution (docs/rules/seo.md).
- Booking destinations (book.ilbuco.com.ar listing per suite, Airbnb links) and payment options per language (docs/rules/booking-guests.md) — fixed, not changed in code without his word.
- Business data on places pages comes only from the Google Maps API, never hand-entered (docs/rules/places-businesses.md).
- Icons: genuine Icons8 sourced via MCP only, Apple SF Symbols Regular style (docs/rules/icons-images.md).

## Work

- Commands: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`
- Tests: `npm run test` (tsx runner, `lib/*.test.ts`); full local gate: `~/.claude/bin/local-ci` → `./scripts/local-ci.sh` (Python booking-guard tests + unit tests + production build)
- Site checks after major changes (broken links, missing images/alt, translation completeness, hreflang/canonical, sitemap): docs/rules/testing.md
- Commits: Conventional Commits (`feat:`, `fix:`, `build:`, `docs:`), one coherent verified slice per commit.
- Decisions log: append to `docs/decisions.md`; contradicting a logged Ivan decision needs his Yes.

Before non-trivial work: check `docs/solutions/INDEX.md`; capture lessons with /compound.

## Rules index (docs/rules/)

- `docs/rules/architecture.md` — routing, translation system, theme system, key files, build config.
- `docs/rules/seo.md` — landing pages, per-language keywords, invisible internal links, footer links, sitemap, Cariló guides.
- `docs/rules/content.md` — fact checking, flags, suites page order, Airbnb/marketing copy, channel texts + copy-to-clipboard.
- `docs/rules/icons-images.md` — Icons8 policy, icon metaphors, ImageKit endpoint, business photo sourcing.
- `docs/rules/booking-guests.md` — booking links, payment options per language, guest page.
- `docs/rules/places-businesses.md` — Google Maps API data, golden-standard business card design.
- `docs/rules/testing.md` — automatic site tests.
