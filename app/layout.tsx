import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ClientLayout } from '@/components/client-layout'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cariló Alojamiento Alquiler | IL BUCO',
  description: 'Cariló alojamiento y alquiler de casa moderna. Residencia tecnológica ultra-moderna en Cariló, Argentina.',
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
    canonical: 'https://ilbuco.com.ar',
    languages: {
      'es': 'https://ilbuco.com.ar',
      'en': 'https://ilbuco.com.ar/en',
      'pt': 'https://ilbuco.com.ar/pt',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* SEO hreflang tags for root (Spanish) */}
        <link rel="alternate" hrefLang="es-AR" href="https://ilbuco.com.ar/" />
        <link rel="alternate" hrefLang="en" href="https://ilbuco.com.ar/en/" />
        <link rel="alternate" hrefLang="pt-BR" href="https://ilbuco.com.ar/pt/" />
        <link rel="alternate" hrefLang="x-default" href="https://ilbuco.com.ar/" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  )
}
