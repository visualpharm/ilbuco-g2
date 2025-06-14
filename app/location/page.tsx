import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { locationTranslations } from "@/translations/location"
// Windows 11 style icons replaced Lucide React icons
// Icons are now served as SVG files from /public/icons/

export default function Location() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <Translate text={locationTranslations.pageTitle} />
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                <Translate text={locationTranslations.pageDescription} /> Una ubicación privilegiada en <Link href="/carilo-alojamiento" className="text-gray-700 no-underline hover:text-gray-600">Cariló</Link> cerca del <Link href="/casas-en-carilo-frente-al-mar" className="text-gray-700 no-underline hover:text-gray-600">mar</Link>.
              </p>

              {/* Map Section */}
              <div className="mb-8">
                <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.1234567890123!2d-56.9918!3d-37.1656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959c1e5c5a8f9c5f%3A0x5e5a5e5a5e5a5e5a!2sParaiso%20324%2C%20B7167%20Caril%C3%B3%2C%20Buenos%20Aires%20Province%2C%20Argentina!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Il Buco Location"
                    className="absolute inset-0"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                  <a
                    href="https://maps.app.goo.gl/McARi7xe1wzBr64P9"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Translate text={locationTranslations.mapSection.openInGoogleMaps} />
                  </a>
                  <div>
                    <p className="text-gray-700">
                      Paraiso 324, Cariló (7167)
                      <br />
                      Partido de Pinamar, Provincia de Buenos Aires, Argentina
                    </p>
                  </div>
                </div>
              </div>

              {/* Getting Here Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🛣️</span>
                  <Translate text={locationTranslations.gettingHere.title} />
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <Image src="/icons/car.svg" alt="" width={16} height={16} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                    <div>
                      <p className="font-semibold">
                        <Translate text={locationTranslations.gettingHere.car.title} />:
                      </p>
                      <p className="text-gray-700">
                        <Translate text={locationTranslations.gettingHere.car.description} />
                      </p>
                    </div>
                  </li>

                  <li className="relative">
                    <div className="flex items-start">
                      <Image src="/icons/bus.svg" alt="" width={16} height={16} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold">
                            <Translate text={locationTranslations.gettingHere.bus.title} />:
                          </p>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            <Translate text={locationTranslations.gettingHere.bus.recommended} />
                          </span>
                        </div>

                        <div className="block gap-4 mb-4">
                          <div className="flex-1 order-2 sm:order-1">
                            <p className="text-gray-700 mb-2">
                              <Translate text={locationTranslations.gettingHere.bus.description} />
                            </p>
                            <div className="block my-2">
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cama_ejecutivo.jpg-nW5M2EciGfoaFbCppu2LS7uEYekT5e.jpeg"
                                alt="Cama Ejecutivo bus interior"
                                height={120}
                                width={180}
                                className="rounded object-cover"
                                priority
                              />
                              <span className="italic text-gray-600 text-sm mt-2 text-left block">
                                <Translate text={locationTranslations.gettingHere.bus.tip} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Image src="/icons/car.svg" alt="" width={16} height={16} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                    <div>
                      <p className="font-semibold">
                        <Translate
                          text={{
                            en: "Private or shared transfer",
                            es: "Traslado privado o compartido",
                          }}
                        />
                      </p>
                      <p className="text-gray-700">
                        <Translate
                          text={{
                            en: "By car or minibus can be booked via InDrive or MercadoLibre.",
                            es: "En auto o minibus se puede reservar vía InDrive o MercadoLibre.",
                          }}
                        />
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🚂</span>
                    <div>
                      <p className="font-semibold">
                        <Translate
                          text={{
                            en: "Train",
                            es: "Tren",
                          }}
                        />
                        :
                      </p>
                      <p className="text-gray-700">
                        <Translate
                          text={{
                            en: "There is a daily train from Buenos Aires to Pinamar, but tickets sell out minutes after release – not a practical option.",
                            es: "Hay un tren diario desde Buenos Aires a Pinamar, pero los boletos se agotan minutos después de salir a la venta – no es una opción práctica.",
                          }}
                        />
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Image src="/icons/plane.svg" alt="" width={16} height={16} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                    <div>
                      <p className="font-semibold">
                        <Translate
                          text={{
                            en: "Flights",
                            es: "Vuelos",
                          }}
                        />
                        :
                      </p>
                      <p className="text-gray-700">
                        <Translate
                          text={{
                            en: "There are no regular flights since 2023.",
                            es: "No hay vuelos regulares desde 2023.",
                          }}
                        />
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Getting Around Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🚕</span>
                  <Translate
                    text={{
                      en: "Getting around",
                      es: "Moverse por la zona",
                    }}
                  />
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Uber, Didi, and local taxi with an app (iPhone / Android).",
                          es: "Uber, Didi, y taxi local con una app (iPhone / Android).",
                        }}
                      />
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">
                      <Translate
                        text={{
                          en: "Food and courier app: PedidosYa",
                          es: "App de comida y delivery: PedidosYa",
                        }}
                      />
                    </p>
                  </li>
                </ul>
              </div>

              {/* Photo Gallery Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate
                    text={{
                      en: "Area Gallery",
                      es: "Galería de la Zona",
                    }}
                  />
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM.jpeg-zy2r0LsIkjdnZ0czOZgscZzzXDh2gm.png"
                      alt="Cariló beach with waves and cloudy sky"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2034%2051%20PM%20%286%29%20%281%29.jpeg-JR5Q4JMSI3cscyNAKUeIUqt9EVdyee.png"
                      alt="Lifeguard station on Cariló beach"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM%20%281%29.jpeg-VxGhS3R27n0nduSRtdSZvOOOHslx1M.png"
                      alt="Modern concrete villa at night in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM%20%282%29%20%281%29.jpeg-hipfIxZRDSXb3rP4qb5RfARL0KDKWV.png"
                      alt="Pine trees at night in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2034%2051%20PM%20%281%29%20%281%29.jpeg-QJVUPiAglBTZSdYJtL9gt9OXe8R7g8.png"
                      alt="Coastal vegetation and pine trees in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-square min-h-[80px] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2034%2051%20PM%20%288%29.jpeg-EZAYZRstt3u4q8pxErGu10hgJeiOHa.png"
                      alt="Pine trees silhouette at dusk in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* About Cariló Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🌲</span>
                  <Translate text={locationTranslations.aboutCarilo.title} />
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 mb-4">
                    <Translate text={locationTranslations.aboutCarilo.description} />
                  </p>
                  <p className="text-gray-700">
                    <Translate
                      text={{
                        en: "Learn more on Wikipedia (co-written by Il Buco's founder).",
                        es: "Conocé más en Wikipedia (co-escrito por el fundador de Il Buco).",
                      }}
                    />
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">
                  <Translate
                    text={{
                      en: "Book Your Stay",
                      es: "Reservá tu Estadía",
                    }}
                  />
                </h3>
                <p className="text-gray-700 mb-4">
                  <Translate
                    text={{
                      en: "Ready to experience IL BUCO and the beautiful surroundings of Cariló? Contact us to check availability and book your stay.",
                      es: "¿Listo para experimentar IL BUCO y los hermosos alrededores de Cariló? Contactanos para verificar disponibilidad y reservar tu estadía.",
                    }}
                  />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Translate
                    text={{
                      en: "Contact Us",
                      es: "Contactanos",
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
