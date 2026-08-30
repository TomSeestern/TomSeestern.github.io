const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: ["<rootDir>/e2e"],
  transformIgnorePatterns: ["/node_modules/(?!(flowbite-react|debounce)/)"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()
  return {
    ...config,
    transformIgnorePatterns: (config.transformIgnorePatterns || []).map((pattern) =>
      pattern.includes("node_modules")
        ? "/node_modules/(?!(\\.pnpm/.*(flowbite-react|debounce)|flowbite-react|debounce)/)"
        : pattern
    ),
  }
}
