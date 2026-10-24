/**
 * Full 7-route config mirroring .lighthouserc.js exactly, for local diagnosis.
 * Difference from the committed config: nothing — same budgets, same throttling.
 * Usage: pnpm exec lhci autorun --config=.omo/tools/lhci-all-routes.js
 */
const base = require("../../.lighthouserc.js")

const ALL_ROUTES = [
  "/about",
  "/",
  "/blog",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects",
  "/projects/entry/2020-soudest-backend-nodejs",
  "/contact",
]

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      url: ALL_ROUTES.map((route) => `http://localhost:3000${route}`),
    },
  },
}
