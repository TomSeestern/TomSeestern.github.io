---
id: leveraging-tech-to-secure-payments-for-ebay-sellers
title: "PayMeNow: Payment Status Application for eBay Sellers"
articleDate: 2021-12-31
articleContent: I built a React and AWS application for eBay sellers, focused on making transaction status and outstanding payment actions clear and traceable.
authorName: Tom
authorImgSrc: https://placehold.co/512x512.png?text=Tom
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

PayMeNow addressed a trust problem for eBay sellers: completing an auction did not always mean receiving payment promptly. I worked as a full-stack developer and IT consultant to build an application around that concern, with a focus on a clear seller-facing flow and durable transaction records.

I built the frontend with React and BootstrapCSS, starting from Figma mockups to test the product flow before implementation. AWS Amplify provided managed backend services, AWS Lambda ran server-side application logic, and Amazon RDS stored transaction data. This split suited a small product because the UI, application logic, and relational records could evolve independently without managing servers for each concern.

The system had to make payment status understandable, not merely store it. I designed the application around seller actions and transaction state so that users could see what had happened and what still needed attention. That was more valuable than treating the backend as a generic database form.

I worked independently while staying in contact with client stakeholders and collecting feedback for iteration. The technical choices were deliberately pragmatic: React for a fast, responsive interface; RDS for structured transaction data; and managed AWS services to reduce operational overhead during development and support.

This project deepened my understanding of payment-adjacent systems, where correctness, traceability, and clear user communication matter together. I would now add formal audit trails, idempotent payment-state transitions, and threat modelling before claiming any payment-security guarantees. PayMeNow remains a useful example of translating a marketplace risk into an end-to-end product design.
