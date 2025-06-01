"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

// List of Spanish-speaking countries and their flags
const spanishSpeakingCountries = [
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "MX", flag: "🇲🇽", name: "México" },
  { code: "ES", flag: "🇪🇸", name: "España" },
  { code: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "PE", flag: "🇵🇪", name: "Perú" },
  { code: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "BO", flag: "🇧🇴", name: "Bolivia" },
  { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
  { code: "CU", flag: "🇨🇺", name: "Cuba" },
  { code: "DO", flag: "🇩🇴", name: "República Dominicana" },
  { code: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "GT", flag: "🇬🇹", name: "Guatemala" },
  { code: "HN", flag: "🇭🇳", name: "Honduras" },
  { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
  { code: "PA", flag: "🇵🇦", name: "Panamá" },
  { code: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "SV", flag: "🇸🇻", name: "El Salvador" },
  { code: "VE", flag: "🇻🇪", name: "Venezuela" },
]

// English-speaking countries and their flags
const englishSpeakingCountries = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "NZ", flag: "🇳🇿", name: "New Zealand" },
]

// Portuguese-speaking countries and their flags
const portugueseSpeakingCountries = [
  { code: "BR", flag: "🇧🇷", name: "Brasil" },
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
]

// Default flags for each language
const defaultFlags = {
  es: { flag: "🇦🇷", name: "Argentina" }, // Default Spanish flag is Argentina
  en: { flag: "🇺🇸", name: "United States" }, // Default English flag is USA
  pt: { flag: "🇧🇷", name: "Brasil" }, // Default Portuguese flag is Brazil
}

// Interface for the language object
interface Language {
  code: string // 'es', 'en', or 'pt'
  name: string // 'Español', 'English', or 'Português'
  flag: string // Flag emoji
  country: string // Country name
}

export function useLanguageDetection() {
  // Default to Spanish (Argentina)
  const defaultLang = {
    code: "es",
    name: "Español",
    flag: defaultFlags.es.flag,
    country: defaultFlags.es.name,
  }
  
  const pathname = usePathname()
  const [detectedLanguage, setDetectedLanguage] = useState<Language>(defaultLang)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Detect language based on URL path
    let langCode = "es" // Default is Spanish
    let countryCode = "AR" // Default country for Spanish
    
    // Check URL path for language code
    if (pathname.startsWith("/en")) {
      langCode = "en"
      countryCode = "US" // Default country for English
    } else if (pathname.startsWith("/pt")) {
      langCode = "pt"
      countryCode = "BR" // Default country for Portuguese
    }
    
    // Set language based on URL path
    if (langCode === "es") {
      const countryInfo = spanishSpeakingCountries.find(c => c.code === countryCode) || defaultFlags.es
      setDetectedLanguage({
        code: "es",
        name: "Español",
        flag: countryInfo.flag,
        country: countryInfo.name,
      })
    } else if (langCode === "pt") {
      const countryInfo = portugueseSpeakingCountries.find(c => c.code === countryCode) || defaultFlags.pt
      setDetectedLanguage({
        code: "pt",
        name: "Português",
        flag: countryInfo.flag,
        country: countryInfo.name,
      })
    } else if (langCode === "en") {
      const countryInfo = englishSpeakingCountries.find(c => c.code === countryCode) || defaultFlags.en
      setDetectedLanguage({
        code: "en",
        name: "English",
        flag: countryInfo.flag,
        country: countryInfo.name,
      })
    }
  }, [pathname])

  // Instead of setting the language through state/localStorage,
  // we redirect to the appropriate URL based on the language
  const setLanguage = (languageCode: string, countryCode?: string) => {
    // Get the current path without language prefix
    let path = pathname
    if (pathname.startsWith('/en/')) {
      path = pathname.replace('/en/', '/')
    } else if (pathname === '/en') {
      path = '/'
    } else if (pathname.startsWith('/pt/')) {
      path = pathname.replace('/pt/', '/')
    } else if (pathname === '/pt') {
      path = '/'
    }
    
    // Redirect to the appropriate language version
    if (languageCode === 'es') {
      // For Spanish, remove any language prefix
      window.location.href = path
    } else {
      // For other languages, add the language prefix
      window.location.href = `/${languageCode}${path === '/' ? '' : path}`
    }
  }

  // List of supported languages with their flags
  const supportedLanguages = [
    {
      code: "es",
      name: "Español",
      flag: detectedLanguage.code === "es" ? detectedLanguage.flag : defaultFlags.es.flag,
      country: detectedLanguage.code === "es" ? detectedLanguage.country : defaultFlags.es.name,
    },
    {
      code: "pt",
      name: "Português",
      flag: detectedLanguage.code === "pt" ? detectedLanguage.flag : defaultFlags.pt.flag,
      country: detectedLanguage.code === "pt" ? detectedLanguage.country : defaultFlags.pt.name,
    },
    {
      code: "en",
      name: "English",
      flag: detectedLanguage.code === "en" ? detectedLanguage.flag : defaultFlags.en.flag,
      country: detectedLanguage.code === "en" ? detectedLanguage.country : defaultFlags.en.name,
    },
  ]

  return {
    language: detectedLanguage,
    isLoading,
    setLanguage,
    supportedLanguages,
    spanishSpeakingCountries,
    englishSpeakingCountries,
    portugueseSpeakingCountries,
  }
}
