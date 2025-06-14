"use client"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { placesNearbyTranslations } from "@/translations/places-nearby"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

// Helper function to convert Tailwind color classes to CSS filters
function getColorFilter(colorClass: string): React.CSSProperties {
  const colorMap: { [key: string]: string } = {
    'text-indigo-700': 'brightness(0) saturate(100%) invert(26%) sepia(100%) saturate(2878%) hue-rotate(231deg) brightness(101%) contrast(103%)',
    'text-cyan-700': 'brightness(0) saturate(100%) invert(26%) sepia(96%) saturate(6121%) hue-rotate(191deg) brightness(101%) contrast(103%)',
    'text-violet-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(271deg) brightness(101%) contrast(103%)',
    'text-amber-700': 'brightness(0) saturate(100%) invert(49%) sepia(98%) saturate(987%) hue-rotate(2deg) brightness(101%) contrast(103%)',
    'text-green-700': 'brightness(0) saturate(100%) invert(33%) sepia(100%) saturate(1352%) hue-rotate(87deg) brightness(101%) contrast(103%)',
    'text-pink-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(314deg) brightness(101%) contrast(103%)',
    'text-red-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(354deg) brightness(101%) contrast(103%)',
    'text-emerald-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(140deg) brightness(101%) contrast(103%)',
    'text-teal-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(180deg) brightness(101%) contrast(103%)',
    'text-gray-700': 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)',
    'text-white': 'brightness(0) saturate(100%) invert(100%)',
    'text-gray-600': 'brightness(0) saturate(100%) invert(49%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'
  }
  
  return { filter: colorMap[colorClass] || 'none' }
}

// Icon components
const Icons = {
  Gym: ({ color }: { color: string }) => <Image src="/icons/icons8/dumbbell.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Windsurfing: ({ color }: { color: string }) => <Image src="/icons/icons8/wind.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Calisthenics: ({ color }: { color: string }) => <Image src="/icons/icons8/pull-up-bar.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Horse: ({ color }: { color: string }) => <Image src="/icons/icons8/horse-riding.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Tennis: ({ color }: { color: string }) => <Image src="/icons/icons8/tennis-racquet.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Quad: ({ color }: { color: string }) => <Image src="/icons/icons8/car.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Art: ({ color }: { color: string }) => <Image src="/icons/icons8/palette.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,

  // Social & Web Links
  GoogleMaps: ({ className = "" }: { className?: string }) => (
    <Image src="/icons/icons8/map-pin.svg" alt="" width={24} height={24} className={`inline-block mr-1.5 ${className}`} style={{filter: 'brightness(0) saturate(100%) invert(33%) sepia(79%) saturate(1515%) hue-rotate(219deg) brightness(101%) contrast(101%)'}} />
  ),
  Instagram: ({ className = "" }: { className?: string }) => (
    <Image src="/icons/icons8/instagram.svg" alt="" width={24} height={24} className={`inline-block mr-1.5 ${className}`} style={{filter: 'brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(7284%) hue-rotate(317deg) brightness(94%) contrast(91%)'}} />
  ),
  Website: ({ className = "" }: { className?: string }) => (
    <Image src="/icons/icons8/globe.svg" alt="" width={24} height={24} className={`inline-block mr-1.5 ${className}`} style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
  )
}

function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function Activities() {
  const { language } = useLanguage()
  const langPrefix = language.code === "es" ? "" : `/${language.code}`
  
  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, href: `${langPrefix}/places-nearby/activities`, active: true },
    { id: "food", label: placesNearbyTranslations.tabs.food, href: `${langPrefix}/places-nearby/food`, active: false },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, href: `${langPrefix}/places-nearby/shopping`, active: false },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, href: `${langPrefix}/places-nearby/nature`, active: false },
    { id: "work", label: placesNearbyTranslations.tabs.work, href: `${langPrefix}/places-nearby/work`, active: false },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                <Translate text={removePalmFromTranslations(placesNearbyTranslations.pageTitle)} />
              </h1>
              <p className="text-lg text-gray-700 mb-12 text-center">
                <Translate text={placesNearbyTranslations.pageDescription} />
              </p>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 justify-center">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                      tab.active
                        ? "bg-black text-white border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span><Translate text={tab.label} /></span>
                  </Link>
                ))}
              </div>

              {/* Activities Content */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <Translate
                      text={{
                        en: "Nearby Activities & Services",
                        es: "Actividades y Servicios Cercanos",
                      }}
                    />
                  </h2>
                  <p className="text-lg text-gray-700">
                    <Translate
                      text={{
                        en: "All destinations are within a 25–35-minute walk or a short drive from Il Buco.",
                        es: "Todos los destinos están a 25–35 minutos caminando o un corto viaje en auto desde Il Buco.",
                      }}
                    />
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Gym color="text-indigo-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.gym.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.gym.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=CIE+Centro+de+Entrenamiento+Caril%C3%B3"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/somos_cie/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@somos_cie</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Windsurfing color="text-cyan-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.windsurfing.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.windsurfing.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Coco+Surf+Caril%C3%B3"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/coco.surf.carilo/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@coco.surf.carilo</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Tennis color="text-violet-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.tennis.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.tennis.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Caril%C3%B3+Tennis+Club"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/carilotennis.club/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@carilotennis.club</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Calisthenics color="text-indigo-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.calisthenics.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.calisthenics.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Parque+de+Calistenia+Caril%C3%B3"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Horse color="text-amber-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.horseRiding.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.horseRiding.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Cabalgatas+Dos+Montes"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/cabalgatasdosmontes/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@cabalgatasdosmontes</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Quad color="text-green-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.quadBike.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.quadBike.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Motorrad+Caril%C3%B3"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.guiadeplaya.com.ar/motorrad-carilo-alquiler-cuatriciclos.html"
                            className="text-gray-600 hover:text-gray-800 transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Website />
                            <span>guiadeplaya.com.ar</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Quad color="text-green-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.driving.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.driving.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Sandmasters+Pinamar"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/sandmasters_/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@sandmasters_</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Art color="text-pink-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate text={placesNearbyTranslations.activities.ceramics.title} />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate text={placesNearbyTranslations.activities.ceramics.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Fusion+Arte+del+Mar+Valeria+del+Mar"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            <span>Google Maps</span>
                          </a>
                          <a
                            href="https://www.instagram.com/fusionartedelmar/"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            <span>@fusionartedelmar</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  <Translate text={placesNearbyTranslations.cta.title} />
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  <Translate text={placesNearbyTranslations.cta.description} />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-8 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Translate text={placesNearbyTranslations.cta.button} />
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