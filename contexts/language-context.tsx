"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLanguageDetection } from "@/hooks/use-language-detection"

interface LanguageContextType {
  language: {
    code: string
    name: string
    country: string
    flag: string
  }
  isLoading: boolean
  setLanguage: (code: string, countryCode?: string) => void
  supportedLanguages: Array<{
    code: string
    name: string
    country: string
    flag: string
  }>
  spanishSpeakingCountries: Array<{
    code: string
    flag: string
    name: string
  }>
  englishSpeakingCountries: Array<{
    code: string
    flag: string
    name: string
  }>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const languageDetection = useLanguageDetection()

  return <LanguageContext.Provider value={languageDetection}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
