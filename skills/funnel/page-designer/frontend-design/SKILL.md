---
name: frontend-design
description: Aesthetic direction layer cho page-designer. Load SAU base.css và patterns — override font, motion philosophy, và distinctiveness lên scaffold của page-designer. KHÔNG dùng standalone.
version: 1.1.0
source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
agent: funnel
tags: [frontend, design, aesthetics, font, motion, override]
---

# Frontend Design — Aesthetic Layer

> **Template Mode (Mode A):** Layer 8 — polish aesthetic nhẹ lên scaffold có sẵn. Font override + editorial moments. Layout theo pattern.
> **Creative Mode (Mode B):** Dominant — quyết định layout + aesthetic. Pattern chỉ cung cấp Content Schema (elements cần có), không cung cấp layout.
>
> **Creative Mode: pattern cho biết section cần elements gì — layout là trang giấy trắng của anh/chị.**

---

## Phân công với page-designer

| page-designer lo | frontend-design lo |
|---|---|
| base.css (grain, precision bar, animations) | Font direction (thay Inter Tight bằng gì?) |
| Patterns (nav, hero, stats-bar, pricing…) | Editorial moments (italic serif trong headlines) |
| Section rhythm 4-phase arc | Color philosophy (dominant + sharp accent) |
| VN context (VND, Zalo, SePay) | Motion philosophy (high-impact vs. scattered) |
| Theme colors (--accent, --cyan, --purple) | Spatial composition (asymmetry, grid-breaking) |
| Tailwind config | Background depth (noise, mesh, layered gradients) |

---

## Aesthetic Direction — Thực hiện trước khi code

Trước khi generate HTML, commit vào một aesthetic direction rõ ràng:

- **Purpose**: Interface này giải quyết vấn đề gì? Ai dùng?
- **Tone**: Chọn một cực: brutally minimal, maximalist, retro-futuristic, luxury, editorial, brutalist, v.v.
- **Differentiation**: Điều gì làm page này KHÔNG THỂ QUÊN?

**Không được:** Để direction mơ hồ rồi converge về "clean dark với accent màu theme."

---

## Font Override — Đòn bẩy chính

Đây là override quan trọng nhất. Inter Tight (default dark-bold-neon) hoạt động tốt nhưng phổ biến — thay bằng font distinctive hơn:

### Font pairings được kiểm chứng

| Display font | Body font | Editorial accent | Aesthetic feel |
|---|---|---|---|
| **Bricolage Grotesque** | Source Sans 3 | DM Serif Display | Bold editorial · AI/tech/growth |
| **Barlow Condensed 800** | Source Serif 4 | — (no editorial needed) | Stark · industrial · maximum contrast |
| **Cabinet Grotesk** | Libre Franklin | Lora | Contemporary · warm · approachable |
| **Fraunces** | General Sans | DM Serif Text | Premium · coaching · authority |
| **Epilogue** | Source Sans 3 | Libre Baskerville | Clean · SaaS · confident |
| **Be Vietnam Pro 800** | Be Vietnam Pro 400 | DM Serif Display | Vietnamese-native · warm professional · high diacritic fidelity · **🇻🇳 CANONICAL VN PAIRING** |

**Be Vietnam Pro — Canonical Vietnamese Pairing (dùng mặc định cho mọi page tiếng Việt):**
- **Primary choice cho mọi page content >50% tiếng Việt** — không cần hỏi
- Dấu thanh tiếng Việt (à, á, ã, ả, ạ, ê, ô, ư…) render sắc nét ở headline cỡ lớn
- Ngành coaching, business, education, course — phù hợp nhất
- Font stack chuẩn: `'Be Vietnam Pro'` trước `system-ui` (không dùng `Noto Sans SC` — đó là Simplified Chinese)
- Fallback body: **Noto Sans** (covers toàn bộ Unicode VN + Latin + fallback cho các dấu ít gặp)

```html
<!-- Canonical VN font stack -->
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,600;0,800;1,400&family=Noto+Sans:ital,wght@0,400;0,500;1,400&family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display:   "Be Vietnam Pro", "Noto Sans", system-ui, sans-serif;
  --font-body:      "Be Vietnam Pro", "Noto Sans", system-ui, sans-serif;
  --font-editorial: "DM Serif Display", Georgia, serif;
  --font-mono:      "JetBrains Mono", monospace; /* giữ nguyên */
}
```

**Khi nào override khỏi canonical VN pairing:**
- Page content >70% tiếng Anh → dùng pairings khác trong bảng
- Industry luxury (prestige-dark) → Cormorant Garamond / Libre Baskerville
- Industry tech/SaaS global → Bricolage Grotesque / Epilogue

```css
:root {
  --font-display:   "Be Vietnam Pro", system-ui, sans-serif;
  --font-body:      "Be Vietnam Pro", system-ui, sans-serif;
  --font-editorial: "DM Serif Display", Georgia, serif;
}
```
```html
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,600;0,800;1,400&family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet">
```

**Quy tắc:**
- Chọn 1 display font (headlines) + 1 body font + 1 editorial font (italic moments)
- Override vào `--font-display` trong `:root` — tất cả `font-display` classes sẽ tự cập nhật
- Giữ `--font-mono: "JetBrains Mono"` — không thay
- Cập nhật Google Fonts `<link>` tương ứng

```css
/* Ví dụ override trong <style> sau base.css */
:root {
  --font-display:   "Bricolage Grotesque", sans-serif;
  --font-body:      "Source Sans 3", sans-serif;
  --font-editorial: "DM Serif Display", serif;
  /* --font-mono giữ nguyên JetBrains Mono */
}
```

```js
/* Cập nhật tailwind.config fontFamily tương ứng */
fontFamily: {
  display:   ['"Bricolage Grotesque"', 'sans-serif'],
  body:      ['"Source Sans 3"', 'sans-serif'],
  editorial: ['"DM Serif Display"', 'serif'],
  mono:      ['"JetBrains Mono"', 'monospace'],
}
```

### Reflex-Reject Fonts — Không dùng, không ngoại lệ

AI có xu hướng default về các font này khi không có direction rõ ràng — chúng phổ biến đến mức trở thành tín hiệu "AI-generated":

**Display/Heading:** Inter, Inter Tight, Roboto, Space Grotesk, Syne, Plus Jakarta Sans, Instrument Sans  
**Body:** DM Sans, Open Sans, Nunito (trừ khi warm-earth theme chỉ định rõ)  
**Editorial:** Playfair Display, Cormorant, EB Garamond (quá phổ biến trên AI-built pages)

**Thay thế an toàn:**
- Syne → Epilogue hoặc Cabinet Grotesk
- Playfair Display → DM Serif Display hoặc Fraunces
- Cormorant → Libre Baskerville hoặc DM Serif Text
- DM Sans → Source Sans 3 hoặc Libre Franklin

### Dùng editorial font cho "moments"

Không dùng editorial font cho toàn page — chỉ cho 1-2 moments trong headlines:

```html
<!-- Ví dụ: italic serif nhỏ hơn trong H1 tạo contrast với display bold -->
<h1 class="font-display font-black">
  Một người vận hành<br>
  <span class="text-gradient">bộ máy của 6 chuyên gia</span><br>
  <span style="font-family:var(--font-editorial);font-style:italic;font-size:0.65em;color:var(--subtle)">
    bằng AI.
  </span>
</h1>
```

---

## Typography Scale — 3-Tier Hierarchy

Mọi section phải dùng đúng 3-tier này — không trộn lẫn, không thêm tier thứ 4.

```
TIER 1 — Mono label (eyebrow)    10.5–12px · uppercase · letter-spacing 0.14–0.18em · opacity 0.65
TIER 2 — Display headline        clamp(36px, 5vw, 80px) · font-weight 800–900 · letter-spacing -0.02em
TIER 3 — Body / subhead          14–18px · line-height 1.55 · font-weight 400–500
```

### Eyebrow anatomy — chuẩn hóa

Format: `[số thứ tự] · [TÊN SECTION]` với bar accent bên trái.

```html
<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
  <div style="width:24px;height:2px;background:var(--accent);opacity:0.8;flex-shrink:0;"></div>
  <span style="font-family:var(--font-mono);font-size:11px;font-weight:600;
               letter-spacing:0.16em;text-transform:uppercase;color:var(--subtle);">
    01 · KẾT QUẢ
  </span>
</div>
```

Variant với số thứ tự nổi bật:
```html
<span style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--subtle);">
  <span style="color:var(--accent);font-weight:700;">01</span> · SECTION NAME
</span>
```

### `clamp()` prescriptions — dùng thay cho fixed px

| Cấp độ | Light theme | Dark theme |
|--------|-------------|------------|
| H1 hero | `clamp(44px, 6.5vw, 88px)` | `clamp(48px, 7vw, 96px)` |
| H2 section | `clamp(32px, 4.5vw, 60px)` | `clamp(36px, 5vw, 68px)` |
| H3 subhead | `clamp(20px, 2.5vw, 32px)` | `clamp(22px, 2.8vw, 36px)` |
| Body large | `clamp(16px, 1.5vw, 19px)` | `clamp(16px, 1.5vw, 18px)` |

```css
/* Sao chép nhanh — đặt trong :root override */
--text-h1:   clamp(48px, 7vw, 96px);
--text-h2:   clamp(36px, 5vw, 68px);
--text-h3:   clamp(22px, 2.8vw, 36px);
--text-body: clamp(16px, 1.5vw, 18px);
```

**`line-height` rules:**
- Headlines (clamp lớn): `line-height: 0.95–1.05` — tight, editorial
- Vietnamese diacritics ở mobile: `line-height: 1.05` tối thiểu để dấu thanh không bị cắt
- Body: `line-height: 1.55` — chuẩn cho cả Latin và Vietnamese

---

## Color Philosophy

### Giữ màu theme khi nào
- Theme accent đã đủ distinctive cho industry (dark-bold-neon lime `#B6FF00` cho AI/Tech — giữ)
- Không có lý do cụ thể để override

### Override màu khi nào
- User có brand color riêng khác hẳn theme accent
- Industry cần màu khác (luxury → gold, finance → navy, health → teal)
- Muốn aesthetic direction hoàn toàn khác theme mặc định

**Override cách nào:** Chỉ thay `--accent` và `--accent-rgb` trong `:root` — toàn bộ page cập nhật. Không hardcode hex trong HTML.

**OKLCH thay HEX:** Khi có brand color mới, define bằng OKLCH để tạo shade/tint dễ hơn:
```css
/* Ví dụ: #B6FF00 → oklch(93% 0.27 130) */
--accent:     oklch(93% 0.27 130);
--accent-dim: oklch(93% 0.27 130 / 0.10);  /* chỉ đổi alpha — không cần tính rgba */
--accent-mid: oklch(80% 0.27 130);          /* darker shade — chỉ giảm L */
```
Ưu điểm: `oklch(L% C H / alpha)` — giảm L → darker, tăng L → lighter, đồng nhất cảm quan.

### Extended Color Token System — 17 tokens (WCAG-complete)

Khi build component system đầy đủ (pricing cards, forms, badges, status chips), nâng từ 8 vars lên 17 tokens. Tất cả pair đã verified WCAG 3:1 trên accent, 4.5:1 trên text.

```css
:root {
  /* === Core 8 (hiện tại) === */
  --accent:        #B6FF00;
  --accent-rgb:    182, 255, 0;
  --bg:            #141413;
  --surface:       #1E1E1C;    /* = --card */
  --ink:           #faf9f5;    /* = --foreground */
  --body:          #e8e6dc;
  --subtle:        #b0aea5;    /* = --muted-foreground */
  --faint:         #4a4845;    /* = --border */
  --rim:           rgba(255,255,255,0.07);

  /* === 9 tokens mới === */
  --on-accent:     #141413;    /* text trên --accent background — WCAG AA */
  --secondary:     #2a2a28;    /* secondary surface — darker than --surface */
  --on-secondary:  #e8e6dc;    /* text trên --secondary */
  --card-fg:       #faf9f5;    /* text trong card — alias --ink */
  --muted:         rgba(255,255,255,0.06); /* subtle bg tint — lighter than --surface */
  --muted-fg:      #7a7875;    /* placeholder text, disabled state — darker than --subtle */
  --ring:          rgba(var(--accent-rgb), 0.35); /* focus ring color */
  --destructive:   #F0226A;    /* danger/error */
  --destructive-fg:#faf9f5;    /* text trên destructive bg */
}
```

**Khi nào dùng extended tokens:**
- `--on-accent` → text/icon đặt trực tiếp trên `background:var(--accent)` button
- `--ring` → `box-shadow: 0 0 0 3px var(--ring)` cho focus state, không dùng `outline`
- `--muted-fg` → placeholder text, disabled label, helper text nhỏ dưới input
- `--destructive` → form error, alert badge, danger CTA
- `--secondary` → section background xen kẽ (thay `.bg-stack-*` khi cần minimal)

**Mapping từ shadcn/ui tokens** (nếu dùng cùng component library):
```
shadcn: primary       → --accent
shadcn: primary-fg    → --on-accent
shadcn: background    → --bg
shadcn: foreground    → --ink
shadcn: card          → --surface
shadcn: card-fg       → --card-fg
shadcn: muted         → --muted
shadcn: muted-fg      → --muted-fg
shadcn: border        → --faint
shadcn: ring          → --ring
shadcn: destructive   → --destructive
```

---

### 3-Step Funnel Color Progression

Khi page có narrative arc Problem → Process → Solution (3 section liên tiếp), dùng color progression tạo visual storytelling:

```
Section 1 — PROBLEM (Tension)
  Background: var(--bg) flat  ·  Accent: var(--destructive) #F0226A  ·  Icons: red
  Feel: uncomfortable, "đây là vấn đề của bạn"

Section 2 — PROCESS (Movement)
  Background: var(--secondary)  ·  Accent: #F97316 orange  ·  Icons: orange arrows
  Feel: transition, "đây là cách chúng tôi giải quyết"

Section 3 — SOLUTION (Relief)
  Background: var(--bg)  ·  Accent: var(--accent) lime/green  ·  Icons: checkmarks
  Feel: resolution, "đây là kết quả bạn sẽ có"
```

**CSS implementation:**
```css
.phase-tension  { --phase-accent: var(--destructive); }
.phase-motion   { --phase-accent: #F97316; }
.phase-solution { --phase-accent: var(--accent); }

/* Icon, badge, line trong mỗi phase dùng --phase-accent thay vì --accent */
.phase-icon { stroke: var(--phase-accent); }
.phase-badge { background: rgba(var(--phase-accent), 0.10); border-color: rgba(var(--phase-accent), 0.25); }
```

**Ghi nhớ:** Áp dụng khi 3 section liền nhau có narrative flow. KHÔNG áp dụng khi sections độc lập (FAQ, testimonials, pricing riêng lẻ).

---

## Motion Philosophy

**High-impact moments > scattered micro-interactions**

| Dark-bold-neon classes đã có | Dùng ở đâu |
|---|---|
| `.shimmer-border` trên `.card-featured` | Pricing card — max 1/page |
| `.flow-line-h` trên pipeline connectors | How it works, process sections |
| `.icon-breathe` trên feature icons | 1-2 icon quan trọng nhất, không phải tất cả |
| `.scan-line` | Sections data/tech/dashboard feel |
| `.card-lift-accent` | Agent cards, feature cards |
| Blobs (`.blob-purple`, `.blob-cyan`) | Hero section — opacity 0.08-0.12 |

**Không được:** Thêm animation vào mọi element. One well-orchestrated page load > scattered effects.

---

## Backgrounds & Visual Details

Khai thác tối đa các stacked backgrounds của base.css thay vì viết custom:

```
Hero         → .bg-stack-hero-grid (accent glow + grid)
Problem      → bg-canvas flat, không decoration (TENSION phase)
Features     → .bg-stack-dual (accent TL + cyan BR + dots)
Pricing      → .bg-stack-cta (center glow + grid)
Testimonials → .bg-stack-trust (bottom glow + dots)
Final CTA    → background:var(--accent) solid
```

Thêm visual depth bằng:
- `body::after` grain overlay (đã có trong base.css — không cần thêm)
- Blob elements với opacity thấp (0.06-0.12) trong hero
- `.scan-line` cho tech/data sections

---

## Background Recipe Library — Creative Mode

Tất cả recipes dùng CSS vars — work với mọi theme, không hardcode hex.
Stack `background-image` layers: gradient trước (trên), pattern sau (dưới).

> **Cách dùng:** Paste thẳng vào `style=""` của `<section>` hoặc viết vào `<style>` block.
> **Opacity guideline:** Pattern lines/dots: 0.03–0.06 trên dark themes, 0.06–0.12 trên light themes.

---

### 1. Grid Variants

**Grid line cơ bản (60px)**
```css
background-color: var(--bg);
background-image:
  linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
background-size: 60px 60px;
```

**Grid line mịn (24px) — dày hơn, tech feel**
```css
background-color: var(--bg);
background-image:
  linear-gradient(rgba(var(--accent-rgb),.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.03) 1px, transparent 1px);
background-size: 24px 24px;
```

**Grid chữ thập / Plus marks (giao điểm nổi bật)**
```css
background-color: var(--bg);
background-image:
  linear-gradient(rgba(var(--accent-rgb),.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.05) 1px, transparent 1px);
background-size: 48px 48px;
background-position: 24px 24px; /* offset để tạo dấu + tại mỗi ô */
```

**Dot grid (round dots)**
```css
background-color: var(--bg);
background-image: radial-gradient(circle, rgba(var(--accent-rgb),.18) 1px, transparent 1px);
background-size: 28px 28px;
```

**Dot grid nhỏ (dense, subtle)**
```css
background-color: var(--bg);
background-image: radial-gradient(circle, rgba(var(--accent-rgb),.12) 1px, transparent 1px);
background-size: 16px 16px;
```

**Grid chéo 45°**
```css
background-color: var(--bg);
background-image:
  repeating-linear-gradient(45deg,
    transparent, transparent 39px,
    rgba(var(--accent-rgb),.04) 39px, rgba(var(--accent-rgb),.04) 40px),
  repeating-linear-gradient(-45deg,
    transparent, transparent 39px,
    rgba(var(--accent-rgb),.04) 39px, rgba(var(--accent-rgb),.04) 40px);
```

**Scan lines ngang (horizontal stripes — data/terminal feel)**
```css
background-color: var(--bg);
background-image: repeating-linear-gradient(
  0deg, transparent, transparent 3px,
  rgba(var(--accent-rgb),.018) 3px, rgba(var(--accent-rgb),.018) 4px);
```

---

### 2. Gradient-Only (không grid)

**Radial center glow — hero spotlight**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 80% 50% at 50% 0%,
    rgba(var(--accent-rgb),.12) 0%, transparent 70%);
```

**Radial top-left glow — asymmetric**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 60% 60% at -5% -5%,
    rgba(var(--accent-rgb),.12) 0%, transparent 70%);
```

**Dual corner glow (accent TL + cyan BR)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 50% 50% at 0% 0%,
    rgba(var(--accent-rgb),.10) 0%, transparent 60%),
  radial-gradient(ellipse 50% 50% at 100% 100%,
    rgba(0,194,255,.07) 0%, transparent 60%);
```

**Mesh gradient (ambient, không focal point)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 60% 40% at 20% 30%,
    rgba(var(--accent-rgb),.07) 0%, transparent 60%),
  radial-gradient(ellipse 40% 60% at 80% 70%,
    rgba(0,194,255,.05) 0%, transparent 60%),
  radial-gradient(ellipse 50% 30% at 50% 100%,
    rgba(var(--accent-rgb),.04) 0%, transparent 50%);
```

**Bottom edge glow (CTA section warm-up)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 100% 40% at 50% 100%,
    rgba(var(--accent-rgb),.10) 0%, transparent 70%);
```

**Vignette (edges darker — drama, focus center)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 70% 70% at 50% 50%,
    transparent 40%, rgba(0,0,0,.35) 100%);
```

**Linear diagonal fade (light → dark)**
```css
background-image:
  linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
```

---

### 3. Grid + Gradient Combos (most visually rich)

**Hero classic — center glow + grid (dark themes)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 80% 50% at 50% 0%,
    rgba(var(--accent-rgb),.10) 0%, transparent 65%),
  linear-gradient(rgba(var(--accent-rgb),.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.03) 1px, transparent 1px);
background-size: 100% 100%, 60px 60px, 60px 60px;
```

**Grid fades out (grid visible top, fades toward bottom)**
```css
background-color: var(--bg);
background-image:
  linear-gradient(to bottom, transparent 50%, var(--bg) 100%),
  linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
background-size: 100% 100%, 60px 60px, 60px 60px;
```

**Dot grid + side glow (agent/feature sections)**
```css
background-color: var(--surface);
background-image:
  radial-gradient(ellipse 40% 80% at 0% 50%,
    rgba(var(--accent-rgb),.08) 0%, transparent 60%),
  radial-gradient(circle, rgba(var(--accent-rgb),.14) 1px, transparent 1px);
background-size: 100% 100%, 28px 28px;
```

**Diagonal lines + top glow (editorial sections)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 60% 30% at 50% 0%,
    rgba(var(--accent-rgb),.08) 0%, transparent 70%),
  repeating-linear-gradient(45deg,
    transparent, transparent 39px,
    rgba(var(--accent-rgb),.03) 39px, rgba(var(--accent-rgb),.03) 40px);
```

**Grid + vignette (pricing, guarantee — focused sections)**
```css
background-color: var(--surface);
background-image:
  radial-gradient(ellipse 70% 70% at 50% 50%,
    transparent 50%, rgba(0,0,0,.25) 100%),
  linear-gradient(rgba(var(--accent-rgb),.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.03) 1px, transparent 1px);
background-size: 100% 100%, 40px 40px, 40px 40px;
```

**Dot grid + dual corner glow (hero variant — signal theme)**
```css
background-color: var(--bg);
background-image:
  radial-gradient(ellipse 50% 40% at 10% 10%,
    rgba(var(--accent-rgb),.08) 0%, transparent 60%),
  radial-gradient(ellipse 40% 50% at 90% 90%,
    rgba(0,194,255,.06) 0%, transparent 60%),
  radial-gradient(circle, rgba(var(--accent-rgb),.12) 1px, transparent 1px);
background-size: 100% 100%, 100% 100%, 32px 32px;
```

---

### 4. Atmospheric / Special

**Contour rings (emanating from bottom — momentum feel)**
```css
background-color: var(--bg);
background-image: repeating-radial-gradient(
  circle at 50% 110%,
  transparent 0%,
  transparent calc(8% - 1px),
  rgba(var(--accent-rgb),.04) calc(8% - 1px),
  rgba(var(--accent-rgb),.04) 8%
);
```

**Isometric grid (3 angles — 0°, 60°, -60°)**
```css
background-color: var(--bg);
background-image:
  repeating-linear-gradient(0deg,
    transparent, transparent 27px,
    rgba(var(--accent-rgb),.04) 27px, rgba(var(--accent-rgb),.04) 28px),
  repeating-linear-gradient(60deg,
    transparent, transparent 27px,
    rgba(var(--accent-rgb),.03) 27px, rgba(var(--accent-rgb),.03) 28px),
  repeating-linear-gradient(-60deg,
    transparent, transparent 27px,
    rgba(var(--accent-rgb),.03) 27px, rgba(var(--accent-rgb),.03) 28px);
```

**Blueprint grid (thicker accent lines + fine subdivisions)**
```css
background-color: var(--bg);
background-image:
  linear-gradient(rgba(var(--accent-rgb),.08) 2px, transparent 2px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.08) 2px, transparent 2px),
  linear-gradient(rgba(var(--accent-rgb),.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(var(--accent-rgb),.03) 1px, transparent 1px);
background-size: 120px 120px, 120px 120px, 24px 24px, 24px 24px;
```

**Conic sweep (subtle rotation — premium feel)**
```css
background-color: var(--bg);
background-image:
  conic-gradient(from 0deg at 50% 120%,
    rgba(var(--accent-rgb),.06) 0deg,
    transparent 40deg,
    rgba(var(--accent-rgb),.03) 80deg,
    transparent 120deg,
    rgba(var(--accent-rgb),.04) 160deg,
    transparent 200deg);
```

---

### Chọn recipe theo section type

| Section | Recipe gợi ý |
|---------|-------------|
| Hero (dark, high-energy) | Hero classic / Dual corner glow + grid |
| Hero (editorial, signal) | Grid fades out / Diagonal + top glow |
| Problem / TENSION | Flat var(--bg) chỉ — KHÔNG decoration |
| Solution / SHIFT | Linear diagonal fade / Dot grid + side glow |
| Features / Agents | Dot grid + side glow / Grid + vignette |
| Proof / Testimonials | Mesh gradient / Bottom edge glow |
| Pricing | Grid + vignette / Blueprint grid |
| CTA | var(--accent) solid / Contour rings trên dark |
| Stats bar | Scan lines / Fine dot grid |

---

## Mobile-First Layout Rules — Bắt buộc cho mọi Creative Mode build

Editorial và typography-first không có nghĩa là desktop-only. Mọi layout phải work trên 375px trước.

**Body:**
```css
body { overflow-x: hidden; } /* chặn horizontal scroll leak */
```

**Grid defaults — luôn start từ 1 col:**
```html
<!-- Đúng -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
<!-- Sai — hardcode 2 col, vỡ mobile -->
<div style="display:grid;grid-template-columns:1fr 1fr">
```

**Breakpoint rules:**
| Layout type | Mobile | Tablet+ |
|---|---|---|
| 2-col hero split | single col, copy trên · visual dưới | `lg:grid-cols-2` |
| Pipeline / timeline | vertical dọc (default) | giữ vertical hoặc `lg:` horizontal |
| Pricing 3-zone | flex-col stacked | `lg:flex-row` |
| Stats grid | `grid-cols-2` max | `md:grid-cols-4` |
| Agent/feature rows | single col | `lg:grid-cols-[auto_1fr_auto]` |
| Testimonial rows | single col | `lg:grid-cols-[auto_1fr_auto]` |
| Nav links | ẩn trên mobile, dùng hamburger hoặc ẩn hẳn | `md:flex` |

**Touch targets:** Mọi `<button>`, `<a>` interactive đều phải có `min-h-[44px]`.

**Typography responsive:** `clamp()` đã handle font size — nhưng line-height cần review trên mobile. H1 với `line-height: 0.88` hoạt động tốt trên desktop, trên mobile cần `line-height: 0.95` hoặc `1.0` để tránh chữ bị cắt.

**Padding:** `px-4 py-16` mobile → `px-6 py-24` desktop. Không dùng `px-6` fixed cho tất cả.

---

## Visual Evidence — Khi nào dùng media, khi nào không cần

**Nguyên tắc cốt lõi:** Media có mặt khi nó mang *proof weight* — không phải để trang đẹp hơn, mà để visitor tin hơn. Editorial theme không có nghĩa là no media; có nghĩa là media phải có lý do tồn tại.

### 4 loại media và khi nào chúng làm việc

| Slot | Khi nào thêm | Khi nào bỏ qua |
|------|-------------|----------------|
| `[PERSON]` — ảnh mặt người | Testimonials, guarantee (người đứng sau), about section | Stats bar, mechanism diagram, pricing |
| `[PRODUCT]` — mockup/screenshot | Hero (nếu sản phẩm là software/tool), what's included | Problem section, agitate, FAQ |
| `[PROCESS]` — screenshot/diagram từng bước | How it works, agent deep-dive, mechanism | For/not for, guarantee, CTA |
| `[RESULT]` — bằng chứng kết quả | Testimonials (kèm quote), results counter | Pricing section, nav, footer |

### Sections nên có media để tăng conversion

**Testimonials** → luôn có `[PERSON]` avatar. Không có ảnh = testimonial trông giả. Nếu không có ảnh thật: dùng initials placeholder, không xóa slot.

**How It Works** → mỗi bước nên có `[PROCESS]` visual nhỏ (screenshot, icon diagram, hoặc SVG minh họa). Text-only how-it-works = visitor không hiểu, không mua.

**Hero** → nếu sản phẩm là tool/software: `[PRODUCT]` mockup bên phải tăng desire. Nếu personal brand: `[PERSON]` portrait. Nếu abstract service: editorial oversized type vẫn đủ.

**Agent / Feature showcase** → mỗi agent có thể có SVG icon 32-40px hoặc mini `[PROCESS]` screenshot. Không bắt buộc nhưng giúp scanability.

### Quy tắc placeholder khi chưa có media thật

Luôn dùng dashed border placeholder với label rõ ràng — không bao giờ bỏ slot vì "chưa có ảnh":

```html
<!-- Đúng — intentional placeholder -->
<div class="media-slot" data-role="PERSON"
     style="width:64px;height:64px;border-radius:50%;
            border:1.5px dashed var(--faint);
            display:flex;align-items:center;justify-content:center;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="var(--subtle)" stroke-width="1.5"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--subtle)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</div>

<!-- Sai — bỏ slot vì chưa có ảnh -->
<!-- (không có gì) -->
```

### SVG diagram cho process sections

Process / timeline / mechanism sections → dùng SVG hoặc CSS diagram thật, không phải `[PROCESS]` image slot:
- Vertical node flow: CSS `border-left` + circles
- Horizontal pipeline: CSS `flex` + connector lines  
- Step arrows: inline SVG `→` hoặc `↓`

Chỉ dùng `[PROCESS]` image slot khi cần *screenshot thật* của UI/output — không phải để minh họa flow.

---

## Components — Từ html-anything

Các component nhỏ dưới đây dùng ngay trong HTML output mà không cần pattern file riêng.

### Pull Quote

Dùng cho testimonial nổi bật, trích dẫn tác giả, hoặc proof quote trong body copy.

```html
<blockquote style="
  border-left: 2px solid var(--accent);
  background: var(--accent-dim);
  padding: 20px 24px;
  border-radius: 0 8px 8px 0;
  position: relative;
">
  <span style="
    position:absolute;top:-8px;left:18px;
    font-family:var(--font-editorial),Georgia,serif;
    font-size:64px;line-height:1;color:var(--accent);opacity:0.4;
  ">"</span>
  <p style="font-size:18px;line-height:1.6;color:var(--body);font-style:italic;padding-left:8px;">
    [Nội dung quote]
  </p>
  <footer style="margin-top:12px;padding-left:8px;font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--subtle);">
    — [Tên người] · [Chức danh]
  </footer>
</blockquote>
```

### Pill Nav — Sticky floating

Dùng cho nav bar nổi bật, không dùng full-width header thông thường.

**Quy tắc bắt buộc:** Pill nav phải **ẩn mặc định** khi vào trang — chỉ hiện sau khi user scroll qua hero. Nav hiện ngay từ đầu chồng lên hero gây visual noise và làm mất trọng tâm của headline.

```css
/* CSS — ẩn mặc định */
#nav {
  position: fixed; top: 20px; left: 50%;
  transform: translateX(-50%) translateY(-8px);
  display: flex; align-items: center; gap: 28px;
  padding: 10px 24px; border-radius: 999px;
  backdrop-filter: saturate(140%) blur(16px);
  -webkit-backdrop-filter: saturate(140%) blur(16px);
  background: rgba(var(--bg-rgb), 0.80);
  border: 1px solid var(--rim-strong);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  z-index: 1000; white-space: nowrap;
  /* Hidden by default */
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1);
}
#nav.show {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
```

```html
<nav id="nav">
  <span style="font-family:var(--font-display);font-size:15px;font-weight:800;color:var(--ink);">[Brand]</span>
  <a href="#features" style="font-size:13.5px;color:var(--subtle);text-decoration:none;">Tính năng</a>
  <a href="#pricing" style="font-size:13.5px;color:var(--subtle);text-decoration:none;">Giá</a>
  <a href="#pricing" class="btn-primary" style="padding:9px 22px;font-size:13px;">Mua ngay</a>
</nav>
```

```js
// JS — hiện khi scroll qua hero
const navEl = document.getElementById('nav');
new IntersectionObserver(
  ([e]) => navEl.classList.toggle('show', !e.isIntersecting),
  { threshold: 0 }
).observe(document.getElementById('hero'));
```

**Kết hợp với sticky bottom bar:** Dùng chung 1 IntersectionObserver trigger cả hai — nav trên và bar dưới xuất hiện cùng lúc khi hero out of view.

**Sticky vs Fixed:** Dùng `position: sticky; top: 16px` thay `position: fixed` khi muốn tránh stacking context issues — nav sẽ cuộn với page rồi "dính" lại đúng lúc.

```js
// Trigger nav + sticky bar cùng lúc
const navEl  = document.getElementById('nav');
const sbarEl = document.getElementById('sbar');
new IntersectionObserver(([e]) => {
  const past = !e.isIntersecting;
  navEl.classList.toggle('show', past);
  sbarEl.classList.toggle('show', past);
}, { threshold: 0 }).observe(document.getElementById('hero'));
```

**Khi nào dùng pill nav:** Creative Mode (Mode B) + one-page layout + muốn aesthetic rõ ràng. Template Mode dùng `nav.html` pattern như bình thường.

### Fixed Ambient Mesh — Full-page background layer (Apple/Soft Luxe tier)

Tạo background layer persistent bên dưới toàn bộ content — blobs drift xuyên suốt page khi scroll.

```css
/* Thêm vào <style> block, không thêm vào bất kỳ section nào */
.ambient-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;           /* bên dưới mọi content */
  pointer-events: none; /* không block click */
  overflow: hidden;
}
.ambient-mesh::before,
.ambient-mesh::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
}
.ambient-mesh::before {
  width: 600px; height: 600px;
  top: -10%; left: -10%;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%);
  animation: drift1 18s ease-in-out infinite alternate;
}
.ambient-mesh::after {
  width: 400px; height: 400px;
  bottom: 10%; right: -5%;
  background: radial-gradient(circle, rgba(0,194,255, 0.06) 0%, transparent 70%);
  animation: drift2 22s ease-in-out infinite alternate;
}
@keyframes drift1 { to { transform: translate(80px, 60px) scale(1.1); } }
@keyframes drift2 { to { transform: translate(-60px, -40px) scale(0.95); } }
@media (prefers-reduced-motion: reduce) {
  .ambient-mesh::before, .ambient-mesh::after { animation: none; }
}
```

```html
<!-- Thêm ngay sau <body> tag, trước mọi content -->
<div class="ambient-mesh" aria-hidden="true"></div>

<!-- Mọi section content cần z-index: 1 để nằm trên mesh -->
<section style="position:relative;z-index:1"> ... </section>
```

**Khi nào dùng:** `soft-luxe`, `prestige-dark`, `warm-authority` themes — nơi background depth quan trọng. **Không dùng** cho `trust-navy`, `clean-clinic`, `bold-appetite` — cần feel sạch, không atmospheric.

### Double-Bezel Card — Apple-tier depth (soft-luxe / prestige-dark)

Nested border-radius + layered box-shadow tạo chiều sâu mà không cần ảnh.

```css
:root {
  --shell-radius: 20px;
  --core-radius: calc(var(--shell-radius) - 4px); /* inner phải nhỏ hơn outer */
}

.card-bezel {
  background: rgba(255,255,255,0.45);
  border-radius: var(--shell-radius);
  padding: 4px; /* tạo "border" giữa shell và core */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.7),   /* top highlight */
    0 0 0 1px rgba(0,0,0,0.06),            /* hairline border */
    0 20px 60px rgba(0,0,0,0.12),          /* large diffuse shadow */
    0 4px 12px rgba(0,0,0,0.08);           /* tight shadow */
}
.card-bezel-inner {
  background: linear-gradient(180deg, #FAFAF7 0%, #EFEFEB 100%);
  border-radius: var(--core-radius);
  padding: 28px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.85),
    inset 0 0 0 1px rgba(0,0,0,0.04);
}
```

```html
<div class="card-bezel">
  <div class="card-bezel-inner">
    <!-- content -->
  </div>
</div>
```

**Chỉ dùng cho light themes.** Dark themes dùng `glass` card từ base.css thay thế.

### Adjacent Sibling Border — Pricing tier grid (không border thừa)

Thay vì `border` trên từng tier, dùng outer border + adjacent sibling cho internal dividers:

```css
.pricing-grid {
  display: flex;
  border: 1px solid var(--rim);
  border-radius: 16px;
  overflow: hidden;
}
.pricing-tier + .pricing-tier {
  border-left: 1px solid var(--rim); /* chỉ tier thứ 2 trở đi mới có border trái */
}
/* Featured tier: outer glow ring thay vì duplicate border */
.pricing-tier.featured {
  box-shadow: 0 0 0 2px var(--accent), 0 0 0 4px rgba(var(--accent-rgb), 0.08);
}
/* Featured pill — không tốn DOM node */
.pricing-tier.featured::before {
  content: 'PHỔ BIẾN NHẤT';
  position: absolute;
  top: -12px; left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 3px 10px;
  border-radius: 999px;
}
```

**Billing toggle (monthly/yearly) — CSS-only state:**
```html
<div class="billing-toggle">
  <button class="toggle active" data-period="monthly">Hàng tháng</button>
  <button class="toggle" data-period="yearly">Hàng năm <span class="badge">-20%</span></button>
</div>
```
```css
.toggle { /* base style */ }
.toggle.active { background: var(--accent); color: var(--bg); }
```
```js
document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const period = btn.dataset.period;
    document.querySelectorAll('[data-monthly]').forEach(el => {
      el.textContent = period === 'yearly' ? el.dataset.yearly : el.dataset.monthly;
    });
  });
});
```

### Button-in-Button Pill CTA — Icon animates independently

```html
<button class="btn-pill-icon">
  <span class="btn-text">Bắt đầu ngay</span>
  <span class="btn-icon-wrap" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </span>
</button>
```

```css
.btn-pill-icon {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 14px 24px;
  background: var(--accent);
  color: var(--bg);
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: box-shadow 200ms ease, transform 150ms ease;
}
.btn-icon-wrap {
  width: 36px; height: 36px;
  background: rgba(0,0,0,0.15);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: transform 300ms var(--ease-spring);
}
.btn-pill-icon:hover { box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.35); transform: translateY(-1px); }
.btn-pill-icon:hover .btn-icon-wrap { transform: translateX(3px); }
@media (prefers-reduced-motion: reduce) {
  .btn-pill-icon, .btn-icon-wrap { transition: none; }
}
```

**Khi nào dùng:** Hero primary CTA trên dark themes — visual impact cao nhất. Không dùng cho secondary/ghost buttons.

### Section Separator — Hairline thay background switch

Thay vì đổi background color để phân tách section, dùng hairline + padding lớn:

```css
/* ĐÚng — editorial, nhẹ */
section { border-top: 1px solid var(--rim); padding: 80px 0; }

/* SAI — generic SaaS template look */
section:nth-child(even) { background: var(--surface); }
```

**Quy tắc:** Background chỉ được đổi cho ≤ 2 section "accent moment" trên toàn page (thường là Hero và Final CTA). Tất cả section còn lại: `var(--bg)` + hairline top.

---

## UX Rules — High Priority (từ ui-ux-pro-max-skill)

Rules dưới đây bổ sung cho những gì base.css và patterns chưa enforce. Áp dụng cho mọi page build.

### Layout & Viewport

```css
/* ĐÚNG — dvh thay 100vh cho mobile (browser chrome ăn mất chiều cao) */
.hero { min-height: 100dvh; }

/* SAI — 100vh bị cắt bởi address bar trên iOS/Android */
.hero { min-height: 100vh; }
```

```css
/* Body copy max-width = 65–75ch, không phải full container */
.prose, p, .body-text { max-width: 68ch; }

/* Section container giữ nguyên full-width — chỉ text block bị giới hạn */
```

### Animation Performance

```css
/* ĐÚNG — chỉ animate transform và opacity (GPU-accelerated, no repaint) */
.card:hover { transform: translateY(-4px); opacity: 0.95; }
.reveal      { opacity: 0; transform: translateY(12px); }

/* SAI — animate width/height/top/left triggers layout recalc */
.card:hover { top: -4px; }
.reveal      { height: 0; }
```

**Duration scale:**
| Interaction | Duration |
|-------------|----------|
| Button hover, tooltip | 150ms |
| Card hover lift | 200ms |
| Modal open | 250ms |
| Scroll reveal | 500–600ms |
| Page transitions | 300ms |

Easing: `ease-out` cho entering elements, `ease-in` cho exiting.

**Spring easing — rubber-band feel (Apple-tier):**
```css
:root {
  --ease-spring: cubic-bezier(0.16, 1.16, 0.3, 1); /* overshoot Y > 1 */
  --ease-fast:   cubic-bezier(0.32, 0.72, 0, 1);   /* fast-start, Apple feel */
}

/* Dùng cho: pill nav appear, card expand, button-in-button icon */
.nav-pill { transition: opacity 300ms var(--ease-spring), transform 300ms var(--ease-spring); }
```

**`will-change` — GPU hint cho animated blobs và mesh:**
```css
/* Thêm vào bất kỳ element nào có keyframe animation hoặc continuous transform */
.blob, .ambient-mesh::before, .ambient-mesh::after {
  will-change: transform;
}
/* Sau khi animation xong, nên remove will-change để trả GPU memory */
```

**`@media (prefers-reduced-motion)` — bắt buộc cho mọi animation:**
```css
/* Wrap toàn bộ keyframe animations trong prefers-reduced-motion */
@keyframes blob-drift { /* ... */ }
@keyframes ticker-scroll { /* ... */ }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Rule:** Mọi `@keyframes` animation (blob, ticker, drift, shimmer) đều phải có fallback `prefers-reduced-motion`. Không ngoại lệ — đây là accessibility requirement, không phải optional.

### Z-Index Scale System

Không dùng `z-[9999]` hoặc số tùy tiện. Dùng scale cố định — toàn page nhất quán:

```css
:root {
  --z-base:    0;    /* content thường */
  --z-raised:  10;   /* floating elements: sticky nav, ambient mesh */
  --z-dropdown:20;   /* dropdown menus, tooltips */
  --z-sticky:  30;   /* sticky bars, announcement bar */
  --z-modal:   40;   /* modal overlay + modal content */
  --z-toast:   50;   /* toast notifications — trên cùng */
}
```

```html
<!-- Đúng -->
<div class="ambient-mesh" style="z-index: var(--z-raised)" aria-hidden="true"></div>
<nav id="nav" style="z-index: var(--z-sticky)"></nav>
<div class="modal-overlay" style="z-index: var(--z-modal)"></div>

<!-- Sai -->
<nav style="z-index: 9999"></nav>
<div style="z-index: 100"></div>
```

**Tailwind equivalent** (thêm vào tailwind.config):
```js
extend: {
  zIndex: {
    'raised': '10', 'dropdown': '20', 'sticky': '30', 'modal': '40', 'toast': '50'
  }
}
```

---

### Forms — Mobile Keyboards

Dùng `inputmode` attribute để gọi đúng keyboard trên mobile — quan trọng với UX VN (số điện thoại, email chiếm phần lớn opt-in form):

```html
<input type="text"   inputmode="text"    placeholder="Họ và tên">
<input type="email"  inputmode="email"   placeholder="Email của bạn">
<input type="tel"    inputmode="tel"     placeholder="Số điện thoại (0912...)">
<input type="number" inputmode="numeric" placeholder="Số lượng">
```

**Opt-in form rule:** Tối đa 3 fields để đạt conversion cao nhất. Email-only form convert cao hơn 20–40% so với name+email+phone.

### Font Loading

```html
<!-- Luôn dùng font-display: swap — tránh FOIT (flash invisible text) -->
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;800&display=swap" rel="stylesheet">
```

```css
/* Khai báo fallback font có kích thước tương đương để giảm layout shift */
body {
  font-family: 'Be Vietnam Pro', Arial, sans-serif; /* Arial là fallback gần nhất */
  -webkit-font-smoothing: antialiased;   /* macOS/iOS: subpixel → grayscale AA, chữ sắc hơn */
  text-rendering: optimizeLegibility;   /* kerning + ligature tốt hơn trên tất cả browser */
}
```

**Luôn thêm 2 dòng này vào `body` — không cần điều kiện, không ảnh hưởng layout, chỉ tăng chất lượng render.**

---

## Tuyệt đối không

- Overused fonts: Inter, Roboto, Arial (kể cả Inter Tight dù có trong base.css)
- Purple gradients on white backgrounds
- Viết lại CSS từ đầu thay vì dùng base.css
- Thêm patterns mới ngoài thư viện có sẵn (extend patterns trong page-designer thay vì viết inline)
- Converge về cùng aesthetic giữa các lần build — mỗi page phải có direction riêng
- Animate `width`, `height`, `top`, `left` — dùng `transform` thay thế
- `100vh` cho hero trên mobile — dùng `100dvh`
- Form có > 3 fields trên opt-in page (email-only là default)
- **Em-dash (`—`)** ở bất kỳ vị trí nào trong copy/HTML/headlines/quotes — zero, không "dùng ít thôi" (xem `../references/ai-tells-audit.md` A1)
- **Filler verbs VN** ("đột phá", "tối ưu hóa", "nâng tầm", "khai phá tiềm năng", "chinh phục") làm primary copy — dùng verb cụ thể đo đếm được
- **Generic step labels** ("Bước 1 / Bước 2 / Bước 3" standalone) — dùng verb-noun trực tiếp ("Đăng ký / Học / Áp dụng")
- **Multi-color heading words** — max 1 từ accent trong cùng headline, không 3 màu khác nhau
- **Section numbering eyebrows** ("01 / INDEX", "06 · How it works")
- **Layout repetition** — 1 layout family chỉ xuất hiện 1 lần per page

> **Load `../references/ai-tells-audit.md`** để có đầy đủ banned patterns + VN-specific tells. Audit J trong page-designer Self-Review pull từ file đó.

---

## Design Anti-Patterns — 8 Rules từ Impeccable

Áp dụng cho mọi page build — kiểm tra trước khi output HTML.

| # | Anti-pattern | Rule đúng |
|---|---|---|
| 1 | Gray text thuần `#808080` | Tint gray về phía brand: dark-bold-neon `--subtle #b0aea5` (warm gray) ✓ |
| 2 | Nested cards (card trong card) | Flat hierarchy — dùng border-bottom divider, không wrap container |
| 3 | Gray text trên colored background | Dùng dark `var(--bg)` hoặc white `var(--ink)` trên accent bg — không `var(--subtle)` |
| 4 | Contrast body < 4.5:1 | `--body #e8e6dc` trên `--bg #141413` = ~10:1 ✓ — không dùng màu nhạt hơn |
| 5 | > 3 type sizes trong 1 section | Mỗi section: label + H2 + body = 3 sizes tối đa |
| 6 | Text block không có max-width | Body copy luôn `max-w-2xl` hoặc `max-w-4xl` — không full-width |
| 7 | Border-radius không nhất quán | Dùng `var(--radius-btn)` và `var(--radius-card)` từ theme — không mix 8px/12px/16px tuỳ tiện |
| 8 | Shadow trên mọi element | Shadow = chỉ dùng cho elevated elements (featured card, modal). Flat sections: no shadow |

**Rules bổ sung:**
- Không dùng pure `#000000` hay `#ffffff` — luôn tinted (`--bg #141413`, `--ink #faf9f5`)
- Spacing: multiples of 4px — padding `12, 16, 20, 24, 32, 48, 64, 80, 96px`
- Không dùng `rgba(var(--accent-rgb), 0.xx)` rồi lại hardcode `#B6FF00` ở nơi khác — nhất quán 100% qua CSS vars
