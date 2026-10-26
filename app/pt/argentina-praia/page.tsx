import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata } from "next"
import {
  ArrowRight,
  Wifi,
  MapPin,
  Waves,
  Briefcase,
  Users,
  Thermometer,
  Sofa,
  TreesIcon as Tree,
  Refrigerator,
  Bed,
  ShowerHeadIcon as Shower,
  Droplet,
  Building,
  Shield,
} from "@/components/icons8-lucide"

export const metadata: Metadata = {
  title: "Villa de Luxo na Praia Argentina - Cariló Coliving | IL BUCO",
  description: "Descubra nossa villa de luxo em Cariló, Argentina. Espaço perfeito para trabalho remoto, a apenas minutos da praia. Internet 500 Mbps, casa na floresta e todas as comodidades premium.",
  keywords: "argentina praia, villa luxo argentina, carilo coliving, trabalho remoto praia, casa tecnologica argentina, floresta pinheiros argentina",
  openGraph: {
    title: "Villa de Luxo na Praia Argentina - Cariló | IL BUCO",
    description: "Villa de luxo em Cariló, Argentina. Trabalho remoto na praia com todas as comodidades premium.",
  },
}

export default function ArgentinaPraiaPage() {
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
                  Villa de Luxo na <span className="text-gray-600">Praia Argentina</span>
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-xl">
                  Escape para nossa villa exclusiva em Cariló, Argentina. Localizada na floresta de pinheiros, a apenas 150 metros da praia atlântica. O espaço perfeito para trabalho remoto com internet de 500 Mbps e todas as comodidades premium.
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
                  src="/gallery/hero-villa-exterior.jpeg"
                  alt="Villa de luxo IL BUCO em Cariló, Argentina - floresta de pinheiros próximo à praia"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Location Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Por que Escolher Cariló, Argentina?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Waves className="h-5 w-5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>150 metros da praia:</strong> Acesso direto às praias virgens do <Link href="/pt/argentina-mar" className="text-gray-900 no-underline hover:text-gray-700">Atlântico Sul</Link>, perfeitas para relaxar após o trabalho.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Floresta de pinheiros:</strong> Ambiente único cercado pela natureza, proporcionando tranquilidade e ar puro.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Localização premium:</strong> No coração de Cariló, próximo a restaurantes, cafés e atividades locais.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-3 mt-1 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Infraestrutura premium:</strong> Internet fibra 500 Mbps, aquecimento radiante no piso e 8 ar-condicionados.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-1 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-lg">
                      <strong>Comunidade internacional:</strong> Cariló atrai profissionais digitais e empresários do mundo todo.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Comodidades Premium da Villa
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Internet Ultra-Rápida
                    </h3>
                    <p className="text-gray-600">
                      Fibra óptica de 500 Mbps para videoconferências e trabalho remoto sem interrupções.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <span className="h-5 w-5 mr-3 mt-1 text-gray-700">🏖️</span>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Acesso Direto à Praia
                    </h3>
                    <p className="text-gray-600">
                      Caminhada de 5 minutos até as praias exclusivas de Cariló, com mar cristalino e areia branca.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Clima Temperado
                    </h3>
                    <p className="text-gray-600">
                      Verões agradáveis (20-28°C) e invernos amenos (8-15°C), ideal para produtividade o ano todo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Áreas Comuns
                    </h3>
                    <p className="text-gray-600">
                      Grande sala de estar comum, cozinha comum grande e um sofá enorme para socialização.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Terraços Privativos
                    </h3>
                    <p className="text-gray-600">
                      Múltiplos terraços com vista para a floresta, ideais para trabalhar ao ar livre ou relaxar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Refrigerator className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Cozinha Gourmet
                    </h3>
                    <p className="text-gray-600">
                      Cozinha completa com eletrodomésticos premium e ilha central para socialização.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Roupas de Cama Premium
                    </h3>
                    <p className="text-gray-600">
                      Lençóis de algodão egípcio e travesseiros de qualidade hoteleira para o máximo conforto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Banheiros de Luxo
                    </h3>
                    <p className="text-gray-600">
                      Banheiros espaçosos com chuveiros de alta pressão e amenities premium.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Droplet className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Água Filtrada
                    </h3>
                    <p className="text-gray-600">
                      Sistema de filtração avançado garante água pura para beber e cozinhar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Building className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Isolamento Acústico
                    </h3>
                    <p className="text-gray-600">
                      Paredes com isolamento profissional para máxima privacidade e concentração.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Isolamento Térmico
                    </h3>
                    <p className="text-gray-600">
                      Isolamento completo mantém temperatura ideal em todas as estações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link href="/pt/the-house" className="flex items-start mb-3 group">
                  <ArrowRight className="h-5 w-5 mr-3 mt-1 text-gray-600 group-hover:text-blue-800 transition-colors" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-600 group-hover:text-blue-800 transition-colors">
                      Ver Todas as Comodidades
                    </h3>
                    <p className="text-gray-600">
                      Descubra todos os detalhes da nossa villa premium em Cariló.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Internet Speed Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="mb-6">
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-n9F4IHjvhVUozNWKdlOYin6434gR7J.png"
                    alt="Teste de velocidade Fast.com mostrando 350 Mbps"
                    width={600}
                    height={400}
                    className="mx-auto"
                  />
                </div>
                <p className="text-base text-gray-500 mt-4">
                  *Screenshot enviado por um inquilino
                </p>
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
                      src="/person-window-view.jpeg"
                      alt="Relaxing view from IL BUCO"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <p className="text-2xl font-medium">
                    "Trabalhar em Cariló foi transformador. A conexão com a natureza e a proximidade com a praia criaram o ambiente perfeito para minha criatividade e produtividade."
                  </p>
                  <p className="text-gray-600">
                    Sofia M., Designer Digital - São Paulo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}