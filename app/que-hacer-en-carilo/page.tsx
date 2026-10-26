"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessCard } from "@/components/business-card"
import { ImageLightbox } from "@/components/image-lightbox"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

// Translations for the page
const translations = {
  title: {
    es: "Qué Hacer",
    en: "Things to Do",
    pt: "O Que Fazer",
    ru: "Чем Заняться"
  },
  inCarilo: {
    es: " en Cariló",
    en: " in Cariló",
    pt: " em Cariló",
    ru: " в Карило"
  },
  photos: {
    es: "Fotos",
    en: "Photos",
    pt: "Fotos",
    ru: "Фото"
  },
  indexTitle: {
    es: "Índice de Contenidos",
    en: "Table of Contents",
    pt: "Índice de Conteúdos",
    ru: "Содержание"
  },
  beachNature: {
    es: "Playas y Naturaleza",
    en: "Beaches and Nature",
    pt: "Praias e Natureza",
    ru: "Пляжи и Природа"
  },
  sportsFitness: {
    es: "Deportes y Fitness",
    en: "Sports and Fitness",
    pt: "Esportes e Fitness",
    ru: "Спорт и Фитнес"
  },
  foodRestaurants: {
    es: "Comida y Restaurantes",
    en: "Food and Restaurants",
    pt: "Comida e Restaurantes",
    ru: "Еда и Рестораны"
  },
  rainyDay: {
    es: "Qué Hacer Cuando Llueve",
    en: "What to Do When It Rains",
    pt: "O Que Fazer Quando Chove",
    ru: "Чем Заняться Когда Дождь"
  },
  winterActivities: {
    es: "Actividades en Invierno",
    en: "Winter Activities",
    pt: "Atividades no Inverno",
    ru: "Зимние Активности"
  },
  nearbyPlaces: {
    es: "Lugares en los Alrededores",
    en: "Nearby Places",
    pt: "Lugares nos Arredores",
    ru: "Окрестности"
  },
  intro: {
    es: "He reunido la lista de negocios que suelo usar y programar, y agregué los enlaces a Google Maps. Hay un enlace al perfil, la calificación y la cantidad de reseñas. O sea, algo que probablemente harías igual antes de ir. Para todos los lugares, está la distancia desde Il Buco. Así que para los que no se están quedando en nuestra hermosa residencia, piensen en la salida a la playa más cercana a Pinamar, la salida a la playa más cercana de Cariló, la salida a la playa en Cariló más cercana a Pinamar. Algún día voy a poder programar el recálculo de distancias según tu ubicación actual.",
    en: "I've compiled a list of businesses I actually use and recommend, and added links to Google Maps. There's a link to the profile, rating, and number of reviews. Basically, what you'd probably do anyway before going. For all places, there's the distance from Il Buco. So for those of you not staying at our beautiful residence, think of the beach access closest to Pinamar, the beach access closest to Cariló, the beach access in Cariló closest to Pinamar. Someday I'll be able to program distance recalculation based on your current location.",
    pt: "Compilei uma lista de negócios que realmente uso e recomendo, e adicionei links para o Google Maps. Há um link para o perfil, classificação e número de avaliações. Basicamente, o que você provavelmente faria de qualquer forma antes de ir. Para todos os lugares, há a distância do Il Buco. Então, para aqueles de vocês que não estão hospedados em nossa bela residência, pense no acesso à praia mais próximo de Pinamar, no acesso à praia mais próximo de Cariló, no acesso à praia em Cariló mais próximo de Pinamar. Algum dia poderei programar o recálculo de distância com base na sua localização atual.",
    ru: "Я составил список мест которые я реально использую и рекомендую, и добавил ссылки на Google Maps. Там ссылка на профиль, рейтинг и количество отзывов. В общем то что вы бы и так сделали перед походом. Для всех мест указано расстояние от Il Buco. Так что для тех кто не остановился в нашей прекрасной резиденции, ориентируйтесь на ближайший выход к пляжу от Пинамара, ближайший выход к пляжу Карило, выход к пляжу в Карило ближайший к Пинамару. Когда-нибудь я смогу запрограммировать пересчет расстояний от вашего текущего местоположения."
  },
  beachNatureTitle: {
    es: "Playas y Naturaleza en Cariló",
    en: "Beaches and Nature in Cariló",
    pt: "Praias e Natureza em Cariló",
    ru: "Пляжи и Природа в Карило"
  },
  beachNatureDesc: {
    es: "La playa de Cariló ofrece amplias oportunidades para surf, windsurf, y simplemente relajarse en la arena. El entorno natural único combina bosque de pinos con costa atlántica, ideal para",
    en: "Cariló beach offers ample opportunities for surfing, windsurfing, and simply relaxing on the sand. The unique natural environment combines pine forest with Atlantic coast, ideal for",
    pt: "A praia de Cariló oferece amplas oportunidades para surf, windsurf e simplesmente relaxar na areia. O ambiente natural único combina floresta de pinheiros com a costa atlântica, ideal para",
    ru: "Пляж Карило предлагает отличные возможности для серфинга, виндсерфинга и просто отдыха на песке. Уникальная природная среда сочетает сосновый лес с атлантическим побережьем, идеально для"
  },
  groupActivities: {
    es: "actividades grupales",
    en: "group activities",
    pt: "atividades em grupo",
    ru: "групповых активностей"
  },
  events: {
    es: "eventos",
    en: "events",
    pt: "eventos",
    ru: "мероприятий"
  },
  outdoorActivities: {
    es: " al aire libre.",
    en: " outdoors.",
    pt: " ao ar livre.",
    ru: " на свежем воздухе."
  },
  sportsActivitiesTitle: {
    es: "Deportes y Actividades al Aire Libre",
    en: "Sports and Outdoor Activities",
    pt: "Esportes e Atividades ao Ar Livre",
    ru: "Спорт и Активности на Свежем Воздухе"
  },
  moreExperiences: {
    es: "Más Experiencias en Cariló",
    en: "More Experiences in Cariló",
    pt: "Mais Experiências em Cariló",
    ru: "Больше Впечатлений в Карило"
  },
  restaurantsGastronomy: {
    es: "Restaurantes y Gastronomía",
    en: "Restaurants and Gastronomy",
    pt: "Restaurantes e Gastronomia",
    ru: "Рестораны и Гастрономия"
  },
  forDiscover: {
    es: "Para:",
    en: "For:",
    pt: "Para:",
    ru: "Для:"
  },
  discoverGastronomy: {
    es: " Descubrir la mejor gastronomía local: parrillas tradicionales, pizzerías gourmet, cafés artesanales y restaurantes de autor.",
    en: " Discover the best local gastronomy: traditional grills, gourmet pizzerias, artisanal cafes, and signature restaurants.",
    pt: " Descobrir a melhor gastronomia local: churrasqueiras tradicionais, pizzarias gourmet, cafés artesanais e restaurantes de autor.",
    ru: " Открыть для себя лучшую местную гастрономию: традиционные парильи, пиццерии для гурманов, кафе и авторские рестораны."
  },
  fromIlBuco: {
    es: "Desde Il Buco:",
    en: "From Il Buco:",
    pt: "De Il Buco:",
    ru: "От Il Buco:"
  },
  viewRestaurants: {
    es: "Ver Restaurantes",
    en: "View Restaurants",
    pt: "Ver Restaurantes",
    ru: "Смотреть Рестораны"
  },
  rainingInCarilo: {
    es: "¿Llueve en Cariló?",
    en: "Raining in Cariló?",
    pt: "Chovendo em Cariló?",
    ru: "Дождь в Карило?"
  },
  indoorActivities: {
    es: "Bajo techo",
    en: "Indoors",
    pt: "Coberto",
    ru: "В помещении"
  },
  rainyDayDesc: {
    es: " Disfrutar actividades cubiertas cuando llueve: spas, lugares con piletas cubiertas, masajes, gimnasio cubierto, cines y galerías comerciales.",
    en: " Enjoy indoor activities when it rains: spas, places with covered pools, massages, indoor gym, cinemas, and shopping galleries.",
    pt: " Aproveite atividades cobertas quando chove: spas, locais com piscinas cobertas, massagens, academia coberta, cinemas e galerias comerciais.",
    ru: " Насладиться активностями в помещении когда идет дождь: спа, места с крытыми бассейнами, массажи, крытый спортзал, кинотеатры и торговые галереи."
  },
  rainyDayActivities: {
    es: "Actividades para lluvia",
    en: "Rainy Day Activities",
    pt: "Atividades para chuva",
    ru: "Активности в Дождь"
  },
  cariloInWinter: {
    es: "Cariló en Invierno",
    en: "Cariló in Winter",
    pt: "Cariló no Inverno",
    ru: "Карило Зимой"
  },
  noCrowds: {
    es: "Sin multitudes",
    en: "No crowds",
    pt: "Sem multidões",
    ru: "Без толп"
  },
  winterDesc: {
    es: " Disfrutar actividades al aire libre con clima templado y sin las multitudes del verano: caminatas, ciclismo y deportes.",
    en: " Enjoy outdoor activities with mild weather and without summer crowds: hiking, cycling, and sports.",
    pt: " Aproveite atividades ao ar livre com clima ameno e sem as multidões do verão: caminhadas, ciclismo e esportes.",
    ru: " Наслаждаться активностями на свежем воздухе с умеренной погодой и без летних толп: прогулки, велосипед и спорт."
  },
  winterActivitiesLink: {
    es: "Actividades invernales",
    en: "Winter Activities",
    pt: "Atividades de inverno",
    ru: "Зимние Активности"
  },
  shoppingServices: {
    es: "Compras y Servicios",
    en: "Shopping and Services",
    pt: "Compras e Serviços",
    ru: "Покупки"
  },
  everythingNearby: {
    es: "Todo cerca",
    en: "Everything nearby",
    pt: "Tudo perto",
    ru: "Все рядом"
  },
  shoppingDesc: {
    es: " Resolver todo lo necesario para tu estadía: supermercados, productos frescos, carnicerías, ferreterías y servicios.",
    en: " Get everything you need for your stay: supermarkets, fresh produce, butcher shops, hardware stores, and services.",
    pt: " Resolva tudo o que você precisa para sua estadia: supermercados, produtos frescos, açougues, ferragems e serviços.",
    ru: " Решить все необходимое для вашего пребывания: супермаркеты, свежие продукты, мясные лавки, хозяйственные магазины и услуги."
  },
  viewShoppingServices: {
    es: "Ver Compras y Servicios",
    en: "View Shopping and Services",
    pt: "Ver Compras e Serviços",
    ru: "Смотреть Покупки"
  },
  surroundingsCarilo: {
    es: "Alrededores de Cariló",
    en: "Surroundings of Cariló",
    pt: "Arredores de Cariló",
    ru: "Окрестности Карило"
  },
  excursions: {
    es: "Excursiones",
    en: "Excursions",
    pt: "Excursões",
    ru: "Экскурсии"
  },
  surroundingsDesc: {
    es: " Explorar destinos cercanos: Pinamar, Mar de las Pampas, faros históricos y pueblos costeros de la región atlántica.",
    en: " Explore nearby destinations: Pinamar, Mar de las Pampas, historic lighthouses, and coastal towns of the Atlantic region.",
    pt: " Explorar destinos próximos: Pinamar, Mar de las Pampas, faróis históricos e cidades costeiras da região atlântica.",
    ru: " Исследовать ближайшие направления: Пинамар, Мар-де-лас-Пампас, исторические маяки и прибрежные города атлантического региона."
  },
  exploreSurroundings: {
    es: "Explorar Alrededores",
    en: "Explore Surroundings",
    pt: "Explorar Arredores",
    ru: "Все рядом"
  },
  options: {
    es: "opciones",
    en: "options",
    pt: "opções",
    ru: "вариантов"
  },
  min: {
    es: "min",
    en: "min",
    pt: "min",
    ru: "мин"
  },
  for: {
    es: "Para:",
    en: "For:",
    pt: "Para:",
    ru: "Для:"
  },
  reviews: {
    es: "reseñas",
    en: "reviews",
    pt: "avaliações",
    ru: "отзывов"
  },
  distanceFrom: {
    es: "Distancia desde",
    en: "Distance from",
    pt: "Distância de",
    ru: "Расстояние от"
  },
  viewOnGoogleMaps: {
    es: "Ver en Google Maps",
    en: "View on Google Maps",
    pt: "Ver no Google Maps",
    ru: "Открыть в Google Maps"
  },
  motorradTitle: {
    es: "Motorrad - Alquiler de Bicicletas",
    en: "Motorrad - Bicycle Rental",
    pt: "Motorrad - Aluguel de Bicicletas",
    ru: "Motorrad - Прокат Велосипедов"
  },
  motorradDesc: {
    es: "Alquilá bicicletas y explorá Cariló y las áreas circundantes. Las calles de arena sin pavimentar y el entorno natural de la ciudad hacen que la experiencia de ciclismo sea agradable.",
    en: "Rent bicycles and explore Cariló and surrounding areas. The unpaved sand streets and natural environment make cycling an enjoyable experience.",
    pt: "Alugue bicicletas e explore Cariló e áreas circundantes. As ruas de areia não pavimentadas e o ambiente natural tornam o ciclismo uma experiência agradável.",
    ru: "Возьмите велосипед напрокат и исследуйте Карило и окрестности. Грунтовые песчаные дороги и природная среда делают поездку на велосипеде приятным опытом."
  },
  offRoadEquipment: {
    es: "Equipos todo terreno",
    en: "Off-road equipment",
    pt: "Equipamentos todo-terreno",
    ru: "Внедорожное снаряжение"
  },
  walkingTime: {
    es: "min caminando",
    en: "min walking",
    pt: "min caminhando",
    ru: "мин пешком"
  },
  // Business descriptions
  cocoSurfDesc: {
    es: "Aprender surf y windsurf en la playa de Cariló con instructores profesionales. Alquiler de equipos incluido y clases para todos los niveles desde principiantes hasta avanzados.",
    en: "Learn surfing and windsurfing at Cariló beach with professional instructors. Equipment rental included and classes for all levels from beginners to advanced.",
    pt: "Aprenda surf e windsurf na praia de Cariló com instrutores profissionais. Aluguel de equipamentos incluído e aulas para todos os níveis, de iniciantes a avançados.",
    ru: "Обучение серфингу и виндсерфингу на пляже Карило с профессиональными инструкторами. Аренда оборудования включена, занятия для всех уровней от начинающих до продвинутых."
  },
  balnearioHemingwayDesc: {
    es: "Disfrutar de un día de playa con gastronomía de calidad y servicios completos frente al mar. El parador clásico de Cariló ofrece comida argentina, vista al océano y ambiente relajado.",
    en: "Enjoy a beach day with quality gastronomy and full services by the sea. Cariló's classic beach club offers Argentine cuisine, ocean views, and a relaxed atmosphere.",
    pt: "Aproveite um dia de praia com gastronomia de qualidade e serviços completos à beira-mar. O clássico clube de praia de Cariló oferece culinária argentina, vista para o oceano e ambiente descontraído.",
    ru: "Наслаждайтесь пляжным днем с качественной гастрономией и полным сервисом у моря. Классический пляжный клуб Карило предлагает аргентинскую кухню, вид на океан и расслабленную атмосферу."
  },
  cariloGolfDesc: {
    es: "Jugar golf en uno de los campos más prestigiosos de la costa argentina. Diseño de 18 hoyos par 73 rodeado de bosque de pinos con calles estrechas que demandan precisión.",
    en: "Play golf at one of the most prestigious courses on the Argentine coast. 18-hole par 73 design surrounded by pine forest with narrow fairways demanding precision.",
    pt: "Jogue golfe em um dos campos mais prestigiados da costa argentina. Design de 18 buracos par 73 cercado por floresta de pinheiros com fairways estreitos que exigem precisão.",
    ru: "Играйте в гольф на одном из самых престижных полей на аргентинском побережье. Дизайн на 18 лунок пар 73, окруженный сосновым лесом с узкими фарватерами, требующими точности."
  },
  cieDesc: {
    es: "Entrenar en un gimnasio completo rodeado de bosque con instructores incluidos. Pases diarios, semanales y mensuales disponibles.",
    en: "Train at a complete gym surrounded by forest with instructors included. Daily, weekly, and monthly passes available.",
    pt: "Treine em uma academia completa cercada por floresta com instrutores incluídos. Passes diários, semanais e mensais disponíveis.",
    ru: "Тренируйтесь в полнофункциональном спортзале в окружении леса с инструкторами. Доступны дневные, недельные и месячные абонементы."
  },
  clubTenisDesc: {
    es: "Jugar tenis, pádel y fútbol 5 en canchas de polvo de ladrillo. Alquiler de raquetas y clases disponibles.",
    en: "Play tennis, padel, and 5-a-side football on clay courts. Racket rental and classes available.",
    pt: "Jogue tênis, padel e futebol society em quadras de saibro. Aluguel de raquetes e aulas disponíveis.",
    ru: "Играйте в теннис, падел и мини-футбол на грунтовых кортах. Доступна аренда ракеток и занятия."
  },
  aireLibreDesc: {
    es: "Entrenar gratis las 24 horas en gimnasio al aire libre con barras de dominadas, paralelas y equipos de entrenamiento corporal.",
    en: "Train free 24 hours at an outdoor gym with pull-up bars, parallel bars, and bodyweight training equipment.",
    pt: "Treine grátis 24 horas em uma academia ao ar livre com barras de pull-up, barras paralelas e equipamentos de treino corporal.",
    ru: "Тренируйтесь бесплатно 24 часа в уличном спортзале с турниками, брусьями и оборудованием для тренировок с собственным весом."
  },
  dalmiroDesc: {
    es: "Paseos a caballo por la playa y bosques de Cariló. Experiencia única con caballos mansos y guías expertos.",
    en: "Horseback riding tours through Cariló beaches and forests. Unique experience with gentle horses and expert guides.",
    pt: "Passeios a cavalo pelas praias e florestas de Cariló. Experiência única com cavalos mansos e guias experientes.",
    ru: "Конные прогулки по пляжам и лесам Карило. Уникальный опыт с послушными лошадьми и опытными гидами."
  },
  cabalgatasDesc: {
    es: "Paseos a caballo por la costa atlántica y senderos del bosque. Salidas al amanecer y atardecer con grupos pequeños.",
    en: "Horseback riding along the Atlantic coast and forest trails. Sunrise and sunset departures with small groups.",
    pt: "Passeios a cavalo pela costa atlântica e trilhas da floresta. Saídas ao amanhecer e ao pôr do sol com grupos pequenos.",
    ru: "Конные прогулки вдоль атлантического побережья и лесных троп. Выезды на рассвете и закате с небольшими группами."
  }
}

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
  {
    src: "/photo/zona/File 24-04-2025, 10 36 15 PM (5) (1).jpg",
    alt: "Qué hacer en Cariló - vista panorámica de playa y bosque de pinos",
    title: "Playa de Cariló",
  }
]

export default function QueHacerEnCarilo() {
  const pathname = usePathname()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Detect language from URL pathname (for SSR compatibility)
  let detectedLang: 'es' | 'en' | 'pt' | 'ru' = 'es'
  if (pathname.startsWith('/ru')) detectedLang = 'ru'
  else if (pathname.startsWith('/en')) detectedLang = 'en'
  else if (pathname.startsWith('/pt')) detectedLang = 'pt'

  const lang = detectedLang
  const t = translations

  const businessCardTranslations = {
    for: t.for[lang],
    reviews: t.reviews[lang],
    distanceFrom: t.distanceFrom[lang],
    viewOnGoogleMaps: t.viewOnGoogleMaps[lang]
  }

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
                  {t.title[lang]}{t.inCarilo[lang]}
                </h1>
                <nav aria-label={t.indexTitle[lang]}>
                  <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 text-lg">
                    {([
                      ["#playas-naturaleza", t.beachNature[lang]],
                      ["#deportes-fitness", t.sportsFitness[lang]],
                      ["/restaurantes-carilo", t.foodRestaurants[lang]],
                      ["/que-hacer-en-carilo/cuando-llueve", t.rainyDay[lang]],
                      ["/que-hacer-en-carilo/en-invierno", t.winterActivities[lang]],
                      ["/alrededores-carilo", t.nearbyPlaces[lang]],
                    ] as const).map(([href, label]) => (
                      <li key={href}>
                        <Link href={href} className="inline-flex min-h-[44px] items-center text-blue-700 hover:text-blue-900">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="order-2 md:order-2">
                <button
                  onClick={() => openLightbox(cariloGalleryImages.length - 1)}
                  className="group relative block h-[300px] w-full cursor-zoom-in overflow-hidden rounded-xl md:h-[350px] lg:h-[450px] xl:h-[500px]"
                >
                  <Image
                    src="/photo/zona/File 24-04-2025, 10 36 15 PM (5) (1).jpg"
                    alt="Qué hacer en Cariló - vista panorámica de playa y bosque de pinos"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-base font-medium text-gray-900 shadow-sm">
                    <Image src="/icons/icons8/gallery.png" alt="" width={20} height={20} />
                    {t.photos[lang]}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
              {t.intro[lang]}
            </p>
          </div>
        </section>

        {/* Beach Activities Section */}
        <section id="playas-naturaleza" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t.beachNatureTitle[lang]}
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-10">
              {t.beachNatureDesc[lang]} <Link href="/team-building-carilo" className="text-gray-700 no-underline hover:text-gray-600">{t.groupActivities[lang]}</Link> {({ es: 'y', en: 'and', pt: 'e', ru: 'и' } as const)[lang]} <Link href="/eventos-corporativos-carilo" className="text-gray-700 no-underline hover:text-gray-600">{t.events[lang]}</Link>{t.outdoorActivities[lang]}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BusinessCard
                name="Coco Surf"
                description={t.cocoSurfDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="Balneario Hemingway"
                description={t.balnearioHemingwayDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <button onClick={() => openLightbox(16)} className="relative h-48 w-full cursor-zoom-in">
                  <Image
                    src="/quehacer/motorrad2.jpg"
                    alt="Motorrad alquiler de bicicletas en Cariló"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
                <div className="space-y-3 p-6 text-base">
                  <h3 className="text-xl font-semibold text-gray-900">{t.motorradTitle[lang]}</h3>
                  <p className="text-gray-700">{t.motorradDesc[lang]}</p>
                  <p className="text-gray-800">
                    <span className="text-yellow-600" aria-hidden="true">★</span> 4.6 (75+ {t.reviews[lang]}) · {t.offRoadEquipment[lang]}
                  </p>
                  <p className="flex items-center gap-1 text-gray-700">
                    <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
                    24 min
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Motorrad,+Cerezo,+Cariló,+Provincia+de+Buenos+Aires,+Argentina"
                    className="inline-flex min-h-[44px] items-center gap-2 font-medium text-blue-700 hover:text-blue-900"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Image src="/icons/icons8/marker.png" alt="" width={18} height={18} />
                    {t.viewOnGoogleMaps[lang]}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Activities Section */}
        <section id="deportes-fitness" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              {t.sportsActivitiesTitle[lang]}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BusinessCard
                name="Cariló Golf Club"
                description={t.cariloGolfDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="CIE - Centro de Entrenamiento"
                description={t.cieDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="Club de Tenis Cariló"
                description={t.clubTenisDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="Aire Libre, Libre"
                description={t.aireLibreDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="Dalmiro Paseo a Caballo"
                description={t.dalmiroDesc[lang]}
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
                translations={businessCardTranslations}
              />

              <BusinessCard
                name="Cabalgatas El Relincho"
                description={t.cabalgatasDesc[lang]}
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
                translations={businessCardTranslations}
              />
            </div>
          </div>
        </section>

        {/* More Experiences - Golden Standard Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              {t.moreExperiences[lang]}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Gastronomy Card */}
                <Link href="/restaurantes-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.restaurantsGastronomy[lang]}</h3>
                    </div>

                    <p className="text-gray-700 text-base mb-4">
                      <strong>{t.forDiscover[lang]}</strong>{t.discoverGastronomy[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-700">
                      <span className="font-medium">{t.fromIlBuco[lang]}</span>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
                        <span>15-30 {t.min[lang]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
                        <span>3-8 {t.min[lang]}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Rainy Day Activities */}
                <Link href="/que-hacer-en-carilo/cuando-llueve" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.rainingInCarilo[lang]}</h3>
                    </div>

                    <p className="text-gray-700 text-base mb-4">
                      <strong>{t.forDiscover[lang]}</strong>{t.rainyDayDesc[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-700">
                      <span className="font-medium">{t.fromIlBuco[lang]}</span>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
                        <span>15-30 {t.min[lang]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
                        <span>5-10 {t.min[lang]}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Winter Activities */}
                <Link href="/que-hacer-en-carilo/en-invierno" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.cariloInWinter[lang]}</h3>
                    </div>

                    <p className="text-gray-700 text-base mb-4">
                      <strong>{t.forDiscover[lang]}</strong>{t.winterDesc[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-700">
                      <span className="font-medium">{t.fromIlBuco[lang]}</span>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
                        <span>15-30 {t.min[lang]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
                        <span>5-10 {t.min[lang]}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Shopping & Services */}
                <Link href="/compras-servicios-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.shoppingServices[lang]}</h3>
                    </div>

                    <p className="text-gray-700 text-base mb-4">
                      <strong>{t.forDiscover[lang]}</strong>{t.shoppingDesc[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-700">
                      <span className="font-medium">{t.fromIlBuco[lang]}</span>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/walking.png" alt="" width={18} height={18} />
                        <span>20-40 {t.min[lang]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
                        <span>3-10 {t.min[lang]}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Surrounding Areas */}
                <Link href="/alrededores-carilo" className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.surroundingsCarilo[lang]}</h3>
                    </div>

                    <p className="text-gray-700 text-base mb-4">
                      <strong>{t.forDiscover[lang]}</strong>{t.surroundingsDesc[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-700">
                      <span className="font-medium">{t.fromIlBuco[lang]}</span>
                      <div className="flex items-center gap-1">
                        <Image src="/icons/icons8/car-sf.png" alt="" width={18} height={18} />
                        <span>10-30 {t.min[lang]}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
        </section>

      </main>

      <SiteFooter />

      <ImageLightbox
        images={cariloGalleryImages}
        isOpen={selectedImage !== null}
        currentIndex={selectedImage ?? 0}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </div>
  )
}
