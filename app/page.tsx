import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ArrowRight,
  Wifi,
  Thermometer,
  Sofa,
  TreesIcon as Tree,
  Refrigerator,
  Bed,
  ShowerHeadIcon as Shower,
  Droplet,
  Building,
  Shield,
  Code,
  Calculator,
  CuboidIcon as Cube,
  Briefcase,
  Rocket,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Ultra-modern tech villa in Cariló, Argentina
                </h1>
                <p className="text-lg text-gray-700 max-w-xl">
                  Set in a wild pine forest, steps from the beach and city comforts. Ideal for tech founders and remote
                  workers planning extended stays to achieve long-standing goals.
                </p>
                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Book your stay <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="IL BUCO Villa in pine forest"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Achieve your long-standing goals, such as:</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Code className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">Diving into vibe coding (Cursor? v0?)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calculator className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      Mastering financial accounting (I love{" "}
                      <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                        this course
                      </Link>
                      )
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Cube className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      Learning 3D modeling (
                      <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                        Plasticity
                      </Link>
                      , it's like Figma for 3D)
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">Boosting your remote-work career</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Rocket className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">Finally launching your startup</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Highlights</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">High-Speed Internet</h3>
                    <p className="text-gray-600">
                      500 Mbit fiber-to-the-home with mesh Wi-Fi for seamless connectivity
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🏠</span>
                  <div>
                    <h3 className="text-lg font-semibold">Spacious Accommodation</h3>
                    <p className="text-gray-600">4 bedrooms (2 persons each + futon for 2 more)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Climate Control</h3>
                    <p className="text-gray-600">Radiant-floor heating and 8 cool-and-heat air conditioners</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Common Areas</h3>
                    <p className="text-gray-600">Large common living room, big common kitchen and a huge couch</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Outdoor Space</h3>
                    <p className="text-gray-600">Green roof with grill and big planted terrace</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Refrigerator className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Kitchen Amenities</h3>
                    <p className="text-gray-600">Full-size 300 L refrigerator in every kitchenette</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Premium Bedding</h3>
                    <p className="text-gray-600">4 mattresses with toppers and bedding up to 5-star hotel standard</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Luxury Bathrooms</h3>
                    <p className="text-gray-600">
                      Glass shower screens, handheld bidet sprayer, and a washing machine in each
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Droplet className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Water Treatment</h3>
                    <p className="text-gray-600">
                      Water-treatment plant with softener – strong pressure, spot-free glass
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Building className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Sound Insulation</h3>
                    <p className="text-gray-600">
                      Load-bearing concrete prevents vibrations and offers superior sound insulation
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">Full Insulation</h3>
                    <p className="text-gray-600">
                      Interior insulation and brick walls; black double-glazed PVC windows
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link href="/the-house" className="flex items-start mb-3 group">
                  <ArrowRight className="h-5 w-5 mr-3 mt-1 text-blue-600 group-hover:text-blue-800 transition-colors" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      All House Features
                    </h3>
                    <p className="text-gray-600">Explore the complete list of amenities and features</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Internet Speed Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="mb-6">
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-n9F4IHjvhVUozNWKdlOYin6434gR7J.png"
                    alt="Fast.com speed test showing 350 Mbps"
                    width={600}
                    height={400}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">*Screenshot sent by a tenant</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src="/person-window-view.jpeg"
                      alt="Relaxing view from IL BUCO"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-2xl font-medium">"Looking at swinging pines makes me a better person"</p>
                  <p className="text-gray-600">— Tenant</p>
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
