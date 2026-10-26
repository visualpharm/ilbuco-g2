"use client"

import Link from "next/link"
import { LocationContent } from "@/components/location-content"

export default function Location() {
  return (
    <LocationContent
      introTail={<> Una ubicación privilegiada en <Link href="/carilo-alojamiento" className="text-inherit no-underline">Cariló</Link> cerca del <Link href="/casas-en-carilo-frente-al-mar" className="text-inherit no-underline">mar</Link>, perfecta para <Link href="/eventos-corporativos-carilo" className="text-inherit no-underline">eventos</Link> y <Link href="/carilo-golf-hospedaje" className="text-inherit no-underline">estadías</Link> especiales.</>}
    />
  )
}
