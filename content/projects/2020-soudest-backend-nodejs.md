---
id: soudest-backend-nodejs
title: "SouDest Backend: Node.js, Passport, and JWT"
articleDate: 2020-12-30
articleContent: I co-developed a Node.js and Express backend for SouDest, separating travel-planning APIs from authentication, sessions, and persistent SQL data.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Backend developer
outcome: Delivered a Node.js/Express API with Passport authentication, JWT routes, and SQL persistence for the SouDest clients.
links:
  - label: SouDest backend on GitHub
    href: https://github.com/TomSeestern/soudest_backend
tags:
  - NodeJS
  - BackendDevelopment
  - MultimodalTravelPlanner
technologies:
  - NodeJS
  - Passport
  - SQL
  - GoogleMaps
  - JWT
  - Express
---

A travel planner is a state problem disguised as a map problem.

## The problem

SouDest needed a backend that could support travel planning across different transport modes while keeping user preferences, authentication, and route data separate. I co-developed the service in Node.js and Express with a project partner.

The backend had to serve two different clients, the React web app and the native Android app, without letting either client dictate the data model. It also had to handle login, registration, saved routes, and route results that could contain several connected transport modes.

## The build

We used SQL for persistent application data and Express for the HTTP API. Passport handled both username-and-password login and Google authentication. I designed the authentication layer to support two use cases: stateful sessions for browser flows and JWT-protected routes for clients that needed stateless access. Keeping those paths explicit avoided mixing cookie assumptions into every API endpoint.

The data model separated users, locations, and edges. That structure gave the route API a vocabulary for places and connections while keeping user-specific state out of the route graph. Google authentication reduced registration friction, while local credentials remained available for users who preferred them.

We built iteratively, starting with the data model and authentication flows before integrating the rest of the application. Clear ownership between two developers helped: one person could change a client-facing flow while the other stabilised backend behaviour and testing. We tested the endpoints against the clients instead of assuming a successful response was the same as a usable contract.

The API contract was the real deliverable. The Android and web clients could tolerate different layouts, but they could not tolerate different meanings for a route, a transfer, or an authenticated user. I kept the response shape explicit and tested the endpoints against both clients, which exposed mismatches earlier than a unit test of the route handler would have. Sequelize gave those models a single definition that both the route logic and the authentication flow could use.

## The result

We delivered a Node.js/Express API with Passport authentication, JWT routes, SQL persistence, and the data structures needed by the SouDest clients. It was a student project, but it behaved like a small service: clients could authenticate, store user data, and request route information through a stable boundary. The contract held across both clients, which meant a route looked the same whether it was rendered on the web or on Android.

## What I took from it

This project made session management and API boundaries tangible for me. If I rebuilt it now, I would make token expiry, refresh flows, audit logging, and automated integration tests first-class concerns. The core lesson was that authentication is not a checkbox. It shapes how every client reaches the system.
