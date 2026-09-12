# Decision — 2026 refresh scope & design forks (2026-09-10)

Context: user answered the 13 Open Decisions from `.omo/plans/2026-refresh-restyle.md`
(hyperplan-2026-refresh). This record supersedes the plan's "Open Decisions" section.
Plan of record: `.omo/plans/2026-refresh-restyle.md`.

## Resolved

| # | Decision | Resolution |
|---|---|---|
| D1 | Scope tier | **Full scope** — all waves incl. Wave 5 content |
| D2 | Marquee survives / featured count | **UX-designer's call**; keeping or removing both acceptable |
| D3 | Second serif | **Two fonts** — Inter + Newsreader (self-hosted) |
| D4 | Accent colors | **Two accents** — `#2563eb` + terracotta `#B4462F` |
| D5 | `/work` vs featured flag | **Default** — featured flag inside `/projects` |
| D6 | LAYZR case study | **Included** (needs Tom's cleared metrics + consent) |
| D7 | Cheesecake post | **Keep as part of the blog** (no archive/delete) |
| D8 | Testimonials | **At launch — labelled examples only** (resolved 2026-09-12, see Round 3) |
| D9 | Tag pages | **Include** — server-rendered `/tags/[tag]` |
| D10 | Content authoring | **Included** (full) |
| D11 | Flowbite | **Targeted** replacement (keep Card) |
| D12 | Theme storage key | **Keep** `flowbite-theme-mode` |
| D13 | Color mode | **One mode only** — no light/dark toggle |

## Conflict / dependency notes

- **D8 vs R19.1.** AGENTS R19.1 forbids fabricated claims; the plan forbids invented
  testimonials. "Placeholder examples" are permitted ONLY if explicitly labelled as
  examples (not real client quotes) in the visible UI. Unlabelled placeholder quotes
  ship false proof and violate R19.1. Pending Tom's confirmation of labelling.
- **D13 supersedes D12.** A single mode removes the toggle and the theme-resolution
  script, so keeping the `flowbite-theme-mode` key is moot. Pending Tom's choice of mode.
- **D6 requires consent/clearance.** LAYZR.gg is a real company; any metrics must be
  cleared before publication.

## Round 2 resolutions (2026-09-10, follow-up)

- **D13 → Light only, parchment palette, no blue.** User: "Light is better, but lets not keep
  the blue, would love to keep color closer to something like pergament paper." This:
  - removes the light/dark toggle, the theme-resolution script, and the `flowbite-theme-mode`
    key (D12 becomes void);
  - replaces the blue accent; headline two-accent pair becomes warm (terracotta + a deep
    oxblood/wine), final pair contrast-gated in T13;
  - base surface moves from cool travertine `#F4F1EA` toward a warmer **parchment** tone
    (candidate range `#F5EFE1`–`#EFE7D3`), ink stays dark; all pairings must pass the T13
    contrast gate in the single mode.

- **D8 → BLOCKED.** User selected "Unlabelled placeholder quotes". This conflicts with
  AGENTS **R19.1** (no claim without verifiable citation) and with German unfair-competition
  law (UWG §5, misleading commercial practices): shipping fake testimonials styled as real
  is false endorsement. Not implemented pending explicit confirmation. Recommended
  alternative: visibly labelled example quotes, or defer the section until real consented
  quotes exist.

## Round 3 resolution (2026-09-12)

- **D8 → RESOLVED: labelled examples only.** Tom confirmed the permitted alternative
  from Round 2: the testimonial section may ship with placeholder quotes **only when
  each is explicitly labelled as an illustrative example in the visible UI**, such that
  no reader can mistake it for a real client endorsement. No real company, logo, or
  person may be named. This satisfies R19.1 (no unverifiable claim presented as fact)
  and UWG §5 (no misleading commercial practice). Implemented in T28.

## Status

D1–D11 and D13 resolved and actionable. **D8 resolved (labelled examples only,
2026-09-12)**. D12 voided by D13. Downstream plan rows updated.
