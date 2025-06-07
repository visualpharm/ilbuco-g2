import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Wifi,
  MapPin,
  Home,
  Key,
  Calendar,
  Shield,
  Star,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Alquiler Cariló - Villa Premium en la Costa Argentina | IL BUCO",
  description: "Alquila nuestra villa premium en Cariló. Casa completa a 150m de la playa, internet 500 Mbps, calefacción radiante. Ideal para familias y profesionales.",
  keywords: "alquiler carilo, casa alquiler carilo, villa alquiler carilo, alquiler cariló argentina, casa carilo alquiler temporario",
  openGraph: {
    title: "Alquiler Villa Premium en Cariló | IL BUCO",
    description: "Villa completa en alquiler en Cariló. A 150m de la playa con todas las comodidades premium.",
  },
}

export default function AlquilerCariloPage() {
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
                  <span className="text-blue-600">Alquiler</span> Villa Premium en Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Alquila nuestra villa exclusiva en Cariló, Argentina. Casa completa con 4 habitaciones, a 150 metros de la playa y rodeada por el bosque de pinos. Perfecta para vacaciones familiares o trabajo remoto.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Consultar Disponibilidad <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="Villa IL BUCO en alquiler en Cariló - exterior premium con iluminación"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Rental Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                ¿Por qué Elegir Nuestro Alquiler en Cariló?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Home className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Casa completa:</strong> 4 habitaciones privadas, 3 baños completos, cocina gourmet y espacios comunes amplios.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ubicación premium:</strong> A solo 150 metros de la playa de Cariló, en el corazón del bosque de pinos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Conectividad premium:</strong> Internet fibra óptica de 500 Mbps para trabajo remoto sin interrupciones.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Máximo confort:</strong> Calefacción radiante en pisos, 8 aires acondicionados y aislación térmica completa.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Key className="h-5 w-5 mr-3 mt-1 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Acceso 24/7:</strong> Check-in flexible y acceso autónomo a la propiedad durante toda tu estadía.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rental Options Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Opciones de Alquiler Disponibles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Alquiler por Días
                    </h3>
                    <p className="text-gray-600">
                      Ideal para escapadas de fin de semana o vacaciones cortas. Mínimo 2 noches.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Alquiler Semanal
                    </h3>
                    <p className="text-gray-600">
                      Perfecto para vacaciones familiares extensas o trabajo remoto intensivo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Alquiler Mensual
                    </h3>
                    <p className="text-gray-600">
                      Ideal para nómadas digitales y profesionales que buscan estadías prolongadas.
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
                      src="/person-window-view.jpeg"
                      alt="Huésped disfrutando la vista desde villa IL BUCO"
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
                    "El alquiler de la villa en Cariló superó todas nuestras expectativas. La ubicación es perfecta y las comodidades son de primera clase."
                  </p>
                  <p className="text-gray-600">
                    María G., Familia de Buenos Aires
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para tu Estadía en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva ahora nuestra villa premium y disfruta de unas vacaciones inolvidables en la costa argentina.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservar Ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}