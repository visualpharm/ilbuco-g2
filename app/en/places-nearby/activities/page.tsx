import { Metadata } from "next"
import { PlacesNearbyActivitiesContent } from "@/components/places-nearby-activities"

export const metadata: Metadata = {
  title: 'Activities & Sports Near Cariló Beach | IL BUCO',
  description: 'Discover all activities and sports available near IL BUCO in Cariló: gym, windsurfing, tennis, calisthenics, horse riding and more beach activities.',
}

export default function Activities() {
  return <PlacesNearbyActivitiesContent />
}