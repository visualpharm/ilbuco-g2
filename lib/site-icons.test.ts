import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { layoutIconPaths, manifestIconPaths, siteIconPaths } from "./site-icons"

const root = join(__dirname, "..")

test("every icon the layouts and the web manifest link to is a file in public/", () => {
  const paths = siteIconPaths(root)
  assert.ok(paths.includes("/favicon.ico"))
  assert.ok(paths.includes("/site.webmanifest"))
  const missing = paths.filter((path) => !existsSync(join(root, "public", path)))
  assert.deepEqual(missing, [])
})

test("layout icon paths come from the icons block and the manifest field only", () => {
  const source = `export const metadata = {
    openGraph: { images: ['/og.jpg'] },
    icons: { icon: [{ url: '/a.ico' }, { url: "/b.png", sizes: '16x16' }], apple: '/c.png' },
    manifest: '/site.webmanifest',
  }`
  assert.deepEqual(layoutIconPaths(source), ["/a.ico", "/b.png", "/c.png", "/site.webmanifest"])
})

test("manifest icon paths skip remote and missing sources", () => {
  const json = JSON.stringify({ icons: [{ src: "/x.png" }, { src: "https://cdn/y.png" }, {}] })
  assert.deepEqual(manifestIconPaths(json), ["/x.png"])
})
