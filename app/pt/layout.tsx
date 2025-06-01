import type { Metadata } from 'next'
import { HreflangTags } from '@/components/hreflang-tags'

export const metadata: Metadata = {
  title: 'IL BUCO | Casa moderna em Pinamar, Argentina',
  description: 'Casa de férias de luxo em Pinamar com piscina, WiFi de alta velocidade e muito mais para profissionais e nômades digitais',
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
    <>
      <HreflangTags />
      {children}
    </>
  )
}
