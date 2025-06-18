import { Metadata } from "next"
import { TheHouseContent } from "@/components/the-house-content"

export const metadata: Metadata = {
  title: 'Casa Cariló Alquiler | IL BUCO',
  description: 'Casa Cariló alquiler: villa moderna con piscina, WiFi de alta velocidad y amenidades premium. Alojamiento de lujo en el bosque de pinos.',
}

export default function TheHouse() {
  return <TheHouseContent />
}