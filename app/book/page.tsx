import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { contactTranslations } from "@/translations/contact"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
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
                      <div>
                        <h3 className="text-lg font-semibold">WhatsApp</h3>
                        <a
                          href="https://wa.me/541121275492"
                          className="text-gray-700 hover:text-green-600 transition-colors"
                        >
                          +54 11 2127 5492
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.address} />
                        </h3>
                        <p className="text-gray-700">Calle 37 y Av. del Mar, Cariló, Buenos Aires, Argentina</p>
                        <p className="text-gray-700">
                          <Translate text={contactTranslations.contactInfo.addressNote} />
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
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <p className="font-medium">WhatsApp</p>
                          <p className="text-sm text-gray-600">
                            <Translate
                              text={{
                                en: "Direct booking via WhatsApp",
                                es: "Reserva directa por WhatsApp",
                              }}
                            />
                          </p>
                        </div>
                      </div>
                      <a
                        href="https://wa.me/541121275492?text=Hola!%20Me%20interesa%20reservar%20en%20IL%20BUCO.%20¿Podrían%20ayudarme%20con%20la%20disponibilidad?"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Translate
                          text={{
                            en: "Book Now",
                            es: "Reservar",
                          }}
                        />
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
                      <div className="flex items-center">
                        <div className="h-5 w-5 mr-3 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <div>
                          <p className="font-medium">Airbnb</p>
                          <p className="text-sm text-gray-600">
                            <Translate
                              text={{
                                en: "Coming soon",
                                es: "Próximamente",
                              }}
                            />
                          </p>
                        </div>
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

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
                      <div className="flex items-center">
                        <div className="h-5 w-5 mr-3 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">B</span>
                        </div>
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
                <h3 className="text-xl font-bold mb-4">
                  <Translate text={contactTranslations.faq.title} />
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate text={contactTranslations.faq.checkInOut.question} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={contactTranslations.faq.checkInOut.answer} />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate
                        text={{
                          en: "Is there a security deposit?",
                          es: "¿Hay depósito de garantía?",
                        }}
                      />
                    </h4>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Yes, we require a security deposit that will be refunded at checkout, assuming no damages.",
                          es: "Sí, requerimos un depósito de garantía que será devuelto al checkout, asumiendo que no hay daños.",
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate
                        text={{
                          en: "Are pets allowed?",
                          es: "¿Se permiten mascotas?",
                        }}
                      />
                    </h4>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Yes, pets are allowed with a hypo-allergenic fee and US $300 deposit.",
                          es: "Sí, se permiten mascotas con una tarifa hipoalergénica y depósito de US $300.",
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate
                        text={{
                          en: "What are the check-in/check-out policies?",
                          es: "¿Cuáles son las políticas de check-in/check-out?",
                        }}
                      />
                    </h4>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "We offer flexible check-in and check-out times. You can arrive early if your room is available, and stay late if there's no same-day check-in.",
                          es: "Ofrecemos horarios flexibles de check-in y check-out. Podés llegar temprano si tu habitación está disponible, y quedarte hasta tarde si no hay check-in el mismo día.",
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate
                        text={{
                          en: "Is housekeeping included?",
                          es: "¿Está incluida la limpieza?",
                        }}
                      />
                    </h4>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Weekly cleaning of common areas is included. Extra in-room cleaning is available on request for long stays.",
                          es: "La limpieza semanal de áreas comunes está incluida. Limpieza extra en habitación está disponible bajo pedido para estadías largas.",
                        }}
                      />
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
