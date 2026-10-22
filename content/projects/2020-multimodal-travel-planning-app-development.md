---
id: multimodal-travel-planning-app-development
title: Charting New Routes with the SouDest Multimodal Travel Planner App
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

SouDest was a 2020 full-stack travel-planning project built around a user question that existing tools answered poorly: which route best fits my price, travel-time, and CO2 priorities? I developed the product with design support, covering Android, web, and backend components.

The Android client was a native Java application built in Android Studio with Gradle. It handled login and registration, a profile, route search, API integration, search and filter masks, bookmarking, and export. The interface had to make several transport modes comparable without turning the result screen into a spreadsheet. We used Figma to align the flow before implementation and tested the app against the backend API as the integration points stabilised.

The client was one layer of a three-part system. A React web frontend and a Node.js backend covered the other surfaces, so the API contract had to stay stable enough for three clients with different constraints. That was my first practical lesson in designing a backend response for more than one consumer.

We built the Android MVP in roughly 30 hours. That constraint forced decisions: reuse the existing design system, keep the first flow narrow, and avoid features that did not help a user compare routes. The result was not a production travel product, but it was a coherent end-to-end client that could authenticate, search, and present multimodal options.

## What I took from it

The project taught me how much product clarity comes from constraint. A short build window makes it obvious which features are essential and which are habits. It also showed me that a mobile client is only as good as the API contract behind it; the interface can be polished, but inconsistent data will still make the product feel broken.

I would now add offline handling, stronger loading and error states, and automated UI tests before calling the app finished. The MVP was a useful first pass at all three surfaces.
