/**
 * Fast iteration config for the 3 known-failing routes only.
 * Mirrors .lighthouserc.js assertions/budgets exactly (2500/0.1/200) so a pass
 * here is a faithful signal; final sign-off still uses the full `lhci autorun`.
 * Usage: pnpm exec lhci autorun --config=.omo/tools/lhci-failing-only.js
 */
const base = require("../../.lighthouserc.js")

const FAILING = [
  "/about",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects",
]

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      url: FAILING.map((route) => `http://localhost:3000${route}`),
    },
  },
}
