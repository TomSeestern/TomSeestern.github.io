# ADR-0003 — Deploy is gated on the full check

- **Status:** accepted
- **Date:** 2026-10-24
- **Supersedes in part:** [ADR-0002](0002-github-main-mirror.md)

## Context

ADR-0002 mirrored `main` to GitHub from a standalone workflow
(`mirror-main.yml`) triggered by `push`. `check.yml` was triggered by the same
event and owned every gate — typecheck, build, lint, format, content audit,
contrast, design tokens, image and font budgets, unit tests, and the Storybook
render smoke.

The two workflows shared no dependency edge. Nothing in `.forgejo/workflows/`
used `needs:` or `workflow_run:`, and the repository has no required status
check (`AGENTS.md` R16.5). The consequence was structural rather than
hypothetical: the mirror job is a checkout plus one `git push` and finishes in
about a minute, while Check takes several, so production received every commit
*before* the first gate that could object.

A second path had the same effect. `screenshots.yml` committed its regenerated
images with `[skip ci]` and pushed to `main` directly, so that commit could
advance the Forgejo branch without producing a mirror at all — leaving GitHub
and Forgejo divergent, which is the exact invariant ADR-0002 exists to hold.

## Decision

The mirror is the **final step of `check.yml`**, guarded by
`if: github.ref == 'refs/heads/main' && success()`. `mirror-main.yml` is
deleted. `screenshots.yml` runs on `workflow_dispatch` only and no longer
carries `[skip ci]`.

Two details make the step safe to run inside a longer job:

- **Tip guard.** The concurrency group runs `cancel-in-progress: false`, so an
  older run can still be executing when a newer one finishes. Before pushing,
  the step compares `git ls-remote origin refs/heads/main` with `HEAD` and exits
  without pushing when the run is not the tip. Without it, a slow older run
  would force-push GitHub backwards.
- **Self-verification.** After the push it re-reads the remote SHA and fails if
  it does not match `HEAD`, as the standalone workflow did.

## Consequences

- A red gate now blocks deploys. That is the point, but it changes the failure
  mode: a broken `main` produces a *stale* production site rather than a fresh
  broken one. Rollback of an already-deployed bad commit is still the Vercel
  dashboard.
- Deploy latency grows by the full gate run — roughly four minutes for the
  end-to-end suite, plus install and build. Acceptable for a single-contributor
  portfolio where deploys are not time-critical.
- The whole pipeline now depends on one runner label. If the `linux` runner is
  offline, neither CI nor deploys happen; previously a deploy could still land.
- Check and `playwright.yml` both run the end-to-end suite. That is redundant
  and could be collapsed later; it is left in place so this change does not
  also alter the Playwright workflow's artifact upload.

## Rollback

Restore the standalone workflow from git history
(`git show HEAD~1:.forgejo/workflows/mirror-main.yml`) and delete the
`Mirror main to GitHub` step from `check.yml`. The mirror mechanism itself —
deploy key, `MIRROR_SSH_KEY`, committed host keys — is unchanged and is
described in ADR-0002.
