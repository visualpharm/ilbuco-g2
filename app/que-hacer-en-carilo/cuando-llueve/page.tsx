import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Coffee, ShoppingBag, Palette, Heart, Dumbbell, Church, MapPin, User, Car, Gamepad2, Theater } from "lucide-react"

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

        {/* Gastronomic Experiences Section - Moved Up */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Coffee className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Experiencias Gastronómicas</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-3">Restaurantes para Largas Sobremesas</h3>
                    <p className="text-gray-700 mb-4">
                      Días grises son buenos para largas sobremesas. Algunos <Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900">restaurantes</Link> recomendables:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li><Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900"><strong>La Cabrera Cariló</strong></Link> - Carnes, clásico porteño adaptado al bosque</li>
                      <li><Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900"><strong>Masse</strong></Link> - Cocina moderna, ambiente tranquilo. (El nombre proviene del francés "masse", que significa volumen o solidez)</li>
                      <li><Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900"><strong>De Mi Campo</strong></Link> - Casero, informal</li>
                      <li><Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900"><strong>El Gato Nero</strong></Link> - Buen ambiente, carta variada</li>
                      <li><Link href="/restaurantes-carilo" className="text-gray-700 no-underline hover:text-gray-900"><strong>Don Vinito</strong></Link> - Parrilla eficiente, bien ubicada</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Cafés, Té y Chocolate Caliente</h3>
                    <p className="text-gray-700 mb-4">
                      Lluvia y calor interno combinan bien. Los paradores principales (Cozumel, Divisadero, Hemingway y Neruda) 
                      cuentan con áreas cubiertas perfectas para pasar la tarde.
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Cafeterías recomendadas:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• <strong>Dante</strong> - Buena ambientación, café intenso</li>
                        <li>• <strong>Panettone</strong> - Pastelería artesanal y buen café</li>
                        <li>• <strong>Havanna</strong> - Clásico argentino con mesas cómodas para quedarse</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Chocolaterías destacadas:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• <strong>Saka</strong> - Productos artesanales y presentación cuidada</li>
                        <li>• <strong>Hönecker</strong> - Chocolates locales, bombones</li>
                        <li>• <strong>La Abuela Goye</strong> - Tradición patagónica, también tortas y dulces</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture & Entertainment Section - Moved Up */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Palette className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Cultura y Entretenimiento</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">Galería Cariló Arte Contemporáneo</h3>
                  <p className="text-gray-700 mb-4">
                    En el centro de Cariló. Exposiciones rotativas y talleres para adultos y niños en temporada alta.
                    La única galería de arte de Cariló exhibe obras de más de 50 artistas nacionales.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Actividades para niños desde 3 años en vacaciones escolares</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">El Ojo y el Diamante</h3>
                  <p className="text-gray-700 mb-4">
                    Casa/taller artístico en Valeria del Mar con mosaico y vitrofusión. 
                    Atendido por sus artistas. Solo con reserva.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Valeria del Mar - Solo con reserva previa</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">Experiencias Allona</h3>
                  <p className="text-gray-700 mb-4">
                    Recorrido sensorial en Pinamar que combina arte plástico, música, fotografía y degustaciones. 
                    Funciona en la residencia de la artista Jorgelina Allona.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Pinamar - Experiencia inmersiva única</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl font-semibold mb-3">Biblioteca Popular Manuel Belgrano</h3>
                  <p className="text-gray-700 mb-4">
                    En Pinamar (20 min), esta biblioteca cuenta con más de 50,000 libros, 
                    sala de lectura, computadoras con internet y galería de arte.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Medusas 1230, Pinamar - Tel: 02254 485555</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entertainment & Games Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Gamepad2 className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Entretenimiento y Juegos</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Escape Room Pinamar</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (75 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Desafío mental en equipo con la sala temática "Misión Pirata" para 2-6 personas en 60 minutos con niveles de dificultad ajustables.
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Dirección:</strong> De la Sirena 700, esquina Del Buen Orden, Pinamar
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Teléfono:</strong> +54 2254 58-4263
                    </p>
                  </div>
                  
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Center Play</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (110 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Centro de juegos tipo arcade con bowling, pool, metegol, pinballs y más. Local principal en Pinamar y sucursal en Valeria del Mar.
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Ubicaciones:</strong> Av. Bunge (Pinamar) y Valeria del Mar
                    </p>
                  </div>
                  
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
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Teatro Municipal de la Torre</h5>
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Cine Oasis</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 3.8 (90 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Funciones diarias de cine en Pinamar. Instalación modesta con la mayoría de películas dobladas al español.
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Ubicación:</strong> Av. Shaw, Pinamar
                    </p>
                  </div>
                  
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
              </div>
              
              {/* Il Buco Section */}
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Il Buco: Tu Base Perfecta</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Entretenimiento Digital</h4>
                      <p className="text-gray-700 mb-4">
                        Cada habitación tiene Smart TV con suscripciones a Netflix, Disney+ y Max. 
                        Además, hay un sillón grande en el living común, ideal para ver películas o series en grupo.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Juegos de Mesa</h4>
                      <p className="text-gray-700 mb-4">
                        Il Buco cuenta con una pequeña colección de juegos de mesa, ideales para tardes sin salir. 
                        Perfecto para pasar tiempo con otros huéspedes o en familia.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center">
                    <Link
                      href="/contacts"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Reservar tu Refugio contra la Lluvia
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness & Spas Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Heart className="w-8 h-8 text-pink-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Spas y Bienestar</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Cariló Palace Apart Hotel & Spa</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (85 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Experiencia completa de bienestar con sauna, baño finlandés, gimnasio y sala de relajación en ambiente de lujo.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>7 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=Cariló+Palace+Apart+Hotel+Spa+Cariló"
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
                      ⭐ 4.1 (120 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Spa exclusivo con piscina climatizada cubierta, gimnasio, sauna, ducha escocesa y salas de masajes profesionales.
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
                    href="https://maps.google.com/?q=Howard+Johnson+Hotel+Spa+Cariló"
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
                    <h5 className="text-xl font-bold text-gray-800">Cariló Village Hotel</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (95 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Spa familiar con sauna seca, gimnasio completo con hidromasaje y horarios flexibles para toda la familia.
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
                    href="https://maps.google.com/?q=Cariló+Village+Hotel+Spa+Cariló"
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
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

        {/* Fitness Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Dumbbell className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Actividad Física</h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">CIE - Centro de Entrenamiento</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.7 (160 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Entrenamiento completo en gimnasio cubierto rodeado de bosque con pases flexibles e instructores profesionales incluidos.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>17 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://maps.google.com/?q=CIE+Centro+Entrenamiento+Cariló"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
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

        {/* Spiritual Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Church className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Espacios de Recogimiento</h2>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-semibold mb-4">Capilla Nuestra Señora del Perpetuo Socorro</h3>
                <p className="text-gray-700 mb-6">
                  Diseñada por el arquitecto Alberto Vivot, esta capilla fue construida enteramente en madera 
                  y se integra armoniosamente en el bosque. Un espacio de paz y reflexión perfecto para 
                  los días de lluvia.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Horario de Misas:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Lunes a Sábado: 20:00 hs</li>
                      <li>• Domingos: 11:00 hs y 20:00 hs</li>
                      <li>• Festivos: 11:00 hs y 20:00 hs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ubicación:</h4>
                    <p className="text-gray-700">
                      Calle 5 entre Av. Libertador y Av. del Mar, en el corazón del bosque de Cariló.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shopping Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <ShoppingBag className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Compras bajo Techo</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Cariló Mall y Centro Comercial</h3>
                <p className="text-gray-700 mb-6">
                  Centro comercial al aire libre integrado en el bosque con variedad de tiendas que ofrecen 
                  artículos únicos, ropa y diseño de calidad. Estilos arquitectónicos desde ingleses y suizos 
                  hasta concepciones modernas.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Principales Zonas de Compras:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Avenida Divisadero - Boutiques y tiendas especializadas</li>
                      <li>• Avenida Boyero - Artesanías y productos regionales</li>
                      <li>• <Link href="/compras-servicios-carilo" className="text-gray-700 no-underline hover:text-gray-900">Supermercados</Link> con horarios extendidos</li>
                      <li>• Tiendas de diseño y decoración</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Perfecto para Días Lluviosos:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Muchas tiendas con espacios cubiertos</li>
                      <li>• Galerías comerciales techadas</li>
                      <li>• Cafeterías integradas para descansar</li>
                      <li>• Recorridos cortos entre tiendas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                La Lluvia No Detiene la Aventura en Cariló
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Con tantas opciones bajo techo, los días lluviosos pueden ser igual de memorables. 
                Descubrí todo lo que Cariló tiene para ofrecer, sin importar el clima.
              </p>
              <Link
                href="/que-hacer-en-carilo"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Ver Todas las Actividades
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}