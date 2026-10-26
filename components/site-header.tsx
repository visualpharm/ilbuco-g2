"use client"

import { useState } from "react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"
import { LanguageSelector } from "./language-selector"
import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { BookingPopup } from "./booking-popup"
import { useNavItems } from "./use-nav-items"

export function SiteHeader() {
  const { home, atHome, items } = useNavItems()
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href={home} aria-current={atHome ? "page" : undefined} className="text-2xl font-bold tracking-tight">
          IL BUCO
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={`inline-flex h-11 items-center rounded-md px-3 text-base transition-colors hover:text-blue-700 ${
                  item.current ? "font-semibold text-gray-900" : "font-medium text-gray-800"
                }`}
              >
                <Translate text={item.label} />
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setIsBookingPopupOpen(true)}
            className="ml-2 hidden h-11 items-center whitespace-nowrap rounded-md bg-black px-4 text-base font-medium text-white transition-colors hover:bg-gray-800 sm:inline-flex"
          >
            <Translate text={translations.nav.book} />
          </button>
          <LanguageSelector />
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
      <BookingPopup isOpen={isBookingPopupOpen} onClose={() => setIsBookingPopupOpen(false)} />
    </header>
  )
}
