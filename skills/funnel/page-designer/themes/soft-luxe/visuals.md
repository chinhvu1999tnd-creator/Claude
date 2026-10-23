# Soft Luxe — Visual System Reference

This file documents all visual asset types, illustration slots, photography direction, and decorative element specs for the Soft Luxe theme.

---

## Photography Direction

### Beauty Product Photography
**Slot spec:** `aspect-ratio: 2/3` (portrait hero), `1/1` (product grid), `4/3` (lifestyle)

**Art direction:**
- Background: pure white (#ffffff) or cream (#fdf8f5)
- Lighting: soft diffused natural light, warm golden-hour tones preferred
- Surfaces: marble (white/beige), natural linen, dried botanicals as props
- Negative space: generous — at least 30% of frame is clean background
- Suggested CSS filter: `filter: sepia(0.05) saturate(1.1) brightness(1.02)`

**Shot types by placement:**
| Placement         | Shot type                  | Ratio  |
|-------------------|----------------------------|--------|
| Hero right column | Product + botanical props  | 2:3    |
| Product grid      | Flat lay or 45° angle      | 1:1    |
| Lifestyle banner  | Model applying product     | 16:9   |
| Ingredient section| Close-up ingredient raw    | 1:1    |
| Before/After panel| Face close-up (cropped)    | 3:4    |

---

## Before / After Skin Panels

**Layout:** Side-by-side with a thin `--faint` vertical divider and a centered label badge.

**Before panel:**
- Slight desaturation: `filter: saturate(0.7) brightness(0.95)`
- Label badge: "Trước" — Lato 12px, `--subtle`, pill bg `--faint`

**After panel:**
- Warm glow: `filter: sepia(0.05) saturate(1.15) brightness(1.05)`
- Label badge: "Sau" — Lato 12px, `--accent`, pill bg blush 20%

**Result metric:** Below the pair, Playfair italic "Da sáng hơn 40% sau 4 tuần", color `--accent`

**Skin condition badge (top-left of card):**
- Pill shape, bg `--surface`, border 1px `--faint`
- Lato 11px, `--subtle`
- Values: "Da mụn", "Da khô", "Da lão hóa", "Da thâm nám"

---

## Skincare Ingredient Illustrations

**Style:** Botanical line art — single-stroke outlines, warm stroke color `#c9956a` at 40–60% opacity, no fills, very clean and minimal.

### Rose — Rosa Damascena
```svg
<!-- Simplified 5-petal rose with leaves, stroke only -->
<!-- Stroke: #c9956a, stroke-width: 1.5, no fill -->
<!-- Size: 80×80px viewBox -->
```
- Petal shape: rounded teardrop, 5 petals arranged radially
- Center: small circle with radiating stamens
- Leaves: 2 small oval leaves on stem

### Aloe Vera
```svg
<!-- Succulent spear leaves, pointing upward, slight droop at tips -->
<!-- 3 main leaves visible, interior texture dots optional -->
```

### Pearl / Nacre
```svg
<!-- Circle with subtle concentric rings, small radial gleam marks -->
<!-- 4 short lines at 45° angles around the circle -->
```

### Lavender
```svg
<!-- Straight stem with 6–8 small oval buds clustered at top -->
<!-- 2 leaf pairs along stem -->
```

### Centella Asiatica (Rau má)
```svg
<!-- Round penny-wort leaves, 3–4 leaves on delicate stems -->
<!-- Kidney-shaped leaf outline, radiating leaf veins -->
```

### Hyaluronic Acid (abstract)
```svg
<!-- Water droplet shape with inner highlight sparkle -->
<!-- Or: abstract molecule — 3 hexagons connected, minimal -->
```

### Niacinamide (abstract)
```svg
<!-- Geometric crystal / prism shape, clean angular outline -->
<!-- 6-sided polygon with inner parallel lines -->
```

### Ceramide
```svg
<!-- Lipid bilayer: two parallel curved lines with bridge marks -->
<!-- Represents the skin barrier — scientific but elegant -->
```

---

## Texture Swatches

Used in product cards or ingredient sections to show formula texture.

**Types:**
- Cream / Lotion: smooth blob with subtle wave edge
- Serum: thin droplet, elongated teardrop
- Oil: small circle with slight surface shimmer marks
- Gel: slightly faceted blob, semi-translucent look via low-opacity stroke

**CSS for texture swatch slot:**
```css
.texture-swatch {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--blush), var(--faint));
  box-shadow: inset 0 2px 8px rgba(44,34,24,0.06);
}
```

---

## Ingredient Provenance Map

**Purpose:** Visual trust builder showing where key ingredients are sourced.

**Design:**
- Minimal world map outline, stroke `--faint`, fill `--surface`
- Pin markers at source locations: circle `--accent` 8px, with Playfair italic label
- Connecting dotted lines between pins (optional, `--blush` dashed)
- Caption below: Lato 13px `--subtle` "Nguyên liệu thuần nhiên từ khắp thế giới"

**Typical source points:**
- Turkey (Rose) → Bulgaria (Rose backup) → Japan (Pearl) → India (Aloe, Centella) → France (Lavender) → Korea (Hyaluronic Acid, Niacinamide)

---

## Decorative Botanical SVG Elements

### Petal Cluster (Corner decoration)
```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 5 petals around center, each a rotated ellipse -->
  <!-- stroke: #f0c8b8, stroke-width: 1.2, opacity: 0.5 -->
  <!-- Center circle: stroke #c9956a, r=6 -->
</svg>
```
- Placement: `position: absolute`, corner, `pointer-events: none`
- Typical opacity: 0.35–0.5
- Use at top-right of hero, bottom-left of CTA sections

### Leaf Branch (Divider / side decoration)
```svg
<svg width="80" height="40" viewBox="0 0 80 40" fill="none">
  <!-- Single curved stem with 4 alternate small oval leaves -->
  <!-- stroke: #e8d5cc, stroke-width: 1, fill: none -->
</svg>
```
- Used horizontally as section dividers
- Or rotated 90° as side accent on cards

### Dot Field (Background texture)
```svg
<!-- Grid of 16px-spaced dots, circle r=1.5 -->
<!-- fill: #f0c8b8, opacity: 0.4 -->
<!-- Placed as absolute background layer in sections -->
```

### Small Rose Bud (Label / badge decoration)
- 12×12px inline SVG before ingredient names
- Single petal whorl, stroke `--accent`, no fill

---

## Product Illustrations (Line Art)

For use when photography is unavailable or as stylized product slots.

### Serum Bottle
- Tall dropper bottle shape (narrow cylinder, slightly wider base)
- Dropper pipette at top with bulb
- Stroke: `--accent`, stroke-width: 1.5
- Interior: light fill `rgba(201,149,106,0.08)`
- Label panel: `--blush` fill, can contain brand initial

### Moisturizer Jar
- Wide squat cylinder with flat lid
- Slight perspective (top ellipse visible)
- Stroke: `--mauve`, stroke-width: 1.5
- Lid edge: thin line, `--accent`

### Eye Cream Tube
- Slim squeeze tube, tapered at bottom
- Cap at top: rounded cylinder
- Stroke: `--accent`, stroke-width: 1.5

### Facial Mist / Spray
- Pump spray bottle, tall oval body
- Pump nozzle at top
- Fine mist arc: dashed strokes emanating from nozzle

---

## Photo Slot Components (HTML/CSS)

### Standard Product Photo Slot
```html
<div class="photo-slot product-slot">
  <div class="photo-slot__placeholder">
    <!-- Replace with <img> tag -->
    <span class="photo-slot__label">Ảnh sản phẩm</span>
  </div>
</div>
```

```css
.photo-slot {
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 24px rgba(44,34,24,0.08);
}
.photo-slot__placeholder {
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, var(--surface) 0%, var(--faint) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.05) saturate(1.1) brightness(1.02);
}
```

### Lifestyle Photo Slot
```css
.photo-slot--lifestyle {
  aspect-ratio: 16/9;
  border-radius: 20px;
}
.photo-slot--lifestyle img {
  filter: sepia(0.08) saturate(1.15) brightness(1.01) contrast(0.98);
}
```

---

## Animation Specs

### Float (Product images, badge cards)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
/* Duration: 6s ease-in-out infinite */
/* Stagger: delay 0s / 1.5s / 3s for multiple elements */
```

### Fade Up (Section content reveal)
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Triggered by IntersectionObserver */
/* Duration: 0.7s ease, stagger 0.1s per child */
```

### Petal Rotate (Subtle corner decoration)
```css
@keyframes petalSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Duration: 20s linear infinite — imperceptibly slow */
```
