# Canonical domain correction — tomsegbers.de

## TL;DR

The live portfolio is `https://tomsegbers.de`, but the app hardcodes
`https://tom.segbers.de` in metadata, sitemap, robots, tests, and the README.
Replace every wrong reference with the live domain, add a sitemap/robots
regression test, and verify the generated metadata.

## Scope

- Metadata / canonical URLs in `app/**`
- `app/layout.tsx` metadataBase and JSON-LD
- `app/sitemap.ts`, `app/robots.ts`
- Existing canonical tests in `app/**/*.test.tsx`
- New `app/public-urls.test.ts`
- `README.md`

## Steps

- [x] **1. Audit.** Confirm live host and list every wrong-domain occurrence.
- [x] **2. Replace references.** `tom.segbers.de` → `tomsegbers.de` in tracked
  source, tests, and README.
- [x] **3. Add regression checks.** Assert sitemap URLs and robots sitemap use
  the public domain.
- [x] **4. Verify.** Prettier, typecheck, Jest, build, and inspect generated
  sitemap/robots/canonical URLs.
- [x] **5. Commit and push.** Commit `cf96691`; Vercel deployment remains
  manual and requires authentication.

## Findings

- `https://tomsegbers.de` responds 200 and serves a portfolio titled
  “TomSegbers.de”.
- `https://tom.segbers.de` serves a “This domain is for sale” page.
- The repo has 21 references to the parked domain across 17 tracked files.
