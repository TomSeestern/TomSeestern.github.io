---
id: 2026-what-llm-agents-are-missing
title: "What LLM Agents Are Still Missing"
articleDate: 2026-10-23
articleContent: "The next step for LLM agents is an operating environment with durable state, checkable outcomes, isolation, failure semantics, and human gates at the points that cannot be undone. A better prompt does not supply any of that."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI Agents
  - LLM
  - Software Engineering
  - Automation
---

# What LLM Agents Are Still Missing

The demos keep getting better.

A model can read a repository, propose a patch, explain its reasoning, and recover from a failed test. On a short task it can look almost indistinguishable from a careful engineer. Then the task lasts three days, the context resets, two agents touch the same file, a test starts passing for the wrong reason, and the whole thing quietly falls apart.

The failure is rarely one bad completion. It is the absence of everything around the completion: a place to keep state, a way to check the result, a boundary around the work, and a mechanism to stop.

The argument is for a better environment for the autonomy we already have, not for more autonomy. The missing layer is an operating system for work: a set of guarantees that lets an agent act without turning every mistake into a system-wide incident. Think of it as the environment around the model, not a literal OS.

## Durable state, not context

A context window is a scratchpad. It is not a ledger.

Long-running work needs state that survives the model: the goal, the constraints, the decisions already made, the plan, the current status, the open questions, the evidence, and the person or process that owns the next step. If a context reset erases the reason for a decision, the agent did not have memory. It had a monologue.

The state also has to be inspectable. A vendor session is not a filing cabinet. If the only record of the work is a chat transcript, the work cannot be audited, handed off, replayed, or resumed without dragging the entire conversation along. Externalized state is what makes a long task a project instead of a very long prompt.

## Checkable outcomes, not confident prose

Agents are very good at sounding finished. That is not the same as being finished.

A real completion should come with a check: a test that passes, a build that exits zero, a diff that matches the requested change, an artifact that exists, a measurement inside its budget. Where judgment is required, the check should route to a human instead of pretending to be objective.

The useful question is not “did the agent say it finished?” It is “what can I run to disagree?”

Evidence should belong to the task, not be buried somewhere in the transcript. “I did it” and “it works” are different claims. A system that cannot separate them will produce a lot of confident work that nobody can trust.

## Decomposition with dependencies

A long task is a graph of smaller pieces, not a single prompt.

Each node needs a scope, an acceptance criterion, its dependencies, its owner, and a state. Without that graph, agents do the same work twice, block on something they cannot see, skip the part that was hard to specify, or declare a partial result complete because the next step was not written down.

Decomposition is how an agent knows what not to do yet. It keeps the plan from turning into theatre.

The node has to be small enough to verify and large enough to matter. It also needs scheduling rules: what is ready, how much work may run at once, which files are owned by which task, and what happens when two tasks collide. A frontier without a WIP limit is just a queue for a distributed accident.

## Isolation and concurrency

Agents need a place to work that is not the shared, live system.

That means separate checkouts or worktrees, explicit file ownership, sandboxed execution, and a merge discipline that does not depend on everyone being polite. Two agents editing the same file is a race condition, not collaboration.

Isolation also applies to permissions. An agent should not inherit every secret, every network route, and every write capability just because it runs on the same machine as the person who asked for help. Least privilege is what makes it safe to delegate. It is not a verdict on trust.

## Failure semantics and time

An agent needs to know the difference between “still working” and “stuck.”

That requires heartbeats, timeouts, stall detection, retries with a limit, and an escalation path. A loop that retries forever spends money without learning anything. That is not persistence.

Every bounded task should also have a budget: tokens, time, compute, or human attention. When the budget is exhausted, the agent should stop, summarize what it tried, and hand back a diagnosis. The exit is part of the design, not an admission that the agent failed.

## Human governance at irreversible edges

Autonomy is a set of permissions, and those permissions should expand with reversibility.

An agent can be trusted to draft, test, and stage. It should need a human before deleting data, spending money, publishing to the world, rotating credentials, or making a promise to another person. The human belongs in the loop at the points where the loop cannot undo itself.

That also means an audit trail. Who approved the action, what changed, and why. Governance is a set of gates placed where the consequences are real. Meetings are optional.

## Evaluation and replay

You cannot improve what you cannot replay.

A useful agent system records the inputs, the tool calls, the decisions, the outputs, and the cost. The important traces need to be reconstructable when something goes wrong. Most of them never need to be read.

Benchmarks test models. Operations test systems. The second category needs regression tasks, failure drills, and a kill switch. A demo is one sample. Production is a distribution.

The metrics should reflect the work, not the theater: completion rate, rework, intervention rate, time to verify, cost per completed task. In many settings, interventions per completed task may be the most honest measure of whether the agent is actually helping.

## Economics and portability

Agents consume tokens, time, compute, and human attention. All of those are finite.

A task should know what it is allowed to spend, and a scheduler should be able to choose between competing tasks instead of running every loop at once. The economics determine which work is worth delegating; they are more than a billing detail.

The state should also be portable. Prompts, skills, task definitions, and evidence should be exportable, versioned, and readable without the original vendor. Models will change. The work should not be held hostage by the session that produced it.

## The test

Here is the test I keep coming back to:

Can an agent take a multi-day task, survive a context reset, explain why it changed course, prove that it finished, and hand the work to another agent or a human without a meeting?

If the answer is no, we have a clever assistant, not a system that can be trusted with real work.

The next breakthrough may look less like a model and more like a boring set of interfaces: a ledger, a scheduler, a sandbox, a gate. Intelligence is necessary. It is not sufficient.

The missing layer is the world around the model — the part that remembers, checks, bounds, and says no.
