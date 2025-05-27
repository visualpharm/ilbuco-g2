"use client"

import { useLanguage } from "@/contexts/language-context"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇦🇷" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
  ]

  // Use the actual language code from context, not just the first match
  const currentLanguage = languages.find((lang) => lang.code === language.code) || languages[1] // Default to Spanish

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Change language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 whitespace-nowrap transform transition-all duration-200 ease-out opacity-0 translate-y-1 scale-95 data-[open=true]:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100"
             data-open={isOpen}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                language.code === lang.code ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
