// Every photo of the house in browsing order: the hero gallery opens on these.
export interface GalleryImage {
  src: string
  alt: string
}

export const houseGallery: GalleryImage[] = [
  // Original /the-house images
  {
    src: "/gallery/hero-villa-exterior.jpeg",
    alt: "IL BUCO modern villa exterior with warm lighting and architectural details",
  },
  {
    src: "/gallery/hero-villa-garden.jpeg",
    alt: "IL BUCO villa viewed from the garden with pine forest setting",
  },
  {
    src: "/gallery/hero-deck-terrace.jpeg",
    alt: "Wooden deck terrace with outdoor dining furniture and pine forest views",
  },
  {
    src: "/gallery/hero-outdoor-seating.jpeg",
    alt: "Outdoor seating area with modern furniture and landscaped garden",
  },
  
  // Terrazzo Suite images
  {
    src: "/photo/terrazzo/terrazzo1.jpg",
    alt: "Terrace Suite - Large Private Terrace",
  },
  {
    src: "/photo/terrazzo/terrazzo2.jpg",
    alt: "Terrace Suite - Dining Area",
  },
  {
    src: "/photo/terrazzo/terrazzo3.jpg",
    alt: "Terrace Suite - Bedroom",
  },
  {
    src: "/photo/terrazzo/terrazzo4.jpg",
    alt: "Terrace Suite - Kitchen Area",
  },
  
  // Penthouse Suite images
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penthouse_corner%20window-m9Wog22hf421cCpCzob9Pc2GGzSUJL.webp",
    alt: "Penthouse Suite - Corner Windows with Forest View",
  },
  {
    src: "/photo/exterior/exterior5.jpg",
    alt: "Penthouse Suite - Sundeck with Forest View",
  },
  
  // Giardino Suite images
  {
    src: "/photo/giardino/giardino1.jpg",
    alt: "Giardino Suite - View of living area and bedroom",
  },
  {
    src: "/photo/giardino/giardino2.jpg",
    alt: "Giardino Suite - Kitchen with full-size refrigerator",
  },
  {
    src: "/photo/giardino/giardino3.jpg",
    alt: "Giardino Suite - Dining area with garden view",
  },
  {
    src: "/photo/giardino/giardino5.jpg",
    alt: "Giardino Suite - Bedroom view",
  },
  
  // Paraiso Suite images
  {
    src: "/photo/paraiso/paraiso1.jpg",
    alt: "Forest-View Suite Kitchen and Dining",
  },
  {
    src: "/photo/paraiso/paraiso7.jpg",
    alt: "Forest-View Suite Bedroom",
  },
  {
    src: "/photo/paraiso/paraiso3.jpg",
    alt: "Forest-View Suite Living Area with Sofa",
  },
  {
    src: "/photo/paraiso/paraiso4.jpg",
    alt: "Forest-View Suite Bathroom",
  },
  
  // Living Room images
  {
    src: "/photo/living/living3.jpg",
    alt: "Living Room - Seating Area",
  },
  {
    src: "/photo/living/living1.jpg",
    alt: "Living Room - Common Area with Forest View",
  },
  {
    src: "/photo/living/File 24-04-2025, 10 29 16 PM-Edit.jpg",
    alt: "Living Room - Dining and Kitchen Area",
  },
  {
    src: "/photo/living/living4.jpg",
    alt: "Living Room - Stairs and Access",
  },
  
  // Additional exterior images
  {
    src: "/photo/exterior/exterior4.jpg",
    alt: "Giardino Suite - Exterior view",
  },
  {
    src: "/photo/exterior/exterior1.jpg",
    alt: "Casa moderna en alquiler en Cariló - villa IL BUCO en bosque de pinos",
  },
]
