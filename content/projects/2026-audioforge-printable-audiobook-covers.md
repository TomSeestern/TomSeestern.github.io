---
id: audioforge-printable-audiobook-covers
title: "AudioForge: 3D-Printable Covers for Audiobooks"
articleDate: 2026-09-29
articleContent: I built AudioForge, a self-hosted web app that turns Audiobookshelf libraries into 3D-printable book covers with a live Three.js preview and browser-side STL export.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Solo developer
outcome: Built a browser-side pipeline from audiobook metadata and cover art to printable ASCII STL, with live preview, bulk generation, and print estimates.
metrics:
  - label: Output
    value: ASCII STL
  - label: Preview
    value: Three.js
  - label: Emboss depth
    value: 0.2–1.5 mm
  - label: Book dimensions
    value: 63.5 × 102 × 10 mm
heroImage: /img/projects/audioforge-preview.png
tags:
  - 3D Printing
  - Generative Design
  - Audiobooks
  - Next.js
  - Three.js
technologies:
  - TypeScript
  - Next.js
  - React
  - Three.js
  - Audiobookshelf API
  - Serwist
  - Vitest
---

Audiobooks live in an app; a bookshelf is physical. AudioForge closes that gap by turning an audiobook's cover and metadata into a 3D-printable book model with an embossed cover surface.

## The problem

Audiobookshelf users can build a large digital library, but the result is still a grid on a screen. I wanted a way to turn that library into something you can put on a shelf: a small, printable book object that carries the cover, title, author, and duration of the audiobook.

The product had to support two very different workflows. In local mode it connects to an Audiobookshelf server through its REST API. In public mode it runs without an Audiobookshelf instance: a user enters a title, author, duration, and cover image, or starts from a bundled public-domain sample, and the whole generation flow stays in the browser.

## The build

I built AudioForge with TypeScript, Next.js, React, Three.js, Serwist, and the Audiobookshelf API. The local mode keeps the bearer token in server memory so it never reaches the browser. Manual records and generated STLs live in IndexedDB, and the manual flow does not upload book data or STL bytes to the server.

The generation pipeline turns the cover image into a height field, applies the selected cover style and emboss depth, and builds a printable mesh around the book block. A live Three.js preview shows the result before export, including style, colour quantisation, spine text, and dimensions. The defaults use a 1:2 book at 63.5 × 102 × 10 mm, with an emboss depth between 0.2 mm and 1.5 mm.

Bulk generation runs across a selection, reports per-book progress, and estimates print time and material cost. I kept the output deliberately conservative: an ASCII STL generated in the browser. It is not a byte-for-byte model of every slicer's expectations, so the app tells users to open the file in the browser and slicer combination they actually plan to use. A printable file that looks right in a preview but fails on the printer is worse than a clear caveat.

I built the UI around the two real workflows, connecting a library or creating a cover manually, rather than around a generic file converter. The project includes deterministic screenshots, unit and contract tests, and a browser-side generation path that can be exercised without an Audiobookshelf instance.

## The result

AudioForge turns audiobook metadata into a printable object with a live preview, bulk generation, and print estimates. It runs locally through the app; there is no public deployment link, so this case file is the evidence trail rather than a live demo.

## What I took from it

The project was a lesson in designing around a physical output. A 3D model is not finished when it looks correct; it is finished when someone can print it, and that means respecting the limits of the tools downstream. It also reinforced a privacy principle I care about: a local workflow should not quietly become a data-collection workflow.
