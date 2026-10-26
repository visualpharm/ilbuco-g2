"use client"

import { HomeContent } from "@/components/home-content"

export default function RussianHomePage() {
  return (
    <HomeContent
      heroAlt="Современная вилла IL BUCO с тёплым освещением в сосновом лесу"
      speedAlt="Тест скорости Fast.com показывает 350 Мбит/с"
      goalIcons={["tree.svg", "utensils.svg", "tennis-racquet.svg", "house.svg", "target.svg"]}
    />
  )
}
