---
name: video-html
description: "Generate video MP4 voice-synced với GSAP animations + character-level voice timestamps. Adopt prompts.ts pattern: 25 layout patterns, 10 mood, content-first design, HyperFrames syntax. Pipeline: scene divider → image planner (Pexels) → gen voice (ElevenLabs Turbo v2.5) → HTML generator (per scene) → SFX picker → render mp4 (HyperFrames + ffmpeg + karaoke captions). Output: final.mp4 ready upload. Trigger: 'tạo video', '/content video'."
version: 3.0.0
breaking_changes_from: 2.0.0
breaking_changes_summary: |
  - Pivot away from html-anything to prompts.ts (production-grade ReelsAgent prompts).
  - Schema: scenes[]+layers[] → HyperFrames data-composition-id + window.__timelines.
  - Animation: CSS animation-delay → GSAP timeline với keyword-anchored timing.
  - Output: preview.html (browser) → final.mp4 (HyperFrames + ffmpeg).
  - New: 25 layout patterns, 10 mood × palette, content-first design philosophy,
    product mode, SFX picker, image planner, render pipeline.
agent: content
tags: [video, reels, tiktok, youtube, gsap, hyperframes, elevenlabs, mp4]
---

# video-html Skill v3.0 (prompts.ts Pattern + MP4 Render)

Generate video MP4 sản phẩm chất lượng broadcast — voice-synced, GSAP animations, 25 layout patterns, 10 mood. Full pipeline từ source text đến final.mp4.

**Breaking change v2.0 → v3.0.** Pivot toàn bộ workflow theo prompts.ts pattern.

**Output:** `output/content/{YYYY-MM-DD}/{idea-slug}/video-html/final.mp4` ready upload TikTok/Reels/YouTube.

---

## Khi Nào Dùng

- Cần video voice-synced 15-60s cho TikTok / Reels / Shorts / YouTube
- Có source text (hoặc chỉ topic — AI auto-gen)
- Có ElevenLabs API key + voice_id
- Sẵn sàng setup ffmpeg + hyperframes npm (1 lần)

## Khi Nào KHÔNG Dùng

- Footage thật → Veo/Kling/Runway via `skills/content/video/`
- Avatar talking-head → HeyGen
- Slide deck tĩnh → `skills/slide-html/`
- Image card → `skills/content/post-image-card/`

---

## Hard Gates (Bước 0)

1. **`BUSINESS.md` còn `[Chưa điền...]`** → STOP, `/setup-start`
2. **`THEME.md` thiếu/chưa điền** → STOP, `/setup theme`
3. **`ELEVENLABS_API_KEY` thiếu trong `.env`** → STOP, lấy key tại https://elevenlabs.io/app/settings/api-keys
4. **`voice_id` thiếu trong `BUSINESS.md`** → run `node skills/content/video-html/scripts/list-voices.mjs`
5. **`ffmpeg` chưa cài** → STOP, hướng dẫn `brew install ffmpeg`
6. **`hyperframes` CLI chưa available** → STOP, verify với `npx hyperframes --version`. Nếu lỗi → chạy `npm install -g hyperframes` hoặc đảm bảo internet để npx tự pull package. Không cần `npm install` trong skill folder — hyperframes là CLI tool, không phải library.
7. **`sfx-library/*.mp3` thiếu** → run `node skills/content/video-html/scripts/gen-sfx-library.mjs` (one-time setup, ~$0.05)
8. **`PEXELS_API_KEY` thiếu** → optional warning, skill skip Bước 3
9. **`caption-highlight` component** — render-mp4.mjs tự install vào output folder khi render (không cần manual). Nếu muốn pre-install vào skill folder riêng: `cd output/content/{slug}/video-html && npx hyperframes add caption-highlight`

---

## Workflow 8 Bước

### Bước 1 — Zero-friction auto-detect (KHÔNG hỏi)

Mặc định KHÔNG hỏi user — auto-detect rồi chạy luôn.

**Auto-decision logic:**

| Field | Default | Override |
|-------|---------|----------|
| **Source mode** | AI auto-gen từ topic (load `prompts/source-writer.md`) | User paste text dài (>100 từ) → dùng trực tiếp |
| **Aspect** | `9:16` (TikTok/Reels/Shorts default) | User nói "YouTube"/"horizontal"/"16:9" → switch |
| **Mood overall** | Auto-detect từ topic keywords | User nói rõ mood (vd "làm video buồn") → override |

**Mood auto-detect heuristic** (apply theo thứ tự, dừng ở match đầu):

| Keyword pattern trong topic | Mood |
|---------------------------|------|
| breaking / tin sốc / cảnh báo / drama / scandal / khủng hoảng | `breaking` |
| AI / tech / code / software / blockchain / digital / số hoá | `tech` |
| khởi nghiệp / startup / launch / khai trương / sale / deal | `energetic` |
| cảm xúc / câu chuyện / hành trình / vượt qua / chiến thắng | `inspiring` |
| luxury / sang trọng / cao cấp / VIP / premium | `luxury` |
| bí ẩn / kỳ lạ / khám phá / mystery | `mystery` |
| vui / hài / playful / funny / meme | `playful` |
| thiền / yoga / wellness / chữa lành | `calm` |
| dark / noir / minimal | `dark` |
| (fallback) | `dramatic` |

**Workflow:**
1. Em ngầm chọn default + show notice ngắn:
   ```
   📹 Tạo video 9:16, mood "{detected}", AI auto-gen source từ topic.
   ```
2. Load `prompts/source-writer.md` → gen source text 150-300 từ
3. **KHÔNG yêu cầu user duyệt** — save trực tiếp + tiếp Bước 2
4. User có thể interrupt bất kỳ lúc nào nếu muốn override

Save: `output/content/{YYYY-MM-DD}/{idea-slug}/video-html/source.txt`.

**Khi NÀO em phải hỏi user (exception):**
- Topic mơ hồ không thể detect (vd "video"/"làm hộ tôi cái gì đó")
- User explicitly nói "hỏi tôi" / "confirm trước"
- Voice_id / business context thiếu critical info

### Bước 2 — Scene Divider

Load `prompts/scene-divider.md` + System Prompt.

AI agent (Claude Code) đọc source text → chia 5-30 scenes theo canonical schema:

```json
{
  "aspect": "9:16",
  "voice_id": "<from BUSINESS.md hoặc memory>",
  "model_id": "eleven_turbo_v2_5",
  "scenes": [
    { "i": 1, "sceneId": "scene-1", "title": "...", "content": "...", "mood": "...", "duration": 5 }
  ]
}
```

Rules:
- Preserve 100% nội dung (rule tiên quyết)
- duration = ceil(words/3) — sẽ được Bước 4 override bằng duration thực
- 1 scene = 1 ý liền mạch, ≤ 45 từ, 2-15s
- Mỗi scene có `mood` ∈ 10 mood (dramatic/energetic/calm/tech/luxury/mystery/playful/inspiring/breaking/dark)
- `i` (number) + `sceneId` ("scene-{i}") — cả 2 dùng nhất quán xuyên scripts

Save: `scenes.json`.

### Bước 3a — Image Planner (nếu Pexels có key)

Load `prompts/image-planner.md`.

AI agent decide per scene: image / video / none + Pexels query + role.

Save: `image-plans.json`.

### Bước 3b — Fetch Pexels assets

```bash
node skills/content/video-html/scripts/fetch-pexels.mjs output/content/{YYYY-MM-DD}/{idea-slug}/video-html/
```

Output: `assets/{sceneId}.{jpg|mp4}` + update `image-plans.json` với `asset_file` paths.

### Bước 4 — Gen Voice

```bash
node skills/content/video-html/scripts/gen-voice.mjs output/content/{YYYY-MM-DD}/{idea-slug}/video-html/scenes.json
```

Output:
- `audio/scene-{i}.mp3`
- `alignment.json` (word-level timings)
- `_durations.json`

Sau đó update `scenes.json` in-place bằng script:

```bash
node skills/content/video-html/scripts/update-scenes-from-alignment.mjs output/content/{YYYY-MM-DD}/{idea-slug}/video-html/
```

Script inject:
- `scenes[].duration` = thực từ audio
- `scenes[].words` = `[{at, word}]` extracted từ character-level alignment (handle diacritics tự động)

Sau bước này scenes.json đã đủ cho Bước 5 (HTML gen) đọc keyword-anchored timing.

### Bước 5 — HTML Generator (per scene) — SNIPPET mode

#### 5.0 Chọn execution mode

| Mode | Khi nào dùng | Wall-time (8 scenes) | Token cost |
|------|--------------|---------------------|------------|
| **Parallel (default)** | ≥ 3 scenes, không có shared visual state giữa scenes | ~1-2 phút | 8× references (mỗi subagent Read lại) |
| **Sequential** | 1-2 scenes, hoặc cần kiểm soát chi tiết từng scene | ~10-15 phút | 1× references (cache trong context) |

⚠️ KHÔNG dùng parallel khi:
- Scenes có visual transition/state liên tiếp (vd scene 2 cần biết position element scene 1 kết thúc)
- Brand kit đặc thù cần Claude main review từng scene
- User explicitly request "AI làm từng scene cẩn thận"

#### 5.1 Parallel mode (KHUYẾN NGHỊ — token-optimized)

Spawn N subagents song song (1 message, N `Agent` tool calls) — mỗi subagent = `general-purpose` type, sinh đúng 1 scene snippet.

**Token optimization:** Thay vì để sub Read 5-7 ref files (~30K tokens duplicated × N subs = lãng phí), main agent dùng helper script extract + inline mood-specific palette/choreography + scaffold pre-filled. Sub nhận prompt ~1.5K + Write tool output → tổng ~7-10K/sub thay vì ~46K. **Saving ~80%.**

Bonus: scaffold structure + hard rules ổn định giữa N subs trong cùng session → Anthropic prompt cache hit cao, giảm input cost thêm ~30-50% nữa (automatic, không cần config).

**Workflow main agent:**

1. Đảm bảo `scenes.json` đã có duration + words (chạy `update-scenes-from-alignment.mjs` sau Bước 4)
2. Cho mỗi scene `i = 1..N`, gọi:
   ```bash
   node skills/content/video-html/scripts/build-subagent-prompt.mjs --folder <path> --scene <i>
   ```
   → stdout là prompt complete với scaffold inline, palette + choreo theo mood, pattern hints
3. Spawn N Agent calls song song (1 message), mỗi call prompt = output script
4. Sau tất cả sub trả về → chạy validator (Bước 5.5)
5. Fail-loop: nếu validator báo scene-X fail, spawn lại 1 sub cho scene-X với feedback cụ thể

**Subagent KHÔNG cần Read những ref đã được inline:**
- ❌ mood-palettes.md, animation-choreography.md, hyperframes-composition.md, scene-template.html, timing-strategy.md, content-first-design.md, html-generator.md

**Subagent CHỈ Read khi áp dụng:**
- references/layout-patterns.md — nếu cần pattern phức tạp (>P10)
- references/svg-toolkit.md — nếu cần SVG primitive (chart, geo, coin, bars)
- references/product-mode.md — nếu PRODUCT MODE (hiếm khi)

**Prompt template cũ (sub tự Read refs) — không khuyến nghị, giữ làm reference cho trường hợp script lỗi:**

```
TASK: Generate scenes/scene-{i}.html cho video-html v3 skill.

SCENE DATA (từ scenes.json):
- i: {i}
- sceneId: "scene-{i}"
- content: "{content}"
- mood: "{mood}"
- duration: {duration}s
- aspect: {aspect}
- words: <inline JSON array of {at, word} từ alignment>

CONTEXT FILES bắt buộc Read (theo Reference Loading Strategy):
1. skills/content/video-html/prompts/html-generator.md (full system + user prompt)
2. skills/content/video-html/references/scene-template.html (scaffold — DÙNG làm starting point)
3. skills/content/video-html/references/hyperframes-composition.md (snippet syntax, scoping rules)
4. skills/content/video-html/references/mood-palettes.md (palette cho mood "{mood}")
5. skills/content/video-html/references/animation-choreography.md (choreography cho mood "{mood}")
6. skills/content/video-html/references/timing-strategy.md (Mode A keyword-anchored)
7. skills/content/video-html/references/content-first-design.md (3 câu hỏi metaphor)

CONDITIONAL (Read NẾU áp dụng):
- references/layout-patterns.md → tra Content Type Index ở đầu, pull 1-2 pattern relevant với content
- references/svg-toolkit.md → nếu cần line chart / geo / coin / bars
- references/product-mode.md → CHỈ nếu scene có ảnh sản phẩm + commercial keyword

WORKFLOW:
1. Read scene-template.html → copy nội dung làm starting point
2. Replace {SCENE_I}, {DURATION} với giá trị từ scene data
3. Replace {BG_GRADIENT} dựa trên palette của mood
4. Compose {CONTENT_HTML} + {CONTENT_CSS} theo Content-First Design
5. Compose {GSAP_TWEENS} với keyword-anchored timing (dùng words[].at)
6. Write file

OUTPUT:
- Path: output/content/{YYYY-MM-DD}/{slug}/video-html/scenes/scene-{i}.html
- Format: SNIPPET only (KHÔNG <!DOCTYPE>, <html>, <head>, <body>)
- Root: <div class="clip" data-scene-id="scene-{i}" data-start="0" data-duration="{duration}" data-track-index="1">

HARD RULES:
- justify-content: center BẮT BUỘC (không flex-start/end)
- padding 9:16: 180px 80px 320px 80px (KHÔNG đổi top)
- TẤT CẢ CSS selectors prefix .clip[data-scene-id="scene-{i}"]
- TẤT CẢ GSAP selectors prefix .clip[data-scene-id="scene-{i}"]
- Window register: window.__timelines["scene-{i}"] = tl trong IIFE
- Keyword-anchored timing: dùng words[].at làm offset cho tween chính tương ứng
- Vary ≥ 3 easing
- Atmosphere t=0; content chính mid-late; last entrance ≤ 70-85% duration

KHI XONG: chỉ trả "scene-{i}.html: <DONE | FAILED with reason>". KHÔNG echo lại HTML.
```

**Pattern spawn (Claude main viết):**

```
Em sẽ spawn 8 subagents song song cho 8 scenes.
[1 message, 8 Agent tool calls — KHÔNG tách thành 8 messages riêng]
```

Sau khi tất cả subagents trả về → Claude main chạy validator (Bước 5.5) → nếu fail, dispatch lại subagent riêng cho scene fail với feedback cụ thể.

#### 5.2 Sequential mode (fallback)

Claude main Read references 1 lần đầu (cache cả batch):
- mood-palettes.md, content-first-design.md, timing-strategy.md, animation-choreography.md, hyperframes-composition.md

Cho từng scene tuần tự, áp dụng same hard rules ở 5.1.

#### 5.3 Common rules (cả 2 modes)

- Content-First Design: 3 câu hỏi metaphor trước khi compose
- 6-10 elements/scene (priority: content visual > typography > bg > atmosphere)
- Mode A keyword-anchored timing nếu `words` có; Mode B spread nếu không
- Output: `scenes/scene-{i}.html` (1 snippet file)

render-mp4.mjs sẽ ghép tất cả snippets vào `index.html` khi render.

### Bước 5.5 — Validate snippets (BẮT BUỘC trước render)

```bash
node skills/content/video-html/scripts/validate-snippets.mjs output/content/{YYYY-MM-DD}/{idea-slug}/video-html/
```

Static checks:
- Root `<div class="clip" data-scene-id data-start data-duration data-track-index>` đúng format
- `data-scene-id` khớp filename
- KHÔNG có `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<script src=*gsap>`
- KHÔNG `Math.random()`, `Date.now()`, `setTimeout`, `repeat: -1`
- `window.__timelines["scene-{i}"] = tl` register present
- IIFE wrapper trên `<script>`
- Background set rõ trên `.clip`
- TẤT CẢ CSS class selectors có prefix `.clip[data-scene-id="..."]`
- `.scene-content-{id}` có `justify-content: center` (KHÔNG flex-start/end)
- padding-top ≥ 160px (9:16) / 100px (16:9)
- padding-bottom ≥ 280px (9:16) / 180px (16:9) cho caption space
- KHÔNG có `margin-top: auto` (phá centering)
- KHÔNG animate width/height trong GSAP

**Exit code 1 = render-mp4.mjs sẽ ra sản phẩm lỗi** → fix snippet trước khi tiếp tục.

### Bước 6 — SFX Plan (template per mood — KHÔNG AI)

**Default**: chạy script template-based, deterministic, KHÔNG cần AI call:

```bash
node skills/content/video-html/scripts/build-sfx-plan.mjs <folder>
```

Script tự:
- Map mood → SFX template (10 mood × 2-3 SFX hardcoded)
- Resolve `'keyword_impact'` → tìm timestamp keyword nhấn nhá trong `scene.words`
- Resolve `'duration_60%'` → tính theo scene duration
- Volume default 0.7-0.9 (đã verified SFX file peak 0dB → audible)

**Saving:** ~30s wall-time + ~30K tokens vs Bước 6 AI cũ.

**Fallback (CHỈ khi user muốn AI pick):**
- Load `prompts/sfx-picker.md` + spawn AI agent
- Useful khi: scene có content unique mà template không catch (vd cần specific SFX cho 1 từ cụ thể)
- Đa số case template đã đủ.

Save: `sfx-plan.json`.

### Bước 7 — Render MP4

```bash
node skills/content/video-html/scripts/render-mp4.mjs output/content/{YYYY-MM-DD}/{idea-slug}/video-html/
```

Pipeline trong script:
- A. Đọc `scenes/*.html` snippets → compose `index.html` (HyperFrames single-composition format)
- B. Scaffold `hyperframes.json`, `meta.json`, `package.json` trong output folder
- C. Install `caption-highlight` component vào `compositions/components/` (nếu chưa có — one-time per output folder, tự động)
- D. Build `transcript.json` từ `alignment.json` + cumulative scene start times. Format: `[{text, start, end}]` theo word (ElevenLabs character-level → grouped thành words). Fallback nếu không có alignment: spread evenly từ scene words/content.
- E. Patch `compositions/components/caption-highlight.html` — inject WORDS + RAW_GROUPS + data-duration từ transcript.json vừa tạo. Captions styled TikTok-highlight (Montserrat 800, uppercase, red pill animation).
- F. `npx hyperframes render <folder>` (CLI + Chromium) → `renders/silent.mp4` (captions đã burned bởi HyperFrames — không cần libass)
- G. ffmpeg concat voice tracks → `voice.mp3`
- H. ffmpeg mix SFX với adelay/volume → `audio-mix.mp3`
- I. ffmpeg final encode: `silent.mp4` (captions in) + `audio-mix.mp3` → `final.mp4` — KHÔNG dùng subtitles filter

**Lợi ích so với ffmpeg .ass approach:**
- Không cần `libass` (Homebrew ffmpeg default không có)
- Captions render bởi cùng Chromium engine với scenes → pixel-perfect, deterministic
- GSAP-animated highlights (red pill wipe per word), seekable
- 15 caption styles available via `npx hyperframes add <caption-style>`

Output folder structure sau render:
```
video-html/
├── index.html                          ← Composed HyperFrames composition (auto-generated)
├── hyperframes.json                    ← HyperFrames project config (auto-generated)
├── meta.json                           ← Project metadata (auto-generated)
├── package.json                        ← HyperFrames npm scripts (auto-generated)
├── transcript.json                     ← Word-level timings built from alignment.json
├── compositions/
│   └── components/
│       └── caption-highlight.html      ← Patched with video's transcript (auto-generated)
├── scenes.json
├── alignment.json
├── sfx-plan.json
├── scenes/
│   └── scene-*.html    ← SNIPPETS (input for composition)
├── audio/
│   └── scene-*.mp3
├── renders/
│   └── silent.mp4      ← HyperFrames output (video + captions, no audio)
└── final.mp4           ← Final output (voice + SFX + captions burned in by HyperFrames)
```

### Bước 8 — Report

```
✅ Video MP4 đã render (v3.0):

📁 output/content/{YYYY-MM-DD}/{slug}/video-html/
   └── final.mp4              ← mở xem, sẵn upload

Voice: {voice_name} (id: {voice_id})
Model: eleven_turbo_v2_5
Total duration: {X}s
Scenes: {N}
Resolution: 1080×1920 (9:16)

Costs:
  - ElevenLabs voice: ~$0.{XX} ({chars} chars × $0.00015/char)
  - Pexels: FREE
  - HyperFrames render: FREE (local Chromium)

Render time: {Y}s

Mở video:
  open output/content/{YYYY-MM-DD}/{slug}/video-html/final.mp4
```

Cleanup intermediates (`silent.mp4`, `voice.mp3`, `audio-mix.mp3`, `_concat-list.txt`, `_durations.json`) — KEEP final.mp4 + scenes.json + alignment.json + transcript.json + scenes/ + audio/ + sfx-plan.json (cho debug/re-render). Không cần cleanup `compositions/` — caption-highlight.html được reuse và re-patched khi re-render.

---

## Anti-patterns

- ❌ Tự gen HTML trước khi gen voice (sai thứ tự v3 — voice-first)
- ❌ Hardcode `model_id: "eleven_multilingual_v2"` (must `eleven_turbo_v2_5` cho VN)
- ❌ AI tự invent CSS classes (`archetype-P*`) — phải follow HyperFrames syntax + GSAP rules
- ❌ Quên `window.__timelines[id] = tl` register — HyperFrames không render được
- ❌ Front-load tweens vào 0-1s đầu (vi phạm timing strategy)
- ❌ Dùng `Math.random()` / `Date.now()` (non-deterministic, fail render)
- ❌ Animate `width/height` (dùng `scale`)
- ❌ Skip karaoke caption space (≥280px bottom padding) — caption-highlight cần không gian ở bottom
- ❌ Pick > 3 SFX/scene (spam audio)
- ❌ Pexels query trừu tượng ("success", "growth")
- ❌ Dùng ffmpeg `subtitles=` filter (cần libass, Homebrew build không có) — dùng HyperFrames caption-highlight thay thế
- ❌ Manually edit `caption-highlight.html` sau khi render-mp4.mjs đã patch (sẽ bị overwrite lần render tiếp)

---

## References

**Always-load (Bước 5, 1 lần per batch):**
- `references/mood-palettes.md` — 10 mood × palette
- `references/content-first-design.md` — philosophy + 3 câu hỏi + density + toolkit primitives
- `references/timing-strategy.md` — Mode A/B
- `references/animation-choreography.md` — choreography per 10 mood
- `references/hyperframes-composition.md` — snippet syntax + timeline lifecycle + scoping

**Conditional (per scene):**
- `references/scene-template.html` — scaffold cho HTML snippet (5 slot fill thay vì viết từ đầu)
- `references/layout-patterns.md` — 25 patterns P1-P25 (có Content Type → Pattern Index ở đầu file)
- `references/svg-toolkit.md` — SVG primitive snippets (chart, geo, coin, bars, target)
- `references/product-mode.md` — 6-layer cho product (CHỈ khi PRODUCT MODE = ON)

**Pipeline-only:**
- `references/elevenlabs-integration.md` — TTS API (Bước 4)
- `references/pexels-integration.md` — Pexels API (Bước 3)
- `references/caption-highlight-schema.md` — caption-highlight patch schema (Bước 7)

## Prompts

- `prompts/source-writer.md` — auto-gen source text from topic
- `prompts/scene-divider.md` — chia source → scenes
- `prompts/image-planner.md` — Pexels search planning
- `prompts/html-generator.md` — per-scene HTML
- `prompts/sfx-picker.md` — SFX selection

## Scripts

- `scripts/gen-sfx-library.mjs` — one-time SFX library setup
- `scripts/gen-voice.mjs` — ElevenLabs TTS
- `scripts/infer-timestamps.mjs` — fallback timing
- `scripts/list-voices.mjs` — list voices
- `scripts/fetch-pexels.mjs` — download Pexels assets
- `scripts/render-mp4.mjs` — HyperFrames + ffmpeg render (audio: voice + SFX + music + sidechain)
- `scripts/update-scenes-from-alignment.mjs` — Bước 4 helper: inject duration thực + words array vào scenes.json
- `scripts/validate-snippets.mjs` — Bước 5.5 static validator (catch layout/spec bug trước render)
- `scripts/build-subagent-prompt.mjs` — Bước 5 helper: build subagent prompt token-optimized (inline refs theo mood, scaffold pre-filled)
- `scripts/build-sfx-plan.mjs` — Bước 6 template per mood (NO AI, deterministic, saves 30s+30K tokens)
- `scripts/run-pipeline.mjs` — Orchestrator chạy Bước 3-7 + ghi timing.json để đo perf

## One-liner pipeline run

Khi AI đã làm Bước 1, 2, 5 (source + scenes.json + scenes/*.html), main agent có thể chạy 1 lệnh:

```bash
node skills/content/video-html/scripts/run-pipeline.mjs <folder>
```

Orchestrator sẽ:
- Stage 3: Pexels (skip nếu no key)
- Stage 4: gen-voice + update-scenes
- Stage 5.5: validate-snippets
- Stage 6: build-sfx-plan (template, skip nếu sfx-plan.json đã tồn tại do AI làm)
- Stage 7: render-mp4

Output: `final.mp4` + `timing.json` (per-stage timing breakdown).

## SFX Library

`sfx-library/` — 13 SFX files (drum-hit, alarm, whoosh-up, whoosh-down, glitch, beep-glitch, sparkle, chime, ding, pop, success-chime, dark-rise, bass-thump).
