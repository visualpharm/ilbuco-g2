"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { guestTranslations } from "@/translations/guest"

type Lang = "es" | "en" | "pt"

const languages: { code: Lang; name: string; flag: string }[] = [
  { code: "es", name: "Español", flag: "🇦🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
]

// Local service contacts, inserted in content via :::card-<variant> tokens.
const CARDS = {
  electrician: {
    name: "David aka Washington",
    role: { es: "Electricista", en: "Electrician", pt: "Eletricista" },
    phone: "+54 9 11 5878-3996",
    icon: "⚡",
    accent: "bg-amber-100",
  },
  plumber: {
    name: "Plomeros Martinez",
    role: { es: "Plomería", en: "Plumbing", pt: "Encanamento" },
    phone: "+54 9 2254 44-0021",
    icon: "🔧",
    accent: "bg-sky-100",
  },
  internet: {
    name: "Cariló Digital · Fibra al Hogar",
    role: { es: "Proveedor de internet", en: "Internet provider", pt: "Provedor de internet" },
    website: "https://fibraalhogar.com.ar",
    icon: "🛜",
    accent: "bg-sky-100",
  },
} as const

type CardVariant = keyof typeof CARDS

function ContactCard({ variant, lang }: { variant: CardVariant; lang: Lang }) {
  const c = CARDS[variant]
  const wa = "phone" in c ? `https://wa.me/${c.phone.replace(/\D/g, "")}` : undefined
  return (
    <div className="my-4 flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${c.accent}`}>
        {c.icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-stone-900">{c.name}</h3>
        <p className="text-sm text-stone-500">{c.role[lang]}</p>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer"
             className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-1.5-.8-2.6-1.4-3.6-3.2-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 2 .8 2.7.9 3.6.8.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.6 13.5 3.6 12 3.6 7.4 7.4 3.6 12 3.6S20.4 7.4 20.4 12 16.6 20.2 12 20.2z"/>
            </svg>
            {c.phone}
          </a>
        )}
        {"website" in c && c.website && (
          <a href={c.website} target="_blank" rel="noopener noreferrer"
             className="mt-0.5 inline-block text-sm font-medium text-sky-600 hover:underline">
            🌐 {c.website.replace("https://", "")}
          </a>
        )}
      </div>
    </div>
  )
}

const mdComponents = {
  p: ({ children }: any) => <p className="mb-2 leading-relaxed text-stone-700">{children}</p>,
  strong: ({ children }: any) => <strong className="font-semibold text-stone-900">{children}</strong>,
  em: ({ children }: any) => <em className="text-stone-500">{children}</em>,
  a: ({ href, children }: any) => (
    <a href={href} className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800">{children}</a>
  ),
}

function renderContent(content: string, lang: Lang) {
  return content.split("\n\n").map((section, i) => {
    const trimmed = section.trim()

    if (trimmed.startsWith(":::card-")) {
      const variant = trimmed.replace(":::card-", "").trim() as CardVariant
      return CARDS[variant] ? <ContactCard key={i} variant={variant} lang={lang} /> : null
    }

    const lines = section.split("\n")
    const listItems = lines.filter((l) => l.trim().startsWith("- "))

    if (listItems.length > 0) {
      const intro = lines.filter((l) => l.trim() && !l.trim().startsWith("- "))
      return (
        <div key={i} className="mb-3">
          {intro.map((line, j) => (
            <ReactMarkdown key={j} components={mdComponents}>{line}</ReactMarkdown>
          ))}
          <ul className="ml-1 space-y-1.5">
            {listItems.map((item, j) => (
              <li key={j} className="flex gap-2 text-stone-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                <span className="leading-relaxed">
                  <ReactMarkdown components={{ ...mdComponents, p: ({ children }: any) => <span>{children}</span> }}>
                    {item.replace(/^[-\s]+/, "")}
                  </ReactMarkdown>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <div key={i} className="mb-3">
        <ReactMarkdown components={mdComponents}>{section}</ReactMarkdown>
      </div>
    )
  })
}

function LanguageSwitcher({ currentLang, onChange }: { currentLang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const current = languages.find((l) => l.code === currentLang) ?? languages[0]
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 text-sm text-stone-700 hover:bg-stone-50"
        aria-label="Change language"
      >
        <span className="text-lg">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false) }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-stone-50 ${
                currentLang === l.code ? "bg-stone-50 font-medium text-stone-900" : "text-stone-700"
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GuestContent({ lang }: { lang: Lang }) {
  const router = useRouter()
  const t = guestTranslations

  const handleLanguageChange = (next: Lang) => {
    router.push(next === "es" ? "/guest" : `/${next}/guest`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-stone-400">Il Buco · Cariló</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{t.title[lang]}</h1>
          </div>
          <LanguageSwitcher currentLang={lang} onChange={handleLanguageChange} />
        </header>

        <div className="mb-10 text-lg text-stone-600">
          <ReactMarkdown components={mdComponents}>{t.subtitle[lang]}</ReactMarkdown>
        </div>

        <div className="space-y-4">
          {t.sections.map((section) => (
            <section key={section.id} className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-stone-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xl">
                  {section.emoji}
                </span>
                {section.title[lang]}
              </h2>
              <div>{renderContent(section.content[lang], lang)}</div>
            </section>
          ))}
        </div>

        <footer className="mt-10 text-center text-sm text-stone-400">Il Buco · Paraíso 324, Cariló</footer>
      </div>
    </div>
  )
}
