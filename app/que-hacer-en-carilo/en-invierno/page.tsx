import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { ArrowRight, Users as Horse, Camera, Wifi, Car } from "lucide-react"

export default function QueHacerEnInvierno() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Qué Hacer en Cariló en Invierno
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Disfrutá de la tranquilidad y belleza de Cariló durante la temporada baja con estas actividades invernales.
            </p>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Horseback Riding */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Horse className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Cabalgatas de Invierno</h2>
                </div>
                <p className="text-gray-700">
                  Las temperaturas más frescas hacen que la experiencia de cabalgatas sea más cómoda durante 
                  los meses de invierno. Disfrutá de paseos por los bosques de pinos y las playas desiertas 
                  en un ambiente de tranquilidad única.
                </p>
              </div>

              {/* 4x4 School */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Car className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Escuela de Manejo 4x4</h2>
                </div>
                <p className="text-gray-700">
                  La temporada baja es ideal para aprender a manejar en arena con menos tráfico y más espacio 
                  para practicar. Las escuelas locales ofrecen clases para todos los niveles, desde principiantes 
                  hasta conductores experimentados que quieran mejorar sus habilidades en terrenos arenosos.
                </p>
              </div>

              {/* Photography and Art */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Camera className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Fotografía y Arte</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  El entorno natural de IL BUCO y los alrededores de Cariló ofrecen luz natural y vistas 
                  inspiradoras perfectas para la fotografía, el dibujo, la pintura u otras actividades 
                  creativas durante los meses más tranquilos.
                </p>
                <p className="text-gray-700">
                  Los amaneceres brumosos sobre las dunas y los atardeceres sobre el mar en invierno 
                  son especialmente fotogénicos, con menos gente y una luz única.
                </p>
              </div>

              {/* Work and Focus */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Wifi className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Trabajo y Concentración</h2>
                </div>
                <p className="text-gray-700">
                  Con nuestro internet de alta velocidad y espacios de trabajo cómodos, IL BUCO es el 
                  lugar perfecto para concentrarte en tus proyectos más importantes durante el invierno. 
                  La tranquilidad de la temporada baja lo convierte en un destino ideal para retiros de 
                  trabajo o para avanzar en esos proyectos que requieren concentración.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-blue-50 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Viví el Encanto del Invierno en Cariló</h3>
                <p className="text-gray-700 mb-6">
                  Descubrí la magia de Cariló en temporada baja y disfrutá de tarifas especiales.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Reservar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
