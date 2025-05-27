"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "./image-lightbox"

interface ImageData {
  src: string
  alt: string
}

interface ImageGalleryProps {
  images: ImageData[]
  gridCols?: "grid-cols-2" | "grid-cols-3" | "grid-cols-4" | "grid-cols-5"
  className?: string
}

export function ImageGallery({ 
  images, 
  gridCols = "grid-cols-3",
  className = "" 
}: ImageGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:${gridCols} gap-4 mb-8 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-[250px] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                Click to enlarge
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageLightbox
        images={images}
        isOpen={isLightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </>
  )
}
