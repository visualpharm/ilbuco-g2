import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { ImageGallery } from "@/components/image-gallery"
import { roomsTranslations } from "@/translations/rooms"
import { Wifi, Thermometer, UtensilsCrossed, ShowerHeadIcon as Shower, Bed, LampDesk } from "lucide-react"

export default function Rooms() {
  const gardenSuiteImages = [
    { src: "/photo/giardino/giardino1.jpg", alt: "Giardino Suite - View of living area and bedroom" },
    { src: "/photo/giardino/giardino2.jpg", alt: "Giardino Suite - Kitchen with full-size refrigerator" },
    { src: "/photo/giardino/giardino3.jpg", alt: "Giardino Suite - Dining area with garden view" },
    { src: "/photo/giardino/giardino4.jpg", alt: "Giardino Suite - Additional view" },
    { src: "/photo/giardino/giardino5.jpg", alt: "Giardino Suite - Bedroom view" },
    { src: "/photo/exterior/exterior4.jpg", alt: "Giardino Suite - Exterior view" },
  ]

  const terraceSuiteImages = [
    { src: "/photo/terrazzo/terrazzo1.jpg", alt: "Terrace Suite - Large Private Terrace" },
    { src: "/photo/terrazzo/terrazzo2.jpg", alt: "Terrace Suite - Dining Area" },
    { src: "/photo/terrazzo/terrazzo3.jpg", alt: "Terrace Suite - Bedroom" },
    { src: "/photo/terrazzo/terrazzo4.jpg", alt: "Terrace Suite - Kitchen Area" },
    { src: "/photo/terrazzo/terrazzo5.jpg", alt: "Terrace Suite - Living Space" },
    { src: "/photo/terrazzo/terrazzo6.jpg", alt: "Terrace Suite - Additional View" },
  ]

  const forestSuiteImages = [
    { src: "/photo/paraiso/paraiso1.jpg", alt: "Forest-View Suite Living Room" },
    { src: "/photo/paraiso/paraiso2.jpg", alt: "Forest-View Suite Kitchen" },
    { src: "/photo/paraiso/paraiso3.jpg", alt: "Forest-View Suite Bedroom" },
    { src: "/photo/paraiso/paraiso4.jpg", alt: "Forest-View Suite Bathroom" },
    { src: "/photo/paraiso/paraiso6.jpg", alt: "Forest-View Suite Dining Area" },
    { src: "/photo/paraiso/paraiso7.jpg", alt: "Forest-View Suite Additional View" },
  ]

  const penthouseSuiteImages = [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penthouse_corner%20window-m9Wog22hf421cCpCzob9Pc2GGzSUJL.webp", alt: "Penthouse Suite - Corner Windows with Forest View" },
    { src: "/photo/exterior/exterior5.jpg", alt: "Penthouse Suite - Sundeck with Forest View" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <Translate text={roomsTranslations.pageTitle} />
              </h1>
              <p className="text-lg text-gray-700 mb-12">
                <Translate text={roomsTranslations.pageDescription} />
              </p>

              <div className="space-y-16">
                {/* Garden Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Translate text={roomsTranslations.gardenSuite.title} />
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.gardenSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Step-free access for wheelchairs, strollers, and heavy luggage.",
                            es: "Acceso sin escalones para sillas de ruedas, cochecitos y equipaje pesado.",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 8h20" />
                        <path d="M12 16v-4" />
                        <path d="M8 16v-2" />
                        <path d="M16 16v-2" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Corner window facing garden, dedicated entry hall",
                            es: "Ventana en esquina con vista al jardín, hall de entrada dedicado",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Window-side dining/work table, futon for extra bed (fee)",
                            es: "Mesa de comedor/trabajo junto a la ventana, futón para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={gardenSuiteImages} gridCols="grid-cols-3" />

                </div>

                {/* Terrace Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Translate text={roomsTranslations.terraceSuite.title} />
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.terraceSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "40 m² shaded terrace with built-in planters",
                            es: "Terraza sombreada de 40 m² con jardineras incorporadas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Open-plan layout: sleep, cook, work in one space",
                            es: "Diseño de planta abierta: dormir, cocinar, trabajar en un espacio",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Dedicated indoor living/work zone, but the terrace workspace delivers a productivity boost thanks to fresh air.",
                            es: "Zona interior dedicada para vivir/trabajar, pero el espacio de trabajo en la terraza brinda un impulso de productividad gracias al aire fresco.",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Abundant natural light throughout the day",
                            es: "Abundante luz natural durante todo el día",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Perfect for plant lovers and outdoor enthusiasts",
                            es: "Perfecto para amantes de las plantas y entusiastas del aire libre",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={terraceSuiteImages} gridCols="grid-cols-3" />

                </div>

                {/* Forest-View Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Translate text={roomsTranslations.forestSuite.title} />
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.forestSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 14l-5-5-5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <path d="M12 9v12" />
                        <path d="M5 21h14" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Huge 3 m-tall corner window overlooking the pine forest",
                            es: "Enorme ventana en esquina de 3 m de altura con vista al bosque de pinos",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Separate bedroom + living/work room",
                            es: "Dormitorio separado + sala de estar/trabajo",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Enhanced privacy with distinct living areas",
                            es: "Mayor privacidad con áreas de estar diferenciadas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Ideal for couples or those needing separate work space",
                            es: "Ideal para parejas o quienes necesitan espacio de trabajo separado",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Twin beds that can be joined to form a queen-size bed",
                            es: "Camas twin que pueden unirse para formar una cama queen-size",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Ideal for couples or those needing separate work space",
                            es: "Ideal para parejas o quienes necesitan espacio de trabajo separado",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={forestSuiteImages} gridCols="grid-cols-3" />

                </div>

                {/* Penthouse Suite */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Translate text={roomsTranslations.penthouseSuite.title} />
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.penthouseSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Top-floor suite with direct terrace access",
                            es: "Suite en planta alta con acceso directo a la terraza",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Optional exclusive-use terrace (extra fee)",
                            es: "Terraza de uso exclusivo opcional (cargo extra)",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Our most spacious and luxurious accommodation",
                            es: "Nuestro alojamiento más espacioso y lujoso",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 mr-3 mt-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="2" />
                        <path d="M4 8v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={penthouseSuiteImages} gridCols="grid-cols-2" />

                </div>

                {/* All Suites Include */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">
                    <Translate text={roomsTranslations.allSuitesInclude.title} />
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.internet} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.heating} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.kitchen} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate
                          text={{
                            en: "Bathroom: walk-in shower + washer",
                            es: "Baño: ducha walk-in + lavarropas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate
                          text={{
                            en: "Dense foam mattress with topper + 5* bedding",
                            es: "Colchón de espuma densa con topper + ropa de cama 5*",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <LampDesk className="h-5 w-5 mr-3 mt-1 text-gray-700 flex-shrink-0" />
                      <span>
                        <Translate
                          text={{
                            en: "Ergonomic chair (free for stays > 1 month), twin beds on request",
                            es: "Silla ergonómica (gratis para estadías > 1 mes), camas individuales bajo pedido",
                          }}
                        />
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Translate text={roomsTranslations.bookYourStay.button} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
