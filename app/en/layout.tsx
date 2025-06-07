import type { Metadata } from 'next'
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: 'IL BUCO',
  description: 'Ultra-modern tech villa in Cariló, Argentina',
  alternates: {
    canonical: 'https://ilbuco.com.ar/en',
    languages: {
      'es-AR': 'https://ilbuco.com.ar',
      'en': 'https://ilbuco.com.ar/en',
      'pt-BR': 'https://ilbuco.com.ar/pt',
    }
  }
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head>
        {/* SEO hreflang tags for English */}
        <link rel="alternate" hrefLang="es-AR" href="https://ilbuco.com.ar/" />
        <link rel="alternate" hrefLang="en" href="https://ilbuco.com.ar/en/" />
        <link rel="alternate" hrefLang="pt-BR" href="https://ilbuco.com.ar/pt/" />
        <link rel="alternate" hrefLang="x-default" href="https://ilbuco.com.ar/" />
      </head>
      {children}
    </>
  )
}
