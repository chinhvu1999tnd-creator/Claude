---
version: "2.1.0"
name: "Dark Bold Neon"
mood: "Sharp · Technical · Confident"
best_for: "AI tools, SaaS, marketing automation, agency, growth hacking, coaching B2B"
avoid_for: "Luxury, healthcare, children, traditional finance"

css_source: "themes/shared/base.css"
tailwind_config: "themes/dark-bold-neon/tailwind.config.js"
patterns_shared: "themes/patterns/*.html"
patterns_override: "themes/dark-bold-neon/patterns/*.html"
---

# Dark Bold Neon — Design Reference

## Colors (CSS Variables — do not hardcode hex in HTML)

```css
--accent:   #B6FF00  /* Lime neon — CTA, highlights, checkmarks */
--cyan:     #00C2FF  /* Cyan — secondary accent, links, icons    */
--purple:   #A855F7  /* Purple — hero glow, dramatic moments     */
--alert:    #ef4444  /* Red — danger, problems, old-way          */
--bg:       #141413  /* Page canvas — near black                 */
--surface:  #1c1c1a  /* Alternate sections, card backgrounds     */
--raised:   #222220  /* Cards on surface, dropdown, tooltip      */
--ink:      #f0f0ec  /* Primary text                             */
--body:     #c8c7bc  /* Body paragraph text                      */
--subtle:   #6b6b63  /* Labels, meta, muted text                 */
--faint:    #3a3a34  /* Dividers, disabled                       */
```

**In HTML:** always `style="color:var(--accent)"` or Tailwind `class="text-accent"`.
**Never:** `style="color:#B6FF00"` or `class="text-[#B6FF00]"`.

---

## Typography

| Role | Class | Spec |
|------|-------|------|
| Display headline | `font-display font-black text-display` | Inter Tight 900 · clamp(2.75rem→5.5rem) · lh 1.0 · ls -0.04em |
| Section H2 | `font-display font-black text-h2` | Inter Tight 800 · clamp(1.75rem→2.75rem) · lh 1.1 · ls -0.03em |
| Sub H3 | `font-display font-bold text-[1.125rem]` | Inter Tight 700 · 18px · lh 1.3 |
| Body | `font-body text-sm leading-relaxed` | Inter 400 · 15px · lh 1.75 |
| Label/eyebrow | `.section-label` | JetBrains Mono 500 · 10px · ls 0.12em · uppercase |
| Price/metric | `font-mono font-black` | JetBrains Mono 700 |
| Pull quote | `font-editorial italic` | Playfair Display 700 · italic · max 1×/page |

**Rule:** No heading weight < 700. Body text uses `var(--body)` not `var(--ink)`.

---

## Background Catalog

All classes defined in `themes/shared/base.css`.
Combine with a base `background-color` for section bg.

---

### A. Section base backgrounds

| Class | Visual | Use for |
|-------|--------|---------|
| `bg-canvas` (Tailwind) | `#141413` flat | Default page sections |
| `bg-surface` (Tailwind) | `#1c1c1a` flat | Alternate sections (every other) |
| *(inline)* `background:var(--accent)` | Lime solid | Final CTA section — max 1× per page |

**Rule:** Alternate `bg-canvas` / `bg-surface`. Never 3+ identical section backgrounds in a row.

---

### B. Grid line overlays

Add on top of any section background.

| Class | Pattern | Opacity feel |
|-------|---------|-------------|
| `.bg-grid` | 40px grid lines (H+V) | Very subtle — best on hero |
| `.bg-grid-lg` | 64px grid lines (H+V) | Spacious — for wide sections |
| `.bg-scanlines` | Horizontal only · 8px pitch | Technical feel, dark sections |
| `.bg-diagonal` | 45° stripes · 12px pitch | Use sparingly — edge decor |

```html
<!-- Example: surface section with grid overlay -->
<section class="py-24 bg-surface bg-grid">
```

---

### C. Dot grids

| Class | Pattern | Best for |
|-------|---------|----------|
| `.bg-dots` | 24px pitch · 1px dots | Clean data-viz sections |
| `.bg-dots-lg` | 40px pitch · 1.5px dots | Hero alt · large sections |
| `.bg-cross` | Double-offset dots (cross feel) | Feature sections |

```html
<section class="py-24 bg-canvas bg-dots">
```

---

### D. Radial glows (background-image overlays)

Layer on top of flat bg. These do not set `background-color` — always pair with a base.

| Class | Glow position | Best for |
|-------|---------------|----------|
| `.bg-glow-top` | Accent · ellipse top-center | Standard hero |
| `.bg-glow-center` | Accent · centered | Pricing, guarantee sections |
| `.bg-glow-cyan-tr` | Cyan · top-right | Features, split layouts |
| `.bg-glow-purple-tl` | Purple · top-left | Launch hero, dramatic opener |
| `.bg-glow-dual` | Accent TL + Cyan BR | Split-color hero |

```html
<!-- Purple hero with grid -->
<section class="relative min-h-screen bg-canvas bg-glow-purple-tl bg-grid">
```

---

### E. Animated blobs (floating circles)

Blobs are `position:absolute` elements inside a `relative overflow-hidden` container.

**Classes:**
- Color: `.blob-accent` `.blob-cyan` `.blob-purple` `.blob-alert`
- Size: `.blob-sm (200px)` `.blob-md (350px)` `.blob-lg (500px)` `.blob-xl (700px)`
- Animation (from tailwind config): `animate-blob` `animate-blob-2` `animate-blob-3`

```html
<section class="relative overflow-hidden bg-canvas">
  <div class="blob blob-purple blob-lg animate-blob" style="top:-100px;left:-80px;opacity:0.10"></div>
  <div class="blob blob-cyan blob-md animate-blob-2" style="bottom:-60px;right:-60px;opacity:0.08"></div>
  <!-- content -->
</section>
```

**Rule:** Max 3 blobs per section. Opacity `0.06–0.15`. Never overlap directly over text.

---

### F. Dot grow / pulse rings

For live indicators, CTA emphasis, metric highlights.

```html
<!-- Pulsing dot -->
<span class="dot-pulse w-2.5 h-2.5 rounded-full inline-block" style="background:var(--accent)"></span>

<!-- Floating orb behind heading -->
<div class="orb orb-accent orb-float w-40 h-40 absolute -top-10 left-1/2 -translate-x-1/2 opacity-30"></div>
```

**Classes:** `.dot-pulse` (rings expand out) · `.orb` + `.orb-accent/.orb-cyan/.orb-purple` · `.orb-float` (gentle bobbing)

---

### G. Mesh gradient

Full-section multi-point gradient. Rich, not chaotic.

| Class | Effect |
|-------|--------|
| `.bg-mesh` | Static 4-point purple/cyan/accent mesh |
| `.bg-mesh-animated` | Same + subtle hue shift loop |

```html
<section class="py-24 bg-canvas bg-mesh">
  <!-- Great for testimonial or mid-funnel "proof" sections -->
</section>
```

---

### H. Hero composite presets

Pre-built combinations for common hero patterns:

| Class | Composition | Use for |
|-------|-------------|---------|
| `.hero-purple` | Purple top + cyan BR + bg | Product launch, AI tools |
| `.hero-accent` | Lime top + cyan BR + bg | CTA heavy, green brand |
| `.hero-dual` | Purple TL + cyan TR + bg | Split-color dramatic open |

```html
<section class="relative min-h-screen hero-purple bg-grid overflow-hidden">
  <!-- + blobs as absolute children for depth -->
</section>
```

---

### I. Card backgrounds

Rule: **max 2 card background types in one section**. Never gradient card on gradient section.

| Class | When to use |
|-------|-------------|
| `.card-base` | Default — most cards |
| `.card-raised` | Cards on surface bg |
| `.card-accent` | Positive / included items |
| `.card-danger` | Problems / pain points |
| `.card-cyan` | Secondary features |
| `.card-featured` | Gradient border — 1 card per section (recommended / hero) |
| `.glass` | Overlay on hero/gradient bg — use sparingly |

---

## Section Background Decision Tree

```
Is this a HERO section?
  → hero-purple/accent/dual + bg-grid + 2–3 blobs

Is this a PROOF section (testimonials, results)?
  → bg-surface + bg-mesh OR bg-canvas + bg-dots

Is this a PROBLEM section?
  → bg-canvas + card-danger cards, NO background effects

Is this a FEATURE section?
  → bg-surface + bg-grid-lg, or bg-canvas + bg-glow-cyan-tr

Is this a PRICING/CTA section?
  → bg-canvas + bg-glow-center + card-featured for main card

Is this the FINAL CTA strip?
  → background:var(--accent) solid + 2 blobs accent-opacity:0.3
```

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero-grid` | Accent glow top + gridlines — tech feel for neon theme |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `.bg-stack-section` | Light accent + dots |
| Main content 2 (Grid/Agents/Solution) | `.bg-stack-section-grid` | Light accent + grid |
| Experience/Process/How it works | `.bg-stack-dual` | Dual glow + dots |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | `.hero-accent` (bright neon radial) | Override per theme — max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## Motion Rules

- **Hero entrance:** `.animate-fade-up` with stagger delays `.delay-1` → `.delay-5`
- **Section scroll:** `.reveal` + `.reveal.on` (IntersectionObserver)
- **Blob animation:** `animate-blob` / `animate-blob-2` / `animate-blob-3`
- **Live dot:** `.animate-live`
- **No:** auto-playing carousels, parallax scroll, entrance animations on every element

---

## Guardrails

- Grain overlay + top precision bar: **bắt buộc** (added by base.css `body::before/after`)
- Max **2 overlapping background effects** per section (e.g., flat color + grid = ok; flat + grid + mesh + blobs = too much)
- Blobs: max 3, opacity ≤ 0.15, never cover text
- Gradient border card: max **1 per section**
- Accent (lime) section bg: max **1 per page** (final CTA only)
- All colors: **`var(--token)`** in HTML — no hardcoded hex

---

## Section Background Phases

Landing page có conversion cao dùng **4 phase màu** theo arc cảm xúc — không xen kẽ ngẫu nhiên.

### 4 Phases

```
TENSION → SHIFT → TRUST → DESIRE
(Problem)  (Solution) (Proof) (Offer/CTA)
```

| Phase | Mục đích tâm lý | Background | Pattern overlay | Sections |
|-------|----------------|------------|-----------------|----------|
| **TENSION** | Tạo unease, reader nhận ra pain | `var(--bg)` flat | Không — để trống, nặng nề | Problem, Before/After, Qual "Not for" |
| **SHIFT** | Báo hiệu "có lối ra", hope | `var(--surface)` | `bg-grid` hoặc `bg-grid-lg` | How it works, Agents, Features, Process |
| **TRUST** | Calm authority, tin tưởng | `var(--bg)` hoặc `var(--surface)` | `bg-mesh` hoặc `bg-dots` | Results, Testimonials, Case study, Instructor, Reviews |
| **DESIRE** | Anticipation, urgency, muốn sở hữu | `var(--surface)` hoặc `var(--bg)` | `bg-glow-center` hoặc `bg-glow-top` | Offer stack, Pricing, Guarantee, Countdown CTA |

### Rules chống nồi lẩu

1. **Max 4 background modes** cho cả page — không thêm bất kỳ biến thể nào khác
2. Trong cùng một phase, chỉ thay đổi **pattern overlay** (grid/dots/mesh/glow) — không đổi base color
3. **Stats bar, Footer, Nav** = `var(--surface)` flat — không thuộc phase nào, trung tính
4. **Final CTA strip** = exception duy nhất — `var(--accent)` full (1 lần/page)
5. Transition giữa 2 phase phải qua ít nhất 1 section trung tính nếu cùng base color

### Section Background Map — Standard Flow

```
Ann bar + Nav       → surface flat (frame, không phase)
Hero                → bg-canvas + bg-glow-purple + bg-grid   [DESIRE — first hook]
Stats bar           → surface flat (neutral break)
─────────────────────────────────────────────────────
TENSION ZONE ↓
Problem cards       → bg-canvas flat (tối, nặng, không decoration)
Before/After        → bg-surface flat (nhẹ hơn 1 chút, vẫn tension)
─────────────────────────────────────────────────────
SHIFT ZONE ↓
Video demo          → bg-canvas + bg-grid (grid = technical credibility)
How it works        → bg-canvas + bg-grid (continuation)
Agents bento        → bg-surface + bg-grid (elevated)
Features/Bento      → bg-surface hoặc bg-canvas + bg-glow-cyan-tr
─────────────────────────────────────────────────────
TRUST ZONE ↓
Results gallery     → bg-canvas + bg-dots (calm, grounded)
Results counter     → bg-canvas + bg-glow-top (subtle uplift)
Testimonials        → bg-surface + bg-mesh (warm authority)
Instructor          → bg-canvas flat (personal, no distraction)
─────────────────────────────────────────────────────
DESIRE ZONE ↓
Qual / For-not-for  → bg-surface flat (qualification = logical, calm)
Offer item visual   → bg-canvas flat (focus on value)
Offer stack         → bg-canvas + bg-glow-center (center attention)
Pricing             → bg-surface + bg-glow-center (elevated desire)
Guarantee           → bg-canvas flat (trust anchor)
FAQ                 → bg-surface + bg-dots (calm reassurance)
Objections          → bg-canvas flat
Countdown CTA       → bg-canvas + bg-glow-top (max urgency)
─────────────────────────────────────────────────────
Footer              → bg-canvas flat
```

### Cách đọc phase khi generate Design Brief

```markdown
## [Section Name] — Phase: TENSION

Background: bg-canvas flat — KHÔNG thêm pattern (tension zone không decoration)
```

```markdown
## [Section Name] — Phase: SHIFT

Background: bg-surface + bg-grid — grid overlay tạo technical feel
```

```markdown
## [Section Name] — Phase: TRUST

Background: bg-canvas + bg-mesh — mesh gradient tạo warm authority
```

```markdown
## [Section Name] — Phase: DESIRE

Background: bg-surface + bg-glow-center — center glow tạo focal pull
```

---

## Pattern Overrides

Dark Bold Neon có 7 pattern overrides trong `themes/dark-bold-neon/patterns/`.

**Load rule:** Check `themes/dark-bold-neon/patterns/{file}.html` trước — nếu tồn tại, dùng override. Nếu không, fallback về `themes/patterns/{file}.html`.

| Pattern file | Điểm khác biệt chính | Khi nào dùng |
|-------------|---------------------|-------------|
| `announcement-bar.html` | Dark surface bg + neon text + live dot + mono font | Thay thế luôn cho dark pages |
| `stats-bar.html` | 4 dark raised cards + neon metric glow + scanlines | Proof sections, above fold |
| `pricing-card.html` | Neon box-shadow glow + price text-shadow + shimmer badge | Pricing section duy nhất |
| `countdown-cta.html` | Tất cả timer boxes glowing + seconds pulse + grid bg | Urgency, cart abandonment |
| `guarantee-card.html` | Pulsing ring + animated border + shield neon glow | Trust section sau pricing |
| `cta-strip.html` | Dark-on-neon button + oversized blobs + micro trust row | Final CTA (max 1×/page) |
| `testimonials.html` | Raised dark cards + neon result tag glow + oversized quote | Social proof section |

**Khi nào KHÔNG dùng override:**
- Pattern chưa có override → dùng shared (e.g. `hero.html`, `faq.html`, `instructor-bio.html`)
- Override quá nặng cho section neutral → dùng shared + CSS vars thông thường

---

## Motion Style

**Intensity:** Bold

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero background blobs | `.blob` + `animate-blob` / `animate-blob-2` / `animate-blob-3` | 8–14s | Purple + cyan blobs drift behind hero headline — opacity 0.08–0.12 |
| Featured pricing card | `.shimmer-border` | 3s | Neon shimmer on `.card-featured` only — 1 per section |
| Dashboard / workflow sections | `.scan-line` | 4s loop | Horizontal scan across technical panels and stats bar |
| Workflow step arrows / connectors | `.flow-line-h` | 2s | Left-to-right flow pulse on horizontal process arrows |
| Feature/bento section icons | `.icon-breathe` | 2.5s | Subtle scale pulse on feature icons — not every icon, key ones only |
| Orb behind hero H1 | `.orb-float` | 5s | Slow vertical bob on accent orb positioned behind main headline |
| Announcement bar live dot | `.animate-live` + `.dot-pulse` | 1.5s | Pulsing ring on "LIVE" or urgency indicator |
| Section entrance | `.reveal` + `.delay-1` → `.delay-4` | 0.6s | Staggered fade-up on scroll for section content blocks |
| CTA button | `.btn-glow` | 2s | Neon glow pulse on primary CTA — accent lime color |
| Mesh / proof sections | `.bg-mesh-animated` | 12s | Subtle hue-shift on testimonial / results section background |

### Theme motion rules

- All blob animations run continuously at reduced opacity — they establish atmosphere, not distract
- `.shimmer-border` is reserved exclusively for the `.card-featured` pricing card (max 1 per section)
- `.scan-line` only appears on sections with data, dashboards, or workflow diagrams — never on editorial sections
- `.flow-line-h` pulses in the direction of reading (left→right) to reinforce process flow
- Stagger delays follow `.delay-1` → `.delay-4` sequence — never skip steps, never use all 5 on same section
- `.btn-glow` uses `var(--accent)` (lime) — never override with cyan or purple on CTA

### Không dùng (off-limits cho theme này)

- `.float-lg` — too slow and gentle for this aggressive neon energy
- `.float-gentle` — feels soft/passive, contradicts the sharp technical mood
- `.card-lift-accent` on non-featured cards — dilutes the signal of the featured card
- Parallax scroll or auto-playing carousels — breaks the precision feel
