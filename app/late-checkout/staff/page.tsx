import { timingSafeEqual } from 'crypto'
import type { Metadata } from 'next'
import { recentPurchases } from '@/lib/late-checkout-io'
import { ROOMS, artNow, fechaLarga, pesos } from '@/lib/late-checkout'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Salidas tardías | IL BUCO', robots: { index: false, follow: false } }

function keyOk(given: string | undefined): boolean {
  const want = process.env.LATE_CHECKOUT_STAFF_KEY
  if (!want || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(want)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Melody's list: who bought a late checkout, from today on. Link with ?key= (1Password). */
export default async function StaffPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams
  if (!keyOk(key)) {
    return <main className="max-w-md mx-auto px-5 py-24 text-lg">Este enlace no es válido.</main>
  }
  const today = artNow().date
  const list = (await recentPurchases(14))
    .filter((p) => p.date >= today)
    .sort((a, b) => (a.date + a.until).localeCompare(b.date + b.until))

  return (
    <main className="max-w-md mx-auto px-5 py-12 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Salidas tardías</h1>
      {list.length === 0 && <p className="text-lg">Nadie pagó salida tardía para hoy ni para los próximos días.</p>}
      <ul className="flex flex-col gap-3">
        {list.map((p) => (
          <li key={p.paymentId} className="rounded-lg border-2 border-gray-300 p-4 text-lg">
            <p className="font-semibold">
              {ROOMS.find((r) => r.key === p.room)?.name} · hasta las {p.until}
            </p>
            <p>{p.date === today ? 'Hoy' : fechaLarga(p.date)}{p.payer ? ` · ${p.payer}` : ''} · {pesos(p.ars)}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
