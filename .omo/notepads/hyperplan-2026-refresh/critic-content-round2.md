# critic-content — Round 2 Cross-Attack

Round 2, hyperplan-2026-refresh (runId 5dcf2c72-1200-45bb-946a-6b5c4f977faa).
Role: content strategist / UX writer. Attacking the other four critics from the content, narrative, and IA standpoint. Not defending my own Round-1 findings (Round 3).

## Evidence ledger (verified this round)

| Fact | Evidence |
| --- | --- |
| Blog = **3 posts**; one is a cheesecake recipe | `content/blog/` = 2019-ebeltoft-cheesecake-recipe.md, 2020-homelab-v2-..., 2024-homelab-v2-... (3 files) |
| Projects = **21 files, all dated 2010–2021**; nothing after 2021 | `content/projects/` listing |
| Total content corpus = **7,767 words / 24 files** (~320 words avg) | `wc -w content/*/*.md` |
| Zero outcome/metric/role fields in schema | `lib/markdown.ts:6-13` — schema has title, articleDate, articleContent, authorImgSrc, authorName, technologies only |
| Only markdown image in entire corpus is the cheesecake photo, remote S3, no dims | `content/blog/2019-ebeltoft-cheesecake-recipe.md:21` |
| `ProjectTeaser` `imageUrl` is declared/destructured but never rendered | `components/ProjectTeaser/ProjectTeaser.tsx:20,29` (no use in JSX) |
| Home passes a URL *path* as `imageUrl` | `app/page.tsx:117` → `imageUrl={article.fullArticleLink}` |
| Every blog card hardcodes "Tutorial" | `components/ArticleTeaser/ArticleTeaser.tsx:59-62` |
| No legal routes | no `app/impressum`, `app/datenschutz`; `components/Footer/Footer.tsx` has no legal links |
| Dependencies proposed by rivals are **absent** | `package.json:26-129` — no `framer-motion`, `next-themes`, `axe-core`, `three`, `lhci` |
| Radix packages = **15**, not 16 | `package.json:28-42` |
| Flowbite imported in **6 files** | app/blog/entry, app/contact, app/projects/entry, ArticleTeaser, Header, ProjectTeaser |
| CSP still report-only with `unsafe-inline`; no image `formats`/TTL | `next.config.mjs:23,32-37` |
| Repo's own plan forbids new runtime deps | `.omo/plans/2026-audit-remediation.md` "Must NOT have": "No new runtime dependencies" |

---

## A. Attack on critic-legacy (design)

**C-L1 [critical] — Root cause mistaken for a footnote.**
legacy's thesis (brand identity, micro-interactions, narrative arc, dark-mode parity) cannot ship against a 24-file / 7,767-word corpus whose newest project is 2021 and whose newest blog post is a homelab update. "Content vacuum" appears as a trailing clause; it is the reason the design cannot succeed. A peak-agency visual system applied to 320-word average entries with no metrics produces a beautiful empty temple. legacy never scopes a content workstream, yet its own hero/positioning fix is 100% copy.

**C-L2 [high] — Factual error: "render imageUrl" is not a component bug.**
legacy says project cards are "text-only (imageUrl declared but never rendered)". True at `ProjectTeaser.tsx:20,29`, but the fix is not a render line: `lib/markdown.ts:6-13` has **no image field**, and `app/page.tsx:117` passes `article.fullArticleLink` (a route string) into `imageUrl`. Fixing this requires a new frontmatter field plus 21 content edits and asset sourcing. legacy underestimates it as a one-line component fix.

**C-L3 [high] — Overreach / scope-creep.**
One redesign pass containing full brand identity + narrative arc + per-page OG + class-drift cleanup + a11y + dark-mode parity + micro-interactions is 6 workstreams. legacy ranks them without a dependency order and defers the one item that decides the outcome (positioning + proof). Design polish on top of unpositioned copy is redecoration.

**C-L4 [medium] — Contradiction: CTAs with no destination.**
legacy flags "competing CTAs" and separately proposes IA expansion. But there is no offer surface to CTA to: nav is About/Projects/Blog/Contact (`components/Header/Header.tsx:8-13`), no services, no pricing, no case-study format. Collapsing to one CTA ("Work with me") links to a contact form only. The CTA problem is a missing-offer problem, not a button-count problem.

**C-L5 [medium] — Missed legal reality.**
A German `.de` site refresh with no `Impressum` and no `Datenschutz` is a launch blocker under German law, not a nicety. Neither route exists (`app/`), no footer legal links (`components/Footer/Footer.tsx`). A "peak agency" build must add them; legacy's IA section omits them entirely.

**C-L6 [medium] — Missed: the duplicate marquee is also an IA redundancy.**
legacy calls the marquee an "antipattern" + duplicates `/projects`, but does not connect it to the copy lie "My Recent Projects" (`app/page.tsx:101`) rendering all 21 entries incl. 2010 LEGO (`app/page.tsx:112`). The fix is a content taxonomy decision (featured vs archive), not just removing an animation.

---

## B. Attack on critic-roma (Rome concept)

**C-R1 [critical] — The metaphor is unearnable with this content.**
roma grounds Rome in "civic engineering / infrastructure", which demands case studies about systems, scale, and durability. The corpus has none: projects stop in 2021, entries average ~320 words with no outcomes (`lib/markdown.ts:6-13`), and the blog is 3 posts, one a cheesecake recipe. Marble, arches, and oculus framing 3 stale posts is cosplay, not identity. roma audits fonts, palette, and motion in depth and never audits content volume or claims.

**C-R2 [high] — Contradiction with critic-perf and critic-tech on motion.**
roma prescribes 600–900ms clip-path transitions as "gravitas". critic-perf flags marquee INP/TBT and calls "more complex interactions" the top INP risk (`app/page.tsx:110-141`). critic-tech says "skip route transitions". roma's motion budget directly fights the perf critic's budget and is silently deleted by tech's plan. No critic reconciles the three.

**C-R3 [high] — Anti-cliché list is itself a cliché; token rewrite understated.**
Rejecting Cinzel/Trajan while prescribing "travertine, basalt, Tyrian purple #5B2A4A, terracotta, verdigris, cage-cup glass, bronze hairline, oculus" is the same move — a moodboard of named materials. Worse, it silently rewrites the token contract in `DESIGN.md:9-28` (semantic `surface`/`muted`/`border`/`accent`, dark variants, Flowbite `primary-*` aliases). That is a full palette re-platform plus dark-mode re-derivation, not a restyle.

**C-R4 [medium] — Feasibility: "procedural marble not PNG" implies a render pipeline.**
No WebGL/three.js/GSAP in `package.json:26-129`. Procedural marble means canvas/shader JS in a static, statically-exported site already flagged for bundle/INP risk. roma proposes the single most expensive asset strategy without a cost note.

**C-R5 [medium] — Missed: audience/message mismatch and a11y/SEO cost of Latin.**
Tom is a German developer-turned-entrepreneur whose buyers are clients/partners, not Romans. Imperial iconography reads as vanity to that audience. Latin labels add screen-reader and non-German visitor friction and a translation surface. roma optimizes aesthetic purity over conversion.

---

## C. Attack on critic-tech (Next.js architecture)

**C-T1 [critical] — Proposes deps that are not installed, against the repo's own guardrail.**
`framer-motion` (for LazyMotion), `next-themes`, and `axe-core` do not appear in `package.json:26-129`. `.omo/plans/2026-audit-remediation.md` "Must NOT have" states "No new runtime dependencies". tech recommends 2 new runtime deps + 1 test dep without flagging that it breaks an approved plan constraint, nor the lockfile/CI/Nix implications.

**C-T2 [high] — Factual: "16 Radix pkgs, 1 used" is wrong on both counts.**
Actual count = 15 (`package.json:28-42`). And it is not "1 used": `@radix-ui/react-tooltip` backs `components/Tooltip`, and killing Flowbite means rewriting Card/Breadcrumb/Navbar surfaces used in 6 files. `ProjectTeaser.tsx:1,37` and `ArticleTeaser.tsx:2,57` wrap content in Flowbite `Card`; `app/projects/entry/[slug]/page.tsx:1,28-35` uses Flowbite `Breadcrumb`. `DESIGN.md:48-52` explicitly preserves Flowbite primitives. Removal is a design-system migration, not a file count.

**C-T3 [high] — Contradiction with roma/legacy on motion.**
tech's "CSS-first animation + LazyMotion for 3 surfaces; skip route transitions" contradicts roma's 600–900ms clip-path and legacy's micro-interaction layer. LazyMotion is a framer-motion API (see C-T1), so "CSS-first" and "LazyMotion" are also internally inconsistent. No motion contract exists across the team.

**C-T4 [medium] — Underestimated risk: next-themes is a tree-wide change, not a FOUC fix.**
Wrapping the app in a theme provider changes hydration for every route and introduces a different storage key than the current `flowbite-theme-mode`, resetting returning users' theme. Combined with "server-first + client islands", this is a re-architecture touching `app/layout.tsx`, not a localized script swap. No rollback plan.

**C-T5 [medium] — Missed: architecture on an empty shell; legal routes missing from IA.**
tech's 8-wave plan rebuilds marquee, hero, and tokens but never addresses that the site has 3 blog posts and a project set frozen in 2021. Optimizing architecture before content multiplies work on pages that will be rewritten. It also omits `Impressum`/`Datenschutz`, which are mandatory static routes the proposed IA must include.

---

## D. Attack on critic-perf (perf/a11y)

**C-P1 [critical] — Frames a content/IA decision as a pure perf defect.**
perf's headline is "42 marquee cards → INP/TBT". But `app/page.tsx:110-141` duplicates the `/projects` grid (`app/projects/page.tsx:84-96`) and renders 21 entries whose content is the real problem: stale (≤2021), metric-free, and mislabeled "Recent". The cheapest fix — replace the marquee with a small curated featured set and delete the duplicate — is a **content/taxonomy call**, and it eliminates most of the INP/TBT cost at once. perf treats the symptom.

**C-P2 [high] — Contradiction with roma and tech on motion + a11y tooling.**
perf demands reduced-motion tests and axe-core; roma demands 600–900ms clip-path spectacle; tech also demands axe-core. `axe-core` is not installed (`package.json`), and no critic reconciles "a11y-safe motion" with "Roman gravitas". The reduced-motion test (which must pass with `prefers-reduced-motion: reduce`) would neutralize roma's signature motif — nobody noticed.

**C-P3 [high] — Inflated current-defect claim: the CLS/remote-image issue is one off-brand post.**
perf cites "blog markdown raw `<img>` remote S3 no dims → CLS". The **only** markdown image in the entire corpus is `content/blog/2019-ebeltoft-cheesecake-recipe.md:21` — the cheesecake recipe. Deleting off-brand content (a content decision) removes 100% of the current CLS exposure. perf presents a hypothetical as a systemic defect and never notes the content fix.

**C-P4 [medium] — Budget proposals depend on non-existent infrastructure.**
"Enforce bundle/INP budget in CI" requires LHCI/budgets/baselines; none exist (`package.json` has no `test:perf`, no LHCI; `.forgejo/workflows` has no perf job). `AGENTS.md` R12.1/R12.2 already declare budgets "aspirational" with no enforcement. perf's enforceable-budget claim is a wish without an implementation path.

**C-P5 [medium] — Missed: the 80 KB logo / 512×512 OG issue is partly a brand-asset task.**
perf frames the logo as a sizing bug, but replacing it is exactly the brand-identity work legacy/roma claim (a new mark). perf quantifies the bytes but not the asset pipeline that must produce the replacement.

---

## E. Cross-cutting agreement (2 themes)

**AGREE-1 [with critic-legacy + critic-tech] — The marquee is redundant and must be re-decided at the IA level.**
`app/page.tsx:110-141` duplicates `app/projects/page.tsx:84-96`, and the "Recent Project" block (`app/page.tsx:53-59`) hardcodes LAYZR.gg with a TODO while `content/projects/` has no LAYZR entry. legacy, tech, and I converge on removing/reworking it; the resolution is a content taxonomy (featured vs archive), not animation tuning.

**AGREE-2 [with critic-roma + critic-tech] — Current visual language is generic and the token layer needs a real identity.**
`DESIGN.md` prescribes a white/slate + default-blue system with `primary-*` Flowbite aliases; `app/page.tsx:44-49` hero is templated boilerplate. A genuine rebrand is warranted — **provided it is content-led**, i.e. the Rome frame is earned by shipping the missing case studies and founder narrative first, not by restyling an empty corpus.

---

## F. Bottom line from the content seat

Every rival proposes chrome, code, colour, or motion while the binding constraint is that the site has:
- 3 blog posts, one off-brand, and a blog corpus with a single remote image;
- 21 project entries frozen at 2021 with no outcomes, roles, or metrics (`lib/markdown.ts:6-13`);
- no offer/services surface, no testimonials, no legal pages.

A 2026 agency-grade rebuild that does not first produce 4–6 flagship case studies (incl. LAYZR/HATtec), a positioning line, quantified outcomes, and `Impressum`/`Datenschutz` will ship a beautiful, fast, accessible, Roman-themed empty building. Content is the critical path; the other four critics mostly argue about the facade.
