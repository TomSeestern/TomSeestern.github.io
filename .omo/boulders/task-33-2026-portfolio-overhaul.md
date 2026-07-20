# Task 33 — Metadata, OG images, viewport (Wave 7)

- [x] **should** export `viewport` from app/layout.tsx with width=device-width, initialScale=1
- [x] **should** export root `metadata` from app/layout.tsx with title template, description, OG defaults
- [x] **should** add description + OG/Twitter images to app/page.tsx metadata
- [x] **should** add description + OG image to app/projects/page.tsx metadata
- [x] **should** add description + OG image to app/blog/page.tsx metadata
- [x] **should** add description + OG image to app/about/page.tsx metadata
- [x] **should** add metadata export to app/contact/page.tsx (title, description, OG)
- [x] **should** add description (from articleContent frontmatter) + OG image to app/blog/entry/[slug]/page.tsx generateMetadata
- [x] **should** add description (from articleContent frontmatter) + OG image to app/projects/entry/[slug]/page.tsx generateMetadata
- [x] **should** pass pnpm build (EXIT_CODE=0)
- [x] **should** emit correct title, description, og:*, twitter:*, viewport meta tags on all tested routes
- [x] **should** produce evidence + notepad learning entry + cleanup receipt

Started: 2026-07-19
Completed: 2026-07-19
Evidence: .omo/evidence/task-33-2026-portfolio-overhaul.txt
Commit: feat(seo): add metadata, OG images, and viewport config to all pages