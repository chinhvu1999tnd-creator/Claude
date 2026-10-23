# Warm Earth — Visual Language

## Triết lý
Visuals phải trông như **làm bằng tay, không phải máy tính**. Organic, imperfect, warm.
Mỗi icon/illustration gợi liên tưởng đến: đất, cây, thủ công, chợ địa phương, gia đình.

---

## Icon Style — Organic Line Art

| Thuộc tính | Spec |
|-----------|------|
| Style | Organic stroke — đường không hoàn toàn thẳng, có chút "wobble" |
| Stroke width | 1.8–2.2px — dày hơn flat icons thông thường |
| Corner | Không dùng sharp corner — stroke-linecap:round, stroke-linejoin:round |
| Fill | Wash màu nhạt (opacity 0.12–0.2) + stroke đậm hơn |
| Size | 24×24px (card), 40×40px (section), 64×64px (hero badge) |
| Color | `var(--accent)` terracotta chính, `var(--green)` cho nature/fresh |

### Icon catalog

| Context | Motif | Gợi ý SVG |
|---------|-------|-----------|
| Natural / organic | Leaf / sprout | Organic curve paths |
| Food / ingredient | Jar / bowl / basket | Simple container shapes |
| Quality | Stamp / seal | Circle + text arc |
| Local | Map pin / house | Simple outline |
| Handmade | Needle / scissors | Craft tools |
| Fresh | Sun / drop | Organic radiating lines |
| Guarantee | Ribbon / badge | Circular seal |
| Community | Hands / people | Simple figure paths |

---

## Illustration Style

**Watercolor wash + line art** — không phải flat vector, không phải 3D.

### Hero visual
- Product photography slot (real photo của sản phẩm/nông sản)
- Nếu không có photo: watercolor-style SVG illustration (bowl of ingredients, farm scene, craft items)
- Floating badges: handmade label style với dashed border, script font

### Background decorative
- Organic blob shapes (không phải perfect circle/ellipse)
- Leaf/branch SVG scattered decoration
- Subtle grain texture overlay

---

## Photo Treatment

| Context | Treatment |
|---------|-----------|
| Product photo | Warm filter effect via CSS `filter: saturate(1.1) sepia(0.08)` + `border-radius:16px` |
| Farmer/maker portrait | Rounded card `border-radius:12px`, warm shadow |
| Food/ingredient | Full-bleed với rounded bottom `border-radius:0 0 20px 20px` |
| Before/after | Side-by-side, organic divider |

**Không dùng:**
- Grayscale
- Hard drop shadow
- Perfect circle crop (quá corporate)

---

## Texture Layer Recipe

```html
<!-- Paper grain overlay — thêm vào bất kỳ section nào -->
<div class="absolute inset-0 pointer-events-none opacity-[0.035]"
     style="background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/><feColorMatrix type=%22saturate%22 values=%220%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>');background-size:200px 200px"></div>

<!-- Diagonal linen — dùng trên surface sections -->
<div class="absolute inset-0 pointer-events-none"
     style="background-image:repeating-linear-gradient(45deg,rgba(196,92,46,0.025) 0px,rgba(196,92,46,0.025) 1px,transparent 1px,transparent 10px)"></div>

<!-- Dot grid — dùng trên hero / pricing -->
<div class="absolute inset-0 pointer-events-none"
     style="background-image:radial-gradient(circle,rgba(196,92,46,0.10) 1px,transparent 1px);background-size:22px 22px"></div>
```

---

## Pattern files có visual

| Pattern file | Visual element |
|-------------|---------------|
| `hero.html` | Organic blob bg + product media slot + 2 floating handmade-label cards |
| `feature-icons.html` | Organic SVG icons — leaf, jar, sun, people, stamp |
| `product-showcase.html` | Product photo cards với warm treatment + price badge |
| `guarantee-card.html` | Circular stamp seal SVG |
| `testimonials.html` | Avatar photo slot + decorative leaf accent |
| `stats-bar.html` | Warm icon + number blocks |
