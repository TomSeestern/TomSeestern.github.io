---
id: 2026-seven-nouns-eighteen-verbs
title: "Seven Nouns and Eighteen Verbs"
articleDate: 2026-11-05
articleContent: "Seven record kinds, eighteen verbs, fifteen axioms: fifty requirements rewritten in a controlled vocabulary and tested by two writers who never compared notes."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI
  - Automation
  - Git
  - LLM
  - Requirements
---


# Seven Nouns and Eighteen Verbs

## A spec drifts where nobody looks

Take three sentences from [Requirements for a Git-Based, Stateless, LLM-Driven Company](/blog/entry/2026-git-based-stateless-llm-driven-company). Requirement 38 says that a binding commitment "uses a qualified electronic signature". Requirement 25 says that money above a threshold "needs approval". Requirement 30 says an outside correspondent "cannot approve the company's effects". Three words — signature, approval, approve — for one operation: a person putting their mark on a specific payload. Are they the same? The prose does not say.

The word "effect" drifts further. Elsewhere it means what the company does to the world: a payment, an email, a deploy. Requirement 41 then uses "the effect of expiry" for the consequence of a missed deadline, which is a different thing with different rules.

A person reading this guesses from context and is usually right. An agent cannot guess, so it resolves the ambiguity in whichever direction is cheaper. The cheap direction is to treat an approval as a comment and a comment as an approval, and that is how a company ends up paying an invoice nobody signed.

That post is fifty requirements and eighteen thousand words. This one makes a narrower claim: every one of those requirements can be written again with seven record kinds and eighteen verbs and keep every control it states. A control, here, is one mechanism inside a requirement that makes a specific failure impossible or visible: a gate, a check, a signature, a deadline. The examples that illustrate a control do not all survive, and the section before the requirements says what I counted as one.

That claim is worth testing, because the failure it prevents is quiet. A specification written in ordinary prose drifts while nobody is looking.

## What ASD-STE100 does that applies here

[ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/) began in 1979, when the European airline industry asked its suppliers' association for aircraft maintenance documentation that mechanics who did not speak English could follow. A working group followed in 1983 and the first guide in 1986; the standard that came out of that work is a controlled language. Issue 9, published in January 2025, has 53 writing rules and about 900 approved words, and it is free.

Two of its ideas matter here. The first is the dictionary: each approved word has one meaning and one part of speech, and about 1,200 words are listed as not approved, each with a pointer to the approved word to use instead. "Verify" is not approved; the dictionary sends you to CHECK. The second is the split between the general vocabulary and the technical nouns, which live in their own list so that "propeller" and "aural warning system" do not have to enter the core dictionary.

Three of its writing rules shape the rewrites: one mechanism per statement, which is STE's one instruction per sentence carried over to a requirement; no statement longer than 25 words, its limit for a description; and capitals for the words the dictionary approves, which is how STE marks them in its examples. A reader can check the second by counting.

What I did not take is the rest of the grammar, the spelling and punctuation rules, and the procedural sections. Those exist so a mechanic can perform a step without ambiguity. A requirement is a property that has to hold, not a step somebody performs, and written as an instruction it loses the subject that makes the control checkable. "A gate refuses the append" names who refuses; "Refuse the append" does not.

## Five rounds, and what each one found

I wrote the first dictionary in one sitting: 21 nouns, 12 verbs, 8 rules. It looked tidy. It was wrong in ways I could not see, because I wrote both the requirements and the dictionary and my reading of one covered for the other.

So I stopped trusting my own reading and made reviewers attack it. Every reviewer and every writer in the rounds below was a model agent, run on the source and the dictionary alone, with no shared context and no sight of the other.

**Round one: four reviewers, four lenses.** One took the first 21 requirements, one took requirements 22 to 41, one took the last nine and all eighteen function packs, and one was told to ignore coverage and hunt for overlap. The overlap reviewer found that the verb list was both redundant and incomplete: CONFIRM meant the same as CHECK, and there was no verb at all for signing, for citing a record, or for revoking a grant.

**Round two: the two-writer test.** This is the check that a coverage table cannot replace. Give one requirement and the dictionary to two writers who cannot see each other. Compare what they wrote.

I gave both writers requirement 42, the one about rooms, crews and truck seats. They broke the source into 19 ideas, and chose different words for 7 of them. On 4 more they chose the same word while both flagged it as wrong, which makes 11 of the 19 problematic in one way or another. The scheduler became a party in one version and an invented word in the other. The critical path was computed by a check in one and by an invented verb in the other. A door key became a signing secret in one version, which is exactly the kind of silent drift the exercise is meant to prevent.

A small dictionary can express nearly anything if a writer is willing to stretch a word. Two writers stretch in different directions. That is the failure a coverage matrix cannot see, and it took a diff of two independent rewrites to expose it.

**Round three: fix what the diff showed.** The big change: capacity stopped being a permission. A room held by a task is now a movement of room-days between two accounts, which means a partial hold on 5 of 100 seats works, and a booking needs no deposit that the source never mentioned.

**Round four: test on sections nobody had tuned against.** Requirement 35 on erasure, requirement 48 on capital and the insurance pack. Two fresh writers segmented the material into 45 ideas, disagreed on 6, and every disagreement was settled by adding a definition rather than a word.

**Round five: the dictionary below.** Nothing in this round changed the word list, only the definitions. What I can defend is narrower than a measurement: 7 of 19 ideas drew different words on the requirement the dictionary was built from, and 6 of 45 on material it had never seen. That is 37 percent and then 13 percent, on two different tasks, with two writers and me reading the diff. It is evidence, not a trial.

A sixth pass came later and attacked the dictionary directly rather than a rewrite. It is the one recorded at the end of the dictionary, as six amendments.

## How to read the dictionary

Each entry gives one meaning, the forms it takes and the words it replaces. A word in capitals is approved. A word in ordinary type is not, and the entry says what to write instead; the ban applies to the sense named in that entry, not to every use of the word. To go from a word you have to the word to use, search the page for it, because every unapproved word sits in the entry that replaces it. A word in « » is one the dictionary does not have: the rewrite keeps it and reports it under what did not fit. That report is a sample, not an index, because most of the marked words are domain nouns that belong to a pack's annex. Two lowercase entries, record and consequence, are the exceptions, because one names the category and the other names a part of a deadline.

There are three layers. The given words come from git and cryptography and this dictionary does not design them. The record kinds are the seven things a company appends. The defined nouns are built from record kinds, and the verbs act on both. The five nouns that are not records sit beside them, because a view, a label, a unit, an amount and an address are used by records without being appended as one.

Then there are fifteen axioms. They are the sentences that used to be repeated inside individual requirements, gathered into one place so that a writer cannot restate them slightly differently. The axiom that every effect cites a decision used to live in three separate requirements with three slightly different wordings.

## The given words

**COMMIT** — one signed snapshot; the unit of repository history.

**HASH** — the content address of a byte string.

**ANCHOR** — a timestamp and the thing that gave it. A planned time and a measured time are both anchors, and a label says which.

## Seven record kinds

**record** — anything appended in a commit. Every noun in this section is a record except the store and consequence. The five nouns in their own section below are not records. A key record holds the public half; the secret stays in a store.

**THING** — anything with an identity: a person, an agent, an organisation, a place, a vehicle, a document, a door key, a model, a tool. A thing may cite the thing that contains it, so a room sits in a floor, and a floor sits in a building.

Not approved: item, entity, object, asset, resource. "Item" is also on this site's own list of placeholder names, which is one reason it did not survive.

**RULE** — a versioned predicate that a check computes on records. A rule has an owner and cites its source.

Not approved: eligibility, threshold.

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

Not approved: user, actor, contact, account holder, host. An agent is a party whose work a model drives, and a service is a thing reached by an ADDRESS.

**ACCOUNT** — a named holder of an amount of one unit, owned by a party, a task or a thing. One thing has one account per unit, and its balance is a view of its postings.

Not approved: wallet, fund, ledger line.

**KEY** — a secret one party holds to sign or decrypt. The registry holds its public half, its scope and its validity. A credential is a key.

Not approved: token, passkey, certificate.

**STORE** — a place outside the repository that holds records, secrets or state. The repository is one store among several, and a store is reached by reading, executing or deleting.

Not approved: database, vault, mirror, forge, bank, platform, system of record, cache.

**RUN** — one attempt by one party to advance one task, under one procedure or none. A run cites every thing and record it used, which is where lot genealogy comes from without a word for lots.

Not approved: session, episode, invocation, attempt.

**DECISION** — a commit, or an observation of a signed document, that cites the record it chooses. A document an outside party signs is a decision by that party; an unsigned message is an observation. Silence is never a decision.

Not approved: approval, approve, sign-off, vote, verdict, ruling. To accept a proposal is to DECIDE; consent from outside is an OBSERVATION.

**GRANT** — a standing permission from one party to a party or a task, with an action class (read, execute or publish), a scope of labels, a limit and a deadline.

Not approved: permission, permission part of a delegation, lease. Consent is an OBSERVATION from the party that gives it, not a GRANT.

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

Not approved: quantity.

**ADDRESS** — a named way of reaching a party: mail, phone, post, an API endpoint, an IBAN. A party may hold several.

Not approved: channel, contact point, notice address.

## Eighteen verbs

**OBSERVE** — to make an observation from a source.

**READ** — to bring a record or a store's state into a run without changing it.

**PROPOSE** — to append a record that asks for a decision.

**CHECK** — to find if records agree with a rule. The result is a check: pass or fail. A passing check that a task cites is evidence.

Not approved: verify, verification.

**DERIVE** — to compute a view from records by a rule.

**DECIDE** — to make a decision. A refusal is also a decision, and accepting a computed record is a decision.

**SIGN** — to make the mark only one key can make. A signature is the mark itself, and the record of a signed document is a DECISION or an OBSERVATION.

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

11. Limits are never decremented. A limit is checked as the sum of postings or commitments against it, and never reduced in place. A budget is an amount with a limit and a deadline, and needs no entry of its own.

12. Gates refuse, alerts do not. When a gate fails, the append, execute, delete or shred does not happen, and the failed check is appended instead. When an alert fails, a task opens and the write happens.

13. Inside and outside. Capacity inside the company moves by posting. A duty to an outside party is a commitment. One booking with a venue makes both.

14. Duties have deadlines, deadlines need no duty. Every commitment names a deadline. A deadline without a duty, such as a domain renewal, cites the thing it is about.

15. The law acts through rules. A deemed outcome is a consequence that a statute rule makes at expiry. It is never a decision by silence.

## The words that did not get their own entry

A dictionary this small stays small by refusing to add a word whenever a phrase will do. These are compounds: the words are approved, the phrase has one fixed meaning, and no new entry is needed.

**budget** — an amount limit held by a party with a deadline

**value** — an amount in a unit the company declares, used to rank tasks against cost

**balance** — the view of an account's postings

**capacity** — the amount in a thing's account before any reservation

**role** — a set of grants, labels and procedures

**policy** — a set of rules

**gate** — a rule and the check it runs; when the check fails, the append, execute, delete or shred does not happen

**risk tier** — a label named risk, with values low, normal, high and top

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

## Seven amendments the audits forced

The writers worked from an earlier version of this dictionary. The bans quoted below come from it, and the entries above show the current version. An audit of the finished rewrites produced these seven changes, and each one repairs a contradiction rather than inventing a noun.

`gate` was banned under RULE and used in axiom 12, in thirty of the fifty requirements and in twelve of the eighteen packs. A gate runs a rule and refuses when the check fails; the rule on its own is only a predicate. It is in the list of words without an entry now, and the ban is gone.

`policy` was banned under RULE and defined as a compound nine lines later in the same document. The compound stands, and the ban is gone.

`tier` was banned under LABEL while every requirement spoke of a risk tier, which is a label named risk with four values. The compound exists now, and the ban on the bare word stands.

GRANT allowed an action class of read or execute, which left a media licence with nowhere to live. The table above calls a media permission a grant, so publish joins the action classes.

Axiom 11 said there is no word for budget while the compound list defines one. The axiom now says what a budget is instead of denying it.

The definition of a record claimed that every noun below it was one. That made the store a record, and the address a record in one sentence and a field in the next. It now names what is not a record.

`value` and `balance` were banned under AMOUNT and used in every ranking and every ledger view, which are the two things a company does most. Both have an entry of their own now, and the ban is gone.

## The first draft lost the controls

The rewrites below are not the first ones I wrote. The first ones were shorter, because I capped each requirement at ten statements, and a cap is a compression target whether or not the material compresses.

Two reviewers then compared every rewrite with its source, line by line, looking for one thing only: a control that no longer appears. That count describes the draft they saw, not the text below. Fifteen of the first twenty-five requirements had lost at least one. So had twenty-one of the second twenty-five. Requirement 9 had five artifact checks in the source — page count on a rendered PDF, loudness against EBU R 128, a ledger that balances, a photograph carrying a place and a time, a sign-off by a professional wherever a statute demands one — and one sentence in my rewrite: each artifact type gets a verifier. The requirement had become a pointer to work nobody had specified.

Requirement 18 lost the only way to repair a duplicate identity: a two-person decision that carries the keys, the scopes and the history along and can be reversed. Requirement 25 lost the sentence that an agent never holds bank credentials, which is the greater part of what the requirement is for.

I restored the controls and removed the cap. What survives of the claim is narrower than what I wrote first: every control in the source that the reviewers and I could find survives the rewrite, and the examples do not.

That failure is the useful part. A coverage matrix shows that the dictionary can express each idea. A two-writer diff shows that two agents express it differently. Neither shows that a control disappeared, because a writer who drops a mechanism produces a tidier sentence, and tidier reads as better. A diff cannot show a control that both writers dropped either. Only a comparison against the source, made for no purpose except finding absences, finds a shared omission.

## What this is not

It is not a schema. The dictionary says what a record is called. The previous post's requirements still say which fields it carries, who may write it and when it expires.

It is not a data model. Nothing here decides how a record is stored, whether the repository uses one file per task, or how the blob store encrypts a payload.

It is not a grammar. The dictionary says which words are allowed and says nothing about how to build a sentence. The three writing rules above belong to the method, and the dictionary carries none of them.

It is not an argument that a specification should read like this. The rewrites are for checking, not for reading. Nobody wants fifty requirements where every third word is in capitals.

## The fifty requirements, rewritten

Each requirement keeps its title from the previous post and each of its controls. The gloss says what it is about, for anyone who has not read the other post. The statements use the dictionary as their working vocabulary.

### Part 1: the ledger, goals and the board

#### 1. A task graph with a state machine
*The company keeps tasks in a dependency graph and works only on the ready ones.*

1. Every TASK CITEs the TASKs that must finish before it starts, and these citations form a dependency graph.
2. Each TASK carries a LABEL, acceptance criteria, one owner PARTY and a «lock» against a second RUN.
3. The LABEL holds one of seven values: open, in plan, blocked, done, future, human, archived.
4. A PARTY changes the LABEL only when the dependencies are done and each gate passes.
5. The «frontier» holds the open TASKs whose dependencies are done; the «loop» takes its work from there.
6. A CHECK of the graph runs on every COMMIT.
7. A TASK id is a HASH of its specification, so RUNs in parallel worktrees APPEND TASKs with no collision.
8. Each TASK CITEs the goal it serves.
9. §14(4) Nr. 4 UStG requires a sequential invoice number unique to the issuer.
10. A serial RULE gives each invoice a number; one PARTY alone APPENDs them behind a «fence».
11. That PARTY records each gap and its reason and holds the next unused number; a TASK id is never an invoice number.

#### 2. Goals, priorities and value against cost
*Goals sit above tasks, and the loop picks ready tasks by value for cost.*

1. An agent PROPOSEs a goal; only the board adopts it, with an objective, a measurable outcome, a DEADLINE, a budget and one owner PARTY.
2. A TASK CITEs its goal through its ancestry, and a TASK with no goal stays out of the «frontier».
3. A TASK estimates value and cost: money, tokens, human hours and a risk tier for each EFFECT.
4. The «loop» picks from the «frontier» by value against cost, inside the goal's budget, and APPENDs why.
5. When no PARTY can estimate the value the TASK goes to the board as a question; a later CHECK compares each estimate with the outcome.
6. Value against cost picks TASKs, never people.
7. A committed RULE for who the company serves, from the board or statute, sets the order for every TASK that admits, refuses, serves or waits.
8. The predicted outcome of that person never enters the estimate.
9. One named human PARTY makes an adverse DECISION and writes the reasons and the way to appeal.
10. An estimate CHECK that fails repeatedly opens an incident, so a «loop» that overrates its own work becomes visible.
11. A goal closes with a short CHECK when its outcome is met, missed or no longer wanted.
12. At that close, the PARTY archives or moves the open TASKs of the goal.
13. Without that close the «frontier» fills with work that no PARTY wants.

#### 3. Board decision rights
*A written policy names who may decide what and how far a deputy may go.*

1. A policy APPENDed as a COMMIT names each DECISION class, its PARTYs or KEYs and its «quorum», and every gate CHECKs it like a RULE.
2. The policy lists the DECISION classes: goals and budgets, policy and RULE changes, EFFECTs by risk tier, hires and contracts, history repair and STOP.
3. The «quorum» of a class is one PARTY, two PARTYs or a majority of the board.
4. The board gives a GRANT for a class with a scope, a limit and a DEADLINE; a DECISION REVOKEs it, or it EXPIREs.
5. Every board member alone holds the GRANT to STOP; every other class needs its normal «quorum», also in a hurry.
6. A board member tightens autonomy with one message that becomes a signed GRANT change; loosening it needs the «quorum».
7. An absence mode names a deputy PARTY and a reduced set of classes for one span.
8. An offline GRANT bounds a site lead's DECISION by scope, place, AMOUNT and span.
9. The PARTY APPENDs that DECISION afterwards; a DECISION outside the GRANT opens an incident.
10. An outside PARTY sets a RULE that binds the board and CITEs its source document.
11. No GRANT to an agent covers an EFFECT at risk=top, a new payee or a new kind of statement, whatever a board member SIGNs.
12. The PARTY that PROPOSEs an EFFECT is never its only DECIDER.

#### 4. Human attention as a scarce THING
*People can only read so much, so the company caps and batches what reaches them.*

1. A policy in a COMMIT limits open board DECISIONs and new requests per day, per person; a TASK beyond it waits in the «frontier».
2. One VIEW a day replaces the stream of requests, grouped by class.
3. The VIEW shows an empty-day line, so silence and a broken system look different.
4. An agent cannot raise the urgency of its own request; urgency comes from DEADLINEs and the risk tier.
5. A metric records the span and the rate per class; a class too fast or always DECIDEd opens a CHECK of a sample.
6. A class that is always DECIDEd also gets a READ of whether its gate should exist.
7. A short list of urgent classes, APPENDed as a COMMIT, bypasses the limit, the VIEW and the «frontier».
8. Each urgent class names its trigger RULEs, the human PARTY on call, the second ADDRESS and the DEADLINE in minutes.
9. The trigger RULEs are deterministic and over-inclusive.
10. An agent neither moves a case out of an urgent class nor answers it; it hands over the OBSERVATION and APPENDs nothing.
11. A STOP of the «loop» does not STOP this lane; an outside «monitor» PARTY carries it.
12. The request shows the DECISION in plain words and a «fingerprint», and it EXPIREs.
13. A new payee, a changed ACCOUNT or an AMOUNT above a limit needs a second confirmation on another ADDRESS.
14. The second confirmation uses a number from a FACT, never one taken from the request.
15. The board may close a DECISION with «not now», «ask me Monday» or «decide yourself within these limits», each with a defined effect.

#### 5. Gates at every point where a mistake can enter
*Every rule has a mechanism that stops a mistake at the point it can enter.*

1. A RULE counts only when a named mechanism enforces it; each RULE carries an id, a rationale and that mechanism.
2. The RULEs cover format, schema, graph structure, risk, content and law.
3. A gate that finishes in seconds runs «pre-commit»; a slow gate runs «pre-push» and CI.
4. A gate on an EFFECT runs «pre-effect», a «monitor» CHECKs velocity limits and budgets at runtime, and a periodic CHECK looks for drift.
5. A client-side hook gives no security, because an agent can pass `--no-verify`; the server runs «pre-receive», required CHECKs and protected branches.
6. Formatting has one entry point, treefmt, with sorted keys, normalised YAML and JSON and LF line endings.
7. An agent never weakens its gates; an edit of the payment policy is a DECISION at risk=top with code owners and a required human SIGN.
8. One definition of the gate set serves commit, push and CI.
9. A gate whose tool is missing fails, and that fail refuses the APPEND.

#### 6. Signed commits, linear history, board-only force-push
*Every commit is signed, history stays linear and only the board may rewrite it.*

1. Every COMMIT carries a SIGN from a named PARTY with its own KEY, and the KEY registry gives its role at the parent COMMIT.
2. The STORE refuses an unsigned COMMIT or an unknown KEY; a «pre-receive» hook refuses a path outside the KEY's scope.
3. An agent KEY stays non-extractable in a keystore or hardware token that the harness controls.
4. A PARTY mints an agent KEY per RUN, REVOKEs it at the end and scopes it to one TASK, one role and its paths.
5. A «pre-receive» hook refuses a CHECK signed by the KEY that signed the TASK under CHECK.
6. The «trust root» is the gate definitions, CI configuration, the Nix flake and its lock, the KEY registry and the DECISION-rights policy.
7. No agent KEY changes a trust-root path; such a change needs a human SIGN and an independent rebuild of the gates.
8. History is linear: a branch lands by fast-forward, with no merge COMMIT and no «squash»; each COMMIT passes the gates alone.
9. A «rebase» rewrites each moved COMMIT, removes its SIGN and changes its HASH; the «merge queue» re-SIGNs and the gates rerun.
10. The originals stay under a «ref», and the queue re-issues the attestation for the landed tree; a changed tree invalidates the EVIDENCE.
11. Only the board, under its DECISION rights, may rewrite a protected branch as a DECISION at risk=top, and a second STORE keeps the earlier history.
12. That DECISION names what was removed, why and who DECIDEd.
13. Axiom 1 applies; §146(4) AO forbids a POSTING change that hides the original entry.

#### 7. Trusted time
*Record time must come from outside, because an agent can set its own clock.*

1. The date of a COMMIT is whatever the committer's clock says, and an agent controls its clock.
2. A record whose time carries legal or financial weight gets an external ANCHOR.
3. The ANCHOR is an RFC 3161 timestamp over the HASH of the record or the receipt time of an outside PARTY.
4. The PARTY APPENDs the ANCHOR next to the record.
5. A gate refuses a record whose ANCHOR is absent, unknown or out of order.
6. The scheduler and every DEADLINE CHECK READ a synchronised source.
7. A gate refuses every EFFECT from a PARTY whose clock drifts beyond a tolerance.


#### 8. An evidence ledger per task

*A task counts as done only when an independent party records proof for each criterion.*

1. Every TASK cites EVIDENCE for each acceptance criterion.
2. The ledger holds command output, build logs, photos, an OBSERVATION of a signed acceptance, or «receipts».
3. A claim counts only when a command or an «artifact» stands behind it.
4. The harness runs the command that the TASK names, in a clean worktree at the COMMIT under test.
5. The harness SIGNs the outcome record with a KEY that no agent PARTY holds; Axiom 9 applies.
6. The outcome record holds the command, its exit code and the HASH of its output.
7. An attestation ties that record to the tree that the RUN used.
8. A gate refuses the APPEND when the attestation does not describe the tree being APPENDed.

#### 9. Test suites, verifiers and change logs

*Tiers, independent checkers and plain change logs keep work that is not code checkable.*

1. Test levels run by cost: fast before APPEND, full in CI, mutation on changed lines, nightly on core, deep before release.
2. Each test level holds twice its worst measured RUN as a budget.
3. Each «artifact type» gets a verifier that CHECKs it; a deterministic CHECK runs first, and a «rubric» judge never gates a high-risk EFFECT alone.
4. A document gets a spelling, link and style CHECK, and a page-count and font CHECK on the rendered «PDF».
5. A video gets a duration CHECK and a loudness CHECK against EBU R 128.
6. A ledger gets an AMOUNT CHECK by `bean-check` or `hledger check`.
7. A renovation step gets a photo with location and ANCHOR, and a sign-off from a qualified PARTY where a statute RULE asks for one.
8. A science-slam rehearsal gets a timed recording under the limit.
9. The verifier is another agent PARTY, with another «prompt» and no write GRANT.
10. «Eval cases», «rubrics» and known-bad cases sit READ-only with a «held-out» share, and a RUN assigns verifiers at random, never to each other.
11. A scheduled RUN seeds known-bad work, and a verifier that passes it loses its GRANT until a human READs it.
12. A blocked TASK cites an OBSERVATION or reopens at its DEADLINE; repeated reopening or regenerated EVIDENCE flags a human.
13. Mutation testing and known-bad cases prove a CHECK can fail.
14. Every fixed bug APPENDs a regression CHECK that failed before the fix.
15. A COMMIT follows Conventional Commits so a tool can parse it.
16. A RUN APPENDs the change log entries in the Keep a Changelog format from COMMITs and DECISION records; a human SUPERSEDEs or APPENDs a correction.
17. Outside software the log is the client record; a PROCEDURE or RULE change gets a dated entry and a version bump.

#### 10. Atomic transitions with rollback

*A change lands in one commit or not at all, and a landed trace is corrected forward.*

1. One APPEND puts a «transition» into the repository whole, or not at all.
2. The LABEL flip, the EVIDENCE, the roadmap VIEW and the gate CHECK land in one COMMIT, or the STORE reverts.
3. Every command that changes the STORE CHECKs the gates and rolls back on failure.
4. Each agent RUN works in its own worktree or container; only a change that passes reaches main.
5. An APPEND that touches the books, makes an EFFECT or records a human DECISION leaves a trace the law needs.
6. A later failure keeps the RUN as a COMMIT with its terminal LABEL.
7. The correction is a forward record: a REVERSEd POSTING, a REVERSEd EFFECT or a REVERSEd DECISION.
8. A REVERSEd EFFECT for a takedown chases every copy, and the publication record stays with its version and its recipients.

#### 11. Diffs people can read

*A diff must read as plain text, in stable order, with one idea per line.*

1. A human READs the diff between the base and the head COMMIT and DECIDEs on both HASHes.
2. The VIEW makes sense without a tool: plain text, stable order, one concept per line.
3. A LABEL flip is a one-line change.
4. A generated VIEW is deterministic and never churns.

#### 12. Dependencies managed by Nix alone

*One pinned flake supplies every tool an agent can call; nothing else installs anything.*

1. Every tool an agent PARTY can call comes from one pinned flake, including the harness and the MCP servers.
2. Nix READs each language lockfile as a fixed-output derivation.
3. Nix READs `pnpm-lock.yaml` through nixpkgs, `Cargo.lock` through crane and `uv.lock` through uv2nix.
4. A new dependency is a VIEW of `flake.nix` and `flake.lock` that a human DECIDEs.
5. A worker runs no global `npm install`, no `pip install`, no `curl | sh` and no `apt-get`.
6. A build runs in the Nix sandbox with no network access except a fixed-output fetch with a pinned HASH.
7. A gate refuses a worker's connection to a package registry; the binary STORE and the model provider pass an egress proxy.
8. CI runs each command through `nix develop -c` or `nix flake check`.
9. `nix flake update` APPENDs its own COMMIT with its gate CHECKs.
10. A stateless agent PARTY needs the same tools on every machine, and a deterministic THING needs a pinned toolchain.
11. A dependency becomes a reviewed change, not a «side effect» of an agent's improvisation.
12. Each lockfile change costs one HASH update, and the binary STORE becomes infrastructure.
13. A proprietary desktop tool sits behind an «adapter» and its exports enter as OBSERVATIONs; a model behind an API is recorded per RUN.
14. Nix runs on Linux and macOS, and Windows needs WSL2.
15. Portability now means movement between STOREs, CI and harnesses.

#### 13. Single-file HTML dashboards for humans

*One generated HTML file shows the company state, the same page for every reader of a commit.*

1. A human PARTY reads the state of the company without reading the repository.
2. The interface is one generated VIEW: an HTML file with inline styles, script and data, no network request, opened from disk or a CI RUN.
3. The VIEW is a pure function of one COMMIT and carries its HASH and ANCHOR.
4. The VIEW gives READ only; a DECISION comes as a signed COMMIT or through the DECISION «channel».
5. The VIEW inserts stored text as text, because some of it comes from inbound email.
6. A RULE omits from the VIEW the records an audience may not READ.
7. The board VIEW answers, in order, what waits, what ran and failed, and what was spent against the budget.
8. The VIEW shows how long each DECISION has waited.
9. It then shows the «frontier», EVIDENCE «coverage», pending DECISIONs and the STOP state of the STORE, with an inline SVG task graph.
10. The VIEW carries a one-line summary on top.
11. The same VIEW goes out as the daily VIEW on the board's ADDRESS, so a page nobody opens still arrives.
12. Failure lines come from exit codes, failed gate CHECKs and missed «heartbeats», never from a RUN's own account.
13. Each section states its coverage.


### Part 2: what the agent carries

#### 14. The CEO loop that stops itself
*one unattended procedure repeats task work and halts itself on each named stop condition.*

1. An agent PARTY RUNs one PROCEDURE that advances the «frontier» one TASK at a time: give, wait, CHECK, APPEND, repeat.
2. The PROCEDURE READs its limits from a COMMIT and STOPs the RUN with a distinct «exit code» per condition.
3. Stop: the «frontier» is empty and every gate before the deploy EFFECT passed, or the allowed RUNs are used up.
4. Stop: the «frontier» did not change across too many RUNs, or one RUN outlived its «watchdog» DEADLINE.
5. Stop: a step failed again after its «retries», or a gate CHECK failed, or the next RUN would exceed the monthly money budget.
6. A «timer» starts the PROCEDURE, and a «lock» keeps a second «driver» PARTY out of the STORE.
7. The «driver» EXECUTEs only the step it is given and APPENDs nothing beyond it.
8. The «driver» does not plan and does not edit the STORE, so it cannot claim progress it did not make.
9. A stopped PROCEDURE looks like a quiet day, so a PARTY outside it holds a «dead-man's switch» DEADLINE on another «host».
10. That DEADLINE, under other KEYs, waits for a signed «heartbeat» from every RUN and an "all clear" for every VIEW.
11. When either is late it APPENDs a TASK for the board on a second ADDRESS, and depends on no code STORE, «model provider» or machine.

#### 15. Sub-agent delegation and management
*a parent run keeps scope, order and the final check and gives bounded tasks to children.*

1. The parent RUN keeps the «frontier» slice, the order and the final gate.
2. The parent gives every bounded sub-TASK to a child PARTY; children may give TASKs to their children; a leaf never becomes a second CEO PROCEDURE.
3. The parent keeps the slice, a write to a shared file, a weakened CHECK, the final CHECK, APPEND and «push», and human-only questions.
4. The packet names the goal, inputs, file ownership with one writer per file, the EVIDENCE step and a stop RULE.
5. The packet limits time, spend, tests and external access.
6. The child returns its changes, steps with output, what it could not CHECK and unrelated breakage; the parent re-runs the EVIDENCE step.
7. A register holds each child's TASK, budget, «heartbeat» and worktree, and a committed COMMIT caps depth and fan-out.
8. The same orchestration COMMIT holds the «watchdog» thresholds, the restart budget and the merge gate.
9. The «harness» takes a child's budget from its parent's and its GRANT is a subset.
10. Each child RUNs in its own worktree or «container» under a KEY the «harness» mints from its owned paths (requirement 6).
11. The «harness» never copies the parent's KEY; the child KEY is scoped to the paths that child owns.
12. The agent RUNs inside the process the «watchdog» signals, a signal it ignores ESCALATEs to a «hard kill»; an orphaned child is a bug class.
13. Delegation buys context isolation and parallelism, costs coordination, and the packet is written down because every handoff loses context.

#### 16. Context management
*each task gets a packet built from committed state, limited by budgets and closed by scope.*

1. A model's working memory is small, costly and uneven, and accuracy drops when the needed passage sits mid-input.
2. The «harness» DERIVEs each TASK's packet from committed records, never from «chat», and a fresh RUN with only the last COMMIT and TASK hash resumes.
3. The packet is a VIEW, and the RUN APPENDs a manifest that CITEs the HASH of every record it loaded.
4. The packet holds the goal with ancestry, acceptance criteria, spec, RULEs, PROCEDURE, a «skills» VIEW, FACTs with CITEs, «episode» VIEWs, remaining budget and next action.
5. Each part has a token budget, stable parts come first for prefix reuse, and the goal and limits repeat at the end.
6. A «skill» or document loads by «progressive disclosure», and large output goes to a file with path, summary and «exit code».
7. Untrusted content carries the LABEL quoted, never instruction; near its limit a RUN APPENDs its state and starts fresh.
8. Every record, file payload and KEY carries the LABEL of the PARTY or project it belongs to.
9. A packet draws only from its TASK's LABELs, and retrieval CHECKs the LABEL before «similarity», at query time.
10. A summary or consolidated FACT inherits the strictest LABEL, a human PARTY strips client parts, and the manifest names the LABELs READ.
11. Because payloads are encrypted and metadata is not, a human PARTY's GRANT names one LABEL value and path set with a DEADLINE.
12. A gate in the STORE enforces that GRANT through separate STOREs or filtered VIEWs, never by convention.
13. An outbound EFFECT fails a gate when it CITEs a foreign LABEL or falls below the minimum group size.
14. When the data-use COMMITMENT ends, the company REVOKEs the GRANT and APPENDs the OBSERVATION of the partner's signed destruction statement.
15. A child PARTY gets its own packet, and a parent sees result records, never the raw payloads.

#### 17. Episodic memory
*each run leaves a record of what it did, why, at what cost and with what result.*

1. «Episodic memory» holds what happened; the working, «episodic», semantic and procedural split maps onto files, the context window being the working kind.
2. The history of COMMITs shows what changed and leaves out the reasoning, so each RUN APPENDs an «episode»: the outcome record of that RUN.
3. The «episode» CITEs the TASK, the goal, the PROCEDURE and «skill» versions used, the input HASHes and the context manifest.
4. It CITEs the steps EXECUTEd, the PROPOSEd EFFECTs with their receipts, the outcome, the verifier CHECKs and the cost.
5. It holds the human corrections and the «friction».
6. A large raw «transcript» may hold personal data; it goes to a STORE under LABEL redacted; the repository holds a summary VIEW and the HASH.
7. A DERIVEd VIEW answers a query by TASK, THING, ANCHOR or «similarity».
8. An «episode» is a record of the past and never an instruction, and one that quotes an inbound email carries that email's taint.
9. A failed RUN is as valuable as a successful one.
10. A periodic consolidation RUN READs recent «episodes» and PROPOSEs new FACTs, PROCEDURE and «skill» amendments, and new CHECKs for a DECISION.
11. A mandatory «retro» after every PROCEDURE RUN ends with a PROPOSEd improvement or an explicit no-change record.

#### 18. Semantic memory
*the company keeps typed, sourced facts that are checked, superseded and never silently overwritten.*

1. «Semantic memory» holds the FACTs: PARTYs and lead times, prices, client FACTs, RULEs in force and its own policy.
2. Each FACT CITEs its source «episode» or OBSERVATION and holds a confidence AMOUNT, the ANCHOR of its last CHECK, a validity span and owner PARTY.
3. Every write is PROPOSEd, then READ and DECIDEd by a verifier PARTY, because one wrong FACT poisons every RUN that READs it.
4. A newer FACT SUPERSEDEs an older one and the history stays; a contradiction opens a «conflict» TASK for a human PARTY.
5. Axiom 1 applies.
6. Personal data puts the payload in the encrypted STORE and the HASH in the repository, and every FACT carries the data-protection LABELs of requirement 35.
7. A FACT from an authority PARTY (minimum wage, VAT rate, «OSS threshold») sits in another STORE with its legal source, effect ANCHOR and last CHECK.
8. Only the source document and a human DECISION change such a FACT, never an agent PARTY, an email or a guess.
9. An OBSERVATION from a supplier opens a TASK that sets LABEL tentative on the FACT but can never authorise a payment, needing a second-ADDRESS CHECK.
10. People live in a register with one THING record per subject, a «score» per match; LABEL blocked refuses every person EFFECT on an ambiguous match.
11. A merge or split is a DECISION that two PARTYs SIGN and that carries KEYs, GRANTs and history; a later DECISION REVERSEs it.

#### 19. A skill library
*the company versions reusable capability bundles with permissions, tests, an owner and a retirement date.*

1. A «skill» is a packaged capability that an agent PARTY loads when a TASK needs it.
2. The «Agent Skills» format is a `SKILL.md` with a name and a description in its «frontmatter».
3. A «skill» covers one kind of step; a PROCEDURE is a business sequence with steps, owner PARTYs, LABEL risk and CHECKs, and CITEs its «skills».
4. A RULE applies to both.
5. The repository versions each «skill»; each RUN names the version loaded; a PARTY finds it by name and description and loads the body on demand.
6. A PROPOSEd «skill» names a GRANT that lists the THINGs («tools») and «adapters» it may use.
7. A new version needs CHECKs with saved inputs and expected outputs before a PARTY DECIDEs it, and an earlier version stays restorable.
8. Each «skill» names an owner PARTY and carries a usage metric, and a non-use DEADLINE appends a TASK that archives it.
9. A third-party «skill» is PROPOSEd, CHECKed by a verifier PARTY and pinned by HASH.
10. A «skill» packages a «prompt» with a README, can carry an «injection», and one mined from a good improvised RUN lands as a PROPOSEd record.

#### 20. Prompts: personas, no persona, or SOPs
*a persona line adds little, so the work comes from procedures, skills, rules and grants.*

1. A test of 162 roles on 2,410 factual questions found no gain from a «persona» in the «system prompt», and covers no long agentic TASK.
2. No «persona» works for generic sub-TASKs and knows no house convention, and a «persona» line changes only tone and vocabulary.
3. A PROCEDURE, a «skill» and a RULE carry what the model lacks (checklist, tool conventions, acceptance criteria), and that moves outcomes.
4. A role is GRANTs, LABELs and PROCEDUREs: its THINGs, budget, verifier PARTY and output RULE.
5. A verifier role looks for failures and holds no GRANT to write the record it CHECKs.
6. An «org chart» of roles, with a responsibility and a GRANT per role, lets human and agent PARTYs share one structure.
7. A «persona» keeps one job: «voice» in an outbound EFFECT where brand tone is a requirement.
8. A «prompt» is a record, and each RUN CITEs the HASH of the «prompt» it used.
9. A changed «prompt» runs the saved CHECKs against the current version and is APPENDed only if the «evals» improve.
10. A RUN gets no «persona» unless an «eval» proves one pays; TASK, PROCEDURE and «skills» carry the work.

#### 21. Metacognition: confidence, budgets and the next action
*an agent states its certainty from checks, spends a fixed budget and commits its next step.*

1. An agent PARTY must know its certainty, its remaining budget and its next action.
2. A «verbalised» confidence is overconfident, so self-reported confidence can never lower a LABEL risk by itself.
3. Confidence comes from CHECKs passed, EVIDENCE coverage, agreement of independent samples or PARTYs, and FACT freshness.
4. Each «episode» holds the predicted confidence next to the CHECKed outcome.
5. Calibration is measured per agent PARTY and TASK type over time, and low confidence routes to a CHECK or a human PARTY.
6. A budget covers the UNITs token, second, euro, «retry» and human hour, and a RULE sets it before work starts.
7. The «harness» carves the budget down to children and enforces it, because the model cannot be trusted to STOP itself.
8. Each TASK has a RUN-count budget; an exhausted «rework» budget ESCALATEs to a human TASK, and an unreadable «meter» gets a bounded conservative estimate.
9. An exhausted budget ends in a written diagnosis record, never a silent stop.
10. Every step commits a next action from a fixed set: continue, CHECK, delegate, ask a human, ESCALATE, STOP with diagnosis.
11. A «stall» CHECK compares state LABELs across RUNs and STOPs repetition, and "I could not CHECK X" is a required LABEL on the outcome record.
12. Every report, including a child PARTY's return, carries its confidence as a required LABEL.


### Part 3: the edges of the company

#### 22. Communication in and out

*Messages from outside arrive as untrusted OBSERVATIONs, are routed by DECISION, and are CHECKed before they leave as EFFECTs.*

1. A quote, a DECISION and a call are OBSERVATIONs in one register.
2. One PARTY across three ADDRESSes needs one PARTY register with LABEL personal.
3. Routing is a separate DECISION that SUPERSEDEs without rewriting history.
4. A stateful live call APPENDs recording, transcript and COMMITMENTs after the call.
5. One envelope per ADDRESS names ADDRESS, direction, ANCHOR, PARTY, «thread id», payload and attachment HASHes, DKIM and SPF CHECKs and LABEL class.
6. Axiom 1 applies: no PARTY edits the raw `.eml`, chat export or audio.
7. A transcript, summary and classification are VIEWs that CITE the raw HASH and the tool or model version.
8. An agent PARTY that READs an inbound OBSERVATION holds a GRANT with a narrow scope.
9. An EFFECT whose DECISION CITEs an untrusted OBSERVATION moves up one LABEL risk.
10. A sandbox parses each attachment with no ADDRESS and no KEY, because a PDF or office file attacks the parser.
11. An identity claim is an OBSERVATION, so the company calls the recorded ADDRESS and APPENDs the OBSERVATION before a payment.
12. A gate refuses an EFFECT holding a LABEL class its ADDRESS may not carry.
13. Each «context packet» passes the same CHECK with LABEL pseudonym.
14. Spam is an OBSERVATION whose record keeps its classifier PROCEDURE version forever.
15. A 30-day DEADLINE appends a TASK that DELETEs the spam payload.
16. An executable attachment goes to «quarantine» and never lands in a «working tree».
17. Spam classification is a PROCEDURE whose loop lets a human PARTY mark a false positive and REVERSEs the RULE.
18. §201 StGB needs an OBSERVATION of consent to record a non-public conversation.
19. Art. 50 AI Act requires an AI caller to disclose that it is an AI.
20. §7 UWG needs prior express consent for email advertising, with a narrow exception for an existing customer.
21. The §7 UWG consent RULE draws no line between a consumer and a business.

#### 23. A sandbox for effects

*A sandbox twin of every write adapter lets each EFFECT run once before it runs for real.*

1. A verifier PARTY CHECKs an artifact; the EFFECT pipeline needs its own test ground so a payment PROCEDURE does not RUN live first.
2. Every write adapter has a sandbox twin STORE.
3. The twin is a mail server that captures outbound mail, or a bank sandbox or a test ACCOUNT with play money.
4. The twin is also a test phone number, or a recorded supplier portal replayed by Playwright.
5. Each RUN declares LABEL mode, part of the RUN record and of the payload HASH.
6. A DECISION in sandbox mode never authorises a live EFFECT.
7. A new or amended PROCEDURE, adapter or prompt version RUNs in the sandbox against fixtures DERIVEd from past cases.
8. The company replaces every personal identifier with LABEL pseudonym before the APPEND, because a fixture in git is permanent.
9. The PROCEDURE goes live only with EVIDENCE for every criterion and a human DECISION to promote it.
10. A «dry run» in live mode computes the EFFECT and its LABEL risk, then STOPs before the executor PARTY.
11. A sandbox RUN and a live RUN share no KEY or STORE, and the executor PARTY refuses a sandbox payload.

#### 24. Deterministic assets

*An output THING is a recipe, a pinned toolchain and input HASHes that give one output HASH.*

1. A video, document, graphic and audio file must be reproducible or at least traceable.
2. An output THING is a recipe, a pinned toolchain and input HASHes, and the output THING carries its HASH, as a Nix derivation does.
3. The recipe is text where possible: OpenTimelineIO, ffmpeg filter graphs or Blender Python, Typst or LaTeX, SVG, and TTS with a pinned voice.
4. The company removes embedded timestamps, encoder thread counts, GPU float behaviour and missing fonts.
5. A generative model call is not bit-reproducible, because the API model changes and a seed does not guarantee output.
6. The company OBSERVEs each generation with the prompt, model, parameters and output HASH, and everything downstream is deterministic.
7. The chain of records stays complete even where a PARTY cannot rebuild one link.
8. A large output APPENDs the recipe and output HASH only, and the binary goes to a STORE.
9. An export from Figma or Photoshop enters as an input artifact.
10. A human PARTY READs a VIEW that shows a visual diff.
11. AI-generated media carries C2PA content credentials, because the AI Act asks the company to mark synthetic content.

#### 25. Risk, money and approvals

*The company scores each planned EFFECT, and a separate executor PARTY EXECUTEs only a payload that a PARTY DECIDEd.*

1. One LABEL risk per action type is too coarse.
2. The company scores each proposed EFFECT on reversibility, summed AMOUNT, external visibility, legal binding, counterparty novelty and data exposure.
3. The company sums POSTING AMOUNTs over a span, so ten payments of 99 € count as 990 €.
4. An agent PARTY PROPOSEs and a separate executor PARTY EXECUTEs only an EFFECT whose payload HASH holds a DECISION.
5. The agent PARTY never holds a bank KEY.
6. The DECISION binds to that payload; its git-native form is a SIGNed COMMIT that CITEs the EFFECT HASH, CHECKed against allowed KEYs.
7. A top LABEL risk needs a hardware KEY; a lower one may use SSH or GPG.
8. The approver PARTY READs a VIEW that compares the payload, and a new payee or changed bank ADDRESS needs a second out-of-band DECISION.
9. The escalation ladder runs from automatic through logged, one human DECISION and two-PARTY DECISION to a DECISION with a cooling-off DEADLINE.
10. Defence in depth sits outside the code as a bank-side budget, a capped vendor card and an allowlist; PSD2 authentication adds a human PARTY.
11. The stateless system must not pay twice: the outbox pattern APPENDs intent, EXECUTEs, APPENDs the receipt, and a resumed RUN CHECKs it first.
12. The outbox intent carries an id, so a retry deduplicates against it.
13. A reversible EFFECT carries a planned REVERSE, and bookkeeping is plain-text accounting with beancount or hledger.
14. §147 AO sets the retention period, and §146(4) AO forbids altering a booking so the original content is no longer identifiable.
15. The no-alteration rule conflicts with GDPR erasure, so each LABEL class carries a retention DEADLINE.

#### 26. Legal bases and consent records

*Which basis a processing rests on, what consent does and does not cover and the register that records both.*

1. Every processing of personal data needs a «legal basis»; consent is one of several.
2. GDPR Art. 6 rests most processing on a contract, a statute RULE or a legitimate interest, and Art. 9(2)(h) covers treatment notes.
3. The company weighs a legitimate interest and writes the weighing down.
4. Consent as the only «legal basis» errs both ways: it asks a patient to consent to records the law requires and suggests a withdrawal.
5. Each processing activity in the register of requirement 35 names its «legal basis».
6. Where that «legal basis» is consent, the company proves it held consent when it acted.
7. Consent is an OBSERVATION naming the PARTY, purpose LABEL, ADDRESS, wording, ANCHOR and EVIDENCE, such as double opt-in.
8. A withdrawal is an OBSERVATION too, and it takes effect immediately.
9. A later withdrawal OBSERVATION SUPERSEDEs the earlier consent.
10. Every proposal for an EFFECT CITEs its «legal basis»; no basis, no EFFECT.
11. A pre-EFFECT gate CHECKs purpose LABEL, date and absence of a later withdrawal.
12. The «warehouse rule» puts the person's identity in an encrypted STORE, and git holds the HASH and purpose LABEL.

#### 27. SOPs and the feedback loop

*A PROCEDURE is a versioned sequence that each RUN CITEs, and each human correction returns as an amendment.*

1. A PROCEDURE holds a trigger, inputs, steps, «skills» and «adapters» per step, a LABEL risk, CHECKs, outputs and one owner PARTY.
2. A step declares its dependencies, and a trigger is a schedule or an OBSERVATION such as a closed TASK.
3. Each step has its own retry, rework budget and ESCALATE rule, and each RUN CITEs the PROCEDURE version used.
4. A «pre-effect» hook attaches to one EFFECT type and covers every PROCEDURE that produces it.
5. Discovery is a register matched by trigger or intent; without a match the agent PARTY improvises, records the trace and PROPOSEs a draft.
6. A human PARTY DECIDEs the draft before the company promotes it.
7. Feedback comes from a human edit, a failed CHECK, an incident and a metric such as reply rate or rework rate.
8. A VIEW that compares the draft with the version a human sent is the most valuable signal.
9. Each signal becomes a «friction entry» and then an amendment «pull request», CHECKed by replaying past cases as fixtures.
10. A recorded deviation feeds the same loop, and the company retires a PROCEDURE that no RUN uses.

#### 28. Secrets

*A broker PARTY injects each KEY into an approved EFFECT, so no agent PARTY ever sees a secret value.*

1. An agent PARTY never READs a secret value; a broker PARTY injects the KEY into an approved EFFECT.
2. Git holds a reference such as `secret://bank/main`, and the value lives in a STORE of sops age KEYs or a hosted STORE.
3. A static KEY and a password are straightforward.
4. An OAuth refresh token rotates, so it is state and the broker PARTY owns it.
5. A TOTP seed beside a password turns two factors into one, which is a DECISION per ACCOUNT.
6. A hardware KEY needs a human tap, which makes a human gate; an SMS code needs a company-controlled number and carries SIM-swap risk.
7. A recovery code stays offline and human-only.
8. A KEY is scoped and short-lived per PROCEDURE or TASK, and each agent PARTY has its own identity.
9. A VIEW of the EFFECT records shows which PARTY used which KEY, and for what purpose.
10. The company keeps rotation, REVOKE, a break-glass PROCEDURE, a human recovery path and leak scanning with gitleaks.
11. A screenshot or a VIEW of the «episode» can hold a password or card number, so the company makes it «redacted».
12. Each service KEY and ADDRESS belongs to the organisation PARTY, and a human holds the recovery path.

#### 29. External services: APIs, MCP and browsers

*The company reaches an outside STORE by one adapter, and every write ends with a read-back receipt.*

1. The company prefers an official API, then an MCP server, a CLI, a scripted Playwright browser, an LLM-driven browser, then a human PARTY.
2. An adapter contract names capabilities, separate READ and write operations with a LABEL risk each, auth, rate limit, idempotency and EVIDENCE.
3. A PARTY uses a READ adapter freely under a READ GRANT; every write adapter goes through the EFFECT pipeline.
4. The flake pins each MCP server, third-party code with a company KEY.
5. A PARTY CHECKs each MCP server and runs it sandboxed, and sets each tool action to allowed, ask first or off.
6. An LLM-driven browser finds a path once, a PARTY distils it into a Playwright script, and that script joins the PROCEDURE.
7. The RUN stays deterministic until the site changes.
8. Terms of service and bot detection apply, the company bypasses no CAPTCHA, and a trace or screenshot serves as EVIDENCE.
9. Truth has owners: the bank STORE owns the ACCOUNT, git owns intent, DECISIONs and EVIDENCE, each field names its owner, and the owner wins.
10. Outside state enters git as an OBSERVATION with an ANCHOR, because an API answering 200 only accepted a request.
11. Every write to an outside STORE of record ends with a read-back receipt naming the external id, its version and a HASH of the response.
12. A scheduled reconciliation CHECKs git's intent against each STORE and opens a TASK per divergence, and an outside EFFECT's criterion names the read-back.

#### 30. Human collaborators

*Human PARTYs act with different trust, and an outside PARTY with a right in a case holds standing.*

1. Human work needs a governor PARTY who DECIDEs and SIGNs, and a worker PARTY who does a TASK in person.
2. An outside client or supplier is a correspondent PARTY: what it sends is an OBSERVATION and it never DECIDEs a company EFFECT.
3. An outside PARTY with a right holds «standing»: a role, a DEADLINE and a submission record, matched by PARTY and closed only with a disposition.
4. A grievance or whistleblower channel accepts an anonymous OBSERVATION hidden from every PARTY connected to it.
5. An authority's «case» records every statement with its exact text, and the company CHECKs a new statement against all earlier ones.
6. A broad goal goes to discovery before any milestone exists, and a TASK reaches a person by WhatsApp, SMS or a mobile page.
7. Intake turns a request into a TASK, and the original message stays an OBSERVATION.
8. Intake matches a request to an existing PROCEDURE or creates one, classified by domain, never by similarity.
9. The company APPENDs a person's returned result on that person's behalf with attribution.
10. A worker register holds skills, qualifications, location, availability and rates.
11. Some acceptance step needs a qualified person by law.
12. A wait on a human PARTY has a timeout, a reminder, a no-show rule and a reassignment.
13. Verification scales with LABEL risk: photo metadata and location, a second PARTY, a spot CHECK.
14. The company never sends a person into an unsafe situation.
15. §7 SGB IV defines employment, so a freelancer who takes employee-like direction is employed for social security, a false self-employment status risk.


### Part 4: running the service

#### 31. A clock and a scheduler

*Nothing runs between runs, so a timer outside the repository must wake the system.*

1. A «stateless» system keeps nothing alive between RUNs, so a PARTY outside it must wake it.
2. The company APPENDs every timer as a record: a follow-up DEADLINE or a DEADLINE on a recurring PROCEDURE.
3. A follow-up DEADLINE has the absence of an OBSERVATION as its trigger.
4. The consequence of a recurring PROCEDURE's DEADLINE APPENDs the TASK that runs that PROCEDURE.
5. An «edge scheduler» such as cron or a systemd timer READs these DEADLINEs and APPENDs each consequence at expiry.

#### 32. A kill switch

*One switch stops all outside effects; smaller switches stop work, merges and scheduling; a tag pauses one task.*

1. One global STOP ends every EFFECT, and a human triggers it from a telephone.
2. Narrower STOPs end the picking of a TASK, the landing of a change and the scheduling separately; a LABEL pauses one TASK.
3. A record alone cannot switch: any PARTY that can APPEND overwrites it, it reaches only READers, so the switch has two halves.
4. The record names what is stopped, the PARTY and the reason and only a board KEY clears it.
5. A service on another host, reached by one message or one call, acts on the edges and REVOKEs the executing PARTY's KEYs at the «broker».
6. It STOPs the outbound queues in the «adapters», cancels the EFFECTs a provider holds, and tells the «dead-man's switch» that silence is expected.
7. Stopping is physical: the stop record CITEs every EFFECT in flight.
8. The stop confirmation states what the company recalled and what it could not recover.
9. A STOP per place belongs to requirement 43.

#### 33. Backup and restore

*Only records in git survive by history; mirrors, keys and restore drills must rebuild the whole company.*

1. History backs up git only; the payload STORE, the KEY STORE, signing KEYs, the KEY register, the «binary cache» and the forge STORE need copies.
2. Every repository is copied to a second STORE under different KEYs.
3. The second STORE is append-only and refuses DELETE, so one compromised account on the forge STORE cannot delete both copies.
4. The payload STORE keeps versioning and an «object lock».
5. The «object lock» keeps a deleted or overwritten object recoverable for a set period.
6. The company backs up the KEY STORE and its encryption KEYs per person and retention class, encrypted; board members hold recovery KEYs offline.
7. The board REVOKEs and reissues a signing KEY by a documented PROCEDURE, and the KEY register is in git.
8. A scheduled restore RUN rebuilds the company and its product on a fresh machine, and a verifier PARTY APPENDs the EVIDENCE.
9. A product with its own STORE enters the register with «point-in-time recovery», a «recovery point objective», a «recovery time objective» and a restore RUN.
10. The board writes the «recovery point objective» and the «recovery time objective» down per data STORE.
11. Each backup copy carries a DEADLINE; a RULE APPENDs a TASK deleting a SHREDded KEY's backups; a lost KEY loses data like a deleted one.
12. A forge STORE outage stops the company; a board DECISION runs RUNs on the second STORE; promotion raises the authority epoch, blocking the old primary.
13. Every writer and executor CHECKs the authority epoch in the KEY registry before a write.
14. Every TASK carries a deadline-class LABEL.
15. A TASK tied to an externally fixed date gets a signed «degraded-mode packet» that names its holder.
16. The packet holds the running order, the contacts, the roster with emergency numbers and the payments already authorised.
17. The packet prints on paper and needs no forge STORE, network or model to use.
18. The packet EXPIREs after the event, a RUN each season proves one PARTY can run it, and paper events return afterwards as OBSERVATIONs.

#### 34. Continuity and exit

*The company must outlive any one person and be able to close itself down.*

1. The company must survive the loss of one person and end cleanly.
2. At least two human PARTYs hold each KEY, each ADDRESS and each recovery route.
3. A record names the PARTY taking over each class of DECISION when a board member leaves, and the board DECIDEs it yearly.
4. A PROCEDURE exports the whole company as repositories, payload STORE contents, KEY STORE contents and DECISION history in open formats.
5. The company returns a leaving client's records and DELETEs that client's payloads.
6. The company erases the leaving client's scope, not only the payloads.
7. Winding down is a PROCEDURE: the notices, the final ACCOUNTs, records kept for the legal periods, then SHRED of the rest.
8. Winding down notifies clients, suppliers and authorities.

#### 35. Data classes, legal bases and erasure

*Every record is tagged, and one key per person and retention class erases exactly one class.*

1. Every OBSERVATION, RUN, FACT, fixture and payload carries LABELs class, purpose, «legal basis», retention and recipient; purpose, «legal basis» and retention follow fixed lists.
2. Each retention LABEL names its legal source and the event that starts the clock.
3. The recipient LABEL names every processor that sees the record.
4. Personal data stays encrypted in the payload STORE, history holds only HASHes, and minimisation covers transcripts and screenshots.
5. Context assembly and every EFFECT draw only records whose purpose LABEL matches the TASK's, and a RULE DERIVEs Art. 30 and DPIA entries.
6. A privilege LABEL marks counsel's advice with its holder and distribution list; only a person on a committed roster shares it, by DECISION.
7. Privileged material never passes to summaries, embeddings, RUNs or dashboards.
8. A protected-source LABEL leaves only a pseudonymous id in the record, and one named human keeps the mapping outside git.
9. A KEY covers one person and one retention class, because Art. 17(3)(b) GDPR excepts data that a statute requires the company to keep.
10. A gate refuses the SHRED of a KEY that a retained record CITEs; restricted data leaves every context packet.
11. Restricted data is readable only by the PROCEDURE that serves the legal duty.
12. A table RULE maps each request to erase, restrict or keep with reason, and the scheduler APPENDs the shred TASK at retention end.
13. A claim, a cease-and-desist, an authority inquiry or a damage event starts the legal hold.
14. A dispute starts a legal hold, a DECISION naming matter, custodians, classes and span, that every DELETE path CHECKs; an attempt is an incident.
15. The issuer or the board ends the hold.
16. Art. 17(3)(e) GDPR weighs erasure against the hold.
17. §203 StGB limits treatment data to a secrecy-bound processor.
18. The model provider therefore counts as a secrecy-bound processor.

#### 36. Data subject rights, breaches and processors

*Requests, breaches and processors each need a fixed procedure, a clock and a register entry.*

1. The right to erasure is one of several; access, rectification, restriction, objection and portability each need a PROCEDURE.
2. The PROCEDURE finds every record about the person through the requirement-35 LABELs, including RUNs, FACTs and payloads, and answers as an EFFECT with a receipt.
3. Art. 12(3) GDPR gives one month, so the request is an OBSERVATION that starts a DEADLINE in the compliance calendar.
4. A personal data breach starts a different DEADLINE.
5. Art. 33 GDPR requires notice to the supervisory authority without undue delay and where feasible within 72 hours of awareness.
6. The breach PROCEDURE contains it, assesses the risk from the LABEL classes, DECIDEs on notice, and APPENDs the DECISION with its reasons.
7. The DECISION covers notice to the authority and to the people affected.
8. The record states whether a notice went out.
9. A pushed secret, a context packet with the wrong client's data and a misdirected email are candidates for a breach.
10. A breach is an incident, and the gates that detect one APPEND the breach TASK.
11. A register covers every «adapter»: which service it reaches, which LABEL classes it receives, the Art. 28 contract, where the data lands, how it gets there and who sub-processes it.
12. The model provider gets the strictest entry, since every context packet passes through it.
13. A new integration cannot go live without its entry, and a gate CHECKs that no LABEL class reaches a processor whose entry omits it.

#### 37. Concurrency and scale

*Many agents writing at once need leased locks, a merge queue, small clones and split repositories.*

1. Fifty agents break a design that works for five, and reach 10 GB and a million COMMITs in two years.
2. Every update to main is a compare-and-swap from an expected parent, so a RUN on a stale base fails instead of overwriting.
3. The compare-and-swap keeps the semantics of git push --force-with-lease.
4. A lock is a «lease» with a time limit and a «fencing token» the forge STORE and payload STORE CHECK; a killed holder cannot write.
5. Gates run on a speculative branch outside any lock, and a «merge queue» rebases, re-gates and retries a bounded number of times.
6. The unit of merging is declared per file type.
7. One landing covers one segment of a translated document, one POSTING of the books, or one field of a TASK; anything else conflicts.
8. A conflict that stays unresolved goes to the owner PARTY.
9. A RUN works in a partial, «sparse clone» of the paths its TASK owns, and the RUNs on one host share one object STORE.
10. A file has a size ceiling, and a record above it holds the payload by HASH.
11. Routine removal never rewrites history, because only HASHes and pointers enter a COMMIT and the DELETE hits the payload STORE.
12. Split the repository by domain or project once a single STORE becomes the bottleneck, and let a cross-reference carry a repository and an id.


#### 38. Contracts, signatures and acts only a person can perform
*Some acts need a notary, paper or one person's own signature and gates enforce the form.*

1. A binding COMMITMENT is SIGNed with a qualified electronic signature under eIDAS and carries LABEL risk=top.
2. A register lists five form classes: notarial, written on paper, qualified electronic signature, text form and none.
3. The wrong form makes the act void and not merely hard to prove.
4. A gate refuses an EFFECT whose form does not match the register.
5. The personal acts are writing a clinical note, certifying an insurance claim, signing a manuscript, writing a thesis and adopting a discretionary decision.
6. No GRANT passes a personal act to an agent.
7. For each personal act the register names the position whose holder performs it.
8. The act carries that person's own signature and second factor.
9. The signature binds to the exact content of the act.
10. §35a VwVfG permits a fully automated administrative act only where a statute authorises it and leaves neither discretion (Ermessen) nor assessment latitude (Beurteilungsspielraum).
11. An agent may PROPOSE a draft.
12. The record shows that an agent drafted it.
13. The executed document carries a HASH.
14. The clauses that create COMMITMENTs are term and renewal, notice period, notice ADDRESS and form, liability caps, indemnities and governing law.
15. A human CHECKs those clauses.
16. A RULE CHECKs the signing PARTY against the register extract.
17. A RULE CHECKs the authority of the person that signs for the other PARTY.
18. Before SIGN, a gate compares worst-case liability with the insured limits and the board's accepted retention.
19. Unlimited liability needs a board DECISION.
20. Settlement authority is an AMOUNT limit in the decision-rights file.
21. In a live dispute or before an authority, an outbound EFFECT carries LABEL risk=top.
22. That EFFECT needs counsel's CHECK.
23. That EFFECT admits nothing and accepts no offer.

#### 39. Cost accounting
*Every TASK and RUN records its tokens, spend, tool cost and human hours for budgets and VIEWs.*

1. Each TASK and each RUN records its tokens, API spend, tool cost and human hours as AMOUNTs.
2. These AMOUNTs feed the budgets of requirement 21.
3. They feed the value-against-cost DECISION of requirement 2.
4. The dashboard VIEW of requirement 13 shows them.

#### 40. Outcome metrics
*Each goal needs outcome metrics, measured from sources the agents did not write.*

1. A company with verified TASKs is not yet a working company.
2. Each goal has outcome metrics.
3. The metrics are revenue, margin, reply rate, client satisfaction, rework rate and enquiry-to-quote days.
4. A metric is a VIEW of a RULE over POSTINGs or OBSERVATIONs.
5. A RULE opens a TASK for the board when a metric stays off target.
6. An on-target metric is CHECKed as hard as an off-target one.
7. A proxy metric is permitted and is never a goal on its own.
8. A metric is only as good as its source, which is the records the agents wrote.
9. Where no outside PARTY signs, a gate cannot tell a true number from a fabricated one.
10. The company CHECKs the figure against FACTs the agents did not write.
11. The independent FACTs include the payer's claim decision, a mystery shopper's report and a random sample that a human CHECKs against the original records.
12. Where no such FACT exists, the company SUPERSEDEs the outcome definition before the period starts.
13. A named human SIGNs every figure for a funder or an authority.
14. The sample rate rises where a submitter's numbers outrun the sample.
15. A paying metric moves, so a collector PARTY with its own KEYs READs the analytics STOREs.
16. The collector APPENDs each figure with its source, ACCOUNT, ANCHOR and the HASH of the raw response.
17. No agent holds a write GRANT on an analytics surface.
18. The collector excludes interactions between ACCOUNTs the company controls by construction, not by a later RULE.
19. A monthly CHECK splits each target hit into organic, paid and suspicious sources.

#### 41. A compliance calendar and clocks started by others
*Duties recur on dates, and other PARTYs start DEADLINEs that silence can close.*

1. Some legal COMMITMENTs recur on a date.
2. Each sits in a committed calendar with an owner PARTY, a lead time and a PROCEDURE.
3. The scheduler APPENDs a TASK ahead of each DEADLINE.
4. A missed DEADLINE opens an incident TASK.
5. Other DEADLINEs start with another PARTY's OBSERVATION.
6. Axiom 5 applies.
7. The DEADLINE counts from the other PARTY's own date where the law counts from it.
8. An alert flags a late OBSERVATION.
9. The DEADLINE CITEs the RULE that turns the OBSERVATION into it.
10. Two PARTYs DECIDE the computed DEADLINE.
11. The DEADLINE names its consequence as a right lost, a deemed approval, a deemed acceptance or an appeal barred.
12. The record gives each consequence a plain-words gloss.
13. A decide-by date well before the DEADLINE ESCALATEs to the board.
14. Where the company meets a DEADLINE by notifying a PARTY, the record names the contractual or legal service channel.
15. The record cites a proof-of-receipt artifact.
16. §41(2) VwVfG deems a posted administrative act notified on the fourth day.
17. Doubt about receipt puts the burden of proof on the authority.
18. On SIGN every term triggered by elapsed time or the company's own inaction becomes a DEADLINE.
19. An EXPIRE with no recorded DECISION is a board-level incident.
20. The DEADLINE carries its IANA time zone and the working calendar it counts in.
21. The German duties include the yearly Art. 30 GDPR record, the §5 DDG Impressum and a natural person under §6 GmbHG.

### Part 5: work in the physical world

#### 42. Time, resources and places
*Physical TASKs hold places, crew and spans; dependencies and capacity POSTINGs prevent collisions.*

1. A TASK in physical work has a span, place and crew occupancy and a place THING.
2. Its reservation ends by release or EXPIRE.
3. A TASK carries an estimated AMOUNT of time, not a DEADLINE.
4. Start and finish are OBSERVATIONs with ANCHORs.
5. The scheduler gives each TASK a planned span.
6. The scheduler computes the critical path.
7. Slack on a non-critical TASK is shown and shrinks with each delay.
8. A calendar for a person or a shared THING blocks unavailable slots.
9. The calendar blocks weekends, holidays and other bookings.
10. A register of place THINGs gives each room exclusive use.
11. Concurrent use of a room needs a safe-work LABEL.
12. A TASK CITEs one or more place THINGs.
13. A gate fails the graph when two TASKs claim one exclusive place with no dependency.
14. An access record names the PARTY that holds the door key THING or entry code per place and span.
15. A gate refuses a TASK whose place and span carry no access record.
16. A bill of quantities holds the estimate, orders, goods received and consumed AMOUNT.
17. Delivery notes and usage logs update the quantities.
18. An invoice that differs from the bill of quantities is a gate failure.
19. A THING that can sell out has a capacity ACCOUNT with total, reservations, bookings and free amount.
20. A RULE sets the overbooking limit per ACCOUNT.
21. A gate refuses a POSTING beyond the limit.
22. A crew position and a truck are exclusive to one TASK until it releases them or its span times out.
23. A reservation with LABEL tentative converts to a booking or EXPIRES.

#### 43. Physical safety and site stops
*A safety halt reaches the crew only if the crew reads it and stops work.*

1. Some work can hurt people.
2. The kill switch STOPs new EFFECTs inside the repository only.
3. The kill switch does not reach the crew unless the crew is online, READs the state and is willing to STOP.
4. Every place THING has a safety LABEL with three states: clear, restricted and halted.
5. The restricted state holds conditions that fall short of a halt.
6. A board DECISION or a safety RULE sets the LABEL.
7. At a halt the system sends a plain-language stop order to every ADDRESS recorded in that zone.
8. Each ADDRESS gives an acknowledgement within a set time.
9. Reminders repeat until the acknowledgement arrives.
10. The system APPENDs the halt with reason, zone, PARTYs and ANCHOR.
11. No new TASK goes to the zone until a human APPENDs clearance with EVIDENCE.
12. A worker who refuses entry as unsafe is never treated as absent or reassigned.
13. The company records and ESCALATEs the refusal.
14. Each worker gets the safety briefing and the last inspection CHECK for every site.
15. Tenants and authorities are PARTYs with decision rights.
16. They may refuse access, call a STOP or set conditions that open blocked TASKs.
17. Sending a worker into danger is a crime.
18. The site plan COMMITs to BaustellV duties.
19. The plan appoints coordinators above a project-size limit.
20. A gate refuses dispatch to a site whose safety record or coordination position is incomplete.

#### 44. Measurements and acceptance
*Acceptance needs signed measurements and formal inspection; a photo proves nothing.*

1. A photo proves nothing about dimensions, quantities or quality.
2. Acceptance in construction and trade law rests on measurements.
3. EVIDENCE for readiness includes measurements with a physical reference.
4. The PARTY that took the measurements SIGNs them.
5. Each measurement carries its date.
6. Regulated work needs EVIDENCE of conformity or EVIDENCE from a test.
7. Each milestone has an inspection with a checklist.
8. The inspecting PARTY files EVIDENCE of qualification where the trade requires one.
9. A defects list stays open until acceptance.
10. Each defect CITEs a sub-TASK that blocks closure.
11. The company APPENDs a SIGNed acceptance record with the accepting PARTY, the date and the EVIDENCE.
12. The record names a retained AMOUNT held back for open defects and the date it is paid.
13. The COMMITMENT DEADLINE starts at acceptance.
14. It defaults to five years for building work under §634a(1) Nr. 2 BGB.
15. A calendar TASK CHECKs defects before the COMMITMENT DEADLINE EXPIREs.
16. The handover pack carries SIGNed plans, EVIDENCE, operating instructions, door key THINGs and the notice that lifts restrictions on use.
17. A landlord announces modernisation in text form three months before the work, under §555a(2) BGB.
18. The tenant may end the lease at the end of the month after next on hardship, under §555c BGB.
19. A dwelling that is unusable or reduced in value triggers a rent reduction under §536 BGB.
20. The law gives that reduction.
21. No agent negotiates that reduction away.
22. No agent waives what the tenant's rights give them.
23. A GRANT to sign a works contract on site names its own limits.


#### 45. Commitments and external obligations

*A company must track every promise it owes or is owed, and check it before it starts work.*

1. A COMMITMENT is an edge and a TASK is a node; the company APPENDs COMMITMENTs as first-class records.
2. A reservation is a POSTING of tentative capacity from a THING's ACCOUNT to a TASK's ACCOUNT.
3. A booking is a reservation with LABEL firm, naming the PARTY, THING, planned ANCHOR, price, cancellation terms and deposit POSTING.
4. A COMMITMENT the company owes carries a promised ANCHOR, a placement, a delivery DEADLINE, a COMMITMENT or a refund right.
5. A COMMITMENT owed to the company carries a contractor's delivery, a DECISION DEADLINE or a payment DEADLINE.
6. Each COMMITMENT names the TASK or milestone that creates it and the one that clears it, and CITEs its source clause.
7. A missed DEADLINE opens an incident TASK with the counterparty notice and the penalty or the compensation attached.
8. A RULE DERIVEs a VIEW of open COMMITMENTs, and the scheduler CHECKs it before opening dependent work.
9. Every engagement, client or funder has an engagement file with the signed agreement and the client policy.
10. The file holds conflict CHECKs against concurrent work, embargo ANCHORs and restrictions on sub-contracting and disclosure.
11. The file holds an authority register naming who may approve what.
12. A gate READS that file before work starts: a conflict refuses the bid and a missed embargo opens an incident.
13. A gate refuses AI-generated work that would bind the client when the client's policy forbids it.

#### 46. Operating a live service

*Running a live product or service needs on-call people, monitoring, backups, safe deploys and incident handling.*

1. A web product, a tenant building and a routed fleet shift the work from producing THINGs to keeping one THING running.
2. One or more PARTYs are on call per rotation, each with a paging ADDRESS and an acknowledgement DEADLINE.
3. The SLO record carries the target and the measurement window per service and endpoint, so a red SLO has a definition.
4. A monitoring RULE CHECKs liveness and each SLO, APPENDs the SLO record and pages the on-call PARTY.
5. Each alert has a versioned PROCEDURE, and each incident has a dated record with the alert, timeline, actions, cause and postmortem DECISION.
6. An outside monitor APPENDs state at intervals, a RULE DERIVEs availability as the basis for SLA disputes, and a second monitor watches the loop.
7. The product STORE joins the backup inventory of requirement 33 with «point-in-time recovery» and tested recovery objectives.
8. The restore drill restores the product and the company, not only one of them.
9. The system calls CI and READs its results; CI builds and packages.
10. A deploy is an EFFECT, gated and DECIDEd for production, with a receipt naming version, place and ANCHOR.
11. A production deploy has a canary stage, a freeze window and a rollback PROCEDURE; rollback needs the old version and the same DECISION class.
12. Deploy configuration and feature flags are config-as-code or EFFECTs with a DECISION, so an agent cannot change them without a trace.
13. break-glass is a GRANT to a smaller «quorum» for rollback, reboot, failover and capacity during a declared incident.
14. The incident record shows which break-glass action was used.
15. An incident is a TASK with LABEL incident, opened by an alert or a human, worked through contain, diagnose, mitigate, resolve, review.
16. Each fleet keeps a route and shift register, a vehicle-state map, fuel and maintenance logs and driver certifications.
17. A building keeps a tenant contact list per dwelling, a maintenance log and rent ACCOUNTs that reconcile to the bank.
18. Each fleet, building and van has a response DEADLINE and a silent van opens an incident.

#### 47. Bookkeeping, tax and annual accounts

*Bookkeeping, tax and year-end work need matching entries, locked periods, tax rules and written documentation.*

1. Plain-text ACCOUNTs on immutable COMMITs fit German law but need matching, period locks, year-end work, tax determination and documentation.
2. §146(4) AO forbids a POSTING change that hides the original entry, so the books are append-only.
3. A correction is a REVERSE entry, so the original POSTING stays visible.
4. A three-way reconciliation CHECK closes each period: orders, payouts and bank lines must match per channel within a declared tolerance.
5. Every residual AMOUNT gets a reasoned entry, and an unmatched record refuses the close for Amazon, cards and suppliers.
6. A «pre-receive hook» refuses any history rewrite in the accounting subtree, even from the board; rollback means the attempt never left the branch.
7. §14(4) Nr. 4 UStG requires a sequential invoice number unique to the issuer, drawn from requirement 1's allocator.
8. The GoBD requires a documented reason for each gap in the serial numbers.
9. The close values inventory against a stock-take.
10. The close separates earned revenue from cash received.
11. A depreciation schedule carries acquisition date, useful life, residual value and annual charge.
12. A DECISION locks the period.
13. A gate refuses every further entry into a locked period.
14. The company DERIVEs the E-Bilanz per §5b EStG for the Finanzamt in machine-readable form and transmits it.
15. The managing director SIGNs the HGB §242 and §264 accounts, and the company files them with the register.
16. A RULE determines VAT at the statutory rate on every sale, and a marketplace is a deemed supplier per §3(3a) UStG.
17. Distance sales above 10,000 € fall under §3c(4) UStG, and the One-Stop Shop procedure rests on §§18i to 18k UStG.
18. The company reclaims input VAT and separates deductible from non-deductible.
19. The company DERIVEs the VAT return with a LABEL per return line, a human PARTY reviews it and the Steuerberater files it.
20. A committed, SIGNed Verfahrensdokumentation per GoBD states how POSTINGs enter the books and who CHECKs them.
21. The Verfahrensdokumentation states which CHECKs run and how retention and read-back work.
22. Every PROCEDURE on the books CITEs it, and a change needs a DECISION.

#### 48. Capital, entities and investors

*Shares, funding, group entities and investor rights need their own tracked structure, separate from task work.*

1. Shares, funding instruments, PARTYs, investor rights and runway sit outside the TASK graph, and a share treated as a FACT loses legal structure.
2. A cap table is an append-only record of instruments: each funding round is a DECISION with subscription agreements, pre-money, option pool and conversion RULEs.
3. The verifier DERIVEs post-money fully diluted, the exit waterfall and the per-instrument cap; each instrument CITEs its signed agreement.
4. The Gesellschafterliste per §40 GmbHG reconciles to the court version.
5. A share transfer needs the notarial form of §15(3) GmbHG, and an amendment to the articles needs the notarised §53(3) GmbHG resolution.
6. That deed is constitutive rather than EVIDENCE, so no equity measure is effective without it.
7. A RULE DERIVEs runway from cash, burn, committed funding, weighted receivables and payables, and a gate refuses a COMMITMENT below a set months.
8. A purpose-bound ACCOUNT holds a restricted AMOUNT and carries a restriction LABEL, a source and a return RULE.
9. A gate refuses a POSTING out of a purpose-bound ACCOUNT whose purpose LABEL does not match.
10. §551(3) BGB requires the landlord to keep the tenant deposit at a credit institution, separate from the landlord's assets, in a purpose-bound ACCOUNT.
11. The board READS a VIEW of the waterfall, the cap table by holder and the cliff from an option expiry or warrant trigger.
12. Each subsidiary, holding or branch is a LABEL branch; the company consolidates, computes transfer pricing at arm's length and APPENDs the basis.
13. Some filings happen per PARTY (Handelsregister, VAT ID) and others per group.
14. Investor rights are COMMITMENTs: covenants, board seats, information rights and pro-rata in the next round.
15. Investor rights also include consent for large expenditures, new debt and an exit.
16. A human PARTY makes the investor DECISION through a TASK on the DECISION ADDRESS, with the clause that granted the right attached.
17. The investor responds through the DECISION ADDRESS, and the company APPENDs the DECISION before it acts.
18. COMMITMENTs carry milestones, a report COMMITMENT, a notice DEADLINE and claw-back terms.
19. A crowdfunding campaign records backers, reward COMMITMENTs, VAT per backer location, fulfilment COMMITMENTs and refunds where the goal was missed.
20. A foreign-currency invoice records the EUR equivalent at the POSTING ANCHOR and the settlement gain or loss.
21. A landed cost carries the FOB price, freight, duty, import VAT and the resulting cost basis for the stock record.

#### 49. Employment and labour law

*Hiring, scheduling and firing people brings statutory duties, worker consultation and classification proof.*

1. A company that dispatches, scores and terminates people by AI DECISION faces statute RULEs, mandatory consultation and a high-risk LABEL under the AI Act.
2. The works council is a binary FACT with the election ANCHOR.
3. Each Betriebsvereinbarung is a versioned COMMITMENT with a scope, an effective date and an expiry, stored in the governance registry.
4. A pre-effect gate CHECKs the map from DECISION to co-determination class to required Betriebsvereinbarung.
5. Participation under §87(1) Nr. 2 and Nr. 6 BetrVG covers rosters, shift allocation and performance monitoring, and so does AI that schedules or scores.
6. Hiring needs the works council's consent per §99(1) BetrVG.
7. A termination needs the §102 BetrVG hearing and is ineffective without it.
8. The works council calls in an expert under §80(3) BetrVG, and the employer bears the cost under §40(1) BetrVG.
9. A gate CHECKs each shift against eight hours a day under §3 ArbZG and eleven hours of rest under §5 ArbZG before dispatch.
10. The gate caps cumulative weekly and monthly hours.
11. A four-day DEADLINE governs on-call shifts per §12 TzBfG, and a working-time violation opens an incident that no agent overrides.
12. A termination is a risk=top EFFECT because §623 BGB requires Schriftform, so the company prints, signs on paper and posts it.
13. False self-employment risks back-dated social security contributions but is no offence under §1 AÜG.
14. §1 AÜG requires a licence for temporary agency work, and §16(1) Nr. 1 AÜG makes unlicensed work an administrative offence.
15. Each worker's classification is a FACT with its reasoning.
16. AI that allocates TASKs by scoring or behaviour is high-risk under Annex III(4)(b), and Art. 26 requires informing representatives and affected workers before go-live.
17. The MiLoG minimum wage sits in the statutory facts register and may not be undercut.
18. A gate refuses a dispatch whose wage is below the statutory minimum.
19. Fitness, health or vaccination requirements carry expiry DEADLINEs the scheduler CHECKs before dispatch.
20. A worker may contest an automated DECISION; a PROCEDURE routes each DECISION LABEL to a board member, an outside arbiter or the works council.

#### 50. Rights, brand and creative proof

*Licences, brand rules and client approvals must be checked before any work is published.*

1. Every creative THING carries a rights record: licensor, assignment or publish GRANT, media, territory, DEADLINE, run limit, derivatives, AI use, credit line and licence HASH.
2. A pre-effect gate refuses any placement whose media, DEADLINE or print run exceeds the GRANT.
3. §29(1) UrhG makes copyright non-transferable, so the author passes only a GRANT under §31(1) UrhG, limited by §31(5) to the contract purpose.
4. Payment is a contractual condition of the assignment, not a statutory requirement.
5. An identity THING passes a trade-mark clearance CHECK against committed registered marks for visual and phonetic similarity.
6. The clearance EXPIREs when the identity THING changes.
7. A client DECISION binds to the exact rendition it saw, CITEs the file HASH and the screenshot's OBSERVATION, and a change reopens the DECISION TASK.
8. Each brand has a committed system of colour, type, radius tokens, allowed font files, logo variants, voice RULEs, restricted words and templates.
9. An output THING carries the HASH of the brand system it references, so a later change marks older work stale and opens a review TASK.
10. Every output is CHECKed before delivery: colours and fonts by a RULE, voice by an LLM judge with a rubric.
11. Taste is not deterministic, so a rejection by client, creative director or failed peer review resets a TASK even when the spec was met.
12. A rejection record says what is wrong and what would fix it; the TASK records each attempt.
13. Three rejections ESCALATE to a human TASK for the board.
14. A committed RULE covers alcohol advertising, health claims that need pre-approval, age ratings, accessibility and GEMA.
15. A gate refuses a health claim that needs pre-approval.
16. Each publication is an OBSERVATION with ANCHOR, HASH and placement.
17. A placement COMMITMENT records the content HASH and the placement rule, with a penalty and a DEADLINE.
18. Sponsor contracts, affiliate agreements and content GRANTs create placement COMMITMENTs, and a missed placement opens an incident.


## The eighteen function packs, rewritten

A pack carries a version and its own tests, like a «skill», and a company turns on the packs it needs. Written in the dictionary it stops being a paragraph of promises and becomes a list of records, gates and deadlines that a builder can disagree with. Read the pack for your trade; the other seventeen apply the same moves elsewhere.

### 1. Sales and the customer lifecycle
*The pack takes a lead to a paying client, then hands the client's data back.*

1. A PARTY APPENDs each lead as an OBSERVATION with a source THING and an arrival ANCHOR.
2. A RUN DERIVEs a quote from the price-list FACTs, and a DECISION sends it as a COMMITMENT with a DEADLINE.
3. The customer's signed acceptance is a DECISION by that PARTY, and onboarding APPENDs its PARTY and ACCOUNTs.
4. Each support request opens a TASK under a PROCEDURE, and a response-time DEADLINE ESCALATEs it at the decide-by date.
5. A complaint is an OBSERVATION that opens a TASK.
6. The complaint response is an EFFECT with a DEADLINE.
7. A refund is an EFFECT that makes a POSTING.
8. Offboarding returns the client's payload as an EFFECT.
9. The receipt from the STORE records what the return contained.
10. A gate CHECKs that no payload remains after the return.

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

1. A serial RULE gives each issued invoice its number.
2. An issued invoice is a COMMITMENT to the client PARTY with a DEADLINE, and its expiry APPENDs a dunning TASK.
3. Issuing the invoice makes a POSTING in the books.
4. Receivables and payables are ACCOUNTs in the books of the company PARTY.
5. A RULE computes VAT on each POSTING and moves it to a VAT ACCOUNT.
6. A payroll RUN makes one POSTING per PARTY and one EFFECT to the bank STORE.
7. The cash forecast is a metric VIEW.
8. The handover to the tax advisor is an EFFECT that carries the books and the cash forecast.
9. §14 UStG requires an XRechnung or ZUGFeRD e-invoice for German B2B invoices, with §27 UStG transition to 2027; the pack produces and reads both.

### 4. Procurement and inventory
*The pack buys stock safely, matches three documents before paying and tracks goods in and out.*

1. A purchase order is a COMMITMENT to the supplier PARTY with a DEADLINE.
2. A gate CHECKs the order, the delivery note OBSERVATION and the received invoice OBSERVATION for agreement.
3. Axiom 12 applies.
4. Supplier onboarding is a TASK: a verifier PARTY CHECKs the IBAN through a second ADDRESS out of band.
5. Axiom 9 applies.
6. Each stock movement is a POSTING between two ACCOUNTs of THINGs.
7. A delivery is a TASK whose arrival is an OBSERVATION.
8. Goods in transit are a POSTING from the supplier's ACCOUNT to an in-transit ACCOUNT.
9. A CHECK compares the received AMOUNT with the purchase order AMOUNT.
10. A short delivery leaves a partial AMOUNT in the in-transit ACCOUNT and does not close the TASK.

### 5. People, human and agent
*The pack runs hiring, onboarding, time, leave and offboarding for people and agents alike.*

1. Hiring is a TASK, and Annex III of the AI Act keeps each screening DECISION with a human PARTY.
2. Onboarding APPENDs the PARTY, gives it a role with GRANTs and records its ADDRESSes.
3. Offboarding REVOKEs every KEY and GRANT of the PARTY before the end of the same day.
4. Time tracking APPENDs a POSTING of hour UNITs from the PARTY's ACCOUNT to the TASK's ACCOUNT.
5. A leave request APPENDs a span with LABEL tentative, and a DECISION makes it firm.
6. An agent PARTY enters like a person: a PROPOSEd role, a sandbox RUN, then a board DECISION.
7. A CHECK compares the role's outcomes with the outcome the approving DECISION named.
8. The CHECK keeps, changes or retires the role.

### 6. Legal
*The pack holds the company's terms, insurance, rights and contract duties after signature.*

1. Terms, the privacy policy and the open-source publish GRANT list are versioned RULEs.
2. A contract is a COMMITMENT with a DEADLINE, and each COMMITMENT it creates is a separate COMMITMENT.
3. The insurance contract is a COMMITMENT from the insurer PARTY with its own DEADLINE.
4. A DECISION records who owns the output, and a publish GRANT records what each PARTY may do with it.
5. The relation names each contributor and what that contributor keeps.
6. A gate CHECKs the shipped records against the open-source publish GRANT list before publication.
7. A notice period is a DEADLINE on a planned ANCHOR.
8. At expiry, a RULE APPENDs the renewal or termination that binds the COMMITMENT.
9. The expiry also APPENDs a reminder TASK for the owner PARTY.

### 7. Meetings and calendars
*The pack books meetings in other people's calendars and turns what was said into records.*

1. A scheduler RUN READs the availability calendar VIEW of each PARTY.
2. A reservation POSTING moves the span's capacity from the place THING's ACCOUNT to the TASK's ACCOUNT.
3. A DECISION makes the reservation firm.
4. A meeting with an outside PARTY is also a COMMITMENT with a DEADLINE.
5. The invitation is the EFFECT of that DECISION.
6. Minutes are an OBSERVATION of the meeting with source THING, stated ANCHOR and HASH.
7. Each DECISION the meeting makes CITEs the minute OBSERVATION it rests on.
8. Each DECISION the meeting makes is APPENDed separately.
9. Each promised action becomes a TASK with one owner PARTY and a DEADLINE.

### 8. Paper mail
*The pack turns paper letters into records and keeps the paper as long as the law asks.*

1. A letter from an authority, a bank or a court arrives as paper at the company's ADDRESS.
2. The scan intake APPENDs it as an OBSERVATION under the same PROCEDURE as an email.
3. A statute RULE sets the retention LABEL on the original and the span it covers.
4. The original is a retained record with that legal retention LABEL.
5. A custody POSTING is for another PARTY's goods, so it never holds the company's own letter.
6. A gate refuses the DELETE of the original before the span ends.

### 9. Incidents and reputation
*The pack reviews business failures and controls every public statement the company makes.*

1. An incident TASK covers a business failure, not only a technical one.
2. The postmortem is a TASK whose EVIDENCE names the cause and the RULE or PROCEDURE it changes.
3. Every public statement is an EFFECT that a board DECISION approves.
4. The crisis communication PROCEDURE needs a board DECISION of its own.


### 10. Acceptable use
*The company records the work it refuses and tests incoming work and outgoing content against that list.*

1. The board DECIDEs a policy that lists the work the company refuses.
2. An intake gate CHECKs each TASK and OBSERVATION against that policy; a second gate CHECKs each outbound publish or send EFFECT.

### 11. Manufacturing
*Records track what each lot is made of, each unit, tool calibration, sampling results and vendor approval.*

1. A BOM record names the THINGs and AMOUNTs of one lot; each revision SUPERSEDEs the earlier BOM.
2. Each lot CITEs the RUN manifest for its genealogy; each unit carries a serial LABEL.
3. A genealogy VIEW traces each lot forward to the receiving PARTYs, so a recall TASK can name them.
4. A shelf-life RULE APPENDs the expiry DEADLINE from the production ANCHOR.
5. The expiry APPENDs a TASK to remove the lot from sale.
6. A verifier PARTY CHECKs each measuring tool against the calibration RULE and APPENDs EVIDENCE.
7. The calibration EVIDENCE CITEs each measurement it covers.
8. A sampling RULE reads AQL; a failed CHECK gives the lot a non-conforming LABEL and opens a corrective-action TASK.
9. A corrective-action TASK closes only on EVIDENCE that the cause is fixed and the fix works.
10. The approved-vendor register gives each vendor a GRANT with a scope.
11. A gate refuses a purchase from a vendor without a GRANT.
12. A screening RUN inspects each incoming lot and APPENDs the counterfeit LABEL; a gate refuses such a lot.
13. An audit RUN CHECKs each vendor against its GRANT and APPENDs EVIDENCE.

### 12. Insurance and claims
*The company records its insurance terms, what it insures, goods held for others, each claim and each reserve.*

1. Each insurance contract is a COMMITMENT from the insurer; its terms are records with LABELs for site, line, limit and DEADLINE.
2. A metric DERIVEs the summed exposure across one site or one LABEL line.
3. A CHECK compares the summed exposure with the insured limit and opens a TASK on a gap.
4. A custody POSTING records each THING held for another PARTY, with its value AMOUNT, a span and a DEADLINE.
5. An OBSERVATION of a loss opens the claim TASK; each occurrence gets its own reserve POSTING with uncertainty.
6. A CHECK sums the reserves against the aggregate limit and ESCALATEs the claim TASK.
7. A DEADLINE from §30 VVG counts from the insured PARTY's knowledge ANCHOR.
8. Its expiry opens a TASK that makes the notice EFFECT to the insurer.
9. A late notice opens an incident.

### 13. Healthcare operations
*One record per patient, appointments, insurer approvals, claims and appeals, signed notes and a read log.*

1. The patient register holds one THING per natural person; a CHECK scores each match and LABEL blocked refuses every EFFECT on an ambiguous person.
2. A merge or split of two patient records is a DECISION that two PARTYs SIGN.
3. The merge DECISION carries the KEYs, the GRANTs and the history of both records.
4. A later DECISION REVERSEs a wrong merge and restores both records.
5. A scheduler RUN gives each appointment TASK a planned span in a clinician's calendar.
6. An insurer pre-authorization is a GRANT with a scope and a validity DEADLINE.
7. A gate refuses a treatment TASK that falls outside the pre-authorization.
8. A claim is an EFFECT to the payer's STORE; a refusal opens an appeal TASK on the payer's DEADLINE.
9. A named clinician SIGNs each clinical note as a DECISION, under the documentation duty of §630f BGB.
10. A DEADLINE from §630f BGB keeps each clinical note for ten years.
11. Each display or derivation of a patient record APPENDs an OBSERVATION of PARTY, HASH and ANCHOR.
12. Quality metrics are VIEWs.
13. A payer report is an EFFECT to the payer's STORE with a receipt OBSERVATION.

### 14. Public sector and permits
*Each application gets a statutory clock, a hearing, a reasoned decision, comment spans and standstill.*

1. Intake APPENDs one TASK per application and CITEs the statute RULE that sets its DEADLINE.
2. A DEADLINE from §42a VwVfG APPENDs a deemed approval GRANT at expiry, where another provision orders the fiction.
3. A DEADLINE from §28 VwVfG gives the applicant a span to state a view before the DECISION.
4. Each refusal is a DECISION that CITEs the RULE and the OBSERVATIONs behind it.
5. The refusal states its grounds and how the authority exercised its discretion under §39 VwVfG.
6. A public comment span is a DEADLINE whose expiry APPENDs a TASK.
7. The comment period ends with a DECISION that records each comment and its weight.
8. An open-records TASK carries its DEADLINE under a READ GRANT.
9. An exemption RULE CHECKs each record in an open-records request.
10. A consultation RUN APPENDs an OBSERVATION from each affected third PARTY.
11. A redaction RUN DELETEes each exempt payload before the disclosure.
12. A disclosure DECISION releases the redacted records.
13. The standstill DEADLINE counts fifteen or ten days from the ANCHOR that informs unsuccessful bidders, per §134 GWB.
14. A gate holds the contract while the standstill DEADLINE runs.

### 15. Publishing and ESG reporting
*Every claim is checked, corrections reach every placement, sources stay hidden, and ESG numbers reproduce.*

1. Each published claim is a FACT with an owner PARTY, an ANCHOR, a validity span and a taint LABEL.
2. A gate CHECKs each claim against the OBSERVATIONs behind it before the publish EFFECT.
3. A correction REVERSEs the wrong FACT and APPENDs the correct one.
4. The correction TASK EXECUTEs an EFFECT on every placement that CITEs the old HASH.
5. Each placement returns a receipt OBSERVATION.
6. The correction TASK closes only on a completeness count of corrected placements over known placements.
7. Source protection gives each source a pseudonymous LABEL, and a GRANT limits READ of the link.
8. A separation RULE refuses a commercial PARTY any DECISION on editorial content.
9. A versioned inventory RULE and a period-lock DECISION fix the input records.
10. Each factor set carries a HASH, so a CHECK reproduces the assured number.

### 16. International operations
*Cross-border tax, invoice clearance, data location, time zones, sanctions and FX rates are each a RULE.*

1. A RULE from §3a(2) UStG sets the place of supply.
2. Under §13b UStG the customer PARTY owes the VAT, and the invoice carries the statutory note.
3. A clearance RULE per jurisdiction names the filing STORE and the receipt OBSERVATION that ends each e-invoice TASK.
4. A clearance refusal opens a repair TASK that APPENDs a corrected e-invoice.
5. A data-location gate CHECKs the jurisdiction LABEL at each hop and refuses a READ or EXECUTE across a forbidden boundary.
6. Each PARTY and place THING CITEs an IANA time zone; a local working calendar RULE converts the UNITs.
7. A sanctions gate CHECKs each PARTY against the list and refuses the EFFECT on a match.
8. The sanctions CHECK records the list version, its HASH and the ownership RULE applied.
9. A false-positive disposition is a DECISION that records its reason.
10. A match opens a freeze TASK and a report DEADLINE to the authority.
11. A later audit READs the sanctions CHECK record and reproduces its result.
12. Each FX POSTING CITEs the declared rate source and its ANCHOR; a revaluation RULE APPENDs a reserve per open POSTING.

### 17. Nonprofits and grants
*Money stays bound to its purpose, donations and hours are valued, outcomes are checked and funders get reports.*

1. Each purpose-bound ACCOUNT holds a restricted AMOUNT; the funder's COMMITMENT carries a restriction LABEL and a DEADLINE.
2. The funder report is an EFFECT to the funder's STORE with a receipt OBSERVATION.
3. An in-kind donation is a POSTING of the THING at a declared AMOUNT with LABEL estimated.
4. The AMOUNT states its valuation basis and that the valuer is independent of the donor.
5. The donor acknowledges the valuation in a signed OBSERVATION that the POSTING CITEs.
6. A volunteer RUN APPENDs an OBSERVATION of hours; a POSTING moves that AMOUNT to the programme ACCOUNT.
7. Each programme outcome is a FACT that a verifier PARTY outside the company CHECKs.
8. The external CHECK covers the measurement method and the denominator.
9. A RULE from §72a SGB VIII requires a CHECKed OBSERVATION of a cleared PARTY before any TASK that works with minors.
10. A safeguarding RULE under §8a SGB VIII APPENDs an assessment TASK when weighty indications of risk to a minor appear.
11. The risk assessment ESCALATEs to the Jugendamt when the professional finds a risk.

### 18. Research labs
*Ethics approvals renew, adverse events run on clocks, authorship is recorded, and shared data is destroyed at term end.*

1. An ethics committee GRANT covers each protocol, with a DEADLINE for renewal.
2. When the ethics GRANT expires, a gate STOPs every study RUN until a renewed GRANT.
3. A serious adverse event opens a TASK and a DEADLINE counting from the OBSERVATION to the filing.
4. Each recipient PARTY has its own DEADLINE from the same OBSERVATION.
5. A causality assessment is a DECISION by the investigator that each DEADLINE record CITEs.
6. The authorship register names each author PARTY and that PARTY's contribution role.
7. The register names one corresponding author.
8. Each author approves the submitted version in a signed OBSERVATION.
9. A data-sharing agreement is a COMMITMENT naming the federation RULE and a DEADLINE whose expiry opens a TASK that DELETEs the shared data.
10. The deletion TASK CITEs the partner's signed destruction statement.
11. A preregistration is a DECISION that fixes the study design before the first OBSERVATION.
12. The preregistration carries a public ANCHOR.
13. Each deviation from the preregistration APPENDs an OBSERVATION.
14. The replication package is a PROCEDURE that a verifier PARTY can EXECUTE.
15. The verifier's RUN APPENDs EVIDENCE that CITEs the package HASH.
16. An embargo DEADLINE refuses the publish EFFECT until it expires.


## What did not fit

Every rewrite above was done by an agent working from the dictionary alone, and every one of them reported where the dictionary ran out. Those reports are the honest output of the exercise.

### Domain nouns belong in an annex

Cap table, SAFE, waterfall, aggregate limit, AQL, SLO, XRechnung. None of them should enter a core dictionary, and a pack that uses one has to define it somewhere. That annex is per pack, and this post does not carry it: a construction company does not need a word for an insurance reserve, and a dictionary that held all eighteen trades would be a glossary of everything.

### A statute is not a word

A citation like [§30 VVG](https://www.gesetze-im-internet.de/vvg_2008/__30.html) hides four things: what starts the clock, who has to be told, what artifact proves the telling and what happens if it is late. The dictionary can write all four and nothing in it forces a writer to. One pack here sent an insurance notice to the wrong party in the first draft, and the two-writer test could not catch it, because both writers could express the wrong recipient perfectly well. A statute annex per pack, with those four fields for each cited act, is the fix; this post does not contain one.

### Concepts the dictionary lacks

Twelve, each reported by at least one writer, and several by three.

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

### Places where two approved words still both fit

These are the residual ties, and the dictionary has no rule that breaks them.

- A response-time target is a deadline in one reading and a commitment in another. The rewrite picked deadline, because a missed response time has a consequence.
- A postmortem is a task in one reading and evidence in another. The rewrite picked a task that produces evidence, which is a longer sentence and an honest one.
- An assured emissions figure is a view in one reading and an amount in another. The rewrite picked a view, because it must be reproducible from its inputs.
- A deterministic asset is a recipe in one reading and a view in another, and the source's own word is "recipe".

That list is short, and it cost five rounds to get short. A first dictionary that lost nothing would mean the test was too easy.



## What the rewrites changed

The fifty requirements survived. Four of them changed in meaning on the way through, and two more exposed a gap in the dictionary that is listed above. The four are worth fixing in the original.

**Requirement 19 broke a definition.** The dictionary banned "skill" as a synonym for procedure, because a procedure is a sequence of steps. Every writer on that requirement refused the ban, and they were right: a skill is a packaged artifact with a version hash, its own tests and an interface, which is a thing and not a procedure. The amendment moves the word rather than the meaning, and it is not in the dictionary above: a word that changes category needs a two-writer test first, and that test has not run. The next revision carries it.

**Requirement 42 turned capacity into money.** A task that holds a room, a crew seat and a truck reads like a permission. Written as postings of room-days and seat-days it becomes a quantity that can be held partially, released, overbooked or counted, which is what a scheduling system needs and what the prose never said.

**Requirement 41 separated a count from a duty.** "The effect of expiry" mixed the consequence of a missed deadline into the word for what the company does to the world. A deadline now has a consequence, and the consequence is a grant or a commitment appearing or ending. A deemed approval under [§42a VwVfG](https://www.gesetze-im-internet.de/vwvfg/__42a.html) is a permit that a statute orders when an authority stays silent, and only where another provision allows the fiction, which is a strange thing to have to write as a decision.

**Requirement 30 stopped saying that outsiders cannot approve.** A correspondent cannot decide the company's effects. A client signing off a design is deciding something, and their signature is a decision by them. The original sentence made those two cases sound like one refusal.

Everything else came through with every control intact, which was the point.

## Run it on your own spec

Four steps and an afternoon.

1. List the nouns that appear in three or more requirements of your own specification.
2. Give each one a single sentence, and write down the words it replaces.
3. Take the requirement you are least sure about and give it, with the list, to two agents with no shared context. Ask each to rewrite it using only those words.
4. Diff the two rewrites. Every place they chose differently is a place your specification is ambiguous, whether or not you adopt the dictionary.

The diff is the product. The dictionary is what makes the diff possible, and it does not have to be mine.