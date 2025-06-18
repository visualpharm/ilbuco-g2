import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Digital Nomad Visa Argentina | IL BUCO Coliving",
  description: "Everything you need to know about Argentina's digital nomad visa program. Work remotely from Cariló with fast internet and comfortable accommodation.",
  keywords: "digital nomad visa argentina, argentina remote work visa, digital nomad argentina, remote work argentina",
  alternates: {
    canonical: "https://ilbuco.com.ar/en/digital-nomad-visa",
    languages: {
      "es": "https://ilbuco.com.ar/visa-nomada-digital",
      "en": "https://ilbuco.com.ar/en/digital-nomad-visa", 
      "pt": "https://ilbuco.com.ar/pt/visto-nomade-digital",
    }
  },
  openGraph: {
    title: "Digital Nomad Visa Argentina | IL BUCO Coliving",
    description: "Everything you need to know about Argentina's digital nomad visa program. Work remotely from Cariló with fast internet and comfortable accommodation.",
    url: "https://ilbuco.com.ar/en/digital-nomad-visa",
  }
}

export default function DigitalNomadVisaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Argentina Digital Nomad Visa
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                An Experience-Based Guide to Working Remotely in Argentina 🇦🇷
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">180 Days</div>
                <div className="text-gray-600">Initial visa duration</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+ 180 Days</div>
                <div className="text-gray-600">Renewable extension</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">~$200</div>
                <div className="text-gray-600">Total visa fees</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Instruction Cheat-Sheet</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Check Eligibility</div>
                      <div className="text-gray-600 text-sm">180-day visa for nationals who don't need tourist visa</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Gather Documents</div>
                      <div className="text-gray-600 text-sm">Passport, CV, work proof, Spanish translations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Apply Online</div>
                      <div className="text-gray-600 text-sm">RaDEX portal, TIE 24H, pay ~$120</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Upload & Submit</div>
                      <div className="text-gray-600 text-sm">Choose consulate, upload docs, pay ~$80</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">5</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Wait for Approval</div>
                      <div className="text-gray-600 text-sm">2-4 weeks processing time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">6</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Enter Argentina</div>
                      <div className="text-gray-600 text-sm">Present PDF permit at immigration</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">7</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Extend if Needed</div>
                      <div className="text-gray-600 text-sm">Apply before expiry for +180 days</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Enjoy Argentina!</div>
                      <div className="text-gray-600 text-sm">Work legally for up to 1 year</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">What is Argentina's Remote Work Visa?</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                In 2022, Argentina introduced the Digital Nomad Visa, allowing remote workers from abroad to legally stay in Argentina for up to 180 days, renewable once. It is intended for those working only for foreign employers or clients.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-gray-900">Multiple-entry</span>
                  </div>
                  <p className="text-sm text-gray-600">Tax-free for foreign income</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-gray-900">Foreign work only</span>
                  </div>
                  <p className="text-sm text-gray-600">Not valid for Argentine companies</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-gray-900">Visa-exempt only</span>
                  </div>
                  <p className="text-sm text-gray-600">For countries without tourist visa requirement</p>
                </div>
              </div>
              
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-gray-800 font-medium">💡 You apply outside Argentina, receive digital approval, and enter with a special permit.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-green-200">
              <div className="text-center mb-8">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Stay With Il Buco: Visa Support for Digital Nomads
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Making your Argentina digital nomad journey smooth, legal, and comfortable
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Documentation</h3>
                  <p className="text-gray-600 text-sm">Confirmation of stay letter valid for migration documents</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💸</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Translation Help</h3>
                  <p className="text-gray-600 text-sm">Low-cost assistance with document prep and translations</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🧭</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Concierge</h3>
                  <p className="text-gray-600 text-sm">We escort you to migration office and handle the process</p>
                </div>
              </div>
              
              <div className="text-center">
                <a 
                  href="https://ilbuco.com.ar/book" 
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-2xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Book Your Stay & Get Visa Support
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <p className="text-gray-600 text-sm mt-4">Perfect for 3+ month stays • Cariló, Argentina</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    This article is not a reprint of official sources. It is based on experience, forum reports, and practical knowledge compiled for real-world use.
                  </p>
                  <p className="text-gray-600 text-sm">
                    For questions or to stay at Il Buco: <a href="https://ilbuco.com.ar/book" className="text-green-600 hover:underline font-medium">https://ilbuco.com.ar/book</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}