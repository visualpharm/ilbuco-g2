"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { ROOMS, fechaLarga } from "@/lib/late-checkout"

type Result = { status: string; room?: string; date?: string; until?: string; ars?: number }

function Done() {
  const params = useSearchParams()
  const paymentId = params.get("payment_id") || params.get("collection_id") || ""
  const [res, setRes] = useState<Result | null>(null)

  useEffect(() => {
    if (!paymentId) {
      setRes({ status: "invalid" })
      return
    }
    let tries = 0
    const check = async () => {
      try {
        const r = await fetch(`/api/late-checkout/confirm?payment_id=${encodeURIComponent(paymentId)}`, { cache: "no-store" })
        const body: Result = await r.json()
        // A card can take a few seconds to settle: re-check a pending payment for a minute.
        if ((body.status === "pending" || body.status === "in_process" || body.status === "unknown") && tries++ < 12) {
          setRes(body)
          setTimeout(check, 5000)
          return
        }
        setRes(body)
      } catch {
        setRes({ status: "unknown" })
      }
    }
    check()
  }, [paymentId])

  const room = ROOMS.find((r) => r.key === res?.room)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <SiteHeader />
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-24 md:pt-32 pb-16 text-lg [text-wrap:pretty]">
        {!res && <p>Confirmando el pago…</p>}
        {res?.status === "approved" && room && (
          <>
            <h1 className="text-3xl font-bold mb-3">Listo</h1>
            <p>
              Podés quedarte en {room.name} hasta las {res.until} del {fechaLarga(res.date!)}. Ya le avisamos a Melody, que limpia la casa.
            </p>
          </>
        )}
        {(res?.status === "pending" || res?.status === "in_process") && (
          <>
            <h1 className="text-3xl font-bold mb-3">Pago en proceso</h1>
            <p>Mercado Pago todavía lo está procesando. Apenas se acredite, queda confirmado.</p>
          </>
        )}
        {res?.status === "unknown" && (
          <>
            <h1 className="text-3xl font-bold mb-3">Todavía no pudimos confirmarlo</h1>
            <p>Si Mercado Pago te mostró el pago aprobado, está registrado y Melody lo ve. No hace falta pagar de nuevo.</p>
          </>
        )}
        {res && ["rejected", "cancelled", "invalid"].includes(res.status) && (
          <>
            <h1 className="text-3xl font-bold mb-3">El pago no se completó</h1>
            <p className="mb-6">No se cobró nada.</p>
            <Link href="/late-checkout" className="underline font-medium">Volver a intentar</Link>
          </>
        )}
      </main>
    </div>
  )
}

export default function DonePage() {
  return (
    <Suspense>
      <Done />
    </Suspense>
  )
}
