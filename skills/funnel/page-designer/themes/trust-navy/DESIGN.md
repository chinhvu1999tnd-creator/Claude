---
version: "1.0.0"
name: "Trust Navy"
mood: "Serious · Authoritative · Calm"
best_for: "Tài chính, đầu tư, bảo hiểm, coaching B2B cao cấp, luật, tư vấn chiến lược, bất động sản trung cấp"
avoid_for: "Trẻ em, fitness, food, beauty, bất kỳ thứ gì cần cảm giác vui vẻ hoặc trẻ trung"

css_source: "themes/shared/base.css"
tailwind_config: "themes/trust-navy/tailwind.config.js"
patterns_shared: "themes/patterns/*.html"
patterns_override: "themes/trust-navy/patterns/*.html"
---

# Trust Navy — Design Reference

## Colors (CSS Variables — do not hardcode hex in HTML)

```css
--accent:      #c9a84c  /* Gold/champagne — CTA, highlights, data callouts   */
--accent-rgb:  201, 168, 76
--accent-text: #0f1829  /* Dark navy text on gold bg                         */
--silver:      #b8c4d4  /* Cool silver — secondary info, icons, sub-stats    */
--silver-rgb:  184, 196, 212
--alert:       #e85454  /* Red — risk warnings, losses, "not for"             */
--alert-rgb:   232, 84, 84
--positive:    #4caf7d  /* Green — gains, returns, positive metrics           */
--positive-rgb:76, 175, 125

--bg:          #0f1829  /* Deep navy canvas                                   */
--surface:     #172035  /* Slightly lighter navy — alternate sections         */
--raised:      #1e2a42  /* Card backgrounds                                   */
--ink:         #eef2f8  /* Near-white primary text                            */
--body:        #a8b5cc  /* Medium blue-grey body text                         */
--subtle:      #5a6a85  /* Muted labels, meta                                 */
--faint:       #2a3a55  /* Dividers, borders, disabled                        */
--rim:         rgba(201,168,76,0.15)  /* Gold-tinted card borders             */
```

**In HTML:** always `style="color:var(--accent)"` — never `style="color:#c9a84c"`.

---

## Typography

| Role | Class | Spec |
|------|-------|------|
| Display headline | `font-display font-bold` | IBM Plex Serif 700 · clamp(2.25→4.5rem) · lh 1.1 · ls -0.025em |
| Section H2 | `font-display font-semibold` | IBM Plex Serif 600 · clamp(1.375→2rem) · lh 1.2 |
| Body | `font-body text-sm leading-relaxed` | IBM Plex Sans 400 · 15px · lh 1.75 |
| Label/eyebrow | `.section-label` | IBM Plex Mono 500 · 10px · ls 0.12em · uppercase |
| Data/metric | `font-mono font-bold` | IBM Plex Mono 700 · gold color |
| Fine print | `font-body text-xs` | IBM Plex Sans 400 · 12px · subtle color |

**Rule:** Headings use IBM Plex Serif — this is the core identity differentiator.
Body stays IBM Plex Sans — don't mix serif into body copy.
Numbers/metrics always IBM Plex Mono.

---

## Background Catalog

### A. Section bases

| style | Visual | Use for |
|-------|--------|---------|
| `background:var(--bg)` | Deep navy | Default sections |
| `background:var(--surface)` | Lighter navy | Alternate sections |
| `background:var(--accent)` | Gold solid | Final CTA — max 1×/page |

**Rule:** Alternate navy / lighter-navy only. Never use white or light backgrounds.

---

### B. Decorative overlays (subtle — no blobs)

```css
/* Thin grid lines — technical credibility, not decoration */
background-image: linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px);
background-size: 60px 60px;

/* Diagonal rule — use on hero only, very subtle */
background-image: repeating-linear-gradient(
  -45deg, transparent, transparent 40px,
  rgba(201,168,76,.03) 40px, rgba(201,168,76,.03) 41px
);

/* Radial gold glow — VERY subtle, max opacity 0.06 */
background: radial-gradient(ellipse 50% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
```

**Rule:** Max 1 overlay per section. NO blobs, NO animated elements except fade-up reveal.

---

### C. Card backgrounds

| style | When to use |
|-------|-------------|
| `background:var(--raised);border:1px solid var(--faint)` | Default card |
| `background:var(--raised);border:1px solid var(--rim)` | Highlighted/featured card |
| `border-left:2px solid var(--accent)` | Accent left-rule on cards (key data) |
| `border-top:1px solid var(--accent)` | Top accent line on featured section |

**Never:** gradient borders, rounded corners > 10px, shadow with color.

---

## Visual Vocabulary

### Gold usage rules
- Gold for: metrics, CTA buttons, section headers, key data callouts
- **Max 15% of page elements** use gold — overuse kills prestige
- Never gold body text — only headings + metrics + CTA
- Gold divider lines (1px) allowed between major sections

### Data presentation
- Use `font-mono` for all numbers, percentages, returns
- Green `var(--positive)` for gains / positive outcomes
- Red `var(--alert)` for losses / risks / problems
- Silver `var(--silver)` for neutral secondary metrics

### Borders — thin precision lines
```css
/* Section separator */
border-top: 1px solid var(--faint);

/* Featured card */
border: 1px solid var(--rim);   /* gold-tinted */

/* Data accent */
border-left: 2px solid var(--accent);
```

### Shadows — minimal, no color
```css
/* Card shadow — very subtle */
box-shadow: 0 2px 12px rgba(0,0,0,0.25);

/* Featured — slightly more */
box-shadow: 0 4px 24px rgba(0,0,0,0.35);
```

**Never:** colored glow, neon shadow, text-shadow.

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — formal theme, keep subtle |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `var(--bg)` flat | Formal theme — prefer flat surfaces over stacked |
| Main content 2 (Grid/Agents/Solution) | `.bg-stack-section-grid` | Light accent + grid — use sparingly |
| Experience/Process/How it works | `.bg-stack-dual` | Dual glow + dots |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | Gold/amber solid bg | Override per theme — max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Note (formal theme):** Use `.bg-stack-section` sparingly — Trust Navy is a formal theme, prefer flat surfaces. Data speaks without decoration. Reserve stacked backgrounds for Hero and Pricing only when clarity allows.

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## Section Background Decision Tree

```
HERO?
  → bg + thin gold grid + very subtle radial glow

PROOF/RESULTS?
  → surface flat — data speaks, no decoration

PROBLEM?
  → bg flat — severity needs no decoration

PRICING/CTA?
  → bg + subtle gold radial → gold solid (final CTA)
```

---

## 4-Phase Emotional Arc (Trust Navy)

```
CREDIBILITY → PROBLEM → EVIDENCE → DECISION
(Authority)   (Pain)    (Proof)    (Offer)
```

| Phase | Background | Tone | Sections |
|-------|-----------|------|---------|
| **CREDIBILITY** | `bg` + thin grid | Authority, gravitas | Hero, credentials, track record |
| **PROBLEM** | `bg` flat | Heavy, serious | Pain points, costs of inaction |
| **EVIDENCE** | `surface` flat | Calm, data-driven | Results, case studies, numbers |
| **DECISION** | `surface` → `accent gold` | Decisive, clear | Pricing, guarantee, final CTA |

---

## Guardrails

- **No white/light backgrounds** — stays dark throughout
- **No blobs, no float animations, no bounce** — undermines authority
- **Border radius max 10px** — never more
- Gold: max 15% of elements on any section
- IBM Plex Serif on headlines: **non-negotiable identity marker**
- Fine print mandatory on financial claims (asterisk + `font-body text-xs` in subtle)
- All colors: `var(--token)` — no hardcoded hex

---

## Pattern Overrides

Trust Navy có 9 pattern overrides/additions trong `themes/trust-navy/patterns/`.

| Pattern file | Layout change | Điểm khác biệt chính |
|-------------|--------------|---------------------|
| `announcement-bar.html` | Không | Navy bg + gold left border + mono text (vs. colored bg) |
| `stats-bar.html` | **Data panel** | 4 dense data blocks + positive/negative coloring + "as of date" |
| `hero.html` | **2-col split** | Serif headline trái + performance metrics panel phải |
| `pricing-card.html` | **3-col table** | Horizontal comparison table (vs. single vertical card) |
| `countdown-cta.html` | **Enrollment close** | Date display thay timer countdown (vs. ticking clock) |
| `guarantee-card.html` | **Formal commitment** | "Our Commitment" framing + signature block (vs. shield graphic) |
| `testimonials.html` | **Case study rows** | Row layout + metrics inline + credential badge (vs. card grid) |
| `cta-strip.html` | **Gold strip** | Gold bg + dark-on-gold + minimal copy (vs. colored bg + form) |
| `trust-signals.html` | **New pattern** | Credentials/certifications/media logos bar (finance-specific) |

---

## Motion Style

**Intensity:** Subtle

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Metric / stat cards | `.card-lift` | 0.3s | On hover only — 2px lift, no color change, restraint is the signal |
| Section content blocks | `.reveal` | 0.6s | Standard scroll fade-up on all section content — the only entrance animation |
| Section items with stagger | `.delay-1` → `.delay-3` | 0.6s | Max 3 stagger steps — beyond that implies excitement, which breaks authority |
| Chart / data panel overlay | `.scan-line` | 5s | Very slow horizontal scan on data visualization panels only — suggests live data |
| Primary CTA button | `.btn-glow` | 3s | Slow gold glow pulse on CTA only — 1 CTA per page maximum |

### Theme motion rules

- Motion exists solely to guide attention to data and the CTA — not to entertain
- `.card-lift` on metric cards signals interactivity without energy — the authority comes from stillness
- `.scan-line` is used exclusively on charts or data panels to imply real-time or live market data
- `.btn-glow` uses `var(--accent)` gold — slow cycle (3s+) to feel deliberate, not urgent
- All `.reveal` animations use a single consistent easing — no mixing of durations across the page
- Stagger limited to `.delay-1` → `.delay-3` — 4+ steps read as playful

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-cyan`, `.blob-purple` — organic shapes destroy financial credibility
- `.shimmer-border` — too flashy, signals instability rather than authority
- `.float-sm`, `.float-gentle`, `.float-lg` — floating elements signal casualness
- `.orb-float` — decorative effect incompatible with data-driven, formal tone
- `.bg-mesh-animated` — animated backgrounds imply chaos, not calm authority
- `.icon-breathe` — subtle enough to consider, but still too "alive" for this theme's restraint
