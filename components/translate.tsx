"use client"

import { usePathname } from "next/navigation"

interface TranslationProps {
  text: {
    [key: string]: string
  }
}

export function Translate({ text }: TranslationProps) {
  const pathname = usePathname()

  // Detect language from URL pathname (for SSR compatibility)
  let baseLanguage: string = 'es'
  if (pathname.startsWith('/ru')) baseLanguage = 'ru'
  else if (pathname.startsWith('/en')) baseLanguage = 'en'
  else if (pathname.startsWith('/pt')) baseLanguage = 'pt'

  // Try to get the translation for the current language
  if (text[baseLanguage]) {
    return <>{text[baseLanguage]}</>
  }

  // If no translation is available for the current language, default to Spanish
  if (text["es"]) {
    return <>{text["es"]}</>
  }

  // If no Spanish translation, try English
  if (text["en"]) {
    return <>{text["en"]}</>
  }

  // If no translations are available, show an error message
  return <>Translation missing</>
}
