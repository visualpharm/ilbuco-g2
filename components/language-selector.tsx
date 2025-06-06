"use client"

import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

/**
 * Maps a path from one language to another
 * e.g. /en/the-house -> /pt/the-house or / -> /en/ or /pt/rooms -> /en/rooms
 */
function getEquivalentPath(currentPath: string, targetLang: string): string {
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

export function LanguageSelector() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const languages = [
    { code: "es", name: "Español", flag: "🇦🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
  ]

  // Use the actual language code from context, not just the first match
  const currentLanguage = languages.find((lang) => lang.code === language.code) || languages[0] // Default to Spanish

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
            // Get the equivalent path for the target language
            const targetPath = getEquivalentPath(pathname, lang.code)
            
            return (
              <Link
                key={lang.code}
                href={targetPath}
                className={`px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 w-full ${
                  language.code === lang.code ? "bg-blue-50 text-blue-600" : ""
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
