# Prestige Dark — Design Reference

## Identity

**Name:** Prestige Dark  
**Mood:** Sophisticated · Minimal · Exclusive · Quiet Luxury  
**Best for:** High-end real estate, luxury apartments, premium cars, watches, high-ticket coaching  
**Avoid:** Food, children, SME local, anything casual or high-energy

---

## Color System

| Token       | Value                    | Usage |
|-------------|--------------------------|-------|
| `--accent`  | `#c9a84c` (gold champagne) | Key metrics, dividers, borders on featured tier, sparingly |
| `--accent-rgb` | `201, 168, 76`        | For rgba() usage in shadows and overlays |
| `--accent-text` | `#0c0c0a`            | Text on gold backgrounds |
| `--silver`  | `#a8a89e` (warm silver)  | Secondary icons, decorative lines |
| `--alert`   | `#c0392b`               | Error states, urgent notices only |
| `--bg`      | `#0c0c0a` (near black)   | Page background |
| `--surface` | `#141412`               | Section backgrounds, subtle lift |
| `--raised`  | `#1c1c19`               | Card backgrounds |
| `--ink`     | `#f5f0e8` (warm white)   | Primary headings and display text |
| `--body`    | `#c8c4b8` (warm grey)    | Body copy, descriptions |
| `--subtle`  | `#7a7870`               | Captions, placeholders, muted labels |
| `--faint`   | `#2a2a26`               | Dividers, borders, hairlines |
| `--rim`     | `rgba(201,168,76,0.15)`  | Thin card border for featured states |

**Gold Rule:** Gold (`--accent`) must not exceed 10% of visible elements on any given section. It is a signal, not a backdrop.

---

## Typography

### Font Stack

| Role      | Font              | Weights      | Notes |
|-----------|-------------------|--------------|-------|
| Display   | Cormorant Garamond | 400, 600, 700 | Italic 400, 600, 700 also loaded |
| Body      | Jost              | 300, 400, 500, 600 | Geometric sans; never use 700+ |
| Mono      | DM Mono           | 400, 500     | Prices, floor numbers, m², metrics |

### Type Scale

| Name    | Size (clamp)              | Leading | Tracking | Weight |
|---------|---------------------------|---------|----------|--------|
| display | clamp(3rem, 7vw, 6rem)    | 1.0     | -0.02em  | 700    |
| h1      | clamp(2rem, 4.5vw, 3.5rem)| 1.1     | -0.02em  | 600    |
| h2      | clamp(1.5rem, 3vw, 2.25rem)| 1.2    | -0.01em  | 600    |
| h3      | 1.125rem                  | 1.4     | -0.01em  | 500    |
| label   | 10px                      | 1.0     | 0.18em   | 400    |
| body    | 1rem / 1.0625rem          | 1.7     | 0        | 300–400|
| metric  | clamp(2rem, 5vw, 4rem)    | 1.0     | -0.03em  | 700    |

### Typography Rules

- **Cormorant Garamond 700 italic** is the signature of this theme. Use it for one or two key words in each major headline — never the whole paragraph.
- Jost should feel airy. Use weight 300 for long body copy, 400 for standard, 500 for small labels.
- DM Mono is reserved strictly for numerical data: prices, floor area (m²), unit counts, percentage stats.
- Do not mix fonts within a single line except for the italic-word technique.
- Uppercase + letter-spacing 0.18em is reserved for `label` text only (category chips, section eyebrows).

---

## Backgrounds

This theme uses **no blobs, no grain, no glow effects, no color washes**.

Permitted background techniques:

1. **Near-black flat:** `background: var(--bg)` or `var(--surface)` — the default.
2. **Subtle dark radial:** A single radial gradient at very low opacity (max 0.05) to create depth without any color.

```css
/* Correct subtle radial — top left origin, near-invisible */
background:
  radial-gradient(ellipse 80% 60% at 10% 0%, rgba(201,168,76,0.04) 0%, transparent 70%),
  var(--bg);
```

3. **Full-bleed photography:** Imagery always takes the full width/height of its container with no border-radius. Set `object-fit: cover`. Dark overlay at max 0.45 opacity if text sits on the image.
4. **Section separation:** Use a 1px horizontal line in `--faint` color, or increase background elevation from `--bg` → `--surface` → `--raised`.

**Never use:**
- Blobs or organic SVG shapes
- CSS `filter: blur()` for decorative purposes
- Grain / noise overlays
- Colored glows or neon accents
- Gradient background washes (except the tiny gold radial above)

---

## Card Styles

### Standard Card (raised surface)
```css
background: var(--raised);
border-radius: 4px;
border: 1px solid var(--faint);
box-shadow: 0 2px 16px rgba(0,0,0,0.32);
```

### Featured / Recommended Card (thin gold rim)
```css
background: var(--raised);
border-radius: 4px;
border: 1px solid rgba(201,168,76,0.35);
box-shadow: 0 4px 32px rgba(0,0,0,0.4);
```

### Ghost / Frameless (no card background)
Elements float on the section background with only typography and a thin divider. No card box. Testimonials and guarantees use this style.

### Rules
- Border radius **never exceeds 8px** anywhere in this theme.
- Buttons: `border-radius: 2px`
- Cards: `border-radius: 4px`
- Input fields: `border-radius: 2px`
- Modals (if needed): `border-radius: 6px` maximum

---

## Shadow

One shadow value only:

```css
/* Luxury shadow — dark, no color */
box-shadow: 0 4px 32px rgba(0,0,0,0.4);

/* Card shadow — lighter variant */
box-shadow: 0 2px 16px rgba(0,0,0,0.32);
```

Never use colored shadows (no gold glow, no blue haze). Shadows exist only to establish depth against a dark background.

---

## Dividers & Borders

| Element               | Style |
|-----------------------|-------|
| Section divider       | `border-top: 1px solid var(--faint)` |
| Gold accent divider   | `border-top: 1px solid rgba(201,168,76,0.4)` |
| Vertical stat divider | `border-right: 1px solid rgba(201,168,76,0.25)` |
| Card border (default) | `border: 1px solid var(--faint)` |
| Card border (featured)| `border: 1px solid rgba(201,168,76,0.35)` |
| Gold top accent bar   | `border-top: 2px solid var(--accent)` — featured cards only |

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — luxury theme, keep very subtle (opacity ≤ 0.04) |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `var(--bg)` flat | Less is more — flat sections preserve luxury silence |
| Main content 2 (Grid/Agents/Solution) | `var(--surface)` flat | Flat — prestige dark avoids decorative overlays in mid-sections |
| Experience/Process/How it works | `var(--bg)` flat | Flat — restraint is the luxury signal |
| Testimonials/Reviews | `var(--bg)` flat | Flat — ghost/frameless quote layout, no pattern |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid — only stacked section outside Hero |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | Deep dark with subtle gold glow | Override per theme — `var(--surface)` + gold radial at 0.04 opacity |
| Footer | `var(--bg)` flat | No pattern |

**Note (prestige-dark theme):** Use bg-stack ONLY on Hero and Pricing — all other sections flat. Less is more. This theme's luxury identity depends on restraint — negative space and silence are the design. Any bg-stack class used here must have its overlay at max opacity 0.04.

**Spacing rule:** Sections breathe. Minimum vertical padding: `5rem` (`py-20`). Large sections: `8rem` (`py-32`).

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## 4-Phase Emotional Arc

This system follows a deliberate emotional journey. Build your page in this order:

### Phase 1 — Exclusivity (Top of page)
*"This is not for everyone."*  
Announcement bar + Nav + Hero. Set the tone. The brand speaks quietly, confidently. No urgency, no pressure.  
Elements: full-bleed image or SVG, minimal text, Cormorant italic headline, ghost CTA button.

### Phase 2 — Desire (Middle)
*"I want to be part of this."*  
Stats bar + Property showcase + Amenities/Features. Let the product shine. Numbers in Cormorant gold. Photography fills frames.  
Elements: metrics, full-bleed media slots, feature grid with thin-line icons.

### Phase 3 — Trust (Lower middle)
*"I believe this is real and worth it."*  
Testimonials + Location context + Guarantee.  
Elements: large Cormorant italic quotes, minimal attribution, ghost guarantee panel.

### Phase 4 — Decision (Bottom)
*"I am ready to take the next step."*  
FAQ + CTA strip + Footer.  
Elements: clean accordion, 2-col CTA with form, dark minimal footer.

---

## Guardrails (Hard Rules)

1. **No rounded corners > 8px** — anywhere, on anything.
2. **No colorful elements** — the only color is gold (#c9a84c). Everything else is in the warm dark-to-white spectrum.
3. **Gold max 10%** — count gold elements on screen. If more than 1 in 10 elements uses gold, remove it from the less important ones.
4. **No blobs, no grain, no glow** — clean geometric precision only.
5. **Jost never bold (700+)** — keep it light and geometric.
6. **No stock-illustration style SVG** — only architectural line drawings, floor plan outlines, or abstract geometric grids.
7. **Photography always full-bleed** — no rounded corners on images, no white borders, no drop shadows on photos.
8. **Dark sections only** — this theme has no light-mode variant. Never use a white or very light background section.
9. **One primary CTA color** — the ghost button with gold border is the primary CTA. There is no filled gold button in this theme.
10. **Form inputs: dark surface, 1px faint border** — no rounded inputs, no white backgrounds on forms.

---

## Motion Style

**Intensity:** Subtle

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero property / feature image | `.float-lg` | 7s | Very slow, almost imperceptible vertical drift — property photography should feel alive but dignified |
| Featured pricing / tier card | `.shimmer-border-slow` | 8s | ONLY on the single featured card with `--rim` gold border — slow luxury shimmer |
| Cards on hover | `.card-lift` | 0.35s | Slightly longer transition than default — deliberate, unhurried elevation |
| Section content blocks | `.reveal` | 0.7s | Slower fade-up than other themes — everything enters with weight |
| Section items with stagger | `.delay-1` → `.delay-3` | 0.7s | Max 3 steps, slower timing — feels like curated placement |

### Theme motion rules

- `.float-lg` duration must be 6s or longer — anything faster reads as playful, not prestigious
- `.shimmer-border-slow` is reserved for exactly one card per page — the recommended/featured pricing tier
- `.card-lift` transition is extended to 0.35s to match the theme's deliberate pacing — never 0.15s
- All `.reveal` animations use a single consistent 0.7s ease — uniformity reinforces discipline
- No continuous looping animations except `.float-lg` on the hero image — everything else is response-only
- CTA button gets no glow animation — the ghost button with gold border speaks for itself

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-purple`, `.blob-cyan` — organic shapes break geometric precision
- `.scan-line` — tech/dashboard aesthetic contradicts quiet luxury
- `.flow-line-h`, `.flow-line-v` — workflow animations feel SaaS, not real estate / luxury
- `.orb-float` — decorative orbs are too casual for this theme's restraint
- `.btn-glow` — neon glow on CTA directly contradicts the ghost button identity
- `.bg-mesh-animated` — animated gradient backgrounds are explicitly forbidden in this theme
- `.icon-breathe` — pulsing icons feel nervous, not composed
- `.dot-pulse` — live indicators signal startup energy, wrong for exclusive prestige
