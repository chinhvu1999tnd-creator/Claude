#!/usr/bin/env node
/**
 * gen-sfx-library.mjs — Gen 19 SFX qua ElevenLabs Sound Generation API.
 *
 * Library v2 — SOFT-FIRST design:
 *   - 5 SFX nguyên bản nhẹ: chime, ding, pop, sparkle, success-chime
 *   - 8 SFX re-gen với prompt nhẹ hơn (giữ ID compat): alarm, drum-hit, bass-thump,
 *     whoosh-up, whoosh-down, glitch, beep-glitch, dark-rise
 *   - 6 SFX MỚI cho layer animation transitions: layer-in, layer-out, slide-soft,
 *     bloom, tap-tick, breath
 *
 * Usage:
 *   node gen-sfx-library.mjs            # idempotent — skip files đã tồn tại
 *   node gen-sfx-library.mjs --force    # re-gen TẤT CẢ (cost ~$0.95 cho 19 files)
 *   node gen-sfx-library.mjs --only id1,id2,...  # chỉ gen list IDs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIBRARY_DIR = resolve(__dirname, '..', 'sfx-library')

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const onlyIdx = args.indexOf('--only')
const ONLY = onlyIdx >= 0 && args[onlyIdx + 1] ? args[onlyIdx + 1].split(',').map(s => s.trim()) : null

function loadKey() {
  const rootEnv = resolve(process.cwd(), '.env')
  if (existsSync(rootEnv)) {
    const m = readFileSync(rootEnv, 'utf8').match(/ELEVENLABS_API_KEY=(.+)/)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  }
  return process.env.ELEVENLABS_API_KEY || null
}

const apiKey = loadKey()
if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY in .env')
  process.exit(1)
}

// ─── SFX library v2 — SOFT FIRST ───────────────────────────────────────────
const SFX = [
  // === 5 SFX nguyên bản (đã nhẹ — KHÔNG re-gen trừ khi --force) ===
  { id: 'chime',         category: 'inspiring',  prompt: 'soft gentle chime, single uplifting bell tone, mellow',                  duration: 0.7, soft_already: true },
  { id: 'ding',          category: 'playful',    prompt: 'crisp notification ding, short positive ping, clean tone',               duration: 0.5, soft_already: true },
  { id: 'pop',           category: 'playful',    prompt: 'light playful bubble pop, soft attack, no harsh sub-bass',               duration: 0.5, soft_already: true },
  { id: 'sparkle',       category: 'success',    prompt: 'magical sparkle chime, light bell tones, ASMR-like shimmer',             duration: 0.8, soft_already: true },
  { id: 'success-chime', category: 'success',    prompt: 'success level-up chime, gentle ascending arpeggio, satisfying',         duration: 0.9, soft_already: true },

  // === 8 SFX re-gen với prompt MỀM hơn (giữ ID cho backward compat) ===
  { id: 'alarm',         category: 'alert',      prompt: 'soft notification chime, single gentle ping, mellow attention tone, no harsh edge',  duration: 0.5 },
  { id: 'drum-hit',      category: 'impact',     prompt: 'soft wood block tap, hollow gentle attention beat, padded attack, no sub-bass',     duration: 0.5 },
  { id: 'bass-thump',    category: 'impact',     prompt: 'soft muted kick, dampened low tap, very gentle, no boom',                            duration: 0.5 },
  { id: 'whoosh-up',     category: 'transition', prompt: 'soft tonal riser, gentle pitch climb, ASMR breath whisper, no air friction',        duration: 0.5 },
  { id: 'whoosh-down',   category: 'transition', prompt: 'soft tonal descent, gentle pitch ease down, calm air whisper, no friction',         duration: 0.5 },
  { id: 'glitch',        category: 'tech',       prompt: 'minimal soft tick, subtle clean data blip, single gentle click, no noise',          duration: 0.5 },
  { id: 'beep-glitch',   category: 'tech',       prompt: 'soft clean beep, single mellow tone, very short pleasant ping',                     duration: 0.5 },
  { id: 'dark-rise',     category: 'mystery',    prompt: 'gentle warm ambient swell, soft tonal rise, calm pad, no tension drone',             duration: 1.0 },

  // === 6 SFX MỚI — Layer animation transitions ===
  { id: 'layer-in',      category: 'transition', prompt: 'very soft air whisper reveal, gentle ASMR-like fade-in, no fricative, calm',         duration: 0.5 },
  { id: 'layer-out',     category: 'transition', prompt: 'very soft air whisper fade away, gentle hide tone, calm decay, ASMR',                duration: 0.5 },
  { id: 'slide-soft',    category: 'transition', prompt: 'soft paper slide, gentle whoosh-tap, smooth horizontal motion, no harshness',        duration: 0.5 },
  { id: 'bloom',         category: 'transition', prompt: 'subtle bloom expand, soft tonal swell rising then fading, gentle scale-in feel',     duration: 0.5 },
  { id: 'tap-tick',      category: 'transition', prompt: 'minimal soft tick, gentle finger tap on cardboard, ASMR-like, very short',           duration: 0.5 },
  { id: 'breath',        category: 'transition', prompt: 'single soft breath out, gentle calm exhale, ASMR pause beat, no voice',              duration: 0.5 },
]

if (!existsSync(LIBRARY_DIR)) mkdirSync(LIBRARY_DIR, { recursive: true })

async function genSfx(sfx) {
  const outFile = join(LIBRARY_DIR, `${sfx.id}.mp3`)
  if (existsSync(outFile) && !FORCE && !ONLY) {
    console.log(`  skip ${sfx.id}.mp3 (exists)`)
    return false
  }
  if (ONLY && !ONLY.includes(sfx.id)) {
    return false
  }
  // soft_already files: skip nếu không --force và không --only
  if (sfx.soft_already && existsSync(outFile) && !FORCE && !ONLY) {
    console.log(`  skip ${sfx.id}.mp3 (soft already, use --force to re-gen)`)
    return false
  }
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: sfx.prompt,
      duration_seconds: sfx.duration,
      prompt_influence: 0.7
    })
  })
  if (!res.ok) {
    throw new Error(`${sfx.id} failed: ${res.status} ${await res.text()}`)
  }
  const audioBuffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(outFile, audioBuffer)
  console.log(`  ✓ ${sfx.id}.mp3 (${(audioBuffer.length/1024).toFixed(0)}KB)`)
  return true
}

console.log(`SFX library v2 (soft-first) → ${LIBRARY_DIR}`)
if (FORCE) console.log(`  --force: re-gen ALL files`)
if (ONLY) console.log(`  --only: gen [${ONLY.join(', ')}]`)
console.log('')

let genCount = 0
for (const sfx of SFX) {
  console.log(`${sfx.id} (${sfx.category}): ${sfx.prompt.slice(0, 60)}...`)
  try {
    const generated = await genSfx(sfx)
    if (generated) genCount++
  } catch (e) {
    console.error(`  FAILED: ${e.message}`)
    process.exit(1)
  }
}

const manifest = SFX.map(s => ({
  id: s.id,
  category: s.category,
  description: s.prompt,
  file: `${s.id}.mp3`,
  duration: s.duration,
}))
writeFileSync(join(LIBRARY_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log(`\n✓ ${genCount} SFX generated (${SFX.length - genCount} skipped)`)
console.log(`  manifest.json updated (${SFX.length} entries)`)
console.log(`  Cost ước tính: ~$${(genCount * 0.05).toFixed(2)}`)
