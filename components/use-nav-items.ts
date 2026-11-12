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
    // A static page outside the app router (public/3d): rendered as a plain <a>, never prefetched.
    { href: `${prefix}/3d`, label: translations.nav.tour3d, plain: true },
    { href: `${prefix}/rooms`, label: translations.nav.rooms },
    { href: `${prefix}/location`, label: translations.nav.location },
    { href: language.code === "es" ? "/que-hacer-en-carilo" : `${prefix}/places-nearby`, label: translations.nav.placesNearby },
    { href: `${prefix}/contacts`, label: translations.nav.contact },
  ]
  const home = prefix || "/"
  return {
    home,
    atHome: pathname === home || pathname === home + "/",
    items: items.map((item) => ({
      plain: false,
      ...item,
      current: pathname === item.href || pathname.startsWith(item.href + "/"),
    })),
  }
}
