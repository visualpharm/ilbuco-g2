"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { BookingPopup } from "./booking-popup"
import { useNavItems } from "./use-nav-items"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false)
  const { home, items } = useNavItems()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false)
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Menú"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100"
      >
        <Image src="/icons/icons8/menu.png" alt="" width={24} height={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white" role="dialog" aria-modal="true">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <Link href={home} className="text-2xl font-bold tracking-tight" onClick={() => setIsOpen(false)}>
                IL BUCO
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <Image src="/icons/icons8/close.png" alt="" width={24} height={24} />
              </button>
            </div>
            <nav className="flex flex-col overflow-y-auto px-4 py-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`block py-3 text-lg ${item.current ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Translate text={item.label} />
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsBookingPopupOpen(true)
                }}
                className="mt-4 self-start rounded-md bg-black px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Translate text={translations.nav.book} />
              </button>
            </nav>
          </div>
        </div>
      )}
      <BookingPopup isOpen={isBookingPopupOpen} onClose={() => setIsBookingPopupOpen(false)} />
    </div>
  )
}
