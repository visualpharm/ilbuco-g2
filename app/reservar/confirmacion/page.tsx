"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageCircle, Clock, KeyRound, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const ref = searchParams.get("ref") || ""
  const status = searchParams.get("status")

  // Parse external_reference: "ilbuco:{suite}:{propertyId}:{checkIn}:{checkOut}:{guests}:{total}"
  const parts = ref.split(":")
  const suite = parts[1] || ""
  const checkIn = parts[3] || ""
  const checkOut = parts[4] || ""
  const guests = parts[5] || ""
  const total = parts[6] || ""

  const suiteName = suite === "whole-house"
    ? "Whole House"
    : suite ? suite.charAt(0).toUpperCase() + suite.slice(1) : ""

  const isPending = status === "pending"
  const isMissing = !ref || !suite

  const t = (es: string, en: string, pt: string, ru: string) => {
    const map: Record<string, string> = { es, en, pt, ru }
    return map[language.code] || es
  }

  const formatDate = (d: string) => {
    if (!d) return ""
    try {
      return new Date(d + "T12:00:00").toLocaleDateString(
        language.code === "pt" ? "pt-BR" : language.code === "en" ? "en-US" : "es-AR",
        { day: "numeric", month: "long", year: "numeric" }
      )
    } catch {
      return d
    }
  }

  // ─── Missing ref — generic thank you ───
  if (isMissing) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {t("¡Gracias por tu reserva!", "Thank you for your booking!", "Obrigado pela sua reserva!", "Спасибо за бронирование!")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t(
                "Te enviamos un email con todos los detalles.",
                "We've sent you an email with all the details.",
                "Enviamos um email com todos os detalhes.",
                "Мы отправили вам письмо с деталями."
              )}
            </p>
            <Link href="/">
              <Button variant="outline">{t("Volver al inicio", "Back to home", "Voltar ao início", "На главную")}</Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // ─── Pending payment ───
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {t("Pago en proceso", "Payment in process", "Pagamento em processo", "Платеж в обработке")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t(
                "Tu pago está siendo procesado. Te avisaremos en cuanto se confirme.",
                "Your payment is being processed. We'll notify you once confirmed.",
                "Seu pagamento está sendo processado. Avisaremos assim que confirmado.",
                "Ваш платеж обрабатывается. Мы сообщим, как только он подтвердится."
              )}
            </p>
            <BookingSummary suiteName={suiteName} checkIn={checkIn} checkOut={checkOut} guests={guests} total={total} t={t} />
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // ─── Success ───
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {t("¡Reserva confirmada!", "Booking confirmed!", "Reserva confirmada!", "Бронирование подтверждено!")}
              </h1>
              <p className="text-gray-600">
                {t(
                  "Tu estadía en Il Buco está garantizada. Te esperamos en Cariló.",
                  "Your stay at Il Buco is confirmed. See you in Cariló.",
                  "Sua estadia no Il Buco está garantida. Te esperamos em Cariló.",
                  "Ваше проживание в Il Buco подтверждено. Ждем вас в Карило."
                )}
              </p>
            </div>

            {/* Booking summary */}
            <BookingSummary suiteName={suiteName} checkIn={checkIn} checkOut={checkOut} guests={guests} total={total} t={t} />

            {/* What happens next */}
            <div className="border rounded-xl p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">
                {t("¿Qué pasa ahora?", "What happens next?", "E agora?", "Что дальше?")}
              </h2>

              <div className="space-y-4">
                <Step
                  icon={<Mail className="h-5 w-5" />}
                  title={t("Email de confirmación", "Confirmation email", "Email de confirmação", "Письмо подтверждения")}
                  desc={t(
                    "Recibirás un email con todos los detalles de tu reserva.",
                    "You'll receive an email with your booking details.",
                    "Receberá um email com os detalhes da reserva.",
                    "Вы получите письмо с деталями бронирования."
                  )}
                />
                <Step
                  icon={<KeyRound className="h-5 w-5" />}
                  title={t("Código de acceso", "Access code", "Código de acesso", "Код доступа")}
                  desc={t(
                    "24 hs antes del check-in te enviaremos el código del candado de tu suite por WhatsApp y email.",
                    "24h before check-in, we'll send your suite's lock code via WhatsApp and email.",
                    "24h antes do check-in, enviaremos o código da fechadura por WhatsApp e email.",
                    "За 24 часа до заезда мы пришлем код замка через WhatsApp и email."
                  )}
                />
                <Step
                  icon={<MessageCircle className="h-5 w-5" />}
                  title={t("¿Dudas? Escríbenos", "Questions? Contact us", "Dúvidas? Fale conosco", "Вопросы? Напишите нам")}
                  desc={t(
                    "Estamos disponibles por WhatsApp para cualquier consulta.",
                    "We're available on WhatsApp for any questions.",
                    "Estamos disponíveis no WhatsApp.",
                    "Мы доступны в WhatsApp."
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5491121275492"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t("Escribir por WhatsApp", "Message on WhatsApp", "WhatsApp", "Написать в WhatsApp")}
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  {t("Volver al inicio", "Back to home", "Voltar", "На главную")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function BookingSummary({
  suiteName, checkIn, checkOut, guests, total, t
}: {
  suiteName: string; checkIn: string; checkOut: string; guests: string; total: string
  t: (es: string, en: string, pt: string, ru: string) => string
}) {
  const formatDate = (d: string) => {
    if (!d) return "—"
    try {
      return new Date(d + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
    } catch {
      return d
    }
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 mb-6 text-left">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{t("Suite", "Suite", "Suíte", "Сьют")}</span>
          <span className="font-medium">{suiteName || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t("Check-in", "Check-in", "Check-in", "Заезд")}</span>
          <span className="font-medium">{formatDate(checkIn)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t("Check-out", "Check-out", "Check-out", "Выезд")}</span>
          <span className="font-medium">{formatDate(checkOut)}</span>
        </div>
        {guests && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("Huéspedes", "Guests", "Hóspedes", "Гости")}</span>
            <span className="font-medium">{guests}</span>
          </div>
        )}
        {total && (
          <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
            <span>{t("Total pagado", "Total paid", "Total pago", "Оплачено")}</span>
            <span>${total} USD</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Step({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
