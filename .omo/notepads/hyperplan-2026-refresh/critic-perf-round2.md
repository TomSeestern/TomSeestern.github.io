# critic-perf — Round 2 cross-attack

Scope: attack the other four critics' Round-1 findings. Not defending my own (Round 3).
Lens: quantify the perf/a11y cost each rival hides, catch factual errors against repo
state, and flag contradictions between critics.

Repo baseline used for all numbers:
- 24 content files: 3 blog, 21 projects (`content/blog`, `content/projects`)
- Home marquee renders the full project list **twice** — `app/page.tsx:112-141`
- Hero image 31KB WebP, no `priority` — `app/page.tsx:87-93`; source JPG was 436KB
- One font family only: Inter via `next/font/google`, latin subset, `display:swap` — `app/layout.tsx:8`
- `darkMode:"class"`; `<html>` hardcodes `dark`; theme script inside `<body>` — `app/layout.tsx:35,48-69`
- Tailwind v3 + `@tailwindcss/typography`; semantic tokens + `-dark` pairs in `tailwind.config.js`
- `tsconfig.json` target **es5** (confirmed)
- `next-themes`, `framer-motion`, `@axe-core/playwright` are **not installed** (confirmed)
- Per-page `openGraph` metadata exists on all 7 route files (confirmed)
- `placehold.co` **is** rendered — `app/about/page.tsx:113`
- `images.remotePatterns` allows flowbite.s3 + placehold.co — `next.config.mjs:33-36`
- CSP is `Content-Security-Policy-Report-Only` with `script-src 'self' 'unsafe-inline'` — `next.config.mjs:27`
- No bundle/a11y threshold in CI — `.forgejo/workflows/nextjs_bundle_analysis.yml:43-55`

---

## P-R — Attacking critic-roma (Rome concept)

### P-R1 — Three font families quadruple the font payload and re-open LCP. **[critical]**
Proposal: Fraunces/GT Sectra + Inter + Plex/JetBrains Mono.
- (a) Factual: **GT Sectra is a paid Grilli Type font**, not freely licensable. Neither it nor
  Fraunces is installed; both need self-hosting + license. This is a legal/cost item the
  design critic never priced.
- (d) Cost: current font cost is one Inter latin subset (~20-30KB woff2, `app/layout.tsx:8`).
  Adding two more families with multiple weights pushes 120-200KB extra woff2. Fonts are on
  the critical path for text LCP; `display:swap` trades FOUT for layout-wobble. No font
  budget was stated.
- Budget/requirement: total woff2 <= 100KB; <= 2 families; preload only the LCP font; use
  `next/font` `adjustFontFallback` to fix CLS; subset latin. If the display face is Latin/
  editorial only, restrict it to headings (variable, one weight) and drop the mono entirely
  (code blocks already use a system stack).

### P-R2 — "Procedural marble" + "cage-cup glass" is a GPU trap on mobile. **[critical]**
- (a) Feasibility: "procedural marble" implies canvas/WebGL/noise at runtime (a build-time
  texture would be a static asset, contradicting "procedural").
- (d) Cost: `backdrop-filter: blur()` is one of the most expensive compositing ops on
  low-tier Android; over scrolling content it forces per-frame readback and can fall off the
  GPU fast path. Combine it with the existing marquee transform (`app/page.tsx:111,127`) and
  an "oculus single light" radial gradient and you saturate fill-rate -> dropped frames,
  TBT/INP blowout, battery drain. The critic proposes the effect but no `@supports` fallback
  and no surface count.
- Prevention: at most **one** fixed blurred surface, `@supports (backdrop-filter: blur(1px))`
  with an opaque fallback, disable under `prefers-reduced-transparency`, and never blur over
  the 42-card marquee.

### P-R3 — 600-900ms clip-path "gravitas" is not compositor-safe and delays feedback. **[high]**
- (a) Factual: clip-path animation is not reliably GPU-composited (WebKit repaints large
  clip regions on the main thread), so a 900ms clip reveal on a full-bleed section is a
  long-task generator. 900ms also exceeds the ~200ms INP responsiveness signal as a visible
  interaction delay.
- (e) Missed: no `prefers-reduced-motion` gate is stated for the "gravitas" motion, and the
  repo already had to add `motion-reduce:animate-none` to the marquee (learnings Task 22)
  precisely because this class of bug recurs.
- Prevention: animate `transform`/`opacity` where possible; cap interaction feedback <=300ms;
  gate every clip-path under `motion-safe:` and provide an instant-reduced path; no animated
  snapshots in tests (R7.6/R7.9).

### P-R4 — The anti-cliche list is itself the cliche stack, and it contradicts two peers. **[medium]**
- (c) Overreach: rejecting Cinzel/Trajan while proposing arches, columns->grid, oculus,
  Tyrian purple, cage-cup glass, and "gravitas" replaces one template (Flowbite) with a
  louder one (HBO-Rome). That directly contradicts critic-legacy's "agency-grade, not
  template" goal, and it contradicts critic-content's "Developer turned Entrepreneur"
  framing — civic-infrastructure Rome is not founder-operator positioning.
- Prevention: the concept must survive a "does this read as a 2026 startup or a themed
  tumblr" test before tokens land.

### P-R5 — Palette has no contrast budget; several proposed pairings fail AA. **[high]**
- (e) Missed: six new colors + texture with zero contrast verification. Terracotta #B4462F
  on a dark basalt ground is roughly 3:1 — fails 4.5:1 for body text; Tyrian purple #5B2A4A
  and verdigris #4E7A6B are both dark-on-dark risks; muted brass on basalt is borderline.
  The "Vitruvian triad" claim (firmitas/utilitas/venustas) has no accessibility leg.
- Requirement: every fg/bg pair asserted >=4.5:1 text / >=3:1 UI in light **and** dark, checked
  by axe in CI; a palette without measured contrast is not a design system.

---

## P-L — Attacking critic-legacy (design)

### P-L1 — Every claimed "no per-page OG" is false against the repo. **[high]**
- (a) Factual: `openGraph` is defined in all seven route files —
  `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/blog/page.tsx`,
  `app/projects/page.tsx`, `app/blog/entry/[slug]/page.tsx`,
  `app/projects/entry/[slug]/page.tsx` (confirmed by grep). The critique's OG claim is stale;
  what is actually weak is that every OG image is the **same square 512x512 PNG**
  (`/img/logo.png`, 80KB), which crops under `summary_large_image`. That is the real finding,
  and it is not what was written.
- (b) Contradiction: this is the same class of stale claim the audit-remediation plan exists
  to kill ("stale or unverifiable claims become dispositions instead of speculative edits",
  `.omo/plans/2026-audit-remediation.md:4`). A design critic repeating stale claims undermines
  the whole remediation.

### P-L2 — "Project cards text-only" is true, but the implied fix is a perf landmine. **[high]**
- (a) Factual: correct that `imageUrl` is declared and unused (`ProjectTeaser.tsx:19-26,
  28-35`), and the homepage even passes `fullArticleLink` as `imageUrl` (`app/page.tsx:117`).
- (d) Cost: the implied remedy — put imagery in every card — multiplies with the duplicated
  marquee to **up to 42 image loads** on `/`. That collides head-on with critic-legacy's own
  "marquee antipattern" critique and with my P1. It also collides with critic-roma's
  "procedural marble" (decorative, data-free) — three critics asking for three different
  image strategies on the same 42 nodes.
- Prevention: decide one card-media policy. If images ship: cap marquee to <=8 items, lazy-load
  with explicit aspect-ratio, AVIF <=50KB each, `priority` never, and add `content-visibility`
  offscreen. An image strategy without a marquee cap is not a strategy.

### P-L3 — "Typography one-note / prose max-w-none" is a misread of the container. **[medium]**
- (a) Factual: `prose max-w-none` in `app/blog/entry/[slug]/page.tsx:39` is wrapped in
  `mx-auto flex min-h-screen max-w-3xl` (line 38). The width is already constrained; removing
  `max-w-none` would double-constrain and shorten measure. The claim treats a deliberate
  override as a defect.
- (c) Overreach: "uniform whitespace" ignores the documented spacing contract in `DESIGN.md`
  section 4 (`py-8 sm:py-16 lg:py-24`, `mx-auto max-w-screen-xl px-4 sm:px-6`). That is a taste
  assertion dressed as a finding.

### P-L4 — The real form-a11y defects are named nowhere. **[high]**
- (e) Missed: the critique says "form a11y gaps" without listing them. The concrete ones:
  contact error `<p>` elements have ids `#name-error`/`#email-error`/`#message-error`
  (`app/contact/page.tsx:87-91,108-112,129-133`) but inputs never reference them via
  `aria-describedby`; there is no `aria-invalid`; and the failure `Alert` (line 66) is not
  focused nor `role="alert"`-announced on submit. Touch-target "fixes" that restyle Flowbite
  internals via CSS overrides are fragile — restyle causes library-specificity fights and can
  break focus traps.
- Prevention: own the controls at >=44x44 with visible focus; wire `aria-describedby` +
  `aria-invalid` + live-region error; do not rewrite library internals with CSS.

### P-L5 — Story/narrative rewrite is critic-content's lane and sequences before architecture. **[medium]**
- (c)/(d): "No narrative arc; about = flat timeline" duplicates critic-content's brief and
  front-loads prose work before the unresolved deployment-model fork (critic-tech's
  `output:'export'` vs Vercel image optimizer). If the redesign later switches the image model,
  all image-bearing narrative work is redone.

---

## P-T — Attacking critic-tech (Next.js architecture)

### P-T1 — "Kill Flowbite" understates replacement cost by an order of magnitude. **[critical]**
- (a) Feasibility: Flowbite-react is used for **stateful, ARIA-bearing** primitives —
  `Navbar`/`NavbarToggle`/`NavbarCollapse` (`Header.tsx:19,40,42`), `DarkThemeToggle`
  (`Header.tsx:39`), `Alert` with `onDismiss` (`app/contact/page.tsx:2,52,66`), `Card`,
  `Breadcrumb` (`app/blog/entry/[slug]/page.tsx:1,28-35`). Radix supplies **none** of
  Navbar/Alert/Breadcrumb — the 16 installed packages are Dialog, Dropdown, Popover, Tabs,
  etc. So "build on Radix already installed" does not cover the components that actually
  carry behavior. Mobile-nav focus management, alert dismissal, and scroll behavior must be
  hand-written and re-tested.
- (d) Cost: this is a multi-wave effort, not a cleanup item. A different critic's job.
- (b) Contradiction: it also contradicts "Keep static build / 8-wave order" — the migration
  risk sits exactly on the critical path of every other critic's design work.

### P-T2 — `next-themes` "fixes FOUC" while preserving the exact CSP problem it implies. **[high]**
- (a) Factual: `next-themes` is **not installed** (confirmed), so "replaces inline script" is
  a new dependency, not a swap. It injects its own pre-hydration inline script — the forcing
  function at `app/layout.tsx:48-69` does not disappear.
- (b) Contradiction: this sits against the critique's own CSP note. `next.config.mjs:27` is
  report-only with `'unsafe-inline'`; moving the theme script into `<head>` (my P8) or using
  next-themes both still require `'unsafe-inline'` unless a nonce/hash strategy is adopted —
  which is impossible for a statically exported site served from a CDN without per-request
  headers. The critique flags CSP but proposes a fix that does not improve it.

### P-T3 — LazyMotion trades bundle for INP on the worst possible page. **[high]**
- (a) Factual: `framer-motion` is not a dependency (confirmed). "LazyMotion for 3 surfaces"
  is therefore net-new weight: even the lazy `domAnimation` feature bundle is ~15-25KB gz,
  plus per-frame JS work.
- (d) Cost: adding frame-driven JS animation to `/` — the page that already renders the
  42-card marquee (`app/page.tsx:112-141`) — is the highest-INP-risk place to do it. "Skip
  route transitions" is correct but does not offset the marquee.
- (e) Missed: no bundle budget is stated. `tsconfig.json` target is **es5**, so a new motion
  lib + component library ships with downlevel helpers and larger, slower runtime. The
  critique flags es5 but never connects it to the redesign's added JS.

### P-T4 — "Radix already installed, 1 used" is a misleading inventory. **[medium]**
- (a) Factual: the one Radix usage is `components/Tooltip/Tooltip.tsx` — a competing
  implementation the learnings already mark as dead (Task 17: ProjectTeaser was expected on
  Flowbite Tooltip; local Radix Tooltip has no consumer). So the "1 used" is on the chopping
  block; the redesign starts from **zero** proven Radix usage, not "1".
- (e) Missed: the same file has dead classes (`font-open-sans`, `text-2xs`, `rounded-0.5md` —
  `Tooltip.tsx:5`, none defined in `tailwind.config.js`), i.e. a migration that "builds on
  Radix" inherits an untested, misconfigured component.

### P-T5 — The `output:'export'` fork is not resolved anywhere. **[critical]**
- (e) Missed: the critique says "keep static build" but never decides between Vercel's runtime
  image optimizer and a true `output:'export'` (README claims "static export"; `next.config.mjs`
  has no `output` field). If the redesign adds `output:'export'`, `next/image` optimization
  silently dies and every image ships unoptimized. This is the single highest-blast-radius
  technical decision in the refresh, and no critic has owned it.
- Also missed: the `/contact` "use client can't export metadata -> split" was already hit and
  documented in Task 33; the fix is a server page wrapping a client form. It is a known,
  small task — not an open risk — and should be sequenced as such.

---

## P-C — Attacking critic-content (content/IA)

### P-C1 — IA expansion multiplies LCP/CLS surfaces with no perf budget. **[critical]**
- (d) Cost: Services / Case Studies / Now / Press + Impressum/Datenschutz each become new
  static routes with their own LCP candidate and CLS surface; case-study pages with
  screenshots are exactly the per-card image weight critic-legacy wants, now at full-page
  scale. Next.js static TTFB stays fine, but LCP/CLS/INP budgets are per-route and no critic
  has allocated any. Critic-content proposes the largest scope increase of the four and
  prices none of it.
- Requirement: every new route gets a Lighthouse budget (LCP<2.5s, CLS<0.1, TBT<200ms) and a
  bundle ceiling (<=180KB gz) before it ships.

### P-C2 — The IA contradicts the repo's no-tracking architecture. **[high]**
- (b) Contradiction: "RSS not newsletter" is fine, but the surrounding "Press/Now/Services"
  IA implies audience instrumentation; AGENTS R15.11 forbids telemetry without explicit
  opt-in and the site has no cookies/analytics by design. "Now" is inherently dynamic — on a
  static site it becomes either a rebuild-bound MD file (fine) or a client fetch (new JS +
  the R15.5 four-state pattern). The proposal never chooses.
- (a) Legal: Impressum/Datenschutz is a real German requirement, but the Datenschutz text must
  disclose the Resend processor flow (the only server-side data path, `lib/sendEmail.tsx`),
  not a generic template. Shipping a generic one is worse than none.

### P-C3 — "tags unused" is a schema migration mislabeled as cleanup. **[medium]**
- (a) Factual: the Zod schema has **no `tags` field** — only `technologies` (projects only) —
  `lib/markdown.ts:6-13`. Adding tags means a schema change across 24 markdown files plus a
  new client-side filter UI (JS bundle). "No project->post links" likewise needs a relation
  field that does not exist. Both are functional changes, not copy edits.

### P-C4 — Deleting/relocating the cheesecake post is a human-gated content decision. **[medium]**
- (a) Factual: `2019-ebeltoft-cheesecake-recipe.md` is the **only** content file with a
  markdown image (`content/blog/...:21`) and is therefore the only live test case for the
  raw-`<img>` CLS defect. Removing it hides the bug rather than fixing it, and content changes
  are human-gated per repo rules. Critic-content treats owner content as agent cleanup.
- (e) Missed: "metrics" and "testimonials" on a portfolio with no live data risk fabrication
  — a brand/legal problem, not a content problem.

### P-C5 — "4-act narrative" and "Rome map" re-introduce scroll-driven animation. **[high]**
- (d) Cost: long-scroll narrative pages are the classic home of scroll-triggered effects —
  directly contradicting critic-tech's "CSS-first, skip route transitions" and my INP finding.
  A "Rome map" is an interactive SVG/canvas: keyboard access, pinch/zoom, and WCAG 2.5.7
  dragging + 1.4.13 content-on-hover must all be solved, plus it is new JS.
- Requirement: no scroll listener without IntersectionObserver + passive; map must be operable
  by keyboard, have a text alternative, and honor reduced motion.

---

## Quantified cost table (what the other critics did not price)

| Proposal | Hidden cost | Budget / guard |
| --- | --- | --- |
| Roma: 3 font families incl. paid GT Sectra | +120-200KB woff2; license fee; LCP on text path | <=100KB total woff2; <=2 families; preload LCP font; fallback metric adjust |
| Roma: procedural marble + cage-cup glass | `backdrop-filter` per-frame readback; GPU fallback on mid Android | <=1 fixed blurred surface; `@supports` opaque fallback; disable reduced-transparency |
| Roma: 600-900ms clip-path | non-composited repaint = long task; delayed feedback | <=300ms feedback; `motion-safe` gate; reduced-motion instant path |
| Legacy: image every project card | x2 marquee -> up to 42 image loads on `/` | cap marquee <=8; lazy + aspect-ratio; AVIF <=50KB; no priority |
| Tech: kill Flowbite | re-implement Navbar/Alert/DarkToggle ARIA + focus | weeks of work; behind axe + keyboard e2e, not a wave |
| Tech: LazyMotion on `/` | +15-25KB gz + frame JS on highest-INP page | TBT<200ms; bundle budget; es5 target makes it worse |
| Content: 5+ new routes, case studies | new per-route LCP/CLS surfaces + full-page images | per-route Lighthouse + <=180KB gz before ship |
| Content: Rome map | interactive JS; dragging/zoom a11y | keyboard-operable, text alternative, reduced motion |

---

## Cross-cutting agreements (where I agree with a rival)

1. **The marquee must die.** I (P1/P2) agree with critic-legacy ("auto-scrolling marquee
   antipattern + duplicates /projects") and critic-tech ("Marquee 2x21 cards,
   `app/page.tsx:110-141`"). Three independent critics converging on the same node is the
   strongest signal in Round 1: rebuild it as a capped, inert-clone, reduced-motion-safe
   component — not a duplicated full list.
2. **Theme resolution must happen pre-paint and the a11y gate must be automated.** I (P8/P13)
   agree with critic-tech on `app/layout.tsx:35,48-69` and on adding axe-core + contrast AA +
   reduced-motion tests with no animated snapshots. Also agree with critic-legacy on >=44px
   touch targets — the disagreement is only on *how* to fix them (own the control, don't
   restyle library internals).

## Bottom line for the lead
The design critics are asking for more fonts, more glass, more motion, and more pages; the
architecture critic is asking to rip out the component layer; the content critic is asking to
multiply routes. **No one has attached a byte, millisecond, or contrast ratio to any of it.**
Any refresh that lands before (1) the `output:'export'` decision, (2) a written font/image/
bundle budget, and (3) CI-enforced axe + bundle thresholds will ship a slower, less
accessible site than the one it replaces.
