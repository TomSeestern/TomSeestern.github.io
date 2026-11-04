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

Software, yes: version control is native, CI pipelines are mature infrastructure. But also house renovations with material orders and permit tracking, design agencies with client feedback loops, science slams with rehearsal schedules, startup orchestration with investor updates and runway burns. The common thread is work that can be represented as tasks, dependencies, decisions, evidence, and state transitions.

This post surveys the feature landscape, drawing from four experiments in LLM-driven orchestration: **Paperclip** (multi-agent platform), **ohmyroadmap** (DAG-based roadmap ceremony), **ClosedLoopOS** (YAML SOP runner for agent companies), and **ohmybetterroadmap** (Rust-based evolution with verification attestations). Each approaches the problem from a different angle. Together, they sketch the requirements for a system that can run any digital endeavor with minimal human intervention.

## Beyond Software Development

Software projects are the obvious first domain—code is already text, version control is native, and CI pipelines are mature infrastructure. The same primitives work for non-code domains when you commit the right artifacts:

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

The default mode is unattended loops. Agents dispatch work, delegate sub-tasks recursively, verify outcomes, commit results, and open PRs—without human intervention. Critical decisions (security changes, budget approvals, architecture shifts) require explicit human gates.

**ClosedLoopOS** has two modes: supervised (every step waits for human approval) and autonomous (only PR merge requires approval, and that is opt-in with `FORGEJO_AUTO_MERGE`). SOPs declare which steps are `owner: human`. Human tasks block execution until a human unblocks them.

**ohmyroadmap** uses `[H]` markers for human tasks: planning decisions, key approvals, credential provisioning. The `jot --block` command creates a human task with rationale. The orchestrator skips human tasks until they flip to done. The board (the human operator) unblocks them manually.

### Verification as First-Class Contract

Work is done when it is verified. Tests pass, gates close, evidence is committed, acceptance criteria are met. The verification contract is executable: a script that returns 0 or 1.

**ohmyroadmap** has a gate engine: every node passes through gates (discovery, goal-contract, substrate, acceptance-criteria, evidence, attestation) before flipping to done. Gates are TypeScript/Rust functions that read the store and return pass/fail. The pre-commit hook runs the gate suite. A red gate blocks the commit. The ceremony enforces gate order: you cannot attest before you have evidence.

**ClosedLoopOS** delegates verification to the SOP steps: each step declares success criteria, and the agent must produce evidence (logs, screenshots, test output) that the step passed. The PR template embeds the verification report.

## Two Framing Ideas

Before diving into requirements, two ideas shape almost everything:

**1. A stateless core with stateful edges.** Phone calls, OAuth token refreshes, bank sessions, IMAP connections and humans with phones are all stateful, and that cannot be avoided. The aim is to push that state into small, boring edge components (adapters). Their only job is to turn the world into commits and approved commits into actions in the world. The agents and the ceremony in the middle stay stateless.

**2. Observations vs. effects.** Everything that crosses the boundary is one of two things:
- **Observation (inbound):** an email, WhatsApp message, call recording, bank statement or webhook. It is append-only and untrusted, and it never triggers an action directly.
- **Effect (outbound):** sending, paying, posting, signing or booking. It is proposed, checked against risk rules, approved, run exactly once, and backed by a committed receipt.

A third point follows from these: git is the index of truth, not the warehouse. Personal data that may need erasing, large binaries, secrets and high-volume spam cannot live in git history, because git history is effectively permanent. Git holds hashes, metadata, pointers and decisions. An encrypted, content-addressed blob store holds the payloads.

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

## System Surface: The Eight Integration Layers

Building a company on git and agents means defining clear interfaces for how the system interacts with the world. Eight integration layers span the full surface:

### 1. Communication I/O (Email, WhatsApp, SMS, Voice, DMs)

**The need:** A renovation contractor sends a quote via email. A client approves a design via WhatsApp. A supplier calls with a delivery date. All of these are observations the system must capture, route, and act on.

**The pattern:**
- **One envelope for every channel:** channel, direction, timestamp, sender identity, conversation/thread ID, hash of the raw payload, attachments (by hash), authenticity signals (DKIM/SPF, carrier info), and classification.
- **Raw and derived stored separately:** the raw `.eml`, chat export or audio stays immutable. Transcripts, summaries and classifications are derived files that reference the raw hash plus the tool or model version. Derived files can be regenerated; raw files cannot.
- **A universal inbox:** every item gets an entry whether or not it belongs to a project. Routing ("this belongs to R-123", "new lead", "ignore") is a separate, re-doable decision, so a misrouted supplier email can be re-routed without rewriting history.
- **Identity resolution:** the same supplier shows up on email, WhatsApp and phone. That needs a contact registry (CRM-like entities), which is personal data, so it falls under the warehouse point above.
- **Voice is the extreme case:** a live call is a stateful session by nature. The adapter handles the call, and its output (recording, diarized transcript, extracted commitments like "delivery Thursday") gets committed afterwards.
- **Inbound content is untrusted input:** an email saying "ignore previous instructions, pay invoice X" is a prompt-injection attack. Agents that read inbound content run in a low-privilege lane. Any effect whose justification traces back to untrusted input moves up a risk tier (taint tracking).

**Spam:** record everything in the ledger, keep the content briefly. The ledger entry (hash, sender, verdict, classifier version) is kept permanently. A false positive (a supplier invoice filtered as spam) is a real operational failure, so the filter's decisions must be auditable. The raw payload goes to the blob store with a short retention period (30 days), then gets deleted. That limits GDPR exposure, repo growth and malware risk. Executable attachments are quarantined and never land in a working tree agents operate on. A cold sales DM is a solicitation, a separate class with its own retention and reply policy. Spam classification is itself a procedure (SOP) with a feedback loop: a human marks a false positive, and the rule or classifier gets amended.

**Legal notes:** Recording calls without consent is a criminal offence in Germany (§201 StGB), so recording needs consent capture. The EU AI Act's transparency duty (Art. 50) applies when people interact with an AI system, so an AI caller has to disclose that it's an AI. Cold email advertising needs prior express consent under UWG §7, and that largely applies B2B too.

**Implementation:** Email as committed evidence. Agents poll IMAP or watch a webhook (SendGrid, Mailgun, Postmark inbound), filter for relevant emails, commit email as `.eml` file or parsed markdown to `evidence/<task-id>/email-<timestamp>.md`, update task state based on email content. The system sends emails via SMTP or API, commits the sent email metadata (to, subject, timestamp) to `notifications/<task-id>/sent-<timestamp>.json`, never the body (redundant with task state).

### 2. Deterministic Asset Creation

**The need:** The system must produce videos, documents, graphics, and audio in a way that is reproducible, auditable, and verifiable. A regenerated asset from the same inputs should produce the same output (or a documented explanation of why it differs).

**The pattern:**
- **Asset = recipe + pinned toolchain + inputs (by hash) → output hash.** This is essentially a Nix derivation, and that model fits well here.
- **Assets as text where possible:** video timelines (OpenTimelineIO, MLT, Remotion, ffmpeg filtergraphs, Blender Python), documents (Typst/LaTeX), graphics (SVG), and audio (TTS with a pinned voice).
- **Separate reproducible from traceable.** Generative model calls are not bit-reproducible: API models change underneath you, and seeds do not guarantee identical output. A generation is recorded as an observation (prompt, model, parameters, output captured and hashed), and everything downstream of it is deterministic. The chain stays complete even when one link cannot be rebuilt.
- **Remove other sources of nondeterminism:** embedded timestamps, encoder thread counts, GPU float behaviour, font availability.
- **Large outputs:** often you commit only the recipe and output hash, and cache the binary in the artifact store.
- **An escape hatch for opaque human input:** when a designer works in Figma or Photoshop, the export is captured as an input artifact.
- **Visual diffs for review,** plus provenance metadata for AI-generated media (C2PA content credentials; the AI Act also requires labelling synthetic content).

### 3. Risk, Money, Permissions and Auth Flows

**The need:** Cold emails are irreversible effects. Payments are irreversible and carry fraud risk. High-value actions need human approval. Low-risk actions can proceed automatically. The system must score risk and route accordingly.

**How to score risk:** a single tier per action type is too coarse. Score each action on:
- **Reversibility:** an internal edit can be undone; a sent message or payment cannot.
- **Monetary value,** aggregated over a time window. Ten payments of 99 € are one payment of 990 €.
- **External visibility and whether it speaks as the company.**
- **Legal binding:** contracts, signatures, filings.
- **Counterparty novelty:** paying a new payee is the classic invoice-fraud / business-email-compromise (BEC) vector.
- **Data exposure.**

**Mechanisms:**
- **Agents propose, executors execute.** The agent never holds the bank credentials. A separate executor runs only actions whose payload hash has been approved.
- **Approvals bind to the exact payload,** not a description. That prevents bait-and-switch. A git-native version: the approval is a signed commit (SSH/GPG, a hardware key for high tiers) referencing the action hash, and the gate checks the signature against allowed keys.
- **Escalation ladder:** auto → logged → single human approval → two-person rule → approval plus a cooling-off delay.
- **Defence in depth outside your code:** bank-side limits, per-vendor virtual cards with caps, payee allowlists. Strong customer authentication under PSD2 already forces a human into many payment flows.
- **Idempotency is required because the system is stateless.** A resumed agent must not pay twice. Use an outbox pattern: commit the intent with an id → the executor performs it → commit the receipt. On resume, check for the receipt first. For reversible effects, define compensating actions (sagas).
- **Bookkeeping as plain-text accounting** (beancount/hledger) fits git well. Statutory retention rules (GoBD/AO in Germany) favour immutability, but they conflict with GDPR erasure, so retention has to be defined per data class.

### 4. SOPs and the Feedback Loop

**The need:** Agents should not reinvent the wheel every time. A tested procedure (how to send an email, how to verify a construction step, how to onboard a client) should be reusable, versioned, and improvable through feedback.

**The pattern:**
- **SOP = versioned procedure:** trigger, inputs, steps, allowed tools and adapters, risk tier, checks, outputs, owner. Each run records the SOP version it used.
- **Split three concepts:** SOPs (how to do a task), Rules (invariants that always hold), Checks (automated verifiers).
- **Pre-effect hooks on effect types.** A spellcheck hook on "outbound email" covers every SOP that sends email. Pre-commit hooks for the repo, pre-effect hooks for the world.
- **SOP discovery:** a registry matched by trigger or intent. If no SOP fits, the agent improvises, records the full trace, and proposes a draft SOP from it (SOP mining).
- **Feedback sources:** human edits to agent drafts (the diff between draft and sent version is the most valuable signal), failed checks, incidents, outcome metrics (reply rate, rework rate). Each one becomes a friction entry, then an SOP amendment as a pull request.
- **Regression testing SOP changes:** replay past cases against the new version before it ships. This is ohmybetterroadmap's differential-fixtures idea applied to procedures.
- **Hygiene:** usage metrics, retiring dead SOPs, recorded deviations ("I skipped step 4 because…").

### 5. Secrets

**The need:** Agents should never see secret values. Credentials rotate, expire, and must be revoked when compromised. The system needs a vault, not environment variables in git.

**The pattern:**
- **Agents should never see secret values.** A broker injects credentials into an approved action. Git holds references (`secret://bank/main`); values live in a vault. sops+age encrypted in the repo is an option; so are Vault, 1Password or Bitwarden.
- **Credential types behave differently:**
  - **Static keys and passwords:** straightforward.
  - **OAuth refresh tokens:** they rotate, which makes them state, so the broker owns them.
  - **TOTP seeds:** storing the seed next to the password turns 2FA back into one factor. This is a per-account policy decision.
  - **Passkeys/WebAuthn:** hardware-bound ones need a human tap, which works as a natural human gate.
  - **SMS 2FA:** the system needs a phone number it controls, which links back to the I/O adapters. SIM-swap risk applies.
  - **Recovery codes:** offline, human-only.
  - **Also:** SSH/GPG keys, certificates, banking authentication.
- **Scoped, short-lived credentials** per SOP or task, and a separate identity per agent so the audit log shows which agent used what.
- **Rotation, revocation, break-glass, leak scanning** (gitleaks in pre-commit and CI).
- **Redaction:** browser screenshots and call transcripts can capture passwords and card numbers (PCI scope).
- **Accounts belong to the organisation,** not to an agent, with a human recovery path (bus factor).

### 6. External Services: MCP vs. Browser Steering

**The need:** The system must interact with bank portals, supplier websites, government forms, and internal tools. Some have APIs. Some do not.

**Prefer integrations in this order:**
1. Official API
2. MCP server
3. CLI
4. Scripted browser (Playwright)
5. LLM-driven browser or computer use
6. A human

**The pattern:**
- **An adapter contract per integration:** capabilities, operations split into reads and writes, a risk tier per operation, auth method, rate limits, idempotency support, and the evidence it produces.
- **Read adapters can be used freely; write adapters always go through the effect pipeline.**
- **MCP servers are supply-chain risk.** They are third-party code running with your credentials. Pin, review and sandbox them.
- **Explore, then codify:** LLM-driven browsing finds the path once, gets distilled into a Playwright script, and that script becomes part of the SOP. The run then stays deterministic until the site changes.
- **Browser hazards:** Terms of Service, bot detection (do not build CAPTCHA bypasses), and prompt injection via web content. Playwright traces and screenshots serve as evidence.
- **Who owns which truth:** git is the source of truth for intent, decisions and evidence, the bank is the source of truth for the balance. External state gets mirrored into git as timestamped snapshot observations, never as authoritative data.

### 7. Human Collaborators

**The need:** Some tasks cannot be delegated to agents: in-person construction inspection, attending an event, signing a contract in person, making a judgment call that requires domain expertise the agent lacks.

**The pattern:**
- **Three human roles with different trust levels:**
  - **Governors (the board):** approvals, signed decisions.
  - **Workers:** in-person tasks, inspections, events.
  - **External parties:** clients and suppliers, who are only ever correspondents.
- **Humans will not use git.** Tasks go out through channels they already use (WhatsApp, SMS, a small mobile web page). Results come back as photos, checklists, timestamps, location and signatures. The system commits them on the person's behalf, with attribution (co-author or a signed attestation).
- **A worker registry:** skills, qualifications, location, availability, rates. Some inspections legally need a qualified person; for example, building acceptance in a renovation needs a licensed professional.
- **Waiting on humans as a first-class state,** with timeouts, reminders, no-show handling and reassignment.
- **Verification scaled to risk:** photo EXIF and location, second-person checks, spot audits.
- **Safety, liability and employment law:** do not dispatch people into unsafe situations. Dispatching freelancers like employees raises false self-employment questions (Scheinselbstständigkeit).

### 8. Rules and Automated Enforcement

**The need:** Formatting must be stable across the repo. Schema must be valid. State transitions must follow the defined machine. Legal constraints must be checked. These are gates, not suggestions.

**The pattern:**
- **Rule taxonomy:** format, schema, structure (DAG/state machine), policy (risk), content (tone, spelling, brand), legal (consent, retention). Each rule has an id, rationale and enforcement mechanism.
- **Enforcement at every point where a mistake can enter:**
  - Pre-commit for fast checks.
  - CI and pre-push for slow ones.
  - Pre-effect for anything leaving the system. Pre-commit cannot cover this, because effects are not commits.
  - Runtime monitors (velocity limits, budgets).
  - Periodic drift audits.
- **Client-side hooks are not a security boundary.** An agent controls its own checkout and can skip hooks with `--no-verify`. Rules that matter need enforcement on the server side: forge pre-receive hooks, required checks, protected branches.
- **Stable formatting:** one formatter entry point (treefmt fits a Nix setup) and canonical serialisation (sorted keys, normalised YAML/JSON, LF line endings), so diffs only show real changes.
- **Agents must not be able to weaken their own gates.** Changing the policy that gates payments is itself a top-tier effect: code owners on policy files, plus a required human signature.

## Additional System Needs

Beyond the eight integration layers, the system needs:

- **Clock and scheduler:** a stateless system needs something to wake it up. Deadlines, follow-ups ("chase the supplier if no reply in 3 days") and recurring SOPs need committed timers and an edge scheduler.
- **Persona and identity:** who the agent speaks as, signatures, AI disclosure, brand voice per domain.
- **GDPR vs. git immutability:** the biggest structural conflict here. Likely answer: personal data lives in an encrypted blob store with per-person keys. Deleting the key effectively erases the data (crypto-shredding), and git history only holds hashes.
- **Concurrency:** many agents committing at once. Partition into repos per domain or project, and keep one writer per store (ohmybetterroadmap already has a roadmap entry for this).
- **Kill switch:** a global stop for all effects that a human can trigger from a phone.
- **Memory and retrieval:** search and embedding indexes are derived caches rebuilt from git, never authoritative.
- **Contracts and e-signatures:** binding commitments (eIDAS signatures), deliberately top-tier.
- **Cost accounting:** tokens, API spend and human hours per task, feeding the budget gates.

## Nice-to-Haves

These improve the experience and are not blocking for a minimal viable system.

### 1. Visual Task Graph Renderer

A live-rendered dependency graph helps humans understand the plan. It should show task states, the current frontier, blocked tasks, and the critical path. Export as SVG for embedding in docs.

**ohmyroadmap**'s `view` command renders the DAG as an HTML page with inline SVG. Nodes are colored by state. Edges show dependencies. The page is self-contained (no external assets). The rendering uses D3.js force-directed layout. The graph updates live as `ROADMAP.md` changes.

**Paperclip** renders the task hierarchy as an interactive tree in the web UI. Expand/collapse nodes, drag to reorder, click to open task detail. The tree syncs with `state.json`.

### 2. Slack/Discord/Email Notifications

Notify humans when a task completes, a gate fails, a budget expires, or a human task is blocked. Integrate with Slack webhooks, Discord bots, or SMTP. Include a link to the PR or the task diff.

**ClosedLoopOS** can notify via webhooks (configurable in `settings.yml`). The notification payload includes the SOP name, step status, PR URL, and agent ID.

### 3. Time Budgets and Cost Tracking

Track wall time, token usage, and API cost per task, per agent, per session. Enforce budgets (max 10,000 tokens per task, max $5 per sprint). Warn when approaching limits. Log overruns.

**Paperclip** tracks token usage and cost per session. The budget is a first-class field in the task schema. The UI shows remaining budget and burn rate. Agents stop when the budget is exhausted.

**ohmyroadmap** has a run budget (max iterations per `exec-batch` invocation). The watchdog kills the loop when the budget drains. Token budgets are delegated to the agent harness.

### 4. Decision Records (ADRs)

When a design choice or policy change is made, record it as an Architecture Decision Record: context, decision, consequences, alternatives considered. Commit ADRs to `docs/adr/` or `.omr/decisions/`. Link decisions to the tasks they affect.

**ohmyroadmap** has a decision-record protocol: `ohmyroadmap decision` scaffolds a decision file. Decisions are markdown files with a standard template. Tasks can reference decisions with `(decision D-123)`.

**ClosedLoopOS** can embed decision rationale in SOP comments or in dedicated `decisions/` files. The PR description links to relevant decisions.

### 5. Task Templates and Quick-Add Commands

Scaffold common task types with templates: "Add feature", "Fix bug", "Spike", "Refactor", "Deploy". Templates include pre-filled acceptance criteria, evidence requirements, and gate checklists.

**ohmyroadmap** has a template system: `ohmyroadmap jot --template <name>` expands a template into a new entry. Templates are markdown files in `.omr/templates/`. The template engine substitutes placeholders.

### 6. Differential Mutation Testing for Ceremony Changes

When the ceremony itself changes (gate logic, state machine transitions, DAG validation), run differential tests: freeze the pre-change state, run the ceremony, capture the post-state, compare with a frozen expectation. This prevents ceremony regressions.

**ohmybetterroadmap** has a differential test suite: `fixtures/` contains stores (committed roadmap state), `cases.json` lists test cases (argv + setup + expected output), and `harness/run.py` runs both the source and target implementations and diffs their outputs. Exit code, stdout, stderr, and the git tree hash are compared. Placeholders make tests portable.

### 7. Board Cockpit (Single-File UI)

A local HTML file (or a static site) that renders the roadmap, task graph, evidence ledger, decision log, and budget burn. No server required—open the file in a browser. The page reads from `.omr/` or the git worktree. Updates live as files change.

**ohmyroadmap** can generate a static board: `ohmyroadmap board` writes `board.html`. The page embeds all state from `.omr/` and renders it with inline JavaScript. The board is a snapshot, not live-synced (refresh to update).

**Paperclip** has a web UI (Vite + React). The UI is a dev server, and the goal is the same: zero backend dependencies, all state from files.

### 8. Multi-Repository Orchestration

Coordinate work across multiple repos: a monorepo for core services, a separate repo for docs, another for infrastructure. Tasks can depend on tasks in other repos. Evidence can be cross-repo (a test in repo A proves a requirement from repo B).

**ClosedLoopOS** can orchestrate multi-repo workflows with SOPs that clone, checkout, and push across repos. The SOP defines the repo list and the cross-repo dependencies.

## Non-Goals

These are explicitly out of scope. They belong in adjacent systems, not in the core orchestration layer.

### 1. Real-Time Collaboration (No Operational Transform)

Two agents editing the same file simultaneously is a merge conflict, not a collaborative edit. The conflict is resolved with git merge tools, not with CRDTs or operational transform. Concurrency is managed with branches and locks, not with real-time syncing.

### 2. Hosted SaaS Platform

The system is self-hosted. It runs on your machine, your git server, your CI. There is no hosted version, no sign-up. If someone wants to host it as a service, they can, but that is not the default path.

### 3. Natural Language Task Entry (LLMs Must Refine)

Humans do not type tasks as prose paragraphs. LLMs do. Tasks are created by agents using the `jot` command or by editing `ROADMAP.md` directly. Agents can parse natural language requests and generate structured tasks, the human interface is the committed file, not a chat box.

### 4. General-Purpose Knowledge Base

The system is not Notion, not Obsidian, not Roam. It does not manage unstructured notes, personal wikis, or freeform brainstorming. It manages tasks, dependencies, evidence, decisions, and state. If you need a knowledge base, use one—link to it from task descriptions.

### 5. Full CI/CD Pipeline Replacement

The system orchestrates tasks and gates. It triggers builds, runs tests, and parses coverage reports. It does not replace your CI/CD pipeline. It does not package binaries, deploy containers, or manage Kubernetes clusters. Use GitHub Actions, Forgejo Actions, GitLab CI, Jenkins, or any other CI system. The orchestrator calls them, it does not become them.

### 6. Auth/Permissions Beyond Git Forge

Access control is delegated to the git forge (GitHub, Forgejo, GitLab). If you can push to the repo, you can run the ceremony. If you can merge PRs, you can approve work. The system does not add its own auth layer, API keys, or role system. Git permissions are the permissions.

## Domain Examples

To make this concrete, here are four domain applications beyond software development.

### House Renovation

**Committed State:**
- `renovation/plan.yml`: List of rooms, materials, contractors, deadlines.
- `renovation/budget.yml`: Line items with estimates and actuals.
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
- An agent monitors the plan, sends reminder emails to contractors, updates the budget as receipts are committed, and flags blocked tasks.

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
- An agent tracks design iterations, sends review requests to the client, commits feedback to `feedback.yml`, and escalates blocked tasks.

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
- **Timing gate**: Rehearsal evidence must show the presentation is under the time limit.
- **Feedback gate**: Each rehearsal requires committed feedback notes from at least two reviewers.

**Autonomous Execution:**
- An agent schedules rehearsals, commits timing data, collects feedback, and flags issues.

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
- An agent tracks OKR progress, updates runway calculations as expenses are committed, sends investor update emails, and flags blockers.

## Decisions to Make Before Implementation

Before building, settle:

1. **Repo topology:** one company monorepo, or a comms/ledger repo plus per-project repos?
2. **Blob store and encryption scheme:** this decides how GDPR erasure, retention and binaries get solved.
3. **Approval primitive:** signed commits, a separate signing app, or both?
4. **Default risk tier when the system is unsure:** fail closed (escalate) seems right, it costs throughput.
5. **Where 2FA factors may be held together:** per account, explicitly listed.
6. **First domain to prove it on:** renovation, the design agency and the science slam put pressure on very different areas.

The question is not whether this can work. The question is what you will build with it.
