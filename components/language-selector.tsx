"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, supportedLanguages } = useLanguage()

  // Function to change language
  const changeLanguage = (languageCode: string) => {
    setLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{language.flag}</span>
        {/* Show language name on mobile, hide on desktop */}
        <span className="md:hidden">{language.name}</span>
        <span className="hidden md:inline">{language.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
          <div className="max-h-80 overflow-y-auto">
            {/* Main language options */}
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                  language.code === lang.code ? "bg-gray-50 font-medium" : ""
                }`}
              >
                <span className="mr-2 text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
