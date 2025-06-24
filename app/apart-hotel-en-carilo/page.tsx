import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroImage } from "@/components/hero-image"
import { Metadata } from "next"
import {
  ArrowRight,
  Hotel,
  MapPin,
  Wifi,
  Car,
  Users,
  Star,
  Coffee,
  Shield,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Apart Hotel en Cariló - Servicio Premium en Villa Privada | IL BUCO",
  description: "Apart hotel en Cariló con servicios premium. Villa privada con atención personalizada, limpieza diaria opcional, desayuno y todas las comodidades de hotel.",
  keywords: "apart hotel en carilo, apart hotel cariló, hotel carilo, alojamiento premium carilo, villa hotel carilo",
  openGraph: {
    title: "Apart Hotel Premium en Cariló | IL BUCO",
    description: "Servicios de apart hotel en villa privada. Ubicado en el bosque de pinos a 150m de la playa.",
  },
}

export default function ApartHotelEnCariloPage() {
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
                  <span className="text-gray-900">Apart Hotel</span> Premium en Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Experimenta el lujo de un apart hotel en villa privada. Servicios hoteleros personalizados en el corazón del bosque de pinos de Cariló, a pasos de la playa. El equilibrio perfecto entre privacidad y atención profesional.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/the-house"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-sm md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ver Casa <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <HeroImage 
                  src="/gallery/hero-outdoor-seating.jpeg"
                  alt="Apart hotel IL BUCO en Cariló - área de descanso exterior premium"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Services Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Servicios de Apart Hotel Incluidos
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Hotel className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Recepción virtual 24/7:</strong> Check-in sin contacto y asistencia remota disponible las 24 horas para cualquier consulta.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Coffee className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Desayuno premium opcional:</strong> Servicio de desayuno gourmet entregado en tu villa con productos locales frescos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Limpieza diaria opcional:</strong> Servicio de housekeeping profesional para mantener tu espacio impecable.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Concierge personalizado:</strong> Asistencia para reservas de restaurantes, actividades y traslados en Cariló.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Car className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Estacionamiento privado:</strong> Garage cubierto y espacio adicional para múltiples vehículos con seguridad.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Villa Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Villa Apart Hotel de Lujo
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Hotel className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      4 Suites Independientes
                    </h3>
                    <p className="text-gray-600">
                      Cada habitación funciona como suite de hotel con baño privado y aire acondicionado individual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Conectividad Premium
                    </h3>
                    <p className="text-gray-600">
                      Internet fibra óptica de 500 Mbps en toda la villa, ideal para trabajo remoto y entretenimiento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🍽️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Cocina Gourmet Compartida
                    </h3>
                    <p className="text-gray-600">
                      Cocina completamente equipada estilo hotel boutique con electrodomésticos de primera línea.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Ubicación Exclusiva
                    </h3>
                    <p className="text-gray-600">
                      En el corazón del bosque de pinos, a 150 metros de la playa y centro de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🌲</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terrazas Privadas
                    </h3>
                    <p className="text-gray-600">
                      Múltiples espacios al aire libre con mobiliario de diseño y vistas panorámicas al bosque.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Star className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Calidad 5 Estrellas
                    </h3>
                    <p className="text-gray-600">
                      Amenities premium, ropa de cama de lujo y atención al detalle en cada aspecto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src="/photo/living/File 24-04-2025, 10 29 16 PM-Edit.jpg"
                      alt="Living premium en apart hotel IL BUCO Cariló"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-2xl font-medium">
                    "El servicio de apart hotel superó nuestras expectativas. La atención personalizada combinada con la privacidad de la villa fue perfecta."
                  </p>
                  <p className="text-gray-600">
                    Carlos M., Ejecutivo de Buenos Aires
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
              ¿Listo para la Experiencia Apart Hotel en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva tu estadía en nuestro apart hotel y disfruta de servicios premium en una villa privada única.
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