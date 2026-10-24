import { chromium } from "@playwright/test"
import fs from "node:fs/promises"
import path from "node:path"

const baseURL = "http://127.0.0.1:3040"
const outDir = path.resolve(".omo/evidence")

const details = [
  {
    route: "/blog/entry/2025-falling-for-nix",
    title: "Falling for Nix: One Flake, Three Machines",
    phrase: "Nix did not make me love configuration",
    screenshot: "dispatch-nix-375.png",
  },
  {
    route: "/blog/entry/2026-unraid-declarative-homelab-v4",
    title: "Unraid, Declaratively: The Fourth Homelab Iteration",
    phrase: "The repository does not own the server",
    screenshot: "dispatch-unraid-375.png",
  },
  {
    route: "/blog/entry/2026-what-llm-agents-are-missing",
    title: "What LLM Agents Are Still Missing",
    phrase: "The missing layer is the world around the model",
    screenshot: "dispatch-llm-375.png",
  },
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function expectNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  assert(
    metrics.scrollWidth <= metrics.clientWidth,
    `${label} overflows horizontally: ${JSON.stringify(metrics)}`
  )
}

await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const errors = []

try {
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 960 } })
  const page = await desktop.newPage()
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  const blogResponse = await page.goto(`${baseURL}/blog`, { waitUntil: "networkidle" })
  assert(blogResponse?.status() === 200, `blog returned ${blogResponse?.status()}`)
  assert((await page.getByRole("heading", { level: 1 }).textContent()) === "Blog", "blog h1 mismatch")
  const postLinks = page.locator('h3 a[href^="/blog/entry/"]')
  assert((await postLinks.count()) === 6, `expected 6 blog detail links, got ${await postLinks.count()}`)
  const titles = await postLinks.allTextContents()
  assert(
    titles.join("|") ===
      [
        "What LLM Agents Are Still Missing",
        "Unraid, Declaratively: The Fourth Homelab Iteration",
        "Falling for Nix: One Flake, Three Machines",
        "Transforming my Homelab with Advanced Automation - The 3rd Iteration Journey",
        "The Evolution of My Homelab Journey - The Second Iteration",
        "Memorable Ebeltoft Cheesecake – A Sweet Souvenir",
      ].join("|"),
    `unexpected blog order: ${titles.join(" | ")}`
  )
  await page.screenshot({ path: path.join(outDir, "blog-six-dispatches-1280.png"), fullPage: false })

  for (const detail of details) {
    const response = await page.goto(`${baseURL}${detail.route}`, { waitUntil: "networkidle" })
    assert(response?.status() === 200, `${detail.route} returned ${response?.status()}`)
    assert(
      (await page.getByRole("heading", { level: 1 }).textContent()) === detail.title,
      `${detail.route} h1 mismatch`
    )
    const bodyText = await page.locator("article.prose").innerText()
    assert(bodyText.length > 500, `${detail.route} body is too short`)
    assert(bodyText.includes(detail.phrase), `${detail.route} body is missing its closing phrase`)
    assert(await page.getByTestId("author-card").isVisible(), `${detail.route} author card missing`)
    assert(await page.getByTestId("more-dispatches").isVisible(), `${detail.route} onward links missing`)
    assert(
      (await page.getByTestId("more-dispatches").getByTestId("article-card").count()) === 2,
      `${detail.route} expected two onward cards`
    )
    await expectNoOverflow(page, detail.route)
    await page.screenshot({ path: path.join(outDir, detail.screenshot), fullPage: false })
  }

  for (const [route, heading] of [
    ["/tags/nixos", "NixOS"],
    ["/tags/unraid", "Unraid"],
    ["/tags/ai-agents", "AI Agents"],
    ["/tags/infrastructure-as-code", "Infrastructure as Code"],
  ]) {
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" })
    assert(response?.status() === 200, `${route} returned ${response?.status()}`)
    assert((await page.getByRole("heading", { level: 1 }).textContent()) === heading, `${route} h1 mismatch`)
    assert((await page.getByTestId("tag-grid").locator("article").count()) >= 1, `${route} has no entries`)
  }

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const mobilePage = await mobile.newPage()
  mobilePage.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  mobilePage.on("pageerror", (error) => errors.push(error.message))

  const mobileBlog = await mobilePage.goto(`${baseURL}/blog`, { waitUntil: "networkidle" })
  assert(mobileBlog?.status() === 200, "mobile blog returned non-200")
  await expectNoOverflow(mobilePage, "/blog at 375px")
  await mobilePage.screenshot({ path: path.join(outDir, "blog-six-dispatches-375.png"), fullPage: false })

  for (const detail of details) {
    const response = await mobilePage.goto(`${baseURL}${detail.route}`, { waitUntil: "networkidle" })
    assert(response?.status() === 200, `${detail.route} at 375px returned ${response?.status()}`)
    await expectNoOverflow(mobilePage, `${detail.route} at 375px`)
    assert(
      (await mobilePage.getByRole("heading", { level: 1 }).textContent()) === detail.title,
      `${detail.route} mobile h1 mismatch`
    )
  }

  assert(errors.length === 0, `browser errors: ${JSON.stringify(errors, null, 2)}`)
  console.log("OK: six dispatches, three new routes, tag archives, two onward cards each, no 375px overflow")
} finally {
  await browser.close()
}
