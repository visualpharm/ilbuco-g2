"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { AmenitiesToolTip } from "@/components/amenities-tooltip"
import { BookingPopup } from "@/components/booking-popup"
import { ImageLightbox } from "@/components/image-lightbox"
import { translations } from "@/translations/common"
// Windows 11 style icons replaced Lucide React icons
// Icons are now served as SVG files from /public/icons/

export default function Home() {
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const heroImages = [
    {
      src: "/gallery/hero-villa-exterior.jpeg",
      alt: "IL BUCO modern villa exterior with warm lighting and pine forest"
    }
  ]

  const openLightbox = () => {
    setCurrentImageIndex(0)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }
  
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
                  <Translate text={translations.home.hero.subtitlePart2} /> Perfecta para <Link href="/casas-en-carilo-alquiler" className="text-gray-700 no-underline hover:text-gray-600">casas</Link> de lujo en <Link href="/carilo-alquiler" className="text-gray-700 no-underline hover:text-gray-600">Cariló</Link>.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <button
                    onClick={() => setIsBookingPopupOpen(true)}
                    className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-sm md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <span><Translate text={translations.home.hero.cta} /></span>
                    <Image src="/icons/icons8/arrow-right.svg" alt="" width={20} height={20} className="ml-2" />
                  </button>
                </div>
              </div>
              <button
                onClick={openLightbox}
                className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2 group cursor-pointer w-full"
              >
                <Image
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="IL BUCO modern villa exterior with warm lighting and pine forest"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                    <Translate text={translations.common.clickToEnlarge} />
                  </div>
                </div>
              </button>
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
                  <Image src="/icons/icons8/code.svg" alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.vibeCoding} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Image src="/icons/icons8/calculator.svg" alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.finance} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Image src="/icons/icons8/cube.svg" alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.modeling} />
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Image src="/icons/icons8/briefcase.svg" alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <p className="text-lg">
                      <Translate text={translations.home.goals.remoteWork} /> en un <Link href="/carilo-alojamiento" className="text-gray-900 no-underline hover:text-gray-700">alojamiento</Link> ideal
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Image src="/icons/icons8/rocket.svg" alt="" width={24} height={24} className="mr-3 mt-1 flex-shrink-0" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/wifi.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/house.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Link href="/apart-hotel-en-carilo" className="text-gray-900 no-underline hover:text-gray-700"><Translate text={translations.home.highlights.accommodation.title} /></Link>
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.accommodation.description} /> a 150 metros del <Link href="/casas-en-carilo-frente-al-mar" className="text-gray-600 no-underline hover:text-gray-500">mar</Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Image src="/icons/icons8/thermometer.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/sofa.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
                  <div>
                    <h3 className="text-lg font-semibold">
                      <Translate text={translations.home.highlights.commonAreas.title} />
                    </h3>
                    <p className="text-gray-600">
                      <Translate text={translations.home.highlights.commonAreas.description} />. Descubrí <Link href="/que-hacer-en-carilo" className="text-gray-600 no-underline hover:text-gray-500">qué hacer</Link> en los alrededores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Image src="/icons/icons8/tree.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/refrigerator.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/bed.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/shower.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/droplet.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/speaker.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/temperature.svg" alt="" width={24} height={24} className="mr-3 mt-1" style={{filter: 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)'}} />
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
                  <Image src="/icons/icons8/arrow-right.svg" alt="" width={24} height={24} className="mr-3 mt-1 transition-colors" style={{filter: 'brightness(0) saturate(100%) invert(33%) sepia(79%) saturate(1515%) hue-rotate(219deg) brightness(101%) contrast(101%)'}} />
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
      
      <BookingPopup 
        isOpen={isBookingPopupOpen} 
        onClose={() => setIsBookingPopupOpen(false)} 
      />
      
      <ImageLightbox
        images={heroImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={() => {}} // Only one image, so no navigation needed
        onPrevious={() => {}} // Only one image, so no navigation needed
      />
    </div>
  )
}
