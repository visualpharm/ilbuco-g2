import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, Target, Calendar, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Team Building en Cariló 2025 | Dinámicas Grupales y Actividades de Integración",
  description: "Organizá team building corporativo en Cariló con dinámicas grupales y actividades de integración. Alojamiento, espacios y experiencias diseñadas para fortalecer equipos.",
  keywords: "team building en Cariló, dinámicas grupales en Cariló, actividades de integración en Cariló, team building corporativo en Cariló",
  openGraph: {
    title: "Team Building en Cariló 2025 | Dinámicas Grupales y Actividades de Integración",
    description: "Organizá team building corporativo en Cariló con dinámicas grupales y actividades de integración. Alojamiento, espacios y experiencias diseñadas para fortalecer equipos.",
    type: "website",
    url: "https://ilbuco.com.ar/team-building-carilo",
    images: [
      {
        url: "https://ik.imagekit.io/icons8/ilbuco/photo/living/living4.jpg?tr=w-1200,h-630",
        width: 1200,
        height: 630,
        alt: "Team building en Cariló - Il Buco",
      },
    ],
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/team-building-carilo",
  },
}

export default function TeamBuildingCarilo() {
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
                  <span className="text-black">Team Building</span>{" "}
                  <span className="text-gray-600">en Cariló</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Fortalecé tu equipo en el entorno natural único de Cariló. Espacios exclusivos, 
                  actividades personalizadas y <Link href="/carilo-golf-hospedaje" className="text-gray-700 no-underline hover:text-gray-900">alojamiento premium</Link> para experiencias de team building inolvidables.
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
                    src="https://ik.imagekit.io/icons8/ilbuco/photo/living/living4.jpg?tr=w-600,h-500"
                    alt="Team building en Cariló - espacios para dinámicas grupales"
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

        {/* Dinámicas Grupales Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Dinámicas Grupales en Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Outdoor Team Challenges</h3>
                <p className="text-gray-700">
                  Aprovechá el bosque de pinos y la playa para dinámicas grupales al aire libre. 
                  Actividades de confianza, resolución de problemas y comunicación en entornos naturales, perfectas para <Link href="/carilo-golf-hospedaje" className="text-gray-700 no-underline hover:text-gray-900">estadías</Link> prolongadas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Workshops Creativos</h3>
                <p className="text-gray-700">
                  Espacios amplios y luminosos para talleres de creatividad, brainstorming sessions 
                  y actividades de innovación que estimulen el pensamiento colaborativo.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Programas Personalizados</h3>
                <p className="text-gray-700">
                  Diseñamos experiencias específicas según los objetivos de tu equipo. 
                  Desde half-day workshops hasta retiros intensivos de varios días.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Actividades de Integración Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Actividades de Integración en Cariló</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Deportes y Aventura</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Torneos de tenis y pádel en Club de Tenis Cariló
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Cabalgatas grupales por la playa y bosque
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Clases de surf y windsurf en equipo
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Ciclismo grupal por senderos naturales
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Experiencias Gastronómicas</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <Link href="/eventos-corporativos-carilo" className="text-gray-700 no-underline hover:text-gray-900">Asados grupales</Link> en la terraza de Il Buco
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Cooking classes con chefs locales
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Wine tasting y maridajes argentinos
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Cenas temáticas en restaurantes locales
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center">Team Building Corporativo en Cariló</h3>
                <p className="text-gray-700 text-center max-w-3xl mx-auto">
                  Nuestro enfoque en team building corporativo combina metodologías probadas con 
                  el entorno único de Cariló. Facilitadores profesionales, espacios versátiles 
                  y actividades diseñadas para objetivos específicos de <Link href="/eventos-corporativos-carilo" className="text-gray-700 no-underline hover:text-gray-900">desarrollo organizacional</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accommodations Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Alojamiento para Equipos</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Suites Privadas</h3>
                <p className="text-gray-700 mb-4">
                  Cada miembro del equipo tiene su espacio privado con baño en suite, 
                  terraza y todas las comodidades para descansar después de las actividades.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 4 suites independientes</li>
                  <li>• Baños privados en cada suite</li>
                  <li>• Terrazas con vista al bosque</li>
                  <li>• WiFi de alta velocidad</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Espacios Comunes</h3>
                <p className="text-gray-700 mb-4">
                  Áreas compartidas diseñadas para la colaboración, relajación y 
                  continuación natural de las dinámicas de team building.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Living amplio para reuniones informales</li>
                  <li>• Cocina completamente equipada</li>
                  <li>• Terraza con BBQ para eventos</li>
                  <li>• Jardín con espacios de trabajo</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para Fortalecer tu Equipo?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Creamos experiencias de team building únicas en el entorno inspirador de Cariló. 
              Contactanos para diseñar el programa perfecto para tu organización.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacts"
                className="inline-flex items-center px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Consultar Fechas Disponibles
              </Link>
              <Link
                href="https://book.ilbuco.com.ar"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
              >
                Ver Tarifas Grupales
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