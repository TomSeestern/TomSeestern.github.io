// Import groups are declared statically. They used to be derived by enumerating
// the working directory, which made lint verdicts depend on whatever stray
// directories happened to exist — a clean clone and a tree with
// `storybook-static/` or `test-results/` disagreed.
const INTERNAL_DIRECTORIES = ["app", "components", "content", "e2e", "lib", "public", "scripts", "styles"]

module.exports = {
  extends: ["next", "prettier", "plugin:storybook/recommended", "plugin:tailwindcss/recommended"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  rules: {
    "tailwindcss/no-custom-classname": "off",
    "testing-library/prefer-screen-queries": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
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
    "import/order": [
      2,
      {
        groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
        pathGroups: [
          ...INTERNAL_DIRECTORIES.map((singleDir) => ({
            pattern: `${singleDir}/**`,
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
  },
}
