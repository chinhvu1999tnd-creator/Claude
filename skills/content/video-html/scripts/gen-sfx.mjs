#!/usr/bin/env node
/**
 * gen-sfx.mjs — Generate sound effect via ElevenLabs Sound Effects API, cache to assets/sfx/.
 *
 * Manifest format (assets/sfx/manifest.json):
 *   { "version": "1.0", "items": [
 *     { name, file, duration_ms, tags[], gen_prompt, gen_at, cost_usd }
 *   ] }
 *
 * Exports:
 *   genSfx({ name, prompt, duration_seconds, tags? }) → { file, cached, manifest_item }
 *
 * CLI:
 *   node gen-sfx.mjs --name logo-pop --prompt "short logo pop, modern UI" --duration 0.2 --tags "ui,confirm,pop"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, join, resolve as pathResolve } from 'path'
import { fileURLToPath } from 'url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SFX_DIR = pathResolve(SCRIPT_DIR, '../assets/sfx')
const MANIFEST_PATH = join(SFX_DIR, 'manifest.json')

const API_URL = 'https://api.elevenlabs.io/v1/sound-generation'
const SFX_COST_PER_SEC = 0.008 // approximate

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

function findItem(manifest, name) {
  return manifest.items.find(i => i.name === name)
}

export async function genSfx({ name, prompt, duration_seconds, tags = [], force = false }) {
  if (!name || !prompt || !duration_seconds) {
    throw new Error('genSfx requires { name, prompt, duration_seconds }')
  }
  const manifest = loadManifest()
  const existing = findItem(manifest, name)
  const filePath = join(SFX_DIR, `${name}.mp3`)

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
      text: prompt,
      duration_seconds: Math.max(0.5, Math.min(22, duration_seconds)),
      prompt_influence: 0.5
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SFX API ${res.status}: ${err}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(filePath, buf)

  const item = {
    name,
    file: `${name}.mp3`,
    duration_ms: Math.round(duration_seconds * 1000),
    tags,
    gen_prompt: prompt,
    gen_at: new Date().toISOString(),
    cost_usd: +(duration_seconds * SFX_COST_PER_SEC).toFixed(4),
    size_bytes: buf.length
  }

  manifest.items = manifest.items.filter(i => i.name !== name)
  manifest.items.push(item)
  saveManifest(manifest)

  return { file: `${name}.mp3`, cached: false, manifest_item: item }
}

// CLI mode
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isMain) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, v, i, arr) => {
      if (v.startsWith('--')) acc.push([v.slice(2), arr[i + 1]])
      return acc
    }, [])
  )
  if (!args.name || !args.prompt || !args.duration) {
    console.error('Usage: gen-sfx.mjs --name X --prompt "..." --duration 0.5 [--tags "a,b"] [--force]')
    process.exit(1)
  }
  const r = await genSfx({
    name: args.name,
    prompt: args.prompt,
    duration_seconds: parseFloat(args.duration),
    tags: args.tags ? args.tags.split(',').map(t => t.trim()) : [],
    force: 'force' in args
  })
  console.log(r.cached ? `cached: ${r.file}` : `generated: ${r.file} ($${r.manifest_item.cost_usd})`)
}
