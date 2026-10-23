# Minimal Mono — Design Reference

**Theme ID:** minimal-mono
**Mood:** Editorial · Clean · Confident · Timeless
**Best for:** Fashion brand, personal brand, creative portfolio, lifestyle brand, high-end consulting
**Avoid:** Food, healthcare, tech SaaS, SME local

---

## Monochrome Palette Rules

This theme operates with a strict no-color policy. The palette contains exactly:

| Token       | Value      | Role                              |
|-------------|------------|-----------------------------------|
| `--accent`  | `#111111`  | Primary — buttons, active states  |
| `--grey`    | `#888888`  | Mid emphasis                      |
| `--light`   | `#f0f0f0`  | Surface alt, raised areas         |
| `--alert`   | `#cc0000`  | URGENT ONLY — countdown, warning  |
| `--bg`      | `#ffffff`  | Pure white — default background   |
| `--surface` | `#f8f8f8`  | Off-white — alternating sections  |
| `--raised`  | `#f0f0f0`  | Light grey for subtle elevation   |
| `--ink`     | `#111111`  | Primary text                      |
| `--body`    | `#555555`  | Body copy                         |
| `--subtle`  | `#999999`  | Muted / secondary text            |
| `--faint`   | `#e0e0e0`  | Borders, dividers                 |
| `--rim`     | `rgba(17,17,17,0.12)` | Ghost borders          |

**Enforcement:**
- No blue, green, teal, yellow, purple, orange — ever
- The only warm/cool deviation allowed: `#cc0000` red for urgent alerts
- All photography must be desaturated with `filter: grayscale(100%) contrast(1.1)`
- Illustrations: SVG linework in `#111111` only, or typographic treatments

---

## Typography

### Type Scale

Typography is the primary visual design tool in this theme. Oversized type IS the layout.

| Role          | Font        | Weight | Size          | Tracking       |
|---------------|-------------|--------|---------------|----------------|
| Display XL    | Space Grotesk | 700  | 6–8rem        | -0.04em        |
| Display LG    | Space Grotesk | 700  | 4–5rem        | -0.03em        |
| Display MD    | Space Grotesk | 600  | 2.5–3.5rem    | -0.02em        |
| Section Head  | Space Grotesk | 500  | 1.5–2rem      | -0.01em        |
| Body          | Space Grotesk | 400  | 1rem–1.125rem | 0              |
| Label / Meta  | Space Mono   | 400   | 0.7–0.85rem   | +0.2em         |
| Price / Stat  | Space Mono   | 700   | varies        | +0.05em        |

### Rules
1. Headlines can break grid — let them bleed or overflow intentionally
2. Multi-line display headlines: each word on its own line is acceptable (editorial stacking)
3. Tight leading on display: `line-height: 0.9` to `line-height: 1.0`
4. All labels and metadata in `UPPERCASE` + Space Mono + tracking `0.2em`
5. Body text maximum width: 60–65 characters per line
6. Italic only in pull-quote testimonials — nowhere else

---

## No-Color Policy

This is not minimalism by accident — it is a deliberate design statement.

**Forbidden:**
- Gradient backgrounds
- Colored backgrounds (except black `#111` for the single CTA strip)
- Colored text (except `--subtle` grey and `--alert` red in extreme cases)
- Drop shadows
- Glows or halos
- Colored borders
- Emoji in UI
- Rounded corners (border-radius: 0 everywhere — no exceptions)

**Permitted:**
- 1px solid `#111111` borders on cards, inputs, buttons
- `rgba(17,17,17,0.12)` ghost borders for very subtle separation
- `#f8f8f8` / `#f0f0f0` alternating section backgrounds
- Black fill on the primary CTA strip section only

---

## Editorial Layout Principles

### Asymmetry is intentional
- Hero layouts are NEVER centered — always offset to create tension
- Column splits: 60/40, 70/30, even 80/20 for editorial drama
- Text and image never perfectly mirror each other

### Negative space as structure
- Whitespace is not empty — it is weight and breath
- Minimum section padding: `7rem` vertical
- Do not fill space for the sake of filling it

### Grid lines as decoration
- Thin 1px horizontal rules (`<hr>`) are valid decorative elements
- Vertical rules in sidebar layouts create editorial grid structure
- Use `border-top: 1px solid #111` as section separators, not bg color changes

### Hierarchy through scale
- One typographic element per section should dominate (much larger than everything else)
- Supporting text is deliberately small and quiet next to the dominant element

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — very subtle on light theme |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `var(--bg)` flat | No pattern — editorial restraint |
| Main content 2 | `var(--surface)` flat | Alternating bg only |
| Experience/Process | `var(--bg)` flat | No dual glow — mono policy |
| Testimonials/Reviews | `var(--surface)` flat | No pattern |
| Pricing/Offer | `var(--bg)` flat | No stacked bg — clean grid only |
| Guarantee | `var(--surface)` flat | No distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip | `#111111` solid black | Mono — the only dark section |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Only Hero uses `.bg-stack-hero` (very subtle glow — nearly invisible on white). All other sections = flat alternating. No dual, no cta stack, no grid patterns — this is the no-color policy theme.

---

## Component Guardrails

### Buttons
```
Primary:   border: 1px solid #111 | bg: #111 | color: #fff | radius: 0
Secondary: border: 1px solid #111 | bg: transparent | color: #111 | radius: 0
Ghost:     no border | bg: transparent | underline text-link style
```

### Cards
```
border: 1px solid #e0e0e0 (or #111 for emphasis)
background: white or #f8f8f8
border-radius: 0
box-shadow: none
```

### Form Inputs
```
border: 1px solid #111 | bg: white | radius: 0 | focus: border 2px solid #111 | outline: none
```

### Images
```css
filter: grayscale(100%) contrast(1.1);
```

### Stats
```
Number: Space Mono 700, large (2–4rem)
Label:  Space Mono 400, small, uppercase, tracking-[0.2em], color: #888
Layout: horizontal inline, separated by vertical rules or heavy spacing
No cards, no backgrounds — just typography
```

---

## Animation Guardrails

- **Allowed:** `opacity` fade in only (`fadeIn`, `fadeUp`)
- **Forbidden:** bounce, float, wiggle, scale pulse, color transitions
- Transition duration: 300–500ms maximum
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy deceleration)
- Scroll reveal: `opacity 0 → 1` + optional `translateY(16px) → 0`
- No looping animations — editorial stillness is a feature

---

## Motion Style

**Intensity:** Subtle

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Section blocks (on scroll) | `.reveal` | 0.5s | `opacity 0→1` + `translateY(16px→0)` — the only scroll motion used |
| Cards (on hover) | `.card-lift` | 0.3s | Max 2px upward lift — barely perceptible, editorial restraint |
| Staggered grid items | `.reveal .delay-1/2/3/4` | 0.5s | Stagger 0.1s between items; delay classes space out grid reveals |

### Theme motion rules

- Motion is strictly functional — it exists to guide the eye, not to impress
- Only `.reveal` and `.card-lift` are sanctioned; every other class on the off-limits list is forbidden
- Card lift must feel like paper being picked up, not an element jumping forward — keep transform to `translateY(-2px)` maximum
- No looping or continuous animations of any kind — editorial stillness is a deliberate design choice, not an oversight
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — snappy deceleration that respects the theme's precision

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-cyan`, `.blob-purple` — color blobs violate the no-color policy
- `.shimmer-border`, `.shimmer-border-slow` — shimmer introduces glow; forbidden
- `.float-gentle`, `.float-sm`, `.float-lg`, `.float-delay-*` — floating elements feel playful, not editorial
- `.btn-glow` — glow effects are explicitly forbidden in the no-color policy
- `.orb-float` — ambient orbs break the cold precision of this theme
- `.scan-line` — technical/sci-fi aesthetic is wrong for fashion/editorial
- `.bg-mesh-animated` — animated backgrounds are too dynamic
- `.dot-pulse`, `.animate-live` — pulsing suggests energy this theme deliberately rejects
- `.icon-breathe` — rhythmic breathing animation is too alive for this aesthetic
