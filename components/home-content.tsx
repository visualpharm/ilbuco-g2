"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { AmenitiesToolTip } from "@/components/amenities-tooltip"
import { HeroImage } from "@/components/hero-image"
import { BookStayCta } from "@/components/book-stay-cta"
import { HouseHighlights } from "@/components/house-highlights"
import { translations } from "@/translations/common"

const ICON_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)"

const goals = translations.home.goals
const defaultGoalIcons = ["code.svg", "calculator.svg", "cube.svg", "briefcase.svg", "rocket.svg"]

export interface HomeSeo {
  /** Invisible keyword links per language (docs/rules/seo.md), appended to the matching sentence. */
  heroTail?: ReactNode
  remoteWorkTail?: ReactNode
  accommodationHref?: string
  accommodationTail?: ReactNode
  commonAreasTail?: ReactNode
}

interface HomeContentProps {
  seo?: HomeSeo
  heroAlt?: string
  speedAlt?: string
  goalIcons?: string[]
}

/** The home page, one layout for every language. */
export function HomeContent({
  seo = {},
  heroAlt = "IL BUCO modern villa exterior with warm lighting and pine forest",
  speedAlt = "Fast.com speed test showing 350 Mbps",
  goalIcons = defaultGoalIcons,
}: HomeContentProps) {
  const goalItems: ReactNode[] = [
    <Translate key="v" text={goals.vibeCoding} />,
    <Translate key="f" text={goals.finance} />,
    <Translate key="m" text={goals.modeling} />,
    <>
      <Translate text={goals.remoteWork} />
      {seo.remoteWorkTail}
    </>,
    <Translate key="s" text={goals.startup} />,
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section>
          <div className="container mx-auto px-4 py-10 md:py-20 lg:py-28">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
              <div className="space-y-5 lg:space-y-6">
                <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl xl:text-6xl">
                  <Translate text={translations.home.hero.title} />
                </h1>
                <p className="max-w-xl text-lg text-gray-700">
                  <Translate text={translations.home.hero.subtitlePart1} />{" "}
                  <AmenitiesToolTip>
                    <Translate text={translations.home.hero.ultraCapitalistAmenities} />
                  </AmenitiesToolTip>
                  <Translate text={translations.home.hero.subtitlePart2} />
                  {seo.heroTail}
                </p>
                <BookStayCta className="pt-2 min-h-[56px]" />
              </div>
              <HeroImage
                src="/gallery/hero-villa-exterior.jpeg"
                alt={heroAlt}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                <Translate text={goals.title} />
              </h2>
              <ul className="space-y-4">
                {goalItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Image src={`/icons/icons8/${goalIcons[i]}`} alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" style={{ filter: ICON_FILTER }} />
                    <p className="text-lg">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-3xl font-bold">
              <Translate text={translations.home.highlights.title} />
            </h2>
            <HouseHighlights
              accommodationHref={seo.accommodationHref}
              accommodationTail={seo.accommodationTail}
              commonAreasTail={seo.commonAreasTail}
            />
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-md text-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-n9F4IHjvhVUozNWKdlOYin6434gR7J.png"
                alt={speedAlt}
                width={600}
                height={400}
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-5">
              <div className="relative h-[400px] overflow-hidden rounded-xl md:col-span-3">
                <Image src="/person-window-view.jpeg" alt="Relaxing view from IL BUCO" fill className="object-cover" sizes="(max-width: 768px) 100vw, 540px" />
              </div>
              <blockquote className="space-y-4 md:col-span-2">
                <p className="text-2xl font-medium">
                  «<Translate text={translations.home.testimonial.quote} />»
                </p>
                <footer className="text-base text-gray-700">
                  <Translate text={translations.home.testimonial.author} />
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
