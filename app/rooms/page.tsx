import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { ImageGallery } from "@/components/image-gallery"
import { roomsTranslations } from "@/translations/rooms"
import { RoomFeatureIcon } from "@/components/room-feature-icon"

export default function Rooms() {
  const gardenSuiteImages = [
    { src: "/photo/giardino/giardino1.jpg", alt: "Giardino Suite - View of living area and bedroom" },
    { src: "/photo/giardino/giardino2.jpg", alt: "Giardino Suite - Kitchen with full-size refrigerator" },
    { src: "/photo/giardino/giardino3.jpg", alt: "Giardino Suite - Dining area with garden view" },
    { src: "/photo/giardino/giardino4.jpg", alt: "Giardino Suite - Additional view" },
    { src: "/photo/giardino/giardino5.jpg", alt: "Giardino Suite - Bedroom view" },
    { src: "/photo/exterior/exterior4.jpg", alt: "Giardino Suite - Exterior view" },
  ]

  const terraceSuiteImages = [
    { src: "/photo/terrazzo/terrazzo1.jpg", alt: "Terrace Suite - Large Private Terrace" },
    { src: "/photo/terrazzo/terrazzo2.jpg", alt: "Terrace Suite - Dining Area" },
    { src: "/photo/terrazzo/terrazzo3.jpg", alt: "Terrace Suite - Bedroom" },
    { src: "/photo/terrazzo/terrazzo4.jpg", alt: "Terrace Suite - Kitchen Area" },
    { src: "/photo/terrazzo/terrazzo5.jpg", alt: "Terrace Suite - Living Space" },
    { src: "/photo/terrazzo/terrazzo6.jpg", alt: "Terrace Suite - Additional View" },
  ]

  const forestSuiteImages = [
    { src: "/photo/paraiso/paraiso1.jpg", alt: "Forest-View Suite Kitchen and Dining" }, // Was Living Room
    { src: "/photo/paraiso/paraiso7.jpg", alt: "Forest-View Suite Bedroom" }, // Moved from 5th, replaced paraiso2
    { src: "/photo/paraiso/paraiso3.jpg", alt: "Forest-View Suite Living Area with Sofa" }, // Alt text corrected
    { src: "/photo/paraiso/paraiso4.jpg", alt: "Forest-View Suite Bathroom" },
    { src: "/photo/paraiso/paraiso2.jpg", alt: "Forest-View Suite Living Area and Window View" }, // Moved from 2nd
    // { src: "/photo/paraiso/paraiso6.jpg", alt: "Forest-View Suite Dining Area" }, // Remains removed
  ]

  const penthouseSuiteImages = [
    { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penthouse_corner%20window-m9Wog22hf421cCpCzob9Pc2GGzSUJL.webp", alt: "Penthouse Suite - Corner Windows with Forest View" },
    { src: "/photo/exterior/exterior5.jpg", alt: "Penthouse Suite - Sundeck with Forest View" },
  ]

  const livingRoomImages = [
    { src: "/photo/living/living3.jpg", alt: "Living Room - Seating Area" },
    { src: "/photo/living/living1.jpg", alt: "Living Room - Common Area with Forest View" },
    { src: "/photo/living/File 24-04-2025, 10 29 16 PM-Edit.jpg", alt: "Living Room - Dining and Kitchen Area" },
    { src: "/photo/living/living4.jpg", alt: "Living Room - Stairs and Access" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <Translate text={roomsTranslations.pageTitle} />
              </h1>
              <p className="text-lg text-gray-700 mb-12">
                <Translate text={roomsTranslations.pageDescription} /> Perfectas para <Link href="/alquiler-carilo" className="text-gray-700 no-underline hover:text-gray-600">alquiler</Link> en <Link href="/carilo-alquiler" className="text-gray-700 no-underline hover:text-gray-600">Cariló</Link>.
              </p>

              <div className="space-y-16">
                {/* Terrace Suite (Terrazo) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">
                      <Translate text={roomsTranslations.terraceSuite.title} />
                    </h2>
                    <a
                      href="https://book.ilbuco.com.ar/listing/110801"
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Translate text={{
                        en: "Book Terrezzo",
                        es: "Reservar Terrezzo",
                        pt: "Reservar Terrezzo"
                      }} />
                    </a>
                  </div>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.terraceSuite.subtitle} /> Ideal como <Link href="/casas-en-carilo-alquiler" className="text-gray-600 no-underline hover:text-gray-500">casa</Link> de lujo.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <RoomFeatureIcon name="flower" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "40 m² shaded terrace with built-in planters",
                            es: "Terraza sombreada de 40 m² con jardineras incorporadas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="window" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Open-plan layout: sleep, cook, work in one space",
                            es: "Diseño de planta abierta: dormir, cocinar, trabajar en un espacio",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="desk" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Dedicated indoor living/work zone, but the terrace workspace delivers a productivity boost thanks to fresh air.",
                            es: "Zona interior dedicada para vivir/trabajar, pero el espacio de trabajo en la terraza brinda un impulso de productividad gracias al aire fresco.",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="window" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Abundant natural light throughout the day",
                            es: "Abundante luz natural durante todo el día",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="flower" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Perfect for plant lovers and outdoor enthusiasts",
                            es: "Perfecto para amantes de las plantas y entusiastas del aire libre",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="sofa" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={terraceSuiteImages} />

                </div>

                {/* Penthouse Suite */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">
                      <Translate text={roomsTranslations.penthouseSuite.title} />
                    </h2>
                    <a
                      href="https://book.ilbuco.com.ar/listing/110803"
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Translate text={{
                        en: "Book Penthouse",
                        es: "Reservar Penthouse",
                        pt: "Reservar Penthouse"
                      }} />
                    </a>
                  </div>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.penthouseSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <RoomFeatureIcon name="flower" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Top-floor suite with direct terrace access",
                            es: "Suite en planta alta con acceso directo a la terraza",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="flower" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Optional exclusive-use terrace (extra fee)",
                            es: "Terraza de uso exclusivo opcional (cargo extra)",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="padlock" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Our most spacious and luxurious accommodation",
                            es: "Nuestro alojamiento más espacioso y lujoso",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="sofa" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={penthouseSuiteImages} />

                </div>

                {/* Garden Suite (Giardino) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">
                      <Translate text={roomsTranslations.gardenSuite.title} />
                    </h2>
                    <a
                      href="https://book.ilbuco.com.ar/listing/110800"
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Translate text={{
                        en: "Book Giardino",
                        es: "Reservar Giardino",
                        pt: "Reservar Giardino"
                      }} />
                    </a>
                  </div>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.gardenSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <RoomFeatureIcon name="wheelchair" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Step-free access for wheelchairs, strollers, and heavy luggage.",
                            es: "Acceso sin escalones para sillas de ruedas, cochecitos y equipaje pesado.",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="window" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Corner window facing garden, dedicated entry hall",
                            es: "Ventana en esquina con vista al jardín, hall de entrada dedicado",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="table-and-chair" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Window-side dining/work table, futon for extra bed (fee)",
                            es: "Mesa de comedor/trabajo junto a la ventana, futón para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={gardenSuiteImages} />

                </div>

                {/* Forest-View Suite (Paraiso) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">
                      <Translate text={roomsTranslations.forestSuite.title} />
                    </h2>
                    <a
                      href="https://book.ilbuco.com.ar/listing/110802"
                      className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Translate text={{
                        en: "Book Paraiso",
                        es: "Reservar Paraíso",
                        pt: "Reservar Paraíso"
                      }} />
                    </a>
                  </div>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.forestSuite.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                    <li className="flex items-start">
                      <RoomFeatureIcon name="window" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Huge 3 m-tall corner window overlooking the pine forest",
                            es: "Enorme ventana en esquina de 3 m de altura con vista al bosque de pinos",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="desk" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Separate bedroom + living/work room",
                            es: "Dormitorio separado + sala de estar/trabajo",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="padlock" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Enhanced privacy with distinct living areas",
                            es: "Mayor privacidad con áreas de estar diferenciadas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="padlock" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Enhanced privacy with distinct living areas",
                            es: "Mayor privacidad con áreas de estar diferenciadas",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="twin-bed" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Twin beds that can be joined to form a queen-size bed",
                            es: "Camas twin que pueden unirse para formar una cama queen-size",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="sofa" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Futon available for extra bed (fee)",
                            es: "Futón disponible para cama extra (con cargo)",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={forestSuiteImages} />

                </div>

                {/* All Suites Include */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">
                    <Translate text={roomsTranslations.allSuitesInclude.title} />
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <RoomFeatureIcon name="wifi" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.internet} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="thermometer" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.heating} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="utensils-crossed" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.kitchen} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="shower" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.bathroom} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="bed" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.mattress} />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="lamp-desk" className="mr-3 mt-1 flex-shrink-0" />
                      <span>
                        <Translate text={roomsTranslations.allSuitesInclude.chair} />
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Living Room */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <Translate text={roomsTranslations.livingRoom.title} />
                  </h2>
                  <p className="text-gray-600 mb-6">
                    <Translate text={roomsTranslations.livingRoom.subtitle} />
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
                     <li className="flex items-start">
                      <RoomFeatureIcon name="window" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Wall-to-wall, floor-to-ceiling front windows overlooking the surrounding pine forest",
                            es: "Grandes ventanales con vistas al bosque de pinos circundante",
                            pt: "Grandes janelas oferecendo vista da floresta de pinheiros circundante",
                          }}
                        />
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="sofa" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "4m long modular sofa. It feels nothing like IKEA and the secret is expensive foam.",
                            es: "Sofá modular de 4m. No se siente como IKEA y el secreto es la espuma cara.",
                            pt: "Sofá modular de 4m. Não parece nada com IKEA e o segredo é a espuma cara.",
                          }}
                        />
                      </span>
                    </li>
                   
                    <li className="flex items-start">
                      <RoomFeatureIcon name="users" className="mr-3 mt-1" />
                      <span>
                        <span>
                          <Translate
                            text={{
                              en: "Large full size kitchen with cooking plate, oven, and ",
                              es: "Cocina grande y completa con placa de cocina, horno y nevera ",
                              pt: "Cozinha grande e completa com fogão, forno e geladeira ",
                            }}
                          />
                          <strong>side by side</strong>
                          <Translate
                            text={{
                              en: " fridge",
                              es: "",
                              pt: "",
                            }}
                          />
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RoomFeatureIcon name="thermometer" className="mr-3 mt-1" />
                      <span>
                        <Translate
                          text={{
                            en: "Climate controlled for year-round comfort",
                            es: "Climatizado para comodidad durante todo el año",
                            pt: "Climatizado para conforto durante todo o ano",
                          }}
                        />
                      </span>
                    </li>
                  </ul>

                  <ImageGallery images={livingRoomImages} />

                </div>

                <div className="mt-8">
                  <a
                    href="https://book.ilbuco.com.ar/"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Translate text={roomsTranslations.bookYourStay.button} />
                  </a>
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
