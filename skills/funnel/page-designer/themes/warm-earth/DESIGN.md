---
version: "1.0.0"
name: "Warm Earth"
mood: "Friendly · Organic · Local · Trustworthy"
best_for: "SME truyền thống, thực phẩm sạch, nông sản, handmade, craft, workshop offline, dịch vụ địa phương"
avoid_for: "Tech, SaaS, tài chính, y tế lâm sàng, enterprise B2B"

css_source: "themes/shared/base.css"
tailwind_config: "themes/warm-earth/tailwind.config.js"
patterns_shared: "themes/patterns/*.html"
patterns_override: "themes/warm-earth/patterns/*.html"
---

# Warm Earth — Design Reference

## Colors

```css
--accent:      #c45c2e  /* Terracotta/cam đất — CTA, highlights     */
--accent-rgb:  196, 92, 46
--accent-text: #ffffff
--green:       #5a7a3a  /* Olive green — natural, fresh, trust        */
--green-rgb:   90, 122, 58
--sand:        #d4a853  /* Vàng cát — secondary, warmth, badges       */
--sand-rgb:    212, 168, 83
--alert:       #b03a2e  /* Deep red — urgency (không dùng bright red)  */
--alert-rgb:   176, 58, 46

--bg:          #faf6f0  /* Beige kem — canvas ấm, giấy thủ công       */
--surface:     #f2ebe0  /* Beige đậm hơn — alternate sections         */
--raised:      #ede3d3  /* Card trên surface                           */
--ink:         #2a1f14  /* Nâu tối — primary text                      */
--body:        #5c4a35  /* Nâu trung — body text                       */
--subtle:      #9c8468  /* Nâu nhạt — labels, meta                    */
--faint:       #d9cfc0  /* Beige border — dividers                     */
--rim:         rgba(196,92,46,0.18)  /* Terracotta-tinted borders     */
```

---

## Typography

| Role | Class | Spec |
|------|-------|------|
| Display headline | `font-display font-extrabold` | Nunito 800 · clamp(2.25→4.25rem) · lh 1.1 |
| Section H2 | `font-display font-bold` | Nunito 700 · clamp(1.375→2rem) · lh 1.2 |
| Body | `font-body text-base leading-relaxed` | Source Sans 3 400 · 16px · lh 1.7 |
| Label/eyebrow | `.section-label` | Source Sans 3 600 · 11px · ls 0.06em · uppercase |
| Price/metric | `font-mono font-bold` | Source Code Pro 700 |
| Accent quote | `font-script` | Caveat 600 · italic feel · max 1–2 lần/page |

**Rule:** Nunito cho headings tạo cảm giác thân thiện, rounded.
Caveat script font dùng rất tiết kiệm — 1 pull quote hoặc badge label thủ công.

---

## Background Catalog

### Section bases
| style | Visual | Use for |
|-------|--------|---------|
| `background:var(--bg)` | Beige kem | Default sections |
| `background:var(--surface)` | Beige đậm | Alternate sections |
| `background:var(--accent)` | Terracotta | Final CTA — max 1×/page |
| `background:var(--green)` | Olive green | Feature highlight — max 1×/page |

### Texture overlays
```css
/* Paper grain — subtle handmade feel */
background-image: url("data:image/svg+xml,..."); /* noise SVG */
opacity: 0.04;

/* Diagonal linen weave */
background-image: repeating-linear-gradient(
  45deg, rgba(196,92,46,0.03) 0px, rgba(196,92,46,0.03) 1px,
  transparent 1px, transparent 8px
);

/* Dot grid — artisan graph paper */
background-image: radial-gradient(circle, rgba(196,92,46,0.12) 1px, transparent 1px);
background-size: 20px 20px;
```

### Card backgrounds
| style | When |
|-------|------|
| `background:var(--bg); border:1.5px solid var(--faint)` | Default card |
| `background:var(--raised); border:1px solid var(--rim)` | Highlighted card |
| `border:1.5px dashed var(--faint)` | Optional/add-on items |
| `border:2px solid var(--accent)` | Featured card |

---

## Visual Vocabulary

### Hand-drawn / Organic feel
- SVG icons: slightly imperfect paths, organic curves, NOT perfect geometric
- Leaf, sprout, wheat, jar, basket motifs cho food/farm context
- Stamp / seal shapes cho guarantee và badges
- Dashed borders cho optional items

### Color usage
- Terracotta: CTA buttons, section headers, key numbers
- Olive green: checkmarks, "included" items, nature/fresh cues
- Sand/yellow: bonus badges, highlight, warmth
- Nâu tối: all headlines

### Shadows — warm, soft
```css
/* Card default */
box-shadow: 0 2px 16px rgba(42,31,20,0.08);
/* Card hover / featured */
box-shadow: 0 6px 28px rgba(42,31,20,0.12);
/* CTA button */
box-shadow: 0 4px 16px rgba(196,92,46,0.30);
```

---

## Pattern Overrides

| Pattern | Layout | Điểm khác biệt |
|---------|--------|----------------|
| `announcement-bar.html` | Không | Terracotta bg + script font accent + leaf icon |
| `hero.html` | **Asymmetric** | Copy trái + product media slot phải + organic blob bg |
| `stats-bar.html` | Không | Warm card blocks + green/terracotta numbers |
| `pricing-card.html` | Không | Dashed border option + stamp badge + warm colors |
| `testimonials.html` | **2-col cards** | Avatar photo slot + handwritten-feel quote + green check results |
| `guarantee-card.html` | **Stamp seal** | Circular stamp design thay shield graphic |
| `cta-strip.html` | Không | Terracotta bg + linen texture + organic shapes |
| `countdown-cta.html` | **Calendar date** | Date display thay digital timer (warm-earth audience không hype timer) |
| `product-showcase.html` | **New** | Product card grid — physical product display (food, craft, handmade) |

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — dot grid gives organic texture feel |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `.bg-stack-section` | Light accent + dots |
| Main content 2 (Grid/Agents/Solution) | `.bg-stack-section-grid` | Light accent + grid |
| Experience/Process/How it works | `.bg-stack-dual` | Dual glow + dots |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | Warm terracotta/earth solid | Override per theme — max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Note (warm-earth theme):** bg-stack dot patterns complement the organic, handmade aesthetic — dots evoke artisan graph paper. Accent glow shows as a warm terracotta tint. Keep overlay opacity ≤ 0.06 for a subtle, natural feel.

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## 4-Phase Emotional Arc

| Phase | Bg | Texture | Sections |
|-------|----|---------|----|
| TENSION | `bg` flat | Không | Problem, pain |
| SHIFT | `surface` | Linen diagonal | How it works, features |
| TRUST | `bg` flat | Không | Testimonials, instructor |
| DESIRE | `surface` → `accent` | Dot grid | Pricing, guarantee, CTA |

---

## Guardrails

- **Không dùng màu tím, xanh dương, neon** — phá vỡ palette organic
- Border radius min 8px buttons, 12px cards — không sharp corner
- Caveat script: max 2 lần/page, font-size ≥ 18px (không nhỏ, khó đọc)
- Texture opacity: max 0.06 — subtle, không noisy
- Không dùng shadow màu — chỉ shadow nâu tối opacity thấp
- All colors: `var(--token)` — no hardcoded hex

---

## Motion Style

**Intensity:** Subtle-Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Product showcase cards | `.float-sm` | 4s | Very gentle vertical bob — mimics produce swaying, natural and organic |
| Decorative leaf / sprout SVGs | `.orb-float` | 5s | Slow drift on leaf/plant motif decorations — purely atmospheric |
| Product cards on hover | `.card-lift` | 0.25s | Lift + warm shadow increase on hover — inviting, tactile feel |
| Ambient background warmth blob | `.blob` (amber/earth override) | 10s | Single blob behind hero — override blob color to `rgba(196,92,46,0.07)` terracotta |
| Section content blocks | `.reveal` | 0.6s | Standard scroll fade-up on all section content |
| Feature list / include items | `.reveal` + `.delay-1` → `.delay-3` | 0.6s | Gentle stagger — feels like items being placed on a table |

### Theme motion rules

- Blob color MUST be overridden to terracotta/amber tones — `rgba(196,92,46,0.07)` — never use default neon/cyan/purple blobs
- Max 1 blob per section — organic, not technological
- `.float-sm` uses 4s+ duration to feel like natural breathing, not a tech animation
- `.orb-float` on decorative SVGs only — never on content elements or product images
- `.card-lift` on product showcase cards mirrors the physical act of picking up and inspecting a product
- No timing faster than 0.25s on any transition — hasty motion breaks the handmade feel

### Không dùng (off-limits cho theme này)

- `.shimmer-border` — neon shimmer destroys the organic, handmade aesthetic
- `.scan-line` — tech aesthetic, completely wrong for farm/craft context
- `.flow-line-h`, `.flow-line-v` — pipeline animations feel industrial, not artisan
- `.bg-mesh-animated` — multi-color animated mesh breaks the warm monotone palette
- `.btn-glow` with default neon color — if used, MUST override to terracotta glow only
- `.icon-breathe` — too techy a name and effect for this earthy mood
