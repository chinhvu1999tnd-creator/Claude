---
version: "1.0.0"
name: "Bright Learn"
mood: "Approachable · Energetic · Clear"
best_for: "Khóa học online, e-learning, kỹ năng số, coaching cá nhân, giáo dục trẻ em, chứng chỉ nghề"
avoid_for: "Luxury, tài chính nghiêm túc, B2B enterprise, y tế lâm sàng"

css_source: "themes/shared/base.css"
tailwind_config: "themes/bright-learn/tailwind.config.js"
patterns_shared: "themes/patterns/*.html"
patterns_override: "themes/bright-learn/patterns/*.html"
---

# Bright Learn — Design Reference

## Colors (CSS Variables — do not hardcode hex in HTML)

```css
--accent:      #6c47ff  /* Purple vivid — CTA, progress, highlights    */
--accent-rgb:  108, 71, 255
--orange:      #ff9f43  /* Warm orange — urgency, secondary CTA, badges */
--orange-rgb:  255, 159, 67
--teal:        #00b8a9  /* Teal — success, checkmarks, completions       */
--teal-rgb:    0, 184, 169
--alert:       #ff4757  /* Red — pain points, problems, "not for"        */
--alert-rgb:   255, 71, 87

--bg:          #ffffff  /* Page canvas — pure white                      */
--surface:     #f7f5ff  /* Alternate sections — light purple tint        */
--raised:      #ede9ff  /* Cards on surface — slightly deeper purple     */
--ink:         #1a1033  /* Primary text — deep purple-black              */
--body:        #4a4560  /* Body paragraph — medium purple-grey           */
--subtle:      #8a86a0  /* Labels, meta, muted                           */
--faint:       #d8d4ef  /* Dividers, borders, disabled                   */
--rim:         rgba(108,71,255,0.12)  /* Card borders — accent-tinted    */
```

**In HTML:** always `style="color:var(--accent)"` — never `style="color:#6c47ff"`.

---

## Typography

| Role | Class | Spec |
|------|-------|------|
| Display headline | `font-display font-extrabold` | Plus Jakarta Sans 800 · clamp(2.5→5rem) · lh 1.05 · ls -0.035em |
| Section H2 | `font-display font-bold` | Plus Jakarta Sans 700 · clamp(1.5→2.25rem) · lh 1.15 |
| Sub H3 | `font-display font-semibold` | Plus Jakarta Sans 600 · 1.25rem · lh 1.3 |
| Body | `font-body text-sm leading-relaxed` | Inter 400 · 15px · lh 1.75 |
| Label/eyebrow | `.section-label` | Plus Jakarta Sans 600 · 11px · ls 0.08em · uppercase |
| Price/metric | `font-mono font-bold` | DM Mono 700 |

**Rule:** Headings weight min 700. Body text `var(--body)`. No italic except pull quotes.

---

## Background Catalog

### A. Section base backgrounds

| Class/style | Visual | Use for |
|-------------|--------|---------|
| `background:var(--bg)` | White flat | Default sections |
| `background:var(--surface)` | Light purple tint | Alternate sections |
| `background:var(--accent)` | Purple solid | Final CTA — max 1×/page |
| `background:var(--orange)` | Orange solid | Urgency banner only |

**Rule:** Alternate white / light-purple. Never 3+ identical in a row.

---

### B. Subtle background accents

```css
/* Soft radial glow — very subtle for light theme */
background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,71,255,0.06) 0%, transparent 70%), var(--bg);

/* Surface with soft top gradient */
background: linear-gradient(180deg, rgba(108,71,255,0.04) 0%, transparent 40%), var(--surface);

/* Orange warmth for urgency sections */
background: radial-gradient(ellipse 50% 40% at 50% 100%, rgba(255,159,67,0.08) 0%, transparent 70%), var(--bg);
```

**Rule:** Max opacity 0.08 for overlays on light theme — heavier = visually muddy.

---

### C. Card backgrounds

| Class/style | When to use |
|-------------|-------------|
| `background:var(--bg); border:1px solid var(--rim)` | Default card on surface |
| `background:var(--surface)` with accent border | Feature highlight card |
| `background:var(--raised)` | Cards on white bg |
| Accent border top + white bg | Featured / recommended card |
| Orange bg pill/badge | Urgency, bonus, limited |

---

## Visual Vocabulary

### Checkmarks
- Use teal `var(--teal)` for curriculum items, completions, guarantees
- Use accent purple for "For" items
- Use alert red for "NOT for" / pain points

### Progress indicators
- Progress bars in accent purple — show curriculum completion preview
- Step numbers in filled accent circles

### Badges & pills
- Rounded-full, 10px padding — very rounded vs. dark-bold-neon
- Orange badge for urgency/bonus ("HOT", "Mới", "Kết thúc sớm")
- Purple badge for quality ("Bestseller", "Đề xuất")
- Teal badge for completion ("Chứng chỉ", "Kèm dự án thực tế")

### Shadows (light theme)
```css
/* Card hover / featured card */
box-shadow: 0 8px 32px rgba(108,71,255,0.12), 0 2px 8px rgba(0,0,0,0.05);

/* CTA button */
box-shadow: 0 4px 20px rgba(108,71,255,0.35);

/* Subtle card — default */
box-shadow: 0 2px 12px rgba(0,0,0,0.06);
```

**Rule:** Never use `text-shadow` or `box-shadow` with neon intensity — this is a light theme.

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Accent glow top + dots — accent shows as purple tint on light theme |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `.bg-stack-section` | Light accent + dots |
| Main content 2 (Grid/Agents/Solution) | `.bg-stack-section-grid` | Light accent + grid |
| Experience/Process/How it works | `.bg-stack-dual` | Dual glow + dots |
| Testimonials/Reviews | `.bg-stack-trust` | Bottom glow + dots |
| Pricing/Offer | `.bg-stack-cta` | Center glow + grid |
| Guarantee | `var(--surface)` flat | Trust, no distraction |
| FAQ | `var(--bg)` flat | Clean |
| CTA Strip (final) | Orange/accent solid | Override per theme — max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Note (light theme):** bg-stack classes work on light themes too — accent color shows as a subtle tint. Max overlay opacity 0.06 to stay clean and readable.

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## Section Background Decision Tree

```
HERO section?
  → white bg + subtle purple radial top + floating shape

PROOF section (results, social proof)?
  → surface (light purple) flat

PROBLEM/PAIN section?
  → white flat — stark, clean, no decoration

FEATURE/CURRICULUM section?
  → white flat, accent left-border on items

PRICING/CTA section?
  → white + soft orange glow OR purple solid (final CTA)

FAQ/GUARANTEE?
  → surface flat
```

---

## Pattern Overrides

Bright Learn có 9 pattern overrides/additions trong `themes/bright-learn/patterns/`.

**Load rule:** Check `themes/bright-learn/patterns/{file}.html` trước — nếu tồn tại, dùng override. Nếu không, fallback về `themes/patterns/{file}.html`.

| Pattern file | Layout change | Điểm khác biệt chính |
|-------------|--------------|---------------------|
| `announcement-bar.html` | Không | Orange urgency bg + white live dot (vs. neon lime) |
| `stats-bar.html` | Không | White dividers + accent/teal/orange numbers + no glow |
| `hero.html` | **2-col split** | Text trái + floating result cards phải (vs. dark centered) |
| `pricing-card.html` | Không | Purple 2px border + soft shadow + teal ticks (vs. neon glow) |
| `countdown-cta.html` | **Side-by-side** | Timer trái + CTA phải — trong white card (vs. stacked dark) |
| `guarantee-card.html` | **2-col** | Teal seal icon trái + text phải (vs. centered pulsing neon) |
| `testimonials.html` | **2-col masonry** | White cards + star ratings + colored result badges |
| `cta-strip.html` | **2-col split** | Text+trust trái + registration form phải (vs. centered) |
| `curriculum-progress.html` | **New** | Accordion + progress bars + lesson list (education-specific) |

---

## Motion Rules

- **Entrance:** `.fade-up` with stagger — gentler than dark-bold-neon
- **Floating elements:** `animate-float` for hero decorations (emoji cards, result badges)
- **No blob animations** — blobs feel too "techy" for education
- **Hover states:** `hover:shadow-lg hover:-translate-y-0.5` on cards — subtle lift

---

## Guardrails

- No dark backgrounds except inside code blocks if showing code
- No neon glow, no text-shadow
- Border radius: minimum 10px for buttons, 16px for cards
- Accent purple on white bg = ✅ | Accent purple on surface = ✅ | Too many accent colors on same section = ❌
- Orange used sparingly (max 2 elements per page) — urgency only
- All colors: `var(--token)` in HTML — no hardcoded hex

---

## 4-Phase Emotional Arc (Bright Learn)

```
TENSION → SHIFT → TRUST → DESIRE
(Problem)  (Method) (Proof) (Offer)
```

| Phase | Background | Overlay | Sections |
|-------|-----------|---------|---------|
| **TENSION** | `var(--bg)` white flat | Không | Problem cards, "Bạn có đang..." |
| **SHIFT** | `var(--surface)` light purple | Soft top gradient | How it works, Curriculum, Steps |
| **TRUST** | `var(--bg)` white flat | Không | Results, Testimonials, Instructor |
| **DESIRE** | `var(--surface)` → `var(--accent)` | Orange glow bottom | Pricing, Guarantee, Countdown, CTA |

---

## Motion Style

**Intensity:** Medium

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Hero illustration / floating result cards | `.float-sm` | 3.5s | Gentle vertical bob on decorative cards and badge elements in hero right panel |
| Hero secondary illustration element | `.float-delay-2` | 3.5s | Offset float for layered depth — stagger with `.float-sm` |
| Course / feature cards | `.card-lift` | 0.25s | On hover — lift + shadow increase, reinforces "pick me" energy |
| Curriculum progress flow | `.flow-line-v` | 1.8s | Top-to-bottom pulse on vertical curriculum step connector lines |
| Feature list items | `.reveal` + `.delay-1` → `.delay-4` | 0.55s | Staggered fade-up — each bullet/feature enters in sequence |
| Section headings and content blocks | `.reveal` | 0.55s | Standard scroll reveal for all major section content |
| Primary CTA button | `.btn-glow` | 2.5s | Soft purple glow pulse — less aggressive than neon themes |
| Live/urgency dot | `.dot-pulse` | 1.5s | On "Còn X chỗ" or countdown active state only |

### Theme motion rules

- All float animations use `.float-sm` — never `.float-lg` (too heavy for light education theme)
- `.flow-line-v` runs on curriculum progress lines to imply forward learning momentum
- `.card-lift` applies uniformly to all course cards — every card should feel interactive and inviting
- Stagger on feature lists uses `.delay-1` → `.delay-4` max — groups of 4, then reset
- `.btn-glow` color inherits from `var(--accent)` purple — warm and motivating, not alarming
- No blob or orb animations — these feel too "techy" and break the approachable education mood

### Không dùng (off-limits cho theme này)

- `.blob`, `.blob-accent`, `.blob-purple` — techy atmosphere, wrong for education
- `.scan-line` — clinical/tech aesthetic that clashes with friendly learning tone
- `.shimmer-border` — too dramatic, undermines calm pedagogical authority
- `.flow-line-h` — curriculum flow is vertical, not horizontal
- `.bg-mesh-animated` — too visually complex for a light/white theme
