"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ActivitiesRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/que-hacer-en-carilo')
  }, [router])

  return null
}