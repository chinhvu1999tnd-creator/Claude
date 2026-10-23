# Trust Navy — Visual Language

## Triết lý

Visuals phải **truyền tải dữ liệu, không trang trí**. Mọi graphic element phải là:
data visualization (chart, table, graph), credential display (logo, badge, seal),
hoặc documentary (document style, signature, timestamp). Không dùng illustration, emoji, hay icon vui vẻ.

---

## Icon Style

| Thuộc tính | Spec |
|-----------|------|
| Style | Thin line only — stroke, không fill. Institutional, precise. |
| Stroke width | 1–1.5px |
| Corner radius | 2–3px tối đa |
| Size chuẩn | 16×16px (inline data), 24×24px (feature), 36×36px (section) |
| Color | `var(--accent)` gold chính, `var(--silver)` cho neutral, `var(--positive)` cho gains, `var(--alert)` cho risks |
| Background | Small rectangle với `rgba(accent, 0.08)` — không dùng circle |

### Icon catalog — institutional, không friendly

| Context | Icon | SVG approach |
|---------|------|-------------|
| Positive return | Up arrow + line | `<path>` trend line + arrow head |
| Negative/risk | Down arrow hoặc X | Diagonal paths |
| Security | Lock / Shield | Outline paths only |
| Track record | Calendar | Rectangle grid |
| Certificate | Document + seal | Rect + circle outline |
| Credential badge | Star outline | `<path>` star stroke |
| Analysis | Bar chart | Vertical rects, varying heights |
| Portfolio | Pie/donut | `<circle>` stroke-dasharray |

---

## Data Visualization Style

**Rule: Charts = primary visual element.** Trust Navy dùng charts để THUYẾT PHỤC thay vì illustration để TRANG TRÍ.

### Line chart (portfolio performance)
```
- Gold line (#c9a84c) trên dark navy bg
- Green shaded area below line (positive returns)
- Y-axis: return percentages (right-aligned text)
- X-axis: time periods (months/quarters)
- Reference line at 0% (white, dashed, opacity 0.3)
- Stroke: 2px, stroke-linecap: round
- No fill inside line — area fill = rgba(positive, 0.15)
```

### Bar chart (comparison)
```
- Gold bars (#c9a84c) cho featured data
- Silver bars (#b8c4d4 opacity 0.4) cho benchmark
- Labels: IBM Plex Mono, 9px
- No rounded corners on bars — sharp rect
```

### Data table (metrics panel)
```
- Alternating row bg: --raised và transparent
- Gold accent on featured row (border-left: 2px solid --accent)
- Mono font cho tất cả numbers
- Positive = --positive green, Negative = --alert red
```

### Donut chart (allocation)
```
- SVG stroke-dasharray technique
- Segments: gold (primary), silver (secondary), faint (other)
- Center text: % với IBM Plex Mono
- No legend icons — text labels only
```

---

## Photo Treatment

| Context | Treatment |
|---------|-----------|
| Instructor photo | Grayscale (`filter:grayscale(30%)`) + `border:1px solid var(--faint)` + `border-radius:6px` |
| Testimonial avatar | Square (không phải circle), initials in gold, `border-radius:4px` |
| Screenshot/document | Dark overlay `rgba(15,24,41,0.3)` + gold border top `2px solid var(--accent)` |
| Background photo | Heavy overlay — chữ luôn phải readable |

**Không dùng:**
- Circular avatar cắt ảnh (quá casual)
- Bright filters
- Drop shadows màu

---

## Illustration Policy

**Trust Navy không dùng illustration thuần túy.**

Thay vào đó, dùng:
- **Data charts** (SVG line/bar/donut)
- **Document mockup** (contract, report PDF frame)
- **Dashboard/terminal style** (numbers, tables, metrics)
- **Credential display** (certificate frame, badge array)

---

## Pattern files có visual

| Pattern file | Visual element |
|-------------|---------------|
| `hero.html` | Performance metrics panel (table data) + sparkline SVG mini chart |
| `stats-bar.html` | Data panel với positive/negative coloring (đã có) |
| `portfolio-chart.html` | Full SVG line chart — portfolio performance over time |
| `testimonials.html` | Case study rows với metric columns (đã có) |
| `trust-signals.html` | Credential badges + media logos (đã có) |
| `pricing-card.html` | Comparison table (đã có) |
