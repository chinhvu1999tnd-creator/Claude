#!/usr/bin/env node
/**
 * build-subagent-prompt.mjs
 *
 * Main agent gọi script này để build prompt TỐI ƯU cho 1 subagent — inline
 * relevant references thay vì để sub Read 5-7 file riêng. Mục tiêu giảm token cost.
 *
 * Usage:
 *   node build-subagent-prompt.mjs --folder <path> --scene <i>
 *
 * Output:
 *   In ra stdout — prompt text complete để main agent paste vào Agent tool call.
 *
 * Token saving: sub không cần Read 5 ref files → tiết kiệm ~25K tokens/sub.
 *
 * Refs còn KHÔNG inline (sub vẫn Read nếu cần):
 *   - layout-patterns.md (16K, conditional, sub tự decide pull pattern)
 *   - svg-toolkit.md (6K, conditional, scene-specific)
 *   - product-mode.md (7K, chỉ khi PRODUCT MODE)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]])
    return acc
  }, [])
)

const folder = args.folder
const sceneI = parseInt(args.scene)

if (!folder || !sceneI) {
  console.error('Usage: node build-subagent-prompt.mjs --folder <path> --scene <i>')
  process.exit(1)
}

const SKILL_ROOT = new URL('..', import.meta.url).pathname
const scenesPath = join(folder, 'scenes.json')
const scenesData = JSON.parse(readFileSync(scenesPath, 'utf8'))
const scene = scenesData.scenes.find(s => s.i === sceneI)
if (!scene) { console.error(`Scene ${sceneI} not found`); process.exit(1) }

const aspect = scenesData.aspect || '9:16'
const W = aspect === '9:16' ? 1080 : 1920
const H = aspect === '9:16' ? 1920 : 1080

// ─── Mood-specific extraction ─────────────────────────────────────────

const MOOD_PALETTE = {
  dramatic:  { bg: 'radial-gradient(ellipse at 50% 30%, #1a0e08 0%, #0a0a14 70%)', accents: ['#FF3838', '#FFD93D'] },
  energetic: { bg: 'radial-gradient(ellipse at 50% 30%, #1a2a14 0%, #0f1f0a 70%)', accents: ['#DFFF00', '#BFFF00'] },
  calm:      { bg: 'linear-gradient(180deg, #0e1410 0%, #14201a 100%)',           accents: ['#9DFF66', '#66E5FF'] },
  tech:      { bg: 'radial-gradient(ellipse at 50% 40%, #0f1f1a 0%, #050a08 70%)', accents: ['#39FF14', '#00FFFF'] },
  luxury:    { bg: 'linear-gradient(180deg, #1a1408 0%, #0a0a05 100%)',           accents: ['#FFD700', '#fff5cc'] },
  mystery:   { bg: 'radial-gradient(ellipse at 50% 30%, #0e0a14 0%, #050208 70%)', accents: ['#BFFF00', '#B266FF'] },
  playful:   { bg: 'linear-gradient(135deg, #14140a 0%, #0a1414 100%)',           accents: ['#DFFF00', '#FF66B2'] },
  inspiring: { bg: 'linear-gradient(180deg, #0a0e0f 0%, #14201a 100%)',           accents: ['#CCFF00', '#66E5FF'] },
  breaking:  { bg: 'radial-gradient(ellipse at 50% 20%, #2a0808 0%, #0a0000 70%)', accents: ['#FF0000', '#FFD700'] },
  dark:      { bg: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',           accents: ['#FFFFFF', '#888'] },
}

const MOOD_CHOREO = {
  dramatic:  'CINEMATIC REVEAL — y:60→0 + blur:8px→0 power3.out duration 0.8s + accent bar scaleX expo.out. Optional glow pulse finite trên hero.',
  breaking:  'NEWS BREAKING — bg flash opacity 1→0.3→1 trong 0.15s power4 in/out + headline slam scale 1.4→1 back.out(2) + ticker x:-100% ease none finite repeat.',
  tech:      'TECH BOMBASTIC — glow pulse boxShadow yoyo finite + RGB-split text-shadow + stagger mixed eases (power3.out → expo.out → back.out) + grid bg subtle pulse.',
  energetic: 'ENERGETIC SNAP — fast stagger 0.06-0.10s + scale 0.7→1.05→1 back.out(2.2) overshoot + color accent flash 0.2s + hue shift bg.',
  calm:      'CALM DRIFT — slow fade + subtle y drift 1.2-1.5s sine.out + stagger 0.3-0.5s chậm + soft glow opacity oscillate finite. NO bounce/glitch.',
  inspiring: 'INSPIRING RISE — 3-layer parallax (bg slow zoom 1→1.05, title fade-in scale 1.05→1, sub stagger up) + light streak sweep 1.5s power2.inOut + accent line draw-on.',
  playful:   'PLAYFUL BOUNCE — scale 0.5→1 elastic.out(1.2, 0.4) + rotation jitter ±5deg yoyo finite + color shift accent ↔ secondary mỗi 1s finite.',
  luxury:    'LUXURY GOLD — cinematic reveal slower 1.0-1.2s power3.inOut + metallic gold gradient shimmer (background-position animate finite 2-3 cycles) + subtle gold particle drift. NO bounce/glitch.',
  mystery:   'MYSTERY GLITCH — cinematic dark + blur 12px→0 entrance + glitch flicker opacity 1→0.2→1 trong 0.08s (preset points, không random) + RGB-split subtle finite yoyo + particle field bg ON.',
  dark:      'DARK MINIMAL — slow fade in 1.0-1.5s sine.out + CHỈ 1 accent pulse trên 1 element + stagger lớn 0.6-1.0s, để cảnh "thở". NO glow strong, NO glitch.',
}

const palette = MOOD_PALETTE[scene.mood] || MOOD_PALETTE.tech
const choreo = MOOD_CHOREO[scene.mood] || MOOD_CHOREO.tech

// ─── Layout pattern hint dựa trên content ────────────────────────────

function suggestPatterns(content) {
  const hints = []
  if (/\d+\s*(triệu|tỷ|đô|đồng|VNĐ|%)/i.test(content)) hints.push('P2 BIG NUMBER + UNIT (số to + unit nhỏ)')
  if (/\b(percent|%|phần trăm)\b/i.test(content)) hints.push('P5 CHART/GAUGE (% reveal)')
  if (/cách \d|bước \d|thứ nhất|thứ hai|một\.|hai\.|ba\./i.test(content)) hints.push('P11 TIMELINE / step badge')
  if (/(việt|mỹ|nhật|trung|hàn|úc|âu)/i.test(content)) hints.push('P22 SVG MAP (region/flag)')
  if (/(so với|vs\.|hơn|kém|trước|sau)/i.test(content)) hints.push('P3 DUAL COMPARISON / P15 SPLIT VS')
  if (/(comment|inbox|gửi|tải|nhận|đăng ký|cta)/i.test(content)) hints.push('P1 HERO TEXT REVEAL (CTA)')
  if (/(sản phẩm|combo|deal|sale|giảm|ưu đãi)/i.test(content)) hints.push('P8 PRODUCT WITH CALLOUTS (cần product-mode.md)')
  if (/(brand|thương hiệu|logo)/i.test(content)) hints.push('P6 BRAND/LOGO REVEAL')
  if (/(quy luật|nguyên tắc|sự thật)/i.test(content)) hints.push('P9 QUOTE PULL')
  if (hints.length === 0) hints.push('P1 HERO TEXT + content-first compose')
  return hints
}

const patternHints = suggestPatterns(scene.content)

// ─── Scene template inline (compressed) ──────────────────────────────

const SCAFFOLD = `<div class="clip" data-scene-id="scene-${scene.i}" data-start="0" data-duration="${scene.duration}" data-track-index="1">
  <div class="scene-content-scene-${scene.i}">
    {CONTENT_HTML}
  </div>
  <style>
    .clip[data-scene-id="scene-${scene.i}"] {
      width: 100%; height: 100%;
      background: ${palette.bg};
      position: relative; overflow: hidden;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      color: #fff;
    }
    .clip[data-scene-id="scene-${scene.i}"] .scene-content-scene-${scene.i} {
      width: 100%; height: 100%;
      padding: ${aspect === '9:16' ? '180px 80px 320px 80px' : '120px 120px 220px 120px'};
      display: flex; flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 32px;
      box-sizing: border-box;
      position: relative;
      z-index: 2;
    }
    {CONTENT_CSS}
  </style>
  <script>
    (function() {
      window.__timelines = window.__timelines || {};
      const sel = s => '.clip[data-scene-id="scene-${scene.i}"] ' + s;
      const tl = gsap.timeline({ paused: true });
      {GSAP_TWEENS}
      window.__timelines["scene-${scene.i}"] = tl;
    })();
  </script>
</div>`

const wordsCompact = (scene.words || []).map(w => `${w.at}s:${w.word}`).join(' | ')

// ─── Build final prompt ──────────────────────────────────────────────

const prompt = `Generate scene HTML snippet cho video-html v3 — 1 scene đơn (KHÔNG cần Read references, ĐÃ inline).

SCENE DATA:
- i: ${scene.i}, sceneId: "scene-${scene.i}"
- aspect: ${aspect} (${W}×${H})
- mood: ${scene.mood}
- duration: ${scene.duration}s
- content: "${scene.content}"
- keyword timings (Mode A — anchor tween chính vào): ${wordsCompact}

OUTPUT PATH: ${join(folder, 'scenes', `scene-${scene.i}.html`)}

═══════════════════════════════════════════════════════════════════
SCAFFOLD (đã pre-fill {SCENE_I}, {DURATION}, {BG}, padding, scoping)
═══════════════════════════════════════════════════════════════════

Copy scaffold dưới đây + FILL 3 SLOT: {CONTENT_HTML} (visual elements), {CONTENT_CSS} (styles cho elements, prefix .clip[data-scene-id="scene-${scene.i}"]), {GSAP_TWEENS} (timeline entrance, dùng sel() helper).

\`\`\`html
${SCAFFOLD}
\`\`\`

═══════════════════════════════════════════════════════════════════
MOOD "${scene.mood}" — palette + choreography
═══════════════════════════════════════════════════════════════════

Palette accents: ${palette.accents.join(' / ')}
Choreography: ${choreo}

═══════════════════════════════════════════════════════════════════
PATTERN HINTS (content-driven, pull 1-2)
═══════════════════════════════════════════════════════════════════

${patternHints.map(p => `- ${p}`).join('\n')}

(Nếu cần SVG chart/coin/bars/geo → Read references/svg-toolkit.md. Nếu pattern phức tạp → Read references/layout-patterns.md.)

═══════════════════════════════════════════════════════════════════
HARD RULES (validator sẽ check)
═══════════════════════════════════════════════════════════════════

1. KHÔNG sửa scaffold structure (root div, padding, justify-content: center)
2. TẤT CẢ CSS selectors trong {CONTENT_CSS} PHẢI prefix .clip[data-scene-id="scene-${scene.i}"]
3. TẤT CẢ GSAP selectors qua sel() helper (auto-prefix)
4. Content-First Design: ĐỌC content → metaphor → 6-10 elements (1-2 atmosphere, 1 hero, 3-5 supporting, 1-2 typography)
5. Mode A keyword-anchored timing: anchor tween chính vào timestamp từ keyword tương ứng (ví dụ "AI" → tl.from(sel('.ai-text'), {...}, 0.58))
6. Vary ≥ 3 easing khác nhau
7. Atmosphere t=0; hero anchored vào keyword; last entrance ≤ 70-85% duration
8. KHÔNG: Math.random, Date.now, setTimeout, repeat:-1, <!DOCTYPE>, <html>, <head>, <body>, <script src=*gsap>, animate width/height, exit gsap.to(opacity:0), margin-top:auto

═══════════════════════════════════════════════════════════════════
WORKFLOW
═══════════════════════════════════════════════════════════════════

1. Đọc scene content + word timings ở trên
2. Quyết content visual (3 câu hỏi: GÌ → THẤY GÌ → COMPOSE)
3. Fill {CONTENT_HTML} + {CONTENT_CSS} + {GSAP_TWEENS}
4. Write file

OUTPUT: chỉ trả "scene-${scene.i}.html: DONE — <1 dòng visual concept>" hoặc "FAILED: <lý do>". KHÔNG echo full HTML.`

process.stdout.write(prompt)
