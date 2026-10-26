"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Translate } from "@/components/translate"
import { translations } from "@/translations/common"
import { useLanguage } from "@/contexts/language-context"

const h = translations.home.highlights
const ICON_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)"

interface HouseHighlightsProps {
  /** Invisible SEO links per language (docs/rules/seo.md): appended to the matching card text. */
  accommodationHref?: string
  accommodationTail?: ReactNode
  commonAreasTail?: ReactNode
  /** The /the-house page itself omits the card that links to it. */
  showAllFeatures?: boolean
}

/** The house's highlight cards, shared by the home page and /the-house. */
export function HouseHighlights({
  accommodationHref,
  accommodationTail,
  commonAreasTail,
  showAllFeatures = true,
}: HouseHighlightsProps) {
  const { language } = useLanguage()
  const prefix = language.code === "es" ? "" : `/${language.code}`

  const items: { icon: string; title: ReactNode; text: ReactNode }[] = [
    { icon: "wifi.svg", title: <Translate text={h.internet.title} />, text: <Translate text={h.internet.description} /> },
    {
      icon: "house.svg",
      title: accommodationHref ? (
        <Link href={accommodationHref} className="text-gray-900 no-underline">
          <Translate text={h.accommodation.title} />
        </Link>
      ) : (
        <Translate text={h.accommodation.title} />
      ),
      text: (
        <>
          <Translate text={h.accommodation.description} />
          {accommodationTail}
        </>
      ),
    },
    { icon: "thermometer.svg", title: <Translate text={h.climate.title} />, text: <Translate text={h.climate.description} /> },
    {
      icon: "sofa.svg",
      title: <Translate text={h.commonAreas.title} />,
      text: (
        <>
          <Translate text={h.commonAreas.description} />
          {commonAreasTail}
        </>
      ),
    },
    { icon: "tree.svg", title: <Translate text={h.outdoorSpace.title} />, text: <Translate text={h.outdoorSpace.description} /> },
    { icon: "refrigerator.svg", title: <Translate text={h.kitchen.title} />, text: <Translate text={h.kitchen.description} /> },
    { icon: "bed.svg", title: <Translate text={h.bedding.title} />, text: <Translate text={h.bedding.description} /> },
    { icon: "plumbing.png", title: <Translate text={h.bathrooms.title} />, text: <Translate text={h.bathrooms.description} /> },
    { icon: "droplet.svg", title: <Translate text={h.waterTreatment.title} />, text: <Translate text={h.waterTreatment.description} /> },
    { icon: "no-audio.png", title: <Translate text={h.soundInsulation.title} />, text: <Translate text={h.soundInsulation.description} /> },
    { icon: "temperature.svg", title: <Translate text={h.fullInsulation.title} />, text: <Translate text={h.fullInsulation.description} /> },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg bg-white p-5 shadow-sm">
          <Image src={`/icons/icons8/${item.icon}`} alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" style={{ filter: ICON_FILTER }} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-base text-gray-700">{item.text}</p>
          </div>
        </div>
      ))}
      {showAllFeatures && (
        <Link
          href={`${prefix}/the-house`}
          className="group flex items-start gap-3 rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Image src="/icons/icons8/arrow-right.svg" alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" style={{ filter: "brightness(0) saturate(100%) invert(30%) sepia(79%) saturate(2400%) hue-rotate(215deg) brightness(95%) contrast(101%)" }} />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-900">
              <Translate text={h.allFeatures.title} />
            </h3>
            <p className="text-base text-gray-700">
              <Translate text={h.allFeatures.description} />
            </p>
          </div>
        </Link>
      )}
    </div>
  )
}
