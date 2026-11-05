import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

// Every icon path the site links to: `metadata.icons` and `manifest` in each app/**/layout.tsx,
// plus every icon `src` in the web manifests they point at. Used by the unit test (files exist
// in public/) and by scripts/check-icons (each path answers 200 on the live site after a deploy).

function layoutFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return layoutFiles(path)
    return name === "layout.tsx" ? [path] : []
  })
}

// The text of the `icons: { … }` object literal, found by brace matching.
function iconsBlock(source: string): string {
  const start = source.search(/\bicons\s*:\s*\{/)
  if (start < 0) return ""
  const open = source.indexOf("{", start)
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++
    else if (source[i] === "}" && --depth === 0) return source.slice(open, i + 1)
  }
  return ""
}

const quotedPath = /['"`](\/[^'"`\s]*)['"`]/g

export function layoutIconPaths(source: string): string[] {
  const paths = [...iconsBlock(source).matchAll(quotedPath)].map((m) => m[1])
  const manifest = source.match(/\bmanifest\s*:\s*['"`](\/[^'"`]+)['"`]/)
  if (manifest) paths.push(manifest[1])
  return paths
}

export function manifestIconPaths(json: string): string[] {
  const manifest = JSON.parse(json) as { icons?: { src?: string }[] }
  return (manifest.icons ?? []).map((icon) => icon.src ?? "").filter((src) => src.startsWith("/"))
}

export function siteIconPaths(root: string): string[] {
  const paths = new Set<string>()
  for (const file of layoutFiles(join(root, "app"))) {
    for (const path of layoutIconPaths(readFileSync(file, "utf8"))) paths.add(path)
  }
  for (const path of [...paths]) {
    if (!path.endsWith(".webmanifest") && !path.endsWith("manifest.json")) continue
    for (const icon of manifestIconPaths(readFileSync(join(root, "public", path), "utf8"))) paths.add(icon)
  }
  return [...paths].sort()
}
