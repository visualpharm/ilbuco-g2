"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Translate } from "./translate"
import { BookingOptions } from "./booking-options"

interface BookingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingPopup({ isOpen, onClose }: BookingPopupProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const back = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      back?.focus?.({ preventScroll: true })
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-popup-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white p-6 sm:mx-4 sm:rounded-xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="booking-popup-title" className="text-2xl font-bold">
            <Translate text={{ en: "Book your stay", es: "Reservá tu estadía", pt: "Reserve sua estadia", ru: "Забронировать" }} />
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Image src="/icons/icons8/close.png" alt="" width={24} height={24} />
          </button>
        </div>
        <BookingOptions onNavigate={onClose} />
      </div>
    </div>
  )
}
