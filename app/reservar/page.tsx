"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Users, Search, Star, MapPin, Check, X, Loader2 } from "lucide-react"
import { format, differenceInCalendarDays } from "date-fns"
import { es, enUS, ptBR } from "date-fns/locale"
import { useLanguage } from "@/contexts/language-context"
import type { DateRange } from "react-day-picker"

interface SuiteInfo {
  slug: string
  name: string
  capacity: number
  description: { es: string; en: string; pt: string; ru: string }
  image: string
  features: { es: string[]; en: string[]; pt: string[]; ru: string[] }
}

const SUITES: SuiteInfo[] = [
  {
    slug: "giardino",
    name: "Giardino",
    capacity: 4,
    description: {
      es: "Suite con vista al jardín, cocina equipada y baño privado",
      en: "Garden-view suite with full kitchen and private bathroom",
      pt: "Suíte com vista para o jardim, cozinha equipada e banheiro privativo",
      ru: "Сьют с видом на сад, полностью оборудованной кухней и отдельной ванной",
    },
    image: "/photo/giardino/giardino1.jpg",
    features: {
      es: ["40 m²", "Cocina", "Baño privado", "Wifi"],
      en: ["40 m²", "Kitchen", "Private bath", "Wifi"],
      pt: ["40 m²", "Cozinha", "Banheiro privativo", "Wifi"],
      ru: ["40 м²", "Кухня", "Санузел", "Wifi"],
    },
  },
  {
    slug: "terrazzo",
    name: "Terrazzo",
    capacity: 4,
    description: {
      es: "Suite con gran terraza privada de 40 m² con vegetación",
      en: "Suite with a large 40 m² private terrace with greenery",
      pt: "Suíte com grande terraço privativo de 40 m² com vegetação",
      ru: "Сьют с большой приватной террасой 40 м² с растениями",
    },
    image: "/photo/terrazzo/terrazzo1.jpg",
    features: {
      es: ["40 m² terraza", "Cocina", "Baño privado", "Wifi"],
      en: ["40 m² terrace", "Kitchen", "Private bath", "Wifi"],
      pt: ["Terraço 40 m²", "Cozinha", "Banheiro privativo", "Wifi"],
      ru: ["Терраса 40 м²", "Кухня", "Санузел", "Wifi"],
    },
  },
  {
    slug: "paraiso",
    name: "Paraiso",
    capacity: 4,
    description: {
      es: "Suite con vista al bosque, ideal para familias",
      en: "Forest-view suite, ideal for families",
      pt: "Suíte com vista para a floresta, ideal para famílias",
      ru: "Сьют с видом на лес, идеально для семей",
    },
    image: "/photo/paraiso/paraiso1.jpg",
    features: {
      es: ["Vista al bosque", "Cocina", "Baño privado", "Wifi"],
      en: ["Forest view", "Kitchen", "Private bath", "Wifi"],
      pt: ["Vista para floresta", "Cozinha", "Banheiro privativo", "Wifi"],
      ru: ["Вид на лес", "Кухня", "Санузел", "Wifi"],
    },
  },
  {
    slug: "penthouse",
    name: "Penthouse",
    capacity: 4,
    description: {
      es: "Suite penthouse con ventanal esquinado y vista panorámica al bosque",
      en: "Penthouse suite with corner windows and panoramic forest views",
      pt: "Suíte penthouse com janelas de canto e vista panorâmica da floresta",
      ru: "Пентхаус с панорамными окнами и видом на лес",
    },
    image: "/photo/exterior/exterior5.jpg",
    features: {
      es: ["Penthouse", "Sundeck", "Vista al bosque", "Wifi"],
      en: ["Penthouse", "Sundeck", "Forest view", "Wifi"],
      pt: ["Penthouse", "Sundeck", "Vista para floresta", "Wifi"],
      ru: ["Пентхаус", "Солнечная терраса", "Вид на лес", "Wifi"],
    },
  },
  {
    slug: "whole-house",
    name: "Whole House",
    capacity: 16,
    description: {
      es: "Toda la casa: las 4 suites para grupos grandes o familias extendidas",
      en: "The entire house: all 4 suites for large groups or extended families",
      pt: "A casa inteira: todas as 4 suítes para grupos grandes",
      ru: "Весь дом: все 4 сьюта для больших групп",
    },
    image: "/photo/exterior/exterior4.jpg",
    features: {
      es: ["4 suites", "16 huéspedes", "Casa completa", "Eventos"],
      en: ["4 suites", "16 guests", "Entire house", "Events"],
      pt: ["4 suítes", "16 hóspedes", "Casa completa", "Eventos"],
      ru: ["4 сьюта", "16 гостей", "Весь дом", "События"],
    },
  },
]

interface AvailabilityRoom {
  name: string
  slug: string
  available: boolean
  price: number | null
  nights: number
}

export default function ReservarPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(2)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<AvailabilityRoom[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const dateLocale = language.code === "pt" ? ptBR : language.code === "en" ? enUS : es

  const nights = dateRange?.from && dateRange?.to
    ? differenceInCalendarDays(dateRange.to, dateRange.from)
    : 0

  const handleSearch = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return
    setSearching(true)
    setSearchError(null)
    try {
      const start = format(dateRange.from, "yyyy-MM-dd")
      const end = format(dateRange.to, "yyyy-MM-dd")
      const res = await fetch(`/api/availability?start=${start}&end=${end}`)
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.rooms)
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Error searching availability")
    } finally {
      setSearching(false)
    }
  }, [dateRange])

  const getRoomInfo = (slug: string) => SUITES.find((s) => s.slug === slug)

  const t = (es: string, en: string, pt: string, ru: string) => {
    const map: Record<string, string> = { es, en, pt, ru }
    return map[language.code] || es
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* ─── Search hero ─── */}
        <section className="bg-gradient-to-b from-gray-50 to-white border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t("Reservá tu estadía en Cariló", "Book your stay in Cariló", "Reserve sua estadia em Cariló", "Забронируйте проживание в Карило")}
            </h1>
            <p className="text-gray-600 mb-8">
              {t(
                "Seleccioná tus fechas y encontrá la suite perfecta",
                "Select your dates and find the perfect suite",
                "Selecione suas datas e encontre a suíte perfeita",
                "Выберите даты и найдите идеальный сьют"
              )}
            </p>

            <div className="bg-white rounded-xl shadow-lg border p-4 md:p-6">
              <div className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end">
                {/* Date range picker */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Fechas", "Dates", "Datas", "Даты")}
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex-1 min-w-[140px] border rounded-lg px-3 py-2.5">
                      {dateRange?.from ? (
                        <span className="text-sm font-medium">
                          {format(dateRange.from, "dd MMM yyyy", { locale: dateLocale })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">{t("Check-in", "Check-in", "Check-in", "Заезд")}</span>
                      )}
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="flex-1 min-w-[140px] border rounded-lg px-3 py-2.5">
                      {dateRange?.to ? (
                        <span className="text-sm font-medium">
                          {format(dateRange.to, "dd MMM yyyy", { locale: dateLocale })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">{t("Check-out", "Check-out", "Check-out", "Выезд")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Huéspedes", "Guests", "Hóspedes", "Гости")}
                  </label>
                  <div className="flex items-center border rounded-lg px-3 py-2.5">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <Button
                  onClick={handleSearch}
                  disabled={!dateRange?.from || !dateRange?.to || searching}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2.5"
                >
                  {searching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      {t("Buscar", "Search", "Buscar", "Поиск")}
                    </>
                  )}
                </Button>
              </div>

              {/* Inline calendar — appears when dates not yet selected */}
              {(!dateRange?.from || !dateRange?.to) && (
                <div className="mt-6 flex justify-center">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={dateLocale}
                  />
                </div>
              )}

              {/* Compact date-change calendar once dates are set */}
              {dateRange?.from && dateRange?.to && (
                <div className="mt-6 flex justify-center">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={dateLocale}
                  />
                </div>
              )}

              {nights > 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  {nights} {nights === 1 ? t("noche", "night", "noite", "ночь") : t("noches", "nights", "noites", "ночей")}
                </p>
              )}
            </div>

            {searchError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {searchError}
              </div>
            )}
          </div>
        </section>

        {/* ─── Results ─── */}
        {results && (
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-6">
                  {t("Habitaciones disponibles", "Available rooms", "Quartos disponíveis", "Доступные номера")}
                </h2>

                <div className="space-y-4">
                  {SUITES.map((suite) => {
                    const avail = results.find((r) => r.slug === suite.slug)
                    const isAvailable = avail?.available && avail?.price !== null

                    return (
                      <div
                        key={suite.slug}
                        className={`border rounded-xl overflow-hidden flex flex-col md:flex-row transition-shadow ${
                          isAvailable ? "hover:shadow-lg cursor-pointer" : "opacity-60"
                        }`}
                        onClick={() => isAvailable && router.push(`/reservar/${suite.slug}?checkIn=${format(dateRange!.from!, "yyyy-MM-dd")}&checkOut=${format(dateRange!.to!, "yyyy-MM-dd")}&guests=${guests}`)}
                      >
                        {/* Image */}
                        <div className="md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={suite.image}
                            alt={suite.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold">{suite.name}</h3>
                              {suite.slug === "whole-house" && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                  {t("Casa completa", "Entire house", "Casa completa", "Весь дом")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {suite.description[language.code] || suite.description.es}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" /> {suite.capacity}
                              </span>
                              {suite.features[language.code]?.map((f, i) => (
                                <span key={i}>{f}</span>
                              ))}
                            </div>
                          </div>

                          {/* Price + CTA */}
                          <div className="mt-4 md:mt-0 md:text-right md:ml-6 flex md:block items-center justify-between md:justify-end gap-3">
                            {isAvailable ? (
                              <>
                                <div>
                                  <div className="text-2xl font-bold">
                                    ${avail!.price}
                                    <span className="text-sm font-normal text-gray-500">
                                      {" "}/ {t("noche", "night", "noite", "ночь")}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {nights} {nights === 1 ? t("noche", "night", "noite", "ночь") : t("noches", "nights", "noites", "ночей")} · ${(avail!.price || 0) * nights} {t("total", "total", "total", "итого")}
                                  </div>
                                </div>
                                <Button className="bg-black hover:bg-gray-800 text-white md:mt-2">
                                  {t("Ver detalle", "View details", "Ver detalhes", "Подробнее")}
                                </Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-400">
                                <X className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                  {t("No disponible", "Unavailable", "Indisponível", "Недоступно")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Initial state — no search yet ─── */}
        {!results && !searching && (
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SUITES.map((suite) => (
                    <div key={suite.slug} className="border rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={suite.image} alt={suite.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold mb-1">{suite.name}</h3>
                        <p className="text-sm text-gray-500">
                          {t("Desde", "From", "A partir de", "От")} $65 USD / {t("noche", "night", "noite", "ночь")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
