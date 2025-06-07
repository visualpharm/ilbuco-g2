"use client"
import Link from "next/link"
import { useState } from "react"
import { useLanguageDetection } from "@/hooks/use-language-detection"
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

function BeachDescription() {
  const { language } = useLanguageDetection();
  
  if (language.code === 'pt') {
    return (
      <p className="text-gray-700 mt-2">
        As belas <Link href="/pt/argentina-praia" className="text-gray-700 hover:text-gray-900 no-underline">praias de Cariló</Link> estão a apenas uma curta caminhada. Desfrute de natação, banhos de sol, vôlei de praia, ou simplesmente relaxe junto ao oceano com o som das ondas.
      </p>
    );
  }
  
  return (
    <p className="text-gray-700 mt-2">
      <Translate
        text={{
          en: "Cariló's beautiful beaches are just a short walk away. Enjoy swimming, sunbathing, beach volleyball, or simply relaxing by the ocean with the sound of waves.",
          es: "Las hermosas playas de Cariló están a solo un corto paseo. Disfrutá nadar, tomar sol, jugar al vóley playa, o simplemente relajarte junto al océano con el sonido de las olas.",
        }}
      />
    </p>
  );
}

export default function ThingsToDo() {
  const [activeTab, setActiveTab] = useState("activities")

  // Tab-specific icons without margins
  const TabIcons = {
    Gym: ({ color }: { color: string }) => <Dumbbell className={`w-full h-full ${color}`} />,
    Restaurant: ({ color }: { color: string }) => <UtensilsCrossed className={`w-full h-full ${color}`} />,
    ShoppingBag: ({ color }: { color: string }) => <ShoppingBag className={`w-full h-full ${color}`} />,
    Beach: ({ color }: { color: string }) => <Waves className={`w-full h-full ${color}`} />,
    Laptop: ({ color }: { color: string }) => (
      <svg className={`w-full h-full ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="14" rx="2" ry="2"></rect>
        <path d="M17 7V4a2 2 0 00-2-2H9a2 2 0 00-2 2v3"></path>
      </svg>
    ),
  }

  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, icon: ({color}: {color: string}) => <TabIcons.Gym color={color} /> },
    { id: "food", label: placesNearbyTranslations.tabs.food, icon: ({color}: {color: string}) => <TabIcons.Restaurant color={color} /> },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, icon: ({color}: {color: string}) => <TabIcons.ShoppingBag color={color} /> },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, icon: ({color}: {color: string}) => <TabIcons.Beach color={color} /> },
    { id: "work", label: placesNearbyTranslations.tabs.work, icon: ({color}: {color: string}) => <TabIcons.Laptop color={color} /> },
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
              <div className="flex flex-nowrap overflow-x-auto gap-1 lg:gap-2 mb-8 border-b border-gray-200 justify-start lg:justify-center px-4 lg:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2 lg:px-4 py-3 text-xs lg:text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-1 lg:space-x-2 flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-black text-white border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0">
                      {tab.icon({ color: activeTab === tab.id ? "text-white" : "text-gray-600" })}
                    </div>
                    <span className="whitespace-nowrap text-xs lg:text-sm"><Translate text={tab.label} /></span>
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
                                  pt: "Mergulhar na Programação Vibe",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "Master modern development tools like Cursor and v0. Nature makes you enjoy the day even while Claude Sonnet is thinking. Our 500 Mbps fiber internet and distraction-free environment will boost your productivity.",
                                  es: "Dominá herramientas de desarrollo modernas como Cursor y v0. La naturaleza te hace disfrutar el día incluso mientras Claude Sonnet está pensando. Nuestro internet de fibra de 500 Mbps y ambiente libre de distracciones aumentará tu productividad.",
                                  pt: "Domine ferramentas modernas de desenvolvimento como Cursor e v0. A natureza faz você aproveitar o dia mesmo enquanto Claude Sonnet está pensando. Nossa internet de fibra de 500 Mbps e ambiente livre de distrações aumentará sua produtividade.",
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
                                  pt: "Aprender Modelagem 3D",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "Explore tools like Plasticity (it's like Figma for 3D) and bring your design ideas to life in our inspiring forest setting. I'll even borrow you a 3D printer if you try to connect it to local Wi-Fi.",
                                  es: "Explorá herramientas como Plasticity (es como Figma para 3D) y da vida a tus ideas de diseño en nuestro entorno inspirador del bosque. Incluso te presto una impresora 3D si intentás conectarla al Wi-Fi local.",
                                  pt: "Explore ferramentas como Plasticity (é como Figma para 3D) e dê vida às suas ideias de design em nosso ambiente inspirador da floresta. Eu até empresto uma impressora 3D se você tentar conectá-la ao Wi-Fi local.",
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
                                  pt: "Impulsione sua Carreira Remota",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "Use your time at IL BUCO to refine your remote work skills, update your portfolio, or network with other professionals staying at the villa.",
                                  es: "Usá tu tiempo en IL BUCO para perfeccionar tus habilidades de trabajo remoto, actualizar tu portafolio, o hacer networking con otros profesionales que se hospedan en la villa.",
                                  pt: "Use seu tempo no IL BUCO para aperfeiçoar suas habilidades de trabalho remoto, atualizar seu portfólio, ou fazer networking com outros profissionais hospedados na villa.",
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
                                  pt: "Finalmente Lance sua Startup",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "The peaceful environment and minimal distractions make IL BUCO ideal for developing your business plan, building your MVP, or preparing for launch.",
                                  es: "El ambiente pacífico y las mínimas distracciones hacen que IL BUCO sea ideal para desarrollar tu plan de negocios, construir tu MVP, o prepararte para el lanzamiento.",
                                  pt: "O ambiente pacífico e as mínimas distrações fazem do IL BUCO ideal para desenvolver seu plano de negócios, construir seu MVP, ou se preparar para o lançamento.",
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
                                  pt: "Finanças",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "My favorites are this course on financial accounting, the book A Random Walk Down Wall Street, and this international tax course.",
                                  es: "Mis favoritos son este curso de contabilidad financiera, el libro A Random Walk Down Wall Street, y este curso de impuestos internacionales.",
                                  pt: "Meus favoritos são este curso de contabilidade financeira, o livro A Random Walk Down Wall Street, e este curso de impostos internacionais.",
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
                                  pt: "Escreva seu Livro ou Blog",
                                }}
                              />
                            </h3>
                            <p className="text-gray-600 mt-2">
                              <Translate
                                text={{
                                  en: "Many guests find that the tranquil setting of IL BUCO, surrounded by swaying pine trees, provides the perfect inspiration for writing projects.",
                                  es: "Muchos huéspedes encuentran que el entorno tranquilo de IL BUCO, rodeado de pinos que se mecen, proporciona la inspiración perfecta para proyectos de escritura.",
                                  pt: "Muitos hóspedes descobrem que o ambiente tranquilo do IL BUCO, cercado por pinheiros balançantes, oferece a inspiração perfeita para projetos de escrita.",
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
                        <Translate text={placesNearbyTranslations.nature.title} />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate text={placesNearbyTranslations.nature.description} />
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
                            <BeachDescription />
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
                          <span className="text-emerald-600 text-2xl flex-shrink-0 mr-3 mt-1">🌲</span>
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
                          <span className="text-orange-600 text-2xl flex-shrink-0 mr-3 mt-1">🚴</span>
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.nature.cycling.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.nature.cycling.description} />
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
                          <span className="text-rose-600 text-2xl flex-shrink-0 mr-3 mt-1">📸</span>
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.nature.photography.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.nature.photography.description} />
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
                        <Translate text={placesNearbyTranslations.activities.title} />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate text={placesNearbyTranslations.activities.description} />
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
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm inline-flex items-center mr-3"
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
                        <Translate text={placesNearbyTranslations.food.title} />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate text={placesNearbyTranslations.food.description} />
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Meat color="text-amber-700" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.food.parrilla.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.food.parrilla.description} />
                            </p>
                            <p className="text-gray-600 mt-1 text-sm">
                              <Translate text={placesNearbyTranslations.food.parrilla.recommendations} />
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
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.food.pizza.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.food.pizza.description} />
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
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.food.bakery.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.food.bakery.description} />
                            </p>
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
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.food.burgers.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.food.burgers.description} />
                            </p>
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
                            <h3 className="text-xl font-semibold">
                              <Translate text={placesNearbyTranslations.food.frenchCafe.title} />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate text={placesNearbyTranslations.food.frenchCafe.description} />
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Masse+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <Icons.GoogleMaps />
                                <span>Google Maps</span>
                              </a>
                              <a
                                href="https://www.instagram.com/masse.carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                              >
                                <Icons.Instagram />
                                <span>@masse.carilo</span>
                              </a>
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
                        <Translate text={placesNearbyTranslations.shopping.title} />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate text={placesNearbyTranslations.shopping.description} />
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Chicho */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.chicho.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Proveedur%C3%ADa+Chicho+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.instagram.com/proveeduria_chicho_esta_loco/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            @proveeduria_chicho_esta_loco
                          </a>
                        </p>
                      </div>

                      {/* Menor Coste */}
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.menorCoste.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=La+Proveedur%C3%ADa+Menor+Coste+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.instagram.com/menorcoste/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            @menorcoste
                          </a>
                        </p>
                      </div>

                      {/* Coto */}
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.coto.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Coto+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.cotodigital3.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Website />
                            cotodigital3.com.ar
                          </a>
                        </p>
                      </div>

                      {/* Disco */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.supermarkets.disco.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Disco+Pinamar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.disco.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Website />
                            disco.com.ar
                          </a>
                        </p>
                      </div>

                      {/* Belén */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.fruitVeg.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.fruitVeg.belen.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Verduler%C3%ADa+Bel%C3%A9n+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                        </p>
                      </div>

                      {/* Boutique de Frutas */}
                      <div className="bg-gradient-to-br from-yellow-50 to-lime-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                          <Translate text={placesNearbyTranslations.shopping.fruitVeg.title} />
                        </h3>
                        <p className="text-gray-700">
                          <Translate text={placesNearbyTranslations.shopping.fruitVeg.boutique.description} />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Boutique+de+Frutas+Caril%C3%B3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#4285F4] hover:text-[#3367D6] transition-colors text-sm mr-3 inline-flex items-center"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.instagram.com/boutique_de_frutas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E1306C] hover:text-[#C13584] transition-colors text-sm inline-flex items-center"
                          >
                            <Icons.Instagram />
                            @boutique_de_frutas
                          </a>
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