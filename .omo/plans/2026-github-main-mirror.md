# Forgejo → GitHub `main` mirror for Vercel deploys

## TL;DR

Production still runs on Vercel, but since the Forgejo migration there is no
automatic deploy path: the local Vercel CLI has no credentials and the live
site is stale. Add a Forgejo Actions workflow that force-pushes only
`main` to the existing GitHub repository
(`TomSeestern/TomSeestern.github.io`, formerly `tomsegbers.de`) over a
repository-scoped SSH deploy key. Vercel's GitHub integration then builds
and publishes `main` to https://tomsegbers.de.

## Scope

- `.forgejo/workflows/mirror-main.yml` — new workflow, `push` on `main` only
- `docs/security/github-known-hosts` — GitHub SSH host keys, strict checking
- `docs/adr/0002-github-main-mirror.md` — decision record
- `README.md` — Deployment section describes the mirror instead of manual CLI
- GitHub: write deploy key on `TomSeestern/TomSeestern.github.io`
- Forgejo: repository secret `MIRROR_SSH_KEY` (private half, never committed)

Not in scope: changing the Vercel project's Git connection, renaming the
GitHub repository, mirroring `dev` or tags, GitHub Actions on the mirror.

## Steps

- [x] **1. Audit.** Confirm the live deploy target, the GitHub counterpart,
  and that every GitHub branch is an ancestor of Forgejo `main` (force-push
  loses no work).
- [x] **2. Workflow and host keys.** Add `mirror-main.yml` and the committed
  `docs/security/github-known-hosts`; validate the YAML.
- [x] **3. Credentials.** Generate a dedicated Ed25519 key pair, register the
  public half as a write deploy key on GitHub, store the private half as the
  Forgejo Actions secret `MIRROR_SSH_KEY`.
- [x] **4. Document.** Add ADR-0002 and update the README Deployment section.
- [x] **5. Commit and push.** Conventional commit, push to Forgejo `main`.
- [x] **6. Verify mirror.** Forgejo run succeeds; GitHub `main` SHA equals the
  pushed Forgejo SHA.
- [x] **7. Verify deploy.** Vercel rebuilds from GitHub `main`: live
  `/sitemap.xml` and `/robots.txt` return 200 and `/blog` lists all six
  entries. If Vercel does not pick the push up, report the dashboard step
  instead of claiming success.

## Rollback

Delete the workflow file, remove the GitHub deploy key, and delete the
Forgejo secret. The previous manual `vercel --prod` path is unaffected.

## Risks

- Force-push overwrites GitHub `main` by design; Forgejo is the only
  writable source. Verified safe before enabling: GitHub `main` and `dev`
  are ancestors of Forgejo `main`.
- Vercel's production branch cannot be inspected without dashboard
  credentials. The mirror is verified independently; the deploy is verified
  against the live site.
- The GitHub mirror is public because the Forgejo repository is public. No
  secret material is mirrored.
