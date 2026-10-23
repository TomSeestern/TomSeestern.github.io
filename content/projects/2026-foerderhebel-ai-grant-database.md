---
id: foerderhebel-ai-grant-database
title: "Foerderhebel: A Multilingual Grant Discovery Engine"
articleDate: 2026-10-22
articleContent: I built Foerderhebel, a multilingual grant discovery platform that turns fragmented German funding sources into 179 structured programs across German, English, and French.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Solo developer
outcome: Built a multilingual grant database and AI-assisted research pipeline covering 179 programs in three languages, with faceted search and provenance metadata.
metrics:
  - label: Grant programs
    value: "179"
  - label: Languages
    value: DE / EN / FR
  - label: Localized records
    value: "537"
  - label: Topic hubs
    value: "5"
heroImage: /img/projects/foerderhebel-home.jpg
tags:
  - AI
  - Data Engineering
  - Next.js
  - Public Funding
  - Search
technologies:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Zod
  - Perplexity AI
  - MDX
---

Germany publishes a lot of grant money. Finding the programme you actually qualify for is still a research project.

## The problem

Grant research in Germany is fragmented across federal ministries, state programmes, and intermediary organisations. The information is public, but finding the programmes that fit a company and keeping their deadlines current is a full-time research job. Small teams often give up before they reach the right programme.

Foerderhebel turns that research into a searchable product. The content model currently holds 179 grant programmes, localised into German, English, and French: 537 MDX records in total. Each record carries structured frontmatter for eligibility, funding amount, deadlines, scope tags, the primary source URL, source authority, last-checked date, and secondary sources.

## The build

The discovery pipeline starts from a list of seed sources, scrapes for new programme names, filters duplicates against the existing corpus, and uses Perplexity AI to research the details. It writes the result as validated MDX and keeps a stale queue plus an append-only audit log. That structure matters because grant data decays: a programme can close, change its deadline, or move to a new URL. Provenance and freshness are part of the schema, not an afterthought.

Zod validates the records at build time, so a malformed grant cannot silently ship as a blank detail page. The front end exposes faceted search, an eligibility checklist, deadline countdowns, saved grants, and five curated topic hubs. A matching flow maps a founder profile to relevant programmes, and the app also exposes a small B2B API for grants, similar programmes, and recommendations.

The stack is Next.js App Router with React, TypeScript, Tailwind, MDX, and a strict validation layer. The project includes Jest, Playwright, Storybook, and Lighthouse gates. The public domain is not linked while it is parked, so this case file documents the system and its evidence rather than pointing at a live site.

The matching layer was the part that turned a database into a product. It scores a founder profile against structured eligibility and topic signals, then explains why a programme is a fit. I kept the score and the supporting fields visible so the user can challenge the recommendation instead of treating it as an oracle.

## The result

Foerderhebel turns fragmented grant information into a multilingual product with structured records, faceted discovery, deadline awareness, saved grants, and matching. The current corpus is 179 programmes and 537 localised records across three languages.

## What I took from it

The hardest part was deciding when a grant is trustworthy enough to publish, how to represent uncertainty, and how to keep three language versions from drifting apart. Scraping more pages was the smaller problem. A database of public information is only useful if the user can tell where a claim came from and when it was last true.

That is the part I would carry into any research-heavy product: make provenance visible, make freshness a first-class field, and design for the fact that the source will change after you ship.
