import type { Metadata } from "next"
import GuestContent from "./GuestContent"

export const metadata: Metadata = {
  title: "Guía de la casa · Il Buco",
  robots: { index: false, follow: false },
}

export default function GuestPage() {
  return <GuestContent lang="es" />
}
