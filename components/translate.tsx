"use client"

import { useLanguage } from "@/contexts/language-context"

interface TranslationProps {
  text: {
    [key: string]: string
  }
}

export function Translate({ text }: TranslationProps) {
  const { language } = useLanguage()

  // Get the base language code (es or en)
  const baseLanguage = language.code

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
