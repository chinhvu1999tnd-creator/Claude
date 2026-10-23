# Energy Sport — Design Reference

## Theme Identity

**Name:** Energy Sport
**Mood:** Dynamic · Bold · Motivating · Aggressive
**Best for:** Gym membership, personal training, fitness program, supplement brand, sports coaching
**Avoid:** Healthcare (clinical), luxury, children, B2B formal

---

## Color Palette

| Token         | Value                    | Role                              |
|---------------|--------------------------|-----------------------------------|
| `--accent`    | `#ff2d2d`               | Red electric — fire, energy, CTAs |
| `--accent-rgb`| `255, 45, 45`           | RGBA usage                        |
| `--accent-text`| `#ffffff`              | Text on red backgrounds           |
| `--yellow`    | `#f5c500`               | Power, urgency, warning callouts  |
| `--yellow-rgb`| `245, 197, 0`           | RGBA usage                        |
| `--grey`      | `#2a2a2a`               | Secondary background, dividers    |
| `--alert`     | `#ff6b00`               | Orange — secondary urgency        |
| `--bg`        | `#0e0e0e`               | Near-black page background        |
| `--surface`   | `#141414`               | Dark grey surfaces                |
| `--raised`    | `#1e1e1e`               | Card/raised element background    |
| `--ink`       | `#ffffff`               | Primary text (pure white)         |
| `--body`      | `#cccccc`               | Body text (light grey)            |
| `--subtle`    | `#888888`               | Muted/secondary text              |
| `--faint`     | `#2a2a2a`               | Subtle borders, dividers          |
| `--rim`       | `rgba(255,45,45,0.25)`  | Red border glow                   |

### Color Usage Rules
- **Red dominant:** Headlines accent word, CTA buttons, active states, borders on featured elements
- **Yellow for urgency:** Countdown timers, flash sale badges, WARNING labels, limited spot indicators
- **Orange (--alert) sparingly:** Secondary urgency elements only, not competing with red
- **Never use pastels or light backgrounds** — this is always a dark-theme design system
- **White text only** on dark backgrounds — never black text on dark

---

## Typography

### Font Stack
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@600;700&display=swap');

--font-display: 'Barlow Condensed', sans-serif;  /* ALL headlines */
--font-body:    'Barlow', sans-serif;             /* body copy */
--font-label:   'Barlow Semi Condensed', sans-serif; /* labels, CTAs */
```

### Type Scale
| Usage             | Font                  | Weight | Size     | Case      |
|-------------------|-----------------------|--------|----------|-----------|
| Hero headline     | Barlow Condensed      | 900    | 7–10rem  | UPPERCASE |
| Section headline  | Barlow Condensed      | 900    | 3–5rem   | UPPERCASE |
| Sub-headline      | Barlow Condensed      | 700    | 1.75rem  | UPPERCASE |
| Metric number     | Barlow Condensed      | 900    | 4–8rem   | —         |
| CTA button        | Barlow Semi Condensed | 700    | 1rem     | UPPERCASE |
| Label/Badge       | Barlow Semi Condensed | 600    | 0.75rem  | UPPERCASE |
| Body copy         | Barlow                | 400    | 1rem     | sentence  |
| Caption           | Barlow                | 400    | 0.875rem | sentence  |

### Typography Rules
- **ALL headlines UPPERCASE** — non-negotiable in this theme
- **Barlow Condensed 900** is the signature display font — use it aggressively
- Letter-spacing on headlines: `-0.02em` to `-0.04em` (tight, condensed)
- Line height on large display: `0.9` to `1.0` (no leading waste)
- Mix red + white words in the same headline for accent: `TRAIN <span class="text-red">HARDER</span>`

---

## Carbon Texture

Used on EVERY section — this is the defining atmospheric layer of the theme.

```css
/* Standard carbon — for dark bg sections */
background-image: repeating-linear-gradient(
  -45deg,
  rgba(255,255,255,0.025) 0px,
  rgba(255,255,255,0.025) 1px,
  transparent 1px,
  transparent 8px
);

/* Strong carbon — for hero or featured sections */
background-image: repeating-linear-gradient(
  -45deg,
  rgba(255,255,255,0.06) 0px,
  rgba(255,255,255,0.06) 1px,
  transparent 1px,
  transparent 8px
);

/* Red carbon — for red bg sections */
background-image: repeating-linear-gradient(
  -45deg,
  rgba(0,0,0,0.1) 0px,
  rgba(0,0,0,0.1) 1px,
  transparent 1px,
  transparent 8px
);
```

**Implementation:** Always stack with background-color using a pseudo-element or as a second layer:
```css
background-color: var(--bg);
background-image: repeating-linear-gradient(-45deg, ...);
```

---

## Diagonal Design Elements

Diagonals create momentum, energy, and dynamism. Use liberally.

### Section Clip-paths
```css
/* Standard section — cuts off bottom diagonally */
.section-diagonal {
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  padding-bottom: 8rem; /* account for clip space */
}

/* Inverted — cuts into top */
.section-diagonal-top {
  clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
  padding-top: 6rem;
}

/* Wedge — cuts both ends */
.section-wedge {
  clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 100%);
  padding: 6rem 0;
}

/* Parallelogram card */
.card-para {
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
}
```

### Diagonal Borders & Accents
```css
/* Diagonal red stripe on card corner */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 4px;
  background: linear-gradient(90deg, var(--accent) 0%, transparent 70%);
}

/* Diagonal background for badge */
.badge-diagonal {
  transform: skewX(-10deg);
}
.badge-diagonal span {
  transform: skewX(10deg); /* counter-skew text */
  display: inline-block;
}
```

---

## Border Radius System

**Principle:** Minimal rounding — athletic precision, not friendly softness.

| Element      | Radius | Rationale              |
|--------------|--------|------------------------|
| CTA Button   | 4px    | Sharp, decisive        |
| Card         | 6px    | Minimal structure      |
| Badge/Tag    | 2px    | Almost square          |
| Input field  | 4px    | Technical, clean       |
| Image        | 4px    | Minimal                |
| Modal        | 6px    | Same as card           |

**NEVER exceed 8px** for any structural element. No pill buttons, no fully rounded cards.

---

## Shadow & Glow System

```css
/* Primary CTA glow — red */
.btn-primary {
  box-shadow: 0 4px 20px rgba(255, 45, 45, 0.35);
}
.btn-primary:hover {
  box-shadow: 0 8px 40px rgba(255, 45, 45, 0.55);
}

/* Yellow urgency glow */
.urgency-badge {
  box-shadow: 0 4px 20px rgba(245, 197, 0, 0.35);
}

/* Card hover lift */
.card:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--rim);
}

/* Inset active state */
.btn:active {
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
}
```

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--accent)` solid red | Red urgency bar |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero-grid` | Accent glow top + gridlines — aggressive energy |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `.bg-stack-section-grid` | Light accent + grid — structural feel |
| Main content 2 | `.bg-stack-dual` | Dual glow + dots — features/programs power section |
| Experience/Process | `var(--surface)` flat | Coaches section — clean contrast |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — transformation proof |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid — strong pricing impact |
| Guarantee | `var(--raised)` flat + red border | No distraction |
| FAQ | `var(--surface)` flat | Clean |
| CTA Strip | `var(--accent)` solid red | Alert red — final push |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. Gridlines preferred over dots for this aggressive dark theme.

---

## 4-Phase Narrative Arc

Every landing page built on this theme follows this emotional journey:

### Phase 1 — CHALLENGE (Problem Agitation)
**Goal:** Make the prospect feel the pain of NOT being fit
**Elements:** Hero headline, stats that establish authority, problem-focused copy
**Tone:** Confrontational, direct, no sugar-coating
**Example:** "TIRED OF EXCUSES? START NOW."

### Phase 2 — METHOD (Solution Presentation)
**Goal:** Show the program/gym as the specific solution
**Elements:** Programs section, features, coaches
**Tone:** Confident, specific, results-oriented
**Example:** "PROVEN SYSTEM. REAL RESULTS."

### Phase 3 — PROOF (Social Validation)
**Goal:** Remove doubt with real transformation evidence
**Elements:** Testimonials (BEFORE/AFTER), reviews, metrics
**Tone:** Authentic, specific numbers, credible
**Example:** "LOST 12KG IN 90 DAYS"

### Phase 4 — JOIN NOW (Commitment & Close)
**Goal:** Drive immediate action with urgency
**Elements:** Pricing, countdown, guarantee, final CTA
**Tone:** Urgent, risk-reversing, action-demanding
**Example:** "50% OFF — TODAY ONLY. 23 SPOTS LEFT."

---

## Component Design Rules

### Buttons
```css
/* Primary — Red filled */
.btn-primary {
  background: var(--accent);
  color: var(--accent-text);
  border-radius: 4px;
  font-family: var(--font-label);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 32px;
  box-shadow: 0 4px 20px rgba(255,45,45,0.35);
  border: none;
  transition: all 0.2s;
}

/* Ghost — transparent with border */
.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  font-family: var(--font-label);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 30px;
}

/* Dark on red — for CTA strip */
.btn-dark {
  background: var(--bg);
  color: var(--ink);
  border-radius: 4px;
  font-family: var(--font-label);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 32px;
}
```

### Cards
```css
.card {
  background: var(--raised);
  border-radius: 6px;
  border: 1px solid var(--faint);
  position: relative;
  overflow: hidden;
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255,255,255,0.015) 0px,
    rgba(255,255,255,0.015) 1px,
    transparent 1px,
    transparent 8px
  );
}

/* Featured card modifier */
.card-featured {
  border-top: 3px solid var(--accent);
  box-shadow: 0 0 0 1px var(--rim), 0 12px 40px rgba(255,45,45,0.15);
}
```

### Badges
```css
.badge-red    { background: var(--accent); color: #fff; }
.badge-yellow { background: var(--yellow); color: #000; }
.badge-outline{ border: 1px solid var(--accent); color: var(--accent); background: transparent; }

/* All badges */
.badge {
  font-family: var(--font-label);
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 2px;
}
```

---

## Guardrails

**NEVER:**
- Use pastels or any color not in the token palette
- Round corners > 8px on structural elements
- Use white or light backgrounds (even on cards)
- Mix more than 2 accent colors in one section
- Use decorative icons that aren't athletic/sport-related
- Center-align body text paragraphs (always left-align)
- Use sentence-case for headlines (always UPPERCASE)
- Apply red to passive/decorative elements (save red for action items)

**ALWAYS:**
- Apply carbon texture to every section
- Use Barlow Condensed 900 for ALL headlines
- Keep headlines UPPERCASE
- Apply red glow box-shadow to primary CTA buttons
- Use diagonal sections or elements for hero and CTA sections
- Ensure sufficient contrast (WCAG AA minimum)
- Pair red accent with white text, yellow accent with black text
- Include urgency signals on pricing and CTA sections

---

## Motion & Interaction

```css
/* Standard transition */
transition: all 0.2s ease;

/* Hover — CTA button */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(255,45,45,0.55);
}

/* Hover — card */
.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

/* Scroll reveal (JS-powered) */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Live pulse dot */
.live-dot {
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

---

## Motion Style

**Intensity:** Bold

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero section background | `.blob-accent` + `.blob` (large) | 8–12s | Two large blobs behind hero — red + dark, low opacity (0.15–0.20), create explosive energy field |
| Featured pricing card border | `.shimmer-border` | 2s | Fast shimmer on the featured program card — red hot edge |
| Program / service cards | `.card-lift` | 0.2s | Aggressive `-6px` lift on hover — athletic snap, not gentle float |
| Stats / metrics numbers | `.scan-line` | 1.5s | Scan-line sweep over stat blocks as they enter viewport |
| Feature / benefit icons | `.icon-breathe` | 2s | Pulsing breath on icons — like a heart rate signal |
| Workout step list | `.flow-line-h` | 3s | Horizontal flow line connecting step 1 → 2 → 3 — momentum direction |
| Section reveal | `.reveal` | 0.6s | Standard scroll reveal — `translateY(30px→0)` as defined in DESIGN.md |
| Announcement bar dot | `.dot-pulse` | 1s | Live-pulse dot in red — urgency signal |
| CTA button | `.btn-glow` | — | Red glow on primary CTA — reinforces `box-shadow` hover from DESIGN.md |

### Theme motion rules

- Motion must feel like explosive exertion — every animation should have fast onset and a hard stop
- Blobs are the energy backdrop: position behind hero content, never over readable text
- `.shimmer-border` runs on the featured card only — not every card (saves impact for the premium tier)
- `.scan-line` sweeps once on scroll-enter, does not loop — mimics a sports analytics readout
- `.card-lift` should use `transition: transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94)` — aggressive but not bouncy
- Stagger `.delay-1/2/3/4` on program cards grid for sequential reveal like a starting lineup

### Không dùng (off-limits cho theme này)

- `.float-gentle`, `.float-lg` — soft floating is the opposite of athletic aggression
- `.orb-float` — ambient orbs feel meditative, not competitive
- `.shimmer-border-slow` — too slow; use fast `.shimmer-border` only
- `.bg-mesh-animated` — mesh animation competes with the carbon texture that defines this theme
- Any soft easing (`ease-in-out` with long duration) — all motion must be fast-onset, not dreamy
```
