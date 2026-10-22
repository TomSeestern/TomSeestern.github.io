---
id: leveraging-tech-to-secure-payments-for-ebay-sellers
title: "PayMeNow: Payment Status Application for eBay Sellers"
articleDate: 2021-12-31
articleContent: I built and launched PayMeNow, a React and AWS application that made transaction status and outstanding payment actions clear for eBay sellers.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Full-stack developer and IT consultant
outcome: Took a seller-facing payment-status product from concept and design through launch, analytics, and ongoing support.
metrics:
  - label: Ownership
    value: Concept to support
  - label: Platform
    value: React + AWS
tags:
  - eBay
  - Payment
  - Online Marketplace
  - Secure Payments
  - Technology Solution
technologies:
  - React
  - BootstrapCSS
  - AWS-Amplify
  - Lambda
  - RDS
  - AWS
  - Figma
---

In a marketplace, a completed sale is not the same as a completed payment.

## The problem

PayMeNow addressed a trust problem for eBay sellers: completing an auction did not always mean receiving payment promptly. I worked as a full-stack developer and IT consultant to build an application around that concern, with a focus on a clear seller-facing flow and durable transaction records.

The product was not a payment processor. It was a visibility and action layer. Sellers needed to understand what had happened to their money and what, if anything, they still needed to do. That distinction shaped every screen.

## The build

I was responsible for the full platform, including concept, design, implementation, launch, analytics, and ongoing support. That scope made the product decisions concrete. A feature was not done when the code worked; it was done when a seller could look at the application and understand the state of a transaction.

I built the frontend with React and BootstrapCSS, starting from Figma mockups to test the product flow before implementation. AWS Amplify provided managed backend services, AWS Lambda ran server-side application logic, and Amazon RDS stored transaction data. This split suited a small product because the UI, application logic, and relational records could evolve independently without managing servers for each concern.

The system had to make payment status understandable, not merely store it. I designed the application around seller actions and transaction state so that users could see what had happened and what still needed attention. That was more valuable than treating the backend as a generic database form. It also meant thinking about failure states: a missing payment, a delayed transfer, and a completed transaction should not look the same.

I worked independently while staying in contact with client stakeholders and collecting feedback for iteration. The technical choices were deliberately pragmatic: React for a fast, responsive interface; RDS for structured transaction data; and managed AWS services to reduce operational overhead during development and support.

Analytics mattered because the product had to prove that sellers actually used the status view, not just that the page loaded. I instrumented the key actions and used the results to refine the flow after launch. Ongoing support also exposed the difference between a bug in the application and a mismatch between the product's explanation and the payment network's reality.

## The result

I took a seller-facing payment-status product from concept and design through launch, analytics, and ongoing support. The application gave sellers a clear view of transaction status and the actions still available to them.

## What I took from it

This project deepened my understanding of payment-adjacent systems, where correctness, traceability, and clear user communication matter together. I would now add formal audit trails, idempotent payment-state transitions, and threat modelling before claiming any payment-security guarantees.

PayMeNow remains a useful example of translating a marketplace risk into an end-to-end product design. The hard part was not the AWS wiring. It was earning enough trust that a seller would use the screen when money was late.
