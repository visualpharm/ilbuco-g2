import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  Wifi,
  Code,
  Building,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Shield,
  Laptop,
  Coffee,
  TreesIcon as Tree,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Digital Nomad Argentina - Remote Work Paradise in Carilo | Il Buco",
  description: "Discover the ultimate digital nomad experience in Argentina. Work remotely from our modern coliving space in Carilo with high-speed internet, professional workspace, and beachside location.",
  keywords: "digital nomad argentina, remote work argentina, coliving argentina, digital nomad retreat, work from anywhere, carilo coworking",
  openGraph: {
    title: "Digital Nomad Argentina - Remote Work Paradise in Carilo",
    description: "Experience the perfect blend of work and lifestyle as a digital nomad in Argentina's most beautiful coastal destination.",
    url: "https://ilbuco.com/en/digital-nomad-argentina",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/modern-living-room-pine-forest.png",
        width: 1200,
        height: 630,
        alt: "Digital nomad workspace with pine forest view in Argentina",
      },
    ],
    locale: "en_US",
  },
}

export default function DigitalNomadArgentinaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Digital Nomad
                  <span className="text-blue-600"> Argentina</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Escape the ordinary and join Argentina's premier digital nomad community in Carilo. 
                  Work remotely from our modern coliving space surrounded by pine forests and just 
                  minutes from pristine beaches.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/rooms"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    View Spaces
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/photo/living/living3.jpg"
                  alt="Modern workspace for digital nomads in Argentina"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Argentina for Digital Nomads */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Argentina for Remote Work?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Argentina offers digital nomads an unbeatable combination of affordability, 
                culture, and lifestyle that makes it the perfect remote work destination.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Favorable Exchange Rate
                </h3>
                <p className="text-gray-600">
                  Your USD or EUR goes further in Argentina, allowing you to enjoy 
                  a premium lifestyle while maintaining your remote income.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compatible Time Zones
                </h3>
                <p className="text-gray-600">
                  Argentina's time zone aligns well with US East Coast and European 
                  business hours, making remote collaboration seamless.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Vibrant Expat Community
                </h3>
                <p className="text-gray-600">
                  Join a thriving community of international remote workers and 
                  digital nomads who have made Argentina their base.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Nomad Workspace Features */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/photo/terrazzo/terrazzo3.jpg"
                  alt="Digital nomad working with pine forest view"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Premium Remote Work Setup
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Everything you need to maintain productivity while enjoying 
                    the Argentine lifestyle in our purpose-built digital nomad space.
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
                        Fiber optic connection with backup systems ensuring 99% uptime
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Laptop className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Dedicated Workspaces
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Ergonomic desks with forest views in every room
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        24/7 Access
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Work on your schedule with round-the-clock facility access
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Secure Environment
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Private, gated community with security and privacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Benefits */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Carilo: The Perfect Digital Nomad Base
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Located in Argentina's most exclusive coastal destination, Carilo offers 
                the perfect balance of tranquility for focused work and adventure for your downtime.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/photo/exterior/exterior3.jpg"
                    alt="Carilo beach and forest for digital nomads"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Beach & Forest Access
                </h3>
                <p className="text-gray-600">
                  Walk to pristine beaches or explore pine forests during work breaks
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/villa-pine-forest-path.jpeg"
                    alt="Pine forest walking paths near coliving space"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Nature Integration
                </h3>
                <p className="text-gray-600">
                  Work surrounded by nature with wellness trails and outdoor spaces
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src="/modern-villa-pine-forest.png"
                    alt="Modern villa in pine forest setting"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Exclusive Community
                </h3>
                <p className="text-gray-600">
                  Private, upscale neighborhood away from tourist crowds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Become a Digital Nomad in Argentina?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join the growing community of remote workers who have discovered 
              the perfect work-life balance in Carilo, Argentina.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Book Your Stay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/location"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}