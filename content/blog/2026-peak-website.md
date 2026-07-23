---
title: Rebuilding My Portfolio Site to Peak Grade
articleDate: 2026-07-21
articleContent: Taking a personal website from "it works" to "I'd show this to a potential employer" — the stack, the decisions, and what peak grade actually means.
authorImgSrc: /img/logo.png
authorName: Tom Segbers
tags:
  - Web Development
  - Portfolio
  - Next.js
  - TypeScript
---

# Rebuilding My Portfolio Site to Peak Grade

I've had a portfolio site for years. It checked the box. It had my name, a few projects, and a contact form that occasionally worked. But I never wanted anyone to look at the code.

That changes now.

## What "peak grade" means

Peak grade is a personal standard, not a benchmark you'll find in a style guide. For me it's three things:

1. **I'd show the code to a peer** without making excuses first.
2. **The design doesn't distract** from the content. Clean typography, sensible spacing, obvious navigation.
3. **The content is honest.** No recruiter-bait language, no "passionate about leveraging synergies." Just what I do and how I do it.

## Stack decisions

The site is built with Next.js 14 and TypeScript in strict mode. I chose the App Router over Pages Router because static generation with `generateStaticParams` and server components felt like the right fit for a content site that rebuilds on deploy.

Content lives as Markdown files with YAML frontmatter, parsed by `gray-matter` and validated through Zod schemas. No CMS, no database, no runtime writes. Every page is statically exported at build time.

Here's the core content loading pattern:

```typescript
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export function getPage(slug: string): matter.GrayMatterFile<string> | null {
  const filePath = path.join(process.cwd(), "content/pages", `${slug}.md`)
  try {
    return matter(fs.readFileSync(filePath, "utf8"))
  } catch {
    return null
  }
}
```

This keeps every page predictable. The build either generates a page with content or it doesn't. No runtime surprises.

## Then vs now

| Aspect | Old site | Peak grade |
|--------|----------|------------|
| Framework | Hand-rolled HTML + CSS | Next.js 14 (App Router) |
| Content | Hardcoded in JSX | Markdown + gray-matter + Zod |
| Type safety | None | Strict TypeScript, no `any` |
| Testing | Manual reloads | Jest + Playwright + Storybook |
| Deploy | rsync to a VPS | Vercel, auto-deploy on push |
| Content editing | Edit JSX, redeploy | Edit Markdown, commit, push |
| Design | Bootstrap defaults | Tailwind with a custom theme |

## What's still missing

I want syntax highlighting on code blocks, so `rehype-pretty-code` and Shiki are next. The blog needs RSS, which was built into my old site but isn't wired up here yet. And I haven't decided whether to add dark mode or keep it light-only. Dark mode is the default expectation now, but a well-done light theme stands out.

## The real test

A portfolio site passes the test when someone reads it and understands what you do, how you think, and whether they want to work with you. Everything else is just implementation.

If you're reading this and the site looks broken, I'm probably tweaking something. Refresh in five minutes.
