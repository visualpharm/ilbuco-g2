"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PlacesNearbyRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/places-nearby/activities')
  }, [router])

  return null
}