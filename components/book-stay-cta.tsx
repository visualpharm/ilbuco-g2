"use client"

import { useState } from "react"
import { Translate } from "./translate"
import { BookingPopup } from "./booking-popup"
import { HeroAvailability } from "./hero-availability"
import { translations } from "@/translations/common"

/** The site's one booking call to action: the button that opens the booking options, with today's availability beside it. */
export function BookStayCta({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
      >
        <Translate text={translations.home.hero.cta} />
      </button>
      <HeroAvailability />
      <BookingPopup isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}
