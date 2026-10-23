# Animation Choreography — 10 Mood-Based Patterns

> Loaded by `prompts/html-generator.md` (always-load). Mỗi scene chọn 1 choreography theo `scene.mood`.
> Ported từ prompts.ts PHẦN 5 (5 mood gốc) + mở rộng đủ 10 mood khớp `mood-palettes.md`.

═══════════════════════════════════════════════════════════════════
MOOD MAPPING TABLE (Bước 1 → choreography)
═══════════════════════════════════════════════════════════════════

| `scene.mood` (Bước 1 user chọn) | Choreography pattern (xem chi tiết bên dưới) |
|---------------------------------|--------------------------------------------|
| `dramatic`  | 🎬 CINEMATIC REVEAL + glow pulse mạnh |
| `breaking`  | 📰 NEWS BREAKING (slam + flash + ticker) |
| `tech`      | 🤖 TECH BOMBASTIC (RGB-split + glow pulse) |
| `energetic` | ⚡ ENERGETIC SNAP (fast stagger + bounce) |
| `calm`      | 🌊 CALM DRIFT (slow fade + sine ease) |
| `inspiring` | ✨ INSPIRING RISE (parallax + light streak) |
| `playful`   | 🎈 PLAYFUL BOUNCE (elastic + jitter) |
| `luxury`    | 💎 LUXURY GOLD (slow cinematic + metallic pulse) |
| `mystery`   | 🌌 MYSTERY GLITCH (cinematic dark + glitch flicker) |
| `dark`      | 🕯️ DARK MINIMAL (slow fade + 1 accent pulse) |

═══════════════════════════════════════════════════════════════════
CHI TIẾT CHOREOGRAPHY
═══════════════════════════════════════════════════════════════════

🎬 CINEMATIC REVEAL (`dramatic`, finance, quote, brand hero)
  - Element 1: y:60→0, opacity:0→1, blur:8px→0, duration 0.8s, ease "power3.out", offset 0.2
  - Element 2: y:30→0, opacity:0→1, duration 0.6s, ease "power2.out", offset 0.5
  - Element 3 (accent bar): scaleX:0→1, transform-origin left, duration 0.5s, ease "expo.out", offset 0.7
  - Optional glow pulse 2-3 lần finite trên hero element

📰 NEWS BREAKING (`breaking`)
  - BG flash: opacity 1→0.3→1 trong 0.15s ease "power4.in" rồi "power4.out"
  - Headline slam: scale 1.4→1, opacity 0→1, duration 0.4s, ease "back.out(2)", offset 0.1
  - Ticker bar: x: -100% với ease "none", finite repeat = `Math.ceil(duration/loopTime)`
  - Red pill kicker: y:-20→0, opacity 0→1, ease "expo.out"

🤖 TECH BOMBASTIC (`tech`)
  - Glow pulse trên container: boxShadow nhịp 0.5s → 1s yoyo finite
  - Text RGB-split entrance (3 layer text-shadow R/G/B offset 2-4px), ease "elastic.out(1, 0.5)"
  - Stagger eases hỗn hợp: power3.out → expo.out → back.out
  - Grid lines bg subtle pulse opacity 0.3↔0.6 finite

⚡ ENERGETIC SNAP (`energetic`)
  - Stagger cực nhanh 0.06-0.10s giữa elements
  - Scale 0.7→1.05→1 (slight overshoot), ease "back.out(2.2)"
  - Color accent flash: text-shadow blast trong 0.2s rồi fade
  - Bg gradient hue shift subtle (CSS animation finite)

🌊 CALM DRIFT (`calm`)
  - Slow fade + subtle y drift, duration 1.2-1.5s, ease "sine.out"
  - Stagger 0.3-0.5s (chậm)
  - KHÔNG glitch, KHÔNG bounce, smooth
  - Soft glow opacity oscillate 0.4↔0.7 finite

✨ INSPIRING RISE (`inspiring`)
  - 3-layer parallax: bg slow zoom (scale 1→1.05 duration scene), title fade-in scale 1.05→1, sub stagger up
  - Light streak/sun ray sweep ngang (translateX) 1 lần 1.5s, ease "power2.inOut"
  - Title y:80→0 + opacity, ease "power3.out", duration 1.0s
  - Accent line draw-on (scaleX from left) sau title

🎈 PLAYFUL BOUNCE (`playful`)
  - Scale 0.5→1 với ease "elastic.out(1.2, 0.4)"
  - Rotation jitter ±5deg với yoyo finite 2-3 lần
  - Color shift accent → secondary mỗi 1s yoyo finite
  - Optional emoji pop với scale 0→1.2→1 ease "back.out(3)"

💎 LUXURY GOLD (`luxury`)
  - Cinematic reveal base (như dramatic) NHƯNG slower: duration 1.0-1.2s
  - Metallic gold gradient on text với background-position animate (shimmer effect) finite 2-3 cycles
  - Subtle particle drift vàng (slow opacity oscillate)
  - Easing chính: "power3.inOut" (smoothness cao)
  - NO bounce, NO glitch — élégance trên hết

🌌 MYSTERY GLITCH (`mystery`)
  - Cinematic dark base với extra blur:12px→0 entrance
  - Glitch flicker 1-2 lần: opacity 1→0.2→1 trong 0.08s (rất nhanh) tại random points (preset list, không Math.random)
  - Text RGB-split subtle (R offset -2px, B offset +2px, finite yoyo)
  - Particle field bg (P25) mặc định ON
  - Easing: power4.out (sharp arrival)

🕯️ DARK MINIMAL (`dark`)
  - Slow fade in mọi element, duration 1.0-1.5s, ease "sine.out"
  - CHỈ 1 accent pulse highlight (vd 1 dot trắng) — phần còn lại không animate
  - Stagger lớn 0.6-1.0s — để cảnh "thở"
  - KHÔNG glow mạnh, KHÔNG glitch — quiet & contemplative

═══════════════════════════════════════════════════════════════════
NGUYÊN TẮC CHUNG (áp dụng MỌI mood)
═══════════════════════════════════════════════════════════════════

- Vary ≥ 3 easing khác nhau trong 1 scene (để có nhịp)
- Atmosphere (bg, particles, frame) ở t=0; content chính ở mid-late timing
- KHÔNG nén tất cả entrance vào 1s đầu — xem `timing-strategy.md` Mode A/B
- KHÔNG exit animation — chỉ entrance
- Subtle ambient pulse / Ken Burns SAU last entrance để cảnh không tĩnh

═══════════════════════════════════════════════════════════════════
COMBINE VỚI PRODUCT MODE
═══════════════════════════════════════════════════════════════════

Khi PRODUCT MODE = ON (xem `product-mode.md`), choreography mặc định ÁP DỤNG:
- LUXURY GOLD (nếu brand high-end / cosmetic / fashion)
- ENERGETIC SNAP (nếu brand FMCG / fast deal)
- CINEMATIC REVEAL (nếu brand tech / premium service)

Pills (Layer 4) luôn stagger 0.12s ease "back.out(1.7)".
Metallic text (Layer 5) luôn duration 1s ease "expo.out".
