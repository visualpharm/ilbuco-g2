import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroImage } from "@/components/hero-image"
import Link from "next/link"
import Image from "next/image"
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
  title: 'Qué Hacer en Cariló: Guía Completa de Actividades y Turismo 2025',
  description: 'Descubre qué hacer en Cariló con nuestra guía completa. Actividades, deportes, gastronomía y lugares para visitar en Cariló y Pinamar. ¡Planifica tu viaje!',
  alternates: {
    canonical: 'https://ilbuco.com.ar/que-hacer-en-carilo',
    languages: {
      'es': 'https://ilbuco.com.ar/que-hacer-en-carilo',
      'en': 'https://ilbuco.com.ar/en/things-to-do-carilo',
      'pt': 'https://ilbuco.com.ar/pt/o-que-fazer-em-carilo',
    },
  },
}

export default function QueHacerEnCarilo() {
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
                  <span className="text-gray-600">Qué Hacer</span> en Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Cariló ofrece una combinación única de actividades al aire libre, espacios para el desarrollo personal y experiencias gastronómicas. Desde Il Buco, tenés acceso fácil a todas las actividades que te detallamos a continuación.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-sm md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Reservá tu Estadía <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <HeroImage 
                  src="/photo/zona/File 24-04-2025, 10 36 15 PM (5) (1).jpg"
                  alt="Qué hacer en Cariló - vista panorámica de playa y bosque de pinos"
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
              Playas y Naturaleza en Cariló
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Surf y Windsurf</h3>
                    <p className="text-gray-700">
                      Escuelas de surf y windsurf en toda la playa de Cariló. Aprendé windsurf en la costa atlántica con instrucción profesional y alquiler de equipos disponible en múltiples escuelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🏖️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Actividades de Playa</h3>
                    <p className="text-gray-700">
                      La playa de Cariló ofrece amplias oportunidades para surf, windsurf, y simplemente relajarse en la arena. El entorno natural único combina bosque de pinos con costa atlántica.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Bike className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Aventuras en Bicicleta</h3>
                    <p className="text-gray-700">
                      Alquilá bicicletas y explorá Cariló y las áreas circundantes. Las calles de arena sin pavimentar y el entorno natural de la ciudad hacen que la experiencia de ciclismo sea agradable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Camera className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fotografía de Naturaleza</h3>
                    <p className="text-gray-700">
                      La luz natural y las vistas inspiradoras hacen que IL BUCO sea perfecto para la fotografía, el dibujo, la pintura u otras actividades creativas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Sunrise className="h-6 w-6 mr-3 mt-1 text-yellow-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Amaneceres y Atardeceres</h3>
                    <p className="text-gray-700">
                      Caminatas al amanecer por la orilla del mar y contemplación de atardeceres únicos entre pinos y océano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Tree className="h-6 w-6 mr-3 mt-1 text-teal-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bosque de Pinos</h3>
                    <p className="text-gray-700">
                      Explorá senderos naturales entre pinos centenarios. Rutas de diferentes dificultades con flora y fauna local única.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Activities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Deportes y Actividades al Aire Libre
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-indigo-600">🏋️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Gimnasio</h3>
                    <p className="text-gray-700">
                      Gimnasio interior de servicio completo rodeado de bosque con pases diarios, semanales y mensuales. La buena instrucción privada está incluida en el precio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-cyan-600">🎾</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tenis y Pádel</h3>
                    <p className="text-gray-700">
                      Canchas de polvo de ladrillo, pádel, fútbol 5, y un pequeño gimnasio interior. Alquilan raquetas y dan clases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">💪</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Calistenia al Aire Libre</h3>
                    <p className="text-gray-700">
                      Gimnasio de calistenia al aire libre gratuito las 24 horas con barras y paralelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-orange-600">🐎</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cabalgatas</h3>
                    <p className="text-gray-700">
                      Cabalgatas por dunas y bosque. Una experiencia única para conectar con la naturaleza de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🏍️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cuatriciclos y Fatbike</h3>
                    <p className="text-gray-700">
                      Paseos en cuatriciclo y alquiler de fatbike para explorar dunas y senderos forestales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🚗</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Escuela de Manejo 4x4</h3>
                    <p className="text-gray-700">
                      Aprendé a manejar off-road y navegar dunas de arena. Ideal para aventureros que buscan nuevas experiencias.
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
              Carilo Turismo: Gastronomía y Vida Nocturna
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <UtensilsCrossed className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Parrillas y Asados</h3>
                    <p className="text-gray-700 mb-3">
                      Parrilla Argentina (la mejor), Don Benito (elegante), De Mi Campo (barra de ensaladas), La Parrillita (auténtico).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">☕</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cafés y Panaderías</h3>
                    <p className="text-gray-700">
                      Panadería y Café (mejor tostada de palta), Café Francés (siempre abierto), Panettone, Masse (panes con semillas).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-blue-600">🍕</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comida Internacional</h3>
                    <p className="text-gray-700">
                      Pizza napolitana premiada de chefs italianos. Hamburguesas gourmet e Impeke en Valeria del Mar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🍨</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Heladerías</h3>
                    <p className="text-gray-700">
                      Colonial en Valeria del Mar (el favorito) y Lucciano's (el lugar más bonito para disfrutar helados).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Shopping className="h-6 w-6 mr-3 mt-1 text-yellow-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Boutiques y Compras</h3>
                    <p className="text-gray-700">
                      Boutiques del centro de Cariló, supermercados Chicho, Coto, Disco con entrega a domicilio.
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
                      Bares, vinotecas con vinos argentinos, y ambientes sofisticados para disfrutar al atardecer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

              {/* Qué hacer cuando llueve */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Qué Hacer en Cariló Cuando Llueve</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Clases de Cerámica</h3>
                    <p className="text-gray-700">Aprendé alfarería y artes cerámicas en un ambiente creativo en Valeria del Mar. Perfecto para días lluviosos.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Gastronomía Local - Espacios Cubiertos</h3>
                    <p className="text-gray-700 mb-3">Los mejores restaurantes de Cariló ofrecen espacios cubiertos y acogedores:</p>
                    <ul className="space-y-2 text-gray-700 ml-4">
                      <li><strong>Parrilla Argentina:</strong> La mejor parrilla con muchos extras gratuitos. También recomendado: Don Benito (elegante), De Mi Campo (¡barra de ensaladas!), La Parrillita (básico en el buen sentido).</li>
                      <li><strong>Pizza Italiana:</strong> Pizza napolitana premiada de los chefs italianos (también hicieron nuestros sofás).</li>
                      <li><strong>Café Francés:</strong> Siempre abierto.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Compras en el Centro</h3>
                    <p className="text-gray-700">Las boutiques del centro de Cariló y supermercados como Chicho con buenos horarios de apertura para días de lluvia.</p>
                  </div>
                </div>
              </section>

              {/* Actividades de invierno */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Actividades en Cariló en Invierno</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Cabalgatas de Invierno</h3>
                    <p className="text-gray-700">Las temperaturas más frescas hacen que la experiencia de cabalgatas sea más cómoda durante los meses de invierno.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Escuela de Manejo 4x4 en Temporada Baja</h3>
                    <p className="text-gray-700">Ideal para la temporada baja con menos tráfico. Mejor momento para aprender sin multitudes.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Fotografía y Arte</h3>
                    <p className="text-gray-700">El entorno natural de Il Buco y los alrededores de Cariló ofrecen luz natural e vistas inspiradoras perfectas para la fotografía, el dibujo, la pintura u otras actividades creativas durante los meses más tranquilos.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Trabajo y Concentración</h3>
                    <p className="text-gray-700">Con nuestro internet de alta velocidad y espacios de trabajo cómodos, IL BUCO es el lugar perfecto para concentrarte en tus proyectos más importantes durante el invierno.</p>
                  </div>
                </div>
              </section>

              {/* Alrededores */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Alrededores de Cariló</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Pinamar Lugares para Visitar</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Sandmasters:</strong> Escuela de manejo 4x4 especializada en dunas</li>
                      <li><strong>La Constanza Pinamar:</strong> Pescadería abierta en temporada baja</li>
                      <li><strong>Quimica Limpia Maurito:</strong> Productos de limpieza al por mayor</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Valeria del Mar</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Impeke:</strong> Hamburguesas gourmet destacadas</li>
                      <li><strong>Colonial:</strong> La mejor heladería de la zona</li>
                      <li><strong>Fusion Arte del Mar:</strong> Clases de cerámica y arte</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Mar de las Pampas</h3>
                    <p className="text-gray-700">Localidad costera tranquila ideal para escapadas de un día. Ambiente bohemio y relajado con cafeterías artesanales y galerías de arte.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Faro Querandí</h3>
                    <p className="text-gray-700">Faro histórico ubicado en las dunas. Perfecto para caminatas y fotografía de paisajes costeros. Vista panorámica de la costa atlántica.</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-3">Recharge Retreat</h3>
                    <p className="text-gray-700">Gran estancia con cabaña para alquilar. Retiro de recarga en ambiente rural con actividades de rancho y naturaleza.</p>
                  </div>
                </div>
              </section>

              {/* Compras */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Compras y Servicios en Cariló</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Supermercados</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Chicho:</strong> Los mejores horarios de apertura, frutas y verduras decentes</li>
                      <li><strong>La Proveeduría / Menor Coste:</strong> Caro, mini Whole Foods</li>
                      <li><strong>Coto:</strong> El supermercado grande más cercano; tienen de todo, desde comida hasta muebles y bicicletas. Tienda online con entrega a Cariló</li>
                      <li><strong>Disco:</strong> Alternativa sin tomar la autopista. También entregan a Cariló</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Productos Frescos</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Belén:</strong> Las mejores frutas y verduras</li>
                      <li><strong>Boutique de Frutas:</strong> Autoservicio, lo cual no es común. Elegí las mejores o culpá a alguien más</li>
                      <li><strong>Cabaña Guerrero:</strong> Mi carne favorita</li>
                      <li><strong>La Constanza (Cariló):</strong> Pescado fresco, no congelado, incluso salmón. Cerrado durante temporada baja</li>
                      <li><strong>La Constanza (Pinamar):</strong> Abierto durante temporada baja cuando la ubicación de Cariló está cerrada</li>
                    </ul>
                  </div>
                </div>
              </section>

        {/* Weather & Winter Activities */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">Qué Hacer en Cariló Cuando Llueve</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">🎨 Clases de Cerámica</h3>
                  <p className="text-gray-700">Aprendé alfarería y artes cerámicas en un ambiente creativo en Valeria del Mar. Perfecto para días lluviosos.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">🍽️ Espacios Cubiertos</h3>
                  <p className="text-gray-700">Los mejores restaurantes de Cariló ofrecen espacios cubiertos: parrillas, pizzerías y cafés para días de lluvia.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-10 text-center">Actividades en Cariló en Invierno</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">🐎 Cabalgatas de Invierno</h3>
                  <p className="text-gray-700">Las temperaturas más frescas hacen que la experiencia de cabalgatas sea más cómoda durante los meses de invierno.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">💻 Trabajo y Concentración</h3>
                  <p className="text-gray-700">Con internet de alta velocidad y espacios cómodos, IL BUCO es perfecto para concentrarte en proyectos importantes durante el invierno.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Surrounding Areas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Alrededores de Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🏖️ Pinamar</h3>
                <p className="text-gray-700">Sandmasters (4x4), La Constanza (pescadería), servicios especializados.</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🍔 Valeria del Mar</h3>
                <p className="text-gray-700">Impeke (hamburguesas), Colonial (helados), Fusion Arte del Mar (cerámica).</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🎨 Mar de las Pampas</h3>
                <p className="text-gray-700">Localidad costera tranquila con ambiente bohemio, cafeterías artesanales y galerías de arte.</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">📸 Faro Querandí</h3>
                <p className="text-gray-700">Faro histórico en las dunas, perfecto para caminatas y fotografía de paisajes costeros.</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🏡 Recharge Retreat</h3>
                <p className="text-gray-700">Gran estancia con cabaña para alquilar. Retiro en ambiente rural con actividades de rancho.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Descubrir Todo lo que Cariló Tiene para Ofrecer?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Descubrí todas estas actividades y más alojándote en Il Buco. Ubicado estratégicamente para acceder a las mejores experiencias de Cariló.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservá tu Estadía <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}