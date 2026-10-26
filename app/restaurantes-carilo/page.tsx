import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PlacePhoto } from "@/components/PlacePhoto"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, User, Car, MapPin, Utensils, Coffee, Wine, Clock } from "@/components/icons8-lucide"

export const metadata: Metadata = {
  title: "Restaurantes Cariló 2025 | Gastronomía y Comida en Cariló",
  description: "Descubre los mejores restaurantes, parrillas, pizzerías y cafés en Cariló. Guía completa de gastronomía con reseñas, ubicaciones y especialidades de cada lugar.",
  keywords: "restaurantes Cariló, parrillas Cariló, pizza Cariló, gastronomía Cariló, dónde comer Cariló, cafés Cariló, vida nocturna Cariló",
  openGraph: {
    title: "Restaurantes Cariló 2025 | Gastronomía y Comida en Cariló",
    description: "Descubre los mejores restaurantes, parrillas, pizzerías y cafés en Cariló. Guía completa de gastronomía con reseñas, ubicaciones y especialidades de cada lugar.",
    type: "website",
    url: "https://ilbuco.com.ar/restaurantes-carilo",
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/restaurantes-carilo",
  },
}

export default function RestaurantesCarilo() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Restaurantes Cariló
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Descubrí la mejor gastronomía en Cariló. Desde parrillas tradicionales hasta pizzerías gourmet, 
                cafés artesanales y heladerías premium. <Link href="/que-hacer-en-carilo" className="text-gray-700 no-underline hover:text-gray-900">Una experiencia culinaria</Link> única en el bosque.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-semibold"
                >
                  Reservar una residencia al lado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/que-hacer-en-carilo"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                >
                  Ver Todas las Actividades
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Parrillas y Asados Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <Utensils className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Parrillas y Asados</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/don-benito.webp" 
                      alt="Don Benito Parrilla" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    {/* Price indicator removed as per request */}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Don Benito</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.6 (420 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Experiencia premium con carnes de exportación, ambiente elegante y servicio profesional en una steakhouse de primera clase.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Don+Benito+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/de-mi-campo.jpg" 
                      alt="De Mi Campo Parrilla" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Price indicator removed as per request */}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">De Mi Campo</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (777 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Familias que buscan parrilla tradicional con buffet de ensaladas, área para niños y precios accesibles en ambiente familiar.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>6 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=De+Mi+Campo+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/colorada.png" 
                      alt="La Colorada Parrilla" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Price indicator removed as per request */}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">La Colorada</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (976 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Parrilla de buena calidad a precios atractivos, ubicada estratégicamente en la entrada de Cariló para fácil acceso.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>3 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=La+Colorada+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/la-pulperia.jpg" 
                      alt="La Pulpería Restaurante" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Price indicator removed as per request */}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">La Pulpería</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.0 (259 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Experiencia auténtica de parrilla tradicional con más de 35 años de historia, ambiente familiar y recetas clásicas argentinas.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>17 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=La+Pulper%C3%ADa+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
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

        {/* Pizza & Burgers Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-orange-600 text-lg">🍕</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Pizza & Burgers</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src="/quehacer/gaato-nero.jpg"
                      alt="Il Gatto Nero pizzería napolitana en Cariló"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-base font-semibold px-2 py-1 rounded-full">$$$</div>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Il Gatto Nero</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.7 (890 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> La mejor pizza napolitana de la zona por chefs italianos auténticos, ingredientes premium y técnicas tradicionales.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>16 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/peppe napoli.png" 
                      alt="Pepe Napoli Pizzería" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-base font-semibold px-2 py-1 rounded-full">$$$</div>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Pepe Napoli</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.0 (1,260 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Pizza napolitana de calidad con opciones clásicas y modernas, ambiente acogedor y precios razonables. Amplia carta de pastas y parrilla.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>17 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-base text-gray-600 mb-4">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Abierto hasta las 00:30</span>
                  </div>
                  
                  <a
                    href="https://goo.gl/maps/example"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/impeke.png" 
                      alt="Impeke Burgers" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Impeke Burgers</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (85 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Hamburguesas gourmet con ingredientes frescos en Valeria del Mar, ambiente relajado con carnes premium y opciones vegetarianas.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>25 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>8 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Impeke+Burgers+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src="/quehacer/enris.png" 
                      alt="Enri's Hamburguesas" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Enri's Hamburguesas</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.1 (62 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Hamburguesas caseras con opciones tradicionales y ambiente informal, precios accesibles para toda la familia.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>18 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Enri%27s+Hamburguesas+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
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

        {/* Cafés y Heladerías Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <Coffee className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Cafés y Heladerías</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Panettone</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (145 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Pan fresco y productos de panadería diarios, opción práctica para desayunos y meriendas.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Panettone+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Masse</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (98 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Panes artesanales elegantes con semillas e ingredientes premium, panadería boutique con opciones gourmet.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>17 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Masse+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Lucciano's</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.4 (120 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Helados en el lugar más hermoso de Cariló con ambiente moderno y terraza, experiencia premium.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Lucciano%27s+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Pórtico</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (95 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Helados artesanales con sabores únicos y calidad premium, especialmente su especialidad de dulce de leche.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>16 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=P%C3%B3rtico+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Colonial</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (85 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-base mb-4">
                    <strong>Para:</strong> Helados artesanales de calidad excepcional en Valeria del Mar con sabores clásicos y especiales.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-600 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>22 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>8 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Colonial+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base font-medium"
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

        {/* Vida Nocturna Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <Wine className="w-8 h-8 text-purple-400 mr-3" />
                <h2 className="text-3xl font-bold">Vida Nocturna</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-white">Bar Templeton</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.8 (42 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-base mb-4">
                    <strong>Para:</strong> Música en vivo y ambiente auténtico de bar, conciertos y entretenimiento local en un ambiente único.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-400 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>18 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Bar+Templeton+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-base font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-white">The Garrison</h5>
                    <div className="text-base bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.6 (58 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-base mb-4">
                    <strong>Para:</strong> Café de calidad con selección premium de whisky, perfecto para reuniones de negocios o encuentros sofisticados.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-400 mb-4">
                    <span className="font-medium whitespace-nowrap">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=The+Garrison+Caril%C3%B3"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-base font-medium"
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

        {/* CTA Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Descubrí la Gastronomía de Cariló
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Desde parrillas tradicionales hasta heladerías gourmet, Cariló ofrece una experiencia culinaria única en el bosque. 
                Reservá tu mesa en los mejores restaurantes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-semibold"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Reservar una residencia al lado
                </Link>
                <Link
                  href="/que-hacer-en-carilo"
                  className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                >
                  Ver Todas las Actividades
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