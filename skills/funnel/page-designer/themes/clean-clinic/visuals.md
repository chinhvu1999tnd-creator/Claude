# Clean Clinic — Visual Language Guide

---

## Icon System

**Style: Clean line icons — 1.5px stroke, no fill, rounded caps.**
**Color: `var(--accent)` teal for medical icons. `var(--subtle)` for UI icons.**
**Size: 24px standard, 40px feature icons, 20px inline.**

### Medical Icon Set (SVG, 24x24, 1.5px stroke)

**Stethoscope** — auscultation, general practice, diagnosis
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4.8 2.4A2.4 2.4 0 0 0 2.4 4.8v4.8a7.2 7.2 0 0 0 7.2 7.2"/>
  <path d="M9.6 16.8a7.2 7.2 0 0 0 7.2-7.2V4.8A2.4 2.4 0 0 0 14.4 2.4"/>
  <circle cx="17.4" cy="18" r="3.6"/>
  <line x1="9.6" y1="16.8" x2="9.6" y2="18"/>
</svg>
```

**Heart** — cardiology, health tracking, wellness
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>
```

**Shield-Check** — certification, protection, safety guarantee
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <polyline points="9,12 11,14 15,10"/>
</svg>
```

**Pill** — pharmacy, medication, supplements
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10.5 20H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h6.5"/>
  <path d="M13.5 4H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-6.5"/>
  <line x1="2" y1="12" x2="22" y2="12"/>
  <path d="M3 8h18"/>
  <path d="M3 16h18"/>
</svg>
```

**Tooth** — dentistry, oral health
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2C8.5 2 6 4.5 6 7c0 1 .4 2 .8 3L9 21a1 1 0 0 0 2 0v-4h2v4a1 1 0 0 0 2 0l2.2-11c.4-1 .8-2 .8-3 0-2.5-2.5-5-6-5z"/>
</svg>
```

**Microscope** — laboratory, diagnostics, research
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 18h8"/>
  <path d="M3 22h18"/>
  <path d="M14 22a7 7 0 1 0 0-14h-1"/>
  <path d="M9 14h2"/>
  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/>
  <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
</svg>
```

**Cross / Medical** — emergency, first aid, medical facility
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="3"/>
  <line x1="12" y1="8" x2="12" y2="16"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>
```

**Clipboard** — medical records, examination, checklist
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  <line x1="9" y1="12" x2="15" y2="12"/>
  <line x1="9" y1="16" x2="12" y2="16"/>
</svg>
```

**Calendar** — appointment booking, scheduling
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
```

**Award** — certification, achievement, accreditation
```svg
<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="8" r="6"/>
  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
</svg>
```

---

## Before/After Comparison Panels

**Usage:** Treatment results visualization — do NOT use real patient photos unless consented.
**Alternative:** SVG illustrations, icons, or metric improvements.

### Layout Rules
```
[BEFORE Panel]  |  [AFTER Panel]
Grey-tinted bg  |  Teal-tinted bg
"Trước"  label  |  "Sau" label
Condition icon  |  Healthy icon
Metric: dark    |  Metric: accent teal
```

### CSS Pattern
```css
.comparison-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--faint);
}
.panel-before {
  background: #f4f4f5;
  padding: 32px 24px;
  border-right: 2px dashed var(--faint);
}
.panel-after {
  background: var(--surface);
  padding: 32px 24px;
}
.panel-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.panel-before .panel-label { color: #71717a; }
.panel-after  .panel-label { color: var(--accent); }
```

---

## Credential / Certification Badge Style

Credentials are the most important visual element in healthcare marketing.

### Badge Types

**Level 1 — Government License (Most Authority)**
- Background: white
- Left border: 3px solid `--blue`
- Icon: Official seal SVG (blue)
- Title: License name in `--ink` bold
- Number: License code in `--subtle` monospace
- Verified stamp: "✓ Xác nhận" in `--positive`

**Level 2 — International Certification (ISO, ADA, etc.)**
- Background: white
- Left border: 3px solid `--accent`
- Icon: Award/star SVG (teal)
- Organization name in `--ink`
- Valid year range in `--subtle`

**Level 3 — Professional Membership**
- Background: `--surface`
- Border: 1px solid `--faint`
- Icon: Badge SVG (subtle)
- Organization + role in `--body`

### Grid Layout
```css
.credentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
```

---

## Progress Indicators for Health Metrics

Used for: recovery progress, quota remaining, treatment completion, health improvement.

### Health Bar
```css
.health-bar-track {
  height: 8px;
  background: var(--faint);
  border-radius: 99px;
  overflow: hidden;
}
.health-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Warning zone */
.health-bar-fill.alert { background: var(--alert); }
/* Good zone */
.health-bar-fill.positive { background: var(--positive); }
```

### Quota Progress (for appointment slots)
- Label: "Còn X/Y suất" — remaining / total
- Bar fills from left in teal
- When < 25% remaining: bar turns `--alert`
- Label changes to "Gần đầy" warning

---

## Photo Treatment Guidelines

**Use ONLY if real photos are provided. Default to SVG illustrations.**

### Clinical Photo Requirements
- White or very light grey background (no outdoor, no dark studio)
- Warm but clinical lighting — no dramatic shadows
- No heavy filters — natural, clean
- Doctor/staff: white coat, professional setting
- Patient: always with written consent, never identifiable if condition shown

### Photo Overlay
```css
.clinical-photo {
  border-radius: 16px;
  overflow: hidden;
}
.clinical-photo img {
  filter: none; /* Do NOT add filters to clinical photos */
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
```

---

## Data Visualization

**Charts allowed:** Simple bar, simple line, donut (ring chart only).
**No allowed:** Pie chart (hard to read), radar, funnel chart, 3D charts.
**Colors:** Teal primary, blue secondary, green positive, no red in charts (medical data).

### Stat Display Pattern
```
[Large Number — teal, 800 weight]
[Unit / label — subtle, 500 weight]
[Micro description — subtle, 400, 12px]
```

Example:
```
  8,500+
  bệnh nhân
  đã điều trị thành công tại SmileCare
```

---

## Layout Grid

```css
/* Container */
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Common grids */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

/* Hero split */
.hero-split { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }

/* Responsive breakpoints */
@media (max-width: 1024px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .grid-3, .grid-2, .hero-split { grid-template-columns: 1fr; } }
```

---

## What NOT to Do

| Do NOT | Reason |
|--------|--------|
| Use dark section backgrounds | Feels pharmaceutical/edgy, not clinical safe |
| Use red for CTAs or urgency | Red = danger/alert in medical context only |
| Use bouncing or pulsing animations | Anxiety-inducing for patients |
| Use aggressive countdown timers | Unethical pressure in healthcare |
| Use stock photos of "perfect" bodies | Unrealistic, regulatory issues |
| Use serif fonts | Not clinical — Inter only |
| Use gradient backgrounds | Not clean enough for clinical trust |
| Show identifiable patient photos | Privacy violation |
| Make medical claims without disclaimers | Legal / ethical violation |
| Use "100% cured" / "guaranteed results" copy | Misleading medical advertising |
