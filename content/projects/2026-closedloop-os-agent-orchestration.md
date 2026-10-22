---
id: closedloop-os-agent-orchestration
title: "ClosedLoopOS: Open-Source Orchestration for AI-Run Operations"
articleDate: 2026-10-14
articleContent: I built ClosedLoopOS, an open-source TypeScript platform that turns business processes into YAML SOPs and assigns them to AI agents with an operational dashboard.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Creator and maintainer
outcome: Shipped an open-source agent-orchestration platform with a live demo, SOP library, run history, and agent roster.
heroImage: /img/projects/closedloop-os.png
links:
  - label: Live demo
    href: https://closed-loop-os.vercel.app
tags:
  - AI Agents
  - Orchestration
  - Open Source
  - Developer Tools
technologies:
  - TypeScript
  - NextJS
  - YAML
  - OpenAPI
  - AI Agents
---

ClosedLoopOS is an open-source orchestration layer for what I call zero-human operations: business processes defined as YAML SOPs, assigned to AI agents, and executed with enough observability that a human can tell what happened and where it stopped.

The product model is deliberately plain. A company writes down a process as a standard operating procedure. The system turns that process into work for one or more agents, tracks the run, and exposes the result in an operations dashboard. Instead of another chat window, the interface shows the state of the work: active runs, blocked runs, exceptions, agent health, and a history of completed steps.

I built the platform in TypeScript and Next.js with a YAML-first schema. The dashboard includes an SOP library, run detail, a PM task board, an agent roster, and an assistant surface. The design goal was to make the system understandable at a glance. If an agent is stuck, the operator should see which step failed and what input it needs, not a wall of model output.

The project is open source and has a live demo. It is still an early product, and I treat that honestly: the interesting engineering is not the model call, it is the contract around the call. Every agent action needs a defined input, a visible state transition, and a failure path that a human can recover from.

## What I took from it

ClosedLoopOS is where my interest in agents becomes a systems problem. The hard questions are operational: how do you represent a process, how do you prove a run did what it claims, and how do you stop an agent from silently doing the wrong thing?

I built it because I wanted a tool I could use on my own projects. The live demo is the current state of that experiment, not a claim that autonomous operations are solved.
