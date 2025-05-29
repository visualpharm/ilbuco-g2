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
  className?: string
}

export function ImageGallery({ 
  images, 
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

  // Ensure there are enough images for the layout, or provide fallbacks
  const img1 = images[0] || { src: "/placeholder.svg", alt: "Placeholder 1" }
  const img2 = images[1] || { src: "/placeholder.svg", alt: "Placeholder 2" }
  const img3 = images[2] || { src: "/placeholder.svg", alt: "Placeholder 3" }
  const img4 = images[3] || { src: "/placeholder.svg", alt: "Placeholder 4" }


  if (images.length === 0) {
    return <div className="text-center py-8">No images to display.</div>;
  }
  
  if (images.length < 4) {
    // Fallback for fewer than 4 images: display them in a simpler grid or stacked.
    // For now, let's use a simple horizontal scroll or a basic grid.
    // This example uses a simple grid, adjust as needed.
    return (
      <>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 ${className}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
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

  return (
    <>
      {/* Gallery Grid - Masonry Layout */}
      <div className={`grid grid-cols-12 grid-rows-4 gap-3 h-[500px] md:h-[600px] mb-8 ${className}`}>
        {/* Main large image */}
        {img1 && (
          <div
            className="col-span-12 md:col-span-7 row-span-4 relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={img1.src}
              alt={img1.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 58vw"
              priority={images.indexOf(img1) === 0} // Priority for the first image in the main array
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        )}

        {/* Second image - top right */}
        {img2 && (
          <div
            className="col-span-12 md:col-span-5 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group min-h-[100px]"
            onClick={() => openLightbox(1)}
          >
            <Image
              src={img2.src}
              alt={img2.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        )}

        {/* Third image - bottom left of right side */}
        {img3 && (
          <div
            className="col-span-6 md:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group min-h-[100px]"
            onClick={() => openLightbox(2)}
          >
            <Image
              src={img3.src}
              alt={img3.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 17vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        )}

        {/* Fourth image - bottom right */}
        {img4 && (
          <div
            className="col-span-6 md:col-span-3 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group min-h-[100px]"
            onClick={() => openLightbox(3)}
          >
            <Image
              src={img4.src}
              alt={img4.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        )}
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
