"use client"

import { usePathname } from "next/navigation"
import Head from "next/head"

/**
 * Maps a path from one language to another
 * e.g. /en/the-house -> /pt/the-house or / -> /en/ or /pt/rooms -> /en/rooms
 */
function getEquivalentPath(currentPath: string, targetLang: string): string {
  // Get domain
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://ilbuco.com.ar"
  
  // Default paths for the root
  if (currentPath === "/") {
    return targetLang === "es" ? domain : `${domain}/${targetLang}/`
  }

  // Check if path already has a language prefix
  const enMatch = currentPath.match(/^\/en\/?(.*)/)
  const ptMatch = currentPath.match(/^\/pt\/?(.*)/)

  if (enMatch) {
    // Current path has /en/ prefix
    const pathWithoutLang = enMatch[1]
    return targetLang === "es" 
      ? `${domain}/${pathWithoutLang}` 
      : `${domain}/${targetLang}/${pathWithoutLang}`
  } else if (ptMatch) {
    // Current path has /pt/ prefix
    const pathWithoutLang = ptMatch[1]
    return targetLang === "es" 
      ? `${domain}/${pathWithoutLang}` 
      : `${domain}/${targetLang}/${pathWithoutLang}`
  } else {
    // Current path has no language prefix (Spanish at root)
    return targetLang === "es" 
      ? `${domain}${currentPath}` 
      : `${domain}/${targetLang}${currentPath}`
  }
}

export function HreflangTags() {
  const pathname = usePathname()

  return (
    <Head>
      {/* Canonical URL - always points to the current language version */}
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN || "https://ilbuco.com.ar"}${pathname}`} />
      
      {/* hreflang tags for each language */}
      <link rel="alternate" hrefLang="es-AR" href={getEquivalentPath(pathname, "es")} />
      <link rel="alternate" hrefLang="en" href={getEquivalentPath(pathname, "en")} />
      <link rel="alternate" hrefLang="pt-BR" href={getEquivalentPath(pathname, "pt")} />
      
      {/* x-default hreflang - points to Spanish version */}
      <link rel="alternate" hrefLang="x-default" href={getEquivalentPath(pathname, "es")} />
    </Head>
  )
}
