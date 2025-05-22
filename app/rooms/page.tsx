import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Wifi, Thermometer, UtensilsCrossed, ShowerHeadIcon as Shower, Bed, LampDesk } from "lucide-react"

export default function Rooms() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Our Suites</h1>
              <p className="text-lg text-gray-700 mb-12">
                Each of our suites is uniquely designed to provide comfort, functionality, and style for both short
                stays and extended remote work periods.
              </p>

              <div className="space-y-16">
                {/* Garden Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Giardino</h2>
                  <p className="text-gray-600 mb-6">Garden Suite with Panoramic Corner Window</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <span>Step-free access for wheelchairs, strollers, and heavy luggage.</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 8h20" />
                        <path d="M12 16v-4" />
                        <path d="M8 16v-2" />
                        <path d="M16 16v-2" />
                      </svg>
                      <span>Corner window facing garden, dedicated entry hall</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>Window-side dining/work table, futon for extra bed (fee)</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/giardino_salon_view-RTleH44cmakwqXzZa2wNSPxEbXdjhI.jpeg"
                        alt="Giardino Suite - View of living area and bedroom"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/giardino_kitchen_fridge_corner-yf60SmRsEm7son2oqynRXRFtVXEuFh.jpeg"
                        alt="Giardino Suite - Kitchen with full-size refrigerator"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/giardino_dining_kitchen_gardenview-wJknYcfHtc0oeUbneuLp2bLfdV4fFa.jpeg"
                        alt="Giardino Suite - Dining area with garden view"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Terrace Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Terrazzo</h2>
                  <p className="text-gray-600 mb-6">Suite with Large Private Terrace and Live Plants</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      <span>40 m² shaded terrace with built-in planters</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>Open-plan layout: sleep, cook, work in one space</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                      <span>Abundant natural light throughout the day</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Perfect for plant lovers and outdoor enthusiasts</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrazo_forest_view-K69FhPNSqtff8uPaGJRPwc9lmDOaBT.jpeg"
                        alt="Terrace Suite - Large Private Terrace"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrazo_dining_table_tv-Ab6K9U5vyT46rADnki4xJtPc8g6yLP.jpeg"
                        alt="Terrace Suite - Dining Area"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrazo_bedroom_single_longwall-aleGMEOUDcwCzes93z3kVRdM5kpqQd.jpeg"
                        alt="Terrace Suite - Bedroom"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Forest-View Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Paraiso</h2>
                  <p className="text-gray-600 mb-6">Forest-View Suite with Separate Bedroom</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 14l-5-5-5 5" />
                        <path d="M12 9v12" />
                        <path d="M5 21h14" />
                      </svg>
                      <span>Corner window to pine forest</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>Separate bedroom + living/work room</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>Enhanced privacy with distinct living areas</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Ideal for couples or those needing separate work space</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paraiso_living_room_tv_sofa-xEFtLiFLY5FVFrCNmksJaj9ObRecdl.jpeg"
                        alt="Forest-View Suite Living Room"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paraiso_kitchen-fGnSfzXKMlGd4miPDdxGhF6NOZmglM.jpeg"
                        alt="Forest-View Suite Kitchen"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paraiso_bedroom_with_window-zh3u47jltrpQ5ALfGqnlR5luk21AmD.jpeg"
                        alt="Forest-View Suite Bedroom"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Penthouse Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Penthouse</h2>
                  <p className="text-gray-600 mb-6">Top-Floor Suite with Large Sunny Terrace</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>Top-floor suite with direct terrace access</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                      <span>Optional exclusive-use terrace (extra fee)</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>Drone views</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>Our most spacious and luxurious accommodation</span>
                    </li>
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image src="/penthouse-suite.png" alt="Penthouse Suite" fill className="object-cover" />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image src="/bathroom-shower.png" alt="Bathroom Shower" fill className="object-cover" />
                    </div>
                    <div className="relative h-[250px] rounded-lg overflow-hidden">
                      <Image src="/bathroom-washer.png" alt="Bathroom with Washer" fill className="object-cover" />
                    </div>
                  </div>
                </div>

                {/* All Suites Include */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">All Suites Include</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>500 Mbps fiber internet, mesh Wi-Fi</span>
                    </li>
                    <li className="flex items-start">
                      <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>Underfloor heating + air conditioning</span>
                    </li>
                    <li className="flex items-start">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>Kitchen: stove, oven, 300L fridge, microwave, cookware</span>
                    </li>
                    <li className="flex items-start">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>Bathroom: walk-in shower + washer</span>
                    </li>
                    <li className="flex items-start">
                      <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>Dense foam mattress with topper + 5* bedding</span>
                    </li>
                    <li className="flex items-start">
                      <LampDesk className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>Ergonomic chair (free for stays &gt; 1 month), twin beds on request</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Book Your Stay
                  </Link>
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
