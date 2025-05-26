"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    src: "/gallery/hero-villa-exterior.jpeg",
    alt: "IL BUCO modern villa exterior with warm lighting and architectural details",
    title: "Villa Exterior",
  },
  {
    src: "/gallery/hero-villa-garden.jpeg",
    alt: "IL BUCO villa viewed from the garden with pine forest setting",
    title: "Garden View",
  },
  {
    src: "/gallery/hero-deck-terrace.jpeg",
    alt: "Wooden deck terrace with outdoor dining furniture and pine forest views",
    title: "Deck Terrace",
  },
  {
    src: "/gallery/hero-outdoor-seating.jpeg",
    alt: "Outdoor seating area with modern furniture and landscaped garden",
    title: "Outdoor Seating",
  },
]

export function HeroGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return

      if (e.key === "Escape") {
        setSelectedImage(null)
      } else if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1))
      }
    }

    if (selectedImage !== null) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-12 grid-rows-4 gap-3 h-[500px] md:h-[600px]">
        {/* Main large image - Villa Exterior */}
        <div
          className="col-span-12 md:col-span-7 row-span-4 relative rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={galleryImages[0].src || "/placeholder.svg"}
            alt={galleryImages[0].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 58vw"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* Garden View - top right */}
        <div
          className="col-span-12 md:col-span-5 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(1)}
        >
          <Image
            src={galleryImages[1].src || "/placeholder.svg"}
            alt={galleryImages[1].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* Deck Terrace - bottom left of right side */}
        <div
          className="col-span-6 md:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(2)}
        >
          <Image
            src={galleryImages[2].src || "/placeholder.svg"}
            alt={galleryImages[2].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 17vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* Outdoor Seating - bottom right */}
        <div
          className="col-span-6 md:col-span-3 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(3)}
        >
          <Image
            src={galleryImages[3].src || "/placeholder.svg"}
            alt={galleryImages[3].alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Main image */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
              <Image
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white bg-opacity-20 rounded-full">
            <span className="text-white text-sm">
              {selectedImage + 1} / {galleryImages.length}
            </span>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}
    </>
  )
}
