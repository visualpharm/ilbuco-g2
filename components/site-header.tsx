"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MobileMenu } from "./mobile-menu"
import { LanguageSelector } from "./language-selector"
import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { useLanguage } from "@/contexts/language-context"

export function SiteHeader() {
  const { language } = useLanguage()
  const pathname = usePathname()
  
  // Determine language prefix based on current language code
  const langPrefix = language.code === "es" ? "" : `/${language.code}`

  // Determine if we're in a language-specific path
  const isEnglish = pathname.startsWith("/en")
  const isPortuguese = pathname.startsWith("/pt")

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href={langPrefix || "/"} className="text-2xl font-bold tracking-tight">
          IL BUCO
        </Link>
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href={`${langPrefix}/the-house`} className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.theHouse} />
            </Link>
            <Link href={`${langPrefix}/rooms`} className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.rooms} />
            </Link>
            <Link href={`${langPrefix}/location`} className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.location} />
            </Link>
            <Link href={`${langPrefix}/places-nearby`} className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.placesNearby} />
            </Link>
            <Link href={`${langPrefix}/contacts`} className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.contact} />
            </Link>
          </nav>
          <div className="flex items-center space-x-4 ml-4">
            <a
              href="https://book.ilbuco.com.ar/"
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Translate text={translations.nav.book} />
            </a>
            <LanguageSelector />
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
