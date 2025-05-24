import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { Mail, Phone } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  // Replace the year placeholder in the translation
  const copyrightText = {
    en: translations.footer.copyright.en.replace("{year}", currentYear.toString()),
    es: translations.footer.copyright.es.replace("{year}", currentYear.toString()),
  }

  return (
    <footer className="border-t border-gray-200 mt-8 pt-8 pb-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:ciao@ilbuco.com.ar" className="hover:text-gray-800 transition-colors">
                ciao@ilbuco.com.ar
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a
                href="https://wa.me/541121275492?text=Hola!%20Me%20interesa%20IL%20BUCO.%20¿Podrían%20ayudarme?"
                className="hover:text-green-600 transition-colors"
              >
                +54 11 2127 5492
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            <Translate text={copyrightText} />
          </p>
        </div>
      </div>
    </footer>
  )
}
