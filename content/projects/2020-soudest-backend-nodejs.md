---
title: SouDest Backend - A Multimodal Travel Planner Backend With NodeJS
articleDate: 2020-12-30
articleContent: |-
  I co-developed a Node.js and Express backend for SouDest, separating travel-planning API concerns from authentication, sessions, and persistent SQL data.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
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

SouDest needed a backend that could support travel planning across different transport modes while keeping user preferences, authentication, and route data separate. I co-developed the service in Node.js and Express with a project partner.

We used SQL for persistent application data and Express for the HTTP API. Passport handled both username-and-password login and Google authentication. I designed the authentication layer to support two use cases: stateful sessions for browser flows and JWT-protected routes for clients that needed stateless access. Keeping those paths explicit avoided mixing cookie assumptions into every API endpoint.

The service was part of a broader product that compared routes on price, journey time, and CO2 emissions. This drove the API design: the backend had to accept user-defined criteria, return data in a form the frontend could render, and preserve user-specific features such as saved routes. Google authentication was chosen because it reduced registration friction, while local credentials remained available for users who preferred them.

We built iteratively, starting with the data model and authentication flows before integrating the rest of the application. Clear ownership between two developers helped: one person could change a client-facing flow while the other stabilized backend behaviour and testing.

This project made session management and API boundaries tangible for me. If I rebuilt it now, I would make token expiry, refresh flows, audit logging, and automated integration tests first-class concerns. The core lesson was that authentication is not a checkbox. It shapes how every client reaches the system.
