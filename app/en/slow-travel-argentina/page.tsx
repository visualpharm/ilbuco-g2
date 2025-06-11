import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  MapPin,
  Clock,
  TreesIcon as Tree,
  Waves,
  Camera,
  Heart,
  Coffee,
  BookOpen,
  Sunrise,
  Mountain,
  Compass,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Slow Travel Argentina - Mindful Extended Stays in Carilo | Il Buco",
  description: "Embrace slow travel in Argentina with extended stays in Carilo. Experience mindful living, deep cultural immersion, and authentic connections in South America's most peaceful destination.",
  keywords: "slow travel argentina, slow tourism argentina, extended stay argentina, mindful travel, carilo slow travel, authentic argentina experience",
  openGraph: {
    title: "Slow Travel Argentina - Mindful Extended Stays in Carilo",
    description: "Discover the art of slow travel in Argentina. Extended stays, cultural immersion, and mindful living in Carilo's tranquil coastal paradise.",
    url: "https://ilbuco.com/en/slow-travel-argentina",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/villa-pine-forest-path.jpeg",
        width: 1200,
        height: 630,
        alt: "Slow travel Argentina - peaceful forest paths in Carilo",
      },
    ],
    locale: "en_US",
  },
}

export default function SlowTravelArgentinaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-amber-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Slow Travel
                  <span className="text-green-600"> Argentina</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Rediscover the art of mindful travel in Argentina's hidden coastal gem. 
                  Stay longer, connect deeper, and experience the transformative power of 
                  slow travel in Carilo's pristine natural setting.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Plan Extended Stay <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/location"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Discover Carilo
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="Slow travel Argentina - peaceful forest walk in Carilo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy of Slow Travel */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Philosophy of Slow Travel
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Slow travel isn't just about spending more time in one place - it's about 
                creating meaningful connections, understanding local culture, and giving 
                yourself space to truly experience a destination.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Time to Breathe
                </h3>
                <p className="text-gray-700">
                  Escape the rush of typical tourism. Stay weeks or months to truly 
                  settle into the rhythm of Argentine coastal life.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Authentic Connections
                </h3>
                <p className="text-gray-700">
                  Build genuine relationships with locals and fellow travelers, 
                  creating memories that last far beyond your journey.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Cultural Immersion
                </h3>
                <p className="text-gray-700">
                  Go beyond tourist attractions to understand the true spirit 
                  of Argentine culture, traditions, and way of life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Argentina for Slow Travel */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/person-window-view.jpeg"
                  alt="Slow travel Argentina - contemplative moments with nature views"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Why Argentina is Perfect for Slow Travel
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Argentina's unique combination of affordability, natural beauty, 
                    and warm culture makes it an ideal destination for extended, 
                    mindful travel experiences.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Compass className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Diverse Landscapes
                      </h3>
                      <p className="text-gray-600 text-sm">
                        From coastlines to mountains, explore varied environments 
                        without the pressure of rushed sightseeing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Relaxed Pace of Life
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Argentine culture naturally embraces a slower, more thoughtful 
                        approach to daily life and relationships
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Affordable Extended Stays
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Your budget stretches further, allowing for longer stays 
                        and deeper exploration without financial stress
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Warm Hospitality
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Argentines are known for their warmth and openness to 
                        sharing their culture with interested visitors
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Carilo: The Perfect Slow Travel Base */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Carilo: Your Slow Travel Sanctuary
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nestled between pine forests and pristine beaches, Carilo offers the 
                perfect environment for slow travel - peaceful, beautiful, and authentically Argentine.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/photo/exterior/exterior5.jpg"
                    alt="Carilo beach and forest for slow travel meditation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Natural Rhythms
                  </h3>
                  <p className="text-gray-600">
                    Wake with the sunrise over the Atlantic, spend afternoons in 
                    pine-scented forests, and end days with contemplative beach walks.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/modern-villa-pine-forest.png"
                    alt="Peaceful accommodation for slow travel in Argentina"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Mindful Accommodation
                  </h3>
                  <p className="text-gray-600">
                    Thoughtfully designed spaces that encourage reflection, creativity, 
                    and connection with both nature and fellow slow travelers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slow Travel Activities */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mindful Activities & Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Slow travel is about quality over quantity. Engage in activities that 
                nourish your soul and create lasting memories.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Sunrise className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Morning Meditation
                </h3>
                <p className="text-gray-600 text-sm">
                  Start each day with peaceful meditation sessions overlooking the ocean
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Tree className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Forest Bathing
                </h3>
                <p className="text-gray-600 text-sm">
                  Practice mindful walking and forest bathing in Carilo's pine groves
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <Camera className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Photography Walks
                </h3>
                <p className="text-gray-600 text-sm">
                  Capture the changing light and seasons through contemplative photography
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Coffee className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Local Connections
                </h3>
                <p className="text-gray-600 text-sm">
                  Build relationships with neighbors, local artisans, and fellow travelers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Extended Stay Benefits */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Benefits of Extended Stays
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Reduced Stress
                </h3>
                <p className="text-gray-600">
                  No rushed itineraries or constant packing. Settle in and let your 
                  nervous system truly relax and restore.
                </p>
              </div>
              
              <div className="bg-green-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Deeper Relationships
                </h3>
                <p className="text-gray-600">
                  Time to build meaningful connections with locals and other travelers 
                  that extend beyond your stay.
                </p>
              </div>
              
              <div className="bg-amber-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Growth
                </h3>
                <p className="text-gray-600">
                  Extended time in a new environment provides space for reflection, 
                  creativity, and personal transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Begin Your Slow Travel Journey in Argentina
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Trade rushed tourism for meaningful travel. Experience the transformative 
              power of slow travel in one of South America's most beautiful and peaceful destinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Plan Extended Stay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Explore Our Space
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}