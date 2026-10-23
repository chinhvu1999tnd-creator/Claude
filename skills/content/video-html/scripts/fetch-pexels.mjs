#!/usr/bin/env node
/**
 * fetch-pexels.mjs — Download Pexels images/videos theo image-plans.json
 *
 * Input: folder chứa image-plans.json
 * Output: assets/{sceneId}.{ext} trong cùng folder
 *
 * Usage: node fetch-pexels.mjs path/to/folder
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'

function loadKey() {
  const rootEnv = resolve(process.cwd(), '.env')
  if (existsSync(rootEnv)) {
    const m = readFileSync(rootEnv, 'utf8').match(/PEXELS_API_KEY=(.+)/)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  }
  return process.env.PEXELS_API_KEY || null
}

const apiKey = loadKey()
if (!apiKey) {
  console.log('PEXELS_API_KEY not set, skipping Pexels fetch')
  process.exit(0)
}

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: node fetch-pexels.mjs path/to/folder')
  process.exit(1)
}

const plansFile = join(folder, 'image-plans.json')
if (!existsSync(plansFile)) {
  console.log('image-plans.json not found, skipping')
  process.exit(0)
}

const { plans } = JSON.parse(readFileSync(plansFile, 'utf8'))
const assetsDir = join(folder, 'assets')
if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true })

// Get aspect from scenes.json
const scenesFile = join(folder, 'scenes.json')
const scenesData = JSON.parse(readFileSync(scenesFile, 'utf8'))
const orientation = scenesData.aspect === '9:16' ? 'portrait' : 'landscape'

async function searchPhotos(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=${orientation}`
  const res = await fetch(url, { headers: { Authorization: apiKey } })
  if (!res.ok) {
    if (res.status === 429) throw new Error('Pexels rate limit')
    throw new Error(`Pexels search failed: ${res.status}`)
  }
  const data = await res.json()
  return data.photos[0]  // pick top result
}

async function searchVideos(query) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3&orientation=${orientation}`
  const res = await fetch(url, { headers: { Authorization: apiKey } })
  if (!res.ok) {
    if (res.status === 429) throw new Error('Pexels rate limit')
    throw new Error(`Pexels search failed: ${res.status}`)
  }
  const data = await res.json()
  if (!data.videos || data.videos.length === 0) return null
  const video = data.videos[0]
  // Pick highest quality HD file
  const file = video.video_files.find(f => f.quality === 'hd') || video.video_files[0]
  return { ...video, _file: file }
}

async function download(url, outFile) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(outFile, buf)
  return buf.length
}

const updated = []
for (const plan of plans) {
  if (plan.kind === 'none' || !plan.query) {
    updated.push({ ...plan, asset_file: null })
    continue
  }
  console.log(`${plan.sceneId} (${plan.kind}): "${plan.query}"`)
  try {
    let assetFile = null
    if (plan.kind === 'image') {
      const photo = await searchPhotos(plan.query)
      if (photo) {
        const outFile = join(assetsDir, `${plan.sceneId}.jpg`)
        const size = await download(photo.src.large2x || photo.src.large, outFile)
        console.log(`  ✓ downloaded ${assetFile} (${(size/1024).toFixed(0)}KB)`)
        assetFile = `assets/${plan.sceneId}.jpg`
      } else {
        console.log(`  ⚠ no photo found, skip`)
      }
    } else if (plan.kind === 'video') {
      const video = await searchVideos(plan.query)
      if (video) {
        const outFile = join(assetsDir, `${plan.sceneId}.mp4`)
        const size = await download(video._file.link, outFile)
        console.log(`  ✓ downloaded ${assetFile} (${(size/1024).toFixed(0)}KB)`)
        assetFile = `assets/${plan.sceneId}.mp4`
      } else {
        console.log(`  ⚠ no video found, skip`)
      }
    }
    updated.push({ ...plan, asset_file: assetFile })
  } catch (e) {
    console.error(`  ✗ ${e.message}`)
    updated.push({ ...plan, asset_file: null, error: e.message })
  }
}

writeFileSync(plansFile, JSON.stringify({ plans: updated }, null, 2))
console.log(`\nUpdated image-plans.json with asset_file paths`)
