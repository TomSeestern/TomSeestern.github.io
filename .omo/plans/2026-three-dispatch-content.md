# Three Dispatch Content

## TL;DR

Add three new blog dispatches to `content/blog/`: a December 2025 Nix essay, a February 2026 declarative Unraid guide framed as the fourth homelab iteration, and a short October 2026 theoretical manifesto about what LLM agents still lack. Keep the existing site voice, update the one exact blog count in the e2e fixture, and verify the real routes, tag index, mobile width, and build.

## Scope

- Add `content/blog/2025-falling-for-nix.md` (`articleDate: 2025-12-31`).
- Add `content/blog/2026-unraid-declarative-homelab-v4.md` (`articleDate: 2026-02-28`).
- Add `content/blog/2026-what-llm-agents-are-missing.md` (`articleDate: 2026-10-23`).
- Update `e2e/fixtures/expectations.ts`: `BLOG_POST_COUNT` from 3 to 6.
- Verify the blog index, all three new detail routes, tag archives, and 375px layout.
- Record commands, outputs, and source boundaries in `.omo/evidence/task-three-dispatch-content.txt`.

## Source boundaries

### Nix source (`/home/tom/Projects/nix`)

Use only public-safe concepts: flakes, modular NixOS hosts, Home Manager, pinned inputs, devShells, generations, rollback, and secrets managed declaratively.

Do not include: real hostnames, tailnet suffix, IP addresses, secret names, repository remotes, internal paths, signing keys, or internal project inventories. Do not present the 2026 impermanence/disko migration as completed.

### HomeLab source (`/home/tom/Projects/HomeLab`)

Use only public-safe architecture and workflow: Unraid as a stateful appliance, a git mirror of selected configuration, dry-run-first push, checksum-based mirroring, Compose validation, Home Assistant desired/snapshot separation, restore drills, and CI checks.

Do not include: real LAN IPs, hostnames, SSH targets, secret names/values, container credentials, security-incident details, or changes dated after February 2026. Do not claim Unraid itself is fully declarative.

### ohmyroadmap source (`/home/tom/Projects/ohmyroadmap`)

Use only the general theoretical vocabulary: durable external state, checkable outcomes, evidence, task graphs, isolation, failure semantics, budgets, human gates, evaluation, and economics.

Do not mention `ohmyroadmap`, `.omr`, `R-` IDs, its commands, run artifacts, or any unique project terminology.

## Assumptions

- `pnpm` is only available through the project's Nix dev shell; commands run as `nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; pnpm ...'`.
- Existing blog entries include an H1 in Markdown; the detail page strips it and uses frontmatter for the visible title. New files follow that convention.
- New entries use `authorName: Tom Segbers`, `authorImgSrc: /img/logo.png`, and tags that do not collide after canonicalisation.
- No new imagery is required for blog detail pages.
- Newest-first order after the change: manifesto, Unraid, Nix, 2024 homelab, 2020 homelab, 2019 cheesecake.

## Success criteria

1. Three new Markdown files parse through `lib/markdown.ts` with valid frontmatter and bodies.
2. `/blog` lists six dispatches with the manifesto first.
3. `/blog/entry/2025-falling-for-nix`, `/blog/entry/2026-unraid-declarative-homelab-v4`, and `/blog/entry/2026-what-llm-agents-are-missing` return 200 and render headings, body, reading time, tags, and onward links.
4. Tag pages for the new tags render without slug collisions.
5. `pnpm typecheck`, `pnpm lint`, `pnpm prettier`, `pnpm test -- --runInBand`, and `pnpm build` exit 0.
6. The blog e2e discovery spec expects exactly six post links.
7. At 375px, `/blog` and the three new detail routes do not overflow horizontally.
8. No secret, hostname, IP, internal URL, or source-project identifier appears in the new content.

## Verification plan

1. Record a pre-change baseline: `git status`, existing blog count, current e2e count.
2. Write the three posts and the fixture update.
3. Run a frontmatter inventory through the repository parser.
4. Run `pnpm typecheck`, `pnpm lint`, `pnpm prettier`, `pnpm test -- --runInBand`, and `pnpm build`.
5. Start the production build and fetch the four routes, checking status and key strings.
6. Use Playwright/Chromium at 375px and desktop widths to check overflow and rendered headings.
7. Run the dynamic-content blog test if the browser environment is available.
8. Commit and push.

## Outcome

Implemented and pushed as commit `7cdd8ed` (`feat(blog): add three new dispatches`). The final tree adds the three posts, updates the exact e2e blog count to six, and refreshes the home/blog README screenshots. Typecheck, lint, Prettier, 251 Jest tests, the 173-page production build, image/contrast/token/font gates, the production browser checks, and the serial `dynamic-content` Chromium journeys pass. Evidence: `.omo/evidence/task-three-dispatch-content.txt`.

## Non-goals

- No redesign of the blog index or detail page.
- No new hero images or OG images.
- No change to blog schema, tag canonicalisation, sitemap logic, or home page selection logic.
- No deployment; Vercel credentials are outside this task.
