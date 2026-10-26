"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/translations/common"

interface AmenitiesToolTipProps {
  children: React.ReactNode
}

export function AmenitiesToolTip({ children }: AmenitiesToolTipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const { language } = useLanguage()
  const rootRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isOpen) return
    // Keep the explanation inside the viewport on narrow phones.
    const tip = tipRef.current?.getBoundingClientRect()
    if (tip) {
      const margin = 16
      if (tip.left < margin) setShift(margin - tip.left)
      else if (tip.right > window.innerWidth - margin) setShift(window.innerWidth - margin - tip.right)
    }
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setIsOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false)
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
      setShift(0)
    }
  }, [isOpen])

  return (
    <span ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={isOpen}
        className="text-black hover:text-gray-800 border-b border-dashed border-black cursor-pointer transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </button>

      {isOpen && (
        <span
          ref={tipRef}
          role="tooltip"
          className="absolute left-1/2 z-10 mt-2 block w-64 rounded-lg border border-gray-200 bg-white p-3 text-base shadow-lg"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        >
          <span className="block text-gray-700">
            {translations.home.hero.amenitiesHint[language.code as keyof typeof translations.home.hero.amenitiesHint]}
          </span>
        </span>
      )}
    </span>
  )
}
