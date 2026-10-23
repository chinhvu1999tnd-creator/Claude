# Dalatation — Visual Language

## Triết lý
Mọi visual phải gợi lên cảm giác **được ở trong rừng thông Đà Lạt** — sương mù buổi sáng, tiếng lửa trại, mùi gỗ thông, ánh nắng xuyên tán cây. Không có gì corporate, không có gì đô thị.

---

## Icon Style — Organic Nature Line Art

| Thuộc tính | Spec |
|-----------|------|
| Style | Organic stroke — không hoàn hảo, có độ "handmade" |
| Stroke width | 1.5–2px, stroke-linecap:round |
| Fill | Wash rất nhạt (opacity 0.12) + stroke đậm hơn |
| Color | `var(--accent)` pine green chính, `var(--amber)` cho warmth elements |
| Size | 20×20 (card), 36×36 (section), 56×56 (hero) |

### Icon catalog — nature/cabin

| Element | Motif | SVG approach |
|---------|-------|-------------|
| Pine tree | Triangle + trunk | Stacked triangles, organic edges |
| Campfire | Flame paths | 3 overlapping organic curves |
| Mountain | Ridge line | Single smooth path |
| Fog/mist | Wave forms | Horizontal organic waves |
| Log cabin | Simple house | Rectangle + triangle roof + window |
| Moon/stars | Night sky | Circle + small star paths |
| Hiking | Boot/trail | Simple silhouette |
| Bird | Simple wing | Curved V shape |
| Coffee/mug | Mug + steam | Rectangle + steam curls |
| Thermometer | Cold indicator | Line + bulb |

---

## SVG Decorations — Signature Elements

### Pine branch corner decoration
```svg
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.3">
  <path d="M10 70L40 20" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M40 20L20 35" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M40 20L55 30" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M30 40L15 50" stroke="var(--accent)" stroke-width="1" stroke-linecap="round"/>
  <path d="M30 40L45 48" stroke="var(--accent)" stroke-width="1" stroke-linecap="round"/>
</svg>
```

### Mountain silhouette (hero bg)
```svg
<svg viewBox="0 0 800 300" fill="none">
  <path d="M0 300L150 120L280 200L400 80L520 180L650 100L800 200L800 300Z"
        fill="rgba(77,124,90,0.08)"/>
  <path d="M0 300L200 150L350 220L500 100L650 160L800 250L800 300Z"
        fill="rgba(77,124,90,0.05)"/>
</svg>
```

### Campfire glow (CTA area)
```html
<div class="absolute bottom-0 inset-x-0 pointer-events-none"
     style="height:200px;background:radial-gradient(ellipse 60% 100% at 50% 100%,rgba(200,132,42,0.20) 0%,transparent 70%)"></div>
```

### Pine trees silhouette strip
```svg
<!-- Row of pine trees as section divider -->
<svg viewBox="0 0 400 60" fill="none">
  <path d="M20 60L30 40L40 60Z" fill="var(--accent)" opacity="0.2"/>
  <path d="M25 48L35 28L45 48Z" fill="var(--accent)" opacity="0.25"/>
  <!-- repeat... -->
</svg>
```

---

## Photography Treatment

| Context | Treatment |
|---------|-----------|
| Cabin exterior | `filter: saturate(1.1) sepia(0.08) brightness(0.88)` — deeper, moodier |
| Interior room | `filter: saturate(1.05) warmth(+10%) brightness(0.92)` — cozy warm |
| Landscape/forest | `filter: saturate(1.2) sepia(0.05) brightness(0.85)` — lush, dramatic |
| Food/coffee | `filter: saturate(1.15) sepia(0.12) brightness(0.95)` — warm appetizing |
| People/guests | Natural — không filter nặng |

**Media slot styling:**
```css
border-radius: 16px;
overflow: hidden;
box-shadow: 0 8px 32px rgba(0,0,0,0.40);
```

---

## Campfire Animation (cho CTA / highlight)

```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  25%  { opacity: 0.85; }
  50%  { opacity: 0.95; }
  75%  { opacity: 0.80; }
}
.campfire-glow {
  animation: flicker 3s ease-in-out infinite;
  background: radial-gradient(circle, rgba(200,132,42,0.3), transparent 70%);
}
```

---

## Pattern files có visual

| Pattern | Visual element |
|---------|---------------|
| `hero.html` | Mountain SVG bg + fog overlay + pine branch corners + full-bleed cabin image slot |
| `room-showcase.html` | Room photo slot (16:9) + amenity tag list + amber price badge |
| `experience-grid.html` | 4 experience cards với nature icons: hiking, campfire, photography, cycling |
| `testimonials.html` | Season badge (Mùa hè/Đông) + stay duration + guest avatar initials |
| `cta-strip.html` | Campfire glow + pine tree silhouette strip + amber bg |
| `stats-bar.html` | Pine/amber number colors trên dark raised cards |
