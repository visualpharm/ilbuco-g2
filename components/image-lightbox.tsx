"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

const labels = {
  es: { close: "Cerrar", prev: "Foto anterior", next: "Foto siguiente", dialog: "Fotos" },
  en: { close: "Close", prev: "Previous photo", next: "Next photo", dialog: "Photos" },
  pt: { close: "Fechar", prev: "Foto anterior", next: "Próxima foto", dialog: "Fotos" },
  ru: { close: "Закрыть", prev: "Предыдущее фото", next: "Следующее фото", dialog: "Фото" },
} as const

// Gesture tuning: a flick (fast) or a drag past the distance commits the move.
const SWIPE_RATIO = 0.18 // share of the viewport width
const CLOSE_DISTANCE = 110 // px dragged down
const FLICK_SPEED = 0.45 // px per ms
const WHEEL_STEP = 50 // accumulated trackpad delta that turns the page
const WHEEL_IDLE_MS = 180 // a trackpad gesture ends after this pause
const ANIM_MS = 260

type Axis = "x" | "y" | null

/**
 * The one photo viewer of the site: swipe left/right to browse, swipe down to
 * close (touch, mouse drag, two-finger trackpad), arrows and Escape on the keyboard.
 */
export function ImageLightbox({ images, isOpen, currentIndex, onClose, onNext, onPrevious }: ImageLightboxProps) {
  const { language } = useLanguage()
  const t = labels[(language?.code as keyof typeof labels) || "es"] || labels.es
  const count = images.length
  const many = count > 1

  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [animating, setAnimating] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const drag = useRef({ id: -1, x: 0, y: 0, t: 0, axis: null as Axis, moved: false })
  const wheel = useRef({ x: 0, y: 0, locked: false, timer: 0 as unknown as ReturnType<typeof setTimeout> })
  const busy = useRef(false)

  const reducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const settle = useCallback((after?: () => void, toX = 0, toY = 0) => {
    const ms = reducedMotion() ? 0 : ANIM_MS
    busy.current = true
    setAnimating(true)
    setDx(toX)
    setDy(toY)
    window.setTimeout(() => {
      after?.()
      setAnimating(false)
      setDx(0)
      setDy(0)
      busy.current = false
    }, ms)
  }, [])

  const width = () => stageRef.current?.clientWidth || window.innerWidth

  const goNext = useCallback(() => {
    if (!many || busy.current) return
    settle(onNext, -width())
  }, [many, onNext, settle])

  const goPrev = useCallback(() => {
    if (!many || busy.current) return
    settle(onPrevious, width())
  }, [many, onPrevious, settle])

  const close = useCallback(
    (direction = 1) => {
      if (busy.current) return
      settle(onClose, 0, direction * window.innerHeight)
    },
    [onClose, settle],
  )

  // Keyboard, scroll lock, focus in and back out.
  useEffect(() => {
    if (!isOpen) return
    returnFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus({ preventScroll: true })
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      html.style.overflow = prevOverflow
      document.body.style.overflow = ""
      returnFocus.current?.focus?.({ preventScroll: true })
    }
  }, [isOpen, onClose, goNext, goPrev])

  // Trackpad: horizontal two-finger swipe turns the photo, vertical one closes.
  useEffect(() => {
    const el = stageRef.current
    if (!isOpen || !el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const w = wheel.current
      clearTimeout(w.timer)
      w.timer = setTimeout(() => {
        w.locked = false
        w.x = 0
        w.y = 0
        if (!busy.current) settle()
      }, WHEEL_IDLE_MS)
      if (w.locked || busy.current) return
      const k = e.deltaMode === 1 ? 16 : 1
      w.x += e.deltaX * k
      w.y += e.deltaY * k
      if (Math.abs(w.x) > Math.abs(w.y)) {
        if (!many) return
        setDy(0)
        setDx(-w.x)
        if (Math.abs(w.x) > WHEEL_STEP) {
          w.locked = true
          w.x > 0 ? goNext() : goPrev()
        }
      } else {
        setDx(0)
        setDy(-w.y)
        if (Math.abs(w.y) > WHEEL_STEP * 2) {
          w.locked = true
          close(w.y > 0 ? -1 : 1)
        }
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [isOpen, many, goNext, goPrev, close, settle])

  const onPointerDown = (e: React.PointerEvent) => {
    if (busy.current || (e.pointerType === "mouse" && e.button !== 0)) return
    if ((e.target as HTMLElement).closest("button")) return
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), axis: null, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    const mx = e.clientX - d.x
    const my = e.clientY - d.y
    if (!d.axis) {
      if (Math.hypot(mx, my) < 8) return
      d.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y"
      d.moved = true
    }
    if (d.axis === "x") setDx(many ? mx : mx / 4)
    else setDy(my > 0 ? my : my / 4)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    drag.current.id = -1
    const mx = e.clientX - d.x
    const my = e.clientY - d.y
    const speed = (d.axis === "x" ? Math.abs(mx) : Math.abs(my)) / Math.max(1, performance.now() - d.t)
    if (!d.moved) {
      // A plain tap on the dark area around the photo closes the viewer.
      if (!(e.target as HTMLElement).closest("img")) onClose()
      return
    }
    if (d.axis === "x" && many && (Math.abs(mx) > width() * SWIPE_RATIO || speed > FLICK_SPEED)) {
      mx < 0 ? goNext() : goPrev()
    } else if (d.axis === "y" && my > 0 && (my > CLOSE_DISTANCE || speed > FLICK_SPEED)) {
      close(1)
    } else {
      settle()
    }
  }

  if (!isOpen || !images[currentIndex]) return null

  const prevIndex = (currentIndex - 1 + count) % count
  const nextIndex = (currentIndex + 1) % count
  const fade = Math.max(0.35, 1 - Math.abs(dy) / 500)
  const transition = animating ? `transform ${ANIM_MS}ms cubic-bezier(.2,.8,.2,1), opacity ${ANIM_MS}ms` : "none"
  const slides = many
    ? [
        { i: prevIndex, offset: -1 },
        { i: currentIndex, offset: 0 },
        { i: nextIndex, offset: 1 },
      ]
    : [{ i: currentIndex, offset: 0 }]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.dialog}
      className="fixed inset-0 z-[60] select-none"
      style={{ backgroundColor: `rgba(0,0,0,${0.94 * fade})`, transition: animating ? `background-color ${ANIM_MS}ms` : "none" }}
    >
      <div
        ref={stageRef}
        className="absolute inset-0 overflow-hidden touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides.map(({ i, offset }) => (
          <div
            key={`${offset}-${i}`}
            className="absolute inset-0 flex items-center justify-center p-0 md:p-12"
            style={{
              transform: `translate3d(calc(${offset * 100}% + ${dx}px), ${offset === 0 ? dy : 0}px, 0)`,
              transition,
            }}
            aria-hidden={offset !== 0}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[i].src}
                alt={offset === 0 ? images[i].alt : ""}
                fill
                draggable={false}
                className="object-contain pointer-events-auto"
                sizes="100vw"
                priority={offset === 0}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        ref={closeRef}
        onClick={onClose}
        aria-label={t.close}
        className="absolute top-3 right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <Image src="/icons/icons8/close.png" alt="" width={24} height={24} className="invert" />
      </button>

      {many && (
        <>
          <button
            onClick={goPrev}
            aria-label={t.prev}
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 md:flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <Image src="/icons/icons8/chevron-left.png" alt="" width={24} height={24} className="invert" />
          </button>
          <button
            onClick={goNext}
            aria-label={t.next}
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 md:flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <Image src="/icons/icons8/chevron-right.png" alt="" width={24} height={24} className="invert" />
          </button>
        </>
      )}
    </div>
  )
}
