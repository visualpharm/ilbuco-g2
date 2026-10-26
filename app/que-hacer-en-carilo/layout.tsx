import { Metadata } from "next"

// From December 1 the guide is titled with the coming year (docs/rules/seo.md).
const now = new Date()
const guideYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear()

export const metadata: Metadata = {
  title: `Qué Hacer en Cariló: Guía Completa de Actividades y Turismo ${guideYear}`,
  description: 'Descubre qué hacer en Cariló con nuestra guía completa. Actividades, deportes, gastronomía y lugares para visitar en Cariló y Pinamar. ¡Planifica tu viaje!',
  alternates: {
    canonical: 'https://ilbuco.com.ar/que-hacer-en-carilo',
    languages: {
      'es': 'https://ilbuco.com.ar/que-hacer-en-carilo',
      'en': 'https://ilbuco.com.ar/en/places-nearby',
      'pt': 'https://ilbuco.com.ar/pt/places-nearby',
    },
  },
}

export default function QueHacerEnCariloLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}