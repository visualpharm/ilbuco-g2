"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function QueHacerCariloRussian() {
  const router = useRouter()

  useEffect(() => {
    // Redirect Russian users to the fully translated places-nearby page
    router.replace("/ru/places-nearby")
  }, [router])

  return null
}
