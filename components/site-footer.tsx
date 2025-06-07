import { Translate } from "./translate"
import { translations } from "@/translations/common"
import { Mail, Phone } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500 text-center md:text-left">
            © {currentYear} <a href="https://aiandtractors.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Ivan Braun</a>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-gray-600">
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
          </div>
        </div>
      </div>
    </footer>
  )
}
