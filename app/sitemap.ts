import type { MetadataRoute } from "next"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { publicRoutes, alternatesFor } from "@/lib/site-routes"

const BASE = "https://ilbuco.com.ar"

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return pageFiles(p)
    return /^page\.(tsx|ts)$/.test(name) ? [p] : []
  })
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = join(process.cwd(), "app")
  const files = pageFiles(appDir).map((f) => f.replace(appDir, "app"))
  return publicRoutes(files).map((path) => {
    const alternates = alternatesFor(path)
    return {
      url: BASE + (path === "/" ? "" : path),
      changeFrequency: "weekly",
      priority: path === "/" ? 1 : alternates ? 0.8 : 0.6,
      ...(alternates && {
        alternates: { languages: Object.fromEntries(Object.entries(alternates).map(([l, p]) => [l, BASE + (p === "/" ? "" : p)])) },
      }),
    }
  })
}
