"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/translations/common"

interface AmenitiesToolTipProps {
  children: React.ReactNode
}

export function AmenitiesToolTip({ children }: AmenitiesToolTipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()

  return (
    <span className="relative inline-block">
      <button
        className="text-black hover:text-gray-800 border-b border-dashed border-black cursor-pointer transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </button>

      {isOpen && (
        <span className="absolute z-10 w-64 p-3 mt-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg left-1/2 transform -translate-x-1/2 block">
          <span className="text-gray-700 block">
            {translations.home.hero.amenitiesHint[language.code as keyof typeof translations.home.hero.amenitiesHint]}
          </span>
          <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45 block"></span>
        </span>
      )}
    </span>
  )
}
