# Round 3 — Defence, Refinement, Concession by critic-legacy

Verdict format per attack: **DEFEND** (new in-repo evidence), **REFINE** (narrowed position),
**CONCEDE** (finding dropped).

Evidence additions verified this round:
`grep openGraph` in `app/` → 7 route files; `/contact` → no metadata; `tailwind.config.js`
has no `2xs`/`open-sans`/`0.5md`; `motion-reduce:animate-none` at `app/page.tsx:111,127`;
contact form has zero `aria-describedby`/`aria-invalid`/`aria-live`/`role`.

---

## L3-1 — [roma R-L1] "UX/code audit, not visual language; least useful designer" → REFINE

My R1 was grounded in the rendered screenshots, not only code, and its top findings were
visual-language requirements: identity (C1), hero positioning (C2), typography (H1),
whitespace rhythm (H2), portrait art direction (H3), storytelling flow (H4), motion (H5),
case-study page (H6). But roma is right that I produced **diagnoses, not a language** — no
palette, no type pairing, no grid. Narrowed position: I own visual-language *requirements +
constraint hygiene*; roma/art-direction owns the language itself. I will not claim design
leadership.

## L3-2 — [roma R-L2] "Branded hero + portrait + motion contradicts LCP discipline" → REFINE

Art-directed hero and LCP discipline are compatible; the current code shows why. The portrait
is `hidden ... xl:block` (`app/page.tsx:86`) so it is *not* the mobile LCP today. If the
refresh makes it visible on mobile it becomes an LCP candidate and **must** ship
`priority`, modern format (AVIF/WebP), and explicit `sizes`/dimensions. Motion must stay on
compositor properties (the marquee already animates `transform`,
`tailwind.config.js:170-183`). Reconciled constraint goes to the plan; neither of us gets to
keep both "big cinematic hero" and "zero LCP work."

## L3-3 — [perf P-L1 / tech T-L1] "'No per-page OG' is FALSE" → REFINE

Verified: `openGraph` exists in 7 route files (layout, home, about, projects, projects/entry,
blog, blog/entry). My M3 wording was "**no per-page typographic OG**," i.e. no *unique*
per-route imagery — accurate in substance: all 7 reuse the same `/img/logo.png` 512×512
(`app/page.tsx:22-27`, `app/about/page.tsx:18-25`, etc.), the wrong aspect for
`summary_large_image`. REFINE: drop the ambiguous "no per-page OG" phrasing; the real defects
are (a) identical square logo OG everywhere, (b) `/contact` has **zero** metadata because it
is `"use client"` (`app/contact/page.tsx:1`) — tech's T-L1 confirmed.

## L3-4 — [tech T-L4] "Ignore existing token system + DESIGN.md; gap is expressive layer" → REFINE

Half-true. I cited token *drift* (home hero uses raw `text-4xl md:text-5xl lg:text-6xl`,
`app/page.tsx:44`, instead of the `text-h1` token at `tailwind.config.js:84`) and I cited
`DESIGN.md` in M3. But tech is correct that the **foundation exists** — the missing thing is
the expressive layer (display face, palette, motion language). REFINE H1: "expressive layer
absent" is the finding; token drift is a hygiene bug that must be fixed regardless.

## L3-5 — [tech T-L3 / content C-L3] "Workstreams fused with no dependency order" → DEFEND (with accept)

DEFEND: Round 1 was a *diagnostic*, not an implementation plan — dependency ordering is the
job of the `.omo/plans/` document (AGENTS R1.1/R1.5), not a critique. Finding a problem and
sequencing its fix are different artefacts. That said, I accept the gap as an output I must
now supply: see ACCEPTED CONSTRAINTS / dependency order below.

## L3-6 — [content C-L2 / tech T-L2 / perf P-L2] "imageUrl is a content-model gap + marquee collision" → CONCEDE

Concede fully, and it is the strongest attack of the round. Verified: the frontmatter schema
(`lib/markdown.ts:6-13`) has **no image field**; `content/projects/` holds 21 files and zero
project images; `imageUrl` is fed `article.fullArticleLink` (`app/page.tsx:117`,
`app/projects/page.tsx:89`), i.e. a URL string the component never renders
(`ProjectTeaser.tsx:19` vs body 36-85). So my C3 "render imageUrl" was a one-line phantom;
the real work is schema field + 21 assets + art direction + asset pipeline, and it **forces
the marquee's removal** (42 duplicated image loads otherwise). C3 is restated as a
content-model + asset project; C4 gains a hard technical justification.

## L3-7 — [perf P-L3] "prose max-w-none misread; whitespace is a taste claim" → CONCEDE (measure) / REFINE (spacing)

CONCEDE the measure overclaim: `prose prose-lg max-w-none` sits inside `max-w-3xl`
(`app/blog/entry/[slug]/page.tsx:38-39`) = 48rem / 768px; at 18px prose that is ~80-85
characters — above the ideal ~66ch, but **not** the "90+ chars" I wrote. I misread the
container. Downgrade H1 measure claim HIGH → MEDIUM and restate as "768px is at the wide end;
add an explicit measure token."
REFINE H2: `DESIGN.md §4` *does* define the section rhythm (`py-8 sm:py-16 lg:py-24`), so my
"no spacing system" framing was wrong. Narrowed claim: the *contract itself* is flat — one
rhythm for every section regardless of expressive intent — so the contract needs density
variants, not a replacement.

## L3-8 — [perf P-L4] "Form a11y not concrete; touch-target fix restyles library internals" → DEFEND (with narrow)

DEFEND, with evidence: contact inputs have `id` but **no** `aria-describedby`/`aria-invalid`
(`app/contact/page.tsx:79-112`); the error `<p id="name-error">` (87-91) is never referenced;
the success Alert is `fixed inset-x-1/3 top-8` with no `role="status"`/`aria-live` (line 52);
validation runs only on submit with `noValidate` (line 71). Touch targets: the affected
controls are **our own** hand-rolled anchors — footer social icons are `p-2` + `h-4` ≈ 32px
(`Footer.tsx:24-51`) — so the fix is our markup, not library internals. REFINE: I do **not**
prescribe restyling Flowbite's `NavbarToggle`; that part of the claim is withdrawn.

## L3-9 — [roma R-L6] "Missed dead tokens in Tooltip.tsx:5" → CONCEDE

Concede. Verified: `font-open-sans`, `text-2xs`, `rounded-0.5md` (`Tooltip.tsx:5`) are absent
from `tailwind.config.js` (no `open-sans` in `fontFamily`, no `2xs` in `fontSize`, no
`borderRadius` extension). They are silent no-ops, so every technology-icon tooltip renders
in the default font/size/radius. This is a concrete instance of the drift I only described
abstractly in M3 — it now lands as hard evidence there.

## L3-10 — [perf R-L3 / roma] "Marquee WCAG imprecise; motion-reduce present; clones = 2.4.3" → REFINE

Verified `motion-reduce:animate-none` at `app/page.tsx:111,127` — reduced-motion **is**
handled; I should not have implied it was ignored, and I credit it. But WCAG 2.2.2
(Pause/Stop/Hide) still applies for users who have *not* set the OS preference: honoring
`prefers-reduced-motion` is not a pause control. And perf's duplicated-focusable point is
fair — 21 cloned links add real Tab burden, so 2.4.3 is defensible. REFINE C4: "2.2.2
applies (no pause control); duplicated focusables burden 2.4.3; reduced-motion is already
covered — credit, not defense." Concede that my L-D1 dismissal of 2.4.3 was too absolute.

## L3-11 — [roma R-L5] "prose fix collides with Rome measure; no measure system" → CONCEDE + supply

Concede the gap. The plan needs a measure system that works under any concept. Proposed
tokens (extend `tailwind.config.js` theme, consumed as `max-w-*` or CSS vars):
`--measure-article: 66ch`, `--measure-lead: 46ch`, `--measure-card: 38ch`,
`--measure-display: 20ch`, container `--width-page: 78rem`. `prose` uses
`--measure-article`; Rome (or any concept) can break the measure deliberately for display
type without a collision.

---

## 1. FINAL DEFENSIBLE POSITION (≤15 lines)

1. The site is competent engineering in a default Flowbite/Tailwind skin: name-as-logo
   navbar, blue-600 accent, no visual language, no positioning — `DESIGN.md` itself calls
   the accent "familiar."
2. Highest-confidence, hardest-to-refute: (a) portfolio shows **zero project imagery** —
   content-model + asset gap, not a one-liner (C3→L3-6); (b) 90s marquee duplicates 21
   projects, no pause control, 2.2.2 + focus-burden (C4→L3-10); (c) form a11y defects are
   concrete (L3-8); (d) token drift + dead tokens (`Tooltip.tsx:5`, `app/page.tsx:44`).
3. Withdrawn / downgraded: "no per-page OG" (exists, reused logo — L3-3); prose measure
   "90+ chars" (768px, ~80-85ch — L3-7); whitespace "no system" (contract exists but is
   flat — L3-7); "render imageUrl" as a small fix (large project — L3-6).
4. My role is visual-language requirements + constraint/verification hygiene, not authoring
   the visual language — that is art direction (R-L1, accepted).
5. Legal (Impressum/Datenschutz) is a real gap but an audit item, not the redesign thesis
   (C1 content, held).

## 2. ACCEPTED CONSTRAINTS THE PLAN MUST SATISFY

- **Static build preserved** (tech+perf); no runtime data; no net-new heavy client JS —
  framer-motion only if a motion budget proves INP-neutral (L-B2 tension recorded).
- **Hero/imagery perf:** any hero or card image ships `priority` (hero), modern format,
  explicit `sizes`/dimensions; `next.config.mjs` `remotePatterns` updated before any
  markdown-image migration (`plantoeat.s3` currently blocked — L-D5).
- **Motion:** transform/opacity only; `motion-reduce` honored (already present); any
  auto-motion either gets pause/stop/hide or is deleted (marquee → delete).
- **a11y gates:** WCAG 2.2.2 for auto-motion; 2.4.3 focus-order with no duplicate
  focusables; form errors via `aria-describedby`/`aria-invalid`; success via
  `role="status"`/`aria-live`; ≥44px targets on our own controls; axe-core + reduced-motion
  CI specs.
- **Content model:** add `image`, `tags`, and case-study fields to the Zod schema
  (`lib/markdown.ts:6-13`), migrate 21 project files, and re-add `tags` (currently dropped).
- **Tokens:** keep `DESIGN.md` base; add expressive layer + measure tokens; fix dead tokens
  (`Tooltip.tsx:5`) and drift (`app/page.tsx:44`).
- **Dependency order (supplies the missing sequencing, L3-5):** (1) content model + assets →
  (2) identity/visual language → (3) page templates incl. case study → (4) motion →
  (5) a11y/OG/legal/CI gates.
- **Legal:** Impressum + Datenschutz exist, scoped out of visual redesign.

## 3. OPEN DECISIONS I CANNOT RESOLVE ALONE

- Full Flowbite React replacement vs keep-primitives (tech cost call).
- Who produces 21 project images, and how many (content + art direction).
- Whether the concept is "civic Rome" at all — the brief says "inspired by ancient Rome,"
  roma says "civic not empire"; needs stakeholder.
- Font licensing budget (GT Sectra paid vs free variable).
- Scope tier: full rebuild vs restyle — determines whether C3/L3-6 is in scope.
- Datenschutz wording for a no-cookie, Resend-mediated contact form.
