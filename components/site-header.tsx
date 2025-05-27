import Link from "next/link"
import Image from "next/image"
import { MobileMenu } from "./mobile-menu"
import { LanguageSelector } from "./language-selector"
import { Translate } from "./translate"
import { translations } from "@/translations/common"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          IL BUCO
        </Link>
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/the-house" className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.theHouse} />
            </Link>
            <Link href="/rooms" className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.rooms} />
            </Link>
            <Link href="/location" className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.location} />
            </Link>
            <Link href="/places-nearby" className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.placesNearby} />
            </Link>
          </nav>
          <div className="flex items-center space-x-4 ml-4">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Translate text={translations.nav.book} />
            </Link>
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
