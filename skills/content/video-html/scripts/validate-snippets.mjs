#!/usr/bin/env node
/**
 * validate-snippets.mjs — Static validator cho scene HTML snippets
 *
 * Chạy SAU Bước 5 (HTML gen), TRƯỚC Bước 7 (render-mp4.mjs).
 * Catch các bug spec violation trước khi tốn 30-60s render.
 *
 * Usage: node validate-snippets.mjs <folder>
 *
 * Folder phải chứa: scenes.json + scenes/scene-*.html
 *
 * Exit code:
 *   0 — tất cả snippets pass
 *   1 — có 1+ snippet fail required rules
 *   2 — folder/files thiếu
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: node validate-snippets.mjs <folder>')
  process.exit(2)
}

const scenesJsonPath = join(folder, 'scenes.json')
const scenesDir = join(folder, 'scenes')

if (!existsSync(scenesJsonPath)) {
  console.error(`Missing ${scenesJsonPath}`)
  process.exit(2)
}
if (!existsSync(scenesDir)) {
  console.error(`Missing ${scenesDir}/`)
  process.exit(2)
}

const scenesData = JSON.parse(readFileSync(scenesJsonPath, 'utf8'))
const aspect = scenesData.aspect || '9:16'
const isPortrait = aspect === '9:16'

const MIN_PADDING_TOP = isPortrait ? 160 : 100
const MIN_PADDING_BOTTOM = isPortrait ? 280 : 180

const REQUIRED = []   // hard fail
const WARNINGS = []   // soft warn

function check(sceneI, rule, severity, message) {
  const entry = { sceneI, rule, message }
  if (severity === 'error') REQUIRED.push(entry)
  else WARNINGS.push(entry)
}

function validateSnippet(sceneI, html) {
  const id = `scene-${sceneI}`

  // 1. Root element
  const rootMatch = html.match(/<div\s+class="clip"\s+data-scene-id="([^"]+)"\s+data-start="([^"]*)"\s+data-duration="([^"]+)"\s+data-track-index="([^"]+)"/)
  if (!rootMatch) {
    check(sceneI, 'root-element', 'error',
      `Root <div class="clip" data-scene-id="..." data-start="..." data-duration="..." data-track-index="..."> không tìm thấy hoặc sai format`)
    return
  }
  if (rootMatch[1] !== id) {
    check(sceneI, 'scene-id', 'error',
      `data-scene-id="${rootMatch[1]}" phải bằng "${id}"`)
  }
  if (rootMatch[4] !== '1') {
    check(sceneI, 'track-index', 'warn',
      `data-track-index="${rootMatch[4]}" — thường là "1" cho scene clip (10 là caption, 0 là video bg)`)
  }

  // 2. Anti-pattern: full HTML document
  if (/<!doctype/i.test(html) || /<html\b/i.test(html) || /<head\b/i.test(html) || /<body\b/i.test(html)) {
    check(sceneI, 'snippet-only', 'error',
      `Output là SNIPPET — không được có <!DOCTYPE>, <html>, <head>, <body>`)
  }

  // 3. Anti-pattern: load GSAP locally
  if (/<script[^>]*src=["'][^"']*gsap/i.test(html)) {
    check(sceneI, 'no-gsap-import', 'error',
      `<script src="...gsap..."> bị cấm — GSAP load ở index.html wrapper`)
  }

  // 4. Anti-pattern: forbidden APIs
  if (/Math\.random\s*\(/.test(html)) {
    check(sceneI, 'no-random', 'error', `Math.random() bị cấm (non-deterministic)`)
  }
  if (/Date\.now\s*\(/.test(html)) {
    check(sceneI, 'no-date-now', 'error', `Date.now() bị cấm (non-deterministic)`)
  }
  if (/setTimeout\s*\(/.test(html)) {
    check(sceneI, 'no-settimeout', 'error', `setTimeout bị cấm (HyperFrames seek frame-by-frame)`)
  }
  if (/repeat\s*:\s*-1/.test(html)) {
    check(sceneI, 'no-infinite-repeat', 'error',
      `repeat: -1 bị cấm — dùng Math.ceil(duration / cycle) - 1`)
  }

  // 5. Timeline register
  const tlRegister = new RegExp(`window\\.__timelines\\s*\\[\\s*["']${id}["']\\s*\\]\\s*=\\s*tl`)
  if (!tlRegister.test(html)) {
    check(sceneI, 'timeline-register', 'error',
      `Thiếu window.__timelines["${id}"] = tl — scene sẽ không render`)
  }

  // 6. IIFE wrapper around script
  if (!/<script>\s*\(function\s*\(\s*\)\s*\{/m.test(html)) {
    check(sceneI, 'iife-wrapper', 'warn',
      `<script> không bọc trong IIFE (function(){...})() — biến có thể leak`)
  }

  // 7. Background color/gradient required
  const bgMatch = html.match(/\.clip\[data-scene-id="scene-\d+"\]\s*\{[^}]*background\s*:\s*([^;]+);/m)
  if (!bgMatch) {
    check(sceneI, 'background', 'warn',
      `Background chưa được set rõ trên .clip[data-scene-id="${id}"] — có thể bị trắng/đen mặc định`)
  }

  // 8. CSS scoping — find selectors without prefix
  const styleBlocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1])
  const allStyleText = styleBlocks.join('\n')
  // Find class selectors that aren't prefixed and aren't @-rules
  const classSelectors = [...allStyleText.matchAll(/^\s*(\.[a-zA-Z][\w-]*[^{]*)\s*\{/gm)]
  const scopePrefix = `.clip[data-scene-id="${id}"]`
  let unscopedCount = 0
  for (const m of classSelectors) {
    const selector = m[1].trim()
    if (!selector.includes(scopePrefix)) {
      unscopedCount++
    }
  }
  if (unscopedCount > 0) {
    check(sceneI, 'css-scoping', 'error',
      `${unscopedCount} CSS selector(s) không có prefix ${scopePrefix} — sẽ leak sang scenes khác`)
  }

  // 9. justify-content: center on .scene-content
  const sceneContentMatch = allStyleText.match(new RegExp(`\\.scene-content-${id}\\s*\\{[^}]*\\}`, 'm'))
  if (!sceneContentMatch) {
    check(sceneI, 'scene-content-block', 'warn',
      `Không tìm thấy .scene-content-${id} CSS block`)
  } else {
    const block = sceneContentMatch[0]
    const justifyMatch = block.match(/justify-content\s*:\s*([^;]+);/)
    if (!justifyMatch) {
      check(sceneI, 'justify-content', 'warn',
        `.scene-content-${id} thiếu justify-content — flex default = stretch, vertical layout sẽ kỳ`)
    } else if (!/center/.test(justifyMatch[1])) {
      check(sceneI, 'justify-content', 'error',
        `.scene-content-${id} justify-content: "${justifyMatch[1].trim()}" — PHẢI dùng "center" (flex-start/end làm content cluster top/bottom, không cân đối)`)
    }

    // Padding parsing — top + bottom check
    const paddingMatch = block.match(/padding\s*:\s*(\d+)px\s+(\d+)px\s+(\d+)px\s+(\d+)px/)
    if (paddingMatch) {
      const top = parseInt(paddingMatch[1])
      const bottom = parseInt(paddingMatch[3])
      if (top < MIN_PADDING_TOP) {
        check(sceneI, 'padding-top', 'error',
          `padding-top ${top}px < ${MIN_PADDING_TOP}px (min cho ${aspect}) — visual sẽ lệch lên do bottom caption space lớn`)
      }
      if (bottom < MIN_PADDING_BOTTOM) {
        check(sceneI, 'padding-bottom', 'error',
          `padding-bottom ${bottom}px < ${MIN_PADDING_BOTTOM}px — caption-highlight sẽ che content`)
      }
    } else {
      // Try shorthand padding 1-2 values
      const padShortMatch = block.match(/padding\s*:\s*(\d+)px\s+(\d+)px\s*;/)
      if (padShortMatch) {
        check(sceneI, 'padding-shorthand', 'warn',
          `padding shorthand 2-value (top/bottom = ${padShortMatch[1]}px) — cần asymmetric: top ≥${MIN_PADDING_TOP}, bottom ≥${MIN_PADDING_BOTTOM}`)
      }
    }
  }

  // 10. Anti-pattern: margin-top: auto pushing element down
  if (/margin-top\s*:\s*auto/i.test(allStyleText)) {
    check(sceneI, 'no-margin-auto', 'warn',
      `margin-top: auto trên element nào đó — có thể phá centering. Dùng gap đều thay vì auto-push.`)
  }

  // 11. Animate width/height (anti-pattern)
  const allScriptText = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n')
  if (/\b(?:width|height)\s*:\s*['"\d]/i.test(allScriptText)) {
    // Check if it's inside a gsap.from/to tween
    const tweenMatch = allScriptText.match(/gsap\.(from|to|fromTo)\([^)]*(?:width|height)\s*:/i)
    if (tweenMatch) {
      check(sceneI, 'no-animate-wh', 'warn',
        `Có vẻ animate width/height trong GSAP — dùng scale thay vì width/height`)
    }
  }

  // 12. Content size estimate (gross check — too short = empty scene)
  if (html.length < 800) {
    check(sceneI, 'too-small', 'warn',
      `Snippet rất ngắn (${html.length} chars) — có thể thiếu content visual`)
  }
}

// Main loop
const sceneFiles = readdirSync(scenesDir)
  .filter(f => /^scene-\d+\.html$/.test(f))
  .sort((a, b) => {
    const ai = parseInt(a.match(/(\d+)/)[1])
    const bi = parseInt(b.match(/(\d+)/)[1])
    return ai - bi
  })

if (sceneFiles.length === 0) {
  console.error(`No scene-*.html found in ${scenesDir}`)
  process.exit(2)
}

console.log(`Validating ${sceneFiles.length} snippets (aspect: ${aspect})`)
console.log(`  Min padding top:    ${MIN_PADDING_TOP}px`)
console.log(`  Min padding bottom: ${MIN_PADDING_BOTTOM}px\n`)

for (const file of sceneFiles) {
  const sceneI = parseInt(file.match(/(\d+)/)[1])
  const html = readFileSync(join(scenesDir, file), 'utf8')
  validateSnippet(sceneI, html)
}

// Report
const byScene = {}
for (const e of [...REQUIRED, ...WARNINGS]) {
  byScene[e.sceneI] = byScene[e.sceneI] || { errors: [], warns: [] }
}
for (const e of REQUIRED) byScene[e.sceneI].errors.push(e)
for (const e of WARNINGS) byScene[e.sceneI].warns.push(e)

const allScenes = new Set(sceneFiles.map(f => parseInt(f.match(/(\d+)/)[1])))
for (const i of [...allScenes].sort((a, b) => a - b)) {
  const issues = byScene[i]
  if (!issues || (issues.errors.length === 0 && issues.warns.length === 0)) {
    console.log(`  ✓ scene-${i}.html`)
    continue
  }
  console.log(`  ${issues.errors.length > 0 ? '✗' : '⚠'} scene-${i}.html`)
  for (const e of issues.errors) console.log(`      ERROR [${e.rule}]: ${e.message}`)
  for (const w of issues.warns)  console.log(`      WARN  [${w.rule}]: ${w.message}`)
}

console.log('')
console.log(`Summary: ${REQUIRED.length} error(s), ${WARNINGS.length} warning(s)`)

if (REQUIRED.length > 0) {
  console.error(`\n❌ Validation FAILED — fix errors before render-mp4.mjs`)
  process.exit(1)
}
console.log(`\n✅ Validation passed${WARNINGS.length > 0 ? ' (with warnings)' : ''}`)
process.exit(0)
