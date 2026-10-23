# Content-First Design

> Loaded by `prompts/html-generator.md`. Triết lý: visual phải PHỤC VỤ NỘI DUNG.
> Ported verbatim from prompts.ts PHẦN 4.5 (lines 492-606).

═══════════════════════════════════════════════════════════════════
PHẦN 4.5 — CONTENT-FIRST DESIGN (cách suy nghĩ, KHÔNG phải template)
═══════════════════════════════════════════════════════════════════

⚠ Triết lý: VISUAL phải PHỤC VỤ NỘI DUNG. Mọi element trên màn hình phải
giúp khán giả HIỂU + CẢM được message của câu giọng đọc — không phải decoration generic.

═══ QUY TRÌNH SUY NGHĨ (3 câu hỏi) ═══

Khi nhận content scene, TỰ HỎI:

  1. "Câu này muốn nói GÌ?" → tóm message 1 dòng
  2. "Người xem cần THẤY GÌ để hiểu?" → tìm visual metaphor
  3. "Compose VISUAL nào TRUYỀN TẢI được điều đó?" → vẽ ra

VÍ DỤ tư duy đúng:

  Content: "Bài viết và video đều chuyển vào hệ thống thu lead"
  → Message: 2 input loại nội dung hội tụ vào 1 hệ thống
  → Metaphor: 2 box trên + 1 box dưới + 2 đường flow nối hội tụ
  → Visual: 2 cards (BÀI VIẾT, VIDEO) với icon → flow lines hội tụ → 1 card "HỆ THỐNG"

  Content: "Cổ phiếu chip nhớ rớt 80% chỉ sau 1 đêm"
  → Message: sụp đổ giá trị nhanh chóng, drama
  → Metaphor: line chart đổ dốc đỏ + số -80% + alarm pulse
  → Visual: SVG line draw-on từ trái-cao → phải-thấp + counter -80% glow đỏ

  Content: "Pakistan trở thành cầu nối giữa Iran và Mỹ"
  → Message: trung gian giữa 2 thế lực
  → Metaphor: 3 điểm trên bản đồ + đường nối ý đồ ngoại giao
  → Visual: SVG map simplified với 3 city dots + 2 connection lines draw-on

  Content: "TurboQuant nén KV cache xuống 3 bit, nhanh hơn 8 lần"
  → Message: 2 cải tiến đặc biệt — nhỏ hơn + nhanh hơn
  → Metaphor: số bự + so sánh
  → Visual: stat grid 3 ô (6× / 3 / 8×) với icon + emphasis ô giữa

⚠ KHÔNG vẽ generic decoration thay cho content visual. Nếu content có data → vẽ data,
có địa lý → vẽ map, có flow → vẽ flow, có vật cụ thể → vẽ vật đó.

═══ DENSITY GUIDELINE (mục tiêu, không phải rule cứng) ═══

Mỗi cảnh nên có 6-10 elements ĐỂ TRUYỀN TẢI message — không phải để decorate.

PRIORITY ORDER:
  1. CONTENT VISUAL (4-7 elements) ← phần lớn nhất, AI tự compose theo content
     • Hero element (chart/map/big number/diagram object)
     • Supporting (label, callout, value, axis, legend)
     • Connection (line, arrow, dot path) khi có quan hệ
  2. TYPOGRAPHY (1-2 elements) — title + sub
  3. BACKGROUND (1-2 elements) — gradient + optional glow orb
  4. ATMOSPHERE (0-3 elements, OPTIONAL — chỉ khi mood phù hợp, xem dưới)

═══ ATMOSPHERE = OPTIONAL (đừng spam mọi cảnh) ═══

Atmosphere giúp tạo "vibe" cho cảnh — NHƯNG chỉ dùng khi mood phù hợp:

  ✓ DÙNG khi mood: dramatic / breaking / tech / mystery / dark / luxury
  ✗ KHÔNG nên dùng khi mood: calm / playful / inspiring (làm rối, mất tự nhiên)
  ✗ KHÔNG nên dùng nếu content là flow/diagram/process (lấy không gian khỏi viz)

  Loại atmosphere (chọn 1-2 nếu phù hợp, không phải tất cả):
  ◯ Stars/particles — phù hợp space/mystery/tech (15-30 dots vị trí cứng)
  ◯ Glow orbs — universal, dùng được hầu hết (1-2 div blur lớn)
  ◯ Corner brackets — chỉ phù hợp intel/breaking/tech (4 góc viewfinder)
  ◯ Readout text mờ corner — chỉ phù hợp data-heavy / spy / news scene
  ◯ Grid/dot background pattern — phù hợp tech/data scene
  ◯ Light streak/sun ray — phù hợp inspiring/dramatic title cards

═══ TOOLKIT PRIMITIVES (compose tự do, KHÔNG copy nguyên) ═══

Đây là building blocks — AI tự compose thành chart/map/flow/diagram theo content.
KHÔNG có "P26 line chart hoàn chỉnh" — chỉ có primitive lego.

▸ SVG PATH PRIMITIVES
  • Line vẽ trên không: <path stroke-dasharray="L" stroke-dashoffset="L"/>
    GSAP: tl.to(path, { strokeDashoffset: 0, ease: "power2.in" })
  • Curve smooth: M x,y Q cx,cy x2,y2 (quadratic)  hoặc  C cx1,cy1 cx2,cy2 x2,y2
  • Filled area: M ... L ... L ... Z (closed path) + fill="rgba(...)"
  • Pulsing dot: <circle> + GSAP yoyo finite trên r hoặc opacity

▸ CSS SHAPE PRIMITIVES
  • Tròn: border-radius: 50%
  • Pill: border-radius: 999px (cho badge, button, capsule)
  • Tam giác: width/height 0 + border tricks
  • Glow: box-shadow: 0 0 Npx <color>  hoặc  filter: drop-shadow(...)
  • Blur orb (atmosphere): big div + filter: blur(40px) + radial gradient
  • Card với neon border: border + box-shadow neon outer + inner subtle
  • Connection curve giữa 2 element: SVG <path d="M x1,y1 Q midX,midY x2,y2"/>
  • Conic gradient (sectors, dial): conic-gradient(from Xdeg, ...)
  • Repeating grid bg: linear-gradient with transparent + colored stripes

▸ ANIMATION PRIMITIVES (GSAP)
  • Draw-on path: stroke-dashoffset L → 0
  • Scale-in: from { scale: 0, opacity: 0 } với back.out(1.6) hoặc elastic.out
  • Stagger reveal: tl.from(items, { y: 30, opacity: 0, stagger: 0.12 })
  • Slide-in from edge: from { x: ±60, opacity: 0 }
  • Pulse glow finite: tl.to(el, { boxShadow: "...", repeat: 2-3, yoyo: true })
  • Counter count-up: NOT runtime — pre-compute final value, just fade-in/scale-in

▸ COMPOSITION PRINCIPLES
  • Focal point: hero element ở center hoặc theo rule of thirds, biggest size, brightest
  • Hierarchy: 1 element to nhất + 2-3 medium + 3-5 small
  • Whitespace: ≥ 250px bottom (cho karaoke caption)
  • Color: 1 màu chủ đạo + 1-2 accent (đừng dùng 5+ màu)
  • Motion choreography: stagger 0.1-0.15s, vary ≥ 3 easing

═══ KEY RULE — KHÔNG NHỚT MỚI ĐỌC CONTENT ═══

Mỗi cảnh là 1 designer challenge: AI ĐỌC content → SUY NGHĨ metaphor → VẼ.

KHÔNG copy template, KHÔNG ép thư viện, KHÔNG thêm decoration không liên quan.
KHÔNG để background trống khi content có concrete keyword.
KHÔNG vẽ stars + brackets + readout cho mọi cảnh — chỉ dùng khi mood hợp.
