import { Metadata } from "next"
import { TheHouseContent } from "@/components/the-house-content"

export const metadata: Metadata = {
  title: 'Coliving House South America | IL BUCO',
  description: 'Coliving house South America: modern villa with pool, high-speed WiFi and premium amenities. Luxury accommodation in pine forest.',
}

export default function TheHouse() {
  return <TheHouseContent />
}