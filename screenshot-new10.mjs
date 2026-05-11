import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { join } from 'path'

const OUT = 'C:/Users/moham/OneDrive/Desktop/noor-posts'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 })

for (let i = 45; i < 55; i++) {
  const url = `https://nooralyaqen-iota.vercel.app/card-image?i=${i}`
  console.log(`Screenshotting post ${i}...  ${url}`)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.waitForFunction(() => document.fonts.ready)
  await new Promise(r => setTimeout(r, 1500))

  const file = join(OUT, `post-${String(i).padStart(2,'0')}.png`)
  await page.screenshot({ path: file, clip: { x:0, y:0, width:1080, height:1080 } })
  console.log(`  Saved: ${file}`)
}

await browser.close()
console.log('\nNew 10 posts saved to Desktop/noor-posts/')
