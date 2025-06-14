import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { locationTranslations } from "@/translations/location"
// Windows 11 style icons replaced Lucide React icons
// Icons are now served as SVG files from /public/icons/
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nossa Localização - Cariló, Argentina | IL BUCO",
  description: "Descubra a localização perfeita do IL BUCO em Cariló, Argentina. A 360 km de Buenos Aires, rodeado por florestas de pinheiros e praias pristinas.",
  keywords: "localização carilo, como chegar carilo, carilo argentina localização, il buco localização",
}

export default function PortugueseLocation() {
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
                <Translate text={locationTranslations.pageDescription} /> Localização perfeita para <Link href="/pt/coliving" className="text-gray-700 no-underline hover:text-gray-600">coliving</Link> próximo à <Link href="/pt/argentina-praia" className="text-gray-700 no-underline hover:text-gray-600">praia</Link>.
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
                      <div>
                        <p className="font-semibold">
                          <Translate text={locationTranslations.gettingHere.bus.title} />:
                        </p>
                        <p className="text-gray-700">
                          <Translate text={locationTranslations.gettingHere.bus.description} />
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Image src="/icons/plane.svg" alt="" width={16} height={16} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                    <div>
                      <p className="font-semibold">
                        <Translate text={locationTranslations.gettingHere.plane.title} />:
                      </p>
                      <p className="text-gray-700">
                        <Translate text={locationTranslations.gettingHere.plane.description} />
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Surrounding Area Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                  <span className="mr-2">🌲</span>
                  <Translate text={locationTranslations.surroundingArea.title} />
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      <Translate text={locationTranslations.surroundingArea.nature.title} />
                    </h3>
                    <p className="text-gray-700 mb-4">
                      <Translate text={locationTranslations.surroundingArea.nature.description} /> A poucos metros do <Link href="/pt/argentina-mar" className="text-gray-700 no-underline hover:text-gray-600">mar</Link>.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li><Translate text={locationTranslations.surroundingArea.nature.features.forests} /></li>
                      <li><Translate text={locationTranslations.surroundingArea.nature.features.beach} /></li>
                      <li><Translate text={locationTranslations.surroundingArea.nature.features.wildlife} /></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      <Translate text={locationTranslations.surroundingArea.amenities.title} />
                    </h3>
                    <p className="text-gray-700 mb-4">
                      <Translate text={locationTranslations.surroundingArea.amenities.description} /> Descubra <Link href="/pt/carilo-argentina-o-que-fazer" className="text-gray-700 no-underline hover:text-gray-600">o que fazer</Link> na região.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li><Translate text={locationTranslations.surroundingArea.amenities.features.restaurants} /></li>
                      <li><Translate text={locationTranslations.surroundingArea.amenities.features.shops} /></li>
                      <li><Translate text={locationTranslations.surroundingArea.amenities.features.services} /></li>
                    </ul>
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