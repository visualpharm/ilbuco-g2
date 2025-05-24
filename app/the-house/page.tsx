import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { houseTranslations } from "@/translations/house"
import {
  Sofa,
  TreesIcon as Tree,
  ShowerHeadIcon as Shower,
  Home,
  UtensilsCrossed,
  Monitor,
  Sparkles,
  Calendar,
  Wifi,
  Thermometer,
  Refrigerator,
  Bed,
  Droplet,
  Building,
  Shield,
} from "lucide-react"

export default function TheHouse() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <Translate text={houseTranslations.pageTitle} />
              </h1>

              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12">
                <Image
                  src="/villa-pine-forest-path.jpeg"
                  alt="IL BUCO Villa exterior"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Highlights Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  <Translate text={houseTranslations.highlights.title} />
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.bedrooms.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.bedrooms.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Thermometer className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.climate.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.climate.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.roof.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.roof.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Shield className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate text={houseTranslations.highlights.sound.title} />
                        </h3>
                        <p className="text-gray-600">
                          <Translate text={houseTranslations.highlights.sound.description} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Droplet className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Water Treatment",
                              es: "Tratamiento de Agua",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Water-treatment plant with softener",
                              es: "Planta de tratamiento de agua con ablandador",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Wifi className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "High-Speed Internet",
                              es: "Internet de Alta Velocidad",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "500 Mbit Wi-Fi (fiber-to-home + mesh)",
                              es: "Wi-Fi de 500 Mbit (fibra al hogar + mesh)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Home className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Accommodations",
                              es: "Alojamiento",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "4 bedrooms (2 people each + futon for 2 more)",
                              es: "4 dormitorios (2 personas cada uno + futón para 2 más)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Common Areas",
                              es: "Áreas Comunes",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Large shared living room with one big couch and common kitchen",
                              es: "Gran sala de estar compartida con un sofá grande y cocina común",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Refrigerator className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Kitchen Amenities",
                              es: "Comodidades de Cocina",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "300 L refrigerators in every kitchenette",
                              es: "Heladeras de 300 L en cada kitchenette",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Bed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Premium Bedding",
                              es: "Ropa de Cama Premium",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "5-star bedding on dense foam mattresses",
                              es: "Ropa de cama 5 estrellas en colchones de espuma densa",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Luxury Bathrooms",
                              es: "Baños de Lujo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Glass shower screens, handheld bidet sprayers, washing machine in each",
                              es: "Mamparas de vidrio, duchadores bidet portátiles, lavarropas en cada uno",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Building className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Quality Construction",
                              es: "Construcción de Calidad",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Solid load-bearing concrete + full insulation; black double-glazed PVC windows",
                              es: "Hormigón estructural sólido + aislamiento completo; ventanas de PVC negro con doble vidriado",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Monitor className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Server Rack",
                              es: "Rack de Servidores",
                              pt: "Rack de Servidores",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Empty slot in server rack - free for small devices, affordable for GPU servers",
                              es: "Slot vacío en rack de servidores - gratis para dispositivos pequeños, accesible para servidores GPU",
                              pt: "Slot vazio no rack de servidores - grátis para dispositivos pequenos, acessível para servidores GPU",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout & Rooms Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.layout.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Home className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "4 bedrooms",
                              es: "4 dormitorios",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Comfortable accommodations for up to 10 guests",
                              es: "Alojamiento cómodo para hasta 10 huéspedes",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Private bathroom",
                              es: "Baño privado",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Glass screen, bidet sprayer, washing machine",
                              es: "Mampara de vidrio, duchador bidet, lavarropas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Kitchenette",
                              es: "Kitchenette",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "300 L fridge, stove, oven, microwave, quality cookware",
                              es: "Heladera de 300 L, anafe, horno, microondas, utensilios de calidad",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Shower className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Extra shared bathroom",
                              es: "Baño compartido adicional",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Additional convenience for guests",
                              es: "Comodidad adicional para los huéspedes",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Areas Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.sharedAreas.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Living Room",
                              es: "Sala de Estar",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Large shared living room with one big couch",
                              es: "Gran sala de estar compartida con un sofá grande",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <UtensilsCrossed className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Common Kitchen",
                              es: "Cocina Común",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Fully equipped for group meals and gatherings",
                              es: "Completamente equipada para comidas grupales y reuniones",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Tree className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Green Roof",
                              es: "Techo Verde",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "With grill and outdoor seating",
                              es: "Con parrilla y asientos al aire libre",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-Stay Work Package Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.longStay.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Monthly discount",
                              es: "Descuento mensual",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Special rates for extended stays",
                              es: "Tarifas especiales para estadías prolongadas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Sofa className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Ergonomic chair",
                              es: "Silla ergonómica",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Comfortable seating for productive work sessions",
                              es: "Asiento cómodo para sesiones de trabajo productivas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Monitor className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Optional computer monitor",
                              es: "Monitor de computadora opcional",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Available upon request for remote work",
                              es: "Disponible bajo pedido para trabajo remoto",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Fixed monthly rent",
                              es: "Alquiler mensual fijo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "For 12 months + (not adjusted for high/low season)",
                              es: "Para 12 meses + (no ajustado por temporada alta/baja)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaning Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.cleaning.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Sparkles className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Weekly cleaning of common areas included",
                              es: "Limpieza semanal de áreas comunes incluida",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Regular maintenance to keep shared spaces pristine",
                              es: "Mantenimiento regular para mantener los espacios compartidos impecables",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <Sparkles className="h-5 w-5 mr-3 mt-1 text-gray-700" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Extra in-room cleaning",
                              es: "Limpieza extra en habitación",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Available on request for long stays",
                              es: "Disponible bajo pedido para estadías largas",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* House Rules Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.houseRules.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Quiet Environment",
                              es: "Ambiente Tranquilo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "No music audible outside your room",
                              es: "No música audible fuera de tu habitación",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "No Parties",
                              es: "No Fiestas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "People-counting cameras in common areas",
                              es: "Cámaras contadoras de personas en áreas comunes",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Clean Common Areas",
                              es: "Mantener Áreas Comunes Limpias",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Leave common kitchen and grill clean",
                              es: "Dejar la cocina común y parrilla limpias",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Pets Allowed",
                              es: "Mascotas Permitidas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Hypo-allergenic fee + US $300 deposit",
                              es: "Tarifa hipoalergénica + depósito de US $300",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Flexible Check-in",
                              es: "Check-in Flexible",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Arrive early if free / smart-lock access",
                              es: "Llegá temprano si está libre / acceso con cerradura inteligente",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Flexible Check-out",
                              es: "Check-out Flexible",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Stay late if no same-day check-in",
                              es: "Quedate hasta tarde si no hay check-in el mismo día",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Utilities Included",
                              es: "Servicios Incluidos",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Heating, A/C, internet, electricity, water included",
                              es: "Calefacción, A/A, internet, electricidad, agua incluidos",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability & Rates Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  <Translate text={houseTranslations.availability.title} />
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Year-Round Availability",
                              es: "Disponibilidad Todo el Año",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "Open all year",
                              es: "Abierto todo el año",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "High Season",
                              es: "Temporada Alta",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "December – February",
                              es: "Diciembre – Febrero",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Best Rates",
                              es: "Mejores Tarifas",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "April – October (my favorites: Sept – Nov)",
                              es: "Abril – Octubre (mis favoritos: Sept – Nov)",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Minimum Stay",
                              es: "Estadía Mínima",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "2 days during low season",
                              es: "2 días durante temporada baja",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="h-5 w-5 mr-3 mt-1 text-gray-700">•</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Translate
                            text={{
                              en: "Long-Term Stays",
                              es: "Estadías de Largo Plazo",
                            }}
                          />
                        </h3>
                        <p className="text-gray-600">
                          <Translate
                            text={{
                              en: "12 months + stays enjoy fixed monthly rent",
                              es: "Estadías de 12 meses + disfrutan alquiler mensual fijo",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">
                  <Translate text={houseTranslations.bookYourStay.title} />
                </h3>
                <p className="text-gray-700 mb-4">
                  <Translate text={houseTranslations.bookYourStay.description} />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Translate text={houseTranslations.bookYourStay.button} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
