#!/usr/bin/env node
/**
 * build-preview.mjs — Main dispatcher for video-html v2.1
 *
 * Input:  storyboard.json (or scenes.json) with scenes[] using archetype+slots (v2.1) or layers[] (v2.0 legacy)
 * Output: preview.html + meta.json + transcript.md + audio/ + sfx/ + music/ + logos/ in folder
 *
 * Usage:
 *   node skills/content/video-html/scripts/build-preview.mjs path/to/video-html-folder
 *
 * Expects storyboard.json in folder. If alignment.json exists, uses it for timing.
 * If not, calls gen-voice.mjs first.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs'
import { dirname, join, resolve as pathResolve, basename } from 'path'
import { fileURLToPath } from 'url'
import { findAccentTiming } from './infer-timestamps.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = pathResolve(SCRIPT_DIR, '..')
const TEMPLATES_DIR = join(SKILL_DIR, 'templates')
const PATTERNS_DIR = join(TEMPLATES_DIR, 'patterns')
const ASSETS_DIR = join(SKILL_DIR, 'assets')

// ───────────────────────────────────────────────────────────
// Mustache-lite renderer
// ───────────────────────────────────────────────────────────
export function render(tpl, ctx) {
  // Sections {{#name}}...{{/name}} (array = repeat, truthy = render once, falsy = skip)
  tpl = tpl.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, body) => {
    const v = ctx[key]
    if (Array.isArray(v)) return v.map(item =>
      render(body, { ...ctx, ...(typeof item === 'object' ? item : { '.': item }) })
    ).join('')
    if (v) return render(body, ctx)
    return ''
  })
  // Inverse {{^name}}...{{/name}}
  tpl = tpl.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, k, b) => !ctx[k] ? render(b, ctx) : '')
  // Raw HTML {{{name}}}
  tpl = tpl.replace(/\{\{\{(\w+)\}\}\}/g, (_, k) => ctx[k] ?? '')
  // Escaped {{name}} or {{.}}
  tpl = tpl.replace(/\{\{(\w+|\.)\}\}/g, (_, k) => {
    const v = k === '.' ? (ctx['.'] ?? '') : (ctx[k] ?? '')
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  })
  return tpl
}

// ───────────────────────────────────────────────────────────
// Geometry helpers (per-pattern computation)
// ───────────────────────────────────────────────────────────

// P5: line chart SVG inner
function chartLineSvg(data, w=800, h=420, padding=40) {
  const max = Math.max(...data) * 1.1
  const stepX = (w - padding*2) / (data.length - 1)
  const points = data.map((v, i) => [padding + i*stepX, h - padding - (v/max) * (h - padding*2)])
  const d = `M ${points.map(p => p.join(',')).join(' L ')}`
  const dArea = `${d} L ${points[points.length-1][0]},${h-padding} L ${points[0][0]},${h-padding} Z`
  const grid = [0.25, 0.5, 0.75, 1].map(f => {
    const y = h - padding - f*(h - padding*2)
    return `<line class="grid" x1="${padding}" y1="${y}" x2="${w-padding}" y2="${y}"/>`
  }).join('')
  const dots = points.map(([x,y], i) => `<circle class="data-dot" cx="${x}" cy="${y}" r="8" style="animation-delay: ${1600 + i*150}ms;"/>`).join('')
  return `<defs><linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.5"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <line class="axis" x1="${padding}" y1="${h-padding}" x2="${w-padding}" y2="${h-padding}"/>
    <path class="line-area" d="${dArea}"/>
    <path class="line-path" d="${d}"/>
    ${dots}`
}

// P5: bar chart SVG inner
function chartBarSvg(data, labels=[], w=800, h=420, padding=60) {
  const max = Math.max(...data) * 1.15
  const barW = (w - padding*2) / data.length * 0.6
  const gap = (w - padding*2) / data.length * 0.4
  const bars = data.map((v, i) => {
    const x = padding + i * (barW + gap) + gap/2
    const bh = (v/max) * (h - padding*1.5)
    const y = h - padding/2 - bh
    return `<rect class="bar" x="${x}" y="${y}" width="${barW}" height="${bh}" rx="6" style="animation-delay: ${500 + i*200}ms;"/>` +
           `<text class="bar-label" x="${x + barW/2}" y="${y - 12}" style="animation-delay: ${500 + i*200 + 600}ms;">${v}</text>` +
           (labels[i] ? `<text class="axis-label" x="${x + barW/2}" y="${h - padding/4}" text-anchor="middle">${labels[i]}</text>` : '')
  }).join('')
  return `<line class="axis" x1="${padding}" y1="${h-padding/2}" x2="${w-padding}" y2="${h-padding/2}"/>${bars}`
}

// P5: gauge SVG inner
function chartGaugeSvg(value, max=100, unit='%', w=800, h=420) {
  const cx = w/2, cy = h - 80
  const r = 180
  const circumference = Math.PI * r // half circle
  const ratio = Math.max(0, Math.min(1, value/max))
  const offset = circumference * (1 - ratio)
  return `<path class="gauge-bg" d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}"/>
    <path class="gauge-fg" d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" style="--gauge-offset: ${offset};"/>
    <text class="gauge-val" x="${cx}" y="${cy - 30}">${value}<tspan class="gauge-unit"> ${unit}</tspan></text>`
}

// P7: Bezier arc from (x1,y1) to (x2,y2) curving outward
function p7ArcPath(x1, y1, x2, y2) {
  const mx = (x1+x2)/2, my = (y1+y2)/2
  const dx = x2-x1, dy = y2-y1
  const len = Math.hypot(dx, dy) || 1
  const perpX = -dy/len * 80
  const perpY = dx/len * 80
  return `M ${x1},${y1} Q ${mx+perpX},${my+perpY} ${x2},${y2}`
}

// P8: line endpoints from callout to product center
function p8LineCoords(callouts, productX=400, productY=400, productR=160) {
  const positions = {
    tl: { x: 160, y: 100 }, tr: { x: 640, y: 100 },
    bl: { x: 160, y: 700 }, br: { x: 640, y: 700 },
    l:  { x: 60,  y: 400 }, r:  { x: 740, y: 400 }
  }
  return callouts.map(c => {
    const p = positions[c.position] || positions.tl
    const dx = productX - p.x, dy = productY - p.y
    const len = Math.hypot(dx, dy) || 1
    return {
      line_x1: p.x, line_y1: p.y,
      line_x2: productX - dx/len * productR,
      line_y2: productY - dy/len * productR
    }
  })
}

// P18: arrow path SVG d
function p18ArrowPath(position) {
  switch (position) {
    case 'above': return 'M 50 10 Q 50 35, 50 55'
    case 'below': return 'M 50 5 Q 50 25, 50 50'
    case 'left':  return 'M 10 30 Q 50 30, 90 30'
    case 'right': return 'M 90 30 Q 50 30, 10 30'
    default: return 'M 50 10 Q 50 35, 50 55'
  }
}

// P22 + P7: VN cities preset
const CITY_PRESETS = {
  vn: {
    'Hà Nội':       { x: 540, y: 200 },
    'Hải Phòng':    { x: 620, y: 260 },
    'Đà Nẵng':      { x: 600, y: 600 },
    'Hồ Chí Minh':  { x: 540, y: 940 },
    'Cần Thơ':      { x: 470, y: 1000 }
  },
  sea: {
    'Hà Nội':       { x: 600, y: 280 },
    'Bangkok':      { x: 350, y: 480 },
    'Jakarta':      { x: 540, y: 800 },
    'Manila':       { x: 880, y: 540 },
    'Kuala Lumpur': { x: 480, y: 720 },
    'Singapore':    { x: 500, y: 760 },
    'Hồ Chí Minh':  { x: 590, y: 620 }
  },
  world: {
    'Hà Nội':       { x: 800, y: 450 },
    'Tokyo':        { x: 920, y: 380 },
    'Singapore':    { x: 800, y: 550 },
    'San Francisco':{ x: 130, y: 380 },
    'New York':     { x: 250, y: 400 },
    'London':       { x: 510, y: 320 },
    'Paris':        { x: 530, y: 340 },
    'Sydney':       { x: 980, y: 760 }
  }
}

// Simplified region SVGs
const REGION_SVG = {
  vn: '<path d="M 480 100 L 560 120 L 580 200 L 620 320 L 600 480 L 580 620 L 540 740 L 500 860 L 460 980 L 480 1080 L 520 1140 L 560 1100 L 540 1000 L 580 880 L 620 760 L 660 620 L 680 480 L 660 320 L 620 220 L 580 140 Z"/>',
  sea: '<path d="M 300 200 L 400 180 L 500 220 L 600 200 L 700 240 L 800 220 L 900 280 L 920 400 L 880 540 L 800 660 L 700 720 L 600 760 L 540 800 L 480 760 L 420 700 L 380 620 L 320 520 L 300 400 Z"/>',
  world: '<path d="M 80 280 L 280 240 L 380 260 L 480 240 L 580 280 L 680 260 L 780 280 L 880 320 L 960 360 L 980 440 L 960 540 L 920 640 L 860 720 L 740 760 L 600 740 L 480 760 L 360 740 L 240 700 L 140 640 L 80 540 L 60 440 L 80 360 Z"/>'
}

// P25: orthogonal-ish Bezier path between flowchart nodes
function p25Path(fromNode, toNode) {
  const f = fromNode, t = toNode
  const dy = (t.y - f.y) * 0.4
  return `M ${f.x} ${f.y + 40} C ${f.x} ${f.y + 40 + dy}, ${t.x} ${t.y - 40 - dy}, ${t.x} ${t.y - 40}`
}

// ───────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────
const BG_POS = {
  'top-left':     'top:-300px;left:-300px;',
  'top-right':    'top:-300px;right:-300px;',
  'bottom-left':  'bottom:-300px;left:-300px;',
  'bottom-right': 'bottom:-300px;right:-300px;',
  'center':       'top:50%;left:50%;transform:translate(-50%,-50%);'
}

function applyAccent(text, word) {
  if (!word || !text || !text.includes(word)) return text
  return text.replace(word, `<span class="accent-target" data-target="${word}">${word}</span>`)
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function loadPattern(id) {
  const html = readFileSync(join(PATTERNS_DIR, `${id}.html`), 'utf8')
  const css = readFileSync(join(PATTERNS_DIR, `${id}.css`), 'utf8')
  return { html, css }
}

function loadAlignment(folder) {
  const f = join(folder, 'alignment.json')
  if (!existsSync(f)) return null
  return JSON.parse(readFileSync(f, 'utf8'))
}

function findSceneAlignment(alignment, i) {
  if (!alignment || !alignment.scenes) return null
  return alignment.scenes.find(s => s.i === i)
}

// ───────────────────────────────────────────────────────────
// Per-archetype slot enrichment
// (compute derived fields AI doesn't need to provide)
// ───────────────────────────────────────────────────────────
function enrichSlots(archetype, slots, alignment, sceneAlign) {
  const s = { ...slots }

  switch (archetype) {
    case 'P1': {
      s.bg_position_style = BG_POS[s.bg_position || 'top-left'] || ''
      s.bg_color = s.bg_color || 'var(--accent)'
      s.heading_font_size = s.heading_font_size || 140
      s.headline_html = applyAccent(s.headline, s.accent_word)
      break
    }
    case 'P9': {
      s.bg_position_style = BG_POS[s.bg_position || 'bottom-right'] || ''
      s.quote_html = applyAccent(s.quote, s.accent_word)
      break
    }
    case 'P3': {
      const L = s.left || {}, R = s.right || {}
      s.left_label = L.label; s.left_text = L.text; s.left_color = L.color || 'muted'
      s.right_label = R.label; s.right_text = R.text; s.right_color = R.color || 'accent'
      s.divider_text = s.divider_text || 'VS'
      break
    }
    case 'P4': {
      s.columns = s.columns || (s.items?.length === 4 ? 2 : 3)
      s.items = (s.items || []).map((it, i) => ({ ...it, delay: 500 + i*300 }))
      break
    }
    case 'P19': {
      s.cols = (s.cols || []).map((it, i) => ({ ...it, delay: 500 + i*250 }))
      break
    }
    case 'P5': {
      const data = s.data || []
      if (s.chart_type === 'line')   s.chart_svg = chartLineSvg(data)
      else if (s.chart_type === 'bar')  s.chart_svg = chartBarSvg(data, s.labels)
      else if (s.chart_type === 'gauge') s.chart_svg = chartGaugeSvg(data[0], s.y_max || 100, s.unit || '%')
      break
    }
    case 'P6': {
      const items = s.items || []
      s.columns = s.columns || (items.length === 1 ? 1 : items.length <= 4 ? 2 : 3)
      // delay per item, used when no voice_cue available
      s.headline_delay = (items.length * 500) + 1000
      s.headline_after_html = s.headline_after ? applyAccent(s.headline_after, s.headline_accent) : ''
      break
    }
    case 'P7': {
      const region = s.region || 'vn'
      s.region_svg = REGION_SVG[region] || REGION_SVG.vn
      const preset = CITY_PRESETS[region] || {}
      // Enrich cities
      s.cities = (s.cities || []).map((c, i) => {
        const coords = c.x != null && c.y != null ? { x: c.x, y: c.y } : preset[c.name] || { x: 540, y: 600 }
        const role = c.role || 'hub'
        const dot_color = role === 'origin' ? '#faf9f5' : role === 'dest' ? '#F0226A' : 'var(--accent)'
        return {
          ...c, ...coords, role, dot_color,
          dot_r: 14, halo_r: 24,
          label_y: coords.y - 26,
          dot_delay: 300 + i*200,
          name_delay: 300 + i*200 + 200
        }
      })
      // Enrich routes
      const cityMap = Object.fromEntries(s.cities.map(c => [c.name, c]))
      s.routes = (s.routes || []).map((r, i) => {
        const f = cityMap[r.from], t = cityMap[r.to]
        if (!f || !t) return null
        return {
          ...r,
          arc_path: p7ArcPath(f.x, f.y, t.x, t.y),
          label_x: (f.x + t.x) / 2 + 40,
          label_y: (f.y + t.y) / 2,
          route_delay: 1500 + i*600,
          label_delay: 1000
        }
      }).filter(Boolean)
      break
    }
    case 'P8': {
      const callouts = s.callouts || []
      const lc = p8LineCoords(callouts)
      s.center_asset = s.center?.asset
      s.center_label = s.center?.label
      s.callouts = callouts.map((c, i) => ({
        ...c, ...lc[i],
        delay: 700 + i*400,
        line_delay: 700 + i*400 - 100
      }))
      break
    }
    case 'P11': {
      const steps = s.steps || []
      s.orientation = s.orientation || 'horizontal'
      s.steps = steps.map((st, i) => ({
        ...st,
        i: i + 1,
        status: st.status || 'todo',
        delay: 500 + i*350
      }))
      break
    }
    case 'P13': {
      s.format = s.format || 'digital'
      const units = s.units || []
      s.units = units.map((u, i) => ({ ...u, delay: 500 + i*200 }))
      s.end_delay = 500 + units.length*200 + 300
      break
    }
    case 'P15': {
      const L = s.left || {}, R = s.right || {}
      s.left_name = L.name; s.left_asset = L.asset; s.left_color = L.color
      s.left_initial = L.name ? L.name[0].toUpperCase() : '?'
      s.right_name = R.name; s.right_asset = R.asset; s.right_color = R.color
      s.right_initial = R.name ? R.name[0].toUpperCase() : '?'
      s.vs_label = s.vs_label || 'VS'
      break
    }
    case 'P16': {
      s.cols = s.cols || 2
      const items = s.items || []
      s.items = items.map((it, i) => ({ ...it, delay: 500 + i*200 }))
      break
    }
    case 'P17': {
      const items = s.items || []
      const accentIdx = s.accent_index
      const hasCues = items.some(it => it.voice_cue)
      s.items = items.map((it, i) => ({
        ...it,
        highlighted: i === accentIdx,
        delay: hasCues ? 99999 : 500 + i*250
      }))
      break
    }
    case 'P18': {
      const callouts = s.callouts || []
      s.object_label = s.object?.label
      s.object_sub = s.object?.sub
      s.callouts = callouts.map((c, i) => ({
        ...c,
        delay: 800 + i*500,
        arrow_delay: 800 + i*500 + 100,
        arrow_path: p18ArrowPath(c.position)
      }))
      break
    }
    case 'P23': {
      s.color = s.color || 'var(--accent)'
      const t = s.doodle_type
      s.is_underline = t === 'underline'
      s.is_circle    = t === 'circle'
      s.is_arrow     = t === 'arrow'
      s.is_checkmark = t === 'checkmark'
      break
    }
    case 'P24': {
      s.rotation_axis = s.rotation_axis || 'both'
      s.depth = s.depth ?? 0.6
      const c = s.card_content || {}
      s.headline = c.headline; s.sub = c.sub; s.mono = c.mono
      break
    }
    case 'P25': {
      const nodes = s.nodes || []
      const conns = s.connections || []
      const enrichedNodes = nodes.map((n, i) => ({
        ...n,
        x_pct: n.x / 10,
        y_pct: n.y / 8,
        type: n.type || 'process',
        node_delay: 500 + i*400
      }))
      s.nodes = enrichedNodes
      const nodeMap = Object.fromEntries(enrichedNodes.map(n => [n.id, n]))
      s.connections = conns.map((c, i) => {
        const f = nodeMap[c.from], t = nodeMap[c.to]
        if (!f || !t) return null
        return {
          ...c,
          path_d: p25Path(f, t),
          label_x: (f.x + t.x) / 2 + 20,
          label_y: (f.y + t.y) / 2,
          draw_delay: 500 + nodes.length*400 + i*300,
          label_delay: 500 + nodes.length*400 + i*300 + 500
        }
      }).filter(Boolean)
      break
    }
  }
  return s
}

// ───────────────────────────────────────────────────────────
// Compute cue timings from voice alignment (P6 logo-roll, etc.)
// ───────────────────────────────────────────────────────────
function computeCueTimings(scene, sceneAlign) {
  const cues = []
  if (!sceneAlign || !scene.slots?.items) return cues
  for (const item of scene.slots.items) {
    if (!item.voice_cue) continue
    const ts = findAccentTiming(item.voice_cue, sceneAlign.characters, sceneAlign.character_start_times_seconds)
    if (ts != null) cues.push({ cue: item.voice_cue, appear_at_ms: ts })
  }
  // Fallback: if no cues found but items have voice_cue, use stagger
  if (cues.length === 0 && scene.slots.items.some(i => i.voice_cue)) {
    scene.slots.items.forEach((item, i) => {
      if (item.voice_cue) cues.push({ cue: item.voice_cue, appear_at_ms: 500 + i*400 })
    })
  }
  return cues
}

// ───────────────────────────────────────────────────────────
// Compute SFX cues with proper timing
// ───────────────────────────────────────────────────────────
function computeSfxCues(scene) {
  const sfxSpec = scene.sfx
  if (!sfxSpec) return []
  const specs = Array.isArray(sfxSpec) ? sfxSpec : [sfxSpec]
  const cues = []
  for (const spec of specs) {
    if (spec.trigger === 'per_item' && scene.slots?.items) {
      scene.slots.items.forEach((item, i) => {
        const at = item.voice_cue ? findItemTiming(scene, item.voice_cue) : (500 + i*(spec.stagger_ms || 400))
        cues.push({ name: spec.name, at, gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_col' && scene.slots?.cols) {
      scene.slots.cols.forEach((col, i) => {
        cues.push({ name: spec.name, at: 500 + i*(spec.stagger_ms || 250), gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_step' && scene.slots?.steps) {
      scene.slots.steps.forEach((step, i) => {
        cues.push({ name: spec.name, at: 500 + i*(spec.stagger_ms || 350), gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_callout' && scene.slots?.callouts) {
      scene.slots.callouts.forEach((c, i) => {
        cues.push({ name: spec.name, at: 800 + i*(spec.stagger_ms || 500), gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_route' && scene.slots?.routes) {
      scene.slots.routes.forEach((r, i) => {
        cues.push({ name: spec.name, at: 1500 + i*(spec.stagger_ms || 600), gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_node' && scene.slots?.nodes) {
      scene.slots.nodes.forEach((n, i) => {
        cues.push({ name: spec.name, at: 500 + i*(spec.stagger_ms || 400), gain: spec.gain ?? 0.85 })
      })
    } else if (spec.trigger === 'per_connection' && scene.slots?.connections) {
      const offset = (scene.slots?.nodes?.length || 0) * 400
      scene.slots.connections.forEach((c, i) => {
        cues.push({ name: spec.name, at: 500 + offset + i*(spec.stagger_ms || 300), gain: spec.gain ?? 0.85 })
      })
    } else {
      cues.push({ name: spec.name, at: spec.at ?? 0, gain: spec.gain ?? 0.85 })
    }
  }
  return cues
}

function findItemTiming(scene, voiceCue) {
  // Re-lookup from cue_timings already computed
  const ct = scene._cueTimings || []
  const m = ct.find(c => c.cue === voiceCue)
  return m ? m.appear_at_ms : 0
}

// ───────────────────────────────────────────────────────────
// Legacy v2.0 scene renderer (layers[] schema)
// ───────────────────────────────────────────────────────────
function renderLegacyScene(s, totalScenes) {
  const accentTimings = (s.layers || []).filter(l => l.type === 'accent')
    .map(l => ({ target: l.target_text, appear_at_ms: l.appear_at_ms }))
  const accentAttr = accentTimings.length
    ? ` data-accent-timings='${JSON.stringify(accentTimings)}'`
    : ''
  const layerHtml = (s.layers || []).map(l => renderLegacyLayer(l)).filter(Boolean).join('\n')
  return `<section class="scene" data-i="${s.i}" data-duration="${s.duration_ms}"${accentAttr}>
      <div class="num">${String(s.i).padStart(2,'0')} / ${String(totalScenes).padStart(2,'0')}</div>
${layerHtml}
      <audio class="voice" src="audio/scene-${s.i}.mp3" preload="auto"></audio>
    </section>`
}

function renderLegacyLayer(l) {
  const delay = `animation-delay:${l.appear_at_ms || 0}ms;`
  switch (l.type) {
    case 'background':
      if (l.variant === 'grid') return `      <div class="layer bg-grid" style="${delay}"></div>`
      return `      <div class="layer bg-glow" style="${BG_POS[l.position] || ''}background:${l.color || 'var(--accent)'};${delay}"></div>`
    case 'label':   return `      <div class="layer label fade-up" style="${delay}">${l.content}</div>`
    case 'heading': return `      <h1 class="layer heading fade-up" style="${l.font_size ? `font-size:${l.font_size}px;` : ''}${delay}">${l.content}</h1>`
    case 'sub':     return `      <p class="layer sub fade-up" style="${delay}">${l.content}</p>`
    case 'mono':    return `      <div class="layer mono" style="${delay}">${l.content}</div>`
    case 'accent':  return null
    default:        return null
  }
}

// ───────────────────────────────────────────────────────────
// Asset copy
// ───────────────────────────────────────────────────────────
function copyAssetsToFolder(usedSfx, usedLogos, music, folder) {
  if (usedSfx.size) mkdirSync(join(folder, 'sfx'), { recursive: true })
  if (usedLogos.size) mkdirSync(join(folder, 'logos'), { recursive: true })
  if (music) mkdirSync(join(folder, 'music'), { recursive: true })

  for (const name of usedSfx) {
    const src = join(ASSETS_DIR, 'sfx', `${name}.mp3`)
    if (existsSync(src)) copyFileSync(src, join(folder, 'sfx', `${name}.mp3`))
    else console.warn(`  ⚠ sfx missing: ${name}.mp3 (run gen-sfx.mjs or seed-library.mjs)`)
  }
  for (const logoPath of usedLogos) {
    // logoPath can be "logos/lovable.svg" or just "lovable.svg"
    const base = basename(logoPath)
    const src = join(ASSETS_DIR, 'logos', base)
    if (existsSync(src)) copyFileSync(src, join(folder, 'logos', base))
    else console.warn(`  ⚠ logo missing: ${base}`)
  }
  if (music) {
    const src = join(ASSETS_DIR, 'music', `${music}.mp3`)
    if (existsSync(src)) copyFileSync(src, join(folder, 'music', `${music}.mp3`))
    else console.warn(`  ⚠ music missing: ${music}.mp3`)
  }
}

function resolveMusicFile(mood, totalSec) {
  const manifestPath = join(ASSETS_DIR, 'music', 'manifest.json')
  if (!existsSync(manifestPath)) return `${mood}-60s`
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const candidates = manifest.items.filter(i => i.mood === mood)
  if (candidates.length === 0) return `${mood}-60s`
  const needMs = totalSec * 1000
  const fits = candidates.filter(c => c.duration_ms >= needMs).sort((a,b) => a.duration_ms - b.duration_ms)
  if (fits.length) return fits[0].name
  const longest = candidates.sort((a,b) => b.duration_ms - a.duration_ms)[0]
  console.warn(`  ⚠ longest ${mood} music is ${longest.duration_ms/1000}s, video is ${totalSec}s — will loop`)
  return longest.name
}

function collectAssets(scenes) {
  const sfx = new Set(), logos = new Set()
  for (const s of scenes) {
    if (s.sfx) {
      const specs = Array.isArray(s.sfx) ? s.sfx : [s.sfx]
      for (const spec of specs) if (spec.name) sfx.add(spec.name)
    }
    if (s.slots) {
      // P6 items[].logo_asset
      for (const it of (s.slots.items || [])) {
        if (it.logo_asset) logos.add(it.logo_asset)
        if (it.asset) logos.add(it.asset)
      }
      // P8 center.asset, P15 left/right.asset, P17 items[].asset
      if (s.slots.center?.asset) logos.add(s.slots.center.asset)
      if (s.slots.left?.asset) logos.add(s.slots.left.asset)
      if (s.slots.right?.asset) logos.add(s.slots.right.asset)
    }
  }
  return { sfx, logos }
}

// ───────────────────────────────────────────────────────────
// Main build
// ───────────────────────────────────────────────────────────
export async function buildPreview(folder) {
  const sbPath = ['storyboard.json', 'scenes.json'].map(f => join(folder, f)).find(existsSync)
  if (!sbPath) throw new Error(`No storyboard.json or scenes.json in ${folder}`)
  const sb = JSON.parse(readFileSync(sbPath, 'utf8'))
  const aspect = sb.aspect || '9:16'
  const templatePath = join(TEMPLATES_DIR, aspect === '16:9' ? 'base-horizontal.html' : 'base-vertical.html')
  const template = readFileSync(templatePath, 'utf8')

  const alignment = loadAlignment(folder)
  const usedPatterns = new Set()
  let allPatternCss = ''

  // Process each scene
  const resolvedScenes = []
  const sceneHtmlParts = []

  for (const scene of sb.scenes) {
    if (scene.archetype) {
      // v2.1 pattern-based
      const sceneAlign = findSceneAlignment(alignment, scene.i)

      // Voice cue timings (for P6 logo-roll etc.)
      const cueTimings = computeCueTimings(scene, sceneAlign)
      scene._cueTimings = cueTimings

      // Enrich slots
      const enriched = enrichSlots(scene.archetype, scene.slots || {}, alignment, sceneAlign)

      // Inject computed delay for P6 items (sync to voice or fallback)
      if (scene.archetype === 'P6' && cueTimings.length > 0) {
        const lastCue = Math.max(...cueTimings.map(c => c.appear_at_ms))
        enriched.headline_delay = lastCue + 800
      }

      // SFX cues
      const sfxCues = computeSfxCues(scene)

      // Load pattern template
      if (!usedPatterns.has(scene.archetype)) {
        const { html, css } = loadPattern(scene.archetype)
        allPatternCss += `\n/* ${scene.archetype} */\n${css}\n`
        usedPatterns.add(scene.archetype)
      }
      const { html: ptpl } = loadPattern(scene.archetype)
      const body = render(ptpl, enriched)

      // Build scene wrapper
      const duration = scene.duration_ms ||
        (sceneAlign ? Math.round(sceneAlign.character_end_times_seconds.slice(-1)[0] * 1000) : 5000)
      const attrs = [
        `data-i="${scene.i}"`,
        `data-duration="${duration}"`,
        cueTimings.length ? `data-cue-timings='${JSON.stringify(cueTimings)}'` : '',
        sfxCues.length ? `data-sfx-cues='${JSON.stringify(sfxCues)}'` : ''
      ].filter(Boolean).join(' ')

      const audio = sceneAlign ? `<audio class="voice" src="audio/scene-${scene.i}.mp3" preload="auto"></audio>` : ''

      sceneHtmlParts.push(
        `<section class="scene archetype-${scene.archetype}" ${attrs}>
      <div class="num">${String(scene.i).padStart(2,'0')} / ${String(sb.scenes.length).padStart(2,'0')}</div>
${body}
      ${audio}
    </section>`
      )

      resolvedScenes.push({
        i: scene.i, archetype: scene.archetype, voiceover: scene.voiceover,
        duration_ms: duration, slots: enriched, sfx_cues: sfxCues, cue_timings: cueTimings
      })
    } else if (scene.layers) {
      // v2.0 legacy
      sceneHtmlParts.push(renderLegacyScene(scene, sb.scenes.length))
      resolvedScenes.push(scene)
    }
  }

  // Collect & copy assets
  const { sfx: usedSfx, logos: usedLogos } = collectAssets(sb.scenes)
  const totalSec = resolvedScenes.reduce((a,s) => a + s.duration_ms, 0) / 1000
  const musicName = sb.music?.mood ? resolveMusicFile(sb.music.mood, totalSec) : null
  copyAssetsToFolder(usedSfx, usedLogos, musicName, folder)

  // Music element
  const musicBlock = musicName
    ? `<audio id="music" loop preload="auto" src="music/${musicName}.mp3"></audio>`
    : ''

  // Subtitle blocks (one per scene with voiceover)
  const subtitleHtml = sb.scenes
    .filter(s => s.voiceover)
    .map(s => `  <p class="subtitle" data-i="${s.i}">${escapeHtml(s.voiceover)}</p>`)
    .join('\n')

  // Compose final HTML
  const theme = sb.theme || {}
  let html = template
    .replace('{{TITLE}}', sb.title || 'Video')
    .replace('{{THEME_BG}}', theme.bg || '#141413')
    .replace('{{THEME_ACCENT}}', theme.accent || '#B6FF00')
    .replace('  <!-- PATTERN_STYLES_PLACEHOLDER: build script injects <style> blocks for used patterns here -->',
             allPatternCss ? `  <style>${allPatternCss}</style>` : '')
    .replace('  <!-- SCENES_PLACEHOLDER: AI agent inject N <section class="scene"> here -->',
             sceneHtmlParts.join('\n\n'))
    .replace('<!-- MUSIC_PLACEHOLDER: build script injects <audio id="music" loop preload="auto" src="music/X.mp3"> or nothing -->',
             musicBlock)
    .replace('  <!-- SUBTITLE_PLACEHOLDER: build script injects <p class="subtitle" data-i="N">VOICEOVER</p> per scene -->',
             subtitleHtml)
    .replace('<!-- HYPERFRAMES_META_PLACEHOLDER: AI agent inject JSON here -->',
             `<!-- HYPERFRAMES_META: ${JSON.stringify({ version:'2.1', scenes: resolvedScenes }, null, 2)} -->`)

  // Inject Caveat font (for P23 doodle)
  if (usedPatterns.has('P23')) {
    html = html.replace('<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro',
      '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Be+Vietnam+Pro')
  }

  writeFileSync(join(folder, 'preview.html'), html)
  writeFileSync(join(folder, 'meta.json'), JSON.stringify({
    version: '2.1', title: sb.title, aspect, music: musicName,
    patterns_used: [...usedPatterns],
    scenes: resolvedScenes
  }, null, 2))

  return {
    scenes: resolvedScenes.length,
    duration_s: totalSec.toFixed(1),
    patterns: [...usedPatterns],
    music: musicName,
    sfx: [...usedSfx],
    logos: [...usedLogos]
  }
}

// CLI
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (isMain) {
  const folder = process.argv[2]
  if (!folder) { console.error('Usage: build-preview.mjs path/to/video-html-folder'); process.exit(1) }
  const r = await buildPreview(folder)
  console.log(`Built: ${folder}/preview.html`)
  console.log(`  scenes: ${r.scenes}, duration: ${r.duration_s}s`)
  console.log(`  patterns: ${r.patterns.join(', ')}`)
  console.log(`  music: ${r.music || '(none)'}`)
  console.log(`  sfx: ${r.sfx.join(', ') || '(none)'}`)
  console.log(`  logos: ${r.logos.length ? r.logos.length + ' files' : '(none)'}`)
}
