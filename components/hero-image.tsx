"use client"

import { useState } from "react"
import Image from "next/image"
import { Translate } from "@/components/translate"
import { ImageLightbox } from "@/components/image-lightbox"
import { translations } from "@/translations/common"
import { houseGallery } from "@/lib/gallery"

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
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px",
}: HeroImageProps) {
  const [index, setIndex] = useState<number | null>(null)
  const count = houseGallery.length

  const open = () => {
    const start = houseGallery.findIndex((img) => img.src === src)
    setIndex(start >= 0 ? start : 0)
  }

  return (
    <>
      <div className={className}>
        <button onClick={open} className="relative w-full h-full group cursor-zoom-in">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={priority}
            sizes={sizes}
          />
          <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-base font-medium text-gray-900 shadow-sm">
            <Image src="/icons/icons8/gallery.png" alt="" width={20} height={20} />
            <Translate text={translations.common.photos} />
          </span>
        </button>
      </div>

      <ImageLightbox
        images={houseGallery}
        isOpen={index !== null}
        currentIndex={index ?? 0}
        onClose={() => setIndex(null)}
        onNext={() => setIndex((i) => ((i ?? 0) + 1) % count)}
        onPrevious={() => setIndex((i) => ((i ?? 0) - 1 + count) % count)}
      />
    </>
  )
}
