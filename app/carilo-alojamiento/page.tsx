import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroImage } from "@/components/hero-image"
import { Metadata } from "next"
import {
  ArrowRight,
  Bed,
  MapPin,
  Wifi,
  Users,
  Star,
  TreesIcon as Tree,
  Car,
  Coffee,
} from "@/components/icons8-lucide"

export const metadata: Metadata = {
  title: "Cariló Alojamiento - Hospedaje Premium en el Bosque de Pinos | IL BUCO",
  description: "Cariló alojamiento de lujo en villa privada. Hospedaje exclusivo a 150m de la playa, rodeado de bosque de pinos. 4 habitaciones premium con todas las comodidades.",
  keywords: "carilo alojamiento, cariló alojamiento, hospedaje carilo, alojamiento carilo playa, donde alojarse en carilo",
  openGraph: {
    title: "Alojamiento Premium en Cariló | IL BUCO",
    description: "Villa privada para alojamiento de lujo en Cariló. Ubicada en el bosque de pinos a pasos de la playa.",
  },
}

export default function CariloAlojamientoPage() {
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
                  <span className="text-gray-900">Cariló Alojamiento</span> de Lujo
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Descubre el mejor alojamiento en Cariló. Nuestra villa exclusiva te ofrece una experiencia única en el corazón del bosque de pinos, a solo pasos de las mejores playas de la costa argentina. Hospedaje premium para huéspedes exigentes.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/the-house"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-base md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ver Casa <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <HeroImage 
                  src="/gallery/hero-terrace-view.jpeg"
                  alt="Alojamiento premium IL BUCO en Cariló - terraza con vista panorámica"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Our Accommodation Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                ¿Por qué Elegir Nuestro Alojamiento en Cariló?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ubicación única:</strong> El único alojamiento en Cariló que combina privacidad del bosque con cercanía inmediata a la playa.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Hospedaje premium:</strong> Villa de lujo con servicios de primera clase y atención personalizada para cada huésped.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Capacidad flexible:</strong> Alojamiento ideal para parejas, familias o grupos de hasta 8 personas con privacidad garantizada.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Acceso exclusivo:</strong> A 150 metros de la playa por sendero privado a través del bosque de pinos centenario.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Conectividad superior:</strong> Internet fibra óptica de alta velocidad para huéspedes que trabajan remotamente.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accommodation Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Características del Alojamiento
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Bed className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      4 Habitaciones de Lujo
                    </h3>
                    <p className="text-gray-600">
                      Cada habitación cuenta con cama queen/king, ropa de cama premium y aire acondicionado individual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🛁</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      3 Baños Completos
                    </h3>
                    <p className="text-gray-600">
                      Baños modernos con amenities de lujo, ducha de lluvia y secador de cabello profesional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Coffee className="h-5 w-5 mr-3 mt-1 text-black" />
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
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🌲</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terrazas con Vista al Bosque
                    </h3>
                    <p className="text-gray-600">
                      Múltiples terrazas privadas con mobiliario de diseño y vistas panorámicas a los pinos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Car className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Estacionamiento Privado
                    </h3>
                    <p className="text-gray-600">
                      Garage cubierto y espacios adicionales para múltiples vehículos con total seguridad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🔥</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Calefacción Radiante
                    </h3>
                    <p className="text-gray-600">
                      Sistema de calefacción por suelo radiante en toda la casa para confort en cualquier época.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cariló Destination Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                Cariló: Destino Premium para tu Alojamiento
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[350px] rounded-xl overflow-hidden">
                  <Image
                    src="/photo/zona/File 24-04-2025, 10 36 15 PM (7).jpg"
                    alt="Playa y bosque de Cariló - entorno único del alojamiento"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-lg text-gray-700">
                    Cariló es reconocido como uno de los destinos costeros más exclusivos de Argentina. Su combinación única de bosque de pinos que llega hasta la playa crea un microclima especial y una atmosfera incomparable.
                  </p>
                  <p className="text-lg text-gray-700">
                    Nuestro alojamiento te ubica en el corazón de esta maravilla natural, donde puedes despertar entre los pinos y llegar caminando a playas vírgenes en pocos minutos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para tu Alojamiento en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva tu estadía en nuestro alojamiento premium y vive la experiencia única de Cariló en primera persona.
            </p>
            <Link
              href="/the-house"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Ver Casa <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}