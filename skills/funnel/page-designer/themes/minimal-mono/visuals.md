# Minimal Mono — Visual Language

## Core Visual Principle

In minimal-mono, **photography and typography ARE the visuals**. There are no illustrations with color, no decorative icons, no gradients. The absence of color forces the eye to read form, composition, and contrast.

---

## Photography

### Style
- **Black and white only** — enforce with CSS `filter: grayscale(100%) contrast(1.1)`
- High contrast: strong blacks, clean whites, minimal midtone muddiness
- Subject matters: fashion (clothing, silhouettes, editorial poses), architecture (geometric buildings, sharp lines), portraiture (direct gaze, sharp focus), still life (objects with clean forms)

### Composition Rules
- Portrait orientation preferred for hero and editorial slots (3:4 or 2:3 ratio)
- Subjects should have clean negative space — no busy backgrounds
- Close crops are acceptable — let the subject bleed off frame edges
- Avoid stock photo "business handshake" or "smiling team" aesthetics

### CSS Implementation
```css
/* Standard image treatment */
img, .media-slot {
  filter: grayscale(100%) contrast(1.1);
  object-fit: cover;
  object-position: center top; /* favor top for portraits */
}

/* High drama version for hero */
.hero-image {
  filter: grayscale(100%) contrast(1.2) brightness(0.95);
}
```

### Placeholder Treatment
When no real photo is available, use structured grey rectangles:
```html
<div style="background:#e0e0e0; width:100%; height:100%; position:relative;">
  <!-- Optional: thin grid lines overlay for editorial texture -->
  <div style="position:absolute; inset:0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 39px, #ccc 39px, #ccc 40px
    ), repeating-linear-gradient(
      90deg, transparent, transparent 39px, #ccc 39px, #ccc 40px
    );">
  </div>
</div>
```

---

## SVG Visuals

### Allowed: Fashion Editorial SVG
Thin linework only — `stroke:#111111`, `fill:none`, `stroke-width:1–1.5px`.

**Approved subjects:**
- Female/male silhouette outlines (fashion illustration style — elongated, stylized)
- Clothing flat sketches (shirt, jacket collar, drape lines)
- Gesture drawings — single continuous line style
- Abstract geometric compositions (intersecting lines, circles, rectangles — no fill)

**Forbidden in SVG:**
- Color fills
- Gradient strokes
- Drop shadows / filters
- Clip art or decorative cartoons
- Icons (use text labels instead)

### Sample Fashion Silhouette SVG
```svg
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#111" stroke-width="1">
  <!-- Simplified figure outline -->
  <ellipse cx="100" cy="50" rx="30" ry="35"/>
  <path d="M70 85 Q60 120 50 200 Q70 195 100 200 Q130 195 150 200 Q140 120 130 85"/>
  <path d="M50 200 Q40 280 45 380"/>
  <path d="M150 200 Q160 280 155 380"/>
  <path d="M70 100 Q40 140 30 180"/>
  <path d="M130 100 Q160 140 170 180"/>
</svg>
```

---

## Typographic Visuals

Typography used as decoration — not informational, but visual.

### Oversized Background Letters
```html
<!-- Section with giant letter as background texture -->
<div style="position:relative; overflow:hidden;">
  <span style="
    position:absolute; top:-0.2em; left:-0.05em;
    font-family:'Space Grotesk', sans-serif;
    font-weight:700;
    font-size:20rem;
    line-height:1;
    color:#f0f0f0;
    pointer-events:none;
    user-select:none;
    z-index:0;
  ">A</span>
  <div style="position:relative; z-index:1;">
    <!-- actual content here -->
  </div>
</div>
```

### Stacked Word Display (Hero treatment)
```html
<h1 style="
  font-family:'Space Grotesk',sans-serif;
  font-weight:700;
  font-size:clamp(3.5rem, 10vw, 8rem);
  line-height:0.9;
  letter-spacing:-0.04em;
  color:#111;
">
  <span style="display:block;">Build</span>
  <span style="display:block;">Your</span>
  <span style="display:block;">Brand</span>
</h1>
```

### Running Text as Marquee (Announcement / divider)
```html
<div style="overflow:hidden; white-space:nowrap; border-top:1px solid #111; border-bottom:1px solid #111; padding:0.5rem 0;">
  <span style="font-family:'Space Mono',monospace; font-size:0.75rem; letter-spacing:0.2em; color:#111; text-transform:uppercase;">
    NEW COLLECTION &nbsp;&mdash;&nbsp; SS25 &nbsp;&mdash;&nbsp; AVAILABLE NOW &nbsp;&mdash;&nbsp; WORLDWIDE SHIPPING &nbsp;&nbsp;&nbsp;&nbsp;
    NEW COLLECTION &nbsp;&mdash;&nbsp; SS25 &nbsp;&mdash;&nbsp; AVAILABLE NOW &nbsp;&mdash;&nbsp; WORLDWIDE SHIPPING
  </span>
</div>
```

---

## Grid Lines as Visual Elements

In editorial design, the grid itself is visible and intentional.

### Vertical Rule Sidebar
```html
<div style="border-left:1px solid #111; padding-left:2rem;">
  <!-- side content -->
</div>
```

### Horizontal Rule Separator
```html
<hr style="border:none; border-top:1px solid #111; margin:0;">
```

### Grid Overlay for Media Placeholders
Use the repeating-linear-gradient technique above on grey rectangles.

### Section Number (Editorial index)
```html
<span style="
  font-family:'Space Mono',monospace;
  font-size:0.7rem;
  letter-spacing:0.2em;
  color:#999;
  text-transform:uppercase;
">01 — SERVICES</span>
```

---

## What NOT to Use

| Forbidden | Reason |
|-----------|--------|
| Color photography | Breaks monochrome aesthetic |
| Color illustrations | Contradicts no-color policy |
| Emoji in UI | Adds color + informal tone |
| Lottie / motion graphics | Excessive for this editorial style |
| Icon libraries (Heroicons, FontAwesome) | Use text labels or typographic markers instead |
| Background images with texture | Distracts from typographic focus |
| Gradient overlays on photos | Defeats the purpose of grayscale treatment |
| Stock-style "business" imagery | Wrong brand tone |
