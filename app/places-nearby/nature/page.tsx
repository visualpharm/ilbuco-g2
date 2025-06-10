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
    'text-gray-600': 'brightness(0) saturate(100%) invert(49%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)',
    'text-orange-700': 'brightness(0) saturate(100%) invert(49%) sepia(98%) saturate(987%) hue-rotate(15deg) brightness(101%) contrast(103%)'
  }
  
  return { filter: colorMap[colorClass] || 'none' }
}

// Icon components
const Icons = {
  Beach: ({ color }: { color: string }) => <Image src="/icons/icons8/waves.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Tree: ({ color }: { color: string }) => <Image src="/icons/icons8/tree.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Trail: ({ color }: { color: string }) => <Image src="/icons/icons8/trail.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Bicycle: ({ color }: { color: string }) => <Image src="/icons/icons8/bicycle.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Camera: ({ color }: { color: string }) => <Image src="/icons/icons8/camera.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
}

function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function Nature() {
  const { language } = useLanguage()
  const langPrefix = language.code === "es" ? "" : `/${language.code}`
  
  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, href: `${langPrefix}/places-nearby/activities`, active: false },
    { id: "food", label: placesNearbyTranslations.tabs.food, href: `${langPrefix}/places-nearby/food`, active: false },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, href: `${langPrefix}/places-nearby/shopping`, active: false },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, href: `${langPrefix}/places-nearby/nature`, active: true },
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

              {/* Beach & Nature Content */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <Translate
                      text={{
                        en: "Beach & Forest Adventures",
                        es: "Aventuras de Playa y Bosque",
                        pt: "Aventuras de Praia e Floresta",
                      }}
                    />
                  </h2>
                  <p className="text-lg text-gray-700">
                    <Translate
                      text={{
                        en: "Cariló's unique combination of pristine beaches and wild pine forests offers endless opportunities for outdoor exploration.",
                        es: "La combinación única de Cariló de playas prístinas y bosques de pinos salvajes ofrece infinitas oportunidades para la exploración al aire libre.",
                        pt: "A combinação única de Cariló de praias pristinas e florestas de pinheiros selvagens oferece infinitas oportunidades para exploração ao ar livre.",
                      }}
                    />
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Beach color="text-cyan-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Beach Activities",
                              es: "Actividades de Playa",
                              pt: "Atividades de Praia",
                            }}
                          />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate
                            text={{
                              en: "Cariló's beautiful beaches are just a short walk away. Enjoy swimming, sunbathing, beach volleyball, or simply relaxing by the ocean with the sound of waves.",
                              es: "Las hermosas playas de Cariló están a solo un corto paseo. Disfrutá nadar, tomar sol, jugar al vóley playa, o simplemente relajarte junto al océano con el sonido de las olas.",
                              pt: "As belas praias de Cariló estão a apenas uma curta caminhada. Desfrute de natação, banhos de sol, vôlei de praia, ou simplesmente relaxe junto ao oceano com o som das ondas.",
                            }}
                          />
                        </p>
                        <ul className="mt-3 text-sm text-gray-600 space-y-1">
                          <li>
                            • <Translate text={{ en: "Swimming in the Atlantic", es: "Nadar en el Atlántico", pt: "Natação no Atlântico" }} />
                          </li>
                          <li>
                            • <Translate text={{ en: "Beach volleyball courts", es: "Canchas de vóley playa", pt: "Quadras de vôlei de praia" }} />
                          </li>
                          <li>
                            • <Translate text={{ en: "Sunrise/sunset watching", es: "Ver el amanecer/atardecer", pt: "Observação do nascer/pôr do sol" }} />
                          </li>
                          <li>
                            • <Translate
                              text={{ en: "Shell collecting walks", es: "Caminatas para recolectar conchas", pt: "Caminhadas para coletar conchas" }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Trail color="text-emerald-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Forest Walks & Meditation",
                              es: "Caminatas por el Bosque y Meditación",
                              pt: "Caminhadas na Floresta e Meditação",
                            }}
                          />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate
                            text={{
                              en: "Explore the unique pine forests of Cariló through numerous walking trails. The peaceful environment is perfect for meditation and mindfulness practices.",
                              es: "Explorá los bosques de pinos únicos de Cariló a través de numerosos senderos para caminar. El ambiente tranquilo es perfecto para la meditación y las prácticas de mindfulness.",
                              pt: "Explore as florestas de pinheiros únicas de Cariló através de numerosas trilhas para caminhada. O ambiente pacífico é perfeito para meditação e práticas de mindfulness.",
                            }}
                          />
                        </p>
                        <ul className="mt-3 text-sm text-gray-600 space-y-1">
                          <li>
                            • <Translate
                              text={{ en: "Nature walking trails", es: "Senderos naturales para caminar", pt: "Trilhas naturais para caminhada" }}
                            />
                          </li>
                          <li>
                            • <Translate text={{ en: "Meditation spots", es: "Lugares para meditar", pt: "Locais para meditação" }} />
                          </li>
                          <li>
                            • <Translate
                              text={{ en: "Photography opportunities", es: "Oportunidades para fotografiar", pt: "Oportunidades para fotografia" }}
                            />
                          </li>
                          <li>
                            • <Translate
                              text={{ en: "Wildlife observation", es: "Observación de la vida silvestre", pt: "Observação da vida selvagem" }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Bicycle color="text-orange-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Cycling Adventures",
                              es: "Aventuras en Bicicleta",
                            }}
                          />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate
                            text={{
                              en: "Rent bicycles and explore Cariló and surrounding areas. The town's unpaved sandy streets and natural setting make for a pleasant cycling experience.",
                              es: "Alquilá bicicletas y explorá Cariló y las áreas circundantes. Las calles de arena sin pavimentar y el entorno natural de la ciudad hacen que la experiencia de ciclismo sea agradable.",
                            }}
                          />
                        </p>
                        <ul className="mt-3 text-sm text-gray-600 space-y-1">
                          <li>
                            • <Translate
                              text={{ en: "Regular bike rentals", es: "Alquiler de bicicletas regulares", pt: "Aluguel de bicicletas regulares" }}
                            />
                          </li>
                          <li>
                            • <Translate text={{ en: "Fat bike adventures", es: "Aventuras en fat bike", pt: "Aventuras de fat bike" }} />
                          </li>

                          <li>
                            • <Translate
                              text={{ en: "Forest trail cycling", es: "Ciclismo por senderos forestales", pt: "Ciclismo por trilhas na floresta" }}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Camera color="text-pink-700" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          <Translate
                            text={{
                              en: "Photography & Art",
                              es: "Fotografía y Arte",
                            }}
                          />
                        </h3>
                        <p className="text-gray-700 mt-2">
                          <Translate
                            text={{
                              en: "The natural light and inspiring views make IL BUCO perfect for photography, drawing, painting, or other creative pursuits.",
                              es: "La luz natural y las vistas inspiradoras hacen que IL BUCO sea perfecto para la fotografía, el dibujo, la pintura u otras actividades creativas.",
                            }}
                          />
                        </p>
                        <ul className="mt-3 text-sm text-gray-600 space-y-1">
                          <li>
                            • <Translate text={{ en: "Landscape photography", es: "Fotografía de paisajes", pt: "Fotografia de paisagens" }} />
                          </li>
                          <li>
                            • <Translate text={{ en: "Plein air painting", es: "Pintura al aire libre", pt: "Pintura ao ar livre" }} />
                          </li>
                          <li>
                            • <Translate text={{ en: "Nature sketching", es: "Bocetos de la naturaleza", pt: "Esboços da natureza" }} />
                          </li>
                          <li>
                            • <Translate text={{ en: "Golden hour sessions", es: "Sesiones de la hora dorada", pt: "Sessões do horário dourado" }} />
                          </li>
                        </ul>
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