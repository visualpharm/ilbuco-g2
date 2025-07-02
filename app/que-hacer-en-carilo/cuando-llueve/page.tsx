import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Coffee, ShoppingBag, Palette, Heart, Dumbbell, Church, MapPin, User, Car, Gamepad2, Theater, List } from "lucide-react"

export const metadata: Metadata = {
  title: "Qué Hacer en Cariló Cuando Llueve 2025 | Actividades bajo Techo",
  description: "Guía completa de actividades para días lluviosos en Cariló. Spas, restaurantes, cultura, compras y entretenimiento bajo techo. No dejes que la lluvia arruine tu estadía.",
  keywords: "qué hacer en Cariló cuando llueve, actividades bajo techo Cariló, días lluviosos Cariló, spas Cariló, cultura Cariló, compras Cariló",
  openGraph: {
    title: "Qué Hacer en Cariló Cuando Llueve 2025 | Actividades bajo Techo",
    description: "Guía completa de actividades para días lluviosos en Cariló. Spas, restaurantes, cultura, compras y entretenimiento bajo techo.",
    type: "website",
    url: "https://ilbuco.com.ar/que-hacer-en-carilo/cuando-llueve",
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/que-hacer-en-carilo/cuando-llueve",
  },
}

export default function QueHacerCuandoLlueve() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section with Rain Video */}
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0">
            <video
              src="/photo/lluvia.mov"
              poster="/photo/lluvia.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Qué Hacer en Cariló Cuando Llueve
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              La lluvia no es excusa para aburrirse. Descubrí las mejores actividades bajo techo en Cariló.
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <List className="w-6 h-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Índice de Contenidos</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="#entretenimiento" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <Gamepad2 className="w-5 h-5 text-indigo-600 mr-3" />
                    <span className="font-medium text-gray-900">Entretenimiento y Juegos</span>
                  </div>
                </a>
                
                <a href="#cultura" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <Palette className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">Cultura y Entretenimiento</span>
                  </div>
                </a>
                
                <a href="#spa-bienestar" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-pink-600 mr-3" />
                    <span className="font-medium text-gray-900">Spa y Bienestar</span>
                  </div>
                </a>
                
                <a href="#cafe-chocolate" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-amber-600 mr-3" />
                    <span className="font-medium text-gray-900">Cafés, Té y Chocolate</span>
                  </div>
                </a>
                
                <a href="#compras" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">Compras bajo Techo</span>
                  </div>
                </a>
                
                <a href="#restaurantes" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-red-600 mr-3" />
                    <span className="font-medium text-gray-900">Restaurantes</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Entertainment & Games Section - FIRST */}
        <section id="entretenimiento" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Gamepad2 className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Entretenimiento y Juegos</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Escape Room Pinamar</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (75 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Desafío mental en equipo con la sala temática "Misión Pirata" para 2-6 personas en 60 minutos con niveles de dificultad ajustables.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>35 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Escape+Room+Pinamar+De+la+Sirena+700"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Center Play</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (110 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Centro de juegos tipo arcade con bowling, pool, metegol, pinballs y más. Local principal en Pinamar y sucursal en Valeria del Mar.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>30-40 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>15-25 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Center+Play+Pinamar+Av+Bunge"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Teatro Municipal de la Torre</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.4 (65 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Programación activa de teatro independiente, comedia, stand-up y funciones infantiles incluso fuera de temporada en Pinamar.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>35 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Teatro+Municipal+de+la+Torre+Pinamar"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Theater className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Cine Oasis</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 3.8 (90 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Funciones diarias de cine en Pinamar. Instalación modesta con la mayoría de películas dobladas al español.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>40 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>25 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Cine+Oasis+Av+Shaw+Pinamar"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Theater className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Il Buco - Entretenimiento Digital</h5>
                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ⭐ Tu residencia
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Ver películas y series en habitaciones privadas con Smart TV, Netflix, Disney+ y Max, o disfrutar en grupo en el living común.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>0 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>0 min</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Reservar tu Refugio contra la Lluvia
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Il Buco - Juegos de Mesa</h5>
                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ⭐ Tu residencia
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Pasar tardes sin salir con colección de juegos de mesa, perfecto para conocer otros huéspedes o tiempo en familia.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>0 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>0 min</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Reservar tu Refugio contra la Lluvia
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Culture & Entertainment Section - SECOND */}
        <section id="cultura" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Palette className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Cultura y Entretenimiento</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Galería Cariló Arte Contemporáneo</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (35 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Exposiciones rotativas de más de 50 artistas nacionales y talleres para adultos y niños desde 3 años en temporada alta.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Galería+Cariló+Arte+Contemporáneo"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">El Ojo y el Diamante</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.6 (28 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Casa/taller artístico con mosaico y vitrofusión atendido por sus propios artistas, solo con reserva previa.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>22 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>8 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=El+Ojo+y+el+Diamante+Valeria+del+Mar"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Experiencias Allona</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.8 (42 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Talleres de cerámica, collage y jardinería con técnicas variadas en entorno tranquilo, materiales incluidos y grupos reducidos.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>38 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>22 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Experiencias+Allona+Pinamar"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Biblioteca Popular Manuel Belgrano</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.1 (67 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Más de 50,000 libros, sala de lectura, computadoras con internet y galería de arte en espacio amplio y tranquilo.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>42 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>25 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Biblioteca+Popular+Manuel+Belgrano+Pinamar"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Capilla Nuestra Señora del Perpetuo Socorro</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.7 (89 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Espacio de paz y reflexión diseñado por Alberto Vivot, construida enteramente en madera e integrada en el bosque.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>8 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>2 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Capilla+Nuestra+Señora+del+Perpetuo+Socorro+Cariló"
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Church className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Spa y Bienestar Section - THIRD */}
        <section id="spa-bienestar" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Heart className="w-8 h-8 text-pink-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Spa y Bienestar</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Cariló Palace Apart Hotel & Spa</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (180 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Relajación completa con sauna, baño finlandés, gimnasio y sala de relax en ambiente de lujo cerca del mar.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>18 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Cariló+Palace+Apart+Hotel+Spa"
                    className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Howard Johnson Hotel Spa</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.1 (340 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Spa completo con piscina climatizada cubierta, gimnasio, sauna, ducha escocesa y salas de masajes profesionales.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>35 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Howard+Johnson+Hotel+Spa+Pinamar"
                    className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Cariló Village Hotel</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (215 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Bienestar familiar con sauna seca, gimnasio completo con hidromasaje y horarios familiares amplios.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Cariló+Village+Hotel"
                    className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Coffee, Tea & Chocolate Section - FOURTH */}
        <section id="cafe-chocolate" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Coffee className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Cafés, Té y Chocolate Caliente</h2>
              </div>
              
              <div className="mb-8">
                <p className="text-xl text-gray-700 mb-8 text-center max-w-3xl mx-auto">
                  Lluvia y calor interno combinan bien. Los paradores principales (Cozumel, Divisadero, Hemingway y Neruda) 
                  cuentan con áreas cubiertas perfectas para pasar la tarde.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Dante</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (145 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Disfrutar café intenso en ambiente con buena ambientación, perfecto para lecturas o conversaciones tranquilas.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>10 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>2 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Dante+Café+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Panettone</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (146 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Panadería artesanal con excelentes medialunas, café de especialidad y ambiente cálido ideal para desayunos prolongados.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Panettone+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Havanna</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.1 (203 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Clásicos alfajores y chocolate caliente de la marca icónica argentina en ambiente familiar y confiable.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Havanna+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Saka</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.4 (120 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Café gourmet con opciones veganas y tés de autor, ambiente moderno y opciones saludables para días lluviosos.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>11 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Saka+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Hönecker</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (73 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Chocolate artesanal y té premium en ambiente boutique, perfecto para caprichos dulces en tardes lluviosas.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>13 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Hönecker+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">La Abuela Goye</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.6 (134 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Heladería tradicional con chocolate caliente casero y tortas artesanales, ambiente familiar nostálgico.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=La+Abuela+Goye+Cariló"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Coffee className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Shopping Section - FIFTH */}
        <section id="compras" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <ShoppingBag className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Compras bajo Techo</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Paseo Aldea</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.4 (320 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Centro comercial cubierto con tiendas de ropa, accesorios, souvenirs y cafeterías, ideal para pasar toda la tarde.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Paseo+Aldea+Cariló"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Mercado del Puerto Cariló</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (185 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Mercado cubierto con productos regionales, artesanías locales y gastronomía en un solo lugar con ambiente bohemio.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Mercado+del+Puerto+Cariló"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Shopping Los Pinos</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.1 (275 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Centro comercial en Pinamar con marcas conocidas, cine, patio de comidas y entretenimiento familiar bajo techo.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>40 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>25 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Shopping+Los+Pinos+Pinamar"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Restaurants Section - LAST */}
        <section id="restaurantes" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <ArrowRight className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Restaurantes</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Don Benito</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ⭐ 4.4 (187 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    <strong>Para:</strong> Experiencia premium con carnes de exportación, ambiente elegante y servicio profesional en una steakhouse de primera clase.
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Don+Benito+Cariló"
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">La Cabrera Cariló</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ⭐ 4.3 (127 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    <strong>Para:</strong> La parrilla de la famosa cadena porteña con su característico show de carnes crudas en mesa y cortes premium como el ojo de bife de 400g que los distingue.
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>18 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>6 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=La+Cabrera+Cariló"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Il Gato Nero</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ⭐ 4.1 (83 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    <strong>Para:</strong> Pizzería con horno a leña y masa madre artesanal, reconocida por sus pizzas de autor y ambiente acogedor perfecto para compartir en días lluviosos.
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Il+Gato+Nero+Cariló"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">De Mi Campo</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ⭐ 4.2 (156 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    <strong>Para:</strong> Especialista en cordero patagónico y empanadas caseras con 12 variedades, destacado por su parrilla a leña y productos directo del productor.
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>16 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=De+Mi+Campo+Cariló"
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-2xl font-bold text-gray-800">Masse</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ⭐ 4.4 (92 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    <strong>Para:</strong> Único restaurante de autor en Cariló con menú degustación estacional, famoso por su lubina en costra de sal y presentaciones que sorprenden.
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>13 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Masse+Restaurante+Cariló"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5" />
                    Ver perfil en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}