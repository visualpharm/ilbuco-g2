import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Car, MapPin, Camera, Waves, TreePine, Heart, Clock, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Alrededores de Cariló 2025 | Qué Visitar Cerca de Cariló",
  description: "Descubre los mejores lugares cerca de Cariló: Pinamar, Valeria del Mar, Mar de las Pampas, Faro Querandí y más. Guía completa de excursiones y actividades en los alrededores.",
  keywords: "alrededores Cariló, qué visitar cerca Cariló, Pinamar desde Cariló, Mar de las Pampas, Valeria del Mar, Faro Querandí, excursiones Cariló",
  openGraph: {
    title: "Alrededores de Cariló 2025 | Qué Visitar Cerca de Cariló",
    description: "Descubre los mejores lugares cerca de Cariló: Pinamar, Valeria del Mar, Mar de las Pampas, Faro Querandí y más. Guía completa de excursiones y actividades en los alrededores.",
    type: "website",
    url: "https://ilbuco.com.ar/alrededores-carilo",
  },
  alternates: {
    canonical: "https://ilbuco.com.ar/alrededores-carilo",
  },
}

export default function AlrededoresCarilo() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Alrededores de Cariló
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Explorá los tesoros que rodean Cariló. Desde la vibrante Pinamar hasta el bohemio Mar de las Pampas, 
                faros históricos y retiros de bienestar. <Link href="/que-hacer-en-carilo" className="text-gray-700 no-underline hover:text-gray-900">Descubrí</Link> la costa atlántica argentina.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Planificar Excursiones
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/que-hacer-en-carilo"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                >
                  Ver Actividades en Cariló
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pinamar Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Pinamar</h2>
                    <div className="ml-4 flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      <span>20 min</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    La ciudad principal con todos los servicios gubernamentales, financieros y comerciales. 
                    Centro neurálgico de la costa con amplia oferta gastronómica y de entretenimiento.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Servicios Esenciales</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Servicios bancarios completos (Macro, Galicia, Provincia)</li>
                        <li>• Oficinas gubernamentales y trámites</li>
                        <li>• Supermercados grandes con delivery</li>
                        <li>• Centros médicos y farmacias</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Actividades Destacadas</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Sand Masters - Escuela de 4x4</li>
                        <li>• Centro comercial y shopping</li>
                        <li>• Amplia oferta gastronómica</li>
                        <li>• Vida nocturna y entretenimiento</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Placeholder for Pinamar image */}
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                    <span className="text-gray-500">Imagen de Pinamar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeria del Mar Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  {/* Placeholder for Valeria del Mar image */}
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                    <span className="text-gray-500">Imagen de Valeria del Mar</span>
                  </div>
                </div>
                
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                      <Waves className="h-6 w-6 text-teal-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Valeria del Mar</h2>
                    <div className="ml-4 flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      <span>10 min</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    Pueblo costero con calle principal que concentra todos los servicios esenciales. 
                    Ambiente tranquilo y familiar, perfecto para paseos y compras locales.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Destacados Gastronómicos</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Impeke Burgers - Hamburguesas gourmet</li>
                        <li>• Colonial - Heladería artesanal de calidad excepcional</li>
                        <li>• Cafés y restaurantes familiares</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Arte y Cultura</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Fusion Arte del Mar - Taller de cerámica</li>
                        <li>• Tiendas de artesanías locales</li>
                        <li>• Galerías de arte costero</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mar de las Pampas Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                      <TreePine className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Mar de las Pampas</h2>
                    <div className="ml-4 flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      <span>25 min</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    El único lugar en el mundo similar a Cariló, pero con lotes más pequeños y mayor densidad. 
                    Ambiente bohemio con negocios muy interesantes y arquitectura única.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Experiencia Bohemia</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Arquitectura bohemia y única</li>
                        <li>• Negocios artesanales y conceptuales</li>
                        <li>• Gastronomía gourmet y alternativa</li>
                        <li>• Mayor concentración de servicios</li>
                      </ul>
                    </div>
                    
                    <div className="bg-rose-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Cultura y Eventos</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Festival de música clásica anual</li>
                        <li>• Talleres de arte y artesanías</li>
                        <li>• Mercados de diseño local</li>
                        <li>• Espacios culturales alternativos</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  {/* Placeholder for Mar de las Pampas image */}
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                    <span className="text-gray-500">Imagen de Mar de las Pampas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faro Querandí Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  {/* Placeholder for Faro Querandí image */}
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                    <span className="text-gray-500">Imagen del Faro Querandí</span>
                  </div>
                </div>
                
                <div className="order-1 md:order-2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <Camera className="h-6 w-6 text-orange-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Faro Querandí</h2>
                    <div className="ml-4 flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      <span>35 min</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    Faro histórico con vistas panorámicas del océano. Destino perfecto para fotografías 
                    y contacto con la historia marítima de la región.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Atractivos Principales</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Faro histórico (no se puede subir)</li>
                        <li>• Vistas panorámicas del océano</li>
                        <li>• Lugar perfecto para fotografías</li>
                        <li>• Historia marítima de la región</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Actividades Especiales</h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Sandboard en dunas circundantes</li>
                        <li>• Senderismo por la costa</li>
                        <li>• Observación de aves marinas</li>
                        <li>• Atardeceres espectaculares</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recharge Retreat Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Recharge Retreat</h2>
                <div className="ml-4 flex items-center text-sm text-gray-600">
                  <Car className="h-4 w-4 mr-1" />
                  <span>30 min</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-8">
                Centro de bienestar y retiros espirituales especializado en desconexión digital 
                y reconexión con la naturaleza. Una experiencia transformadora en la costa atlántica.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Programas de Bienestar</h4>
                  <ul className="text-gray-700 text-sm space-y-2 text-left">
                    <li>• Retiros de desconexión digital</li>
                    <li>• Meditación y mindfulness</li>
                    <li>• Yoga frente al mar</li>
                    <li>• Terapias holísticas</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">Actividades en Naturaleza</h4>
                  <ul className="text-gray-700 text-sm space-y-2 text-left">
                    <li>• Caminatas conscientes por el bosque</li>
                    <li>• Baños de bosque (forest bathing)</li>
                    <li>• Observación de vida silvestre</li>
                    <li>• Talleres de conexión con la naturaleza</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  <strong>Perfecto para:</strong> Ejecutivos estresados, personas que buscan equilibrio digital, 
                  y quienes desean una experiencia de bienestar integral en contacto con la naturaleza.
                </p>
                <a
                  href="https://recharge.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Visitar recharge.com.ar
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa de Distancias Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-12">
                <Clock className="w-8 h-8 text-blue-400 mr-3" />
                <h2 className="text-3xl font-bold">Distancias desde Il Buco</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-blue-400 mb-2">Valeria del Mar</h4>
                  <div className="flex items-center justify-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-2xl font-bold">10 min</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-blue-400 mb-2">Pinamar</h4>
                  <div className="flex items-center justify-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-2xl font-bold">20 min</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-blue-400 mb-2">Mar de las Pampas</h4>
                  <div className="flex items-center justify-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-2xl font-bold">25 min</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-blue-400 mb-2">Faro Querandí</h4>
                  <div className="flex items-center justify-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-2xl font-bold">35 min</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-300">
                  <strong>Tip de exploración:</strong> Todos estos destinos son perfectos para excursiones de medio día 
                  desde Il Buco. Combiná varios lugares en una jornada o dedica tiempo completo a cada uno 
                  para una experiencia más profunda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Explorá los Alrededores de Cariló
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                Desde pueblos bohemios hasta faros históricos, la costa atlántica argentina ofrece 
                experiencias únicas a pocos minutos de Il Buco. Planificá tus excursiones perfectas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacts"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Planificar Excursiones
                </Link>
                <Link
                  href="/que-hacer-en-carilo"
                  className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                >
                  Ver Actividades en Cariló
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