import { Metadata } from "next"
import { TheHouseContent } from "@/components/the-house-content"

export const metadata: Metadata = {
  title: 'Casa Coliving América do Sul | IL BUCO',
  description: 'Casa coliving América do Sul: villa moderna com WiFi de alta velocidade e amenidades premium. Acomodação de luxo na floresta de pinheiros.',
}

export default function TheHouse() {
  return <TheHouseContent />
}