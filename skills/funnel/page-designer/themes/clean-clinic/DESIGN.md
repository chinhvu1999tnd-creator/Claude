# Clean Clinic — Design Reference

**Theme name:** clean-clinic
**Mood:** Safe · Clinical · Trustworthy · Reassuring
**Best for:** Medical clinic, pharmacy, dentistry, wellness center, health coaching, supplements
**Avoid:** Tech, luxury, food/beverage, aggressive marketing

---

## Color System

```css
:root {
  --accent:      #0fa37f;  /* Teal — primary trust color */
  --accent-rgb:  15, 163, 127;
  --accent-text: #ffffff;
  --blue:        #2563eb;  /* Medical blue — secondary */
  --blue-rgb:    37, 99, 235;
  --alert:       #dc2626;  /* Red — warnings ONLY */
  --alert-rgb:   220, 38, 38;
  --positive:    #16a34a;  /* Green — healthy outcomes */
  --bg:          #f8fffe;  /* Near-white with teal tint */
  --surface:     #f0faf8;  /* Light teal surface */
  --raised:      #e6f7f4;  /* Card on surface */
  --ink:         #0d2b24;  /* Dark teal-black — headings */
  --body:        #1f5c4e;  /* Teal-tinted body text */
  --subtle:      #5a8f85;  /* Muted teal — secondary text */
  --faint:       #c8e8e3;  /* Light teal border */
  --rim:         rgba(15,163,127,0.18);
}
```

### Color Usage Rules

| Token | Use | Never use for |
|-------|-----|---------------|
| `--accent` | Primary CTA, checkmarks, highlights, active states | Backgrounds of full sections |
| `--blue` | Secondary buttons, info badges, links | Main CTA |
| `--alert` | Warnings, dosage caution, contraindication | Decorative, promotion urgency |
| `--positive` | Success, improvement metrics, outcomes | General accent |
| `--bg` | Page background | Dark sections |
| `--surface` | Alternating section background | Headers, footers (use white) |
| `--raised` | Cards placed on `--surface` backgrounds | Cards on white (use white + shadow) |
| `--ink` | H1, H2, H3 — primary headings | Body text (use --body) |
| `--body` | Body copy, paragraph text | Captions (use --subtle) |
| `--subtle` | Captions, meta, disclaimers, placeholders | Headings |
| `--faint` | Dividers, subtle borders, separators | Text |

---

## Typography

**Rule: Inter for everything — one font, total consistency. Clinical trust = visual uniformity.**

```
Font: Inter (Google Fonts)
Weights: 400 (body), 500 (label/caption), 600 (subheading/button), 700 (heading), 800 (hero)
No italic decoratives. No serif. No display fonts. Inter only.
```

### Type Scale

| Role | Size | Weight | Color | Line Height |
|------|------|--------|-------|-------------|
| Hero H1 | clamp(2.25rem, 5vw, 3.5rem) | 800 | `--ink` | 1.1 |
| H2 Section | clamp(1.75rem, 3.5vw, 2.5rem) | 700 | `--ink` | 1.2 |
| H3 Card | clamp(1.25rem, 2vw, 1.75rem) | 600 | `--ink` | 1.3 |
| Body Large | 1.125rem | 400 | `--body` | 1.7 |
| Body | 1rem | 400 | `--body` | 1.7 |
| Caption / Meta | 0.875rem | 500 | `--subtle` | 1.6 |
| Micro / Disclaimer | 0.75rem | 400 | `--subtle` | 1.5 |
| Badge / Label | 0.75rem | 600 | varies | 1 |
| Stat Number | clamp(2rem, 4vw, 3rem) | 800 | `--accent` | 1 |

---

## Backgrounds

**Rule: NO dark sections. NO colored strips. Alternating white / teal-surface only.**

| Section Type | Background | Usage |
|-------------|------------|-------|
| Default | `--bg` (#f8fffe) | Most sections |
| Alternating | `--surface` (#f0faf8) | Every other content section |
| Card on White | white + `box-shadow: 0 2px 12px rgba(13,43,36,0.06)` | Cards on bg/white |
| Card on Surface | `--raised` (#e6f7f4) | Cards on surface sections |
| Nav | white | Always white |
| Footer | white | Always white |

---

## Border Radius

```css
/* Buttons */
border-radius: 8px;

/* Cards, form inputs */
border-radius: 12px;

/* Large cards, hero containers */
border-radius: 16px;

/* Pills / badges */
border-radius: 99px;
```

---

## Shadows

```css
/* Card shadow — barely visible, clinical */
box-shadow: 0 2px 12px rgba(13,43,36,0.06);

/* Card hover */
box-shadow: 0 4px 20px rgba(13,43,36,0.10);

/* Focus ring */
box-shadow: 0 0 0 3px rgba(15,163,127,0.25);

/* Elevated panel */
box-shadow: 0 8px 32px rgba(13,43,36,0.08);
```

---

## Card Styles

### Standard Card (on white bg)
```css
background: white;
border-radius: 12px;
box-shadow: 0 2px 12px rgba(13,43,36,0.06);
padding: 24px;
border: 1px solid var(--faint);
```

### Surface Card (on teal-surface bg)
```css
background: var(--raised);
border-radius: 12px;
border: 1px solid var(--faint);
padding: 24px;
/* No shadow — already elevated by color */
```

### Stat Card
```css
background: white;
border-radius: 12px;
border-top: 2px solid var(--accent);
box-shadow: 0 2px 12px rgba(13,43,36,0.06);
padding: 24px;
text-align: center;
```

### Feature Card
```css
background: white;
border-radius: 12px;
border: 1px solid var(--faint);
padding: 28px;
/* Icon: 40px teal circle, white icon */
```

---

## Certification Badge Style

Certifications must be **prominently displayed** — they are the primary trust signal.

```css
/* Credential card */
.credential-card {
  background: white;
  border: 1px solid var(--faint);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Badge icon */
.credential-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* License number */
.credential-number {
  font-size: 0.75rem;
  color: var(--subtle);
  font-weight: 500;
  font-family: Inter, sans-serif;
  letter-spacing: 0.02em;
}
```

---

## Medical Disclaimer Rules

**All medical claims MUST have a disclaimer line immediately below.**

```html
<!-- Pattern -->
<p class="claim">Tỉ lệ thành công điều trị: 98%</p>
<p class="disclaimer">* Dữ liệu nội bộ từ 8,500 ca điều trị tại SmileCare 2019–2025. Kết quả có thể khác nhau theo từng bệnh nhân.</p>
```

```css
.disclaimer {
  font-size: 0.75rem;
  color: var(--subtle);
  line-height: 1.5;
  margin-top: 8px;
  font-style: normal; /* Never italic for disclaimers */
}
```

**Disclaimer placement:**
- Below stat numbers showing success rates
- Below before/after panels
- Below testimonials ("Individual results may vary")
- Below guarantee claims
- In footer: full legal medical disclaimer

---

## Section Rhythm — Background Mapping

| Section | Background class | Note |
|---------|-----------------|------|
| Announcement bar | `var(--surface)` flat | No pattern |
| Nav | `var(--bg)` transparent on scroll | No pattern |
| Hero | `.bg-stack-hero` | Exception — very subtle use only; accent tint barely visible on light bg |
| Stats bar | `var(--surface)` flat | Clean, no distraction |
| Main content 1 (Rooms/Features/Problem) | `var(--bg)` flat | NO bg-stack — too decorative for clinical context |
| Main content 2 (Grid/Agents/Solution) | `var(--surface)` flat | Flat only — clinical trust = visual uniformity |
| Experience/Process/How it works | `var(--bg)` flat | Flat — clinical sections use no patterns |
| Testimonials/Reviews | `var(--surface)` flat | Flat — patient testimonials need clean, undecorated space |
| Pricing/Offer | `var(--surface)` flat | Flat — transparency over decoration |
| Guarantee | `var(--bg)` flat | Trust, no distraction |
| FAQ | `var(--surface)` flat | Clean |
| CTA Strip (final) | Accent solid | Override per theme — teal accent bg, max 1×/page |
| Footer | `var(--bg)` flat | No pattern |

**Note (clean-clinic theme):** NO bg-stack — too decorative for a clinical context. Only flat `var(--bg)` and `var(--surface)`. The one exception is the Hero, which may use `.bg-stack-hero` very subtly (overlay opacity ≤ 0.04) if a gentle depth cue is needed. All other sections must be flat. Clinical trust = visual uniformity.

**Section padding:**
```css
section {
  padding: 80px 24px;
}

@media (max-width: 768px) {
  section {
    padding: 48px 20px;
  }
}
```

**Rule:** Không dùng 2 section liền nhau cùng loại background. Phải xen kẽ `var(--bg)` ↔ `var(--surface)` và stacked ↔ flat.

---

## Button Styles

### Primary CTA (Teal Filled)
```css
background: var(--accent);
color: var(--accent-text);
border-radius: 8px;
padding: 14px 28px;
font-weight: 600;
font-size: 1rem;
font-family: Inter, sans-serif;
border: none;
cursor: pointer;
transition: background 0.2s ease, box-shadow 0.2s ease;
```
Hover: `background: #0d9270; box-shadow: 0 4px 16px rgba(15,163,127,0.30);`

### Secondary / Ghost (Teal Outline)
```css
background: transparent;
color: var(--accent);
border: 2px solid var(--accent);
border-radius: 8px;
padding: 12px 26px;
font-weight: 600;
font-size: 1rem;
font-family: Inter, sans-serif;
```
Hover: `background: var(--surface);`

### Tertiary (Medical Blue)
```css
background: var(--blue);
color: white;
border-radius: 8px;
padding: 14px 28px;
font-weight: 600;
```

---

## 4-Phase Content Arc

### Phase 1: Problem (Sections 1–2)
- Announcement bar with credential signal
- Hero headline names the pain/desire
- Do NOT list symptoms aggressively — clinical tone
- Example: "Nụ cười không đẹp ảnh hưởng sự tự tin của bạn" — state softly

### Phase 2: Solution (Sections 3–5)
- Stats prove track record (patients, years, success rate)
- Services show what is offered clearly
- No hype language — clinical, factual

### Phase 3: Credentials (Sections 6–7)
- Certifications, licenses, board memberships (most important trust section)
- Testimonials with condition + outcome metrics (NOT emotional marketing)
- "Verified patient" labels required

### Phase 4: Reassurance (Sections 8–12)
- Pricing transparent (no hidden fees messaging)
- Guarantee — written clinically, not aggressively
- Quota CTA — scarcity as availability limit (honest), not artificial urgency
- FAQ — answers real medical questions patients have
- Footer with full medical disclaimer

---

## Animation Guidelines

**Rule: Fade-up only. No bounce, no float, no pulse, no rotation.**

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Scroll reveal */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
[data-reveal].visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Stagger delay:** 100ms between items in a grid.
**Never animate:** shadows, colors, borders — clinical stability.

---

## Motion Style

**Intensity:** Subtle

### Element → Animation mapping

| Element | Class | Duration | Notes |
|---------|-------|----------|-------|
| Section content blocks | `.reveal` | 0.5s | Scroll fade-up — the primary and nearly only entrance animation |
| Grid items with stagger | `.delay-1` → `.delay-3` | 0.5s | 100ms increments, max 3 steps — mirrors the existing stagger guideline |
| Service / feature cards on hover | `.card-lift` | 0.2s | Clean 2px lift on hover — functional feedback, not decorative |
| "Còn chỗ" / appointment availability | `.dot-pulse` | 1.5s | Teal pulsing ring on availability indicators ONLY — signals real-time, not urgency |

### Theme motion rules

- `.reveal` is the only scroll-triggered entrance animation — do not add float, bounce, or scale variants
- `.card-lift` provides the only hover feedback — no color transitions, no glow, no shadow color change on hover
- `.dot-pulse` must use `var(--accent)` teal color — it signals availability/live status, never urgency
- `.dot-pulse` placement: "Còn X chỗ" slot availability chips and "Đang mở cửa" operational status only
- All stagger delays cap at `.delay-3` — beyond that reads as entertainment rather than information
- No animation duration under 0.2s or over 0.7s — stay within clinical precision band

### Không dùng (off-limits cho theme này)

- `.blob`, `.orb-float`, `.bg-mesh-animated` — organic/ambient animations break clinical trust
- `.shimmer-border`, `.shimmer-border-slow` — flashy borders undermine medical credibility
- `.float-sm`, `.float-gentle`, `.float-lg` — floating elements feel unstable, wrong for healthcare
- `.scan-line` — implies surveillance/scanning which has negative medical connotations
- `.flow-line-h`, `.flow-line-v` — pipeline/process animations feel industrial, not clinical
- `.btn-glow` — glowing CTA feels aggressive and promotional, contradicts clinical restraint
- `.icon-breathe` — pulsing icons introduce energy that patients may associate with alarm
