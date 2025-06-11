"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Languages configuration
const languages = [
  { code: "es", path: "", name: "Español", flag: "🇦🇷" },
  { code: "en", path: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", path: "pt", name: "Português", flag: "🇧🇷" },
]

/**
 * Checks if the current path is a SEO landing page (not translated between languages)
 */
function isSeoLandingPage(path: string): boolean {
  // Spanish SEO pages (at root level)
  const spanishSeoPages = [
    '/alquiler-carilo',
    '/carilo-alquiler', 
    '/apart-hotel-en-carilo',
    '/carilo-alojamiento',
    '/casas-en-carilo-alquiler',
    '/casas-en-carilo-frente-al-mar',
    '/casas-en-alquiler-en-carilo-frente-al-mar',
    '/que-hacer-en-carilo',
    '/que-hacer-en-carilo-cuando-llueve'
  ]
  
  // English SEO pages (under /en/)
  const englishSeoPages = [
    '/en/digital-nomad-argentina',
    '/en/argentina-remote-work-visa',
    '/en/coliving-south-america',
    '/en/slow-travel-argentina',
    '/en/coliving-argentina',
    '/en/eco-lodge-argentina',
    '/en/digital-nomad-retreats'
  ]
  
  // Portuguese SEO pages (under /pt/)
  const portugueseSeoPages = [
    '/pt/coliving',
    '/pt/argentina-praia',
    '/pt/argentina-mar',
    '/pt/carilo-argentina-o-que-fazer',
    '/pt/coliving-argentina',
    '/pt/trabalho-remoto-argentina'
  ]
  
  return spanishSeoPages.includes(path) || 
         englishSeoPages.includes(path) || 
         portugueseSeoPages.includes(path)
}

/**
 * Maps a path from one language to another
 * e.g. /en/the-house -> /pt/the-house or / -> /en/ or /pt/rooms -> /en/rooms
 * For SEO landing pages, redirects to frontpage of target language
 */
function getEquivalentPath(currentPath: string, targetLang: string): string {
  // Check if we're on a SEO landing page - if so, redirect to frontpage
  if (isSeoLandingPage(currentPath)) {
    return targetLang === "es" ? "/" : `/${targetLang}/`
  }
  
  // Default paths for the root
  if (currentPath === "/") {
    return targetLang === "es" ? "/" : `/${targetLang}/`
  }

  // Check if path already has a language prefix
  const enMatch = currentPath.match(/^\/en\/?(.*)/)
  const ptMatch = currentPath.match(/^\/pt\/?(.*)/)

  if (enMatch) {
    // Current path has /en/ prefix
    const pathWithoutLang = enMatch[1]
    return targetLang === "es" 
      ? `/${pathWithoutLang}` 
      : `/${targetLang}/${pathWithoutLang}`
  } else if (ptMatch) {
    // Current path has /pt/ prefix
    const pathWithoutLang = ptMatch[1]
    return targetLang === "es" 
      ? `/${pathWithoutLang}` 
      : `/${targetLang}/${pathWithoutLang}`
  } else {
    // Current path has no language prefix (Spanish at root)
    return targetLang === "es" 
      ? currentPath 
      : `/${targetLang}${currentPath}`
  }
}

export function LanguageSelectorUrl() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Determine current language based on URL path
  let currentLanguage = languages[0] // Default to Spanish
  if (pathname.startsWith("/en/") || pathname === "/en") {
    currentLanguage = languages[1] // English
  } else if (pathname.startsWith("/pt/") || pathname === "/pt") {
    currentLanguage = languages[2] // Portuguese
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-start h-10 px-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        aria-label="Change language"
      >
        <span className="text-xl mr-2">{currentLanguage.flag}</span>
        <span className="sr-only md:not-sr-only">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-50 whitespace-nowrap transform transition-all duration-200 ease-out"
             data-open={isOpen}>
          {languages.map((lang) => {
            const targetPath = getEquivalentPath(pathname, lang.code)
            return (
              <Link
                key={lang.code}
                href={targetPath}
                className={`px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 w-full ${
                  currentLanguage.code === lang.code ? "bg-blue-50 text-blue-600" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
