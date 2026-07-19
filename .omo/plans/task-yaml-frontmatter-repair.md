# YAML frontmatter repair

## TL;DR

Repair YAML encoding in existing project Markdown frontmatter without changing semantic content, draft wording, approval state, file names, slugs, IDs, or dates. Add deterministic gray-matter validation for exactly 21 project entries, then prove build and `/projects` rendering work. Existing human-gated Todos 13–15 remain pending.

## Scope

- Read and parse every `content/projects/*.md` frontmatter block.
- Encode YAML-special values using quotes or block scalars only where parsing requires it.
- Add a test/validator that parses every project file through `gray-matter` and asserts exact count 21.
- Verify Nix pnpm build and dev-server `/projects` response.
- Record baseline, repair, validation, adverse conditions, and server cleanup in task evidence.

## Guardrails

- No filename, slug, ID, date, body-prose, or draft-wording changes.
- No project file additions/removals.
- Do not update human-gated Todo 13, 14, or 15 status.
- Do not install dependencies.

## Verification

1. Baseline parse inventory records each gray-matter YAML error.
2. Validator reports exact list and 21 successful project parses.
3. `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build'` exits 0.
4. Dev server on port 3040 returns HTTP 200 for `/projects` with at least 21 unique `/projects/entry/` hrefs.
