"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Translate } from "@/components/translate"
import { translations } from "@/translations/common"

// Gallery images from /the-house and /rooms pages
const galleryImages = [
  // Original /the-house images
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
  
  // Terrazzo Suite images
  {
    src: "/photo/terrazzo/terrazzo1.jpg",
    alt: "Terrace Suite - Large Private Terrace",
    title: "Terrazzo Suite - Private Terrace",
  },
  {
    src: "/photo/terrazzo/terrazzo2.jpg",
    alt: "Terrace Suite - Dining Area",
    title: "Terrazzo Suite - Dining",
  },
  {
    src: "/photo/terrazzo/terrazzo3.jpg",
    alt: "Terrace Suite - Bedroom",
    title: "Terrazzo Suite - Bedroom",
  },
  {
    src: "/photo/terrazzo/terrazzo4.jpg",
    alt: "Terrace Suite - Kitchen Area",
    title: "Terrazzo Suite - Kitchen",
  },
  
  // Penthouse Suite images
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penthouse_corner%20window-m9Wog22hf421cCpCzob9Pc2GGzSUJL.webp",
    alt: "Penthouse Suite - Corner Windows with Forest View",
    title: "Penthouse Suite - Corner Windows",
  },
  {
    src: "/photo/exterior/exterior5.jpg",
    alt: "Penthouse Suite - Sundeck with Forest View",
    title: "Penthouse Suite - Sundeck",
  },
  
  // Giardino Suite images
  {
    src: "/photo/giardino/giardino1.jpg",
    alt: "Giardino Suite - View of living area and bedroom",
    title: "Giardino Suite - Living Area",
  },
  {
    src: "/photo/giardino/giardino2.jpg",
    alt: "Giardino Suite - Kitchen with full-size refrigerator",
    title: "Giardino Suite - Kitchen",
  },
  {
    src: "/photo/giardino/giardino3.jpg",
    alt: "Giardino Suite - Dining area with garden view",
    title: "Giardino Suite - Dining",
  },
  {
    src: "/photo/giardino/giardino5.jpg",
    alt: "Giardino Suite - Bedroom view",
    title: "Giardino Suite - Bedroom",
  },
  
  // Paraiso Suite images
  {
    src: "/photo/paraiso/paraiso1.jpg",
    alt: "Forest-View Suite Kitchen and Dining",
    title: "Paraíso Suite - Kitchen & Dining",
  },
  {
    src: "/photo/paraiso/paraiso7.jpg",
    alt: "Forest-View Suite Bedroom",
    title: "Paraíso Suite - Bedroom",
  },
  {
    src: "/photo/paraiso/paraiso3.jpg",
    alt: "Forest-View Suite Living Area with Sofa",
    title: "Paraíso Suite - Living Area",
  },
  {
    src: "/photo/paraiso/paraiso4.jpg",
    alt: "Forest-View Suite Bathroom",
    title: "Paraíso Suite - Bathroom",
  },
  
  // Living Room images
  {
    src: "/photo/living/living3.jpg",
    alt: "Living Room - Seating Area",
    title: "Living Room - Seating",
  },
  {
    src: "/photo/living/living1.jpg",
    alt: "Living Room - Common Area with Forest View",
    title: "Living Room - Forest View",
  },
  {
    src: "/photo/living/File 24-04-2025, 10 29 16 PM-Edit.jpg",
    alt: "Living Room - Dining and Kitchen Area",
    title: "Living Room - Kitchen & Dining",
  },
  {
    src: "/photo/living/living4.jpg",
    alt: "Living Room - Stairs and Access",
    title: "Living Room - Stairs",
  },
  
  // Additional exterior images
  {
    src: "/photo/exterior/exterior4.jpg",
    alt: "Giardino Suite - Exterior view",
    title: "Villa Exterior View",
  },
  {
    src: "/photo/exterior/exterior1.jpg",
    alt: "Casa moderna en alquiler en Cariló - villa IL BUCO en bosque de pinos",
    title: "Villa in Pine Forest",
  },
]

interface HeroImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function HeroImage({ 
  src, 
  alt, 
  className = "relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden",
  priority = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
}: HeroImageProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Find the starting image index based on the provided src
  const getStartingIndex = () => {
    const index = galleryImages.findIndex(img => img.src === src)
    return index >= 0 ? index : 0
  }

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

  const openLightbox = () => {
    setSelectedImage(getStartingIndex())
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
      {/* Hero Image */}
      <div className={className}>
        <button
          onClick={openLightbox}
          className="relative w-full h-full group cursor-pointer"
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes={sizes}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              <Translate text={translations.common.clickToViewGallery} />
            </div>
          </div>
        </button>
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
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Image title */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-white bg-opacity-20 rounded-lg">
            <span className="text-white text-lg font-medium">
              {galleryImages[selectedImage].title}
            </span>
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