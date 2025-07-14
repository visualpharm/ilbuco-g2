import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  MapPin,
  Users,
  Globe,
  Wifi,
  Coffee,
  Mountain,
  Waves,
  TreesIcon as Tree,
  Star,
  Heart,
  Home,
  Building,
  Crown,
  DollarSign,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Coliving South America 2025 - Best Coliving Spaces & Communities | Il Buco",
  description: "Complete guide to coliving in South America. Discover the best coliving spaces across Argentina, Brazil, Colombia, Peru, and Chile. Community-focused living for digital nomads.",
  keywords: "coliving south america, south america coliving spaces, coliving argentina, coliving brazil, coliving colombia, digital nomad south america, remote work communities",
  openGraph: {
    title: "Coliving South America - Top Destinations & Communities for Digital Nomads",
    description: "Explore the best coliving spaces across South America. From Buenos Aires to Rio, find your perfect community with our comprehensive guide to coliving in Latin America.",
    url: "https://ilbuco.com/en/coliving-south-america",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/gallery/hero-villa-exterior.jpeg",
        width: 1200,
        height: 630,
        alt: "Premium coliving spaces across South America",
      },
    ],
    locale: "en_US",
  },
}

export default function ColivingSouthAmericaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 to-blue-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Coliving South America:
                  <span className="text-emerald-600"> Complete 2025 Guide</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Your guide to coliving across South America. From vibrant Buenos Aires to beachside Brazilian communities, find the perfect coliving space for your digital nomad journey in Latin America.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/the-house"
                    className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    See House <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/coliving-argentina"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Argentina Coliving
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="Premium coliving space in South America"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Top Coliving Countries in South America */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Best Countries for Coliving in South America
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each country offers unique advantages for digital nomads and remote workers. Find your perfect match based on lifestyle, budget, and community.
              </p>
            </div>
            
            {/* Argentina */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold flex items-center">
                  <Image src="/icons/flags/ar.svg" alt="Argentina flag" width={32} height={24} className="mr-3" />
                  Argentina - The Digital Nomad Favorite
                </h3>
              </div>
              <div className="bg-white border-2 border-blue-200 rounded-b-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Why Argentina?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Great exchange rate</li>
                      <li>• European-influenced culture</li>
                      <li>• Amazing wine and food</li>
                      <li>• Strong expat communities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Top Coliving Cities</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Buenos Aires (Urban)</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Carilo (Beach)</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Bariloche (Mountain)</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Mendoza (Wine Country)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Costs & Visa</h4>
                    <p className="text-gray-600 mb-2"><strong>Coliving:</strong> $400-1200/month</p>
                    <p className="text-gray-600 mb-2"><strong>Visa:</strong> 90 days visa-free</p>
                    <p className="text-gray-600"><strong>Internet:</strong> 50-100 Mbps average</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Brazil */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-white p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold flex items-center">
                  <Image src="/icons/flags/br.svg" alt="Brazil flag" width={32} height={24} className="mr-3" />
                  Brazil - Beach Life & Innovation
                </h3>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-b-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Why Brazil?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• World-famous beaches</li>
                      <li>• Vibrant startup ecosystem</li>
                      <li>• Year-round warm weather</li>
                      <li>• Rich cultural experiences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Top Coliving Cities</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Rio de Janeiro</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />São Paulo</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Florianópolis</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Belo Horizonte</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Costs & Visa</h4>
                    <p className="text-gray-600 mb-2"><strong>Coliving:</strong> $500-1500/month</p>
                    <p className="text-gray-600 mb-2"><strong>Visa:</strong> 90 days visa-free</p>
                    <p className="text-gray-600"><strong>Internet:</strong> 100-300 Mbps</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Colombia */}
            <div className="mb-16">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 text-white p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold flex items-center">
                  <Image src="/icons/flags/co.svg" alt="Colombia flag" width={32} height={24} className="mr-3" />
                  Colombia - The Rising Star
                </h3>
              </div>
              <div className="bg-white border-2 border-yellow-200 rounded-b-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Why Colombia?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Spring weather year-round</li>
                      <li>• Fastest growing nomad hub</li>
                      <li>• Great coffee culture</li>
                      <li>• Very affordable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Top Coliving Cities</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Medellín</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Bogotá</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Cartagena</li>
                      <li><MapPin className="inline h-4 w-4 text-red-500 mr-1" />Cali</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Costs & Visa</h4>
                    <p className="text-gray-600 mb-2"><strong>Coliving:</strong> $300-800/month</p>
                    <p className="text-gray-600 mb-2"><strong>Visa:</strong> 90 days visa-free</p>
                    <p className="text-gray-600"><strong>Internet:</strong> 50-150 Mbps</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Comparison Table */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Quick Comparison</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Country</th>
                      <th className="text-center py-3 px-4">Best For</th>
                      <th className="text-center py-3 px-4">Cost Level</th>
                      <th className="text-center py-3 px-4">Community Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Argentina</td>
                      <td className="py-3 px-4 text-center">Culture & Value</td>
                      <td className="py-3 px-4 text-center">$$</td>
                      <td className="py-3 px-4 text-center">★★★★★</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Brazil</td>
                      <td className="py-3 px-4 text-center">Beach & Tech</td>
                      <td className="py-3 px-4 text-center">$$$</td>
                      <td className="py-3 px-4 text-center">★★★★</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Colombia</td>
                      <td className="py-3 px-4 text-center">Climate & Cost</td>
                      <td className="py-3 px-4 text-center">$</td>
                      <td className="py-3 px-4 text-center">★★★★</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Peru</td>
                      <td className="py-3 px-4 text-center">Adventure</td>
                      <td className="py-3 px-4 text-center">$</td>
                      <td className="py-3 px-4 text-center">★★★</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Chile</td>
                      <td className="py-3 px-4 text-center">Stability</td>
                      <td className="py-3 px-4 text-center">$$$</td>
                      <td className="py-3 px-4 text-center">★★★</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Coliving in South America */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Types of Coliving Spaces in South America
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From budget hostels to luxury villas, South America has coliving options for every lifestyle and budget.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Budget Coliving */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Coliving</h3>
                <p className="text-gray-600 text-sm mb-4">Hostel-style with shared rooms</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• $200-400/month</li>
                  <li>• Shared dorms</li>
                  <li>• Basic WiFi</li>
                  <li>• Backpacker vibe</li>
                </ul>
              </div>
              
              {/* Standard Coliving */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Coliving</h3>
                <p className="text-gray-600 text-sm mb-4">Private rooms with shared common areas</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• $400-800/month</li>
                  <li>• Private bedrooms</li>
                  <li>• Coworking space</li>
                  <li>• Community events</li>
                </ul>
              </div>
              
              {/* Premium Coliving */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Coliving</h3>
                <p className="text-gray-600 text-sm mb-4">Upscale amenities and everything</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• $800-1500/month</li>
                  <li>• En-suite bathrooms</li>
                  <li>• High-speed fiber</li>
                  <li>• Concierge service</li>
                </ul>
              </div>
              
              {/* Luxury Coliving */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Coliving</h3>
                <p className="text-gray-600 text-sm mb-4">Villa-style with everything</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• $1500-3000/month</li>
                  <li>• Suite-style rooms</li>
                  <li>• Pool and gym</li>
                  <li>• Chef and cleaning</li>
                </ul>
              </div>
            </div>
            
            {/* Feature Comparison */}
            <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What to Expect at Each Level</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Budget</th>
                      <th className="text-center py-3 px-4">Standard</th>
                      <th className="text-center py-3 px-4">Premium</th>
                      <th className="text-center py-3 px-4">Luxury</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Private Room</td>
                      <td className="py-3 px-4 text-center">❌</td>
                      <td className="py-3 px-4 text-center">✅</td>
                      <td className="py-3 px-4 text-center">✅</td>
                      <td className="py-3 px-4 text-center">✅</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Private Bathroom</td>
                      <td className="py-3 px-4 text-center">❌</td>
                      <td className="py-3 px-4 text-center">❌</td>
                      <td className="py-3 px-4 text-center">✅</td>
                      <td className="py-3 px-4 text-center">✅</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Dedicated Workspace</td>
                      <td className="py-3 px-4 text-center">❌</td>
                      <td className="py-3 px-4 text-center">✅</td>
                      <td className="py-3 px-4 text-center">✅</td>
                      <td className="py-3 px-4 text-center">✅</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Housekeeping</td>
                      <td className="py-3 px-4 text-center">❌</td>
                      <td className="py-3 px-4 text-center">Weekly</td>
                      <td className="py-3 px-4 text-center">2x/week</td>
                      <td className="py-3 px-4 text-center">Daily</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Community Events</td>
                      <td className="py-3 px-4 text-center">Basic</td>
                      <td className="py-3 px-4 text-center">Regular</td>
                      <td className="py-3 px-4 text-center">Curated</td>
                      <td className="py-3 px-4 text-center">Premium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* How to Choose Your Coliving Space */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                How to Choose the Right Coliving Space
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Consider these key factors when selecting your South American coliving home
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                    Location Priorities
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-600 mr-2">Urban:</span>
                      Nightlife, restaurants, coworking spaces
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-600 mr-2">Beach:</span>
                      Surf, relaxation, outdoor activities
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-600 mr-2">Mountain:</span>
                      Hiking, skiing, nature immersion
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-blue-600 mr-2">Rural:</span>
                      Complete disconnect, focus, authentic culture
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-6 w-6 text-green-600 mr-3" />
                    Community Type
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-semibold text-green-600 mr-2">Professional:</span>
                      Entrepreneurs, developers, designers
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-green-600 mr-2">Creative:</span>
                      Artists, writers, content creators
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-green-600 mr-2">Wellness:</span>
                      Yoga, meditation, health-focused
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold text-green-600 mr-2">Mixed:</span>
                      Diverse backgrounds and interests
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Wifi className="h-6 w-6 text-purple-600 mr-3" />
                    Work Requirements
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Internet Speed Needs:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Basic work: 25+ Mbps</li>
                        <li>• Video calls: 50+ Mbps</li>
                        <li>• Streaming/uploading: 100+ Mbps</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Workspace Setup:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Dedicated desk vs shared spaces</li>
                        <li>• 24/7 access needs</li>
                        <li>• Meeting room availability</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-6 w-6 text-yellow-600 mr-3" />
                    Budget Considerations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Remember these additional costs:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Laundry services: $20-50/month</li>
                    <li>• Food/groceries: $200-400/month</li>
                    <li>• Local transport: $50-100/month</li>
                    <li>• Activities: $100-300/month</li>
                    <li>• Coworking day passes: $10-30/day</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Il Buco Showcase */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Experience Premium Coliving at Il Buco
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our Carilo location represents the best of South American coliving - luxury amenities, natural beauty, and vibrant community
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="relative h-32 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/photo/exterior/exterior1.jpg"
                    alt="Il Buco exterior view"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/photo/living/living3.jpg"
                    alt="Modern living spaces"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/photo/terrazzo/terrazzo1.jpg"
                    alt="Premium suite interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 md:h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/hero-outdoor-seating.jpeg"
                    alt="Community outdoor space"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <Waves className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">5 Min to Beach</h3>
                    <p className="text-gray-600 text-sm">Private path through pine forest</p>
                  </div>
                  <div>
                    <Wifi className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">100+ Mbps Fiber</h3>
                    <p className="text-gray-600 text-sm">Reliable connection with backup</p>
                  </div>
                  <div>
                    <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">4-8 Residents</h3>
                    <p className="text-gray-600 text-sm">Intimate community size</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Our Community Says
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "Best coliving experience I've had in South America. The community is incredibly welcoming and the location is absolutely magical."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                    <p className="text-gray-600 text-sm">UX Designer, Germany</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The perfect blend of productivity and relaxation. I've extended my stay twice and met lifelong friends here."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Marcus L.</h4>
                    <p className="text-gray-600 text-sm">Software Engineer, Sweden</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "Finally found my ideal coliving space. The location, amenities, and community make this a standout in South America."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ana R.</h4>
                    <p className="text-gray-600 text-sm">Marketing Director, Brazil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join South America's Premier Coliving Community
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the future of coliving in South America. Connect with like-minded professionals while enjoying luxury amenities in one of the continent's most beautiful destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                See House <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-colors"
              >
                Virtual Tour
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}