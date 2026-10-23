---
id: multimodal-travel-planning-app-development
title: "SouDest: A Native Android Multimodal Travel Planner"
articleDate: 2020-12-01
articleContent: I developed the native Android client for SouDest, a multimodal travel planner that compares routes by price, travel time, and CO2 emissions.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Android developer
outcome: Shipped a native Android MVP in roughly 30 hours as part of the three-tier SouDest system.
metrics:
  - label: Build time
    value: ~30 hours
  - label: Team
    value: 2 developers + designer
heroImage: /img/projects/soudest-android.png
links:
  - label: SouDest Android on GitHub
    href: https://github.com/TomSeestern/SouDest
tags:
  - AndroidAppDevelopment
  - FullStackWebDevelopment
  - MobilitySolutions
technologies:
  - Android
  - Java
  - React
  - Git
  - Figma
  - AndroidStudio
---

Thirty hours is enough to find out which features are actually essential. Building the whole travel planner was never realistic.

## The problem

SouDest was a 2020 full-stack travel-planning project built around a user question that existing tools answered poorly: which route best fits my price, travel-time, and CO2 priorities? I developed the product with design support, covering Android, web, and backend components.

The Android client had to support login and registration, a profile, route search, API integration, search and filter masks, bookmarking, and export. The interface had to make several transport modes comparable without turning the result screen into a spreadsheet.

## The build

I built the native Android client in Java with Gradle and Android Studio. We used Figma to align the flow before implementation and tested the app against the backend API as the integration points stabilised. The client was one layer of a three-part system, so the API contract had to stay stable enough for three clients with different constraints.

The 30-hour build window forced decisions. We reused the existing design system and avoided features that did not help a user compare routes. I treated loading, empty, and error states as part of the flow rather than something to add after the happy path worked. That was my first practical lesson in consuming an API designed for more than one client.

The Android client was also my first serious use of fragments, RecyclerView adapters, and a shared API model across multiple screens. Java's type system helped, but the real lesson was state ownership: who loads the data, who keeps it alive across a tab switch, and what happens when the network answers after the user has moved on. Those questions shaped the client more than the layout did. I kept the first version deliberately narrow: one search flow, one result view, one saved-items path.

## The result

We shipped a native Android MVP that could authenticate, search, and present multimodal options. It was a coherent end-to-end client that proved the core workflow, even though it was not a production travel product. The time constraint made the result more honest: every screen had to justify its place. Testing on a physical device exposed layout and lifecycle problems that the emulator hid, especially around rotation and slow network responses. I fixed those before the final demo, and the app felt more like a product because of it.

## What I took from it

The project taught me how much product clarity comes from constraint. A short build window makes it obvious which features are essential and which are habits. I would now add offline handling, stronger loading and error states, and automated UI tests before calling the app finished. The MVP was a useful first pass at all three surfaces.
