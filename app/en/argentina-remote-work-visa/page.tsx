import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  FileText,
  Calendar,
  DollarSign,
  Globe,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Briefcase,
  CreditCard,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Argentina Remote Work Visa Guide 2024 - Digital Nomad Requirements | Il Buco",
  description: "Complete guide to Argentina's remote work visa and digital nomad requirements. Learn visa options, application process, and requirements for working remotely in Argentina.",
  keywords: "argentina remote work visa, digital nomad visa argentina, work visa argentina, argentina visa requirements, remote work permit argentina",
  openGraph: {
    title: "Argentina Remote Work Visa Guide - Digital Nomad Requirements",
    description: "Everything you need to know about obtaining a remote work visa for Argentina, including requirements, application process, and visa options.",
    url: "https://ilbuco.com/en/argentina-remote-work-visa",
    siteName: "Il Buco Coliving",
    images: [
      {
        url: "/person-window-view.jpeg",
        width: 1200,
        height: 630,
        alt: "Digital nomad working remotely in Argentina",
      },
    ],
    locale: "en_US",
  },
}

export default function ArgentinaRemoteWorkVisaPage() {
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
                  Argentina Remote Work
                  <span className="text-green-600"> Visa Guide</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Your complete guide to working remotely in Argentina. Discover visa options, 
                  application requirements, and everything you need to know to legally work 
                  from paradise in 2024.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Plan Your Stay <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/en/location"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Learn About Location
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/person-window-view.jpeg"
                  alt="Remote worker with visa documents working in Argentina"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Visa Options Overview */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Argentina Visa Options for Remote Workers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                While Argentina doesn't have a specific digital nomad visa, several visa 
                options allow remote workers to live and work legally in the country.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tourist Visa (90 Days)
                </h3>
                <p className="text-gray-600 mb-4">
                  Most nationalities get 90 days visa-free entry. Renewable for another 90 days.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />No application required</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Free entry</li>
                  <li className="flex items-center"><AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />Limited to 180 days/year</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Temporary Residence
                </h3>
                <p className="text-gray-600 mb-4">
                  1-year renewable visa for investors, retirees, or those with Argentine sponsors.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1 year validity</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Renewable</li>
                  <li className="flex items-center"><AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />Requires documentation</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-200 p-8 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Work Visa
                </h3>
                <p className="text-gray-600 mb-4">
                  For those with job offers from Argentine companies or freelance permits.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Full work authorization</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Path to residency</li>
                  <li className="flex items-center"><AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />Requires job offer</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Visa Application Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Step-by-step guide to applying for your Argentina remote work visa
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Determine Visa Type
                    </h3>
                    <p className="text-gray-600">
                      Choose the most suitable visa based on your situation, income, and planned duration of stay.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Gather Documents
                    </h3>
                    <p className="text-gray-600">
                      Collect required documents including passport, background check, income proof, and health insurance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Apply Online or In-Person
                    </h3>
                    <p className="text-gray-600">
                      Submit your application through the Argentine consulate or immigration office.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Wait for Processing
                    </h3>
                    <p className="text-gray-600">
                      Processing times vary from 2-8 weeks depending on visa type and current workload.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/modern-bedroom-queen-bed.png"
                  alt="Comfortable accommodation while waiting for visa processing"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Requirements & Documents */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Required Documents & Requirements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Essential Documents
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Valid Passport</h4>
                      <p className="text-gray-600 text-sm">Must be valid for at least 6 months beyond intended stay</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Background Check</h4>
                      <p className="text-gray-600 text-sm">FBI clearance or equivalent from your home country (apostilled)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Proof of Income</h4>
                      <p className="text-gray-600 text-sm">Bank statements, employment letter, or freelance income documentation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Health Insurance</h4>
                      <p className="text-gray-600 text-sm">International health insurance valid in Argentina</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Financial Requirements
                </h3>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">Monthly Income</h4>
                        <p className="text-gray-600">Minimum $2,000 USD/month for temporary residence</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">Bank Statements</h4>
                        <p className="text-gray-600">Last 3-6 months showing stable income</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">Processing Time</h4>
                        <p className="text-gray-600">2-8 weeks depending on visa type</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Important Note</h4>
                      <p className="text-gray-700 text-sm">
                        Requirements may change. Always check with the Argentine consulate 
                        in your country for the most current information before applying.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Argentina Adventure?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              While you're planning your visa application, secure your accommodation 
              in Carilo and experience the perfect remote work environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Book Your Stay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/en/rooms"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                View Accommodations
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}