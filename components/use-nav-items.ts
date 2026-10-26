"use client"

import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/translations/common"

/** Main navigation, shared by the desktop header and the phone menu. */
export function useNavItems() {
  const { language } = useLanguage()
  const pathname = usePathname() || "/"
  const prefix = language.code === "es" ? "" : `/${language.code}`
  const items = [
    { href: `${prefix}/the-house`, label: translations.nav.theHouse },
    { href: `${prefix}/rooms`, label: translations.nav.rooms },
    { href: `${prefix}/location`, label: translations.nav.location },
    { href: language.code === "es" ? "/que-hacer-en-carilo" : `${prefix}/places-nearby`, label: translations.nav.placesNearby },
    { href: `${prefix}/contacts`, label: translations.nav.contact },
  ]
  return {
    home: prefix || "/",
    items: items.map((item) => ({
      ...item,
      current: pathname === item.href || pathname.startsWith(item.href + "/"),
    })),
  }
}
