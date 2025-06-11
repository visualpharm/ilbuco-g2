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
  Calendar,
  Key,
  Shield,
  TreesIcon as Tree,
  Car,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Casas en Cariló Alquiler - Villa Premium en el Bosque | IL BUCO",
  description: "Casas en Cariló alquiler temporario. Villa premium de 4 habitaciones en el bosque de pinos, a 150m de la playa. Ideal para familias y grupos.",
  keywords: "casas en carilo alquiler, casas carilo alquiler, casa carilo alquiler temporario, casas en cariló para alquilar",
  openGraph: {
    title: "Casa Premium en Alquiler - Cariló | IL BUCO",
    description: "Villa completa para alquiler en Cariló. Casa de lujo en el bosque de pinos cerca de la playa.",
  },
}

export default function CasasEnCariloAlquilerPage() {
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
                  <span className="text-blue-600">Casas en Cariló</span> para Alquiler
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Encuentra la mejor casa en alquiler en Cariló. Nuestra villa premium de 4 habitaciones está ubicada en el corazón del bosque de pinos, ofreciendo la experiencia perfecta para familias y grupos que buscan exclusividad y confort.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Alquilar Casa <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/photo/exterior/exterior1.jpg"
                  alt="Casa moderna en alquiler en Cariló - villa IL BUCO en bosque de pinos"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Rent Houses in Cariló Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                ¿Por qué Elegir Casas en Cariló para Alquiler?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Home className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Casa completa para tu grupo:</strong> Privacidad total con 4 habitaciones, 3 baños y espacios comunes amplios para toda la familia.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Entorno natural único:</strong> Cariló es el único lugar donde el bosque de pinos centenario se encuentra con el océano atlántico.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ideal para grupos:</strong> Capacidad para 8 personas con la comodidad y flexibilidad que solo una casa completa puede ofrecer.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ubicación estratégica:</strong> A 150 metros de la playa y cerca del centro comercial de Cariló con fácil acceso a pie.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Key className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Autonomía total:</strong> Check-in sin contacto y acceso libre a la casa durante toda tu estadía sin horarios restrictivos.
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
                      4 Dormitorios Amplios
                    </h3>
                    <p className="text-gray-600">
                      Cada habitación con cama matrimonial, armarios amplios y ventanas con vista al bosque de pinos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-green-600">🍳</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Cocina Totalmente Equipada
                    </h3>
                    <p className="text-gray-600">
                      Electrodomésticos de primera línea, vajilla completa e isla central perfecta para comidas grupales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-purple-600">🛋️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Espacios de Estar Amplios
                    </h3>
                    <p className="text-gray-600">
                      Living y comedor integrados con capacidad para 10 personas, ideal para reuniones familiares.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Car className="h-5 w-5 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Garage y Estacionamiento
                    </h3>
                    <p className="text-gray-600">
                      Garage cubierto para 2 autos y espacios adicionales al aire libre para huéspedes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-yellow-600">🔥</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Calefacción Central
                    </h3>
                    <p className="text-gray-600">
                      Sistema de calefacción radiante por suelo en toda la casa para confort en cualquier época del año.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-blue-600">🌐</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Internet Alta Velocidad
                    </h3>
                    <p className="text-gray-600">
                      Fibra óptica de 500 Mbps en toda la casa, perfecto para trabajo remoto y entretenimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Periods Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">
                Períodos de Alquiler Disponibles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">Fines de Semana</h3>
                  <p className="text-gray-600">
                    Escapadas perfectas de 2-3 días para desconectar en el bosque de pinos de Cariló.
                  </p>
                </div>
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Vacaciones Semanales</h3>
                  <p className="text-gray-600">
                    Estadías de 7-14 días ideales para familias que buscan vacaciones completas.
                  </p>
                </div>
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-semibold mb-2">Temporadas Largas</h3>
                  <p className="text-gray-600">
                    Alquileres mensuales para profesionales que trabajan remotamente desde Cariló.
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
              ¿Listo para Alquilar tu Casa en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva nuestra villa premium y disfruta de la experiencia única de tener una casa completa en el paraíso de Cariló.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Consultar Disponibilidad <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}