---
id: 2026-seven-nouns-eighteen-verbs
title: "Seven Nouns and Eighteen Verbs"
articleDate: 2026-11-05
articleContent: "A controlled vocabulary in the spirit of ASD-STE100 for the fifty requirements of the previous post: seven record kinds, eighteen verbs and fifteen axioms, then all fifty requirements and all eighteen function packs written again using only those words, with the diff between two independent writers as the test."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI
  - Automation
  - Git
  - Requirements
---


# Seven Nouns and Eighteen Verbs

The [previous post](/blog/entry/2026-git-based-stateless-llm-driven-company) is fifty requirements and eighteen thousand words. This one makes a narrower claim: every one of those requirements can be written again with seven record kinds and eighteen verbs, and nothing gets lost on the way.

That claim is worth testing, because the failure it prevents is quiet. A specification written in ordinary prose drifts while nobody is looking.

## A spec drifts where nobody looks

Take three sentences from the previous post. Requirement 38 says that a binding commitment "uses a qualified electronic signature". Requirement 25 says that money above a threshold "needs approval". Requirement 30 says an outside correspondent "cannot approve the company's effects". Three words — signature, approval, approve — for one operation: a person putting their mark on a specific payload. Are they the same? The prose does not say.

The word "effect" drifts further. Elsewhere it means what the company does to the world: a payment, an email, a deploy. Requirement 41 then uses "the effect of expiry" for the consequence of a missed deadline, which is a different thing with different rules.

A person reading this guesses from context and is usually right. An agent cannot guess, so it resolves the ambiguity in whichever direction is cheaper. The cheap direction is to treat an approval as a comment and a comment as an approval, and that is how a company ends up paying an invoice nobody signed.

## What ASD-STE100 does that applies here

ASD-STE100 Simplified Technical English began in 1983, when European airlines needed aircraft maintenance documentation that mechanics who did not speak English could follow. The standard that came out of that work is a controlled language. Issue 9, published in January 2025, has 53 writing rules and about 900 approved words, and it is free.

Two of its ideas matter here. The first is the dictionary: every approved word has one part of speech and one meaning, and every word that is not approved gets a pointer to the approved word to use instead. "Verify" is not approved; the dictionary sends you to CHECK. The second is the split between the general vocabulary and the technical nouns, which live in their own list so that "propeller" and "aural warning system" do not have to enter the core dictionary.

What STE does that I did not copy: the grammar rules, the uppercase examples, the coverage of procedures as numbered steps. A requirements document is description, not repair instructions. I took the dictionary discipline and left the rest.

## Five rounds, and what each one found

I wrote the first dictionary in one sitting: 21 nouns, 12 verbs, 8 rules. It looked tidy. It was wrong in ways I could not see, because I wrote both the requirements and the dictionary and my reading of one covered for the other.

So I stopped trusting my own reading and made reviewers attack it.

**Round one: four reviewers, four lenses.** One took the first 21 requirements, one took requirements 22 to 41, one took the last nine and all eighteen function packs, and one was told to ignore coverage and hunt for overlap. The overlap reviewer found that the verb list was both redundant and incomplete: CONFIRM meant the same as CHECK, and there was no verb at all for signing, for citing a record, or for revoking a grant.

**Round two: the two-writer test.** This is the check that a coverage table cannot replace. Give one requirement and the dictionary to two writers who cannot see each other. Compare what they wrote.

I gave both writers requirement 42, the one about rooms, crews and truck seats. They broke the source into 19 ideas. They chose different words for 7 of them, and on 4 more they chose the same word while both flagged it as wrong. The scheduler became a party in one version and an invented word in the other. The critical path was computed by a check in one and by an invented verb in the other. A door key became a signing secret in one version, which is exactly the kind of silent drift the exercise is meant to prevent.

A small dictionary can express nearly anything if a writer is willing to stretch a word. Two writers stretch in different directions. That is the failure a coverage matrix cannot see, and it took a diff of two independent rewrites to expose it.

**Round three: fix what the diff showed.** The big change: capacity stopped being a permission. A room held by a task is now a movement of room-days between two accounts, which means a partial hold on 5 of 100 seats works, and a booking needs no deposit that the source never mentioned.

**Round four: test on sections nobody had tuned against.** Requirement 35 on erasure, requirement 48 on capital and the insurance pack. Two fresh writers, 6 disagreements out of about 45 ideas, and every one of them settled by adding a definition rather than a word.

**Round five: the dictionary below.** At that point the count stopped moving. The measured claim is 7 of 19 disagreements before the method and 6 of 45 after, on material the dictionary had never seen.

## How to read the dictionary

Each entry gives one meaning, the forms it takes and the words it replaces. A word in capitals is approved. A word in ordinary type is not, and the entry says what to write instead.

There are three layers. The given words come from git and cryptography and this dictionary does not design them. The record kinds are the seven things a company appends. The defined nouns are built from record kinds, and the verbs act on both.

Then there are fifteen axioms. They are the sentences that used to be repeated inside individual requirements, gathered into one place so that a writer cannot restate them slightly differently. The axiom that every effect cites a decision used to live in three separate requirements with three slightly different wordings.

## The given words

**COMMIT** — one signed snapshot; the unit of repository history.

**HASH** — the content address of a byte string.

**ANCHOR** — a timestamp and the thing that gave it. A planned time and a measured time are both anchors, and a label says which.

## What is a record

**record** — anything appended in a commit. Every noun below is a record except the view. Labels, units, amounts and addresses are fields on records, not records themselves. A key record holds the public half; the secret stays in a store.

## Seven record kinds

**THING** — anything with an identity and a state: a person, an agent, an organisation, a place, a vehicle, a document, a door key, a model, a tool. A thing may cite the thing that contains it, so a room sits in a floor, and a floor sits in a building.

Not approved: item, entity, object, asset, resource. "Item" is also on this site's own list of placeholder names, which is one reason it did not survive.

**RULE** — a versioned predicate that a check computes on records. A rule has an owner and cites its source.

Not approved: policy, gate, eligibility, threshold.

**OBSERVATION** — a record of a state that its author reports and did not decide, with a source, the time the source states, the time it arrived and a hash. A crew report, a log line, an email and a sensor reading are observations.

Not approved: input, message, event, reading, snapshot.

**TASK** — a unit of work with a state label, acceptance criteria, dependencies and one owner. A task may carry an estimate, a planned span and the places it uses.

Not approved: ticket, job, issue, work item.

**PROCEDURE** — a versioned sequence of steps with a trigger, a budget and a pinned environment.

Not approved: SOP, skill, runbook, workflow, recipe.

**EFFECT** — an action that changes a store the company does not control.

Not approved: side effect, external write, API call, deploy, send, payment.

**POSTING** — a movement of an amount of one unit between two accounts, where the amounts of one posting sum to zero. Money, stock, seats, room-days and hours all move this way.

Not approved: journal entry, transaction, stock move, allocation.

## Twelve defined nouns

**PARTY** — a thing that can act or be acted on. Made by an observation or a decision; its keys are revoked, never its record removed.

Not approved: user, actor, contact, account holder, service, agent, host.

**ACCOUNT** — a named holder of an amount of one unit, owned by a party, a task or a thing. One thing has one account per unit, and its balance is a view of its postings.

Not approved: wallet, fund, ledger line.

**KEY** — a secret one party holds to sign or decrypt. The registry holds its public half, its scope and its validity. A credential is a key.

Not approved: token, passkey, certificate.

**STORE** — a place outside the repository that holds records, secrets or state. The repository is one store among several, and a store is reached by reading, executing or deleting.

Not approved: database, vault, mirror, forge, bank, platform, system of record, cache.

**RUN** — one attempt by one party to advance one task, under one procedure or none. A run cites every thing and record it used, which is where lot genealogy comes from without a word for lots.

Not approved: session, episode, invocation, attempt.

**DECISION** — a commit, or an observation of a signed document, that cites the record it chooses. A document an outside party signs is a decision by that party; an unsigned message is an observation. Silence is never a decision.

Not approved: approval, sign-off, vote, verdict, ruling.

**GRANT** — a standing permission from one party to a party or a task, with an action class (read or execute), a scope of labels, a limit and a deadline.

Not approved: permission, permission part of a delegation, consent, lease.

**COMMITMENT** — a standing duty one party owes another, with a deadline and a source.

Not approved: obligation, promise, contract term, warranty.

**FACT** — a checked claim with an owner, an anchor, a validity window and a taint label.

Not approved: knowledge, memory item, setting, preference.

**EVIDENCE** — a passing check that a task cites for one criterion, made by a party that did not do the task. It can expire, which is how a calibration certificate runs out.

Not approved: proof, test result, certificate.

**DEADLINE** — a record that counts time from a trigger to an expiry. It names the trigger, the anchor it counts from (stated or arrival), the counting rule, a decide-by date, the expiry and the consequence.

Not approved: clock, timer, due date, retention period, window.

**consequence** — what happens at the expiry of a deadline: a rule appends a grant, a commitment or a task, or a grant or a commitment expires.

## Five nouns that are not records

**VIEW** — a file a rule computes from records. It is rebuilt from source and never cited as the input to a decision or an effect.

Not approved: dashboard, digest, index, cache, diff, report, summary, transcript.

**LABEL** — a name and a value on a record, such as class=health or retention=10y. The name is the dimension.

Not approved: tag, data class, tier, flag, status, state, category.

**UNIT** — what an amount measures: a currency, a share class, a second, a day, a month, a year, a metre, a kilogram, or a count of a named thing. A working calendar converts between time units.

**AMOUNT** — a number, a unit and an uncertainty. An estimate is an amount labelled estimated.

Not approved: quantity, value, sum, balance.

**ADDRESS** — a named way of reaching a party: mail, phone, post, an API endpoint, an IBAN. A party may hold several.

Not approved: channel, contact point, notice address.

## Eighteen verbs

**OBSERVE** — to make an observation from a source.

**READ** — to bring a record or a store's state into a run without changing it.

**PROPOSE** — to append a record that asks for a decision.

**CHECK** — to find if records agree with a rule. The result is a check: pass or fail. A passing check that a task cites is evidence.

**DERIVE** — to compute a view from records by a rule.

**DECIDE** — to make a decision. A refusal is also a decision, and accepting a computed record is a decision.

**SIGN** — to make the mark only one key can make.

**CITE** — to name the hash of a record in a new record. This one verb replaces references, binds, points to, links and carries.

**APPEND** — to add a record as a new commit.

**EXECUTE** — to make one planned action happen: a procedure step or an effect.

**SUPERSEDE** — to make a new record current in place of an older correct one.

**REVERSE** — to append a record that cancels an earlier record that was wrong. The test: if the old record was correct when written, supersede it; if it was wrong, reverse it.

**REVOKE** — to end a standing instrument before its deadline, by a decision.

**EXPIRE** — to stop being in force at a stated time, with no decision.

**ESCALATE** — to give a decision to a party with more authority, because a deadline passed or a limit was reached.

**STOP** — to end a run, an effect lane or a store before its normal end.

**DELETE** — to remove a payload from a store. The hash stays in the record.

**SHRED** — to destroy a key, so that no party can read its ciphertext.

Two verbs did not survive. CONFIRM meant the same as CHECK, and the "second confirmation" in the approval requirement is a second decision. COMPUTE was too general to be one meaning, so DERIVE took the computing and CHECK kept the testing.

## Fifteen axioms

These are the invariants. Each one used to be prose inside a requirement, and each one is now a sentence a writer can cite instead of restating.

1. Immutability. A record is never edited. To correct it, append a new record that supersedes or reverses it. Only a board decision may rewrite a commit.

2. Deletion is not erasure. Delete removes a payload from a store. Shred destroys a key. Neither removes a record.

3. Provenance. Every record except an observation cites the record that created it.

4. Effects need decisions. Every effect cites a decision. The decision cites the hash of the payload. The party that decides is named by a grant or a rule. Every effect that moves an amount also makes a posting.

5. Deadlines have two dates. Every deadline names a trigger, a counting rule, a consequence and a decide-by date. At the decide-by date it escalates. At expiry the consequence happens, and the trigger may be the absence of an observation.

6. Trust. An observation is untrusted. A check by a rule makes it a fact. A decision may accept a fact into memory. An agent may not accept free text as a fact.

7. Views are not records. A decision never cites a view. An effect may carry a view as content, but the decision cites records.

8. Rules read labels. Every record names one owner and at least one label. A rule reads labels, never free text.

9. Evidence is independent. A task is done only when evidence exists for every criterion, and the party that produced the evidence is not the party that did the task.

10. Read and execute are different. Reading needs a grant. Executing needs a grant and a decision.

11. Limits are never decremented. A limit is checked as the sum of postings or commitments against it, and never reduced in place. This is why there is no word for budget: a budget is an amount with a limit and a deadline.

12. Gates refuse, alerts do not. When a gate fails, the append, execute, delete or shred does not happen, and the failed check is appended instead. When an alert fails, a task opens and the write happens.

13. Inside and outside. Capacity inside the company moves by posting. A duty to an outside party is a commitment. One booking with a venue makes both.

14. Duties have deadlines, deadlines need no duty. Every commitment names a deadline. A deadline without a duty, such as a domain renewal, cites the thing it is about.

15. The law acts through rules. A deemed outcome is a consequence that a statute rule makes at expiry. It is never a decision by silence.

## The words that did not get their own entry

**budget** — an amount limit held by a party with a deadline

**capacity** — the amount in a thing's account before any reservation

**role** — a set of grants, labels and procedures

**policy** — a set of rules

**board** — the parties a grant or a rule names as governors

**reservation** — a posting of capacity from a thing's account to a task's account, with a tentative label and a deadline whose expiry appends a release

**booking** — a reservation labelled firm, and also a commitment when an outside party supplies the slot

**custody** — a posting of a thing, count 1, to a party's account for a span

**receipt** — an observation from the store after an execute

**read-back** — a check of a store after an execute

**verifier** — a party that checks and did not do the task

**goal** — a task the board adopts

**incident** — a task opened by a failed check or a missed deadline

**lot** — a thing made from things, with the run manifest as its genealogy

**permit** — a grant from an authority

**legal hold** — a decision that blocks deletion and shredding of the payloads and keys behind records with named labels

**milestone** — a planned anchor that a commitment cites

**filing** — an effect to an authority's store

**epoch** — a number that only grows, which a store refuses to see go down

**fixture** — records that a run of an anonymising procedure appends from past records

**deemed approval** — a grant that a statute rule appends at expiry

## Words that meant two things in the source

This is the table that forced the biggest rewrites, because a word with two meanings is exactly what a dictionary cannot tolerate.

- **grant**: a funding grant is a commitment with a restriction label; a permission is a grant
- **hold**: a capacity hold is a reservation; a legal hold is a decision
- **account**: an access credential is a key and an address; a ledger account is an account
- **receipt**: proof that an effect arrived is a receipt; an incoming document is an observation
- **certificate**: proof of a check is evidence; a credential is a key
- **licence**: a media permission is a grant; a certification is evidence
- **review**: a check against a rule is a check; a human inspection is a read and a decision
- **approval**: accepting a proposal is deciding; consent from outside is an observation
- **report**: inbound is an observation; derived is a view
- **event**: an external occurrence is an observation; an internal trigger is a label change
- **deadline**: the count is a deadline; the duty is a commitment
- **key**: a signing secret is a key; a door key is a thing
- **role**: an access bundle is a role; a job on a crew is a position
- **policy**: a set of rules is a policy; an insurance policy is an insurance contract
- **claim**: taking a slot is a reservation; a legal right is a commitment; an insurance claim is an observation
- **unit**: what an amount measures is a unit; a flat in a building is a dwelling
- **commit**: the record is a commit; the act is appending
- **class**: a data dimension is a label; a share class is a unit; an insurance class is a line of business
- **restricted**: funds bound to a purpose are a purpose-bound account; data kept only for a legal duty carries the label restricted
- **label**: a brand label or a garment label is a thing; a name and a value on a record is a label
- **run**: a print run is an amount; one attempt to advance a task is a run

## The fifty requirements, rewritten

Each requirement keeps its title from the previous post and its meaning. The gloss says what it is about, for anyone who has not read the other post. The statements use the dictionary and nothing else.

### 1. A task graph with a state machine
*The company keeps tasks in a dependency graph and works only on the ready ones.*

1. Every TASK CITEs the TASKs that must finish before it starts, and these citations form a dependency graph.
2. Each TASK carries a LABEL, acceptance criteria, one owner PARTY and a «lock» against a second RUN.
3. A PARTY changes the LABEL only when the dependencies are done and each gate passes.
4. The «frontier» holds the open TASKs whose dependencies are done; the «loop» takes its work from there.
5. A CHECK of the graph runs on every COMMIT.
6. A TASK id is a HASH of its specification, so RUNs in parallel worktrees APPEND TASKs with no collision.
7. Each TASK CITEs the goal it serves.
8. A serial RULE gives each invoice a number; one PARTY alone APPENDs them behind a «fence».
9. That PARTY records each gap and its reason and holds the next unused number; a TASK id is never an invoice number.

### 2. Goals, priorities and value against cost
*Goals sit above tasks, and the loop picks ready tasks by value for cost.*

1. An agent PROPOSEs a goal; only the board adopts it, with an objective, a measurable outcome, a DEADLINE, a budget and one owner PARTY.
2. A TASK CITEs its goal through its ancestry, and a TASK with no goal stays out of the «frontier».
3. Each TASK estimates its value and its cost in money, tokens, human hours and the risk tier of its EFFECTs.
4. The «loop» picks from the «frontier» by value against cost, inside the goal's budget, and APPENDs why.
5. When no PARTY can estimate the value the TASK goes to the board as a question; a later CHECK compares each estimate with the outcome.
6. Value against cost picks TASKs, never people.
7. A committed eligibility and priority RULE, from the board or a statute, sets the order wherever a TASK decides whom the company serves or refuses.
8. The predicted outcome of that person never enters the estimate.
9. One named human PARTY makes an adverse DECISION and writes the reasons and the way to appeal.
10. A goal closes with a short CHECK, and the PARTY archives or moves its open TASKs.

### 3. Board decision rights
*A written policy names who may decide what and how far a deputy may go.*

1. A policy APPENDed as a COMMIT names each DECISION class, its PARTYs or KEYs and its «quorum», and every gate CHECKs it like a RULE.
2. The board gives a GRANT for a class with a scope, a limit and a DEADLINE; a DECISION REVOKEs it, or it EXPIREs.
3. Every board member alone holds the GRANT to STOP; every other class needs its normal «quorum».
4. A board member tightens autonomy with one message that becomes a signed GRANT change; loosening it needs the «quorum».
5. An absence mode names a deputy PARTY and a reduced set of classes for one span.
6. An offline GRANT bounds a site lead's DECISION by scope, place, AMOUNT and span.
7. The PARTY APPENDs that DECISION afterwards; a DECISION outside the GRANT opens an incident.
8. An outside PARTY sets a RULE that binds the board and CITEs its source document.
9. A RULE refuses a GRANT to an agent for a top-tier EFFECT, a new payee or a new kind of statement.
10. The PARTY that PROPOSEs an EFFECT is never its only DECIDER.

### 4. Human attention as a scarce resource
*People can only read so much, so the company caps and batches what reaches them.*

1. A policy in a COMMIT limits open board DECISIONs and new requests per day, per person; a TASK beyond it waits in the «frontier».
2. One VIEW a day replaces the stream of requests, grouped by class.
3. An agent cannot raise the urgency of its own request; urgency comes from DEADLINEs and the risk tier.
4. A metric records the span and the rate per class; a class too fast or always DECIDEd opens a CHECK of a sample.
5. A short list of urgent classes, APPENDed as a COMMIT, bypasses the limit, the VIEW and the «frontier».
6. Each urgent class names its trigger RULEs, the human PARTY on call, the second ADDRESS and the DEADLINE; the RULEs are deterministic and over-inclusive.
7. An agent neither moves a case out of an urgent class nor answers it; it hands over the OBSERVATION.
8. A STOP of the «loop» does not STOP this lane; an outside «monitor» PARTY carries it.
9. The request shows the DECISION in plain words and a «fingerprint», and it EXPIREs.
10. A new payee, a changed ACCOUNT or an AMOUNT above a limit needs a second confirmation on another ADDRESS, from a number in a FACT.

### 5. Gates at every point where a mistake can enter
*Every rule has a mechanism that stops a mistake at the point it can enter.*

1. A RULE counts only when a named mechanism enforces it; each RULE carries an id, a rationale and that mechanism.
2. The RULEs cover format, schema, graph structure, risk, content and law.
3. A gate that finishes in seconds runs «pre-commit»; a slow gate runs «pre-push» and CI.
4. A gate on an EFFECT runs «pre-effect», a «monitor» CHECKs limits at runtime, and a periodic CHECK looks for drift.
5. A client-side hook gives no security, because an agent can pass `--no-verify`; the server runs «pre-receive», required CHECKs and protected branches.
6. Formatting has one entry point, treefmt, with sorted keys, normalised YAML and JSON and LF line endings.
7. An agent never weakens its own gates; an edit of the payment policy is a top-tier EFFECT with a required human SIGN.
8. One definition of the gate set serves commit, push and CI.

### 6. Signed commits, linear history, board-only force-push
*Every commit is signed, history stays linear and only the board may rewrite it.*

1. Every COMMIT carries a SIGN from a named PARTY with its own KEY, and the KEY registry gives its role at the parent COMMIT.
2. The STORE refuses an unsigned COMMIT or an unknown KEY; a «pre-receive» hook refuses a path outside the KEY's scope.
3. An agent KEY is non-extractable, minted per RUN, REVOKEd at its end and scoped to one TASK, one role and its paths.
4. Some paths are the «trust root»; no agent KEY changes them, and a change needs a human SIGN and an independent rebuild of the gates.
5. History is linear: a branch lands by fast-forward, with no merge COMMIT and no «squash»; each COMMIT passes the gates alone.
6. A «rebase» rewrites each moved COMMIT, removes its SIGN and changes its HASH; the «merge queue» re-SIGNs and the gates rerun.
7. The originals stay under a «ref», and the queue re-issues the attestation for the landed tree; a changed tree invalidates the EVIDENCE.
8. Only the board, under its DECISION rights, may rewrite a protected branch as a top-tier DECISION, and a mirror keeps the earlier history.
9. Axioms 1 and 2 apply; §146(4) AO forbids a POSTING change that hides the original entry.

### 7. Trusted time
*Record time must come from outside, because an agent can set its own clock.*

1. The date of a COMMIT is whatever the committer's clock says, and an agent controls its clock.
2. A record whose time carries legal or financial weight gets an external ANCHOR.
3. The ANCHOR is an RFC 3161 timestamp over the HASH of the record or the receipt time of an outside PARTY.
4. The PARTY APPENDs the ANCHOR next to the record.
5. A gate refuses a record whose ANCHOR is absent, unknown or out of order.
6. The scheduler and every DEADLINE CHECK READ a synchronised source.
7. A gate refuses every EFFECT from a PARTY whose clock drifts beyond a tolerance.


### 8. An evidence ledger per task

*A task counts as done only when an independent party records proof for each criterion.*

1. Every TASK cites EVIDENCE for each acceptance criterion.
2. A claim with no command behind it is not EVIDENCE.
3. Axiom 9 applies.
4. The harness runs the command that the TASK names, in a clean worktree at the COMMIT under test.
5. The harness SIGNs the outcome record with a KEY that no agent PARTY holds.
6. The outcome record holds the command, its exit code and the HASH of its output.
7. An attestation ties that record to the tree that the RUN used.
8. A gate refuses the APPEND when the attestation does not describe the tree being APPENDed.

### 9. Test suites, verifiers and change logs

*Tiers, independent checkers and plain change logs keep work that is not code checkable.*

1. Test tiers run by cost: fast before APPEND, full in CI, mutation on changed lines, nightly on core, deep before release.
2. Each tier holds twice its worst measured RUN as a budget.
3. Each «artifact type» gets a verifier that CHECKs it; a deterministic CHECK runs first, and a «rubric» judge never gates a high-risk EFFECT alone.
4. The verifier is another agent PARTY, with another «prompt» and no write GRANT.
5. «Eval cases», «rubrics» and known-bad cases sit READ-only with a «held-out» share, and a RUN assigns verifiers at random, never to each other.
6. A scheduled RUN seeds known-bad work, and a verifier that passes it loses its GRANT until a human READs it.
7. A blocked TASK cites an OBSERVATION or reopens at its DEADLINE; repeated reopening or regenerated EVIDENCE flags a human.
8. Mutation testing and known-bad cases prove a CHECK can fail, and every fixed bug APPENDs a regression CHECK.
9. A RUN DERIVEs a change log from parseable COMMITs and DECISION records; a human edits it.
10. Outside software the log is the client VIEW; a PROCEDURE or RULE change gets a dated entry and a version bump.

### 10. Atomic transitions with rollback

*A change lands in one commit or not at all, and a landed trace is corrected forward.*

1. One APPEND puts a «transition» into the repository whole, or not at all.
2. The LABEL flip, the EVIDENCE, the roadmap VIEW and the gate CHECK land in one COMMIT, or the STORE reverts.
3. Every command that changes the STORE CHECKs the gates and rolls back on failure.
4. Each agent RUN works in its own worktree or container; only a change that passes reaches main.
5. An APPEND that touches the books, makes an EFFECT or records a human DECISION leaves a trace the law needs.
6. A later failure keeps the RUN as a COMMIT with its terminal LABEL.
7. The correction is a forward record: a REVERSEd POSTING, a REVERSEd EFFECT or a REVERSEd DECISION.
8. A REVERSEd EFFECT for a takedown chases every copy, and the publication record stays.

### 11. Diffs people can read

*A diff must read as plain text, in stable order, with one idea per line.*

1. A human READs a VIEW of the change and DECIDEs.
2. The VIEW makes sense without a tool: plain text, stable order, one concept per line.
3. A LABEL flip is a one-line change.
4. A generated VIEW is deterministic and never churns.

### 12. Dependencies managed by Nix alone

*One pinned flake supplies every tool an agent may call, and no other install happens.*

1. Every tool an agent PARTY can call comes from one pinned flake, and no other install runs.
2. Nix READs each language lockfile as a fixed-output derivation; a new dependency is a VIEW of `flake.nix` and `flake.lock` that a human DECIDEs.
3. A build runs in the Nix sandbox with no network access except a fixed-output fetch with a pinned HASH.
4. A gate refuses a worker's connection to a package registry; the binary cache and the model provider pass an egress proxy.
5. CI runs each command through `nix develop -c` or `nix flake check`, and `nix flake update` APPENDs its own COMMIT with its gate CHECKs.
6. A stateless agent PARTY needs the same tools on every machine, and a deterministic THING needs a pinned toolchain.
7. A dependency becomes a reviewed change, not a «side effect» of an agent's improvisation.
8. Each lockfile change costs one HASH update, and the binary cache becomes infrastructure.
9. A proprietary desktop tool sits behind an «adapter» and its exports enter as OBSERVATIONs; a model behind an API is recorded per RUN.
10. Nix runs on Linux and macOS, Windows needs WSL2, and portability now means movement between forges, CI and harnesses.

### 13. Single-file HTML dashboards for humans

*One generated HTML file shows the company state, the same page for every reader of a commit.*

1. A human PARTY reads the state of the company without reading the repository.
2. The interface is one generated VIEW: an HTML file with inline styles, script and data, no network request, opened from disk or a CI RUN.
3. The VIEW is a pure function of one COMMIT and carries its HASH and ANCHOR.
4. The VIEW gives READ only; a DECISION comes as a signed COMMIT or through the DECISION «channel».
5. The VIEW inserts stored text as text, because some of it comes from inbound email.
6. A RULE removes the records that an audience may not READ.
7. The board VIEW answers, in order, what waits, what ran and failed, and what was spent against the budget.
8. It then shows the «frontier», EVIDENCE «coverage», pending DECISIONs and the STOP state of the STORE, with an inline SVG task graph.
9. The same VIEW goes out as the daily digest on the board's ADDRESS, so a page nobody opens still arrives.
10. Machine signals, never an agent's account of its own RUN, decide a failure line, and every section reports its coverage.


### 14. The CEO loop that stops itself
*one unattended procedure repeats task work and halts itself on each named stop condition.*

1. An agent PARTY RUNs one PROCEDURE that advances the «frontier» one TASK at a time: give, wait, CHECK, APPEND, repeat.
2. The PROCEDURE READs its limits from a COMMIT and STOPs the RUN with a distinct «exit code» per condition.
3. Stop: the «frontier» is empty and every gate before the deploy EFFECT passed, or the allowed RUNs are used up.
4. Stop: the «frontier» did not change across too many RUNs, or one RUN outlived its «watchdog» DEADLINE.
5. Stop: a step failed again after its «retries», or a gate CHECK failed, or the next RUN would exceed the money budget.
6. A «timer» starts the PROCEDURE, and a «lock» keeps a second «driver» PARTY out of the STORE.
7. The «driver» EXECUTEs only the step it is given, APPENDs nothing beyond it, so cannot claim progress it did not make.
8. A stopped PROCEDURE looks like a quiet day, so a PARTY outside it holds a «dead-man's switch» DEADLINE on another «host».
9. That DEADLINE, under other KEYs, waits for a signed «heartbeat» from every RUN and an "all clear" for every VIEW.
10. When either is late it APPENDs a TASK for the board on a second ADDRESS, and depends on neither forge, «model provider» nor machine.

### 15. Sub-agent delegation and management
*a parent run keeps scope, order and the final check and gives bounded tasks to children.*

1. The parent RUN keeps the «frontier» slice, the order and the final gate.
2. The parent gives every bounded sub-TASK to a child PARTY, and children may give TASKs to their own children; a leaf may not become a second CEO PROCEDURE.
3. The parent keeps the slice, a write to a shared file, a weakened CHECK, the final CHECK, APPEND and «push», and human-only questions.
4. The packet names the goal, inputs, file ownership with one writer per file, the EVIDENCE step, a stop RULE and its limits.
5. The child returns its changes, steps with output, what it could not CHECK and unrelated breakage; the parent re-runs the EVIDENCE step.
6. A register holds each child's TASK, budget, «heartbeat» and worktree, and a committed COMMIT caps depth and fan-out.
7. The «harness» takes a child's budget from its parent's and its GRANT is a subset.
8. Each child RUNs in its own worktree or «container» under a KEY the «harness» mints from its owned paths (requirement 6).
9. The agent RUNs inside the process the «watchdog» signals, a signal it ignores ESCALATEs to a «hard kill», and an orphaned child is a bug class.
10. Delegation buys context isolation and parallelism, costs coordination, and the packet is written down because every handoff loses context.

### 16. Context management
*each task gets a packet built from committed state, limited by budgets and closed by scope.*

1. A model's working memory is small, costly and uneven, and accuracy drops when the needed passage sits mid-input.
2. So the «harness» DERIVEs a packet per TASK from committed records, never from «chat», and a fresh RUN with only the last COMMIT and TASK hash resumes.
3. The packet is a VIEW, and the RUN APPENDs a manifest that CITEs the HASH of every record it loaded.
4. The packet holds the goal with ancestry, acceptance criteria, spec, RULEs, PROCEDURE, «skill» index, FACTs with CITEs, «episode» summaries, remaining budget and next action.
5. Each part has a token budget, stable parts come first for prefix reuse, and the goal and limits repeat at the end.
6. A «skill» or document loads by «progressive disclosure», and large output goes to a file with path, summary and «exit code».
7. Untrusted content carries the LABEL quoted, never instruction; near its limit a RUN APPENDs its state and starts fresh.
8. Every record's LABEL names its PARTY or project: a packet draws only from its TASK's LABELs, and retrieval CHECKs the LABEL before «similarity», at query time.
9. A summary or consolidated FACT inherits the strictest LABEL, a human PARTY strips client parts, and the manifest names the LABELs READ.
10. A human PARTY's GRANT names one LABEL value and path set with a DEADLINE; a gate enforces it through separate STOREs or filtered VIEWs, and an outbound EFFECT on a foreign LABEL or below the group size fails.

### 17. Episodic memory
*each run leaves a record of what it did, why, at what cost and with what result.*

1. «Episodic memory» holds what happened; the working, «episodic», semantic and procedural split maps onto files, the context window being the working kind.
2. The history of COMMITs shows what changed and leaves out the reasoning, so each RUN APPENDs an «episode»: the outcome record of that RUN.
3. The «episode» CITEs the TASK, the goal, the PROCEDURE and «skill» versions used, the input HASHes and the context manifest.
4. It CITEs the steps EXECUTEd, the PROPOSEd EFFECTs with their receipts, the outcome, the verifier CHECKs and the cost.
5. It holds the human corrections and the «friction».
6. A raw «transcript» is large and may hold personal data, so it goes to a STORE under LABEL redacted, and the repository holds a summary VIEW and the HASH.
7. A DERIVEd VIEW answers a query by TASK, THING, ANCHOR or «similarity».
8. An «episode» is EVIDENCE of the past and never an instruction, and one that quotes an inbound email carries that email's taint.
9. A periodic consolidation RUN READs recent «episodes» and PROPOSEs new FACTs, PROCEDURE and «skill» amendments, and new CHECKs for a DECISION.
10. A mandatory «retro» after every PROCEDURE RUN ends with a PROPOSEd improvement or an explicit no-change record.

### 18. Semantic memory
*the company keeps typed, sourced facts that are checked, superseded and never silently overwritten.*

1. «Semantic memory» holds the FACTs: PARTYs and lead times, prices, client preferences, RULEs in force and its own policy.
2. Each FACT CITEs its source «episode» or OBSERVATION and holds a confidence AMOUNT, the ANCHOR of its last CHECK, a validity span and an owner PARTY.
3. Every write is PROPOSEd, then READ and DECIDEd by a verifier PARTY, because one wrong FACT poisons every RUN that READs it.
4. A newer FACT SUPERSEDEs an older one and the history stays; a contradiction opens a «conflict» TASK for a human PARTY.
5. Axiom 1 applies.
6. Personal data puts the payload in the encrypted STORE and the HASH in the repository, and every FACT carries the data-protection LABELs of requirement 35.
7. A FACT from an authority PARTY (minimum wage, VAT rate, «OSS threshold») sits in a separate STORE with its legal source, effect ANCHOR and last CHECK.
8. Only the source document and a human DECISION change such a FACT, never an agent PARTY, an email or a guess.
9. A supplier's email may set LABEL tentative on a FACT but can never authorise a payment, which needs a CHECK on a second ADDRESS.
10. People live in a register with one THING record per subject, a «score» per match, and the LABEL blocked refusing every person EFFECT on an ambiguous match.

### 19. A skill library
*the company versions reusable capability bundles with permissions, tests, an owner and a retirement date.*

1. A «skill» is a packaged capability that an agent PARTY loads when a TASK needs it.
2. The «Agent Skills» format is a `SKILL.md` with a name and a description in its «frontmatter».
3. A «skill» is how to do one kind of step; a PROCEDURE is a business sequence with steps, owner PARTYs, LABEL risk and CHECKs, and it CITEs the «skills» it uses.
4. A RULE applies to both.
5. The repository versions each «skill», each RUN names the version loaded, and a PARTY finds it by name and description and loads the body on demand.
6. A PROPOSEd «skill» names a GRANT that lists the THINGs («tools») and «adapters» it may use.
7. A new version needs CHECKs with saved inputs and expected outputs before a PARTY DECIDEs it, and an earlier version stays restorable.
8. Each «skill» names an owner PARTY and carries a usage metric, and a non-use DEADLINE archives it.
9. A third-party «skill» is PROPOSEd, CHECKed by a verifier PARTY and pinned by HASH.
10. A «skill» packages a «prompt» with a README, can carry an «injection», and one mined from a good improvised RUN lands as a PROPOSEd record.

### 20. Prompts: personas, no persona, or SOPs
*a persona line adds little, so the work comes from procedures, skills, rules and grants.*

1. A test of 162 roles on 2,410 factual questions found no gain from a «persona» in the «system prompt», and it covers no long agentic TASK.
2. No «persona» works for generic sub-TASKs and knows no house convention, and a «persona» line changes only tone and vocabulary.
3. A PROCEDURE, a «skill» and a RULE carry what the model lacks (checklist, tool conventions, acceptance criteria), and that moves outcomes.
4. A role is GRANTs, LABELs and PROCEDUREs: its THINGs, budget, verifier PARTY and output RULE.
5. A verifier role looks for failures and holds no GRANT to write the record it CHECKs.
6. An «org chart» of roles, with a responsibility and a GRANT per role, lets human and agent PARTYs share one structure.
7. A «persona» keeps one job: «voice» in an outbound EFFECT where brand tone is a requirement.
8. A «prompt» is a record, and each RUN CITEs the HASH of the «prompt» it used.
9. A changed «prompt» runs the saved CHECKs against the current version and is APPENDed only if the «evals» improve.
A RUN gets no «persona» unless an «eval» proves one pays; TASK, PROCEDURE and «skills» carry the work.

### 21. Metacognition: confidence, budgets and the next action
*an agent states its certainty from checks, spends a fixed budget and commits its next step.*

1. An agent PARTY must know its certainty, its remaining budget and its next action.
2. A «verbalised» confidence is overconfident, so self-reported confidence can never lower a LABEL risk by itself.
3. Confidence comes from CHECKs passed, EVIDENCE coverage, agreement of independent PARTYs and FACT freshness.
4. Each «episode» holds predicted confidence next to the CHECKed outcome, so calibration is measured and low confidence routes to a CHECK or a human PARTY.
5. A budget covers the UNITs token, second, euro, «retry» and human hour, and a RULE sets it before work starts.
6. The «harness» carves the budget down to children and enforces it, because the model cannot be trusted to STOP itself.
7. Each TASK has a RUN-count budget; an exhausted «rework» budget ESCALATEs to a human TASK, and an unreadable «meter» gets a bounded conservative estimate.
8. An exhausted budget ends in a written diagnosis record, never a silent stop.
9. Every step commits a next action from a fixed set: continue, CHECK, delegate, ask a human, ESCALATE, STOP with diagnosis.
10. A «stall» CHECK compares state LABELs across RUNs and STOPs repetition, and "I could not CHECK X" is a required LABEL on the outcome record.


### 22. Communication in and out

*Messages from outside arrive as untrusted OBSERVATIONs, are routed by DECISION, and are CHECKed before they leave as EFFECTs.*

1. A quote, an approval and a call are OBSERVATIONs in one register; one PARTY across three ADDRESSes needs one PARTY register with LABEL personal.
2. Routing is a separate DECISION that SUPERSEDEs without rewriting history; a stateful live call APPENDs recording, transcript and COMMITMENTs after the call.
3. One envelope per ADDRESS names ADDRESS, direction, ANCHOR, PARTY, «thread id», payload and attachment HASHes, DKIM and SPF CHECKs and LABEL class.
4. A transcript, summary and classification are VIEWs that CITE the raw HASH and the tool version.
5. Inbound OBSERVATIONs are untrusted — narrow GRANT, higher LABEL risk, sandboxed attachment parsing — and an identity claim needs a CHECK against the recorded ADDRESS.
6. A gate refuses an EFFECT holding a LABEL class its ADDRESS may not carry, and each «context packet» passes the same CHECK with LABEL pseudonym.
7. Spam is an OBSERVATION whose record stays while its payload DELETEs at a 30-day DEADLINE, and executable attachments go to «quarantine».
8. Spam classification is a PROCEDURE whose feedback loop SUPERSEDEs the RULE after a wrong CHECK.
9. §201 StGB needs an OBSERVATION of consent, Art. 50 AI Act needs disclosure, and §7 UWG needs prior express consent.

### 23. A sandbox for effects

*A sandbox twin of every write adapter lets each EFFECT run once before it runs for real.*

1. A verifier PARTY CHECKs an artifact; the EFFECT pipeline needs its own test ground so a payment PROCEDURE does not RUN live first.
2. Every write adapter has a sandbox twin STORE.
3. Each RUN declares LABEL mode, part of the RUN record and of the payload HASH.
4. A DECISION in sandbox mode never authorises a live EFFECT.
5. A new or amended PROCEDURE, adapter or prompt version RUNs in the sandbox against fixtures DERIVEd from past cases.
6. The company replaces every personal identifier with LABEL pseudonym before the APPEND, because a fixture in git is permanent.
7. The PROCEDURE goes live only with EVIDENCE for every criterion and a human DECISION to promote it.
8. A «dry run» in live mode computes the EFFECT and its LABEL risk, then STOPs before the executor PARTY.
9. A sandbox RUN and a live RUN share no KEY or STORE, and the executor PARTY refuses a sandbox payload.

### 24. Deterministic assets

*An asset is a recipe, a pinned toolchain and input HASHes that give one output HASH.*

1. A video, document, graphic and audio file must be reproducible or at least traceable.
2. An asset is a recipe, a pinned toolchain and input HASHes that give one output HASH, as a Nix derivation does.
3. The company writes the recipe as text where possible and removes each other source of nondeterminism.
4. A generative model call is not bit-reproducible, because the API model changes and a seed does not guarantee output.
5. The company OBSERVEs each generation with the prompt, model, parameters and output HASH, and everything downstream is deterministic.
6. The chain of records stays complete even where a PARTY cannot rebuild one link.
7. A large output APPENDs the recipe and output HASH only, and the binary goes to a STORE.
8. An export from Figma or Photoshop enters as an input artifact.
9. A human PARTY READs a VIEW that shows a visual diff.
10. AI-generated media carries C2PA content credentials, because the AI Act asks the company to mark synthetic content.

### 25. Risk, money and approvals

*The company scores each planned EFFECT, and a separate executor PARTY EXECUTEs only a payload that a PARTY DECIDEd.*

1. One LABEL risk per action type is too coarse.
2. The company scores each proposed EFFECT on reversibility, summed AMOUNT, external visibility, legal binding, counterparty novelty and data exposure.
3. An agent PARTY PROPOSEs and a separate executor PARTY EXECUTEs only an EFFECT whose payload HASH holds a DECISION.
4. The DECISION binds to that payload; its git-native form is a SIGNed COMMIT that CITEs the EFFECT HASH, CHECKed against allowed KEYs.
5. The approver PARTY READs a VIEW that compares the payload, and a new payee or changed bank ADDRESS needs a second out-of-band DECISION.
6. The escalation ladder runs from automatic through logged, one human DECISION and two-PARTY DECISION to a DECISION with a cooling-off DEADLINE.
7. Defence in depth sits outside the code as a bank-side budget, a capped vendor card and an allowlist; PSD2 authentication adds a human PARTY.
8. The stateless system must not pay twice: the outbox pattern APPENDs intent, EXECUTEs, APPENDs the receipt, and a resumed RUN CHECKs it first.
9. A reversible EFFECT carries a planned REVERSE, and bookkeeping is plain-text accounting with beancount or hledger.
Retention under §147 AO favours immutability, which conflicts with GDPR erasure, so each LABEL class gets a DEADLINE.

### 26. Legal bases and consent records

*Every processing of personal data names a «legal basis», and consent is only one of them.*

Every processing of personal data needs a «legal basis»; consent is one of several.
1. GDPR Art. 6 rests most processing on a contract, a statute RULE or a weighed legitimate interest, and Art. 9(2)(h) covers treatment notes.
2. Consent as the only «legal basis» errs both ways: it asks a patient to consent to records the law requires and suggests a withdrawal.
3. Each processing activity in the register of requirement 35 names its «legal basis».
4. Where that «legal basis» is consent, the company proves it held consent when it acted.
5. Consent is an OBSERVATION naming the PARTY, purpose LABEL, ADDRESS, wording, ANCHOR and EVIDENCE, such as double opt-in.
6. A withdrawal is an OBSERVATION too, and it takes effect immediately.
7. Every EFFECT CITEs its «legal basis», and a gate CHECKs purpose LABEL, date and absence of a withdrawal; no basis, no EFFECT.
8. The «warehouse rule» puts the person's identity in an encrypted STORE, and git holds the HASH and purpose LABEL.

### 27. SOPs and the feedback loop

*A PROCEDURE is a versioned sequence that each RUN CITEs, and each human correction returns as an amendment.*

1. A PROCEDURE holds a trigger, inputs, steps, skills and adapters per step, a LABEL risk, CHECKs, outputs and one owner PARTY.
2. A step declares its dependencies, and a trigger is a schedule or an OBSERVATION such as a closed TASK.
3. Each step has its own retry, rework budget and ESCALATE rule, and each RUN CITEs the PROCEDURE version used.
4. A pre-EFFECT hook attaches to one EFFECT type and covers every PROCEDURE that produces it.
5. Discovery is a register matched by trigger or intent; without a match the agent PARTY improvises, records the trace and PROPOSEs a draft.
6. A human PARTY DECIDEs the draft before the company promotes it.
7. Feedback comes from a human edit, a failed CHECK, an incident and a metric such as reply rate or rework rate.
8. A VIEW that compares the draft with the version a human sent is the most valuable signal.
9. Each signal becomes a «friction entry» and then an amendment «pull request», CHECKed by replaying past cases as fixtures.
10. A recorded deviation feeds the same loop, and the company retires a PROCEDURE that no RUN uses.

### 28. Secrets

*A broker PARTY injects each KEY into an approved EFFECT, so no agent PARTY ever sees a secret value.*

1. An agent PARTY never READs a secret value; a broker PARTY injects the KEY into an approved EFFECT.
2. Git holds a reference such as `secret://bank/main`, and the value lives in a STORE of sops age KEYs or a hosted vault.
3. A static KEY and a password are straightforward.
4. An OAuth refresh token rotates, so it is state and the broker PARTY owns it.
5. A TOTP seed beside a password turns two factors into one, which is a DECISION per ACCOUNT.
6. A hardware passkey needs a human tap, which makes a human gate; an SMS code needs a company-controlled number and carries SIM-swap risk.
7. A recovery code stays offline and human-only.
8. A KEY is scoped and short-lived per PROCEDURE or TASK, and each agent PARTY has its own identity.
9. The company keeps rotation, REVOKE, a break-glass PROCEDURE, a human recovery path and leak scanning with gitleaks.
10. A screenshot or transcript can hold a password or card number, so the company makes it «redacted», and the ACCOUNT belongs to the organisation.

### 29. External services: APIs, MCP and browsers

*The company reaches an outside STORE by one adapter, and every write ends with a read-back receipt.*

1. The company prefers an official API, then an MCP server, a CLI, a scripted Playwright browser, an LLM-driven browser, then a human PARTY.
2. An adapter contract names capabilities, separate READ and write operations with a LABEL risk each, auth, rate limit, idempotency and EVIDENCE.
3. A PARTY uses a READ adapter freely; every write adapter goes through the EFFECT pipeline.
4. The flake pins each MCP server, third-party code with a company KEY, and each tool action is allowed, ask-first or off.
5. An LLM-driven browser finds a path once, a PARTY distils it into a Playwright script, and that script joins the PROCEDURE.
6. Terms of service and bot detection apply, the company bypasses no CAPTCHA, and a trace or screenshot serves as EVIDENCE.
7. Truth has owners: the bank's STORE owns the balance, git owns intent, DECISIONs and EVIDENCE, and each field names its owner PARTY.
8. Outside state enters git as an OBSERVATION with an ANCHOR, because an API answering 200 only accepted a request.
9. Every write to an outside STORE of record ends with a read-back receipt naming the external id, its version and a HASH of the response.
10. A scheduled reconciliation CHECKs git's intent against each STORE and opens a TASK per divergence, and an outside EFFECT's criterion names the read-back.

### 30. Human collaborators

*Human PARTYs act with different trust, and an outside PARTY with a right in a case holds standing.*

1. Human work needs a governor PARTY who DECIDEs and SIGNs, and a worker PARTY who does a TASK in person.
2. An outside client or supplier is a correspondent PARTY: what it sends is an OBSERVATION and it never DECIDEs a company EFFECT.
3. An outside PARTY with a right holds «standing»: a role, a DEADLINE and a submission record, matched by PARTY and closed only with a disposition.
4. A grievance or whistleblower channel accepts an anonymous OBSERVATION hidden from every PARTY connected to it.
5. An authority's «case» records every statement with its exact text, and the company CHECKs a new statement against all earlier ones.
6. A broad goal goes to discovery before any milestone exists, and a TASK reaches a person by WhatsApp, SMS or a mobile page.
7. Intake turns a request into a TASK, and the original message stays an OBSERVATION.
8. The company APPENDs a person's returned result on that person's behalf with attribution.
9. A worker register holds skills, qualifications, location, availability and rates, and a wait on a human PARTY has a timeout, reminder and reassignment.
10. Verification scales with LABEL risk, nobody goes into an unsafe situation and §7 SGB IV guards freelance direction.


### 31. A clock and a scheduler

*Nothing runs between runs, so a timer outside the repository must wake the system.*

1. A «stateless» system keeps nothing alive between RUNs, so a PARTY outside it must wake it.
2. The company APPENDs every timer as a record: a follow-up DEADLINE or a DEADLINE on a recurring PROCEDURE.
3. A follow-up DEADLINE has the absence of an OBSERVATION as its trigger.
4. The consequence of a recurring PROCEDURE's DEADLINE APPENDs the TASK that runs that PROCEDURE.
5. An «edge scheduler» such as cron or a systemd timer READs these DEADLINEs and APPENDs each consequence at expiry.

### 32. A kill switch

*One switch stops all outside effects; smaller switches stop work, merges and scheduling; a tag pauses one task.*

1. One global STOP ends every EFFECT, and a human triggers it from a telephone.
2. Narrower STOPs end the picking of a TASK, the landing of a change and the scheduling separately; a LABEL pauses one TASK.
3. A record alone cannot switch: any PARTY that can APPEND overwrites it, it reaches only READers, so the switch has two halves.
4. The record names what is stopped, the PARTY and the reason and only a board KEY clears it.
5. A service on another host, reached by one message, acts on the edges and REVOKEs the executing PARTY's KEYs at the «broker».
6. It STOPs the outbound queues in the «adapters», cancels the sends and payments a provider holds, and tells the «dead-man's switch» that silence is expected.
7. Stopping is physical: the stop record CITEs every EFFECT in flight and states what the company recalled.
8. A STOP per place belongs to requirement 43.

### 33. Backup and restore

*Only records in git survive by history; mirrors, keys and restore drills must rebuild the whole company.*

1. History backs up git only; the payload STORE, the KEY STORE, the signing KEYs, the KEY register, the «binary cache» and the forge need copies.
2. Every repository is mirrored to a second host under different KEYs and refuses DELETE, and the payload STORE keeps versioning and an «object lock».
3. The company backs up the KEY STORE and its encryption KEYs per person and retention class, encrypted; board members hold recovery KEYs offline.
4. The board REVOKEs and reissues a signing KEY by a documented PROCEDURE, and the KEY register is in git.
5. A scheduled restore RUN rebuilds the company on a fresh machine from the mirrors and offline KEYs, and a verifier PARTY APPENDs the EVIDENCE.
6. A product with its own STORE enters the register with «point-in-time recovery», a «recovery point objective», a «recovery time objective» and a restore RUN.
7. Each backup copy carries a DEADLINE, so a SHREDded KEY's backups EXPIRE; a lost KEY loses the data as a deleted one does.
8. A forge outage stops the company; a board DECISION runs the RUNs on the mirror, and promotion raises the authority epoch, blocking the old primary.
9. Every TASK carries a deadline-class LABEL; an externally fixed date gets a signed «degraded-mode packet» that prints on paper and names its holder.
10. The packet EXPIREs after the event, a RUN each season proves one PARTY can run it, and paper events return afterwards as OBSERVATIONs.

### 34. Continuity and exit

*The company must outlive any one person and be able to close itself down.*

1. The company must survive the loss of one person and end cleanly.
2. At least two human PARTYs hold each KEY, each ADDRESS and each recovery route.
3. A record names the PARTY taking over each class of DECISION when a board member leaves, and the board DECIDEs it yearly.
4. A PROCEDURE exports the whole company as repositories, payload STORE contents, KEY STORE contents and DECISION history in open formats.
5. The company returns a leaving client's records and DELETEs that client's payloads.
6. Winding down is a PROCEDURE: the notices, the final ACCOUNTs, records kept for the legal periods, then SHRED of the rest.

### 35. Data classes, legal bases and erasure

*Every record is tagged, and one key per person and retention class erases exactly one class.*

1. Every OBSERVATION, RUN, FACT, fixture and payload carries LABELs class, purpose, legal basis, retention and recipient; purpose, legal basis and retention follow fixed lists.
2. Personal data stays encrypted in the payload STORE, history holds only HASHes, and minimisation covers transcripts and screenshots.
3. Context assembly and every EFFECT draw only records whose purpose LABEL matches the TASK's, and a RULE DERIVEs Art. 30 and DPIA entries.
4. A privilege LABEL marks counsel's advice with its holder and distribution list; only a person on a committed roster shares it, by DECISION.
5. A protected-source LABEL leaves only a pseudonymous id in the record, and one named human keeps the mapping outside git.
6. A KEY covers one person and one retention class, because Art. 17(3)(b) GDPR exempts data kept for a legal obligation.
7. A gate refuses the SHRED of a KEY that a retained record CITEs; restricted data leaves every context packet.
8. A table RULE maps each request to erase, restrict or keep with reason, and the scheduler APPENDs the shred TASK at retention end.
9. A dispute starts a legal hold, a DECISION naming matter, custodians, classes and span, that every DELETE path CHECKs; an attempt is an incident.
10. The issuer or board ends the hold, Art. 17(3)(e) weighs erasure against it, and §203 StGB limits treatment data to a secrecy-bound processor.

### 36. Data subject rights, breaches and processors

*Requests, breaches and processors each need a fixed procedure, a clock and a register entry.*

The right to erasure is one of several; access, rectification, restriction, objection and portability each need a PROCEDURE.
1. The PROCEDURE finds every record about the person through the requirement-35 LABELs, including RUNs, FACTs and payloads, and answers as an EFFECT with a receipt.
2. Art. 12(3) GDPR gives one month, so the request is an OBSERVATION that starts a DEADLINE in the compliance calendar.
3. A personal data breach starts a different DEADLINE: Art. 33 GDPR requires notice to the supervisory authority within 72 hours of awareness.
4. The breach PROCEDURE contains it, assesses the risk from the LABEL classes, DECIDEs on notice, and APPENDs the DECISION with its reasons.
5. A breach is an incident, and the gates that detect one APPEND the breach TASK.
A register covers every «adapter»: which service it reaches, which LABEL classes it receives, the Art. 28 contract, where the data lands, how it gets there and who sub-processes it.
The model provider gets the strictest entry, since every context packet passes through it.
6. A new integration cannot go live without its entry, and a gate CHECKs that no LABEL class reaches a processor whose entry omits it.

### 37. Concurrency and scale

*Many agents writing at once need leased locks, a merge queue, small clones and split repositories.*

1. Fifty agents break a design that works for five, and reach 10 GB and a million COMMITs in two years.
2. Every update to main is a compare-and-swap from an expected parent, so a RUN on a stale base fails instead of overwriting.
3. A lock is a «lease» with a time limit and a «fencing token» the forge and payload STORE CHECK, so a killed holder cannot write.
4. Gates run on a speculative branch outside any lock, and a «merge queue» rebases, re-gates and retries a bounded number of times.
5. One landing covers one segment of a translated document, one POSTING of the books, or one field of a TASK; anything else conflicts.
6. A RUN works in a partial, «sparse clone» of the paths its TASK owns, and the RUNs on one host share one object STORE.
7. A file has a size ceiling, and a record above it holds the payload by HASH.
8. Routine removal never rewrites history, because only HASHes and pointers enter a COMMIT and the DELETE hits the payload STORE.
9. Split the repository by domain or project once a single STORE becomes the bottleneck, and let a cross-reference carry a repository and an id.


### 38. Contracts, signatures and acts only a person can perform
*Some acts need a notary, paper or one person's own signature and gates enforce the form.*

1. A binding COMMITMENT is SIGNed with a qualified electronic signature under eIDAS and carries LABEL risk=top.
2. A register names the form each act requires, and a gate refuses an EFFECT whose form does not match.
3. Some acts belong to a natural person, and no GRANT passes them to an agent.
4. For each such act the register names the position, and the act carries that person's own signature and second factor.
A fully automated administrative act needs a statute that permits it and no discretion, per §35a VwVfG.
5. An agent may PROPOSE a draft, and the record shows that it did.
6. A human CHECKs the clauses that create COMMITMENTs, and a RULE CHECKs both PARTYs' signing authority against the register extract.
7. Before SIGN, a gate compares worst-case liability with the insured limits and the board's accepted retention.
8. Unlimited liability needs a board DECISION, and settlement authority is an AMOUNT limit in the decision-rights file.
9. In a dispute or before an authority, an outbound EFFECT is top tier, needs counsel's CHECK and admits nothing.

### 39. Cost accounting
*Every TASK and RUN records its tokens, spend, tool cost and human hours for budgets and VIEWs.*

1. Each TASK and each RUN records its tokens, API spend, tool cost and human hours as AMOUNTs.
2. These AMOUNTs feed the budgets of requirement 21 and the value-against-cost DECISION of requirement 2.
3. They feed the dashboard VIEW of requirement 13.

### 40. Outcome metrics
*Each goal needs outcome metrics, measured from sources the agents did not write.*

1. A company with verified TASKs is not yet a working company.
2. Each goal has outcome metrics; a metric is a VIEW of a RULE over POSTINGs or OBSERVATIONs.
A metric off target opens a TASK for the board, and one on target is CHECKed as hard.
3. A proxy metric is permitted and is never a goal on its own.
4. A metric is only as good as its source, which is the records the agents wrote.
5. Where no outside PARTY signs, a gate cannot tell a true number from a fabricated one, so the company CHECKs it against FACTs the agents did not write.
6. Where no such FACT exists, the company SUPERSEDEs the outcome definition before the period starts.
7. A named human SIGNs every figure for a funder or an authority; the sample rate rises where numbers outrun the sample.
8. A paying metric moves, so a collector PARTY with its own KEYs READs the platforms and APPENDs each figure with its source, ACCOUNT, ANCHOR and HASH.
9. No agent holds a write GRANT, the RULE excludes the company's own «accounts», and a monthly CHECK splits each hit by source.

### 41. A compliance calendar and clocks started by others
*Duties recur on dates, and other PARTYs start DEADLINEs that silence can close.*

1. Some legal COMMITMENTs recur on a date, and each sits in a committed calendar with an owner PARTY, a lead time and a PROCEDURE.
2. The scheduler APPENDs a TASK ahead of each DEADLINE, and a missed DEADLINE opens an incident TASK.
3. Other DEADLINEs start with another PARTY's OBSERVATION.
4. Axiom 5 applies.
5. The DEADLINE counts from the other PARTY's own date where the law counts from it, and an alert flags a late OBSERVATION.
6. The DEADLINE CITEs the RULE that turns the OBSERVATION into it, and two PARTYs DECIDE the computed DEADLINE.
7. The DEADLINE names its consequence and a decide-by date at which it ESCALATEs to the board.
8. Where the company meets a DEADLINE by notifying a PARTY, the record names the ADDRESS and cites a receipt; doubt about receipt puts the burden of proof on the authority.
9. On SIGN every term triggered by elapsed time or inaction becomes a DEADLINE, and an EXPIRE with no recorded DECISION is a board-level incident.
10. The DEADLINE carries its IANA time zone and the working calendar it counts in.

### 42. Time, resources and places
*Physical TASKs hold places, crew and spans; dependencies and capacity POSTINGs prevent collisions.*

1. A TASK in physical work has a span, resource occupancy and a place THING, and its reservation ends by release or EXPIRE.
2. A TASK carries an estimated AMOUNT of time, not a DEADLINE, and start and finish are OBSERVATIONs with ANCHORs.
3. The scheduler gives each TASK a planned span, computes the critical path and shows slack, which shrinks with each delay.
4. A calendar for a person or a shared THING blocks unavailable slots.
5. A register of place THINGs gives each room exclusive use, and concurrent use needs a safe-work LABEL.
6. A TASK CITEs one or more place THINGs, and a gate fails the graph when two TASKs claim one exclusive place with no dependency.
7. An access record names the PARTY that holds the door key THING or entry code per place and span; a site without one is blocked.
8. A bill of quantities holds the estimate, orders, goods received and consumed AMOUNT, and a receipt OBSERVATION SUPERSEDEs it.
9. A THING that can sell out has a capacity ACCOUNT with total, reservations, bookings and free amount.
10. A RULE sets the overbooking limit per ACCOUNT, and a gate refuses a POSTING beyond it.

### 43. Physical safety and site stops
*A safety halt reaches the crew only if the crew reads it and stops work.*

1. Some work can hurt people, and the kill switch STOPs new EFFECTs inside the repository only.
2. The kill switch does not reach the crew unless the crew is online, READs the state and is willing to STOP.
3. Every place THING has a safety LABEL, set by a board DECISION or a safety RULE.
4. At a halt the system sends a plain-language stop order to every ADDRESS recorded in that zone.
5. Each ADDRESS gives an acknowledgement within a set time, and reminders repeat until it arrives.
6. The system APPENDs the halt with reason, zone, PARTYs and ANCHOR, and no new TASK goes there until a human APPENDs clearance with EVIDENCE.
7. A worker who refuses entry as unsafe is never treated as absent or reassigned; the company records and ESCALATEs the refusal.
8. Each worker gets the safety briefing and the last inspection CHECK for every site.
9. Tenants and authorities are PARTYs with decision rights: they may refuse access, call a STOP or set conditions that open blocked TASKs.
10. The site plan COMMITs to BaustellV duties, and a gate refuses dispatch to a site whose safety record or coordination position is incomplete.

### 44. Measurements and acceptance
*Acceptance needs signed measurements and formal inspection; a photo proves nothing.*

1. A photo proves nothing; acceptance in construction and trade law rests on measurements.
2. EVIDENCE for readiness includes measurements with a physical reference SIGNed by the PARTY that took them, plus a certificate of conformity for regulated work.
3. Each milestone has an inspection with a checklist by a PARTY whose EVIDENCE of qualification is on file where the trade requires one.
4. A defects list stays open until acceptance, and each defect CITEs a sub-TASK that blocks closure.
5. The company APPENDs a SIGNed acceptance record: the accepting PARTY, the date, the EVIDENCE, the retained AMOUNT and the date it is paid.
6. The warranty DEADLINE starts at acceptance and defaults to five years for building work under §634a(1) Nr. 2 BGB.
7. A calendar item CHECKs defects before the warranty DEADLINE EXPIREs.
8. The company gives a handover pack: SIGNed plans, certificates, door key THINGs and the notice that lifts restrictions on use.
9. A tenant has rights: notice under §555a BGB, three months for modernisation under §555c BGB, and a rent reduction under §536 BGB.
10. No agent negotiates that reduction away, waives those rights, or exceeds the GRANT for signing a works contract on site.


### 45. Commitments and external obligations

*A company must track every promise it owes or is owed, and check it before it starts work.*

1. A COMMITMENT is an edge and a TASK is a node; the company APPENDs COMMITMENTs as first-class records.
2. A reservation is a POSTING of tentative capacity from a THING's ACCOUNT to a TASK's ACCOUNT.
3. A booking is a reservation with LABEL firm, naming the PARTY, THING, planned ANCHOR, price, cancellation terms and deposit POSTING.
4. A COMMITMENT the company owes carries a promised ANCHOR, a placement, a delivery DEADLINE, a warranty or a refund right.
5. A COMMITMENT owed to the company carries a contractor's delivery, an approval DEADLINE or a payment due date.
Each COMMITMENT names the TASK or milestone that creates it and the one that clears it, and CITEs its source clause.
6. A missed DEADLINE opens an incident TASK with the counterparty notice and the penalty attached.
7. A RULE DERIVEs a VIEW of open COMMITMENTs, and the scheduler CHECKs it before opening dependent work.
8. Every engagement, client or funder has an engagement file: signed agreement, conflict CHECKs, embargo ANCHORs, client policy, authority register and subcontracting restrictions.
9. A gate READS that file before work starts: a conflict refuses the bid and a missed embargo opens an incident.
10. A gate refuses AI-generated work that would bind the client when the client's policy forbids it.

### 46. Operating a live service

*Running a live product or service needs on-call people, monitoring, backups, safe deploys and incident handling.*

1. A web product, a tenant building and a routed fleet shift the work from producing THINGs to keeping one THING running.
2. A monitoring RULE APPENDs an SLO record and pages the on-call PARTY, who holds a COMMITMENT with a paging ADDRESS and an acknowledgement DEADLINE.
3. Each alert has a versioned PROCEDURE, and each incident has a dated record with the alert, timeline, actions, cause and postmortem DECISION.
4. An outside monitor APPENDs state at intervals, a RULE DERIVEs availability as the basis for SLA disputes, and a second monitor watches the loop.
5. The product STORE joins the backup inventory of requirement 33 with point-in-time recovery and tested recovery objectives.
6. The restore drill restores the product and the company, not only one of them.
7. CI builds and deploys; a deploy is an EFFECT, gated and DECIDEd for production, with a receipt naming version, place and ANCHOR.
8. A production deploy has a canary stage, a freeze window and a rollback PROCEDURE; rollback needs the old version and the same approval class.
9. Deploy configuration and feature flags are config-as-code or EFFECTs with a DECISION, so an agent cannot change them without a trace.
10. break-glass is a GRANT to a smaller quorum for rollback, reboot, failover and capacity during a declared incident.
11. An incident is a TASK with LABEL incident, opened by an alert or a human, worked through contain, diagnose, mitigate, resolve, review.
12. A fleet, a building and a van each keep a register, logs and a response DEADLINE, and a silent van opens an incident.

### 47. Bookkeeping, tax and annual accounts

*Bookkeeping, tax and year-end work need matching entries, locked periods, tax rules and written documentation.*

1. Plain-text ACCOUNTs on immutable COMMITs fit German law but need matching, period locks, year-end work, tax determination and documentation.
2. A three-way reconciliation CHECK closes each period: orders, payouts and bank lines must match per channel within a declared tolerance.
3. Every residual AMOUNT gets a reasoned entry, and an unmatched record refuses the close for Amazon, cards and suppliers.
4. A pre-receive hook refuses any history rewrite in the accounting subtree, even from the board; rollback means the attempt never left the branch.
5. Invoices need gapless serial numbers per §14(4) UStG from requirement 1's allocator, and a gap carries its reason into the next audit.
6. The close values inventory against a stock-take, APPENDs depreciation schedules, separates earned revenue from cash received, then a DECISION locks the period.
7. The company DERIVEs the E-Bilanz per §5b EStG for the Finanzamt, and the managing director SIGNs the HGB §242 and §264 accounts for the register.
8. A RULE determines VAT per sale with cross-border rules: One-Stop Shop above 10,000 € per §3c UStG, marketplace as deemed supplier per §3(3a) UStG.
9. The company reclaims input VAT and DERIVEs the VAT return from ACCOUNT entries with a LABEL per return line, and the Steuerberater files it.
10. A committed, SIGNed Verfahrensdokumentation per GoBD states how transactions enter the books, who CHECKs them and how read-back works.
11. Every PROCEDURE on the books CITEs it, and a change needs a DECISION.

### 48. Capital, entities and investors

*Shares, funding, group entities and investor rights need their own tracked structure, separate from task work.*

1. Shares, funding instruments, entities, investor rights and runway sit outside the TASK graph, and a share treated as a FACT loses legal structure.
2. A cap table is an append-only record of instruments: each funding round is a DECISION with subscription agreements, pre-money, option pool and conversion RULEs.
3. The verifier DERIVEs post-money fully diluted, the exit waterfall and the per-instrument cap; each instrument CITEs its signed agreement.
4. The Gesellschafterliste per §40 GmbHG reconciles to the court version, and no equity measure is effective without the §53 GmbHG notarial deed as EVIDENCE.
5. A RULE DERIVEs runway from cash, burn, committed funding, weighted receivables and payables, and a gate refuses a COMMITMENT below a set months.
6. A purpose-bound ACCOUNT holds restricted funds, and a gate refuses a POSTING whose purpose LABEL does not match.
7. The board READS a VIEW of the waterfall, the cap table by holder and the cliff from an option expiry or warrant trigger.
8. Each subsidiary, holding or branch is a LABEL branch; the company consolidates, computes transfer pricing at arm's length and APPENDs the basis.
Some filings happen per entity, such as the Handelsregister and the VAT ID, and others per group; covenants, board seats, information rights and exit consent are COMMITMENTs.
9. An investor DECISION is a human TASK on the approval ADDRESS, and it lands before the company acts.
10. Grants carry milestones, a report COMMITMENT, a notice DEADLINE and claw-back terms; a campaign records backers, tiers, VAT and refunds.
11. A foreign-currency invoice records the EUR equivalent at the transaction ANCHOR and the settlement gain or loss, and import goods carry a landed cost.

### 49. Employment and labour law

*Hiring, scheduling and firing people brings statutory duties, worker consultation and classification proof.*

1. A company that dispatches, scores and terminates people by AI DECISION faces statute RULEs, mandatory consultation and a high-risk LABEL under the AI Act.
2. The works council is a binary FACT with the election ANCHOR, and each Betriebsvereinbarung is a versioned COMMITMENT with a scope and expiry.
3. A pre-effect gate CHECKs the map from DECISION to co-determination class to required Betriebsvereinbarung.
4. Participation under §87 BetrVG covers hiring, rosters, shift allocation and performance monitoring, and so does AI that schedules or scores.
5. A termination needs the §102 BetrVG hearing and is void without it, and §87(1) Nr. 6 gives the council an expert at company cost.
6. A gate CHECKs each shift against eight hours a day and eleven hours of rest before dispatch, and caps cumulative weekly and monthly hours.
7. A four-day DEADLINE governs on-call shifts per §12 TzBfG, and a working-time violation opens an incident that no agent overrides.
8. A termination is a top-tier EFFECT because §623 BGB requires Schriftform, so the company prints, signs on paper and posts it.
9. False self-employment and unlicensed temporary agency work per §1 AÜG are offences, so each worker's classification is a FACT with reasoning.
10. AI that allocates TASKs by scoring is high-risk under Annex III(4)(b), and Art. 26 requires informing representatives and affected workers before go-live.
11. The MiLoG minimum wage sits in the statutory facts register, and fitness, health or vaccination requirements carry expiry DEADLINEs the scheduler CHECKs.
12. A worker may contest an automated DECISION, and a PROCEDURE maps each DECISION LABEL to a board member, an arbiter or the works council.

### 50. Rights, brand and creative proof

*Licences, brand rules and client approvals must be checked before any work is published.*

1. Every creative THING carries a rights record: licensor, assignment or GRANT, media, territory, DEADLINE, run limit, derivatives, AI use, credit line and licence HASH.
2. A pre-effect gate refuses any placement whose media, DEADLINE or print run exceeds the GRANT.
3. An assignment is effective only on payment; under §29 UrhG only a GRANT under §31 UrhG exists, read narrowly to the contract purpose.
4. An identity THING passes a trade-mark clearance CHECK against committed registered marks, and the clearance EXPIREs when it changes.
5. A client DECISION binds to the exact rendition it saw, CITEs the file HASH and a dated screenshot, and a change reopens the approval TASK.
6. Each brand has a committed system of colour, type, fonts, logo variants, voice RULEs and templates, and an asset carries its HASH.
7. A later system change marks older work stale and opens a review TASK.
8. Every output is CHECKed before delivery: colours and fonts by a RULE, voice by an LLM judge with a rubric.
9. Taste is not deterministic, so a client veto or a failed peer review resets a TASK even when the spec was met.
10. A rejection record states what would fix the work, and three rejections ESCALATE to a human TASK for the board.
11. A committed RULE covers alcohol advertising, health claims, age ratings, accessibility and GEMA, and each publication is an OBSERVATION with ANCHOR, HASH and placement.
12. Sponsor and affiliate contracts make COMMITMENTs to publish at an ANCHOR or platform, with a penalty, a DEADLINE and an incident on a miss.


## The eighteen function packs, rewritten

A pack is still a set of procedures, rules and record kinds, which is what it was before. Written in the dictionary it stops being a paragraph of promises and becomes a list of records, gates and deadlines that a builder can disagree with.

### 1. Sales and the customer lifecycle
*The pack takes a lead to a paying client, then hands the client's data back.*

1. A PARTY APPENDs each lead as an OBSERVATION with a source THING and an arrival ANCHOR.
2. A RUN DERIVEs a quote from the price-list FACTs, and a DECISION sends it as a COMMITMENT with a DEADLINE.
3. The customer's signed acceptance is a DECISION by that PARTY, and onboarding APPENDs its PARTY and ACCOUNTs.
4. Each support request opens a TASK under a PROCEDURE, and a response-time DEADLINE ESCALATEs it at the decide-by date.
5. A complaint is an OBSERVATION that opens a TASK.
6. A refund is an EFFECT that makes a POSTING; offboarding returns the payload and a gate CHECKs that none remains.

### 2. Marketing
*The pack runs campaigns in one brand voice, and each send cites the recipient's consent.*

1. A campaign is a TASK with one owner PARTY, planned ANCHORs and a budget AMOUNT.
2. The brand guidelines are RULEs that CHECK the persona voice in each draft.
3. An agent PARTY PROPOSEs the campaign content.
4. Consent is an OBSERVATION from the recipient PARTY, never a GRANT.
5. A gate CHECKs that consent OBSERVATION before the campaign EFFECT.
6. The campaign EFFECT makes a POSTING against the budget AMOUNT.

### 3. Finance operations
*The pack keeps the books, bills clients, pays staff, forecasts cash and hands over to a tax advisor.*

1. An issued invoice is a COMMITMENT, a POSTING and a serial RULE; its DEADLINE APPENDs a dunning TASK at expiry.
2. Receivables and payables are ACCOUNTs in the books of the company PARTY.
3. A RULE computes VAT on each POSTING and moves it to a VAT ACCOUNT.
4. A payroll RUN makes one POSTING per PARTY and one EFFECT to the bank STORE.
5. The cash forecast is a metric VIEW, and the handover to the tax advisor carries it as an EFFECT.
6. §14 UStG requires an XRechnung or ZUGFeRD e-invoice for German B2B invoices, with §27 UStG transition to 2027; the pack produces and reads both.

### 4. Procurement and inventory
*The pack buys stock safely, matches three documents before paying and tracks goods in and out.*

1. A purchase order is a COMMITMENT to the supplier PARTY with a DEADLINE.
2. A gate CHECKs the order, the delivery note OBSERVATION and the received invoice OBSERVATION for agreement.
3. Axiom 12 applies.
4. Supplier onboarding is a TASK: a verifier PARTY CHECKs the IBAN through a second ADDRESS out of band.
5. Axiom 9 applies.
6. Each stock movement is a POSTING between two ACCOUNTs of THINGs; a delivery is a TASK whose arrival is an OBSERVATION.

### 5. People, human and agent
*The pack runs hiring, onboarding, time, leave and offboarding for people and agents alike.*

1. Hiring is a TASK, and Annex III of the AI Act keeps each screening DECISION with a human PARTY.
2. Onboarding APPENDs the PARTY, gives it a role with GRANTs and records its ADDRESSes.
3. Offboarding REVOKEs every KEY and GRANT of the PARTY before the end of the same day.
4. Time tracking APPENDs a POSTING of hour UNITs from the PARTY's ACCOUNT to the TASK's ACCOUNT.
5. A leave request APPENDs a span with LABEL tentative, and a DECISION makes it firm.
6. An agent PARTY enters like a person: a PROPOSEd role, a sandbox RUN, then a board DECISION; a CHECK keeps, changes or retires it.

### 6. Legal
*The pack holds the company's terms, insurance, rights and contract duties after signature.*

1. Terms, the privacy policy and the open-source GRANT list are versioned RULEs.
2. A contract is a COMMITMENT with a DEADLINE, and each obligation it creates is a separate COMMITMENT.
3. The insurance contract is a COMMITMENT from the insurer PARTY with its own DEADLINE.
4. A DECISION assigns the ownership of generated work, and a GRANT records what each contributor keeps.
5. A gate CHECKs the shipped records against the open-source GRANT list before publication.
6. A notice period is a DEADLINE on a planned ANCHOR, and its expiry APPENDs a renewal TASK.

### 7. Meetings and calendars
*The pack books meetings in other people's calendars and turns what was said into records.*

1. A scheduler RUN READs the availability calendar VIEW of each PARTY.
2. A reservation POSTING holds the span on each calendar until a DECISION makes it firm.
3. The invitation is the EFFECT of that DECISION.
4. Minutes are an OBSERVATION of the meeting with source THING, stated ANCHOR and HASH.
5. Each DECISION the meeting makes is APPENDed separately.
6. Each promised action becomes a TASK with one owner PARTY and a DEADLINE.

### 8. Paper mail
*The pack turns paper letters into records and keeps the paper as long as the law asks.*

1. A letter from an authority, a bank or a court arrives as paper at the company's ADDRESS.
2. The scan intake APPENDs it as an OBSERVATION under the same PROCEDURE as an email.
3. The paper original is a THING, and a custody POSTING holds it for the span a LABEL retention states.

### 9. Incidents and reputation
*The pack reviews business failures and controls every public statement the company makes.*

1. An incident TASK covers a business failure, not only a technical one.
2. The postmortem is a TASK whose EVIDENCE names the cause and the RULE or PROCEDURE it changes.
3. The crisis communication PROCEDURE needs a board DECISION, and each public statement is an EFFECT of it.


### 10. Acceptable use
*The company records the work it refuses and tests incoming work and outgoing content against that list.*

1. The board DECIDEs a policy that lists the work the company refuses.
2. An intake gate CHECKs each TASK and OBSERVATION against that policy; a second gate CHECKs each outbound publish or send EFFECT.

### 11. Manufacturing
*Records track what each lot is made of, each unit, tool calibration, sampling results and vendor approval.*

1. A BOM record names the THINGs and AMOUNTs of one lot; each revision SUPERSEDEs the earlier BOM.
2. Each lot CITEs the RUN manifest for its genealogy; each unit carries a serial LABEL.
3. Each lot carries an expiry DEADLINE; a RULE APPENDs a TASK to remove it from sale at expiry.
4. A verifier PARTY CHECKs each measuring tool against the calibration RULE and APPENDs EVIDENCE.
5. A sampling RULE reads AQL; a failed CHECK APPENDs a LABEL non-conformance TASK that the corrective-action PROCEDURE closes only on EVIDENCE.
6. The approved-vendor register gives each vendor a GRANT; a gate refuses a purchase from outside it or a counterfeit lot.

### 12. Insurance and claims
*The company records its insurance terms, what it insures, goods held for others, each claim and each reserve.*

1. Each insurance contract is a COMMITMENT from the insurer; its terms are records with LABELs for site, line, limit and DEADLINE.
2. A metric DERIVEs the total insured AMOUNT across one site or one LABEL line.
3. A custody POSTING records each THING held for another PARTY, with a span and a DEADLINE.
4. An OBSERVATION of a loss opens the claim TASK; each occurrence gets a reserve POSTING with uncertainty.
5. A CHECK sums the reserves against the aggregate limit and ESCALATEs the claim TASK.
6. A DEADLINE from §30 VVG counts from the loss OBSERVATION; its expiry APPENDs a filing.

### 13. Healthcare operations
*One record per patient, appointments, insurer approvals, claims and appeals, signed notes and a read log.*

1. The patient register holds one THING per natural person; a CHECK refuses two records that may be one person.
2. A scheduler RUN gives each appointment TASK a planned span in a clinician's calendar.
3. An insurer pre-authorization is an OBSERVATION of the payer's answer that the treatment TASK CITEs.
4. A claim is an EFFECT to the payer's STORE; a refusal opens an appeal TASK on the payer's DEADLINE.
5. A named clinician SIGNs each clinical note as a DECISION, per §630d and §630e BGB.
6. Each READ APPENDs an OBSERVATION of PARTY, HASH and ANCHOR; quality metrics and the payer report are VIEWs.

### 14. Public sector and permits
*Each application gets a statutory clock, a hearing, a reasoned decision, comment spans and standstill.*

1. Intake APPENDs one TASK per application and CITEs the statute RULE that sets its DEADLINE.
2. A DEADLINE from §42a VwVfG APPENDs a deemed approval GRANT at expiry.
3. A DEADLINE from §28 VwVfG gives the applicant a span to state a view before the DECISION.
4. Each refusal is a DECISION that CITEs the RULE and the OBSERVATIONs behind it.
5. A public comment span is a DEADLINE whose expiry APPENDs a TASK; an open-records TASK carries its DEADLINE under a READ GRANT.
6. A standstill DEADLINE from §134 GWB refuses the award DECISION until it expires.

### 15. Publishing and ESG reporting
*Every claim is checked, corrections reach every placement, sources stay hidden, and ESG numbers reproduce.*

1. Each published claim is a FACT with an owner PARTY, an ANCHOR, a validity span and a taint LABEL.
2. A gate CHECKs each claim against the OBSERVATIONs behind it before the publish EFFECT.
3. A correction SUPERSEDEs the FACT; a TASK reads every placement that CITEs the old HASH.
4. Source protection gives each source a pseudonymous LABEL, and a GRANT limits READ of the link.
5. A separation RULE refuses a commercial PARTY any DECISION on editorial content.
6. A versioned inventory RULE and a period-lock DECISION fix the input records; each factor set carries a HASH, so a CHECK reproduces the assured number.

### 16. International operations
*Cross-border tax, invoice clearance, data location, time zones, sanctions and FX rates are each a RULE.*

1. A RULE from §3a(2) UStG sets the place of supply; under §13b the customer PARTY owes the VAT and the e-invoice carries that LABEL.
2. A clearance RULE per jurisdiction names the filing STORE and the receipt OBSERVATION that ends each e-invoice TASK.
3. A data-location gate CHECKs the jurisdiction LABEL at each hop and refuses a READ or EXECUTE across a forbidden boundary.
4. Each PARTY and place THING CITEs an IANA time zone; a local working calendar RULE converts the UNITs.
5. A sanctions gate CHECKs each PARTY against the list and refuses the EFFECT on a match.
6. Each FX POSTING CITEs the declared rate source and its ANCHOR; a revaluation RULE APPENDs a reserve per open item.

### 17. Nonprofits and grants
*Money stays bound to its purpose, donations and hours are valued, outcomes are checked and funders get reports.*

1. Each fund is a purpose-bound ACCOUNT; the funder's COMMITMENT carries a restriction LABEL, a DEADLINE and the reporting RULE whose VIEW a TASK APPENDs.
2. An in-kind donation is a POSTING of the THING at a declared AMOUNT with LABEL estimated.
3. A volunteer RUN APPENDs an OBSERVATION of hours; a POSTING moves that AMOUNT to the programme ACCOUNT.
4. Each programme outcome is a FACT that a verifier PARTY outside the company CHECKs.
5. A safeguarding RULE from §8a SGB VIII requires a CHECKed OBSERVATION of a cleared PARTY before any TASK that works with minors.

### 18. Research labs
*Ethics approvals renew, adverse events run on clocks, authorship is recorded, and shared data is destroyed at term end.*

1. An ethics approval is a GRANT from the committee, with a DEADLINE for renewal.
2. A serious adverse event opens a TASK and a DEADLINE counting from the OBSERVATION to the filing.
3. The authorship register names each author PARTY; the study DECISION CITEs it.
4. A data-sharing agreement is a COMMITMENT naming the federation RULE and a DEADLINE whose expiry APPENDs the DELETE.
5. A preregistration is a DECISION that fixes the study design before the first OBSERVATION.
6. The replication package carries a HASH that a verifier CITEs as EVIDENCE; an embargo DEADLINE refuses the publish EFFECT until it expires.


## What did not fit

Every rewrite below was done by someone working from the dictionary alone, and every one of them reported where the dictionary ran out. Those reports are the honest output of the exercise.

**Domain nouns belong in an annex.** Cap table, SAFE, waterfall, aggregate limit, AQL, SLO, XRechnung. None of them should enter a core dictionary, and all of them have to be written down somewhere before a pack can use them. The technical annex is per pack: a construction company does not need a word for an insurance reserve.

**Concepts the dictionary lacks.**

**The queue.** The previous post calls it the frontier: the set of tasks whose dependencies are done and whose gates are open. It is derivable, so it should be a view, and three writers still wanted a word for it because it is the thing an agent looks at first.

**The sandbox.** The source uses it as a place ("evaluated in the sandbox"), as a label ("a sandbox run cannot cover a live effect") and as an adjective. One word, three grammatical jobs, and the one-part-of-speech rule has no room for it.

**The case.** Requirement 30 gives standing to a regulator, a neighbour, a franchisee and a whistleblower, and each of them sits inside an ongoing matter. A task is too short-lived for that. A case needs a party, a deadline and a record of how a submission was handled, and the dictionary composes it from four records every time somebody writes it.

**The legal basis.** Requirement 26 labels every processing activity with one. The closest composition is a label whose value cites the statute rule that permits the processing, which is accurate and longer than the phrase it replaces.

**The score.** Requirement 2 ranks work by value against cost. A posting needs a unit, and there is no unit for value. The rewrite used points and admitted the unit was invented.

**The receipt inside the ledger.** Requirement 8 cites receipts as evidence of an effect, and the dictionary defines a receipt as an observation from the store. For a bank payment those are the same. For an email there is no store to ask, so the writer has to name the confirmation channel and hope it exists.

**The atomic transition.** Requirement 10 says a transition lands whole or not at all. One append holds one record, and a transition is several records changing state together.

**Ownership.** Requirement 50 asks who owns what an agent wrote. The answer is a grant from a decision, which is accurate and reads badly, because ownership is a legal relation and a grant is a permission.

**Leave.** Requirement 49 treats a holiday as a reservation of a person's time. A reservation moves capacity between accounts, and a person's free time is not an account the company owns.

**Minutes.** A set of minutes reports decisions that were made. Written as an observation it loses the decisions; written as decisions it invents one per sentence.

**The route.** Requirement 25 puts a second confirmation on "another channel", which means a different delivery path to the same person, not a different address. The dictionary has an address and no name for the policy that decides which addresses count as independent.

**The persona.** Requirement 20 asks whether an agent should have one. It turns out to be a label on a run, a text artifact with a hash, and a rule, which is three records for a word that sounded like one thing.

**Places where two approved words still both fit.** These are the residual ties, and the dictionary has no rule that breaks them.

- A response-time target is a deadline in one reading and a commitment in another. The rewrite picked deadline, because a missed response time has a consequence.
- A postmortem is a task in one reading and evidence in another. The rewrite picked a task that produces evidence, which is a longer sentence and an honest one.
- An assured emissions figure is a view in one reading and an amount in another. The rewrite picked a view, because it must be reproducible from its inputs.
- A deterministic asset is a recipe in one reading and a view in another, and the source's own word is "recipe".

That list is short, and it cost five rounds to get short. A first dictionary that lost nothing would mean the test was too easy.

## What this is not

It is not a schema. The dictionary says what a record is called. The previous post's requirements still say which fields it carries, who may write it and when it expires.

It is not a data model. Nothing here decides how a record is stored, whether the repository uses one file per task, or how the blob store encrypts a payload.

It is not a grammar. ASD-STE100 also controls sentence construction, with limits of 20 words for an instruction and 25 for a description, and rules about the passive voice. I kept those for the rewrites and did not make them part of the dictionary, because these are sentences that people read.

It is not an argument that a specification should read like this. The rewrites are for checking, not for reading. Nobody wants fifty requirements where every third word is in capitals.

## Run it on your own spec

Four steps and an afternoon.

1. List the nouns that appear in three or more requirements of your own specification.
2. Give each one a single sentence, and write down the words it replaces.
3. Take the requirement you are least sure about and give it, with the list, to two people who cannot talk to each other. Ask each to rewrite it using only those words.
4. Diff the two rewrites. Every place they chose differently is a place your specification is ambiguous, whether or not you adopt the dictionary.

The diff is the product. The dictionary is what makes the diff possible, and it does not have to be mine.

## What the rewrites changed

The fifty requirements survived, and six of them changed on the way through. Those six are worth fixing in the original.

**Requirement 19 broke a definition.** The dictionary banned "skill" as a synonym for procedure, because a procedure is a sequence of steps. Every writer on that requirement refused the ban, and they were right: a skill is a packaged artifact with a version hash, its own tests and an interface, which is a thing and not a procedure. The amended entry moves the word rather than the meaning, and the next revision of the dictionary will carry it.

**Requirement 42 turned capacity into money.** A task that holds a room, a crew seat and a truck reads like a permission. Written as postings of room-days and seat-days it becomes a quantity that can be held partially, released, overbooked or counted, which is what a scheduling system needs and what the prose never said.

**Requirement 41 separated a count from a duty.** "The effect of expiry" mixed the consequence of a missed deadline into the word for what the company does to the world. A deadline now has a consequence, and the consequence is a grant or a commitment appearing or ending. A deemed approval under §42a VwVfG is a permit the statute grants when the authority stays silent, which is a strange thing to have to write as a decision.

**Requirement 30 stopped saying that outsiders cannot approve.** A correspondent cannot decide the company's effects. A client signing off a design is deciding something, and their signature is a decision by them. The original sentence made those two cases sound like one refusal.

**Requirement 25 exposed the route problem.** The second confirmation on another channel is an address, or a rule that picks two independent ones, and the dictionary has no name for the second. That is a gap in the requirement, not only in the dictionary.

**Requirement 8 exposed the receipt problem.** Evidence of an effect that arrives by email has no store to read back from, so the requirement needs to name what counts as confirmation before anyone can build it.

Everything else came through unchanged in meaning, which was the point. Fifty requirements, seven record kinds, eighteen verbs, fifteen axioms, and an annex for the words that belong to one trade.