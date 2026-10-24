import { defineConfig, devices } from "@playwright/test"

const isCI = !!process.env.CI

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3030",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Chromium is the only executed project. Firefox/WebKit were declared here
     but no workflow ever installed or ran them, so the matrix was a claim the
     repo could not keep. Re-add a project only together with the CI step that
     runs it. */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Serve the artifact that deploys. Locally `next dev` keeps the loop fast;
     in CI the WebServer builds and starts the production server, which is the
     only way a prod-mode hydration or bundling regression can be caught before
     it ships. `next start` sets NODE_ENV=production, which is why the contact
     form's E2E bypass is guarded on VERCEL_ENV instead. */
  webServer: {
    command: isCI ? "pnpm build && pnpm exec next start --port 3030" : "pnpm exec next dev --port 3030",
    url: "http://127.0.0.1:3030/contact",
    reuseExistingServer: !isCI,
    timeout: 240_000,
    env: {
      E2E_CONTACT_FORM_SUCCESS: "true",
    },
  },
})
