---
id: 2025-falling-for-nix
title: "Falling for Nix: One Flake, Three Machines"
articleDate: 2025-12-31
articleContent: "I expected a package manager and found a way to describe three machines as one reviewable system. The learning curve was real; so was the payoff."
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - NixOS
  - Nix
  - Declarative Configuration
  - Linux
---

# Falling for Nix: One Flake, Three Machines

For a long time, setting up a machine was a test of memory.

I knew which packages to install, which configuration files to edit, which service to enable, and which fix I had applied the last time something broke. The knowledge lived in shell history, browser bookmarks, and the part of my brain that wakes up when a laptop is misbehaving. It worked. It also meant every machine was a slightly different version of the same story.

I did not start using Nix because I wanted a new hobby. I started because I wanted fewer surprises.

By the end of 2025, my desktop, laptop, and home server are described by one flake. That sentence sounds modest. For me it is the biggest change in how I think about machines since I stopped installing Linux from scratch.

## The first surprise: it is not just a package manager

Nix is a package manager in the same way Git is a folder watcher. The package part is real, but it is not the interesting part.

The interesting part is that a Nix expression describes a build, and a flake describes a whole system: inputs, packages, modules, users, services, and the small policy decisions that normally live in a wiki page nobody updates. The lock file pins the inputs. The build produces a closure. The machine activates a generation.

The commands are almost disappointingly plain:

```bash
nix flake check
sudo nixos-rebuild switch --flake .#<host>
```

The first command asks whether the description is internally consistent. The second makes the machine match it. The angle brackets are doing real work. I do not want a command that can accidentally target the wrong machine.

The first week felt less like learning a tool and more like learning a new grammar. I copied snippets, misread option names, and hit evaluation errors that pointed at three files I had never opened. The error messages were the tutorial. I did not enjoy all of it.

Then something clicked.

## The mental model that finally made sense

The old model was a sequence of actions: install this, edit that, enable the other thing, restart, hope.

The Nix model is a set of facts: this machine has these packages, this service is enabled with this configuration, this user owns this file, this secret is available at activation, this is the version of nixpkgs the result was built against.

Once I stopped trying to translate shell commands one-for-one, the errors became less mysterious.

- A package is an input to a build, not a thing I install by hand.
- A module is a policy, not a script.
- A generation is a rollback point, not a victory lap.
- A lock file is a boundary between “works today” and “worked in March.”

That last one matters more than I expected. A flake does not promise that the world will never change. It promises that the change is explicit.

## What one flake looks like for me

I have three hosts: a desktop, a laptop, and a server. They share a baseline, and each one adds the parts that belong to its role. The desktop gets the graphical environment and the development tools. The laptop gets its hardware quirks and a newer kernel. The server gets the services and the storage. The differences are small enough to read in one sitting.

The shared baseline is the important part. Firewall defaults, the user account, the shell, the time zone, the Nix settings, and the common system modules are defined once. A host file is a delta, not a photocopy.

Home Manager handles the user layer. My shell, Git configuration, editor settings, terminal, browser policies, and a long list of small preferences are generated from modules. I have not edited my `.zshrc` by hand in months. I am not brave; the file is generated.

DevShells turned out to be just as useful as the system configuration. A project can declare the compiler, formatter, language server, and command-line tools it expects. `direnv` loads the shell when I enter the directory. The same project gets the same toolchain on every machine, and a new machine does not need a separate install ritual before it can build anything.

Secrets are handled with `sops-nix`. The encrypted material lives with the configuration; the private key lives on the machine; the secret is decrypted at activation and exposed at a path the service expects. That is not a claim that secrets are now risk-free. It is a claim that the boundary is visible and does not depend on a forgotten `.env` file in a home directory.

A local binary cache made the rebuilds tolerable. Without it, the purity is real but so is the waiting. With it, a rebuild is usually a few minutes and sometimes less. This is the unglamorous part of the story: a good build graph still needs good infrastructure around it.

## What I like now

The first thing I like is that a change is reviewable. I can look at a diff and see that a package moved, a service option changed, or a module gained a new rule. A diff is a better memory than a terminal scrollback.

The second is that a new machine is mostly a mapping exercise. The hardware file still comes from the machine, because hardware is stubborn and full of exceptions. Everything above that layer is a choice I can read, copy, and adjust. The first boot is not a blank page.

The third is rollback. When a rebuild goes wrong, the previous generation is still there. That does not make me careless, but it does make the system feel less fragile. The escape hatch is part of the design, not an admission that the design failed.

The fourth is development environments. I used to keep a mental list of tools for each project. Now the project keeps the list. That is a small change with a large effect on how often I wonder why a build behaves differently on another machine.

The fifth is the quiet one: less folklore. When something breaks, I can point at a revision instead of a habit. When I want to know why a machine has a package, I can follow the module that put it there. The configuration is not perfect documentation, but it is a much better starting point than “I think I installed that in 2022.”

## The cost is real

I would not recommend Nix to someone who wants a faster way to install a browser. The learning curve is real, and it is steep in the places that matter.

Nix has a lazy evaluation model, its own language, and error messages that occasionally read like a riddle. Packaging software can be straightforward, and it can also turn into an afternoon of reading upstream build scripts. Build times are better than they used to be, but they are not free. Stateful services still need care, because a database does not become declarative just because its configuration file does.

I still use containers, imperative tools, and plain shell scripts where they fit. Declarative does not mean every byte of runtime state belongs in a Nix file. A configuration that pretends state does not exist is just a configuration that will fail later.

The language is not the hard part forever. The hard part is learning where the boundaries are.

## Rules I would give past me

- Pin the inputs and upgrade them deliberately. “Latest” is not a strategy.
- Keep modules small and single-purpose. A module called `desktop.nix` that does twelve unrelated things is a future incident.
- Separate hardware facts from policy. Generated hardware files are not the place to express taste.
- Use one host as the canary. Read the diff before rolling the change everywhere.
- Keep plaintext secrets out of the repository and out of the Nix store.
- Let evaluation fail. Do not `--impure` your way out of a design problem unless you can explain why the impurity is the point.
- Learn the language. Copy-paste has a ceiling, and the ceiling arrives at the worst possible time.
- Keep a known-good generation and a recovery path. Confidence is not a backup.
- Do not declaratively manage data. Manage the system around it, then back the data up separately.

## The part that surprised me

I expected the win to be reproducibility. It is, but that is not the part I feel day to day.

The part I feel is legibility. I can explain how a machine is put together without opening a drawer of old notes. I can hand a configuration to a future version of myself and expect it to make sense. I can change one thing without wondering which machine will disagree.

Nix did not make me love configuration for its own sake. It made the machine legible.

The best compliment I can give it is not that the setup is reproducible. It is that I no longer have to remember how it was made.

That is a strange thing to fall in love with. It is also the first time my machines have felt like mine.
