---
version: "1.0.0"
name: "Signal"
mood: "Stark · Editorial · Precise"
best_for: "AI tools, automation, SaaS — khi cần nổi bật hoàn toàn khác dark-bold-neon"
generated_from: "theme-generator · Creative Mode · 2026-05-13"
brand_color: "#B6FF00"
avoid_for: "Healthcare, luxury, warm personal brand"
---

# Signal — Design Reference

Cùng brand color `#B6FF00` với dark-bold-neon nhưng hoàn toàn khác về aesthetic:
- dark-bold-neon: neon glow, blobs, rounded, tech startup
- signal: stark editorial, condensed type, sharp lines, industrial magazine

---

## Color System

```css
:root {
  --accent:      #B6FF00;  --accent-rgb:  182,255,0;
  --red:         #FF3040;  --red-rgb:     255,48,64;
  --bg:          #090908;  /* near-pure-black, barely warm */
  --bg-rgb:      9,9,8;
  --surface:     #111110;
  --raised:      #1A1A18;
  --ink:         #F5F5EE;
  --body:        #C2C2B8;
  --subtle:      #787870;
  --faint:       #2A2A28;
  --rim:         rgba(255,255,255,0.05);
  --rim-strong:  rgba(255,255,255,0.10);
  --accent-dim:  rgba(182,255,0,0.07);
  --accent-line: rgba(182,255,0,0.30);  /* thin line color */
}
```

### Color Usage Rules
- **Accent (#B6FF00):** Thin 1px lines, key numbers, CTA buttons, section accents — KHÔNG dùng glow
- **Ink (#F5F5EE):** Tất cả headings — không dùng gradient text (quá dark-bold-neon)
- **Body (#C2C2B8):** Paragraph text
- **Subtle (#787870):** Labels, meta, mono data
- **Red (#FF3040):** Urgency, problem indicators ONLY
- **NO gradients** trên text — chỉ solid colors
- **NO blobs** — editorial, không organic

---

## Typography — Signature của theme này

```
Display: Barlow Condensed 800 (condensed, uppercase cho headlines lớn)
Body:    Source Serif 4 400/300 (serif body — tạo tension với condensed display)
Mono:    JetBrains Mono 500 (data, prices, labels)
```

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Rules
- **Barlow Condensed 800** — hero H1, section H2 (uppercase, letter-spacing -0.02em)
- **Barlow Condensed 600** — H3, card titles, nav items
- **Barlow Condensed italic** — editorial moments, subheadlines
- **Source Serif 4 400** — body paragraphs (unexpected serif = editorial feel)
- **Source Serif 4 300 italic** — sub-headlines, pull quotes
- **JetBrains Mono 500** — section labels, prices, metrics, codes
- **NO** Inter, Roboto, Plus Jakarta Sans

### Scale
| Token | Size | Font | Use |
|-------|------|------|-----|
| display | clamp(3.5rem, 8vw, 7rem) | Barlow Condensed 800 | Hero H1 |
| h2 | clamp(2rem, 4.5vw, 3.5rem) | Barlow Condensed 800 | Section heading |
| h3 | clamp(1.25rem, 2vw, 1.75rem) | Barlow Condensed 600 | Card title |
| body | 1rem / 1.05rem | Source Serif 4 400 | Paragraph |
| label | 0.7rem | JetBrains Mono 500 | Uppercase labels |

---

## Visual Language — Không phải dark-bold-neon

### Decorations ALLOWED
- **Thin 1px accent lines** — horizontal/vertical dividers, border-left accents
- **Oversized background numbers** — "01", "02" mờ phía sau section heading
- **Hard rectangular borders** — `border: 1px solid var(--faint)` hoặc `border: 1px solid var(--accent-line)`
- **Uppercase mono labels** — section eyebrows luôn uppercase + letter-spacing
- **SVG icons** — stroke only, 1.5-2px, không fill

### Decorations FORBIDDEN (quá dark-bold-neon)
- Blobs (`.blob`, `.blob-accent`, `.blob-cyan`)
- Neon glow (`.btn-glow`, `text-shadow`, `box-shadow` neon)
- Shimmer border (`.shimmer-border`)
- Animated scan lines (`.scan-line`)
- Gradient text (`.text-gradient`)
- Rounded pills/badges (dùng sharp rectangular thay)
- Grid overlay backgrounds (quá dark-bold-neon)

### Border Radius
- **Buttons:** 3px — sharp, không 6px hay 10px
- **Cards:** 4px — minimal radius
- **Labels/badges:** 2px hoặc 0px — rectangular
- **Input:** 4px

### Shadows
- **Cards:** `0 1px 8px rgba(0,0,0,0.5)` — không warm glow
- **Buttons:** `none` hover → `inset 0 0 0 1px var(--accent)` — outline, không glow
- **Featured card:** `0 0 0 1px var(--accent-line)` — chỉ outline

---

## Background System — Stark, không stacked gradients

| Section type | Background |
|---|---|
| Hero | `var(--bg)` + oversized number bg decoration |
| Stats | `var(--surface)` + thin top/bottom border |
| Problem/Tension | `var(--bg)` — flat, stark |
| Solution/Shift | `var(--surface)` + left accent border on section |
| Agents/Features | `var(--bg)` — flat, numbered list layout |
| Pricing | `var(--surface)` — two-column |
| Guarantee | `var(--bg)` |
| FAQ | `var(--surface)` |
| CTA | `var(--accent)` solid — hard, không blobs |
| Footer | `var(--bg)` |

**Rule:** KHÔNG stacked backgrounds. Mỗi section chỉ dùng flat base color. Decoration = thin lines và oversized numbers.

---

## Layout Principles (Creative Mode — không dùng pattern layout)

- **Left-aligned text** — không centered (trừ pricing card và CTA)
- **Asymmetric columns** — không symmetrical grid
- **Oversized counter** — số thứ tự section hiển thị lớn, mờ
- **Hard edges** — sections phân cách bằng 1px border, không gradient fade
- **Typography as decoration** — H1 đủ lớn để là visual element, không cần thêm decoration
- **Compressed whitespace** — editorial không có padding 96px mỗi chiều; 64-72px vertical

---

## Motion — Minimal (editorial restraint)

| Element | Animation |
|---|---|
| Section reveal | `.reveal` + `.on` — staggered fade-up |
| Card hover | `transform: translateY(-2px)` — subtle lift |
| CTA button hover | `filter: brightness(1.1)` — không glow |
| Section numbers | Static — không animate |

**Tuyệt đối không:** blobs, shimmer, glow, scan-line — tất cả off-limits.

---

## Section Rhythm — 4-Phase Arc

| Phase | Sections | Background | Note |
|-------|---------|------------|------|
| HOOK | Hero + Stats | `--bg` flat / `--surface` thin border | Oversized typography dominates |
| TENSION | Problem | `--bg` flat | Harsh, không decoration |
| SHIFT | Solution + Agents + How-it-works | `--surface` / `--bg` alternating | Numbered layout |
| DESIRE | Pricing + Guarantee + FAQ + CTA | `--surface` / `--bg` / `--accent` | CTA = accent solid |
