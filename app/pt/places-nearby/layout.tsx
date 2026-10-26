import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "O que fazer em Cariló | IL BUCO",
  description: "Praias, esportes, restaurantes e arredores de Cariló, com avaliações do Google Maps e distâncias desde o Il Buco.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
