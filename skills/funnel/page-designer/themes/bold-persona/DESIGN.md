# Bold Persona — Design Reference

## Theme Identity

**Name:** Bold Persona
**Mood:** Dynamic · Energetic · Confident · Modern Thought Leader
**Best for:** Motivational speaker, entrepreneur coach, startup founder building personal brand, social media influencer going premium
**Avoid:** Traditional professions (law, medicine, accounting), luxury lifestyle, food/hospitality, heavy B2B enterprise

### Positioning vs. Similar Themes
| Theme | Vibe | When to use |
|-------|------|-------------|
| **bold-persona** | Energy + confidence, modern digital-native | Coach/speaker with large social following |
| warm-authority | Gravitas + trust, traditional expert | Established author, therapist, consultant |
| story-first | Emotional vulnerability, personal journey | Life coach, memoir author, recovery |
| minimal-mono | Cold editorial, design-conscious | Creative director, architect, photographer |

---

## Color System

```css
:root {
  --accent:      #e8533a;  /* Coral-red — energy, confidence, primary CTA */
  --accent-rgb:  232, 83, 58;
  --accent-text: #ffffff;
  --electric:    #1a56db;  /* Electric blue — links, secondary CTA, tags */
  --electric-rgb:26, 86, 219;
  --alert:       #dc2626;  /* True red — urgency only */
  --bg:          #ffffff;  /* Pure white canvas */
  --surface:     #f9fafb;  /* Near white — alternate sections */
  --raised:      #f3f4f6;  /* Light grey — cards, boxes */
  --ink:         #111827;  /* Near black — primary headings */
  --body:        #374151;  /* Dark grey — body text */
  --subtle:      #9ca3af;  /* Mid grey — labels, captions */
  --faint:       #e5e7eb;  /* Light border/divider */
  --rim:         rgba(232,83,58,0.18);  /* Coral card border glow */
}
```

### Color Usage Rules
- **Coral (`--accent`):** CTAs, highlighted text, key numbers, active states, featured card borders
- **Electric blue (`--electric`):** Secondary buttons, links, platform tags, supporting callouts
- **`--bg` (white):** Main canvas — the person's energy IS the color, not the page
- **`--surface` (near white):** Alternate section backgrounds for rhythm without gray heaviness
- **`--raised`:** Card fills, input backgrounds, non-featured cards
- **NEVER use dark backgrounds** — this theme is light-on-white for modern digital feel
- **NEVER use serif fonts** — bold-persona is digital-native, not traditional authority

---

## Typography

### Font Stack
```
Display: Syne (Google Fonts) — geometric, bold, memorable personality
Body:    Inter — clean, readable, professional modern
Mono:    Space Mono — metrics, prices, follower counts, data points
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Typography Rules
- **Syne 800** — ALL hero headlines, ALL section headings (non-negotiable)
- **Syne 700** — sub-headings, card titles, pricing program names
- **Syne 600** — nav items, badge text, announcement bar
- **Inter 600** — button labels, UI labels, featured callouts
- **Inter 500** — sub-copy, list items, form labels
- **Inter 400** — body copy, descriptions, small text
- **Space Mono 700** — follower counts, revenue numbers, prices
- **Space Mono 400** — secondary metrics, data labels, dates

### Type Scale
| Token | Size | Line Height | Tracking | Use |
|-------|------|-------------|---------|-----|
| display-2xl | clamp(3rem, 8vw, 6.5rem) | 1.02 | -0.03em | Hero mega-headline |
| display-xl  | clamp(2.25rem, 6vw, 4.5rem) | 1.05 | -0.025em | Section heading |
| display-lg  | clamp(1.75rem, 4vw, 3rem) | 1.1 | -0.02em | Card heading |
| display-md  | clamp(1.4rem, 3vw, 2.25rem) | 1.2 | -0.015em | Sub-heading |
| xl | 1.25rem | 1.5 | — | Lead copy |
| base | 1rem | 1.65 | — | Body |
| sm | 0.875rem | 1.5 | — | Labels |
| xs | 0.75rem | 1.4 | — | Fine print |

---

## 4-Phase Page Arc — Bold Persona

| Phase | Sections | BG | Purpose |
|-------|----------|----|---------|
| **Impact** | Announcement + Nav + Hero | `--bg` (white) | First impression — energy + authority |
| **Method** | Stats + Speaker Credibility + Impact Numbers | `--surface` / `--bg` | Build authority — numbers + media + platforms |
| **Proof** | Milestone Timeline + Testimonials | `--surface` | Social proof — journey + client wins |
| **Join** | Programs + Guarantee + CTA/Countdown + FAQ | `--bg` / `--surface` | Convert — offer + remove friction |

Alternate `--bg` and `--surface` for visual breathing room without breaking the clean white energy.

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero-grid` | Accent glow top + gridlines — bold digital-native energy |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `.bg-stack-section` | Light accent + dots — speaker credibility section |
| Main content 2 | `.bg-stack-section-grid` | Light accent + grid — impact numbers/platforms |
| Experience/Process | `.bg-stack-dual` | Dual glow + dots — milestone + proof section |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — client wins |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid — bold offer section |
| Guarantee | `var(--surface)` flat | No distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip | `var(--accent)` bold coral solid | Coral energy close |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. Energy similar to dark-bold-neon but on a lighter white base — bg-stack glows appear as a coral-tinted energy field on white.

---

## Card System

### 3 Card Elevations
```
Level 1 (default):  bg: #f3f4f6  border: 1px solid #e5e7eb
Level 2 (raised):   bg: #ffffff  border: 1px solid #e5e7eb  shadow: 0 4px 20px rgba(0,0,0,0.08)
Level 3 (featured): bg: #ffffff  border: 1.5px solid #e8533a  shadow: 0 4px 20px rgba(232,83,58,0.18)
```

### Card Rules
- Border radius: `14px` standard
- Featured card: coral left border (4px) OR full coral border
- Hover: `transform: translateY(-3px)` + `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`
- Achievement cards: coral top border 4px — visual "award ribbon" metaphor
- Portrait cards: coral drop shadow `box-shadow: 8px 8px 0 rgba(232,83,58,0.15)`

---

## Geometric Accent System

Personal brand pages use geometric accents to add visual energy without competing with the person:

### Dot Grid Background
```css
.dot-grid {
  background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Thin Diagonal Lines
```css
.diagonal-accent {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(232,83,58,0.03) 20px,
    rgba(232,83,58,0.03) 21px
  );
}
```

### Coral Accent Decorations (SVG)
```svg
<!-- Corner geometric accent -->
<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
  <line x1="0" y1="80" x2="80" y2="0" stroke="#e8533a" stroke-width="1" opacity="0.2"/>
  <line x1="0" y1="60" x2="60" y2="0" stroke="#e8533a" stroke-width="1" opacity="0.15"/>
  <line x1="0" y1="40" x2="40" y2="0" stroke="#e8533a" stroke-width="1" opacity="0.1"/>
</svg>

<!-- Bold strike accent (under headline word) -->
<div style="position:relative;display:inline-block;">
  [ACCENT WORD]
  <svg style="position:absolute;bottom:-4px;left:0;width:100%;height:8px" viewBox="0 0 200 8" preserveAspectRatio="none">
    <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="#e8533a" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>
</div>
```

---

## Pattern Integration — Shared Patterns

These shared patterns are designed to work natively with bold-persona:

| Shared Pattern | Role in Bold Persona | Notes |
|---------------|---------------------|-------|
| `hero-portrait` | IMPACT phase — hero | Override: Syne 800 headline, coral shadow on portrait |
| `speaker-credibility` | METHOD phase | Media logos grayscale 60%, then coral hover |
| `milestone-timeline` | PROOF phase | Coral dots on positive milestones, grey on setbacks |

### Speaker Credibility Pattern Adaptation
```css
/* Override for bold-persona: coral hover state on grayscale logos */
.media-logo { filter: grayscale(1) opacity(0.6); transition: filter 0.2s; }
.media-logo:hover { filter: grayscale(0) opacity(1); }
```

---

## Animation Guidelines

| Animation | Timing | Use |
|-----------|--------|-----|
| `fade-up` | 0.65s ease | Section entry, card reveal on scroll |
| `fade-in` | 0.5s ease | Overlay elements, badges |
| `float-portrait` | 5s ease-in-out infinite | Portrait photo subtle hover |
| `pulse-dot` | 1.8s ease-in-out infinite | Live dot in announcement bar |
| `count-up` | 0.7s ease | Number counters entering viewport |

**Scroll reveal:** Use `IntersectionObserver` with `opacity:0` → `fade-up` class toggle. Stagger delay `0.1s` between cards in a grid.

---

## Button System

```css
/* Primary — Coral energy */
.btn-primary {
  background: var(--accent);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 14px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(232,83,58,0.25);
}
.btn-primary:hover {
  filter: brightness(1.08);
  box-shadow: 0 6px 24px rgba(232,83,58,0.40);
  transform: translateY(-2px);
}

/* Secondary — Electric blue ghost */
.btn-secondary {
  background: transparent;
  color: var(--electric);
  border: 1.5px solid var(--electric);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 13px 27px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: rgba(26,86,219,0.06);
  border-color: var(--electric);
}

/* Ghost — Ink outline (tertiary) */
.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--faint);
  padding: 13px 27px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
.btn-ghost:hover { border-color: var(--body); }
```

---

## Shadows Reference

```css
/* Standard card */
box-shadow: 0 4px 20px rgba(0,0,0,0.08);

/* Card hover */
box-shadow: 0 8px 32px rgba(0,0,0,0.12);

/* Accent featured card */
box-shadow: 0 4px 20px rgba(232,83,58,0.18);

/* Button coral glow */
box-shadow: 0 4px 16px rgba(232,83,58,0.25);
box-shadow: 0 6px 24px rgba(232,83,58,0.40); /* hover */

/* Portrait coral drop */
box-shadow: 8px 8px 0 rgba(232,83,58,0.15);

/* Secondary blue */
box-shadow: 0 4px 16px rgba(26,86,219,0.25);
```

---

## Border Radius Reference

| Element | Radius |
|---------|--------|
| Buttons | `8px` |
| Input fields | `8px` |
| Standard cards | `14px` |
| Large portrait | `16px` |
| Badge/pill | `9999px` |
| Avatars | `50%` |
| Countdown boxes | `8px` |
| Platform icon badges | `10px` |

---

## Guardrails — Do Not

- **NO serif fonts** — Syne + Inter + Space Mono only
- **NO dark backgrounds** — white and light grey only; the person is the color
- **NO muted/desaturated color palette** — coral must pop on white
- **NO overly rounded "soft" shapes** — 8px/14px feels modern, not childish
- **NO stock photography treatment** — real person photos only, high contrast
- **NO cold blue-grey tones** — electric blue is accent only, not a surface color
- **NO gradient mesh or rainbow** — clean coral/white/ink only
- **NO decorative illustrations** — geometric SVG accents only (lines, dots, simple shapes)
- **NO more than 3 colors prominent** — coral, electric blue, ink; white is neutral

---

## Motion Style

**Intensity:** Medium-Bold

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero portrait photo | `.float-gentle` | 5s | Slow, confident float — the person is present and magnetic |
| Impact number cards (follower counts, revenue) | `.shimmer-border` | 2.5s | Coral shimmer border on stat cards — numbers feel alive and credible |
| Featured program / offering card | `.card-lift-accent` | 0.2s | Accent-tinted lift — the featured card pops with coral energy |
| Standard content cards | `.card-lift` | 0.2s | Clean lift on non-featured cards — consistent interactive feel |
| Hero background | `.blob-purple` | 10s | Very subtle purple blob behind hero at low opacity (0.08) — adds depth without stealing from the person |
| Social proof icons (platform badges) | `.icon-breathe` | 3s | Gentle pulse on platform icons — signals that the community is active |
| Section entry | `.reveal` | 0.65s | Standard fade-up as defined in Animation Guidelines |
| Grid card stagger | `.reveal .delay-1/2/3/4` | 0.65s | 0.1s stagger between cards — builds authority progressively |

### Theme motion rules

- The portrait float is the primary emotional motion — it makes the person feel warm and present, not static
- `.shimmer-border` on impact numbers reinforces that these metrics are real-time and significant
- `.card-lift-accent` is reserved for the single featured/recommended program — it is the visual hierarchy anchor
- The blob-purple behind the hero is decorative ambiance only: `opacity: 0.06–0.10`, `z-index: 0`, never over text
- `.icon-breathe` on social proof icons should pulse at 3s — slow enough to feel alive, fast enough to feel active
- Button hover uses `transform: translateY(-2px)` + coral glow as defined in Button System — no extra animation needed

### Không dùng (off-limits cho theme này)

- `.blob-accent` (large, opaque) — would overpower the person who IS the brand
- `.scan-line` — technical readout aesthetic is wrong for a warm digital-native personal brand
- `.flow-line-h`, `.flow-line-v` — directional flows feel process/SaaS oriented
- `.shimmer-border-slow` — too slow for this energetic theme; use the standard `.shimmer-border`
- `.bg-mesh-animated` — animated mesh competes with the dot-grid geometric accent system
- `.float-lg` — too large a float range; this persona is grounded, not weightless
- `.orb-float` — ambient orbs feel meditative or luxury; wrong energy for a confident entrepreneur
