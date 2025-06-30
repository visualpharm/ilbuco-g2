import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, Calendar, ArrowRight, Building2, Clock, Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Eventos Corporativos en Cariló 2025 | Reuniones y Conferencias Empresariales",
  description: "Organizá eventos corporativos en Cariló con espacios únicos para reuniones empresariales, conferencias y retiros corporativos. Alojamiento exclusivo y servicios completos.",
  keywords: "eventos corporativos en Cariló, reuniones empresariales en Cariló, conferencias en Cariló, retiros corporativos en Cariló",
  openGraph: {
    title: "Eventos Corporativos en Cariló 2025 | Reuniones y Conferencias Empresariales",
    description: "Organizá eventos corporativos en Cariló con espacios únicos para reuniones empresariales, conferencias y retiros corporativos. Alojamiento exclusivo y servicios completos.",
    type: "website",
    url: "https://ilbuco.com.ar/eventos-corporativos-carilo",
    images: [
      {
        url: "https://ik.imagekit.io/icons8/ilbuco/photo/living/living1.jpg?tr=w-1200,h-630",
        width: 1200,
        height: 630,
        alt: "Eventos corporativos en Cariló - Il Buco",
      },
    ],
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/eventos-corporativos-carilo",
  },
}

export default function EventosCorporativosCarilo() {
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
                  <span className="text-black">Eventos Corporativos</span>{" "}
                  <span className="text-gray-600">en Cariló</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Creá experiencias corporativas memorables en el entorno exclusivo de Cariló. 
                  Espacios únicos, servicios profesionales y <Link href="/carilo-golf-hospedaje" className="text-gray-700 no-underline hover:text-gray-900">alojamiento premium</Link> para eventos empresariales exitosos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Consultar Disponibilidad
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/rooms"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Ver Espacios
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                  <Image
                    src="https://ik.imagekit.io/icons8/ilbuco/photo/living/living1.jpg?tr=w-600,h-500"
                    alt="Eventos corporativos en Cariló - espacios para reuniones empresariales"
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

        {/* Reuniones Empresariales Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Reuniones Empresariales en Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Boardroom Privado</h3>
                <p className="text-gray-700">
                  Espacio exclusivo para reuniones de directorio y sesiones ejecutivas. 
                  Ambiente privado con vista al bosque para decisiones estratégicas importantes y <Link href="/team-building-carilo" className="text-gray-700 no-underline hover:text-gray-900">dinámicas de equipo</Link>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Salas de Trabajo</h3>
                <p className="text-gray-700">
                  Múltiples espacios configurables para reuniones de equipos pequeños a medianos. 
                  Iluminación natural y tecnología integrada para máxima productividad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Eventos Multi-día</h3>
                <p className="text-gray-700">
                  Organización completa de eventos corporativos de varios días con alojamiento, 
                  catering y actividades de integración personalizadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conferencias en Cariló Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Conferencias en Cariló</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Espacios para Presentaciones</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Living principal con capacidad para 20-25 personas
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Terraza cubierta para eventos al aire libre
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Jardín para breakout sessions y networking
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Múltiples salas para sesiones paralelas
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Servicios Técnicos</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      WiFi de alta velocidad para streaming
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Proyección y sonido profesional
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Videoconferencia HD para eventos híbridos
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Setup técnico y soporte durante el evento
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center">Retiros Corporativos en Cariló</h3>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                  Diseñamos retiros corporativos que combinan trabajo estratégico con experiencias únicas. 
                  El entorno natural de Cariló proporciona el ambiente perfecto para la innovación, 
                  creatividad y <Link href="/team-building-carilo" className="text-gray-700 no-underline hover:text-gray-900">construcción de equipos</Link> fuera del entorno tradicional de oficina.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Instalaciones y Servicios</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Disponibilidad 24/7</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Acceso completo a las instalaciones durante todo el evento. 
                  Espacios de trabajo disponibles las 24 horas para equipos internacionales.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acceso sin restricciones horarias</li>
                  <li>• Seguridad y privacidad garantizada</li>
                  <li>• Catering y coffee breaks personalizados</li>
                  <li>• Servicio de concierge corporativo</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold">Experiencias Exclusivas</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Actividades corporativas únicas que solo se pueden vivir en Cariló. 
                  Combinamos trabajo productivo con experiencias memorables.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cenas de gala en la playa privada</li>
                  <li>• Actividades de team building en el bosque</li>
                  <li>• Sesiones de work-life balance</li>
                  <li>• Networking en entornos naturales únicos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Accommodation Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Alojamiento Ejecutivo</h2>
            
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-8">
                Cada ejecutivo tiene su suite privada con todas las comodidades para descansar 
                y prepararse entre sesiones. Privacidad absoluta y servicios de nivel internacional, ideal para <Link href="/carilo-golf-hospedaje" className="text-gray-700 no-underline hover:text-gray-900">estadías</Link> prolongadas.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <p className="text-gray-600">Suites Ejecutivas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <p className="text-gray-600">Privacidad</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
                  <p className="text-gray-600">Room Service</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5★</div>
                  <p className="text-gray-600">Experiencia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para tu Próximo Evento Corporativo?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Creamos eventos corporativos únicos que combinan productividad con experiencias inolvidables. 
              Contactanos para diseñar tu evento perfecto en Cariló.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacts"
                className="inline-flex items-center px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Solicitar Propuesta
              </Link>
              <Link
                href="https://book.ilbuco.com.ar"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
              >
                Ver Tarifas Corporativas
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