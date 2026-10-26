import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Waves,
  TreesIcon as Tree,
  Camera,
  Utensils,
  Bike,
  Mountain as Hiking,
  Sunset,
  Coffee,
  Star,
  MapPin,
  Calendar,
} from "@/components/icons8-lucide"

export const metadata: Metadata = {
  title: "Cariló Argentina O Que Fazer - Guia Completo de Atividades | IL BUCO",
  description: "Descubra o que fazer em Cariló, Argentina. Guia completo com praias, floresta de pinheiros, gastronomia, trilhas e atividades exclusivas na costa argentina.",
  keywords: "carilo argentina o que fazer, atividades carilo, carilo turismo, o que fazer carilo argentina, carilo dicas, carilo praia atividades",
  openGraph: {
    title: "O Que Fazer em Cariló, Argentina - Guia Completo | IL BUCO",
    description: "Guia completo de atividades em Cariló: praias, floresta, gastronomia e experiências únicas na Argentina.",
  },
}

export default function CariloArgentinaOQueFazerPage() {
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
                  <span className="text-gray-600">Cariló Argentina</span> O Que Fazer
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Descubra todas as atividades incríveis que Cariló oferece. Desde praias virgens até trilhas na floresta de pinheiros, gastronomia premium e experiências únicas que fazem deste destino um dos mais exclusivos da Argentina.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/pt/the-house"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-base md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ver Casa <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/photo/exterior/exterior2.jpg"
                  alt="Praia de Cariló com floresta de pinheiros - destino único na Argentina"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beach Activities Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Atividades na Praia
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Surf e Bodyboard
                    </h3>
                    <p className="text-gray-600">
                      Ondas perfeitas do Atlântico Sul. Aulas para iniciantes e spots avançados para surfistas experientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-yellow-600">🏐</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Vôlei de Praia
                    </h3>
                    <p className="text-gray-600">
                      Quadras naturais na areia. Torneios organizados e jogos casuais com outros hóspedes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-green-600">🎣</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Pesca Esportiva
                    </h3>
                    <p className="text-gray-600">
                      Pesca de praia e em embarcações. Capturas frequentes de linguados, corvinas e bagres.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Sunset className="h-5 w-5 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Caminhadas ao Nascer/Pôr do Sol
                    </h3>
                    <p className="text-gray-600">
                      Trilhas pela praia durante os horários mais bonitos do dia. Paisagens inesquecíveis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-purple-600">🧘‍♀️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Yoga na Praia
                    </h3>
                    <p className="text-gray-600">
                      Sessões matinais de yoga com o som das ondas. Meditação ao ar livre em ambiente único.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-600">🏇</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Cavalgadas na Praia
                    </h3>
                    <p className="text-gray-600">
                      Passeios a cavalo pela areia durante o pôr do sol. Experiência romântica e aventureira.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forest Activities Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Atividades na Floresta
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Hiking className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Trilhas Ecológicas
                    </h3>
                    <p className="text-gray-600">
                      Caminhos secretos pela floresta de pinheiros. Observação de fauna e flora nativas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Bike className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Ciclismo na Floresta
                    </h3>
                    <p className="text-gray-600">
                      Trilhas de bike pela mata. Aluguel de bicicletas e rotas guiadas disponíveis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Camera className="h-5 w-5 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Fotografia de Natureza
                    </h3>
                    <p className="text-gray-600">
                      Capture a beleza única onde a floresta encontra o mar. Workshops de fotografia disponíveis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-brown-600">🦌</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Observação da Vida Selvagem
                    </h3>
                    <p className="text-gray-600">
                      Avistamento de veados, raposas e mais de 200 espécies de aves nativas da região.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Piqueniques na Mata
                    </h3>
                    <p className="text-gray-600">
                      Locais especiais para refeições ao ar livre. Cestas de piquenique disponíveis sob encomenda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-orange-600">🔥</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Fogueiras e Astronomia
                    </h3>
                    <p className="text-gray-600">
                      Noites em volta da fogueira. Observação de estrelas em um dos céus mais limpos da Argentina.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gastronomy Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Experiências Gastronômicas
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Utensils className="h-6 w-6 mr-4 mt-1 text-red-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Restaurantes Locais</h3>
                    <p className="text-gray-600">
                      Cariló oferece gastronomia de primeiro nível. Desde parrillas tradicionais argentinas até cozinha internacional sofisticada.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Coffee className="h-6 w-6 mr-4 mt-1 text-brown-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cafeterias Boutique</h3>
                    <p className="text-gray-600">
                      Café artesanal e padarias locais. Ambiente perfeito para trabalho remoto ou encontros casuais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="h-6 w-6 mr-4 mt-1 text-gray-600">🍷</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vinhos Argentinos</h3>
                    <p className="text-gray-600">
                      Degustação dos melhores vinhos da Argentina. Harmonização com pratos locais e internacionais.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="h-6 w-6 mr-4 mt-1 text-green-600">🥩</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Asado Argentino</h3>
                    <p className="text-gray-600">
                      Experiência autêntica de churrasco argentino. Aprenda as técnicas tradicionais com locais experientes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Activities Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Atividades por Temporada
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">☀️</span> Verão (Dezembro - Março)
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Praia e esportes aquáticos</li>
                  <li>• Festivais e eventos culturais</li>
                  <li>• Vida noturna animada</li>
                  <li>• Mercados de artesanato</li>
                  <li>• Aulas de surf e vela</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🍂</span> Outono (Março - Junho)
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Caminhadas pela floresta colorida</li>
                  <li>• Pesca esportiva em alta temporada</li>
                  <li>• Temperaturas ideais para ciclismo</li>
                  <li>• Observação de aves migratórias</li>
                  <li>• Gastronomia de temporada</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">❄️</span> Inverno (Junho - Setembro)
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fogueiras e noites aconchegantes</li>
                  <li>• Trilhas na floresta silenciosa</li>
                  <li>• Observação de estrelas cristalina</li>
                  <li>• Retiros de wellness</li>
                  <li>• Leitura e trabalho contemplativo</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🌸</span> Primavera (Setembro - Dezembro)
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Floração dos pinheiros</li>
                  <li>• Clima perfeito para todas as atividades</li>
                  <li>• Renovação da vida selvagem</li>
                  <li>• Festivais de primavera</li>
                  <li>• Fotografia da natureza renascente</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Explorar Cariló?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserve sua estadia no IL BUCO e tenha acesso privilegiado a todas essas experiências únicas em Cariló, Argentina.
            </p>
            <Link
              href="/pt/the-house"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Ver Casa <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}