"use client"

import Link from "next/link"
import { Translate } from "./translate"
import { useLanguage } from "@/contexts/language-context"

// Booking destinations and payment options are Ivan's (docs/rules/booking-guests.md).
const airbnbRooms = [
  { name: "Paraiso", href: "https://www.airbnb.com/rooms/1432871950272757223?source_impression_id=p3_1749914100_P3tMGIELo0p9Q-SO" },
  { name: "Giardino", href: "https://www.airbnb.com/rooms/1393460027877444232?source_impression_id=p3_1749914061_P3lDo2XWX43_1NS0" },
  { name: "Terrazzo", href: "https://www.airbnb.com/rooms/1422046866284999348?source_impression_id=p3_1749914061_P38mVIuZYIb4ompa" },
]

export function paymentOptions(languageCode: string) {
  return languageCode === "es"
    ? "CBU, Mercado Pago, tarjetas internacionales Visa, Mastercard, Amex, etc., PayPal, USDT"
    : "Visa, Mastercard, Amex etc, PayPal, USDT"
}

/** Direct booking first, then the Airbnb listings: used by the booking popup and /contacts. */
export function BookingOptions({ onNavigate }: { onNavigate?: () => void }) {
  const { language } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-300 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              <Translate text={{ en: "Direct booking", es: "Reserva directa", pt: "Reserva direta", ru: "Прямое бронирование" }} />
            </h3>
            <p className="text-base text-gray-700">
              <Translate text={{ en: "Best price guarantee", es: "Garantía de mejor precio", pt: "Garantia de melhor preço", ru: "Гарантия лучшей цены" }} />
            </p>
          </div>
          <Link
            href="/reservar"
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Translate text={{ en: "Book directly", es: "Reservar directamente", pt: "Reservar diretamente", ru: "Забронировать" }} />
          </Link>
        </div>
        <p className="mt-3 text-base text-gray-700">{paymentOptions(language.code)}</p>
      </div>

      <div className="rounded-lg border border-gray-300 p-5">
        <h3 className="text-xl font-semibold text-gray-900">Airbnb</h3>
        <p className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-base">
          {airbnbRooms.map((room) => (
            <a
              key={room.name}
              href={room.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-blue-700 hover:text-blue-900"
            >
              {room.name}
            </a>
          ))}
        </p>
      </div>
    </div>
  )
}
