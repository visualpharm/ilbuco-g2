import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { contactTranslations } from "@/translations/contact"
import { Mail, Phone, MapPin, Calendar, Users, Clock } from "lucide-react"

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <Translate text={contactTranslations.pageTitle} />
              </h1>
              <p className="text-lg text-gray-700 mb-12">
                <Translate text={contactTranslations.pageDescription} />
              </p>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate text={contactTranslations.form.title} />
                  </h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          <Translate text={contactTranslations.form.name} />
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          <Translate text={contactTranslations.form.email} />
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          <Translate text={contactTranslations.form.phone} />
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          <Translate text={contactTranslations.form.subject} />
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          <Translate text={contactTranslations.form.message} />
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <Translate text={contactTranslations.form.button} />
                    </button>
                  </form>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate text={contactTranslations.contactInfo.title} />
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.email} />
                        </h3>
                        <p className="text-gray-700">info@ilbuco.com.ar</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.phone} />
                        </h3>
                        <p className="text-gray-700">+54 11 1234 5678</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={contactTranslations.contactInfo.address} />
                        </h3>
                        <p className="text-gray-700">Cariló, Buenos Aires Province, Argentina</p>
                        <p className="text-gray-700">
                          <Translate text={contactTranslations.contactInfo.addressNote} />
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">
                        <Translate text={contactTranslations.bookingInfo.title} />
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">
                                <Translate text={contactTranslations.bookingInfo.availability} />
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Users className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">
                                <Translate text={contactTranslations.bookingInfo.capacity} />
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">
                                <Translate text={contactTranslations.bookingInfo.minimumStay} />
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
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
                      <Translate text={contactTranslations.faq.deposit.question} />
                    </h4>
                    <p className="text-gray-700">
                      <Translate text={contactTranslations.faq.deposit.answer} />
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
                          en: "Unfortunately, we do not allow pets at IL BUCO to maintain the property's cleanliness and accommodate guests with allergies.",
                          es: "Lamentablemente, no permitimos mascotas en IL BUCO para mantener la limpieza de la propiedad y acomodar a huéspedes con alergias.",
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      <Translate
                        text={{
                          en: "Is there housekeeping service?",
                          es: "¿Hay servicio de limpieza?",
                        }}
                      />
                    </h4>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Yes, we provide weekly housekeeping for stays longer than 7 days. Additional cleaning services can be arranged for an extra fee.",
                          es: "Sí, proporcionamos limpieza semanal para estadías de más de 7 días. Servicios de limpieza adicionales se pueden organizar por una tarifa extra.",
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
