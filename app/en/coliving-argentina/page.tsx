import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  MapPin,
  Users,
  Wifi,
  Home,
  Coffee,
  Utensils,
  Car,
  TreesIcon as Tree,
  Waves,
  Sun,
  Shield,
  DollarSign,
  Globe,
  Clock,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Coliving Argentina 2025 - Premium Community Living in Carilo Beach | Il Buco",
  description: "Top-rated coliving space in Argentina. Join our international community in Carilo with private suites, coworking spaces, beach access, and curated social experiences.",
  keywords: "coliving argentina, coliving buenos aires, argentina coliving space, carilo coliving, beach coliving argentina, digital nomad housing argentina, shared living argentina",
  openGraph: {
    title: "Coliving Argentina - Luxury Community Living by the Beach in Carilo",
    description: "Experience Argentina's premier coliving community. Private suites, shared spaces, international residents, and beachfront location in exclusive Carilo.",
    url: "https://ilbuco.com/en/coliving-argentina",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/gallery/hero-villa-exterior.jpeg",
        width: 1200,
        height: 630,
        alt: "Coliving Argentina - luxury villa with pool in pine forest",
      },
    ],
    locale: "en_US",
  },
}

export default function ColivingArgentinaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 to-purple-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Coliving
                  <span className="text-gray-900"> Argentina</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Live with other remote workers in a house that actually works. 
                  Fast wifi, real workspaces, beach 5 minutes away. Cariló — where Buenos Aires people escape to.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/the-house"
                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    See House <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/rooms"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    View Rooms
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="Luxury coliving villa in Argentina with pool and pine forest"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Showcase */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                This Is Where You'll Live
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Four suites, big common areas, rooftop BBQ. Pine forest everywhere. 
                Beach down the road.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/photo/living/living1.jpg"
                  alt="Spacious shared living room with modern furniture"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Shared Living Room</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/photo/penthouse/penthouse1.jpg"
                  alt="Private suite with workspace and forest views"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Private Suite</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/gallery/hero-terrace-view.jpeg"
                  alt="Rooftop terrace with BBQ area"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Rooftop Terrace</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/photo/giardino/giardino2.jpg"
                  alt="Garden suite with private terrace"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Garden Terrace</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/photo/paraiso/paraiso1.jpg"
                  alt="Coworking space with natural light"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Work Spaces</p>
                </div>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden group">
                <Image
                  src="/photo/exterior/exterior5.jpg"
                  alt="Pool area surrounded by pine trees"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-4 left-4 text-white font-semibold">Pool & Garden</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Coliving in Argentina */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why People Pick Argentina
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Good exchange rate. Amazing food. People stay out til 4am. 
                Mountains, beaches, wine country — all in one country.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">The Argentina Advantage</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cost-Effective Living</h4>
                      <p className="text-gray-600">
                        Premium coliving from $600-1200/month including everything. Thats 70% less than similar spaces in US/Europe.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Global Community</h4>
                      <p className="text-gray-600">
                        Buenos Aires alone has 50,000+ expats and digital nomads. Beach towns and mountain regions have their own thriving communities too.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Time Zone Friendly</h4>
                      <p className="text-gray-600">
                        Perfect for remote work with US and European clients. Only 1-4 hours difference from major business centers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/photo/living/living3.jpg"
                  alt="International coliving community gathering"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Perfect Climate</h4>
                <p className="text-gray-600">300+ sunny days yearly with mild winters and warm summers</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Reliable Internet</h4>
                <p className="text-gray-600">Fiber optic in major cities and coastal towns</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Warm Culture</h4>
                <p className="text-gray-600">Argentines are famously welcoming to foreigners</p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included in Coliving */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything Included in Your Coliving Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All-inclusive pricing means no surprises. From utilities to community events, everything you need is covered.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Accommodation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
                <Home className="h-12 w-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accommodation</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Private furnished bedroom</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Dedicated workspace</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Premium bedding and linens</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Weekly housekeeping</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />In-room heating/cooling</li>
                </ul>
              </div>
              
              {/* Work & Tech */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl">
                <Wifi className="h-12 w-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Work & Technology</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />High-speed fiber internet</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Backup internet connection</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Ergonomic workspaces</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Printer and scanner access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Video call booths</li>
                </ul>
              </div>
              
              {/* Living & Kitchen */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
                <Utensils className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Living & Dining</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Fully equipped kitchen</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Coffee and tea station</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Indoor/outdoor dining areas</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />BBQ facilities</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Food storage space</li>
                </ul>
              </div>
              
              {/* Community & Events */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl">
                <Users className="h-12 w-12 text-orange-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Life</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Weekly community dinners</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Beach and outdoor activities</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Skill-sharing workshops</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Movie nights</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Local cultural events</li>
                </ul>
              </div>
              
              {/* Utilities & Services */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-xl">
                <Shield className="h-12 w-12 text-red-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Utilities & Security</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />All utilities included</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />24/7 gated security</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Maintenance support</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Package reception</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Laundry facilities</li>
                </ul>
              </div>
              
              {/* Leisure & Wellness */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl">
                <Waves className="h-12 w-12 text-cyan-600 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Leisure & Nature</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />5-min walk to beach</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Swimming pool access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Garden and terraces</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Bike storage</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Outdoor seating areas</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Location Benefits */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Carilo: Argentina's Premium Coastal Destination
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our coliving space is located in Carilo, an exclusive resort town on Argentina's 
                Atlantic coast, offering the perfect balance of tranquility and sophistication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/carilo-beach.png"
                    alt="Carilo beach access for coliving residents"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Beach Lifestyle
                </h3>
                <p className="text-gray-600">
                  5-minute walk to pristine beaches perfect for surfing, swimming, 
                  or sunrise yoga sessions
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/photo/zona/File 24-04-2025, 10 36 14 PM (8).jpg"
                    alt="Pine forest surroundings of Argentina coliving"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Nature Integration
                </h3>
                <p className="text-gray-600">
                  Surrounded by pine forests with walking trails, perfect for 
                  work breaks and outdoor activities
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/photo/exterior/IMG_2337.jpg"
                    alt="Exclusive community for Argentina coliving"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Exclusive Community
                </h3>
                <p className="text-gray-600">
                  Private, gated neighborhood providing security, tranquility, 
                  and an upscale environment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Coliving Spaces */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Coliving Options Across Argentina
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From bustling Buenos Aires to quiet beach towns, find the coliving style that matches your lifestyle and work needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Urban Coliving */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/photo/living/living2.jpg"
                    alt="Urban coliving in Buenos Aires"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Urban Coliving</h3>
                  <p className="text-gray-600 mb-4">Buenos Aires, Cordoba, Rosario</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><MapPin className="h-4 w-4 text-red-500 mr-2" />City center locations</li>
                    <li className="flex items-center"><Users className="h-4 w-4 text-blue-500 mr-2" />20-50 residents</li>
                    <li className="flex items-center"><Coffee className="h-4 w-4 text-brown-500 mr-2" />Coworking spaces</li>
                    <li className="flex items-center"><DollarSign className="h-4 w-4 text-green-500 mr-2" />$400-800/month</li>
                  </ul>
                </div>
              </div>
              
              {/* Beach Coliving */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/photo/exterior/exterior3.jpg"
                    alt="Beach coliving in Carilo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Beach Coliving</h3>
                  <p className="text-gray-600 mb-4">Carilo, Mar del Plata, Pinamar</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><Waves className="h-4 w-4 text-blue-500 mr-2" />Beachfront access</li>
                    <li className="flex items-center"><Home className="h-4 w-4 text-purple-500 mr-2" />4-12 residents</li>
                    <li className="flex items-center"><Sun className="h-4 w-4 text-yellow-500 mr-2" />Outdoor focus</li>
                    <li className="flex items-center"><DollarSign className="h-4 w-4 text-green-500 mr-2" />$600-1200/month</li>
                  </ul>
                </div>
              </div>
              
              {/* Mountain Coliving */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src="/modern-villa-pine-forest.png"
                    alt="Mountain coliving in Bariloche"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mountain Coliving</h3>
                  <p className="text-gray-600 mb-4">Bariloche, Villa La Angostura</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><Tree className="h-4 w-4 text-green-500 mr-2" />Nature immersion</li>
                    <li className="flex items-center"><Shield className="h-4 w-4 text-gray-500 mr-2" />Quiet and peaceful</li>
                    <li className="flex items-center"><Coffee className="h-4 w-4 text-brown-500 mr-2" />Cozy atmosphere</li>
                    <li className="flex items-center"><DollarSign className="h-4 w-4 text-green-500 mr-2" />$500-900/month</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Life */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Day in the Life: Coliving in Argentina
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">8:00 AM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-blue-500 to-blue-400 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Morning Coffee</h4>
                    <p className="text-gray-600">Start your day with fresh coffee on the terrace, chatting with housemates about projects and plans.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">9:00 AM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-blue-400 to-green-500 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Deep Work Session</h4>
                    <p className="text-gray-600">Settle into your workspace with fast wifi. The house keeps quiet hours for productivity.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">1:00 PM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-green-500 to-yellow-500 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Lunch Break</h4>
                    <p className="text-gray-600">Make lunch in the kitchen or join others at a local restaurant. Perfect time for a beach walk.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">3:00 PM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-yellow-500 to-purple-500 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Afternoon Activities</h4>
                    <p className="text-gray-600">Join a surf lesson, explore forest trails, or keep working from a beachside cafe. Your choice.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">7:00 PM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-purple-500 to-red-500 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Community Dinner</h4>
                    <p className="text-gray-600">Twice a week we gather for communal dinners. Tonight: Argentine asado with Mendoza wine.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="font-semibold text-gray-600">10:00 PM</p>
                  </div>
                  <div className="w-1 bg-gradient-to-b from-red-500 to-indigo-500 relative">
                    <div className="absolute -left-2 -top-2 w-5 h-5 bg-indigo-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Evening Wind-down</h4>
                    <p className="text-gray-600">Movie night, stargazing on the terrace, or quiet reading. End the day however you want.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Member Testimonials */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Our Coliving Members Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real stories from our international community members who've made Argentina their coliving home.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The perfect balance of community and privacy. I've been super productive here while making lifelong friends. The beach access is a game-changer."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Julia Martinez</h4>
                    <p className="text-gray-600 text-sm">Product Designer, Spain</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "After trying coliving in Bali and Mexico, this is the best. The combination of nature, community, and infrastructure is unmatched."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">TC</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tom Chen</h4>
                    <p className="text-gray-600 text-sm">Software Developer, Canada</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The community dinners and weekend activities create such a warm atmosphere. Never feels lonely, even when working on tough projects."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">LS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lisa Schmidt</h4>
                    <p className="text-gray-600 text-sm">Marketing Consultant, Germany</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Information */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All-inclusive rates with no hidden fees. Choose the duration that works for your journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Stay</h3>
                <p className="text-gray-600 mb-6">Try coliving</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">$250</p>
                  <p className="text-gray-600">per week</p>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />All amenities included</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Community access</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Flexible dates</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 p-8 rounded-xl relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Stay</h3>
                <p className="text-gray-600 mb-6">For remote workers</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">$800</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />20% savings vs weekly</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Priority room selection</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Guest privileges</li>
                </ul>
              </div>
              
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:border-purple-500 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Long-term</h3>
                <p className="text-gray-600 mb-6">3+ months</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">$600</p>
                  <p className="text-gray-600">per month</p>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Best value</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Room customization</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Storage space</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                All prices include utilities, internet, housekeeping, and community events
              </p>
              <Link
                href="https://book.ilbuco.com.ar"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Check Availability <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-black to-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Coliving in Argentina?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join our international community in Carilo and see why Argentina is becoming the top destination for remote workers and digital nomads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                See House <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/location"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                Explore Location
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}