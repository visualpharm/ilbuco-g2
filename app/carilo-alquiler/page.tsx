import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Home,
  MapPin,
  Users,
  Wifi,
  Car,
  TreesIcon as Tree,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Cariló Alquiler - Casa Premium en el Bosque de Pinos | IL BUCO",
  description: "Cariló alquiler de casa premium. Villa moderna a 150m de la playa, rodeada de bosque de pinos. Internet 500 Mbps, calefacción radiante y todas las comodidades.",
  keywords: "carilo alquiler, carilo alquiler casa, carilo alquiler villa, casa carilo alquiler, alquiler casa carilo",
  openGraph: {
    title: "Casa Premium en Alquiler - Cariló | IL BUCO",
    description: "Villa moderna en Cariló disponible para alquiler. Ubicada en el bosque de pinos a pasos de la playa.",
  },
}

export default function CariloAlquilerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 py-16 md:py-20 lg:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              <div className="space-y-4 md:space-y-5 lg:space-y-6 order-1 md:order-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-blue-600">Cariló Alquiler</span> Casa Premium
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Descubre nuestra casa premium en alquiler en Cariló. Ubicada en el corazón del bosque de pinos, a solo 150 metros de las mejores playas de la costa argentina. Un refugio moderno con todas las comodidades.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ver Disponibilidad <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/gallery/hero-deck-terrace.jpeg"
                  alt="Casa premium IL BUCO en Cariló - terraza con vista al bosque de pinos"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Cariló Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                ¿Por qué Alquilar en Cariló?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Entorno único:</strong> Cariló es el único lugar de Argentina donde el bosque de pinos llega hasta la playa del océano.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ubicación exclusiva:</strong> Destino premium frecuentado por familias acomodadas y profesionales exitosos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Comunidad selecta:</strong> Ambiente tranquilo y seguro, ideal para familias y trabajo remoto.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Car className="h-5 w-5 mr-3 mt-1 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Fácil acceso:</strong> A solo 4 horas de Buenos Aires por autopista, conexión directa en auto o bus.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* House Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Características de la Casa en Alquiler
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Home className="h-5 w-5 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      4 Habitaciones Premium
                    </h3>
                    <p className="text-gray-600">
                      Cuatro dormitorios completamente equipados con ropa de cama de lujo y aire acondicionado individual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Internet Ultra Rápido
                    </h3>
                    <p className="text-gray-600">
                      Fibra óptica de 500 Mbps para trabajo remoto, streaming y videoconferencias sin interrupciones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-orange-600">🔥</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Calefacción Radiante
                    </h3>
                    <p className="text-gray-600">
                      Sistema de calefacción por suelo radiante en toda la casa para máximo confort en invierno.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-blue-600">🍽️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Cocina Gourmet
                    </h3>
                    <p className="text-gray-600">
                      Cocina completamente equipada con electrodomésticos premium e isla central para socializar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-green-600">🌲</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terrazas Privadas
                    </h3>
                    <p className="text-gray-600">
                      Múltiples terrazas con vistas al bosque, perfectas para desayunar al aire libre o trabajar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-purple-600">🏖️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Acceso Directo a Playa
                    </h3>
                    <p className="text-gray-600">
                      Camino privado de 5 minutos a través del bosque hasta las playas vírgenes de Cariló.
                    </p>
                  </div>
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