"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} aria-label="Open menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="text-2xl font-bold tracking-tight" onClick={() => setIsOpen(false)}>
                IL BUCO
              </Link>
              <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/the-house"
                className="text-lg font-medium hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                The House
              </Link>
              <Link
                href="/rooms"
                className="text-lg font-medium hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Rooms
              </Link>
              <Link
                href="/location"
                className="text-lg font-medium hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Location
              </Link>
              <Link
                href="/places-nearby"
                className="text-lg font-medium hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Places Nearby
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
