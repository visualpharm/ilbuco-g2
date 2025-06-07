import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Waves,
  MapPin,
  Sun,
  Fish,
  Camera,
  Umbrella,
  TreesIcon as Tree,
  Wind,
  ThermometerIcon as Thermometer,
  CalendarDays,
  Star,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Argentina Mar - Cariló Praia Exclusiva na Costa Atlântica | IL BUCO",
  description: "Descubra as melhores praias da Argentina em Cariló. Villa premium a 150m do mar atlântico, praias virgens, floresta de pinheiros e experiência única na costa argentina.",
  keywords: "argentina mar, carilo praia, costa atlantica argentina, praias argentina, mar argentina, praia carilo, oceano atlantico argentina",
  openGraph: {
    title: "Praias Exclusivas da Argentina - Cariló | IL BUCO",
    description: "Villa premium a 150m das melhores praias da Argentina em Cariló. Experimente o mar atlântico em um destino único.",
  },
}

export default function ArgentinaMarPage() {
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
                  Argentina <span className="text-blue-600">Mar</span> em Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Descubra as praias mais exclusivas da Argentina em Cariló. Nossa villa premium está localizada a apenas 150 metros do Oceano Atlântico, oferecendo acesso direto às praias virgens cercadas pela floresta de pinheiros.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/pt/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Reservar Vista Mar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/carilo-beach.png"
                  alt="Praia de Cariló, Argentina - mar atlântico com areia branca e floresta de pinheiros"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beach Features Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Por que o Mar de Cariló é Único na Argentina?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Praias virgens:</strong> Extensas faixas de areia branca com águas cristalinas do Oceano Atlântico, preservadas pela natureza.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Floresta até o mar:</strong> Única combinação na Argentina de floresta de pinheiros que se encontra diretamente com a praia.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Wind className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Microclima especial:</strong> Protegida dos ventos fortes pela floresta, criando condições ideais para banho de mar.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Destino exclusivo:</strong> Praia privativa frequentada apenas pelos hóspedes das casas premium de Cariló.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>150 metros da villa:</strong> Caminhada de 5 minutos pela floresta até chegar às águas do Atlântico Sul.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Experiências no Mar da Argentina
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-blue-600">🏄‍♀️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Surf nas Ondas Argentinas
                    </h3>
                    <p className="text-gray-600">
                      Aprenda surf nas ondas perfeitas do Atlântico Sul ou aperfeiçoe sua técnica com instrutores locais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Sun className="h-5 w-5 mr-3 mt-1 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Banhos de Sol Premium
                    </h3>
                    <p className="text-gray-600">
                      Relaxe em praias semi-privativas com espreguiçadeiras e serviço de praia exclusivo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Fish className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Pesca no Oceano
                    </h3>
                    <p className="text-gray-600">
                      Pesca esportiva no Atlântico com chances de capturar peixes frescos para o jantar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-purple-600">🚶‍♀️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Caminhadas na Praia
                    </h3>
                    <p className="text-gray-600">
                      Longas caminhadas ao nascer e pôr do sol pela costa argentina praticamente deserta.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Camera className="h-5 w-5 mr-3 mt-1 text-pink-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Fotografia de Natureza
                    </h3>
                    <p className="text-gray-600">
                      Capture momentos únicos onde a floresta de pinheiros encontra o mar atlântico.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-orange-600">🧘‍♀️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Yoga na Praia
                    </h3>
                    <p className="text-gray-600">
                      Sessões de yoga e meditação com o som das ondas do Oceano Atlântico como trilha sonora.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather & Seasons Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">
                Clima e Temporadas no Mar de Cariló
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Sun className="h-6 w-6 mr-4 mt-1 text-yellow-500" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Verão (Dez - Mar)</h3>
                      <p className="text-gray-600">
                        Temperatura do ar: 22-28°C<br/>
                        Temperatura da água: 18-22°C<br/>
                        Perfeito para banhos de mar e atividades aquáticas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Thermometer className="h-6 w-6 mr-4 mt-1 text-orange-500" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Outono (Mar - Jun)</h3>
                      <p className="text-gray-600">
                        Temperatura do ar: 15-22°C<br/>
                        Temperatura da água: 15-18°C<br/>
                        Ideal para caminhadas na praia e pesca.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Wind className="h-6 w-6 mr-4 mt-1 text-blue-500" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Inverno (Jun - Set)</h3>
                      <p className="text-gray-600">
                        Temperatura do ar: 8-15°C<br/>
                        Temperatura da água: 10-14°C<br/>
                        Praia selvagem para contemplação e exercícios.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Waves className="h-6 w-6 mr-4 mt-1 text-green-500" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Primavera (Set - Dez)</h3>
                      <p className="text-gray-600">
                        Temperatura do ar: 15-22°C<br/>
                        Temperatura da água: 14-18°C<br/>
                        Época de floração e vida marinha ativa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beach Image Gallery */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              As Praias de Cariló
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="/carilo-beach-forest.png"
                  alt="Praia de Cariló com floresta de pinheiros - vista única na Argentina"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="Caminho pela floresta até a praia - acesso exclusivo em Cariló"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src="/person-window-view.jpeg"
                      alt="Hóspede contemplando vista para o mar desde IL BUCO"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-2xl font-medium">
                    "Nunca imaginei que encontraria praias tão preservadas na Argentina. O acesso direto do IL BUCO ao mar, combinado com a floresta, criou a experiência perfeita de conexão com a natureza."
                  </p>
                  <p className="text-gray-600">
                    Ana C., Fotógrafa de Natureza - Rio de Janeiro
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
              Experimente o Mar da Argentina
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserve sua estadia e descubra por que as praias de Cariló são consideradas as mais exclusivas da costa argentina.
            </p>
            <Link
              href="/pt/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservar Vista Mar <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}