import { chromium } from "@playwright/test"
import path from "node:path"

const baseURL = "http://127.0.0.1:3040"
const outDir = path.resolve(".omo/evidence")
const routes = [
  "/blog",
  "/blog/entry/2025-falling-for-nix",
  "/blog/entry/2026-unraid-declarative-homelab-v4",
  "/blog/entry/2026-what-llm-agents-are-missing",
]
const names = ["blog", "nix", "unraid", "llm"]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
const page = await context.newPage()
for (let index = 0; index < routes.length; index += 1) {
  const response = await page.goto(`${baseURL}${routes[index]}`, { waitUntil: "networkidle" })
  if (response?.status() !== 200) throw new Error(`${routes[index]} returned ${response?.status()}`)
  await page.screenshot({
    path: path.join(outDir, `${names[index]}-375-full.png`),
    fullPage: true,
  })
  console.log(`${routes[index]} captured`)
}
await browser.close()
