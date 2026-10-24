# Decisions — 2026-refresh-restyle

Architectural choices and rationales discovered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## [2026-09-10] Orchestrator — binding reconciliations before execution

The plan text contains stale task descriptions that predate the resolved decisions.
These OVERRIDES are binding (source: `.omo/decisions/2026-09-10-refresh-scope-decisions.md`
+ "Design-direction amendments from D13/D4" in the plan):

- **D13 (single light mode, parchment, no blue)** overrides T07's "keep key / preserve dark
  fallback", T13's `#2563eb` accent, T15's "travertine-light default + dark", and the whole
  dark-mode machinery. T07 = REMOVE `DarkThemeToggle`, the inline theme script, and the
  `flowbite-theme-mode` key; ship ONE light parchment mode. Dark comes out of scope entirely.
- **D4 (two warm accents, no blue)** overrides T13/T15 `accent #2563eb`. Use terracotta
  `#B4462F` + deep oxblood/wine, contrast-gated in T13. No blue anywhere, including OG assets.
- **D3** = two fonts: Inter + self-hosted Newsreader (<=60KB woff2).
- **D8 BLOCKED** — unlabelled placeholder testimonials are forbidden (R19.1 + UWG §5).
  No agent implements testimonials. Alternatives: labelled examples or defer.
- **Wave 5 (T24–T29)** is human-gated: HOLD. No agent authors content as fact.
- Baseline (T02): build emits **38** static pages, not the plan's 36. Reconcile doc claims.
- T01: plan claimed `pnpm lint` was RED; it was actually exit 0 (55 warnings). The real defect
  was a dormant duplicate `eslint-plugin-react-hooks` tree (v4.6.2 via unreferenced
  `eslint-config-react-app`). Removed the unreferenced devDep; single plugin copy remains.
