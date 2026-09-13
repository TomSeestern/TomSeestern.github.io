#!/usr/bin/env node
// Tests for the F5 Arm A judge. Covers the closure-critical branches:
// valid+pass (F5 passes), valid+fail (T30 real), void, malformed.
// Synthetic LHRs only — no network, no host dependency.

const assert = require("node:assert")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { execFileSync } = require("node:child_process")
const { judgeFromLhr, verdictText } = require("./f5-arm-a-judge.cjs")

const JUDGE = path.join(__dirname, "f5-arm-a-judge.cjs")

function lhr({ bi, lcp, cls = 0.0, tbt = 100, lh = "13.4.1" }) {
  return {
    lighthouseVersion: lh,
    environment: { benchmarkIndex: bi },
    audits: {
      "largest-contentful-paint": { numericValue: lcp },
      "cumulative-layout-shift": { numericValue: cls },
      "total-blocking-time": { numericValue: tbt },
    },
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "f5-judge-"))

function runCli(obj) {
  const p = path.join(tmp, `lhr-${Math.random().toString(36).slice(2)}.json`)
  fs.writeFileSync(p, JSON.stringify(obj))
  try {
    const out = execFileSync("node", [JUDGE, "--lhr", p], { encoding: "utf8" })
    return { code: 0, out }
  } catch (e) {
    return { code: e.status, out: (e.stdout || "") + (e.stderr || "") }
  }
}

let passed = 0
function check(name, fn) {
  fn()
  passed++
  console.log(`  ok  ${name}`)
}

console.log("f5-arm-a-judge tests")

check("valid + LCP under budget -> VALID/PASS, exit 0", () => {
  const r = judgeFromLhr(lhr({ bi: 3000, lcp: 2300 }), 2510)
  assert.strictEqual(r.valid, true)
  assert.strictEqual(r.passes, true)
  assert.match(verdictText(r), /^PASS/)
})

check("valid + LCP at/over budget -> FAIL (T30 real), still exit 0", () => {
  const r = judgeFromLhr(lhr({ bi: 3000, lcp: 2500 }), 2510)
  assert.strictEqual(r.valid, true)
  assert.strictEqual(r.passes, false)
  assert.match(verdictText(r), /^FAIL/)
})

check("boundary: bi exactly at minimum is VALID", () => {
  assert.strictEqual(judgeFromLhr(lhr({ bi: 2510, lcp: 2400 }), 2510).valid, true)
})

check("below minimum -> VOID regardless of LCP", () => {
  const r = judgeFromLhr(lhr({ bi: 1900, lcp: 1200 }), 2510)
  assert.strictEqual(r.valid, false)
  assert.match(verdictText(r), /^VOID/)
})

check("boundary: LCP 2499 passes, 2500 fails", () => {
  assert.strictEqual(judgeFromLhr(lhr({ bi: 3000, lcp: 2499 }), 2510).passes, true)
  assert.strictEqual(judgeFromLhr(lhr({ bi: 3000, lcp: 2500 }), 2510).passes, false)
})

check("malformed: missing benchmarkIndex", () => {
  const bad = { lighthouseVersion: "13.4.1", audits: { "largest-contentful-paint": { numericValue: 1 } } }
  assert.strictEqual(judgeFromLhr(bad, 2510).malformed, true)
})

check("malformed: missing LCP audit", () => {
  const bad = { environment: { benchmarkIndex: 3000 }, audits: {} }
  assert.strictEqual(judgeFromLhr(bad, 2510).malformed, true)
})

check("CLI: valid+pass exits 0 and prints metrics", () => {
  const { code, out } = runCli(lhr({ bi: 3000, lcp: 2300, cls: 0.0, tbt: 90 }))
  assert.strictEqual(code, 0)
  assert.match(out, /^3000 2300 0\.000 90 13\.4\.1/m)
  assert.match(out, /VERDICT: PASS/)
})

check("CLI: void exits 3", () => {
  const { code, out } = runCli(lhr({ bi: 1200, lcp: 4000 }))
  assert.strictEqual(code, 3)
  assert.match(out, /VERDICT: VOID/)
})

check("CLI: malformed exits 2", () => {
  const { code } = runCli({ nope: true })
  assert.strictEqual(code, 2)
})

check("CLI: real baseline artifact is VALID and FAILs the budget (bi 2762, LCP 2588)", () => {
  const real = path.join(__dirname, "..", "evidence", "baseline", "lighthouse", "projects.json")
  if (fs.existsSync(real)) {
    const r = judgeFromLhr(JSON.parse(fs.readFileSync(real, "utf8")), 2510)
    assert.strictEqual(r.valid, true, "baseline bi 2762 should be valid")
    assert.strictEqual(r.passes, false, "baseline LCP 2588 should be over budget")
  }
})

fs.rmSync(tmp, { recursive: true, force: true })
console.log(`\n${passed} passed`)
