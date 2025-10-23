"use client"

import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { Mail, Phone, Instagram } from "lucide-react"
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
  
  // Debug: log what we're working with
  if (typeof window !== 'undefined') {
    console.log('Footer Debug:', { languageCode: language.code, pathname, currentSeoLinksCount: currentSeoLinks.length })
  }
  
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
        <div className="space-y-4 text-sm">
          {/* First Line: Copyright and SEO Links */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-gray-500">
              © {currentYear} <a href="https://aiandtractors.com" className="hover:underline">Ivan Braun</a>
              {footerLinks.length > 0 && (
                <span className="ml-4 space-x-4">
                  {footerLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      {...(link.href.startsWith('http') ? {} : {})}
                      className="text-gray-500 hover:text-gray-700 no-underline"
                    >
                      {link.text}
                    </a>
                  ))}
                </span>
              )}
            </div>
          </div>
          
          {/* Second Line: Contact Info and Social */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <a href="mailto:ciao@ilbuco.com.ar" className="hover:text-gray-800 transition-colors whitespace-nowrap">
                ciao@ilbuco.com.ar
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <a
                href="https://wa.me/541121275492?text=Hola!%20Me%20interesa%20IL%20BUCO.%20¿Podrían%20ayudarme?"
                className="hover:text-green-600 transition-colors whitespace-nowrap"
              >
                +54 11 2127 5492
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 flex-shrink-0" />
              <a
                href="https://www.instagram.com/il.buco.carilo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition-colors whitespace-nowrap"
              >
                @il.buco.carilo
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
