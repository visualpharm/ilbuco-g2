"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { houseTranslations } from "@/translations/house"
import { Thermometer, Bed, TreePine, Shield } from "lucide-react"

export default function TheHouse() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Masonry Gallery Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                <Translate text={houseTranslations.pageTitle} />
              </h1>

              {/* Masonry Gallery */}
              <div className="mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                  {/* Large featured image - spans 2 columns and 2 rows */}
                  <div
                    className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior1.jpg-tCC7xI5HgiC3rvPGEvrMVqYHBaHF3C.jpeg",
                        alt: "IL BUCO modern villa exterior with warm lighting and wooden details",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior1.jpg-tCC7xI5HgiC3rvPGEvrMVqYHBaHF3C.jpeg"
                      alt="IL BUCO modern villa exterior with warm lighting and wooden details"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  {/* Other images */}
                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior6.jpg-gVE7ITTxoPaDiNHT7fasYSwoGjuXIu.jpeg",
                        alt: "Rooftop terrace with wooden deck and outdoor dining area",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior6.jpg-gVE7ITTxoPaDiNHT7fasYSwoGjuXIu.jpeg"
                      alt="Rooftop terrace with wooden deck and outdoor dining area"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior4.jpg-03IwSFoKNZGwpj8rzfgZy4ep2DT1Do.jpeg",
                        alt: "Ground level terrace with outdoor seating and forest view",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior4.jpg-03IwSFoKNZGwpj8rzfgZy4ep2DT1Do.jpeg"
                      alt="Ground level terrace with outdoor seating and forest view"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div
                    className="col-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior5.jpg-wbVpsAQFKVlv11MJL2isf7CTqyslpx.jpeg",
                        alt: "Rooftop terrace with planters and forest backdrop",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior5.jpg-wbVpsAQFKVlv11MJL2isf7CTqyslpx.jpeg"
                      alt="Rooftop terrace with planters and forest backdrop"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior3.jpg-yOCSOAJcVAVoGTgd2JQ3eynSv5Vyie.jpeg",
                        alt: "Ground level patio with outdoor furniture and garden path",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior3.jpg-yOCSOAJcVAVoGTgd2JQ3eynSv5Vyie.jpeg"
                      alt="Ground level patio with outdoor furniture and garden path"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() =>
                      setSelectedImage({
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior2.jpg-KRxB4RFnd795skUzQAzQ7JvQybj0U9.jpeg",
                        alt: "Modern concrete villa nestled among pine trees",
                      })
                    }
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior2.jpg-KRxB4RFnd795skUzQAzQ7JvQybj0U9.jpeg"
                      alt="Modern concrete villa nestled among pine trees"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Highlights Section */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  <Translate text={houseTranslations.highlights.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-4">
                      <Bed className="h-8 w-8 mr-3 text-blue-600" />
                      <h3 className="text-lg font-semibold">
                        <Translate text={houseTranslations.highlights.bedrooms.title} />
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      <Translate text={houseTranslations.highlights.bedrooms.description} />
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-4">
                      <Thermometer className="h-8 w-8 mr-3 text-red-600" />
                      <h3 className="text-lg font-semibold">
                        <Translate text={houseTranslations.highlights.climate.title} />
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      <Translate text={houseTranslations.highlights.climate.description} />
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-4">
                      <TreePine className="h-8 w-8 mr-3 text-green-600" />
                      <h3 className="text-lg font-semibold">
                        <Translate text={houseTranslations.highlights.roof.title} />
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      <Translate text={houseTranslations.highlights.roof.description} />
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-4">
                      <Shield className="h-8 w-8 mr-3 text-purple-600" />
                      <h3 className="text-lg font-semibold">
                        <Translate text={houseTranslations.highlights.sound.title} />
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      <Translate text={houseTranslations.highlights.sound.description} />
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  <Translate text={houseTranslations.bookYourStay.title} />
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  <Translate text={houseTranslations.bookYourStay.description} />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-8 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Translate text={houseTranslations.bookYourStay.button} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-[90vh] overflow-hidden">
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="rounded-lg object-contain max-h-[90vh] w-auto"
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
