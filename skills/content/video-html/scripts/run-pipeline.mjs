#!/usr/bin/env node
/**
 * run-pipeline.mjs — Orchestrator chạy non-AI stages của video-html pipeline.
 *
 * AI stages (Bước 1, 2, 5) phải do Claude làm trước (gen source.txt + scenes.json + scenes/*.html).
 * Script này chạy các stages còn lại tự động + tracking timing trong timing.json.
 *
 * Usage:
 *   node run-pipeline.mjs <folder> [--from-step <step>] [--skip-render]
 *
 *   --from-step <n>  : skip các stage trước (e.g. nếu voice.mp3 đã có, --from-step 5)
 *   --skip-render    : dừng trước Bước 7 (chỉ chạy đến validate)
 *   --quiet          : log gọn hơn
 *
 * Stages run:
 *   3. (nếu PEXELS_API_KEY) fetch-pexels.mjs
 *   4. gen-voice.mjs + update-scenes-from-alignment.mjs
 *   5.5. validate-snippets.mjs
 *   6. build-sfx-plan.mjs (skip nếu sfx-plan.json đã tồn tại do Claude làm bằng AI)
 *   7. render-mp4.mjs
 *
 * Output:
 *   timing.json — { stages: [{name, started_at, completed_at, duration_s}], total_seconds }
 *   final.mp4
 */

import { existsSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { execSync, spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = resolve(__dirname, '..')

const args = process.argv.slice(2)
const folder = args.find(a => !a.startsWith('--'))
const fromStep = parseInt(args[args.indexOf('--from-step') + 1]) || 3
const skipRender = args.includes('--skip-render')
const quiet = args.includes('--quiet')

if (!folder) {
  console.error('Usage: node run-pipeline.mjs <folder> [--from-step <n>] [--skip-render]')
  process.exit(1)
}

const absFolder = resolve(folder)
if (!existsSync(absFolder)) {
  console.error(`Folder not found: ${absFolder}`)
  process.exit(1)
}

const timingFile = join(absFolder, 'timing.json')
let timing = existsSync(timingFile)
  ? JSON.parse(readFileSync(timingFile, 'utf8'))
  : { started_at: new Date().toISOString(), stages: [] }

function runStage(name, fn) {
  const startedAt = new Date()
  const startMs = Date.now()
  console.log(`\n━━━ ${name} ━━━`)
  let status = 'completed'
  let error = null
  try {
    fn()
  } catch (e) {
    status = 'failed'
    error = e.message
    console.error(`  ✗ ${name} failed: ${e.message}`)
  }
  const completedAt = new Date()
  const durationS = (Date.now() - startMs) / 1000
  const entry = {
    name,
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
    duration_s: Math.round(durationS * 100) / 100,
    status,
  }
  if (error) entry.error = error
  timing.stages.push(entry)
  writeFileSync(timingFile, JSON.stringify(timing, null, 2))
  if (status === 'failed') process.exit(1)
  console.log(`  ✓ ${name} done (${durationS.toFixed(2)}s)`)
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: quiet ? 'pipe' : 'inherit', ...opts })
}

// ─── Stage 3: Pexels fetch (skip if no key or no image-plans.json) ────────────
if (fromStep <= 3) {
  const hasPexelsKey = existsSync(resolve(process.cwd(), '.env')) &&
    /PEXELS_API_KEY=.+/.test(readFileSync(resolve(process.cwd(), '.env'), 'utf8'))
  const hasImagePlans = existsSync(join(absFolder, 'image-plans.json'))
  if (hasPexelsKey && hasImagePlans) {
    runStage('Stage 3 — Pexels fetch', () => {
      run(`node "${join(SKILL_ROOT, 'scripts', 'fetch-pexels.mjs')}" "${absFolder}"`)
    })
  } else {
    console.log(`\n━━━ Stage 3 — Pexels fetch ━━━`)
    console.log(`  ⊘ Skip (${hasPexelsKey ? 'no image-plans.json' : 'no PEXELS_API_KEY'})`)
    timing.stages.push({ name: 'Stage 3 — Pexels fetch', status: 'skipped', duration_s: 0 })
  }
}

// ─── Stage 4: Voice gen + update scenes ───────────────────────────────────────
if (fromStep <= 4) {
  runStage('Stage 4 — Voice gen (ElevenLabs)', () => {
    run(`node "${join(SKILL_ROOT, 'scripts', 'gen-voice.mjs')}" "${join(absFolder, 'scenes.json')}"`)
  })
  runStage('Stage 4b — Update scenes (duration + words from alignment)', () => {
    run(`node "${join(SKILL_ROOT, 'scripts', 'update-scenes-from-alignment.mjs')}" "${absFolder}"`)
  })
}

// ─── Stage 5: HTML gen — DO BY AI (Claude), check files exist ────────────────
if (fromStep <= 5) {
  const scenesDir = join(absFolder, 'scenes')
  const scenesData = JSON.parse(readFileSync(join(absFolder, 'scenes.json'), 'utf8'))
  const expected = scenesData.scenes.length
  const actual = existsSync(scenesDir)
    ? (await import('fs')).readdirSync(scenesDir).filter(f => /^scene-\d+\.html$/.test(f)).length
    : 0
  if (actual < expected) {
    console.error(`\n✗ Stage 5 — HTML gen: chỉ có ${actual}/${expected} scenes/scene-*.html.`)
    console.error(`   AI agent (Claude) phải làm Bước 5 (HTML gen) trước khi chạy pipeline.`)
    console.error(`   Xem SKILL.md Bước 5 hoặc dùng build-subagent-prompt.mjs + spawn subagents.`)
    process.exit(1)
  }
  console.log(`\n━━━ Stage 5 — HTML gen ━━━\n  ✓ ${actual} scenes/scene-*.html (AI-generated)`)
}

// ─── Stage 5.5: Validate snippets ─────────────────────────────────────────────
if (fromStep <= 5.5) {
  runStage('Stage 5.5 — Validate snippets', () => {
    run(`node "${join(SKILL_ROOT, 'scripts', 'validate-snippets.mjs')}" "${absFolder}"`)
  })
}

// ─── Stage 6: SFX plan ────────────────────────────────────────────────────────
if (fromStep <= 6) {
  const sfxPlanFile = join(absFolder, 'sfx-plan.json')
  if (existsSync(sfxPlanFile)) {
    console.log(`\n━━━ Stage 6 — SFX plan ━━━\n  ✓ sfx-plan.json already exists (AI-generated or template)`)
    timing.stages.push({ name: 'Stage 6 — SFX plan', status: 'already_exists', duration_s: 0 })
  } else {
    // Try template script (Sprint 2)
    const sfxScript = join(SKILL_ROOT, 'scripts', 'build-sfx-plan.mjs')
    if (existsSync(sfxScript)) {
      runStage('Stage 6 — SFX plan (template per mood)', () => {
        run(`node "${sfxScript}" "${absFolder}"`)
      })
    } else {
      console.error(`\n✗ Stage 6 — SFX plan: chưa có sfx-plan.json và chưa có build-sfx-plan.mjs.`)
      console.error(`   AI agent phải làm Bước 6 (SFX picker) trước, hoặc đợi Sprint 2.`)
      process.exit(1)
    }
  }
}

// ─── Stage 7: Render MP4 ──────────────────────────────────────────────────────
if (fromStep <= 7 && !skipRender) {
  runStage('Stage 7 — Render MP4 (HyperFrames + ffmpeg)', () => {
    run(`node "${join(SKILL_ROOT, 'scripts', 'render-mp4.mjs')}" "${absFolder}"`)
  })
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const totalS = timing.stages.reduce((sum, s) => sum + (s.duration_s || 0), 0)
timing.total_seconds = Math.round(totalS * 100) / 100
timing.completed_at = new Date().toISOString()
writeFileSync(timingFile, JSON.stringify(timing, null, 2))

console.log(`\n${'═'.repeat(60)}`)
console.log(`PIPELINE SUMMARY`)
console.log(`${'═'.repeat(60)}`)
for (const s of timing.stages) {
  const status = s.status === 'completed' ? '✓' : s.status === 'skipped' ? '⊘' : s.status === 'already_exists' ? '↻' : '✗'
  console.log(`  ${status} ${s.name.padEnd(50)} ${s.duration_s.toFixed(2)}s`)
}
console.log(`${'═'.repeat(60)}`)
console.log(`  TOTAL (compute-only, excludes AI stages 1/2/5/6):  ${timing.total_seconds}s = ${(timing.total_seconds / 60).toFixed(2)} min`)
if (existsSync(join(absFolder, 'final.mp4'))) {
  const sizeMB = (statSync(join(absFolder, 'final.mp4')).size / 1024 / 1024).toFixed(2)
  console.log(`  Output: final.mp4 (${sizeMB} MB)`)
}
console.log(`  Timing log: ${timingFile}`)
