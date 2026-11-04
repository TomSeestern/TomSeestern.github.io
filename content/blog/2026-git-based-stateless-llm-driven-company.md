---
id: 2026-git-based-stateless-llm-driven-company
title: "Requirements for a Git-Based, Stateless, LLM-Driven Company"
articleDate: 2026-11-04
articleContent: "What does it take to build a company—or any complex endeavor—that runs on committed state, autonomous agents, and verifiable loops? A survey of feature sets, goals, non-goals, must-haves, and nice-to-haves for digital work orchestration beyond software."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI
  - Automation
  - Git
  - Project Management
  - LLM
  - Company OS
---

# Requirements for a Git-Based, Stateless, LLM-Driven Company

What does it take to build a company—or any complex undertaking—that runs on committed state, autonomous agents, and verifiable loops?

Not just a software project, but anything digital: house renovations with material orders and permit tracking, design agencies with client feedback loops, science slams with rehearsal schedules, startup orchestration with investor updates and runway burns. The common thread is work that can be represented as tasks, dependencies, decisions, evidence, and state transitions.

This post surveys the feature landscape, drawing from four experiments in LLM-driven orchestration: **Paperclip** (multi-agent platform), **ohmyroadmap** (DAG-based roadmap ceremony), **ClosedLoopOS** (YAML SOP runner for agent companies), and **ohmybetterroadmap** (Rust-based evolution with verification attestations). Each approaches the problem from a different angle. Together, they sketch the requirements for a system that can run any digital endeavor with minimal human intervention.

## Beyond Software Development

Software projects are the obvious first domain—code is already text, version control is native, and CI pipelines are mature infrastructure. But the same primitives work for non-code domains when you commit the right artifacts:

- **House renovation**: Material specs in YAML, contractor quotes as evidence files, permit approval as a gate, progress photos committed to `evidence/`, budget burn tracked in a ledger.
- **Design agency**: Client briefs in markdown, design iterations as Figma snapshots (or exported SVG), approval checkpoints as human-task markers, feedback as decision records.
- **Science slam**: Script drafts versioned, rehearsal notes committed, timing constraints as acceptance criteria, venue logistics as checklists.
- **Startup orchestration**: Investor decks versioned, runway burn computed from committed expenses, OKRs as roadmap entries, board decisions recorded.

The pattern: every domain has tasks, dependencies, evidence, decisions, and state. Git is the universal ledger. Agents are the execution layer. Gates are the quality contract.

## Core Principles

Four principles anchor every feature decision:

### Git as Source of Truth

All meaningful state lives in committed files. No databases, no server-side sessions, no state that vanishes when a process dies. If it matters, it is in a file. If it matters long-term, it is committed. If it matters to multiple collaborators, it is pushed.

This makes the system **auditable** (every change has an author and timestamp), **recoverable** (git history is the backup), **reviewable** (diffs are the interface), and **forkable** (branches are parallel universes).

**ohmyroadmap** demonstrates this with `ROADMAP.md`: every task is an `R-###` entry in a committed file. Task state (`[ ]`, `[x]`, `[~]`, `[!]`) is a checkbox marker, not a database column. Dependencies are prose (`needs R-123, R-456`), parsed into a DAG. The roadmap is both the UI and the backend.

**ClosedLoopOS** extends this to SOPs: YAML files in `sops/` define workflows. Agents execute steps, commit evidence, open PRs, and land changes. The git log is the audit trail.

### Stateless and Resumable Execution

Agents are ephemeral. A task starts in one session, pauses mid-execution, and resumes in another session—possibly days later, on a different machine, with a different model. The execution state is in committed files, not in memory or a database.

**ohmyroadmap**'s orchestration layer writes `.omr/run-continuation/<task>.json` ledgers: each ledger records the command, status, progress, exit code, and timestamps. The heartbeat is atomic. If the agent dies, the next agent reads the ledger and resumes. The watchdog enforces a run budget and kills runaway loops. When the budget expires, the ledger records the kill signal. The next invocation sees the truncated state and escalates to human review.

**Paperclip** tracks task state in `state.json` with atomic writes. Sessions snapshot their progress. Budgets are enforced per-agent and per-task. The system is designed for interruption—graceful or abrupt.

### Autonomous Operation with Human Gates

The default mode is unattended loops. Agents dispatch work, delegate sub-tasks recursively, verify outcomes, commit results, and open PRs—without human intervention. But critical decisions (security changes, budget approvals, architecture shifts) require explicit human gates.

**ClosedLoopOS** has two modes: supervised (every step waits for human approval) and autonomous (only PR merge requires approval, and that is opt-in with `FORGEJO_AUTO_MERGE`). SOPs declare which steps are `owner: human`. Human tasks block execution until a human unblocks them.

**ohmyroadmap** uses `[H]` markers for human tasks: planning decisions, key approvals, credential provisioning. The `jot --block` command creates a human task with rationale. The orchestrator skips human tasks until they flip to done. The board (the human operator) unblocks them manually.

### Verification as First-Class Contract

Work is not done until it is verified. Tests pass, gates close, evidence is committed, acceptance criteria are met. The verification contract is executable—not a checklist in a doc, but a script that returns 0 or 1.

**ohmyroadmap** has a gate engine: every node passes through gates (discovery, goal-contract, substrate, acceptance-criteria, evidence, attestation) before flipping to done. Gates are TypeScript/Rust functions that read the store and return pass/fail. The pre-commit hook runs the gate suite. A red gate blocks the commit. The ceremony enforces gate order: you cannot attest before you have evidence.

**ClosedLoopOS** delegates verification to the SOP steps: each step declares success criteria, and the agent must produce evidence (logs, screenshots, test output) that the step passed. The PR template embeds the verification report.

## Must-Haves

These are non-negotiable. A system without any of these is not viable.

### 1. Task DAG with State Machine

Tasks form a dependency graph. Each task has a state (`open`, `in-plan`, `done`, `blocked`, `future`, `archived`). State transitions are governed by dependencies and gates. The DAG is the work contract.

**ohmyroadmap** represents the DAG as prose dependencies in `ROADMAP.md`: `(needs R-123, R-456)`. The `check` command parses the file, builds the graph, detects cycles, and validates state transitions. The `slice` command computes the frontier (executable tasks with satisfied dependencies) and generates an execution plan.

**Paperclip** uses a task hierarchy with parent-child relationships and dependency links. Tasks have types (epic, story, task, subtask), states, and budgets. The agent UI renders the graph as a tree.

### 2. Commit-Triggered Pre-Commit Gates

Quality enforcement happens at commit time, not at review time. The pre-commit hook is the first gate. It runs fast checks (syntax, schema, invariants) and blocks the commit if they fail. Slow checks (tests, builds, coverage) run in CI.

**ohmyroadmap** uses `pre-commit` with a conventional-commit validator and a custom gate hook. The gate hook parses `ROADMAP.md`, validates the state machine, checks dependency closure, and verifies gate attestations. A gate error is a commit error. The error message names the broken invariant and the fix.

**ClosedLoopOS** lints SOPs at commit time and validates the YAML schema. The pre-commit hook ensures every SOP has a valid ID, steps are well-formed, and agent assignments exist.

### 3. Evidence Ledger per Task

Every task produces evidence: test output, build logs, manual verification notes, screenshots, approval emails. Evidence files are committed, timestamped, and signed. The evidence ledger links evidence to the task and the agent that produced it.

**ohmyroadmap** writes evidence to `.omr/evidence/<task-id>.md`. The format is markdown with timestamped sections. Each verification run appends a new section with the command, output, and verdict. The acceptance-criteria gate parses the evidence file and checks that every AC has a matching evidence block.

**Paperclip** logs agent activity to timestamped files under `logs/<session-id>/`. Logs include tool calls, model responses, errors, and verification steps. The session ledger links logs to tasks and budgets.

### 4. Autonomous CEO Loop with Watchdog

The orchestrator is a loop: pick the next task from the frontier, dispatch an agent, wait for completion, verify the result, update state, commit, repeat. The loop runs unattended. A watchdog enforces a per-run budget and kills runaway loops.

**ohmyroadmap**'s `exec-batch` command is the CEO loop. It reads the frontier from `slice`, dispatches each task to a sub-agent, writes a run-continuation ledger, and watches for completion or timeout. The watchdog is a process timeout plus a token budget. When the budget expires, the loop writes a terminal ledger entry and exits. The next `exec-batch` sees the truncated state and escalates.

**ClosedLoopOS** has a dispatch loop: `clos loop run` monitors issues, picks one, creates a worktree, runs the SOP, commits results, opens a PR, and waits for merge. The loop enforces a restart budget (default: 5 retries). If the budget drains, the loop exits and logs the failure.

### 5. Human-Readable Diffs as the Review Interface

Code review, task review, and decision review all happen through git diffs. Diffs are the communication medium. They must be readable without tooling—plain text, semantic structure, minimal noise.

**ohmyroadmap** makes `ROADMAP.md` diffs human-readable: a state change is a checkbox flip (`[ ]` → `[x]`), a new task is a new list item, a dependency change is a prose edit. The diff is the story.

**ClosedLoopOS** commits SOPs, evidence, and worktree changes in structured branches. The PR diff shows what the agent did: which SOP ran, which steps completed, what evidence was collected, what code changed. The diff is the agent's report card.

### 6. Atomic State Transitions with Rollback

State changes are atomic. Either the entire transition commits (task flips to done, evidence is written, ROADMAP.md is updated, gates pass) or it rolls back (ROADMAP.md reverts, evidence is deleted, the task stays open). Partial commits are forbidden.

**ohmyroadmap** has a rollback path: if the post-state fails the gate, the `advance` command reverts `ROADMAP.md` to the pre-state and exits with an error. The agent retries or escalates. The ledger records the rollback.

**ClosedLoopOS** uses git branches for isolation. Each SOP run is a new worktree on a new branch. If the SOP fails, the branch is abandoned and the worktree is deleted. No failed state leaks into the main branch.

### 7. Recursive Agent Delegation

Agents delegate sub-tasks to other agents. The parent agent waits for the child to finish, collects its evidence, and resumes. Delegation depth is unbounded (within reason). The delegation tree is the execution trace.

**ohmyroadmap** enforces this as a style rule: the CEO loop session stays on the frontier loop. Every task is dispatched to a sub-agent. Sub-agents may spawn their own sub-agents. The session hierarchy mirrors the task hierarchy.

**Paperclip** has hierarchical sessions: a project session spawns task sessions, which spawn subtask sessions. Each session has its own budget, model, and skill set. The org chart defines which agents can delegate to which others.

### 8. Portable Ceremony (No Vendor Lock-In)

The ceremony is portable. It runs on any git host (GitHub, GitLab, Forgejo, Gitea, bare repos), any CI (GitHub Actions, Forgejo Actions, GitLab CI, Jenkins), any LLM provider (OpenAI, Anthropic, Ollama, any OpenAI-compatible endpoint). No proprietary APIs, no hosted-only features.

**ohmyroadmap** is a zero-dependency Node.js CLI. It parses `ROADMAP.md` with a regex. It runs on Linux, macOS, Windows. It commits with `git` commands. It delegates to agents via any CLI that accepts a prompt. The ceremony is a file format and a few conventions—not a platform.

**ClosedLoopOS** runs on Forgejo (open-source) and uses the Forgejo API for PRs. The API is standardized (OpenAPI). The SOPs are YAML. The Docker orchestration is standard `docker` CLI. The entire stack can self-host.

## Nice-to-Haves

These improve the experience but are not blocking for a minimal viable system.

### 1. Visual Task Graph Renderer

A live-rendered dependency graph helps humans understand the plan. It should show task states, the current frontier, blocked tasks, and the critical path. Export as SVG for embedding in docs.

**ohmyroadmap**'s `view` command renders the DAG as an HTML page with inline SVG. Nodes are colored by state. Edges show dependencies. The page is self-contained (no external assets). The rendering uses D3.js force-directed layout. The graph updates live as `ROADMAP.md` changes.

**Paperclip** renders the task hierarchy as an interactive tree in the web UI. Expand/collapse nodes, drag to reorder, click to open task detail. The tree syncs with `state.json`.

### 2. Slack/Discord/Email Notifications

Notify humans when a task completes, a gate fails, a budget expires, or a human task is blocked. Integrate with Slack webhooks, Discord bots, or SMTP. Include a link to the PR or the task diff.

**ClosedLoopOS** can notify via webhooks (configurable in `settings.yml`). The notification payload includes the SOP name, step status, PR URL, and agent ID.

### 3. Time Budgets and Cost Tracking

Track wall time, token usage, and API cost per task, per agent, per session. Enforce budgets (e.g., max 10,000 tokens per task, max $5 per sprint). Warn when approaching limits. Log overruns.

**Paperclip** tracks token usage and cost per session. The budget is a first-class field in the task schema. The UI shows remaining budget and burn rate. Agents stop when the budget is exhausted.

**ohmyroadmap** has a run budget (max iterations per `exec-batch` invocation). The watchdog kills the loop when the budget drains. Token budgets are delegated to the agent harness (e.g., OpenCode's session budget).

### 4. Decision Records (ADRs)

When a design choice or policy change is made, record it as an Architecture Decision Record: context, decision, consequences, alternatives considered. Commit ADRs to `docs/adr/` or `.omr/decisions/`. Link decisions to the tasks they affect.

**ohmyroadmap** has a decision-record protocol: `ohmyroadmap decision` scaffolds a decision file. Decisions are markdown files with a standard template. Tasks can reference decisions with `(decision D-123)`.

**ClosedLoopOS** can embed decision rationale in SOP comments or in dedicated `decisions/` files. The PR description links to relevant decisions.

### 5. Task Templates and Quick-Add Commands

Scaffold common task types with templates: "Add feature", "Fix bug", "Spike", "Refactor", "Deploy". Templates include pre-filled acceptance criteria, evidence requirements, and gate checklists.

**ohmyroadmap** has a template system: `ohmyroadmap jot --template <name>` expands a template into a new entry. Templates are markdown files in `.omr/templates/`. The template engine substitutes placeholders (`{{TITLE}}`, `{{DEPS}}`).

### 6. Differential Mutation Testing for Ceremony Changes

When the ceremony itself changes (gate logic, state machine transitions, DAG validation), run differential tests: freeze the pre-change state, run the ceremony, capture the post-state, compare with a frozen expectation. This prevents ceremony regressions.

**ohmybetterroadmap** has a differential test suite: `fixtures/` contains stores (committed roadmap state), `cases.json` lists test cases (argv + setup + expected output), and `harness/run.py` runs both the source and target implementations and diffs their outputs. Exit code, stdout, stderr, and the git tree hash are compared. Placeholders (`{{ROOT}}`, `{{TODAY}}`) make tests portable.

### 7. Board Cockpit (Single-File UI)

A local HTML file (or a static site) that renders the roadmap, task graph, evidence ledger, decision log, and budget burn. No server required—open the file in a browser. The page reads from `.omr/` or the git worktree. Updates live as files change.

**ohmyroadmap** can generate a static board: `ohmyroadmap board` writes `board.html`. The page embeds all state from `.omr/` and renders it with inline JavaScript. The board is a snapshot, not live-synced (refresh to update).

**Paperclip** has a web UI (Vite + React). The UI is a dev server, not a static file, but the goal is the same: zero backend dependencies, all state from files.

### 8. Multi-Repository Orchestration

Coordinate work across multiple repos: a monorepo for core services, a separate repo for docs, another for infrastructure. Tasks can depend on tasks in other repos. Evidence can be cross-repo (e.g., a test in repo A proves a requirement from repo B).

**ClosedLoopOS** can orchestrate multi-repo workflows with SOPs that clone, checkout, and push across repos. The SOP defines the repo list and the cross-repo dependencies.

## Non-Goals

These are explicitly out of scope. They belong in adjacent systems, not in the core orchestration layer.

### 1. Real-Time Collaboration (No Operational Transform)

This is not Google Docs. Two agents editing the same file simultaneously is a merge conflict, not a collaborative edit. The conflict is resolved with git merge tools, not with CRDTs or operational transform. Concurrency is managed with branches and locks, not with real-time syncing.

### 2. Hosted SaaS Platform

The system is self-hosted. It runs on your machine, your git server, your CI. There is no hosted version, no sign-up, no billing. This is not a product. It is a kit. If someone wants to host it as a service, they can, but that is not the default path.

### 3. Natural Language Task Entry (LLMs Must Refine)

Humans do not type tasks as prose paragraphs. LLMs do. Tasks are created by agents using the `jot` command or by editing `ROADMAP.md` directly. Agents can parse natural language requests and generate structured tasks, but the human interface is the committed file, not a chat box.

### 4. General-Purpose Knowledge Base

The system is not Notion, not Obsidian, not Roam. It does not manage unstructured notes, personal wikis, or freeform brainstorming. It manages tasks, dependencies, evidence, decisions, and state. If you need a knowledge base, use one—link to it from task descriptions.

### 5. Full CI/CD Pipeline Replacement

The system orchestrates tasks and gates, but it does not replace your CI/CD pipeline. It triggers builds, runs tests, and parses coverage reports, but it does not package binaries, deploy containers, or manage Kubernetes clusters. Use GitHub Actions, Forgejo Actions, GitLab CI, Jenkins, or any other CI system. The orchestrator calls them, it does not become them.

### 6. Auth/Permissions Beyond Git Forge

Access control is delegated to the git forge (GitHub, Forgejo, GitLab). If you can push to the repo, you can run the ceremony. If you can merge PRs, you can approve work. The system does not add its own auth layer, API keys, or role system. Git permissions are the permissions.

## Domain Examples

To make this concrete, here are four domain applications beyond software development.

### House Renovation

**Committed State:**
- `renovation/plan.yml`: List of rooms, materials, contractors, deadlines.
- `renovation/budget.yml`: Line items with estimates, actuals, and variance.
- `renovation/permits.yml`: Required permits, application status, approval dates.
- `renovation/evidence/`: Photos (before, during, after), contractor quotes (PDF), receipts.
- `ROADMAP.md`: Tasks like "R-001: Demo kitchen", "R-002: Order cabinets", "R-003: Install plumbing".

**Tasks and Dependencies:**
- "Order cabinets" depends on "Finalize kitchen design" and "Approve budget".
- "Install plumbing" depends on "Demo kitchen" and "Plumbing permit approved".
- "Final inspection" depends on all rooms complete.

**Gates:**
- **Budget gate**: No task can advance if it exceeds the remaining budget.
- **Permit gate**: Construction tasks cannot start until the required permit is approved.
- **Evidence gate**: Each task requires before/after photos and a contractor sign-off.

**Autonomous Execution:**
- An agent monitors the plan, sends reminder emails to contractors, updates the budget as receipts are committed, and flags blocked tasks (e.g., "Permit not approved, kitchen demo blocked").

### Design Agency

**Committed State:**
- `clients/<client-id>/brief.md`: Project brief, goals, constraints, timeline.
- `clients/<client-id>/iterations/`: Figma snapshots (exported SVG or PNG), design mockups.
- `clients/<client-id>/feedback.yml`: Client feedback rounds, approval status.
- `clients/<client-id>/invoice.yml`: Billing milestones, hours logged, payment status.
- `ROADMAP.md`: Tasks like "R-010: Draft homepage mockup", "R-011: Client review round 1".

**Tasks and Dependencies:**
- "Client review round 1" depends on "Draft homepage mockup" and "Draft about page mockup".
- "Final delivery" depends on all review rounds approved.

**Gates:**
- **Approval gate**: Design iterations cannot proceed to the next round until the client approves the current round (human task marker).
- **Asset gate**: Every design file must have a committed snapshot in `iterations/` before review.

**Autonomous Execution:**
- An agent tracks design iterations, sends review requests to the client (via email or Slack), commits feedback to `feedback.yml`, and escalates blocked tasks ("Client feedback overdue, review blocked").

### Science Slam

**Committed State:**
- `slam/script.md`: Presentation script, versioned.
- `slam/rehearsals/`: Rehearsal notes, timing data, video links.
- `slam/slides/`: Slide deck (PDF or Markdown), exported.
- `slam/logistics.yml`: Venue, date, equipment checklist, travel arrangements.
- `ROADMAP.md`: Tasks like "R-020: Write script draft", "R-021: First rehearsal", "R-022: Final rehearsal", "R-023: Event day".

**Tasks and Dependencies:**
- "First rehearsal" depends on "Write script draft" and "Slides v1 complete".
- "Final rehearsal" depends on "First rehearsal feedback incorporated".
- "Event day" depends on "Final rehearsal" and "Logistics confirmed".

**Gates:**
- **Timing gate**: Rehearsal evidence must show the presentation is under the time limit (e.g., 10 minutes).
- **Feedback gate**: Each rehearsal requires committed feedback notes from at least two reviewers.

**Autonomous Execution:**
- An agent schedules rehearsals, commits timing data, collects feedback, and flags issues ("Script too long, 12 minutes, needs cuts").

### Startup Orchestration

**Committed State:**
- `company/okrs.yml`: Quarterly objectives and key results.
- `company/runway.yml`: Burn rate, cash balance, runway months.
- `company/decks/`: Investor pitch decks, versioned.
- `company/board/`: Board meeting notes, decisions, action items.
- `ROADMAP.md`: Tasks like "R-100: Close Series A", "R-101: Hire CTO", "R-102: Launch MVP".

**Tasks and Dependencies:**
- "Launch MVP" depends on "Hire CTO", "Product spec finalized", "QA complete".
- "Close Series A" depends on "Pitch deck finalized", "10 investor meetings complete", "Term sheet signed".

**Gates:**
- **Runway gate**: No new hires or major expenses if runway < 6 months.
- **OKR gate**: Quarterly review tasks cannot close until all KRs are measured and committed.

**Autonomous Execution:**
- An agent tracks OKR progress, updates runway calculations as expenses are committed, sends investor update emails, and flags blockers ("Runway critical, fundraising blocked, escalate to CEO").

## Conclusion

A git-based, stateless, LLM-driven company is not science fiction. The primitives exist: git for state, agents for execution, gates for quality, loops for orchestration. The experiments (Paperclip, ohmyroadmap, ClosedLoopOS, ohmybetterroadmap) prove the concept across different domains and scales.

The must-haves are clear: task DAG, state machine, pre-commit gates, evidence ledgers, CEO loop, atomic transitions, recursive delegation, portability. The nice-to-haves improve the experience but are not blocking. The non-goals keep the system focused: no real-time collaboration, no hosted SaaS, no all-in-one platform.

The result is a system that can orchestrate any digital endeavor—software or otherwise—with committed state, autonomous loops, and human oversight at the decision points that matter. The system is auditable (every change is in git), recoverable (history is the backup), and forkable (branches are experiments). It is as universal as git itself.

The question is not whether this can work. The question is what you will build with it.
