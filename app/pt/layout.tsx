import type { Metadata } from 'next'
import { HreflangTags } from '@/components/hreflang-tags'
import { ClientLayout } from '@/components/client-layout'

export const metadata: Metadata = {
  title: 'Coliving América do Sul | IL BUCO',
  description: 'Coliving América do Sul em casa moderna. Acomodação de luxo em Carilo com piscina, WiFi de alta velocidade para trabalhadores remotos e nômades digitais.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://ilbuco.com.ar/pt',
    languages: {
      'es': 'https://ilbuco.com.ar/',
      'en': 'https://ilbuco.com.ar/en',
      'pt': 'https://ilbuco.com.ar/pt',
    },
  },
}

export default function PTLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      <HreflangTags />
      {children}
    </ClientLayout>
  )
}
