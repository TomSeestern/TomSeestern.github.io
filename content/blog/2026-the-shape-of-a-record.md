---
id: 2026-the-shape-of-a-record
title: "The Shape of a Record"
articleDate: 2026-11-07
articleContent: "The field-level schema for seven record kinds and twelve defined nouns, the grant algorithm, the time model and the four files a pack may add."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - AI
  - Automation
  - Git
  - LLM
  - Company OS
  - Architecture
statementRules:
  - The schema rules
statementDictionary: 2026-seven-nouns-eighteen-verbs.md
---


# The Shape of a Record

## What the vocabulary left open

Two promises are still unpaid. [Seven Nouns and Eighteen Verbs](/blog/entry/2026-seven-nouns-eighteen-verbs) fixed what a record is called and which verb acts on it. [One Kernel, Eighteen Packs](/blog/entry/2026-one-kernel-eighteen-packs) said that every record kind has a schema and that a pack is four files, then spent its words on the services around them.

This post pays both. It gives the envelope every record shares, the fields of each of the seven kinds, the fields of the twelve defined nouns, the grant algorithm, the time model and the contract a pack has to satisfy. A builder can write a validator and a pack from it without guessing, and two builders given the same record produce the same bytes.

The claim stops there. This is not a storage design, a user interface design or a model design. It says what a record contains and when it may land. [What LLM Agents Are Still Missing](/blog/entry/2026-what-llm-agents-are-missing) argued why that layer matters, and the [requirements post](/blog/entry/2026-git-based-stateless-llm-driven-company) listed what it must cover. The schema is the part a machine can check.

## The envelope

Every record is one JSON object with the same nine keys. The kind selects the payload schema, and the envelope does the rest.

```json
{
  "kind": "THING | RULE | OBSERVATION | TASK | PROCEDURE | EFFECT | POSTING",
  "id": "SHA-256 of the canonical bytes without id, signature and anchor",
  "schema": "kernel/1",
  "author": { "party": "PARTY id", "key": "KEY id" },
  "anchor": { "at": "RFC 3339 time", "source": "the authority that gave it", "proof": "its token or receipt" },
  "cites": ["record ids"],
  "labels": { "owner": "PARTY id" },
  "payload": { "the fields of the kind, or a STORE reference" },
  "signature": { "alg": "ed25519", "key": "KEY id", "value": "the mark" }
}
```

`kind` names one of the seven. It selects the payload schema and the checks that apply, so a validator never guesses from a field name.

`id` is the SHA-256 of the canonical bytes of the record without `id`, `signature` and `anchor`. It is the name a later record CITEs, and it covers the author, the LABELs and the payload in one value. The anchor is outside the id because the proof is over the id and the signature; the proof carries the time, so `at` is a cache of it and `source` names the key that verifies it.

`schema` is the kernel schema version. A validator refuses a version it does not know, which is how a pack pinned to an older kernel fails at load rather than at the first odd record.

`author` names the PARTY and the KEY that produced the record. The signature verifies against the KEY register as the register stood at the parent commit, so a later rotation cannot retroactively authorize or disown a record.

`anchor` is `{at, source, proof}` or null. `proof` is the RFC 3161 token or the outside PARTY's signed receipt over `H(id, signature.value)`, so it proves the content and the signature existed at its signed time; a source string without a proof is a claim, not a time. The proof is authoritative: the gate reads the time from it, refuses a record whose `at` differs, and verifies it against the `source` entry in the register. It is mandatory on a weighted record: a DECISION, an EFFECT, a POSTING or any record that carries a DEADLINE or a claim with legal or financial weight. It is mandatory on an OBSERVATION too, where it records when the record entered the log. Elsewhere null is allowed and says the record's time is a convenience.

`cites` lists the ids of the records this one depends on for its validity and its order. It is empty only for an external OBSERVATION, which enters from outside. Every other kind names at least the record that created it. Every field that names a record is resolved, whether or not it appears in `cites`; `cites` is the set the validator uses for the dependency graph and the time order, and the kind's own rules say which other fields must resolve. The validator checks both, so an EFFECT's `decision` and `grant` must exist before the EFFECT even though they sit in the payload.

`labels` holds name and value pairs. At least `owner` is mandatory; it names the accountable PARTY and need not be the author. `labels.class` is the dimension a GRANT scope matches; a payload `class` selects the defined-noun schema and is a different field. A GRANT scope reads `labels`, never the payload `class`. The kernel declares the label names `owner`, `class` and `risk`; a pack declares each name's allowed values in its `gate.md` and may add names of its own. A RULE reads LABELs and the fields the schema names; it never reads free text.

`payload` holds the fields of the kind. The kernel's schema declares a size ceiling of 64 KiB; a pack may lower it and may not raise it. A payload above the ceiling is written to a STORE and the field becomes `{store, hash, size, mediaType}`. The record then names the bytes instead of carrying them. The ceiling is a constant the validator reads, not a per-record choice.

`signature` is a detached Ed25519 signature over the UTF-8 bytes of the lowercase hex id. The id is what is signed because the id is what everything else CITEs. `signature.key` must equal `author.key`, and `author.party` is that KEY's holder; a rotation cannot disown a record because the register is read at the parent commit.

Every key is present on every record. `anchor` may be null where the time carries no weight, `cites` may be empty on an OBSERVATION, and `payload` may be a STORE reference. Nothing else may be missing. `anchor.proof` is null only on a record whose time carries no weight, or on a record whose proof is carried by a later retroactive ANCHOR record that CITEs it.

Canonical bytes are [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) JSON with three changes. Keys sort recursively by UTF-16 code unit, never by code point; array order is significant, and `cites` and `conformance` are written in ascending order; an unsorted list is refused. Text must already be NFC: a record with a decomposed string, or with two keys that collide under NFC, is refused, never normalized, so the stored bytes are the hashed bytes. There is no whitespace and no line ending inside the canonical bytes; a record file is those bytes followed by exactly one LF, and the id is over the bytes without that LF. Numbers are IEEE-754 binary64: negative zero is written `0`, an integer outside ±(2^53−1) is refused, and a value is written in expanded decimal with no exponent and no trailing zero after the decimal point, or refused if that form exceeds 40 characters; a non-finite number is refused. Duplicate keys are refused. `HASH` is SHA-256 in 64 lowercase hex characters with no prefix; an artifact address is `sha256:` plus the hash. `H(a, b)` is the SHA-256 of the ASCII tag `H` followed by the canonical bytes of `[a, b]`, so it cannot collide with a record id or a payload hash. Hashes in the examples are abbreviated where the full value would be noise; record ids are full, because a truncated id would not name a record.

An id over the payload alone would let two records by different authors share a name. An id over the envelope gives every claim an owner, a proof of time and a place in the graph before anyone can CITE it. A second APPEND of an existing id is refused as a duplicate instead of merged, because two commits that claim the same record are a race the log should not resolve silently.

A record is valid only when six things hold. The record has the nine keys and the id recomputes from the bytes without the top-level `id`, `signature` and `anchor`. The signature verifies over the lowercase hex id with `signature.key`, that key equals `author.key`, and its holder is `author.party` in the register at the parent commit. Every field that names a record resolves to a record; a payload HASH matches the STORE or the DECISION that names it. Every LABEL is allowed by the schema and the policy. A payload hash matches what its STORE returns, or a DELETE or SHRED left the record and its hash with no payload to match. Every gate passes. A validator that skips one of these is checking a different format. The envelope is what makes a record a record; the payload is what makes it this record.

## The seven record kinds

The kernel APPENDs these and nothing else. A business noun never becomes a kind; it becomes a payload field or a class of a defined noun. Each example below is short, because it shows the fields a validator reads, not a production record. Each id recomputes from the bytes shown. The CITEs name records outside the excerpt, and the signatures and proofs are placeholders, because no example KEY or source is in a register. They are shape fixtures, not a conformance set: only the id recomputation is a check, and a suite needs a test register, a pack policy and real cites.

### THING

A THING is an identity. `class` says which sort: person, agent, organisation, party, place, vehicle, document, key, account, store, grant, commitment, deadline, model or tool. A payload field named `kind` is local to its noun; the envelope `kind` is the record kind. `name` is for people and places. `parent` CITEs the THING that contains it, or is null, so a room sits inside a floor and a floor inside a building. `identifiers` are claims such as a tax number or a serial, and a RULE names the scheme that wins when two claims disagree. `attributes` holds trade fields the kernel never reads. `status` is active, closed or merged.

A parent chain never cycles, and a validator walks it on every APPEND. A merge APPENDs a new THING that CITEs both records and SUPERSEDEs them, carrying their KEYs, GRANTs and history along; a later DECISION REVERSEs the merge without touching the records it joined. A THING is closed, never removed, because its id may sit in a thousand CITEs.

```json
{
  "kind": "THING",
  "id": "7b1cab4eee7c76ce0efd560e70c8f9e9bfb41d17d88ee213f75c353ff430551a",
  "schema": "kernel/1",
  "author": { "party": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8" },
  "anchor": { "at": "2026-11-07T08:12:44Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "supplier" },
  "payload": {
    "class": "organisation",
    "name": "Müller Mehl GmbH",
    "parent": null,
    "identifiers": [{ "scheme": "vat", "value": "DE123456789" }],
    "attributes": { "paymentTermDays": 30 },
    "status": "active"
  },
  "signature": { "alg": "ed25519", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8", "value": "636b6309ef28c56771bc6c1b3118d58a8df4c2efe1a67b92b3d9655f3b2e4fc88414ae4771be204b8e4ae549dc1af9d2678fe4b346d7fc92eccfb169733317f1" }
}
```

A PARTY with an execute GRANT APPENDs it. The gate CHECKs the schema, the parent chain and the uniqueness of each identifier per scheme. A corrected name SUPERSEDEs the old record; a THING created in error is REVERSEd and its CITEs still resolve.

### RULE

A RULE is a versioned predicate. `name` is the stable name of the rule and `version` its lineage. `predicate` is source text in a pinned language, not a sentence in English. `reads` names the LABELs and record fields the predicate touches, so a validator can refuse a RULE that reaches into free text. `owner` is one PARTY. `source` CITEs the record the rule comes from, such as a statute or a DECISION. `effectiveFrom` is a time. `quorum` and `requiresKeyClass` appear on a decision-rights RULE: the PARTYs whose signatures a DECISION needs, and the lowest KEY class that may decide.

One owner, one source, one version. A new version SUPERSEDEs the previous one only after a CHECK over fixtures, and the old version stays readable so a replayed RUN can show what it obeyed. No RULE removes a gate, and no gate exists without a RULE behind it.

```json
{
  "kind": "RULE",
  "id": "c37fe677eade7ad3150314e31d2d64c91e10c38bcd4c3645a399f8db0fab6141",
  "schema": "kernel/1",
  "author": { "party": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8" },
  "anchor": { "at": "2026-11-07T08:15:10Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["7b1cab4eee7c76ce0efd560e70c8f9e9bfb41d17d88ee213f75c353ff430551a"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "terms" },
  "payload": {
    "name": "payment term",
    "version": 1,
    "predicate": "due = OBSERVATION.ANCHOR.at + THING.attributes.paymentTermDays",
    "reads": ["OBSERVATION.ANCHOR.at", "THING.attributes.paymentTermDays"],
    "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1",
    "source": "7b1cab4eee7c76ce0efd560e70c8f9e9bfb41d17d88ee213f75c353ff430551a",
    "effectiveFrom": "2026-11-07T00:00:00Z"
  },
  "signature": { "alg": "ed25519", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8", "value": "4f3caed5a963d1ad08debdcca46709b03f9f6382a9b9efedc24fdad1560388e987d24cfbf1f1fa8f8ea3888632784dfbc8b08e9463d19d5c61f1e37ff55aca40" }
}
```

The owner APPENDs it. A CHECK computes it on records and returns pass or fail. A new version SUPERSEDEs it; a RULE that was wrong when written is REVERSEd.

### OBSERVATION

An OBSERVATION is the kind that reports a state, and it is where outside content enters. `source` is an ADDRESS or a PARTY. `statedAt` is the time the source reports, with its own source, and `arrivedAt` is the time the company saw the content. `contentHash` addresses the raw bytes in the kernel's payload STORE, and `mediaType` names their type. The kernel has one payload STORE; a record that uses another names it in `store`. `authenticity` carries the checks the receiving adapter ran, such as a signature result or a mail authentication verdict. `class` is message, reading, log, run, fact, check or decision.

An OBSERVATION from outside is untrusted by default, and it is never edited. It may CITE nothing, because it is where a record begins. It triggers nothing by itself: a CHECK turns it into a FACT, and a DECISION may rest on it only by CITing it. A second message on the same subject is a second OBSERVATION, not a correction; there is nothing to SUPERSEDE.

```json
{
  "kind": "OBSERVATION",
  "id": "4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f",
  "schema": "kernel/1",
  "author": { "party": "a80bcaa03814456288894899e58a70fd0e83a3821204e74120e182fdca36d998", "key": "a0c4f994537a52d173b4175e33046be199b45b21600a0c23180938762e787dc9" },
  "anchor": { "at": "2026-11-07T08:31:09Z", "source": "mail:mx.example", "proof": "rfc3161:token" },
  "cites": [],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "invoice" },
  "payload": {
    "source": { "kind": "email", "value": "invoice@mueller-mehl.example", "class": "external" },
    "statedAt": { "at": "2026-11-07T08:29:51Z", "source": "mail:date-header" },
    "arrivedAt": "2026-11-07T08:31:09Z",
    "contentHash": "a10a2c7dd76bcfe7b8f1437f773792db9fa8fce6759cd485c1e0b2558d41c104",
    "mediaType": "message/rfc822",
    "authenticity": [{ "check": "dkim", "result": "pass" }],
    "class": "message"
  },
  "signature": { "alg": "ed25519", "key": "a0c4f994537a52d173b4175e33046be199b45b21600a0c23180938762e787dc9", "value": "5a53df4b2282160be08704c3e885005a1a26efb0a1905a874fbea21c804b090bf93d25d9f0114c41a17aede67677a3f730632d669ed9b6312a698cbb5e1839f7" }
}
```

The intake adapter OBSERVEs it. A CHECK tests it. A DELETE removes the payload from the STORE and leaves the record and its hash in the log.

### TASK

A TASK is a unit of work. `title` is for a reader, `spec` holds the action in the form the kernel compares, and `specHash` is the hash of `spec`. `state` is one of open, in plan, blocked, done, future, human, archived. `owner` is one PARTY. `deps` CITEs the TASKs that must finish first. `goal` CITEs the TASK the board adopted or is null. `criteria` is a list of `{id, check, evidence}`, where `check` names a RULE or a command and `evidence` names the EVIDENCE record that passed or is null until it exists. `estimate` holds `value`; where known, `cost` and a `risk` per EFFECT class. A TASK without a cost estimate may not enter the frontier. `budget` holds one AMOUNT for the TASK's total spend. `deadline` CITEs a DEADLINE or is null. `places` CITEs the THINGs the work occupies.

One owner at a time. The dependencies are acyclic and done before the state moves to open. A transition APPENDs a new TASK record that SUPERSEDEs the previous one and CITEs the record that allowed it, so the history of a TASK is a chain rather than a mutable field. Done needs EVIDENCE for every criterion, and the verifier is a different PARTY from the owner. The dictionary calls the TASK id a HASH of its specification; here the envelope id hashes the record without the id, signature and ANCHOR, which also binds the author, so the specification's own HASH lives in `specHash`. This supersedes the earlier sentence, and the earlier post should say so. A dependency CITEs the envelope id. A second open TASK with the same `specHash` is refused, which is how two worktrees that draft the same work meet without a coordinator.

```json
{
  "kind": "TASK",
  "id": "1372302f54b74eaada95e84ed1c1d5c8afabac02173b341cd24855093145bd6e",
  "schema": "kernel/1",
  "author": { "party": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8" },
  "anchor": { "at": "2026-11-07T08:40:00Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["7b1cab4eee7c76ce0efd560e70c8f9e9bfb41d17d88ee213f75c353ff430551a", "4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f"],
  "labels": { "owner": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75", "class": "work", "risk": "high" },
  "payload": {
    "title": "Pay invoice 4711",
    "spec": { "action": "pay", "invoice": "4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f" },
    "specHash": "e123f4b637a6beb1be8ca542288c9b97a2c2dc0cbe4b89f50d4c47f9af5c1864",
    "state": "open",
    "owner": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75",
    "deps": [],
    "goal": null,
    "criteria": [
      { "id": "due-date", "check": "c37fe677eade7ad3150314e31d2d64c91e10c38bcd4c3645a399f8db0fab6141", "evidence": null }
    ],
    "estimate": { "value": { "number": 1190, "unit": "EUR", "uncertainty": 0 }, "cost": { "number": 1190, "unit": "EUR", "uncertainty": 0 }, "risk": { "pay": "high" } },
    "budget": { "number": 1200, "unit": "EUR", "uncertainty": 0 },
    "deadline": null,
    "places": []
  },
  "signature": { "alg": "ed25519", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8", "value": "a066d8da97341ab5f3524723d7594c5fcb9ee152c8f863afda968460553ecbdbeaef0b4e7e575b5927b988acbf4f674ee9be9a9368ff18cc35e56527405f23f6" }
}
```

A PARTY with an execute GRANT APPENDs it. The gate CHECKs the dependency graph, the criteria and the budget. A corrected specification SUPERSEDEs the old TASK; a TASK opened on a wrong premise is REVERSEd.

### PROCEDURE

A PROCEDURE is a sequence with a version. `name` and `version` identify it, and `owner` is one PARTY. `trigger` is a schedule or an OBSERVATION; its `kind` is local to the trigger, and the envelope `kind` is the record kind. `steps` is a list of `{id, deps, skill, adapter, retry, budget, escalate}`, where `deps` orders the steps, `retry` counts attempts, `budget` is an AMOUNT and `escalate` names where a failure goes. The dictionary bans `skill` under PROCEDURE; the third post argues a skill is a packaged artifact, so the schema uses `skill` as the field name for that artifact and the dictionary entry should be amended in a separate change. `environment` names the flake and its hash, so the tools a step calls are pinned. `checks` names the RULEs the PROCEDURE expects, and `outputs` names the record kinds it must produce. `retiredAt` is a time or null.

A version is immutable. A RUN CITEs one version or none. Every step names a skill, and an adapter where the step calls one; a skill is null only where the step is a DECISION by a human PARTY. An amendment is a new version and a DECISION; a retired version stays citable forever, because a replayed RUN has to show what it obeyed.

```json
{
  "kind": "PROCEDURE",
  "id": "660c0c8fc0b93306a35608dd2d7f15c7f85a541e04b7972ff05cc9c3800d96aa",
  "schema": "kernel/1",
  "author": { "party": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8" },
  "anchor": { "at": "2026-11-07T08:44:20Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["c37fe677eade7ad3150314e31d2d64c91e10c38bcd4c3645a399f8db0fab6141"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "finance" },
  "payload": {
    "name": "pay-invoice",
    "version": 1,
    "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1",
    "trigger": { "kind": "observation", "id": "4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f" },
    "steps": [
      { "id": "match", "deps": [], "skill": "invoice-match", "adapter": null, "retry": 1, "budget": { "number": 10, "unit": "minute", "uncertainty": 0 }, "escalate": null },
      { "id": "propose", "deps": ["match"], "skill": "payment-propose", "adapter": null, "retry": 0, "budget": { "number": 10, "unit": "minute", "uncertainty": 0 }, "escalate": null },
      { "id": "execute", "deps": ["propose"], "skill": "bank-pay", "adapter": "bank", "retry": 1, "budget": { "number": 5, "unit": "minute", "uncertainty": 0 }, "escalate": null },
      { "id": "post", "deps": ["execute"], "skill": "receivable-post", "adapter": "books", "retry": 0, "budget": { "number": 5, "unit": "minute", "uncertainty": 0 }, "escalate": null }
    ],
    "environment": { "flake": "company/kernel", "hash": "sha256:5c1e0a2b9d7f" },
    "checks": ["c37fe677eade7ad3150314e31d2d64c91e10c38bcd4c3645a399f8db0fab6141"],
    "outputs": ["EFFECT", "POSTING"],
    "retiredAt": null
  },
  "signature": { "alg": "ed25519", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8", "value": "c4b60adee14dca6be41ce2c66878a55016be5500bdb75b9f7929e242c473b1f23e40e04bd04d6f4cb7ffe49b5f18b6b2912952d6812ab1abc6aad065fc679773" }
}
```

The owner APPENDs it. A sandbox RUN CHECKs it against fixtures before a human DECISION promotes the version. An amendment SUPERSEDEs the previous version, and a version that was invalid when written is REVERSEd.

### EFFECT

An EFFECT is an action on a STORE the company does not control. `class` is send, pay, post, sign, book, deploy or delete. `target` is `{store, address}`, where `store` CITEs the STORE and `address` is the ADDRESS the act reaches. `payloadHash` is the hash of the bytes the adapter will submit. `amount` is the AMOUNT the effect moves, or null. `proposer` CITEs the PARTY that proposed the action. `decision` CITEs the DECISION that approved that exact hash. `grant` CITEs the GRANT that allows the class. The EFFECT's author is the executor; the deciding PARTY is not the `proposer`. `planId` is `H(payloadHash, class)`, so a second driver cannot mint a second plan for one payment. `mode` is live or sandbox. `reversal` names the class of the compensating EFFECT.

An EFFECT CITEs a DECISION that names its `payloadHash` and holds a GRANT for its class. An EFFECT that moves an AMOUNT carries it in `amount`, and the POSTING that CITEs the EFFECT carries the same number and UNIT. The executor is a PARTY with a service KEY and an execute-only GRANT, and it re-reads the log before it acts. The risk LABEL is on the EFFECT; the gate recomputes it from the target, the AMOUNT and the history, and refuses a record that carries another value. A receipt is a separate OBSERVATION that CITEs the EFFECT. An EFFECT that moves an AMOUNT also APPENDs a POSTING. A failed EFFECT APPENDs a reversing POSTING, and a STOP ends its lane before the normal end.

```json
{
  "kind": "EFFECT",
  "id": "4ed0869aadd9cc91cd25795b7b5a2ce324d5dff31898ec6299ea09858dcfa2ef",
  "schema": "kernel/1",
  "author": { "party": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc" },
  "anchor": { "at": "2026-11-07T09:02:31Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["1372302f54b74eaada95e84ed1c1d5c8afabac02173b341cd24855093145bd6e"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "payable", "risk": "high", "period": "2026-11" },
  "payload": {
    "class": "pay",
    "target": { "store": "9d61bf80eda9be570eb8e8bc7d5e880fbbcc8153aae53ddd275d1055451ca85d", "address": { "kind": "bank", "value": "bank/main", "class": "payment" } },
    "payloadHash": "44d1f722a5b01eea7d2bd935ef9ec623a873f9bd830a4a536f2622484f45f768",
    "amount": { "number": 1190, "unit": "EUR", "uncertainty": 0 },
    "proposer": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1",
    "decision": "870165c5cb66f51384dcba9bcce2dda790b7ae3a26d1f287111d0048723fc03a",
    "grant": "0a044b974ea262626edd7804603b7c3d547417998666c7bcb9a74d76841a2bac",
    "planId": "4ea22b0826d6fd1cc72013f14697bdf9ce01e178b295fee515511c065587d8d4",
    "mode": "live",
    "reversal": "reverse-payment"
  },
  "signature": { "alg": "ed25519", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc", "value": "d16ed208ccd88435f84ec0d44e8ffb1f01cf22afe90598dd8c984a1d11c40de2ae2e255716f1488abb0b493ce34156c28ac15caae01498fc60de9cb2397c1c71" }
}
```

A PARTY PROPOSEs it. The gate CHECKs the GRANT, the DECISION, the form of the act and the risk LABEL before EXECUTE. An EFFECT that was wrong is REVERSEd by a compensating EFFECT, never edited.

### POSTING

A POSTING is a movement of an AMOUNT. `entries` is a list of `{account, amount}`, where `amount` is `{number, unit, uncertainty}`. `effect` CITEs the EFFECT that caused it or is null for a movement inside the company. `source` CITEs the DECISION or OBSERVATION it books. `period` names the accounting period, and `reversalOf` CITEs the POSTING it cancels.

At least two entries, one UNIT across all of them and a sum of zero. A locked period refuses every entry. A balance is a VIEW over POSTINGs, never a field anyone edits. A correction REVERSEs the old POSTING and APPENDs the right one, because the books may not hide an entry. A provider's bill becomes a POSTING in its own UNIT to its ACCOUNT, and a VIEW over those records gives cost per DECISION. A single-use GRANT is the execution token, so the schema needs no second ledger for tokens.

```json
{
  "kind": "POSTING",
  "id": "0e6028a44f3fc6fd65fc7291eb095c90a18a972213b2aa92589e1704594f7ffd",
  "schema": "kernel/1",
  "author": { "party": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc" },
  "anchor": { "at": "2026-11-07T09:04:12Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["4ed0869aadd9cc91cd25795b7b5a2ce324d5dff31898ec6299ea09858dcfa2ef"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "books", "period": "2026-11" },
  "payload": {
    "entries": [
      { "account": "0011661047ecc5931605e1e0d352d4e7b513213ee9a0d03d2d6901c5ffbb2e12", "amount": { "number": -1190, "unit": "EUR", "uncertainty": 0 } },
      { "account": "cc89c304b07f55bc01f6697353a8f0b4d3a9dc0210c0df8ff010441819645c1a", "amount": { "number": 1190, "unit": "EUR", "uncertainty": 0 } }
    ],
    "effect": "4ed0869aadd9cc91cd25795b7b5a2ce324d5dff31898ec6299ea09858dcfa2ef",
    "source": "870165c5cb66f51384dcba9bcce2dda790b7ae3a26d1f287111d0048723fc03a",
    "period": "2026-11",
    "reversalOf": null
  },
  "signature": { "alg": "ed25519", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc", "value": "2aa71d9a56a3c277d77dc25bf68f950151976450a3048f0756ccb26caeb6fe9b4e4fc95cb08ce827e0d61f686c5e81ea8bfc499081894a8f579a183a766984fb" }
}
```

A PARTY with an execute GRANT APPENDs it. The gate CHECKs the sum, the UNIT and the period lock. A wrong POSTING is REVERSEd, never corrected in place.

## The defined nouns

Eleven of the twelve defined nouns are records of one of the seven kinds, and the twelfth is a union. Seven are THING classes, because they have an identity a record can CITE: PARTY, ACCOUNT, KEY, STORE, GRANT, COMMITMENT and DEADLINE. Four are OBSERVATION classes, because they report something: RUN, DECISION, FACT and EVIDENCE. The class decides the trust rule, and only the external classes start untrusted. This widens the dictionary's OBSERVATION entry, which says an OBSERVATION is a state its author did not decide, and its axiom 6: an external OBSERVATION is untrusted, while a DECISION signed by the deciding PARTY is trusted once its signature, GRANT and policy RULE verify. The schema uses the kind for any report and lets the class carry whether the author decided it. The dictionary entry should be amended in a separate change. The payload `class` selects the defined-noun schema, the envelope `kind` selects the seven-kind schema, and `labels.class` is the dimension a GRANT scope matches.

### PARTY

A THING with `class: party`. `kind` is person, agent, organisation or service. `keys` lists the KEY ids the PARTY holds. `addresses` lists ADDRESS values. `status` is active, suspended or revoked. `board` says whether the PARTY sits at the root of the grant tree. `for` names a PARTY when an agent acts on behalf of a person.

Every KEY belongs to exactly one PARTY, and a KEY is REVOKEd rather than deleted. An agent PARTY holds its own KEY and never its operator's. A service PARTY signs refusals and escalation TASKs. A PARTY never DECIDEs its own proposal, whatever its GRANT says. A person PARTY is one natural person; adding a PARTY to the board needs the existing quorum. Distinct PARTYs prove distinct records, not independent humans.

### ACCOUNT

A THING with `class: account`. `unit` is the one UNIT the ACCOUNT counts. `owner` is a PARTY, a TASK or a THING. `kind` is asset, liability, income, expense, capacity or purpose-bound. `restriction` is a LABEL value on a purpose-bound ACCOUNT. `closed` is a time or null.

One ACCOUNT per owner and UNIT. A balance is a VIEW over POSTINGs, and an ACCOUNT is not edited after its first POSTING. A purpose-bound ACCOUNT refuses a POSTING whose purpose LABEL differs. Capacity may overbook only where its RULE allows, and the RULE names the limit.

### KEY

A THING with `class: key`. A KEY signs or decrypts. `publicKey` is the public half of a signing key; an encryption KEY has no public half and names the STORE whose payloads it protects. `algorithm` names the scheme. `holder` CITEs the PARTY. `mintedBy` CITEs the KEY that created it, or is null for the root. The class is derived, not declared: it is the minting KEY's class, and a KEY held by an agent or service PARTY is at most that class; a RUN KEY is agent class, and an encryption KEY is class `encryption` and takes no part in the signing order. `scope` lists the paths and action classes the KEY may sign for, or the payloads it may decrypt. `validFrom` and `validTo` are times. `revokedBy` CITEs the DECISION that ended it.

The secret half never enters the log. The register is READ as of the parent commit. The KEY class order is harness, service, agent, human, from lowest to highest. A KEY class must satisfy the act's class under that order, so an agent KEY never signs a personal act. A RUN KEY is minted per RUN, scoped to the TASK's paths and REVOKEd at the end. A verdict is never SIGNed by the KEY that SIGNed the work it judges. A KEY REVOKEd in a commit is revoked for that commit too, so a record in the same commit as its KEY's revocation is refused. For a commit, the register is the parent register plus every KEY record and every revocation DECISION anywhere in the commit, read before any record of the commit is validated; position in the batch does not matter. A KEY revocation needs the quorum of the KEY's class, and a KEY cannot revoke a KEY of equal or higher class.

### STORE

A THING with `class: store`. `kind` is repository, payload, vault, forge, bank, mail, filing or sandbox. `address` is an ADDRESS or a URL. `authority` says which fields the STORE owns. `operations` lists read, execute, delete or shred. `appendOnly` is a boolean. `encryption` names the scheme or null. `retention` is a LABEL value. The pack's retention policy turns that value into a DEADLINE whose expiry APPENDs a SHRED TASK.

A payload is addressed by HASH, and a record CITEs the STORE and the HASH; an OBSERVATION's bytes sit in the kernel's payload STORE. A SHRED is an EFFECT of class `delete` on a `vault` STORE, with the KEY id as its `payloadHash`; the gate refuses it while a legal-hold DECISION covers the KEY or a record that CITEs the payload, and the service PARTY APPENDs an OBSERVATION naming the KEY and the STORE. A second log that allows DELETE is refused. The STORE that owns a FACT wins on that FACT; git wins on intent, DECISIONs and EVIDENCE.

### RUN

An OBSERVATION with `class: run`. `task` CITEs one TASK. `procedure` CITEs one PROCEDURE version or is null. `party` CITEs the PARTY that ran. `model` names the model and `promptHash` addresses the prompt that ran. `mode` is live or sandbox. `startedAt` and `endedAt` are times. `outcome` is a LABEL. `manifest` CITEs every record the RUN READ. `cost` is a list of AMOUNTs. `stop` CITEs the DECISION that ended the RUN or is null.

One TASK, one PROCEDURE or none, one PARTY. The manifest is what makes a replay possible. A RUN is not EVIDENCE for its own TASK, and a RUN that cannot name every record it READ is refused.

### DECISION

An OBSERVATION with `class: decision`. `choice` is approve, refuse, defer, delegate, revoke or stop. `subject` is the payload HASH or record id the DECISION chooses; it is required. `proposer` CITEs the PARTY that proposed the action, or is null for a decision with no proposal. `records` CITEs the records it rests on. `policy` CITEs the decision-rights RULE. `quorum` copies the PARTYs that RULE requires; a narrower list is refused. `reasons` is free text the schema does not parse, and `document` is a STORE reference to the signed statement.

The kernel has no eighth kind for a DECISION. The PARTY DECIDEs, the record reports the signed statement and the signature carries the authority. The author is the deciding PARTY, and the signature verifies against a KEY of at least the required class. A quorum above one is a set of DECISION records that name the same subject, because the envelope carries one signature. The DECISION names the HASH or record it chooses and CITEs the records it rests on, and it never CITEs a VIEW. A refusal is a valid choice. Silence leaves no record, and no record is no DECISION.

### GRANT

A THING with `class: grant`. `grantor` and `grantee` CITE PARTYs or TASKs. `actionClass` is read, execute or publish. `scope` is a list of LABEL names and values. `limit` is an AMOUNT. `deadline` CITEs a DEADLINE. `parent` CITEs the GRANT it derives from or is null. `keyClass` is human, agent, service or harness; an encryption KEY cannot hold a GRANT. `singleUse` is a boolean. `payloadHash` is the payload a single-use GRANT is bound to, or null. `consumedBy` is null at creation and is a convenience pointer for a VIEW; the gate does not read it.

A child never exceeds its parent's remaining authority. A GRANT EXPIREs at its DEADLINE, and a DECISION REVOKEs it. Limits are summed from POSTINGs and COMMITMENTs, never decremented in place. A single-use GRANT is spent by the first EFFECT that CITEs it and whose `payloadHash` equals the GRANT's; the gate counts the EFFECTs and never trusts `consumedBy`. An agent KEY never holds a GRANT whose scope includes risk=top.

### COMMITMENT

A THING with `class: commitment`. `from` and `to` CITE PARTYs. `duty` is a LABEL naming what is owed. `amount` is the AMOUNT the duty obliges, or null. `deadline` CITEs a DEADLINE. `source` CITEs the record that created the duty. `grant` CITEs the GRANT whose limit the duty consumes, or null. `clearedBy` CITEs the EFFECT or DECISION that ends it. `penalty` is an AMOUNT or null.

Every COMMITMENT names a DEADLINE, and a missed DEADLINE opens a TASK. Clearing is an EFFECT or a DECISION that CITEs the COMMITMENT. One booking can be a reservation and a COMMITMENT when an outside PARTY supplies the slot.

### FACT

An OBSERVATION with `class: fact`. `claim` is the checked statement. `confidence` is an AMOUNT. `validFrom` and `validTo` are times. `owner` CITEs a PARTY. `source` CITEs the OBSERVATION the claim came from. `check` CITEs the RULE that passed it. `taint` is a LABEL, untrusted until a second-ADDRESS check clears it.

A FACT exists only after a CHECK by a RULE that names its source. A claim from untrusted input keeps `taint=untrusted`. A newer FACT SUPERSEDEs the old one, and a validity window is never extended by editing. The owner is a PARTY that can be held to the claim.

### EVIDENCE

An OBSERVATION with `class: check`. `task` and `criterion` name what it proves. `rule` CITEs the RULE or names the command. `command` is the exact string that ran. `exitCode` is the integer. `outputHash` addresses the output. `tree` is the tree hash under test. `manifest` CITEs the commit manifest, and `pack` CITEs the manifest document record the scenario tested. `verifier` is the PARTY. `result` is pass. `validTo` is a time.

The verifier did not do the TASK. The record binds to the `tree` and the `manifest`, so an attestation that describes a different tree is refused. A TASK cannot be done without one EVIDENCE per criterion. EVIDENCE EXPIREs at `validTo`, which is how a calibration certificate runs out.

### DEADLINE

A THING with `class: deadline`. `trigger` is a record id or the non-arrival of an OBSERVATION. `countingRule` CITEs the RULE that turns the trigger into a span. `countedFrom` is stated or arrival. `decideBy` and `expiresAt` are times. `timezone` is an IANA name. `calendar` names the working calendar. `consequence` is the union below. `about` CITEs the record the DEADLINE concerns.

Two dates, one consequence, no action of its own. The scheduler APPENDs the consequence at expiry, and the DEADLINE never fires anything directly. A DEADLINE that could expire with no DECISION is refused at creation unless the pack's statute names that outcome.

### consequence

The union, not a record: a GRANT, a COMMITMENT, a TASK or an expiry. The payload names the type and the record it creates or ends. It rides inside a DEADLINE and takes no id of its own, because it is the DEADLINE's field and not a second thing to keep in sync.

## The five non-records

These five sit beside the records. None has an author, a signature or a history; none can be CITEd. A LABEL, a UNIT, an AMOUNT and an ADDRESS sit inside a record, and a VIEW is rebuilt from records.

### VIEW

`rule`, `inputs`, `asOf`, `format`, `coverage`. A VIEW is DERIVEd, disposable and rebuilt from records. No DECISION or EFFECT CITEs one. A board member may READ a VIEW that compares payloads, and the DECISION still CITEs the records behind it.

### LABEL

A name and a value, such as `class=health` or `retention=10y`. The name is the dimension, and the schema lists the allowed values. A RULE reads LABELs. A LABEL lives inside a record, so it has no identity of its own.

### UNIT

The dimension an AMOUNT counts: euros, shares of one class, seconds, days, months, metres, kilograms or a tally of a named THING. The kernel declares a few for its own algorithm, and a pack declares the rest in its manifest. A working calendar is what turns one time UNIT into another.

### AMOUNT

`{number, unit, uncertainty}`, where `uncertainty` is a percentage of the number, or `{absolute: AMOUNT}`. An estimate carries `estimated=true` as a LABEL. A limit is an AMOUNT held by a GRANT, and a budget is an AMOUNT limit with a DEADLINE.

### ADDRESS

`{kind, value, class}`. How a PARTY is reached: a postal address, a telephone number, an inbox, an API endpoint, an IBAN. One PARTY can hold more than one, and the class lets a gate refuse a channel that may not carry a data class.

Why not records: an appended LABEL would have its own history and a second place to change it, and every record that carried it would become ambiguous. An ADDRESS with its own commit history would be a THING, which is a different claim. A VIEW with an id would invite a CITE, and a CITE of a rendering is how a DECISION ends up resting on a page that was rebuilt differently.

## The grant-evaluation algorithm

The gate does not ask a service whether an action is allowed. It computes the answer from records, and the computation is small enough to reimplement from this section. It runs before an APPEND, an EXECUTE, a DELETE and a SHRED. APPEND, DELETE and SHRED are `publish`; EXECUTE is `execute`; a read is `read`. A failed CHECK refuses the action, and the refusal is a DECISION.

1. Start from deny. An action is refused until a GRANT covers it.
2. Collect the GRANTs whose `grantee` is the acting PARTY, and when the action sits under a TASK, those whose `grantee` is that TASK or an ancestor of it. Then add every ancestor of those GRANTs.
3. Keep the GRANTs whose `actionClass` matches the action's class. A read GRANT never authorizes an execute.
4. Compare the LABELs on the action's subject with the `scope` of every GRANT on the branch. Each scope is a superset or the branch does not cover the action.
5. Walk each surviving GRANT to the root. A REVOKEd or EXPIREd GRANT removes its whole branch, and so does a REVOKEd or EXPIREd ancestor.
6. Sum the EFFECT's `amount` once, and the COMMITMENTs already made under each GRANT in the branch, against that GRANT's limit and each ancestor's limit. A POSTING records the movement and is not a second spend. A limit is read as a sum, never as a counter.

   1. An EFFECT is refused if the parent commit or an earlier record in the same batch carries the same `planId`, or if a single-use GRANT in its branch is already cited by an EFFECT. The batch is one snapshot.
   2. A single-use GRANT's `payloadHash` is null or equal to the EFFECT's `payloadHash`.
   3. A child GRANT is refused unless its `actionClass`, `scope`, `limit`, `deadline` and `keyClass` are within its parent's.
   4. An EFFECT CITEs the latest DECISION touching its GRANT, and the gate reads the parent commit plus the earlier records of the same batch.

7. For an execute or a publish, the gate selects the decision-rights RULE for the subject's `class` and `risk` from the loaded pack, and requires one or more DECISION records whose `choice` is `approve`, whose `subject` equals the EFFECT's `payloadHash`, whose `policy` is that RULE, whose `requiresKeyClass` the deciding PARTY's KEY class satisfies, whose `proposer` equals the EFFECT's, and whose quorum, read from that RULE, is met by that many distinct signing PARTYs; the DECISION's `quorum` is a copy and a mismatch is refused. The deciding PARTY is not the EFFECT's `proposer`. A read needs no DECISION.
8. If two GRANTs survive and disagree, the narrower one decides in this order: a subset scope, then a lower limit, then an earlier DEADLINE, then a higher KEY class. The action needs one branch that covers it, and the intersection of two scopes covers nothing by default.
9. If no branch survives, the gate refuses the action and APPENDs a DECISION with choice refuse, `subject` the action's HASH, and `policy` naming the RULE that failed; the service PARTY signs it, and the refusal is its own verdict, so it does not need a second approval. A refusal is a valid answer.
10. If the log cannot be read, refuse. There is no cached GRANT and no last-known-good policy.

Two GRANTs conflict when they cover the same action with different scopes or limits. The narrower wins because a permission is the intersection of everything that grants it, never the union. A refusal is cheaper than a wrong execute, and the DECISION that records it is what makes the difference visible a month later.

A refusal ends the action, not the RUN. The RUN reads the refusal, names what it tried and moves to its next step or stops with a diagnosis. A STOP is a DECISION that names the reason and what it ended.

## The time model

Trusted time comes from outside the company. A committer's clock is a claim, and an agent sets its own. The kernel takes time from an [RFC 3161](https://www.rfc-editor.org/rfc/rfc3161) timestamp over the record HASH, or from a signed receipt an outside PARTY issued over it. A bank value date or a mail server's `Received` header is an OBSERVATION's `statedAt`, not a proof.

The ANCHOR is `{at, source, proof}`. The source is named, so a reader can tell an authority from a bank from a mail server; the proof is the RFC 3161 token or the outside PARTY's signed receipt over `H(id, signature.value)`, so it proves the content and the signature existed at its signed time, and the kernel keeps a register of sources. A mail `Received` header or a bank value date is an OBSERVATION's `statedAt`, not an ANCHOR proof. A record whose time carries weight carries an ANCHOR: every DECISION, every EFFECT, every POSTING and any record that carries a DEADLINE or a claim with legal or financial weight. An OBSERVATION carries the source's `statedAt` and its own `arrivedAt` in the payload. Its envelope ANCHOR records when it entered the log, because those are different claims and a reader needs all three.

The gate refuses a weighted record whose ANCHOR is missing, whose proof does not verify against a source in the register, whose `at` differs from the proof's signed time, or whose time is earlier than the ANCHOR of any record it CITEs or resolves, including the EFFECT's DECISION and the POSTING's EFFECT. Order matters: a DECISION cannot precede the proposal it decides, and a receipt cannot precede the EFFECT it confirms.

During an outage the gate refuses the append. There is no fallback to the committer's clock and no last-known-good timestamp, because a fallback turns an outage into a quiet rewrite of when things happened. The EFFECT stays unexecuted until a source answers, and a blocked EFFECT is not a stopped RUN.

"What did the company know at T" is a VIEW over the weighted records whose ANCHOR is at or before T. It is a VIEW, so no DECISION or EFFECT may CITE it. A DECISION that has to show what was known CITEs the records the VIEW selected.

An inline `anchor` is the normal case; the kernel post's separate anchor record is the retroactive case. Retroactive anchoring arrives as a new record that CITEs the old one and carries a fresh ANCHOR. The old record keeps its old time and the gap stays visible; nothing is edited to look prompt.

## The pack contract

A pack is four files and a manifest. The files are declarations, and the loader compiles each declaration into the records and mappings it needs; the manifest is the only one the loader reads before it reads the rest. Each file is Markdown with one fenced block the loader reads and prose it ignores. The annex block is one line per noun, `<noun> -> <target>[, <target>...]`. The statute block is a heading per act followed by exactly `starts:`, `tells:`, `proves:`, `late:`, `lateFrom:` and `form:`. The procedure block is a list of `name version` headings and `step: skill, adapter` lines. The gate block is a list of `id: RULE <predicate>` or `id: gate <predicate>` lines and `label: <name> = <value>[, <value>...]` lines. The loader expands each declaration with the manifest's author, key and version; a RULE's source is the manifest record's id, so the compiled record has the nine envelope keys.

### annex.md

One line per trade noun, mapping it to one or more record kinds, defined nouns or one of the five non-records. An invoice is a COMMITMENT; a room is a THING of class place; a crew-day is a UNIT a capacity ACCOUNT counts; a bill of quantities is a VIEW of AMOUNTs. A compound such as booking or risk tier is defined here, because a compound is a fixed phrase and not a new word. The annex carries no rule and no procedure. A noun that maps to nothing fails validation.

### statute.md

One entry per cited act with four content fields: what starts the clock, who must be told, what artifact proves the telling and what happens when it is late. The entry also names the form class the act requires, one of `notarial`, `paper`, `qes`, `structured-electronic`, `text` and `none`, meaning a notarial act, writing on paper, a qualified electronic signature, a structured electronic invoice, the text form and no required form. The pack does not copy the statute; it names the source, the four fields and the form class, so a validator can refuse an EFFECT whose proof is missing. Where the act states the consequence, `lateFrom` is `statute`. Where it does not, the fourth field is the pack's own policy, `lateFrom` names the DECISION that adopted the pack, and the loader refuses the entry without it. A `lateFrom: statute` entry is a claim, and the pack's adopting DECISION must cite the act and the sentence it relies on. The worked example is an illustration, not legal advice; a real pack needs a lawyer's reading of the statute it cites, and the loader cannot make that reading.

### procedure.md

The PROCEDUREs as declarations; the loader compiles each into a record with the manifest's author, key and version. Each step names the skill it loads and the adapter it may call. A PROCEDURE that names a skill or an adapter the manifest does not declare is refused at load. A declaration that cannot be compiled into a complete PROCEDURE record is refused, not defaulted.

### gate.md

The RULEs, the thresholds, the LABELs and the decision rights. Every gate line compiles into a RULE and a gate; every RULE names its owner and source. The kernel names a fixed list of protected gate ids: `kernel/validity`, `kernel/evidence`, `kernel/time-order` and `kernel/single-use`. A pack may add a gate. It may not remove or alter a protected one, so 'weakens' is a set membership test: every protected id must be present in the loaded set with the kernel's predicate. A change to a protected rule is a kernel bump, not a pack. The same file declares the allowed LABEL names and values, and the retention policy: a RULE and a DEADLINE per class.

### pack.json

The manifest holds `name`, `packId`, `author`, `key`, `version`, `kernelVersion`, `dictionaryVersion`, `files`, `requires`, `units`, `adapters`, `skills`, `views`, `conformance` and `signature`. `packId` is the payload HASH of the manifest's document record: the SHA-256 of the canonical manifest bytes without `packId` and `signature`, and the signature is over the UTF-8 bytes of the lowercase hex `packId`, so a change to any field breaks both. `files` maps each file to the SHA-256 of the blob's content, not the git object id, and the manifest lists every file in the pack root except itself. The pack root holds exactly the four files and `pack.json`; `.gitattributes` lives in the parent repository, not the pack root. The loader reads each file by blob id, verifies the hash, and only then parses it; it never reads the working tree. The pack root is marked `-text`, so no line-ending conversion applies, and a symlink is refused. `units` names the dimension and, for a time unit, the calendar, `adapters` names the requirement-29 contract, `skills` maps each skill name to the artifact address the step loads, and `views` carries `{rule, inputs, asOf, format, coverage}`. A skill is a separately published artifact, not one of the four pack files, and the manifest declares exactly the skills the pack's PROCEDUREs name. `kernelVersion` is a semantic-version range over the kernel's `major.minor`: `kernel/1` is the schema string and `1.x` is the range, so a kernel bump cannot load a pack that never claimed it. `dictionaryVersion` is the version the kernel carries, taken from the dictionary's frontmatter or, where it has none, its article date; the loader refuses a mismatch and marks a pack that uses a banned word as `unverified`. The three entries this post widens are named where they are used. `conformance` lists the scenarios the suite will run; until the suite exists the loader records the list and treats the pack as `unverified`; the state is derived from the absence of a conformance EVIDENCE record, not a manifest field.

The manifest is not a record, so a record that names a pack names the manifest's log record: a THING of class document whose payload is a STORE reference with `hash` equal to `packId`, and whose labels carry the name and the version. A RULE's `source` and a bump DECISION's `cites` name that THING, and `subject` may name the `packId` directly because `subject` accepts a payload HASH.

### Validation

A pack is valid when five things hold. Every trade noun in the annex maps to one or more record kinds, defined nouns or one of the five non-records. Every gate is backed by a RULE that exists in the pack or the kernel. Every PROCEDURE names its skills and adapters, and the manifest declares both. Every statute carries the four content fields, a form class and a `lateFrom` that is `statute` or a DECISION. Every file hash matches the manifest, and every file in the pack root is listed. The five are load-time rules. `conformance` is a sixth, separate acceptance gate: a pack that has not passed it is `unverified`, may run in the sandbox and may not run a live EFFECT. This is the staging rule until the suite exists; the kernel post's "does not load" is the rule once the suite can sign an EVIDENCE record.

The loader refuses a pack that fails one of the five, and it refuses the whole set rather than loading a prefix. A half-loaded pack is a kernel with opinions.

### Composition

Packs load in dependency order. `requires` maps a pack name to a semantic-version range; the loader refuses a missing or incompatible dependency and refuses a cycle. The load order is a topological sort with a tie-break by name. Gate ids are `<pack>/<name>`, so two packs cannot collide by accident; the kernel reserves the `kernel/` namespace. Pack names are unique. A pack's values for the kernel's `class` and `risk` names are scoped to that pack. Two packs that add the same pack-level LABEL name with different values conflict; the loader refuses both whole until a DECISION names one `packId` as the winner, and the loser and its dependents are then refused.

A pack may add nouns, compounds, LABELs, RULEs, UNITs, ACCOUNTs, ADDRESSes, adapters, VIEWs, gates, thresholds, PROCEDUREs, statutes and fixtures. It may not introduce a record kind, a verb or a KEY class, open a second log that allows DELETE, drop a kernel gate or soften the evidence rule.

### Versioning

The kernel and every pack carry a semantic version. A kernel bump needs a compatibility declaration: the manifest names the kernel range it supports, and every affected pack ships the DECISIONs and the records that SUPERSEDE the ones the change touches. A pack bump needs a DECISION of its own, whose `subject` is the new `packId` and whose `cites` name the manifest record that carried the previous one; it SUPERSEDEs the records the change touches or states that it changes no record. The first version needs no DECISION.

A pack bump that changes a predicate, a threshold or a scope is a DECISION. The loader refuses a pack whose `packId` is not the one the last DECISION named.

## The schema rules

Twelve statements. They are the contract: some are checks a validator runs, some are claims the schema makes, and the audit that gates this site checks their words against the dictionary [Seven Nouns and Eighteen Verbs](/blog/entry/2026-seven-nouns-eighteen-verbs) defines. They cover the envelope, the record, the nouns, the GRANT, the time and the pack. They do not say whether the company is doing the right thing.

1. The envelope holds the kind, the id, the schema, the author, the ANCHOR, the records it CITEs, the LABELs, the payload and the signature.
2. The id is the SHA-256 of the canonical bytes without the id, the signature and the ANCHOR, and the signature covers the id.
3. A validator recomputes the id, verifies the signature, resolves every id-valued field, matches the LABELs, compares any payload HASH and applies every gate.
4. Eleven of the twelve defined nouns are built from the seven record kinds; a consequence is a GRANT, a COMMITMENT, a TASK or an expiry.
5. A VIEW, a LABEL, a UNIT, an AMOUNT and an ADDRESS take no APPEND and carry no id.
6. No record is edited; a correction is a new record that SUPERSEDEs one that was right or REVERSEs one that was wrong.
7. A payload above the size ceiling lives in a STORE that the record CITEs, and the log holds only its HASH.
8. A GRANT pairs a scope of LABELs with an action class, a limit and a DEADLINE, and the gate refuses an action outside it.
9. A DECISION CITEs the HASH or record it chooses and the records it rests on, and silence never DECIDEs.
10. An EFFECT needs a GRANT and a DECISION, and an EFFECT that moves an AMOUNT APPENDs a POSTING.
11. A weighted record carries an ANCHOR from a source outside the company, and the gate refuses it when the source is silent.
12. A pack adds nouns and gates; it never adds a record kind, a verb or a KEY class, and it never removes a kernel gate.

The kernel's statements 2, 8, 10 and 11 and the dictionary's axioms 1 and 3 still bind; these twelve do not restate them.

## A worked example

Finance operations, pack 3. The four files, shortened, then one GRANT and one POSTING with the fields a validator reads.

```md
# annex.md
invoice -> COMMITMENT
payment -> EFFECT, POSTING
supplier -> PARTY
period -> LABEL period
vat -> RULE
cash -> VIEW
```

```md
# statute.md
## §14 and §15(1) UStG
starts: the supply is performed
tells: the customer
proves: the XRechnung or ZUGFeRD invoice and its delivery receipt
late: the input-tax deduction is denied until a proper invoice arrives
lateFrom: statute
form: structured-electronic
```

```md
# procedure.md
issue-invoice 3
step: invoice-match, none
step: serial-number, none
step: receivable-post, books
step: invoice-send, mail
```

```md
# gate.md
period-open: RULE period.locked = false
three-way: RULE order, delivery note and invoice agree
cash: RULE sum of POSTINGs per account
limit: gate payable <= 2000 EUR, DEADLINE 2026-12-31
label: period = 2026-11
label: class = payable, books, authority
label: risk = low, high
```

The four files hash to the values in the manifest, and the manifest's `packId` is the hash of its own canonical bytes without `packId` and `signature`. The signature is an example value; a validator checks it against the author's KEY. The accounts and the deadline are records outside the excerpt, like every other CITE. The pack is `unverified` by construction because it uses `skill`, which the dictionary bans; the dictionary amendment is the next change.

```json
{
  "name": "finance",
  "packId": "2c5753289af47758a14e4322e0257a61745ca9864a73e2b4bea62876cb1840fb",
  "author": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1",
  "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8",
  "version": "3.0.0",
  "kernelVersion": "1.x",
  "dictionaryVersion": "2026-11-05",
  "files": {
    "annex.md": "effd29ad0a29c6d026e6ebef2609613d46372839bd03001666d6ad4bcfd53dc5",
    "statute.md": "5c8d6e60541c88e3c6f78057d4204e0d351c54b39b633f91257809b6f1c0a5ea",
    "procedure.md": "0c3e182d72433f90a7c983a09442e4a5a56e205be8eae86d44cbbace9b6f7db3",
    "gate.md": "d5d65eb5305fe27eebc5e6db4032afa7ab16d45b13106550967af1f6f1bfb8b0"
  },
  "requires": {},
  "units": {
    "EUR": {
      "dimension": "currency"
    }
  },
  "adapters": {
    "bank": {
      "contract": "requirement-29"
    },
    "books": {
      "contract": "requirement-29"
    },
    "mail": {
      "contract": "requirement-29"
    }
  },
  "skills": {
    "invoice-match": "sha256:4c1e0a2b9d7f",
    "serial-number": "sha256:7a3f9c1d2e40",
    "receivable-post": "sha256:6f0b8e2d4a13",
    "invoice-send": "sha256:1d7c9a5e3b86"
  },
  "views": {
    "cash": {
      "rule": "cash",
      "inputs": [],
      "asOf": null,
      "format": "table",
      "coverage": "all"
    }
  },
  "conformance": [
    "invoice-pay"
  ],
  "signature": {
    "alg": "ed25519",
    "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8",
    "value": "215a9ad8223c5fed0a70544398bdebe11c1b3d57d437723558318f9acb445e1170cedb08993f4e1b428aa516f0396ce6542f5d5d152d3e6bfacf9ee2a60b05f5"
  }
}
```


```json
{
  "kind": "THING",
  "id": "0a044b974ea262626edd7804603b7c3d547417998666c7bcb9a74d76841a2bac",
  "schema": "kernel/1",
  "author": { "party": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8" },
  "anchor": { "at": "2026-11-07T08:00:00Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "authority" },
  "payload": {
    "class": "grant",
    "grantor": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1",
    "grantee": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75",
    "actionClass": "execute",
    "scope": ["class=payable", "risk=high", "period=2026-11"],
    "limit": { "number": 2000, "unit": "EUR", "uncertainty": 0 },
    "deadline": "274da5d9561a810abfc606b197a1dfca5996926ba868ba8c6185af2478871f0c",
    "parent": null,
    "keyClass": "service",
    "singleUse": false,
    "payloadHash": null,
    "consumedBy": null
  },
  "signature": { "alg": "ed25519", "key": "5b05d026d8f6668cd3a653d689f3f32363606e8ed5e1e047e3b883fa0ad60da8", "value": "39076d69c3fcd5e9384874c62fcc3ff7162b0ff450cebc7eef489f5f9e61f6198fc6f46c66a70403cc3cc0c5b298240065a326ddab0c12a52d39a351e3ad5501" }
}
```

```json
{
  "kind": "POSTING",
  "id": "08eecbc15a8d1a2bce094c53e9db5788db4b1673819c01efe36e123bab9e466d",
  "schema": "kernel/1",
  "author": { "party": "8d3c8851127665051754678ec4a80392be436a054512d585673363aebd244f75", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc" },
  "anchor": { "at": "2026-11-07T09:10:02Z", "source": "rfc3161:tsa.example", "proof": "rfc3161:token" },
  "cites": ["4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f"],
  "labels": { "owner": "8d1649b80f62d20e3120acaf2a01f072366985bb47cc5551c02521337bc552f1", "class": "books", "period": "2026-11" },
  "payload": {
    "entries": [
      { "account": "d8cf1999f559a0da0169750283bf40299e019bd0a9a12093f46bab40b84297cb", "amount": { "number": 1190, "unit": "EUR", "uncertainty": 0 } },
      { "account": "fb430ec2914731b91231fe443fa0ab2583763f1df6d65a028d278c7e4a0eaf97", "amount": { "number": -1190, "unit": "EUR", "uncertainty": 0 } }
    ],
    "effect": null,
    "source": "4ef78c68cf94667003f4fe22523ec41c75ea2878dbe48d624a09a1633bdb4f9f",
    "period": "2026-11",
    "reversalOf": null
  },
  "signature": { "alg": "ed25519", "key": "59a9649cd4c8c030a759a6fdbe1dd676e5d14507dab8fa158c356ac86033a5fc", "value": "efb47f300a97c1f2e67ea23fc8cb44b7abc721ea243b2eb564c1a316fab1e3bfbe6f6a700f45e5f5fc200a1956b2ef5fc471de1204cf20cf48527fb5a15e4619" }
}
```

The validator recomputes the ids and the `packId`, resolves every CITE, and checks each file hash against the manifest. It reads the GRANT as authority to execute a payable in period 2026-11 up to 2000 EUR with a service KEY, and finds its DEADLINE. It checks that the two amounts sum to zero in one UNIT and that the period is open. The kernel did not change for any of it.

## What the schema does not decide

Storage. The schema needs a total order and content addressing, and it does not care whether the log is git, a hash-chained table or a content-addressed STORE with a Merkle root. What it does require is a single-parent chain: a merge commit is two chains and is refused as a log commit. A validator needs the bytes and the parent commit; the rest is an implementation. A batch is the ordered list of records in one commit, and the order is the commit manifest's list, not the git tree. The gate reads every ancestor of the candidate commit, not only the first parent. Append-only is the store's contract: a signed commit per append, fast-forward only, a pre-receive hook, a second mirror. A validator refuses a shallow clone or a missing parent. The schema cannot detect a rewrite that drops an uncited record; the mirror and the hook are what make the rewrite visible.

Encryption. A STORE names its scheme, and a payload names the STORE and the HASH. The schema does not choose a cipher, a KEY scheme or a rotation period. A payload that can identify a natural person is a STORE reference, never inline; `THING.name` for a person and `PARTY.addresses` are STORE references or pseudonymous ids. Erasure is SHRED of the encryption KEY that protects the ciphertext, which a STORE of kind `vault` holds. The record, its id, its author, its owner and its hash remain, and a hash tied to a person is still personal data, so whether the shred satisfies a legal erasure is a legal judgement rather than a schema property.

User interface. A VIEW is disposable, and the schema says only that no DECISION or EFFECT may CITE one. A board page, a digest, an index and a diff are all VIEWs; their layout is not a schema question.

Model behaviour. A RUN records the model id, the prompt HASH and the manifest. The schema does not say which model to use, how to prompt it or when to route to another.

Business strategy. The schema constrains what a record may claim and when it may land. It does not choose which customer to serve, which price to set or which risk to take. Those are DECISIONs, and the schema makes them visible without making them for anyone.

## The next artefact

The schema is the contract. The conformance suite is the next artefact. A schema without a test suite is a claim, and two validators can agree on the envelope while disagreeing on the grant algorithm with no test to say which is wrong. Until the suite exists, this post is that claim.

The kernel and the vocabulary are fixed enough to build from now: seven kinds, eighteen verbs, one envelope and four pack files. A builder should write the envelope validator and its refusal path first, because every later check depends on a record that can say no.
