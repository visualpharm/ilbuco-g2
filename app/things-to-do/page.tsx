"use client"
import Link from "next/link"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Code,
  Calculator,
  CuboidIcon as Cube,
  Briefcase,
  Rocket,
  Waves,
  TreePine,
  UtensilsCrossed,
  Bike,
  Dumbbell,
  BookOpen,
  Coffee,
  Camera,
} from "lucide-react"

export default function ThingsToDo() {
  const [activeTab, setActiveTab] = useState("nature")

  const tabs = [
    { id: "nature", label: "🌊 Beach & Nature", icon: Waves },
    { id: "activities", label: "🏞️ Activities", icon: Dumbbell },
    { id: "food", label: "🍽️ Dining", icon: UtensilsCrossed },
    { id: "work", label: "💻 Work & Learning", icon: Code },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">🎯 Things to Do</h1>
              <p className="text-lg text-gray-700 mb-12">
                IL BUCO is designed to be the perfect environment for both <strong>productivity</strong> and{" "}
                <em>relaxation</em>. Whether you're looking to make progress on work projects, learn new skills, or
                simply unwind in a beautiful natural setting, our villa offers the ideal backdrop for your goals.
              </p>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-black text-white border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
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
                        🚀 <strong>Achieve Your Long-Standing Goals</strong>
                      </h2>
                      <p className="text-lg text-gray-700">
                        With our <em>high-speed internet</em> and comfortable workspaces, IL BUCO is the perfect place
                        to focus on your most important projects.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-start mb-4">
                          <Code className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              💻 <strong>Diving into Vibe Coding</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Master modern development tools like <em>Cursor</em> and <em>v0</em>. Build that app
                              you've been dreaming about with our <strong>500 Mbps fiber internet</strong> and
                              distraction-free environment.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-start mb-4">
                          <Calculator className="h-6 w-6 mr-3 mt-1 text-green-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              📊 <strong>Master Financial Accounting</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Take advantage of the <em>quiet environment</em> to focus on learning financial
                              principles. Perfect for completing online courses like{" "}
                              <Link
                                href="#"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                this comprehensive course
                              </Link>
                              .
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                        <div className="flex items-start mb-4">
                          <Cube className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🎨 <strong>Learn 3D Modeling</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Explore tools like{" "}
                              <Link
                                href="#"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                Plasticity
                              </Link>{" "}
                              (<em>it's like Figma for 3D</em>) and bring your design ideas to life in our inspiring
                              forest setting.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-start mb-4">
                          <Briefcase className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              💼 <strong>Boost Your Remote Career</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Use your time at IL BUCO to <em>refine your remote work skills</em>, update your
                              portfolio, or network with other professionals staying at the villa.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="flex items-start mb-4">
                          <Rocket className="h-6 w-6 mr-3 mt-1 text-red-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🚀 <strong>Finally Launch Your Startup</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              The <strong>peaceful environment</strong> and <em>minimal distractions</em> make IL BUCO
                              ideal for developing your business plan, building your MVP, or preparing for launch.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                        <div className="flex items-start mb-4">
                          <BookOpen className="h-6 w-6 mr-3 mt-1 text-indigo-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              📚 <strong>Write Your Book or Blog</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Many guests find that the <em>tranquil setting</em> of IL BUCO, surrounded by{" "}
                              <strong>swaying pine trees</strong>, provides the perfect inspiration for writing
                              projects.
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
                        🌊 <strong>Beach & Forest Adventures</strong>
                      </h2>
                      <p className="text-lg text-gray-700">
                        Cariló's unique combination of <em>pristine beaches</em> and <strong>wild pine forests</strong>{" "}
                        offers endless opportunities for outdoor exploration.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🏖️ <strong>Beach Activities</strong>
                            </h3>
                            <p className="text-gray-700 mt-2">
                              Cariló's <em>beautiful beaches</em> are just a <strong>short walk</strong> away. Enjoy
                              swimming, sunbathing, beach volleyball, or simply relaxing by the ocean with the sound of
                              waves.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>• 🏊‍♀️ Swimming in the Atlantic</li>
                              <li>• 🏐 Beach volleyball courts</li>
                              <li>• 🌅 Sunrise/sunset watching</li>
                              <li>• 🐚 Shell collecting walks</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <TreePine className="h-6 w-6 mr-3 mt-1 text-green-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🌲 <strong>Forest Walks & Meditation</strong>
                            </h3>
                            <p className="text-gray-700 mt-2">
                              Explore the <em>unique pine forests</em> of Cariló through numerous walking trails. The
                              <strong>peaceful environment</strong> is perfect for meditation and mindfulness practices.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>• 🚶‍♀️ Nature walking trails</li>
                              <li>• 🧘‍♀️ Meditation spots</li>
                              <li>• 📸 Photography opportunities</li>
                              <li>• 🦋 Wildlife observation</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Bike className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🚴‍♀️ <strong>Cycling Adventures</strong>
                            </h3>
                            <p className="text-gray-700 mt-2">
                              Rent bicycles and explore Cariló and surrounding areas. The town's{" "}
                              <em>unpaved sandy streets</em>
                              and <strong>natural setting</strong> make for a pleasant cycling experience.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>• 🚲 Regular bike rentals</li>
                              <li>• 🏔️ Fat bike adventures</li>
                              <li>• 🗺️ Guided cycling tours</li>
                              <li>• 🌳 Forest trail cycling</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Camera className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              📸 <strong>Photography & Art</strong>
                            </h3>
                            <p className="text-gray-700 mt-2">
                              The <em>natural light</em> and <strong>inspiring views</strong> make IL BUCO perfect for
                              photography, drawing, painting, or other creative pursuits.
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 space-y-1">
                              <li>• 📷 Landscape photography</li>
                              <li>• 🎨 Plein air painting</li>
                              <li>• ✏️ Nature sketching</li>
                              <li>• 🌅 Golden hour sessions</li>
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
                        🏞️ <strong>Nearby Activities & Services</strong>
                      </h2>
                      <p className="text-lg text-gray-700">
                        All destinations are within a 20–30-minute walk or a short drive from Il Buco.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1">🎾</span>
                          <div>
                            <h3 className="text-xl font-semibold">Cariló Tennis Club</h3>
                            <p className="text-gray-700 mt-2">
                              Clay courts, padel, 5-a-side football, and a small indoor gym. They rent rackets and give
                              classes.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/carilotennis.club/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @carilotennis.club
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Dumbbell className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Centro Integral de Entrenamiento (CIE)</h3>
                            <p className="text-gray-700 mt-2">
                              Full-service indoor gym with daily, weekly, and monthly passes. Good private instruction
                              is included in the price.
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/somos_cie/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @somos_cie
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Dumbbell className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Aire Libre, Libre</h3>
                            <p className="text-gray-700 mt-2">
                              Free 24-hour outdoor calisthenics gym with bars and parallettes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1">🐎</span>
                          <div>
                            <h3 className="text-xl font-semibold">Cabalgatas Dos Montes</h3>
                            <p className="text-gray-700 mt-2">Horse riding through dunes and forest.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/cabalgatasdosmontes/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @cabalgatasdosmontes
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Bike className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Motorrad Cariló</h3>
                            <p className="text-gray-700 mt-2">Quad riding and fatbike rental.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.guiadeplaya.com.ar/motorrad-carilo-alquiler-cuatriciclos.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                Website
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
                        🍽️ <strong>Dining & Coffee Recommendations</strong>
                      </h2>
                      <p className="text-lg text-gray-700">
                        From world-class Argentine steakhouses to artisanal coffee shops, Cariló offers a sophisticated
                        dining scene in a relaxed coastal setting.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">La Cabrera</h3>
                            <p className="text-gray-700 mt-2">The greatest parrilla with lots of free extras.</p>
                            <p className="text-gray-600 mt-1">
                              Also recommended: Don Benito (poshy), De Mi Campo (salad bar!), La Parrillita (Valeria del
                              Mar) (basic in a good sense).
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/lacabrera_carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @lacabrera_carilo
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Il Gatto Nero (Valeria del Mar)</h3>
                            <p className="text-gray-700 mt-2">
                              Award-winning Napoletan pizza from the Italian chefs (they also made our sofas).
                            </p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/__ilgattonero/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @__ilgattonero
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Coffee className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Panettone</h3>
                            <p className="text-gray-700 mt-2">Great coffee and baked stuff; best avocado toast.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/panaderia.ilpanettone/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @panaderia.ilpanettone
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Enri's Cariló</h3>
                            <p className="text-gray-700 mt-2">Best burgers. Also Impeke (Valeria del Mar).</p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/enris.ar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @enris.ar
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Coffee className="h-6 w-6 mr-3 mt-1 text-gray-700" />
                          <div>
                            <h3 className="text-xl font-semibold">Masse</h3>
                            <p className="text-gray-700 mt-2">Always open.</p>
                            <p className="mt-2">
                              <a
                                href="https://www.instagram.com/masse.carilo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @masse.carilo
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  🎯 <strong>Ready to Achieve Your Goals?</strong>
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Whether you want to <em>boost your productivity</em>, <strong>explore nature</strong>, or simply relax
                  in a beautiful setting, IL BUCO provides the perfect environment for your next chapter.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                >
                  🚀 Book Your Transformative Stay
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
