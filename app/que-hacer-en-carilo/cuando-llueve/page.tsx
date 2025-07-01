import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Coffee, ShoppingBag, Palette, Heart, Dumbbell, Church, MapPin } from "lucide-react"

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
                    <h3 className="text-xl font-semibold mb-3">Restaurantes con Ambiente Acogedor</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Griller Restaurant</strong> - Experiencia gastronómica premium en interior climatizado</li>
                      <li><strong>CarpeDiem - Cariló Golf</strong> - Cocina regional del chef Pedro Demuru</li>
                      <li><strong>Ave Restaurante</strong> - Especialidad en cocina india, ambiente único</li>
                      <li><strong>Bar de Tapas</strong> - 25 años de experiencia en cocina española</li>
                      <li><strong>Fabric Sushi</strong> - Fusión nikkei en ambiente moderno</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Cafeterías y Espacios Cálidos</h3>
                    <p className="text-gray-700 mb-4">
                      Los paradores principales (Cozumel, Divisadero, Hemingway y Neruda) 
                      cuentan con áreas cubiertas perfectas para pasar la tarde con una bebida caliente 
                      mientras escuchás la lluvia.
                    </p>
                    <p className="text-gray-700">
                      <strong>Tip:</strong> Muchos restaurantes ofrecen menús especiales de temporada 
                      ideales para disfrutar durante los días de lluvia.
                    </p>
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
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-3">Cariló Arte Contemporáneo</h3>
                  <p className="text-gray-700 mb-4">
                    La única galería de arte de Cariló exhibe obras de más de 50 artistas nacionales. 
                    Exposiciones especiales cada viernes durante temporada alta y talleres de arte los jueves.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Actividades para niños desde 3 años en vacaciones escolares</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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

        {/* Wellness & Spas Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Heart className="w-8 h-8 text-pink-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Spas y Bienestar</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Cariló Palace Apart Hotel & Spa</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Sauna, baño finlandés, gimnasio y sala de relajación para una experiencia completa de bienestar.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Howard Johnson Hotel Spa</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Spa exclusivo con piscina climatizada cubierta, gimnasio, sauna, ducha escocesa y salas de masajes.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Cariló Village Hotel</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Spa familiar con sauna seca (16-20:30h) y gimnasio completo con hidromasaje (18-21h).
                  </p>
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
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-xl mb-12">
                <h3 className="text-2xl font-semibold mb-4">Centro de Entrenamiento</h3>
                <div>
                  <h4 className="font-semibold text-lg mb-2">CIE - Centro de Entrenamiento</h4>
                  <p className="text-gray-700 mb-3">
                    Gimnasio completo cubierto rodeado de bosque. Pases diarios, semanales y mensuales 
                    disponibles con instructores incluidos.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>17 min caminando desde Il Buco</span>
                  </div>
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
                    <h4 className="font-semibold mb-3">Perfect para Días Lluviosos:</h4>
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