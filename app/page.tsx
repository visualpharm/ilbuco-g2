"use client"

import Link from "next/link"
import { HomeContent } from "@/components/home-content"

const seo = "text-inherit no-underline"

export default function Home() {
  return (
    <HomeContent
      seo={{
        heroTail: <> Perfecta para <Link href="/casas-en-carilo-alquiler" className={seo}>casas</Link> de lujo en <Link href="/carilo-alquiler" className={seo}>Cariló</Link>.</>,
        remoteWorkTail: <> en un <Link href="/carilo-alojamiento" className={seo}>alojamiento</Link> ideal para <Link href="/team-building-carilo" className={seo}>equipos</Link></>,
        accommodationHref: "/apart-hotel-en-carilo",
        accommodationTail: <> a 150 metros del <Link href="/casas-en-carilo-frente-al-mar" className={seo}>mar</Link>, ideal para <Link href="/carilo-golf-hospedaje" className={seo}>estadías</Link> especiales</>,
        commonAreasTail: <>. Descubrí <Link href="/que-hacer-en-carilo" className={seo}>qué hacer</Link> en los alrededores.</>,
      }}
    />
  )
}
