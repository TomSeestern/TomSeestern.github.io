---
id: soudest-multimodal-travel-planner-frontend
title: "SouDest Frontend: React, TypeScript, and Route Comparison"
articleDate: 2020-04-20
articleContent: I built the responsive React frontend for SouDest, turning multimodal route data into comparable options with filters, bookmarks, and export.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Frontend developer
outcome: Delivered a responsive React and TypeScript frontend for the SouDest multimodal travel planner.
metrics:
  - label: Team
    value: 2 developers + designer
  - label: Stack
    value: React, TypeScript, Material-UI
heroImage: /img/projects/soudest-web.jpg
links:
  - label: SouDest frontend on GitHub
    href: https://github.com/TomSeestern/soudest_frontend
tags:
  - React
  - Multimodal Transportation
  - Travel Planning
  - User Experience
  - Frontend Development
technologies:
  - React
  - TypeScript
  - Material-UI
  - Jest
  - ESLint
  - GoogleMaps
  - Webpack
---

A route comparison screen has to answer a question, not display every variable it knows.

## The problem

SouDest was a university project built by a team of two developers with support from one designer. The product question was straightforward: can a traveller compare routes across different transport modes using the criteria that actually matter, such as price, travel time, and CO2 emissions?

I built the responsive web frontend in React and TypeScript with Material-UI. The app included login and registration, a profile, route search, API integration, filters, bookmarking, and export. Google Maps provided the route and map layer, while Jest and ESLint gave us a way to keep the growing component tree honest.

## The build

The main challenge was information density. A multimodal planner has more variables than a simple directions app: price, duration, transfers, emissions, and user preferences all compete for space. Material-UI gave us accessible primitives, but the hard part was deciding what to show first. We used the designer's Figma flows as a starting point, then simplified screens after testing the API responses with real route data.

The frontend was one client in a three-part system. It shared a backend with the Android app and had to stay compatible as the Node.js API evolved. That meant treating the API response as a contract and keeping loading, empty, and error states explicit instead of assuming the happy path. The result view combined a map, a summary, and a comparable list rather than a single "best" route.

The component tree stayed manageable because we kept data loading and presentation separate. A container could fetch routes and handle errors; presentational components could focus on the comparison. That boundary made the UI easier to test and made it possible to change the map layer without rewriting the result list. We still had to check keyboard flow, focus states, and the density of the result cards by hand. That was the part the component library could not decide for us.

## The result

We delivered a responsive React and TypeScript frontend for the SouDest multimodal travel planner. It let a user filter routes, save options, and export a selection, turning a dense set of transport data into a decision surface.

## What I took from it

This project sharpened my frontend skills and gave me a practical understanding of user-centric design: a feature is finished when a user can make a decision with it, not when the component renders. It also showed me how much of frontend quality lives in the states nobody screenshots.

If I rebuilt it today, I would add integration tests around the API boundary, reduce the component surface with a stricter data layer, and design the empty and error states before the happy path.
