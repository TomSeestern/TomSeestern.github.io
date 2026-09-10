import { chromium } from "@playwright/test"

const BASE = process.argv[2] ?? "http://127.0.0.1:3077"
const executablePath = process.env.CHROME_PATH || "/etc/profiles/per-user/tom/bin/chromium"

const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto(BASE + "/", { waitUntil: "load" })
await page.evaluate(() => document.fonts.ready)

const probe = await page.evaluate(() => {
  const h1 = document.querySelector("h1")
  const original = h1.style.fontWeight
  h1.style.fontWeight = "700"
  const w700 = h1.getBoundingClientRect().width
  h1.style.fontWeight = "800"
  const w800 = h1.getBoundingClientRect().width
  h1.style.fontWeight = original
  const h3 = document.querySelector("h3")
  const h3cs = h3 ? getComputedStyle(h3) : null
  return {
    loadedFaces: Array.from(document.fonts).map((f) => `${f.family} ${f.weight} ${f.status}`),
    widthAt700: Math.round(w700),
    widthAt800: Math.round(w800),
    syntheticBold: Math.round(w800) > Math.round(w700) + 1,
    h3: h3cs && { fontFamily: h3cs.fontFamily, textTransform: h3cs.textTransform, fontWeight: h3cs.fontWeight },
  }
})
console.log(JSON.stringify(probe, null, 2))
await browser.close()
