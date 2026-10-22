---
id: everyfont-ever-generative-typeface-engine
title: "EveryFontEver: The Library of Babel for Typefaces"
articleDate: 2026-10-22
articleContent: I built EveryFontEver.com, a browser-side generative typeface engine that maps 2^7600 possible fonts to shareable Babel addresses and exports real TTF files.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Solo developer
outcome: Launched a live generative typeface engine with shareable font addresses and client-side TrueType export.
metrics:
  - label: Possible fonts
    value: 2^7600
  - label: Printable ASCII glyphs
    value: "95"
  - label: Address length
    value: 1,330 characters
heroImage: /img/projects/everyfont-ever.png
links:
  - label: EveryFontEver.com
    href: https://everyfontever.com
tags:
  - Generative Design
  - TypeScript
  - Next.js
  - Creative Coding
technologies:
  - NextJS
  - TypeScript
  - TailwindCSS
  - Zustand
  - TrueType
---

Every typeface has a shape. EveryFontEver gives every possible shape a permanent address.

## The problem

EveryFontEver.com is a generative typeface engine built around a strange question: what if every printable ASCII typeface could have a permanent address, and the address itself could be used to reconstruct the font? The result is a browser application that treats type design as a reversible encoding problem.

The product has to make an enormous space navigable. A user can randomise a font, load a historic archetype, paste an address, warp the global parameters, or edit individual glyph bits. Each action has to leave a trace that can be shared, restored, and exported as a real TrueType file.

## The build

The system maps a font to a 1,330-character Babel address using a four-round reversible Feistel cipher. Edit the address, and the font changes. Warp the font, and the address rewrites. The space contains 2^7600 possible fonts, which is large enough that the interface has to make navigation feel intentional rather than random. The payload is 950 bytes: 95 global parameter bytes plus 95 glyphs, each with nine bytes of per-glyph modulation.

I built it with Next.js 16, TypeScript, Tailwind CSS v4, and zustand. The engine runs entirely in the browser, including TrueType export, so a user can generate a font and leave with a real TTF file rather than a screenshot. That client-side constraint shaped the architecture: state has to be serialisable, the address has to be shareable, and every generated font has to survive a page reload with the same result.

The application provides a specimen panel, a glyph grid, a ledger of six historic archetypes, a matrix editor for per-glyph payload bits, a comparison view, and deep links that carry the address in the URL fragment. The matrix editor is keyboard-navigable, announces every toggle to screen readers, and has a capped undo stack. The project is covered by unit, e2e, accessibility, visual-regression, and performance gates.

## The result

EveryFontEver.com is live and exports real TTF files. The interface makes a 2^7600 space feel like a tool: generate, inspect, edit, compare, save, and share. The site is at everyfontever.com.

## What I took from it

EveryFontEver sits at the intersection of creative tooling and systems design. It required the same discipline as a production application: a typed engine, reproducible state, export paths that actually work, and a UI that explains itself without a manual.

The project also changed how I think about generative interfaces. It is easy to produce something novel; it is harder to give a user a clear sense of what they are looking at, how to change it, and how to return to a result later. The address format, the visual ledger, and the direct manipulation controls are all attempts to answer that.
