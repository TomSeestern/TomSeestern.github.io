# ADR-0002 — Forgejo `main` mirror to GitHub for Vercel deploys

- Date: 2026-10-24
- Status: accepted — **superseded in part by [ADR-0003](0003-deploy-gated-on-check.md)**,
  which moves the mirror into `check.yml` so no deploy can outrun the gates.
- Supersedes: the README's “manual `vercel --prod` or a Forgejo job” deployment
  procedure, which left production stale after the Forgejo migration.

## Context

Production is served by Vercel at https://tomsegbers.de. Before the migration to
Forgejo (2026-08-09) the Vercel project deployed from the GitHub repository that
held this site. That repository still exists as
`TomSeestern/TomSeestern.github.io` (GitHub redirects the old `tomsegbers.de`
name); every branch there is an ancestor of Forgejo `main`.

After the migration, pushes to Forgejo no longer reach GitHub, so Vercel stopped
deploying. The README documented two manual paths: `vercel --prod` from a
developer machine, or an ad-hoc Forgejo job. Neither exists: this checkout has no
Vercel credentials (`~/.local/share/com.vercel.cli/auth.json` is empty) and
`.forgejo/workflows/` has no deploy workflow. By 2026-10-24 the live site was
about eleven days behind: `/sitemap.xml` and `/robots.txt` returned 404 and the
blog listed three of six posts.

The site is a statically generated Next.js app with no database, no auth, and one
server action (the Resend contact form). Vercel's own build image is sufficient;
the project does not need a self-hosted deploy pipeline.

## Decision

Mirror exactly one branch from Forgejo to GitHub and let Vercel's Git integration
deploy it.

- **Source of truth:** `TomSegbers/tomsegbers-de` on Forgejo. `main` remains the
  only integration branch.
- **Mirror:** `TomSeestern/TomSeestern.github.io` on GitHub, force-pushed on
  every Forgejo `main` push by `.forgejo/workflows/mirror-main.yml`. No feature
  branches, no `dev`, no tags. GitHub is read-only by policy; direct GitHub
  commits are overwritten by the next mirror run.
- **Trigger:** `push` to `refs/heads/main` only. No schedule, no
  `pull_request`, no tags.
- **Authentication:** a dedicated Ed25519 key pair. The public half is a
  write-enabled deploy key on the single GitHub repository; the private half is
  the Forgejo Actions secret `MIRROR_SSH_KEY`. No personal access token is
  stored in CI.
- **Host verification:** GitHub's published host keys live at
  `docs/security/github-known-hosts` and are enforced with
  `StrictHostKeyChecking=yes`.
- **Self-check:** after pushing, the job compares `git ls-remote` on GitHub with
  the checked-out commit and fails if they differ.
- **Vercel:** the project's Git connection builds the GitHub repository's `main`
  branch. The mirror does not call Vercel; a deployment is the Git integration's
  response to the mirrored push.
- **GitHub branch protection:** `main` carries none. The pre-migration rules
  (pull request, one approval, three required GitHub Actions checks, force-push
  disabled, admins enforced) rejected the deploy key with `GH006` and referenced
  workflows that no longer exist once the Forgejo tree replaces `.github/`.
  Protection was removed on 2026-10-24. GitHub write access stays owner-only and
  the mirror remains read-only by policy.

## Consequences

### Positive

- Merge to Forgejo `main` becomes the only action needed to ship; no local
  credentials and no manual CLI step.
- The deploy credential is scoped to one repository and one capability.
- One mirrored ref keeps feature work and tags off the deploy surface.
- The mirror job fails loudly on a missing secret, a host-key mismatch, or a
  push that does not land.

### Negative / risks

- **Force-push is intentional.** GitHub divergence is not mergeable; the next
  Forgejo push restores the Forgejo commit.
- **Production deploys on every `main` push**, not on a signed tag. For a
  single-contributor portfolio this matches the existing branch-deploy model.
- **Deploy-key rotation is manual.** Replace the GitHub deploy key and the
  Forgejo secret together; a stale key fails the mirror.
- **GitHub SSH host-key rotation** requires updating
  `docs/security/github-known-hosts`; strict checking fails closed until then.
- **The Vercel project's production branch cannot be inspected from this
  checkout.** If it does not point at the GitHub repository's `main`, the mirror
  still succeeds but no deployment follows; that is a dashboard setting, not a
  workflow failure.
- **The GitHub mirror is public** because the Forgejo repository is public. No
  secret material is mirrored, but the source history is equally public on both
  hosts.
