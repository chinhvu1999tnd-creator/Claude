#!/usr/bin/env node
/**
 * build-sfx-plan.mjs — Sinh sfx-plan.json deterministic theo mood (KHÔNG AI).
 *
 * Thay thế Bước 6 (AI sfx-picker) — saving ~30s + ~30K tokens.
 *
 * Strategy:
 *   - Mỗi mood có 1 template: 2-3 SFX với (id, at, volume)
 *   - 'at' có thể là:
 *       - Số tuyệt đối: anchor cứng (vd 0.0 = scene start)
 *       - Tỷ lệ "duration_*" (vd "duration_30%") → resolve theo scene duration
 *       - "keyword_*" (vd "keyword_impact") → tìm timestamp keyword phù hợp trong words[]
 *   - Volume default 0.7-0.9 (KHÔNG dưới 0.7 — đã verified file SFX peak 0dB)
 *
 * Usage: node build-sfx-plan.mjs <folder>
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const folder = process.argv[2]
if (!folder) { console.error('Usage: node build-sfx-plan.mjs <folder>'); process.exit(1) }

const scenesPath = join(folder, 'scenes.json')
if (!existsSync(scenesPath)) { console.error(`Missing ${scenesPath}`); process.exit(1) }
const scenesData = JSON.parse(readFileSync(scenesPath, 'utf8'))

// ─── MOOD SFX TEMPLATES — v2 SOFT-FIRST ─────────────────────────────
// Philosophy: 1 ambient transition (layer-in/bloom/breath) + 1-2 accent ting (chime/ding/sparkle)
// Volume range: 0.30-0.55 (background accent, KHÔNG foreground hit)
// Mỗi scene 2-3 SFX max — đỡ busy, đỡ chối tai
//
// SFX available (19 files trong sfx-library/):
//   Ambient: chime, ding, pop, sparkle, success-chime
//   Soft re-gen: alarm, drum-hit, bass-thump, whoosh-up, whoosh-down, glitch, beep-glitch, dark-rise
//   Transitions: layer-in, layer-out, slide-soft, bloom, tap-tick, breath

const SFX_TEMPLATES = {
  breaking: [
    { id: 'bloom',     at: 0.00,             volume: 0.45 },  // soft tonal swell vào hook
    { id: 'tap-tick',  at: 'keyword_impact', volume: 0.40 },  // soft tap @ keyword nhấn
    { id: 'chime',     at: 'duration_70%',   volume: 0.45 },  // ting nhẹ cuối
  ],
  dramatic: [
    { id: 'breath',    at: 0.00,             volume: 0.35 },  // gentle exhale opening
    { id: 'bloom',     at: 'keyword_impact', volume: 0.45 },  // soft scale-in cho keyword
    { id: 'sparkle',   at: 'duration_80%',   volume: 0.40 },  // light bell cuối
  ],
  tech: [
    { id: 'layer-in',  at: 0.00,             volume: 0.40 },  // ASMR fade-in opening
    { id: 'tap-tick',  at: 'keyword_impact', volume: 0.40 },  // gentle tap @ keyword
    { id: 'ding',      at: 'duration_70%',   volume: 0.45 },  // notification ding cuối
  ],
  energetic: [
    { id: 'slide-soft', at: 0.00,             volume: 0.50 },  // paper slide opening
    { id: 'pop',        at: 'keyword_impact', volume: 0.50 },  // light pop @ keyword
    { id: 'ding',       at: 'duration_75%',   volume: 0.50 },  // ping cuối
  ],
  inspiring: [
    { id: 'bloom',   at: 0.00,           volume: 0.40 },  // gentle bloom opening
    { id: 'sparkle', at: 'duration_50%', volume: 0.45 },  // shimmer giữa
  ],
  luxury: [
    { id: 'breath',  at: 0.00,           volume: 0.35 },  // calm exhale opening
    { id: 'chime',   at: 'duration_60%', volume: 0.45 },  // single ting elegant
  ],
  playful: [
    { id: 'pop',           at: 0.00,             volume: 0.50 },  // playful pop
    { id: 'tap-tick',      at: 'keyword_impact', volume: 0.40 },  // tap @ keyword
    { id: 'ding',          at: 'duration_80%',   volume: 0.50 },  // ping cuối
  ],
  calm: [
    { id: 'breath',  at: 0.00,           volume: 0.30 },  // very gentle exhale
    { id: 'chime',   at: 'duration_60%', volume: 0.40 },  // single ting nhẹ
  ],
  mystery: [
    { id: 'dark-rise', at: 0.00,             volume: 0.40 },  // warm ambient swell
    { id: 'layer-in',  at: 'keyword_impact', volume: 0.35 },  // ASMR appear @ keyword
  ],
  dark: [
    { id: 'breath',   at: 0.00,           volume: 0.30 },  // very calm exhale
    { id: 'tap-tick', at: 'duration_60%', volume: 0.35 },  // single soft tap
  ],
}

// ─── Resolver: 'keyword_impact' → tìm timestamp keyword "impact" trong scene.words ──

// Impact keywords thường có ngữ nghĩa NHẤN: số, brand, action word, exclamation
const IMPACT_PATTERNS = [
  /^[A-ZĐ]/,                                        // Capitalized word (proper noun, emphatic)
  /^\d+/,                                            // Starts with number
  /[%$₫]/,                                           // Currency / percent
  /^(triệu|tỷ|nghìn|trăm|chục)$/i,                  // Vietnamese magnitude
  /^(AI|GPT|API|MVP|CEO|CTO|VN|US|EU)$/i,           // Tech acronyms
  /^(sốc|wow|bùng|nổ|đập|tan|sập|crash|boom)$/i,    // Impact verbs
]

function findImpactWord(words, after = 0.1) {
  if (!words || words.length === 0) return null
  // Tìm word đầu tiên match impact pattern, ở after >= 0.1s (skip 0s — atmosphere)
  for (const w of words) {
    if (w.at < after) continue
    for (const pattern of IMPACT_PATTERNS) {
      if (pattern.test(w.word)) return w.at
    }
  }
  // Fallback: word ở midpoint
  const mid = Math.floor(words.length / 2)
  return words[mid].at
}

function resolveAt(at, scene) {
  if (typeof at === 'number') return at
  if (typeof at !== 'string') return 0
  if (at === 'keyword_impact') {
    const t = findImpactWord(scene.words || [], 0.3)
    return t !== null ? t : scene.duration * 0.3
  }
  const pct = at.match(/^duration_(\d+)%$/)
  if (pct) return scene.duration * (parseInt(pct[1]) / 100)
  return 0
}

// ─── Build sfx-plan ──────────────────────────────────────────────────

const sfxPlan = { scenes: [] }
for (const scene of scenesData.scenes) {
  const template = SFX_TEMPLATES[scene.mood] || SFX_TEMPLATES.tech
  const sceneSfx = template
    .map(item => {
      const at = resolveAt(item.at, scene)
      // Skip nếu at > scene.duration - 0.3 (SFX rơi quá sát end)
      if (at > scene.duration - 0.3) return null
      return { id: item.id, at: Math.round(at * 100) / 100, volume: item.volume }
    })
    .filter(Boolean)
  sfxPlan.scenes.push({
    sceneId: `scene-${scene.i}`,
    mood: scene.mood,
    sfx: sceneSfx,
  })
}

const outFile = join(folder, 'sfx-plan.json')
writeFileSync(outFile, JSON.stringify(sfxPlan, null, 2))

console.log(`✓ sfx-plan.json built (template-based, no AI):`)
for (const s of sfxPlan.scenes) {
  const summary = s.sfx.map(sfx => `${sfx.id}@${sfx.at}s`).join(', ')
  console.log(`  scene-${s.sceneId.split('-')[1]} (${s.mood}): ${summary || '(empty)'}`)
}
console.log(`Total SFX: ${sfxPlan.scenes.reduce((sum, s) => sum + s.sfx.length, 0)}`)
