import type { Metadata } from "next"
import GuestContent from "../../guest/GuestContent"

export const metadata: Metadata = {
  title: "Guia da casa · Il Buco",
  robots: { index: false, follow: false },
}

export default function GuestPagePt() {
  return <GuestContent lang="pt" />
}
