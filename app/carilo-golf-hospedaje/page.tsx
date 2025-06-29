import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, ArrowRight, Trophy, Clock, Car, Utensils } from "lucide-react"

export const metadata: Metadata = {
  title: "Cariló Golf Hospedaje 2025 | Estadía para Golfistas en Cariló",
  description: "Hospedaje exclusivo para golfistas en Cariló. Alojamiento premium cerca de campos de golf, con servicios especializados para jugadores y torneos de golf.",
  keywords: "Cariló golf hospedaje, estadía para golfistas Cariló, alojamiento golf Cariló, hospedaje golfistas Argentina",
  openGraph: {
    title: "Cariló Golf Hospedaje 2025 | Estadía para Golfistas en Cariló",
    description: "Hospedaje exclusivo para golfistas en Cariló. Alojamiento premium cerca de campos de golf, con servicios especializados para jugadores y torneos de golf.",
    type: "website",
    url: "https://ilbuco.com.ar/carilo-golf-hospedaje",
    images: [
      {
        url: "https://ik.imagekit.io/icons8/ilbuco/photo/living/living2.jpg?tr=w-1200,h-630",
        width: 1200,
        height: 630,
        alt: "Cariló golf hospedaje - Il Buco",
      },
    ],
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/carilo-golf-hospedaje",
  },
}

export default function CariloGolfHospedaje() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-black">Cariló Golf</span>{" "}
                  <span className="text-gray-600">Hospedaje</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  La estadía perfecta para golfistas en Cariló. Alojamiento exclusivo con servicios 
                  especializados, ubicación estratégica y comodidades diseñadas para <Link href="/team-building-carilo" className="text-gray-700 no-underline hover:text-gray-900">jugadores de golf</Link>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Reservar Estadía
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/rooms"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Ver Suites
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                  <Image
                    src="https://ik.imagekit.io/icons8/ilbuco/photo/living/living2.jpg?tr=w-600,h-500"
                    alt="Hospedaje para golfistas en Cariló - Il Buco"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estadía para Golfistas Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Estadía para Golfistas en Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Servicios Golf Premium</h3>
                <p className="text-gray-700">
                  Servicios especializados para golfistas: limpieza y mantenimiento de equipos, 
                  storage seguro para palos, y coordinación de tee times en los mejores campos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Traslados a Campos</h3>
                <p className="text-gray-700">
                  Servicio de traslado coordinado a los principales campos de golf de la zona. 
                  Horarios flexibles adaptados a tus tee times y preferencias de juego.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Horarios Flexibles</h3>
                <p className="text-gray-700">
                  Check-in y check-out flexibles para adaptarse a tus rounds de golf. 
                  Desayunos tempranos y servicios disponibles según tu agenda de juego.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Golf Courses Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Campos de Golf Cercanos</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Campos Championship</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Cariló Golf Club - 18 hoyos par 72 (15 min)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Pinamar Golf Club - Diseño links costero (25 min)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Costa Esmeralda Golf Club - Campo premium (45 min)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Marisol Golf Country Club - Par 71 (30 min)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Servicios Incluidos</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Gestión de reservas y tee times
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Información detallada de cada campo
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Recomendaciones según nivel de juego
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Conexiones con pros locales
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center">Alojamiento Golf Cariló Premium</h3>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                  Nuestro hospedaje está específicamente diseñado para golfistas que buscan comodidad, 
                  privacidad y servicios especializados. Cada suite ofrece el espacio perfecto para relajarse 
                  después de un día en el campo, ideal también para <Link href="/eventos-corporativos-carilo" className="text-gray-700 no-underline hover:text-gray-900">eventos corporativos</Link> y retiros de golf.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Facilidades Especializadas</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold">Equipment Care</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Área especializada para el cuidado de equipos de golf con limpieza profesional, 
                  secado y storage seguro para palos y accesorios.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Limpieza profesional de palos</li>
                  <li>• Storage climatizado y seguro</li>
                  <li>• Área de práctica putting</li>
                  <li>• Reparaciones menores disponibles</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Utensils className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Nutrition & Recovery</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Servicios de alimentación adaptados a golfistas con desayunos energéticos, 
                  snacks post-round y opciones de recovery para mantener el rendimiento.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Desayunos pre-round personalizados</li>
                  <li>• Snacks y hidratación especializada</li>
                  <li>• Cenas de recuperación balanceadas</li>
                  <li>• Servicio 24/7 para horarios de juego</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Suites Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Suites para Golfistas</h2>
            
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-8">
                Cada suite está diseñada pensando en las necesidades específicas de los golfistas. 
                Espacios amplios, privacidad absoluta y servicios premium para la estadía perfecta.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                  <p className="text-gray-600">Suites Premium</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Private</div>
                  <p className="text-gray-600">Terrazas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15min</div>
                  <p className="text-gray-600">Al Golf Más Cercano</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5★</div>
                  <p className="text-gray-600">Servicio Golf</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">¿Por Qué Elegir Il Buco para tu Golf Trip?</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <strong>Ubicación Estratégica</strong>
                    <p className="text-gray-600 mt-1">Acceso rápido a los mejores campos de la costa atlántica argentina</p>
                  </div>
                  <div>
                    <strong>Servicios Especializados</strong>
                    <p className="text-gray-600 mt-1">Staff especializado en necesidades de golfistas profesionales</p>
                  </div>
                  <div>
                    <strong>Experiencia Integral</strong>
                    <p className="text-gray-600 mt-1">Combinamos golf de clase mundial con hospitalidad premium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para tu Golf Trip Perfecto?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Combiná los mejores campos de golf de Argentina con el hospedaje más exclusivo de Cariló. 
              Reservá tu estadía golf premium hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacts"
                className="inline-flex items-center px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Reservar Golf Package
              </Link>
              <Link
                href="https://book.ilbuco.com.ar"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
              >
                Ver Disponibilidad
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}