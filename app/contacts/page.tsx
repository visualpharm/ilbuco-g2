"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { contactTranslations } from "@/translations/contact"
import { Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Contact() {
  const { language } = useLanguage()

  // Payment options based on language
  const getPaymentOptions = () => {
    if (language.code === "es") {
      return "CBU, Mercado Pago, tarjetas internacionales Visa, Mastercard, Amex, etc., PayPal, USDT"
    } else {
      return "Visa, Mastercard, Amex etc, PayPal, USDT"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                <Translate
                  text={{
                    en: "Book",
                    es: "Reservar",
                  }}
                />
              </h1>
              <p className="text-lg text-gray-700 mb-12 text-center">
                <Translate
                  text={{
                    en: "Contact us to book your stay at Il Buco!",
                    es: "¡Contactanos para reservar tu estadía en Il Buco!",
                  }}
                />
              </p>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                {/* Contacts Column */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate
                      text={{
                        en: "Contacts",
                        es: "Contactos",
                      }}
                    />
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.email} />
                        </h3>
                        <a
                          href="mailto:ciao@ilbuco.com.ar"
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          ciao@ilbuco.com.ar
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">WhatsApp</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700">+54 11 2127 5492</span>
                          <a
                            href="https://wa.me/541121275492"
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                          >
                            <Translate text={{
                              en: "Message",
                              es: "Mensaje",
                              pt: "Mensagem"
                            }} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.address} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={contactTranslations.contactInfo.fullAddress} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Your Stay Column */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate
                      text={{
                        en: "Book Your Stay",
                        es: "Reservá tu Estadía",
                      }}
                    />
                  </h2>

                  <div className="space-y-4">
                    {/* Direct Booking */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium">
                            <Translate
                              text={{
                                en: "Direct Booking",
                                es: "Reserva Directa",
                                pt: "Reserva Direta",
                              }}
                            />
                          </p>
                          <p className="text-sm text-gray-600">
                            <Translate
                              text={{
                                en: "Best price guarantee",
                                es: "Garantía de mejor precio",
                              }}
                            />
                          </p>
                          <p className="text-xs text-gray-500 mt-1 mb-3 sm:mb-0">
                            {getPaymentOptions()}
                          </p>
                        </div>
                        <a
                          href="https://book.ilbuco.com.ar/"
                          className="block w-full sm:w-auto text-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors sm:ml-4"
                        >
                          <Translate
                            text={{
                              en: "Book Now",
                              es: "Reservar",
                            }}
                          />
                        </a>
                      </div>
                    </div>

                    {/* Airbnb */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="mb-4">
                        <p className="font-medium">Airbnb</p>
                        <p className="text-sm text-gray-600">
                          <Translate
                            text={{
                              en: "Book individual rooms",
                              es: "Reservar habitaciones individuales",
                            }}
                          />
                        </p>
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
                            }}
                          />
                        </p>
                      </div>
                      <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                        <Translate
                          text={{
                            en: "Coming Soon",
                            es: "Próximamente",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  <Translate text={contactTranslations.faq.title} />
                </h3>
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "How many people can stay?",
                        es: "¿Cuántas personas pueden alojarse?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Up to 16 guests: 4 double rooms (2 beds) + a double futon in each room (2 extra beds with charge).",
                        es: "Hasta 16 huéspedes: 4 habitaciones dobles (2 plazas) + un futón doble en cada habitación (2 plazas extra con cargo)."
                      }} />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "What are the check-in and check-out times?",
                        es: "¿Cuál es el horario de check-in y check-out?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Check-in: 3 PM (self check-in with smart lock)\nCheck-out: 11 AM\nCan be adjusted if the room is available before or after.",
                        es: "Check-in: 15 h (entrada autónoma con cerradura inteligente)\nCheck-out: 11 h\nSe puede ajustar si la habitación está libre antes o después."
                      }} />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Are pets allowed?",
                        es: "¿Se permiten mascotas?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Yes. A hypoallergenic cleaning fee plus a refundable $300 USD deposit applies.",
                        es: "Sí. Se aplica una tarifa de limpieza hipoalergénica más un depósito de US$300 reembolsable."
                      }} />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Is cleaning included in the rate?",
                        es: "¿La tarifa incluye limpieza?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Weekly cleaning of common areas is included.\nAdditional room cleaning is available for long stays.",
                        es: "Limpieza semanal de áreas comunes incluida.\nLimpieza adicional en la habitación disponible para estadías largas."
                      }} />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Are sheets and towels provided?",
                        es: "¿Hay sábanas y toallas?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Yes, included: 180-thread-count percal sheets and 420 g/m² hotel-style towels.",
                        es: "Sí, están incluidas: sábanas de percal 180 hilos y toallas de 420 g/m² estilo hotel."
                      }} />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "What is the minimum stay?",
                        es: "¿Cuál es la estadía mínima?"
                      }} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={{
                        en: "Low season (April to October): 2 nights\nHigh season (December to February): 7 nights",
                        es: "Temporada baja (abril a octubre): 2 noches\nTemporada alta (diciembre a febrero): 7 noches"
                      }} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}