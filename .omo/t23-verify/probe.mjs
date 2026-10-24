// T23 manual-QA probe: asset bytes + header markup from the dev server.
const BASE = "http://127.0.0.1:3037"

async function head(path) {
  const res = await fetch(BASE + path)
  const buf = Buffer.from(await res.arrayBuffer())
  return { status: res.status, bytes: buf.length, type: res.headers.get("content-type"), buf }
}

const og = await head("/img/og-default.png")
const dims = { width: og.buf.readUInt32BE(16), height: og.buf.readUInt32BE(20) }
console.log(`og-default.png: status=${og.status} bytes=${og.bytes} type=${og.type} decoded=${dims.width}x${dims.height}`)

const mark = await head("/icon/brand-mark.svg")
console.log(`brand-mark.svg: status=${mark.status} bytes=${mark.bytes} type=${mark.type}`)

const legacy = await head("/img/logo.png")
console.log(`logo.png (still referenced by content authorImgSrc): status=${legacy.status} bytes=${legacy.bytes}`)

const html = await (await fetch(BASE + "/")).text()
const img = /<img[^>]*brand-mark[^>]*>/.exec(html)
console.log("header mark markup:", img ? img[0] : "MISSING")
const imgAlt = /<img[^>]*alt="Tom Segbers Logo"[^>]*>/.exec(html)
console.log("alt=Tom Segbers Logo present:", Boolean(imgAlt))
