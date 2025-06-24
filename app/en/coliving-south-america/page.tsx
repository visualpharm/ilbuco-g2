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
} from "lucide-react"

export const metadata: Metadata = {
  title: "Premium Coliving South America - Carilo Argentina | Il Buco",
  description: "Discover the finest coliving experience in South America. Join our exclusive community in Carilo, Argentina with luxury amenities, nature immersion, and international residents.",
  keywords: "coliving south america, coliving argentina, south america coliving space, luxury coliving, international community argentina, carilo coliving",
  openGraph: {
    title: "Premium Coliving South America - Luxury Community in Argentina",
    description: "Experience the best coliving in South America with our exclusive community in Carilo, Argentina. Luxury accommodations meet vibrant international community.",
    url: "https://ilbuco.com/en/coliving-south-america",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/gallery/hero-villa-exterior.jpeg",
        width: 1200,
        height: 630,
        alt: "Premium coliving space in South America - Carilo Argentina",
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
                  Premier Coliving
                  <span className="text-emerald-600"> South America</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Experience the ultimate coliving destination in South America. Join our exclusive 
                  international community in Carilo, Argentina, where luxury meets nature and 
                  global connections flourish.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/the-house"
                    className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    See House <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/rooms"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Explore Spaces
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

        {/* Why South America for Coliving */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose South America for Coliving?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                South America offers coliving enthusiasts an unmatched combination of natural beauty, 
                cultural richness, affordability, and growing digital infrastructure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Mountain className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Incredible Landscapes
                </h3>
                <p className="text-gray-700">
                  From Patagonian mountains to Atlantic coastlines, access world-class 
                  natural beauty steps from your coliving space.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Value for Money
                </h3>
                <p className="text-gray-700">
                  Enjoy premium coliving amenities and lifestyle at a fraction 
                  of the cost compared to Europe or North America.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Growing Community
                </h3>
                <p className="text-gray-700">
                  Join the expanding network of international professionals 
                  choosing South America as their base.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Coliving Community */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    An International Community in Paradise
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Il Buco brings together digital nomads, entrepreneurs, and creative 
                    professionals from around the world in Argentina's most exclusive 
                    coastal destination.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Global Residents
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Community members from 25+ countries creating diverse perspectives
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Social Events
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Regular community dinners, beach activities, and networking events
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wifi className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Work-Life Balance
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Productive workspaces seamlessly integrated with leisure areas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Lasting Connections
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Build meaningful relationships that extend beyond your stay
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/gallery/hero-outdoor-seating.jpeg"
                  alt="International coliving community gathering in South America"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Location Advantages */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Carilo: South America's Hidden Gem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Located on Argentina's Atlantic coast, Carilo offers the perfect setting 
                for a world-class coliving experience away from crowded tourist destinations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/carilo-beach.png"
                    alt="Carilo beach for coliving residents in South America"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Private Beach Access
                </h3>
                <p className="text-gray-600">
                  Exclusive beach community with pristine coastline for morning runs, 
                  surfing, and sunset gatherings
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/photo/exterior/exterior6.jpg"
                    alt="Pine forest surrounding coliving space"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Forest Immersion
                </h3>
                <p className="text-gray-600">
                  Surrounded by pine forests providing natural tranquility and 
                  walking trails for mindful breaks
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/modern-villa-pine-forest.png"
                    alt="Modern luxury coliving accommodation"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Luxury Infrastructure
                </h3>
                <p className="text-gray-600">
                  Modern amenities and high-end accommodations in an exclusive, 
                  gated community environment
                </p>
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
                  "Best coliving experience I've had in South America. The community 
                  is incredibly welcoming and the location is absolutely magical."
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
                  "The perfect blend of productivity and relaxation. I've extended 
                  my stay twice and met lifelong friends here."
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
                  "Finally found my ideal coliving space! The location, amenities, 
                  and community make this a standout experience in South America."
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
              Experience the future of coliving in South America. Connect with like-minded 
              professionals while enjoying luxury amenities in one of the continent's most 
              beautiful destinations.
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