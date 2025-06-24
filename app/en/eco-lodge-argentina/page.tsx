import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  TreesIcon as Tree,
  Leaf,
  Waves,
  Sun,
  Wind,
  Droplet,
  Bird,
  Recycle,
  Sun as Solar,
  Heart,
  Mountain,
  Flower,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Eco Lodge Argentina - Sustainable Accommodation in Carilo | Il Buco",
  description: "Experience Argentina's premier eco lodge in Carilo. Sustainable accommodation surrounded by pine forests and pristine beaches, with solar power and eco-friendly practices.",
  keywords: "eco lodge argentina, sustainable accommodation argentina, eco friendly hotel argentina, green travel argentina, nature lodge carilo, sustainable tourism",
  openGraph: {
    title: "Eco Lodge Argentina - Sustainable Nature Retreat in Carilo",
    description: "Stay at Argentina's most sustainable eco lodge. Solar-powered, forest-integrated accommodation with minimal environmental impact and maximum comfort.",
    url: "https://ilbuco.com/en/eco-lodge-argentina",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/photo/zona/File 24-04-2025, 10 36 15 PM (5).jpg",
        width: 1200,
        height: 630,
        alt: "Eco lodge Argentina - sustainable accommodation in forest setting",
      },
    ],
    locale: "en_US",
  },
}

export default function EcoLodgeArgentinaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-blue-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Eco Lodge
                  <span className="text-green-600"> Argentina</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Immerse yourself in Argentina's most sustainable accommodation experience. 
                  Our eco lodge in Carilo combines luxury comfort with environmental responsibility, 
                  surrounded by pristine forests and beaches.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/the-house"
                    className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    See House <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/the-house"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Virtual Tour
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/photo/zona/File 24-04-2025, 10 36 15 PM (5).jpg"
                  alt="Eco lodge Argentina surrounded by forest and nature"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Features */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Commitment to Sustainability
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every aspect of our eco lodge is designed to minimize environmental impact 
                while maximizing your connection to Argentina's natural beauty.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                  <Solar className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Solar Power System
                </h3>
                <p className="text-gray-700">
                  100% renewable energy from our comprehensive solar panel system, 
                  ensuring zero carbon footprint for your stay.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Droplet className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Rainwater Harvesting
                </h3>
                <p className="text-gray-700">
                  Advanced rainwater collection and filtration systems reduce 
                  municipal water usage by 80% year-round.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Zero Waste Program
                </h3>
                <p className="text-gray-700">
                  Comprehensive recycling, composting, and waste reduction 
                  practices achieving near-zero landfill waste.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Tree className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Forest Conservation
                </h3>
                <p className="text-gray-700">
                  Protecting and enhancing the native pine forest ecosystem 
                  through careful integration and conservation practices.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <Leaf className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Organic Gardens
                </h3>
                <p className="text-gray-700">
                  On-site permaculture gardens providing fresh, organic produce 
                  for meals and reducing food transportation impact.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Wind className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Natural Ventilation
                </h3>
                <p className="text-gray-700">
                  Passive cooling and heating systems using natural airflow, 
                  minimizing energy consumption for climate control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nature Integration */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Harmonious Integration with Nature
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Our eco lodge is thoughtfully designed to coexist with the natural 
                    environment, creating a seamless blend between comfort and conservation.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Tree className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Forest-First Design
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Buildings positioned to preserve existing trees and natural 
                        forest corridors for wildlife movement
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bird className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Wildlife Habitat Support
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Native bird houses, pollinator gardens, and wildlife corridors 
                        supporting local ecosystem biodiversity
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Flower className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Native Plant Landscaping
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Indigenous plants requiring minimal water and maintenance, 
                        supporting local pollinators and soil health
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mountain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Minimal Site Disturbance
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Construction methods that minimize soil disruption and 
                        preserve natural drainage patterns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="Eco lodge Argentina pathway through preserved forest"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Eco Activities */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sustainable Activities & Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with nature through mindful activities that enhance your understanding 
                of local ecosystems and sustainable living practices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Tree className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Forest Walks
                </h3>
                <p className="text-gray-600 text-sm">
                  Guided nature walks learning about local flora, fauna, and conservation efforts
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Waves className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Beach Cleanup
                </h3>
                <p className="text-gray-600 text-sm">
                  Weekly community beach cleanups protecting marine ecosystems
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Leaf className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Organic Gardening
                </h3>
                <p className="text-gray-600 text-sm">
                  Hands-on permaculture workshops and organic food production
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Bird className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bird Watching
                </h3>
                <p className="text-gray-600 text-sm">
                  Early morning birding tours with local ornithologists and naturalists
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Eco Accommodations */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sustainable Comfort Rooms
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience luxury accommodation designed with sustainability at its core, 
                featuring eco-friendly materials and energy-efficient systems.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/garden-suite-bedroom.png"
                    alt="Eco-friendly garden suite bedroom"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Garden Suite
                </h3>
                <p className="text-gray-600 mb-6">
                  Ground-level suite with direct garden access, natural ventilation, 
                  and organic cotton bedding.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Leaf className="h-4 w-4 text-green-500 mr-2" />
                    Organic materials throughout
                  </li>
                  <li className="flex items-center">
                    <Solar className="h-4 w-4 text-yellow-500 mr-2" />
                    Solar-powered amenities
                  </li>
                  <li className="flex items-center">
                    <Droplet className="h-4 w-4 text-gray-500 mr-2" />
                    Low-flow water fixtures
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/forest-view-suite.png"
                    alt="Forest view suite with eco features"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Forest View Suite
                </h3>
                <p className="text-gray-600 mb-6">
                  Elevated suite overlooking pine canopy with passive cooling 
                  and sustainable bamboo furnishings.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Tree className="h-4 w-4 text-green-500 mr-2" />
                    Bamboo furniture
                  </li>
                  <li className="flex items-center">
                    <Wind className="h-4 w-4 text-gray-500 mr-2" />
                    Natural ventilation
                  </li>
                  <li className="flex items-center">
                    <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                    Optimal natural lighting
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/terrace-suite-bedroom.png"
                    alt="Terrace suite with sustainable design"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Terrace Suite
                </h3>
                <p className="text-gray-600 mb-6">
                  Top-floor suite with private terrace, green roof elements, 
                  and panoramic forest views.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Flower className="h-4 w-4 text-green-500 mr-2" />
                    Green roof garden
                  </li>
                  <li className="flex items-center">
                    <Recycle className="h-4 w-4 text-gray-500 mr-2" />
                    Recycled materials
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-2" />
                    Wellness-focused design
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Environmental Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transparency in our sustainability efforts and measurable impact 
                on the local environment and community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Solar className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                <h3 className="font-semibold text-gray-900 mb-2">Renewable Energy</h3>
                <p className="text-gray-600 text-sm">
                  All energy needs met through solar power system
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Droplet className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">80%</div>
                <h3 className="font-semibold text-gray-900 mb-2">Water Conservation</h3>
                <p className="text-gray-600 text-sm">
                  Reduction in municipal water usage through harvesting
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
                <h3 className="font-semibold text-gray-900 mb-2">Waste Diversion</h3>
                <p className="text-gray-600 text-sm">
                  Waste diverted from landfills through recycling and composting
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Tree className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">200+</div>
                <h3 className="font-semibold text-gray-900 mb-2">Trees Protected</h3>
                <p className="text-gray-600 text-sm">
                  Native pine trees preserved during construction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Sustainable Luxury in Argentina
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join us in redefining eco-tourism. Enjoy exceptional comfort while 
              supporting environmental conservation and local community development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                See House <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/location"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Learn About Location
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}