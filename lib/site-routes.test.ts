import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { publicRoutes, TRANSLATED } from "./site-routes"

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return pages(p)
    return /^page\.(tsx|ts)$/.test(name) ? [p] : []
  })
}

const routes = publicRoutes(pages("app"))

test("sitemap routes drop private and dynamic pages", () => {
  assert.deepEqual(publicRoutes(["app/page.tsx", "app/nimda/page.tsx", "app/reservar/[suite]/page.tsx", "app/en/guest/page.tsx", "app/en/rooms/page.tsx"]), ["/", "/en/rooms"])
})

test("every translated page exists in every language", () => {
  for (const [name, group] of Object.entries(TRANSLATED)) {
    for (const [lang, path] of Object.entries(group)) {
      assert.ok(routes.includes(path), `${name} (${lang}) ${path} has no page`)
    }
  }
})

test("the old 404 addresses are not pages", () => {
  for (const gone of ["/habitaciones", "/ubicacion", "/la-casa", "/en/remote-work-retreat", "/en/que-hacer-en-carilo"]) {
    assert.ok(!routes.includes(gone), gone)
  }
})
