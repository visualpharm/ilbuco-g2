"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { ImageGallery } from "@/components/image-gallery"
import { BookStayCta } from "@/components/book-stay-cta"
import { locationTranslations as t } from "@/translations/location"

const ICON_FILTER =
  "brightness(0) saturate(100%) invert(25%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)"
const MAPS_URL = "https://maps.app.goo.gl/McARi7xe1wzBr64P9"
const BLOB = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com"

const areaPhotos = [
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2029%2015%20PM.jpeg-zy2r0LsIkjdnZ0czOZgscZzzXDh2gm.png`, alt: "Cariló beach with waves and cloudy sky" },
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2034%2051%20PM%20%286%29%20%281%29.jpeg-JR5Q4JMSI3cscyNAKUeIUqt9EVdyee.png`, alt: "Lifeguard station on Cariló beach" },
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2029%2015%20PM%20%281%29.jpeg-VxGhS3R27n0nduSRtdSZvOOOHslx1M.png`, alt: "Modern concrete villa at night in Cariló" },
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2029%2015%20PM%20%282%29%20%281%29.jpeg-hipfIxZRDSXb3rP4qb5RfARL0KDKWV.png`, alt: "Pine trees at night in Cariló" },
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2034%2051%20PM%20%281%29%20%281%29.jpeg-QJVUPiAglBTZSdYJtL9gt9OXe8R7g8.png`, alt: "Coastal vegetation and pine trees in Cariló" },
  { src: `${BLOB}/File%2024-04-2025%2C%2010%2034%2051%20PM%20%288%29.jpeg-EZAYZRstt3u4q8pxErGu10hgJeiOHa.png`, alt: "Pine trees silhouette at dusk in Cariló" },
]

interface LocationContentProps {
  /** Invisible SEO links per language (docs/rules/seo.md). */
  introTail?: ReactNode
  carTail?: ReactNode
}

function Way({ icon, title, note, children }: { icon: string; title: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Image src={`/icons/icons8/${icon}`} alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" style={{ filter: ICON_FILTER }} />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
          {note && <span className="font-normal text-gray-700"> · {note}</span>}
        </h3>
        <div className="text-base text-gray-700">{children}</div>
      </div>
    </li>
  )
}

/** /location, one layout for every language. */
export function LocationContent({ introTail, carTail }: LocationContentProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                <Translate text={t.pageTitle} />
              </h1>
              <p className="mb-8 text-lg text-gray-700">
                <Translate text={t.pageDescription} />
                {introTail}
              </p>

              <div className="relative mb-4 h-[400px] w-full overflow-hidden rounded-xl md:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.1234567890123!2d-56.9918!3d-37.1656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959c1e5c5a8f9c5f%3A0x5e5a5e5a5e5a5e5a!2sParaiso%20324%2C%20B7167%20Caril%C3%B3%2C%20Buenos%20Aires%20Province%2C%20Argentina!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Il Buco, Paraiso 324, Cariló"
                  className="absolute inset-0"
                />
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-12 inline-flex min-h-[44px] items-start gap-3 text-lg text-blue-700 hover:text-blue-900"
              >
                <Image src="/icons/icons8/marker.png" alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" />
                <span>Paraiso 324, Cariló (7167), Partido de Pinamar, Buenos Aires</span>
              </a>

              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                <Translate text={t.gettingHere.title} />
              </h2>
              <ul className="mb-12 space-y-6">
                <Way icon="car-sf.png" title={<Translate text={t.gettingHere.car.title} />}>
                  <p>
                    <Translate text={t.gettingHere.car.description} />
                    {carTail}
                  </p>
                </Way>
                <Way icon="bus.png" title={<Translate text={t.gettingHere.bus.title} />} note={<Translate text={t.gettingHere.bus.recommended} />}>
                  <p>
                    <Translate text={t.gettingHere.bus.description} />
                  </p>
                  <div className="mt-3">
                    <Image
                      src={`${BLOB}/cama_ejecutivo.jpg-nW5M2EciGfoaFbCppu2LS7uEYekT5e.jpeg`}
                      alt="Cama Ejecutivo bus interior"
                      height={160}
                      width={240}
                      className="rounded-lg object-cover"
                    />
                    <p className="mt-2">
                      <Translate text={t.gettingHere.bus.tip} />
                    </p>
                  </div>
                </Way>
                <Way
                  icon="steering-wheel.png"
                  title={<Translate text={{ en: "Private or shared transfer", es: "Traslado privado o compartido", pt: "Transfer privado ou compartilhado", ru: "Частный или общий трансфер" }} />}
                >
                  <p>
                    <Translate
                      text={{
                        en: "By car or minibus, bookable via InDrive or MercadoLibre.",
                        es: "En auto o minibus se puede reservar vía InDrive o MercadoLibre.",
                        pt: "De carro ou micro-ônibus, com reserva pelo InDrive ou MercadoLibre.",
                        ru: "На машине или микроавтобусе, бронируется через InDrive или MercadoLibre.",
                      }}
                    />
                  </p>
                </Way>
                <Way icon="train.png" title={<Translate text={{ en: "Train", es: "Tren", pt: "Trem", ru: "Поезд" }} />}>
                  <p>
                    <Translate
                      text={{
                        en: "There is a daily train from Buenos Aires to Pinamar, but tickets sell out minutes after release – not a practical option.",
                        es: "Hay un tren diario desde Buenos Aires a Pinamar, pero los boletos se agotan minutos después de salir a la venta – no es una opción práctica.",
                        pt: "Há um trem diário de Buenos Aires a Pinamar, mas as passagens esgotam minutos depois de abrir a venda – não é uma opção prática.",
                        ru: "Из Буэнос-Айреса в Пинамар ходит ежедневный поезд, но билеты раскупают за минуты после начала продаж – вариант непрактичный.",
                      }}
                    />
                  </p>
                </Way>
                <Way icon="airplane.png" title={<Translate text={{ en: "Flights", es: "Vuelos", pt: "Voos", ru: "Самолёт" }} />}>
                  <p>
                    <Translate
                      text={{
                        en: "There are no regular flights since 2023.",
                        es: "No hay vuelos regulares desde 2023.",
                        pt: "Não há voos regulares desde 2023.",
                        ru: "Регулярных рейсов нет с 2023 года.",
                      }}
                    />
                  </p>
                </Way>
              </ul>

              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                <Translate text={{ en: "Getting around", es: "Moverse por la zona", pt: "Como se locomover", ru: "Как передвигаться" }} />
              </h2>
              <ul className="mb-12 list-disc space-y-2 pl-6 text-lg text-gray-700">
                <li>
                  <Translate
                    text={{
                      en: "Uber, Didi, and local taxi with an app (iPhone / Android).",
                      es: "Uber, Didi, y taxi local con una app (iPhone / Android).",
                      pt: "Uber, Didi e táxi local com aplicativo (iPhone / Android).",
                      ru: "Uber, Didi и местное такси с приложением (iPhone / Android).",
                    }}
                  />
                </li>
                <li>
                  <Translate
                    text={{
                      en: "Food and courier app: PedidosYa",
                      es: "App de comida y delivery: PedidosYa",
                      pt: "App de comida e entregas: PedidosYa",
                      ru: "Доставка еды и курьеры: PedidosYa",
                    }}
                  />
                </li>
              </ul>

              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                <Translate text={{ en: "Area photos", es: "Fotos de la zona", pt: "Fotos da região", ru: "Фото окрестностей" }} />
              </h2>
              <ImageGallery images={areaPhotos} layout="squares" className="mb-12" />

              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                <Translate text={t.aboutCarilo.title} />
              </h2>
              <p className="mb-4 text-lg text-gray-700">
                <Translate text={t.aboutCarilo.description} />
              </p>
              <p className="mb-12 text-lg text-gray-700">
                <a href="https://es.wikipedia.org/wiki/Caril%C3%B3" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  Wikipedia
                </a>{" "}
                <Translate
                  text={{
                    en: "(co-written by Il Buco's founder)",
                    es: "(co-escrito por el fundador de Il Buco)",
                    pt: "(coescrito pelo fundador do Il Buco)",
                    ru: "(соавтор статьи — основатель Il Buco)",
                  }}
                />
              </p>

              <BookStayCta />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
