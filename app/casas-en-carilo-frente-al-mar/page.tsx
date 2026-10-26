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
  Eye,
  TreesIcon as Tree,
  Home,
  Users,
  Navigation,
  Sunrise,
} from "@/components/icons8-lucide"

export const metadata: Metadata = {
  title: "Casas en Cariló Frente al Mar - Vista Océano desde el Bosque | IL BUCO",
  description: "Casas en Cariló frente al mar. Villa premium con vista al océano, ubicada entre el bosque de pinos y la playa. Acceso directo al mar en 150 metros.",
  keywords: "casas en carilo frente al mar, casas cariló vista al mar, casa carilo playa, villa frente al mar carilo",
  openGraph: {
    title: "Casa Frente al Mar en Cariló | IL BUCO",
    description: "Villa premium con vista al océano en Cariló. Ubicada en el bosque de pinos con acceso directo a la playa.",
  },
}

export default function CasasEnCariloFrenteAlMarPage() {
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
                  <span className="text-gray-600">Casas en Cariló</span> Frente al Mar
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Vive la experiencia única de una casa frente al mar en Cariló. Nuestra villa premium combina la serenidad del bosque de pinos con vistas espectaculares al océano Atlántico. A solo 150 metros de la playa con acceso directo.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/the-house"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-base md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ver Casa Frente al Mar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <HeroImage 
                  src="/photo/zona/File 24-04-2025, 10 36 15 PM (8).jpg"
                  alt="Casa frente al mar en Cariló - vista desde la playa hacia villa IL BUCO"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ocean Front Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Ventajas de Casas Frente al Mar en Cariló
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Acceso directo al océano:</strong> Camina 150 metros a través del bosque y llegás directamente a las mejores playas de Cariló.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Eye className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Vistas panorámicas:</strong> Desde las terrazas superiores podés disfrutar vistas al mar entre las copas de los pinos centenarios.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Microclima único:</strong> La combinación de bosque y mar crea un ambiente fresco y saludable todo el año.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Navigation className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Ubicación privilegiada:</strong> En la zona más exclusiva de Cariló, entre residencias de alta gama frente al mar.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Sunrise className="h-5 w-5 mr-3 mt-1 text-black flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Amaneceres espectaculares:</strong> Despertá con la vista del sol naciendo sobre el océano Atlántico cada mañana.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Oceanfront Villa Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Villa Frente al Mar de Cariló
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Home className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      4 Habitaciones con Vista
                    </h3>
                    <p className="text-gray-600">
                      Cada dormitorio diseñado para maximizar las vistas al bosque y vislumbres del océano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-600">🌊</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terrazas Vista al Mar
                    </h3>
                    <p className="text-gray-600">
                      Múltiples terrazas orientadas estratégicamente para capturar vistas al océano y bosque.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Sendero Privado a Playa
                    </h3>
                    <p className="text-gray-600">
                      Acceso exclusivo a través de sendero entre pinos que te lleva directo a la arena.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Users className="h-5 w-5 mr-3 mt-1 text-black" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Espacios para Grupos
                    </h3>
                    <p className="text-gray-600">
                      Living y comedor amplios con ventanales panorámicos hacia el mar, ideal para familias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🌅</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Orientación Este
                    </h3>
                    <p className="text-gray-600">
                      Casa orientada para capturar la luz matutina del océano y mantener frescura durante el día.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-black">🏖️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Equipamiento Playa
                    </h3>
                    <p className="text-gray-600">
                      Reposeras, sombrillas y equipos de playa incluidos para disfrutar del mar inmediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beach Activities Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">
                Actividades Frente al Mar en Cariló
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[350px] rounded-xl overflow-hidden">
                  <Image
                    src="/villa-pine-forest-path.jpeg"
                    alt="Sendero desde casa IL BUCO hacia la playa de Cariló"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-black">🏄</span>
                    <div>
                      <p className="text-lg">
                        <strong>Deportes acuáticos:</strong> Surf, paddleboard y kayak con alquiler disponible en la playa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-black">🚶</span>
                    <div>
                      <p className="text-lg">
                        <strong>Caminatas costeras:</strong> Kilómetros de playa virgen para caminar al amanecer y atardecer.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-black">🎣</span>
                    <div>
                      <p className="text-lg">
                        <strong>Pesca deportiva:</strong> Acceso directo a zonas de pesca desde la orilla o embarcado.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-5 w-5 mr-3 mt-1 text-black">🌅</span>
                    <div>
                      <p className="text-lg">
                        <strong>Fotografía marina:</strong> Vistas únicas para capturar la belleza del océano y bosque.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para tu Casa Frente al Mar en Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva tu estadía en nuestra villa frente al mar y vive la experiencia única de despertar con vista al océano en Cariló.
            </p>
            <Link
              href="/the-house"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Ver Casa Frente al Mar <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}