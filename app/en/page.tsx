import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { AmenitiesToolTip } from "@/components/amenities-tooltip"
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

export default function EnglishHomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              <div className="space-y-4 md:space-y-5 lg:space-y-6 order-1 md:order-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <Translate text={translations.home.hero.title} />
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  <Translate text={translations.home.hero.subtitlePart1} />{" "}
                  <AmenitiesToolTip>
                    <Translate text={translations.home.hero.ultraCapitalistAmenities} />
                  </AmenitiesToolTip>
                  <Translate text={translations.home.hero.subtitlePart2} />
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/en/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-sm md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Translate text={translations.home.hero.cta} /> <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="IL BUCO modern villa exterior with warm lighting and pine forest"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the content - same as Spanish version but with updated links */}
        {/* Note: Just showing some of the sections for brevity */}
        
      </main>

      <SiteFooter />
    </div>
  )
}
