# Soft Luxe — Design Reference

**Theme:** Soft Luxe
**Mood:** Elegant · Feminine · Premium · Sensory
**Best for:** Skincare, beauty, spa, women's fashion, luxury wellness, high-end cosmetics
**Avoid:** Tech, finance, fitness/sport, food, B2B

---

## Palette

| Token      | Value      | Role                              |
|------------|------------|-----------------------------------|
| `--accent` | `#c9956a`  | Rose gold — primary CTA, headings |
| `--blush`  | `#f0c8b8`  | Blush pink — secondary highlights |
| `--mauve`  | `#a87e8a`  | Mauve — tertiary depth, borders   |
| `--bg`     | `#fdf8f5`  | Cream white — main canvas         |
| `--surface`| `#f8f0eb`  | Blush surface — section fills     |
| `--raised` | `#f2e6df`  | Card background on surface        |
| `--ink`    | `#2c2218`  | Warm dark brown — strong headings |
| `--body`   | `#6b5042`  | Warm brown — body copy            |
| `--subtle` | `#a89080`  | Muted warm — labels, captions     |
| `--faint`  | `#e8d5cc`  | Warm border — dividers, rules     |
| `--rim`    | `rgba(201,149,106,0.20)` | Soft rose gold border |
| `--alert`  | `#b03030`  | Error / urgency only              |

**Core rule:** No dark backgrounds. Every section is cream, blush, or white. Darkness only lives in text.

---

## Typography

### Playfair Display — Display + Headlines
- Use for all `<h1>` through `<h3>`
- Italic variant for product names, emotional emphasis, taglines
- Weight: 400 regular, 600 semibold, 700 bold
- Color: `--ink` (default) or `--accent` (emphasis)
- Letter-spacing: -0.01em for large sizes
- Line height: 1.15 for display, 1.3 for section heads

### Lato — Body Copy + UI
- Weight 300 (light) for body paragraphs, ingredient descriptions
- Weight 400 (regular) for labels, nav links, short-form copy
- Weight 700 (bold) for stat numbers only — use sparingly
- Line height: 1.7–1.8 for comfortable reading
- Never use weight 900 or italic Lato

### Cormorant Garamond — Pull Quotes Only
- Max 1–2 uses per page
- Always italic
- Size: 20–24px
- Color: `--mauve` or `--body`
- Role: customer testimonial pull quote, founder note, special callout

### Font Size Scale
| Label    | Size       | Usage                      |
|----------|------------|----------------------------|
| display  | 56–72px    | Hero headline               |
| h1       | 40–52px    | Section headline            |
| h2       | 28–36px    | Subsection                  |
| h3       | 20–24px    | Card headlines              |
| body-lg  | 18px       | Lead paragraphs             |
| body     | 16px       | Standard body               |
| small    | 14px       | Labels, captions            |
| micro    | 12px       | Legal, footnotes            |

---

## Border Radius

| Element        | Radius  |
|----------------|---------|
| Buttons        | 12px    |
| Input fields   | 12px    |
| Cards          | 20px    |
| Large panels   | 28px    |
| Pill badges    | 9999px  |

**Rule:** Never use sharp 0px or barely-rounded 4–6px corners. Softness is brand-defining.

---

## Shadows

All shadows use warm brown base, never cool grey:

```css
/* Standard card */
box-shadow: 0 4px 24px rgba(44,34,24,0.08);

/* Lifted element (hover, featured card) */
box-shadow: 0 8px 40px rgba(44,34,24,0.12);

/* Deep emphasis (modal, floating panel) */
box-shadow: 0 16px 64px rgba(44,34,24,0.16);
```

---

## Decorative Elements

### Thin Lines
- 1px solid `--faint` for section dividers
- Centered short rules: `width: 60px; height: 1px; background: --accent; margin: auto`
- Used before headline labels and after section titles

### Botanical SVG Motifs
- Rose petals: 5-petal simple outline, stroke `--blush`, fill none
- Leaf branches: 3–5 leaf sprig, stroke `--faint`, very subtle
- Small dots: 6–8px circles, fill `--blush`, placed in corners
- Placement: top-right and bottom-left corners, behind content
- Opacity: 0.3–0.5 — never opaque, never center stage

### Small Floral Corner Decorations
- SVG `position: absolute`, `pointer-events: none`
- Scale: 80–120px wide, very light
- Rotate variants: 0°, 90°, 180°, 270° for four corners

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — dreamy on cream bg |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `.bg-stack-section` | Light accent + dots — very subtle on blush surface |
| Main content 2 | `.bg-stack-section-grid` | Light accent + grid — ingredient/how-it-works |
| Experience/Process | `.bg-stack-dual` | Dual glow + dots — product showcase sensory depth |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — soft proof section |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid — elevated pricing feel |
| Guarantee | `var(--surface)` flat | No distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip | Soft pink/rose solid (`var(--blush)` or `var(--surface)`) | Soft rose override |
| Footer | `var(--raised)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. On this light cream theme, all `.bg-stack-*` rgba glows appear very subtle and dreamy — this is correct and intentional.

---

## Spacing Philosophy

- Luxury = space. Never crowd content.
- Section padding: minimum 80px top/bottom, 120px preferred
- Card internal padding: 32–40px
- Element gaps: 24–32px between related items
- Grid gaps: 24px minimum
- Max content width: 1200px, centered

---

## The 4-Phase Conversion Arc

Every landing page should flow through these emotional phases:

### Phase 1 — Aspiration (Hero + Stats)
Make her dream. Show the transformation. Lead with emotion, not features.
- Visuals: warm lifestyle imagery, glowing skin
- Copy: "Làn da rạng rỡ như ánh sáng" — aspirational language
- Tone: soft, inviting, romantic

### Phase 2 — Education (Ingredients + How It Works)
Build trust through knowledge. Teach, don't sell.
- Botanical ingredient highlights with sourcing origin
- Simple 3-step routine: Cleanse → Treat → Protect
- Tone: confident, knowledgeable, caring

### Phase 3 — Trust (Testimonials + Guarantee)
Social proof with skin transformation results. Reduce risk with guarantee.
- Before/after skin condition improvement
- Specific result metrics: "Da sáng hơn 40% sau 4 tuần"
- 30-day guarantee — no-risk promise
- Tone: reassuring, empathetic, honest

### Phase 4 — Purchase (Pricing + CTA)
Make the decision easy. Clear value, limited time, clear action.
- 3-tier sets — starter, essential, luxury
- Countdown for urgency (elegant, not aggressive)
- Single primary CTA in rose gold
- Tone: warm, confident, clear

---

## Button Design

### Primary CTA
```css
background: var(--accent);
color: #ffffff;
border-radius: 12px;
padding: 14px 32px;
font-family: 'Lato', sans-serif;
font-weight: 400;
letter-spacing: 0.04em;
box-shadow: 0 4px 20px rgba(201,149,106,0.35);
transition: all 0.25s ease;
```

### Ghost CTA
```css
background: transparent;
color: var(--accent);
border: 1.5px solid var(--accent);
border-radius: 12px;
padding: 13px 30px;
```

### Hover state
```css
transform: translateY(-2px);
box-shadow: 0 8px 30px rgba(201,149,106,0.45);
```

---

## Product Photography

- Always white or cream background (never busy)
- Suggested CSS filter: `sepia(0.05) saturate(1.1) brightness(1.02)`
- Aspect ratio: portrait (2:3 for hero), square (1:1 for product grid)
- Lifestyle images: warm, golden-hour light, clean flats, skin close-ups
- No harsh flash, no clinical lighting

---

## Guardrails — What NOT To Do

- Never use dark (navy, black, charcoal) section backgrounds
- Never use harsh neon, electric, or cool-tone colors
- Never use sharp corners (border-radius < 8px on featured elements)
- Never use Cormorant Garamond for body copy or headings
- Never use Lato in italic — it's for clean, modern structure
- Never use busy patterns or textures as section backgrounds
- Never stack more than 2 CTAs in the same visual cluster
- Never use countdown timers with digital clock aesthetics — use Playfair date style
- Never make guarantees look aggressive — oval/pill seal, not bold box
- Never use ingredient spotlights without sourcing origin (feels clinical without it)

---

## Motion Style

**Intensity:** Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero product bottle / hero SVG | `.float-gentle` | 6s | Slow, smooth vertical float — like a product suspended in soft light |
| Background ambient shapes | `.orb-float` | 8–10s | 2–3 soft orbs (blush/cream colors, opacity 0.12–0.18) behind hero and pricing sections |
| All cards (on hover) | `.card-lift` | 0.3s | Gentle 2px lift — feels like a petal being lifted, not a card jumping |
| Featured pricing card border | `.shimmer-border-slow` | 4s | Slow rose-gold shimmer — luxury pulse, not urgent flash |
| Section entry | `.reveal` | 0.6s | Standard fade-up reveal; stagger `.delay-1/2/3` on feature grid items |
| Botanical SVG corner motifs | `.float-delay-1` / `.float-delay-2` | 7s | Offset float timing so corner motifs drift independently at low opacity |

### Theme motion rules

- All motion must feel like a breath, not a bounce — durations should be 5–8s for continuous animations
- The product bottle is the hero; `.float-gentle` should be the most visible motion on the page
- Orbs exist in the background only — never over text, always behind content layers (`z-index: 0`)
- `.shimmer-border-slow` is exclusively for the featured pricing card — one shimmer element per page
- Hover lift on cards must be capped at `translateY(-2px)` maximum — luxury restraint over dramatic effect
- Stagger reveal delays on ingredient/feature grids create the feeling of a slow reveal, not urgency

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-cyan`, `.blob-purple` — blobs are too raw/chaotic for this refined aesthetic
- `.shimmer-border` (fast version) — speed is aggressive; only `.shimmer-border-slow` is permitted
- `.scan-line` — technical scan effect is clinical and masculine; completely wrong for this brand
- `.flow-line-h`, `.flow-line-v` — directional flow lines feel process-oriented, not sensory
- `.icon-breathe` — pulsing icons feel functional/app-like, not luxurious
- `.dot-pulse`, `.animate-live` — urgency signals conflict with the calm luxury tone
- `.bg-mesh-animated` — animated mesh is too tech/digital for this organic, sensory theme
- `.card-lift-accent` — the accent-colored lift is too bold; use only the standard `.card-lift`
