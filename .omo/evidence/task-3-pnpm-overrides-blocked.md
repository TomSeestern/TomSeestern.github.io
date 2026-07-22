# Task 3 — pnpm Overrides Audit Evidence

**Timestamp:** 2026-07-22T00:00:00Z
**Task:** Transitive vulnerability remediation with `pnpm.overrides`
**Status:** RESOLVED — approved scope correction added root `pnpm-workspace.yaml`; exact scoped overrides now remediate four audited paths.

## Environment

- `packageManager`: `pnpm@10.15.1` in `package.json`
- Commands run after `unset PNPM_HOME npm_config_prefix`
- Installed command reports `pnpm v10.15.1`.

## Baseline audit

```bash
unset PNPM_HOME npm_config_prefix; pnpm audit --json
```

Result metadata:

```json
{"info":0,"low":5,"moderate":9,"high":12,"critical":0}
```

Candidate advisories selected by audit path:

| Package | Installed vulnerable version | Audit path | Minimum patched version |
| --- | --- | --- | --- |
| `glob` | `10.3.10` | `.>eslint-config-next>@next/eslint-plugin-next>glob` | `10.5.0` |
| `minimatch` | `9.0.3` | `.>@typescript-eslint/eslint-plugin>@typescript-eslint/type-utils>@typescript-eslint/typescript-estree>minimatch` | `9.0.7` |
| `postcss` | `8.4.31` | `.>next>postcss` | `8.5.10` |
| `shell-quote` | `1.8.4` | `.>concurrently>shell-quote` | `1.9.0` |

`tar`, `axios`, `esbuild`, `sharp`, `uuid`, and `elliptic` were absent from current `pnpm audit` findings. They were not candidates for an override.

## Dependency trace commands

```bash
unset PNPM_HOME npm_config_prefix; pnpm why tar
unset PNPM_HOME npm_config_prefix; pnpm why axios
unset PNPM_HOME npm_config_prefix; pnpm why esbuild
unset PNPM_HOME npm_config_prefix; pnpm why sharp
unset PNPM_HOME npm_config_prefix; pnpm why uuid
unset PNPM_HOME npm_config_prefix; pnpm why elliptic
unset PNPM_HOME npm_config_prefix; pnpm why glob
unset PNPM_HOME npm_config_prefix; pnpm why minimatch
unset PNPM_HOME npm_config_prefix; pnpm why shell-quote
unset PNPM_HOME npm_config_prefix; pnpm why postcss
```

Observed relevant chains:

- `axios@1.18.1`: `wait-on@9.0.10 > axios`; not an audit finding.
- `glob`: current graph contains audit path through `eslint-config-next > @next/eslint-plugin-next` plus legacy Jest chains; audit finding concerns only `glob@10.3.10`.
- `minimatch`: current graph contains audit path through `@typescript-eslint/typescript-estree` plus legacy ESLint/Jest chains; audit finding concerns only `minimatch@9.0.3`.
- `shell-quote@1.8.4`: `concurrently@10.0.3 > shell-quote`; `npm-only-allow > concurrently@7.6.0 > shell-quote@1.10.0` is already patched.
- `postcss@8.4.31`: `next@14.2.35 > postcss`; other project chains resolve `postcss@8.5.20`.

## Override validation and blocker

Attempted exact root `package.json` entries:

```json
{
  "overrides": {
    "@next/eslint-plugin-next>glob": "10.5.0",
    "@typescript-eslint/typescript-estree>minimatch": "9.0.7",
    "concurrently>shell-quote": "1.9.0",
    "postcss": "8.5.10"
  }
}
```

Then ran:

```bash
unset PNPM_HOME npm_config_prefix; pnpm install
unset PNPM_HOME npm_config_prefix; pnpm audit --json
```

The lockfile changed only due to unrelated resolution movement (`postcss@8.5.20` became `8.5.10`; `shell-quote@1.10.0` became `1.9.0`). The four vulnerable audit paths stayed unchanged, and metadata stayed `5 low / 9 moderate / 12 high`. Root `overrides` did not apply.

Attempted `package.json#pnpm.overrides` then ran `pnpm install`. pnpm emitted:

```text
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
```

Official pnpm documentation queried via Context7 states that current pnpm configuration belongs in root `pnpm-workspace.yaml`; scoped override syntax is `"parent>child": "exact-version"`.

Creating `pnpm-workspace.yaml` would be required for effective overrides, but violates task requirement to modify only `package.json`, `pnpm-lock.yaml`, and `.omo/`. All exploratory manifest and lockfile edits were reverted. No dependency files remain changed.

## Remaining audit debt

All 26 local pnpm-audit findings remain. Four are otherwise remediable by exact scoped overrides once `pnpm-workspace.yaml` is approved:

## Verification

```bash
unset PNPM_HOME npm_config_prefix; pnpm build
unset PNPM_HOME npm_config_prefix; pnpm test
unset PNPM_HOME npm_config_prefix; pnpm lint
unset PNPM_HOME npm_config_prefix; pnpm prettier
```

- `pnpm build`: exit 0; 47 static pages. Existing lint warnings only.
- `pnpm lint`: exit 0; existing warnings only.
- `pnpm prettier`: exit 0.
- `pnpm test`: failed during Jest worker startup, before any test result, with stack locations in `jest-haste-map/build/worker.js` and `jest-worker/build/workers/processChild.js`.
- Diagnostic command `unset PNPM_HOME npm_config_prefix; pnpm exec jest --runInBand`: 15 suites / 91 tests passed. This confirms test behavior is green and local default worker execution is the environmental failure.

No dependency change remains, so no conventional dependency-remediation commit can truthfully be created.

```yaml
overrides:
  "@next/eslint-plugin-next>glob": "10.5.0"
  "@typescript-eslint/typescript-estree>minimatch": "9.0.7"
  "concurrently>shell-quote": "1.9.0"
  "next>postcss": "8.5.10"
```

The remaining advisory set includes direct `next@14.2.35` vulnerabilities. Its remediation requires planned Task 5 Next upgrade; this task must preserve `next-compose-plugins` and cannot change Next.

## Resolution — workspace configuration approved

**Timestamp:** 2026-07-22T14:32:00Z

Scope was corrected to allow root `pnpm-workspace.yaml`. Added only:

```yaml
overrides:
  "@next/eslint-plugin-next>glob": "10.5.0"
  "@typescript-eslint/typescript-estree>minimatch": "9.0.7"
  "concurrently>shell-quote": "1.9.0"
  "next>postcss": "8.5.10"
```

Reproduction:

```bash
unset PNPM_HOME npm_config_prefix; pnpm install
unset PNPM_HOME npm_config_prefix; pnpm audit --json
unset PNPM_HOME npm_config_prefix; pnpm why glob
unset PNPM_HOME npm_config_prefix; pnpm why minimatch
unset PNPM_HOME npm_config_prefix; pnpm why shell-quote
unset PNPM_HOME npm_config_prefix; pnpm why postcss
```

`pnpm install` completed with exit 0. `pnpm-lock.yaml` records all four
scoped overrides. Dependency traces now resolve selected paths to
`glob@10.5.0`, `minimatch@9.0.7`, `shell-quote@1.9.0`, and
`postcss@8.5.10`.

### Audit delta

| State | Low | Moderate | High | Critical | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Before | 5 | 9 | 12 | 0 | 26 |
| After | 5 | 8 | 7 | 0 | 20 |

Post-install `pnpm audit --json` has no advisories for `glob`, `minimatch`,
`shell-quote`, or `postcss`. Remaining 20 advisories, including direct Next
advisories, are outside this exact-transitive-override scope and remain Task 5 debt.

### UltraQA probes

- Exact scoped resolution paths verified with `pnpm why`.
- Lockfile change is limited to override metadata and required dependency
  resolutions; `git diff --check` passed.
- No broad package override, manifest dependency change, Next upgrade, or
  `next-compose-plugins` change was introduced.
- Decision record: `.omo/decisions/task-3-pnpm-workspace-overrides.md`.

### Verification

**Timestamp:** 2026-07-22T14:32:00Z

```bash
unset PNPM_HOME npm_config_prefix; pnpm lint
unset PNPM_HOME npm_config_prefix; pnpm prettier
unset PNPM_HOME npm_config_prefix; pnpm test
unset PNPM_HOME npm_config_prefix; pnpm build
GIT_MASTER=1 git diff --check
```

- `pnpm lint`: exit 0; existing warnings only.
- `pnpm prettier`: exit 0.
- `pnpm test`: exit 0; 15 suites and 91 tests passed.
- `pnpm build`: exit 0; 47 static pages generated; existing lint warnings only.
- `git diff --check`: exit 0.
- LSP diagnostics unavailable: `yaml-ls` and `biome` are not installed, and
  installation was previously declined. Executable project gates above passed.
