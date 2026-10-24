# SYNTHESIS BUNDLE — TomSegbers.de "into 2026" refresh

Provenance: hyperplan-2026-refresh (teamRunId 5dcf2c72-1200-45bb-946a-6b5c4f977faa).
Five adversarial critics (legacy/design, roma/concept, tech/architecture, content/IA, perf/a11y)
ran 3 rounds (independent → cross-attack → defend/refine/concede). This bundle is the
**defensible distillation** — not the plan. Full transcripts:
`.omo/notepads/hyperplan-2026-refresh/critic-*-round{2,3}.md`.

---

## 0. THE BRIEF

> "Lets bring this Project into 2026, with a complete refresh and restyle to a website that a
> peak web design agency would build, inspired by ancient Rome but with a modern twist worthy
> of this Developer turned Entrepreneur."

Interpretation that survived all rounds: a **visual/expressive refresh** of an existing,
technically-competent Next.js portfolio, with a **separate, human-gated content workstream**
as the critical path. Not a framework rewrite, not a new dependency project, not an agency
sitemap.

---

## 1. VERIFIED GROUND TRUTH (file:line)

- Stack: Next **15.5.24**, React 18.2, TypeScript strict, Tailwind **3.3.5**, Flowbite React
  0.12.17, pnpm@10.15.1. README claims "Next.js 14" — **doc drift**.
- **Not** `output:'export'`. Has a `"use server"` action (`lib/sendEmail.tsx:1`) and a Route
  Handler (`app/api/health/route.ts`). Site is SSG on a Node/Vercel runtime.
- Content: **3 blog posts, 21 projects** = 24 files, ~7,767 words (~320 avg). Newest project
  = **2021-12-31**. Blog newest filename is 2024 but `articleDate` is 2023-12-31. Only markdown
  image in the corpus = the 2019 cheesecake post (`content/blog/2019-ebeltoft-cheesecake-recipe.md:21`),
  remote `plantoeat.s3.amazonaws.com`.
- `components/ProjectTeaser/ProjectTeaser.tsx:20` declares `imageUrl`, **never renders it**;
  `app/page.tsx:117` passes `article.fullArticleLink` (a route, `lib/markdown.ts:88`) as `imageUrl`.
  Frontmatter schema (`lib/markdown.ts:6-13`) has **no image field**.
- `tags:` exists in frontmatter but is **dropped** by the Zod schema (`lib/markdown.ts:6-13`) —
  a code bug, not just "unsurfaced".
- Home marquee (`app/page.tsx:110-141`) renders `projects.map` **twice** = 42 cards; each tech
  icon is wrapped in its own `RadixTooltip.Provider` (`Tooltip.tsx:29`) → ~168 providers.
- Hero image `hidden ... xl:block`, no `priority` (`app/page.tsx:86-93`); 31KB webp; unused
  442KB `.jpg` sibling (`public/img/Tom_Segbers_Frontal.jpg`).
- Theme: `app/layout.tsx:35` hardcodes `className="... dark"`; inline script in `<body>`
  (lines 48-69) reads localStorage key `flowbite-theme-mode`.
- `/contact` is `"use client"` (`app/contact/page.tsx:1`) → **cannot** export metadata; inputs
  have `id` but **no** `aria-describedby`/`aria-invalid`; error `<p id="...-error">` never
  referenced; success Alert not a live region; validation submit-only.
- `next.config.mjs:23` CSP is **Report-Only** (enforces nothing). `remotePatterns` allowlists
  only `flowbite.s3.amazonaws.com` + `placehold.co` — **`plantoeat.s3` is blocked**.
- Dead deps: `@vercel/otel` + `@opentelemetry/*` with **no** `instrumentation.ts`.
- e2e surface = 7 specs (`contact, dark-mode, dynamic-content, home, interactions, responsive,
  static-routes`). `static-routes.spec.ts:44-46` asserts **exact** H1/H2 copy;
  `dynamic-content.spec.ts:27,49` asserts **exactly 3** blog links, `:62,86` **>=21** project links.
- CI: `check.yml` (typecheck/build/lint/prettier/jest/storybook-smoke), `playwright.yml`
  (chromium), `nextjs_bundle_analysis.yml` (uploads JSON, **no threshold**), `screenshots.yml`.
  **`pnpm lint` is currently RED** (pre-existing `react-hooks` plugin conflict from loading both
  `eslint-config-react-app` and `eslint-config-next`).
- Prior design system **exists**: semantic tokens + typography scale (`tailwind.config.js`) +
  `DESIGN.md`. The missing thing is the **expressive/brand layer**, not a token foundation.
- `@axe-core/playwright` is **named** as an acceptance criterion in
  `.omo/plans/2026-audit-remediation.md:229` but is **not installed**.

### Hard repo guardrails (already in `.omo/plans/`)
- `.omo/plans/2026-audit-remediation.md:36`: **"No new runtime dependencies, CSP nonces,
  distributed rate-limit infrastructure, CSRF token systems, logging frameworks,
  OpenTelemetry, or analytics."**
- `.omo/plans/2026-portfolio-overhaul.md` Must-NOT: **"Animation framework or heavy JS effects
  (no framer-motion, GSAP)"**; no CMS/DB; no hosting migration; no i18n.

---

## 2. SETTLED CONSENSUS (unanimous across all 5 critics)

1. **The marquee must die.** Replace with a curated featured set (3-5 "monuments") + the
   `/projects` archive. Highest-ROI, lowest-risk, and unanimously agreed. It also removes the
   42-card DOM / ~168-provider hydration cost and the WCAG 2.2.2 problem.
2. **Content is the critical path, and it is human-gated.** No fabricated metrics, testimonials,
   or clients (AGENTS R19.1). Content cannot be authored by an agent as fact. Design without it
   ships a "beautiful empty temple".
3. **No new runtime dependencies.** No `framer-motion`/`motion`/LazyMotion. No `next-themes`.
   Motion = CSS + native View Transitions only.
4. **Keep SSG on the Node/Vercel runtime; never adopt `output:'export'`** (server action + Route
   Handler forbid it). `generateStaticParams` stays.
5. **Keep Tailwind v3 config tokens.** Do **not** migrate to CSS custom properties / v4 now.
   Fix drift (`app/page.tsx:44` raw `text-4xl…` vs `text-h1`) and accidental token keys.
6. **Fix FOUC zero-dep:** remove hardcoded `dark` (`app/layout.tsx:35`), resolve theme in a
   blocking `<head>` inline script, **keep the `flowbite-theme-mode` key** for continuity.
7. **De-Flowbite is a targeted Medium effort, not a 6-file swap.** Keep `Card` (the design wants
   to fix it); replace `Tooltip` via the in-tree Radix with **one root Provider**; rebuild
   `Navbar`/`Alert`/`Breadcrumb` only if the design demands; port a11y e2e first, one primitive
   per commit.
8. **Fix the image pipeline before any card/case-study imagery ships** (`next/image`
   `formats: ['image/avif','image/webp']`, explicit dims/aspect-ratio, self-host remote images
   or allowlist the host **first**).
9. **OG/social:** replace the single 512×512 `logo.png` reused across **7** route files with a
   purpose-built 1200×630 asset; header mark → SVG or ≤5KB.
10. **Legal is P0:** add `Impressum` + `Datenschutz` (German `.de`), plain/high-contrast, no
    Roman motifs; `Datenschutz` must disclose the Resend processor flow.
11. **a11y is a gate, not an aspiration:** axe zero serious/critical in light **and** dark;
    contrast AA; the marquee needs a WCAG 2.2.2 pause/stop/hide path (reduced-motion alone is
    **not** sufficient); wire form `aria-describedby`/`aria-invalid`/live region.
12. **Perf program is lab-only** (no RUM allowed, R15.11). **Budgets + CI harness land in Wave 0,
    before any restyle.**
13. **Identity must survive with motion OFF.** Motion is enhancement, never the carrier of meaning.

---

## 3. DESIGN DIRECTION — "Engineered calm" (Rome reconciled)

Rome survives **only as structure and restraint**, zero Roman props (no busts, laurel, SPQR,
Colosseum, gold, papyrus, togas, Latin, arches, cage-cup glass, marble texture).

- **ONE motif:** a 1px vertical **column rule** as the layout grid. Pure CSS borders.
- **Type:** keep **Inter** for UI/body; add **at most ONE** self-hosted variable serif for
  H1/H2 — **Newsreader** preferred (disciplined, no wonk axis), latin subset, 2 weights,
  `display:swap`, **≤60KB woff2**. **Reject** paid GT Sectra and wonky Fraunces. Fallback if
  budget fails: Inter-only with a carved treatment (uppercase + tracking).
- **Palette (contrast-measured):** travertine `#F4F1EA` (default light), basalt `#17181A`,
  ink `#1B1B1F` (15.22:1 on travertine), accent `#2563eb` (5.17:1 — **keep the existing blue**).
  Terracotta `#B4462F` as **text only on `#F4F1EA`** (4.83:1). Verdigris `#4E7A6B` and brass
  `#A8894F` **non-text only**. **Drop** Tyrian purple `#5B2A4A` and `#2F7BFF`.
- **Motion:** opacity + `translateY` only, 200-320ms, `cubic-bezier(0.16,1,0.3,1)`, every
  instance behind `motion-safe:`. **No** clip-path animation, no 900ms, no `backdrop-filter`.
- **Texture:** at most one static ≤5KB noise tile at ≤4% opacity, or none.
- **Hero:** type-led, **no portrait** (removes the LCP surface). Portrait moves to About,
  duotone travertine/basalt, plain 4:5 rectangle.
- **Tokens:** every value lands as a semantic token in `tailwind.config.js` + `DESIGN.md`
  (R5.2/R15.8); no inline hex.
- **Measure system (supplied):** `--measure-article: 66ch`, `--measure-lead: 46ch`,
  `--measure-card: 38ch`, `--measure-display: 20ch`, `--width-page: 78rem`.
- **Checkable proxies for "Rome":** contrast CI gate, reduced-motion test, one-serif check,
  banned-ornament grep (`laurel|bust|spqr|gold|colosseum`).

---

## 4. CONTENT / IA (reconciled)

- **No URL, sitemap, or nav changes for the theme.** Rome is visual only. Routes stay
  `/`, `/about`, `/projects`, `/blog`, `/contact` (`app/sitemap.ts:10-41`).
- Add: `Impressum`, `Datenschutz`, optional server-rendered tag pages (`/tags/[tag]`).
- **Minimum viable, human-gated content set (~1-2 weeks of Tom's writing):** one positioning
  line; three upgraded case studies (existing entries); one founder-arc home section (4 static
  beats, reused on About); two new posts tied to case studies; two legal pages; one consented
  testimonial.
- Case-study fields are **additive optional** schema (`role`, `outcome`, `metrics[]`,
  `heroImage`) with `.default()/.catch()` — non-breaking, no rewrite required to build.
- Tags: add the schema field (one line, matches existing pattern); expose as **server-rendered**
  tag pages, not a client filter.
- CTAs: one primary **"Work with me"** → contact; **RSS** for blog; **no newsletter**.
- Blog: archive the cheesecake post (do not silently delete — it is the only live raw-`<img>`
  fixture and it changes e2e counts); publish 2 posts.
- **Never** fabricate metrics/testimonials/clients (R19.1). Empty case-study *slots* are
  acceptable; invented proof is not.

---

## 5. DEBUNKED CLAIMS — the plan must NOT repeat these

| Claim (Round 1) | Reality |
|---|---|
| "No per-page OG" | OG exists on **7** route files; real issue = same 512×512 logo everywhere. |
| "Content ends 2021 / founder era missing" | LAYZR is on `/about`; blog filename 2024. Precise: no post-2021 project case study, no LAYZR write-up. |
| "Render `imageUrl` = one-line fix" | Needs new schema field + 21 assets + art direction; and it *forces* marquee removal (42 image loads). |
| "`prose max-w-none` = 90+ char lines" | Wrapped in `max-w-3xl`; ~80-85ch. Overstated. |
| "Marquee animation → INP/TBT" | `transform` is compositor-only; cost is DOM/hydration/providers/duplicate focus. |
| "Enforce INP < 200ms in CI" | INP is a **field** metric; no RUM allowed → impossible. Use **TBT** lab proxy. |
| "`next/image` has no formats/TTL" | Defaults are webp + short TTL; finding is "defaults not portfolio-tuned". |
| "Kill Flowbite = 6 files, trivial" | Stateful/ARIA primitives (Navbar/Alert/Breadcrumb/Card); Medium, targeted, contradicts fix-Card. |
| "`tsconfig` es5 is a perf bug" | `noEmit:true` + SWC transpile → cosmetic only. |
| "Procedural marble / cage-cup glass / 600-900ms clip-path" | Rejected: paint/GPU/main-thread cost, no fallback. |
| "Newsletter" | Rejected: conflicts with no-tracking architecture (R15.11). |
| Roman IA/nav naming (Forum/Colosseum/Legions/…) | Rejected: breaks R15.13 URLs, SEO equity, `sitemap.ts`, and e2e. |
| "#2F7BFF as modern accent" | Near-neighbour of existing `#2563eb` and *less* accessible. Drop. |

---

## 6. LAB-MEASURABLE BUDGETS (perf/a11y — RUM forbidden)

- **LCP < 2.5s** — Lighthouse mobile, 4× throttle, cold, per public route.
- **CLS < 0.1** — Lighthouse lab.
- **TBT < 200ms** — Lighthouse mobile (the lab proxy for INP; never promise p75 field).
- **JS:** shared First-Load **≤130KB gz**; per-route **≤180KB gz**; no route +>10% vs committed baseline.
- **Fonts:** ≤2 families, ≤100KB woff2 total, preload the LCP font only, metric-compatible fallback.
- **Images:** shipped asset ≤200KB; hero ≤50KB; `formats: ['image/avif','image/webp']`,
  explicit width/height or aspect-ratio; lazy below fold; own (don't hotlink) markdown images.
- **DOM:** `/` ≤1500 nodes; marquee cap ≤8 items with **exactly one** interactive copy
  (`aria-hidden`+`inert` clone); **one** root Tooltip provider.
- **Contrast:** text ≥4.5:1, UI ≥3:1, both schemes, computed gate in CI.
- **GPU:** ≤1 `backdrop-filter` surface with opaque `@supports` fallback; no continuous
  animation over card lists; never animate layout properties.

---

## 7. VERIFICATION GATES (plan agent owns sequencing)

- **Wave 0 (before any restyle):** fix `pnpm lint` red (react-hooks conflict); capture
  `pnpm analyze` baseline; add bundle-byte threshold gate; add axe + Lighthouse CI; extend
  existing e2e specs (R8.2).
- **Gates:** `pnpm build`, typecheck, lint, prettier, jest, storybook smoke, playwright (chromium),
  axe (light+dark), contrast gate, bundle budget, reduced-motion, keyboard nav.
- **Evidence ledger** per AGENTS R8.1 / R19.3 in `.omo/evidence/`; boulder per R1.2/R1.5.
- Extend existing specs: `interactions` (focus/keyboard), `dark-mode` (contrast per scheme),
  `responsive` (overflow/touch targets), `contact` (aria wiring) — **not** parallel suites.
- Any content change updates `e2e/static-routes.spec.ts:44-46` and
  `e2e/dynamic-content.spec.ts:27,49,62,86` in the same PR.

---

## 8. OPEN DECISIONS (require Tom / user)

1. **Scope tier:** full program vs "restyle-first MVP" (recommended: MVP, then content waves).
2. Does the marquee survive at all, and at what featured count?
3. Add the second serif (Newsreader) or go Inter-only carved?
4. Keep terracotta, or single-accent `#2563eb` only?
5. New `/work` case-study route vs featured flag inside `/projects`?
6. Does LAYZR get a case study, and with what **cleared** metrics?
7. Cheesecake post: archive vs delete (changes e2e post count)?
8. Testimonial at launch vs deferred empty slot?
9. Tag pages `/tags/[tag]` vs query filter on `/projects`?
10. **Content authoring commitment + timeline** (the human gate).
11. Flowbite: targeted replacement vs full removal.
12. Theme key: keep `flowbite-theme-mode` vs rename with read-migration fallback.

---

## 9. RECOMMENDED PHASING (input only — plan agent finalizes)

1. **Wave 0 — Hygiene & measurement:** CI green, baselines, budget + a11y harness.
2. **Wave 1 — Foundation, no visual change:** FOUC/theme fix; dead-token + drift fixes;
   dead OTel/README cleanup; schema additive fields + re-add `tags`; fix `Tooltip` Provider.
3. **Wave 2 — Expressive layer:** tokens + DESIGN.md; type; palette (contrast-gated); one motif;
   measure system.
4. **Wave 3 — Page rebuild:** home (type-led hero, curated featured set, founder arc), projects
   archive, blog, case-study template, About.
5. **Wave 4 — Imagery + SEO:** image pipeline, project/case-study imagery, 1200×630 OG,
   `/contact` metadata split.
6. **Wave 5 — Content waves (human-gated):** positioning, 3 case studies, 2 posts, legal pages.
7. **Wave 6 — Verification:** axe light+dark, keyboard, reduced-motion, visual checks,
   bundle budget, full e2e.

---

## 10. PROVENANCE

Adversarial inputs: `critic-legacy-round2.md`, `critic-roma-round2.md`, `critic-tech-round2.md`,
`critic-content-round2.md`, `critic-perf-round2.md`; final positions:
`critic-*-round3.md`. All in `.omo/notepads/hyperplan-2026-refresh/`.
Lead distilled; the plan agent owns the executable work plan.
