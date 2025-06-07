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
} from "lucide-react"

export const metadata: Metadata = {
  title: "Coliving Argentina - Premium Shared Living in Carilo | Il Buco",
  description: "Experience the best coliving in Argentina. Modern shared accommodations with international community, premium amenities, and beachside location in exclusive Carilo.",
  keywords: "coliving argentina, shared living argentina, coliving carilo, argentina coliving space, international community argentina, remote work argentina",
  openGraph: {
    title: "Coliving Argentina - Premium Shared Living Experience in Carilo",
    description: "Join Argentina's premier coliving community in Carilo. Modern amenities, international residents, and the perfect work-life balance by the beach.",
    url: "https://ilbuco.com/en/coliving-argentina",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/modern-living-room-pine-forest.png",
        width: 1200,
        height: 630,
        alt: "Coliving Argentina - modern shared living space with forest views",
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
                  <span className="text-blue-600"> Argentina</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Experience premium coliving in Argentina's most exclusive coastal destination. 
                  Join our international community in Carilo, where modern comfort meets natural 
                  beauty and global connections flourish.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join Community <ArrowRight className="ml-2 h-5 w-5" />
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
                  src="/modern-living-room-pine-forest.png"
                  alt="Modern coliving space in Argentina with forest views"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Coliving in Argentina */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Argentina for Coliving?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Argentina combines affordability with quality of life, making it the perfect 
                destination for digital nomads and remote workers seeking premium coliving experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Exceptional Value
                </h3>
                <p className="text-gray-700">
                  Enjoy luxury coliving amenities and lifestyle at a fraction of the cost 
                  compared to major cities worldwide.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  International Community
                </h3>
                <p className="text-gray-700">
                  Connect with like-minded professionals from around the world in 
                  Argentina's growing expat and digital nomad scene.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Sun className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Year-Round Climate
                </h3>
                <p className="text-gray-700">
                  Enjoy moderate temperatures and beautiful seasons perfect for 
                  outdoor activities and beachside living.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coliving Features */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Premium Coliving Amenities
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Our Carilo coliving space combines the comfort of home with the 
                    convenience of a luxury hotel, designed specifically for remote workers 
                    and digital nomads.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wifi className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        High-Speed Internet
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Fiber optic connection with backup systems ensuring reliable connectivity
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Private Bedrooms
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Comfortable private rooms with workspace and forest/garden views
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Shared Common Areas
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Spacious living rooms, dining areas, and outdoor terraces for socializing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Utensils className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Fully Equipped Kitchen
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Modern kitchen facilities for cooking and shared meals with housemates
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Parking & Storage
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Secure parking and storage space for bikes and outdoor equipment
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        24/7 Security
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Gated community with security for peace of mind and safety
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/garden-suite-living.png"
                  alt="Shared living space in Argentina coliving house"
                  fill
                  className="object-cover"
                />
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
                    src="/carilo-beach-forest.png"
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
                    src="/modern-villa-pine-forest.png"
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

        {/* Community Life */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Life in Our Argentina Coliving Community
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of productivity and social connection in our 
                carefully curated international community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/gallery/hero-terrace-view.jpeg"
                  alt="Coliving Argentina community terrace gathering"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Daily Rhythms & Community Events
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Morning Focus Time</h4>
                    <p className="text-gray-600 text-sm">
                      Quiet hours for deep work and concentration with high-speed internet
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Community Dinners</h4>
                    <p className="text-gray-600 text-sm">
                      Weekly shared meals featuring local Argentine cuisine and international dishes
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Beach Activities</h4>
                    <p className="text-gray-600 text-sm">
                      Group surfing lessons, beach volleyball, and sunset walks
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">Skill Sharing</h4>
                    <p className="text-gray-600 text-sm">
                      Weekly workshops where residents share professional skills and hobbies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Packages */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Flexible Coliving Packages
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the package that fits your lifestyle and budget. All packages include 
                accommodation, utilities, cleaning, and access to community amenities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Monthly Stay
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  From $800
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Perfect for extended remote work or digital nomad lifestyle
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-8">
                  <li>• Private room with workspace</li>
                  <li>• All utilities included</li>
                  <li>• Weekly cleaning service</li>
                  <li>• Community events access</li>
                </ul>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Learn More
                </Link>
              </div>
              
              <div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Quarterly Stay
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  From $700
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Ideal for seasonal living and deeper community integration
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-8">
                  <li>• Everything in Monthly plan</li>
                  <li>• Discounted local activities</li>
                  <li>• Priority room selection</li>
                  <li>• Member networking events</li>
                </ul>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>
              
              <div className="bg-purple-50 p-8 rounded-xl border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Annual Membership
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  From $600
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Best value for long-term residents and location independence
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-8">
                  <li>• Everything in Quarterly plan</li>
                  <li>• Flexible scheduling</li>
                  <li>• Guest privileges</li>
                  <li>• Alumni network access</li>
                </ul>
                <Link
                  href="/en/book"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Coliving in Argentina?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join our international community in Carilo and discover why Argentina is 
              becoming the top destination for remote workers and digital nomads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Reserve Your Spot <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/location"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
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