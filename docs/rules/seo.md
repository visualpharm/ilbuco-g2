# SEO rules

Moved verbatim from CLAUDE.md: SEO landing pages, keyword strategy per language, invisible internal links, footer links, sitemap, Cariló activities reorganization.

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

## Places Nearby SEO Reorganization Plan

### Overview
Transform `/places-nearby/activities` into `/que-hacer-en-carilo` for Spanish SEO optimization.

### URL Structure
- **Spanish**: `/que-hacer-en-carilo`
- **English**: `/en/things-to-do-carilo` 
- **Portuguese**: `/pt/o-que-fazer-em-carilo`

### SEO Keywords (Spanish Focus)
- qué hacer en cariló (primary)
- carilo que hacer
- actividades en carilo  
- carilo turismo / cariló turismo
- que hacer en cariló cuando llueve
- que hacer en cariló en invierno
- cosas para hacer en carilo
- pinamar lugares para visitar

### Content Structure (Reference: cadaviajeunmundo.com)
```
H1: Qué Hacer en Cariló: Guía Completa de Actividades y Turismo [YEAR]
├── H2: Mejores Actividades en Cariló
│   ├── H3: Deportes y Actividades al Aire Libre
│   ├── H3: Qué Hacer en Cariló Cuando Llueve (indoor activities)
│   └── H3: Actividades en Cariló en Invierno (seasonal content)
├── H2: Playas y Naturaleza en Cariló
├── H2: Carilo Turismo: Gastronomía y Vida Nocturna
├── H2: Compras y Servicios en Cariló
└── H2: Pinamar Lugares para Visitar (nearby attractions)
```

### Activity Clustering by Intent & Type
- **Sports & Fitness**: Gym, tennis, calisthenics, windsurfing/surf
- **Nature & Beach**: Cycling, photography, beach activities  
- **Adventure**: Horse riding, quad bikes, 4x4 driving
- **Creative**: Ceramics, art activities
- **Food & Dining**: Restaurants by type (parrilla, pizza, burgers)
- **Shopping**: By category (supermarkets, boutiques, hardware)
- **City Center**: Activities within walking distance of center
- **Valeria del Mar**: Nearby town attractions
- **Pinamar**: Day trip destinations

### Distance Measurement
- **Use Google Maps API** to measure accurate distances from Il Buco (Paraiso 324, Cariló)
- **API Environment**: `GOOGLE_MAPS_API_KEY` stored in `.env.local`
- **Example**: CIE gym = 1.7 km (24 min walk) from Il Buco
- **Include Google Maps links** for all activity locations

### Writing Style
- **Maintain existing direct, factual tone** (no promotional language)
- **Borrow structure only** from reference site, not writing style
- **Add Il Buco context** naturally throughout content
- **Include seasonal and weather considerations**

### Que hacer intro
Translate it to the language of the website, of course:
I have compiled the list of the businesses I usually use and programmed, and added the links to Google Maps. There is a link to the profile, the rating, and the number of reviews. So, something you would probably do anyway before going there. For all places, or the distance from Il Buco. So, for those of you who don't stay in our beautiful residence, think about the closest beach exit to Pinamar, closest beach exit of Karelo, beach exit in Karelo closest to Pinamar. Someday I may program recalculation of distances based on your current location. 

### Dynamic Year Implementation
```
// TODO: Implement dynamic year in titles and metadata
// Logic: December 1st+ shows next year (Dec 1, 2025 → "2026")
// Title: "Qué Hacer en Cariló: Guía Completa ${currentYear}"
```

## Further work on actividades carilo
https://www.carilo.com/actividades-en-carilo - check these places with google maps:
1. If they still exist
2. Add a link to Google Maps 
3. Their rating
4. Distance from Il Buco
5. A description based on the reviews that Google Maps permits to read
