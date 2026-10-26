"use client"

import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { BookingOptions } from "@/components/booking-options"
import { contactTranslations } from "@/translations/contact"
import { translations } from "@/translations/common"
import { CONTACT } from "@/lib/contact"

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Paraiso+324+Caril%C3%B3+Buenos+Aires"

export default function Contact() {
  const contacts = [
    { icon: "mail.png", href: `mailto:${CONTACT.email}`, text: CONTACT.email },
    { icon: "whatsapp.png", href: CONTACT.whatsappUrl, text: `WhatsApp ${CONTACT.phoneDisplay}` },
    { icon: "marker.png", href: MAPS_URL, text: <Translate text={contactTranslations.contactInfo.fullAddress} />, external: true },
    { icon: "instagram-sf.png", href: CONTACT.instagramUrl, text: `Instagram ${CONTACT.instagram}`, external: true },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-10">
                <Translate text={translations.nav.contact} />
              </h1>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <ul className="space-y-2">
                  {contacts.map((c) => (
                    <li key={c.icon}>
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex min-h-[44px] items-start gap-3 py-1 text-lg text-gray-900 hover:text-blue-700"
                      >
                        <Image src={`/icons/icons8/${c.icon}`} alt="" width={24} height={24} className="mt-0.5 flex-shrink-0" />
                        <span>{c.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                <BookingOptions />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">
                  <Translate text={contactTranslations.faq.title} />
                </h2>
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "How many people can stay?",
                        es: "¿Cuántas personas pueden alojarse?",
                        pt: "Quantas pessoas podem ficar?",
                        ru: "Сколько человек может остановиться?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Up to 16 guests: 4 double rooms (2 beds) + a double futon in each room (2 extra beds with charge).",
                        es: "Hasta 16 huéspedes: 4 habitaciones dobles (2 plazas) + un futón doble en cada habitación (2 plazas extra con cargo).",
                        pt: "Até 16 hóspedes: 4 quartos duplos (2 camas) + um futon duplo em cada quarto (2 camas extras com custo).",
                        ru: "До 16 гостей: 4 двухместных номера (2 кровати) + двойной футон в каждом номере (2 дополнительных места за плату).",
                      }} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "What are the check-in and check-out times?",
                        es: "¿Cuál es el horario de check-in y check-out?",
                        pt: "Quais são os horários de check-in e check-out?",
                        ru: "Какое время заезда и выезда?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Check-in: 3 PM (self check-in with smart lock)\nCheck-out: 11 AM\nCan be adjusted if the room is available before or after.",
                        es: "Check-in: 15 h (entrada autónoma con cerradura inteligente)\nCheck-out: 11 h\nSe puede ajustar si la habitación está libre antes o después.",
                        pt: "Check-in: 15h (self check-in com fechadura inteligente)\nCheck-out: 11h\nPode ser ajustado se o quarto estiver disponível antes ou depois.",
                        ru: "Заезд: 15:00 (самостоятельный заезд с умным замком)\nВыезд: 11:00\nМожет быть скорректировано если номер свободен до или после.",
                      }} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Are pets allowed?",
                        es: "¿Se permiten mascotas?",
                        pt: "Animais de estimação são permitidos?",
                        ru: "Можно с животными?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Yes. A hypoallergenic cleaning fee plus a refundable $300 USD deposit applies.",
                        es: "Sí. Se aplica una tarifa de limpieza hipoalergénica más un depósito de US$300 reembolsable.",
                        pt: "Sim. Aplica-se uma taxa de limpeza hipoalergênica mais um depósito reembolsável de US$300.",
                        ru: "Да. Взимается плата за гипоаллергенную уборку плюс возвратный залог $300 USD.",
                      }} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Is cleaning included in the rate?",
                        es: "¿La tarifa incluye limpieza?",
                        pt: "A limpeza está incluída na tarifa?",
                        ru: "Входит ли уборка в стоимость?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Weekly cleaning of common areas is included.\nAdditional room cleaning is available for long stays.",
                        es: "Limpieza semanal de áreas comunes incluida.\nLimpieza adicional en la habitación disponible para estadías largas.",
                        pt: "Limpeza semanal das áreas comuns incluída.\nLimpeza adicional do quarto disponível para estadias longas.",
                        ru: "Еженедельная уборка общих зон включена.\nДополнительная уборка номера доступна для долгих проживаний.",
                      }} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "Are sheets and towels provided?",
                        es: "¿Hay sábanas y toallas?",
                        pt: "Lençóis e toalhas são fornecidos?",
                        ru: "Есть постельное бельё и полотенца?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Yes, included: 180-thread-count percal sheets and 420 g/m² hotel-style towels.",
                        es: "Sí, están incluidas: sábanas de percal 180 hilos y toallas de 420 g/m² estilo hotel.",
                        pt: "Sim, incluídos: lençóis de percal 180 fios e toalhas de 420 g/m² estilo hotel.",
                        ru: "Да, включены: перкалевое постельное бельё плотностью 180 нитей и полотенца 420 г/м² в гостиничном стиле.",
                      }} />
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      <Translate text={{
                        en: "What is the minimum stay?",
                        es: "¿Cuál es la estadía mínima?",
                        pt: "Qual é a estadia mínima?",
                        ru: "Какой минимальный срок проживания?",
                      }} />
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      <Translate text={{
                        en: "Low season (April to October): 2 nights\nHigh season (December to February): 7 nights",
                        es: "Temporada baja (abril a octubre): 2 noches\nTemporada alta (diciembre a febrero): 7 noches",
                        pt: "Baixa temporada (abril a outubro): 2 noites\nAlta temporada (dezembro a fevereiro): 7 noites",
                        ru: "Низкий сезон (апрель-октябрь): 2 ночи\nВысокий сезон (декабрь-февраль): 7 ночей",
                      }} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}