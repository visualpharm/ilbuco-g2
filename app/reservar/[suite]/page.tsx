"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Users, MapPin, Check, Loader2, ChevronLeft } from "lucide-react"
import { format, differenceInCalendarDays } from "date-fns"
import { es, enUS, ptBR } from "date-fns/locale"
import { useLanguage } from "@/contexts/language-context"
import type { DateRange } from "react-day-picker"

interface SuiteDetail {
  slug: string
  name: string
  capacity: number
  images: string[]
  description: { es: string; en: string; pt: string; ru: string }
  amenities: { es: string[]; en: string[]; pt: string[]; ru: string[] }
}

const SUITE_DETAILS: Record<string, SuiteDetail> = {
  giardino: {
    slug: "giardino",
    name: "Giardino",
    capacity: 4,
    images: [
      "/photo/giardino/giardino1.jpg",
      "/photo/giardino/giardino2.jpg",
      "/photo/giardino/giardino3.jpg",
      "/photo/giardino/giardino5.jpg",
    ],
    description: {
      es: "Suite con vista al jardín, cocina completamente equipada con heladera, baño privado y acceso independiente. Ideal para parejas o familias pequeñas.",
      en: "Garden-view suite with fully equipped kitchen (full-size fridge), private bathroom, and separate entrance. Perfect for couples or small families.",
      pt: "Suíte com vista para o jardim, cozinha totalmente equipada com geladeira, banheiro privativo e entrada independente. Ideal para casais ou famílias pequenas.",
      ru: "Сьют с видом на сад, полностью оборудованной кухней с холодильником, отдельной ванной и отдельным входом. Идеально для пар и небольших семей.",
    },
    amenities: {
      es: ["Cocina equipada", "Heladera", "Baño privado", "Wifi alta velocidad", "Aire acondicionado", "Estacionamiento"],
      en: ["Full kitchen", "Refrigerator", "Private bathroom", "High-speed wifi", "Air conditioning", "Parking"],
      pt: ["Cozinha equipada", "Geladeira", "Banheiro privativo", "Wifi alta velocidade", "Ar condicionado", "Estacionamento"],
      ru: ["Полная кухня", "Холодильник", "Собственный санузел", "Быстрый Wi-Fi", "Кондиционер", "Парковка"],
    },
  },
  terrazzo: {
    slug: "terrazzo",
    name: "Terrazzo",
    capacity: 4,
    images: [
      "/photo/terrazzo/terrazzo1.jpg",
      "/photo/terrazzo/terrazzo2.jpg",
      "/photo/terrazzo/terrazzo3.jpg",
      "/photo/terrazzo/terrazzo4.jpg",
    ],
    description: {
      es: "Suite con una gran terraza privada de 40 m² con vegetación integrada. La terraza tiene muebles de exterior y es perfecta para desayunos al aire libre.",
      en: "Suite with a large 40 m² private terrace with integrated greenery. Outdoor furniture makes it perfect for al fresco breakfasts.",
      pt: "Suíte com grande terraço privativo de 40 m² com vegetação integrada. Mobiliário exterior, perfeito para cafés da manhã ao ar livre.",
      ru: "Сьют с большой приватной террасой 40 м² с интегрированной зеленью. Садовая мебель — идеально для завтраков на свежем воздухе.",
    },
    amenities: {
      es: ["Terraza privada 40 m²", "Cocina equipada", "Baño privado", "Wifi alta velocidad", "Aire acondicionado"],
      en: ["Private terrace 40 m²", "Full kitchen", "Private bathroom", "High-speed wifi", "Air conditioning"],
      pt: ["Terraço privativo 40 m²", "Cozinha equipada", "Banheiro privativo", "Wifi alta velocidade", "Ar condicionado"],
      ru: ["Приватная терраса 40 м²", "Полная кухня", "Санузел", "Быстрый Wi-Fi", "Кондиционер"],
    },
  },
  paraiso: {
    slug: "paraiso",
    name: "Paraiso",
    capacity: 4,
    images: [
      "/photo/paraiso/paraiso1.jpg",
      "/photo/paraiso/paraiso7.jpg",
      "/photo/paraiso/paraiso3.jpg",
      "/photo/paraiso/paraiso4.jpg",
    ],
    description: {
      es: "Suite con vista directa al bosque de Cariló. Espacioso y luminoso, ideal para familias. Cocina equipada y baño privado.",
      en: "Suite with direct forest views of Cariló's pine woods. Spacious and bright, ideal for families. Full kitchen and private bathroom.",
      pt: "Suíte com vista direta para a floresta de Cariló. Espaçoso e iluminado, ideal para famílias.",
      ru: "Сьют с прямым видом на лес Карило. Просторный и светлый, идеально для семей.",
    },
    amenities: {
      es: ["Vista al bosque", "Cocina equipada", "Baño privado", "Wifi alta velocidad", "Aire acondicionado"],
      en: ["Forest view", "Full kitchen", "Private bathroom", "High-speed wifi", "Air conditioning"],
      pt: ["Vista para floresta", "Cozinha equipada", "Banheiro privativo", "Wifi", "Ar condicionado"],
      ru: ["Вид на лес", "Полная кухня", "Санузел", "Wi-Fi", "Кондиционер"],
    },
  },
  penthouse: {
    slug: "penthouse",
    name: "Penthouse",
    capacity: 4,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penthouse_corner%20window-m9Wog22hf421cCpCzob9Pc2GGzSUJL.webp",
      "/photo/exterior/exterior5.jpg",
    ],
    description: {
      es: "Suite penthouse con ventanal esquinado y vista panorámica al bosque. Sundeck privado. La suite más exclusiva de la casa.",
      en: "Penthouse suite with corner windows and panoramic forest views. Private sundeck. The most exclusive suite in the house.",
      pt: "Suíte penthouse com janelas de canto e vista panorâmica da floresta. Sundeck privativo.",
      ru: "Пентхаус с панорамными окнами и видом на лес. Приватная солнечная терраса.",
    },
    amenities: {
      es: ["Penthouse", "Sundeck privado", "Vista panorámica", "Cocina equipada", "Wifi alta velocidad"],
      en: ["Penthouse", "Private sundeck", "Panoramic view", "Full kitchen", "High-speed wifi"],
      pt: ["Penthouse", "Sundeck privativo", "Vista panorâmica", "Cozinha", "Wifi"],
      ru: ["Пентхаус", "Солнечная терраса", "Панорамный вид", "Кухня", "Wi-Fi"],
    },
  },
  "whole-house": {
    slug: "whole-house",
    name: "Whole House",
    capacity: 16,
    images: [
      "/photo/exterior/exterior4.jpg",
      "/photo/living/living3.jpg",
      "/photo/living/living1.jpg",
      "/photo/exterior/exterior5.jpg",
    ],
    description: {
      es: "Toda la casa para ti: las 4 suites (Giardino, Terrazzo, Paraiso y Penthouse) con espacios comunes. Ideal para grupos grandes, eventos familiares o retiros.",
      en: "The entire house: all 4 suites (Giardino, Terrazzo, Paraiso, Penthouse) with shared spaces. Perfect for large groups, family events, or retreats.",
      pt: "A casa inteira: todas as 4 suítes com espaços compartilhados. Ideal para grupos grandes.",
      ru: "Весь дом: все 4 сьюта с общими пространствами. Идеально для больших групп.",
    },
    amenities: {
      es: ["4 suites completas", "Hasta 16 huéspedes", "Cocina común", "Eventos posibles", "Estacionamiento"],
      en: ["4 full suites", "Up to 16 guests", "Shared kitchen", "Events possible", "Parking"],
      pt: ["4 suítes completas", "Até 16 hóspedes", "Cozinha compartilhada", "Eventos", "Estacionamento"],
      ru: ["4 полных сьюта", "До 16 гостей", "Общая кухня", "События", "Парковка"],
    },
  },
}

export default function SuitePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()

  const slug = params.suite as string
  const detail = SUITE_DETAILS[slug]

  const today = new Date(new Date().setHours(0, 0, 0, 0))

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    if (checkIn && checkOut) {
      return { from: new Date(checkIn + "T12:00:00"), to: new Date(checkOut + "T12:00:00") }
    }
    return undefined
  })
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2)
  const [activeImage, setActiveImage] = useState(0)
  const [pricing, setPricing] = useState<{ total: number; nights: number; nightly: number[] } | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  const dateLocale = language.code === "pt" ? ptBR : language.code === "en" ? enUS : es

  const nights = dateRange?.from && dateRange?.to
    ? differenceInCalendarDays(dateRange.to, dateRange.from)
    : 0

  const t = (es: string, en: string, pt: string, ru: string) => {
    const map: Record<string, string> = { es, en, pt, ru }
    return map[language.code] || es
  }

  // Fetch pricing when dates are selected
  const fetchPricing = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return
    setLoadingPrice(true)
    setAvailabilityError(null)
    try {
      const start = format(dateRange.from, "yyyy-MM-dd")
      const end = format(dateRange.to, "yyyy-MM-dd")
      const res = await fetch(`/api/availability?start=${start}&end=${end}`)
      const data = await res.json()
      if (data.error) {
        setAvailabilityError(data.error)
        return
      }
      const room = data.rooms?.find((r: { slug: string }) => r.slug === slug)
      if (!room) {
        setAvailabilityError("Suite not found")
        return
      }
      if (!room.available) {
        setAvailabilityError(t(
          "Las fechas seleccionadas no están disponibles para esta suite",
          "The selected dates are not available for this suite",
          "As datas selecionadas não estão disponíveis para esta suíte",
          "Выбранные даты недоступны для этого сьюта"
        ))
        setPricing(null)
        return
      }
      const nightly = room.dates.map((d: { price: number }) => d.price)
      const total = nightly.reduce((s: number, p: number) => s + p, 0)
      setPricing({ total, nights: room.nights, nightly })
    } catch {
      setAvailabilityError("Error checking availability")
    } finally {
      setLoadingPrice(false)
    }
  }, [dateRange, slug, language.code])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchPricing()
    } else {
      setPricing(null)
    }
  }, [dateRange, fetchPricing])

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Suite not found</p>
      </div>
    )
  }

  const handleReserve = () => {
    if (!dateRange?.from || !dateRange?.to || !pricing) return
    const checkIn = format(dateRange.from, "yyyy-MM-dd")
    const checkOut = format(dateRange.to, "yyyy-MM-dd")
    router.push(`/reservar/${slug}/checkout?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&total=${pricing.total}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Back link */}
          <button
            onClick={() => router.push("/reservar")}
            className="flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("Volver a la búsqueda", "Back to search", "Voltar à busca", "Назад к поиску")}
          </button>

          {/* ─── Gallery ─── */}
          <div className="grid md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
            <div className="md:col-span-4 lg:col-span-3 h-64 md:h-96 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={detail.images[activeImage]} alt={detail.name} className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-1 gap-2">
              {detail.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-full overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? "border-black" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* ─── Left: details ─── */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{detail.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {t("Hasta", "Up to", "Até", "До")} {detail.capacity} {t("huéspedes", "guests", "hóspedes", "гостей")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Cariló, Buenos Aires
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">
                {detail.description[language.code] || detail.description.es}
              </p>

              {/* Amenities */}
              <h2 className="text-xl font-bold mb-4">
                {t("Comodidades", "Amenities", "Comodidades", "Удобства")}
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {(detail.amenities[language.code] || detail.amenities.es).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Right: booking widget ─── */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-baseline gap-1 mb-4">
                  {pricing ? (
                    <>
                      <span className="text-3xl font-bold">${pricing.nightly[0]}</span>
                      <span className="text-gray-500 text-sm">/ {t("noche", "night", "noite", "ночь")}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-gray-500">
                        {t("Seleccioná fechas para ver precios", "Select dates for prices", "Selecione datas", "Выберите даты")}
                      </span>
                    </>
                  )}
                </div>

                {/* Date picker */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Fechas", "Dates", "Datas", "Даты")}
                </label>
                <div className="flex justify-center mb-4">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={(date) => date < today}
                    locale={dateLocale}
                  />
                </div>

                {/* Guests */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Huéspedes", "Guests", "Hóspedes", "Гости")}
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2.5 mb-4">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="bg-transparent text-sm font-medium outline-none cursor-pointer w-full"
                  >
                    {Array.from({ length: detail.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Price breakdown */}
                {pricing && !availabilityError && (
                  <div className="border-t pt-4 mb-4">
                    {pricing.nightly.map((price, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t("Noche", "Night", "Noite", "Ночь")} {i + 1}</span>
                        <span>${price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                      <span>{t("Total", "Total", "Total", "Итого")}</span>
                      <span>${pricing.total} USD</span>
                    </div>
                  </div>
                )}

                {loadingPrice && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}

                {availabilityError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                    {availabilityError}
                  </div>
                )}

                <Button
                  onClick={handleReserve}
                  disabled={!dateRange?.from || !dateRange?.to || !pricing || !!availabilityError || loadingPrice}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
                >
                  {t("Reservar", "Reserve", "Reservar", "Забронировать")}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  {t(
                    "Pago seguro vía Mercado Pago · No se cobra nada hasta confirmar",
                    "Secure payment via Mercado Pago · No charge until confirmed",
                    "Pagamento seguro via Mercado Pago",
                    "Безопасная оплата через Mercado Pago"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
