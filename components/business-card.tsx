import Image from "next/image"
import Link from "next/link"
import { MapPin, User, Car } from "lucide-react"

interface BusinessCardProps {
  name: string
  description: string
  rating: number
  reviewCount: string
  walkingTime: string
  drivingTime: string
  googleMapsUrl: string
  imageUrl: string
  imageAlt: string
  onImageClick: () => void
  gradientFrom: string
  gradientTo: string
}

export function BusinessCard({
  name,
  description,
  rating,
  reviewCount,
  walkingTime,
  drivingTime,
  googleMapsUrl,
  imageUrl,
  imageAlt,
  onImageClick,
  gradientFrom = "green-50",
  gradientTo = "emerald-50"
}: BusinessCardProps) {
  return (
    <div className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-lg shadow-sm overflow-hidden`}>
      <button
        onClick={onImageClick}
        className="relative w-full h-48 cursor-zoom-in hover:opacity-90 transition-opacity"
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </button>
      <div className="p-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-gray-700 mb-3">
            <strong>Para:</strong> {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-green-700 mb-3">
            <span className="flex items-center">
              <span className="text-yellow-500">★</span> {rating} ({reviewCount}+ reseñas)
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="font-medium">
              Distancia desde{" "}
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Il Buco
              </Link>:
            </span>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{walkingTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{drivingTime}</span>
            </div>
          </div>
          <a
            href={googleMapsUrl}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <MapPin className="h-4 w-4" />
            Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  )
}