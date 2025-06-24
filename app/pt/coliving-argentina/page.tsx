import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Users,
  Globe,
  Wifi,
  MapPin,
  Heart,
  Calendar,
  Star,
  Shield,
  Coffee,
  Briefcase,
  TreesIcon as Tree,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Coliving Argentina - Comunidade Internacional em Cariló | IL BUCO",
  description: "Descubra o melhor coliving da Argentina em Cariló. Comunidade internacional de profissionais, villa premium a 150m da praia, internet 500 Mbps e experiências únicas.",
  keywords: "coliving argentina, coliving carilo argentina, comunidade internacional argentina, trabalho remoto argentina, nomades digitais argentina",
  openGraph: {
    title: "Coliving Argentina - Experiência Premium em Cariló | IL BUCO",
    description: "Villa de coliving premium na Argentina com comunidade internacional em Cariló, costa atlântica.",
  },
}

export default function ColivingArgentinaPage() {
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
                  <span className="text-gray-600">Coliving Argentina</span> Premium
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Experimente o melhor coliving da Argentina em Cariló. Nossa villa premium abriga uma comunidade internacional de profissionais, empreendedores e criativos em um ambiente único entre floresta e oceano.
                </p>
                <div className="pt-2 md:pt-3 lg:pt-4">
                  <Link
                    href="/pt/the-house"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-black text-white text-sm md:text-base rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Ver Casa <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden order-2 md:order-2">
                <Image
                  src="/gallery/hero-outdoor-seating.jpeg"
                  alt="Área de convivência do coliving IL BUCO na Argentina com profissionais internacionais"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Argentina Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Por que Escolher Argentina para Coliving?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Globe className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Fuso horário estratégico:</strong> Ideal para trabalhar com EUA, Europa e Brasil simultaneamente.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Localização única:</strong> Cariló oferece a experiência argentina mais exclusiva - floresta de pinheiros encontrando o oceano.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Cultura acolhedora:</strong> Argentinos são conhecidos pela hospitalidade e paixão pela vida, criando conexões autênticas.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Custo-benefício excepcional:</strong> Estilo de vida premium a preços acessíveis comparado a destinos europeus ou americanos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 mr-3 mt-1 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Qualidade de vida:</strong> Equilíbrio perfeito entre trabalho produtivo e experiências de vida memoráveis.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Coliving Experience Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              A Experiência de Coliving na Argentina
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Users className="h-5 w-5 mr-3 mt-1 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Comunidade Internacional
                    </h3>
                    <p className="text-gray-600">
                      Profissionais de tecnologia, design, marketing e empreendedorismo de Brasil, EUA, Europa e outros países.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Infraestrutura de Trabalho
                    </h3>
                    <p className="text-gray-600">
                      Internet fibra 500 Mbps, espaços de coworking, salas de reunião e zonas de trabalho silencioso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Coffee className="h-5 w-5 mr-3 mt-1 text-brown-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Áreas Sociais Premium
                    </h3>
                    <p className="text-gray-600">
                      Cozinha gourmet compartilhada, sala de estar ampla, terraços com vista para floresta e espaços de relaxamento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Eventos Regulares
                    </h3>
                    <p className="text-gray-600">
                      Noites gastronômicas, workshops de negócios, atividades na praia e sessões de networking organizadas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Privacidade Garantida
                    </h3>
                    <p className="text-gray-600">
                      Quartos privativos com banheiro, espaços pessoais respeitados e políticas claras de convivência.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Experiências Únicas
                    </h3>
                    <p className="text-gray-600">
                      Trilhas na floresta, surf no oceano, asados argentinos e imersão na cultura local autêntica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accommodation Options Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Opções de Acomodação no Coliving
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Quarto Privativo</h3>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Quarto individual com cama queen</li>
                  <li>• Banheiro privativo</li>
                  <li>• Área de trabalho pessoal</li>
                  <li>• Armário completo</li>
                  <li>• Ar condicionado individual</li>
                </ul>
                <p className="text-lg font-semibold text-gray-600">A partir de $45/dia</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Suíte Premium</h3>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Quarto amplo com varanda</li>
                  <li>• Banheiro luxuoso com banheira</li>
                  <li>• Escritório privado</li>
                  <li>• Vista para floresta ou jardim</li>
                  <li>• Frigobar e amenities premium</li>
                </ul>
                <p className="text-lg font-semibold text-gray-600">A partir de $65/dia</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Descontos progressivos para estadias longas • Todas as acomodações incluem acesso completo às áreas comuns
              </p>
              <Link
                href="/pt/rooms"
                className="inline-flex items-center px-6 py-2 text-gray-600 hover:text-blue-800 transition-colors"
              >
                Ver Todos os Quartos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Community Testimonials Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              O Que Nossa Comunidade Diz
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <div className="flex text-yellow-500 mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "O IL BUCO oferece a melhor experiência de coliving que já tive. A comunidade é incrível e a Argentina me surpreendeu com sua riqueza cultural e beleza natural."
                </p>
                <p className="text-gray-600 font-medium">
                  Laura S., Desenvolvedora - Barcelona
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <div className="flex text-yellow-500 mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Trabalhar remotamente nunca foi tão produtivo e prazeroso. O ambiente de Cariló e a qualidade das instalações são excepcionais. Voltarei com certeza!"
                </p>
                <p className="text-gray-600 font-medium">
                  Carlos M., Empresário - São Paulo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Sua Experiência de Coliving na Argentina?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a uma comunidade internacional de profissionais em nossa villa premium em Cariló. Trabalhe, conecte-se e viva experiências inesquecíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pt/the-house"
                className="inline-flex items-center px-8 py-3 bg-white text-gray-600 text-lg rounded-md hover:bg-gray-100 transition-colors"
              >
                Ver Casa <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pt/the-house"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white text-lg rounded-md hover:bg-white hover:text-gray-600 transition-colors"
              >
                Conhecer a Villa <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}