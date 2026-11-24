"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { ROOMS, fechaLarga, pesos, hhmm, STANDARD_CHECKOUT_HOUR, type LateOffer, type RoomKey } from "@/lib/late-checkout"

type Offer = Omit<LateOffer, "reservationCode">

function LateCheckout() {
  const params = useSearchParams()
  const router = useRouter()
  const initial = ROOMS.find((r) => r.key === params.get("room"))?.key ?? null
  const [room, setRoom] = useState<RoomKey | null>(initial)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [until, setUntil] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  const load = useCallback(async (r: RoomKey) => {
    setLoading(true)
    setFailed(false)
    setOffer(null)
    setUntil(null)
    try {
      const res = await fetch(`/api/late-checkout?room=${r}`, { cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const o: Offer = await res.json()
      setOffer(o)
      const open = o.options.filter((x) => !x.past)
      setUntil(open.length ? open[open.length - 1].until : null)
    } catch {
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (room) load(room)
  }, [room, load])

  const pick = (r: RoomKey) => {
    setRoom(r)
    router.replace(`/late-checkout?room=${r}`, { scroll: false })
  }

  const pay = async () => {
    if (!room || !until) return
    setPaying(true)
    try {
      const res = await fetch("/api/late-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, until }),
      })
      const body = await res.json()
      if (!res.ok || !body.init_point) throw new Error(body.error || "error")
      window.location.href = body.init_point
    } catch {
      setPaying(false)
      if (room) load(room)
    }
  }

  const chosen = offer?.options.find((o) => o.until === until)
  const priced = offer?.options.some((o) => o.ars !== null)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <SiteHeader />
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-2">Salida tardía</h1>
        <p className="text-lg text-gray-800 mb-8 [text-wrap:pretty]">
          La salida es a las {hhmm(STANDARD_CHECKOUT_HOUR)}. Si querés quedarte un rato más, pagalo acá.
        </p>

        <fieldset className="mb-8">
          <legend className="text-base font-semibold mb-3">Tu habitación</legend>
          <div className="grid grid-cols-2 gap-2">
            {ROOMS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => pick(r.key)}
                aria-pressed={room === r.key}
                className={`h-14 rounded-lg border-2 text-lg font-medium transition-colors ${
                  room === r.key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900 hover:border-gray-500"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </fieldset>

        {loading && <p className="text-lg text-gray-700">Consultando…</p>}
        {failed && (
          <p className="text-lg text-gray-900">
            No pudimos consultar la habitación.{" "}
            <button type="button" className="underline font-medium" onClick={() => room && load(room)}>
              Probar de nuevo
            </button>
          </p>
        )}

        {offer?.closed === "arrival" && (
          <div className="rounded-lg bg-gray-100 p-5 text-lg [text-wrap:pretty]">
            <p className="font-semibold mb-1">Hoy no se puede, perdón</p>
            <p>El {fechaLarga(offer.date!)} llegan huéspedes a esta habitación y necesitamos prepararla. La salida es a las {hhmm(STANDARD_CHECKOUT_HOUR)}.</p>
          </div>
        )}
        {offer?.closed === "no_checkout" && (
          <div className="rounded-lg bg-gray-100 p-5 text-lg [text-wrap:pretty]">
            Esta habitación no tiene salida hoy ni mañana. Podés pagar la salida tardía desde el día anterior a tu salida.
          </div>
        )}
        {offer?.closed === "already_paid" && (
          <div className="rounded-lg bg-gray-100 p-5 text-lg [text-wrap:pretty]">
            <p className="font-semibold mb-1">Ya está pagada</p>
            <p>Podés quedarte hasta las {offer.paidUntil} del {fechaLarga(offer.date!)}.</p>
          </div>
        )}

        {offer && !offer.closed && (
          <>
            <fieldset className="mb-8">
              <legend className="text-base font-semibold mb-3">Salida el {fechaLarga(offer.date!)}</legend>
              <div className="flex flex-col gap-2">
                {offer.options.map((o) => (
                  <label
                    key={o.until}
                    className={`flex items-center justify-between h-16 px-5 rounded-lg border-2 text-lg cursor-pointer ${
                      o.past ? "border-gray-200 text-gray-400 cursor-not-allowed" : until === o.until ? "border-gray-900" : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="until"
                        value={o.until}
                        checked={until === o.until}
                        disabled={o.past}
                        onChange={() => setUntil(o.until)}
                        className="h-5 w-5 accent-gray-900"
                      />
                      Hasta las {o.until}
                    </span>
                    {o.ars !== null && <span className="font-semibold">{pesos(o.ars)}</span>}
                  </label>
                ))}
              </div>
            </fieldset>

            {priced && chosen?.ars != null ? (
              <button
                type="button"
                onClick={pay}
                disabled={paying}
                className="w-full h-14 rounded-lg bg-gray-900 text-white text-lg font-semibold hover:bg-black disabled:opacity-60"
              >
                {paying ? "Abriendo Mercado Pago…" : `Pagar ${pesos(chosen.ars)}`}
              </button>
            ) : (
              <p className="text-lg text-gray-800">El precio se publica en breve.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function LateCheckoutPage() {
  return (
    <Suspense>
      <LateCheckout />
    </Suspense>
  )
}
