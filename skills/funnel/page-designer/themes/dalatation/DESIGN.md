---
version: "1.0.0"
name: "Dalatation"
mood: "Forest · Cozy · Escape"
best_for: "Homestay cabin, eco-lodge, nature retreat, camping, forest accommodation"
generated_from: "theme-generator · brand: Dalatation Homestay · 2025"
brand_color: "#4d7c5a"
avoid_for: "Tech, tài chính, y tế, thời trang đô thị"

css_source: "themes/shared/base.css"
tailwind_config: "themes/dalatation/tailwind.config.js"
patterns_shared: "themes/patterns/*.html"
patterns_override: "themes/dalatation/patterns/*.html"
---

# Dalatation — Design Reference

## Colors

```css
--accent:      #4d7c5a  /* Pine needle green — brand primary                 */
--accent-rgb:  77, 124, 90
--accent-text: #ffffff
--amber:       #c8842a  /* Campfire amber — warmth, CTA secondary, glow      */
--amber-rgb:   200, 132, 42
--mist:        #8fa899  /* Đà Lạt mist — cool secondary, subtle accents      */
--mist-rgb:    143, 168, 153
--alert:       #c0392b

--bg:          #131b10  /* Dark forest near-black with green tint             */
--surface:     #1a2416  /* Lighter forest dark                                */
--raised:      #22301d  /* Card backgrounds — warm dark                       */
--ink:         #eeeae0  /* Warm off-white — firelight on paper               */
--body:        #c4bfac  /* Warm beige grey — readable on dark                */
--subtle:      #7a9070  /* Muted forest green — labels, meta                 */
--faint:       #2d3d27  /* Dark green border                                  */
--rim:         rgba(77,124,90,0.25)  /* Pine green card borders              */
```

**In HTML:** `style="color:var(--accent)"` — never `style="color:#4d7c5a"`.

---

## Typography

| Role | Class | Spec |
|------|-------|------|
| Display headline | `font-display font-bold` | Fraunces 700 · clamp(2.25→4.5rem) · lh 1.08 |
| Italic emphasis | `font-display font-bold italic` | Fraunces 700 italic · cho tên địa điểm, cảm xúc |
| Section H2 | `font-display font-semibold` | Fraunces 600 · clamp(1.375→2rem) · lh 1.2 |
| Body | `font-body text-base leading-relaxed` | DM Sans 400 · 16px · lh 1.7 |
| Label/eyebrow | `.section-label` | DM Sans 500 · 10px · ls 0.14em · uppercase |
| Price/dates | `font-mono font-bold` | DM Mono 700 · accent color |

**Rule:** Fraunces italic để evoke cảm giác — "Rừng thông *Đà Lạt*", "Buổi sáng *sương mù*"
Không dùng quá 2 italic per section.

---

## Background Catalog

### Section bases
| style | Visual | Use |
|-------|--------|-----|
| `background:var(--bg)` | Dark forest | Default sections |
| `background:var(--surface)` | Lighter forest | Alternate sections |
| `background:var(--raised)` | Card bg | Embedded sections |
| `background:var(--accent)` | Pine green | Không dùng — quá tối |
| `background:var(--amber)` | Campfire amber | Final CTA — max 1×/page |

### Texture overlays — pine forest feel

```css
/* Grain texture — wood/paper artisan feel */
background-image: url("data:image/svg+xml,...");
opacity: 0.04;

/* Campfire radial glow — amber light from below */
background: radial-gradient(
  ellipse 60% 40% at 50% 100%,
  rgba(200,132,42,0.12) 0%, transparent 70%
), var(--bg);

/* Pine canopy — green glow from top */
background: radial-gradient(
  ellipse 80% 50% at 50% -10%,
  rgba(77,124,90,0.15) 0%, transparent 60%
), var(--bg);

/* Fog/mist overlay — Đà Lạt morning */
background: linear-gradient(
  180deg, rgba(143,168,153,0.08) 0%, transparent 40%
), var(--bg);

/* Fine grid — subtle, như lưới cabin window */
background-image:
  linear-gradient(rgba(77,124,90,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(77,124,90,0.04) 1px, transparent 1px);
background-size: 40px 40px;
```

### Card backgrounds
| style | When |
|-------|------|
| `background:var(--raised);border:1px solid var(--faint)` | Default card |
| `background:var(--raised);border:1px solid var(--rim)` | Featured card |
| `border-top:2px solid var(--accent)` | Room/cabin highlight |
| `background:rgba(200,132,42,0.08);border:1px solid rgba(200,132,42,0.25)` | Campfire card (CTA area) |

---

## Visual Vocabulary

### Nature motifs
- Pine branch / pine cone SVG — corner decorations, section dividers
- Mountain silhouette — hero background
- Fog/mist shapes — soft organic forms
- Fire/flame — CTA area (campfire amber)
- Leaf/needle cluster — list item bullets
- Wood grain lines — section separators

### Pine green usage
- Checkmarks, availability indicators
- Section labels
- Key data points (room count, rating)
- Hover states on cards

### Amber usage (campfire)
- Final CTA button và section
- "Còn phòng" / "Đặt ngay" urgency
- Star ratings (warmth signal)
- Price numbers (value warmth)

### Shadows
```css
/* Card default — forest depth */
box-shadow: 0 4px 24px rgba(0,0,0,0.35);

/* Featured room — pine glow */
box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(77,124,90,0.15);

/* CTA button — amber warmth */
box-shadow: 0 4px 20px rgba(200,132,42,0.40);
```

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | Pine green left border accent |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Pine green glow top + dots — `--accent-rgb: 77,124,90` |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 | `.bg-stack-section` | Light pine accent + dots — rooms/cabin section |
| Main content 2 | `.bg-stack-section-grid` | Light pine accent + grid — amenities/cabin window |
| Experience/Process | `.bg-stack-dual` | Dual pine glow + dots — activities/experiences |
| Testimonials/Reviews | `.bg-stack-trust` | Pine glow from bottom + dots — guest stories |
| Pricing/Offer | `.bg-stack-cta` | Pine center glow + grid — booking/pricing |
| Guarantee | `var(--surface)` flat | No distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip | `var(--amber)` solid campfire | Campfire amber — already defined, max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Xen kẽ stacked ↔ flat. All `.bg-stack-*` glows use `--accent-rgb: 77,124,90` (pine green) automatically via CSS vars — no override needed. CTA Strip uses `var(--amber)` solid as the campfire close.

---

## 4-Phase Emotional Arc (Dalatation)

```
ESCAPE → DISCOVER → TRUST → BOOK
(Yearn)  (Explore)  (Proof) (Action)
```

| Phase | Bg | Overlay | Sections |
|-------|----|---------|----|
| **ESCAPE** | `bg` + pine glow | Grain | Hero — gợi cảm giác thoát khỏi thành phố |
| **DISCOVER** | `surface` flat | None | Rooms, amenities, experiences |
| **TRUST** | `bg` flat | None | Reviews, testimonials, host story |
| **BOOK** | `surface` → amber | Campfire radial | Pricing, availability, CTA |

---

## Pattern Overrides

| Pattern | Layout | Điểm khác biệt |
|---------|--------|----------------|
| `announcement-bar.html` | Không | Pine green border + "Còn X cabin" availability |
| `hero.html` | **Full-screen** | Mountain/pine SVG background + fog overlay + full-bleed |
| `stats-bar.html` | Không | Dark raised cards + amber/pine numbers |
| `room-showcase.html` | **New** | Cabin/room cards với photo slot + amenity tags + price/đêm |
| `testimonials.html` | **Story cards** | Guest story + duration stay + season badge |
| `guarantee-card.html` | Không | Pine-bordered card, friendly promise language |
| `cta-strip.html` | **Amber** | Campfire amber bg + grain + booking form |
| `countdown-cta.html` | **Availability** | Room availability calendar thay countdown clock |
| `experience-grid.html` | **New** | Activities/experiences grid: hiking, campfire, cắm trại... |

---

## Guardrails

- **Không dùng màu sáng làm bg** — theme này là dark forest, không light mode
- **Amber sparingly** — max 2 sections per page (campfire = special, không everyday)
- **Pine green** cho positive signals (available, included, checkmark)
- **Fraunces italic** cho emotional moments — không quá dùng
- **Grain texture** opacity ≤ 0.05 — subtle wood/paper feel
- **Photos/media slots** — warm filter: `filter: saturate(1.1) sepia(0.1) brightness(0.9)`
- All colors: `var(--token)` — no hardcoded hex

---

## Motion Style

**Intensity:** Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Pine branch / pine cone SVG corner decorations | `.float-sm` | 6s | Gentle sway — pine branches move in mountain wind, not bounce |
| Milestone / journey timeline | `.flow-line-v` | 3s | Vertical flow with amber override: `style="--accent-rgb:200,132,42"` — campfire warmth runs down the timeline |
| Campfire / flame SVG elements | `flicker` (Tailwind) | — | Uses the `flicker` animation already defined in `tailwind.config.js` — do not replace with base.css classes |
| Cabin / room cards | `.card-lift` | 0.25s | Warm lift on hover — inviting, not aggressive |
| Ambient background glow orbs | `.orb-float` | 8s | 2 orbs: one pine-green behind hero, one amber behind CTA section, very low opacity (0.10) |
| Section scroll entry | `.reveal` | 0.6s | All sections fade-up on scroll entry |
| Room grid stagger | `.reveal .delay-1/2/3/4` | 0.6s | Cabins reveal one by one — like discovering rooms in a forest lodge |
| Pine branch secondary delay | `.float-delay-1` / `.float-delay-2` | 7s | Offset float timing on separate pine decorations — they sway independently |

### Theme motion rules

- All motion should evoke nature: wind through pines, fire flickering, mist drifting — never mechanical or digital
- `.flow-line-v` on the timeline MUST override `--accent-rgb` to amber (`200,132,42`) so the flow line pulses in campfire warmth, not pine green
- The `flicker` animation from `tailwind.config.js` is the canonical campfire effect — do not substitute with `.icon-breathe` or `.dot-pulse`
- Orbs stay in the deep background (`z-index: 0`), pine green behind hero, amber behind the booking/CTA section — they simulate the radial glow overlays defined in Background Catalog
- `.float-sm` on pine SVGs should use a subtle horizontal component (slight `translateX` in the keyframe) to simulate wind sway, not just vertical bob
- Card hover lift is warm and welcoming: `transition: transform 0.25s ease, box-shadow 0.25s ease` — unhurried, like a cabin door opening

### Không dùng (off-limits cho theme này)

- `.scan-line` — cold technical readout is completely wrong for a cozy forest escape
- `.shimmer-border`, `.shimmer-border-slow` — neon shimmer breaks the dark organic aesthetic
- `.btn-glow` — glowing buttons look digital/neon; campfire warmth uses `box-shadow` amber glow defined in DESIGN.md shadows, not this class
- `.bg-mesh-animated` — animated grid mesh is too urban/tech for a forest cabin
- `.blob-cyan`, `.blob-purple` — these colors do not exist in this palette and would break the forest mood
- `.card-lift-accent` — accent-tinted lift would add coral/accent color bleed; use only plain `.card-lift`
- Any fast-onset animation under 0.2s — urgency is not part of this retreat's vocabulary
