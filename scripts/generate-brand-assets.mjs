#!/usr/bin/env node
/**
 * Manual brand-asset renderer.
 *
 * The source of truth is `public/icon/brand-mark.svg`. This script renders the
 * two raster derivatives that Next and social cards need, at exact dimensions:
 *   - app/apple-icon.png       180 × 180
 *   - public/img/og-default.png 1200 × 630
 *
 * Run after changing the monogram or wordmark: `node scripts/generate-brand-assets.mjs`.
 * It is intentionally not part of `pnpm build`; generated PNGs are committed.
 */
import { chromium } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const BRAND_MARK = join(REPO_ROOT, "public", "icon", "brand-mark.svg")
const APPLE_ICON = join(REPO_ROOT, "app", "apple-icon.png")
const OG_IMAGE = join(REPO_ROOT, "public", "img", "og-default.png")

const brandMark = await readFile(BRAND_MARK, "utf8")
const brandDataUri = `data:image/svg+xml;base64,${Buffer.from(brandMark).toString("base64")}`

const browser = await chromium.launch()

const applePage = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 })
await applePage.setContent(`
  <style>
    html, body { margin: 0; width: 180px; height: 180px; overflow: hidden; background: #050505; }
    img { width: 180px; height: 180px; display: block; }
  </style>
  <img src="${brandDataUri}" alt="" />
`)
await applePage.screenshot({ path: APPLE_ICON, omitBackground: false })
console.log(`wrote ${APPLE_ICON} (180 × 180)`)

const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await ogPage.setContent(`
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    body {
      background: #050505;
      color: #FAFAFA;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: relative;
    }
    .grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: linear-gradient(to bottom, black, transparent 92%);
    }
    .glow { position: absolute; width: 540px; height: 540px; right: 30px; top: -120px; border-radius: 50%; background: rgba(255, 92, 53, 0.10); filter: blur(80px); }
    .mast { position: absolute; left: 72px; top: 70px; width: 690px; }
    .kicker { display: flex; align-items: center; gap: 12px; font-family: ui-monospace, Menlo, monospace; font-size: 15px; letter-spacing: 0.16em; text-transform: uppercase; color: #A1A1AA; }
    .kicker::before { content: ""; display: block; width: 7px; height: 7px; border-radius: 50%; background: #4ADE80; }
    h1 { margin: 30px 0 0; font-size: 102px; line-height: 0.94; letter-spacing: -0.06em; font-weight: 650; max-width: 700px; }
    .rule { margin: 28px 0 20px; height: 1px; background: #333333; width: 590px; }
    .sub { font-family: ui-monospace, Menlo, monospace; font-size: 17px; letter-spacing: 0.11em; text-transform: uppercase; line-height: 1.55; color: #A1A1AA; }
    .url { position: absolute; left: 72px; bottom: 50px; font-family: ui-monospace, Menlo, monospace; font-size: 15px; letter-spacing: 0.16em; text-transform: uppercase; color: #FAFAFA; }
    .window {
      position: absolute; right: 58px; top: 58px; width: 346px; height: 514px;
      border: 1px solid #1F1F1F; border-radius: 14px; background: #0F0F0F;
      overflow: hidden; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
    }
    .chrome { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1F1F1F; padding: 11px 14px; }
    .dots { display: flex; gap: 5px; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: #333333; }
    .chrome-label { font-family: ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #A1A1AA; }
    .window-body { padding: 24px; font-family: ui-monospace, Menlo, monospace; font-size: 12px; line-height: 1.9; color: #A1A1AA; }
    .prompt { color: #FF5C35; }
    .strong { color: #FAFAFA; }
    .case { margin-top: 20px; border-top: 1px solid #1F1F1F; padding-top: 15px; }
    .case-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #A1A1AA; }
    .case-title { margin-top: 8px; color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 16px; font-weight: 600; line-height: 1.25; }
    .case-copy { margin-top: 7px; color: #A1A1AA; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; line-height: 1.45; }
    .seal { width: 22px; height: 22px; opacity: 0.9; }
    .column { position: absolute; right: 18px; bottom: 12px; width: 46px; height: 124px; opacity: 0.12; }
    .column i { display: block; background: #FAFAFA; }
  </style>
  <div class="grid"></div>
  <div class="glow"></div>
  <div class="mast">
    <div class="kicker">Senior developer / Systems &amp; interfaces</div>
    <h1>Systems that hold.</h1>
    <div class="rule"></div>
    <div class="sub">Payment infrastructure<br />Embedded vision<br />Product systems</div>
  </div>
  <div class="url">tomsegbers.de</div>
  <div class="window">
    <div class="chrome">
      <div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      <span class="chrome-label">portfolio / 2026</span>
      <img class="seal" src="${brandDataUri}" alt="" />
    </div>
    <div class="window-body">
      <div><span class="prompt">$</span> whoami</div>
      <div class="strong">Tom Segbers / Senior developer</div>
      <div style="margin-top:12px"><span class="prompt">$</span> cat focus.json</div>
      <div class="strong">{</div>
      <div class="strong">&nbsp; "focus": ["systems", "interfaces"],</div>
      <div class="strong">&nbsp; "archive": "2010—2026",</div>
      <div class="strong">&nbsp; "caseFiles": 25</div>
      <div class="strong">}</div>
      <div class="case">
        <div class="case-label">Selected case file</div>
        <div class="case-title">PayMeNow</div>
        <div class="case-copy">Payment status for eBay sellers.</div>
      </div>
    </div>
  </div>
  <div class="column" aria-hidden="true">
    <i style="width:40px;height:6px;margin-left:3px"></i>
    <i style="width:46px;height:4px"></i>
    <i style="width:6px;height:74px;margin-left:10px;float:left"></i>
    <i style="width:7px;height:74px;margin-left:12px;float:left"></i>
    <i style="width:6px;height:74px;margin-left:11px;float:left"></i>
    <i style="width:46px;height:5px;margin-top:74px"></i>
    <i style="width:36px;height:7px;margin-left:5px"></i>
    <i style="width:24px;height:7px;margin-left:11px"></i>
  </div>
`)
await ogPage.screenshot({ path: OG_IMAGE, omitBackground: false })
console.log(`wrote ${OG_IMAGE} (1200 × 630)`)

await browser.close()
