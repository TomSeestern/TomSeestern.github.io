# Boulder: Three dispatch content

Status: completed and pushed — commit `7cdd8ed`
Plan: `.omo/plans/2026-three-dispatch-content.md`
Started: 2026-10-23
Completed: 2026-10-23

## Tasks

- [x] T1 write Nix dispatch (`2025-12-31`)
- [x] T2 write Unraid v4 dispatch (`2026-02-28`)
- [x] T3 write LLM-agent manifesto (`2026-10-23`)
- [x] T4 update exact blog count in e2e fixture
- [x] T5 run static and Jest gates
- [x] T6 build and verify routes in browser
- [x] T7 commit and push

## Verification

Evidence: `.omo/evidence/task-three-dispatch-content.txt`

- Six blog files parse; new body word counts: 1,535 / 1,512 / 1,198.
- Typecheck, lint, Prettier, 45 Jest suites / 251 tests, and production build (173 pages) pass.
- Production Chromium: six blog links in correct newest-first order; three new routes return 200 with correct H1/body/onward cards; tag archives render; no 375px overflow.
- README `home.webp` and `blog.webp` refreshed; image budget gate passes.
- `dynamic-content.spec.ts` serial Chromium run: 3/3 passed. A parallel run timed out in the dev server and was re-run serially rather than treated as a content failure.


## File ownership

- `content/blog/2025-falling-for-nix.md`
- `content/blog/2026-unraid-declarative-homelab-v4.md`
- `content/blog/2026-what-llm-agents-are-missing.md`
- `e2e/fixtures/expectations.ts`
- `.omo/plans/2026-three-dispatch-content.md`
- `.omo/boulders/task-three-dispatch-content.md`
- `.omo/evidence/task-three-dispatch-content.txt`

## Guardrails

- No source-repo identifiers, credentials, hostnames, IPs, internal URLs, or incident details.
- No schema, layout, route, or design changes.
- No impermanence/disko claims dated before they existed.
- No mention of the manifesto's source project or its unique terminology.
