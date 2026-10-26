"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox, type LightboxImage } from "./image-lightbox"

interface ImageGalleryProps {
  images: LightboxImage[]
  /** Photos the viewer browses; defaults to the tiles themselves. */
  lightboxImages?: LightboxImage[]
  className?: string
  priority?: boolean
  /** "mosaic": one large photo and three small; "squares": an even grid of square thumbnails. */
  layout?: "mosaic" | "squares"
}

// Mosaic tiles: one large photo on the left, three on the right.
const tiles = [
  { cls: "col-span-12 md:col-span-7 row-span-4 rounded-xl", sizes: "(max-width: 768px) 100vw, 58vw" },
  { cls: "col-span-12 md:col-span-5 row-span-2 rounded-lg min-h-[100px]", sizes: "(max-width: 768px) 100vw, 42vw" },
  { cls: "col-span-6 md:col-span-2 row-span-2 rounded-lg min-h-[100px]", sizes: "(max-width: 768px) 50vw, 17vw" },
  { cls: "col-span-6 md:col-span-3 row-span-2 rounded-lg min-h-[100px]", sizes: "(max-width: 768px) 50vw, 25vw" },
]

export function ImageGallery({ images, lightboxImages, className = "", priority = false, layout = "mosaic" }: ImageGalleryProps) {
  const viewer = lightboxImages ?? images
  const [index, setIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const open = (image: LightboxImage) => {
    const i = viewer.findIndex((v) => v.src === image.src)
    setIndex(i >= 0 ? i : 0)
  }

  const tile = (image: LightboxImage, i: number, cls: string, sizes: string) => (
    <button
      key={image.src}
      type="button"
      onClick={() => open(image)}
      className={`relative overflow-hidden cursor-zoom-in group ${cls}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        sizes={sizes}
        priority={priority && i === 0}
      />
    </button>
  )

  return (
    <>
      {layout === "squares" ? (
        <div className={`grid grid-cols-3 gap-2 ${className}`}>
          {images.map((image, i) => tile(image, i, "aspect-square rounded-lg", "(max-width: 768px) 33vw, 300px"))}
        </div>
      ) : images.length < 4 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
          {images.map((image, i) =>
            tile(image, i, "h-[250px] md:h-[300px] rounded-lg", "(max-width: 768px) 100vw, 50vw"),
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-12 grid-rows-4 gap-3 h-[500px] md:h-[600px] ${className}`}>
          {images.slice(0, 4).map((image, i) => tile(image, i, tiles[i].cls, tiles[i].sizes))}
        </div>
      )}

      <ImageLightbox
        images={viewer}
        isOpen={index !== null}
        currentIndex={index ?? 0}
        onClose={() => setIndex(null)}
        onNext={() => setIndex((i) => ((i ?? 0) + 1) % viewer.length)}
        onPrevious={() => setIndex((i) => ((i ?? 0) - 1 + viewer.length) % viewer.length)}
      />
    </>
  )
}
