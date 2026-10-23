#!/usr/bin/env node
/**
 * gen-logos.mjs — Generate 12 starter logo SVG (wordmark style) for v2.1 patterns.
 *
 * Each logo: 240x240 dark rounded card + brand-colored wordmark + distinguishing icon glyph.
 * Cohesive aesthetic — different visual feel than official brand assets (intentional, license-safe).
 *
 * User can replace any .svg with official brand asset by overwriting the file in assets/logos/.
 *
 * Usage: node skills/content/video-html/scripts/gen-logos.mjs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { dirname, join, resolve as pathResolve } from 'path'
import { fileURLToPath } from 'url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const LOGOS_DIR = pathResolve(SCRIPT_DIR, '../assets/logos')
const MANIFEST_PATH = join(LOGOS_DIR, 'manifest.json')

const CARD = (color, glyph, name) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
  <rect width="240" height="240" rx="32" fill="#1a1a1a"/>
  <g transform="translate(120 92)" fill="${color}">${glyph}</g>
  <text x="120" y="190" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="22" fill="#faf9f5" text-anchor="middle" letter-spacing="-0.02em">${name}</text>
</svg>`

// Glyph = small icon ~50px, centered, fill = brand color
const LOGOS = [
  { name: 'lovable',        label: 'Lovable',     color: '#FF4F8B', glyph: '<path d="M0-28c-12 0-22 8-26 18-2-6-10-12-20-12-12 0-22 10-22 22 0 26 36 44 48 50l20-10c12-6 48-24 48-50 0-12-10-22-22-22-10 0-18 6-20 12-4-10-14-18-26-18z" transform="scale(0.7)"/>' },
  { name: 'bolt',           label: 'Bolt.new',    color: '#FFCC1B', glyph: '<path d="M-8-32l-16 36h14L-14 32l28-40h-16l10-24z" transform="scale(1.1)"/>' },
  { name: 'v0',             label: 'v0',          color: '#ffffff', glyph: '<text font-family="Inter, system-ui" font-weight="900" font-size="80" text-anchor="middle" dominant-baseline="central">V0</text>' },
  { name: 'cursor',         label: 'Cursor',      color: '#ffffff', glyph: '<path d="M-30-30l60 24-22 8L0 30l-8-22z" transform="scale(0.9)"/>' },
  { name: 'claude',         label: 'Claude',      color: '#D97757', glyph: '<path d="M-26 18c-10-2-16-12-16-22 0-14 10-24 24-24 12 0 20 6 24 16M26-18c10 2 16 12 16 22 0 14-10 24-24 24-12 0-20-6-24-16" stroke="#D97757" stroke-width="8" stroke-linecap="round" fill="none"/>' },
  { name: 'chatgpt',        label: 'ChatGPT',     color: '#10A37F', glyph: '<path d="M-30-10c0-14 12-26 26-26 8 0 14 4 18 8 4-4 10-8 18-8 14 0 26 12 26 26 0 8-4 14-8 18 4 4 8 10 8 18 0 14-12 26-26 26-8 0-14-4-18-8-4 4-10 8-18 8-14 0-26-12-26-26 0-8 4-14 8-18-4-4-8-10-8-18z" transform="scale(0.7)"/>' },
  { name: 'gemini',         label: 'Gemini',      color: '#4285F4', glyph: '<path d="M0-36c2 18 16 32 34 34-18 2-32 16-34 34-2-18-16-32-34-34 18-2 32-16 34-34z"/>' },
  { name: 'replit',         label: 'Replit',      color: '#F26207', glyph: '<rect x="-26" y="-26" width="22" height="22" rx="4"/><rect x="4" y="-26" width="22" height="22" rx="4"/><rect x="-26" y="4" width="22" height="22" rx="4"/>' },
  { name: 'antigravity',    label: 'Antigravity', color: '#4285F4', glyph: '<path d="M0-32l-22 36h44z M-12 4h24v22h-24z"/>' },
  { name: 'windsurf',       label: 'Windsurf',    color: '#00D2C8', glyph: '<path d="M-32-8c8-8 22-8 30 0s22 8 30 0M-32 8c8-8 22-8 30 0s22 8 30 0M-32 24c8-8 22-8 30 0s22 8 30 0" stroke="#00D2C8" stroke-width="6" stroke-linecap="round" fill="none"/>' },
  { name: 'github-copilot', label: 'GH Copilot',  color: '#ffffff', glyph: '<path d="M0-36c-18 0-32 14-32 32 0 14 9 26 22 30v-10c-7-2-12-8-12-16 0-10 10-18 22-18s22 8 22 18c0 8-5 14-12 16v10c13-4 22-16 22-30 0-18-14-32-32-32zM-10 14c0 4 4 8 10 8s10-4 10-8" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>' },
  { name: 'openai',         label: 'OpenAI',      color: '#ffffff', glyph: '<path d="M28-6a18 18 0 00-2-15c-3-6-10-9-17-7-7-6-18-5-23 3-7 1-13 6-14 14a18 18 0 002 14c-3 6-2 14 4 18 5 6 13 8 19 4 5 6 14 7 20 2 7-1 13-7 14-15a18 18 0 00-3-18zm-26 36c-3 0-5-1-7-3l1-1 12-7 1 1v9zm26-9c0 1 0 3-1 5L15 18l1-1 12-7 1 1c1 2 1 3 1 5zm-29-26c2-2 5-3 7-3v9l-1 1L0-4l-1-1c0-1 0-3 1-4zm9 9l4-2 4 2v4l-4 2-4-2zm12-12c1 2 1 3 1 5L24 0l-1 1-12-7-1-1V-7c2 0 4 0 5 1l-1-1z" transform="scale(0.9)"/>' },
]

let manifest = { version: '1.0', items: [] }
if (existsSync(MANIFEST_PATH)) {
  try { manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) } catch {}
}

let wrote = 0
for (const l of LOGOS) {
  const filePath = join(LOGOS_DIR, `${l.name}.svg`)
  writeFileSync(filePath, CARD(l.color, l.glyph, l.label))
  const existing = manifest.items.findIndex(i => i.name === l.name)
  const item = {
    name: l.name,
    file: `${l.name}.svg`,
    label: l.label,
    brand_color: l.color,
    source: 'wordmark-generated',
    license: 'kit-generated, replace with official asset if needed'
  }
  if (existing >= 0) manifest.items[existing] = item
  else manifest.items.push(item)
  wrote++
}
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
console.log(`Generated ${wrote} logos → ${LOGOS_DIR}`)
console.log(`Manifest: ${MANIFEST_PATH}`)
