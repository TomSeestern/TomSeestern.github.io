import {readdirSync, readFileSync} from "node:fs"
const dir = ".lighthouseci"
const files = readdirSync(dir).filter(f => /^lhr-\d+\.json$/.test(f))
const byUrl = new Map()
for (const f of files) {
  const lhr = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))
  const url = new URL(lhr.finalUrl).pathname
  const a = lhr.audits
  const row = {
    lcp: a["largest-contentful-paint"].numericValue,
    cls: a["cumulative-layout-shift"].numericValue,
    tbt: a["total-blocking-time"].numericValue,
    lcpEl: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 90),
    cfg: lhr.configSettings,
  }
  if (!byUrl.has(url)) byUrl.set(url, [])
  byUrl.get(url).push(row)
}
const med = xs => { const s=[...xs].sort((a,b)=>a-b); const m=Math.floor((s.length-1)/2); return s.length%2?s[m]:(s[m]+s[m+1])/2 }
console.log("cfg formFactor / throttlingMethod / cpuSlowdown / rtt / throughput:")
const first = [...byUrl.values()][0][0].cfg
console.log(JSON.stringify({formFactor:first.formFactor, throttlingMethod:first.throttlingMethod, throttling:first.throttling}, null, 0))
console.log()
console.log("path | runs | LCP median | CLS median | TBT median | LCP pass<2500 | CLS pass<0.1 | TBT pass<200")
for (const [url, rows] of byUrl) {
  const lcp = med(rows.map(r=>r.lcp)), cls = med(rows.map(r=>r.cls)), tbt = med(rows.map(r=>r.tbt))
  console.log(`${url} | ${rows.length} | ${lcp.toFixed(0)} | ${cls.toFixed(4)} | ${tbt.toFixed(0)} | ${lcp<2500} | ${cls<0.1} | ${tbt<200}`)
}
console.log()
console.log("LCP element (first run per route):")
for (const [url, rows] of byUrl) console.log(`${url} -> ${rows[0].lcpEl}`)
