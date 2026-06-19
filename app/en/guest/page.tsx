import type { Metadata } from "next"
import GuestContent from "../../guest/GuestContent"

export const metadata: Metadata = {
  title: "House guide · Il Buco",
  robots: { index: false, follow: false },
}

export default function GuestPageEn() {
  return <GuestContent lang="en" />
}
