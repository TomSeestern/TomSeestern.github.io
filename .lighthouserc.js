/**
 * Lighthouse CI — T05 performance budgets.
 *
 * Serves the production build (`pnpm start`) and asserts three lab metrics on
 * the mobile form factor with simulated 4x CPU/network throttling, using the
 * median of 3 runs per route. TBT is the lab proxy for INP — these are not
 * field p75 numbers.
 *
 * Shared-runner variance / tolerance: on a contended host the median LCP can
 * swing widely between runs — observed per-route envelopes are recorded in
 * `.omo/evidence/task-T05-2026-refresh-restyle.txt` §8. A single-route red is
 * therefore not proof of regression; re-read it on an uncontended host before
 * acting. TBT minima straddling 200 ms under contention are likewise not a
 * regression signal.
 *
 * Chrome resolution: Lighthouse needs a Chrome/Chromium binary. CI has no
 * browser on PATH inside `nix develop`, so when no `CHROME_PATH` is set we fall
 * back to the Playwright Chromium that `pnpm exec playwright install chromium`
 * places in `$PLAYWRIGHT_BROWSERS_PATH` (default `$HOME/.cache/ms-playwright`).
 * Locally the devShell exposes the system Chromium on PATH.
 */

const { execSync } = require("node:child_process")
const { existsSync, readdirSync } = require("node:fs")
const { homedir } = require("node:os")
const { join } = require("node:path")

const PORT = process.env.PORT || 3000
const ORIGIN = `http://localhost:${PORT}`

/** Public static routes under budget (see the `next build` route manifest). */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects",
  "/projects/entry/2020-soudest-backend-nodejs",
  "/contact",
].map((route) => `${ORIGIN}${route}`)

/**
 * Lighthouse mobile defaults for simulated throttling (4x CPU slowdown,
 * slow-4G network). Pinned explicitly so a Lighthouse upgrade cannot silently
 * move the budget baseline.
 */
const MOBILE_THROTTLING = {
  rttMs: 150,
  throughputKbps: 1638.4,
  cpuSlowdownMultiplier: 4,
  requestLatencyMs: 562.5,
  downloadThroughputKbps: 1474.56,
  uploadThroughputKbps: 675,
}

/** @returns {string} absolute path to a Chrome/Chromium executable */
function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH

  for (const binary of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    try {
      const found = execSync(`command -v ${binary}`, { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim()
      if (found) return found
    } catch {
      // Not on PATH — try the next candidate.
    }
  }

  const cacheDir = process.env.PLAYWRIGHT_BROWSERS_PATH || join(homedir(), ".cache", "ms-playwright")
  if (existsSync(cacheDir)) {
    const revisions = readdirSync(cacheDir)
      .filter((name) => name.startsWith("chromium-"))
      .sort()
      .reverse()
    for (const revision of revisions) {
      for (const dir of ["chrome-linux64", "chrome-linux"]) {
        const candidate = join(cacheDir, revision, dir, "chrome")
        if (existsSync(candidate)) return candidate
      }
    }
  }

  throw new Error(
    "No Chrome/Chromium found. Install one (e.g. `pnpm exec playwright install chromium`) or set CHROME_PATH."
  )
}

module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 120000,
      url: PUBLIC_ROUTES,
      numberOfRuns: 3,
      chromePath: resolveChromePath(),
      settings: {
        formFactor: "mobile",
        throttlingMethod: "simulate",
        throttling: MOBILE_THROTTLING,
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        // Metrics live in the performance category; skipping the rest keeps
        // 21 audits (7 routes x 3 runs) affordable in CI.
        onlyCategories: ["performance"],
      },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median" }],
        "total-blocking-time": ["error", { maxNumericValue: 200, aggregationMethod: "median" }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
}
