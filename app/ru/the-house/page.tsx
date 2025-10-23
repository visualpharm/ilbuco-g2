import { Metadata } from "next"
import { TheHouseContent } from "@/components/the-house-content"

export const metadata: Metadata = {
  title: 'Коливинг Южная Америка | IL BUCO',
  description: 'Коливинг Южная Америка: современная вилла с бассейном, высокоскоростным WiFi и премиальными удобствами. Роскошное жильё в сосновом лесу.',
}

export default function TheHouse() {
  return <TheHouseContent />
}
