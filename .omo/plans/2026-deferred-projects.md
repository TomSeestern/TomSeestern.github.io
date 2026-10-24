# Deferred project candidates — publishable follow-up

## TL;DR

Add three deferred case files that have real, publishable engineering evidence:
FullSound, AudioForge (audiobook-3d-covers), and Foerderhebel. Keep ohmyroadmap,
Unscroll, Pr0gramm Downloader 9000, Streamtopia, HomeLab/MyMediaDatabase/nix, and
Songs of the Outer Rim deferred because they lack a public distribution/visual,
are release-blocked, are private without publishable evidence, or are
config/infrastructure rather than product work. Use real screenshots and counts
from the repositories, and keep the four-project featured set unchanged.

## Scope

- `content/projects/2026-fullsound-browser-engine-sound.md`
- `content/projects/2026-audioforge-printable-audiobook-covers.md`
- `content/projects/2026-foerderhebel-ai-grant-database.md`
- `public/img/projects/*`
- `lib/project-content.test.ts`
- `scripts/check-project-frontmatter.js`
- `scripts/generate-brand-assets.mjs`, `public/img/og-default.png`
- `e2e/home.spec.ts`, `e2e/fixtures/expectations.ts`
- `.omo/evidence/task-deferred-projects.txt`

No `ProjectCover` changes were needed: `/projects` renders archive rows, not
cover art, and all three new entries have detail-page heroes.

## Source of truth

- Forgejo `TomSegbers` repos: FullSound, audiobook-3d-covers, foerderhebel;
  repo archives and READMEs read locally.
- Screenshots: FullSound demo evidence capture, AudioForge `preview-3d.png`,
  Foerderhebel `hero-overview.png`.
- Foerderhebel counts from the working tree: 179 grant programs × DE/EN/FR =
  537 MDX records.
- No private Forgejo URLs, parked domains, or invented metrics.

## Decisions

- **Add FullSound**: AudioWorklet + Worker + Rust/WASM FDTD exhaust model +
  SharedArrayBuffer ring buffers + Three.js LOD view; six presets.
- **Add AudioForge**: Audiobookshelf integration, browser-side ASCII STL,
  live Three.js preview, emboss depth/dimensions, bulk generation, print estimates.
- **Add Foerderhebel**: multilingual grant discovery, AI research pipeline,
  179 programs / 537 localized records, faceted search, provenance metadata.
- **Keep ohmyroadmap deferred**: strong CLI/MCP engineering, but no published npm
  package (404), no public demo, and the generated Gantt is too sparse for a
  portfolio visual.
- **Keep Unscroll deferred**: release and feed-removal behavior explicitly
  unvalidated in its own docs/ADR.
- **Keep deferred**: Pr0gramm Downloader 9000 (private niche), Streamtopia
  (private, no publishable build/screenshot), HomeLab/MyMediaDatabase/nix
  (infrastructure/config), Songs of the Outer Rim (config-only mod).

## Steps

- [x] **1. Audit evidence.** Repo metadata/READMEs, screenshots, actual file
  counts, and public-distribution checks.
- [x] **2. Add three case files.** Role/outcome/metrics/body from the evidence;
  featured set unchanged.
- [x] **3. Add real imagery.** Optimize FullSound, AudioForge, and Foerderhebel
  visuals into `public/img/projects/`.
- [x] **4. Update guards and counts.** Project count 28, deferred-entry content
  invariants, e2e count fixture, dynamic OG count/span, fresh OG asset.
- [x] **5. Verify.** Typecheck, lint, Prettier, images, design tokens, 225 Jest
  tests, production build (160 pages / 28 project routes), 100 Chromium e2e
  tests, 16 Storybook tests, final live surface.
- [x] **6. Commit.** Conventional commit `14dddb0` after final evidence ledger.
