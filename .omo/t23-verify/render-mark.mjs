import { chromium } from "@playwright/test"
const svg = await (await import("node:fs/promises")).readFile("public/icon/brand-mark.svg", "utf8")
const html = `<!doctype html><html><body style="margin:0;background:#F5EFE1;display:flex;gap:24px;align-items:center;padding:24px">
<div style="width:36px;height:36px">${svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ')}</div>
<div style="width:24px;height:24px">${svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ')}</div>
<div style="width:128px;height:128px">${svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ')}</div>
</body></html>`
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 320, height: 180 }, deviceScaleFactor: 2 })
await page.setContent(html)
await page.screenshot({ path: ".omo/evidence/t23-verify/brand-mark-preview.png" })
await browser.close()
console.log("ok")
