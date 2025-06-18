import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DigitalNomadVisaContent } from "@/components/digital-nomad-visa-content"

// Calculate current year or next year if we're in December
const getCurrentYearOrNext = () => {
  const now = new Date()
  const currentMonth = now.getMonth() // 0-based, so December is 11
  const currentYear = now.getFullYear()
  
  // If it's December (month 11), show next year
  return currentMonth === 11 ? currentYear + 1 : currentYear
}

export const metadata: Metadata = {
  title: `Argentina Digital Nomad Visa ${getCurrentYearOrNext()}: Complete Application Guide | IL BUCO`,
  description: "Complete digital nomad visa guide for Argentina. Learn how to apply for the remote work visa, requirements, processing time, and digital nomad visa costs.",
  keywords: "digital nomad visa argentina, argentina digital nomad visa, remote work visa argentina, nomad visa application, argentina visa for digital nomads, digital nomad visa requirements",
  alternates: {
    canonical: "https://ilbuco.com.ar/en/digital-nomad-visa",
    languages: {
      "es": "https://ilbuco.com.ar/visa-nomada-digital",
      "en": "https://ilbuco.com.ar/en/digital-nomad-visa", 
      "pt": "https://ilbuco.com.ar/pt/visto-nomade-digital",
    }
  },
  openGraph: {
    title: "Argentina Digital Nomad Visa 2024: Complete Application Guide",
    description: "Complete digital nomad visa guide for Argentina. Learn how to apply for the remote work visa, requirements, processing time, and digital nomad visa costs.",
    url: "https://ilbuco.com.ar/en/digital-nomad-visa",
  }
}

export default function DigitalNomadVisaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <DigitalNomadVisaContent />
      <SiteFooter />
    </div>
  )
}