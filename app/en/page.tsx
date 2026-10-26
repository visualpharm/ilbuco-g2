"use client"

import Link from "next/link"
import { HomeContent } from "@/components/home-content"

const seo = "text-inherit no-underline"

export default function EnglishHomePage() {
  return (
    <HomeContent
      seo={{
        heroTail: <> Perfect for <Link href="/en/digital-nomad-argentina" className={seo}>digital nomads</Link> and <Link href="/en/coliving-argentina" className={seo}>coliving</Link> experiences.</>,
        remoteWorkTail: <> with <Link href="/en/argentina-remote-work-visa" className={seo}>visa</Link> support in a <Link href="/en/coliving-south-america" className={seo}>South America</Link> location</>,
        accommodationHref: "/en/eco-lodge-argentina",
        accommodationTail: <> with <Link href="/en/slow-travel-argentina" className={seo}>slow travel</Link> experiences</>,
        commonAreasTail: <>. Perfect for <Link href="/en/digital-nomad-retreats" className={seo}>retreat</Link> experiences.</>,
      }}
    />
  )
}
