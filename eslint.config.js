const fs = require("fs")
const path = require("path")
const { FlatCompat } = require("@eslint/eslintrc")
const js = require("@eslint/js")
const typescriptEslint = require("@typescript-eslint/eslint-plugin")
const eslintConfigPrettier = require("eslint-config-prettier/flat")
const tailwindcss = require("eslint-plugin-tailwindcss")

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const ignoredDirectoryNames = new Set([".git", ".next", ".vscode", "node_modules"])
const sortedDirectories = getSortedDirectories()

module.exports = [
  {
    ignores: [".eslintignore", ".next/**", "coverage/**", "node_modules/**", "playwright-report/**", "test-results/**"],
  },
  ...compat.extends("next"),
  eslintConfigPrettier,
  ...tailwindcss.configs["flat/recommended"],
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-empty-object-type": "off",
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
            ...sortedDirectories.map((directory) => ({
              pattern: `${directory}/**`,
              group: "internal",
            })),
            {
              pattern: "env",
              group: "internal",
            },
            {
              pattern: "theme",
              group: "internal",
            },
            {
              pattern: "public/**",
              group: "internal",
              position: "after",
            },
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
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-custom-classname": "off",
      "testing-library/prefer-screen-queries": "off",
    },
  },
]

function getSortedDirectories() {
  return fs
    .readdirSync(__dirname)
    .filter((entry) => !ignoredDirectoryNames.has(entry))
    .filter((entry) => fs.statSync(path.join(__dirname, entry)).isDirectory())
}
