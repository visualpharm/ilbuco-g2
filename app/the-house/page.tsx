"use client"
import Image from "next/image"
import { useState } from "react"

export default function TheHouse() {
  // Add this state after the component declaration
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  return (
    <main className="flex flex-col items-center justify-between p-24">
      {/* Masonry Gallery Hero Section */}
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
  )
}
