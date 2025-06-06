# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` – Start development server  
- `npm run build` – Build for production  
- `npm run start` – Start production server  
- `npm run lint` – Run ESLint (note: configured to ignore during builds)

## Architecture Overview

### Multilingual Next.js App with Theme System

This is a **Next.js 15** multilingual website for "Il Buco" coliving space in Argentina, supporting Spanish (default), English, and Portuguese.

#### Routing Structure

- **Root level** (`/app/`) – Spanish (default language)  
- **English** (`/app/en/`) – English pages  
- **Portuguese** (`/app/pt/`) – Portuguese pages  
- Each language has identical page structure: home, book, rooms, location, places-nearby, the-house

#### Translation System

**Custom translation architecture** (not using next-intl):
- **Translation files**: `/translations/*.ts` – organized by feature (common, rooms, location, etc.)
- **Translation format**: Nested objects with language keys (`en`, `es`, `pt`)
- **Special theme-aware translations**: Some content has `default` and `techBillionaire` variants for different themes
- **Translation component**: `<Translate text={translationObject} themeAware={boolean} />`
- **Language detection**: Custom hook `/hooks/use-language-detection.ts` with geolocation-based detection
- **Language context**: `/contexts/language-context.tsx` provides global language state

#### Theme System

- **Two themes**: `default` and `techBillionaire` (dramatically different content/tone)
- **Theme context**: `/context/ThemeContext.tsx`
- **Theme-aware content**: Some translations change completely based on theme (e.g., "luxury house" vs "autonomous shelter")
- **Uses next-themes** for dark/light mode support

#### Component Architecture

- **UI Components**: Shadcn/ui in `/components/ui/`
- **Custom Components**: Feature-specific components in `/components/`
- **Image galleries**: Custom lightbox and carousel implementations
- **Responsive design**: Mobile-first with custom mobile menu

#### Key Files for Understanding

- `/translations/common.ts` – Main translation structure and theme variants
- `/components/translate.tsx` – Translation component with theme awareness
- `/contexts/language-context.tsx` – Language state management
- `/context/ThemeContext.tsx` – Theme state management
- `/components/client-layout.tsx` – Client-side layout wrapper

#### SEO & Internationalization

- **Manual hreflang implementation** in layout files
- **Language-specific canonical URLs**
- **Different metadata per language route**

## Development Notes

- **Build configuration**: ESLint and TypeScript errors ignored during builds (`next.config.mjs`)
- **Image optimization disabled** for unoptimized images
- **Styling**: Tailwind CSS with custom design system
- **Package management**: Uses both npm and pnpm (lockfiles present for both)

---

## SEO Strategy and Content Notes

This project includes additional landing pages created solely for SEO purposes.

**Key principles:**
- SEO pages do **not** appear in the user-facing site navigation.
- SEO pages must **not** interfere with the structure or appearance of the main site.
- SEO landing pages are **independently written** for each language. They are **not translations** of one another.
- Regular user-facing pages **are** translated and synchronized across languages.

### SEO Landing Pages (English versions)
/coliving-argentina
/remote-work-retreat
/argentina-remote-work-visa
/boutique-hotel-argentina
/ecolodge-argentina
/nature-retreat-argentina
/digital-nomad-argentina

## SEO Keywords Strategy

Content in Spanish, English, and Portuguese is **not direct translations**. Each language version targets its own SEO keywords based on local search behavior and intent.

The structure of each CO page is adapted to reflect the most relevant terms per audience, maximizing organic reach in each language.

### 🌐 Language & Flag Policy

- **English**: Always use the 🇺🇸 **U.S. flag**, regardless of user location.  
- **Spanish**: Use the 🇦🇷 **Argentinian flag** by default.  
- **Portuguese**: Use the 🇧🇷 **Brazilian flag**.

### 🇦🇷 Spanish Keywords
- alquiler cariló  
- cariló alquiler  
- apart hotel en cariló  
- cariló alojamiento  
- casas en cariló alquiler  
- casas en cariló frente al mar  
- casas en alquiler en cariló frente al mar  
- qué hacer en cariló  
- qué hacer en cariló cuando llueve  

### 🇺🇸 English Keywords
- digital nomad argentina  
- argentina remote work visa  
- coliving south america  
- slow travel argentina  
- coliving argentina  
- eco lodge argentina  
- digital nomad retreats  

### 🇧🇷 Portuguese Keywords
- coliving  
- argentina praia  
- argentina mar  
- carilo argentina o que fazer  
- coliving argentina  