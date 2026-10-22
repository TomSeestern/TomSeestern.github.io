import { type Browser, chromium, type Page } from "@playwright/test"
import { type ChildProcess, spawn } from "node:child_process"
import fs from "node:fs/promises"
import net from "node:net"
import path from "node:path"

const DEFAULT_PORT = 3030
const TARGET_ROUTES = [
  { name: "home", route: "/" },
  { name: "projects", route: "/projects" },
  { name: "blog", route: "/blog" },
  { name: "contact", route: "/contact" },
] as const

const SCREENSHOTS_DIR = path.resolve(process.cwd(), "public/img/screenshots")

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    animation-play-state: paused !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  nextjs-portal { display: none !important; }
`

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(true)
      } else {
        resolve(false)
      }
    })
    server.once("listening", () => {
      server.close(() => resolve(false))
    })
    server.listen(port, "127.0.0.1")
  })
}

async function waitForHttp(url: string, timeoutMs = 60000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status < 500) {
        return
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`)
}

async function ensureServerRunning(port: number): Promise<{
  baseURL: string
  stopServer?: () => Promise<void>
}> {
  const baseURL = `http://127.0.0.1:${port}`
  const inUse = await isPortInUse(port)

  if (inUse) {
    try {
      await waitForHttp(`${baseURL}/contact`, 5000)
      return { baseURL }
    } catch {
      console.warn(`Port ${port} in use but unresponsive. Starting new server...`)
    }
  }

  // Ensure default browser cache path for Playwright if unset
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.HOME) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(process.env.HOME, ".cache/ms-playwright")
  }

  const child: ChildProcess = spawn("pnpm", ["exec", "next", "dev", "--port", String(port)], {
    env: {
      ...process.env,
      PORT: String(port),
      E2E_CONTACT_FORM_SUCCESS: "true",
    },
    stdio: "pipe",
    detached: true,
  })

  child.stderr?.on("data", (chunk: Buffer) => {
    const text = chunk.toString()
    if (text.includes("Error:") || text.includes("UnhandledPromiseRejection")) {
      console.error(`[next-server-error] ${text}`)
    }
  })

  await waitForHttp(`${baseURL}/contact`, 60000)

  const stopServer = async () => {
    if (!child.pid) return
    try {
      // Kill process group
      process.kill(-child.pid, "SIGTERM")
    } catch {
      try {
        child.kill("SIGTERM")
      } catch {
        // Already dead
      }
    }
  }

  return { baseURL, stopServer }
}

async function captureWebpScreenshot(page: Page, outputPath: string): Promise<number> {
  const cdp = await page.context().newCDPSession(page)
  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "webp",
    quality: 85,
    captureBeyondViewport: false,
  })
  const buffer = Buffer.from(screenshot.data, "base64")
  await fs.writeFile(outputPath, buffer)
  return buffer.length
}

async function captureRouteScreenshot(browser: Browser, baseURL: string, item: (typeof TARGET_ROUTES)[number]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  })

  const page = await context.newPage()

  try {
    const targetUrl = `${baseURL}${item.route}`
    await page.goto(targetUrl, { waitUntil: "networkidle" })

    // Inject CSS to freeze animations and stop marquee
    await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS })

    // Wait for fonts to finish loading
    await page.evaluate(() => document.fonts.ready)

    // Brief stabilization pause
    await page.waitForTimeout(300)

    const outputPath = path.join(SCREENSHOTS_DIR, `${item.name}.webp`)
    const bytes = await captureWebpScreenshot(page, outputPath)
    const kb = (bytes / 1024).toFixed(1)
    console.log(`Captured ${item.name}.webp (${kb} KB) from ${item.route}`)
  } finally {
    await context.close()
  }
}

async function main() {
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true })

  const port = Number(process.env.PORT) || DEFAULT_PORT
  const { baseURL, stopServer } = await ensureServerRunning(port)

  let browser: Browser | undefined
  try {
    if (!process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.HOME) {
      process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(process.env.HOME, ".cache/ms-playwright")
    }

    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })

    for (const item of TARGET_ROUTES) {
      await captureRouteScreenshot(browser, baseURL, item)
    }
  } finally {
    if (browser) {
      await browser.close()
    }
    if (stopServer) {
      await stopServer()
    }
  }
}

main().catch((err) => {
  console.error("Failed to generate screenshots:", err)
  process.exit(1)
})
