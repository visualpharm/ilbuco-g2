"use client"

import { Translate } from "./translate"
import { translations } from "@/translations/common"
import Image from "next/image"
import { CONTACT } from "@/lib/contact"
import { useLanguage } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

// SEO landing pages by language
const seoLinks = {
  es: [
    { href: "/alquiler-carilo", text: "Alquiler Cariló" },
    { href: "/carilo-alquiler", text: "Cariló Alquiler" },
    { href: "/apart-hotel-en-carilo", text: "Apart Hotel en Cariló" },
    { href: "/carilo-alojamiento", text: "Cariló Alojamiento" },
    { href: "/casas-en-carilo-alquiler", text: "Casas en Cariló Alquiler" },
    { href: "/casas-en-carilo-frente-al-mar", text: "Casas en Cariló Frente al Mar" },
    { href: "/casas-en-alquiler-en-carilo-frente-al-mar", text: "Casas en Alquiler en Cariló Frente al Mar" },
    { href: "/que-hacer-en-carilo", text: "Qué Hacer en Cariló" },
    { href: "/que-hacer-en-carilo-cuando-llueve", text: "Qué Hacer en Cariló Cuando Llueve" },
    { href: "/team-building-carilo", text: "Team Building Cariló" },
    { href: "/eventos-corporativos-carilo", text: "Eventos Corporativos Cariló" },
    { href: "/carilo-golf-hospedaje", text: "Cariló Golf Hospedaje" },
  ],
  en: [
    { href: "/en/digital-nomad-argentina", text: "Digital Nomad Argentina" },
    { href: "/en/argentina-remote-work-visa", text: "Argentina Remote Work Visa" },
    { href: "/en/digital-nomad-visa", text: "Digital Nomad Visa" },
    { href: "/en/coliving-south-america", text: "Coliving South America" },
    { href: "/en/slow-travel-argentina", text: "Slow Travel Argentina" },
    { href: "/en/coliving-argentina", text: "Coliving Argentina" },
    { href: "/en/ecolodge-argentina", text: "Ecolodge Argentina" },
    { href: "/en/digital-nomad-retreats", text: "Digital Nomad Retreats" },
  ],
  pt: [
    { href: "/pt/coliving", text: "Coliving" },
    { href: "/pt/argentina-praia", text: "Argentina Praia" },
    { href: "/pt/argentina-mar", text: "Argentina Mar" },
    { href: "/pt/carilo-argentina-o-que-fazer", text: "Cariló Argentina O Que Fazer" },
    { href: "/pt/coliving-argentina", text: "Coliving Argentina" },
    { href: "/pt/trabalho-remoto-argentina", text: "Trabalho Remoto Argentina" },
  ],
  ru: [
    // No SEO landing pages for Russian - will show external links only
  ],
}

// External links to mix with internal ones
const externalLinks = [
  { href: "https://icons8.com/illustrations/t/property", text: "Proptech Illustrations" },
  { href: "https://generated.photos/genyou", text: "AI Generated Portraits" },
  { href: "https://aiandtractors.com", text: "AI Speaker & Keynote" },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const { language } = useLanguage()
  const pathname = usePathname()

  // Get 3 SEO links for current language, distributed based on current page
  const currentSeoLinks = seoLinks[language.code as keyof typeof seoLinks] || []
  const pageHash = pathname.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  let footerLinks = []
  
  if (currentSeoLinks.length >= 3) {
    // If we have 3 or more SEO links, pick 3 starting from a distributed position
    const startIndex = pageHash % (currentSeoLinks.length - 2)
    footerLinks = currentSeoLinks.slice(startIndex, startIndex + 3)
  } else if (currentSeoLinks.length > 0) {
    // If we have some SEO links but less than 3, use all of them and fill with external
    footerLinks = [...currentSeoLinks]
    const remainingSlots = 3 - footerLinks.length
    for (let i = 0; i < remainingSlots; i++) {
      const externalIndex = (pageHash + i) % externalLinks.length
      footerLinks.push(externalLinks[externalIndex])
    }
  } else {
    // If no SEO links, use 3 external links
    for (let i = 0; i < 3; i++) {
      const externalIndex = (pageHash + i) % externalLinks.length
      footerLinks.push(externalLinks[externalIndex])
    }
  }

  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-3 text-base">
          <p className="flex flex-wrap items-center justify-center gap-x-4 text-gray-700">
            <span>
              © {currentYear} <a href="https://aiandtractors.com" className="inline-flex min-h-[44px] items-center text-gray-700 no-underline hover:text-gray-900">Ivan Braun</a>
            </span>
            {footerLinks.map((link, index) => (
              <a key={index} href={link.href} className="inline-flex min-h-[44px] items-center text-gray-700 no-underline hover:text-gray-900">
                {link.text}
              </a>
            ))}
          </p>

          {!/(?:^|\/)(reservar|admin|nimda|dashboard|guest|voice|vanish)(?:\/|$)/.test(pathname) && (
            <nav aria-label={language.code === 'es' ? 'Otros proyectos' : 'Other projects'} className="project-links flex flex-wrap justify-center gap-x-6 border-t border-gray-200 pt-3 text-base text-blue-700 [&>a]:inline-flex [&>a]:min-h-[44px] [&>a]:items-center">
              <a href="https://usabruno.com">Bruno</a>
              <a href="https://lira-voice.app">Lira</a>
              <a href="https://humanrounds.org">Human Rounds</a>
              <a href="https://inglesconjenny.com">Inglés con Jenny</a>
              <a href="https://finda-capital.com">Finda Capital</a>
            </nav>
          )}

          <div className="flex flex-col items-center justify-center gap-x-6 text-gray-800 sm:flex-row">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-[44px] items-center gap-2 hover:text-gray-950">
              <Image src="/icons/icons8/mail.png" alt="" width={20} height={20} />
              {CONTACT.email}
            </a>
            <a href={CONTACT.whatsappUrl} className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap hover:text-gray-950">
              <Image src="/icons/icons8/whatsapp.png" alt="" width={20} height={20} />
              {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 hover:text-gray-950">
              <Image src="/icons/icons8/instagram-sf.png" alt="" width={20} height={20} />
              {CONTACT.instagram}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
