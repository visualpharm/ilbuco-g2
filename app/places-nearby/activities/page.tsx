import { Metadata } from "next"
import { PlacesNearbyActivitiesContent } from "@/components/places-nearby-activities"

export const metadata: Metadata = {
  title: 'Actividades y Deportes en Cariló | IL BUCO',
  description: 'Descubre todas las actividades y deportes disponibles cerca de IL BUCO en Cariló: gimnasio, windsurf, tenis, calistenia, equitación y más.',
}

export default function Activities() {
  return <PlacesNearbyActivitiesContent />
}