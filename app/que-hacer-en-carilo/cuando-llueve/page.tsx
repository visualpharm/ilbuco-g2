import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { ArrowRight, Coffee, ShoppingBag, Palette } from "lucide-react"

export default function QueHacerCuandoLlueve() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Qué Hacer en Cariló Cuando Llueve
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubrí las mejores actividades para disfrutar en Cariló incluso en días de lluvia.
            </p>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Ceramics Class */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Palette className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Clases de Cerámica</h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Aprendé alfarería y artes cerámicas en un ambiente creativo en Valeria del Mar. 
                  Perfecto para días lluviosos cuando buscás una actividad tranquila y creativa.
                </p>
              </div>

              {/* Gastronomía */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Coffee className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Gastronomía Local</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Los mejores restaurantes de Cariló ofrecen espacios cubiertos y acogedores:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Parrilla Argentina:</strong> La mejor parrilla con muchos extras gratuitos.
                  </li>
                  <li><strong>Don Benito:</strong> Opción elegante para una cena especial.</li>
                  <li><strong>De Mi Campo:</strong> Con su famosa barra de ensaladas.</li>
                  <li><strong>La Parrillita:</strong> Opción más básica pero auténtica.</li>
                  <li><strong>Pizza Italiana:</strong> Pizza napolitana premiada de chefs italianos.</li>
                  <li><strong>Café Francés:</strong> Siempre abierto para un café caliente.</li>
                </ul>
              </div>

              {/* Shopping */}
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Compras en el Centro</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Las boutiques del centro de Cariló ofrecen la excusa perfecta para pasear bajo techo. 
                  No te pierdas las tiendas locales con artesanías y productos regionales.
                </p>
                <p className="text-gray-700">
                  Los supermercados como Chicho tienen buenos horarios de apertura y son una buena opción 
                  para abastecerse durante los días de lluvia.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-blue-50 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para tu próxima escapada a Cariló?</h3>
                <p className="text-gray-700 mb-6">
                  Descubrí más actividades y reservá tu estadía en IL BUCO.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Reservar Ahora
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
