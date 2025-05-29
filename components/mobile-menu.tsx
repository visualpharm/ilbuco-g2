"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { Translate } from "./translate"
import { translations } from "@/translations/common"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

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
              <Link href="/" className="text-2xl font-bold tracking-tight" onClick={() => setIsOpen(false)}>
                IL BUCO
              </Link>
              <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/the-house"
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.theHouse} />
              </Link>
              <Link
                href="/rooms"
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.rooms} />
              </Link>
              <Link
                href="/location"
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.location} />
              </Link>
              <Link
                href="/places-nearby"
                className="block text-lg font-medium hover:text-blue-600 transition-colors py-3"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.placesNearby} />
              </Link>
              <Link
                href="/book"
                className="block text-center px-4 py-3 bg-black text-white text-lg font-medium rounded-md hover:bg-gray-800 transition-colors mt-4"
                onClick={() => setIsOpen(false)}
              >
                <Translate text={translations.nav.book} />
              </Link>
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
