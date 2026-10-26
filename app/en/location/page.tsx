"use client"

import Link from "next/link"
import { LocationContent } from "@/components/location-content"

export default function EnglishLocation() {
  return (
    <LocationContent
      introTail={<> Perfect for <Link href="/en/digital-nomad-argentina" className="text-inherit no-underline">digital nomads</Link> seeking <Link href="/en/coliving-south-america" className="text-inherit no-underline">coliving in South America</Link>.</>}
      carTail={<> Perfect for <Link href="/en/slow-travel-argentina" className="text-inherit no-underline">slow travel</Link> experiences.</>}
    />
  )
}
