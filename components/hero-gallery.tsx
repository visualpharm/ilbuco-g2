"use client"

import { ImageGallery } from "@/components/image-gallery"
import { houseGallery } from "@/lib/gallery"

// The house mosaic: four outdoor photos, the viewer browses every photo of the house.
export function HeroGallery() {
  return <ImageGallery images={houseGallery.slice(0, 4)} lightboxImages={houseGallery} priority />
}
