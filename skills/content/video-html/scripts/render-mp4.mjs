#!/usr/bin/env node
/**
 * render-mp4.mjs — Render final.mp4 từ scene HTML snippets + voice + SFX + captions
 *
 * Input: folder chứa scenes.json, scenes/*.html (snippets), audio/*.mp3, sfx-plan.json, alignment.json
 * Output: final.mp4 (+ intermediate: renders/silent.mp4, voice.mp3, audio-mix.mp3)
 *
 * Usage: node render-mp4.mjs path/to/folder
 *
 * Requires:
 *   - npx hyperframes (CLI tool — no npm install needed, runs via npx)
 *   - ffmpeg installed (brew install ffmpeg)
 *
 * Pipeline:
 *   A. Compose scenes/*.html snippets + audio refs → index.html (HyperFrames composition)
 *   B. Scaffold hyperframes.json, meta.json, package.json in output folder
 *   C. Install caption-highlight component (npx hyperframes add) if not present
 *   D. Build transcript.json from alignment.json + cumulative scene starts
 *   E. Patch caption-highlight.html WORDS array with our transcript data
 *   F. npx hyperframes render <folder> → renders/silent.mp4 (captions burned via HyperFrames)
 *   G. ffmpeg concat voice tracks → voice.mp3
 *   H. ffmpeg mix SFX → audio-mix.mp3
 *   I. ffmpeg final encode: silent.mp4 + audio-mix.mp3 → final.mp4 (NO subtitle filter needed)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SFX_LIBRARY = resolve(__dirname, '..', 'sfx-library')

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: node render-mp4.mjs path/to/folder')
  console.error('')
  console.error('  path/to/folder must contain:')
  console.error('    scenes.json           — scene metadata (duration, words, etc.)')
  console.error('    scenes/scene-*.html   — per-scene HTML snippets (produced by Bước 5)')
  console.error('    audio/scene-*.mp3     — per-scene voice audio (produced by Bước 4)')
  console.error('    sfx-plan.json         — optional SFX plan (produced by Bước 6)')
  console.error('    alignment.json        — optional word-level timings (produced by Bước 4)')
  process.exit(1)
}

const absFolder = resolve(folder)

// ─── Verify ffmpeg ─────────────────────────────────────────────────────────
try {
  execSync('ffmpeg -version', { stdio: 'pipe' })
} catch (e) {
  console.error('ffmpeg not installed. Run: brew install ffmpeg')
  process.exit(1)
}

// ─── Verify hyperframes CLI ────────────────────────────────────────────────
try {
  execSync('npx --yes hyperframes --version', { stdio: 'pipe' })
} catch (e) {
  console.error('hyperframes CLI not available via npx. Ensure you have internet access or run:')
  console.error('  npm install -g hyperframes')
  process.exit(1)
}

// ─── Read inputs ───────────────────────────────────────────────────────────
const scenesData = JSON.parse(readFileSync(join(absFolder, 'scenes.json'), 'utf8'))
const sfxPlanFile = join(absFolder, 'sfx-plan.json')
const sfxPlan = existsSync(sfxPlanFile) ? JSON.parse(readFileSync(sfxPlanFile, 'utf8')) : { scenes: [] }
const alignmentFile = join(absFolder, 'alignment.json')
const alignment = existsSync(alignmentFile) ? JSON.parse(readFileSync(alignmentFile, 'utf8')) : null

const W = scenesData.aspect === '9:16' ? 1080 : 1920
const H = scenesData.aspect === '9:16' ? 1920 : 1080

// ─── Build cumulative scene start times ───────────────────────────────────
const sceneStarts = {}
let cumStart = 0
for (const s of scenesData.scenes) {
  sceneStarts[s.i] = cumStart
  cumStart += s.duration
}
const totalDuration = cumStart

// ─── Step A: Compose index.html (HyperFrames composition) ──────────────────
console.log(`Step A: Composing ${scenesData.scenes.length} scene snippets → index.html...`)

const clipDivs = []
const audioDivs = []

for (const s of scenesData.scenes) {
  const snippetFile = join(absFolder, 'scenes', `scene-${s.i}.html`)
  if (!existsSync(snippetFile)) throw new Error(`Missing snippet: ${snippetFile}`)

  const snippet = readFileSync(snippetFile, 'utf8')
  const startTime = sceneStarts[s.i]
  const duration = s.duration

  // Each snippet is a self-contained <div class="clip" ...> block produced by html-generator.
  // If it lacks the outer clip wrapper attributes, we inject them.
  // We detect by checking if snippet already has data-start attribute on its root element.
  let clipDiv
  if (/^<div\s[^>]*class="clip"/.test(snippet.trim())) {
    // Snippet already has clip wrapper — patch/override data-start and data-duration
    clipDiv = snippet.trim()
      .replace(/data-start="[^"]*"/, `data-start="${startTime}"`)
      .replace(/data-duration="[^"]*"/, `data-duration="${duration}"`)
    // Ensure data-track-index exists
    if (!clipDiv.includes('data-track-index')) {
      clipDiv = clipDiv.replace(/class="clip"/, 'class="clip" data-track-index="1"')
    }
  } else {
    // Legacy: snippet has old data-composition-id root — wrap in clip div
    clipDiv = `<div class="clip" data-scene-id="scene-${s.i}" data-start="${startTime}" data-duration="${duration}" data-track-index="1">
${snippet}
</div>`
  }

  clipDivs.push(clipDiv)

  // Audio element — each scene's voice track with absolute timing
  const audioRelPath = `audio/scene-${s.i}.mp3`
  const audioAbsPath = join(absFolder, audioRelPath)
  if (existsSync(audioAbsPath)) {
    audioDivs.push(
      `      <audio src="${audioRelPath}" data-start="${startTime}" data-duration="${duration}"></audio>`
    )
  }
}

// Caption sub-composition div — track-index 10 puts it above all scene clips
const captionDiv = `      <!-- HyperFrames caption-highlight sub-composition — captions burned here, no ffmpeg libass needed -->
      <div class="clip"
           data-composition-src="./compositions/components/caption-highlight.html"
           data-start="0"
           data-duration="${totalDuration}"
           data-track-index="10"></div>`

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        margin: 0;
        width: ${W}px;
        height: ${H}px;
        overflow: hidden;
        background: #000;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${totalDuration}"
      data-width="${W}"
      data-height="${H}"
    >

${clipDivs.join('\n\n')}

${audioDivs.join('\n')}

${captionDiv}

    </div>
    <script>
      // Master timeline — composes child scene timelines into a single "main"
      // timeline at their data-start offsets. HyperFrames waits for
      // window.__timelines["main"] before rendering.
      window.__timelines = window.__timelines || {};
      const __masterTl = gsap.timeline({ paused: true });
      document.querySelectorAll('[data-scene-id]').forEach(el => {
        const sceneId = el.dataset.sceneId;
        const startTime = parseFloat(el.dataset.start) || 0;
        if (window.__timelines[sceneId]) {
          __masterTl.add(window.__timelines[sceneId], startTime);
        }
      });
      window.__timelines["main"] = __masterTl;
    </script>
  </body>
</html>
`

writeFileSync(join(absFolder, 'index.html'), indexHtml)
console.log(`  ✓ index.html composed (${totalDuration.toFixed(2)}s total, ${scenesData.scenes.length} clips)`)

// ─── Step B: Scaffold HyperFrames project files ────────────────────────────
console.log(`Step B: Scaffolding hyperframes project files...`)

// hyperframes.json (required config)
const hyperframesJson = {
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
writeFileSync(join(absFolder, 'hyperframes.json'), JSON.stringify(hyperframesJson, null, 2))

// meta.json
const projectSlug = absFolder.split('/').filter(Boolean).pop()
const metaJson = {
  id: projectSlug,
  name: projectSlug,
  createdAt: new Date().toISOString()
}
writeFileSync(join(absFolder, 'meta.json'), JSON.stringify(metaJson, null, 2))

// package.json
const packageJson = {
  name: projectSlug,
  private: true,
  type: "module",
  scripts: {
    render: "npx --yes hyperframes@0.6.40 render"
  }
}
writeFileSync(join(absFolder, 'package.json'), JSON.stringify(packageJson, null, 2))

// Ensure renders/ directory exists (hyperframes output target)
mkdirSync(join(absFolder, 'renders'), { recursive: true })

console.log(`  ✓ hyperframes.json, meta.json, package.json scaffolded`)

// ─── Step C: Install caption-highlight component ───────────────────────────
console.log(`Step C: Installing caption-highlight component...`)
const captionCompDir = join(absFolder, 'compositions', 'components')
const captionCompFile = join(captionCompDir, 'caption-highlight.html')
mkdirSync(captionCompDir, { recursive: true })

if (!existsSync(captionCompFile)) {
  try {
    execSync(
      `npx --yes hyperframes@0.6.40 add caption-highlight`,
      { stdio: 'pipe', cwd: absFolder }
    )
    console.log(`  ✓ caption-highlight installed → compositions/components/caption-highlight.html`)
  } catch (e) {
    console.error('  ✗ hyperframes add caption-highlight failed:')
    console.error(e.stderr?.toString() || e.message)
    process.exit(1)
  }
} else {
  console.log(`  ✓ caption-highlight already present, skipping install`)
}

// ─── Step D: Build transcript.json from alignment.json ────────────────────
console.log(`Step D: Building transcript.json from alignment.json...`)
const transcriptFile = join(absFolder, 'transcript.json')

if (alignment) {
  // alignment.json structure: { voice_id, model_id, scenes: [...] }
  const alignmentScenes = Array.isArray(alignment) ? alignment : (alignment.scenes || [])
  const transcript = buildTranscript(alignmentScenes, sceneStarts)
  writeFileSync(transcriptFile, JSON.stringify(transcript, null, 2))
  console.log(`  ✓ transcript.json built (${transcript.length} words)`)
} else {
  // No alignment — build fallback transcript from scene words/content
  const transcript = buildFallbackTranscript(scenesData, sceneStarts)
  writeFileSync(transcriptFile, JSON.stringify(transcript, null, 2))
  console.log(`  ⚠ alignment.json not found — using fallback transcript (${transcript.length} words, no word-level timing)`)
}

// ─── Step E: Patch caption-highlight.html with our transcript ─────────────
console.log(`Step E: Patching caption-highlight.html with transcript data...`)
patchCaptionHighlight(captionCompFile, transcriptFile, totalDuration, W, H, scenesData.caption_style || {})
console.log(`  ✓ caption-highlight.html patched with ${JSON.parse(readFileSync(transcriptFile, 'utf8')).length} words`)

// ─── Step F: Run hyperframes CLI → renders/silent.mp4 ──────────────────────
console.log(`Step F: Running hyperframes CLI (captions rendered by HyperFrames Chromium)...`)
const rendersDir = join(absFolder, 'renders')
const silentFile = join(rendersDir, 'silent.mp4')

try {
  execSync(
    `npx --yes hyperframes render "${absFolder}" --output "${silentFile}" --fps 30 --quiet`,
    { stdio: 'inherit', timeout: 600_000 }
  )
} catch (e) {
  console.error('hyperframes render failed. Check index.html for syntax errors.')
  console.error('Tip: open index.html in browser to preview before rendering.')
  process.exit(1)
}
console.log(`  ✓ silent.mp4 rendered → renders/silent.mp4 (captions burned in via HyperFrames)`)

// ─── Step G: Concat voice tracks → voice.mp3 ───────────────────────────────
console.log(`Step G: ffmpeg concat voice tracks...`)
const audioFiles = scenesData.scenes.map(s => join(absFolder, 'audio', `scene-${s.i}.mp3`))
const concatList = audioFiles.map(f => `file '${f}'`).join('\n')
const concatListFile = join(absFolder, '_concat-list.txt')
writeFileSync(concatListFile, concatList)
const voiceFile = join(absFolder, 'voice.mp3')
execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -c copy "${voiceFile}"`, { stdio: 'pipe' })
console.log(`  ✓ voice.mp3 concatenated`)

// ─── Step H: Mix SFX + Background Music → audio-mix.mp3 ─────────────────────
// New audio pipeline (no dynaudnorm — protects SFX transients):
//   1. Voice (vol 1.0)
//   2. Each SFX → adelay + volume → individual channels
//   3. Music (background): trim/loop to totalDuration, fade in/out, low volume 0.15
//   4. Final amix: voice + sfx_channels + music, normalize=0
console.log(`Step H: ffmpeg mix voice + SFX + music...`)
const audioMixFile = join(absFolder, 'audio-mix.mp3')

// Collect all SFX with absolute timing
const allSfx = []
for (const scenePlan of (sfxPlan.scenes || [])) {
  const sceneIdMatch = scenePlan.sceneId.match(/scene-(\d+)/)
  if (!sceneIdMatch) continue
  const sceneI = parseInt(sceneIdMatch[1])
  const sceneStartMs = (sceneStarts[sceneI] || 0) * 1000
  for (const sfx of scenePlan.sfx) {
    const absStartMs = sceneStartMs + (sfx.at * 1000)
    const sfxFile = join(SFX_LIBRARY, `${sfx.id}.mp3`)
    if (!existsSync(sfxFile)) {
      console.warn(`  ⚠ SFX file not found: ${sfx.id}.mp3, skip`)
      continue
    }
    // Bump volume tối thiểu 0.7 — SFX file peak 0dB, mean -7dB → ở vol 0.7 vẫn ngang voice
    const volume = Math.max(sfx.volume || 0.7, 0.7)
    allSfx.push({ file: sfxFile, atMs: absStartMs, volume })
  }
}

// Resolve music file: scenesData.background_music.file (override) OR auto-pick từ assets/music/ theo mood overall
const MUSIC_LIBRARY = resolve(__dirname, '..', 'assets', 'music')
const MUSIC_BY_MOOD = {
  breaking:  'cinematic-build-60s.mp3',
  dramatic:  'cinematic-build-60s.mp3',
  mystery:   'cinematic-build-60s.mp3',
  tech:      'tech-upbeat-60s.mp3',
  energetic: 'edm-energetic-60s.mp3',
  playful:   'edm-energetic-60s.mp3',
  inspiring: 'ambient-soft-60s.mp3',
  calm:      'ambient-soft-60s.mp3',
  luxury:    'ambient-soft-60s.mp3',
  dark:      'ambient-soft-60s.mp3',
}
function pickMusicByDominantMood(scenes) {
  const counts = {}
  for (const s of scenes) counts[s.mood] = (counts[s.mood] || 0) + (s.duration || 0)
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return dominant ? MUSIC_BY_MOOD[dominant[0]] : 'tech-upbeat-60s.mp3'
}

let musicFile = null
const bgConfig = scenesData.background_music || {}
if (bgConfig.file && existsSync(resolve(absFolder, bgConfig.file))) {
  musicFile = resolve(absFolder, bgConfig.file)
} else if (bgConfig.file && existsSync(join(MUSIC_LIBRARY, bgConfig.file))) {
  musicFile = join(MUSIC_LIBRARY, bgConfig.file)
} else if (bgConfig.disabled !== true) {
  const auto = pickMusicByDominantMood(scenesData.scenes)
  const autoPath = join(MUSIC_LIBRARY, auto)
  if (existsSync(autoPath)) {
    musicFile = autoPath
    console.log(`  ♪ music auto-picked: ${auto} (dominant mood)`)
  }
}
const musicVolume = bgConfig.volume ?? 0.15
const musicFadeIn = bgConfig.fade_in ?? 1.0
const musicFadeOut = bgConfig.fade_out ?? 1.5

// Build ffmpeg pipeline
const allInputs = [`-i "${voiceFile}"`]
const filterParts = [`[0:a]volume=1.0[voice]`]
const mixLabels = ['[voice]']

// SFX channels
allSfx.forEach((s, i) => {
  allInputs.push(`-i "${s.file}"`)
  filterParts.push(`[${i + 1}:a]adelay=${s.atMs}|${s.atMs},volume=${s.volume}[sfx${i}]`)
  mixLabels.push(`[sfx${i}]`)
})

// Music channel (nếu có)
if (musicFile) {
  const musicInputIdx = 1 + allSfx.length
  allInputs.push(`-stream_loop -1 -i "${musicFile}"`)
  // Loop music, trim đến totalDuration, fade in/out, low volume
  const fadeOutStart = Math.max(0, totalDuration - musicFadeOut)
  filterParts.push(
    `[${musicInputIdx}:a]atrim=duration=${totalDuration.toFixed(2)},` +
    `afade=t=in:st=0:d=${musicFadeIn},` +
    `afade=t=out:st=${fadeOutStart.toFixed(2)}:d=${musicFadeOut},` +
    `volume=${musicVolume}[music]`
  )
  mixLabels.push('[music]')
}

if (allSfx.length === 0 && !musicFile) {
  // No SFX no music → copy voice
  execSync(`cp "${voiceFile}" "${audioMixFile}"`)
  console.log(`  ✓ no SFX/music, audio-mix.mp3 = voice.mp3`)
} else {
  const mix = `${mixLabels.join('')}amix=inputs=${mixLabels.length}:normalize=0:dropout_transition=0[out]`
  const fullFilter = [...filterParts, mix].join(';')
  const cmd = `ffmpeg -y ${allInputs.join(' ')} -filter_complex "${fullFilter}" -map "[out]" -c:a libmp3lame -b:a 192k "${audioMixFile}"`
  execSync(cmd, { stdio: 'pipe' })
  console.log(`  ✓ audio-mix.mp3 (voice + ${allSfx.length} SFX${musicFile ? ' + music' : ''})`)
}

// ─── Step I: Final encode silent.mp4 + audio-mix.mp3 → final.mp4 ────────────
// HyperFrames embeds <audio> tags from index.html into silent.mp4 — đó là voice-only stream.
// PHẢI dùng -map explicit để force video TỪ silent.mp4 và audio TỪ audio-mix.mp3
// (audio-mix.mp3 = voice + SFX + music). Không có -map → ffmpeg auto-pick silent.mp4 audio → SFX+music bị drop.
console.log(`Step I: ffmpeg final encode (audio mix onto HyperFrames-rendered video)...`)
const finalFile = join(absFolder, 'final.mp4')

execSync(
  `ffmpeg -y -i "${silentFile}" -i "${audioMixFile}" ` +
  `-map 0:v:0 -map 1:a:0 ` +    // ← VIDEO from silent.mp4, AUDIO from audio-mix.mp3 (CRITICAL)
  `-c:v copy ` +
  `-c:a aac -b:a 192k ` +
  `-shortest ` +
  `-movflags +faststart ` +
  `"${finalFile}"`,
  { stdio: 'pipe' }
)
console.log(`  ✓ final.mp4 encoded (video from silent.mp4 + audio-mix.mp3 voice+SFX+music)`)

// ─── Done ──────────────────────────────────────────────────────────────────
const finalStat = execSync(`stat -f%z "${finalFile}"`, { encoding: 'utf8' }).trim()
console.log(`\n✅ final.mp4 ready: ${(parseInt(finalStat)/1024/1024).toFixed(2)} MB`)
console.log(`   Path: ${finalFile}`)

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * buildTranscript — Convert ElevenLabs alignment.json + scene start offsets
 * into the word-level array that caption-highlight expects:
 *   [{ text: "Hello", start: 0.0, end: 0.5 }, ...]
 *
 * alignment.json is an array of per-scene alignment objects:
 *   [{ i: 0, characters: [...], character_start_times_seconds: [...], character_end_times_seconds: [...] }, ...]
 *
 * Characters are grouped into words by splitting on space characters.
 */
function buildTranscript(alignmentScenes, cumulativeStarts) {
  const words = []
  for (const sceneAlign of alignmentScenes) {
    const offsetSec = cumulativeStarts[sceneAlign.i] || 0
    const chars = sceneAlign.characters || []
    const starts = sceneAlign.character_start_times_seconds || []
    const ends = sceneAlign.character_end_times_seconds || []

    let cur = ''
    let curStart = 0
    let curEnd = 0

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i]
      const start = starts[i] || 0
      const end = ends[i] || 0

      if (c === ' ') {
        if (cur) {
          words.push({ text: cur, start: curStart + offsetSec, end: curEnd + offsetSec })
          cur = ''
        }
        continue
      }

      if (!cur) curStart = start
      cur += c
      curEnd = end
    }

    // Flush last word in scene
    if (cur) {
      words.push({ text: cur, start: curStart + offsetSec, end: curEnd + offsetSec })
      cur = ''
    }
  }
  return words
}

/**
 * buildFallbackTranscript — When alignment.json is unavailable, build approximate
 * word timings by spreading scene words evenly across scene duration.
 */
function buildFallbackTranscript(scenesData, cumulativeStarts) {
  const words = []
  for (const scene of scenesData.scenes) {
    const offsetSec = cumulativeStarts[scene.i] || 0
    const sceneWords = (scene.words && scene.words.length > 0)
      ? scene.words.map(w => ({ text: w.word, at: w.at }))
      : scene.content.split(/\s+/).map((word, idx, arr) => ({
          text: word,
          at: (idx / arr.length) * scene.duration
        }))

    for (let i = 0; i < sceneWords.length; i++) {
      const w = sceneWords[i]
      const nextAt = i < sceneWords.length - 1 ? sceneWords[i + 1].at : scene.duration
      words.push({
        text: w.text,
        start: w.at + offsetSec,
        end: Math.min(nextAt + offsetSec, offsetSec + scene.duration)
      })
    }
  }
  return words
}

/**
 * groupWords — Group flat word array into caption groups of 2-4 words.
 * Breaks on sentence boundaries (punctuation) or max group size.
 */
function groupWords(words, maxGroupSize = 4) {
  const groups = []
  let i = 0
  while (i < words.length) {
    const groupWords = []
    while (groupWords.length < maxGroupSize && i < words.length) {
      groupWords.push(words[i])
      const text = words[i].text
      i++
      // Break on sentence-ending punctuation
      if (/[.!?。]$/.test(text)) break
    }
    if (groupWords.length === 0) break
    const gi = groups.length
    const nextGroupStart = i < words.length ? words[i].start : null
    const lastWordEnd = groupWords[groupWords.length - 1].end
    const gEnd = nextGroupStart !== null
      ? Math.min(lastWordEnd + 0.5, nextGroupStart - 0.05)
      : lastWordEnd + 0.3
    groups.push({
      wordStart: groups.reduce((sum, g) => sum + g.words.length, 0),
      words: groupWords,
      start: groupWords[0].start,
      end: gEnd
    })
  }
  return groups
}

/**
 * patchCaptionHighlight — Rewrite the WORDS, RAW_GROUPS, and data-duration
 * in the installed caption-highlight.html with our video's actual transcript data.
 *
 * The component stores WORDS inline in <script> as a JS array literal.
 * We find the marker line "var WORDS = [" and replace everything up to the
 * corresponding closing "];" with our generated data.
 *
 * We also patch:
 *   - data-duration on the root composition element
 *   - data-width and data-height for the correct aspect ratio
 *   - viewport meta tag
 *   - html/body/container width/height in CSS
 */
function patchCaptionHighlight(compFile, transcriptFile, totalDuration, W, H, captionStyle = {}) {
  // captionStyle = {
  //   case: "as-is" | "lowercase" | "uppercase"  (default: "as-is" — natural casing từ transcript)
  //   color: "#fff" (optional, hex)
  //   pillColor: "#FF3838" (optional, hex)
  // }
  const caseMode = captionStyle.case || 'as-is'

  const transcript = JSON.parse(readFileSync(transcriptFile, 'utf8'))
  const groups = groupWords(transcript, 4)

  // Build WORDS JS array literal
  const wordsJs = transcript.map(w =>
    `          { text: ${JSON.stringify(w.text)}, start: ${w.start.toFixed(3)}, end: ${w.end.toFixed(3)} }`
  ).join(',\n')

  // Build RAW_GROUPS JS array literal
  // Each group is [wordStart, wordEnd] (inclusive index into WORDS array)
  let wordOffset = 0
  const rawGroupsJs = groups.map(g => {
    const ws = wordOffset
    const we = wordOffset + g.words.length - 1
    wordOffset += g.words.length
    return `          [${ws}, ${we}]`
  }).join(',\n')

  // Also need to update the last group's nextStart calculation:
  // GROUPS uses "8.0" as a hardcoded fallback — we replace it with totalDuration
  let html = readFileSync(compFile, 'utf8')

  // 1. Patch viewport width/height
  html = html.replace(
    /content="width=\d+, height=\d+"/,
    `content="width=${W}, height=${H}"`
  )

  // 2. Patch CSS html, body, #highlight, #hl-container dimensions
  html = html.replace(/width: 1920px;\s*height: 1080px;/g, `width: ${W}px;\n        height: ${H}px;`)
  html = html.replace(/width: 1920px;/g, `width: ${W}px;`)

  // 3. Patch .hl-group bottom positioning for portrait
  if (H > W) {
    // Portrait (9:16) — move captions higher up so they don't overlap face
    html = html.replace(/bottom: 140px;/, 'bottom: 200px;')
    html = html.replace(/padding: 0 100px;/, 'padding: 0 60px;')
  }

  // 4. Patch root composition element data-duration and dimensions
  html = html.replace(
    /(<div\s[^>]*data-composition-id="caption-highlight"[^>]*)data-start="0"\s+data-duration="\d+(?:\.\d+)?"\s+data-fps="\d+"\s+data-width="\d+"\s+data-height="\d+"/,
    `$1data-start="0" data-duration="${totalDuration.toFixed(2)}" data-fps="30" data-width="${W}" data-height="${H}"`
  )

  // 5. Replace the WORDS array content
  html = html.replace(
    /var WORDS = \[[\s\S]*?\];/,
    `var WORDS = [\n${wordsJs}\n        ];`
  )

  // 6. Replace the RAW_GROUPS array content
  html = html.replace(
    /var RAW_GROUPS = \[[\s\S]*?\];/,
    `var RAW_GROUPS = [\n${rawGroupsJs}\n        ];`
  )

  // 7. Replace the hardcoded fallback totalDuration in GROUPS map ("8.0" → actual)
  html = html.replace(
    /var nextStart = gi \+ 1 < RAW_GROUPS\.length \? WORDS\[RAW_GROUPS\[gi \+ 1\]\[0\]\]\.start : \d+(?:\.\d+)?;/,
    `var nextStart = gi + 1 < RAW_GROUPS.length ? WORDS[RAW_GROUPS[gi + 1][0]].start : ${totalDuration.toFixed(2)};`
  )

  // 8. Caption case: patch text-transform theo config
  //    default (as-is): bỏ text-transform: uppercase (giữ casing từ transcript)
  //    lowercase: text-transform: lowercase
  //    uppercase: giữ nguyên (HyperFrames default đã uppercase)
  if (caseMode === 'as-is' || caseMode === 'lowercase') {
    const newTransform = caseMode === 'lowercase' ? 'lowercase' : 'none'
    html = html.replace(/text-transform:\s*uppercase/g, `text-transform: ${newTransform}`)
  }

  writeFileSync(compFile, html)
}
