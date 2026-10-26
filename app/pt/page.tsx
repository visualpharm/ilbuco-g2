"use client"

import Link from "next/link"
import { HomeContent } from "@/components/home-content"

const seo = "text-inherit no-underline"

export default function PortugueseHomePage() {
  return (
    <HomeContent
      seo={{
        heroTail: <> Perfeita para experiências de <Link href="/pt/coliving-argentina" className={seo}>coliving Argentina</Link>.</>,
        remoteWorkTail: <> em um ambiente de <Link href="/pt/coliving" className={seo}>coliving</Link></>,
        accommodationTail: <> a 150 metros da <Link href="/pt/argentina-praia" className={seo}>praia</Link> e do <Link href="/pt/argentina-mar" className={seo}>mar</Link></>,
        commonAreasTail: <>. Descubra <Link href="/pt/carilo-argentina-o-que-fazer" className={seo}>o que fazer</Link> na região.</>,
      }}
    />
  )
}
