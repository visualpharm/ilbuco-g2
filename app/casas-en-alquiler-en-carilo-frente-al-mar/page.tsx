import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroImage } from "@/components/hero-image"
import { Metadata } from "next"
import {
  ArrowRight,
  Waves,
  MapPin,
  Home,
  Users,
  Calendar,
  Star,
  TreesIcon as Tree,
  Eye,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Casas en Alquiler en Cariló Frente al Mar - Villa Premium | IL BUCO",
  description: "Casas en alquiler en Cariló frente al mar. Villa de lujo con acceso directo a playa, 4 habitaciones en bosque de pinos. Alquiler temporario premium.",
  keywords: "casas en alquiler en carilo frente al mar, casas alquiler carilo playa, villa frente al mar cariló, alquiler cariló mar",
  openGraph: {
    title: "Villa en Alquiler Frente al Mar - Cariló | IL BUCO",
    description: "Casa premium para alquiler en Cariló con vista al mar. Ubicada en bosque de pinos con acceso directo a la playa.",
  },
}

export default function CasasEnAlquilerEnCariloFrenteAlMarPage() {
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
                  <span className="text-gray-900">Casas en Alquiler</span> en Cariló Frente al Mar
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Alquila la villa premium frente al mar en Cariló. Nuestra casa exclusiva combina la magia del bosque de pinos con vistas al océano Atlántico. 4 habitaciones de lujo a 150 metros de la playa con sendero privado.
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
                  src="/gallery/hero-villa-garden.jpeg"
                  alt="Villa en alquiler frente al mar en Cariló - jardín con vista al océano"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Premium Oceanfront Rental Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Alquiler Premium Frente al Mar en Cariló
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Posición única frente al mar:</strong> La casa está estratégicamente ubicada para maximizar vistas al océano y acceso directo a la playa.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Home className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Villa completa en alquiler:</strong> 4 habitaciones privadas, 3 baños, cocina gourmet y espacios comunes con vista panorámica.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Entorno bosque-mar único:</strong> El único alquiler en Argentina donde pinos centenarios se encuentran con el océano Atlántico.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Eye className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Vistas espectaculares:</strong> Terrazas diseñadas para capturar amaneceres sobre el mar y atardeceres en el bosque.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Alquiler de lujo:</strong> Amenities premium, lencería de alta calidad y servicios opcionales de concierge.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rental Periods and Pricing Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Opciones de Alquiler Frente al Mar
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <h3 className="text-xl font-semibold">Alquiler por Días</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Mínimo 2 noches</li>
                  <li>• Perfecto para escapadas</li>
                  <li>• Check-in flexible</li>
                  <li>• Limpieza incluida</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-2 border-blue-200">
                <div className="text-center mb-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="text-xl font-semibold">Alquiler Semanal</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Más Popular</span>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 7-14 días</li>
                  <li>• Ideal para familias</li>
                  <li>• Descuentos por semana</li>
                  <li>• Servicios opcionales</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-black" />
                  <h3 className="text-xl font-semibold">Alquiler Mensual</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 30+ días</li>
                  <li>• Trabajo remoto</li>
                  <li>• Tarifas preferenciales</li>
                  <li>• Servicios personalizados</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Oceanfront Villa Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Características de la Villa Frente al Mar
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Home className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      4 Habitaciones Premium
                    </h3>
                    <p className="text-gray-600">
                      Cada dormitorio con vista al bosque o mar, camas king/queen y baño privado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terrazas Vista Océano
                    </h3>
                    <p className="text-gray-600">
                      Múltiples terrazas en diferentes niveles para disfrutar vistas al mar en privacidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Acceso Privado Playa
                    </h3>
                    <p className="text-gray-600">
                      Sendero exclusivo de 150m a través del bosque hasta arena blanca y aguas cristalinas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Users className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Espacios Sociales
                    </h3>
                    <p className="text-gray-600">
                      Living, comedor y cocina integrados con ventanales panorámicos hacia el océano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🌐</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Conectividad Premium
                    </h3>
                    <p className="text-gray-600">
                      Internet fibra óptica 500 Mbps para trabajo remoto con vista al mar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🏖️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Equipamiento Incluido
                    </h3>
                    <p className="text-gray-600">
                      Reposeras, sombrillas, kayaks y todo lo necesario para disfrutar el mar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src="/photo/giardino/giardino2.jpg"
                      alt="Huésped disfrutando vista al mar desde villa IL BUCO"
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
                    "Alquilar esta casa frente al mar en Cariló fue la mejor decisión. Despertar con vista al océano y tener la playa a pasos fue mágico."
                  </p>
                  <p className="text-gray-600">
                    Ana L., Familia de Córdoba
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
              ¿Listo para Alquilar tu Villa Frente al Mar en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva nuestra villa premium frente al mar y vive la experiencia única de Cariló con vistas espectaculares al océano.
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