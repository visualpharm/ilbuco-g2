import Link from "next/link"
import { Metadata } from "next"
import { LocationContent } from "@/components/location-content"

export const metadata: Metadata = {
  title: "Nossa Localização - Cariló, Argentina | IL BUCO",
  description: "Descubra a localização perfeita do IL BUCO em Cariló, Argentina. A 360 km de Buenos Aires, rodeado por florestas de pinheiros e praias pristinas.",
  keywords: "localização carilo, como chegar carilo, carilo argentina localização, il buco localização",
}
export default function PortugueseLocation() {
  return (
    <LocationContent
      introTail={<> Localização perfeita para <Link href="/pt/coliving" className="text-inherit no-underline">coliving</Link> próximo à <Link href="/pt/argentina-praia" className="text-inherit no-underline">praia</Link>, a poucos metros do <Link href="/pt/argentina-mar" className="text-inherit no-underline">mar</Link>. Descubra <Link href="/pt/carilo-argentina-o-que-fazer" className="text-inherit no-underline">o que fazer</Link> na região.</>}
    />
  )
}
