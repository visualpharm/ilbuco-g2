"use client"
import Link from "next/link"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { placesNearbyTranslations } from "@/translations/places-nearby"
import {
  Dumbbell,
  Target,
  Users,
  Gamepad2,
  Car,
  Bike,
  Palette,
  MapPin,
  Instagram,
  Globe,
  UtensilsCrossed,
  Pizza,
  Coffee,
  ShoppingBag,
  ShoppingCart,
  Apple,
  Waves,
  Trees,
  Calculator
} from "lucide-react"

// Icon components with dynamic colors using Lucide React
const Icons = {
  // Activity Icons
  Gym: ({ color }: { color: string }) => <Dumbbell className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Windsurfing: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21L12 3l9 18H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l6-6" />
    </svg>
  ),
  Calisthenics: ({ color }: { color: string }) => <Target className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Horse: ({ color }: { color: string }) => <Users className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Tennis: ({ color }: { color: string }) => <Gamepad2 className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Quad: ({ color }: { color: string }) => <Car className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Car4x4: ({ color }: { color: string }) => <Car className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Bike: ({ color }: { color: string }) => <Bike className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Art: ({ color }: { color: string }) => <Palette className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  
  // Food Icons
  Restaurant: ({ color }: { color: string }) => <UtensilsCrossed className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Pizza: ({ color }: { color: string }) => <Pizza className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Meat: ({ color }: { color: string }) => <UtensilsCrossed className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  
  // Shopping Icons
  ShoppingBag: ({ color }: { color: string }) => <ShoppingBag className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  ShoppingCart: ({ color }: { color: string }) => <ShoppingCart className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Fruit: ({ color }: { color: string }) => <Apple className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  
  // Nature Icons
  Beach: ({ color }: { color: string }) => <Waves className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  Tree: ({ color }: { color: string }) => <Trees className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,
  
  // Work Icons
  Laptop: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="14" rx="2" ry="2"></rect>
      <path d="M17 7V4a2 2 0 00-2-2H9a2 2 0 00-2 2v3"></path>
    </svg>
  ),
  Finance: ({ color }: { color: string }) => <Calculator className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} />,

  // Social & Web Links (Windows 11 Style)
  GoogleMaps: ({ className = "" }: { className?: string }) => (
    <MapPin className={`w-5 h-5 inline-block mr-1.5 text-[#4285F4] ${className}`} />
  ),
  Instagram: ({ className = "" }: { className?: string }) => (
    <Instagram className={`w-5 h-5 inline-block mr-1.5 text-[#E1306C] ${className}`} />
  ),
  Website: ({ className = "" }: { className?: string }) => (
    <Globe className={`w-5 h-5 inline-block mr-1.5 text-gray-600 ${className}`} />
  )
}


function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function ThingsToDo() {
  const [activeTab, setActiveTab] = useState("activities")

  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, icon: ({color}: {color: string}) => <Icons.Gym color={color} /> },
    { id: "food", label: placesNearbyTranslations.tabs.food, icon: ({color}: {color: string}) => <Icons.Restaurant color={color} /> },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, icon: ({color}: {color: string}) => <Icons.ShoppingBag color={color} /> },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, icon: ({color}: {color: string}) => <Icons.Beach color={color} /> },
    { id: "work", label: placesNearbyTranslations.tabs.work, icon: ({color}: {color: string}) => <Icons.Laptop color={color} /> },
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
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "bg-black text-white border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon({ color: activeTab === tab.id ? "text-white" : "text-gray-600" })}
                    <span><Translate text={tab.label} /></span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                {/* Work & Learning Tab */}
                {activeTab === "work" && (
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
                          <Icons.Tennis color="text-violet-700" />
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
                )}

                {/* Beach & Nature Tab */}
                {activeTab === "nature" && (
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
                                  pt: <>As belas <Link href="/pt/argentina-praia" className="text-gray-700 hover:text-gray-900 no-underline">praias de Cariló</Link> estão a apenas uma curta caminhada. Desfrute de natação, banhos de sol, vôlei de praia, ou simplesmente relaxe junto ao oceano com o som das ondas.</>,
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
                          <span className="text-emerald-600 text-2xl flex-shrink-0">􀣽</span>
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
                          <span className="text-orange-600 text-2xl flex-shrink-0">🚴</span>
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
                          <span className="text-rose-600 text-2xl flex-shrink-0">􀢹</span>
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
                )}

                {/* Activities Tab */}
                {activeTab === "activities" && (
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/somos_cie/"
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/coco.surf.carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/carilotennis.club/"
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/cabalgatasdosmontes/"
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.guiadeplaya.com.ar/motorrad-carilo-alquiler-cuatriciclos.html"
                                target="_blank"
                                rel="noopener noreferrer"
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
                          <Icons.Car4x4 color="text-green-700" />
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/sandmasters_/"
                                target="_blank"
                                rel="noopener noreferrer"
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/fusionartedelmar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@fusionartedelmar</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Car4x4 color="text-green-700" />
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
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/sandmasters_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@sandmasters_</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Food & Dining Tab */}
                {activeTab === "food" && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-4">
                        <Translate
                          text={{
                            en: "Dining & Coffee Recommendations",
                            es: "Recomendaciones de Gastronomía y Café",
                          }}
                        />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate
                          text={{
                            en: "From world-class Argentine steakhouses to artisanal coffee shops, Cariló offers a sophisticated dining scene in a relaxed coastal setting.",
                            es: "Desde parrillas argentinas de clase mundial hasta cafeterías artesanales, Cariló ofrece una escena gastronómica sofisticada en un entorno costero relajado.",
                          }}
                        />
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Meat color="text-amber-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Argentine Parrilla</h3>
                            <p className="text-gray-700 mt-2">The greatest parrilla with lots of free extras.</p>
                            <p className="text-gray-600 mt-1">
                              Also recommended:{" "}
                              <a
                                href="https://www.instagram.com/donbenito_carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Don Benito
                              </a>{" "}
                              (poshy),{" "}
                              <a
                                href="https://www.instagram.com/demicampocarilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                De Mi Campo
                              </a>{" "}
                              (salad bar!),{" "}
                              <a
                                href="https://goo.gl/maps/8ZQZgqXH8JZQeULt8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>La Parrillita</span>
                              </a>{" "}
                              (basic in a good sense).
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=La+Cabrera+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/lacabrera_carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@lacabrera_carilo</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Pizza color="text-red-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Italian Pizza</h3>
                            <p className="text-gray-700 mt-2">
                              Award-winning Napoletan pizza from the Italian chefs (they also made our sofas).
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Il+Gatto+Nero+Valeria+del+Mar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/__ilgattonero/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@__ilgattonero</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Restaurant color="text-amber-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Bakery & Coffee</h3>
                            <p className="text-gray-700 mt-2">Great coffee and baked stuff; best avocado toast.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Il+Panettone+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/panaderia.ilpanettone/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@panaderia.ilpanettone</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Restaurant color="text-amber-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Gourmet Burgers</h3>
                            <p className="text-gray-700 mt-2">Best burgers. Also Impeke (Valeria del Mar).</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Enris+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/enris.ar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@enris.ar</span>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Restaurant color="text-amber-700" />
                          <div>
                            <h3 className="text-xl font-semibold">French Café</h3>
                            <p className="text-gray-700 mt-2">Always open.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Masse+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <span className="flex items-center">
                                <Icons.Instagram />
                                <a
                                  href="https://www.instagram.com/masse.carilo/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                                >
                                  @masse.carilo
                                </a>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shopping Tab */}
                {activeTab === "shopping" && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-4">
                        <Translate
                          text={{
                            en: "Shopping",
                            es: "Compras",
                          }}
                        />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate
                          text={{
                            en: "My Most Frequented Shops in Cariló & Valeria del Mar",
                            es: "Mis Tiendas Más Frecuentadas en Cariló y Valeria del Mar",
                          }}
                        />
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Chicho */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>Chicho</strong> – Best open hours, decent fruit and vegetables.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Proveedur%C3%ADa+Chicho+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/proveeduria_chicho_esta_loco/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @proveeduria_chicho_esta_loco
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Menor Coste */}
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>La Proveeduría / Menor Coste</strong> – Expensive, mini Whole Foods.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=La+Proveedur%C3%ADa+Menor+Coste+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/menorcoste/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @menorcoste
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Coto */}
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>Coto</strong> – The closest large supermarket; they have everything from food to
                          furniture and bicycles. Online store with delivery to Cariló.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Coto+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.cotodigital3.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            cotodigital3.com.ar
                          </a>
                        </p>
                      </div>

                      {/* Disco */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>Disco</strong> – Alternative without taking the highway. They also deliver to Cariló.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Disco+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.disco.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            disco.com.ar
                          </a>
                        </p>
                      </div>

                      {/* Belén */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fruit & Vegetables</h3>
                        <p className="text-gray-700">
                          <strong>Belén</strong> – Best fruit and vegetables.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Verduler%C3%ADa+Bel%C3%A9n+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://waze.com/ul?place=ChIJ4zObzLKdnJUR3db27yKHe_U"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Open in Waze
                          </a>
                        </p>
                      </div>

                      {/* Boutique de Frutas */}
                      <div className="bg-gradient-to-br from-yellow-50 to-lime-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fruit & Vegetables</h3>
                        <p className="text-gray-700">
                          <strong>Boutique de Frutas</strong> – Self-service, which is not common. Pick the best or
                          blame on someone else.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Boutique+de+Frutas+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/boutique_de_frutas/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @boutique_de_frutas
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Jorjito */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                        <p className="text-gray-700">
                          <strong>Jorjito</strong> – Most complete hardware store.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Ferreter%C3%ADa+Jorjito+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/ferreteria_jorgito/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @ferreteria_jorgito
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Quimica Limpia Maurito */}
                      <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Cleaning Products</h3>
                        <p className="text-gray-700">
                          <strong>Quimica Limpia Maurito</strong> – In Pinamar, best for bulk cleaning products. They
                          deliver to Cariló weekly.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Qu%C3%ADmica+Limpia+Maurito+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.facebook.com/LMaurito/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Facebook Page
                          </a>
                        </p>
                      </div>

                      {/* Clothing */}
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Clothing</h3>
                        <p className="text-gray-700">
                          <strong>Cariló City-Center Boutiques</strong> – All the clothing in Cariló city center.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://maps.app.goo.gl/HSdLEiSF9qGJRWY7A"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Open in Google Maps
                          </a>
                        </p>
                      </div>

                      {/* Cabaña Guerrero */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Meat</h3>
                        <p className="text-gray-700">
                          <strong>Cabaña Guerrero</strong> – My favorite meat.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Caba%C3%B1a+Guerrero+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/cabana.guerrero/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @cabana.guerrero
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* La Constanza Cariló */}
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fish</h3>
                        <p className="text-gray-700">
                          <strong>La Constanza (Cariló)</strong> – Fresh fish, not frozen, even salmon. Closed during
                          low season.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Pescader%C3%ADa+La+Constanza+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/pescaderiasdicostanzoar/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @pescaderiasdicostanzoar
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* La Constanza Pinamar */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fish</h3>
                        <p className="text-gray-700">
                          <strong>La Constanza (Pinamar)</strong> – Open during low season when Cariló's location is
                          closed.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Pescader%C3%ADa+La+Constanza+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/pescaderiasdicostanzoar/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @pescaderiasdicostanzoar
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Colonial */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Ice Cream</h3>
                        <p className="text-gray-700">
                          <strong>Colonial (Valeria del Mar)</strong> – My favorite ice cream.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Helader%C3%ADa+Colonial+Valeria+del+Mar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/colonialhelados/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @colonialhelados
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Lucciano's */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Ice Cream</h3>
                        <p className="text-gray-700">
                          <strong>Lucciano's</strong> – The prettiest place.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Lucciano%27s+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/luccianos_/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @luccianos_
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Panettone */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Bakeries</h3>
                        <p className="text-gray-700">
                          <strong>Panettone</strong> – Simple.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Il+Panettone+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/panaderia.ilpanettone/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @panaderia.ilpanettone
                            </a>
                          </span>
                        </p>
                      </div>

                      {/* Masse */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Bakeries</h3>
                        <p className="text-gray-700">
                          <strong>Masse</strong> – Fancy breads with seeds.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Masse+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/masse.carilo/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @masse.carilo
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
