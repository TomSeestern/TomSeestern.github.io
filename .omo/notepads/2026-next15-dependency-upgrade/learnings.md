# Learnings — 2026-next15-dependency-upgrade

Conventions, patterns, and successful approaches discovered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## Canonical Host URL Unification & Page Marquee Hoisting
- Unified canonical URL domain across `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx` using `metadataBase` imported from `app/layout.tsx` (fallback `https://tom.segbers.de`), fixing domain drift (`tomsegbers.de` -> `tom.segbers.de`).
- Updated `app/blog/entry/[slug]/page.test.tsx` expectation to match canonical `https://tom.segbers.de`.
- Hoisted `getAllProjects()` call in `app/page.tsx` to single `const projects = getAllProjects()` before double marquee mapping rows to avoid redundant file system reading/parsing.


- Reordering `contactFormSchema.safeParse` before `checkRateLimit` in `lib/sendEmail.tsx` prevents invalid form submissions from consuming rate-limit quota.
- Running `unset PNPM_HOME npm_config_prefix && pnpm test lib/sendEmail.test.tsx` successfully executes the Jest suite inside the dev environment.

## Next.js 15 ESLint CLI Migration
- Updated `package.json` lint scripts from deprecated `next lint` / `next lint --fix` to direct ESLint CLI `eslint . --ext .ts,.tsx` / `eslint . --ext .ts,.tsx --fix`.
- ESLint CLI execution (`unset PNPM_HOME npm_config_prefix && pnpm run lint`) runs directly against all `.ts` and `.tsx` files in the repository.


## Storybook 9.1.20 Migration & CSF3 Story Conversion
- Updated `.storybook/main.ts` addons to `["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-docs"]` and removed `*.stories.mdx` from `stories` glob pattern.
- Updated `.storybook/preview.ts` import source to `@storybook/nextjs` and removed deprecated `actions.argTypesRegex` setting.
- Converted `ArticleTeaser.stories.tsx`, `ProjectTeaser.stories.tsx`, and `Button.stories.tsx` from legacy `Story<T>` / `Template.bind({})` format to standard CSF3 `StoryObj` format importing from `@storybook/nextjs`.
- Verified test execution with `unset PNPM_HOME npm_config_prefix && pnpm test`.

## Next.js 15 Async Params and Dynamic Request APIs Migration
- Converted `params` in `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx` to `Promise<{ slug: string }>` in type definition, `Page`, and `generateMetadata`.
- Made `Page` async in both routes and destructured `const { slug } = await params`.
- Updated `lib/sendEmail.tsx` so `getClientIP()` is `async` and awaits `headers()`.
- Replaced passing component function `icon={HiHome}` to `BreadcrumbItem` with inline `<HiHome className="mr-2 inline h-4 w-4" />` inside `BreadcrumbItem` children to avoid Next.js 15 Client Component function serialization errors during prerendering.
