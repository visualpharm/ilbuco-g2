"use client"

import type { ReactNode } from "react"
import { useLanguage } from "@/contexts/language-context"

/** Renders its children only on pages of one language: per-language SEO phrases on shared pages. */
export function OnlyLanguage({ code, children }: { code: string; children: ReactNode }) {
  const { language } = useLanguage()
  return language.code === code ? <>{children}</> : null
}
