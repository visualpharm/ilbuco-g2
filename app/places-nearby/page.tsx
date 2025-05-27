"use client"
import Link from "next/link"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { placesNearbyTranslations } from "@/translations/places-nearby"

// Icon components with dynamic colors
const Icons = {
  // Activity Icons
  Gym: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12M6 12h12M6 16h12" />
    </svg>
  ),
  Horse: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h8" />
    </svg>
  ),
  Tennis: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Bike: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M12 19v-4l-3-3 4-3 2 3h2" />
    </svg>
  ),
  Art: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M15.24 15.24a3 3 0 01-4.24-4.24" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </svg>
  ),
  
  // Food Icons
  Restaurant: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v8" />
    </svg>
  ),
  Pizza: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Meat: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  ),
  
  // Shopping Icons
  ShoppingBag: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  ShoppingCart: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  Fruit: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 3a9 9 0 016.894 14.786c-.265.331-.61.583-1.025.752L12 21l-5.87-2.462A3.012 3.012 0 014 16V9a9 9 0 018-6z" />
      <path d="M12 5v10" />
    </svg>
  ),
  
  // Nature Icons
  Beach: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16s1-2 5-2 5 2 9 2 5-2 5-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12s1-2 5-2 5 2 9 2 5-2 5-2" />
    </svg>
  ),
  Tree: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V6M12 6l-4 4M12 6l4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 10-8 0 4 4 0 008 0z" />
    </svg>
  ),
  
  // Work Icons
  Laptop: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3v4M8 3v4" />
    </svg>
  ),
  Finance: ({ color }: { color: string }) => (
    <svg className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16M6 16l2.5 2.5M18 16l-2.5 2.5M6 8l2.5-2.5M18 8l-2.5-2.5" />
    </svg>
  ),
  
  // Social & Web Links (Windows 11 Style)
  GoogleMaps: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 inline-block mr-1.5 text-[#4285F4] ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C7.8 2 4.4 5.4 4.4 9.6c0 4.2 7.6 12.4 7.6 12.4s7.6-8.2 7.6-12.4C19.6 5.4 16.2 2 12 2zm0 7.6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  ),
  Instagram: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 inline-block mr-1.5 text-[#E1306C] ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.45.183-.802.398-1.15.748-.35.35-.566.7-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.044.976.207 1.504.344 1.857.182.45.398.8.748 1.15.35.35.7.565 1.15.747.353.137.882.3 1.857.344 1.054.046 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.45-.182.8-.398 1.15-.748.35-.35.566-.7.748-1.15.137-.352.3-.88.344-1.857.047-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.044-.976-.207-1.504-.344-1.857a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.047-1.37-.059-4.04-.059zm0 12.297a4.099 4.099 0 110-8.198 4.099 4.099 0 010 8.198zm0-6.797a2.699 2.699 0 100 5.398 2.699 2.699 0 000-5.398zm5.292-3.5a1.002 1.002 0 11-2.003 0 1.002 1.002 0 012.003 0z" />
    </svg>
  ),
  Website: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 inline-block mr-1.5 text-blue-600 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  )
}
// Icons8 icons (iOS Glyph style SVG)
const Icons8 = {
  // Tab Icons (Icons8 iOS Glyph PNG)
  activities: 'https://img.icons8.com/ios-glyphs/24/000000/dumbbell--v1.png',
  food: 'https://img.icons8.com/ios-glyphs/24/000000/restaurant--v1.png',
  shopping: 'https://img.icons8.com/ios-glyphs/24/000000/shopping-bag--v1.png',
  nature: 'https://img.icons8.com/ios-glyphs/24/000000/deciduous-tree.png',
  work: 'https://img.icons8.com/ios-glyphs/24/000000/laptop--v1.png',

  // Activity Icons
  gym: 'https://img.icons8.com/ios-glyphs/24/000000/weightlift--v1.png',
  windsurfing: 'https://img.icons8.com/ios-glyphs/24/000000/windsurfing--v1.png',
  tennis: 'https://img.icons8.com/ios-glyphs/24/000000/tennis-ball--v1.png',
  padel: 'https://img.icons8.com/ios-glyphs/24/000000/tennis-racket.png',
  horse: 'https://img.icons8.com/ios-glyphs/24/000000/horse--v1.png',
  bike: 'https://img.icons8.com/ios-glyphs/24/000000/bicycle--v1.png',
  art: 'https://img.icons8.com/ios-glyphs/24/000000/paint-palette--v1.png',

  // Social Icons (using brand colors)
  googleMaps: 'https://img.icons8.com/ios-glyphs/24/4285F4/google-maps.png',
  instagram: 'https://img.icons8.com/ios-glyphs/24/E1306C/instagram-new--v1.png'
};

function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function ThingsToDo() {
  const [activeTab, setActiveTab] = useState("activities")

  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, icon: Icons8.activities },
    { id: "food", label: placesNearbyTranslations.tabs.food, icon: Icons8.food },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, icon: Icons8.shopping },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, icon: Icons8.nature },
    { id: "work", label: placesNearbyTranslations.tabs.work, icon: Icons8.work },
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
                    {tab.id === 'activities' && <Icons.Gym color="text-indigo-700" />}
{tab.id === 'food' && <Icons.Restaurant color="text-amber-700" />}
{tab.id === 'shopping' && <Icons.ShoppingBag color="text-pink-700" />}
{tab.id === 'nature' && <Icons.Beach color="text-green-700" />}
{tab.id === 'work' && <Icons.Laptop color="text-gray-700" />}
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
                                  es: "💻 Sumergirse en la Programación Vibe",
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

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Icons.Finance color="text-green-700" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Translate
                                text={{
                                  en: "📊 Finance",
                                  es: "📊 Finanzas",
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

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.tennis} alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
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
                          <span className="text-indigo-600 text-2xl flex-shrink-0">􀧵</span>
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
                          <Icons.Finance color="text-amber-700" />
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
                          }}
                        />
                      </h2>
                      <p className="text-lg text-gray-700">
                        <Translate
                          text={{
                            en: "Cariló's unique combination of pristine beaches and wild pine forests offers endless opportunities for outdoor exploration.",
                            es: "La combinación única de Cariló de playas prístinas y bosques de pinos salvajes ofrece infinitas oportunidades para la exploración al aire libre.",
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
                                }}
                              />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate
                                text={{
                                  en: "Cariló's beautiful beaches are just a short walk away. Enjoy swimming, sunbathing, beach volleyball, or simply relaxing by the ocean with the sound of waves.",
                                  es: "Las hermosas playas de Cariló están a solo un corto paseo. Disfrutá nadar, tomar sol, jugar al vóley playa, o simplemente relajarte junto al océano con el sonido de las olas.",
                                }}
                              />
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>
                                • <Translate text={{ en: "Swimming in the Atlantic", es: "Nadar en el Atlántico" }} />
                              </li>
                              <li>
                                • <Translate text={{ en: "Beach volleyball courts", es: "Canchas de vóley playa" }} />
                              </li>
                              <li>
                                • <Translate text={{ en: "Sunrise/sunset watching", es: "Ver el amanecer/atardecer" }} />
                              </li>
                              <li>
                                • <Translate
                                  text={{ en: "Shell collecting walks", es: "Caminatas para recolectar conchas" }}
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
                                }}
                              />
                            </h3>
                            <p className="text-gray-700 mt-2">
                              <Translate
                                text={{
                                  en: "Explore the unique pine forests of Cariló through numerous walking trails. The peaceful environment is perfect for meditation and mindfulness practices.",
                                  es: "Explorá los bosques de pinos únicos de Cariló a través de numerosos senderos para caminar. El ambiente tranquilo es perfecto para la meditación y las prácticas de mindfulness.",
                                }}
                              />
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>
                                • <Translate
                                  text={{ en: "Nature walking trails", es: "Senderos naturales para caminar" }}
                                />
                              </li>
                              <li>
                                • <Translate text={{ en: "Meditation spots", es: "Lugares para meditar" }} />
                              </li>
                              <li>
                                • <Translate
                                  text={{ en: "Photography opportunities", es: "Oportunidades para fotografiar" }}
                                />
                              </li>
                              <li>
                                • <Translate
                                  text={{ en: "Wildlife observation", es: "Observación de la vida silvestre" }}
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
                                  text={{ en: "Regular bike rentals", es: "Alquiler de bicicletas regulares" }}
                                />
                              </li>
                              <li>
                                • <Translate text={{ en: "Fat bike adventures", es: "Aventuras en fat bike" }} />
                              </li>

                              <li>
                                • <Translate
                                  text={{ en: "Forest trail cycling", es: "Ciclismo por senderos forestales" }}
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
                                • <Translate text={{ en: "Landscape photography", es: "Fotografía de paisajes" }} />
                              </li>
                              <li>
                                • <Translate text={{ en: "Plein air painting", es: "Pintura al aire libre" }} />
                              </li>
                              <li>
                                • <Translate text={{ en: "Nature sketching", es: "Bocetos de la naturaleza" }} />
                              </li>
                              <li>
                                • <Translate text={{ en: "Golden hour sessions", es: "Sesiones de la hora dorada" }} />
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
                          <img src={Icons8.gym} alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Gym</h3>
                            <p className="text-gray-700 mt-2">
                              Full-service indoor gym surrounded by forest with daily, weekly, and monthly passes. Good
                              private instruction is included in the price.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=CIE+Centro+de+Entrenamiento+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/somos_cie/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @somos_cie
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.windsurfing} alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Windsurfing</h3>
                            <p className="text-gray-700 mt-2">
                              Learn windsurfing on the Atlantic coast with professional instruction and equipment
                              rental.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Coco+Surf+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/coco.surf.carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @coco.surf.carilo
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.tennis} alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Tennis & Padel</h3>
                            <p className="text-gray-700 mt-2">
                              Clay courts, padel, 5-a-side football, and a small indoor gym. They rent rackets and give
                              classes.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Caril%C3%B3+Tennis+Club"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/carilotennis.club/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @carilotennis.club
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.gym} alt="Calisthenics" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Outdoor Calisthenics</h3>
                            <p className="text-gray-700 mt-2">
                              Free 24-hour outdoor calisthenics gym with bars and parallettes.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Parque+de+Calistenia+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.horse} alt="Horse Riding" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Horse Riding</h3>
                            <p className="text-gray-700 mt-2">Horse riding through dunes and forest.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Cabalgatas+Dos+Montes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/cabalgatasdosmontes/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @cabalgatasdosmontes
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.bike} alt="Quad Bike" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Quad & Fatbike Rental</h3>
                            <p className="text-gray-700 mt-2">Quad riding and fatbike rental.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Motorrad+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.guiadeplaya.com.ar/motorrad-carilo-alquiler-cuatriciclos.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                guiadeplaya.com.ar
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.art} alt="Ceramics" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Ceramic Classes</h3>
                            <p className="text-gray-700 mt-2">
                              Learn pottery and ceramic arts in a creative environment.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Fusion+Arte+del+Mar+Valeria+del+Mar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/fusionartedelmar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @fusionartedelmar
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.bike} alt="Off Road" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">4x4 Driving School</h3>
                            <p className="text-gray-700 mt-2">Learn to drive off-road and navigate sand dunes.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Sandmasters+Pinamar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/sandmasters_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @sandmasters_
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
                          <img src={Icons8.food} alt="Meat" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
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
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                La Parrillita
                              </a>{" "}
                              (basic in a good sense).
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=La+Cabrera+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/lacabrera_carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @lacabrera_carilo
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.food} alt="Pizza" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
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
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/__ilgattonero/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @__ilgattonero
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.food} alt="Bakery" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Bakery & Coffee</h3>
                            <p className="text-gray-700 mt-2">Great coffee and baked stuff; best avocado toast.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Il+Panettone+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/panaderia.ilpanettone/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @panaderia.ilpanettone
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.food} alt="Burger" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Gourmet Burgers</h3>
                            <p className="text-gray-700 mt-2">Best burgers. Also Impeke (Valeria del Mar).</p>
                            <p className="mt-2">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Enris+Caril%C3%B3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3 inline-flex items-center"
                              >
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <a
                                href="https://www.instagram.com/enris.ar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm inline-flex items-center"
                              >
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
                                @enris.ar
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <img src={Icons8.food} alt="Cafe" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" />
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
                                <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                                Google Maps
                              </a>
                              <span className="flex items-center">
                                <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
                            <img src={Icons8.googleMaps} alt="Google Maps" width={16} height={16} className="mr-1 inline" />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <img src={Icons8.instagram} alt="Instagram" width={16} height={16} className="mr-1 inline" />
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
