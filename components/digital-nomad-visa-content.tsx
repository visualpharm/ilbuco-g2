"use client"

import { useState } from "react"
import { BookingPopup } from "./booking-popup"

export function DigitalNomadVisaContent() {
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false)
  
  // Calculate current year or next year if we're in December
  const getCurrentYearOrNext = () => {
    const now = new Date()
    const currentMonth = now.getMonth() // 0-based, so December is 11
    const currentYear = now.getFullYear()
    
    // If it's December (month 11), show next year
    return currentMonth === 11 ? currentYear + 1 : currentYear
  }

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Argentina Digital Nomad Visa {getCurrentYearOrNext()}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete Digital Nomad Visa Guide: How to Apply for Argentina's Remote Work Visa 🇦🇷
            </p>
          </div>
          
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">180 Days</div>
              <div className="text-gray-600">Digital nomad visa initial duration</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">+ 180 Days</div>
              <div className="text-gray-600">Digital nomad visa extension</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">~$200</div>
              <div className="text-gray-600">Total digital nomad visa fees</div>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* What is Digital Nomad Visa Section */}
<section className="pt-3 pb-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What is Argentina's Digital Nomad Visa?</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Argentina introduced the Digital Nomad Visa in May 2022 as a special transitory residence permit for remote workers. It's essentially a 6-month digital nomad visa (extendable to 12 months) that lets you legally live and work remotely from Argentina for an extended period. Unlike a tourist entry (90 days on arrival for most), the nomad visa gives you formal status as a resident for the duration – without needing to be employed by an Argentine company.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Who Can Apply for Digital Nomad Visa?</h3>
              <p className="text-green-800 text-sm mb-2">
                Only citizens of countries that do not require a tourist visa for Argentina can get this nomad visa. This covers most Europeans, North Americans, Australians, New Zealanders, Brits, and many others.
              </p>
              <p className="text-green-800 text-sm">
                <a href="https://en.wikipedia.org/wiki/Visa_policy_of_Argentina" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-medium">
                  Check if your country needs a visa to visit Argentina →
                </a>
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-900">Multiple-entry</span>
                </div>
                <p className="text-sm text-gray-600">Tax-free foreign income for digital nomads</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-900">Foreign work only</span>
                </div>
                <p className="text-sm text-gray-600">Digital nomad visa not valid for Argentine companies</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-semibold text-gray-900">Up to 1 Year Stay</span>
                </div>
                <p className="text-sm text-gray-600">180 days + 180 day extension possible</p>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-gray-800 font-medium">💡 You apply for the digital nomad visa outside Argentina, receive digital approval, and enter with a special nomad permit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Nomad Visa Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Argentina Digital Nomad Visa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Benefits and advantages of the Argentina nomad visa for remote workers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🕐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Up to 1 Year Stay</h3>
              <p className="text-gray-600">Digital nomad visa allows 180 days + 180 day extension</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tax-Free Foreign Income</h3>
              <p className="text-gray-600">No Argentine taxes on nomad visa foreign earnings</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Entry Permit</h3>
              <p className="text-gray-600">Digital nomad visa allows multiple entries during validity</p>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Digital Nomad Visa Processing Timeline
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1-2</span>
                  </div>
                  <p className="text-sm font-medium">Weeks to prepare nomad visa documents</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">24H</span>
                  </div>
                  <p className="text-sm font-medium">TIE 24H express processing option</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">2-4</span>
                  </div>
                  <p className="text-sm font-medium">Weeks standard nomad visa processing</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-600 font-bold">180</span>
                  </div>
                  <p className="text-sm font-medium">Days initial digital nomad visa validity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Options Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-6 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Alternative: Tourist Entry Without Digital Nomad Visa
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    If the digital nomad visa process seems overwhelming, you can still come to Argentina for <strong>90 days with no visa required</strong> (for most nationalities). Once you're here, you can also apply for a <strong>90-day extension one time</strong> to stay for a total of <strong>180 days with no visa needed</strong>.
                  </p>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Argentina's Relaxed Immigration Policy</h4>
                    <p className="text-yellow-800 text-sm mb-3">
                      Immigration enforcement here is very relaxed. Unlike most countries, <strong>overstaying is not technically illegal</strong> in Argentina. If you overstay your tourist visa, you simply pay a fine before you leave.
                    </p>
                    <p className="text-yellow-800 text-sm mb-3">
                      <strong>Overstay Fine (Habilitación de Salida):</strong><br />
                      If you overstay your permitted time in Argentina, you must pay a fixed fine of <strong>ARS 40,000 (about USD 40 as of June 2025)</strong> before departure.
                    </p>
                    <p className="text-yellow-800 text-sm">
                      This amount is the same no matter how long you overstayed — 1 day or 3 months, the fine does not change.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">✅ Tourist Entry Pros</h5>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• No paperwork or visa fees</li>
                        <li>• Immediate entry upon arrival</li>
                        <li>• Can extend once for 180 days total</li>
                        <li>• Minimal overstay penalties</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-900 mb-2">❌ Tourist Entry Cons</h5>
                      <ul className="text-red-800 text-sm space-y-1">
                        <li>• No legal work authorization</li>
                        <li>• Doesn't count toward residency</li>
                        <li>• Limited to 180 days + overstay</li>
                        <li>• No official resident benefits</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Bottom line:</strong> For short-term stays (3-6 months), the tourist route might be simpler. For longer stays or those wanting legal resident status, the digital nomad visa is worth pursuing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Digital Nomad Visa Document Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential documents needed for your Argentina digital nomad visa application
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">Valid passport</span>
                    <p className="text-sm text-gray-600">6+ months validity remaining</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">Background check</span>
                    <p className="text-sm text-gray-600">FBI clearance or equivalent (apostilled)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">Proof of income</span>
                    <p className="text-sm text-gray-600">Bank statements, employment letter</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-900">Health insurance</span>
                    <p className="text-sm text-gray-600">Valid coverage in Argentina</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Requirements</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Minimum Income</h4>
                  <p className="text-green-800 text-sm">$1,000-$2,500 USD per month (unofficial guideline)</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Bank Statements</h4>
                  <p className="text-blue-800 text-sm">Last 3-6 months showing consistent income</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Processing Fees</h4>
                  <p className="text-purple-800 text-sm">Approximately $200 USD total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Digital Nomad Visa Step-by-Step Application Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete walkthrough of the Argentina digital nomad visa application process
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Gather Required Documents</h3>
                <p className="text-gray-600 mb-3">Collect all necessary documents including passport, background check, income proof, and health insurance. Allow 2-4 weeks for document preparation.</p>
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">💡 Start with background check first - it takes the longest to obtain</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="font-bold text-green-600">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Create TIE Account</h3>
                <p className="text-gray-600 mb-3">Register on the <a href="https://www.radixportal.gob.ar/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Radix Portal</a> (Argentina's online immigration system). The TIE 24H service offers express processing.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Application</h3>
                <p className="text-gray-600 mb-3">Upload all documents through the online portal. Pay the processing fees (approximately $200 USD total).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="font-bold text-red-600">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wait for Approval</h3>
                <p className="text-gray-600 mb-3">Processing typically takes 2-4 weeks. You'll receive digital approval via email with your digital nomad visa permit.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="font-bold text-yellow-600">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Enter Argentina</h3>
                <p className="text-gray-600">Present your digital approval at the border. You'll receive a 180-day entry stamp for your digital nomad visa stay.</p>
              </div>
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
                Stay With Il Buco: Digital Nomad Visa Support Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Making your Argentina digital nomad visa journey smooth, legal, and comfortable
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Digital Nomad Visa Documentation</h3>
                <p className="text-gray-600 text-sm">Confirmation of stay letter valid for nomad visa documents</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Nomad Visa Translation Help</h3>
                <p className="text-gray-600 text-sm">Low-cost assistance with nomad visa document prep and translations</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🧭</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Nomad Visa Concierge</h3>
                <p className="text-gray-600 text-sm">We escort you to migration office and handle the nomad visa process</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsBookingPopupOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-2xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Book Your Stay & Get Digital Nomad Visa Support
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
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
                  For questions or to stay at Il Buco: <button onClick={() => setIsBookingPopupOpen(true)} className="text-green-600 hover:underline font-medium">Contact us here</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Digital Nomad Visa FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Argentina's digital nomad visa application process
            </p>
          </div>
          
          <div className="space-y-8">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I need an apostille for my digital nomad visa documents? And what about translations?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Yes, for any official documents from abroad, you'll need proper legalization. If it's issued by a government or institution abroad (background check, birth certificate, marriage certificate), get an Apostille of The Hague. For translations: all documents not originally in Spanish must be translated. Argentina specifically prefers translations done by a certified public translator and then "legalized" by the Colegio de Traductores (Translator's Association).
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How much income do I need to show for the digital nomad visa? Is there a minimum?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                There's no fixed minimum income published by the government for the nomad visa. However, unofficial sources often cite around $1,000-$2,500 USD per month as a sensible minimum. The key is to show consistent revenue or funds. They mainly want to ensure you won't be stranded or take local jobs. In your cover letter, you can explicitly state "I earn $X per month which is sufficient for my stay."
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does the digital nomad visa approval take?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Officially, the online nomad visa is processed in about 10 business days (2 weeks) if everything is perfect. Realistically, most applicants report waiting 2-6 weeks for email approval. Factors affecting timing include consulate workload, holidays, and document clarifications. Always apply as early as possible and don't fly to Argentina until your visa is approved.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I apply for the digital nomad visa while I'm already in Argentina as a tourist?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Technically, the TIE online process requires you to be outside Argentina during processing. If you apply while physically in Argentina, Migraciones will likely deny the application. Workarounds include: 1) Leave and apply from abroad (e.g., Uruguay or Chile), or 2) Do a status change (Cambio de Categoría) in Argentina through DNM, which involves higher fees (~$200) and is more bureaucratic.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Does time on the digital nomad visa count towards permanent residency or citizenship?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This is a gray area. The digital nomad visa is classified as "residencia transitoria" (transitory residence), not "residencia temporaria" which usually counts towards permanent residency. However, an immigration lawyer advised one nomad that the time might count towards the 2-year citizenship eligibility. It's not officially confirmed, so consult legal advice if you're planning long-term residency.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is the digital nomad visa "tax-free"? Do I pay Argentine taxes?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                No, as long as your income is from outside Argentina, you won't pay Argentine income tax. The digital nomad visa doesn't make you a tax resident. Argentina taxes residents only on Argentine-sourced income, and foreign income is exempt for residents who aren't Argentine nationals. Your salary from abroad is not taxed by Argentina, but you might still owe taxes in your home country.
              </p>
            </div>

            {/* FAQ Item 7 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I work for an Argentine company or take local freelance gigs on this visa?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                No. The digital nomad visa is explicitly for work for employers/clients outside Argentina. It does not grant work authorization for Argentine entities. If you want to work for an Argentine company, you'd need a different visa (like a work visa sponsored by that company). The nomad visa is meant to encourage you to spend your foreign income in Argentina, not to enter its labor market.
              </p>
            </div>

            {/* FAQ Item 8 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if my digital nomad visa application is denied? Can I appeal?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                If denied, understand why first. Common reasons include missing/incorrect documents or ineligibility. If it's correctable (missing document authentication, translation not provided), you generally can re-submit documents without paying again for one-time reconsideration. The $200 in fees is non-refundable, but a denial isn't permanent - you can apply again after fixing issues.
              </p>
            </div>

            {/* FAQ Item 9 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I bring my spouse or children under this digital nomad visa?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                There isn't a specific family version of the nomad visa. Each adult would need to qualify and apply individually. If you have a spouse who also works remotely, they should apply separately. For dependent children, they can usually stay as tourists for up to 90 days, but for longer family stays, consider exploring other visa types or family sponsorship options.
              </p>
            </div>

            {/* FAQ Item 10 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Any tips to make the digital nomad visa process smoother?
              </h3>
              <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                <p>• Label files clearly (e.g., "Smith_Passport.jpg", "Smith_EmploymentLetter.pdf")</p>
                <p>• Include a line in your cover letter that you won't engage in local employment</p>
                <p>• If you have multiple nationalities, use the passport that gives visa-free entry to Argentina</p>
                <p>• Keep copies of everything you submit and all correspondence</p>
                <p>• Join Buenos Aires digital nomads Facebook groups for community support</p>
                <p>• Apply early and be patient with Argentina's bureaucracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Il Buco Banner - After FAQ */}
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
                Ready for Your Digital Nomad Visa Journey?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get professional support for your Argentina digital nomad visa application and accommodation
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Digital Nomad Visa Documentation</h3>
                <p className="text-gray-600 text-sm">Confirmation of stay letter valid for nomad visa documents</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Nomad Visa Translation Help</h3>
                <p className="text-gray-600 text-sm">Low-cost assistance with nomad visa document prep and translations</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🧭</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Nomad Visa Concierge</h3>
                <p className="text-gray-600 text-sm">We escort you to migration office and handle the nomad visa process</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setIsBookingPopupOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-2xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Your Digital Nomad Visa Application Journey
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <p className="text-gray-600 text-sm mt-4">Perfect for 3+ month digital nomad stays • Cariló, Argentina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popups */}
      <BookingPopup 
        isOpen={isBookingPopupOpen} 
        onClose={() => setIsBookingPopupOpen(false)} 
      />
    </main>
  )
}