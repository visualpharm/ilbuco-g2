import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Wifi,
  MapPin,
  Users,
  Globe,
  Coffee,
  Briefcase,
  Heart,
  Home,
  Star,
  Calendar,
  Shield,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Coliving em Cariló, Argentina - Espaço Colaborativo de Luxo | IL BUCO",
  description: "Descubra o melhor espaço de coliving na Argentina. Villa de luxo em Cariló com profissionais internacionais, internet 500 Mbps e a 150m da praia. Perfeito para nômades digitais.",
  keywords: "coliving argentina, coliving carilo, espaço colaborativo argentina, nomades digitais argentina, trabalho remoto argentina, comunidade internacional",
  openGraph: {
    title: "Coliving Premium em Cariló, Argentina | IL BUCO",
    description: "Villa de luxo para coliving em Cariló. Comunidade internacional de profissionais a 150m da praia argentina.",
  },
}

export default function ColivingPage() {
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
                  <span className="text-blue-600">Coliving</span> de Luxo em Cariló
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Junte-se a uma comunidade internacional de profissionais em nossa villa premium. Localizada na floresta de pinheiros a 150 metros da praia, oferecemos o ambiente perfeito para trabalho remoto e networking.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/pt/book"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Reservar Espaço <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/gallery/hero-outdoor-seating.jpeg"
                  alt="Área comum de coliving IL BUCO em Cariló - espaço para networking e trabalho colaborativo"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is Coliving Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                O que é Coliving?
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-700">
                    Coliving é uma nova forma de morar que combina acomodações privadas com espaços compartilhados vibrantes. É perfeito para profissionais remotos, empreendedores e criativos que buscam:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Users className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                      <span><strong>Comunidade:</strong> Networking natural com profissionais de diversos países</span>
                    </li>
                    <li className="flex items-start">
                      <Home className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                      <span><strong>Flexibilidade:</strong> Estadas de curto ou longo prazo sem complicações</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="h-5 w-5 mr-3 mt-1 text-yellow-600 flex-shrink-0" />
                      <span><strong>Experiências:</strong> Eventos, workshops e atividades organizadas</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/hero-terrace-view.jpeg"
                    alt="Terraço comum do coliving IL BUCO com vista para floresta de pinheiros"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose IL BUCO Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Por que Escolher IL BUCO para Coliving?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Localização única:</strong> Em Cariló, Argentina - um destino exclusivo na costa atlântica cercado por floresta de pinheiros.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Comunidade internacional:</strong> Profissionais de tecnologia, design, marketing e empreendedorismo de diversos países.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Infraestrutura premium:</strong> Internet fibra 500 Mbps, espaços de trabalho dedicados e tecnologia de ponta.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Equilíbrio vida-trabalho:</strong> Praia a 150 metros, atividades ao ar livre e ambiente relaxante para recarregar energias.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Segurança e privacidade:</strong> Ambiente seguro com quartos privativos e áreas comuns bem planejadas.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Community Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Experiência de Coliving Premium
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Coffee className="h-5 w-5 mr-3 mt-1 text-brown-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Café da Manhã Comunitário
                    </h3>
                    <p className="text-gray-600">
                      Comece o dia interagindo com outros profissionais em nossa cozinha gourmet compartilhada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Coworking Integrado
                    </h3>
                    <p className="text-gray-600">
                      Áreas de trabalho compartilhadas e salas de reunião para máxima produtividade.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Eventos Regulares
                    </h3>
                    <p className="text-gray-600">
                      Workshops, networking events e atividades sociais organizadas semanalmente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🏖️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Atividades na Praia
                    </h3>
                    <p className="text-gray-600">
                      Volleyball, surf, caminhadas e piqueniques organizados na praia de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🌲</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Trilhas na Floresta
                    </h3>
                    <p className="text-gray-600">
                      Explore os caminhos secretos da floresta de pinheiros com outros colivers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🍽️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Jantares Temáticos
                    </h3>
                    <p className="text-gray-600">
                      Noites gastronômicas com culinária internacional preparada em conjunto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src="/person-pine-window.png"
                      alt="Profissional trabalhando no coliving IL BUCO com vista para floresta"
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
                    "O coliving no IL BUCO transformou minha experiência de trabalho remoto. A comunidade internacional e o ambiente inspirador me ajudaram a crescer pessoal e profissionalmente."
                  </p>
                  <p className="text-gray-600">
                    Marco R., Desenvolvedor - Lisboa
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
              Pronto para Sua Experiência de Coliving?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a profissionais de todo o mundo em nossa villa premium em Cariló. Trabalhe, conecte-se e crie memórias inesquecíveis.
            </p>
            <Link
              href="/pt/book"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}