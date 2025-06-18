"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Translate } from "./translate"

interface VisaRequirementsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function VisaRequirementsPopup({ isOpen, onClose }: VisaRequirementsPopupProps) {
  if (!isOpen) return null

  // Countries that typically need a visa to enter Argentina as tourists
  const visaRequiredCountries = [
    // Africa
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", 
    "Central African Republic", "Chad", "Comoros", "Democratic Republic of Congo", "Republic of Congo", 
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", 
    "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", 
    "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", 
    "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", 
    "Somalia", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
    
    // Asia
    "Afghanistan", "Bangladesh", "Bhutan", "Cambodia", "China", "India", "Indonesia", "Iran", "Iraq", 
    "Kazakhstan", "Kyrgyzstan", "Laos", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", 
    "Pakistan", "Sri Lanka", "Tajikistan", "Turkmenistan", "Uzbekistan", "Vietnam",
    
    // Europe
    "Albania", "Armenia", "Azerbaijan", "Belarus", "Georgia", "Kosovo", "Moldova", "Montenegro", 
    "North Macedonia", "Russia", "Serbia", "Turkey", "Ukraine",
    
    // Americas
    "Cuba", "Dominican Republic", "Haiti", "Jamaica", "Nicaragua",
    
    // Oceania
    "Fiji", "Papua New Guinea", "Solomon Islands", "Vanuatu"
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">
            <Translate
              text={{
                en: "⚠️ Visa Required Countries",
                es: "⚠️ Países que Requieren Visa",
                pt: "⚠️ Países que Requerem Visto",
              }}
            />
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Important Notice */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  <Translate
                    text={{
                      en: "Digital Nomad Visa Not Available",
                      es: "Visa de Nómada Digital No Disponible",
                      pt: "Visto de Nômade Digital Não Disponível",
                    }}
                  />
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    <Translate
                      text={{
                        en: "Argentina's Digital Nomad Visa is only available to nationals from countries that don't require a tourist visa to enter Argentina. If your country is listed below, you'll need to apply for a regular tourist visa first.",
                        es: "La Visa de Nómada Digital de Argentina solo está disponible para nacionales de países que no requieren visa de turista para ingresar a Argentina. Si tu país está en la lista abajo, necesitarás solicitar una visa de turista regular primero.",
                        pt: "O Visto de Nômade Digital da Argentina está disponível apenas para nacionais de países que não precisam de visto de turista para entrar na Argentina. Se seu país estiver listado abaixo, você precisará solicitar um visto de turista regular primeiro.",
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* World Map Visual */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              <Translate
                text={{
                  en: "Countries Requiring Tourist Visa for Argentina",
                  es: "Países que Requieren Visa de Turista para Argentina",
                  pt: "Países que Requerem Visto de Turista para Argentina",
                }}
              />
            </h3>
            
            {/* Argentina Visa Policy Map */}
            <div className="mb-4 bg-white rounded border overflow-hidden">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Visa_policy_of_Argentina.svg/2880px-Visa_policy_of_Argentina.svg.png"
                alt="Argentina Visa Policy Map"
                className="w-full h-auto"
              />
              <div className="p-3 bg-gray-50 text-center">
                <p className="text-xs text-gray-600">
                  <Translate
                    text={{
                      en: "Argentina Visa Policy Map - Green: No visa required, Red: Visa required",
                      es: "Mapa de Política de Visas de Argentina - Verde: Sin visa requerida, Rojo: Visa requerida",
                      pt: "Mapa da Política de Vistos da Argentina - Verde: Sem visto necessário, Vermelho: Visto necessário",
                    }}
                  />
                </p>
              </div>
            </div>

            {/* Countries Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
              {visaRequiredCountries.map((country) => (
                <div key={country} className="bg-red-100 text-red-800 px-2 py-1 rounded text-center">
                  {country}
                </div>
              ))}
            </div>
          </div>

          {/* What to do instead */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  <Translate
                    text={{
                      en: "Alternative Options",
                      es: "Opciones Alternativas",
                      pt: "Opções Alternativas",
                    }}
                  />
                </h3>
                <div className="mt-2 text-sm text-blue-700 space-y-2">
                  <p>
                    <strong>
                      <Translate
                        text={{
                          en: "1. Tourist Visa:",
                          es: "1. Visa de Turista:",
                          pt: "1. Visto de Turista:",
                        }}
                      />
                    </strong>{" "}
                    <Translate
                      text={{
                        en: "Apply for a regular tourist visa at the Argentine consulate in your country",
                        es: "Solicita una visa de turista regular en el consulado argentino de tu país",
                        pt: "Solicite um visto de turista regular no consulado argentino do seu país",
                      }}
                    />
                  </p>
                  <p>
                    <strong>
                      <Translate
                        text={{
                          en: "2. Business Visa:",
                          es: "2. Visa de Negocios:",
                          pt: "2. Visto de Negócios:",
                        }}
                      />
                    </strong>{" "}
                    <Translate
                      text={{
                        en: "If you're working with international clients, consider a business visa",
                        es: "Si trabajas con clientes internacionales, considera una visa de negocios",
                        pt: "Se você trabalha com clientes internacionais, considere um visto de negócios",
                      }}
                    />
                  </p>
                  <p>
                    <strong>
                      <Translate
                        text={{
                          en: "3. Temporary Residence:",
                          es: "3. Residencia Temporaria:",
                          pt: "3. Residência Temporária:",
                        }}
                      />
                    </strong>{" "}
                    <Translate
                      text={{
                        en: "For longer stays, explore temporary residence options",
                        es: "Para estadías más largas, explora opciones de residencia temporaria",
                        pt: "Para estadias mais longas, explore opções de residência temporária",
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="text-center pt-4 border-t">
            <p className="text-gray-600 text-sm">
              <Translate
                text={{
                  en: "Need help with visa requirements? Contact us for guidance.",
                  es: "¿Necesitas ayuda con los requisitos de visa? Contáctanos para orientación.",
                  pt: "Precisa de ajuda com os requisitos de visto? Entre em contato para orientação.",
                }}
              />
            </p>
            <a 
              href="/contacts" 
              className="inline-flex items-center mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Translate
                text={{
                  en: "Contact Us",
                  es: "Contáctanos",
                  pt: "Entre em Contato",
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}