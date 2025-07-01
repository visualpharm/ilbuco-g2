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