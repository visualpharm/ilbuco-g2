import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Car, Plane, Bus, UtensilsCrossed, Bike, Dumbbell, Coffee, SailboatIcon as HorseSaddle } from "lucide-react"

export default function Location() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Location</h1>
              <p className="text-lg text-gray-700 mb-8">Located on Argentinian coast, 360 km from Buenos Aires.</p>

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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Open in Google Maps
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
                  <span className="mr-2">🛣️</span> Getting Here
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <Car className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Car:</p>
                      <p className="text-gray-700">360 km from Buenos Aires (4 hour drive)</p>
                    </div>
                  </li>

                  <li className="relative">
                    <div className="flex items-start">
                      <Bus className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold">Bus:</p>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            Recommended without car
                          </span>
                        </div>

                        <div className="md:flex md:justify-between">
                          <div className="md:pr-4 md:max-w-[calc(100%-240px)]">
                            <p className="text-gray-700 mb-2">
                              Around 10 buses daily from Buenos Aires (
                              <a
                                href="https://www.plataforma10.com/"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                rel="noopener noreferrer"
                              >
                                good aggregator
                              </a>
                              ). Book a bus to Pinamar. From there, it's a 15 min taxi ride.
                            </p>
                          </div>

                          <div className="mt-4 md:mt-0 md:ml-4 md:float-right w-full md:w-[220px] bg-gray-50 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                            <div className="relative h-[180px] w-full cursor-pointer">
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cama_ejecutivo.jpg-nW5M2EciGfoaFbCppu2LS7uEYekT5e.jpeg"
                                alt="Cama Ejecutivo bus interior with spacious reclining seats"
                                fill
                                className="object-cover hover:brightness-105 transition-all"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                                <span className="sr-only">Click to zoom</span>
                              </div>
                            </div>
                            <div className="p-3 text-sm">
                              <strong>Bus tip:</strong> Choose "Cama Ejecutivo" for lie-flat business class
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Car className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Private or shared transfer</p>
                      <p className="text-gray-700">
                        By car or minibus can be booked via{" "}
                        <a
                          href="https://indrive.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          InDrive
                        </a>{" "}
                        or{" "}
                        <a
                          href="https://listado.mercadolibre.com.ar/pasajes-en-combis-para-carilo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          MercadoLibre
                        </a>
                        .
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0">🚂</span>
                    <div>
                      <p className="font-semibold">Train:</p>
                      <p className="text-gray-700">
                        There is a daily train from Buenos Aires to Pinamar, but tickets sell out minutes after release
                        – not a practical option.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Plane className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Flights:</p>
                      <p className="text-gray-700">There are no regular flights since 2023.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Getting Around Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🚕</span> Getting around
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">
                      Uber, Didi, and local taxi with an app (
                      <a
                        href="https://apps.apple.com/ar/app/taxis-pinamar/id6738529955"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        iPhone
                      </a>{" "}
                      /{" "}
                      <a
                        href="https://play.google.com/store/apps/details?id=com.nrs.gael_clientes.taxispinamar&hl=es_AR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Android
                      </a>
                      ).
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Food and courier app: PedidosYa</p>
                  </li>
                </ul>
              </div>

              {/* Photo Gallery Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Area Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM.jpeg-zy2r0LsIkjdnZ0czOZgscZzzXDh2gm.png"
                      alt="Cariló beach with waves and cloudy sky"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2034%2051%20PM%20%286%29%20%281%29.jpeg-JR5Q4JMSI3cscyNAKUeIUqt9EVdyee.png"
                      alt="Lifeguard station on Cariló beach"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM%20%281%29.jpeg-VxGhS3R27n0nduSRtdSZvOOOHslx1M.png"
                      alt="Modern concrete villa at night in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2029%2015%20PM%20%282%29%20%281%29.jpeg-hipfIxZRDSXb3rP4qb5RfARL0KDKWV.png"
                      alt="Pine trees at night in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/File%2024-04-2025%2C%2010%2034%2051%20PM%20%281%29%20%281%29.jpeg-QJVUPiAglBTZSdYJtL9gt9OXe8R7g8.png"
                      alt="Coastal vegetation and pine trees in Cariló"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
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
                  <span className="mr-2">🌲</span> About Cariló
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 mb-4">
                    Cariló is a coastal town in Buenos Aires Province, Argentina, known for its pine forests, sand
                    dunes, and upscale villas. Founded in the early 20th century by Héctor Manuel Guerrero, the town has
                    sandy, unpaved roads and houses built among mature trees.
                  </p>
                  <p className="text-gray-700">
                    Learn more on{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Caril%C3%B3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Wikipedia
                    </a>{" "}
                    (co-written by Il Buco's founder).
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
                <p className="text-gray-700 mb-4">
                  Ready to experience IL BUCO and the beautiful surroundings of Cariló? Contact us to check availability
                  and book your stay.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Contact Us
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
