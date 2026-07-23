const { FlatCompat } = require("@eslint/eslintrc")
const js = require("@eslint/js")
const typescriptEslint = require("@typescript-eslint/eslint-plugin")
const eslintConfigPrettier = require("eslint-config-prettier/flat")
const tailwindcss = require("eslint-plugin-tailwindcss")

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const lintFiles = [
  "app/**/*.{js,jsx,ts,tsx}",
  "components/**/*.{js,jsx,ts,tsx}",
  "e2e/**/*.{js,jsx,ts,tsx}",
  "lib/**/*.{js,jsx,ts,tsx}",
  "env.mjs",
  "eslint.config.js",
  "jest.config.js",
  "jest.setup.js",
  "next.config.mjs",
  "playwright.config.ts",
  "postcss.config.js",
  "prettier.config.js",
  "tailwind.config.js",
]

module.exports = [
  {
    // Generated output and local tooling state never belong to authored-code linting.
    ignores: [
      ".codegraph/**",
      ".direnv/**",
      ".next/**",
      ".omo/**",
      "coverage/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...compat.extends("next"),
  eslintConfigPrettier,
  ...tailwindcss.configs["flat/recommended"],
  {
    files: lintFiles,
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "warn",
        {
          groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
          pathGroups: [
            { pattern: "@/**", group: "internal" },
            { pattern: "env", group: "internal" },
            { pattern: "theme", group: "internal" },
            { pattern: "public/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["internal"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  {
    // Test fixtures intentionally pass arbitrary class names through component props.
    files: ["**/*.test.{js,jsx,ts,tsx}", "e2e/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
]
