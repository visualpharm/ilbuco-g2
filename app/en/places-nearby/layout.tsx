import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Things to Do in Cariló | IL BUCO",
  description: "Beaches, sports, restaurants and nearby towns around Il Buco in Cariló, with Google Maps ratings and distances.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
