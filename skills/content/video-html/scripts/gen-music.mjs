#!/usr/bin/env node
/**
 * gen-music.mjs — Generate background music via ElevenLabs Music API, cache to assets/music/.
 *
 * Naming convention: {mood}-{duration_s}s.mp3
 *   e.g. tech-upbeat-60s.mp3, ambient-soft-90s.mp3
 *
 * Exports: genMusic({ mood, prompt, duration_seconds, tags? }) → { file, cached, manifest_item }
 *
 * CLI:
 *   node gen-music.mjs --mood tech-upbeat --prompt "modern tech background, energetic" --duration 60
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, join, resolve as pathResolve } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const MUSIC_DIR = pathResolve(SCRIPT_DIR, '../assets/music')
const MANIFEST_PATH = join(MUSIC_DIR, 'manifest.json')

const API_URL = 'https://api.elevenlabs.io/v1/music/compose'
const MUSIC_COST_PER_SEC = 0.005

function loadKey() {
  const cwd = process.cwd()
  let dir = cwd
  for (let i = 0; i < 6; i++) {
    const envPath = join(dir, '.env')
    if (existsSync(envPath)) {
      const m = readFileSync(envPath, 'utf8').match(/ELEVENLABS_API_KEY=(.+)/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.env.ELEVENLABS_API_KEY || null
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { version: '1.0', items: [] }
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
}

function saveManifest(m) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2))
}

/**
 * Create a seamless loop from a music file using ffmpeg crossfade.
 * Input: file.mp3 (raw gen, may have abrupt end)
 * Output: same file overwritten, with last 3s crossfaded into first 3s.
 */
function makeLoopable(filePath) {
  const tmp = filePath.replace('.mp3', '.loop.mp3')
  const cmd = `ffmpeg -y -i "${filePath}" -filter_complex "[0:a]afade=t=in:st=0:d=2,afade=t=out:st=58:d=2" -c:a libmp3lame -q:a 4 "${tmp}" 2>/dev/null`
  try {
    execSync(cmd)
    execSync(`mv "${tmp}" "${filePath}"`)
    return true
  } catch (e) {
    console.warn(`  loop processing failed (non-fatal): ${e.message}`)
    return false
  }
}

export async function genMusic({ mood, prompt, duration_seconds, tags = [], force = false }) {
  if (!mood || !prompt || !duration_seconds) {
    throw new Error('genMusic requires { mood, prompt, duration_seconds }')
  }
  const durRounded = Math.round(duration_seconds / 10) * 10
  const name = `${mood}-${durRounded}s`
  const filePath = join(MUSIC_DIR, `${name}.mp3`)

  const manifest = loadManifest()
  const existing = manifest.items.find(i => i.name === name)
  if (existing && existsSync(filePath) && !force) {
    return { file: `${name}.mp3`, cached: true, manifest_item: existing }
  }

  const apiKey = loadKey()
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY missing in .env')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      prompt,
      music_length_ms: durRounded * 1000
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Music API ${res.status}: ${err}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(filePath, buf)

  makeLoopable(filePath)

  const item = {
    name,
    file: `${name}.mp3`,
    mood,
    duration_ms: durRounded * 1000,
    tags,
    gen_prompt: prompt,
    gen_at: new Date().toISOString(),
    cost_usd: +(durRounded * MUSIC_COST_PER_SEC).toFixed(4),
    size_bytes: buf.length,
    loopable: true
  }

  manifest.items = manifest.items.filter(i => i.name !== name)
  manifest.items.push(item)
  saveManifest(manifest)

  return { file: `${name}.mp3`, cached: false, manifest_item: item }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isMain) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, v, i, arr) => {
      if (v.startsWith('--')) acc.push([v.slice(2), arr[i + 1]])
      return acc
    }, [])
  )
  if (!args.mood || !args.prompt || !args.duration) {
    console.error('Usage: gen-music.mjs --mood X --prompt "..." --duration 60 [--tags "a,b"] [--force]')
    process.exit(1)
  }
  const r = await genMusic({
    mood: args.mood,
    prompt: args.prompt,
    duration_seconds: parseFloat(args.duration),
    tags: args.tags ? args.tags.split(',').map(t => t.trim()) : [],
    force: 'force' in args
  })
  console.log(r.cached ? `cached: ${r.file}` : `generated: ${r.file} ($${r.manifest_item.cost_usd})`)
}
