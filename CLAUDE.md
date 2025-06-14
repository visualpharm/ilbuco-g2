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

**IMPORTANT**: All icons must be sourced through Icons8 MCP (Model Context Protocol). No icons should be used without going through the Icons8 MCP system. This ensures consistency and proper licensing. 

We use icons in the SVG format wherever possible, stored in `/public/icons/icons8/`. Be VERY careful to don't:
☠️ Draw your own icons
☠️ Use Lucida and think they are Icons8 (Icons8 is better made and much more diverse)
☠️ Store third party icons from points 1-2 in the icons8 folder and think it's Icons8.

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



## Airbnb & Marketing Copy Guidelines

### What NOT to Write
**Avoid these common mistakes in property descriptions:**

1. **Self-referential branding** - Guests don't know what "Il Buco" is yet when reading the listing
2. **Marketing jargon** - "signature suite" sounds like promotional copy rather than useful description  
3. **Lacks immediate value** - Doesn't tell guests what they actually get
4. **Generic language** - Could apply to any property's "best" room
5. **Airbnb algorithm unfriendly** - Doesn't include searchable keywords guests use

**Examples of bad openings:**
- ❌ "Il Buco's signature suite..."
- ❌ "Experience our most unique accommodation..."
- ❌ "Discover luxury at its finest..."
- ❌ "Welcome to our premium offering..."

### What TO Write
**Follow these principles for compelling descriptions:**

- **Lead with tangible benefits** guests can visualize
- **Use searchable keywords** (private terrace, garden, forest, beach)
- **Focus on unique features** rather than marketing claims
- **Make it immediately compelling** without brand context
- **Write from guest perspective** - what will they see, feel, do?

**Examples of good openings:**
- ✅ "Wake up surrounded by live plants on your own private garden terrace..."
- ✅ "Your suite opens directly onto a private terrace filled with thriving plants..."
- ✅ "Live at the top of a forest villa with panoramic pine tree views..."
- ✅ "Corner suite with floor-to-ceiling windows on two sides..."

### Structure for Property Descriptions
1. **Compelling hook** (what makes this special)
2. **Unique features** (terrace, views, layout)
3. **Complete amenities** (kitchen, bathroom, tech)
4. **Location benefits** (beach, forest, restaurants) 
5. **Target guest types** (couples, remote workers, etc.)

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
8. After making a major change (e.g., adding a new page), download this page and the front page. If they return an error, restart the server and try again. If it still fails, start fixing it without waiting for me to respond. 

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

## Texts for channels


> you have a pretty nice context now. prepare the airbnb 
  descriptions for each of the rooms in some file that would be 
  easier to copy to airbnb or channel management software. talk 
  about the marvels of the house, then about the room (but don't
   make it two parts, write it as if it was a separate house 
  with the suite inside, common spaces, and nothing more). if 
  needed, educate yourself about the length of airbnb desc and 
  what is working.

Start summaries with what the customer wants, jobs to be done style. Don't load her with our internal naming: il buco, terrazzo. Talk like about what she would search for on Airbnb, like "spacious 1-bedroom suite in the forest near the beach". "Green roof terrace with BBQ", large private terrace with live plants growing there, not just pots. The best place to concentrate on work, or relax with a book, or have a glass of wine in the evening.

### Copying text in channels
i want the copy functionality. clicking on any title copies the text to the clipboard. Here's what to copy in this example:

## 🌿 Private Garden Terrace 5 Min from Beach

Wake up surrounded by live plants on your own private garden terrace in Cariló's pine forest. Full kitchen, luxury bedding, in-room washer, underfloor heating, fast WiFi, and Smart TV. Walk 5 minutes to pristine Atlantic beaches. Shared rooftop BBQ available. Perfect for couples, remote workers, or nature lovers seeking forest tranquility.

### Full Description

Your suite opens directly onto a private terrace filled with thriving plants – like having your own secret garden in the forest. Located in Cariló's pine woods, you're 5 minutes from Argentina's most beautiful beaches.

#### 🌿 Your Private Garden Terrace
Step outside to your own planted terrace with floor-to-ceiling windows connecting indoor and outdoor spaces. Enjoy morning coffee, work sessions, or evening relaxation surrounded by greenery and forest sounds.

1. Clicking "## 🌿 Private Garden Terrace 5 Min from Beach" copies this title, without hashes.
2. Clicking "### Full Description" copies the whole description text, without the title "Full Description".
3. Clicking "#### 🌿 Your Private Garden Terrace" or anywhere in this paragraph copies the text under this heading, *with* the heading.
4. Clicking paragraph text:
   - **Inside "Full Description" section**: Copy the entire Full Description content
   - **Outside "Full Description" section**: Copy only that paragraph's text
5. When unsure what to copy, think what users would need to fill. Usually they fill the title, summary, full description, location description, things to do. If they fill most of these things, they don't need the title; exception is the full description where we have multiple headings.
6. 🌿 Private Garden Terrace 5 Min from Beach must copy itself when clicked. 

Important behavior of the app: on hover, let's highlight the text that will be copied.

## Booking policy
Book now button leads to https://book.ilbuco.com.ar/

Every room on /rooms leads to its own booking page:

- **Penthouse**: https://book.ilbuco.com.ar/listing/110803
- **Paraiso**: https://book.ilbuco.com.ar/listing/110802
- **Terrazzo** (Italian; not terrazzo or something else feminine): https://book.ilbuco.com.ar/listing/110801
- **Giardino**: https://book.ilbuco.com.ar/listing/110800

Add booking button next to each room on /rooms page.

Airbnb bookings links are:
paraiso https://www.airbnb.com/rooms/1432871950272757223?source_impression_id=p3_1749914100_P3tMGIELo0p9Q-SO
giardino https://www.airbnb.com/rooms/1393460027877444232?source_impression_id=p3_1749914061_P3lDo2XWX43_1NS0
terrazzo https://www.airbnb.com/rooms/1422046866284999348?source_impression_id=p3_1749914061_P38mVIuZYIb4ompa
(penthous is on a long term rental, so no airbnb link)

## Payment options
For spanish version, direct booking button should have the payement options: CBU, Mercado Pago, tarjetas internacionales Visa, Mastercard, Amex, etc., PayPal, USDT.

For english and portuguese versions, direct booking button should have the payment options: Visa, Mastercard, Amex etc, PayPal, USDT.