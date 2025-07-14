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
  Building,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Argentina Remote Work Visa Guide 2025 - Complete Digital Nomad Visa Requirements",
  description: "Comprehensive guide to Argentina's visa options for remote workers and digital nomads. Updated 2025 requirements, application process, costs, and step-by-step instructions.",
  keywords: "argentina remote work visa, digital nomad visa argentina, argentina visa requirements, rentista visa argentina, student visa argentina, tourist visa extension argentina",
  openGraph: {
    title: "Argentina Remote Work Visa Guide 2025 - All Visa Options Explained",
    description: "Complete guide to obtaining a visa for remote work in Argentina. Tourist visa, Rentista visa, Student visa, and upcoming Digital Nomad visa requirements.",
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
                  <span className="text-green-600"> Visa Guide 2025</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Complete guide to visa options for remote workers and digital nomads in Argentina. 
                  From tourist visas to permanent residency, understand all your options, requirements, 
                  and application processes.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>📡 Update:</strong> Argentina is developing a dedicated Digital Nomad Visa 
                    expected to launch in mid-2025. Meanwhile, several existing visa options work well 
                    for remote workers.
                  </p>
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
                All Visa Options for Remote Workers in Argentina
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed breakdown of every visa option available for digital nomads and remote 
                workers, from short-term tourist visas to permanent residency paths.
              </p>
            </div>
            
            {/* Tourist Visa Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Short-Term Options (Up to 180 Days)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-gray-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 ml-4">Tourist Visa (90 Days)</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Eligible Countries:</p>
                      <p className="text-gray-600">USA, Canada, UK, EU, Australia, New Zealand, and 50+ other countries</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Requirements:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Valid passport (6+ months validity)</li>
                        <li>• Return ticket (may be requested)</li>
                        <li>• Proof of accommodation</li>
                        <li>• Sufficient funds</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Process:</p>
                      <p className="text-gray-600">Automatic stamp on arrival at airport/border</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Cost:</strong> Free
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-2 border-green-200 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 ml-4">Tourist Visa Extension (+90 Days)</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">How to Extend:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Apply at Dirección Nacional de Migraciones</li>
                        <li>• Online application available</li>
                        <li>• Apply before original 90 days expire</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Alternative: Visa Run</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Cross to Uruguay (Colonia ferry popular)</li>
                        <li>• Same-day return possible</li>
                        <li>• New 90-day stamp on re-entry</li>
                      </ul>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Extension Cost:</strong> ~$200 USD<br />
                        <strong>Visa Run Cost:</strong> ~$50-100 USD (ferry/bus)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Long-term Visa Options */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Long-Term Residency Options (1+ Years)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Rentista Visa */}
                <div className="bg-purple-50 border-2 border-purple-200 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 ml-4">Rentista Visa</h4>
                  </div>
                  <p className="text-gray-600 mb-4">For those with passive income from investments, rentals, or pensions</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">Income Requirement:</p>
                      <p className="text-gray-600 text-sm">$2,000+ USD/month from passive sources</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Documents Needed:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Income proof (apostilled)</li>
                        <li>• Criminal background check</li>
                        <li>• Birth certificate</li>
                        <li>• Health insurance</li>
                      </ul>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Duration:</strong> 1 year (renewable)<br />
                        <strong>Cost:</strong> ~$600 USD
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Student Visa */}
                <div className="bg-yellow-50 border-2 border-yellow-200 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 ml-4">Student Visa</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Study Spanish while working remotely</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">Requirements:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Enrollment in accredited school</li>
                        <li>• Minimum 15-20 hours/week</li>
                        <li>• Can work remotely (not locally)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Popular Schools:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Universidad de Buenos Aires</li>
                        <li>• COINED Spanish School</li>
                        <li>• Academia Buenos Aires</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Duration:</strong> 6-12 months<br />
                        <strong>Cost:</strong> ~$300 USD + tuition
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Pensionado Visa */}
                <div className="bg-red-50 border-2 border-red-200 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 ml-4">Pensionado Visa</h4>
                  </div>
                  <p className="text-gray-600 mb-4">For retirees with pension income</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">Requirements:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Government pension proof</li>
                        <li>• Minimum $2,000 USD/month</li>
                        <li>• Age typically 60+</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Benefits:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Fast-track to permanent residency</li>
                        <li>• Tax benefits on pension</li>
                        <li>• Healthcare access</li>
                      </ul>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Duration:</strong> 1 year → Permanent<br />
                        <strong>Cost:</strong> ~$600 USD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Application Process */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Step-by-Step Application Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed instructions for each visa type, from document preparation to approval
              </p>
            </div>
            
            {/* Tourist Visa Process */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">🌍 Tourist Visa Process</h3>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Entry Requirements</h4>
                    <ol className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-3">1.</span>
                        <div>
                          <p className="font-medium">Check visa-free eligibility</p>
                          <p className="text-sm">Confirm your country is on the visa-exempt list</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-3">2.</span>
                        <div>
                          <p className="font-medium">Book accommodation</p>
                          <p className="text-sm">Have address ready for immigration form</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-3">3.</span>
                        <div>
                          <p className="font-medium">Prepare documents</p>
                          <p className="text-sm">Passport, return ticket (if asked), proof of funds</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Extension Process</h4>
                    <ol className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="font-bold text-green-600 mr-3">1.</span>
                        <div>
                          <p className="font-medium">Apply online at migraciones.gob.ar</p>
                          <p className="text-sm">Start 10 days before expiry</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-green-600 mr-3">2.</span>
                        <div>
                          <p className="font-medium">Pay fee online</p>
                          <p className="text-sm">~$200 USD via credit card or bank transfer</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-green-600 mr-3">3.</span>
                        <div>
                          <p className="font-medium">Receive digital extension</p>
                          <p className="text-sm">Usually approved within 48 hours</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rentista Visa Process */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">💵 Rentista Visa Process</h3>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Phase 1: Documentation</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Apostilled income proof</li>
                        <li>• FBI background check (apostilled)</li>
                        <li>• Birth certificate (apostilled)</li>
                        <li>• Passport copies (all pages)</li>
                        <li>• 2 passport photos</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Phase 2: Translation</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Official Spanish translation</li>
                        <li>• Use certified translator</li>
                        <li>• Cost: ~$50-100 per document</li>
                        <li>• Timeline: 3-5 days</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Phase 3: Submission</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Book appointment online</li>
                        <li>• Submit at Migraciones</li>
                        <li>• Biometrics taken</li>
                        <li>• Receive precaria (temp permit)</li>
                        <li>• Wait 30-60 days for approval</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>💡 Pro Tip:</strong> Hire an immigration lawyer (~$800-1500) to handle the 
                      entire process. They know the system and can prevent costly mistakes and delays.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Common Pitfalls */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">⚠️ Common Mistakes to Avoid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Documentation Errors</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Documents older than 3 months often rejected</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Missing apostille = automatic rejection</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Incorrect translations delay process</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Timing Issues</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Starting process on tourist visa risky</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Overstaying = fines and complications</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Holiday delays can exceed visa validity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Document Requirements */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Complete Document Checklist by Visa Type
              </h2>
            </div>
            
            {/* Document Requirements Table */}
            <div className="overflow-x-auto mb-12">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Document</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Tourist</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Rentista</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pensionado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Valid Passport (6+ months)</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">Criminal Background Check</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Birth Certificate (Apostilled)</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">Income Proof</td>
                    <td className="px-6 py-4 text-center">ℹ️</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Health Insurance</td>
                    <td className="px-6 py-4 text-center">ℹ️</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">School Enrollment Letter</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">❌</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">Pension Statement</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✅</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                ✅ = Required | ❌ = Not Required | ℹ️ = May be requested
              </p>
            </div>
            
            {/* Important Document Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">📄 Document Preparation Tips</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Apostille Everything</p>
                      <p className="text-gray-600 text-sm">All foreign documents need apostille certification</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Recent Documents Only</p>
                      <p className="text-gray-600 text-sm">Most documents must be less than 3 months old</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Official Translations</p>
                      <p className="text-gray-600 text-sm">Use certified Argentine translators only</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Multiple Copies</p>
                      <p className="text-gray-600 text-sm">Bring 2-3 copies of everything</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">💰 Current Costs (2025)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-green-200">
                    <span className="text-gray-700">Tourist Visa Extension</span>
                    <span className="font-semibold text-gray-900">$200 USD</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-green-200">
                    <span className="text-gray-700">Rentista Visa Application</span>
                    <span className="font-semibold text-gray-900">$600 USD</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-green-200">
                    <span className="text-gray-700">Student Visa</span>
                    <span className="font-semibold text-gray-900">$300 USD</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-green-200">
                    <span className="text-gray-700">Document Translation (per page)</span>
                    <span className="font-semibold text-gray-900">$15-25 USD</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-green-200">
                    <span className="text-gray-700">Immigration Lawyer</span>
                    <span className="font-semibold text-gray-900">$800-1500 USD</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="font-semibold text-gray-900">Total Budget (with lawyer)</span>
                    <span className="font-bold text-green-600 text-lg">$1,500-2,500 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Upcoming Digital Nomad Visa */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🎆 Argentina's Digital Nomad Visa (Coming 2025)
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Argentina is finalizing a dedicated Digital Nomad Visa to attract remote workers. 
                Here's what we know so far:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Expected Requirements</h3>
                  <ul className="space-y-3 text-left text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Remote employment verification</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Minimum income ~$3,000 USD/month</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Health insurance requirement</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Clean criminal record</li>
                  </ul>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Expected Benefits</h3>
                  <ul className="space-y-3 text-left text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />6-12 month initial validity</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Renewable for up to 2 years</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Tax benefits on foreign income</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3" />Simplified application process</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-100 p-6 rounded-xl">
                <p className="text-gray-800">
                  <strong>Stay Updated:</strong> Join our mailing list to receive updates when the 
                  Digital Nomad Visa officially launches. Meanwhile, the tourist visa and rentista 
                  visa remain excellent options for remote workers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources and Support */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Helpful Resources & Contacts
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🏢 Official Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="https://www.migraciones.gob.ar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Migraciones Argentina →
                    </a>
                    <p className="text-sm text-gray-600">Official immigration website</p>
                  </li>
                  <li>
                    <a href="https://www.argentina.gob.ar/interior/migraciones" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Visa Information Portal →
                    </a>
                    <p className="text-sm text-gray-600">Government visa guide</p>
                  </li>
                  <li>
                    <p className="font-medium text-gray-900">Immigration Hotline</p>
                    <p className="text-sm text-gray-600">+54 11 4317-0234</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">👥 Community Support</h3>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium text-gray-900">Buenos Aires Expat Hub</p>
                    <p className="text-sm text-gray-600">Facebook group with 25k+ members</p>
                  </li>
                  <li>
                    <p className="font-medium text-gray-900">Argentina Visa Support</p>
                    <p className="text-sm text-gray-600">WhatsApp groups for visa help</p>
                  </li>
                  <li>
                    <p className="font-medium text-gray-900">r/Argentina</p>
                    <p className="text-sm text-gray-600">Reddit community for expats</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">⚖️ Recommended Lawyers</h3>
                <ul className="space-y-3">
                  <li>
                    <p className="font-medium text-gray-900">ARCA Immigration</p>
                    <p className="text-sm text-gray-600">English-speaking, expat-focused</p>
                  </li>
                  <li>
                    <p className="font-medium text-gray-900">Fragomen Argentina</p>
                    <p className="text-sm text-gray-600">International immigration firm</p>
                  </li>
                  <li>
                    <p className="font-medium text-gray-900">Local Bar Association</p>
                    <p className="text-sm text-gray-600">Referrals: +54 11 4379-8700</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-600 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Visa Journey Today
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              While navigating visa requirements, secure your perfect base in Argentina. 
              Our coliving space in Carilo offers the ideal environment for remote workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/en/digital-nomad-argentina"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Digital Nomad Guide <ArrowRight className="ml-2 h-5 w-5" />
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