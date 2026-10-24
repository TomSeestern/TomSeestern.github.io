# critic-tech — Round 2 cross-attack

Scope: ruthlessly attack the four rival critique theses. No self-defense (Round 3). Each rival gets ≥3 attacks (a–e). Severity tagged. Evidence cited to repo.

Repo facts established for this round:
- `components/Tooltip/Tooltip.tsx` IS used by `components/ProjectTeaser/ProjectTeaser.tsx:3`; it wraps **each instance** in its own `<RadixTooltip.Provider>` (`Tooltip.tsx:28`). critic-perf is right about this.
- `lib/markdown.ts` schema has **no** project-image field; every project's only image is `authorImgSrc: /img/logo.png` (e.g. `content/projects/2021-skinshark-nft-minecraft-skin-trading.md:7`).
- Frontmatter carries `tags:` but the Zod schema drops them (`lib/markdown.ts`).
- `public/img/logo.png` = 81,810 bytes (perf's "80KB" accurate).
- Only font wired: Inter via `next/font/google` (`app/layout.tsx:6`).

---

## Attack on critic-legacy (design)

**T-L1 — [high] [a: factual error]** "No per-page OG" is false at the level claimed. Per-page metadata + OG was already shipped for `/`, `/projects`, `/blog`, `/about`, and both detail routes via `generateMetadata` (`.omo/notepads/2026-portfolio-overhaul/learnings.md`, Task 33; `app/page.tsx:15-33`). The only gap is `/contact`, and that gap is structural: it is a `"use client"` page (`app/contact/page.tsx:1`) which Next forbids from exporting metadata. Presenting a one-page structural constraint as a systemic "no per-page OG" absence misdirects the fix and inflates the workstream.

**T-L2 — [critical] [d: underestimated cost + hidden dependency]** "Project cards text-only (imageUrl declared but never rendered)" is true but the proposed remedy (render images) has a buried dependency the critic did not price. `imageUrl` is fed `article.fullArticleLink` (`app/page.tsx:117,128`) — a route string, not an image. The markdown schema (`lib/markdown.ts`) has no image field, and every project's only image asset is `authorImgSrc: /img/logo.png`. Rendering real project imagery = 21 new images that do not exist + a schema field + Zod tests + human authoring/curation. This is the single largest hidden cost in the design thesis.

**T-L3 — [high] [c: overreach / scope creep]** The thesis fuses five distinct workstreams under one "design" heading: brand/design, accessibility (touch targets, form gaps), SEO (per-page OG), content hygiene (`thier` typo, stale dates, hardcoded "Tutorial"), and visual polish. One owner cannot execute five streams with one Definition of Done, and no ordering/dependency is given. Violates single-concern planning and will stall.

**T-L4 — [medium] [e: missed that undermines thesis]** "Zero brand identity / generic template" ignores that the repo already ships a semantic token system, a typography scale, and a `DESIGN.md` from the prior overhaul (`tailwind.config.js` `fontSize`/`colors`; `DESIGN.md`). The real gap is the **expressive/brand layer**, not the absence of a system. Framing it as zero risks discarding existing tokens and redoing a migration already completed (Task 18/19).

---

## Attack on critic-roma (Rome concept)

**T-R1 — [critical] [a: technical infeasibility + d: hidden dependency]** "Procedural marble not PNG" is hostile to this stack. Inline SVG `feTurbulence` marble has no compositor fast path — it is a paint-heavy filter that runs every frame/scroll and directly attacks INP/paint, on a site whose rival (critic-perf) is arguing for an INP budget. It also cannot be cached as an asset and there is no build-time generation pipeline. Compounding it: there is **no art pipeline at all** — 21 project entries have zero real imagery. "Procedural" here hides an art-direction + asset-production dependency that is not code.

**T-R2 — [critical] [b: contradiction with perf / c: overreach]** "Motion gravitas 600–900ms clip-path" is mutually exclusive with critic-perf's INP/TBT thesis and with R15.7. `clip-path` is not `transform`/`opacity`: it forces paint per frame and cannot be purely composited. Long 900ms reveals on route/section entry block the main thread precisely where a budget is demanded. Neither critic acknowledges the collision; a plan cannot adopt both theses unchanged.

**T-R3 — [high] [a: hidden dependency / factual]** The type plan names **GT Sectra**, a commercial licensed typeface not present in `package.json` (only Inter via `next/font`, `app/layout.tsx:6`). Recommending a paid font without license/procurement cost is an unpriced dependency. Fraunces is SIL-open; GT Sectra is not free. The plan also gives no fallback/loading strategy for a display face (FOUT/CLS).

**T-R4 — [high] [a + c]** Palette values likely fail WCAG AA (R15.2): terracotta `#B4462F` on white ≈ 3.5:1 and verdigris `#4E7A6B` ≈ 4.0:1, both under the 4.5:1 text threshold; Tyrian `#5B2A4A` works as a surface but not as text on travertine. No contrast gate is proposed. Separately, "Latin labels sparing" is a gimmick that fights R15.10 microcopy consistency on a German site and is untestable — it adds atmosphere, not value.

---

## Attack on critic-content (content/IA)

**T-C1 — [critical] [c: scope creep + d: hidden dependency / R19.1]** Proposes Services, Case Studies, Now, Press + testimonials + metrics + a case-study template. Metrics and testimonials for a solo founder do not exist and **cannot be authored by an agent without fabricating claims** (R19.1 no claim without verifiable citation). This is Tom-authored, human-approved content across ≥4 new routes. No owner, no estimate. The repo already has human-approval gates as precedent (learnings Tasks 13/14/15: "Tom approved"). This is the gating dependency for half the IA.

**T-C2 — [high] [a: factual error]** "content/projects/ stops 2021" is used to argue the founder era is missing, but it conflates collections: blog has a 2024 post (`content/blog/2024-homelab-v2-transforming-homelab-with-advanced-automation.md`). The founder-era gap is real; the "content stops 2021" framing is inaccurate and would misdirect the content audit.

**T-C3 — [high] [b: contradiction + d]** The Roman-monument IA (Forum/Via Appia/Legions/Colosseum/Triumph/Tabularium) breaks R15.13 (URLs must be human-readable, shareable, stable) and SEO intent (`/forum` loses "projects" semantics). It also renames routes that 32 e2e assertions and `app/sitemap.ts` hardcode — `e2e/home.spec.ts`, `e2e/dynamic-content.spec.ts`, `e2e/responsive.spec.ts` all depend on `/blog` and `/projects`. Renaming = redirect layer + full e2e rewrite. It also contradicts critic-roma's own anti-cliché list.

**T-C4 — [medium] [e: missed]** "RSS not newsletter" is under-scoped: RSS needs a new `app/feed.xml/route.ts` generated from `getAllMarkdownEntries`, plus content negotiation — real code. German Impressum/Datenschutz need Tom's legal/address data and a template route, not a design tweak. And "tags unused" is diagnosed as a content gap when the real cause is a schema bug: frontmatter has `tags:` but `lib/markdown.ts` drops it. Fix location is code, not content.

---

## Attack on critic-perf (perf/a11y)

**T-P1 — [medium] [a: factual imprecision]** "next/image no AVIF/formats/TTL" overstates. Next defaults to `formats: ['image/webp']` and has a default `minimumCacheTTL`; AVIF is opt-in and the TTL is **short, not absent**. The actionable change is `formats: ['image/avif','image/webp']` + raising `minimumCacheTTL`, not "add caching". Stating it as a total absence produces the wrong fix ticket.

**T-P2 — [high] [c: overreach, sets plan up to fail]** "No enforced INP budget in CI" — INP is a **field** metric requiring real-user data. RUM is forbidden by R15.11 (no telemetry) and this is a static Vercel site. CI can enforce a **lab proxy** (Lighthouse TBT / bundle bytes) but cannot enforce INP. Demanding a gate that is structurally unimplementable guarantees a red check the plan cannot satisfy.

**T-P3 — [medium] [c: overreach / low signal]** "Dead assets 436KB" is a one-time `rm` task, not a systemic performance finding, and is unverifiable without the asset inventory the critic did not publish. Padding a perf thesis with a cleanup item dilutes the real signal (marquee, LCP, third-party image CLS).

**T-P4 — [high] [e: missed + b: contradiction]** The thesis never reconciles with critic-legacy/roma's demand for richer micro-interactions and cinematic motion — its own note that "more complex interactions" is the top INP risk is **exactly what the design critics request**. It also stops short of turning two correct observations into a plan: the theme flash (hardcoded `dark` at `app/layout.tsx:35` + inline script at lines 37-69) has a known fix path, and the per-icon `RadixTooltip.Provider` (`components/Tooltip/Tooltip.tsx:28`) should lift to a single app-level Provider as a component-plan item, not just a flag.

---

## Two cross-cutting themes where I AGREE with rivals

1. **The marquee is a genuine defect.** critic-legacy (duplicates `/projects`), critic-perf (42 cards → INP/TBT; cloned content keyboard/SR-reachable, WCAG 2.4.3), and critic-content (redundant with the listing) converge on the same surface and the same evidence (`app/page.tsx:110-141`). This is the highest-ROI, lowest-risk fix and should be first.

2. **The site has outgrown the generic-template baseline and needs a distinct expression layer plus honest content.** critic-legacy (generic identity), critic-roma (distinctive type/palette), and critic-content (positioning/founder story) agree, and the precondition is real: assets and authored copy that do not exist yet. All three under-price that precondition; none of the four critics estimates it.

---

## Cross-cutting verdict on scope achievability (the thing all four miss)

Combined scope across the four theses: bespoke visual language + art assets + commercial fonts + a slow-motion system + 4+ new IA routes + case-study template + founder-era/metrics/testimonial authoring + German legal pages + SEO + a11y + perf overhaul + CI gates.

Hard dependencies in **this** codebase that gate execution:
1. **Tom-authored/approved content** — precedent human gates (learnings Tasks 13/14/15). Blocks Services/Case Studies/Now/Press and founder narrative.
2. **Imagery for 21 projects does not exist** — blocks any card-image redesign (T-L2, T-R1).
3. **Font licensing** if GT Sectra or any commercial face is chosen (T-R3).
4. **Contrast validation** of any new palette (T-R4, R15.2).
5. **CI is currently red** — `pnpm lint` exits 1 from a pre-existing `react-hooks` plugin conflict (`.eslintrc.js` loads both `eslint-config-react-app` and `eslint-config-next`), and there is no bundle/INP gate (`.forgejo/workflows/nextjs_bundle_analysis.yml` uploads JSON only).

This is a multi-phase program (≥5–8 waves), not a "restyle". The plan must phase it and cut scope to a defensible MVP (marquee fix + de-Flowbite + next-themes + one expressive layer + honest content for existing entries) before touching new IA. Any single-wave plan will stall at the content/asset gate.
