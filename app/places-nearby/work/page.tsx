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
  Laptop: ({ color }: { color: string }) => <Image src="/icons/icons8/laptop-computer.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Finance: ({ color }: { color: string }) => <Image src="/icons/icons8/calculator.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Cube: ({ color }: { color: string }) => <Image src="/icons/icons8/cube.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Art: ({ color }: { color: string }) => <Image src="/icons/icons8/palette.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
}

function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function Work() {
  const { language } = useLanguage()
  const langPrefix = language.code === "es" ? "" : `/${language.code}`
  
  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, href: `${langPrefix}/places-nearby/activities`, active: false },
    { id: "food", label: placesNearbyTranslations.tabs.food, href: `${langPrefix}/places-nearby/food`, active: false },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, href: `${langPrefix}/places-nearby/shopping`, active: false },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, href: `${langPrefix}/places-nearby/nature`, active: false },
    { id: "work", label: placesNearbyTranslations.tabs.work, href: `${langPrefix}/places-nearby/work`, active: true },
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

              {/* Work & Learning Content */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <Translate text={placesNearbyTranslations.work.title} />
                  </h2>
                  <p className="text-lg text-gray-700">
                    <Translate text={placesNearbyTranslations.work.description} />
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Laptop color="text-indigo-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Diving into Vibe Coding",
                              es: "Sumergirse en la Programación Vibe",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "Master modern development tools like Cursor and v0. Nature makes you enjoy the day even while Claude Sonnet is thinking. Our 500 Mbps fiber internet and distraction-free environment will boost your productivity.",
                              es: "Dominá herramientas de desarrollo modernas como Cursor y v0. La naturaleza te hace disfrutar el día incluso mientras Claude Sonnet está pensando. Nuestro internet de fibra de 500 Mbps y ambiente libre de distracciones aumentará tu productividad.",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Cube color="text-violet-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Learn 3D Modeling",
                              es: "Aprender Modelado 3D",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "Explore tools like Plasticity (it's like Figma for 3D) and bring your design ideas to life in our inspiring forest setting. I'll even borrow you a 3D printer if you try to connect it to local Wi-Fi.",
                              es: "Explorá herramientas como Plasticity (es como Figma para 3D) y da vida a tus ideas de diseño en nuestro entorno inspirador del bosque. Incluso te presto una impresora 3D si intentás conectarla al Wi-Fi local.",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Laptop color="text-indigo-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Boost Your Remote Career",
                              es: "Impulsa tu Carrera Remota",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "Use your time at IL BUCO to refine your remote work skills, update your portfolio, or network with other professionals staying at the villa.",
                              es: "Usá tu tiempo en IL BUCO para perfeccionar tus habilidades de trabajo remoto, actualizar tu portafolio, o hacer networking con otros profesionales que se hospedan en la villa.",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Art color="text-pink-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Finally Launch Your Startup",
                              es: "Finalmente Lanza tu Startup",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "The peaceful environment and minimal distractions make IL BUCO ideal for developing your business plan, building your MVP, or preparing for launch.",
                              es: "El ambiente pacífico y las mínimas distracciones hacen que IL BUCO sea ideal para desarrollar tu plan de negocios, construir tu MVP, o prepararte para el lanzamiento.",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Finance color="text-green-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Finance",
                              es: "Finanzas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "My favorites are this course on financial accounting, the book A Random Walk Down Wall Street, and this international tax course.",
                              es: "Mis favoritos son este curso de contabilidad financiera, el libro A Random Walk Down Wall Street, y este curso de impuestos internacionales.",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Laptop color="text-indigo-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Write Your Book or Blog",
                              es: "Escribí tu Libro o Blog",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600 mt-2">
                          <Translate
                            text={{
                              en: "Many guests find that the tranquil setting of IL BUCO, surrounded by swaying pine trees, provides the perfect inspiration for writing projects.",
                              es: "Muchos huéspedes encuentran que el entorno tranquilo de IL BUCO, rodeado de pinos que se mecen, proporciona la inspiración perfecta para proyectos de escritura.",
                            }}
                          />
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