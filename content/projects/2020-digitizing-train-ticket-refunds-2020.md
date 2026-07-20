---
id: digitizing-train-ticket-refunds-2020
title: RefundHero - Transforming Train Ticket Reimbursements with Refund Hero
articleDate: 2020-12-31
articleContent: |-
  I built Refund Hero as a full-stack prototype for identifying eligible Deutsche Bahn delay refunds and preparing reimbursement requests. I stopped the project when DB announced a parallel initiative.
authorName: Tom
authorImgSrc: https://placehold.co/512x512.png?text=Tom
tags:
  - Digital Transformation
  - Startup Projects
  - Automation
  - Travel Tech
technologies:
  - Django
  - React
  - BootstrapCSS
  - AWS
  - SQL
---

Refund Hero began with a frustratingly manual process: passengers in Germany had to complete and mail forms to request compensation for delayed Deutsche Bahn journeys. I built the project independently to test whether software could identify eligible journeys and make the reimbursement process less burdensome.

I designed it as a full-stack application with React and BootstrapCSS on the client, Django on the server, MySQL for application data, and AWS for hosting. The backend included an automated lookup service intended to track train delays and record journey information. That data was the basis for preparing refund requests and batching postal submissions to DB.

The hardest technical problem was data coverage. A useful refund service needed reliable information about European train journeys and delays, not a narrow manual lookup. I therefore treated journey collection, persistence, and eligibility checks as core product capabilities rather than background implementation details.

I built a functional prototype and automated significant parts of the workflow. The project did not reach launch because Deutsche Bahn announced a parallel initiative, changing the market before there was a sensible reason to continue investing. Ending it was the right product decision, even after substantial implementation work.

Refund Hero changed how I assess solo projects. Building a scraper, backend, frontend, database, and hosting stack proved I could take an idea end to end. The more durable lesson was market timing: validate the changing external landscape early and repeatedly, because a technically sound product can still lose its reason to exist.
