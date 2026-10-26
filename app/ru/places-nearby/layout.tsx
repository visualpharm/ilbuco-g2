import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Чем заняться в Карило | IL BUCO",
  description: "Пляжи, спорт, рестораны и окрестности Карило с рейтингами Google Maps и расстоянием от Il Buco.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
