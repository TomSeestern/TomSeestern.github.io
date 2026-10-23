---
id: process-automation-proptech-journey
title: "PropTech Process Automation: APIs, SQL, and a Single Source of Truth"
articleDate: 2019-12-31
articleContent: I digitised manual property-listing workflows for a PropTech client, connected the data locations, and built the APIs and synchronisation needed for a single source of truth.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Freelance IT consultant
outcome: Replaced manual property-entry workflows with digitised processes, new APIs, and event-driven data synchronisation.
tags:
  - Process Automation
  - PropTech
  - Digital Transformation
  - Software Development
  - API Integration
technologies:
  - Microsoft-Visio
  - SQL
  - SharePoint
  - Office365
  - PowerBI
---

The client did not have a software problem. It had a data ownership problem that software kept exposing.

## The problem

A property-management client had a familiar problem: the processes that kept listings current lived in people's heads and in disconnected systems. New properties were entered manually on several communal websites. The same information existed in more than one place, and nobody could say with confidence which copy was correct.

I worked as a freelance IT consultant on the project. The mandate was to make the existing workflow coherent enough to support a relaunch without creating more manual reconciliation for the operations team. Adding another tool would not accomplish that.

## The build

I started by recording the existing manual processes, then digitised them in Microsoft Visio so the team could see where work moved, where it stopped, and where the same data was entered twice. That map became the basis for the technical work rather than a document produced after the fact.

From there, I identified opportunities to simplify the flow and aligned the changes with the relevant stakeholders. The implementation introduced new APIs and database structures to support the revised processes. I also automated synchronisation between the different data locations so the systems converged on a single source of truth and stayed consistent as records changed.

The last step was integration. The new data locations had to connect to the existing display systems and be ready for a relaunch without disrupting the people who used them every day. That meant testing the data flow end to end, not only the individual endpoints, and making the failure states visible enough for the operations team to act on them.

The most important design decision was to make synchronisation event-driven rather than relying on a nightly export. When a record changed, the systems that depended on it needed to converge without a person remembering to run a job. That introduced its own failure modes, so we added retries and visibility into rejected updates. Data consistency became an operational property, not a one-time migration.

## The result

The manual property-entry workflow was replaced with digitised processes, new APIs, and event-driven synchronisation. The client could move forward with a relaunch on a shared data foundation instead of a collection of copies.

## What I took from it

The interesting part of this project was the gap between how a process is documented and how it actually runs. No single API captured that. Recording the manual workflow first made the technical work more accurate and gave stakeholders a shared picture of what would change.

It also reinforced a lesson I keep applying: data consistency is a product feature. If two systems disagree, someone eventually has to reconcile them by hand, and that cost lands on the people least able to absorb it.
