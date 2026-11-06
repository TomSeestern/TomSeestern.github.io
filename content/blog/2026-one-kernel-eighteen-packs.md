---
id: 2026-one-kernel-eighteen-packs
title: "One Kernel, Eighteen Packs"
articleDate: 2026-11-06
# The constitution below is checked against the dictionary the previous post
# defines. `statementRules` names the one governed section; `statementDictionary`
# points at the sibling file that holds the entries.
statementRules:
  - The constitution
statementDictionary: 2026-seven-nouns-eighteen-verbs.md
articleContent: "A company OS in one log and four services: records and gates stay domain-free, the eighteen packs add only nouns and gates, and the board decides through the same signed log."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI
  - Automation
  - Git
  - LLM
  - Company OS
  - Architecture
---


# One Kernel, Eighteen Packs

## A specification is not an operating system

The [first post](/blog/entry/2026-git-based-stateless-llm-driven-company) left fifty requirements, and the [second](/blog/entry/2026-seven-nouns-eighteen-verbs) rewrote them in a dictionary it is careful not to call a schema. That is true, and it is the useful part. A specification says what must be true. An operating system makes the opposite expensive.

This post is about the second thing. It asks what has to exist between the fifty requirements and a running company: a small kernel that enforces the vocabulary and a board that decides at the edge, rather than another document or a framework with a plugin for every trade. I call it a company OS. It has one log, four services and one rule about words: the kernel knows no business noun.

The claim is narrow. A kernel of that size runs the records, gates, grants and decisions of any of the eighteen function packs from the previous post, and of a trade pack such as construction. It can also be exact about the one thing that matters most: when a human has to decide. Fully autonomous is the wrong slogan. The right one is autonomous to the level each grant names and precise about the boundary.

None of this is a report from a running system. The log and the four services are a design, and the sections that follow name the decisions the design still needs. None of it is legal advice either: a citation names the rule a pack has to encode, not a finding that the rule applies.

## What use-case agnostic actually means

Delete the packs and the kernel still runs. It can append a record, run a gate, check evidence, derive a view and escalate a decision. It has nothing to do, but nothing is missing. Take a pack, delete the kernel, and you have a filing cabinet.

The test is a swap. Replace the construction pack with the finance pack. The log format does not change. The gate interface does not change. The grant keeps its shape. The words inside the records change. So do the statutes and the adapters. If the kernel has to change for the second pack, the first pack was the product.

That test is why the kernel may not contain a business noun. A kernel that knows what an invoice is has already become an accounting system, and the next trade needs a fork. The kernel knows seven record kinds and eighteen verbs. A pack maps the trade's nouns onto the kernel's: rooms and crew seats become THINGs, a crew-day becomes a UNIT and a bill of quantities becomes a VIEW of AMOUNTs. The kernel reads the same records either way.

The rule that keeps this honest is blunt: a pack adds nouns and gates. It adds no record kind and no verb. If a pack needs a new verb, the kernel changes, and a kernel change is a constitutional decision: board, quorum, a migration for every pack. A pack can define a compound, such as a booking, because a compound is a noun with a fixed phrase. It cannot add a verb such as "reserve", because the verb for moving capacity is POSTING. The difference sounds pedantic until eighteen packs each bring their own synonym for the same act.

## The kernel is one log and four services

The four services are loops around one log, rather than a product of five modules. Any of the four can be replaced without changing a record. The log is the one you cannot swap: its hashes are the names a record is cited by.

### The log

Git is the store, and the log is the only authority. An append is a signed commit; the kernel verifies the signature against the key register as it stood at the commit's parent, so a rotation does not rewrite the past and a revoked key keeps its validity. History is linear. A rewrite is a DECISION, and a board-only one. A second STORE is append-only under a different KEY, refuses DELETE and refuses a non-fast-forward push, so one compromised KEY cannot rewrite both copies.

The test of the log is simple: delete every view, every cache, every index, and the company is still there. Delete the log, and it is gone.

A commit is the unit of atomicity, not the record. The previous post left that open: one APPEND holds one record, but a transition is several records changing together. The kernel closes the gap by letting the commit carry a commit manifest that lists the record files in its tree. The gate refuses a commit whose manifest omits a record file or names one the tree does not hold, and a pack RULE can then require that a transition of a given class include the record kinds that class names. A commit lands whole or not at all; the manifest is what lets the gate ask whether the whole is complete.

An EFFECT is the part a commit cannot make atomic, because the adapter acts outside the log. Once the DECISION exists, the kernel APPENDs a planned EFFECT that CITEs it and carries an id derived from the payload HASH and the action class, so a second driver cannot mint a second plan for the same payment. The adapter receives the id as its idempotency key, a resumed RUN CHECKs the receipt before it retries, and a scheduled reconciliation opens a TASK only for a plan that carries neither a receipt nor a refusal. The receipt confirms the POSTING the plan intended; a failed effect APPENDs a reversing POSTING.

### The scheduler

The scheduler picks one ready TASK from the frontier, gives it to one RUN and stops when the frontier is empty, a limit is reached or a DEADLINE passes. The frontier is a VIEW: the tasks whose dependencies are satisfied and whose gates have passed. It is derived, not stored, because a stored queue is a second source of truth and the second source is always the one that drifts.

One driver per STORE holds a «lease» with a deadline and a «fencing token», and the STORE refuses an APPEND whose token sits behind the last one it accepted, so a driver whose «lease» EXPIREd cannot APPEND. The driver executes the step it is given and appends nothing beyond it. The planner proposes; the driver does not. That separation is why a stopped procedure looks like a quiet day, and why a party outside the loop holds a dead-man's switch on another provider: a SIGNed heartbeat from every RUN and a SIGNed all-clear from the service PARTY each day; the switch watches that signal rather than the page, and a missed one APPENDs a TASK on the board's second ADDRESS. A STOP that is recorded is not a missed signal.

Every DEADLINE, «lease» and GRANT runs on a synchronised time source, and a committer's clock is a claim rather than a time. The source sits outside the company: a timestamp authority for the log, and the receipt time of an outside PARTY for anything that leaves it. A record whose time carries weight carries an ANCHOR too, a later record that CITEs its HASH and the STORE's receipt time, and the gate refuses a weighted record whose ANCHOR is missing or predates it. When no source answers, the gate refuses the append; it does not fall back to the committer's clock.

### The gate

The gate is the only place the kernel says no. It checks before an APPEND, an EXECUTE, a DELETE and a SHRED. Fast rules run before the commit, slow rules before the push and effect rules before the EFFECT. A monitor checks budgets and velocity while the action runs. A gate whose tool is missing fails, and a failure refuses the action. The STORE refuses a commit that carries no gate verdict, so an absent gate and a failing gate give the same answer. The exception is the record that must exist when the gate is the thing that failed: a refusal or escalation signed under the service PARTY's GRANT, or a board repair DECISION under a reserved class. Such a record is its own verdict.

Two things the gate does not take from the proposer. The risk score comes from the payload and the records that predate the proposal, computed by a RULE; a proposal that brings its own score is refused, because the party that wants the effect would otherwise grade it. The pre-effect check passes, and the service PARTY APPENDs a single-use GRANT: a limit of one EXECUTE, a scope of LABELs naming the pack's effect class, a DEADLINE in minutes and a CITE of the payload HASH.

The executor is a PARTY with its own service KEY, whose GRANT covers EXECUTE on that class and nothing else. It is a different PARTY from the proposer and holds the external KEY the agent never gets. It re-reads the log before it acts and refuses a grant that is REVOKEd or EXPIREd, an ancestor that is, or a payload that moved. If it cannot read the log it refuses too, so the EFFECT waits under a DEADLINE; a blocked EFFECT is not a stopped RUN. An authority checked once and an effect executed later is a gap the second look narrows, and nothing closes it entirely.

A refusal is a record, signed by the kernel's service PARTY, whose GRANT lets it publish refusals and escalation tasks and nothing else. That sounds bureaucratic until the first incident: the difference between "the payment was blocked" and "the payment was blocked because the new payee had no second decision" is the difference between a story and a trace.

### The verifier

A CHECK is not EVIDENCE until a PARTY that did not do the TASK makes it. The verifier signs an attestation over the commit manifest and the tree HASH, so the attestation can live in a later commit, and the gate refuses one whose manifest does not match the tree the RUN used. Independence means a different party, ideally a different model, with a different prompt and no sight of the author's reasoning.

The two-writer test in the previous post is the prose version of this. Two writers who cannot see each other produce different words for the same idea; one writer and one verifier who can see each other produce agreement, and agreement is not evidence.

### The views

Every VIEW is disposable. If one is wrong, rebuild it. If a VIEW is cited as the input to a DECISION or an EFFECT, the kernel refuses the action, because a VIEW is rebuilt from source and can be rebuilt differently tomorrow. A DECISION cites records, not a rendering of them. A board member may READ a VIEW that compares payloads; the DECISION still CITEs the records.

One page a day carries the routine: the frontier, pending DECISIONs, the stop state and the evidence coverage. The urgent classes of requirement 4 bypass it, with their own trigger RULEs and an on-call PARTY, because a page a day is not where a child-safety report waits. The page is a VIEW. It may be rebuilt late; its all-clear still has to arrive before the switch's DEADLINE. It is not allowed to be the thing a payment depends on.

## The constitution

Thirteen statements. They are the kernel's invariants written in the dictionary the previous post defines. The frontmatter declares this section as statements and points at that post for the entries, so the same audit that checked the last post checks these against the same dictionary. It passes with no findings, which says the words are in the right case, under the limit and in a simple tense. It does not say the invariants are true; the adherence checks below are where that is tested.

1. The kernel knows seven record kinds and eighteen verbs, and no business noun.
2. A record is never edited; a correction APPENDs a new record that SUPERSEDEs or REVERSEs it, and only a board DECISION rewrites history.
3. The log is the only authority: every VIEW is DERIVEd from it, and a payload lives in a STORE the record CITEs.
4. No DECISION or EFFECT CITEs a VIEW.
5. A RUN advances one TASK under one PROCEDURE or none, by one PARTY.
6. A gate CHECKs an APPEND, an EXECUTE, a DELETE or a SHRED before it lands, and a failed CHECK refuses the action.
7. A passing CHECK that a TASK CITEs is EVIDENCE, and the PARTY that made it did not do the TASK.
8. A GRANT names an action class, a scope of LABELs, a limit and a DEADLINE, and it EXPIREs at the DEADLINE.
9. The kernel ESCALATEs a DECISION to a PARTY with more authority when a limit is reached or a DEADLINE passes.
10. A PARTY with the GRANT DECIDEs by SIGNing a DECISION that CITEs the payload HASH; silence never DECIDEs.
11. An EFFECT needs a GRANT and CITEs a DECISION that names its payload HASH, and an EFFECT that moves an AMOUNT APPENDs a POSTING.
12. A pack adds nouns and gates; it adds no record kind and no verb.
13. A STOP ends a RUN or an EFFECT lane before its normal end, and the record names why and what it stopped.

The first is the vocabulary. The next three are the log: an append, a derivation and a rule against citing one. The next three are the run and its check. The next three are authority: a grant, an escalation and a decision. The last three are the boundary: an external effect, a pack and a stop. A kernel that cannot enforce one of these is a framework with opinions.

## A pack is four files

An annex, a statute file, a procedure file and a gate file. The annex maps trade nouns to record kinds and compounds. Requirement 42 is the model: a room is a place, a truck is a vehicle, a crew-day is the UNIT a capacity ACCOUNT counts, and a bill of quantities is a derived VIEW. The statute file carries what a citation hides: the trigger, the party to notify, the artifact that proves notice and the consequence of lateness. The procedure file holds the standard operating procedures as PROCEDUREs, with steps, budgets and triggers. The gate file is the checks, LABELs, limits and decision rights.

A PROCEDURE is the record the RUN cites. The pack versions it, the RUN names the version, and a change is a DECISION. A human edit, a failed CHECK, an incident or a metric opens a TASK to amend it; the amendment is replayed against past cases as fixtures before it is promoted; the old version stays citable, and a PROCEDURE no RUN uses is retired. That loop is what turns a standard operating procedure into a PROCEDURE the kernel can run, and it is the same replay the conformance suite uses.

A pack manifest sits above the four: the units the pack measures, the ACCOUNTs it opens, the ADDRESSes it uses, the adapters it needs, the dictionary version it pins and the conformance scenarios it must pass.

The pack may add nouns, compounds, LABELs, RULEs, units, ACCOUNTs, ADDRESSes, gate thresholds, adapters and VIEWs. It may not add a record kind or a verb. It may add a gate; it may not remove a kernel gate or weaken the evidence rule. It may not introduce a KEY class the register does not know.

That list is short on purpose. The alternative is a framework that calls every trade a plugin, and a plugin that can change the kernel is a fork with better marketing.

## Autonomy is a grant

The previous post already has the ladder, in requirement 25: automatic, logged, one human DECISION, two-PARTY DECISION and a DECISION with a cooling-off DEADLINE. I would keep those five rungs. They apply per action class. A company can be at the top on email and at the bottom on payments.

- Level 0, automatic: the agent PROPOSEs and the kernel runs its gates, but nothing leaves the company.
- Level 1, logged: reversible EFFECTs inside a limit. A RULE DECIDEs, the gate APPENDs that DECISION and the board can READ every one.
- Level 2, one DECISION: an irreversible or above-limit EFFECT needs one human DECISION.
- Level 3, two PARTYs: a new payee, a risk=top EFFECT or a pending dispute needs a second human, or an outside PARTY such as the bank's own authentication.
- Level 4, cooling-off: the class the policy puts here waits, and the board can reverse it before it lands; a constitutional change is always one of them.

The default for an external EFFECT is level 0, and internal work still runs unattended. A GRANT widens it. A signed message from one board member tightens it; loosening it needs the quorum, and a party that gains from the widening does not count toward it; a board of one loosens nothing without a cooling-off DEADLINE. That asymmetry is the whole safety property: autonomy is easy to remove and hard to add.

The GRANT is a record, not a setting. There is no config file that quietly widens it, and no environment variable that turns a gate off. The gate reads the log. If the log does not contain a GRANT for the action class, the action does not happen. A board member who wants to widen autonomy has to write a record that says so, with a scope, a limit and a DEADLINE.

The ladder is also a budget. Every level has a limit in money, tokens and hours. The harness enforces the budget rather than the spender: a class limit that is breached ESCALATEs, a party budget that is exhausted STOPs, and the tighter bound wins. A budget is an AMOUNT limit with a DEADLINE, held by a PARTY; the rate the board sets between money, tokens and hours is a LABEL on a FACT. A stopped RUN is cheap. An unbounded RUN is how a company discovers its token bill at the end of the month.

## Escalation is a record, not a meeting

The gate does not send an email. It APPENDs a DECISION TASK with nine fields: the RULE that fired, the ANCHOR the task opened at, the payload HASH, the options, the DEADLINE, the consequence of no answer, the quorum, the second ADDRESS and the policy COMMIT that names the class. The task CITEs that policy, so a later policy does not retarget an open task, and the second ADDRESS comes from the PARTY register rather than from the payload. The board is the set of PARTYs at the root of the grant tree, each with a KEY and an ADDRESS. An answer is a SIGNed DECISION that CITEs the payload HASH and names its answer: approve, refuse, defer or delegate. The kernel verifies the signer against the register and refuses a decision that cites a different payload.

Silence never DECIDEs. If the DEADLINE passes, the consequence is a STOP or a refusal, unless a statute says otherwise. The exception needs a citation: §42a VwVfG applies only where another provision orders the fiction, and only to an authority's permit, not to a private board's silence. A private company gets that effect from a contract or from a statute that names it, and then it is a deemed consent rather than a permit. The DEADLINE counts from the authority's receipt of complete documents, as the record shows it, not from the day the application arrived.

A later finding of incompleteness is the authority's OBSERVATION, and a withdrawal is that PARTY's DECISION; the company REVERSEs its own GRANT record by CITing that DECISION, and the log never reverses the permit. A RULE APPENDs that GRANT at expiry only where the citation supports it.

The list of things that always escalate is short because the gate is strict, not because the board is generous:

- a new payee or a changed bank ADDRESS;
- an EFFECT above the GRANT's limit, or a summed AMOUNT above it over a span;
- an irreversible external EFFECT, including a publication that cannot be withdrawn;
- an EFFECT at risk=top, whatever a board member signs;
- a personal act: a clinical note, an insurance certification, a manuscript signature, a thesis or a discretionary DECISION;
- a pending or threatened dispute, a cease-and-desist letter or an inquiry from an authority;
- a change to a RULE, a policy, the dictionary or a kernel invariant;
- a new kind of statement in the company's name;
- a history rewrite;
- two agents that disagree and cannot settle it with a CHECK;
- a frontier that has not moved across too many RUNs.

The board is not the only place a decision can land. A manager is a PARTY with a KEY and a GRANT between the worker and the board: the worker's GRANT is narrow, the manager's GRANT covers the class, and the manager SIGNS a DECISION that CITEs the payload HASH. A GRANT CITEs the GRANT it derives from. The gate refuses a child whose action class, LABELs, limit, DEADLINE or KEY class is wider than its parent's remaining authority, and it sums every descendant's POSTINGs against each ancestor's limit, because a shape check at creation does not bound what two siblings spend together. EXPIRY or REVOKE of a parent reaches every descendant. The kernel resolves the target from the decision-rights policy, not from a hardcoded human.

A reserved class names a human KEY: a personal act, risk=top, a new payee, a new kind of statement, above the root limit, a threatened or pending dispute, a constitutional change and a history rewrite. The kernel refuses a KEY class below a human KEY and escalates again. Every other class goes to whichever PARTY the policy names, which is what makes a manager possible at all; a manager holds a GRANT and is not a board member.

A manager cannot make the CHECK on its own RUN; the verifier is a different PARTY. The log does not know a manager from a board; the policy does. A manager that never escalates is a rubber stamp, and a manager that escalates everything is a router; the overturn rate per level is how the board tunes the grants.

The board reads the payload itself, and the escalation page carries the options, the RULE that fired and the consequence of no answer. The decision is one signed commit. If the board wants to delegate the class back, it writes a GRANT. If it wants to decide case by case, it leaves the class at level 2 or 3.

A queue that never empties is a governance failure, not a backlog. The fix is a GRANT or a narrower pack, not a faster meeting. A queue that grows while the board cannot be reached is an availability incident for the on-call PARTY, and the log should say which of the two it is. The OS should report the queue length, the median time to a decision and the overturn rate. A rate near zero means either that the escalation was unnecessary or that the board approves everything, and a sampling audit is what tells them apart; a rate near one means the GRANT is too wide.

## Adherence is five checks

A green prose audit proves the words agree; it proves nothing about the company. It is the first check, and the previous post already runs it. The other four each sit at a different layer.

**The schema.** Every record kind has a schema: required fields, allowed LABELs, the HASH of any payload, the PARTYs it names. A defined noun such as a GRANT is built from the seven and carries its own schema. A record that does not match the schema is refused before it reaches the log. The dictionary is the vocabulary of the schema, not a glossary beside it: a field named "message" is refused because the pack has to say which record the thing is.

**The append.** The gate runs on every commit, and its checks apply by record kind: a proposal carries no DECISION, an effect commit does. It checks the schema, the GRANT, the form of the act, the AMOUNT, the computed risk score, the DECISION that the effect CITEs and the evidence attestation. The commit is signed and the history is linear. A commit that fails any of these does not land.

**The behaviour.** The conformance suite is the check the previous post did not have. It replays a set of scenarios against a golden log: a task that should be refused, a payment that should escalate, a transition that should land whole, a view that should never be cited. A pack that fails the suite does not load. The coverage matrix shows the dictionary can express the work; the two-writer diff shows two writers express it differently; the conformance suite shows the runtime does what the spec says. The first two are evidence about the language. The third is evidence about the company.

**The drift.** The dictionary has a version. A pack pins it. A new word fails closed, and a word that changes meaning needs a board DECISION and a migration for every pack that used it. The audit runs in CI before the deploy, so the governed statements cannot drift between releases. The schema runs at the boundary, so the records cannot drift between deployments. The conformance suite runs before a pack loads, so the behaviour cannot drift between packs.

None of these checks tells you whether the company is doing the right thing. They tell you whether it is doing what it said. That is the whole claim, and it is smaller than "aligned".

## Two packs, one kernel

One pack is a trade pack built from requirement 42. A construction task: install the fire door in the east stairwell. The TASK cites a place THING, a crew seat and a truck, and a POSTING moves the crew's span onto it. The gate refuses the graph if the room is double-booked or the door has no access record. The crew takes a photo with a location and an ANCHOR; the photo is an OBSERVATION. The site lead signs the handover, and the signature is a DECISION. The invoice for the door is a separate TASK, and it escalates because the supplier is new.

The other is the finance-operations pack at its hardest. A bookkeeping task: pay the supplier. The invoice arrives as an OBSERVATION. A three-way match CHECK compares the order, the delivery note and the invoice. The POSTING moves the amount; the EFFECT leaves for the bank STORE; the receipt is an OBSERVATION. The gate refuses the payment if the payee is new, the period is locked or the amount is above the GRANT. The board decides once and that DECISION cites the invoice HASH.

The kernel sees TASKs, RUNs, CHECKs, EFFECTs and DECISIONs on both sides. It does not know a door from an invoice. The construction pack knows rooms and crews; the finance pack knows periods and tax. The adapters differ: a photo and mail on one side, a bank and a tax filing on the other. The log, the scheduler, the gate, the verifier and the views are the same log and the same four services.

That is the use-case-agnostic claim, and it is narrower than "one config for everything". The kernel is small and fixed. The pack is thick and local. A trade is four files: an annex, a gate file, a procedure file I have not measured, and the statutes it cannot avoid.

## The first pack is this website

The cheapest real loop is the one already running. This site has the checks: the content audit, the build and the end-to-end suite. It has the deploy. What it lacks is the loop around them.

A TASK: publish a post. Its acceptance criteria: the audit passes, the build passes and the end-to-end suite passes. The RUN drafts. The CHECK runs the audit. The EFFECT deploys, and it moves no AMOUNT, so it APPENDs no POSTING. The OBSERVATION is the live URL, with an ANCHOR. The DECISION is the author's publish signature. The GRANT says draft and propose, and deploy only after a signature. The rollback is a new deploy of the previous commit, not an edit of history.

The board is the author. That is the smallest honest test of the escalation path. A deploy is an EFFECT to a STORE the company does not control. If the OS can route that effect through a GRANT, a gate and a signed decision, it can route a payment through the same three. The failure mode is a bad post, and the reverse is a redeploy. The stakes are low enough to debug the loop.

The next pack is finance operations, pack 3 in the previous post. The kernel does not change. The bank adapter, the tax statutes and the period locks arrive. The failure mode becomes a payment, and the reverse becomes a letter from a lawyer. That is why the site goes first.

## What the kernel must refuse

A kernel is defined by what it refuses, not by what it allows. The refusals are tests, and each one has a name.

- The kernel refuses a pack that adds a verb or a record kind.
- The kernel refuses an APPEND without a GRANT for the action class.
- The kernel refuses a DECISION that CITEs a VIEW.
- The kernel refuses a DECISION without the payload HASH.
- The kernel refuses a DECISION that exists only as silence.
- The kernel refuses an EFFECT without EVIDENCE bound to the manifest.
- The kernel refuses a signature from a KEY class below the act.
- The kernel refuses an edit to the log, including a board edit without a DECISION.
- The kernel refuses a personal act under a KEY other than the named person's.
- The kernel refuses a pack that removed a kernel gate.
- The kernel refuses a second STORE that can DELETE.

Most of these are cheap to write and expensive to skip. The last one is the reason to keep the second STORE outside the first provider's failure domain. A backup that the same compromised KEY can delete is not a backup.

One refusal on that list is weaker than it sounds. A signature proves possession of a KEY, not who holds it: an agent handed a human's KEY signs exactly as the human would, and nothing in the log can see whose sleeve the KEY is up. The kernel can refuse a KEY class. Keeping the KEY is a deployment property, held by a hardware device, a presence mark bound to the payload HASH and a broker that never releases the KEY to the model. A design that assumes the kernel can tell an agent from its operator has already lost.

## What is still missing

The previous post listed twelve concepts the dictionary lacks. Not all twelve are kernel problems. The no-business-noun rule sorts them.

Three are kernel blockers. **The queue** is a VIEW. The scheduler needs it, and three writers wanted a word for the thing they look at first. **The atomic transition** needs the commit manifest and the outbox described above. **The score** needs a unit of value: the loop ranks value against cost, and the previous post used invented points. The kernel can declare a unit and let the board set its rate to money and hours. The rate is a LABEL on a FACT, not a law, and a board that forgets to revisit it is running on a stale exchange rate.

Six are pack compounds: the case, the legal basis, leave, minutes, the route and the persona. A case is a TASK with a long DEADLINE, a PARTY and a log of submissions; a legal basis is a LABEL whose value CITEs the statute RULE; leave is a COMMITMENT to a person, not a reservation of an ACCOUNT the company owns; minutes are a VIEW of the DECISIONs a meeting produced, with the decisions cited; the route is a policy of which ADDRESSes count as independent; the persona is a LABEL on a RUN plus an artifact and a RULE. Each is composed from kernel words, and each composition is a pack decision, not a new record kind.

Two are adapter problems. The receipt inside the ledger is a STORE's own word for a bank; for an email, the writer names a channel and trusts it. The sandbox is a STORE with a LABEL and a twin adapter: a mail server that traps outbound mail, a banking sandbox, an ACCOUNT with play money.

One is a legal relation. Rights in what an agent wrote are not a GRANT. A GRANT is a permission; copyright and the rights of use are a different relation, and for machine-written output it is not settled that a protected work exists at all. The kernel can record the CITE and the DECISION, but legal title is outside the log, and pretending otherwise is how a company discovers it does not control its own output.

Three more sit outside the twelve. The statute annex and the domain annex are pack content, not kernel features. The model evaluation is missing entirely: nobody has measured whether a model applies 856 statements under load, and there is no failure rate, no cost curve and no drift measurement. The conformance suite is the start of that evidence, not the end.

The frame also stops at the edge of the agent. The log and the four services govern what a PARTY APPENDs and what leaves the company; they do not build the PARTY.

Requirements 16 to 21 have no service here: the context packet, episodic and semantic memory, the skill library, prompts and metacognition. A company whose workers cannot remember last month is governed and ineffective at once.

Requirement 9's defence against a rubber-stamp checker — held-out cases, random assignment, a GRANT lost — is assumed by the verifier section and not contained in it. Requirement 35's erasure needs a payload store and a SHRED path; statement 3 admits the store and statement 6 gates the SHRED. Retention is a pack policy: a key per person and per class, a legal hold, and a deadline at which the key is destroyed. A hash tied to a person is still personal data, so SHRED is a measure whose sufficiency is a legal judgement.

Site safety in requirements 43 and 46 needs a halt order that reaches a person standing on the site, and an escalation record is not a stop button.

The measure is the gap a pack closes. Tokens and hours are amounts in a UNIT, and a spend is a POSTING to the provider's ACCOUNT, so cost per decision is a VIEW over postings. No pack has opened that ACCOUNT yet, and until one does the number is a wish with a format.

And the personal acts are not a gap. Requirement 38 is the boundary. No GRANT passes a personal act to an agent, and the signature stays with the position whose holder performs it; whether a deputy may act for that holder is a question for the pack's statute file. The OS is autonomous to the level each GRANT names and silent outside the personal acts. The fully-autonomous slogan is false; the precise version is better, and it is the version a lawyer can check.

## The build order

The first milestone is one task, one EFFECT, one escalation and one signed DECISION; the second is one replay.

1. The log, the schema, the gate and the site pack. Append one post through the loop, with the existing audit and build as checks the author runs; that run is a CHECK, and not yet EVIDENCE.
2. The verifier, the evidence ledger and the escalation packet. Make the first deploy wait for a signed decision and an attestation.
3. The conformance suite and the views. Write the scenario that must be refused, replay the log, destroy a view and rebuild it.
4. The finance pack. Diff the two packs. The kernel must not change; if it does, the first pack was the product.
5. Widen the GRANTs one class at a time. Measure the overturn rate. A class that the board never overturns is a candidate for level 1; a class that it overturns every time is a candidate for a narrower pack.

Never: a personal act by an agent, a DECISION made by silence, a pack that adds a verb or a gate that a pack removed.

## The measure

The OS should report its own autonomy the way a compiler reports warnings: by default, and with a location. The numbers that matter are the share of EFFECTs decided without escalation, the number of escalations per hundred TASKs, the median time from a task's opening ANCHOR to its decision, the overturn rate, the cost per decision, the stop rate and the share of TASKs with EVIDENCE.

The board tunes the GRANTs with those numbers; the page is a side effect. A company that never escalates is unsupervised. A company that escalates everything has not written a GRANT. The target is a boundary that moves with evidence, not a number of humans.

The dictionary made the words agree. The kernel makes them do something, once the build order has run. The company asks at the board and the law insists at the personal acts; the honest OS says which is which, and who holds the KEY.
