# Project narrative refresh — all 28 case files

## TL;DR

Rewrite every project case-file body into the same four-part narrative:
**The problem → The build → The result → What I took from it**. Replace the
current uneven 230–390 word entries with 450–650 word, evidence-grounded
stories written for a senior engineering recruiter. Preserve every slug,
public URL, date, and existing verified metric.

## Constraints

- Do not invent facts, metrics, funding, users, awards, or links.
- Use only the existing case files, public GitHub repos, public site copy,
  Forgejo READMEs, press coverage, and existing `.omo` evidence.
- No private or LAN-only URLs in public frontmatter.
- Keep filenames, IDs, and article dates stable.
- Use first-person prose. No AI-generic phrases or corporate filler.
- Every post gets the same four H2 headings in the same order.
- Keep the frontmatter schema valid and the project inventory at 28.
- Do not change project selection, featured flags, or the recent highlight.

## Source evidence

- GitHub: `TomSeestern/BotBoost`, `SouDest`, `soudest_backend`,
  `soudest_frontend`, `ISEEU-Net`, `AT89C5131A_Gleichstrommotor`,
  `LCD-Display`.
- Forgejo: `EveryFontEver.com`, `FullSound`, `ClosedLoopOS`, `foerderhebel`,
  `audiobook-3d-covers`.
- Public sites: hammer-robotics.de, everyfontever.com,
  closed-loop-os.vercel.app, layzr.gg.
- Press: RWU LAYZR/Hammer profile, openPR Jodel acquisition, Business Insider.
- Existing project bodies and `.omo/evidence/task-project-case-files.txt`,
  `.omo/evidence/task-14-2026-portfolio-overhaul.txt`,
  `.omo/evidence/task-15-2026-portfolio-overhaul.txt`.

## Steps

- [x] **1. Audit.** Inventory all 28 files, word counts, headings, links,
  metrics, and existing source claims.
- [x] **2. Research.** Confirm repo and web facts for the projects with public
  evidence; record source anchors in the evidence ledger.
- [x] **3. Batch 1.** Rewrite 2010–2017 (9 files) as early craft/learning
  stories with concrete technical detail.
- [x] **4. Batch 2.** Rewrite 2018–2021 (12 files) around architecture,
  delivery, and measurable outcomes.
- [x] **5. Batch 3.** Rewrite 2024–2026 (7 files) around company building,
  systems design, and current work.
- [x] **6. Format + guard.** Add a heading-structure invariant to the content
  test, run Prettier, frontmatter validation, and typecheck.
- [x] **7. Verify.** Full Jest, build, gates, and production browser checks on
  all project routes.
- [x] **8. Commit and push.**

## Success criteria

- 28/28 project bodies contain the four headings in order.
- Each body is at least 450 words and reads as one coherent story.
- No placeholder or AI-tell phrases.
- No frontmatter or URL regressions.
- `pnpm test`, `pnpm build`, and the content gates pass.
