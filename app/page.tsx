import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { translations } from "@/translations/common"
import {
  ArrowRight,
  Wifi,
  Code,
  Calculator,
  CuboidIcon as Cube,
  Briefcase,
  Rocket,
  Thermometer,
  Sofa,
  TreesIcon as Tree,
  Refrigerator,
  Bed,
  ShowerHeadIcon as Shower,
  Droplet,
  Building,
  Shield,
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
                  <Translate text={translations.home.hero.title} />
                </h1>
                <p className="text-lg text-gray-700 max-w-xl">
                  <Translate text={translations.home.hero.subtitle} />
                </p>
                <div className="pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Translate text={translations.home.hero.cta} /> <ArrowRight className="ml-2 h-4 w-4" />
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
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                <Translate text={translations.home.goals.title} />
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Code className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.vibeCoding} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calculator className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.finance} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Cube className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.modeling} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.remoteWork} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Rocket className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.startup} />
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              <Translate text={translations.home.highlights.title} />
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.internet.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.internet.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🏠</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.accommodation.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.accommodation.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.climate.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.climate.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.commonAreas.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.commonAreas.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.outdoorSpace.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.outdoorSpace.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Refrigerator className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.kitchen.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.kitchen.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.bedding.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.bedding.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.bathrooms.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.bathrooms.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Droplet className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.waterTreatment.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.waterTreatment.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Building className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.soundInsulation.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.soundInsulation.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.fullInsulation.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.fullInsulation.description} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link href="/the-house" className="flex items-start mb-3 group">
                  <ArrowRight className="h-5 w-5 mr-3 mt-1 text-blue-600 group-hover:text-blue-800 transition-colors" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      <Translate text={translations.home.highlights.allFeatures.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.allFeatures.description} />
                    </p>
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
                <p className="text-sm text-gray-500 mt-4">
                  <Translate text={translations.home.internetSpeed.caption} />
                </p>
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
                  <p className="text-2xl font-medium">
                    "<Translate text={translations.home.testimonial.quote} />"
                  </p>
                  <p className="text-gray-600">
                    <Translate text={translations.home.testimonial.author} />
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
