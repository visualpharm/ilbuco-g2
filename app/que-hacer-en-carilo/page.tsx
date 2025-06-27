"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  MapPin, 
  Wrench, 
  Droplets,
  Waves, 
  Trees as Tree, 
  Camera, 
  Bike, 
  User, 
  Car,
  Droplet
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
  // Business images
  {
    src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/c9/21/38/tu-lugar-los-12-meses.jpg",
    alt: "Balneario Hemingway Cariló vista al mar",
    title: "Balneario Hemingway",
  },
  {
    src: "/quehacer/motorrad2.jpg",
    alt: "Motorrad alquiler de bicicletas en Cariló",
    title: "Motorrad Bicicletas",
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
                    <Link href="/que-hacer-en-carilo/cuando-llueve" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="h-5 w-5 text-gray-600 mr-3">🌧️</span>
                      <span className="text-sm font-medium text-gray-800">Qué Hacer Cuando Llueve</span>
                    </Link>
                    <Link href="/que-hacer-en-carilo/en-invierno" className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                      <span className="h-5 w-5 text-indigo-600 mr-3">❄️</span>
                      <span className="text-sm font-medium text-gray-800">Actividades en Invierno</span>
                    </Link>
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
              He reunido la lista de negocios que suelo usar y programar, y agregué los enlaces a Google Maps. Hay un enlace al perfil, la calificación y la cantidad de reseñas. O sea, algo que probablemente harías igual antes de ir. Para todos los lugares, está la distancia desde Il Buco. Así que para los que no se están quedando en nuestra hermosa residencia, piensen en la salida a la playa más cercana a Pinamar, la salida a la playa más cercana de Cariló, la salida a la playa en Cariló más cercana a Pinamar. Algún día voy a poder programar el recálculo de distancias según tu ubicación actual.
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <Waves className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Surf y Windsurf</h3>
                    <p className="text-gray-700 mb-3">
                      Escuelas de surf y windsurf en toda la playa de Cariló. Aprendé windsurf en la costa atlántica con instrucción profesional y alquiler de equipos.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-blue-700 mb-3">
                      <span className="flex items-center">
                        <span className="text-yellow-500">★</span> 4.7 (120+ reseñas)
                      </span>
                      <span>•</span>
                      <span>Equipos incluidos</span>
                    </div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Coco+Beach+Cariló+Argentina"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps (18 min caminando)
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => openLightbox(15)}
                  className="relative w-full h-48 cursor-zoom-in hover:opacity-90 transition-opacity"
                >
                  <Image
                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/c9/21/38/tu-lugar-los-12-meses.jpg"
                    alt="Balneario Hemingway Cariló vista al mar"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <span className="h-6 w-6 mr-3 mt-1 text-orange-600">🏖️</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Balneario Hemingway</h3>
                      <p className="text-gray-700 mb-3">
                        Parador clásico de Cariló con excelente gastronomía frente al mar. Lugar cómodo para disfrutar de la playa con servicios completos.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-green-700 mb-3">
                        <span className="flex items-center">
                          <span className="text-yellow-500">★</span> 4.3 (2,743 reseñas)
                        </span>
                        <span>•</span>
                        <span>Vista al mar</span>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/8xM9V8HjTqZJGzQV8"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver en Google Maps (24 min caminando)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => openLightbox(16)}
                  className="relative w-full h-48 cursor-zoom-in hover:opacity-90 transition-opacity"
                >
                  <Image
                    src="/quehacer/motorrad2.jpg"
                    alt="Motorrad alquiler de bicicletas en Cariló"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Bike className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Motorrad - Alquiler de Bicicletas</h3>
                      <p className="text-gray-700 mb-3">
                        Alquilá bicicletas y explorá Cariló y las áreas circundantes. Las calles de arena sin pavimentar y el entorno natural de la ciudad hacen que la experiencia de ciclismo sea agradable.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-orange-700 mb-3">
                        <span className="flex items-center">
                          <span className="text-yellow-500">★</span> 4.6 (75+ reseñas)
                        </span>
                        <span>•</span>
                        <span>Equipos todo terreno</span>
                      </div>
                      <a
                        href="https://www.google.com/maps/place/Motorrad,+Cerezo,+Cariló,+Provincia+de+Buenos+Aires,+Argentina"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver en Google Maps (24 min caminando)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Activities Section */}
        <section id="deportes-fitness" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Deportes y Actividades al Aire Libre
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-indigo-600">🏋️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">CIE - Centro de Entrenamiento</h3>
                    <p className="text-gray-700 mb-3">
                      Gimnasio interior de servicio completo rodeado de bosque con pases diarios, semanales y mensuales. La buena instrucción privada está incluida en el precio.
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=CIE+Centro+de+Entrenamiento+Cariló"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-green-600">🎾</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Club de Tenis Cariló</h3>
                    <p className="text-gray-700 mb-3">
                      Canchas de polvo de ladrillo, pádel, fútbol 5, y un pequeño gimnasio interior. Alquilan raquetas y dan clases.
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Club+de+Tenis+Cariló"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-red-600">💪</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Aire Libre Calistenia</h3>
                    <p className="text-gray-700 mb-3">
                      Gimnasio de calistenia al aire libre gratuito, abierto las 24 horas, con barras de dominadas, paralelas y otros equipos de entrenamiento corporal.
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Gimnasio+Aire+Libre+Cariló"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>


              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-orange-600">🏇</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cabalgatas en la Playa</h3>
                    <p className="text-gray-700 mb-3">
                      Paseos a caballo al atardecer por la playa. Experiencia inolvidable con vistas al mar. Grupos reducidos y guías expertos.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-amber-700 mb-3">
                      <span className="flex items-center">
                        <span className="text-yellow-500">★</span> 4.9 (85+ reseñas)
                      </span>
                      <span>•</span>
                      <span>Reserva previa requerida</span>
                    </div>
                    <a
                      href="https://www.google.com/maps/place/Cabalgatas+en+la+Playa+Caril%C3%B3/@-37.1624885,-56.8986388,15z/data=!4m6!3m5!1s0x959c7e5e3e3f3e3f:0x3b3b3b3b3b3b3b3b!8m2!3d-37.1624885!4d-56.8986388!16s%2Fg%2F11b8f8f8f9"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps (15 min en auto)
                    </a>
                  </div>
                </div>
              </div>


              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-start mb-4">
                  <span className="h-6 w-6 mr-3 mt-1 text-yellow-600">🚗</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sand Masters - Escuela 4x4</h3>
                    <p className="text-gray-700 mb-3">
                      Aprendé técnicas de manejo off-road y cómo navegar por las dunas de arena. Clases teóricas y prácticas con instructores certificados.
                    </p>
                    <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <span>Ubicación: Pinamar</span>
                      <span className="text-gray-300">•</span>
                      <span>25 min desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link></span>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/pZxbP4Xq1bwwEQwv5"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gastronomy Section */}
        <section id="comida-restaurantes" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
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

            {/* Pizza & Burgers Subsection */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Pizza & Burgers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border-2 border-orange-200 overflow-hidden relative">
                    <div className="relative w-full h-32">
                      <Image
                        src="/quehacer/gaato-nero.jpg"
                        alt="Il Gatto Nero pizzería napolitana en Cariló"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-5">
                      <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">$$$</div>
                      <h5 className="text-lg font-semibold mb-2 text-orange-800">Il Gatto Nero</h5>
                      <p className="text-gray-700 text-sm">La mejor pizza napolitana de la zona, hecha por chefs italianos. ¡Nuestra recomendación personal! (también hicieron nuestros sofás).</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg shadow-sm border border-orange-100 relative">
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">$$$</div>
                    <h5 className="text-lg font-semibold mb-2 text-orange-800">Pepe Napoli</h5>
                    <p className="text-gray-700 text-sm">Otra excelente opción de pizza napolitana, aunque no tan destacada como Il Gatto Nero.</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-sm border border-yellow-100">
                    <h5 className="text-lg font-semibold mb-2 text-yellow-800">Impeke</h5>
                    <p className="text-gray-700 text-sm">Hamburguesas gourmet destacadas (Valeria del Mar).</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg shadow-sm border border-yellow-100">
                    <h5 className="text-lg font-semibold mb-2 text-yellow-800">Enri's</h5>
                    <p className="text-gray-700 text-sm">Hamburguesas en Cariló.</p>
                  </div>

                </div>
              </div>

            {/* Cafés y Panaderías */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Cafés y Panaderías</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Panettone</h5>
                  <p className="text-gray-700 text-sm mb-3">Simple y confiable.</p>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Panettone+Cariló"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg shadow-sm border border-amber-100">
                  <h5 className="text-lg font-semibold mb-2 text-amber-800">Masse</h5>
                  <p className="text-gray-700 text-sm mb-3">Panes elegantes con semillas.</p>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>17 min</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Masse+Cariló"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Heladerías */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Heladerías</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Colonial</h5>
                  <p className="text-gray-700 text-sm mb-3">★ 4.3/5 (85 reseñas). Mi helado favorito en Valeria del Mar. Helado artesanal con sabores clásicos y especiales.</p>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>8 min</span>
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Heladería+Colonial+Valeria+del+Mar"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Lucciano's</h5>
                  <p className="text-gray-700 text-sm mb-3">★ 4.4/5 (120 reseñas). El lugar más bonito para disfrutar helados con ambiente moderno y terraza.</p>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>14 min</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>4 min</span>
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Lucciano's+Helado+Cariló"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-lg shadow-sm border border-pink-100">
                  <h5 className="text-lg font-semibold mb-2 text-pink-800">Pórtico</h5>
                  <p className="text-gray-700 text-sm mb-3">★ 4.2/5 (95 reseñas). Heladería artesanal con sabores únicos y calidad premium. Especialidad en dulce de leche.</p>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span>Distancia desde <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Il Buco</Link>:</span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>16 min</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>5 min</span>
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Heladería+Pórtico+Cariló"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Vida Nocturna */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">Vida Nocturna</h3>
              <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                  <p className="text-gray-700 mb-4 text-center">
                    La vida nocturna en Cariló es limitada por las ordenanzas municipales que priorizan la tranquilidad del lugar. 
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800">Bar Templeton</h5>
                      <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        ★ 4.8 (42 reseñas)
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Disfrutar música en vivo y un ambiente auténtico de bar. Ideal para una noche de entretenimiento con conciertos y ambiente local.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Distancia desde Il Buco:</span>
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
                      href="https://maps.app.goo.gl/R5FwQxedYknkgE6i8"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver perfil en Google Maps
                    </a>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800">The Garrison</h5>
                      <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        ★ 4.6 (58 reseñas)
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Combinar café de calidad con una selección premium de whiskies. Perfecto para reuniones de negocios o encuentros sofisticados.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Distancia desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>15 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>4 min</span>
                      </div>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/wYKmwMiqag21GpUd6"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver perfil en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather & Winter Activities */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-4">¿Llueve en Cariló?</h2>
                <p className="text-gray-700 mb-6">
                  No dejes que la lluvia arruine tus planes. Descubrí todas las actividades bajo techo y opciones para disfrutar incluso en días lluviosos.
                </p>
                <Link 
                  href="/que-hacer-en-carilo/cuando-llueve" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver actividades para días de lluvia <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-4">Cariló en Invierno</h2>
                <p className="text-gray-700 mb-6">
                  El clima templado de Cariló hace que el invierno sea ideal para disfrutar de actividades al aire libre sin las multitudes del verano.
                </p>
                <Link 
                  href="/que-hacer-en-carilo/en-invierno" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Descubrí las actividades invernales <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Shopping & Services */}
        <section id="compras-servicios" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Compras y Servicios en Cariló</h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-lg mb-10 border-l-4 border-blue-400">
                <p className="text-center text-gray-700 text-lg">
                  <strong>Los servicios en Cariló son limitados por su carácter residencial.</strong> 
                  <span className="block mt-2">Para servicios más completos, los residentes y visitantes suelen dirigirse a Pinamar (20 min en auto).</span>
                </p>
              </div>
              
              {/* Supermercados Section */}
              <div className="mb-14">
                <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800 border-b pb-2">Supermercados</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-green-700 mb-3">Chicho</h4>
                    <p className="text-gray-700 mb-4">Los mejores horarios de apertura, frutas y verduras de calidad.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Supermercado+Chicho+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
                    </a>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-green-700 mb-3">La Proveeduría</h4>
                    <p className="text-gray-700 mb-4">Estilo mini Whole Foods, con productos gourmet como chips de kale en frascos de vidrio. Opción premium.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=La+Proveeduría+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
                    </a>
                  </div>
                  
                </div>
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-bold text-lg text-blue-800 mb-3">Supermercados Grandes (En Pinamar - 20 min)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-semibold text-green-700 mb-2">Coto</h5>
                      <p className="text-gray-700 text-sm mb-2">El supermercado grande más cercano, con entrega a domicilio en Cariló. Variedad de productos nacionales e importados.</p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Coto+Pinamar"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="w-4 h-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-semibold text-green-700 mb-2">Disco</h5>
                      <p className="text-gray-700 text-sm mb-2">Buena alternativa con entrega a domicilio. Excelente selección de productos premium y orgánicos.</p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Disco+Pinamar"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="w-4 h-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos Frescos Section */}
              <div className="mb-14">
                <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800 border-b pb-2">Productos Frescos</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-orange-600 mb-3">Belén</h4>
                    <p className="text-gray-700 mb-4">Las mejores frutas y verduras de la zona, seleccionadas diariamente. También ofrecen productos orgánicos.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Verdulería+Belén+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
                    </a>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-orange-600 mb-3">Boutique de Frutas</h4>
                    <p className="text-gray-700 mb-4">Autoservicio con productos seleccionados. Gran variedad de frutas exóticas y productos gourmet.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Boutique+de+Frutas+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
                    </a>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-orange-600 mb-3">Cabaña Guerrero</h4>
                    <p className="text-gray-700 mb-4">Carnicería especializada con excelente selección de carnes premium, cortes especiales y embutidos artesanales.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Cabaña+Guerrero+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="font-bold text-xl text-orange-600 mb-3">Pescadería La Constanza</h4>
                    <p className="text-gray-700 mb-4">Pescado fresco (no congelado), incluyendo salmón, merluza y mariscos. Cerrada en temporada baja.</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Pescadería+La+Constanza+Cariló"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-1" /> Ver en mapa
                    </a>
                  </div>
                </div>
              </div>

              {/* Servicios Section */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800 border-b pb-2">Servicios Especializados</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Wrench className="h-6 w-6 mr-3 mt-1 text-orange-600" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Ferretería Jorgito</h3>
                        <p className="text-gray-700 mb-3">
                          Resolver problemas del hogar, construcción y mantenimiento con herramientas y materiales de calidad.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-orange-700 mb-3">
                          <span className="flex items-center">
                            <span className="text-yellow-500">★</span> 4.2 (28 reseñas)
                          </span>
                          <span>•</span>
                          <span>Herramientas profesionales</span>
                        </div>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Ferretería+Jorgito+Cariló"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver en Google Maps (13 min caminando)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Droplets className="h-6 w-6 mr-3 mt-1 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Lavandería Express</h3>
                        <p className="text-gray-700 mb-3">
                          Mantener tu ropa impecable con lavandería, tintorería y limpieza en seco profesional.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-blue-700 mb-3">
                          <span className="flex items-center">
                            <span className="text-yellow-500">★</span> 4.5 (35 reseñas)
                          </span>
                          <span>•</span>
                          <span>Limpieza profesional</span>
                        </div>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Lavandería+Express+Cariló"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver en Google Maps (15 min caminando)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Droplet className="h-6 w-6 mr-3 mt-1 text-green-600" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Quimica Limpia Maurito</h3>
                        <p className="text-gray-700 mb-3">
                          Obtener productos de limpieza al por mayor con entrega semanal en Cariló.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-green-700 mb-3">
                          <span className="flex items-center">
                            <span className="text-yellow-500">★</span> 4.3 (22 reseñas)
                          </span>
                          <span>•</span>
                          <span>Entrega semanal</span>
                        </div>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Quimica+Limpia+Maurito+Pinamar"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver en Google Maps (20 min en auto)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <span className="h-6 w-6 mr-3 mt-1 text-red-600">🏦</span>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Servicios Bancarios</h3>
                        <p className="text-gray-700 mb-3">
                          Realizar operaciones bancarias, debes viajar a Pinamar (Macro, Galicia, Provincia) o incluso Villa Gesell (Santander).
                        </p>
                        <div className="flex items-center gap-4 text-sm text-red-700 mb-3">
                          <span className="flex items-center">
                            <span className="text-red-500">⚠️</span> No disponible en Cariló
                          </span>
                          <span>•</span>
                          <span>Pinamar más cercano</span>
                        </div>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Banco+Macro+Pinamar"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4" />
                          Ver bancos en Pinamar (20 min en auto)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Surrounding Areas */}
        <section id="alrededores" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Alrededores de Cariló</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Pinamar (20 min)</h3>
                <p className="text-gray-700 mb-4">Ciudad principal con todos los servicios gubernamentales, financieros y comerciales. Supermercados grandes, bancos, Sand Masters (escuela 4x4), y servicios especializados.</p>
                <div className="text-sm text-gray-600">
                  <div>• Servicios bancarios completos</div>
                  <div>• Supermercados Coto y Disco</div>
                  <div>• Sand Masters - Escuela 4x4</div>
                  <div>• Servicios gubernamentales</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Valeria del Mar (10 min)</h3>
                <p className="text-gray-700 mb-4">Pueblo costero con una calle principal donde se concentran todos los servicios esenciales: ferreterías, tiendas, restaurantes y servicios.</p>
                <div className="text-sm text-gray-600">
                  <div>• Impeke Burgers</div>
                  <div>• Colonial (heladería)</div>
                  <div>• Fusion Arte del Mar (cerámica)</div>
                  <div>• Calle principal con todos los servicios</div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Mar de las Pampas (25 min)</h3>
                <p className="text-gray-700 mb-4">El único lugar en el mundo similar a Cariló, pero con lotes más pequeños y mayor densidad. Ambiente bohemio con negocios muy interesantes y festival de música clásica.</p>
                <div className="text-sm text-gray-600">
                  <div>• Arquitectura única y bohemia</div>
                  <div>• Festival de música clásica</div>
                  <div>• Gastronomía gourmet</div>
                  <div>• Mayor concentración de servicios</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Faro Querandí (35 min)</h3>
                <p className="text-gray-700 mb-4">Faro histórico con vistas panorámicas del océano. Lugar ideal para fotografías y sand surfing en las dunas circundantes.</p>
                <div className="text-sm text-gray-600">
                  <div>• Faro histórico (no se puede subir)</div>
                  <div>• Vistas panorámicas</div>
                  <div>• Sand surfing en dunas</div>
                  <div>• Lugar perfecto para fotos</div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Recharge Retreat (30 min)</h3>
                <p className="text-gray-700 mb-4">Centro de bienestar y retiros espirituales especializado en desconexion digital y reconexion con la naturaleza.</p>
                <div className="text-sm text-gray-600 mb-3">
                  <div>• Retiros de bienestar</div>
                  <div>• Desconexion digital</div>
                  <div>• Actividades en la naturaleza</div>
                </div>
                <a
                  href="https://recharge.com.ar"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>🌐</span> recharge.com.ar
                </a>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/book"
                className="inline-flex items-center px-8 py-3 bg-white text-black text-lg rounded-md hover:bg-gray-100 transition-colors"
              >
                Reservá tu Estadía <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
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