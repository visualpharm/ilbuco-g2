import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Coffee,
  Book,
  Music,
  UtensilsCrossed,
  ShoppingBag as Shopping,
  Gamepad2,
  Palette,
  Home,
  Wifi,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Qué Hacer en Cariló Cuando Llueve - Actividades Cubiertas | IL BUCO",
  description: "Qué hacer en Cariló cuando llueve. Guía completa de actividades bajo techo: museos, spas, gastronomía, shopping y entretenimiento. Disfruta Cariló sin importar el clima.",
  keywords: "que hacer en carilo cuando llueve, actividades carilo lluvia, planes carilo mal tiempo, entretenimiento carilo interior",
  openGraph: {
    title: "Actividades en Cariló para Días de Lluvia | IL BUCO",
    description: "Descubre qué hacer en Cariló cuando llueve. Actividades cubiertas y planes perfectos para disfrutar sin importar el clima.",
  },
}

export default function QueHacerEnCariloWhenItRainsPage() {
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
                  Qué Hacer en Cariló <span className="text-blue-600">Cuando Llueve</span>
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Los días de lluvia en Cariló pueden ser igual de mágicos. Descubre actividades cubiertas, experiencias gastronómicas, entretenimiento y relajación que harán que disfrutes tu estadía sin importar el clima.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Refugiate en Cariló <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/modern-living-room-pine-forest.png"
                  alt="Qué hacer en Cariló cuando llueve - interior acogedor con vista al bosque"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Indoor Comfort Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Tu Refugio Perfecto en Días de Lluvia
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Home className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Villa con calefacción radiante:</strong> Nuestra casa cuenta con calefacción por suelo radiante que mantiene una temperatura perfecta en toda la propiedad.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Internet ultra rápido:</strong> Fibra óptica de 500 Mbps para trabajo remoto, streaming, videollamadas y entretenimiento sin límites.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 mr-3 mt-1 text-orange-600">🔥</span>
                  <div>
                    <p className="text-lg">
                      <strong>Espacios acogedores:</strong> Living con ventanales panorámicos al bosque, perfecto para disfrutar la lluvia entre los pinos con una taza de café.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 mr-3 mt-1 text-purple-600">📺</span>
                  <div>
                    <p className="text-lg">
                      <strong>Entertainment center:</strong> Smart TV, Netflix, Spotify y sistemas de audio para maratones de series y música relajante.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gastronomy Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Experiencias Gastronómicas Cuando Llueve
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Restaurantes con Chimenea</h3>
                    <p className="text-gray-700">
                      Almuerza en restaurantes acogedores con chimeneas a leña. Ambiente cálido perfecto para disfrutar mariscos y vinos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <Coffee className="h-6 w-6 mr-3 mt-1 text-brown-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cafés y Librerías</h3>
                    <p className="text-gray-700">
                      Cafés especializados con librerías integradas. El lugar perfecto para leer mientras escuchas la lluvia sobre los pinos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🍷</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cata de Vinos</h3>
                    <p className="text-gray-700">
                      Vinotecas con degustaciones guiadas. Conoce vinos argentinos en ambientes cálidos y sofisticados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-red-600">🧑‍🍳</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Clases de Cocina</h3>
                    <p className="text-gray-700">
                      Talleres de cocina regional. Aprende a preparar platos típicos argentinos con chefs locales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🫖</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Casas de Té</h3>
                    <p className="text-gray-700">
                      Salones de té con ambiente británico. Pastelerías artesanales y té premium en ambientes victorianos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🥐</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Panaderías Artesanales</h3>
                    <p className="text-gray-700">
                      Bakeries especializadas en panes europeos. Desayunos y meriendas gourmet para días lluviosos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture and Entertainment Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Cultura y Entretenimiento Interior
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Palette className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Galerías de Arte</h3>
                    <p className="text-gray-700">
                      Visita galerías cubiertas con exposiciones de artistas locales. Arte contemporáneo y tradicional en espacios cálidos y acogedores.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Music className="h-6 w-6 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Música en Vivo Interior</h3>
                    <p className="text-gray-700">
                      Pubs y bares con música en vivo. Jazz, folclore y blues en ambientes íntimos durante las tardes lluviosas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Book className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bibliotecas y Espacios de Lectura</h3>
                    <p className="text-gray-700">
                      Bibliotecas comunitarias y librerías con espacios de lectura. Rincones perfectos para perderse en un buen libro.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Gamepad2 className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Entretenimiento Familiar</h3>
                    <p className="text-gray-700">
                      Centros de juegos, bowling y salas de pool. Diversión para toda la familia en espacios climatizados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/minimalist-modern-bedroom.png"
                  alt="Interior acogedor para días de lluvia en Cariló"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Shopping and Wellness Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Shopping y Bienestar
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Shopping className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Centros Comerciales Cubiertos</h3>
                    <p className="text-gray-700">
                      Galerías comerciales con boutiques, tiendas de diseño y locales de decoración únicos en Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">💆</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Spas y Centros de Bienestar</h3>
                    <p className="text-gray-700">
                      Tratamientos de relajación, masajes y terapias. El día lluvioso perfecto para cuidarte y relajarte.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🧘</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Yoga y Meditación</h3>
                    <p className="text-gray-700">
                      Estudios de yoga climatizados. Clases de meditación y mindfulness para conectar contigo mismo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-orange-600">🏋️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Gimnasios y Fitness</h3>
                    <p className="text-gray-700">
                      Centros de fitness con equipamiento moderno. Mantén tu rutina de ejercicios sin importar el clima.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-red-600">🎭</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Teatro y Espectáculos</h3>
                    <p className="text-gray-700">
                      Teatros locales con obras durante temporada. Espectáculos culturales en espacios íntimos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🎨</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Talleres Creativos</h3>
                    <p className="text-gray-700">
                      Talleres de pintura, cerámica y artesanías. Aprende nuevas habilidades en ambientes creativos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rainy Day Atmosphere Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                La Magia de los Días Lluviosos en Cariló
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[350px] rounded-xl overflow-hidden">
                  <Image
                    src="/modern-bedroom-queen-bed.png"
                    alt="Ambiente acogedor durante lluvia en villa Cariló"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    Los días de lluvia en Cariló tienen una atmósfera especial. El sonido de las gotas sobre las hojas de los pinos centenarios crea una sinfonía natural única.
                  </p>
                  <p className="text-lg text-gray-700">
                    Desde nuestra villa, puedes disfrutar esta experiencia mientras te mantienes cómodo y cálido, con todas las comodidades modernas para hacer de estos días algo memorable.
                  </p>
                  <p className="text-lg text-gray-700">
                    La lluvia en el bosque de pinos genera un aroma característico y un ambiente de tranquilidad que muchos huéspedes describen como terapéutico y revitalizante.
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
              ¿Listo para Disfrutar Cariló sin Importar el Clima?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserva tu estadía en nuestra villa premium y descubre que los días de lluvia en Cariló pueden ser igual de mágicos que los soleados.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservar tu Refugio en Cariló <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}