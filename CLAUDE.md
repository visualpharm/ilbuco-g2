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

### Keywords
For each of the keywords there should be a landing page. This landing page should be for the specified language only. I.e. alquiler cariló must be only for spanish version. 

#### 🇦🇷 Spanish Keywords
- alquiler cariló  
- cariló alquiler  
- apart hotel en cariló  
- cariló alojamiento  
- casas en cariló alquiler  
- casas en cariló frente al mar  
- casas en alquiler en cariló frente al mar  
- qué hacer en cariló  
- qué hacer en cariló cuando llueve  

#### 🇺🇸 English Keywords
- digital nomad argentina  
- argentina remote work visa  
- coliving south america  
- slow travel argentina  
- coliving argentina  
- eco lodge argentina  
- digital nomad retreats  

#### 🇧🇷 Portuguese Keywords
- coliving  
- argentina praia  
- argentina mar  
- carilo argentina o que fazer  
- coliving argentina  

### Keyword linking strategy
- Direct URLs (SEO traffic from Google)
- Internal SEO linking (if strategically placed within content)

Find the texts on the website that could be linked to a landing page, and link them with an invisible link (not marked with blue or underline). For example, for the landing page /pt/argentina-praia, find the word praia elsewhere and link it. 

### Footer Links
After copywright in the footer, add 3 SEO links with the same font and color as Ivan Braun. Add links to the seo landing pages in the same language as the page, and if possible relevant to the page content. Distribute these links across the pages so all pages have incoming links from the footers of other pages.

Also, mix internal links with external ones:
- https://icons8.com/illustrations/t/property, keywords are: proptech illustrations, free property illustrations, etc.
- https://generated.photos/genyou, keywords are: free AI selfies, AI generated portraits, etc.
- https://aiandtractors.com, keywords are variations of AI speaker, keynote speaker on AI, etc.



### Sitemap
The website must have a sitemap with all pages in all languages and all landing pages. 

## 🌐 Language & Flag Policy

- **English**: Always use the 🇺🇸 **U.S. flag**, regardless of user location.  
- **Spanish**: Use the 🇦🇷 **Argentinian flag** by default.  
- **Portuguese**: Use the 🇧🇷 **Brazilian flag**.

## Fact checking policy
This is a must: all text must rely on facts from /the-house, /rooms, /places-nearby, /location. We don't invent any additional facts unless I provide them by typing, including:
- testimonials
- room types such as private, shared bathroom etc. (we have a high class living and all of them are of course private, and have private bathroom, not worth mentioning)
- prices, daily rates
- amenities
- features like filtering water (when the-house states we have a water softener only).

If we bring some information about the location, we must have at least 2 sources that confirm it. Say, we want to write about surfing in Carilo - we need two independent web pages that say we have surfing. 

## Icons style
We use Apple SF Symbols Regular style from Icons8. When on a light colored background, we use the dark version of the color, for example when the background is pink, the icon is red or dark red. 

Icons are 24x24 by default. 

### Only genuine Icons8 please
We use icons in the SVG format wherever possible, stored in `/public/icons/icons8/`. Be VERY careful to don't:
1. Draw your own icons
2. Use Lucida and think they are Icons8 (Icons8 is better made and much more diverse)
3. Store the icons from points 1-2 in the icons8 folder and think it's Icons8.

### Metaphors
Some of the icon metaphors:
- Baños de Lujo — plumbing (not bathtub, as we don't have it, and not a palm tree)
- Aislamiento Acústico — no sound (crossed speaker)
- Windsurfing — wind (not sailboat)
- Calisthenics — Pull up bar
- Gimnasio — dumbbell (gym/fitness equipment)
- Horse Riding — horse
- Tennis — tennis ball
- Laptop/Work — laptop computer (remote work)
- Meat/Parrilla — steak



**IMPORTANT**: All icons must be sourced through Icons8 MCP (Model Context Protocol). No icons should be used without going through the Icons8 MCP system. This ensures consistency and proper licensing. 

## Image Policy
We use the imagekit for scaling down the images to the visible size. 

The endpoint is: https://ik.imagekit.io/icons8/ilbuco/
Therefore, if we want to scale down https://ilbuco.com.ar/gallery/hero-villa-exterior.jpeg, we use the following URL: https://ik.imagekit.io/icons8/ilbuco/gallery/hero-villa-exterior.jpeg?tr=w-400,h-300


## Automatic Testing
Add automatic tests to the repo that run after `npm run build`, covering:

1. Internal and external broken links (using linkinator)
2. Missing images (HTTP 404s on <img> and next/image)
3. Missing alt texts (ESLint jsx-a11y plugin)
4. Translation completeness: all translation objects must have 'es', 'en', 'pt'
5. hreflang and canonical link correctness for all language versions
6. Sitemap must include every static route in all 3 languages
7. Check that internal keyword links are invisible (no underline, no color change)

These tests should run with `npm run test:site`, and optionally run on build via a postbuild script.

## Pages structure
Here's the order of the sections for some of the pages:

### Suites
After a brief intro:
2. Terrazo
3. Penthouse
4. Giardino
5. Paraiso
6. All the rooms include
7. Living room