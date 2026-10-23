#!/usr/bin/env node
/**
 * export-pdf.mjs — Export HTML presentation/slides to PDF (CROSS-PLATFORM)
 *
 * Thay thế export-pdf.sh — chạy được trên Windows + Mac + Linux.
 *
 * Usage:
 *   node export-pdf.mjs <path-to-html> [output.pdf] [--compact]
 *
 * Examples:
 *   node export-pdf.mjs ./my-deck/index.html
 *   node export-pdf.mjs ./presentation.html ./slides.pdf --compact
 *
 * Cần: playwright (kit root đã có, hoặc npm install playwright)
 */

import { createServer } from 'http'
import { readFileSync, mkdirSync, existsSync, rmSync, statSync } from 'fs'
import { join, dirname, basename, extname, resolve } from 'path'
import { tmpdir, platform } from 'os'
import { execSync, spawnSync } from 'child_process'

// ─── Parse args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const compact = args.includes('--compact')
const positional = args.filter(a => !a.startsWith('--'))

if (positional.length < 1) {
  console.error('Usage: node export-pdf.mjs <path-to-html> [output.pdf] [--compact]')
  process.exit(1)
}

const VP_WIDTH = compact ? 1280 : 1920
const VP_HEIGHT = compact ? 720 : 1080

let inputHtml = resolve(positional[0])
if (!existsSync(inputHtml)) {
  console.error(`File not found: ${inputHtml}`)
  process.exit(1)
}

const outputPdf = positional[1]
  ? resolve(positional[1])
  : join(dirname(inputHtml), basename(inputHtml, '.html') + '.pdf')

mkdirSync(dirname(outputPdf), { recursive: true })

const serveDir = dirname(inputHtml)
const htmlFile = basename(inputHtml)

console.log('\n╔══════════════════════════════════════╗')
console.log('║       Export Slides to PDF            ║')
console.log('╚══════════════════════════════════════╝\n')

// ─── Load playwright (cross-platform resolution) ───────────────────────────
let chromium
try {
  ({ chromium } = await import('playwright'))
} catch {
  console.error('✗ Playwright chưa cài. Chạy: npm install playwright && npx playwright install chromium')
  process.exit(1)
}

// ─── MIME types ────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
}

// ─── Static server ─────────────────────────────────────────────────────────
const server = createServer((req, res) => {
  const decoded = decodeURIComponent(req.url)
  const filePath = join(serveDir, decoded === '/' ? htmlFile : decoded)
  try {
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' })
    res.end(content)
  } catch {
    res.writeHead(404); res.end('Not found')
  }
})

const port = await new Promise((res) => server.listen(0, () => res(server.address().port)))
console.log(`  Local server on port ${port}`)

// ─── Screenshot slides ─────────────────────────────────────────────────────
const tempDir = join(tmpdir(), `slide-export-${Date.now()}`)
const screenshotDir = join(tempDir, 'screenshots')
mkdirSync(screenshotDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: VP_WIDTH, height: VP_HEIGHT } })
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)

const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length)
console.log(`  Found ${slideCount} slides`)

if (slideCount === 0) {
  console.error('  ERROR: No .slide elements found. Dùng <div class="slide"> hoặc <section class="slide">.')
  await browser.close(); server.close(); process.exit(1)
}

const screenshotPaths = []
for (let i = 0; i < slideCount; i++) {
  await page.evaluate((index) => {
    const slides = document.querySelectorAll('.slide')
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.style.display = ''; slide.style.opacity = '1'; slide.style.visibility = 'visible'
        slide.style.position = 'relative'; slide.style.transform = 'none'; slide.classList.add('active')
      } else { slide.style.display = 'none'; slide.classList.remove('active') }
    })
    if (window.presentation?.goToSlide) window.presentation.goToSlide(index)
    slides[index]?.scrollIntoView({ behavior: 'instant' })
  }, i)
  await page.waitForTimeout(500)
  await page.evaluate((index) => {
    const cur = document.querySelectorAll('.slide')[index]
    cur?.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.visibility = 'visible'
    })
  }, i)
  await page.waitForTimeout(100)
  const p = join(screenshotDir, `slide-${String(i + 1).padStart(3, '0')}.png`)
  await page.screenshot({ path: p, fullPage: false })
  screenshotPaths.push(p)
  console.log(`  Captured slide ${i + 1}/${slideCount}`)
}
await browser.close(); server.close()

// ─── Assemble PDF ──────────────────────────────────────────────────────────
console.log('  Assembling PDF...')
const browser2 = await chromium.launch()
const pdfPage = await browser2.newPage()
const imagesHtml = screenshotPaths.map(p =>
  `<div class="page"><img src="data:image/png;base64,${readFileSync(p).toString('base64')}" /></div>`
).join('\n')
const pdfHtml = `<!DOCTYPE html><html><head><style>
  *{margin:0;padding:0}@page{size:${VP_WIDTH}px ${VP_HEIGHT}px;margin:0}
  .page{width:${VP_WIDTH}px;height:${VP_HEIGHT}px;page-break-after:always;overflow:hidden}
  .page:last-child{page-break-after:auto}
  img{width:${VP_WIDTH}px;height:${VP_HEIGHT}px;display:block;object-fit:contain}
</style></head><body>${imagesHtml}</body></html>`
await pdfPage.setContent(pdfHtml, { waitUntil: 'load' })
await pdfPage.pdf({
  path: outputPdf, width: `${VP_WIDTH}px`, height: `${VP_HEIGHT}px`,
  printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 },
})
await browser2.close()

// ─── Cleanup + open (cross-platform) ───────────────────────────────────────
rmSync(tempDir, { recursive: true, force: true })

const sizeMB = (statSync(outputPdf).size / 1024 / 1024).toFixed(2)
console.log(`\n✓ PDF saved: ${outputPdf} (${sizeMB} MB)\n`)

// Open PDF — cross-platform
const opener = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open'
try {
  if (platform() === 'win32') {
    spawnSync('cmd', ['/c', 'start', '', outputPdf], { stdio: 'ignore' })
  } else {
    spawnSync(opener, [outputPdf], { stdio: 'ignore' })
  }
} catch { /* open is best-effort */ }
