import Link from "next/link"
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
          <nav className="hidden md:flex space-x-8 mr-4">
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
            <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
              <Translate text={translations.nav.contact} />
            </Link>
          </nav>
          <LanguageSelector />
          <div className="md:hidden ml-4">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
