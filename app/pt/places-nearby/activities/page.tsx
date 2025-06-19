import { Metadata } from "next"
import { PlacesNearbyActivitiesContent } from "@/components/places-nearby-activities"

export const metadata: Metadata = {
  title: 'Atividades e Esportes em Cariló | IL BUCO',
  description: 'Descubra todas as atividades e esportes disponíveis perto do IL BUCO em Cariló: academia, windsurf, tênis, calistenia, equitação e mais.',
}

export default function Activities() {
  return <PlacesNearbyActivitiesContent />
}