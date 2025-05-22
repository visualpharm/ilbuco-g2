import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Sofa,
  TreesIcon as Tree,
  ShowerHeadIcon as Shower,
  Home,
  UtensilsCrossed,
  Monitor,
  Sparkles,
  Calendar,
  Bike,
} from "lucide-react"

export default function TheHouse() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">The House</h1>

              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="IL BUCO Villa exterior"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Highlights Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Highlights</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">4 bedrooms with private bathrooms and kitchenettes</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Radiant-floor heating and 8 air-conditioners (cool + heat)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Green roof with grill and large planted terrace</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Solid structure with superior sound insulation</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Water-treatment plant with softener</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">500 Mbit Wi-Fi (fiber-to-home + mesh)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">4 bedrooms (2 people each + futon for 2 more)</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">Large shared living room with one big couch and common kitchen</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">300 L refrigerators in every kitchenette</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">5-star bedding on dense foam mattresses</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">
                      Bathrooms: glass shower screens, handheld bidet sprayers, washing machine in each
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                    <p className="text-gray-700">
                      Solid load-bearing concrete + full insulation; black double-glazed PVC windows (~50% costlier than
                      white)
                    </p>
                  </li>
                </ul>
              </div>

              {/* Layout & Rooms Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Layout & Rooms</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Home className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">4 bedrooms</h3>
                        <p className="text-gray-600">Comfortable accommodations for up to 10 guests</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Private bathroom</h3>
                        <p className="text-gray-600">Glass screen, bidet sprayer, washing machine</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Kitchenette</h3>
                        <p className="text-gray-600">300 L fridge, stove, oven, microwave, quality cookware</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Extra shared bathroom</h3>
                        <p className="text-gray-600">Additional convenience for guests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Areas Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Shared Areas</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Living Room</h3>
                        <p className="text-gray-600">Large shared living room with one big couch</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Common Kitchen</h3>
                        <p className="text-gray-600">Fully equipped for group meals and gatherings</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Green Roof</h3>
                        <p className="text-gray-600">With grill and outdoor seating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-Stay Work Package Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Long-Stay Work Package (6 months +)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Monthly discount</h3>
                        <p className="text-gray-600">Special rates for extended stays</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Ergonomic chair</h3>
                        <p className="text-gray-600">Comfortable seating for productive work sessions</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Monitor className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Optional computer monitor</h3>
                        <p className="text-gray-600">Available upon request for remote work</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Fixed monthly rent</h3>
                        <p className="text-gray-600">For 12 months + (not adjusted for high/low season)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaning Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Cleaning</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Sparkles className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Weekly cleaning of common areas included</h3>
                        <p className="text-gray-600">Regular maintenance to keep shared spaces pristine</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start mb-3">
                      <Sparkles className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">Extra in-room cleaning</h3>
                        <p className="text-gray-600">Available on request for long stays</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* House Rules Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">House Rules</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">No music audible outside your room</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">No parties — people-counting cameras in common areas</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Leave common kitchen and grill clean</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Pets allowed (hypo-allergenic fee + US $300 deposit)</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Check-in flexible: arrive early if free / smart-lock access</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Check-out flexible: stay late if no same-day check-in</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">
                        Heating, A/C, internet, electricity, water included — switch off AC & lights when leaving
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Availability & Rates Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Availability & Rates</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Open all year</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">High season: December – February</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Best rates: April – October (my favorites: Sept – Nov)</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">Minimum stay: 2 days during low season</p>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <p className="text-gray-700">12 months + stays enjoy fixed monthly rent</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bike Rental Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Bike Rental</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Bike className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <p className="text-gray-700">1 MTB (size L, Shimano Altus) on-site</p>
                    </li>
                    <li className="flex items-start">
                      <Bike className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <p className="text-gray-700">Additional bikes, including fat bikes, rentable in town</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
                <p className="text-gray-700 mb-4">
                  Ready to experience IL BUCO? Contact us to check availability and book your stay.
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
