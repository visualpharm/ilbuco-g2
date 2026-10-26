"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { HeroGallery } from "@/components/hero-gallery"
import { HouseHighlights } from "@/components/house-highlights"
import { BookStayCta } from "@/components/book-stay-cta"
import { houseTranslations } from "@/translations/house"
import { translations } from "@/translations/common"
import { Win10Icon } from "@/components/win10-icon"
import { ImageLightbox } from "@/components/image-lightbox"

export function TheHouseContent() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const historyImages = [
    {
      src: "/photo/history/construction-site-before-building.jpg",
      alt: "When Il Buco was still the hole"
    },
    {
      src: "/photo/history/natural-hole-excavation.jpg", 
      alt: "When Il Buco was still the hole"
    },
    {
      src: "/photo/history/deep-hole-construction.jpg",
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
                <Translate text={{
                  en: "Coliving House South America",
                  es: "Casa Cariló Alquiler",
                  pt: "Casa Coliving América do Sul"
                }} />
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
                      pt: "Sobre Il Buco",
                      ru: "О Il Buco"
                    }}
                  />
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <p className="text-lg leading-relaxed">
                    <Translate
                      text={{
                        en: "Il Buco is a newly built, premium coliving house constructed on the site of a 4-meter deep natural hole – hence the name, which means 'The Hole' in Italian.",
                        es: "Il Buco es una casa de coliving premium recién construida en el sitio de un agujero natural de 4 metros de profundidad, de ahí el nombre, que significa 'El Agujero' en italiano.",
                        pt: "Il Buco é uma casa de coliving premium recém-construída no local de um buraco natural de 4 metros de profundidade – daí o nome, que significa 'O Buraco' em italiano.",
                        ru: "Il Buco — премиальный дом построенный на месте природной ямы глубиной 4 метра. Отсюда и название, которое по-итальянски означает 'Яма'."
                      }}
                    />
                  </p>
                  
                  <div className="my-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {historyImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="group relative overflow-hidden rounded-lg cursor-zoom-in"
                        >
                          <Image 
                            src={image.src}
                            alt={image.alt}
                            width={300}
                            height={225}
                            className="object-cover w-full h-48 group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-base text-gray-700 mt-3">
                      <Translate
                        text={{
                          en: "When Il Buco was still the hole",
                          es: "Cuando Il Buco era todavía el agujero",
                          pt: "Quando Il Buco ainda era o buraco",
                          ru: "Когда Il Buco ещё был ямой"
                        }}
                      />
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">
                    <Translate
                      text={{
                        en: "Il Buco Principles",
                        es: "Principios de Il Buco",
                        pt: "Princípios do Il Buco",
                        ru: "Принципы Il Buco"
                      }}
                    />
                  </h3>
                  <p>
                    <Translate
                      text={{
                        en: "When I designed this house, I had two key principles in mind:",
                        es: "Cuando diseñé esta casa, tenía dos principios clave en mente:",
                        pt: "Quando projetei esta casa, tinha dois princípios fundamentais em mente:",
                        ru: "Когда я проектировал этот дом, у меня было два ключевых принципа:"
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
                            pt: "1. Privacidade",
                            ru: "1. Приватность"
                          }}
                        />
                      </h3>
                      <p>
                        <Translate
                          text={{
                            en: "All capitalist comfort must be private, including the washing machine. Every room is a self-contained suite with its own bathroom and kitchenette.",
                            es: "Toda comodidad capitalista debe ser privada, incluyendo la lavadora. Cada habitación es una suite independiente con su propio baño y kitchenette.",
                            pt: "Todo conforto capitalista deve ser privado, incluindo a máquina de lavar. Cada quarto é uma suíte independente com seu próprio banheiro e kitchenette.",
                            ru: "Все капиталистические удобства должны быть приватными, включая стиральную машину. Каждый номер — это автономный сьют со своей ванной и кухней."
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
                            pt: "2. Amizade",
                            ru: "2. Дружба"
                          }}
                        />
                      </h3>
                      <p>
                        <Translate
                          text={{
                            en: "Create spaces where you can mingle with your neighbors – the large living room and green roof terrace encourage natural connections and shared experiences.",
                            es: "Crear espacios donde puedas convivir con tus vecinos: la gran sala de estar y la terraza del techo verde fomentan conexiones naturales y experiencias compartidas.",
                            pt: "Criar espaços onde você pode conviver com seus vizinhos – a grande sala de estar e o terraço do telhado verde incentivam conexões naturais e experiências compartilhadas.",
                            ru: "Создавать пространства где можно общаться с соседями — большая гостиная и зелёная крыша-терраса способствуют естественным связям и общему опыту."
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
                        pt: "O que percebi é que as pessoas querem ser hospitaleiras quando moram aqui. Começam a convidar outras para mostrar a propriedade, fazer churrasco e compartilhar chá. É algo tão bonito que vamos apoiar – hóspedes são bem-vindos até as 22h. Mas sem festas, por favor.",
                        ru: "Я заметил что люди становятся гостеприимными живя здесь. Они начинают приглашать других показать дом, пожарить мясо, попить чай. Это так прекрасно что мы это поддерживаем — гости приветствуются до 22:00. Но без вечеринок, пожалуйста."
                      }}
                    />
                  </p>
                  <div className="mt-8">
                    <p className="text-lg font-medium text-center mb-4 text-gray-800">
                      <Translate
                        text={{
                          en: "And yes – it all started with a hole.",
                          es: "Y sí – todo comenzó con un agujero.",
                          pt: "E sim – tudo começou com um buraco.",
                          ru: "И да — всё началось с ямы."
                        }}
                      />
                    </p>
                    <Image 
                      src="/photo/history/altimetria.jpg"
                      alt="Site altimetry showing the natural hole"
                      width={800}
                      height={400}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights/Amenities Section */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-10 text-center">
                  <Translate text={translations.home.highlights.title} />
                </h2>

                <HouseHighlights showAllFeatures={false} narrow />
              </div>

              <BookStayCta />
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