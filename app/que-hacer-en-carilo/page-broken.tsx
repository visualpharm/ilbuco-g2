"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  ArrowRight,
  Waves,
  TreesIcon as Tree,
  Camera,
  Bike,
  Sunrise,
  User,
  Car,
  MapPin,
} from "lucide-react"

// Cariló gallery images - the renamed photos from /public/photo/carilo
const cariloGalleryImages = [
  {
    src: "/photo/carilo/carilo-villa-nocturna-bosque-pinos.jpg",
    alt: "Villa IL BUCO iluminada de noche entre bosque de pinos en Cariló",
    title: "Villa Nocturna en Bosque de Pinos",
  },
  {
    src: "/photo/carilo/carilo-villa-iluminada-noche-bosque.jpg",
    alt: "Casa moderna iluminada por la noche en el bosque de Cariló",
    title: "Villa Iluminada en Bosque",
  },
  {
    src: "/photo/carilo/carilo-bosque-pinos-nocturno.jpg",
    alt: "Bosque de pinos de Cariló iluminado durante la noche",
    title: "Bosque de Pinos Nocturno",
  },
  {
    src: "/photo/carilo/carilo-trabajo-remoto-terraza.jpg",
    alt: "Espacio de trabajo remoto en terraza con vista al bosque en Cariló",
    title: "Trabajo Remoto en Terraza",
  },
  {
    src: "/photo/carilo/carilo-paisajismo-natural-plantas.jpg",
    alt: "Paisajismo natural con plantas nativas en Cariló",
    title: "Paisajismo Natural",
  },
  {
    src: "/photo/carilo/carilo-jardin-paisajismo-natural-plantas.jpg",
    alt: "Jardín con paisajismo natural y plantas en Cariló",
    title: "Jardín Natural",
  },
  {
    src: "/photo/carilo/carilo-playa-tormenta-atlantico.jpg",
    alt: "Playa de Cariló durante tormenta con cielo dramático en el Atlántico",
    title: "Playa con Tormenta",
  },
  {
    src: "/photo/carilo/carilo-playa-salvavidas-costa-atlantica.jpg",
    alt: "Torre de salvavidas en la playa de Cariló, costa atlántica",
    title: "Torre de Salvavidas",
  },
  {
    src: "/photo/carilo/carilo-playa-persona-caminando-oceano.jpg",
    alt: "Persona caminando por la playa de Cariló frente al océano Atlántico",
    title: "Caminata en la Playa",
  },
  {
    src: "/photo/carilo/carilo-playa-caminata-ejercicio-costa.jpg",
    alt: "Actividad de caminata y ejercicio en la costa de Cariló",
    title: "Ejercicio en la Costa",
  },
  {
    src: "/photo/carilo/carilo-playa-relax-manta-costa.jpg",
    alt: "Momento de relax con manta en la playa de Cariló",
    title: "Relax en la Playa",
  },
  {
    src: "/photo/carilo/carilo-playa-olas-arena-costa-atlantica.jpg",
    alt: "Olas y arena en la costa atlántica de Cariló",
    title: "Olas y Arena",
  },
  {
    src: "/photo/carilo/carilo-olas-playa-azul-surf.jpg",
    alt: "Olas azules perfectas para surf en la playa de Cariló",
    title: "Olas para Surf",
  },
  {
    src: "/photo/carilo/carilo-torre-salvavidas-playa.jpg",
    alt: "Torre de salvavidas en la extensa playa de Cariló",
    title: "Torre de Salvavidas",
  },
  {
    src: "/photo/carilo/carilo-perros-mascotas-alojamiento.jpg",
    alt: "Alojamiento pet-friendly para perros y mascotas en Cariló",
    title: "Alojamiento Pet-Friendly",
  },
]

export default function QueHacerEnCarilo() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return

      if (e.key === "Escape") {
        setSelectedImage(null)
      } else if (e.key === "ArrowLeft") {
        setSelectedImage((prev) => (prev === null ? null : prev === 0 ? cariloGalleryImages.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) => (prev === null ? null : prev === cariloGalleryImages.length - 1 ? 0 : prev + 1))
      }
    }

    if (selectedImage !== null) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === 0 ? cariloGalleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === cariloGalleryImages.length - 1 ? 0 : prev + 1))
  }

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
                  <span className="text-gray-600">Qué Hacer</span> en Cariló
                </h1>
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Índice de Contenidos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href="#playas-naturaleza" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                      <Waves className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-800">Playas y Naturaleza</span>
                    </a>
                    <a href="#deportes-fitness" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
                      <span className="h-5 w-5 text-green-600 mr-3">🏃</span>
                      <span className="text-sm font-medium text-gray-800">Deportes y Fitness</span>
                    </a>
                    <a href="#comida-restaurantes" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                      <span className="h-5 w-5 text-orange-600 mr-3">🍽️</span>
                      <span className="text-sm font-medium text-gray-800">Comida y Restaurantes</span>
                    </a>
                    <a href="#cuando-llueve" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="h-5 w-5 text-gray-600 mr-3">🌧️</span>
                      <span className="text-sm font-medium text-gray-800">Qué Hacer Cuando Llueve</span>
                    </a>
                    <a href="#actividades-invierno" className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                      <span className="h-5 w-5 text-indigo-600 mr-3">❄️</span>
                      <span className="text-sm font-medium text-gray-800">Actividades en Invierno</span>
                    </a>
                    <a href="#alrededores" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
                      <Car className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-sm font-medium text-gray-800">Lugares en los Alrededores</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <div className="space-y-1">
                  {/* Main Hero Image */}
                  <div className="relative h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl overflow-hidden">
                    <Image
                      src="/photo/zona/File 24-04-2025, 10 36 15 PM (5) (1).jpg"
                      alt="Qué hacer en Cariló - vista panorámica de playa y bosque de pinos"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    />
                  </div>
                  
                  {/* Tiny Gallery Previews */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                    {cariloGalleryImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="relative flex-shrink-0 group cursor-pointer"
                      >
                        <div className="relative w-14 h-10 rounded-md overflow-hidden">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-110"
                            sizes="56px"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
              He recopilado la lista de los negocios que usualmente utilizo y programo, y agregué los enlaces a Google Maps. Hay un enlace al perfil, la calificación y el número de reseñas. Entonces, algo que probablemente harías de todos modos antes de ir allí. Para todos los lugares, está la distancia desde Il Buco. Así que, para aquellos de ustedes que no se alojan en nuestra hermosa residencia, piensen en la salida de playa más cercana a Pinamar, la salida de playa más cercana de Cariló, la salida de playa en Cariló más cercana a Pinamar. Algún día podré programar el recálculo de distancias basado en su ubicación actual.
            </p>
          </div>
        </section>

        {/* Beach Activities Section */}
        <section id="playas-naturaleza" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Playas y Naturaleza en Cariló
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-10">
              La playa de Cariló ofrece amplias oportunidades para surf, windsurf, y simplemente relajarse en la arena. El entorno natural único combina bosque de pinos con costa atlántica.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Surf y Windsurf</h3>
                    <p className="text-gray-700 mb-4">
                      Escuelas de surf y windsurf en toda la playa de Cariló. Aprendé windsurf en la costa atlántica con instrucción profesional y alquiler de equipos.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-gray-800 mb-2">Coco Beach</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Escuela de surf más cercana a Il Buco. Clases de surf para todos los niveles con instructores certificados y alquiler de equipos.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>18 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>5 min</span>
                          </div>
                        </div>
                        <a
                          href="https://www.google.com/maps/place/Coco+Beach+Cariló"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-gray-800 mb-2">Escuela de Surf Cariló</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Escuela establecida con experiencia en enseñanza de surf y windsurf. Equipamiento completo y clases grupales e individuales.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>22 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>6 min</span>
                          </div>
                        </div>
                        <a
                          href="https://www.google.com/maps/place/Escuela+de+Surf+Cariló"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Sunrise className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Paradores de Playa</h3>
                    <p className="text-gray-700 mb-4">
                      Los paradores ofrecen un lugar cómodo para disfrutar de la playa con servicios de gastronomía y relax.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-gray-800 mb-2">Parador Hemingway</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Parador clásico de Cariló con excelente gastronomía frente al mar.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>24 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>7 min</span>
                          </div>
                        </div>
                        <a
                          href="https://maps.google.com/place?q=-37.19,-56.89"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-gray-800 mb-2">Parador Neruda</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Ambiente relajado con vista al océano y cocina mediterránea.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>23 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>6 min</span>
                          </div>
                        </div>
                        <a
                          href="https://maps.google.com/place?q=-37.18,-56.90"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Bike className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Alquiler de Bicicletas</h3>
                    <p className="text-gray-700 mb-4">
                      Alquilá bicicletas y explorá Cariló y las áreas circundantes. Las calles de arena sin pavimentar y el entorno natural de la ciudad hacen que la experiencia de ciclismo sea agradable.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-gray-800 mb-2">Motorrad</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Alquiler de FatBike y Mountain Bike. Negocio familiar especializado en bicicletas todo terreno, con equipos de calidad y buen mantenimiento.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>24 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>7 min</span>
                          </div>
                        </div>
                        <a
                          href="https://www.google.com/maps/place/Motorrad,+Cerezo,+Cariló,+Provincia+de+Buenos+Aires,+Argentina"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-gray-800 mb-2">Action Bike</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Bicicletas playeras y Mountain Bike con entrega a domicilio. Servicio que incluye delivery sin costo adicional.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>26 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>8 min</span>
                          </div>
                        </div>
                        <a
                          href="https://www.google.com/maps/place/Action+Bike,+Av.+Espora,+Valeria+del+Mar,+Provincia+de+Buenos+Aires,+Argentina"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Direcciones
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Camera className="h-6 w-6 mr-3 mt-1 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fotografía de Naturaleza</h3>
                    <p className="text-gray-700">
                      La luz natural y las vistas inspiradoras hacen que IL BUCO sea perfecto para la fotografía, el dibujo, la pintura u otras actividades creativas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Sunrise className="h-6 w-6 mr-3 mt-1 text-yellow-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Amaneceres y Atardeceres</h3>
                    <p className="text-gray-700">
                      Caminatas al amanecer por la orilla del mar y contemplación de atardeceres únicos entre pinos y océano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <Tree className="h-6 w-6 mr-3 mt-1 text-teal-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Bosque de Pinos</h3>
                    <p className="text-gray-700">
                      Explorá senderos naturales entre pinos centenarios. Rutas de diferentes dificultades con flora y fauna local única.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Activities Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 id="deportes-fitness" className="text-3xl font-bold mb-10 text-center">
              Deportes y Actividades al Aire Libre
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-indigo-600">🏋️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Gimnasio</h3>
                    <p className="text-gray-700">
                      Gimnasio interior de servicio completo rodeado de bosque con pases diarios, semanales y mensuales. La buena instrucción privada está incluida en el precio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-cyan-600">🎾</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tenis y Pádel</h3>
                    <p className="text-gray-700">
                      Canchas de polvo de ladrillo, pádel, fútbol 5, y un pequeño gimnasio interior. Alquilan raquetas y dan clases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">💪</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Calistenia al Aire Libre</h3>
                    <p className="text-gray-700">
                      Gimnasio de calistenia al aire libre gratuito las 24 horas con barras y paralelas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-orange-600">🐎</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cabalgatas</h3>
                    <p className="text-gray-700">
                      Cabalgatas por dunas y bosque. Una experiencia única para conectar con la naturaleza de Cariló.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-purple-600">🏍️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cuatriciclos y Fatbike</h3>
                    <p className="text-gray-700">
                      Paseos en cuatriciclo y alquiler de fatbike para explorar dunas y senderos forestales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🚗</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Escuela de Manejo 4x4</h3>
                    <p className="text-gray-700">
                      Aprendé a manejar off-road y navegar dunas de arena. Ideal para aventureros que buscan nuevas experiencias.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gastronomy Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 id="comida-restaurantes" className="text-3xl font-bold mb-12 text-center">
              Comida y Restaurantes en Cariló
            </h2>
              
            {/* Parrillas Subsection */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Parrillas y Asados</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg shadow-sm border border-red-100">
                    <h5 className="text-lg font-semibold mb-2 text-red-800">Don Benito</h5>
                    <p className="text-gray-700 text-sm mb-2">Parrilla estilo bodegón. Elegante y sofisticado, especializado en carnes de exportación.</p>
                    <p className="text-xs text-gray-600">Centro de Cariló • @donbenito_carilo</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg shadow-sm border border-red-100">
                    <h5 className="text-lg font-semibold mb-2 text-red-800">De Mi Campo</h5>
                    <p className="text-gray-700 text-sm mb-2">⭐ 4.2/5 (777 reseñas). Destacado por su barra de ensaladas y área de juegos para niños.</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=De+Mi+Campo+Avellano+181+Carilo"
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📍 Avellano 181, Cariló
                    </a>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg shadow-sm border border-red-100">
                    <h5 className="text-lg font-semibold mb-2 text-red-800">La Colorada</h5>
                    <p className="text-gray-700 text-sm mb-2">⭐ 4.5/5 (976 reseñas). En la entrada de Cariló, precios atractivos y buena calidad.</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Parrilla+La+Colorada+Rotonda+Carilo"
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📍 Rotonda Cariló, Ruta Provincial Nº11
                    </a>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg shadow-sm border border-red-100">
                    <h5 className="text-lg font-semibold mb-2 text-red-800">La Pulpería</h5>
                    <p className="text-gray-700 text-sm mb-2">⭐ 4.0/5 (259 reseñas). Lugar tradicional con más de 35 años de experiencia.</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Parrilla+La+Pulperia+Divisadero+1490+Carilo"
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📍 Av. Divisadero 1490, Centro Comercial
                    </a>
                  </div>
                </div>
              </div>

            {/* Pizza & International Subsection */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Pizza Internacional</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg shadow-sm border border-orange-100">
                    <h5 className="text-lg font-semibold mb-2 text-orange-800">Il Gatto Nero</h5>
                    <p className="text-gray-700 text-sm">Pizza napolitana premiada de chefs italianos (también hicieron nuestros sofás).</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-sm border border-yellow-100">
                    <h5 className="text-lg font-semibold mb-2 text-yellow-800">Impeke</h5>
                    <p className="text-gray-700 text-sm">Hamburguesas gourmet destacadas (Valeria del Mar).</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-sm border border-yellow-100">
                    <h5 className="text-lg font-semibold mb-2 text-yellow-800">Enri's</h5>
                    <p className="text-gray-700 text-sm">Hamburguesas en Cariló.</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg shadow-sm border border-blue-100">
                    <h5 className="text-lg font-semibold mb-2 text-blue-800">Más Opciones</h5>
                    <p className="text-gray-700 text-sm">Otros restaurantes internacionales en el centro comercial.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cafés y Panaderías */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Cafés y Panaderías</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Panadería y Café</h5>
                  <p className="text-gray-700 text-sm">Excelente café y productos horneados; la mejor tostada de palta.</p>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Café Francés</h5>
                  <p className="text-gray-700 text-sm">Siempre abierto, perfecto para cualquier momento.</p>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Panettone</h5>
                  <p className="text-gray-700 text-sm">Simple y confiable.</p>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Masse</h5>
                  <p className="text-gray-700 text-sm">Panes elegantes con semillas.</p>
                </div>
              </div>
            </div>

            {/* Heladerías */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Heladerías</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Colonial</h5>
                  <p className="text-gray-700 text-sm">Mi helado favorito (Valeria del Mar).</p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Lucciano's</h5>
                  <p className="text-gray-700 text-sm">El lugar más bonito para disfrutar helados.</p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Pórtico</h5>
                  <p className="text-gray-700 text-sm">Heladería artesanal con sabores únicos y calidad premium.</p>
                </div>
              </div>
            </div>

            {/* Vida Nocturna */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Vida Nocturna</h3>
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-700 mb-4 text-center">
                    La vida nocturna en Cariló es limitada por las ordenanzas municipales que priorizan la tranquilidad del lugar. 
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <h5 className="font-semibold mb-2 text-gray-800">Bar Principal</h5>
                      <p className="text-gray-600 text-sm">Un bar con ocasionales conciertos en vivo.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <h5 className="font-semibold mb-2 text-gray-800">Cervecerías</h5>
                      <p className="text-gray-600 text-sm">Un par de cervecerías al aire libre.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                      <h5 className="font-semibold mb-2 text-gray-800">Vinotecas</h5>
                      <p className="text-gray-600 text-sm">Vinos argentinos para disfrutar al atardecer.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather & Winter Activities */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 id="cuando-llueve" className="text-3xl font-bold mb-10 text-center">Qué Hacer en Cariló Cuando Llueve</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Clases de Cerámica</h3>
                  <p className="text-gray-700">Aprendé alfarería y artes cerámicas en Fusion Arte del Mar, Valeria del Mar. Perfecto para días lluviosos.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Gastronomía Cubierta</h3>
                  <p className="text-gray-700">Todos los restaurantes principales tienen espacios cubiertos: Parrilla Argentina, Don Benito, Pizza Napolitana, Café Francés.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Compras en Boutiques</h3>
                  <p className="text-gray-700">Boutiques del centro de Cariló ofrecen ropa, diseño y artesanías locales bajo techo.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Gimnasio Cubierto</h3>
                  <p className="text-gray-700">Gimnasio interior completo rodeado de bosque, perfecto para mantener la rutina de ejercicios.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Tenis y Pádel Cubierto</h3>
                  <p className="text-gray-700">Canchas de tenis y pádel techadas disponibles para días de lluvia.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Trabajo Remoto</h3>
                  <p className="text-gray-700">Il Buco ofrece internet de alta velocidad y espacios cómodos para trabajar productivamente desde casa.</p>
                </div>
              </div>

              <h2 id="actividades-invierno" className="text-3xl font-bold mb-10 text-center">Actividades en Cariló en Invierno</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <p className="text-center text-gray-700 mb-4">
                  <strong>La mayoría de las actividades de Cariló se pueden disfrutar durante todo el año.</strong> 
                  El clima templado hace que el invierno sea ideal para muchas actividades al aire libre.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Cabalgatas de Invierno</h3>
                  <p className="text-gray-700">Las temperaturas más frescas hacen que las cabalgatas sean más cómodas y agradables.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Trabajo y Concentración</h3>
                  <p className="text-gray-700">Temporada baja perfecta para proyectos importantes sin las distracciones del verano.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Escuela 4x4 Temporada Baja</h3>
                  <p className="text-gray-700">Ideal para aprender manejo off-road con menos tráfico y más atención personalizada.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Ciclismo de Invierno</h3>
                  <p className="text-gray-700">Temperaturas perfectas para largos paseos en bicicleta por senderos y playa.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Fotografía de Naturaleza</h3>
                  <p className="text-gray-700">Luz natural espectacular y paisajes únicos durante los meses más tranquilos.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Surf de Invierno</h3>
                  <p className="text-gray-700">Temporada de surf continúa en invierno, con mejores olas y menos multitudes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shopping and Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Compras y Servicios en Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="mr-2">🛒</span> Supermercados
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Chicho:</strong> Mejores horarios, frutas y verduras decentes</li>
                  <li><strong>Coto:</strong> Supermercado grande, entrega a Cariló</li>
                  <li><strong>Disco:</strong> Alternativa, también entregan</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="mr-2">🥩</span> Productos Frescos
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Belén:</strong> Las mejores frutas y verduras</li>
                  <li><strong>Cabaña Guerrero:</strong> Mi carne favorita</li>
                  <li><strong>La Constanza:</strong> Pescado fresco (temporada)</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="mr-2">🔧</span> Servicios
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Jorjito:</strong> Ferretería más completa</li>
                  <li><strong>Boutiques del Centro:</strong> Ropa y diseño</li>
                  <li><strong>Quimica Limpia Maurito:</strong> Limpieza (Pinamar)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Surrounding Areas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 id="alrededores" className="text-3xl font-bold mb-10 text-center">Alrededores de Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Pinamar</h3>
                <p className="text-gray-700">Sandmasters (escuela 4x4), La Constanza (pescadería), Quimicas Limpia Maurito, servicios especializados y supermercados grandes.</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Valeria del Mar</h3>
                <p className="text-gray-700">Impeke (hamburguesas gourmet), Colonial (helados), Fusion Arte del Mar (cerámica), Action Bike (alquiler de bicicletas).</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Mar de las Pampas</h3>
                <p className="text-gray-700">Localidad similar a Cariló pero con lotes más pequeños y mayor densidad de casas. A veces tiene más vida pública, incluyendo excelentes conciertos de música clásica.</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Faro Querandí</h3>
                <p className="text-gray-700">Faro histórico ubicado en las dunas, perfecto para caminatas y fotografía de paisajes costeros con vista panorámica.</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Recharge Retreat</h3>
                <p className="text-gray-700">Gran estancia con cabaña para alquilar. Retiro de recarga en ambiente rural con actividades de rancho y naturaleza.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para Descubrir Todo lo que Cariló Tiene para Ofrecer?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Descubrí todas estas actividades y más alojándote en Il Buco. Ubicado estratégicamente para acceder a las mejores experiencias de Cariló.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg rounded-md hover:bg-gray-100 transition-colors"
            >
              Reservá tu Estadía <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Lightbox for Cariló Gallery */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Main image */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
              <Image
                src={cariloGalleryImages[selectedImage].src}
                alt={cariloGalleryImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Image title */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-white bg-opacity-20 rounded-lg">
            <span className="text-white text-lg font-medium">
              {cariloGalleryImages[selectedImage].title}
            </span>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white bg-opacity-20 rounded-full">
            <span className="text-white text-sm">
              {selectedImage + 1} / {cariloGalleryImages.length}
            </span>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}
    </div>
  )
}