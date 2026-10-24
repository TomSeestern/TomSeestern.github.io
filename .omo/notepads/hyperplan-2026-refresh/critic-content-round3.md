# critic-content — Round 3: Defend / Refine / Concede

Round 3, hyperplan-2026-refresh (runId 5dcf2c72-1200-45bb-946a-6b5c4f977faa).
Attacks from Round 2 against my Round-1 findings, addressed in order. Each verdict cites repo evidence.

## New evidence gathered this round
- `app/sitemap.ts:10-41` hard-codes `/`, `/about`, `/blog`, `/projects`, `/contact`; `:46-71` generates `/blog/entry/*` and `/projects/entry/*`. URL changes are costly.
- `e2e/dynamic-content.spec.ts:27,49` asserts **exactly 3** blog links; `:62,86` asserts **>=21** project links. Deleting/adding content breaks e2e counts.
- `e2e/static-routes.spec.ts:44-46` asserts exact H1 "Tom Segbers — Senior Developer" and H2s "My Recent Projects" / "My Recent Blog Posts". Copy changes break e2e.
- `e2e/static-routes.spec.ts:29-33` intercepts `placehold.co` — confirming it is live and deliberately tested.
- `lib/markdown.ts:6-13` schema lists title/articleDate/articleContent/authorImgSrc/authorName/technologies — **no `tags`**, so Zod `.parse` strips tags (they never reach `MarkdownEntry`).
- `content/blog/2024-homelab-...md` filename says 2024 but its `articleDate` is **2023-12-31**.
- `content/projects/` newest entry = **2021-12-31**; LAYZR appears only in `app/about/page.tsx:66-69`.

---

## 1. [roma R-C1 / legacy L-C3] Roman-metaphor IA is cliché; breaks URLs/SEO/sitemap/e2e
**REFINE (mostly CONCEDE).** The attack reads my Round-1 plan as renaming routes. It did not: my proposed nav was plain English — Work / Projects / Writing / About / Work-with-me — and I wrote "metaphor lives in section labels + chrome only. Body copy stays literal." I never proposed Latin URLs. **Concede the naming**: Forum/Via Appia/Legions/Colosseum must be dropped as *IA/nav* names entirely. Rome belongs to the visual layer (roma's scope), not to information architecture. New position: no route, no sitemap, no `sitemap.ts`, no e2e change for theme.

## 2. [roma R-C2] Legions=team/Layzr needs nonexistent content + consent
**CONCEDE.** LAYZR is real (`app/about/page.tsx:66-69`) but there is no case study, and there are zero metrics/testimonials. Any LAYZR content is human-gated and consent-gated. Do not build an IA section that presumes it; build a case-study *slot* that stays empty until cleared.

## 3. [roma R-C3] Newsletter contradicts no-tracking architecture
**DEFEND (strawman).** I explicitly did not propose a newsletter. Round 1 said: "Blog CTA: RSS (preferred) — NOT a newsletter if it needs third-party tracking, conflicts with R15.11." RSS is static, pull-based, no backend, no tracking. Concede only that even a subscribe UI should be a plain RSS link, no email capture.

## 4. [roma R-C4 / tech T-C1] 4-act + testimonials + case-study template is months-long, human-gated; metrics not fabricatable (R19.1)
**CONCEDE.** This is the strongest attack. I cannot make it a restyle task. Resolution = a minimum viable, human-gated content set (below), not a months-long program. Metrics only if true and cleared; otherwise outcome prose.

## 5. [roma R-C5 / legacy L-C1] Impressum/Datenschutz = P0 legal, plain/high-contrast
**CONCEDE, and note I already ranked it P0** (Round-1 finding 13). Refine: legal pages must be plain, high-contrast, Roman-motif-free, and include the Resend processor disclosure (see #11). Rome contrast (travertine/gold) must not touch them.

## 6. [roma R-C6] Agency sitemap imports empty pages
**REFINE.** Drop Now and Press entirely; do not create a standalone Services page. Keep: Work (case studies) / Projects (archive) / Writing / About / Contact + 2 legal. Fold "services" into About + Contact copy. Only the Work route is genuinely new; everything else is existing routes.

## 7. [legacy L-C2 / tech T-C2] "Founder era missing"/"stops 2021" inaccurate
**CONCEDE overstatement.** Precise finding: the **home** names a project (LAYzr, `app/page.tsx:53-59`) that has **no case-study entry**, and the newest **project entry** is 2021-12-31. LAYZR *is* on `/about` (`app/about/page.tsx:66-69`); the blog's newest *filename* is 2024 but its `articleDate` is 2023-12-31. Restate as "no post-2021 project case study and no LAYzr write-up," not "site ends in 2021."

## 8. [legacy L-C4 / tech T-C4 / perf P-C3] tags is dropped by schema, not merely unshown
**CONCEDE — sharper than my version.** `lib/markdown.ts:6-13` omits `tags`, so Zod strips it before `MarkdownEntry`. My "collected but never used" was imprecise: they are collected in frontmatter, dropped at parse. Fix = add `tags: z.array(z.string()).default([]).catch([])` (one line, matches the existing `.default()/.catch()` pattern at `:7-12`). **Refine**: filter/pages must be **server-rendered tag pages**, not a client filter, to avoid the JS-bundle cost tech/perf warn about.

## 9. [legacy L-C5] No migration plan for case-study schema; ignore image vacuum
**CONCEDE.** Migration plan: purely **additive optional fields** (`role`, `outcome`, `metrics[]`, `heroImage`, all with `.default()/.catch()` per `lib/markdown.ts:7-12`) → non-breaking, no content rewrite required to build. Image vacuum is real: `ProjectTeaser` declares/destructures `imageUrl` but never renders it (`ProjectTeaser.tsx:20,29`), and `app/page.tsx:117` passes a route path as `imageUrl`. Case-study hero images need a field + sourced assets, human-gated.

## 10. [perf P-C1] IA expansion multiplies LCP/CLS surfaces with no budget
**REFINE.** New IA is almost entirely **server-rendered static text** — no new JS, no new client islands. Cost is build-output pages + image weight, not INP. **Concede**: gate new routes behind a per-route budget and add e2e coverage; do not add routes faster than content exists (see #6).

## 11. [perf P-C2] Datenschutz must disclose the Resend processor flow
**CONCEDE.** Extends finding 13. The privacy page must name Resend as processor and describe the contact-form data flow (`lib/sendEmail.tsx`, server action → Resend API), matching env `RESEND_API_KEY` in `env.mjs`. Generic template is insufficient under GDPR.

## 12. [perf P-C4] Deleting cheesecake hides the only live raw-`<img>` CLS test case
**CONCEDE in part.** Content is human-gated. The recipe should not be the de-facto regression fixture. Two issues: (a) deleting it breaks `e2e/dynamic-content.spec.ts:27,49` (exactly 3 posts) — test must be updated; (b) if raw `<img>` handling matters, cover it with a deliberate fixture or a `react-markdown` component override, not a stray post. Prefer **archive/hide** the post over silent deletion.

## 13. [perf P-C5] 4-act/Rome map re-introduces scroll-driven animation
**DEFEND.** Narrative is not animation. A 4-act arc is four static semantic sections in document order — no scroll listeners, no scroll-jacking, no IntersectionObserver required. **Concede**: explicitly no scroll-driven or interactive motion; any motion stays inside roma's static budget and `prefers-reduced-motion`.

---

## FINAL DEFENSIBLE CONTENT / IA POSITION (<=15 lines)
1. Content is the critical path; design/tech/rome are the facade.
2. No URL, sitemap, or nav changes for the theme. Rome is visual only.
3. Routes stay: `/`, `/about`, `/projects`, `/blog`, `/contact`; add only Impressum, Datenschutz, and (optionally) tag pages — all server-rendered.
4. One positioning line replaces the generic hero; must be human-approved.
5. Founder arc = one static home section (4 beats) reused on About; no animation.
6. Case studies: upgrade 3 existing project entries to Problem/Role/Approach/Outcome via an **additive** schema; metrics only if true + cleared (R19.1).
7. Testimonials: slot only, fill on consent; do not block launch.
8. Blog: archive the cheesecake; publish 2 posts tied to case studies.
9. Tags: add schema field; expose as server-rendered tag pages, not client filter.
10. CTAs: one primary "Work with me" → contact; RSS for blog. No newsletter.
11. Legal: Impressum + Datenschutz (Resend disclosed), plain styling, P0.
12. Every content change is human-gated; e2e counts/copy assertions updated in the same PR.
13. No fabricated metrics, no fake testimonials, no invented clients.
14. MVP content set: positioning line + 3 case studies + 1 arc section + 2 posts + 2 legal pages + 1 cleared testimonial = achievable in ~1-2 weeks of Tom's writing time, not months.
15. If Tom cannot supply the above, ship the restyle with honest placeholder-free copy and fewer case studies — never lorem or invented proof.

## ACCEPTED CONSTRAINTS
- No URL/sitemap/nav changes for the theme (`app/sitemap.ts:10-41`).
- No fabricated metrics/testimonials (R19.1); LAYZR content requires consent.
- All copy changes human-gated; content changes update `e2e/static-routes.spec.ts:44-46` and `e2e/dynamic-content.spec.ts:27,49,62,86`.
- No new runtime deps; no tracking/newsletter; RSS only (R15.11).
- Legal pages plain and high-contrast, Roman-motif-free.
- Tag/filter features server-rendered (no client JS bundle growth).
- Case-study schema changes additive-only.

## OPEN DECISIONS
- New `/work` route vs. featured flag inside `/projects`?
- Keep cheesecake archived vs. delete (changes e2e post count)?
- Testimonial at launch vs. deferred slot?
- Does LAYZR get a case study at all, and with what cleared metrics?
- Tag pages: `/tags/[tag]` vs. query filter on `/projects`?

## ACKNOWLEDGEMENT
Content is the critical path. My proposal is a **minimum viable, human-gated content set** (~1-2 weeks of Tom's writing), not a months-long content program: positioning line, three upgraded case studies, one founder-arc section, two new posts, two legal pages, one consented testimonial. Everything else is optional until content exists.
