# Prestige Dark — Visual Language

## Core Principle

This theme is built on **restraint and precision**. Every visual element must serve a purpose. Nothing is decorative for its own sake. When in doubt, remove it.

---

## Photography

### Philosophy
Photography is the primary visual hero of this theme. Images carry emotion — the typography and layout simply frame them. Never compete with photography using decorative overlays or graphic elements.

### Full-Bleed Slots
Every image container is full-bleed:
```css
/* Standard media slot */
.media-slot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;          /* no inline gap */
  border-radius: 0;        /* never rounded */
}
```

### Overlay Rules
If text must sit on a photo, use a dark overlay — never a colored one:
```css
/* Text-over-photo overlay */
.photo-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(12,12,10,0.72) 0%,
    rgba(12,12,10,0.20) 60%,
    transparent 100%
  );
}
```
Max overlay opacity: 0.72 on text side, 0 on media side.

### Photography Context for AI Generation
When instructing AI image generation for this theme use these style tags:
- **Architecture:** "architectural photography, dramatic lighting, moody dark tones, sharp geometry, luxury residential"
- **Interiors:** "interior design photography, dramatic shadows, warm tungsten accents, marble, high-end finishes, minimalist luxury"
- **Lifestyle:** "editorial lifestyle photography, desaturated warm tones, shallow depth of field, aspirational but understated"
- **Cityscape:** "aerial urban photography, dusk or night, city lights, dramatic contrast, luxury residential tower"

### No Placeholder SVGs with Color
Never use bright or pastel SVG placeholders. Dark-surface architectural SVG placeholders are permitted (see Architectural Drawings section below).

---

## Architectural Drawings as Visual Elements

This is the signature visual language when photography is unavailable. Use clean line art at `stroke` only — no fills.

### Style Rules
- Stroke color: `rgba(201,168,76,0.5)` for primary structure lines
- Stroke color: `rgba(201,168,76,0.2)` for secondary/detail lines
- Stroke width: 0.8–1.2px (never thicker than 1.5px)
- No fills, no gradients inside shapes
- Background: always transparent or `var(--raised)` / `var(--surface)`
- Style: isometric floor plans, building elevations, facade cross-sections

### Floor Plan as Visual
A floor plan outline is a powerful visual element in luxury real estate context:
- Show unit boundaries with thin gold stroke
- Label rooms in `DM Mono` at ~9px, color `--subtle`
- Mark dimensions (m²) in `DM Mono` gold
- Compass rose: simple 4-point, stroke only, `--subtle` color
- North arrow: simple line with arrowhead, `--silver`

### Building Elevation
Facade elevation outlines work as hero backgrounds:
- Thin horizontal lines for floors/windows
- Vertical lines for structural columns
- Roofline detail: sharp and clean
- Opacity: 0.3–0.5 when used as background decoration

---

## Iconography

### Style
- **Stroke only** — no fills, no solid icons
- Stroke width: **1.2px** (uniform, never varies within a set)
- Color: `var(--silver)` for standard icons, `var(--accent)` for featured/active icons
- Size: 24×24px default, 20×20px in dense layouts

### Permitted Icon Categories
- Architecture: building, key, door, elevator, floor-plan
- Amenities: pool, gym weights, concierge bell, shield lock, tree/garden, parking/car
- UI: arrow-right (→), external link, chevron-down
- Contact: phone, email, location pin (outline)

### Prohibited Icon Styles
- No filled/solid icons
- No colorful icons
- No icons with drop shadows
- No emojis as functional icons
- No illustration-style icons (cartoonish, organic)

### SVG Template
```svg
<!-- Standard thin-line icon: 24x24, stroke 1.2px -->
<svg width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor"
     stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
  <!-- icon paths -->
</svg>
```

---

## Data Visualization

### Principle
Numbers tell the story. Visualizations, if used, are subordinate to the number itself.

### Permitted
- **Simple horizontal bars** — single-color (`--accent`), no labels on the bar itself, percentage shown in `DM Mono` beside the bar
- **Single-value stats** — large Cormorant Garamond number, small Jost label below
- **Progress indicators** — thin line (1px), gold fill up to percentage, faint remainder

### Prohibited
- Pie/donut charts
- Multi-color charts
- 3D charts of any kind
- Animated chart libraries (Chart.js, D3 motion) — static only
- Gradient fills on bars

### Bar Chart Template
```html
<div class="stat-bar" style="display:flex; align-items:center; gap:16px;">
  <div style="flex:1; height:1px; background:var(--faint); position:relative;">
    <div style="position:absolute; left:0; top:0; height:100%;
                width:78%; background:var(--accent);"></div>
  </div>
  <span style="font-family:'DM Mono'; font-size:13px; color:var(--accent);
               white-space:nowrap;">78%</span>
</div>
```

---

## Location Map

### Style
SVG grid-based map placeholder — no external map libraries in static pages.

### Construction
- Background: `var(--raised)`
- Grid lines: 1px, `var(--faint)` — represent city blocks
- Roads: slightly wider lines, `rgba(201,168,76,0.15)` for main roads
- Location pin: thin stroke SVG pin in gold, centered
- Radius rings: 1px dashed circles, `var(--faint)`, 500m / 1km / 2km
- Labels: `DM Mono`, 9px, `--subtle`

---

## Motion & Animation

### Permitted
- **Scroll reveal (fade-up):** `opacity 0→1`, `translateY 24px→0`, duration 700ms, easing `cubic-bezier(0.16,1,0.3,1)`. Trigger once via `IntersectionObserver`.
- **Hover states:** `opacity` and `border-color` transitions, 350ms. Never scale or translate on hover.
- **Accordion open/close:** `max-height` transition, 350ms ease.

### Prohibited
- No parallax effects
- No autoplay carousels or sliders
- No looping animations except the `live-pulse` on availability indicators
- No page transition animations
- No scroll-triggered scale or rotation
- No particle effects
- No video backgrounds

---

## Layout Principles

### Grid
- Container: max-width 1280px, centered, padding 0 24px (mobile) / 0 48px (desktop)
- Section columns: 2-col splits at 50/50 or 60/40 (media heavier)
- Stats: 4-col inline, separated by vertical 1px gold lines
- Cards: 3-col grid (property showcase), 2-col (feature pairs), never 4+ col on cards

### Negative Space
- Whitespace is a design element. Sections must breathe.
- Never let content feel compressed or grid-locked.
- Prefer taller sections with sparser content over dense packing.

### Alignment
- Text always left-aligned within its column
- Section-level centering only for single-line labels (eyebrow text, guarantee)
- Numbers in stat bar: left-aligned within their cell
