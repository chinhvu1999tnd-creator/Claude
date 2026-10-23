# Layout Patterns — 25 Reference Patterns (P1-P25)

> Loaded by `prompts/html-generator.md`. **REFERENCE patterns** — không phải template để copy nguyên xi.
> AI agent đọc pattern, lấy structure idea, tự compose theo content scene.
> Ported verbatim from prompts.ts PHẦN 4 (lines 211-491).

═══════════════════════════════════════════════════════════════════
CONTENT TYPE → PATTERN INDEX (đọc TRƯỚC khi scan pattern)
═══════════════════════════════════════════════════════════════════

Khi gen scene, đọc content → match với content type → jump tới pattern tương ứng.
KHÔNG đọc cả 25 patterns cho mỗi scene — chỉ pull 1-3 candidates relevant.

| Content type / keyword trong scene | Primary patterns | Combine với (optional) |
|--------------------|------------------|------------------------|
| Số to đơn lẻ ("80%", "1.000 KH", "$2B") | **P2** (BIG NUMBER) | P25 particle bg |
| 3-4 stat song song ("6× / 3 / 8×") | **P4** (STAT GRID) | P19 nếu row layout |
| Chart line/bar/gauge (crash, growth, KPI) | **P5** (CHART REVEAL) | SVG snippets toolkit |
| So sánh A vs B / trước-sau | **P3** (DUAL COMPARISON), **P15** (SPLIT SCREEN VS) | — |
| Địa lý / quốc gia / supply chain | **P7** (MAP CONNECTION), **P22** (SVG MAP) | — |
| Flow / quy trình / nhập-xuất | Custom flow (2-3 cards + arrows) | P11 timeline nếu sequential |
| Hierarchy / Venn / cấu trúc | Custom diagram + content-first toolkit | P18 callout |
| Sản phẩm + ảnh (commercial) | **P8** (PRODUCT WITH CALLOUTS) + `product-mode.md` | P21 nếu vẽ object |
| Quote / trích dẫn chuyên gia | **P9** (QUOTE PULL) | P20 cinematic bg |
| Hook tin sốc / breaking | **P10** (BREAKING NEWS) | P14 ticker |
| Lịch sử / mốc thời gian / roadmap | **P11** (TIMELINE) | — |
| Giá / pricing / khuyến mãi | **P12** (PRICE REVEAL) | P21 coin vẽ tiền |
| Đếm ngược / deadline | **P13** (COUNTDOWN) | — |
| Marquee / list nhanh | **P14** (SCROLLING TICKER) | — |
| Feature list (4-6 icon + label) | **P16** (ICON GRID) | — |
| Top N / ranking | **P17** (LIST/RANKING) | — |
| Chú giải / point-out detail | **P18** (CALLOUT BOX WITH ARROW) | — |
| Dashboard / KPI row (4 chỉ số) | **P19** (ICON + STAT ROW) | — |
| Hook mở đầu / CTA cuối / chapter heading | **P1** (HERO TEXT REVEAL), **P20** (CINEMATIC TITLE) | P25 particle |
| Brand reveal / logo intro | **P6** (BRAND/LOGO REVEAL) | — |
| Vật cụ thể (uranium, coin, chip, brain, lửa) | **P21** (AI-ILLUSTRATED OBJECT) | combine với primary pattern trên |
| Casual / edu / social style | **P23** (HAND-DRAWN) | — |
| Product card / dashboard tech vibe | **P24** (3D-ISOMETRIC) | — |
| Space / mystery / tech background | **P25** (PARTICLE FIELD) | bg layer cho mọi pattern khác |

**Cách dùng table này:**
1. Đọc `scene.content` → tìm content type chính (số? map? quote? product?)
2. Pull 1-2 primary pattern, scroll xuống đọc chi tiết
3. Optional pull 1 combine pattern (atmosphere/object) nếu phù hợp mood
4. Compose theo content-first-design — KHÔNG copy nguyên pattern

**Nguyên tắc nhanh:**
- Hook/CTA → P1 hoặc P20 (đơn giản, 1 hero)
- Có data/số → P2/P4/P5
- Có địa lý → P7 + P22
- Có sản phẩm → P8 + load `product-mode.md`
- Có vật cụ thể → P21 vẽ CSS shape
- Mọi pattern có thể combine với P25 (particle bg) khi mood = space/mystery/tech

═══════════════════════════════════════════════════════════════════
PHẦN 4 — 25 LAYOUT PATTERNS (chọn pattern phù hợp với content scene)
═══════════════════════════════════════════════════════════════════

LƯU Ý CHIẾN LƯỢC:
- P1-P20: pattern cơ bản, mỗi cảnh chọn 1 làm chủ
- P21-P25: kỹ thuật NÂNG CAO — KẾT HỢP với P1-P20 để cảnh "có hồn" hơn:
  · P21 (CSS shape illustration) — dùng khi content nhắc đến vật cụ thể (uranium, money, brain, chip)
  · P22 (SVG map) — dùng khi nhắc địa lý/quốc gia
  · P23 (hand-drawn) — dùng cho casual/edu/social style
  · P24 (3D-isometric) — dùng cho product/dashboard/tech
  · P25 (particle field) — bg layer cho space/mystery/tech

Nguyên tắc: AI **NÊN** vẽ visual cho mọi keyword cụ thể trong scene, không để bg trống.

🎯 P1. HERO TEXT REVEAL
  - Title to bự ở giữa, sub-title nhỏ phía dưới
  - Background: gradient + 1 light beam glow ngang
  - Animate: title từ y+80 fade-in, sub-title sau 0.3s, accent bar grow từ trái
  - Dùng cho: cảnh mở đầu, CTA cuối

🎯 P2. BIG NUMBER + UNIT
  - Số cực to (200-280px, weight 900) + unit nhỏ kế bên ("10 NĂM", "$2B", "80GB")
  - Optional: nhãn nhỏ phía trên ("DỰ TRỮ"), pill chip phía dưới ("LÀM GIÀU")
  - Animate: number scale 0.5→1 với back.out, unit fade-in trễ 0.2s, glow pulse 1 lần
  - Dùng cho: thống kê, cột mốc, giá

🎯 P3. DUAL COMPARISON
  - Split 50/50 trái/phải, mỗi vế có icon + label + giá trị
  - Đường VS dọc giữa hoặc icon "→" dẫn từ trái sang phải
  - Background 2 nửa khác màu nhẹ
  - Animate: vế trái slide từ -100 vào, phải từ +100, VS scale-in
  - Dùng cho: trước/sau, ta vs họ, A vs B

🎯 P4. STAT GRID (3-4 stats)
  - Grid 3 cột (hoặc 4): mỗi ô có icon/emoji + số to + label
  - Số dùng tabular-nums, có separator ":" hoặc "/"
  - Animate: stagger 0.1s từng ô, scale 0.8→1 + fade-in
  - Dùng cho: "6x | 3 | 8x", "↑200% / ↓50% / +1M"

🎯 P5. CHART REVEAL (line/bar/gauge)
  - SVG path chart hoặc div bars
  - Line: stroke-dasharray draw-on animation, end point có dot pulse
  - Bar: scaleY từ 0, transform-origin bottom
  - Gauge: rotation từ -90° đến target degree
  - Title chart trên, label dưới, source chú thích nhỏ
  - Dùng cho: stock crash, growth, performance metric

🎯 P6. BRAND/LOGO REVEAL
  - Logo center (text hoặc emoji to), tagline phía dưới
  - Circular bg gradient bao quanh logo, glow pulse
  - Animate: logo scale 0→1 với elastic.out, tagline slide-up trễ 0.4s
  - Dùng cho: giới thiệu thương hiệu, sản phẩm

🎯 P7. MAP CONNECTION
  - SVG/CSS world hoặc region map (đơn giản hoá, dùng absolute dots)
  - 2-4 thành phố là dots glow, đường nối giữa chúng (SVG line stroke-dasharray)
  - Labels thành phố cạnh dot
  - Animate: dots scale-in stagger, lines draw-on, label fade-in
  - Dùng cho: geopolitics, supply chain, network

🎯 P8. PRODUCT WITH CALLOUTS
  - Sản phẩm/object center (img/emoji to)
  - 3-5 chip callout xung quanh ("Tính năng A", "B3"), nối bằng đường line/dot
  - Animate: object scale-in, chips stagger từ object outward, lines draw-on
  - Dùng cho: review sản phẩm, ingredient breakdown

🎯 P9. QUOTE PULL
  - Dấu """ to phía trên, quote text 60-80px, author 32px ghi rõ
  - Border bên trái glow (5px solid accent)
  - Animate: quote text "type-on" effect (clip-path inset hoặc opacity per char), author fade-in cuối
  - Dùng cho: trích dẫn chuyên gia, kết luận

🎯 P10. BREAKING NEWS
  - "BREAKING" hoặc "TIN MỚI" pill đỏ glow trên đầu
  - Headline cực to bên dưới
  - Bottom: ticker bar đỏ với scrolling text
  - Animate: red flash bg flicker 0.1s, headline slam-in, ticker slide-left infinite (finite repeat!)
  - Dùng cho: tin sốc, sự kiện nóng

🎯 P11. TIMELINE / PROCESS STEPS
  - Hàng ngang/dọc với 3-5 dot tròn, đường line nối, mỗi dot có label/year
  - Highlight 1 dot là focus chính (lớn hơn, glow)
  - Animate: line draw-on left-to-right, dots stagger fade-in, focus dot scale pulse cuối
  - Dùng cho: lịch sử, quy trình, roadmap

🎯 P12. PRICE REVEAL
  - "$" hoặc "₫" to bên trái + số bự + ".000" hoặc cents nhỏ
  - "TIẾT KIỆM 50%" pill ở góc, hoặc giá cũ gạch ngang phía trên
  - Animate: $ slide-from-left, số count-up từ 0 → target (HEX cứng dùng innerHTML không cần animate runtime — preset value cuối)
  - Dùng cho: pricing, sale, deal

🎯 P13. COUNTDOWN/TIMER
  - 4 ô digital ("23 : 45 : 12") to + label "DAYS HOURS MINUTES SECONDS"
  - Mỗi số trong khung tròn/vuông glow
  - Animate: chỉ entrance — khung scale-in stagger, số fade-in
  - Dùng cho: deadline, sự kiện sắp diễn ra

🎯 P14. SCROLLING TICKER
  - Bar chữ chạy ngang ở giữa hoặc dưới ("BREAKING ◆ NEWS ◆ ALERT")
  - Pattern repeat liền kề
  - Animate: x: -100% với ease "none", repeat finite (ceil(duration/loopTime))
  - Dùng cho: news ticker, marquee, list nhanh

🎯 P15. SPLIT SCREEN VS
  - Trái: ảnh/icon person A; phải: ảnh/icon person B; "VS" giữa to
  - Background 2 nửa: bên trái xanh, bên phải đỏ (lighting effect)
  - Animate: 2 sides slide từ ngoài vào, "VS" scale-pulse với electric glitch
  - Dùng cho: so sánh người, đối đầu

🎯 P16. ICON GRID
  - 4-6 icon/emoji to trong grid 2x2 hoặc 3x2, mỗi cái có label nhỏ phía dưới
  - Background subtle pattern
  - Animate: stagger 0.08s, scale 0.7→1 + fade-in
  - Dùng cho: feature list, category, value prop

🎯 P17. LIST/RANKING
  - Cột dọc 3-5 hàng, mỗi hàng có "#1 #2 #3" badge + tên + value
  - Top item bự hơn + glow đặc biệt
  - Animate: stagger từ trên xuống, slide-from-left, top item delay nhấn nhá
  - Dùng cho: top 5, ranking, bảng xếp hạng

🎯 P18. CALLOUT BOX WITH ARROW
  - Object/text chính ở center, 1-2 callout box ngoài rìa với mũi tên SVG nối vào
  - Box có border glow, padding, arrow là path SVG động
  - Animate: object xuất hiện trước, callout boxes slide-in từ ngoài + arrow draw-on
  - Dùng cho: chú giải, point-out detail

🎯 P19. ICON + STAT ROW (4 chỉ số)
  - Hàng ngang 4 cột: icon + value + label, separator | giữa
  - Tabular-nums cho values
  - Animate: stagger 0.1s, fade-up từng ô
  - Dùng cho: dashboard, KPI nhanh, summary

🎯 P20. CINEMATIC TITLE CARD
  - Background full-bleed gradient + light streak/sun ray + dust particles
  - Title đặt ở 1/3 trên hoặc 1/3 dưới (rule of thirds)
  - Sub-title nhỏ + thin line accent dưới
  - Animate: 3 layers parallax (bg slow zoom, title fade-in scale 1.05→1, sub stagger)
  - Dùng cho: opening, chapter heading, transition major

═══════════════════════════════════════════════════════════════════
PATTERNS NÂNG CAO (P21-P25) — AI VẼ SVG/CSS THAY VÌ DÙNG ASSET
═══════════════════════════════════════════════════════════════════

🎯 P21. AI-ILLUSTRATED ICON / OBJECT (CSS shapes, không cần asset)
  Khi cảnh nói về 1 khái niệm có thể vẽ bằng CSS/SVG đơn giản, AI tự VẼ:
  - Đồng tiền vàng: <div> hình tròn gradient gold + text "$" hoặc "₫" lớn ở giữa + glow
  - Thanh uranium: <div> tube đứng gradient #BFFF00 → transparent + box-shadow inset glow
  - Chip nhớ: <div> rectangle dark + grid lines pattern + corner pin dots
  - Não/AI: <div> tròn gradient + 3-4 line connectors absolute outward
  - Lửa: <div> ellipse với gradient red→yellow + filter:blur(2px) animate scale
  - Tên lửa/rocket: <div> triangle CSS + rectangle body + small triangle exhaust
  - Dollar money pile: 3 <div> rounded gold xếp chồng lệch, mỗi cái có "$"
  - Lock/key: <div> với border-radius asymmetric tạo hình ổ khoá
  - Map pin: ::before pseudo + border-radius creating teardrop shape
  - Eye: 2 ellipse lồng nhau + 1 dot pupil
  - Heart: 2 ::before/::after rounded + transform rotate -45/45

  ANIMATION: scale 0→1 với elastic.out, glow pulse khi xuất hiện

🎯 P22. ANIMATED SVG MAP (region/world/abstract)
  Khi cảnh đề cập địa lý → AI vẽ SVG inline bản đồ đơn giản:

  <svg viewBox="0 0 1080 600" class="map">
    <!-- Region paths (simplified, không cần realistic) -->
    <path class="continent" d="M 100,200 Q 300,150 500,200 T 900,250 L 900,400 L 100,400 Z"
          fill="rgba(191,255,0,0.08)" stroke="rgba(191,255,0,0.3)" stroke-width="2"/>
    <!-- City dots -->
    <circle cx="200" cy="250" r="8" fill="#DFFF00" class="city-dot"/>
    <text x="220" y="245" fill="#DFFF00" font-size="20">CITY A</text>
    <!-- Connection line -->
    <path class="connection" d="M 200,250 Q 400,180 600,280"
          stroke="#BFFF00" stroke-width="3" fill="none" stroke-dasharray="800"
          stroke-dashoffset="800"/>
  </svg>

  ANIMATION: dots stagger fade-in, paths draw-on (animate stroke-dashoffset 800→0)

🎯 P23. HAND-DRAWN STYLE / DOODLE
  Tạo cảm giác sketch/doodle bằng CSS:
  - Border irregular: border-radius "63% 37% 54% 46% / 55% 48% 52% 45%"
  - Stroke wobble: SVG path với slight curves
  - Highlight marker: ::after absolute với rotate 1-2deg + bg yellow + opacity 0.4
  - Underline scribble: SVG path squiggle drawn underneath text
  - Circle around keyword: SVG ellipse với stroke-dasharray draw-on
  - Arrow doodle: SVG path với handdrawn-look bezier curves

  Dùng cho: education, casual, social, story style

🎯 P24. 3D-ISOMETRIC BLOCK / CARD (CSS perspective)
  Tạo cảm giác 3D mà không cần asset:

  .iso-card {
    transform: perspective(1200px) rotateY(-15deg) rotateX(10deg);
    transform-style: preserve-3d;
    box-shadow: 30px 30px 0 -2px rgba(0,0,0,0.4),
                0 60px 80px rgba(0,0,0,0.3);
  }
  /* Side faces via ::before/::after with translateZ */

  ANIMATION: rotate Y -25 → -15deg, fade-in. Subtle hover-style float yoyo finite.
  Dùng cho: product card, dashboard stats, gaming/tech vibe

🎯 P25. PARTICLE FIELD / STARS BACKGROUND
  Sinh nhiều dot nhỏ làm bg sống động (KHÔNG dùng Math.random — list cứng):

  <div class="particles">
    <span class="p" style="left:12%;top:18%;animation-delay:0s"></span>
    <span class="p" style="left:34%;top:45%;animation-delay:0.3s"></span>
    <span class="p" style="left:67%;top:22%;animation-delay:0.6s"></span>
    <!-- 20-40 particles, vị trí cứng -->
  </div>

  .p { position: absolute; width: 3px; height: 3px; border-radius: 50%;
       background: #DFFF00; box-shadow: 0 0 8px #DFFF00;
       animation: twinkle 3s infinite ease-in-out; }
  @keyframes twinkle { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }

  Note: animation property OK vì là CSS keyframes (không phải GSAP).
  Dùng cho: space, tech, magic, mystery scenes — bg layer

═══════════════════════════════════════════════════════════════════
SVG / CSS SNIPPETS
═══════════════════════════════════════════════════════════════════

Đã tách sang `references/svg-toolkit.md` — load file đó khi cần line chart, bar chart, geo path, coin, lightning, target rings.
