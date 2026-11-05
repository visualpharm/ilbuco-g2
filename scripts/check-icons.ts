// After a deploy: every icon path from metadata.icons and site.webmanifest must answer 200 live.
// Usage: scripts/check-icons [base-url]   (default https://ilbuco.com.ar; exit 1 on any miss)
import { join } from "node:path"
import { siteIconPaths } from "../lib/site-icons"

async function main() {
  const base = (process.argv[2] ?? "https://ilbuco.com.ar").replace(/\/$/, "")
  const paths = siteIconPaths(join(__dirname, ".."))
  let failed = 0
  for (const path of paths) {
    let status = "error"
    try {
      status = String((await fetch(`${base}${path}?check=${Date.now()}`, { redirect: "follow" })).status)
    } catch (error) {
      status = `error: ${(error as Error).message}`
    }
    if (status !== "200") failed++
    console.log(`${status === "200" ? "ok  " : "FAIL"} ${status} ${base}${path}`)
  }
  if (failed) {
    console.error(`${failed} of ${paths.length} icon paths do not answer 200`)
    process.exit(1)
  }
  console.log(`all ${paths.length} icon paths answer 200`)
}

main()
