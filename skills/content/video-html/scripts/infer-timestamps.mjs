#!/usr/bin/env node
// skills/content/video-html/scripts/infer-timestamps.mjs
/**
 * infer-timestamps.mjs — Tính appear_at_ms cho từng layer dựa trên alignment từ ElevenLabs.
 *
 * Exports:
 *   findAccentTiming(targetText, characters, startTimes) → number | null
 *   inferLayerTimings(scene, alignment) → scene with appear_at_ms filled
 *
 * CLI usage:
 *   node infer-timestamps.mjs path/to/folder
 *   (reads scenes-with-layers.json + alignment.json, writes scenes-resolved.json)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, resolve as pathResolve } from 'path'
import { fileURLToPath as urlToPath } from 'url'

const FIXED_DELAYS = {
  background: 0,
  label: 200,
  heading: 400,
  sub: 800
}

const ACCENT_FALLBACK_NO_ALIGNMENT = 1000

export function findAccentTiming(targetText, characters, startTimes) {
  if (!targetText || !characters || characters.length === 0) return null

  const concat = characters.join('')
  let idx = concat.indexOf(targetText)
  if (idx === -1) {
    idx = concat.toLowerCase().indexOf(targetText.toLowerCase())
    if (idx === -1) return null
  }

  // Map ngược: concat-char-position → characters[] index
  let consumed = 0
  for (let charIdx = 0; charIdx < characters.length; charIdx++) {
    if (consumed >= idx) return Math.round(startTimes[charIdx] * 1000)
    consumed += characters[charIdx].length
  }
  return Math.round(startTimes[startTimes.length - 1] * 1000)
}

export function inferLayerTimings(scene, alignment) {
  const result = { ...scene, layers: scene.layers.map(l => ({ ...l })) }
  const hasAlignment = !!alignment && alignment.characters && alignment.characters.length > 0

  const sceneDurationMs = hasAlignment && alignment.character_end_times_seconds && alignment.character_end_times_seconds.length > 0
    ? Math.round(alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1] * 1000)
    : null

  for (const layer of result.layers) {
    if (layer.type === 'accent' && layer.target_text) {
      if (hasAlignment) {
        const t = findAccentTiming(layer.target_text, alignment.characters, alignment.character_start_times_seconds)
        layer.appear_at_ms = t !== null ? t : (sceneDurationMs ? Math.round(sceneDurationMs / 2) : ACCENT_FALLBACK_NO_ALIGNMENT)
      } else {
        layer.appear_at_ms = ACCENT_FALLBACK_NO_ALIGNMENT
      }
    } else if (layer.type === 'mono') {
      layer.appear_at_ms = sceneDurationMs ? Math.max(0, sceneDurationMs - 1500) : 1500
    } else {
      layer.appear_at_ms = FIXED_DELAYS[layer.type] ?? 0
    }
  }

  if (sceneDurationMs) result.duration_ms = sceneDurationMs
  return result
}

// CLI mode
const isMain = (() => {
  try {
    const scriptPath = urlToPath(import.meta.url)
    const argPath = pathResolve(process.argv[1])
    return scriptPath === argPath
  } catch { return false }
})()
if (isMain) {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: node infer-timestamps.mjs path/to/folder')
    process.exit(1)
  }
  const scenesFile = join(folder, 'scenes-with-layers.json')
  const alignFile = join(folder, 'alignment.json')

  if (!existsSync(scenesFile)) {
    console.error(`Missing ${scenesFile}`)
    process.exit(1)
  }

  const { scenes } = JSON.parse(readFileSync(scenesFile, 'utf8'))
  const alignments = existsSync(alignFile)
    ? JSON.parse(readFileSync(alignFile, 'utf8')).scenes
    : null

  const resolved = scenes.map(scene => {
    const a = alignments ? alignments.find(x => x.i === scene.i) : null
    return inferLayerTimings(scene, a)
  })

  const outFile = join(folder, 'scenes-resolved.json')
  writeFileSync(outFile, JSON.stringify({ scenes: resolved }, null, 2))
  console.log(`Resolved ${resolved.length} scenes → ${outFile}`)
}
