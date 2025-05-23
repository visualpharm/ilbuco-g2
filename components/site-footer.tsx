import { Translate } from "./translate"
import { translations } from "@/translations/common"

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
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">
            <Translate text={copyrightText} />
          </p>
        </div>
      </div>
    </footer>
  )
}
