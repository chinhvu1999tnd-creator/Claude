#!/usr/bin/env node
/**
 * list-voices.mjs — List voices từ ElevenLabs account.
 *
 * Usage: node list-voices.mjs [output-cache.json]
 * Default cache: skills/content/video-html/voices-cache.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const cachePath = process.argv[2] || resolve(__dirname, '..', 'voices-cache.json')

const res = await fetch('https://api.elevenlabs.io/v1/voices', {
  headers: { 'xi-api-key': apiKey, 'Accept': 'application/json' }
})

if (!res.ok) {
  if (res.status === 401) {
    const errText = await res.text()
    if (errText.includes('voices_read') || errText.includes('missing_permissions')) {
      console.warn('API key missing voices_read permission.')
      console.warn('Manage permissions: https://elevenlabs.io/app/settings/api-keys')
      console.warn('')
      console.warn('Fallback: recommended voices (Turbo v2.5 supports Vietnamese):')
      console.warn('')
      const fallback = [
        { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel',  labels: 'female, calm, american' },
        { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',    labels: 'female, strong, american' },
        { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',   labels: 'female, soft, american' },
        { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni',  labels: 'male, well-rounded, american' },
        { voice_id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', labels: 'male, casual, australian' },
        { voice_id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily',    labels: 'female, warm, british' }
      ]
      fallback.forEach(v => console.warn(`  ${v.voice_id}  ${v.name}  ${v.labels}`))
      console.warn('')
      console.warn('Copy a voice_id into BUSINESS.md to use it.')
      process.exit(0)
    }
  }
  console.error(`Failed: ${res.status} ${await res.text()}`)
  process.exit(1)
}

const { voices } = await res.json()
const simplified = voices.map(v => ({
  voice_id: v.voice_id,
  name: v.name,
  category: v.category,
  labels: v.labels,
  preview_url: v.preview_url
}))

writeFileSync(cachePath, JSON.stringify(simplified, null, 2))

console.log(`${simplified.length} voices found:`)
console.log()
simplified.forEach(v => {
  const labels = v.labels && Object.values(v.labels).filter(Boolean).join(', ')
  console.log(`  ${v.voice_id}  ${v.name}  [${v.category}]${labels ? '  ' + labels : ''}`)
})
console.log()
console.log(`Cached to: ${cachePath}`)
