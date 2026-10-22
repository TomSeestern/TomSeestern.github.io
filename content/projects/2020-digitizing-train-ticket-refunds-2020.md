---
id: digitizing-train-ticket-refunds-2020
title: "RefundHero: Automating Deutsche Bahn Delay Refunds"
articleDate: 2020-12-31
articleContent: I built Refund Hero as a full-stack prototype for identifying eligible Deutsche Bahn delay refunds and preparing reimbursement requests. I stopped it when DB announced a parallel service.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Founder and full-stack developer
outcome: Built a working end-to-end refund prototype; stopped the project after Deutsche Bahn announced a competing service.
metrics:
  - label: Pricing model
    value: €2 or 10% per claim
  - label: Stack
    value: Django, React, AWS
heroImage: /img/projects/refundhero-station.jpg
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

The refund existed. The passenger just had to prove it with paper.

## The problem

Refund Hero began with a frustratingly manual process: passengers in Germany had to complete and mail forms to request compensation for delayed Deutsche Bahn journeys. I built the project independently to test whether software could identify eligible journeys and make the reimbursement process less burdensome.

The product question was simple, but the operational question was not. A useful service needed reliable journey data, an eligibility model that matched the rules, and a way to prepare submissions that a passenger could trust. A beautiful form that produced an invalid claim would have been worse than the paper process.

## The build

I designed it as a full-stack application with React and BootstrapCSS on the client, Django on the server, MySQL for application data, and AWS for hosting. The backend included an automated lookup service intended to track train delays and record journey information. That data was the basis for preparing refund requests and batching postal submissions to DB.

The product idea was simple: users looked up a journey, the system checked whether it was eligible, and Refund Hero prepared the paperwork. The first request was free; after that, the service charged €2 or 10% of the refund, whichever was higher. That pricing model forced me to think about unit economics early, even though the product never reached launch.

The hardest technical problem was data coverage. A useful refund service needed reliable information about European train journeys and delays, not a narrow manual lookup. I therefore treated journey collection, persistence, and eligibility checks as core product capabilities rather than background implementation details.

The architecture was deliberately modular because the riskiest assumptions were outside the code: whether a journey could be matched to the right delay record, whether the eligibility rules were stable, and whether a prepared claim would be accepted. Separating lookup, eligibility, and submission let me test those assumptions independently before wiring the user flow.

## The result

I built a functional prototype and automated significant parts of the workflow. The project did not reach launch because Deutsche Bahn announced a parallel initiative, changing the market before there was a sensible reason to continue investing. Ending it was the right product decision, even after substantial implementation work.

In hindsight, the official solution took another three years to appear, and the automated refund workflow I built is still not offered by the official platform. A launch might have found a market, but that is a retrospective judgment, not a reason to ignore the signal at the time.

## What I took from it

Refund Hero changed how I assess solo projects. Building a scraper, backend, frontend, database, and hosting stack proved I could take an idea end to end. The more durable lesson was market timing: validate the changing external landscape early and repeatedly, because a technically sound product can still lose its reason to exist.
