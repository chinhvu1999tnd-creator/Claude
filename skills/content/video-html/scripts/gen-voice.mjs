#!/usr/bin/env node
/**
 * gen-voice.mjs — Gen voice + alignment cho video-html phase 2 qua ElevenLabs
 *
 * Input:  scenes.json
 *           { scenes: [{i: 1, voiceover: "..."}, ...], voice_id: "..." }
 * Output: audio/scene-N.mp3 + alignment.json trong cùng folder
 *
 * Usage: node gen-voice.mjs path/to/scenes.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join, resolve } from 'path'

const MODEL_ID = 'eleven_turbo_v2_5'
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true }
const RATE_LIMIT_RETRY_MS = 5000
const MAX_RETRIES = 3

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
  console.error('Missing ELEVENLABS_API_KEY in .env (root) or env var')
  process.exit(1)
}

const scenesPath = process.argv[2]
if (!scenesPath || !existsSync(scenesPath)) {
  console.error('Usage: node gen-voice.mjs path/to/scenes.json')
  process.exit(1)
}

const data = JSON.parse(readFileSync(scenesPath, 'utf8'))
const { scenes, voice_id } = data
if (!scenes || !voice_id) {
  console.error('scenes.json must have { scenes: [...], voice_id: "..." }')
  process.exit(1)
}

const outDir = dirname(scenesPath)
const audioDir = join(outDir, 'audio')
if (!existsSync(audioDir)) mkdirSync(audioDir, { recursive: true })

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function genSceneOnce(scene) {
  // Canonical schema uses `content`. `voiceover` kept as optional override (cho trường hợp
  // voice script khác text hiển thị, ví dụ pronunciation hint).
  const text = scene.voiceover || scene.content
  if (!text) {
    throw new Error(`Scene ${scene.i}: thiếu cả content và voiceover`)
  }
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/with-timestamps`
  const body = JSON.stringify({
    text,
    model_id: MODEL_ID,
    voice_settings: VOICE_SETTINGS
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body
  })

  if (!res.ok) {
    const errText = await res.text()
    const err = new Error(`Scene ${scene.i} failed: ${res.status} ${errText}`)
    err.status = res.status
    throw err
  }

  const json = await res.json()
  const audioBuffer = Buffer.from(json.audio_base64, 'base64')
  const audioFile = join(audioDir, `scene-${scene.i}.mp3`)
  writeFileSync(audioFile, audioBuffer)

  return {
    i: scene.i,
    audio_file: `audio/scene-${scene.i}.mp3`,
    alignment: json.alignment,
    duration_ms: Math.round(json.alignment.character_end_times_seconds.slice(-1)[0] * 1000)
  }
}

async function genScene(scene) {
  let lastErr
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await genSceneOnce(scene)
    } catch (e) {
      lastErr = e
      if (e.status === 429 && attempt < MAX_RETRIES) {
        console.warn(`  Rate limited, retry ${attempt}/${MAX_RETRIES} after ${RATE_LIMIT_RETRY_MS}ms`)
        await sleep(RATE_LIMIT_RETRY_MS)
        continue
      }
      throw e
    }
  }
  throw lastErr
}

const results = []
let totalChars = 0
for (const scene of scenes) {
  const text = scene.voiceover || scene.content
  console.log(`Scene ${scene.i}: ${text.slice(0, 60)}...`)
  try {
    const r = await genScene(scene)
    results.push(r)
    totalChars += text.length
    console.log(`  Saved audio/scene-${r.i}.mp3 (${r.duration_ms}ms)`)
  } catch (e) {
    console.error(`  Failed: ${e.message}`)
    process.exit(1)
  }
}

const alignmentFile = join(outDir, 'alignment.json')
writeFileSync(alignmentFile, JSON.stringify({
  voice_id,
  model_id: MODEL_ID,
  scenes: results.map(r => ({ i: r.i, ...r.alignment }))
}, null, 2))

const durationsFile = join(outDir, '_durations.json')
writeFileSync(durationsFile, JSON.stringify(
  results.map(r => ({ i: r.i, duration_ms: r.duration_ms, audio_file: r.audio_file })),
  null, 2
))

const costUsd = (totalChars * 0.00015).toFixed(4)
console.log(`\n${results.length} scenes generated`)
console.log(`alignment.json + audio/scene-{1..${results.length}}.mp3`)
console.log(`Cost: ~$${costUsd} (${totalChars} chars × $0.00015/char)`)
