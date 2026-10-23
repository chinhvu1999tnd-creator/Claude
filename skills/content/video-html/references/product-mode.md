# Product Mode — 6-Layer Showcase Pattern

> Loaded by `prompts/html-generator.md` khi PRODUCT MODE = ON (scene có ảnh sản phẩm hoặc commercial keywords).
> Ported verbatim from prompts.ts PHẦN 4.6 (lines 607-723).

═══════════════════════════════════════════════════════════════════
PHẦN 4.6 — PRODUCT SHOWCASE PATTERN (cho cảnh có ảnh sản phẩm)
═══════════════════════════════════════════════════════════════════

KÍCH HOẠT khi prompt user-block đánh dấu PRODUCT MODE = ON
(thường là cảnh có IMAGE GẮN với role=HERO, hoặc content có keyword thương mại
như "combo", "giá", "%", "giảm", "deal", "mua", "ưu đãi", "sản phẩm").

CẢNH SẢN PHẨM KHÔNG phải vẽ stat grid. Mục tiêu là LÀM ĐẸP QUANH ẢNH —
ảnh user upload thường nền lộn xộn, MUST compose 6 layer sau quanh ảnh:

LAYER 1 — BOKEH BACKGROUND (warm depth)
  • 12-18 div absolute, mỗi div = 1 light orb:
      width/height: 80-260px (random per orb, seeded mulberry32 nếu cần determinism)
      border-radius: 50%
      background: radial-gradient(circle, color 0%, transparent 70%)
      filter: blur(24-60px)
      mix-blend-mode: screen
      opacity: 0.4-0.8
      position: absolute (random top/left)
  • Color = brand palette nếu có, fallback theo mood:
      luxury  → #b8860b, #d4af37, #fff5cc
      warm    → #ff9966, #ffcc66, #fff2cc
      cool    → #66b3ff, #99ccff, #ccebff
      tech    → #00ffd5, #006d6d, #cffaf2
  • Animate: rất chậm float — y: ±20px, opacity: ±0.2, duration 8-14s, loop staggered
  • Outer canvas: linear-gradient từ dark center → slightly darker edge để bokeh nổi

LAYER 2 — CARD FRAME (presentation surface)
  • Wrapper div quanh <img> sản phẩm:
      background: rgba(245, 235, 220, 0.08) hoặc brand color × 0.1 alpha
      backdrop-filter: blur(20px) saturate(1.2)
      border: 1px solid rgba(255, 255, 255, 0.12)
      border-radius: 28-40px (lớn cho cảm giác card)
      padding: 48-72px
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.15),
        0 30px 80px -20px rgba(0,0,0,.6),
        0 0 60px rgba(brand-glow,.15)
  • Card chiếm khoảng 65-80% width frame, căn giữa trục dọc
  • Animate entrance: scale 0.92 → 1, opacity 0 → 1, duration 0.8s, ease "expo.out"

LAYER 3 — PRODUCT IMAGE + GROUND SHADOW
  • <img src="..." crossorigin="anonymous" /> trong card frame
      width: 100% của card content area
      height: auto, max-height ~60% scene height
      object-fit: contain
      filter: drop-shadow(0 30px 40px rgba(0,0,0,.5))  ← tạo bóng đổ tự nhiên
  • Ground shadow ellipse (riêng, dưới card hoặc dưới img):
      div absolute width 60-70% card width, height 30-50px
      background: radial-gradient(ellipse, rgba(0,0,0,.6) 0%, transparent 70%)
      filter: blur(20px)
      placed bottom của card, opacity 0.7
  • Animate: ảnh entrance scale 0.94 → 1 + slight y -10 → 0, ease "power3.out", delay 0.2s
  • Optional Ken Burns: scale 1 → 1.05 over scene duration (subtle), ease "none"

LAYER 4 — PILL CHIP TAGS (benefit/keyword callouts)
  • Trích 3-5 keyword từ content scene (số tiền, % giảm, từ khoá benefit như "DA SÁNG",
    "VẾT THÂM", "DEAL HOT", "MIỄN PHÍ SHIP", v.v.)
  • Mỗi keyword = 1 pill chip:
      padding: 8-14px 18-26px
      border-radius: 999px (full pill)
      font-size: 13-18px, font-weight 700, letter-spacing 0.5px
      text-transform: uppercase (cho Vietnamese: capitalize)
      background: rgba(brand-color, 0.18)
      border: 1px solid rgba(brand-color, 0.4)
      color: light brand color
      backdrop-filter: blur(8px)
      box-shadow: 0 4px 12px rgba(0,0,0,.3)
  • Position: rải quanh card frame (top-left, top-right, mid-left, mid-right, bottom)
    KHÔNG che ảnh sản phẩm. Pin vào edge của card với offset -8px to 24px.
  • Mỗi pill 1 màu khác từ palette để tạo nhịp visual:
      gold / lime / coral / teal / lavender — pick 3-5 không trùng
  • Animate: stagger 0.12s, từ {y: 20, opacity: 0, scale: 0.85}
    → {y: 0, opacity: 1, scale: 1}, ease "back.out(1.7)"
  • Anchor vào keyword tương ứng từ alignment nếu có (Mode A timing)

LAYER 5 — HERO METALLIC TEXT (key word from content)
  • 1 từ khoá có cảm xúc cao nhất từ content (vd "ROUTINE", "GIẢM 40%", "COMBO")
  • Font-size: 80-130px, font-weight 900, italic optional, letter-spacing -0.02em
  • Effect metallic gold/brand:
      background: linear-gradient(135deg,
        #f5d97e 0%, #d4af37 30%, #fff5cc 50%, #d4af37 70%, #b8860b 100%)
      -webkit-background-clip: text
      -webkit-text-fill-color: transparent
      filter: drop-shadow(0 4px 12px rgba(brand,.4))
      -webkit-text-stroke: 1px rgba(brand-dark, 0.3) (optional)
  • Position: dưới card frame hoặc overlay slight transparency, không che brand text
  • Animate: từ {scale: 0.6, opacity: 0, letterSpacing: "0.3em"}
    → {scale: 1, opacity: 1, letterSpacing: "-0.02em"}, duration 1s, ease "expo.out"
  • Anchor vào keyword timestamp tương ứng nếu có alignment

LAYER 6 — BRAND BADGES (top corners — trust signal)
  • Nếu brand.logoUrl + watermark → 2 chip nhỏ:
      Top-left: chip text "Chính hãng" hoặc tagline brand (font 11-13px, semi-bold)
      Top-right: chip với <img logo /> + brand name
  • Style chip:
      padding: 6-10px 12-16px
      border-radius: 12px
      background: rgba(255,255,255,0.06)
      backdrop-filter: blur(12px)
      border: 1px solid rgba(255,255,255,0.1)
      font-size: 10-13px
      color: rgba(255,255,255,0.85)
  • Animate: từ {y: -10, opacity: 0} → {y: 0, opacity: 1}, ease "power2.out", t=0
  • KHÔNG bắt buộc — bỏ nếu user không có brand kit

GHI CHÚ QUAN TRỌNG cho PRODUCT MODE:
  ✅ KHÔNG phải vẽ chart/stat khi đã có ảnh sản phẩm → ảnh là content
  ✅ KHÔNG copy nhiều từ content vào caption — caption đã được render bởi system
     (chỉ dùng pill chip + hero word)
  ✅ Bố cục PHẢI có chiều sâu Z (bokeh xa → card giữa → pill front → text overlay)
  ✅ Ảnh sản phẩm là FOCAL POINT, mọi layer khác support nó, không cạnh tranh
  ❌ KHÔNG đặt text che ảnh sản phẩm
  ❌ KHÔNG dùng atmosphere generic (stars, brackets, readout) trong product mode
  ❌ KHÔNG bỏ ground shadow — ảnh không có shadow trông như "dán vào"
