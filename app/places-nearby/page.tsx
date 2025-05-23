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
  Instagram,
  ShoppingBag,
} from "lucide-react"

export default function ThingsToDo() {
  const [activeTab, setActiveTab] = useState("activities")

  const tabs = [
    { id: "activities", label: "🏞️ Activities", icon: Dumbbell },
    { id: "food", label: "🍽️ Dining", icon: UtensilsCrossed },
    { id: "shopping", label: "🛍️ Shopping", icon: ShoppingBag },
    { id: "nature", label: "🌊 Beach & Nature", icon: Waves },
    { id: "work", label: "💻 Work & Learning", icon: Code },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">🌴 Places Nearby</h1>
              <p className="text-lg text-gray-700 mb-12 text-center">
                These are mostly the places we use regularly, with few exception (like sports we don't practice).
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
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Code className="h-6 w-6 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              💻 <strong>Diving into Vibe Coding</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Master modern development tools like <em>Cursor</em> and <em>v0</em>. Nature makes you
                              enjoy the day even while Claude Sonnet is thinking. Our{" "}
                              <strong>500 Mbps fiber internet</strong> and distraction-free environment will boost your
                              productivity.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Calculator className="h-6 w-6 mr-3 mt-1 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              📊 <strong>Finance</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              My favorites are{" "}
                              <a
                                href="https://www.coursera.org/learn/wharton-accounting"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                this course
                              </a>{" "}
                              on financial accounting, the book{" "}
                              <a
                                href="https://press.princeton.edu/books/paperback/9780691219691/a-random-walk-down-wall-street"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                A Random Walk Down Wall Street
                              </a>
                              , and{" "}
                              <a
                                href="https://www.coursera.org/account/accomplishments/verify/Q75QFJAC9R7D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                this international tax course
                              </a>
                              .
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Cube className="h-6 w-6 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">
                              🎨 <strong>Learn 3D Modeling</strong>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              Explore tools like{" "}
                              <a
                                href="https://plasticity.xyz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                              >
                                Plasticity
                              </a>{" "}
                              (<em>it's like Figma for 3D</em>) and bring your design ideas to life in our inspiring
                              forest setting. I'll even borrow you a 3D printer if you try to connect it to local Wi-Fi.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Briefcase className="h-6 w-6 mr-3 mt-1 text-orange-600 flex-shrink-0" />
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

                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Rocket className="h-6 w-6 mr-3 mt-1 text-red-600 flex-shrink-0" />
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

                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <BookOpen className="h-6 w-6 mr-3 mt-1 text-cyan-600 flex-shrink-0" />
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
                          <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600 flex-shrink-0" />
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
                          <TreePine className="h-6 w-6 mr-3 mt-1 text-green-600 flex-shrink-0" />
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
                          <Bike className="h-6 w-6 mr-3 mt-1 text-orange-600 flex-shrink-0" />
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

                              <li>• 🌳 Forest trail cycling</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Camera className="h-6 w-6 mr-3 mt-1 text-purple-600 flex-shrink-0" />
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
                        All destinations are within a 25–35-minute walk or a short drive from Il Buco.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Dumbbell className="h-6 w-6 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Gym</h3>
                            <p className="text-gray-700 mt-2">
                              Full-service indoor gym surrounded by forest with daily, weekly, and monthly passes. Good
                              private instruction is included in the price.
                            </p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1 flex-shrink-0">🎾</span>
                          <div>
                            <h3 className="text-xl font-semibold">Tennis & Padel</h3>
                            <p className="text-gray-700 mt-2">
                              Clay courts, padel, 5-a-side football, and a small indoor gym. They rent rackets and give
                              classes.
                            </p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Dumbbell className="h-6 w-6 mr-3 mt-1 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Outdoor Calisthenics</h3>
                            <p className="text-gray-700 mt-2">
                              Free 24-hour outdoor calisthenics gym with bars and parallettes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1 flex-shrink-0">🐎</span>
                          <div>
                            <h3 className="text-xl font-semibold">Horse Riding</h3>
                            <p className="text-gray-700 mt-2">Horse riding through dunes and forest.</p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Bike className="h-6 w-6 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Quad & Fatbike Rental</h3>
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

                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1 flex-shrink-0">🎨</span>
                          <div>
                            <h3 className="text-xl font-semibold">Ceramic Classes</h3>
                            <p className="text-gray-700 mt-2">
                              Learn pottery and ceramic arts in a creative environment.
                            </p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                              <a
                                href="https://www.instagram.com/fusionartedelmar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                @fusionartedelmar
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <span className="text-2xl mr-3 mt-1 flex-shrink-0">🚙</span>
                          <div>
                            <h3 className="text-xl font-semibold">4x4 Driving School</h3>
                            <p className="text-gray-700 mt-2">Learn to drive off-road and navigate sand dunes.</p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                              <a
                                href="https://www.instagram.com/sandmasters_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
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
                        🍽️ <strong>Dining & Coffee Recommendations</strong>
                      </h2>
                      <p className="text-lg text-gray-700">
                        From world-class Argentine steakhouses to artisanal coffee shops, Cariló offers a sophisticated
                        dining scene in a relaxed coastal setting.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-red-600 flex-shrink-0" />
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
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-orange-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Italian Pizza</h3>
                            <p className="text-gray-700 mt-2">
                              Award-winning Napoletan pizza from the Italian chefs (they also made our sofas).
                            </p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Coffee className="h-6 w-6 mr-3 mt-1 text-amber-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Bakery & Coffee</h3>
                            <p className="text-gray-700 mt-2">Great coffee and baked stuff; best avocado toast.</p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-green-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">Gourmet Burgers</h3>
                            <p className="text-gray-700 mt-2">Best burgers. Also Impeke (Valeria del Mar).</p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <div className="flex items-start mb-4">
                          <Coffee className="h-6 w-6 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold">French Café</h3>
                            <p className="text-gray-700 mt-2">Always open.</p>
                            <p className="mt-2 flex items-center">
                              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                {/* Shopping Tab */}
                {activeTab === "shopping" && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-4">
                        🛍️ <strong>Shopping</strong>
                      </h2>
                      <p className="text-lg text-gray-700">My Most Frequented Shops in Cariló & Valeria del Mar</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Chicho */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>Chicho</strong> – Best open hours, decent fruit and vegetables.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/proveeduria_chicho_esta_loco/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @proveeduria_chicho_esta_loco
                          </a>
                        </p>
                      </div>

                      {/* Menor Coste */}
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Supermarkets</h3>
                        <p className="text-gray-700">
                          <strong>La Proveeduría / Menor Coste</strong> – Expensive, mini Whole Foods.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/menorcoste/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @menorcoste
                          </a>
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
                            href="https://www.cotodigital3.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Website
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
                            href="https://www.disco.com.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Website
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
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/boutique_de_frutas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @boutique_de_frutas
                          </a>
                        </p>
                      </div>

                      {/* Jorjito */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                        <p className="text-gray-700">
                          <strong>Jorjito</strong> – Most complete hardware store.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/ferreteria_jorgito/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @ferreteria_jorgito
                          </a>
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
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/cabana.guerrero/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @cabana.guerrero
                          </a>
                        </p>
                      </div>

                      {/* La Constanza Cariló */}
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fish</h3>
                        <p className="text-gray-700">
                          <strong>La Constanza (Cariló)</strong> – Fresh fish, not frozen, even salmon. Closed during
                          low season.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/pescaderiasdicostanzoar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @pescaderiasdicostanzoar
                          </a>
                        </p>
                      </div>

                      {/* La Constanza Pinamar */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Fish</h3>
                        <p className="text-gray-700">
                          <strong>La Constanza (Pinamar)</strong> – Open during low season when Cariló's location is
                          closed.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/pescaderiasdicostanzoar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @pescaderiasdicostanzoar
                          </a>
                        </p>
                      </div>

                      {/* Colonial */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Ice Cream</h3>
                        <p className="text-gray-700">
                          <strong>Colonial (Valeria del Mar)</strong> – My favorite ice cream.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/colonialhelados/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @colonialhelados
                          </a>
                        </p>
                      </div>

                      {/* Lucciano's */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Ice Cream</h3>
                        <p className="text-gray-700">
                          <strong>Lucciano's</strong> – The prettiest place.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <a
                            href="https://www.instagram.com/luccianos_/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            @luccianos_
                          </a>
                        </p>
                      </div>

                      {/* Panettone */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Bakeries</h3>
                        <p className="text-gray-700">
                          <strong>Panettone</strong> – Simple.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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

                      {/* Masse */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Bakeries</h3>
                        <p className="text-gray-700">
                          <strong>Masse</strong> – Fancy breads with seeds.
                        </p>
                        <p className="mt-2 flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
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
