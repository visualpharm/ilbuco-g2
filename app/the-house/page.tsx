"use client"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { HeroGallery } from "@/components/hero-gallery"
import { houseTranslations } from "@/translations/house"
import { Win10Icon } from "@/components/win10-icon"
import { ImageLightbox } from "@/components/image-lightbox"
import { useState } from "react"

export default function TheHouse() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const historyImages = [
    {
      src: "/photo/history/D2416245-19D3-4E02-9EA8-D34FE2AB818B.jpg",
      alt: "When Il Buco was still the hole"
    },
    {
      src: "/photo/history/IMG_20231215_150203.jpg", 
      alt: "When Il Buco was still the hole"
    },
    {
      src: "/photo/history/IMG_20231215_155147.jpg",
      alt: "When Il Buco was still the hole"
    }
  ]

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % historyImages.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + historyImages.length) % historyImages.length)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <Translate text={houseTranslations.pageTitle} />
              </h1>

              <div className="mb-12">
                <HeroGallery />
              </div>

              {/* Description Section */}
              <div className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate 
                    text={{
                      en: "About Il Buco",
                      es: "Acerca de Il Buco",
                      pt: "Sobre Il Buco"
                    }} 
                  />
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <p className="text-lg leading-relaxed">
                    <Translate 
                      text={{
                        en: "Il Buco is a newly built, premium coliving house constructed on the site of an 8-meter deep natural hole – hence the name, which means 'The Hole' in Italian.",
                        es: "Il Buco es una casa de coliving premium recién construida en el sitio de un agujero natural de 8 metros de profundidad, de ahí el nombre, que significa 'El Agujero' en italiano.",
                        pt: "Il Buco é uma casa de coliving premium recém-construída no local de um buraco natural de 8 metros de profundidade – daí o nome, que significa 'O Buraco' em italiano."
                      }} 
                    />
                  </p>
                  
                  <div className="my-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {historyImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        >
                          <Image 
                            src={image.src}
                            alt={image.alt}
                            width={300}
                            height={225}
                            className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                              Click to enlarge
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-3">
                      <Translate 
                        text={{
                          en: "When Il Buco was still the hole",
                          es: "Cuando Il Buco era todavía el agujero",
                          pt: "Quando Il Buco ainda era o buraco"
                        }} 
                      />
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    <Translate 
                      text={{
                        en: "Il Buco Principles",
                        es: "Principios de Il Buco",
                        pt: "Princípios do Il Buco"
                      }} 
                    />
                  </h3>
                  <p>
                    <Translate 
                      text={{
                        en: "When I designed this house, I had two key principles in mind:",
                        es: "Cuando diseñé esta casa, tenía dos principios clave en mente:",
                        pt: "Quando projetei esta casa, tinha dois princípios fundamentais em mente:"
                      }} 
                    />
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 my-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-3 text-black">
                        <Translate 
                          text={{
                            en: "1. Privacy",
                            es: "1. Privacidad",
                            pt: "1. Privacidade"
                          }} 
                        />
                      </h3>
                      <p>
                        <Translate 
                          text={{
                            en: "All capitalist comfort must be private, including the washing machine. Every room is a self-contained suite with its own bathroom and kitchenette.",
                            es: "Toda comodidad capitalista debe ser privada, incluyendo la lavadora. Cada habitación es una suite independiente con su propio baño y kitchenette.",
                            pt: "Todo conforto capitalista deve ser privado, incluindo a máquina de lavar. Cada quarto é uma suíte independente com seu próprio banheiro e kitchenette."
                          }} 
                        />
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-3 text-black">
                        <Translate 
                          text={{
                            en: "2. Friendship",
                            es: "2. Amistad",
                            pt: "2. Amizade"
                          }} 
                        />
                      </h3>
                      <p>
                        <Translate 
                          text={{
                            en: "Create spaces where you can mingle with your neighbors – the large living room and green roof terrace encourage natural connections and shared experiences.",
                            es: "Crear espacios donde puedas convivir con tus vecinos: la gran sala de estar y la terraza del techo verde fomentan conexiones naturales y experiencias compartidas.",
                            pt: "Criar espaços onde você pode conviver com seus vizinhos – a grande sala de estar e o terraço do telhado verde incentivam conexões naturais e experiências compartilhadas."
                          }} 
                        />
                      </p>
                    </div>
                  </div>
                  <p>
                    <Translate 
                      text={{
                        en: "What I've noticed is that people want to be hospitable when living here. They start inviting others to show the property, to grill meat, and to share tea. It's something so beautiful that we're going to support it – guests are welcome until 10 PM. Still, no parties please.",
                        es: "Lo que he notado es que la gente quiere ser hospitalaria cuando vive aquí. Empiezan a invitar a otros a conocer la propiedad, a hacer asado, y a compartir té. Es algo tan hermoso que lo vamos a apoyar: los huéspedes son bienvenidos hasta las 10 PM. Pero no fiestas, por favor.",
                        pt: "O que percebi é que as pessoas querem ser hospitaleiras quando moram aqui. Começam a convidar outras para mostrar a propriedade, fazer churrasco e compartilhar chá. É algo tão bonito que vamos apoiar – hóspedes são bem-vindos até as 22h. Mas sem festas, por favor."
                      }} 
                    />
                  </p>
                  <p className="text-lg font-medium text-center mt-6 text-gray-800">
                    <Translate 
                      text={{
                        en: "And yes – it all started with a hole.",
                        es: "Y sí – todo comenzó con un agujero.",
                        pt: "E sim – tudo começou com um buraco."
                      }} 
                    />
                  </p>
                </div>
              </div>

              {/* Highlights Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  <Translate text={houseTranslations.highlights.title} />
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="bedroom" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.bedrooms.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.bedrooms.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="thermometer" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.climate.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.climate.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="roof" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.roof.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.roof.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="soundInsulation" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.sound.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.sound.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="droplet" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Water Treatment",
                              es: "Tratamiento de Agua",
                              pt: "Tratamento de Água",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Water-treatment plant with softener",
                              es: "Planta de tratamiento de agua con ablandador",
                              pt: "Estação de tratamento de água com amaciante",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="wifi" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "High-Speed Internet",
                              es: "Internet de Alta Velocidad",
                              pt: "Internet de Alta Velocidade",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "500 Mbit Wi-Fi (fiber-to-home + mesh)",
                              es: "Wi-Fi de 500 Mbit (fibra al hogar + mesh)",
                              pt: "Wi-Fi de 500 Mbit (fibra para casa + mesh)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="home" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Accommodations",
                              es: "Alojamiento",
                              pt: "Acomodação",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "4 bedrooms (2 people each + futon for 2 more with extra payment)",
                              es: "4 dormitorios (2 personas cada uno + futón para 2 más con pago extra)",
                              pt: "4 quartos (2 pessoas cada + futon para mais 2 com pagamento extra)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="sofa" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Common Areas",
                              es: "Áreas Comunes",
                              pt: "Áreas Comuns",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Large shared living room with one big couch and common kitchen",
                              es: "Gran sala de estar compartida con un sofá grande y cocina común",
                              pt: "Grande sala de estar compartilhada com um sofá grande e cozinha comum",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="bed" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Premium Bedding",
                              es: "Ropa de Cama Premium",
                              pt: "Roupa de Cama Premium",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "5-star bedding on dense foam mattresses",
                              es: "Ropa de cama 5 estrellas en colchones de espuma densa",
                              pt: "Roupa de cama 5 estrelas em colchões de espuma densa",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="shower" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Luxury Bathrooms",
                              es: "Baños de Lujo",
                              pt: "Banheiros de Luxo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Glass shower screens, handheld bidet sprayers, washing machine in each",
                              es: "Mamparas de vidrio, duchadores bidet portátiles, lavarropas en cada uno",
                              pt: "Divisórias de vidro no chuveiro, ducha higiênica portátil e máquina de lavar em cada um",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="construction" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Quality Construction",
                              es: "Construcción de Calidad",
                              pt: "Construção de Qualidade",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Solid load-bearing concrete + full insulation; black double-glazed PVC windows",
                              es: "Hormigón estructural sólido + aislamiento completo; ventanas de PVC negro con doble vidriado",
                              pt: "Concreto estrutural sólido + isolamento completo; janelas de PVC preto com vidro duplo",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote Work & Entertainment Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  <Translate text={houseTranslations.remoteWork.title} />
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="ergonomicWorkspace" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Ergonomic Workspace",
                              es: "Espacio de Trabajo Ergonómico",
                              pt: "Espaço de Trabalho Ergonômico",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Desk with high-end ergonomic chair (free for stays > 1 month)",
                              es: "Escritorio con silla ergonómica de alta gama (gratis en estadías > 1 mes)",
                              pt: "Mesa com cadeira ergonômica de alta qualidade (grátis para estadias > 1 mês)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="monitor" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "External Monitor",
                              es: "Monitor Externo",
                              pt: "Monitor Externo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: 'Optional 27" external monitor available on request',
                              es: 'Monitor externo 27" opcional bajo pedido',
                              pt: 'Monitor externo 27" opcional sob pedido',
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="serverRack" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Server Rack",
                              es: "Rack de Servidor",
                              pt: "Rack de Servidor",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Optional: 4U server rack with redundant power for GPUs/AI rigs",
                              es: "Opcional: rack de servidor 4U con energía redundante para GPUs/AI rigs",
                              pt: "Opcional: rack de servidor 4U com energia redundante para GPUs/AI rigs",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="monitor" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Smart TVs",
                              es: "Smart TVs",
                              pt: "Smart TVs",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: '43" Smart TV with Netflix, Max and Disney+ in each bedroom',
                              es: 'Smart TV 43" con Netflix, Max y Disney+ en cada dormitorio',
                              pt: 'Smart TV 43" com Netflix, Max e Disney+ em cada quarto',
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kitchen Amenities Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  <Translate text={houseTranslations.kitchen.title} />
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="refrigerator" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Full-Size Refrigerators",
                              es: "Heladeras de Tamaño Completo",
                              pt: "Geladeiras de Tamanho Completo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "300 L refrigerators in each kitchenette",
                              es: "Heladeras de 300 L en cada kitchenette",
                              pt: "Geladeiras de 300 L em cada kitchenette",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="utensilsCrossed" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Cooking Equipment",
                              es: "Equipos de Cocina",
                              pt: "Equipamentos de Cozinha",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "2-burner vitroceramic cooktop, built-in electric oven, microwave",
                              es: "Anafe vitrocerámico de 2 hornallas, horno eléctrico empotrado, microondas",
                              pt: "Cooktop vitrocerâmico de 2 bocas, forno elétrico embutido, micro-ondas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="coffee" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Coffee & Beverages",
                              es: "Café y Bebidas",
                              pt: "Café e Bebidas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Filter coffee maker, electric kettle",
                              es: "Cafetera de filtro, pava eléctrica",
                              pt: "Cafeteira de filtro, chaleira elétrica",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="utensilsCrossed" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Professional Cookware",
                              es: "Utensilios Profesionales",
                              pt: "Utensílios Profissionais",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Complete set of chef-quality stainless steel pots and kitchen utensils",
                              es: "Juego completo de ollas y utensilios de cocina de acero de calidad chef",
                              pt: "Conjunto completo de panelas e utensílios de cozinha de aço qualidade chef",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout & Rooms Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.layout.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="home" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "4 bedrooms",
                              es: "4 dormitorios",
                              pt: "4 quartos",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Comfortable accommodations for up to 10 guests. Option for two twin beds instead of king upon request (subject to availability). Blackout curtains in all windows",
                              es: "Alojamiento cómodo para hasta 10 huéspedes. Opción de dos camas twin en lugar de king bajo pedido (sujeto a disponibilidad). Cortinas blackout en todas las ventanas",
                              pt: "Acomodação confortável para até 10 hóspedes. Opção de duas camas de solteiro em vez de king mediante solicitação (sujeito a disponibilidade). Cortinas blackout em todas as janelas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="shower" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Private bathroom",
                              es: "Baño privado",
                              pt: "Banheiro privativo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Glass screen, bidet sprayer, washing machine",
                              es: "Mampara de vidrio, duchador bidet, lavarropas",
                              pt: "Divisória de vidro, ducha higiênica, máquina de lavar",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="utensilsCrossed" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Kitchenette",
                              es: "Kitchenette",
                              pt: "Kitchenette",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "300 L fridge, stove, oven, microwave, quality cookware",
                              es: "Heladera de 300 L, anafe, horno, microondas, utensilios de calidad",
                              pt: "Geladeira de 300 L, fogão, forno, micro-ondas, utensílios de qualidade",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="shower" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Extra shared bathroom",
                              es: "Baño compartido adicional",
                              pt: "Banheiro compartilhado adicional",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Additional convenience for guests",
                              es: "Comodidad adicional para los huéspedes",
                              pt: "Conveniência adicional para os hóspedes",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Areas Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.sharedAreas.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="sofa" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Living Room",
                              es: "Sala de Estar",
                              pt: "Sala de Estar",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Large shared living room with one big couch",
                              es: "Gran sala de estar compartida con un sofá grande",
                              pt: "Grande sala de estar compartilhada com um sofá grande",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="utensilsCrossed" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Common Kitchen",
                              es: "Cocina Común",
                              pt: "Cozinha Comum",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Fully equipped for group meals and gatherings",
                              es: "Completamente equipada para comidas grupales y reuniones",
                              pt: "Totalmente equipada para refeições em grupo e reuniões",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="plants" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Green Roof",
                              es: "Techo Verde",
                              pt: "Telhado Verde",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "With grill and outdoor seating. The second floor terrace can be reserved as private space (separate payment)",
                              es: "Con parrilla y asientos al aire libre. La terraza del segundo piso puede reservarse como espacio privado (pago aparte)",
                              pt: "Com churrasqueira e assentos ao ar livre. O terraço do segundo andar pode ser reservado como espaço privado (pagamento separado)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-Stay Work Package Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.longStay.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="calendar" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Monthly discount",
                              es: "Descuento mensual",
                              pt: "Desconto mensal",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Special rates for extended stays",
                              es: "Tarifas especiales para estadías prolongadas",
                              pt: "Tarifas especiais para estadias prolongadas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="sofa" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Ergonomic chair",
                              es: "Silla ergonómica",
                              pt: "Cadeira ergonômica",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Comfortable seating for productive work sessions",
                              es: "Asiento cómodo para sesiones de trabajo productivas",
                              pt: "Assento confortável para sessões de trabalho produtivas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="monitor" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Optional computer monitor",
                              es: "Monitor de computadora opcional",
                              pt: "Monitor de computador opcional",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Available upon request for remote work",
                              es: "Disponible bajo pedido para trabajo remoto",
                              pt: "Disponível sob solicitação para trabalho remoto",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="calendar" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Fixed monthly rent",
                              es: "Alquiler mensual fijo",
                              pt: "Aluguel mensal fixo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "For 12 months + (not adjusted for high/low season)",
                              es: "Para 12 meses + (no ajustado por temporada alta/baja)",
                              pt: "Para 12 meses + (não ajustado para alta/baixa temporada)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaning Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.cleaning.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="sparkles" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Weekly cleaning of common areas included",
                              es: "Limpieza semanal de áreas comunes incluida",
                              pt: "Limpeza semanal de áreas comuns incluída",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Regular maintenance to keep shared spaces pristine",
                              es: "Mantenimiento regular para mantener los espacios compartidos impecables",
                              pt: "Manutenção regular para manter os espaços compartilhados impecáveis",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="sparkles" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Extra in-room cleaning",
                              es: "Limpieza extra en habitación",
                              pt: "Limpeza extra no quarto",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Available on request for long stays",
                              es: "Disponible bajo pedido para estadías largas",
                              pt: "Disponível sob solicitação para estadias longas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* House Rules Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.houseRules.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="quiet" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Quiet Environment",
                              es: "Ambiente Tranquilo",
                              pt: "Ambiente Tranquilo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "No music audible outside your room",
                              es: "No música audible fuera de tu habitación",
                              pt: "Sem música audível fora do seu quarto",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="noParties" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "No Parties",
                              es: "No Fiestas",
                              pt: "Sem Festas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "People-counting cameras in common areas",
                              es: "Cámaras contadoras de personas en áreas comunes",
                              pt: "Câmeras contadoras de pessoas em áreas comuns",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="cleanAreas" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Clean Common Areas",
                              es: "Mantener Áreas Comunes Limpias",
                              pt: "Manter Áreas Comuns Limpas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Leave common kitchen and grill clean",
                              es: "Dejar la cocina común y parrilla limpias",
                              pt: "Deixar a cozinha comum e churrasqueira limpas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="pets" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Pets Allowed",
                              es: "Mascotas Permitidas",
                              pt: "Animais de Estimação Permitidos",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Hypoallergenic cleaning fee + US $300 deposit",
                              es: "Tarifa de limpieza hipoalergénica + depósito de US $300",
                              pt: "Taxa de limpeza hipoalergênica + depósito de US $300",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="checkIn" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Flexible Check-in",
                              es: "Check-in Flexible",
                              pt: "Check-in Flexível",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Arrive early if free / smart-lock access",
                              es: "Llegá temprano si está libre / acceso con cerradura inteligente",
                              pt: "Chegue cedo se estiver livre / acesso com fechadura inteligente",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="checkOut" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Flexible Check-out",
                              es: "Check-out Flexible",
                              pt: "Check-out Flexível",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Stay late if no same-day check-in",
                              es: "Quedate hasta tarde si no hay check-in el mismo día",
                              pt: "Fique até tarde se não houver check-in no mesmo dia",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="utilities" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Utilities Included",
                              es: "Servicios Incluidos",
                              pt: "Serviços Incluídos",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Heating, air, internet, electricity, water included",
                              es: "Calefacción, aire, internet, electricidad, agua incluidos",
                              pt: "Aquecimento, ar, internet, eletricidade, água incluídos",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability & Rates Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.availability.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="yearRound" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Year-Round Availability",
                              es: "Disponibilidad Todo el Año",
                              pt: "Disponibilidade o Ano Todo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Open all year",
                              es: "Abierto todo el año",
                              pt: "Aberto o ano todo",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="highSeason" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "High Season",
                              es: "Temporada Alta",
                              pt: "Alta Temporada",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "December – February",
                              es: "Diciembre – Febrero",
                              pt: "Dezembro – Fevereiro",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="bestRates" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Best Rates",
                              es: "Mejores Tarifas",
                              pt: "Melhores Tarifas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "April – October (my favorites: Sept – Nov)",
                              es: "Abril – Octubre (mis favoritos: Sept – Nov)",
                              pt: "Abril – Outubro (meus favoritos: Set – Nov)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="minStay" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Minimum Stay",
                              es: "Estadía Mínima",
                              pt: "Estadia Mínima",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "2 days during low season",
                              es: "2 días durante temporada baja",
                              pt: "2 dias durante baixa temporada",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Win10Icon name="longTerm" className="mr-3 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Long-Term Stays",
                              es: "Estadías de Largo Plazo",
                              pt: "Estadias de Longo Prazo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "12 months + stays enjoy fixed monthly rent",
                              es: "Estadías de 12 meses + disfrutan alquiler mensual fijo",
                              pt: "Estadias de 12 meses + desfrutam de aluguel mensal fixo",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">
                  <Translate text={houseTranslations.bookYourStay.title} />
                </h3>
                <p className="text-gray-700 mb-4">
                  <Translate text={houseTranslations.bookYourStay.description} />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Translate text={houseTranslations.bookYourStay.button} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      
      <ImageLightbox
        images={historyImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  )
}
