import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Waves,
  TreesIcon as Tree,
  MapPin,
  Camera,
  Bike,
  UtensilsCrossed,
  ShoppingBag as Shopping,
  Music,
  Sunrise,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Qué Hacer en Cariló - Guía Completa de Actividades | IL BUCO",
  description: "Descubre qué hacer en Cariló. Guía completa de actividades: playas, bosque de pinos, gastronomía, deportes acuáticos y vida nocturna. Planifica tu estadía perfecta.",
  keywords: "que hacer en carilo, actividades carilo, turismo carilo, lugares para visitar carilo, planes carilo",
  openGraph: {
    title: "Qué Hacer en Cariló - Guía de Actividades | IL BUCO",
    description: "Guía completa de actividades y lugares para visitar en Cariló. Desde playas hasta gastronomía local.",
  },
}

export default function QueHacerEnCariloPage() {
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
                  <span className="text-blue-600">Qué Hacer</span> en Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Descubre todo lo que puedes hacer en Cariló, el destino costero más exclusivo de Argentina. Desde relajarte en playas vírgenes hasta explorar el bosque de pinos centenario. Tu guía completa para aprovechar al máximo tu estadía.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Planifica tu Estadía <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/carilo-beach-forest.png"
                  alt="Qué hacer en Cariló - vista panorámica de playa y bosque de pinos"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beach Activities Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Actividades en la Playa
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Deportes Acuáticos</h3>
                    <p className="text-gray-700">
                      Surf, paddleboard, kayak y windsurf. Alquiler de equipos disponible en la playa con instructores certificados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🏐</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Deportes de Playa</h3>
                    <p className="text-gray-700">
                      Vóley playero, fútbol, tenis de playa y juegos familiares en la arena blanca de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Sunrise className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Amaneceres y Atardeceres</h3>
                    <p className="text-gray-700">
                      Caminatas al amanecer por la orilla del mar y contemplación de atardeceres únicos entre pinos y océano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🎣</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Pesca Deportiva</h3>
                    <p className="text-gray-700">
                      Pesca desde la orilla o embarcado. Excursiones de pesca deportiva con guías locales especializados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🏖️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Relax en la Arena</h3>
                    <p className="text-gray-700">
                      Tomar sol, lectura bajo sombrillas y masajes en la playa. Balnearios exclusivos con servicios premium.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-blue-600">🚤</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Navegación</h3>
                    <p className="text-gray-700">
                      Paseos en lancha, jet ski y catamarán. Excursiones a islas cercanas y avistamiento de fauna marina.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forest Activities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Actividades en el Bosque de Pinos
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative h-[350px] rounded-xl overflow-hidden">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="Senderos del bosque de pinos en Cariló para hacer trekking"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Tree className="h-6 w-6 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Trekking y Senderismo</h3>
                    <p className="text-gray-700">
                      Explora senderos naturales entre pinos centenarios. Rutas de diferentes dificultades con guías especializados en flora y fauna local.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Bike className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ciclismo</h3>
                    <p className="text-gray-700">
                      Alquiler de bicicletas para recorrer senderos forestales. Circuitos temáticos y mountain bike para aventureros.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Camera className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fotografía de Naturaleza</h3>
                    <p className="text-gray-700">
                      Tours fotográficos especializados. Captura la magia del bosque, vida silvestre y paisajes únicos de Cariló.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gastronomy and Shopping Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Gastronomía y Compras
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Restaurantes Gourmet</h3>
                    <p className="text-gray-700">
                      Alta gastronomía con vista al mar. Mariscos frescos, asados argentinos y cocina internacional en ambientes únicos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🍷</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bares y Vinotecas</h3>
                    <p className="text-gray-700">
                      Cata de vinos argentinos, cocktails de autor y ambientes sofisticados para disfrutar al atardecer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Shopping className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Boutiques Exclusivas</h3>
                    <p className="text-gray-700">
                      Tiendas de diseño, artesanías locales y marcas premium. Shopping al aire libre en el centro de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">☕</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cafés y Pastelerías</h3>
                    <p className="text-gray-700">
                      Cafés gourmet, pastelerías artesanales y heladerías premium para disfrutar entre el bosque de pinos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🛍️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mercado Local</h3>
                    <p className="text-gray-700">
                      Productos regionales, dulces caseros y souvenirs únicos. Ferias de artesanos los fines de semana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Music className="h-6 w-6 mr-3 mt-1 text-red-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vida Nocturna</h3>
                    <p className="text-gray-700">
                      Pubs, discotecas y eventos culturales. Música en vivo y espectáculos durante la temporada alta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Activities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Actividades Culturales y Relajación
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="h-6 w-6 mr-3 mt-1 text-blue-600">🎨</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Galerías de Arte</h3>
                    <p className="text-gray-700">
                      Exposiciones de artistas locales y nacionales. Galerías al aire libre y talleres de arte durante el verano.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🧘</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Yoga y Meditación</h3>
                    <p className="text-gray-700">
                      Clases de yoga en la playa al amanecer. Retiros de meditación y bienestar en contacto con la naturaleza.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">💆</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Spa y Wellness</h3>
                    <p className="text-gray-700">
                      Tratamientos de relajación, masajes terapéuticos y terapias alternativas en spas de lujo.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/modern-bedroom-pine-view.png"
                  alt="Actividades de relajación en Cariló - vista serena desde habitación"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Planning Tips Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                Tips para Planificar tu Estadía en Cariló
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">Mejor Época</h3>
                  <p className="text-gray-600">
                    Diciembre a marzo para playa, abril-mayo y septiembre-noviembre para clima suave y menos gente.
                  </p>
                </div>
                <div className="p-6 border rounded-lg">
                  <span className="text-3xl block mb-4">🚗</span>
                  <h3 className="text-xl font-semibold mb-2">Cómo Llegar</h3>
                  <p className="text-gray-600">
                    4 horas en auto desde Buenos Aires por Ruta 2. También disponible transporte público y remises.
                  </p>
                </div>
                <div className="p-6 border rounded-lg">
                  <span className="text-3xl block mb-4">📅</span>
                  <h3 className="text-xl font-semibold mb-2">Reserva Anticipada</h3>
                  <p className="text-gray-600">
                    Reserva tu alojamiento con anticipación, especialmente para temporada alta y fines de semana largos.
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
              ¿Listo para Descubrir Todo lo que Cariló Tiene para Ofrecer?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva tu estadía en nuestra villa premium y vive todas estas experiencias únicas desde la comodidad de tu hogar en el bosque de pinos.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Planifica tu Aventura en Cariló <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}