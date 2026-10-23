---
id: layzr-creator-avatar-platform-acquired-by-jodel
title: "LAYZR: Creator Avatars, Digital Collectibles, and a Jodel Exit"
articleDate: 2024-06-05
articleContent: I co-founded LAYZR and served as CTO, building a creator loyalty platform that reached 100k+ monthly users and was acquired by Jodel.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
featured: true
role: Co-Founder and CTO
outcome: Scaled LAYZR to 100k+ monthly active users and led the platform through its acquisition by Jodel.
metrics:
  - label: Monthly active users
    value: 100k+
  - label: Streamer partners
    value: 1,000+
  - label: Team
    value: 15+ FTEs
  - label: Seed funding
    value: €500k
heroImage: /img/projects/layzr-jodel.jpg
links:
  - label: LAYZR
    href: https://layzr.gg
  - label: Business Insider coverage
    href: https://www.businessinsider.de/gruenderszene/technologie/fast-nach-amerika-verkauft-jodel-uebernimmt-sueddeutsches-avatar-startup-layzr/
  - label: Jodel acquisition announcement
    href: https://www.linkedin.com/posts/jodel-app_jodel-acquiring-layzr-activity-7204045448859299840-UOYb
tags:
  - Startups
  - Creator Economy
  - Blockchain
  - Platform Engineering
  - Leadership
technologies:
  - NodeJS
  - TypeScript
  - React
  - Terraform
  - AWS
  - Blockchain
---

The company started with a gap between what creators could build and what their fans could own.

## The problem

Creators had built large communities on Twitch, Instagram, and YouTube, but the tools for rewarding those communities were fragmented. A streamer could sell merchandise or run a giveaway, but there was no durable digital object that travelled with a fan across platforms. Together with Peter Krysta and Tom Lamsfuß, I co-founded LAYZR in 2021 and took on the CTO role.

The product grew into a blockchain-based platform for digital collectibles, creator-fan interactions, and avatars across the three major creator platforms. The pitch was simple to say and hard to build: give every fan a recognisable digital identity, give creators a new way to reward loyalty, and make the whole thing feel native to a livestream rather than bolted on.

## The build

My responsibility was the full technical organisation. I led engineering from zero to more than 15 full-time employees, owned the technical vision, hired the team, and stayed close to the product. That meant moving between architecture, delivery, and the unglamorous work of keeping a growing platform stable while the feature set expanded.

We built the system on Node.js and Terraform, with AWS providing the infrastructure layer. Terraform made the environment reproducible as the team grew; Node.js let us keep the API and real-time integration work in one language across a product with many moving parts. The platform handled integrations with Twitch, Instagram, and YouTube, and at peak handled millions of transactions per month.

The most important engineering constraint was that a creator campaign could not wait for a maintenance window. When a streamer went live, thousands of fans could arrive at once, and a failure would be visible to the audience in real time. We maintained 100% uptime during critical growth periods by treating deploys, observability, and rollback paths as part of the product rather than infrastructure chores.

The company raised €500k in seed funding, with Atlantic Labs and the Evolve Incubator leading the round. LAYZR also won the Top 50 Startup Award in 2021, the Digital Rising Award, and the Next in Esports Award. Those signals mattered because they came from people who understood the creator market as well as the technology.

## The result

LAYZR reached more than 100k monthly active users and more than 1,000 streamer partnerships. In 2024, Jodel acquired the company to bring avatars into its social platform. The acquisition was a milestone. It confirmed that the platform, the team, and the product had earned a place in the market.

## What I took from it

LAYZR taught me that scaling a platform is mostly a series of decisions about what not to break. The architecture mattered, but so did hiring, prioritisation, and the ability to keep a small team moving without letting quality collapse. It also taught me to separate the parts of the product that must be correct from the parts that can be improved after launch.

The more durable lesson was that a startup's technical choices are only useful if they support the business long enough for the market to answer back. We built the technical organisation, shipped through growth, and handed a working platform to its next owner. That is the outcome I am proudest of.
