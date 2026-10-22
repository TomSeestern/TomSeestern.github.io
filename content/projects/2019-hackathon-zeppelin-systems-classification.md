---
id: hackathon-zeppelin-systems-classification
title: "Zeppelin Systems Hackathon: Mobile Bulk-Goods Classification"
articleDate: 2019-09-30
articleContent: I worked in a five-engineer team at a Zeppelin Systems hackathon to prototype a portable bulk-goods analysis station with a Revolution Pi, Bosch XDK sensors, Python, and a Java companion app.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Developer and AI specialist
outcome: Delivered a working mobile analysis station and companion-app MVP; the team placed third.
metrics:
  - label: Result
    value: 3rd place
  - label: Team
    value: 5 engineers
tags:
  - Hackathon
  - Innovation
  - Bulk Goods Analysis
  - Prototype Development
technologies:
  - Raspberry Pi
  - Python
  - Java
  - Bosch
  - Eclipse
  - Figma
---

The demo had to work on a table in front of judges, not in a notebook. That constraint shaped every decision we made.

## The problem

Zeppelin Systems brought a practical challenge to this hackathon: bulk-goods analysis depended on stationary, cumbersome equipment. Our five-engineer team had to demonstrate whether a compact, mobile station and companion app could make the process more flexible for operators.

The brief was intentionally open. We had to choose a sensing approach, build enough hardware to produce a credible measurement, and give an operator a workflow that explained what the station was doing. A compact station also had to survive being moved, handled, and demonstrated by people who had not built it. A polished slide deck would not have been enough.

## The build

I contributed as a developer and AI specialist. The prototype combined a Revolution Pi, Bosch XDK sensors, Python, and Java. The Revolution Pi and sensor setup formed the hardware side of the analysis station, Python supported backend work, and the Java companion app gave operators a way to work with the results. Figma helped the team align the app flow before implementation.

We treated the hardware station and the app as separate but connected parts of the product. That decision let us focus the station on collecting and processing measurements while keeping the operator workflow in the companion app. It also made the prototype easier to explain and demonstrate during the hackathon.

The team split responsibilities across sensing, data processing, the app, and the presentation. We delivered an operational MVP and demonstrated it live. The station measured, the app interpreted, and the operator stayed in control. That separation made a sensor problem distinguishable from an interface problem during the demo, and it let the audience see where a measurement stopped and an interpretation began. We kept the station small enough to move and the app simple enough to operate under demo pressure. It also made the limits of the prototype obvious, which is exactly what a good hackathon demo should do.

## The result

We delivered a working mobile analysis station and companion-app MVP, and the team placed third. The result was a feasible direction for portable bulk-goods classification, not a claim that a hackathon prototype was ready for industrial deployment. Being explicit about that boundary mattered when presenting the work to an engineering audience.

## What I took from it

This project taught me how to ship a coherent end-to-end prototype under severe time limits. Given more time, I would prioritise calibration, repeatable test cases, and field feedback from the people who would operate the device. The hackathon reinforced a pattern I still use: prove the smallest useful workflow first, then improve it with evidence.
