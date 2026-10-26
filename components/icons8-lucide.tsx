"use client"

// Drop-in replacements for the lucide-react icons the site used: same names, genuine Icons8 artwork
// (SF Symbols Regular, docs/rules/icons-images.md). Decorative and aria-hidden.

import type { CSSProperties } from "react"

interface IconProps {
  className?: string
  style?: CSSProperties
  "aria-hidden"?: boolean | "true" | "false"
}

function icon(src: string) {
  // Painted with the text color through a mask, like lucide: text-* classes and dark bands keep working.
  function Icon({ className = "h-5 w-5", style }: IconProps) {
    const mask = `url("${src}") center / contain no-repeat`
    return (
      <span
        aria-hidden="true"
        className={`inline-block flex-shrink-0 ${className}`}
        style={{ backgroundColor: "currentColor", WebkitMask: mask, mask, ...style }}
      />
    )
  }
  return Icon
}

export const AlertCircle = icon("/icons/icons8/ui/alert-circle.png")
export const AlertTriangle = icon("/icons/icons8/ui/alert-triangle.png")
export const ArrowRight = icon("/icons/icons8/ui/arrow-right.png")
export const Bed = icon("/icons/icons8/ui/bed.png")
export const Bike = icon("/icons/icons8/ui/bike.png")
export const Bird = icon("/icons/icons8/ui/bird.png")
export const BookOpen = icon("/icons/icons8/ui/book-open.png")
export const Brain = icon("/icons/icons8/ui/brain.png")
export const Briefcase = icon("/icons/icons8/ui/briefcase.png")
export const Building = icon("/icons/icons8/ui/building.png")
export const Building2 = icon("/icons/icons8/ui/building-2.png")
export const Calculator = icon("/icons/icons8/ui/calculator.png")
export const Calendar = icon("/icons/icons8/ui/calendar.png")
export const CalendarDays = icon("/icons/icons8/ui/calendar-days.png")
export const Camera = icon("/icons/icons8/ui/camera.png")
export const Car = icon("/icons/icons8/ui/car.png")
export const Check = icon("/icons/icons8/ui/check.png")
export const CheckCircle = icon("/icons/icons8/ui/check-circle.png")
export const CheckCircle2 = icon("/icons/icons8/ui/check-circle-2.png")
export const Church = icon("/icons/icons8/ui/church.png")
export const Clock = icon("/icons/icons8/ui/clock.png")
export const Clock3 = icon("/icons/icons8/ui/clock-3.png")
export const Code = icon("/icons/icons8/ui/code.png")
export const Coffee = icon("/icons/icons8/ui/coffee.png")
export const Compass = icon("/icons/icons8/ui/compass.png")
export const CreditCard = icon("/icons/icons8/ui/credit-card.png")
export const Crown = icon("/icons/icons8/ui/crown.png")
export const Cube = icon("/icons/icons8/cube.svg")
export const CuboidIcon = icon("/icons/icons8/cube.svg")
export const DollarSign = icon("/icons/icons8/ui/dollar-sign.png")
export const Droplet = icon("/icons/icons8/ui/droplet.png")
export const Dumbbell = icon("/icons/icons8/ui/dumbbell.png")
export const Eye = icon("/icons/icons8/ui/eye.png")
export const FileText = icon("/icons/icons8/ui/file-text.png")
export const Fish = icon("/icons/icons8/ui/fish.png")
export const Flower = icon("/icons/icons8/ui/flower.png")
export const Gamepad2 = icon("/icons/icons8/ui/gamepad-2.png")
export const Globe = icon("/icons/icons8/ui/globe.png")
export const Heart = icon("/icons/icons8/ui/heart.png")
export const Hiking = icon("/icons/icons8/ui/hiking.png")
export const Home = icon("/icons/icons8/ui/home.png")
export const Horse = icon("/icons/icons8/horse-riding.svg")
export const Hotel = icon("/icons/icons8/ui/hotel.png")
export const Key = icon("/icons/icons8/ui/key.png")
export const KeyRound = icon("/icons/icons8/ui/key-round.png")
export const Laptop = icon("/icons/icons8/ui/laptop.png")
export const Leaf = icon("/icons/icons8/ui/leaf.png")
export const List = icon("/icons/icons8/ui/list.png")
export const Loader2 = icon("/icons/icons8/ui/loader-2.png")
export const Lock = icon("/icons/icons8/ui/lock.png")
export const Mail = icon("/icons/icons8/ui/mail.png")
export const MapPin = icon("/icons/icons8/ui/map-pin.png")
export const MessageCircle = icon("/icons/icons8/ui/message-circle.png")
export const Mountain = icon("/icons/icons8/ui/mountain.png")
export const Navigation = icon("/icons/icons8/ui/navigation.png")
export const Package = icon("/icons/icons8/ui/package.png")
export const Palette = icon("/icons/icons8/ui/palette.png")
export const Recycle = icon("/icons/icons8/ui/recycle.png")
export const Refrigerator = icon("/icons/icons8/ui/refrigerator.png")
export const Rocket = icon("/icons/icons8/ui/rocket.png")
export const Search = icon("/icons/icons8/ui/search.png")
export const Shield = icon("/icons/icons8/ui/shield.png")
export const ShieldCheck = icon("/icons/icons8/ui/shield-check.png")
export const ShoppingBag = icon("/icons/icons8/ui/shopping-bag.png")
export const Shower = icon("/icons/icons8/ui/shower.png")
export const ShowerHeadIcon = icon("/icons/icons8/ui/shower-head.png")
export const Sofa = icon("/icons/icons8/ui/sofa.png")
export const Solar = icon("/icons/icons8/ui/solar.png")
export const Star = icon("/icons/icons8/ui/star.png")
export const Sun = icon("/icons/icons8/ui/sun.png")
export const Sunrise = icon("/icons/icons8/ui/sunrise.png")
export const Sunset = icon("/icons/icons8/ui/sunset.png")
export const Target = icon("/icons/icons8/ui/target.png")
export const Theater = icon("/icons/icons8/ui/theater.png")
export const Thermometer = icon("/icons/icons8/ui/thermometer.png")
export const ThermometerIcon = icon("/icons/icons8/ui/thermometer.png")
export const Tree = icon("/icons/icons8/ui/tree.png")
export const TreePine = icon("/icons/icons8/ui/tree-pine.png")
export const TreesIcon = icon("/icons/icons8/ui/trees.png")
export const Trophy = icon("/icons/icons8/ui/trophy.png")
export const Umbrella = icon("/icons/icons8/ui/umbrella.png")
export const User = icon("/icons/icons8/ui/user.png")
export const Users = icon("/icons/icons8/ui/users.png")
export const Utensils = icon("/icons/icons8/ui/utensils.png")
export const Waves = icon("/icons/icons8/ui/waves.png")
export const Wifi = icon("/icons/icons8/ui/wifi.png")
export const Wind = icon("/icons/icons8/ui/wind.png")
export const Wine = icon("/icons/icons8/ui/wine.png")
export const Wrench = icon("/icons/icons8/ui/wrench.png")
export const X = icon("/icons/icons8/ui/x.png")
