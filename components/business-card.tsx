import Image from "next/image"

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
  translations: {
    for: string
    reviews: string
    distanceFrom: string
    viewOnGoogleMaps: string
  }
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
  gradientTo = "emerald-50",
  translations = {
    for: "Para:",
    reviews: "reseñas",
    distanceFrom: "Distancia desde",
    viewOnGoogleMaps: "Ver en Google Maps"
  }
}: BusinessCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button onClick={onImageClick} className="relative h-48 w-full cursor-zoom-in">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      </button>
      <div className="space-y-3 p-6 text-base">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-700">
          <strong className="font-semibold text-gray-900">{translations.for}</strong> {description}
        </p>
        <p className="text-gray-800">
          <span className="text-yellow-600" aria-hidden="true">★</span> {rating} ({reviewCount}+ {translations.reviews})
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-700">
          <span>{translations.distanceFrom} Il Buco:</span>
          <span className="inline-flex items-center gap-4 whitespace-nowrap">
            <span className="inline-flex items-center gap-1">
              <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
              {walkingTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
              {drivingTime}
            </span>
          </span>
        </p>
        <a
          href={googleMapsUrl}
          className="inline-flex min-h-[44px] items-center gap-2 font-medium text-blue-700 hover:text-blue-900"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <Image src="/icons/icons8/marker.png" alt="" width={18} height={18} />
          {translations.viewOnGoogleMaps}
        </a>
      </div>
    </div>
  )
}
