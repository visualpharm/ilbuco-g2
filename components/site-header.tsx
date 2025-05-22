import Link from "next/link"
import { MobileMenu } from "./mobile-menu"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          IL BUCO
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/the-house" className="text-sm font-medium hover:text-blue-600 transition-colors">
            The House
          </Link>
          <Link href="/rooms" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Rooms
          </Link>
          <Link href="/location" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Location
          </Link>
          <Link href="/things-to-do" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Things to Do
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>
        <MobileMenu />
      </div>
    </header>
  )
}
