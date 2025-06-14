"use client"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Translate } from "@/components/translate"
import { placesNearbyTranslations } from "@/translations/places-nearby"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

// Helper function to convert Tailwind color classes to CSS filters
function getColorFilter(colorClass: string): React.CSSProperties {
  const colorMap: { [key: string]: string } = {
    'text-indigo-700': 'brightness(0) saturate(100%) invert(26%) sepia(100%) saturate(2878%) hue-rotate(231deg) brightness(101%) contrast(103%)',
    'text-cyan-700': 'brightness(0) saturate(100%) invert(26%) sepia(96%) saturate(6121%) hue-rotate(191deg) brightness(101%) contrast(103%)',
    'text-violet-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(271deg) brightness(101%) contrast(103%)',
    'text-amber-700': 'brightness(0) saturate(100%) invert(49%) sepia(98%) saturate(987%) hue-rotate(2deg) brightness(101%) contrast(103%)',
    'text-green-700': 'brightness(0) saturate(100%) invert(33%) sepia(100%) saturate(1352%) hue-rotate(87deg) brightness(101%) contrast(103%)',
    'text-pink-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(314deg) brightness(101%) contrast(103%)',
    'text-red-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(354deg) brightness(101%) contrast(103%)',
    'text-emerald-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(140deg) brightness(101%) contrast(103%)',
    'text-teal-700': 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3597%) hue-rotate(180deg) brightness(101%) contrast(103%)',
    'text-gray-700': 'brightness(0) saturate(100%) invert(40%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)',
    'text-white': 'brightness(0) saturate(100%) invert(100%)',
    'text-gray-600': 'brightness(0) saturate(100%) invert(49%) sepia(1%) saturate(1042%) hue-rotate(314deg) brightness(94%) contrast(80%)',
    'text-blue-700': 'brightness(0) saturate(100%) invert(26%) sepia(96%) saturate(6121%) hue-rotate(220deg) brightness(101%) contrast(103%)',
    'text-orange-700': 'brightness(0) saturate(100%) invert(49%) sepia(98%) saturate(987%) hue-rotate(15deg) brightness(101%) contrast(103%)'
  }
  
  return { filter: colorMap[colorClass] || 'none' }
}

// Icon components
const Icons = {
  ShoppingBag: ({ color }: { color: string }) => <Image src="/icons/icons8/shopping-bag.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  ShoppingCart: ({ color }: { color: string }) => <Image src="/icons/icons8/shopping-cart.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Fruit: ({ color }: { color: string }) => <Image src="/icons/icons8/apple.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Shop: ({ color }: { color: string }) => <Image src="/icons/icons8/shop.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Tools: ({ color }: { color: string }) => <Image src="/icons/icons8/tools.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Fish: ({ color }: { color: string }) => <Image src="/icons/icons8/fish.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  IceCream: ({ color }: { color: string }) => <Image src="/icons/icons8/ice-cream.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Bread: ({ color }: { color: string }) => <Image src="/icons/icons8/bread.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  TShirt: ({ color }: { color: string }) => <Image src="/icons/icons8/t-shirt.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Spray: ({ color }: { color: string }) => <Image src="/icons/icons8/spray.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,
  Meat: ({ color }: { color: string }) => <Image src="/icons/icons8/steak.svg" alt="" width={24} height={24} className={`mr-1 mt-1 flex-shrink-0`} style={getColorFilter(color)} />,

  // Social & Web Links
  GoogleMaps: ({ className = "" }: { className?: string }) => (
    <Image src="/icons/icons8/map-pin.svg" alt="" width={24} height={24} className={`inline-block mr-1.5 ${className}`} style={{filter: 'brightness(0) saturate(100%) invert(33%) sepia(79%) saturate(1515%) hue-rotate(219deg) brightness(101%) contrast(101%)'}} />
  ),
  Instagram: ({ className = "" }: { className?: string }) => (
    <Image src="/icons/icons8/instagram.svg" alt="" width={24} height={24} className={`inline-block mr-1.5 ${className}`} style={{filter: 'brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(7284%) hue-rotate(317deg) brightness(94%) contrast(91%)'}} />
  ),
}

function removePalmFromTranslations(obj: Record<string, string>) {
  const palmRegex = /🌴/g;
  return Object.fromEntries(
    Object.entries(obj).map(([lang, str]) => [lang, str.replace(palmRegex, "")])
  );
}

export default function Shopping() {
  const { language } = useLanguage()
  const langPrefix = language.code === "es" ? "" : `/${language.code}`
  
  const tabs = [
    { id: "activities", label: placesNearbyTranslations.tabs.activities, href: `${langPrefix}/places-nearby/activities`, active: false },
    { id: "food", label: placesNearbyTranslations.tabs.food, href: `${langPrefix}/places-nearby/food`, active: false },
    { id: "shopping", label: placesNearbyTranslations.tabs.shopping, href: `${langPrefix}/places-nearby/shopping`, active: true },
    { id: "nature", label: placesNearbyTranslations.tabs.nature, href: `${langPrefix}/places-nearby/nature`, active: false },
    { id: "work", label: placesNearbyTranslations.tabs.work, href: `${langPrefix}/places-nearby/work`, active: false },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                <Translate text={removePalmFromTranslations(placesNearbyTranslations.pageTitle)} />
              </h1>
              <p className="text-lg text-gray-700 mb-12 text-center">
                <Translate text={placesNearbyTranslations.pageDescription} />
              </p>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 justify-center">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors flex items-center space-x-2 ${
                      tab.active
                        ? "bg-black text-white border-b-2 border-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span><Translate text={tab.label} /></span>
                  </Link>
                ))}
              </div>

              {/* Shopping Content */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    <Translate
                      text={{
                        en: "Shopping",
                        es: "Compras",
                      }}
                    />
                  </h2>
                  <p className="text-lg text-gray-700">
                    <Translate
                      text={{
                        en: "My Most Frequented Shops in Cariló & Valeria del Mar",
                        es: "Mis Tiendas Más Frecuentadas en Cariló y Valeria del Mar",
                      }}
                    />
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Near grocery stores section */}
                  <div className="col-span-2 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      <Translate
                        text={{
                          en: "Near Grocery Stores",
                          es: "Almacenes Cerquita",
                          pt: "Mercearias Pertinho",
                        }}
                      />
                    </h3>
                  </div>

                  {/* Chicho */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Shop color="text-indigo-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Chicho</h3>
                        <p className="text-gray-700">
                          Expect a village store with the cheaper side variety of products. Best open hours, decent fruit and vegetables. They have a butcher. 
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Proveedur%C3%ADa+Chicho+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/proveeduria_chicho_esta_loco/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @proveeduria_chicho_esta_loco
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menor Coste */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Shop color="text-teal-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">La Proveeduría / Menor Coste</h3>
                        <p className="text-gray-700">
                          <Translate
                            text={{
                              en: "Mini Whole Foods: kale chips in a glass jar. Jamon leg for 800 dollars. Whole Foods prices aside, that's a nice place and a beautiful walk to it.",
                              es: "Tienda gourmet: chips de kale en frasco de vidrio. Jamón crudo por 800 dólares. Precios de productos premium aparte, es un lugar lindo y una caminata hermosa para llegar.",
                              pt: "Loja gourmet: chips de couve em pote de vidrio. Presunto cru por 800 dólares. Preços de produtos premium à parte, é um lugar bonito e uma bela caminhada para chegar.",
                            }}
                          />
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=La+Proveedur%C3%ADa+Menor+Coste+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/menorcoste/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @menorcoste
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Far big boxes section */}
                  <div className="col-span-2 mb-6 mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      <Translate
                        text={{
                          en: "Far Big Boxes",
                          es: "Híper Lejanos",
                          pt: "Hipermercados Distantes",
                        }}
                      />
                    </h3>
                  </div>

                  {/* Coto */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.ShoppingCart color="text-red-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Coto</h3>
                        <p className="text-gray-700">
                          The closest large supermarket; they have everything from food to
                          furniture and bicycles. Online store with delivery to Cariló.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Coto+Pinamar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.cotodigital3.com.ar/"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            cotodigital3.com.ar
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disco */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.ShoppingCart color="text-blue-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Disco</h3>
                        <p className="text-gray-700">
                          Alternative without taking the highway. They also deliver to Cariló.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Disco+Pinamar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.disco.com.ar/"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            disco.com.ar
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fruit & Vegetables section */}
                  <div className="col-span-2 mb-6 mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      <Translate
                        text={{
                          en: "Fruit & Vegetables",
                          es: "Frutas y Verduras",
                          pt: "Frutas e Verduras",
                        }}
                      />
                    </h3>
                  </div>

                  {/* Belén */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Fruit color="text-emerald-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Belén</h3>
                        <p className="text-gray-700">
                          Best fruit and vegetables.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Verduler%C3%ADa+Bel%C3%A9n+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://waze.com/ul?place=ChIJ4zObzLKdnJUR3db27yKHe_U"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Open in Waze
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boutique de Frutas */}
                  <div className="bg-gradient-to-br from-yellow-50 to-lime-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Fruit color="text-green-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Boutique de Frutas</h3>
                        <p className="text-gray-700">
                          Self-service, which is not common. Pick the best or
                          blame on someone else.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Boutique+de+Frutas+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/boutique_de_frutas/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @boutique_de_frutas
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specialty Stores section */}
                  <div className="col-span-2 mb-6 mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                      <Translate
                        text={{
                          en: "Specialty Stores",
                          es: "Tiendas Especializadas",
                          pt: "Lojas Especializadas",
                        }}
                      />
                    </h3>
                  </div>

                  {/* Add all the specialty stores with their icons */}
                  {/* Jorjito */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Tools color="text-amber-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Jorjito</h3>
                        <p className="text-gray-700">
                          Most complete hardware store.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Ferreter%C3%ADa+Jorjito+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/ferreteria_jorgito/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @ferreteria_jorgito
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Continue with other specialty stores with their respective icons */}
                  {/* Quimica Limpia Maurito */}
                  <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Spray color="text-cyan-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Quimica Limpia Maurito</h3>
                        <p className="text-gray-700">
                          In Pinamar, best for bulk cleaning products. They
                          deliver to Cariló weekly.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Qu%C3%ADmica+Limpia+Maurito+Pinamar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://www.facebook.com/LMaurito/"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Facebook Page
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clothing */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.TShirt color="text-violet-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Cariló City-Center Boutiques</h3>
                        <p className="text-gray-700">
                          All the clothing in Cariló city center.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <a
                            href="https://maps.app.goo.gl/HSdLEiSF9qGJRWY7A"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            Open in Google Maps
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cabaña Guerrero */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Meat color="text-red-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Cabaña Guerrero</h3>
                        <p className="text-gray-700">
                          My favorite meat.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Caba%C3%B1a+Guerrero+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/cabana.guerrero/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @cabana.guerrero
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* La Constanza Cariló */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Fish color="text-cyan-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">La Constanza (Cariló)</h3>
                        <p className="text-gray-700">
                          Fresh fish, not frozen, even salmon. Closed during
                          low season.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Pescader%C3%ADa+La+Constanza+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/pescaderiasdicostanzoar/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @pescaderiasdicostanzoar
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* La Constanza Pinamar */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Fish color="text-blue-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">La Constanza (Pinamar)</h3>
                        <p className="text-gray-700">
                          Open during low season when Cariló's location is
                          closed.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Pescader%C3%ADa+La+Constanza+Pinamar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/pescaderiasdicostanzoar/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @pescaderiasdicostanzoar
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Colonial */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.IceCream color="text-blue-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Colonial (Valeria del Mar)</h3>
                        <p className="text-gray-700">
                          My favorite ice cream.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Helader%C3%ADa+Colonial+Valeria+del+Mar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/colonialhelados/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @colonialhelados
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lucciano's */}
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.IceCream color="text-pink-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Lucciano's</h3>
                        <p className="text-gray-700">
                          The prettiest place.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Lucciano%27s+Pinamar"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/luccianos_/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @luccianos_
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Panettone */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Bread color="text-amber-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Panettone</h3>
                        <p className="text-gray-700">
                          Simple.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Il+Panettone+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/panaderia.ilpanettone/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @panaderia.ilpanettone
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masse */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-start mb-4">
                      <Icons.Bread color="text-orange-700" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Masse</h3>
                        <p className="text-gray-700">
                          Fancy breads with seeds.
                        </p>
                        <p className="mt-2">
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Masse+Caril%C3%B3"
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm mr-3"
                          >
                            <Icons.GoogleMaps />
                            Google Maps
                          </a>
                          <span className="flex items-center">
                            <Icons.Instagram />
                            <a
                              href="https://www.instagram.com/masse.carilo/"
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                              @masse.carilo
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">
                  <Translate text={placesNearbyTranslations.cta.title} />
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  <Translate text={placesNearbyTranslations.cta.description} />
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center px-8 py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Translate text={placesNearbyTranslations.cta.button} />
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