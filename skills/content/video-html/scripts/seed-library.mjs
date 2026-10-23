#!/usr/bin/env node
/**
 * seed-library.mjs — Pre-generate 10 SFX + 5 Music tracks for v2.1 patterns.
 *
 * Run this once before using video-html v2.1 patterns. Skips items already in manifest.
 *
 * Total cost: ~$1.50-2.00 first run, $0 subsequent.
 *
 * Usage:
 *   node skills/content/video-html/scripts/seed-library.mjs [--force]
 */

import { ensureFfmpeg } from './check-ffmpeg.mjs'
import { genSfx } from './gen-sfx.mjs'
import { genMusic } from './gen-music.mjs'

const FORCE = process.argv.includes('--force')

const SFX_SEEDS = [
  { name: 'logo-pop',       prompt: 'short logo pop sound, modern UI confirmation, crisp pluck, no music, no voice', duration_seconds: 0.3, tags: ['ui','confirm','pop','logo'] },
  { name: 'whoosh-impact',  prompt: 'short whoosh transition with subtle impact, modern motion graphics, no music', duration_seconds: 0.6, tags: ['transition','whoosh','motion'] },
  { name: 'count-up-tick',  prompt: 'single short digital tick, like counter increment, very brief metallic click', duration_seconds: 0.5, tags: ['data','counter','tick','digital'] },
  { name: 'notification',   prompt: 'short notification ding, soft modern alert tone, two-note positive', duration_seconds: 0.5, tags: ['alert','notification','news'] },
  { name: 'line-draw',      prompt: 'short ascending whoosh like drawing a line on screen, smooth sweep, no music', duration_seconds: 0.8, tags: ['draw','sweep','chart','reveal'] },
  { name: 'glitch',         prompt: 'brief digital glitch zap, electronic interference, no music', duration_seconds: 0.5, tags: ['glitch','vs','digital','impact'] },
  { name: 'chime-success',  prompt: 'short positive chime, two ascending bells, achievement reveal, no music', duration_seconds: 0.7, tags: ['success','chime','positive','reveal'] },
  { name: 'typewriter',     prompt: 'soft typewriter keystrokes, rapid typing, mechanical click pattern', duration_seconds: 1.5, tags: ['typewriter','text','keys'] },
  { name: 'countdown-tick', prompt: 'single deep clock tick, mechanical pendulum, timer suspense', duration_seconds: 0.8, tags: ['countdown','timer','clock'] },
  { name: 'pen-scratch',    prompt: 'pen scratching on paper, brief doodle stroke sound', duration_seconds: 0.6, tags: ['doodle','draw','pen','sketch'] }
]

const MUSIC_SEEDS = [
  { mood: 'tech-upbeat',          prompt: 'modern tech background music, upbeat electronic, light synth and drums, motivating and productive, instrumental, suitable for short tech video', duration_seconds: 60, tags: ['tech','upbeat','electronic','productivity'] },
  { mood: 'corporate-explainer',  prompt: 'corporate explainer background music, calm and professional, soft piano and ambient pads, suitable for B2B presentation, instrumental', duration_seconds: 90, tags: ['corporate','b2b','calm','explainer'] },
  { mood: 'cinematic-build',      prompt: 'cinematic build-up music, dramatic strings rising to climax, epic hook video soundtrack, instrumental, no vocals', duration_seconds: 60, tags: ['cinematic','dramatic','epic','build'] },
  { mood: 'ambient-soft',         prompt: 'soft ambient background music, gentle piano with light pads, calm and reflective, suitable for story or wellness content, instrumental', duration_seconds: 60, tags: ['ambient','calm','wellness','story'] },
  { mood: 'edm-energetic',        prompt: 'energetic EDM background music, electronic dance beat, exciting and celebratory, suitable for product launch announcement, instrumental', duration_seconds: 60, tags: ['edm','energetic','launch','celebration'] }
]

async function main() {
  console.log('=== video-html v2.1 library seed ===\n')

  ensureFfmpeg()
  console.log('ffmpeg OK\n')

  let totalCost = 0
  let genCount = 0
  let cacheCount = 0

  console.log(`SFX (${SFX_SEEDS.length} items):`)
  for (const seed of SFX_SEEDS) {
    process.stdout.write(`  ${seed.name.padEnd(18)} ... `)
    try {
      const r = await genSfx({ ...seed, force: FORCE })
      if (r.cached) {
        console.log('cached')
        cacheCount++
      } else {
        console.log(`gen ($${r.manifest_item.cost_usd}, ${(r.manifest_item.size_bytes/1024).toFixed(0)}KB)`)
        totalCost += r.manifest_item.cost_usd
        genCount++
      }
    } catch (e) {
      console.log(`FAIL: ${e.message}`)
    }
  }

  console.log(`\nMusic (${MUSIC_SEEDS.length} items):`)
  for (const seed of MUSIC_SEEDS) {
    const dur = Math.round(seed.duration_seconds / 10) * 10
    process.stdout.write(`  ${(seed.mood + '-' + dur + 's').padEnd(28)} ... `)
    try {
      const r = await genMusic({ ...seed, force: FORCE })
      if (r.cached) {
        console.log('cached')
        cacheCount++
      } else {
        console.log(`gen ($${r.manifest_item.cost_usd}, ${(r.manifest_item.size_bytes/1024).toFixed(0)}KB)`)
        totalCost += r.manifest_item.cost_usd
        genCount++
      }
    } catch (e) {
      console.log(`FAIL: ${e.message}`)
    }
  }

  console.log(`\nDone. Generated: ${genCount}, Cached: ${cacheCount}, Cost: $${totalCost.toFixed(2)}`)
}

main().catch(e => { console.error(e); process.exit(1) })
