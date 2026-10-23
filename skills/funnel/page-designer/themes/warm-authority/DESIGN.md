# Warm Authority — Design Reference

## Theme Identity

**Name:** Warm Authority
**Mood:** Trusted · Approachable · Expert · Warm Professional
**Best for:** Business coach, marketing consultant, career coach, financial advisor, management trainer, personal brand for established professionals
**Avoid:** Youth brands, entertainment, e-commerce products, dark/dramatic industries

**Differentiator:**
- vs. bold-persona: Less energetic, more gravitas. Advisor over influencer.
- vs. story-first: More structured/professional, less narrative-emotional.
- vs. minimal-mono: Has warm color and humanistic texture — not cold editorial.

---

## Color System

```css
:root {
  --accent:      #b5732a;  /* Amber/cognac — trust, expertise, warmth */
  --accent-rgb:  181, 115, 42;
  --accent-text: #ffffff;
  --forest:      #2d5016;  /* Deep green — growth, results, wins */
  --forest-rgb:  45, 80, 22;
  --warm-red:    #9b2335;  /* Deep red — urgency, importance */
  --bg:          #fdf9f4;  /* Warm cream white — main canvas */
  --surface:     #f7f1e8;  /* Warm off-white — alternate sections */
  --raised:      #efe6d8;  /* Card background */
  --ink:         #1e160a;  /* Dark warm brown — primary headings */
  --body:        #4a3520;  /* Brown body — body copy */
  --subtle:      #8a7560;  /* Muted warm — labels, captions */
  --faint:       #ddd0be;  /* Warm border — dividers, card borders */
  --rim:         rgba(181,115,42,0.20);  /* Amber glow border */
}
```

### Color Usage Rules
- **Never use pure white (#ffffff) as primary background** — always warm cream
- **Never use cold grays, blues, or purples** — all neutrals are warm-tinted
- **Never use neon, fluorescent, or dark section backgrounds** — light warm palette only
- **Amber (`--accent`):** All CTAs, section header accents, key metric numbers, top-border on cards, blockquote left border
- **Deep green (`--forest`):** Checkmarks, result callouts, growth metrics, "win" indicators
- **Warm red (`--warm-red`):** Urgency text only (limited seats, deadline) — use sparingly
- **Ink (`--ink`):** All headings (via Lora font)
- **Body (`--body`):** All paragraph text
- **Subtle (`--subtle`):** Labels, captions, secondary metadata

---

## Typography

### Font Stack
```
Display:  Lora (Google Fonts) — serif with warmth and gravitas; italic for key phrases
Body:     Source Sans 3 — clean, highly legible, professional
Mono:     Source Code Pro — metrics, prices, data, numbers
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Source+Sans+3:wght@300;400;600&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet">
```

### Typography Rules
- **Lora 700** — all section headings, hero headline (the serif brings gravitas)
- **Lora italic** — key phrases in headlines, client names in testimonials, chapter quotes, intro phrases
- **Source Sans 3 400** — all body copy, navigation, descriptions
- **Source Sans 3 600** — button labels, sub-headings, UI labels
- **Source Sans 3 300** — long-form lead paragraphs, extended descriptions
- **Source Code Pro 600** — ALL prices, revenue metrics, seat counts, KPI numbers
- **Source Code Pro 400** — secondary data: dates, durations, statistical labels

### Scale
| Token | Size | Use |
|-------|------|-----|
| display-2xl | clamp(2.75rem, 7vw, 5.5rem) | Hero headline |
| display-xl  | clamp(2rem, 5vw, 4rem)       | Section heading |
| display-lg  | clamp(1.5rem, 3.5vw, 2.75rem)| Card heading |
| xl   | 1.25rem | Sub-headings |
| lg   | 1.125rem | Large body, lead para |
| base | 1rem    | Body copy |
| sm   | 0.875rem | Labels, captions |
| xs   | 0.75rem  | Fine print, metadata |

---

## Backgrounds

**Light-only palette — no dark sections:**

| Level | Background | Border | Use |
|-------|-----------|--------|-----|
| Canvas | `#fdf9f4` | — | Main page background |
| Surface | `#f7f1e8` | — | Alternating sections |
| Raised | `#efe6d8` | `1px solid #ddd0be` | Card backgrounds |
| Featured | `#efe6d8` | `1px solid rgba(181,115,42,0.20)` | Hero cards, featured cards |

**Grain texture** — applied on surface and raised elements for paper feel:
```css
background-image: url("data:image/svg+xml,..."); /* opacity 0.03 */
```

---

## Card System

### Standard Card
```css
background: #efe6d8;
border: 1px solid #ddd0be;
border-radius: 16px;
box-shadow: 0 4px 24px rgba(30,22,10,0.08);
```

### Featured Card (amber accent)
```css
background: #efe6d8;
border: 1px solid rgba(181,115,42,0.20);
border-top: 3px solid #b5732a;
border-radius: 16px;
box-shadow: 0 4px 24px rgba(30,22,10,0.08);
```

### Hover state
```css
transform: translateY(-2px);
box-shadow: 0 6px 32px rgba(30,22,10,0.10);
```

### Amber top-border variant (services, features)
```css
border-top: 3px solid #b5732a;
border-radius: 0 0 16px 16px;  /* only bottom rounded */
```

---

## Shadow System

```css
/* Default card */
box-shadow: 0 4px 24px rgba(30,22,10,0.08);

/* Elevated card */
box-shadow: 0 6px 32px rgba(30,22,10,0.10);

/* Featured / hero card */
box-shadow: 0 8px 48px rgba(30,22,10,0.12);

/* Accent glow (CTA buttons, featured badge) */
box-shadow: 0 4px 20px rgba(181,115,42,0.25);

/* Button hover */
box-shadow: 0 4px 20px rgba(181,115,42,0.35);
```

All shadows use warm brown base, never cold gray or black.

---

## Button System

```css
/* Primary — amber */
.btn-primary {
  background: #b5732a;
  color: #ffffff;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  filter: brightness(1.08);
  box-shadow: 0 4px 20px rgba(181,115,42,0.35);
  transform: translateY(-1px);
}

/* Secondary — ghost amber */
.btn-secondary {
  background: transparent;
  color: #b5732a;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 13px 27px;
  border-radius: 10px;
  border: 1.5px solid rgba(181,115,42,0.35);
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: rgba(181,115,42,0.06);
  border-color: #b5732a;
}

/* Text link */
.btn-text {
  color: #b5732a;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(181,115,42,0.30);
  padding-bottom: 1px;
  transition: border-color 0.2s;
}
.btn-text:hover { border-color: #b5732a; }
```

---

## Border Radius System

| Use | Radius |
|-----|--------|
| Buttons | `10px` |
| Input fields | `8px` |
| Standard cards | `16px` |
| Large image cards | `20px` |
| Badges/pills | `999px` |
| Portrait frame | `20px` |
| Avatars | `50%` |

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — warm amber glow, professional |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `var(--bg)` flat | Speaker credibility — clean, authoritative |
| Main content 2 | `var(--surface)` flat | Services grid — professional structure |
| Experience/Process | `var(--bg)` flat | Milestone timeline — professional journey |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots — earned trust, warm proof |
| Pricing/Offer | `var(--surface)` flat | Clean pricing — professional, not flashy |
| Guarantee | `var(--bg)` flat | No distraction |
| FAQ | `var(--surface)` flat | Clean |
| CTA Strip | `var(--accent)` warm amber solid | Warm authority close |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. Only Hero and Testimonials use bg-stack classes — this theme values professional restraint over visual complexity.

**4-Phase Arc: Authority → Problem → Journey → Results → Work Together**

| Phase | Sections | BG | Tone |
|-------|---------|----|----|
| **Authority** | Announcement · Hero · Speaker credibility · Stats | `--bg` / `.bg-stack-hero` | "Who I am and why trust me" |
| **Problem** | Pain points · Before state | `--surface` | "I understand your situation" |
| **Journey** | Milestone timeline · Origin story | `--bg` / `--surface` | "Here's how I got here" |
| **Results** | Client testimonials · Case stats | `.bg-stack-trust` | "Here's what I've helped achieve" |
| **Work Together** | Services · Pricing · Guarantee · CTA · FAQ | `--bg` / `--surface` | "Here's how we work together" |

---

## Personal Brand Patterns Used

### Shared patterns (from `themes/patterns/`):
- `hero-portrait.html` — Override with Lora serif, amber credential badge, warm glow
- `speaker-credibility.html` — Media logos + publications + social proof
- `milestone-timeline.html` — Life/career journey with warm markers

### Theme-specific patterns (in `themes/warm-authority/patterns/`):
- `announcement-bar.html` — Warm cream bg + amber left border + Lora italic message
- `hero.html` — Override of hero-portrait with warm-authority styling
- `stats-bar.html` — 4 warm metric cards, amber Lora italic numbers
- `services-grid.html` — 3 service cards with amber top border
- `testimonials.html` — Client result cards, Lora italic quotes, amber border
- `pricing-card.html` — 3 tiers, amber featured, forest green checkmarks
- `guarantee-card.html` — 2-col amber seal + promise
- `cta-strip.html` — Warm amber bg + application form right
- `countdown-cta.html` — Cohort calendar + quota bar

---

## Animation Guidelines

| Animation | Timing | Use |
|-----------|--------|-----|
| `fade-up` | 0.7s ease | Section entry on scroll |
| `fade-in` | 0.5s ease | Badge, overlay reveals |
| `float` | 4s ease-in-out infinite | Floating credential badges |
| Hover scale | 0.2s ease | Portrait cards, service icons |
| Hover translate-y | 0.2s ease | Cards (lift effect) |

Scroll reveal via `IntersectionObserver` — add `.reveal` class, JS toggles `.visible`.

---

## Guardrails — Do Not

- No dark background sections (not even one dark section)
- No neon, fluorescent, or electric colors
- No cold gray or blue-gray neutrals
- No sans-serif for section headings (always Lora)
- No pure black text — always warm dark brown (`#1e160a`)
- No aggressive countdown timers — use consultative cohort framing
- No salesy "GET RICH" copy style — warm, trusted advisor tone
- No generic stock photo treatment — portrait must feel real and warm
- No more than 3 colors used in one section (amber + ink + body max)

---

## Motion Style

**Intensity:** Subtle-Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero portrait photo | `.float-sm` | 5s | Small, slow vertical float — the expert is present but grounded, not bouncy |
| Service / feature cards | `.card-lift` | 0.25s | Clean 3px lift on hover — professional confidence, not aggression |
| Milestone timeline connector | `.flow-line-v` | 3s | Vertical amber flow line drawing down the timeline — journey progression |
| Testimonial blocks | `.reveal .delay-1/2/3/4` | 0.7s | Staggered fade-up reveal — each testimonial earns its moment |
| Section entry | `.reveal` | 0.6s | All sections use fade-up scroll reveal as defined in DESIGN.md |
| Credential badges (floating) | `.float-delay-1` / `.float-delay-2` | 5–6s | Offset float on credential badges near portrait — authority that breathes |

### Theme motion rules

- Motion reflects gravitas: everything moves slowly and with purpose — no snappy or explosive effects
- `.float-sm` on the portrait is the warmest motion; it should feel like the expert is slightly leaning in
- The `.flow-line-v` on the milestone timeline should animate on scroll-enter, drawing top-to-bottom as the user reads the career journey
- Testimonial stagger delay creates the impression of evidence building sequentially, not dumping all at once
- Hover lifts on service cards use `transition: transform 0.25s ease, box-shadow 0.25s ease` — smooth, considered
- Maximum 3 simultaneous animations visible at any time — never competing motion

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-cyan`, `.blob-purple` — color blobs are too playful for a trusted professional advisor
- `.shimmer-border`, `.shimmer-border-slow` — shimmer feels promotional, not authoritative
- `.scan-line` — technical scanner is wrong for warm human expertise
- `.btn-glow` — glowing buttons are too aggressive for a consultative tone
- `.orb-float` — ambient orbs feel new-age/mystical, not professional
- `.bg-mesh-animated` — animated backgrounds pull focus from the human content
- `.icon-breathe` — pulsing icons feel like an app, not a trusted advisor's page
- `.card-lift-accent` — accent-colored lift is too energetic for this measured authority tone
