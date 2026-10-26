"use client"

import { useEffect } from "react"
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

// Russian-speaking countries and their flags
const russianSpeakingCountries = [
  { code: "RU", flag: "🇷🇺", name: "Россия" },
  { code: "BY", flag: "🇧🇾", name: "Беларусь" },
  { code: "KZ", flag: "🇰🇿", name: "Казахстан" },
  { code: "UA", flag: "🇺🇦", name: "Украина" },
  { code: "UZ", flag: "🇺🇿", name: "Узбекистан" },
]

// Default flags for each language
const defaultFlags = {
  es: { flag: "🇦🇷", name: "Argentina" }, // Default Spanish flag is Argentina
  en: { flag: "🇺🇸", name: "United States" }, // Default English flag is USA
  pt: { flag: "🇧🇷", name: "Brasil" }, // Default Portuguese flag is Brazil
  ru: { flag: "🇷🇺", name: "Россия" }, // Default Russian flag is Russia
}

// Interface for the language object
interface Language {
  code: string // 'es', 'en', 'pt', or 'ru'
  name: string // 'Español', 'English', 'Português', or 'Русский'
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
  
  const pathname = usePathname() || "/"
  const isLoading = false

  // The language comes from the URL alone, so the server renders the same
  // language the browser shows: no Spanish first paint on /en or /pt.
  const langCode = /^\/(en|pt|ru)(\/|$)/.exec(pathname)?.[1] || "es"
  const names: Record<string, string> = { es: "Español", en: "English", pt: "Português", ru: "Русский" }
  const fallback = defaultFlags[langCode as keyof typeof defaultFlags] || defaultLang
  const detectedLanguage: Language = {
    code: langCode,
    name: names[langCode],
    flag: fallback.flag,
    country: "name" in fallback ? fallback.name : defaultLang.country,
  }

  useEffect(() => {
    document.documentElement.lang = langCode === "pt" ? "pt-BR" : langCode === "es" ? "es-AR" : langCode
  }, [langCode])

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
    } else if (pathname.startsWith('/ru/')) {
      path = pathname.replace('/ru/', '/')
    } else if (pathname === '/ru') {
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
    {
      code: "ru",
      name: "Русский",
      flag: detectedLanguage.code === "ru" ? detectedLanguage.flag : defaultFlags.ru.flag,
      country: detectedLanguage.code === "ru" ? detectedLanguage.country : defaultFlags.ru.name,
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
    russianSpeakingCountries,
  }
}
