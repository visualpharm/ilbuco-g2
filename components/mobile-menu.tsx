"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { useLanguage } from "@/contexts/language-context"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const pathname = usePathname()
  
  // Determine language prefix based on current language code
  const langPrefix = language.code === "es" ? "" : `/${language.code}`

  return (
    <div>
      <button onClick={() => setIsOpen(true)} aria-label="Open menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link href={langPrefix || "/"} className="text-2xl font-bold tracking-tight" onClick={() => setIsOpen(false)}>
                IL BUCO
              </Link>
              <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              <Link
                href={`${langPrefix}/the-house`}
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.theHouse} />
              </Link>
              <Link
                href={`${langPrefix}/rooms`}
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.rooms} />
              </Link>
              <Link
                href={`${langPrefix}/location`}
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.location} />
              </Link>
              <Link
                href={`${langPrefix}/places-nearby`}
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.placesNearby} />
              </Link>
              <Link
                href={`${langPrefix}/contacts`}
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.contact} />
              </Link>
              <a
                href="https://book.ilbuco.com.ar/"
                className="block text-center px-4 py-3 bg-black text-white text-lg font-medium rounded-md hover:bg-gray-800 transition-colors mt-4"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.book} />
              </a>
              <div className="py-3">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
