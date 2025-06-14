"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Translate } from "./translate"
import { useLanguage } from "@/contexts/language-context"

interface BookingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingPopup({ isOpen, onClose }: BookingPopupProps) {
  const { language } = useLanguage()
  
  if (!isOpen) return null

  // Payment options based on language
  const getPaymentOptions = () => {
    if (language.code === "es") {
      return "CBU, Mercado Pago, tarjetas internacionales Visa, Mastercard, Amex, etc., PayPal, USDT"
    } else {
      return "Visa, Mastercard, Amex etc, PayPal, USDT"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            <Translate
              text={{
                en: "Book Your Stay",
                es: "Reservá tu Estadía",
                pt: "Reserve sua Estadia",
              }}
            />
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Direct Booking */}
          <div className="p-6 border-2 border-black rounded-lg bg-gray-50">
            <div className="sm:flex sm:items-start sm:justify-between sm:mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  <Translate
                    text={{
                      en: "Direct Booking",
                      es: "Reserva Directa",
                      pt: "Reserva Direta",
                    }}
                  />
                </h3>
                <div className="space-y-2">
                  <p className="text-base text-gray-700 font-medium">
                    <Translate
                      text={{
                        en: "🏆 Best price guarantee",
                        es: "🏆 Garantía de mejor precio",
                        pt: "🏆 Garantia de melhor preço",
                      }}
                    />
                  </p>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      <Translate
                        text={{
                          en: "Accepted payment methods:",
                          es: "Métodos de pago aceptados:",
                          pt: "Métodos de pagamento aceitos:",
                        }}
                      />
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-0">
                      {getPaymentOptions()}
                    </p>
                  </div>
                </div>
              </div>
              <a
                href="https://book.ilbuco.com.ar/"
                className="block w-full sm:w-auto text-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg sm:ml-4 sm:flex-shrink-0"
              >
                <Translate
                  text={{
                    en: "Book Now",
                    es: "Reservar",
                    pt: "Reservar",
                  }}
                />
              </a>
            </div>
          </div>

          {/* Airbnb */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <div>
                <p className="font-medium">Airbnb</p>
                <p className="text-sm text-gray-600">
                  <Translate
                    text={{
                      en: "Book individual rooms",
                      es: "Reservar habitaciones individuales",
                      pt: "Reservar quartos individuais",
                    }}
                  />
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a
                href="https://www.airbnb.com/rooms/1432871950272757223?source_impression_id=p3_1749914100_P3tMGIELo0p9Q-SO"
                className="px-3 py-2 bg-white border border-red-500 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors text-center"
              >
                Paraiso
              </a>
              <a
                href="https://www.airbnb.com/rooms/1393460027877444232?source_impression_id=p3_1749914061_P3lDo2XWX43_1NS0"
                className="px-3 py-2 bg-white border border-red-500 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors text-center"
              >
                Giardino
              </a>
              <a
                href="https://www.airbnb.com/rooms/1422046866284999348?source_impression_id=p3_1749914061_P38mVIuZYIb4ompa"
                className="px-3 py-2 bg-white border border-red-500 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors text-center"
              >
                Terrazzo
              </a>
              <button
                onClick={() => alert("Penthouse is currently under long term rent")}
                className="px-3 py-2 bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-md text-center hover:bg-gray-200 transition-colors"
              >
                <Translate
                  text={{
                    en: "Penthouse",
                    es: "Penthouse",
                    pt: "Penthouse",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Booking.com */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
            <div>
              <p className="font-medium">Booking.com</p>
              <p className="text-sm text-gray-600">
                <Translate
                  text={{
                    en: "Coming soon",
                    es: "Próximamente",
                    pt: "Em breve",
                  }}
                />
              </p>
            </div>
            <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
              <Translate
                text={{
                  en: "Coming Soon",
                  es: "Próximamente",
                  pt: "Em breve",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}