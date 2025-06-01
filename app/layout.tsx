import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ClientLayout } from '@/components/client-layout'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IL BUCO',
  description: 'Residencia tecnológica ultra-moderna en Cariló, Argentina',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://ilbuco.com.ar',
    languages: {
      'es-AR': 'https://ilbuco.com.ar',
      'en': 'https://ilbuco.com.ar/en',
      'pt-BR': 'https://ilbuco.com.ar/pt',
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
