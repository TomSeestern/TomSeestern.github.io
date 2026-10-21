# impeccable (vendored)

Design skill by Paul Bakaus, vendored so every session in this repository has
the same design authority without a network clone.

- **Upstream:** https://github.com/pbakaus/impeccable
- **Version:** 4.7.0 (see `SKILL.md` frontmatter; `scripts/VERSION` carries the
  launcher version)
- **License:** Apache-2.0 (`LICENSE`), third-party notices in `NOTICE.md`
- **Location:** `.claude/skills/impeccable/` — a path OpenCode discovers as a
  project skill source. `SKILL.md` is the entry point; `reference/` holds the
  playbooks and `scripts/` the launcher plus its assets.

The skill's own text addresses `<skill-base-dir>/scripts/impeccable`; that base
directory resolves to this folder. Keeping the vendored path identical to
upstream's keeps every documented command accurate, so do not move it.

## Update

```sh
git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/impeccable
rm -rf .claude/skills/impeccable
cp -a /tmp/impeccable/.claude/skills/impeccable .claude/skills/
cp /tmp/impeccable/LICENSE /tmp/impeccable/NOTICE.md .claude/skills/impeccable/
```

Then confirm the version in `SKILL.md` and record the bump in the commit
message. Review the diff of `reference/` before accepting an upgrade: the
playbooks are the part that shapes design decisions.

## Runtime state

The launcher writes caches and captures under `.impeccable/` in the working
project. That directory is gitignored.
