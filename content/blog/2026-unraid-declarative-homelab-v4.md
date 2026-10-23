---
id: 2026-unraid-declarative-homelab-v4
title: "Unraid, Declaratively: The Fourth Homelab Iteration"
articleDate: 2026-02-28
articleContent: "Version four keeps Unraid's hand-edited state reviewable, testable, and recoverable without pretending the appliance is NixOS. The change is a smaller diff, not another stack of containers."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - Unraid
  - Homelab
  - Infrastructure as Code
  - Docker
  - Home Assistant
---

# Unraid, Declaratively: The Fourth Homelab Iteration

The fourth iteration of my homelab is a smaller diff, not a bigger server.

The [second iteration](/blog/entry/2020-homelab-v2-the-evolution-of-my-homelab-journey-second-edition) was about learning what hardware could do. The [third](/blog/entry/2024-homelab-v2-transforming-homelab-with-advanced-automation) was about adding services: containers, storage, monitoring, automation, and enough moving parts to make a dashboard feel like progress.

The fourth is about operating the result: making the existing stack reviewable, testable, and recoverable rather than adding another one.

That is harder than it sounds, because Unraid is an appliance, not a declarative operating system. You cannot point a flake at it and rebuild the array from a lock file. The web UI, the boot USB, the license, the disk assignments, and the array itself are part of the product. A lot of the server is deliberately stateful, and pretending otherwise is how people lose data.

But a surprising amount of what makes the server mine is text. Docker Compose files, Docker XML templates, user scripts, and Home Assistant configuration can live in Git. So can the validation around them. The repository does not own the server. It owns the text that describes selected parts of it.

## What “declarative” can mean on an appliance

The useful distinction is between layers:

- Unraid itself, the array and parity, shares, the license, the boot USB, hardware passthrough, and the web UI stay manual and rare. This layer gets a runbook, not a fantasy.
- Compose projects, Docker XML templates, user scripts, and authored Home Assistant YAML belong in Git, with reviewable changes and validation.
- appdata, databases, Home Assistant's `.storage`, logs, media, and VM disks get backed up. They do not belong in a configuration repository.
- Server-side environment files and credentials stay out of the repository. The repository records their shape, never their values.

The repository layout reflects that split:

```text
configs/
  docker-compose/   # one directory per Compose project
  docker-templates/ # Unraid Docker XML templates
  scripts/          # User Scripts
  homeassistant/
    desired/        # authored, pushable YAML
    snapshot/       # generated from .storage, read-only
```

The Nix flake in this repository is easy to misunderstand. It does not make Unraid declarative. It packages the command-line tools and pins the versions used to inspect, validate, and sync the server. Nix is the workbench, not the appliance.

That distinction matters. A declarative workflow comes from how you change a system, not from the operating system itself.

## The loop: pull, edit, validate, dry-run, apply

The workflow starts by pulling the current server state into the repository. The server may be newer than the last commit, and a local edit based on a stale copy is just a confident way to undo a change made since the last pull.

```bash
nix run .#backup
nix run .#backup -- --check
```

`--check` is a dry run. It compares content with checksums and ignores owner, group, permissions, and timestamps, so a directory mtime cannot masquerade as drift. Only real file transfers and deletions count.

Then I edit the text. A Compose image tag, a volume mapping, a script, a Home Assistant automation. The change is made in the repository, not first in the live UI. That is the part that turns a server into something I can review.

Validation comes next:

```bash
nix flake check
nix run .#scan -- --quiet
```

`nix flake check` runs the formatting check, parses every YAML file, validates each Compose project with `docker compose config` and dummy environment values, and checks the Home Assistant layout against its pinned version. `scan` runs a static security scan and checks pinned image versions for drift. Neither command proves the service will behave correctly, but they catch the boring failures before they reach the server.

The push is deliberately two steps:

```bash
nix run .#update
nix run .#update -- --apply
```

The first command is a dry run. The second one actually mirrors the repository to the server. Mirroring is the important word: `rsync --delete` removes files on the server when they disappear locally. That is what makes the repository a source of truth instead of an ever-growing pile of leftovers. It is also why the dry run is not a formality.

Server-side `.env` files are excluded from the push. The repository carries `.env.example` files and placeholders; the real values stay on the server. Secrets are the one place where “the repo is the source of truth” would be actively dangerous.

A deployment finishes when the service is healthy and the change is committed, not when `rsync` exits zero. Those are different claims, and the gap between them is where most homelab surprises live.

## Home Assistant is its own problem

Home Assistant is the clearest example of why “just put it in Git” falls short. It is a UI-first system. The UI writes state into `.storage`, integrations own registries, and the YAML files are only part of the picture.

The repository splits the problem in two:

- `desired/` is authored configuration that can be pushed back.
- `snapshot/` is generated from the live `.storage` registries and dashboards. It is read-only in the repository and must never be hand-edited.

The commands follow that split:

```bash
nix run .#ha-check
nix run .#ha-deploy
nix run .#ha-deploy -- --apply
nix run .#ha-drift
nix run .#ha-pull
```

`ha-check` runs Home Assistant's own `check_config` against a staged copy of the authored configuration, using a throwaway secrets file. The live configuration directory is not touched. `ha-deploy` runs the same check before pushing and refuses to continue if it fails. `ha-drift` compares the live instance against the committed snapshot. `ha-pull` refreshes both sides.

The snapshot is a readable model of the parts that tend to drift: areas, entities, devices, dashboards, customizations, and resources. It is not a full backup of the Home Assistant database. The database, secrets, custom components, and media remain runtime state and are outside this mirror.

The most useful check is a restore drill. A staged configuration, the sealed identity registries, and the real secrets are used to boot a throwaway Home Assistant container on a separate port. The drill waits for `check_config` to pass and for the frontend to answer. The live instance and its port are never touched.

A backup you have never restored is a rumour. The drill is how the rumour becomes a fact.

## Secrets and the mirror

The mirror is intentionally incomplete.

Server-side `.env` files stay on the server. Home Assistant `secrets.yaml` stays on the server. Private keys, runtime tokens, and anything that only exists to make a service start are outside the sync path. The repository contains examples and placeholders so the shape of the configuration is visible without exposing the values.

That boundary has to be enforced by exclusion rules, not by memory. A mirror with `--delete` is a useful tool precisely because it is ruthless. The same quality makes it dangerous if a secret happens to live in the wrong directory.

The rule I keep coming back to is simple: the repository should contain the decisions, not the keys.

## What I would not put in Git

Not every part of a homelab wants to be text.

I would not try to manage the array assignments, the disk layout, the Unraid license, the boot USB, VM disk images, appdata databases, logs, media, TLS private keys, or runtime secrets from this repository. Some of that is too large. Some of it is too sensitive. Some of it is too specific to the machine.

A repository that tries to own all of it becomes a backup system with worse ergonomics.

The goal is not to make Unraid immutable. The goal is to make the mutable parts explainable.

## What changed in version four

The earlier iterations were about capability. This one is about boundaries.

1. Pull before push. The server may know something the repository does not.
2. Dry-run by default. Mirroring deletes. Review the plan before applying it.
3. Generated state is not source. Snapshots and exports are evidence, not editing surfaces.
4. Secrets never enter the mirror. The repo carries the shape, the server carries the value.
5. Validate with the same toolchain everywhere. A local pass and a CI pass should not use different versions of the truth.
6. Test the restore. A backup is not enough on its own.
7. Keep a manual runbook for the appliance layer. Some things should stay deliberate.

The result still needs a web UI. I use it. The difference is that when a change matters, I can explain where it came from, what it will touch, and how to put it back.

“Declarative” is a direction, not a binary. On an appliance like Unraid, the honest version is a small, well-guarded text layer around a stateful core — enough structure to make the server reviewable, and enough humility to leave the rest alone.

That is the fourth iteration. Not more services. A better way to change them.
