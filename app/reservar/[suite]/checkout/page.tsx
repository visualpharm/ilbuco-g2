"use client"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, ShieldCheck, Lock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()

  const slug = params.suite as string
  const suiteName = slug === "whole-house"
    ? "Whole House"
    : slug.charAt(0).toUpperCase() + slug.slice(1)

  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = Number(searchParams.get("guests")) || 2
  const total = Number(searchParams.get("total")) || 0

  const [form, setForm] = useState({ name: "", email: "", phone: "", remarks: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = (es: string, en: string, pt: string, ru: string) => {
    const map: Record<string, string> = { es, en, pt, ru }
    return map[language.code] || es
  }

  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
  const nightlyAvg = nights > 0 ? Math.round(total / nights) : 0

  const formatDate = (d: string) => {
    try {
      return new Date(d + "T12:00:00").toLocaleDateString(
        language.code === "pt" ? "pt-BR" : language.code === "en" ? "en-US" : "es-AR",
        { day: "numeric", month: "short", year: "numeric" }
      )
    } catch {
      return d
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError(t("Completá tu nombre y email", "Enter your name and email", "Preencha nome e email", "Укажите имя и email"))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/mp/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: slug,
          checkIn,
          checkOut,
          guests,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          remarks: form.remarks || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t("Error al procesar", "Processing error", "Erro", "Ошибка"))
        return
      }

      // Redirect to Mercado Pago Checkout Pro
      window.location.href = data.init_point
    } catch {
      setError(t("Error de conexión", "Connection error", "Erro de conexão", "Ошибка соединения"))
    } finally {
      setSubmitting(false)
    }
  }

  // Validate we have the needed params
  if (!checkIn || !checkOut || !total) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              {t("Faltan datos de la reserva", "Missing booking details", "Dados incompletos", "Недостаточно данных")}
            </p>
            <Button onClick={() => router.push("/reservar")} variant="outline">
              {t("Volver", "Back", "Voltar", "Назад")}
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.push(`/reservar/${slug}`)}
            className="flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("Volver", "Back", "Voltar", "Назад")}
          </button>

          <h1 className="text-2xl font-bold mb-6">
            {t("Confirmá tu reserva", "Confirm your booking", "Confirme sua reserva", "Подтвердите бронирование")}
          </h1>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* ─── Guest form ─── */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("Nombre completo", "Full name", "Nome completo", "Полное имя")} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:border-black transition-colors"
                  placeholder={t("Juan Pérez", "John Smith", "João Silva", "Иван Петров")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("Email", "Email", "Email", "Email")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2.5 outline-none focus:border-black transition-colors"
                    placeholder="guest@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("Teléfono", "Phone", "Telefone", "Телефон")}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2.5 outline-none focus:border-black transition-colors"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("Comentarios", "Special requests", "Observações", "Пожелания")}
                </label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:border-black transition-colors resize-none"
                  placeholder={t(
                    "Hora estimada de llegada, peticiones especiales…",
                    "Estimated arrival time, special requests…",
                    "Horário estimado de chegada…",
                    "Примерное время заезда, особые пожелания…"
                  )}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t("Procesando…", "Processing…", "Processando…", "Обработка…")}
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      {t("Pagar con Mercado Pago", "Pay with Mercado Pago", "Pagar com Mercado Pago", "Оплатить через Mercado Pago")}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t(
                    "Pago seguro · Serás redirigido a Mercado Pago",
                    "Secure payment · You'll be redirected to Mercado Pago",
                    "Pagamento seguro · Será redirecionado",
                    "Безопасная оплата через Mercado Pago"
                  )}
                </p>
              </div>
            </form>

            {/* ─── Order summary ─── */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <h2 className="font-bold text-lg mb-4">
                  {t("Detalle de tu reserva", "Your booking", "Sua reserva", "Ваше бронирование")}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Suite", "Suite", "Suíte", "Сьют")}</span>
                    <span className="font-medium">{suiteName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Check-in", "Check-in", "Check-in", "Заезд")}</span>
                    <span className="font-medium">{formatDate(checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Check-out", "Check-out", "Check-out", "Выезд")}</span>
                    <span className="font-medium">{formatDate(checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Huéspedes", "Guests", "Hóspedes", "Гости")}</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Noches", "Nights", "Noites", "Ночей")}</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t("Precio promedio/noche", "Average price/night", "Preço médio/noite", "Средняя цена/ночь")}</span>
                    <span>${nightlyAvg}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t">
                    <span>{t("Total", "Total", "Total", "Итого")}</span>
                    <span>${total} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
