"use client"

import { useState, useEffect } from "react"

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

// Default flags for each language
const defaultFlags = {
  es: { flag: "🇦🇷", name: "Argentina" }, // Default Spanish flag is Argentina
  en: { flag: "🇺🇸", name: "United States" }, // Default English flag is USA
}

// Interface for the language object
interface Language {
  code: string // 'es' or 'en'
  name: string // 'Español' or 'English'
  flag: string // Flag emoji
  country: string // Country name
}

export function useLanguageDetection() {
  const [detectedLanguage, setDetectedLanguage] = useState<Language>({
    code: "es",
    name: "Español",
    flag: defaultFlags.es.flag,
    country: defaultFlags.es.name,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        setIsLoading(true)

        // Check for saved preference
        const savedLanguage = localStorage.getItem("preferredLanguage")
        const savedFlag = localStorage.getItem("preferredFlag")
        const savedCountry = localStorage.getItem("preferredCountry")

        if (savedLanguage && savedFlag && savedCountry) {
          setDetectedLanguage({
            code: savedLanguage,
            name: savedLanguage === "es" ? "Español" : "English",
            flag: savedFlag,
            country: savedCountry,
          })
          setIsLoading(false)
          return
        }

        // Get browser language
        const browserLang = navigator.language || "es-AR"
        const [lang, country] = browserLang.split("-")

        // Determine if user is in a Spanish-speaking country using GeoIP
        try {
          // Attempt to get user's country via GeoIP API
          const response = await fetch("https://ipapi.co/json/")
          const data = await response.json()
          const userCountry = data.country_code

          if (userCountry) {
            // Check if user is in a Spanish-speaking country
            const isSpanishCountry = spanishSpeakingCountries.some((c) => c.code === userCountry)

            if (isSpanishCountry) {
              // Find the country in our list to get the flag
              const countryInfo = spanishSpeakingCountries.find((c) => c.code === userCountry) || defaultFlags.es
              setDetectedLanguage({
                code: "es",
                name: "Español",
                flag: countryInfo.flag,
                country: countryInfo.name,
              })
            } else {
              // Check if user is in an English-speaking country
              const isEnglishCountry = englishSpeakingCountries.some((c) => c.code === userCountry)

              if (isEnglishCountry) {
                // Find the country in our list to get the flag
                const countryInfo = englishSpeakingCountries.find((c) => c.code === userCountry) || defaultFlags.en
                setDetectedLanguage({
                  code: "en",
                  name: "English",
                  flag: countryInfo.flag,
                  country: countryInfo.name,
                })
              } else {
                // For other countries, use browser language to determine language
                if (lang === "es") {
                  setDetectedLanguage({
                    code: "es",
                    name: "Español",
                    flag: defaultFlags.es.flag,
                    country: defaultFlags.es.name,
                  })
                } else {
                  setDetectedLanguage({
                    code: "en",
                    name: "English",
                    flag: defaultFlags.en.flag,
                    country: defaultFlags.en.name,
                  })
                }
              }
            }
          } else {
            // Fallback to browser language if GeoIP fails
            fallbackToBrowserLanguage(lang)
          }
        } catch (error) {
          console.error("Error fetching GeoIP data:", error)
          // Fallback to browser language if GeoIP fails
          fallbackToBrowserLanguage(lang)
        }
      } catch (error) {
        console.error("Error detecting language:", error)
        // Default to Spanish (Argentina) in case of error
        setDetectedLanguage({
          code: "es",
          name: "Español",
          flag: defaultFlags.es.flag,
          country: defaultFlags.es.name,
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fallbackToBrowserLanguage = (lang: string) => {
      if (lang === "es") {
        setDetectedLanguage({
          code: "es",
          name: "Español",
          flag: defaultFlags.es.flag,
          country: defaultFlags.es.name,
        })
      } else {
        setDetectedLanguage({
          code: "en",
          name: "English",
          flag: defaultFlags.en.flag,
          country: defaultFlags.en.name,
        })
      }
    }

    detectLanguage()
  }, [])

  const setLanguage = (languageCode: string, countryCode?: string) => {
    let flag = ""
    let country = ""

    if (languageCode === "es") {
      if (countryCode) {
        // If a specific country is requested
        const countryInfo = spanishSpeakingCountries.find((c) => c.code === countryCode) || defaultFlags.es
        flag = countryInfo.flag
        country = countryInfo.name
      } else {
        // Use the current flag if already Spanish, or default to Argentina
        flag = detectedLanguage.code === "es" ? detectedLanguage.flag : defaultFlags.es.flag
        country = detectedLanguage.code === "es" ? detectedLanguage.country : defaultFlags.es.name
      }
    } else {
      // For English
      if (countryCode) {
        // If a specific country is requested
        const countryInfo = englishSpeakingCountries.find((c) => c.code === countryCode) || defaultFlags.en
        flag = countryInfo.flag
        country = countryInfo.name
      } else {
        // Use the current flag if already English, or default to USA
        flag = detectedLanguage.code === "en" ? detectedLanguage.flag : defaultFlags.en.flag
        country = detectedLanguage.code === "en" ? detectedLanguage.country : defaultFlags.en.name
      }
    }

    const newLanguage = {
      code: languageCode,
      name: languageCode === "es" ? "Español" : "English",
      flag,
      country,
    }

    setDetectedLanguage(newLanguage)
    localStorage.setItem("preferredLanguage", languageCode)
    localStorage.setItem("preferredFlag", flag)
    localStorage.setItem("preferredCountry", country)
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
  }
}
