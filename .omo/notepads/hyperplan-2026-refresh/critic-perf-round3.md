# critic-perf — Round 3: defend / refine / concede

Verification done before answering (file:line):
- `.omo/plans/2026-audit-remediation.md:229` DOES name `@axe-core/playwright` as an acceptance
  criterion -> attack 2's "cites no plan file" is false.
- `openGraph` appears in **7** route files (grep) -> attack 12's ">=4 files" understates it.
- `app/page.tsx` contains `projects.map` **twice** -> attack 13's framing stands.
- No `aria-describedby` / `aria-invalid` anywhere in `app/contact/page.tsx` -> legacy found it
  first (attack 16 conceded).
- e2e surface present: `contact.spec.ts`, `dark-mode.spec.ts`, `dynamic-content.spec.ts`,
  `home.spec.ts`, `interactions.spec.ts`, `responsive.spec.ts`, `static-routes.spec.ts`.

---

## Attack-by-attack

### 1. [legacy L-D1] WCAG criterion + transform cost. **CONCEDE + upgrade.**
Legacy is right and I under-claimed. Replacing my 2.4.3 cite with:
- **WCAG 2.2.2 (Pause, Stop, Hide)** is the *stronger* finding: the marquee is a >5s
  auto-scrolling animation running in parallel with content, and there is **no pause/stop/hide
  control** — `motion-reduce:animate-none` (`app/page.tsx:111,127`) satisfies 2.3.3, *not* 2.2.2.
  A keyboard/mouse user who cannot use reduced-motion has no way to stop it. This is a real AA
  failure I missed.
- **WCAG 1.3.1 / focus duplication**: the clone is a second copy of 21 focusable `<Link>`s.
- Mechanism correction accepted: `transform: translateX` is compositor-only, so the animation
  itself is cheap. The cost is **DOM + hydration + providers + duplicate tab stops**, not the
  transform. My P1 should have separated these; it didn't.

### 2. [legacy L-D2] framer-motion "contradiction" + axe plan. **DEFEND.**
- `.omo/plans/2026-audit-remediation.md:229` literally reads: "Playwright a11y audit with
  `@axe-core/playwright`". The plan exists and promises it. Attack false.
- Critiquing tech's framer-motion proposal is the assignment, not a contradiction. Round 1's
  position is internally consistent: *if* JS motion ships, it must be lazy, reduced-motion
  gated, and inside the JS budget. The tension legacy senses is real and is item 8.

### 3. [legacy L-D3 / roma R-P3] Hero LCP. **CONCEDE + REFINE.**
Correct: the hero is `hidden ... xl:block` (`app/page.tsx:86`), so mobile/tablet never renders
it and a blanket `priority` would emit a preload for an image mobile doesn't show — wasted
bytes and a *worse* mobile LCP. Revised fix: do **not** use blanket `priority`. Either
(a) render the image instance only at xl+ (conditional/picture so it is absent from mobile
HTML), then `priority` is safe, or (b) leave it unprioritized. Mobile LCP is the h1 text and
is already good. Scoped, not blanket.

### 4. [legacy L-D4] Dead assets. **CONCEDE (partly).**
`project-logo.png` is at repo root, never in `public/`, never served -> not runtime, only repo
hygiene. `Tom_Segbers_Frontal.jpg` is in `public/` so it *is* deployed and publicly fetchable
even if unreferenced -> deploy-size/accidental-hotlink concern, still not page-load weight.
Demote: hygiene/deploy, not a runtime perf finding.

### 5. [legacy L-D5] remotePatterns + markdown images. **CONCEDE.**
Correct and important. `next.config.mjs:33-36` allowlists only flowbite.s3 and placehold.co;
`plantoeat.s3.amazonaws.com` (blog post line 21) is **not** allowlisted. Routing it through
`next/image` without a config change throws at render — so "just map img to Image" breaks the
site. Correct order: host the asset locally (preferred, also kills the 3p request) OR add the
host to `remotePatterns` **first**, then change the mapping. My P4 stated the direction; it
understated the failure mode and the ordering constraint.

### 6. [tech T-P1] Next image defaults. **CONCEDE (wording).**
Precise statement: Next defaults to `formats: ['image/webp']` and a short `minimumCacheTTL`
(60s default) — not "total absence". The finding survives as "defaults are suboptimal for a
static portfolio": webp-only (no AVIF) and a 60s TTL cause repeat optimizer work for unchanged
images. Rephrase from "no formats/TTL" -> "non-portfolio-tuned defaults".

### 7. [tech T-P2 / content C-P4] INP gate is unimplementable. **CONCEDE (structural).**
This is the best attack in the round. INP is a **field** metric; it needs real interactions and
real users. RUM is forbidden (AGENTS R15.11, no cookies/analytics), and the site is static, so
there is no collection path. A CI "INP gate" cannot exist. Revised budget set uses **lab
proxies only**: TBT (Lighthouse) for main-thread blocking, plus bundle bytes. I will never
again write "INP < 200ms" as a gate; I will write "TBT < 200ms (lab proxy), no RUM available".

### 8. [tech T-P4 / content C-P2] Motion demand not reconciled. **CONCEDE.**
Legacy/tech/roma want motion; I gate it behind `prefers-reduced-motion`. Nobody reconciled the
tension: a reduced-motion test asserting `animation: none` would neutralize Rome's signature
motif for those users. Resolution: **motion is progressive enhancement, never the carrier of
meaning.** Rome's identity must survive with motion off (type, grid, color, contrast, the
"oculus" as a static gradient). If the design is unrecognizable under reduced-motion, the
design is wrong — not the accessibility requirement. This becomes an explicit design constraint,
not a test afterthought.

### 9. [content C-P1] Content vs perf framing. **CONCEDE (framing).**
Fair. Curation to 3-5 featured projects is a content/design decision and is also the cheapest
way to shrink the perf surface. Reframe: content chooses the featured set; perf sets the ceiling
the page must live within (DOM node cap, image caps, bundle cap). Both are needed; perf doesn't
get to mandate curation.

### 10. [content C-P3] Cheesecake deletion. **CONCEDE (fact) + REFINE.**
Factually yes: deleting the post removes 100% of *current* CLS exposure from markdown images.
But the defect is systemic — the `ReactMarkdown` component has no `img` mapping
(`app/blog/entry/[slug]/page.tsx:41` only overrides `h1`). The next image-bearing post (very
likely a case study with screenshots) reintroduces it, and at larger scale. Deleting content
hides the bug; the mapping fix is independent and required. Concede the "current exposure"
point, defend the systemic fix.

### 11. [content C-P5] logo/OG is partly brand. **CONCEDE (scope split).**
Split ownership: perf owns the *constraint* (header mark as SVG or <=5KB; OG 1200x630 <=150KB);
brand/content owns *creating* the 1200x630 asset and any narrative. I should not have implied
the whole OG finding was a sizing bug.

### 12. [roma R-P1] Logo under-scoped / OG reused across >=4 files. **REFINE + strengthen.**
The OG asset is the bigger half, and the real number is **7** route files, not 4 —
`app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/blog/page.tsx`,
`app/projects/page.tsx`, `app/blog/entry/[slug]/page.tsx`,
`app/projects/entry/[slug]/page.tsx` all reference `/img/logo.png` (512x512, 80KB). One wrong
square asset propagates to every social card. Elevate it to the primary image finding; header
logo becomes secondary.

### 13. [roma R-P2] Culprit is the per-icon Provider, not "42 cards". **CONCEDE + quantify.**
Both are real but they are different costs. Quantified: `ProjectTeaser` wraps **every** tech
icon in `Tooltip` (`ProjectTeaser.tsx:57-70`), and each `Tooltip` creates its own
`RadixTooltip.Provider` (`Tooltip.tsx:29`). With 2 copies of 21 projects and ~4 techs each,
that is on the order of **~168 Provider instances** on `/`. The "42 cards" is the DOM cost;
the Provider-per-icon is the hydration/context cost. Fix = one root Provider + remove
per-instance Provider; then the card count is capped separately.

### 14. [roma R-P4] Theme-flash root cause. **CONCEDE.**
Correct: the inline script is synchronous and runs during parse, before the post-script body
content paints, so "script inside body" is a robustness/ordering nit, not the definite bug. The
definite bug is the hardcoded `dark` class on `<html>` (`app/layout.tsx:35`) creating a dark
first paint for light-preference users (and, if the script's `catch{}` swallows an error, dark
persists permanently). Restate root cause accordingly; moving the script to `<head>` is a
hardening step, not the fix.

### 15. [roma R-P5] Sequencing. **CONCEDE.**
No sequence was given. Correct sequence: **Wave 0 = budgets + CI harness** (bundle analyzer
threshold, Lighthouse CI, axe) *before* any token/component restyle, otherwise the budgets
cannot be enforced against the redesign they are meant to constrain.

### 16. [roma R-P6] Ignored existing e2e surface; aria gaps credit. **CONCEDE.**
R8.2 requires extending existing verification. The correct plan is to extend
`e2e/interactions.spec.ts` (focus/keyboard), `e2e/dark-mode.spec.ts` (contrast per scheme),
`e2e/responsive.spec.ts` (no overflow/touch targets), `e2e/contact.spec.ts`
(`aria-describedby`/`aria-invalid`/live-region), not create parallel suites. Credit: legacy
identified the contact aria gaps first; I only amplified.

---

## 1. FINAL defensible perf/a11y position (lab-measurable only)

1. No RUM exists (R15.11) and INP is a field metric — the program is **lab-only**. State this;
   never promise p75 field numbers.
2. LCP < 2.5s — Lighthouse mobile, 4x throttle, cold load, per public route.
3. CLS < 0.1 — Lighthouse lab.
4. TBT < 200ms — Lighthouse mobile (the lab proxy for INP; no field gate).
5. Fonts: <= 2 families, <= 100KB woff2 total, preload the LCP font only, metric-compatible
   fallback; GT Sectra requires a license or is rejected.
6. Images: shipped asset <= 200KB; hero <= 50KB; `formats: ['image/avif','image/webp']`;
   explicit width/height or aspect-ratio everywhere; lazy below fold; own, don't hotlink,
   markdown images (remote hosts must be allowlisted or the render throws).
7. JS: shared First-Load <= 130KB gz; per-route <= 180KB gz; no route +>10% vs a committed
   baseline. Any motion library is lazy and reduced-motion gated.
8. DOM: `/` <= 1500 nodes; marquee <= 8 items with exactly one interactive copy
   (`aria-hidden` + `inert` clone). One root Tooltip provider, no per-icon providers.
9. a11y: axe zero serious/critical on all public routes in light **and** dark; text >= 4.5:1,
   UI >= 3:1; every animated element has a WCAG 2.2.2 pause/stop/hide path (reduced-motion alone
   is not sufficient); keyboard e2e per new component.
10. GPU: <= 1 `backdrop-filter` surface with an opaque `@supports` fallback; no continuous
    animation over the card list; no animation of layout properties.
11. Enforcement order: budgets + CI harness land in **Wave 0**, before tokens/components.

## 2. ACCEPTED CONSTRAINTS (conceded)

- INP is not lab-gateable; use TBT as the proxy. No RUM is permitted on this site.
- `transform`-only marquee is compositor-cheap; the cost is DOM/hydration/providers/duplicate
  focus, not the animation.
- WCAG cite for the marquee is 2.2.2 (+1.3.1/focus), not 2.4.3.
- Hero `priority` must be scoped to xl+ or omitted; blanket priority wastes mobile bytes.
- Root-level dead assets are hygiene/deploy, not runtime page weight.
- Markdown-image optimization requires a `remotePatterns` change FIRST or it breaks the render.
- Next image defaults are webp + short TTL, not absent.
- Budgets must precede the restyle or they cannot be enforced.
- Extend existing e2e specs (R8.2); credit legacy for the contact aria gaps.
- Reduced-motion must not gut the design: motion is enhancement; identity must survive static.
- Brand/OG asset creation and narrative are not perf deliverables; perf supplies constraints.
- Content curation is a content decision; perf supplies the ceiling.

## 3. OPEN DECISIONS (need the lead/user)

- `output:'export'` vs Vercel runtime image optimizer — blocks all image budgeting.
- Does the marquee survive at all, and at what item count?
- Is any motion library (framer-motion) in scope? If yes: lazy + gated + budgeted, or rejected.
- Second font family choice, and is GT Sectra licensed (paid)?
- axe in CI per PR vs pre-push (Forgejo runner cost), and Lighthouse CI frequency.
- Accept lab-only verification given no RUM (we cannot prove field Core Web Vitals).
