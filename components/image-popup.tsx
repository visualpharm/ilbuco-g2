"use client"

import { useState } from "react"
import Image from "next/image"

interface ImagePopupProps {
  src: string
  alt: string
  width: number
  height: number
}

export function ImagePopup({ src, alt, width, height }: ImagePopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="rounded-md object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <span className="sr-only">Click to zoom</span>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={1200}
              height={800}
              className="rounded-lg object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
