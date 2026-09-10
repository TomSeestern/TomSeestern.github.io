const { chromium } = require("@playwright/test")
;(async()=>{
  const b=await chromium.launch({executablePath:"/etc/profiles/per-user/tom/bin/chromium",args:["--no-sandbox","--disable-dev-shm-usage"]})
  const p=await b.newPage()
  await p.goto("http://127.0.0.1:3000/",{waitUntil:"networkidle"})
  await p.waitForTimeout(300)
  const c=await p.evaluate(()=>({
    marquee1:document.querySelectorAll(".animate-marquee > div").length,
    marquee2:document.querySelectorAll(".animate-marquee2 > div").length,
    blogCards:document.querySelectorAll("[data-testid='blog-teaser'], .blog-teaser").length,
  }))
  console.log(JSON.stringify(c))
  await b.close()
})().catch(e=>{console.error("FATAL",e.message);process.exit(1)})
