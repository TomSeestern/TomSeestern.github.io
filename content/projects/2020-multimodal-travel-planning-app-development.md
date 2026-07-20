---
id: multimodal-travel-planning-app-development
title: Charting New Routes with the SouDest Multimodal Travel Planner App
articleDate: 2020-12-01
articleContent: |-
  I developed SouDest as a full-stack travel planner spanning Android, React web, and Node.js backend clients, letting users compare multimodal routes by price, travel time, and CO2 emissions.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
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

The architecture had three client and service layers. A native Android app in Java and Android Studio offered a mobile experience, while React provided a responsive web client. Both used REST APIs from a Node.js backend. Git kept changes coordinated across the codebases, Gradle handled the Android build, and Figma gave the designer and me a shared source of truth before screens became code.

I made route criteria a product-level concept instead of a hard-coded ranking. Users could set their own preference across price, speed, and emissions, then use live API feeds to inspect results. Secure registration and login, bookmarks, and export options turned a route result into something users could return to and act on.

The technical difficulty was not any one component. It was maintaining one coherent user journey across Android, web, and backend services. I worked closely with the designer to make the same concepts and interaction patterns hold across clients, while preserving clear API boundaries beneath them.

This project taught me how quickly a multi-tier application gains coordination cost. If I rebuilt it today, I would start with a shared API contract, typed client generation, and end-to-end tests for the primary journey. The project remains valuable because it forced me to think beyond individual screens and services, toward the system a user actually experiences.
