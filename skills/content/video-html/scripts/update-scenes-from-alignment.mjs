#!/usr/bin/env node
/**
 * update-scenes-from-alignment.mjs
 *
 * Sau Bước 4 (gen-voice), đọc alignment.json + cập nhật scenes.json in-place:
 *   - scenes[].duration = duration thực từ audio
 *   - scenes[].words    = [{at, word}] extracted từ character-level alignment
 *
 * Usage: node update-scenes-from-alignment.mjs <folder>
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: node update-scenes-from-alignment.mjs <folder>')
  process.exit(1)
}

const scenesPath = join(folder, 'scenes.json')
const alignmentPath = join(folder, 'alignment.json')

if (!existsSync(scenesPath)) { console.error(`Missing ${scenesPath}`); process.exit(1) }
if (!existsSync(alignmentPath)) { console.error(`Missing ${alignmentPath}`); process.exit(1) }

const scenesData = JSON.parse(readFileSync(scenesPath, 'utf8'))
const alignmentData = JSON.parse(readFileSync(alignmentPath, 'utf8'))
const alignmentScenes = Array.isArray(alignmentData) ? alignmentData : (alignmentData.scenes || [])

/**
 * Extract word-level timings từ character-level alignment.
 * Diacritic chars (á, ổ, ư...) được concat vào word liền kề.
 */
function extractWords(alignment) {
  const chars = alignment.characters || []
  const starts = alignment.character_start_times_seconds || []
  const words = []
  let cur = ''
  let wordStart = null

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    const isSep = /[\s.,!?;:""''()\-—]/.test(c) || c === ' '
    if (!isSep) {
      if (cur === '') wordStart = starts[i]
      cur += c
    } else if (cur !== '') {
      words.push({ word: cur, at: Math.round(wordStart * 1000) / 1000 })
      cur = ''
      wordStart = null
    }
  }
  if (cur !== '') {
    words.push({ word: cur, at: Math.round(wordStart * 1000) / 1000 })
  }
  return words
}

for (const scene of scenesData.scenes) {
  const a = alignmentScenes.find(x => x.i === scene.i)
  if (!a) {
    console.warn(`  ⚠ scene ${scene.i}: không tìm thấy alignment, skip`)
    continue
  }
  const ends = a.character_end_times_seconds || []
  if (ends.length === 0) {
    console.warn(`  ⚠ scene ${scene.i}: alignment thiếu character_end_times_seconds`)
    continue
  }
  scene.duration = Math.round(ends[ends.length - 1] * 100) / 100
  scene.words = extractWords(a)
}

writeFileSync(scenesPath, JSON.stringify(scenesData, null, 2))

console.log(`Updated scenes.json:`)
for (const s of scenesData.scenes) {
  console.log(`  scene-${s.i}: duration=${s.duration}s, words=${(s.words || []).length}`)
}
const total = scenesData.scenes.reduce((sum, s) => sum + (s.duration || 0), 0)
console.log(`  Total: ${total.toFixed(2)}s`)
