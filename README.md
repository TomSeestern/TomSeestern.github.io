# TomSegbers.de — Personal Portfolio of Tom Segbers, Senior Developer

Source for [tom.segbers.de](https://tom.segbers.de), a personal portfolio site.
Static, no auth, no database, no tracking. Content lives as Markdown files under
`content/`. The site is built with the Next.js App Router and statically exported
on deploy.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Content](#content)
- [Testing](#testing)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Environment Variables](#environment-variables)
- [License](#license)

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** with React 19, App Router, static export
- **[TypeScript](https://www.typescriptlang.org/)** in `strict` mode,
  `noUncheckedIndexedAccess` on, `unknown` over `any`, Zod at boundaries
- **[Tailwind CSS](https://tailwindcss.com/)** with
  [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin)
  for Markdown body text
- **[Flowbite React](https://flowbite-react.com/)** for UI primitives
  (navbar, footer, buttons, alerts, tooltips)
- **[Nix flake](https://nixos.org/)** + **[direnv](https://direnv.net/)** for a
  reproducible dev shell (Node 22, pnpm, git, Playwright Chromium libs)
- **[pnpm](https://pnpm.io/)** as the package manager
  (`packageManager: pnpm@10.15.1`)
- **[Jest](https://jestjs.io/)** with
  [React Testing Library](https://testing-library.com/react) for unit and
  component tests
- **[Playwright](https://playwright.dev/)** for end-to-end tests
- **[Resend](https://resend.com/)** for the contact form server action
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** for Markdown
  frontmatter parsing
- **[await-to-js](https://github.com/scopsy/await-to-js)** for explicit async
  error tuples
- **[T3 Env](https://env.t3.gg/)** for type-safe environment variables

## Getting Started

```bash
git clone <repo-url> TomSegbers.de
cd TomSegbers.de
direnv allow          # activates the Nix devShell with Node 22 + pnpm
pnpm install --frozen-lockfile
pnpm dev              # http://localhost:3000
```

`direnv allow` loads the Nix flake declared in `flake.nix` and `.envrc`, which
provides `nodejs_22`, `pnpm`, `git`, and the shared libraries Playwright
Chromium needs. If you skip Nix, install Node.js >= 18.17 and pnpm yourself.

Note on the Nix devShell: it exports `PNPM_HOME` and `npm_config_prefix` as
`null`, which crashes pnpm 11. When running pnpm inside the devShell, unset
them first:

```bash
unset PNPM_HOME npm_config_prefix
```

A pre-commit hook enforces
[Conventional Commits](https://www.conventionalcommits.org/) via
`.pre-commit-config.yaml`. It is installed automatically by `pre-commit install
-t commit-msg` once `pre-commit` is available in your shell.

## Available Scripts

From `package.json`:

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server with colorized output |
| `pnpm build` | Production build, generates static pages |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | Run `next lint` (ESLint) |
| `pnpm lint:fix` | Auto-fix lint errors |
| `pnpm prettier` | Check formatting |
| `pnpm prettier:fix` | Apply Prettier fixes |
| `pnpm test` | Run Jest unit and component tests |
| `pnpm e2e:headless` | Run Playwright e2e tests in headless mode |
| `pnpm e2e:ui` | Run Playwright e2e tests with the interactive UI |
| `pnpm analyze` | Build with `@next/bundle-analyzer` enabled |
| `pnpm coupling-graph` | Render module dependency graph to `graph.svg` via Madge |
| `pnpm format` | Apply Prettier to `*.ts`, `*.tsx`, `*.md` |

For e2e tests, Playwright needs a Chromium browser. Inside the Nix devShell,
set `PLAYWRIGHT_BROWSERS_PATH` to the local cache so Playwright finds a
matching build:

```bash
export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright
```

## Project Structure

```
.
├── AGENTS.md                  # Agent-facing project rules and conventions
├── README.md
├── LICENSE
├── flake.nix                  # Nix devShell: Node 22, pnpm, git, Chromium libs
├── flake.lock
├── .envrc                     # direnv entry: `use flake`
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── env.mjs                    # T3 Env schema (server + client vars)
├── tsconfig.json
├── jest.config.js
├── jest.setup.js
├── playwright.config.ts
├── tailwind.config.js
├── postcss.config.js
├── prettier.config.js
├── .eslintrc.js
├── git-conventional-commits.yaml
├── .pre-commit-config.yaml
├── app/
│   ├── layout.tsx             # Root layout: Header, Footer, metadata, viewport
│   ├── page.tsx               # Home: hero, projects marquee, blog teasers
│   ├── not-found.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx       # Contact form ("use client")
│   ├── blog/page.tsx          # Blog listing
│   ├── blog/entry/[slug]/page.tsx   # Blog detail, generateStaticParams
│   ├── projects/page.tsx      # Projects listing
│   └── projects/entry/[slug]/page.tsx  # Project detail, generateStaticParams
├── components/
│   ├── ArticleTeaser/         # Blog post card
│   ├── Button/
│   ├── Footer/
│   ├── Header/                # Flowbite Navbar
│   ├── PersonTeaser/
│   ├── ProjectTeaser/         # Project card with technology icons
│   ├── TimelineEntry/
│   └── Tooltip/
├── lib/
│   ├── markdown.ts            # Shared gray-matter + Zod frontmatter reader
│   ├── blog.tsx               # getAllBlogPosts(): wraps markdown reader
│   ├── projects.tsx           # getAllProjects(): wraps markdown reader
│   ├── icon-map.ts            # Maps technology strings to icon paths
│   ├── sendEmail.tsx          # Server action, Resend contact form
│   ├── markdown.test.ts
│   └── sendEmail.test.tsx
├── content/
│   ├── blog/*.md              # Blog posts
│   └── projects/*.md          # Project entries
├── e2e/
│   ├── home.spec.ts
│   ├── static-routes.spec.ts
│   └── dynamic-content.spec.ts
├── tests/                     # Jest test helpers
├── public/
│   ├── img/                   # Photos and the OG logo
│   └── icon/                  # SVG icons used in components
├── styles/
│   └── tailwind.css           # Tailwind entry, imports Flowbite
└── scripts/
    └── check-project-frontmatter.js  # Validates project Markdown frontmatter
```

## Content

All site content is Markdown with YAML frontmatter, loaded at build time by
`lib/markdown.ts`. No CMS, no database, no runtime writes. Files live in two
collections:

- `content/blog/` for blog posts, served under `/blog/entry/<slug>`
- `content/projects/` for project entries, served under `/projects/entry/<slug>`

The slug is the file name without the `.md` extension. `lib/blog.tsx` and
`lib/projects.tsx` are thin wrappers around the shared reader.

Each Markdown file requires this frontmatter:

```md
---
title: Story Title
articleDate: 2024-01-15
articleContent: Short teaser shown on listings and OG descriptions.
authorImgSrc: /img/example.png
authorName: Tom Segbers
# Projects only:
technologies:
  - TypeScript
  - Next.js
---

Body of the post or project write-up in Markdown.
```

`lib/markdown.ts` parses frontmatter with `gray-matter` and validates it
through a Zod schema. Every field has a `.default()` and `.catch()` fallback so
malformed frontmatter never breaks the build; missing values fall back to
placeholder strings. Entries are sorted by `articleDate` descending.

The body is rendered as Markdown on the detail pages via `react-markdown`, and
the `@tailwindcss/typography` plugin styles the rendered HTML through the
`prose` class family.

## Testing

Two layers, each with a dedicated runner. CI runs lint, Prettier, Jest, and Playwright end-to-end tests.

**Jest** for unit and component logic (`pnpm test`). Component tests use
React Testing Library and assert behavior through accessible queries. The
shared Markdown reader and the contact form server action have their own
focused suites in `lib/`.

**Playwright** for end-to-end coverage (`pnpm e2e:headless`). Specs live in
`e2e/` and assert post-hydration DOM, not just server HTML. The contact form
spec sets `E2E_CONTACT_FORM_SUCCESS=true` so `sendEmail` succeeds without
calling Resend. Playwright's `webServer` boots `next dev` on port 3030
automatically.

## Deployment

Deployed on [Vercel](https://vercel.com/) via the GitHub integration. A push
to `main` triggers a build and a production deploy; rollbacks are performed
through the Vercel dashboard.

`pnpm build` runs `next build` and statically generates all pages; the build
currently emits 36 static routes. The only server-side runtime code is the
contact form server action, which calls the Resend API. The site has no
middleware, no instrumentation hook, no OpenTelemetry, and no custom API
routes beyond the Next.js health-check rewrites in `next.config.mjs`.

For local production verification:

```bash
pnpm build
pnpm start         # http://localhost:3000
```

## Conventions

- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/)
  and are enforced by the `commit-msg` hook in `.pre-commit-config.yaml`.
- **Async error handling** uses [await-to-js](https://github.com/scopsy/await-to-js).
  Async functions that can fail return `[error, result]` tuples rather than
  throwing. Example from the codebase:

  ```ts
  import to from "await-to-js"
  const [error] = await to(resend.emails.send(emailData))
  if (error) {
    console.error(error)
    return false
  }
  ```

- **Tailwind class merging** uses `tailwind-merge`, and component variants
  use `class-variance-authority`. See the `Button` component for the pattern.
- **Type safety** is strict. `tsconfig.json` has `strict` and
  `noUncheckedIndexedAccess` enabled. `@total-typescript/ts-reset` tightens
  built-in types. Runtime validation at trust boundaries (Markdown
  frontmatter, env vars, contact form input) uses Zod schemas.
- **Project rules** for agents and contributors live in
  [AGENTS.md](./AGENTS.md). Read it before non-trivial changes.

## Environment Variables

Environment variables are validated at build time with
[T3 Env](https://env.t3.gg/). The schema lives in `env.mjs`:

```ts
export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().optional(),
    E2E_CONTACT_FORM_SUCCESS: z.enum(["true"]).optional(),
    ANALYZE: z.enum(["true", "false"]).optional().transform((v) => v === "true"),
  },
  client: {},
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    E2E_CONTACT_FORM_SUCCESS: process.env.E2E_CONTACT_FORM_SUCCESS,
    ANALYZE: process.env.ANALYZE,
  },
})
```

`RESEND_API_KEY` is optional so the build passes in CI and local dev without
a key. It is required in production for the contact form to actually deliver
mail. Set it in `.env.local` (gitignored) or as a Vercel environment variable.
`E2E_CONTACT_FORM_SUCCESS` is a test-only override that makes the contact
form server action short-circuit success without hitting Resend.

## License

MIT. See [LICENSE](./LICENSE) for details.
