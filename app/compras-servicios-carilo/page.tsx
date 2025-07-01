import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, User, Car, MapPin, ShoppingBag, Package, Wrench, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Compras y Servicios Cariló 2025 | Supermercados y Tiendas",
  description: "Guía completa de compras y servicios en Cariló. Supermercados, productos frescos, carnicerías, pescaderías, ferreterías y servicios especializados con ubicaciones y horarios.",
  keywords: "compras Cariló, supermercados Cariló, servicios Cariló, tiendas Cariló, productos frescos Cariló, ferretería Cariló, lavandería Cariló",
  openGraph: {
    title: "Compras y Servicios Cariló 2025 | Supermercados y Tiendas",
    description: "Guía completa de compras y servicios en Cariló. Supermercados, productos frescos, carnicerías, pescaderías, ferreterías y servicios especializados con ubicaciones y horarios.",
    type: "website",
    url: "https://ilbuco.com.ar/compras-servicios-carilo",
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/compras-servicios-carilo",
  },
}

export default function ComprasServiciosCarilo() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Compras y Servicios Cariló
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Todo lo que necesitás para tu estadía en Cariló. Desde supermercados y productos frescos hasta 
                servicios especializados. <Link href="/que-hacer-en-carilo" className="text-gray-700 no-underline hover:text-gray-900">Encontrá todo</Link> cerca de Il Buco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                >
                  Consultar Servicios
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

        {/* Supermercados Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Supermercados</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Chicho</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (230 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Compras diarias con los mejores horarios y frutas/verduras de calidad, supermercado local confiable.
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
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">La Proveeduría</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.6 (125 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Productos gourmet premium estilo Whole Foods con opciones saludables como chips de kale en frascos de vidrio.
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
                    href="#"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver perfil en Google Maps
                  </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 md:col-span-2">
                  <div className="mb-4">
                    <h5 className="text-xl font-bold text-gray-800 mb-2">Supermercados en Pinamar</h5>
                    <p className="text-gray-600 text-sm">Para compras grandes con delivery a Cariló</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-semibold text-gray-800">Coto</h6>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          ⭐ 4.1 (1,850 reseñas)
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        Compras grandes con delivery en Cariló, supermercado completo con productos nacionales e importados.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="h-4 w-4" />
                        <span>20 min drive</span>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-semibold text-gray-800">Disco</h6>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          ⭐ 4.2 (1,420 reseñas)
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        Productos premium y orgánicos con delivery, excelente alternativa con selección especializada.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="h-4 w-4" />
                        <span>18 min drive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Frescos Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <Package className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Productos Frescos</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Belén</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (180 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Las mejores frutas y verduras de la zona, seleccionadas diariamente con opciones orgánicas, verdulería de confianza.
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
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">Boutique de Frutas</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.4 (95 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Frutas exóticas y productos gourmet autoservicio, cuidadosamente seleccionados, experiencia premium de frutas.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>16 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">Cabaña Guerrero</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.7 (340 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Carnes premium con excelente selección de cortes especiales y embutidos artesanales, carnicería especializada de alta calidad.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>18 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>6 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">Pescadería La Constanza</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (65 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Pescado fresco (no congelado) incluyendo salmón, merluza y mariscos, pescadería especializada cerrada en temporada baja.
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
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-sm text-amber-800">Cerrado durante temporada baja</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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

        {/* Servicios Especializados Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <Wrench className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Servicios Especializados</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-xl font-bold text-gray-800">Ferretería Jorgito</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.2 (28 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Resolver problemas del hogar, construcción y mantenimiento con herramientas y materiales de calidad.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>13 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">Lavandería Express</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.5 (35 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Mantener la ropa impecable con lavandería, limpieza en seco y tintorería profesional.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>15 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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
                    <h5 className="text-xl font-bold text-gray-800">Química Limpia Maurito</h5>
                    <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      ⭐ 4.3 (22 reseñas)
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Para:</strong> Productos de limpieza al por mayor con entrega semanal en Cariló.
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distancia desde Il Buco:</span>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>20 min</span>
                    </div>
                  </div>
                  
                  <a
                    href="#"
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

        {/* Servicios Bancarios Section */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Servicios Bancarios</h2>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-red-800 mb-2">⚠️ No Disponible en Cariló</h3>
                  <p className="text-gray-700">
                    Los servicios bancarios no están disponibles en Cariló. Es necesario viajar a ciudades cercanas.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Pinamar (20 min en auto)</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Banco Macro</li>
                      <li>• Banco Galicia</li>
                      <li>• Banco Provincia</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Villa Gesell (45 min en auto)</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Banco Santander</li>
                      <li>• Cajeros automáticos</li>
                      <li>• Servicios completos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Recomendación:</strong> Planificar retiros de efectivo antes del viaje o durante visitas a Pinamar para otras compras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cariló Mall y Centro Comercial Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M 25 1 C 19.466667 1 15 5.4666667 15 11 L 15 13 L 7.1074219 13 L 7.0058594 13.886719 L 2.8789062 50 L 15.832031 50 A 1.0001 1.0001 0 0 0 16.158203 50 L 24.832031 50 A 1.0001 1.0001 0 0 0 25.158203 50 L 33.832031 50 A 1.0001 1.0001 0 0 0 34.158203 50 L 47.121094 50 L 42.892578 13 L 35 13 L 35 11 C 35 5.4666667 30.533333 1 25 1 z M 25 3 C 29.466667 3 33 6.5333333 33 11 L 33 13 L 17 13 L 17 11 C 17 6.5333333 20.533333 3 25 3 z M 8.8925781 15 L 15 15 L 15 17.271484 A 2 2 0 0 0 14 19 A 2 2 0 0 0 16 21 A 2 2 0 0 0 18 19 A 2 2 0 0 0 17 17.269531 L 17 15 L 33 15 L 33 17.271484 A 2 2 0 0 0 32 19 A 2 2 0 0 0 34 21 A 2 2 0 0 0 36 19 A 2 2 0 0 0 35 17.269531 L 35 15 L 41.107422 15 L 44.878906 48 L 35 48 L 35 32 L 25.154297 32 A 1.0001 1.0001 0 0 0 24.984375 31.986328 A 1.0001 1.0001 0 0 0 24.839844 32 L 15 32 L 15 48 L 5.1210938 48 L 8.8925781 15 z M 17 34 L 24 34 L 24 48 L 17 48 L 17 34 z M 26 34 L 33 34 L 33 48 L 26 48 L 26 34 z M 21 40 A 1 1 0 0 0 20 41 A 1 1 0 0 0 21 42 A 1 1 0 0 0 22 41 A 1 1 0 0 0 21 40 z M 29 40 A 1 1 0 0 0 28 41 A 1 1 0 0 0 29 42 A 1 1 0 0 0 30 41 A 1 1 0 0 0 29 40 z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Cariló Mall y Centro Comercial</h2>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
                  Centro comercial al aire libre integrado en el bosque con variedad de tiendas que ofrecen 
                  artículos únicos, ropa y diseño de calidad. Estilos arquitectónicos desde ingleses y suizos hasta 
                  concepciones modernas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Principales Zonas de Compras:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-amber-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 4 6 L 4 12 C 3.9375 12.308594 3 16.839844 3 19.5 C 3 20.878906 3.269531 22.195313 4 23.25 L 4 48 L 46 48 L 46 23.25 C 46.730469 22.195313 47 20.878906 47 19.5 C 47 16.867188 46.082031 12.464844 46 12.0625 C 46 12.042969 46 12.019531 46 12 L 46 6 Z M 6 8 L 44 8 L 44 11 L 39.1875 11 C 39.054688 10.972656 38.914063 10.972656 38.78125 11 L 32.21875 11 C 32.117188 10.972656 32.011719 10.960938 31.90625 10.96875 C 31.875 10.976563 31.84375 10.988281 31.8125 11 L 25.21875 11 C 25.117188 10.972656 25.011719 10.960938 24.90625 10.96875 C 24.875 10.976563 24.84375 10.988281 24.8125 11 L 18.21875 11 C 18.117188 10.972656 18.011719 10.960938 17.90625 10.96875 C 17.875 10.976563 17.84375 10.988281 17.8125 11 L 11.21875 11 C 11.117188 10.972656 11.011719 10.960938 10.90625 10.96875 C 10.875 10.976563 10.84375 10.988281 10.8125 11 L 6 11 Z M 5.875 13 L 10 13 L 10 21.875 C 9.359375 22.550781 8.496094 23 7.5 23 C 6.726563 23 6.238281 22.804688 5.875 22.4375 C 5.8125 22.316406 5.730469 22.210938 5.625 22.125 C 5.226563 21.550781 5 20.605469 5 19.5 C 5 17.527344 5.703125 13.917969 5.875 13 Z M 12 13 L 17 13 L 17 21.875 C 16.359375 22.550781 15.496094 23 14.5 23 C 13.503906 23 12.640625 22.550781 12 21.875 Z M 19 13 L 24 13 L 24 21.875 C 23.359375 22.550781 22.496094 23 21.5 23 C 20.503906 23 19.640625 22.550781 19 21.875 Z M 26 13 L 31 13 L 31 21.90625 C 30.363281 22.574219 29.492188 23 28.5 23 C 27.503906 23 26.640625 22.550781 26 21.875 Z M 33 13 L 38 13 L 38 21.90625 C 37.363281 22.574219 36.492188 23 35.5 23 C 34.507813 23 33.636719 22.574219 33 21.90625 Z M 40 13 L 44.125 13 C 44.296875 13.917969 45 17.527344 45 19.5 C 45 20.484375 44.820313 21.324219 44.5 21.90625 C 44.265625 22.042969 44.097656 22.269531 44.03125 22.53125 C 43.679688 22.839844 43.207031 23 42.5 23 C 41.507813 23 40.636719 22.574219 40 21.90625 Z M 32 23.53125 C 32.960938 24.371094 34.121094 25 35.5 25 C 36.878906 25 38.039063 24.371094 39 23.53125 C 39.960938 24.371094 41.121094 25 42.5 25 C 43.03125 25 43.542969 24.90625 44 24.75 L 44 46 L 41 46 L 41 28 L 30 28 L 30 46 L 6 46 L 6 24.75 C 6.457031 24.90625 6.96875 25 7.5 25 C 8.875 25 10.039063 24.398438 11 23.5625 C 11.960938 24.398438 13.125 25 14.5 25 C 15.875 25 17.039063 24.398438 18 23.5625 C 18.960938 24.398438 20.125 25 21.5 25 C 22.875 25 24.039063 24.398438 25 23.5625 C 25.960938 24.398438 27.125 25 28.5 25 C 29.878906 25 31.039063 24.371094 32 23.53125 Z M 9 28 L 9 43 L 27 43 L 27 28 Z M 11 30 L 25 30 L 25 41 L 11 41 Z M 32 30 L 39 30 L 39 46 L 32 46 Z"/>
                      </svg>
                      <span className="text-gray-700">Avenida Divisadero - Boutiques y tiendas especializadas</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-orange-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 22 3 A 1.0001 1.0001 0 1 0 22 5 C 22 5 22.291248 5.013788 22.552734 5.1445312 C 22.723611 5.2299695 22.856141 5.3001887 22.931641 5.5136719 C 18.799697 6.9016751 15.698211 8.9272363 14.027344 10.193359 C 12.940344 11.016359 13.014437 12.677594 14.148438 13.433594 C 14.999437 14.000594 16 14 16 14 L 16.466797 14 C 16.369138 15.192362 16.444802 16.579806 16.800781 18.189453 C 16.390781 18.719453 16.009375 19.570234 16.109375 20.740234 C 16.399375 22.890234 17.220625 23.780391 17.890625 24.150391 C 18.200625 25.900391 19.050391 27.83 19.900391 28.75 L 19.900391 32.310547 C 19.290391 33.680547 17.299766 34.480391 15.009766 35.400391 C 11.139766 36.940391 6.34 38.869219 6 44.949219 L 5.9394531 46 L 28.609375 46 C 28.289375 45.32 28.099297 44.64 28.029297 44 L 8.1191406 44 C 8.8491406 40.01 12.35 38.61 15.75 37.25 C 17.762573 36.444971 19.69082 35.672465 20.890625 34.375 C 21.208816 34.670334 21.588616 34.919563 21.992188 35.126953 C 23.070626 35.681151 24.457143 36 26 36 C 27.554762 36 28.946074 35.6495 30.017578 35.083984 C 30.393642 34.885506 30.746717 34.655682 31.050781 34.390625 C 31.500572 34.863086 32.044954 35.268976 32.660156 35.630859 C 33.010156 35.170859 33.200859 34.330781 33.130859 33.550781 C 32.620859 33.190781 32.22 32.780781 32 32.300781 L 32 28.75 C 32.85 27.83 33.69 25.919687 34 24.179688 C 34.71 23.829687 35.590781 22.939688 35.800781 20.679688 C 35.890781 19.559687 35.580391 18.729219 35.150391 18.199219 C 35.51303 17.053609 35.835957 15.558546 35.970703 14 L 36 14 C 36 14 37.632 9.265 37 8 C 36 6 32.592 4 32 4 C 29.396719 4 26.98847 4.3761116 24.8125 4.9511719 C 24.530816 4.1744402 23.972496 3.6180839 23.447266 3.3554688 C 22.708752 2.9862117 22 3 22 3 z M 31.740234 6.0019531 C 32.550234 6.3509531 34.515484 7.6973906 35.146484 8.7753906 C 35.183484 9.2923906 34.92325 10.619 34.53125 12 L 16.03125 12 C 15.91425 11.996 15.522375 11.945109 15.234375 11.787109 C 17.506375 10.065109 23.631234 6.0859531 31.740234 6.0019531 z M 18.484375 14 L 33.960938 14 C 33.809597 15.549746 33.455563 17.065632 33.060547 18.160156 L 32.740234 18.990234 L 33.529297 19.380859 C 33.619297 19.450859 33.860781 19.789766 33.800781 20.509766 C 33.670781 21.989766 33.199609 22.380391 33.099609 22.400391 L 32.189453 22.400391 L 32.099609 23.310547 C 31.919609 25.200547 30.86 27.159688 30.5 27.429688 L 30 27.720703 L 30 32.5 C 30 32.48889 29.81248 32.931922 29.083984 33.316406 C 28.355488 33.70089 27.245238 34 26 34 C 24.742857 34 23.627812 33.718459 22.90625 33.347656 C 22.184688 32.976854 22 32.585897 22 32.5 A 1.0001 1.0001 0 0 0 21.900391 32.054688 L 21.900391 28.300781 L 21.919922 27.730469 L 21.419922 27.439453 C 21.039922 27.159453 19.980781 25.200547 19.800781 23.310547 L 19.779297 22.410156 L 18.869141 22.410156 C 18.729141 22.350156 18.279609 21.879531 18.099609 20.519531 C 18.089609 20.459531 18.089844 20.399844 18.089844 20.339844 C 18.089844 19.629844 18.460937 19.330078 18.460938 19.330078 L 19.039062 18.939453 L 18.869141 18.25 C 18.468111 16.685198 18.351008 15.263569 18.484375 14 z M 39.283203 28 C 36.871203 28.043 34.631609 29.5945 35.099609 33.1875 C 35.305609 34.7655 34.829656 36.615188 33.597656 37.492188 C 32.202656 38.485188 29.975 39.846359 30 43.443359 C 30 45.582359 32.649281 50 39.863281 50 C 44.593281 50 49.998047 47.274125 49.998047 39.578125 C 49.998047 33.990125 45.800906 28 39.378906 28 L 39.283203 28 z M 39.283203 30 L 39.378906 30 C 44.535906 30 47.998047 34.952125 47.998047 39.578125 C 47.998047 47.392125 41.771281 48 39.863281 48 C 33.936281 48 32 44.610688 32 43.429688 C 31.984 41.073687 33.213625 40.209922 34.515625 39.294922 L 34.757812 39.123047 C 36.874812 37.617047 37.332031 34.845688 37.082031 32.929688 C 36.992031 32.240687 36.993859 31.295172 37.505859 30.701172 C 38.014859 30.110172 38.860203 30.008 39.283203 30 z M 41 32 A 2 2 0 0 0 41 36 A 2 2 0 0 0 41 32 z M 44.5 38 C 43.672 38 43 38.672 43 39.5 C 43 40.328 43.672 41 44.5 41 C 45.328 41 46 40.328 46 39.5 C 46 38.672 45.328 38 44.5 38 z M 35.5 42 C 34.672 42 34 42.672 34 43.5 C 34 44.328 34.672 45 35.5 45 C 36.328 45 37 44.328 37 43.5 C 37 42.672 36.328 42 35.5 42 z M 43.5 42 C 42.672 42 42 42.672 42 43.5 C 42 44.328 42.672 45 43.5 45 C 44.328 45 45 44.328 45 43.5 C 45 42.672 44.328 42 43.5 42 z M 39.5 44 C 38.672 44 38 44.672 38 45.5 C 38 46.328 38.672 47 39.5 47 C 40.328 47 41 46.328 41 45.5 C 41 44.672 40.328 44 39.5 44 z"/>
                      </svg>
                      <span className="text-gray-700">Avenida Boyero - Artesanías y productos regionales</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 24.964844 0 A 1.0001 1.0001 0 0 0 24.382812 0.21289062 L 1.3828125 18.212891 A 1.0002305 1.0002305 0 1 0 2.6171875 19.787109 L 4 18.705078 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 18.705078 L 47.382812 19.787109 A 1.0002308 1.0002308 0 1 0 48.617188 18.212891 L 45.632812 15.878906 L 25.617188 0.21289062 A 1.0001 1.0001 0 0 0 24.964844 0 z M 25 2.2695312 L 44 17.138672 L 44 44 L 6 44 L 6 17.138672 L 25 2.2695312 z M 10.5 16 A 1.5 1.5 0 0 0 10.5 19 A 1.5 1.5 0 0 0 11.914062 17.994141 L 14.453125 17.994141 C 15.015404 17.994141 15.202209 18.091761 15.341797 18.214844 C 15.479965 18.336679 15.642734 18.607012 15.800781 19.125 L 19.855469 35.230469 A 0.99359934 0.99359934 0 0 0 19.859375 35.244141 C 20.013407 35.820373 20.159734 36.483913 20.6875 37.080078 C 20.866201 37.281939 21.095938 37.439656 21.345703 37.576172 C 21.117457 38.024022 21 38.512845 21 39 C 21 39.722222 21.235347 40.457881 21.751953 41.039062 C 22.268559 41.620244 23.083334 42 24 42 C 24.916666 42 25.731441 41.620244 26.248047 41.039062 C 26.764653 40.457881 27 39.722222 27 39 C 27 38.661498 26.944064 38.321257 26.835938 37.994141 L 29.164062 37.994141 C 29.055936 38.321257 29 38.661498 29 39 C 29 39.722222 29.235347 40.457881 29.751953 41.039062 C 30.268559 41.620244 31.083334 42 32 42 C 32.916666 42 33.731441 41.620244 34.248047 41.039062 C 34.764653 40.457881 35 39.722222 35 39 C 35 38.277778 34.764653 37.542119 34.248047 36.960938 C 33.731441 36.379756 32.916666 36 32 36 C 31.980509 36 31.962756 36.005518 31.943359 36.005859 L 24.056641 36.005859 C 24.037244 36.005518 24.019491 36 24 36 C 23.980509 36 23.962756 36.005518 23.943359 36.005859 L 23.117188 36.005859 C 22.413746 36.005859 22.284562 35.888757 22.173828 35.763672 C 22.064513 35.640189 21.93181 35.296055 21.783203 34.744141 L 21.78125 34.734375 C 21.780657 34.732175 21.779897 34.732669 21.779297 34.730469 L 21.59375 33.994141 L 31.990234 33.994141 A 0.99359934 0.99359934 0 0 0 32.914062 33.365234 L 36.861328 23.365234 A 0.99359934 0.99359934 0 0 0 35.9375 22.005859 L 18.574219 22.005859 L 17.71875 18.605469 A 0.99359934 0.99359934 0 0 0 17.707031 18.560547 C 17.500654 17.877134 17.220912 17.222522 16.65625 16.724609 C 16.091588 16.226697 15.311846 16.005859 14.453125 16.005859 L 10.740234 16.005859 A 0.994141 0.994141 0 0 0 10.658203 16.009766 A 1.5 1.5 0 0 0 10.5 16 z M 19.076172 23.994141 L 34.476562 23.994141 L 31.314453 32.005859 L 21.09375 32.005859 L 19.076172 23.994141 z M 24 38 C 24.416666 38 24.601893 38.120244 24.751953 38.289062 C 24.902014 38.457881 25 38.722222 25 39 C 25 39.277778 24.90201 39.542119 24.751953 39.710938 C 24.601893 39.879756 24.416666 40 24 40 C 23.583334 40 23.398107 39.879756 23.248047 39.710938 C 23.097986 39.542119 23 39.277778 23 39 C 23 38.722222 23.097986 38.457881 23.248047 38.289062 C 23.398107 38.120244 23.583334 38 24 38 z M 32 38 C 32.416666 38 32.601893 38.120244 32.751953 38.289062 C 32.902014 38.457881 33 38.722222 33 39 C 33 39.277778 32.90201 39.542119 32.751953 39.710938 C 32.601893 39.879756 32.416666 40 32 40 C 31.583334 40 31.398107 39.879756 31.248047 39.710938 C 31.097986 39.542119 31 39.277778 31 39 C 31 38.722222 31.097986 38.457881 31.248047 38.289062 C 31.398107 38.120244 31.583334 38 32 38 z"/>
                      </svg>
                      <span className="text-gray-700">Supermercados con horarios extendidos</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 9.9375 0.53125 L 9.21875 1.21875 L 1.21875 9.21875 L 0.53125 9.9375 L 1.21875 10.65625 L 16.84375 26.28125 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 44.660156 1.535156 41.589844 1.539063 39.6875 3.4375 L 26.28125 16.84375 L 10.65625 1.21875 Z M 9.9375 3.375 L 11.5625 5 L 10.28125 6.28125 L 11.71875 7.71875 L 13 6.4375 L 14.5625 8 L 12.28125 10.28125 L 13.71875 11.71875 L 16 9.4375 L 17.5625 11 L 16.28125 12.28125 L 17.71875 13.71875 L 19 12.4375 L 20.5625 14 L 18.28125 16.28125 L 19.71875 17.71875 L 22 15.4375 L 23.5625 17 L 22.28125 18.28125 L 23.5625 19.5625 L 18.28125 24.84375 L 3.375 9.9375 Z M 40.28125 5.65625 L 44.34375 9.71875 L 9.96875 44.09375 L 5.90625 40.03125 Z M 34 24.59375 L 33.28125 25.28125 L 31.28125 27.28125 L 32.71875 28.71875 L 34 27.4375 L 35.5625 29 L 33.28125 31.28125 L 34.71875 32.71875 L 37 30.4375 L 38.5625 32 L 37.28125 33.28125 L 38.71875 34.71875 L 40 33.4375 L 41.5625 35 L 39.28125 37.28125 L 40.71875 38.71875 L 43 36.4375 L 44.5625 38 L 43.28125 39.28125 L 44.71875 40.71875 L 46 39.4375 L 46.625 40.0625 L 40.0625 46.625 L 26 32.59375 L 24.59375 34 L 39.34375 48.78125 L 40.0625 49.46875 L 40.78125 48.78125 L 48.78125 40.78125 L 49.46875 40.0625 L 48.78125 39.34375 Z"/>
                      </svg>
                      <span className="text-gray-700">Tiendas de diseño y decoración</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Perfecto para Días Lluviosos:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 24.90625 -0.03125 C 24.863281 -0.0234375 24.820313 -0.0117188 24.78125 0 C 24.316406 0.105469 23.988281 0.523438 24 1 L 24 4.03125 C 11.3125 4.472656 1 13.210938 1 26 C 1.003906 26.445313 1.296875 26.832031 1.722656 26.957031 C 2.148438 27.078125 2.605469 26.90625 2.84375 26.53125 C 2.84375 26.53125 5.035156 23 10 23 C 12.777344 23 15.21875 24.417969 16.65625 26.5625 C 16.839844 26.832031 17.144531 26.996094 17.46875 27 L 17.53125 27 C 17.855469 26.996094 18.160156 26.832031 18.34375 26.5625 C 19.605469 24.679688 21.636719 23.355469 24 23.0625 L 24 43 C 24 45.773438 21.773438 48 19 48 C 16.226563 48 14 45.773438 14 43 C 14.003906 42.640625 13.816406 42.304688 13.503906 42.121094 C 13.191406 41.941406 12.808594 41.941406 12.496094 42.121094 C 12.183594 42.304688 11.996094 42.640625 12 43 C 12 46.855469 15.148438 50 19 50 C 22.851563 50 26 46.855469 26 43 L 26 23.0625 C 28.363281 23.355469 30.394531 24.679688 31.65625 26.5625 C 31.839844 26.832031 32.144531 26.996094 32.46875 27 L 32.53125 27 C 32.855469 26.996094 33.160156 26.832031 33.34375 26.5625 C 34.78125 24.417969 37.21875 23 40 23 C 43.960938 23 47.25 26.65625 47.25 26.65625 C 47.523438 26.96875 47.960938 27.078125 48.351563 26.929688 C 48.738281 26.785156 48.996094 26.414063 49 26 C 48.996094 13.210938 38.6875 4.472656 26 4.03125 L 26 1 C 26.011719 0.710938 25.894531 0.433594 25.6875 0.238281 C 25.476563 0.0390625 25.191406 -0.0585938 24.90625 -0.03125 Z M 25 6 C 36.40625 6 45.515625 12.945313 46.75 23.59375 C 45.207031 22.351563 43.039063 21 40 21 C 36.988281 21 34.332031 22.386719 32.5 24.5 C 30.667969 22.386719 28.011719 21 25 21 C 21.988281 21 19.332031 22.386719 17.5 24.5 C 15.667969 22.386719 13.011719 21 10 21 C 6.945313 21 4.746094 22.136719 3.28125 23.28125 C 4.652344 12.808594 13.707031 6 25 6 Z"/>
                      </svg>
                      <span className="text-gray-700">Muchas tiendas con espacios cubiertos</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 25 1 C 19.466667 1 15 5.4666667 15 11 L 15 13 L 7.1074219 13 L 7.0058594 13.886719 L 2.8789062 50 L 15.832031 50 A 1.0001 1.0001 0 0 0 16.158203 50 L 24.832031 50 A 1.0001 1.0001 0 0 0 25.158203 50 L 33.832031 50 A 1.0001 1.0001 0 0 0 34.158203 50 L 47.121094 50 L 42.892578 13 L 35 13 L 35 11 C 35 5.4666667 30.533333 1 25 1 z M 25 3 C 29.466667 3 33 6.5333333 33 11 L 33 13 L 17 13 L 17 11 C 17 6.5333333 20.533333 3 25 3 z M 8.8925781 15 L 15 15 L 15 17.271484 A 2 2 0 0 0 14 19 A 2 2 0 0 0 16 21 A 2 2 0 0 0 18 19 A 2 2 0 0 0 17 17.269531 L 17 15 L 33 15 L 33 17.271484 A 2 2 0 0 0 32 19 A 2 2 0 0 0 34 21 A 2 2 0 0 0 36 19 A 2 2 0 0 0 35 17.269531 L 35 15 L 41.107422 15 L 44.878906 48 L 35 48 L 35 32 L 25.154297 32 A 1.0001 1.0001 0 0 0 24.984375 31.986328 A 1.0001 1.0001 0 0 0 24.839844 32 L 15 32 L 15 48 L 5.1210938 48 L 8.8925781 15 z M 17 34 L 24 34 L 24 48 L 17 48 L 17 34 z M 26 34 L 33 34 L 33 48 L 26 48 L 26 34 z M 21 40 A 1 1 0 0 0 20 41 A 1 1 0 0 0 21 42 A 1 1 0 0 0 22 41 A 1 1 0 0 0 21 40 z M 29 40 A 1 1 0 0 0 28 41 A 1 1 0 0 0 29 42 A 1 1 0 0 0 30 41 A 1 1 0 0 0 29 40 z"/>
                      </svg>
                      <span className="text-gray-700">Galerías comerciales techadas</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-amber-600 mr-3" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M 17.533203 3 C 13.752129 3 10.118563 5.2660221 7.4394531 8.78125 C 4.7603429 12.296478 3 17.10763 3 22.435547 C 3 32.035891 8.6386101 40.08334 15.306641 41.642578 C 15.774758 42.479614 16.352788 43.255155 17.048828 43.951172 C 19.849214 46.75146 23.934969 47.673933 28.140625 46.990234 C 32.346281 46.306534 36.729929 44.043636 40.386719 40.386719 C 44.043509 36.729801 46.306681 32.346304 46.990234 28.140625 C 47.673787 23.934944 46.751558 19.849117 43.951172 17.048828 C 41.150786 14.24854 37.065031 13.326067 32.859375 14.009766 C 32.134809 14.127556 31.404319 14.308962 30.673828 14.519531 C 28.288777 7.7908432 23.089613 3 17.533203 3 z M 17.533203 5 C 21.896055 5 26.601456 9.0598344 28.78125 15.169922 C 25.91267 16.309587 23.09519 18.131286 20.613281 20.613281 C 16.956491 24.270199 14.693319 28.653696 14.009766 32.859375 C 13.650431 35.070246 13.748804 37.241276 14.316406 39.216797 C 9.4609224 37.111665 5 30.444703 5 22.435547 C 5 17.550464 6.6308602 13.143663 9.03125 9.9941406 C 11.43164 6.8446185 14.564277 5 17.533203 5 z M 16.980469 6.9882812 A 1.0001 1.0001 0 0 0 16.167969 7.4453125 C 16.167969 7.4453125 14 10.555556 14 14 C 14 16.183956 14.512685 19.070661 16.167969 21.554688 A 1.0001 1.0001 0 1 0 17.832031 20.445312 C 16.475315 18.409339 16 15.858044 16 14 C 16 11.444444 17.832031 8.5546875 17.832031 8.5546875 A 1.0001 1.0001 0 0 0 16.980469 6.9882812 z M 35.896484 15.796875 C 38.520529 15.876809 40.8347 16.760541 42.537109 18.462891 C 44.806989 20.732691 45.621778 24.088892 45.015625 27.818359 C 44.409472 31.547825 42.354167 35.591026 38.972656 38.972656 C 35.591144 42.354286 31.549757 44.409342 27.820312 45.015625 C 24.090867 45.621908 20.732771 44.806908 18.462891 42.537109 C 17.88007 41.95431 17.397463 41.298079 17.005859 40.583984 A 1.0001 1.0001 0 0 0 16.808594 40.167969 C 15.845226 38.175484 15.563048 35.773932 15.984375 33.181641 C 16.590528 29.452175 18.645833 25.408974 22.027344 22.027344 C 25.408856 18.645714 29.450243 16.590658 33.179688 15.984375 C 34.112049 15.832804 35.021803 15.77023 35.896484 15.796875 z M 40.984375 20.003906 A 1.0001 1.0001 0 0 0 40 21.017578 C 40 23.69058 37.939448 27.827603 30.378906 29.638672 C 25.633947 30.773381 22.958165 32.708738 21.542969 34.882812 C 20.127772 37.056888 20.021484 39.356875 20.021484 41 A 1.0001 1.0001 0 1 0 22.021484 41 C 22.021484 39.446125 22.129447 37.648035 23.21875 35.974609 C 24.308053 34.301183 26.426709 32.640275 30.84375 31.583984 C 39.013208 29.627054 42 24.742576 42 21.017578 A 1.0001 1.0001 0 0 0 40.984375 20.003906 z"/>
                      </svg>
                      <span className="text-gray-700">Cafeterías integradas para descansar</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">Recorridos cortos entre tiendas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>Ubicación estratégica:</strong> El centro comercial está perfectamente integrado en el bosque 
                  de pinos, ofreciendo una experiencia de compras única donde la naturaleza y el comercio se combinan 
                  armoniosamente.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Car className="h-4 w-4 mr-1" />
                  <span>Desde Il Buco: 15 min caminando, 3 min en auto</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Todo lo que Necesitás en Cariló
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Desde supermercados locales hasta servicios especializados, encontrás todo cerca de Il Buco. 
                Compras fáciles para una estadía perfecta en el bosque.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Consultar Servicios
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