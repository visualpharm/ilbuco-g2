import type { Metadata } from 'next'
import { HreflangTags } from '@/components/hreflang-tags'
import { ClientLayout } from '@/components/client-layout'

export const metadata: Metadata = {
  title: 'IL BUCO | Modern House in Pinamar, Argentina',
  description: 'Luxury vacation home in Pinamar with pool, high-speed WiFi, and more for professionals and digital nomads',
  alternates: {
    canonical: 'https://ilbuco.com.ar/en',
    languages: {
      'es': 'https://ilbuco.com.ar/',
      'en': 'https://ilbuco.com.ar/en',
      'pt': 'https://ilbuco.com.ar/pt',
    },
  },
}

export default function EnglishLayout({
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
