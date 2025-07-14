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
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Globe,
  FileText,
  Waves,
  Mountain,
  Utensils,
  Home,
  Sun,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Digital Nomad Argentina 2025 - Complete Guide to Remote Work, Community & Lifestyle | Il Buco",
  description: "The complete guide to being a digital nomad in Argentina. Everything about visas, banking, community, costs, lifestyle, and the best places to work remotely in 2025.",
  keywords: "digital nomad argentina, remote work argentina, argentina digital nomad visa, digital nomad community argentina, argentina nomad lifestyle, buenos aires digital nomad, carilo remote work",
  openGraph: {
    title: "Digital Nomad Argentina 2025 - Complete Guide to Remote Work & Community",
    description: "Everything you need to know about living as a digital nomad in Argentina: visas, banking, costs, community, and the best locations for remote work.",
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
                  Digital Nomad Argentina:
                  <span className="text-blue-600"> Complete 2025 Guide</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Your comprehensive guide to thriving as a digital nomad in Argentina. 
                  From visa options and banking to vibrant communities and perfect work-life 
                  balance in South America's most nomad-friendly country.
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

        {/* Digital Nomad Community in Argentina */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Thriving Digital Nomad Community
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Argentina has become a magnet for digital nomads, with vibrant communities 
                in Buenos Aires, Bariloche, Mendoza, and coastal towns like Carilo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Buenos Aires: The Digital Nomad Hub</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Palermo & Recoleta</h4>
                    <p className="text-gray-600">Main nomad neighborhoods with coworking spaces, cafes, and international community</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Weekly Meetups</h4>
                    <p className="text-gray-600">Regular events, language exchanges, and networking opportunities</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Coworking Spaces</h4>
                    <p className="text-gray-600">15+ professional spaces with day passes from $10-20 USD</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Coastal & Mountain Communities</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Carilo & Pinamar</h4>
                    <p className="text-gray-600">Beach towns with growing remote work scene, perfect for surf and work balance</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Bariloche</h4>
                    <p className="text-gray-600">Mountain paradise with ski season nomads and year-round outdoor activities</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Mar del Plata</h4>
                    <p className="text-gray-600">Larger coastal city with established infrastructure and lower costs</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Online Communities & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Facebook Groups</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Buenos Aires Digital Nomads</li>
                    <li>• Argentina Expats</li>
                    <li>• Remote Workers Argentina</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">WhatsApp Groups</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Local nomad communities</li>
                    <li>• Activity-based groups</li>
                    <li>• Housing & accommodation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Slack & Discord</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Professional networking</li>
                    <li>• Tech & startup communities</li>
                    <li>• Language practice groups</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Finance & Banking for Digital Nomads */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Banking & Finance in Argentina
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Essential financial information for digital nomads, from currency exchange 
                to payment methods and cost of living.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Currency & Exchange</h3>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Understanding the Blue Dollar</h4>
                  <p className="text-gray-600 mb-4">
                    The unofficial exchange rate ("blue dollar") often provides 50-100% more 
                    pesos than the official rate. Most nomads use:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Western Union transfers</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Crypto exchanges (USDT popular)</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Cash exchanges at "cuevas"</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">International Cards</p>
                        <p className="text-gray-600 text-sm">Widely accepted but use official exchange rate</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Cash is King</p>
                        <p className="text-gray-600 text-sm">Many places prefer cash, especially with USD</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Local Bank Account</p>
                        <p className="text-gray-600 text-sm">Possible with DNI (residency) for Mercado Pago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Cost of Living (2025)</h3>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-6">Monthly Budget Breakdown</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Accommodation (Private Room)</span>
                      <span className="font-semibold text-gray-900">$400-800 USD</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Food & Dining</span>
                      <span className="font-semibold text-gray-900">$300-500 USD</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Coworking Space</span>
                      <span className="font-semibold text-gray-900">$100-200 USD</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Transportation</span>
                      <span className="font-semibold text-gray-900">$50-100 USD</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Entertainment & Activities</span>
                      <span className="font-semibold text-gray-900">$150-300 USD</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-semibold text-gray-900">Total Monthly</span>
                      <span className="font-bold text-green-600 text-lg">$1,000-2,100 USD</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Pro Tip</h4>
                      <p className="text-gray-700 text-sm">
                        Budget varies greatly between Buenos Aires and smaller cities. 
                        Coastal towns like Carilo offer better value with higher quality of life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visa Information for Digital Nomads */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Visa Options for Digital Nomads
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                While Argentina doesn't have a specific digital nomad visa yet, several 
                options allow remote workers to stay legally for extended periods.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tourist Visa
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />90 days visa-free for most countries</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Extension possible for another 90 days</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />"Visa run" to Uruguay common practice</li>
                  <li className="flex items-start"><AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />Max 180 days per year officially</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Rentista Visa
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />For passive income earners</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Requires $2000+ USD/month income</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />1 year renewable</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Path to permanent residency</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Student Visa
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Enroll in Spanish classes</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Can work remotely legally</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />6-12 month duration</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />Relatively easy to obtain</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                📡 Digital Nomad Visa Update
              </h3>
              <p className="text-gray-700 text-center max-w-3xl mx-auto">
                Argentina is actively developing a dedicated Digital Nomad Visa expected to launch in 2025. 
                This visa will offer 6-12 month stays with simplified requirements for remote workers. 
                <Link href="/en/argentina-remote-work-visa" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Learn more about visa requirements →
                </Link>
              </p>
            </div>
          </div>
        </section>
        
        {/* Digital Nomad Lifestyle */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Digital Nomad Lifestyle in Argentina
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of work productivity and Latin American 
                culture in one of the world's most diverse countries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-900">Daily Life & Culture</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Argentine Schedule</h4>
                        <p className="text-gray-600">
                          Late nights are normal - dinner at 10pm, social life until 2am. 
                          Perfect for night owls or US West Coast remote work.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <Coffee className="h-6 w-6 text-brown-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cafe Culture</h4>
                        <p className="text-gray-600">
                          Work from historic cafes in Buenos Aires or beachside spots 
                          in coastal towns. Strong coffee culture perfect for remote work.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-start space-x-4">
                      <Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Social Integration</h4>
                        <p className="text-gray-600">
                          Argentines are warm and welcoming. Language exchanges, 
                          asados (BBQs), and tango lessons offer easy social entry points.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-gray-900">Work-Life Balance</h3>
                
                <div className="relative h-[300px] rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/photo/living/living4.jpg"
                    alt="Digital nomad lifestyle in Argentina"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg text-center">
                    <Waves className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Beach Life</h4>
                    <p className="text-gray-600 text-sm">Surf before work, sunset walks after calls</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-lg text-center">
                    <Mountain className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Adventure</h4>
                    <p className="text-gray-600 text-sm">Weekend trips to Patagonia or wine country</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg text-center">
                    <Utensils className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Cuisine</h4>
                    <p className="text-gray-600 text-sm">World-class steaks and Malbec wine</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg text-center">
                    <Home className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Comfort</h4>
                    <p className="text-gray-600 text-sm">Modern amenities in historic settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Places for Digital Nomads */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Best Destinations for Digital Nomads in Argentina
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Buenos Aires</h3>
                <p className="text-gray-600 mb-4">The cosmopolitan capital with endless cafes, coworking spaces, and cultural activities.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Wifi className="h-4 w-4 text-blue-500 mr-2" />Excellent internet</li>
                  <li className="flex items-center"><Users className="h-4 w-4 text-purple-500 mr-2" />Huge nomad community</li>
                  <li className="flex items-center"><Coffee className="h-4 w-4 text-brown-500 mr-2" />24/7 city life</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Carilo</h3>
                <p className="text-gray-600 mb-4">Exclusive beach town perfect for focused work and nature immersion.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Waves className="h-4 w-4 text-blue-500 mr-2" />Beach lifestyle</li>
                  <li className="flex items-center"><Tree className="h-4 w-4 text-green-500 mr-2" />Pine forest setting</li>
                  <li className="flex items-center"><Shield className="h-4 w-4 text-gray-500 mr-2" />Safe & exclusive</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bariloche</h3>
                <p className="text-gray-600 mb-4">Mountain paradise with lakes, skiing, and year-round outdoor activities.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Mountain className="h-4 w-4 text-gray-600 mr-2" />Stunning landscapes</li>
                  <li className="flex items-center"><Home className="h-4 w-4 text-red-500 mr-2" />Cozy mountain vibe</li>
                  <li className="flex items-center"><Users className="h-4 w-4 text-purple-500 mr-2" />Growing community</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mendoza</h3>
                <p className="text-gray-600 mb-4">Wine country with perfect climate, outdoor activities, and relaxed lifestyle.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Sun className="h-4 w-4 text-yellow-500 mr-2" />300+ sunny days</li>
                  <li className="flex items-center"><Utensils className="h-4 w-4 text-purple-500 mr-2" />Wine & cuisine</li>
                  <li className="flex items-center"><DollarSign className="h-4 w-4 text-green-500 mr-2" />Affordable living</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cordoba</h3>
                <p className="text-gray-600 mb-4">University city with youthful energy, tech scene, and central location.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Building className="h-4 w-4 text-gray-600 mr-2" />Tech hub</li>
                  <li className="flex items-center"><Users className="h-4 w-4 text-purple-500 mr-2" />Student atmosphere</li>
                  <li className="flex items-center"><MapPin className="h-4 w-4 text-red-500 mr-2" />Central location</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Salta</h3>
                <p className="text-gray-600 mb-4">Colonial charm in the north with indigenous culture and dramatic landscapes.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Home className="h-4 w-4 text-orange-500 mr-2" />Colonial architecture</li>
                  <li className="flex items-center"><Mountain className="h-4 w-4 text-gray-600 mr-2" />Andean scenery</li>
                  <li className="flex items-center"><DollarSign className="h-4 w-4 text-green-500 mr-2" />Very affordable</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Practical Tips */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Essential Tips for Digital Nomads in Argentina
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Connectivity & Work</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Get a local SIM card</p>
                      <p className="text-gray-600 text-sm">Personal or Claro offer best coverage with affordable data plans</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Backup internet options</p>
                      <p className="text-gray-600 text-sm">Always have mobile hotspot as backup for important calls</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Power outages happen</p>
                      <p className="text-gray-600 text-sm">Keep devices charged and consider a portable battery</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Daily Life Hacks</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Learn basic Spanish</p>
                      <p className="text-gray-600 text-sm">Even basics go a long way - locals appreciate the effort</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Embrace the late schedule</p>
                      <p className="text-gray-600 text-sm">Shops close 1-5pm, dinner is at 10pm - plan accordingly</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Join WhatsApp groups</p>
                      <p className="text-gray-600 text-sm">Essential for local community, events, and housing</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-black to-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Digital Nomad Journey in Argentina
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of affordability, culture, and community. 
              Begin your Argentine adventure from our coliving space in Carilo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/the-house"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                See House <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/argentina-remote-work-visa"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-600 transition-colors"
              >
                Visa Information
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}