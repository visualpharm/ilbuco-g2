// Which pages the sitemap lists, derived from the real app/ routes so a removed page never lingers as a 404.

const PRIVATE = /^\/(admin|dashboard|nimda|vanish|voice|reservar)(\/|$)|^\/([a-z]{2}\/)?guest(\/|$)/

/** Translated pages: same content in every language (docs/rules/seo.md). */
export const TRANSLATED: Record<string, Record<string, string>> = {
  home: { es: "/", en: "/en", pt: "/pt", ru: "/ru" },
  house: { es: "/the-house", en: "/en/the-house", pt: "/pt/the-house", ru: "/ru/the-house" },
  rooms: { es: "/rooms", en: "/en/rooms", pt: "/pt/rooms", ru: "/ru/rooms" },
  location: { es: "/location", en: "/en/location", pt: "/pt/location", ru: "/ru/location" },
  places: { es: "/que-hacer-en-carilo", en: "/en/places-nearby", pt: "/pt/places-nearby", ru: "/ru/places-nearby" },
  contacts: { es: "/contacts", en: "/en/contacts", pt: "/pt/contacts", ru: "/ru/contacts" },
}

/** Turns app/ page file paths ("app/en/rooms/page.tsx") into public URL paths, dropping private and dynamic routes. */
export function publicRoutes(pageFiles: string[]): string[] {
  return pageFiles
    .map((f) => f.replace(/\\/g, "/").replace(/^app/, "").replace(/\/page\.(tsx|ts|jsx|js)$/, "") || "/")
    .filter((p) => !p.includes("[") && !PRIVATE.test(p))
    .sort()
}

/** hreflang alternates for a path that has translations, keyed by language. */
export function alternatesFor(path: string): Record<string, string> | undefined {
  return Object.values(TRANSLATED).find((group) => Object.values(group).includes(path))
}
