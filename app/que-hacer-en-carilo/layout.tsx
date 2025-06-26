import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Qué Hacer en Cariló: Guía Completa de Actividades y Turismo 2025',
  description: 'Descubre qué hacer en Cariló con nuestra guía completa. Actividades, deportes, gastronomía y lugares para visitar en Cariló y Pinamar. ¡Planifica tu viaje!',
  alternates: {
    canonical: 'https://ilbuco.com.ar/que-hacer-en-carilo',
    languages: {
      'es': 'https://ilbuco.com.ar/que-hacer-en-carilo',
      'en': 'https://ilbuco.com.ar/en/things-to-do-carilo',
      'pt': 'https://ilbuco.com.ar/pt/o-que-fazer-em-carilo',
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