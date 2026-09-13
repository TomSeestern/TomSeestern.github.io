#!/usr/bin/env node
// F5 Arm A judge — pure decision function over a Lighthouse result.
// Exit 0 = VALID reading (benchmarkIndex >= min). Exit 3 = VOID (not comparable).
// Exit 2 = malformed input.
// Prints "<bi> <lcp> <cls> <tbt> <lhVersion>" on line 1 for callers to parse.
//
// The budget (2500 ms LCP) is an absolute gate and must never be weakened here.

const fs = require("node:fs")

function judgeFromLhr(lhr, minBi) {
  const auditValue = (id) => {
    const a = lhr && lhr.audits && lhr.audits[id]
    return a && typeof a.numericValue === "number" ? a.numericValue : NaN
  }
  const bi = lhr && lhr.environment ? lhr.environment.benchmarkIndex : NaN
  const lcp = auditValue("largest-contentful-paint")
  const cls = auditValue("cumulative-layout-shift")
  const tbt = auditValue("total-blocking-time")
  const lh = lhr ? lhr.lighthouseVersion : undefined
  if (!Number.isFinite(bi) || !Number.isFinite(lcp)) {
    return { ok: false, malformed: true }
  }
  const valid = bi >= minBi
  const passes = lcp < 2500
  return { ok: true, valid, bi, lcp, cls, tbt, lh, passes }
}

function verdictText(r) {
  if (r.valid && r.passes) return `PASS — LCP ${Math.round(r.lcp)} ms < 2500 (budget met)`
  if (r.valid) return `FAIL — LCP ${Math.round(r.lcp)} ms >= 2500 (T30 is real)`
  return `VOID — benchmarkIndex ${Math.round(r.bi)} < minimum (not comparable)`
}

function main(argv) {
  const args = argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith("--")) acc[cur.slice(2)] = all[i + 1]
    return acc
  }, {})
  const path = args.lhr
  const minBi = Number(args["min-bi"] || 2510)
  if (!path) {
    process.stderr.write("usage: f5-arm-a-judge.cjs --lhr <file> [--min-bi N]\n")
    return 2
  }
  let lhr
  try {
    lhr = JSON.parse(fs.readFileSync(path, "utf8"))
  } catch {
    process.stderr.write(`cannot read/parse ${path}\n`)
    return 2
  }
  const r = judgeFromLhr(lhr, minBi)
  if (r.malformed) {
    process.stderr.write("malformed LHR: missing environment.benchmarkIndex or LCP\n")
    return 2
  }
  process.stdout.write(
    `${Math.round(r.bi)} ${Math.round(r.lcp)} ${Number.isFinite(r.cls) ? r.cls.toFixed(3) : "NaN"} ${Math.round(r.tbt)} ${r.lh}\n`,
  )
  process.stdout.write(`VERDICT: ${verdictText(r)}\n`)
  return r.valid ? 0 : 3
}

if (require.main === module) process.exit(main(process.argv))
module.exports = { judgeFromLhr, verdictText }
