---
id: closedloop-os-agent-orchestration
title: "ClosedLoopOS: Open-Source Orchestration for AI-Run Operations"
articleDate: 2026-10-14
articleContent: I built ClosedLoopOS, an open-source TypeScript platform that turns business processes into YAML SOPs and assigns them to AI agents with an operational dashboard.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
featured: true
role: Creator and maintainer
outcome: Shipped an open-source agent-orchestration platform with a live demo, SOP library, run history, and agent roster.
metrics:
  - label: Test/spec files
    value: "709"
  - label: API routes
    value: "154"
  - label: Dashboard pages
    value: "48"
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

Most AI demos stop at the model call. The interesting engineering starts after it.

## The problem

ClosedLoopOS is an open-source orchestration layer for what I call zero-human operations: business processes defined as YAML SOPs, assigned to AI agents, and executed with enough observability that a human can tell what happened and where it stopped.

The product model is deliberately plain. A company writes down a process as a standard operating procedure. The system turns that process into work for one or more agents, tracks the run, and exposes the result in an operations dashboard. Instead of another chat window, the interface shows the state of the work: active runs, blocked runs, exceptions, agent health, and a history of completed steps.

## The build

I built the platform in TypeScript and Next.js with a YAML-first schema. The dashboard includes an SOP library, run detail, a PM task board, an agent roster, and an assistant surface. The design goal was to make the system understandable at a glance. If an agent is stuck, the operator should see which step failed and what input it needs, not a wall of model output.

The repo now contains a full orchestration stack: a `clos` CLI for scaffolding, validating, triggering, and streaming SOP runs; a TypeScript SDK with `AgentRuntime`, `ClosedLoopClient`, and PM scheduler APIs; a priority-based scheduler; retries and escalation; and an audit trail with step lineage, inputs, outputs, and agent attribution. SOP templates cover customer onboarding, incident response, and weekly team review.

The scope is visible in the evidence: 709 test/spec files, 154 API routes, and 48 dashboard pages. That is a product surface with the unglamorous parts included: persistence, authentication, error contracts, run history, and tests. It is far from a weekend prototype with a chat box. The live demo is at closed-loop-os.vercel.app.

## The result

ClosedLoopOS is open source and has a live demo. It lets a team define a process as YAML, run it across multiple agents, watch progress in real time, pause or resume a run, and inspect the result. It is still an early product, and I treat that honestly: autonomous operations are not solved, and a demo should not pretend otherwise.

## What I took from it

ClosedLoopOS is where my interest in agents becomes a systems problem. The hard questions are operational: how do you represent a process, how do you prove a run did what it claims, and how do you stop an agent from silently doing the wrong thing?

I built it because I wanted a tool I could use on my own projects. The live demo is the current state of that experiment, not a claim that the category is finished. The part I care about is the contract around the model call: defined inputs, visible state transitions, and failure paths a human can recover from.
