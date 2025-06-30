import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Leaf, ArrowRight, TreePine, Waves, Sun, Heart } from "lucide-react"
import { HeroImage } from "@/components/hero-image"

export const metadata: Metadata = {
  title: "Ecolodge Argentina 2025 | Eco-Lodges & Argentina Eco Vacations",
  description: "Discover sustainable ecolodge experiences in Argentina. Forest-to-ocean eco accommodations in Cariló combining environmental consciousness with luxury comfort.",
  keywords: "ecolodge argentina, eco-lodges in argentina, argentina eco vacations, sustainable tourism argentina, forest lodge argentina",
  openGraph: {
    title: "Ecolodge Argentina 2025 | Eco-Lodges & Argentina Eco Vacations",
    description: "Discover sustainable ecolodge experiences in Argentina. Forest-to-ocean eco accommodations in Cariló combining environmental consciousness with luxury comfort.",
    type: "website",
    url: "https://ilbuco.com.ar/en/ecolodge-argentina",
    images: [
      {
        url: "https://ik.imagekit.io/icons8/ilbuco/gallery/hero-villa-garden.jpeg?tr=w-1200,h-630",
        width: 1200,
        height: 630,
        alt: "Ecolodge Argentina - Il Buco forest accommodation",
      },
    ],
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/en/ecolodge-argentina",
  },
}

export default function EcolodgeArgentina() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-black">Ecolodge</span>{" "}
                  <span className="text-gray-600">Argentina</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Experience sustainable luxury at Argentina's premier forest-to-ocean ecolodge. 
                  Nestled in Cariló's pine forest, just minutes from pristine Atlantic beaches, 
                  we offer <Link href="/en/argentina-eco-vacations" className="text-gray-700 no-underline hover:text-gray-900">eco-conscious accommodations</Link> that honor nature.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="https://book.ilbuco.com.ar"
                    className="inline-flex items-center px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Book Eco Stay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/rooms"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Explore Eco Suites
                  </Link>
                </div>
              </div>
              <div className="relative">
                <HeroImage 
                  src="/gallery/hero-villa-garden.jpeg"
                  alt="Ecolodge Argentina - Il Buco surrounded by pine forest and garden"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Eco-Lodges in Argentina Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Eco-Lodges in Argentina</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Forest Integration</h3>
                <p className="text-gray-700">
                  Our ecolodge is thoughtfully integrated into Cariló's native pine forest, 
                  preserving existing trees and natural ecosystems while providing luxury comfort.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Waves className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ocean Proximity</h3>
                <p className="text-gray-700">
                  Located just 150 meters from the Atlantic Ocean, experience the unique 
                  combination of forest tranquility and coastal energy in Argentina's premier eco-destination.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
                <p className="text-gray-700">
                  From water conservation systems to local sourcing, our eco-lodge operates 
                  with minimal environmental impact while maximizing your connection to nature.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Argentina Eco Vacations Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Argentina Eco Vacations</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Sustainable Forest Experiences</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Forest walks through native pine ecosystems
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Bird watching and wildlife observation
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Eco-friendly cycling through forest trails
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Organic gardening and permaculture activities
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Ocean Conservation Activities</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Beach cleanup and conservation programs
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Sustainable surfing and water sports
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Marine life education experiences
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Coastal ecosystem exploration
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center">Sustainable Tourism Argentina</h3>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                  Our approach to <Link href="/en/eco-lodges-argentina" className="text-gray-700 no-underline hover:text-gray-900">sustainable tourism</Link> demonstrates how luxury accommodation can coexist 
                  harmoniously with environmental preservation. Every stay contributes to local conservation 
                  efforts and community development in Argentina's coastal ecosystems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Eco Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Ecolodge Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Sun className="h-6 w-6 text-yellow-600 mr-3" />
                  <h3 className="text-xl font-semibold">Renewable Energy Systems</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Solar-powered systems and energy-efficient design minimize our carbon footprint 
                  while ensuring all modern comforts for our eco-conscious guests.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Solar water heating systems</li>
                  <li>• LED lighting throughout</li>
                  <li>• Energy-efficient appliances</li>
                  <li>• Natural ventilation design</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold">Local Community Support</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We partner with local artisans, organic farmers, and conservation groups 
                  to ensure your eco-vacation supports the broader Cariló community.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Local sourcing for amenities</li>
                  <li>• Community conservation projects</li>
                  <li>• Regional artisan partnerships</li>
                  <li>• Environmental education programs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Forest to Ocean Experience */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Forest to Ocean Experience</h2>
            
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-8">
                Experience the rare combination of ancient pine forest and pristine Atlantic coastline. 
                Our ecolodge offers the unique opportunity to wake up in the forest and walk to the ocean 
                within minutes, all while maintaining the highest standards of environmental responsibility.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">150m</div>
                  <p className="text-gray-600">To Ocean</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <p className="text-gray-600">Forest Integrated</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">Native</div>
                  <p className="text-gray-600">Pine Forest</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Zero</div>
                  <p className="text-gray-600">Tree Removal</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Why Choose Our Argentina Ecolodge?</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <strong>Authentic Ecosystem</strong>
                    <p className="text-gray-600 mt-1">Genuine forest-to-ocean environment without artificial intervention</p>
                  </div>
                  <div>
                    <strong>Luxury Sustainability</strong>
                    <p className="text-gray-600 mt-1">Premium comfort with minimal environmental impact</p>
                  </div>
                  <div>
                    <strong>Conservation Impact</strong>
                    <p className="text-gray-600 mt-1">Every stay supports local environmental preservation efforts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready for Your Argentina Eco Vacation?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover sustainable luxury where Argentina's coastal forest meets the Atlantic Ocean. 
              Book your ecolodge experience in nature's perfect balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacts"
                className="inline-flex items-center px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Plan Your Eco Stay
              </Link>
              <Link
                href="https://book.ilbuco.com.ar"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
              >
                Check Availability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}