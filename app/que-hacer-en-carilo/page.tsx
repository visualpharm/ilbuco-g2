"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessCard } from "@/components/business-card"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  MapPin, 
  Waves, 
  Bike, 
  Car,
  User
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
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    alt: "Pizzas artesanales en Pepe Napoli, Cariló",
    title: "Pepe Napoli - Pizzería",
    external: true,
    externalUrl: "https://www.instagram.com/pepenapolicarilo/"
  },
  {
    src: "https://performa.es/wp-content/uploads/2017/12/Centro-de-entrenamiento-personal-1280x720.jpg",
    alt: "CIE Centro de Entrenamiento gimnasio en Cariló",
    title: "CIE Gimnasio",
  },
  {
    src: "https://carilo.circuitotenis.com/images/trabajos/t1.jpg",
    alt: "Club de Tenis Cariló canchas de tenis",
    title: "Club de Tenis",
  },
  {
    src: "https://images.ctfassets.net/0ls885pa980u/5RKxmQn7fcXO3rucj732vW/6af4821c76cd5e778c30bde2f07eaacb/street-workout_topslider_ID-7a1704b3.jpg",
    alt: "Aire Libre gimnasio al aire libre Cariló",
    title: "Aire Libre",
  },
  {
    src: "/quehacer/coco-surf.png",
    alt: "Coco Surf escuela de surf y windsurf en Cariló",
    title: "Coco Surf",
  },
  {
    src: "/quehacer/dalmiro.png",
    alt: "Dalmiro Paseo a Caballo Cariló",
    title: "Dalmiro Paseo a Caballo",
  },
  {
    src: "/quehacer/relincho.png",
    alt: "Cabalgatas El Relincho paseos a caballo Cariló",
    title: "Cabalgatas El Relincho",
  },
  {
    src: "/quehacer/golf.jpg",
    alt: "Cariló Golf Club campo de golf en Cariló",
    title: "Cariló Golf Club",
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
                    <Link href="#playas-naturaleza" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                      <Waves className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm font-medium text-gray-800">Playas y Naturaleza</span>
                    </Link>
                    <Link href="#deportes-fitness" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
                      <span className="h-5 w-5 text-green-600 mr-3">🏃</span>
                      <span className="text-sm font-medium text-gray-800">Deportes y Fitness</span>
                    </Link>
                    <Link href="/restaurantes-carilo" className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                      <span className="h-5 w-5 text-orange-600 mr-3">🍽️</span>
                      <span className="text-sm font-medium text-gray-800">Comida y Restaurantes</span>
                    </Link>
                    <Link href="/que-hacer-en-carilo/cuando-llueve" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="h-5 w-5 text-gray-600 mr-3">🌧️</span>
                      <span className="text-sm font-medium text-gray-800">Qué Hacer Cuando Llueve</span>
                    </Link>
                    <Link href="/que-hacer-en-carilo/en-invierno" className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                      <span className="h-5 w-5 text-indigo-600 mr-3">❄️</span>
                      <span className="text-sm font-medium text-gray-800">Actividades en Invierno</span>
                    </Link>
                    <Link href="/alrededores-carilo" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
                      <Car className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="text-sm font-medium text-gray-800">Lugares en los Alrededores</span>
                    </Link>
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
              La playa de Cariló ofrece amplias oportunidades para surf, windsurf, y simplemente relajarse en la arena. El entorno natural único combina bosque de pinos con costa atlántica, ideal para <Link href="/team-building-carilo" className="text-gray-700 no-underline hover:text-gray-600">actividades grupales</Link> y <Link href="/eventos-corporativos-carilo" className="text-gray-700 no-underline hover:text-gray-600">eventos</Link> al aire libre.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BusinessCard
                name="Coco Surf"
                description="Aprender surf y windsurf en la playa de Cariló con instructores profesionales. Alquiler de equipos incluido y clases para todos los niveles desde principiantes hasta avanzados."
                rating={4.5}
                reviewCount="85"
                walkingTime="18 min"
                drivingTime="5 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Coco+Surf+Cariló+Argentina"
                imageUrl="/quehacer/coco-surf.png"
                imageAlt="Coco Surf escuela de surf y windsurf en Cariló"
                onImageClick={() => openLightbox(20)}
                gradientFrom="blue-50"
                gradientTo="indigo-50"
              />

              <BusinessCard
                name="Balneario Hemingway"
                description="Disfrutar de un día de playa con gastronomía de calidad y servicios completos frente al mar. El parador clásico de Cariló ofrece comida argentina, vista al océano y ambiente relajado."
                rating={4.0}
                reviewCount="2,743"
                walkingTime="24 min"
                drivingTime="7 min"
                googleMapsUrl="https://www.google.com/maps/place/Balneario+Hemingway+Carilo/@-37.163825,-56.889637,15z"
                imageUrl="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/c9/21/38/tu-lugar-los-12-meses.jpg"
                imageAlt="Balneario Hemingway Cariló vista al mar"
                onImageClick={() => openLightbox(15)}
                gradientFrom="green-50"
                gradientTo="emerald-50"
              />

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BusinessCard
                name="Cariló Golf Club"
                description="Jugar golf en uno de los campos más prestigiosos de la costa argentina. Diseño de 18 hoyos par 73 rodeado de bosque de pinos con calles estrechas que demandan precisión."
                rating={4.3}
                reviewCount="85"
                walkingTime="25 min"
                drivingTime="5 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Cariló+Golf+Club"
                imageUrl="/quehacer/golf.jpg"
                imageAlt="Cariló Golf Club campo de golf en Cariló"
                onImageClick={() => openLightbox(18)}
                gradientFrom="green-50"
                gradientTo="emerald-50"
              />

              <BusinessCard
                name="CIE - Centro de Entrenamiento"
                description="Entrenar en un gimnasio completo rodeado de bosque con instructores incluidos. Pases diarios, semanales y mensuales disponibles."
                rating={4.5}
                reviewCount="120"
                walkingTime="17 min"
                drivingTime="4 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=CIE+Centro+de+Entrenamiento+Cariló"
                imageUrl="/quehacer/cie.webp"
                imageAlt="CIE Centro de Entrenamiento gimnasio en Cariló"
                onImageClick={() => openLightbox(17)}
                gradientFrom="blue-50"
                gradientTo="indigo-50"
              />

              <BusinessCard
                name="Club de Tenis Cariló"
                description="Jugar tenis, pádel y fútbol 5 en canchas de polvo de ladrillo. Alquiler de raquetas y clases disponibles."
                rating={4.3}
                reviewCount="95"
                walkingTime="20 min"
                drivingTime="5 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Club+de+Tenis+Cariló"
                imageUrl="https://carilo.circuitotenis.com/images/trabajos/t1.jpg"
                imageAlt="Club de Tenis Cariló canchas de tenis"
                onImageClick={() => openLightbox(18)}
                gradientFrom="green-50"
                gradientTo="emerald-50"
              />

              <BusinessCard
                name="Aire Libre, Libre"
                description="Entrenar gratis las 24 horas en gimnasio al aire libre con barras de dominadas, paralelas y equipos de entrenamiento corporal."
                rating={4.8}
                reviewCount="65"
                walkingTime="15 min"
                drivingTime="3 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Aire+Libre+Cariló"
                imageUrl="/quehacer/airelibre.webp"
                imageAlt="Aire Libre, Libre gimnasio al aire libre Cariló"
                onImageClick={() => openLightbox(19)}
                gradientFrom="red-50"
                gradientTo="rose-50"
              />

              <BusinessCard
                name="Dalmiro Paseo a Caballo"
                description="Paseos a caballo por la playa y bosques de Cariló. Experiencia única con caballos mansos y guías expertos."
                rating={4.7}
                reviewCount="120"
                walkingTime="35 min"
                drivingTime="12 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Dalmiro+Paseo+a+Caballo+Cariló"
                imageUrl="/quehacer/dalmiro.png"
                imageAlt="Dalmiro Paseo a Caballo por la costa atlántica de Cariló"
                onImageClick={() => openLightbox(21)}
                gradientFrom="amber-50"
                gradientTo="orange-50"
              />

              <BusinessCard
                name="Cabalgatas El Relincho"
                description="Paseos a caballo por la costa atlántica y senderos del bosque. Salidas al amanecer y atardecer con grupos pequeños."
                rating={4.8}
                reviewCount="95"
                walkingTime="40 min"
                drivingTime="15 min"
                googleMapsUrl="https://www.google.com/maps/search/?api=1&query=Cabalgatas+El+Relincho+Cariló"
                imageUrl="/quehacer/relincho.png"
                imageAlt="Cabalgatas El Relincho paseos a caballo por la playa en Cariló"
                onImageClick={() => openLightbox(22)}
                gradientFrom="green-50"
                gradientTo="emerald-50"
              />
            </div>
          </div>
        </section>

        {/* More Experiences - Golden Standard Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Más Experiencias en Cariló
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Gastronomy Card */}
                <Link href="/restaurantes-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">Restaurantes y Gastronomía</h5>
                      <div className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        🍽️ 25+ opciones
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Descubrir la mejor gastronomía local: parrillas tradicionales, pizzerías gourmet, cafés artesanales y restaurantes de autor.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>15-30 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>3-8 min</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-amber-600 group-hover:text-amber-800 text-sm font-medium transition-colors">
                      <ArrowRight className="h-4 w-4" />
                      Ver Restaurantes
                    </div>
                  </div>
                </Link>

                {/* Rainy Day Activities */}
                <Link href="/que-hacer-en-carilo/cuando-llueve" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">¿Llueve en Cariló?</h5>
                      <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        🌧️ Bajo techo
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Disfrutar actividades cubiertas cuando llueve: spas, lugares con piletas cubiertas, masajes, gimnasio cubierto, cines y galerías comerciales.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>15-30 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>5-10 min</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-blue-600 group-hover:text-blue-800 text-sm font-medium transition-colors">
                      <ArrowRight className="h-4 w-4" />
                      Actividades para lluvia
                    </div>
                  </div>
                </Link>

                {/* Winter Activities */}
                <Link href="/que-hacer-en-carilo/en-invierno" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Cariló en Invierno</h5>
                      <div className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        ❄️ Sin multitudes
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Disfrutar actividades al aire libre con clima templado y sin las multitudes del verano: caminatas, ciclismo y deportes.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>15-30 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>5-10 min</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-indigo-600 group-hover:text-indigo-800 text-sm font-medium transition-colors">
                      <ArrowRight className="h-4 w-4" />
                      Actividades invernales
                    </div>
                  </div>
                </Link>

                {/* Shopping & Services */}
                <Link href="/compras-servicios-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Compras y Servicios</h5>
                      <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        🛒 Todo cerca
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Resolver todo lo necesario para tu estadía: supermercados, productos frescos, carnicerías, ferreterías y servicios.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>20-40 min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>3-10 min</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-green-600 group-hover:text-green-800 text-sm font-medium transition-colors">
                      <ArrowRight className="h-4 w-4" />
                      Ver Compras y Servicios
                    </div>
                  </div>
                </Link>

                {/* Surrounding Areas */}
                <Link href="/alrededores-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">Alrededores de Cariló</h5>
                      <div className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                        🗺️ Excursiones
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Para:</strong> Explorar destinos cercanos: Pinamar, Mar de las Pampas, faros históricos y pueblos costeros de la región atlántica.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="font-medium">Desde Il Buco:</span>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        <span>10-30 min</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1 text-teal-600 group-hover:text-teal-800 text-sm font-medium transition-colors">
                      <ArrowRight className="h-4 w-4" />
                      Explorar Alrededores
                    </div>
                  </div>
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
