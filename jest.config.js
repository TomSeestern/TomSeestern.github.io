const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["<rootDir>/e2e"],
  // Page components are covered behaviourally by Playwright; counting them here
  // would dilute the unit signal without protecting anything.
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.stories.tsx",
    "!**/*.test.{ts,tsx}",
    "!**/page.tsx",
  ],
  coverageThreshold: {
    // Floors pinned to the 2026-10-24 measurement, rounded down: 89.87 /
    // 87.85 / 93.58 / 92.48. They may only ratchet up. Before this, the
    // threshold was declared at 80 % and never consulted — no `--coverage`
    // flag was passed anywhere — while branches actually sat at 87.85 %.
    global: {
      branches: 87,
      functions: 93,
      lines: 92,
      statements: 89,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
