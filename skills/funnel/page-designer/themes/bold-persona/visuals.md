# Bold Persona — Visuals Reference

## Photography Style

### Hero Portrait Philosophy
Bold Persona is **photo-forward** — the person IS the brand. Every visual choice amplifies human presence.

**Traits of the right portrait:**
- Direct eye contact with camera — confident, not intimidating
- High contrast lighting — sharp shadows, bright highlights (not soft/diffused)
- Neutral or minimal background — white, light grey, or simple office/stage
- Confident posture — standing, arms crossed, or dynamic gesture
- Professional but not stiff — blazer optional, energy over formality
- Face takes up 50%+ of frame in hero slot

**What to avoid:**
- Looking away / candid shots (too vulnerable for this theme)
- Overly posed "corporate headshot" smile
- Dark or cluttered backgrounds
- Filters that desaturate or soften skin tones

### Portrait CSS Treatment
```css
/* Standard portrait */
.portrait {
  object-fit: cover;
  filter: contrast(1.05) saturate(1.1);
}

/* Portrait with coral drop shadow */
.portrait-featured {
  border-radius: 16px;
  box-shadow: 8px 8px 0 rgba(232,83,58,0.15), 0 4px 20px rgba(0,0,0,0.08);
  filter: contrast(1.05) saturate(1.1);
}

/* Subtle coral glow on hover */
.portrait-featured:hover {
  box-shadow: 10px 10px 0 rgba(232,83,58,0.22), 0 8px 32px rgba(0,0,0,0.12);
}
```

---

## Media Logo Treatment (Speaker Credibility)

Logos of media features, podcast appearances, publications:

```css
/* Default: grayscale, subdued */
.media-logo {
  filter: grayscale(1) opacity(0.55);
  transition: filter 0.25s ease;
  height: 28px;
  width: auto;
}

/* Hover: reveal brand color */
.media-logo:hover {
  filter: grayscale(0) opacity(1);
}

/* Static alt: use opacity only (no grayscale) */
.media-logo-alt {
  opacity: 0.55;
}
```

**Sizing rules:**
- Logo row: `height: 28–32px`, `width: auto`, `max-width: 120px`
- Maintain aspect ratio — never stretch logos
- Add `title` attribute on SVG/img for accessibility
- Minimum 5 logos; maximum 8 before wrapping to 2 rows

---

## Social Proof Counter Display

Large follower/subscriber numbers are a primary trust signal:

```html
<!-- Platform counter block -->
<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
  <!-- Platform icon (SVG) -->
  [PLATFORM_SVG_ICON]
  <!-- Big number -->
  <span style="font-family:'Space Mono',monospace;font-weight:700;font-size:clamp(1.75rem,4vw,2.5rem);color:#111827;line-height:1;">
    180K
  </span>
  <!-- Platform name -->
  <span style="font-family:'Inter',sans-serif;font-size:0.75rem;font-weight:500;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">
    YouTube
  </span>
</div>
```

**Number formatting rules:**
- Under 1K: show full number (e.g., 847)
- 1K–999K: show with K suffix, 1 decimal if needed (e.g., 180K, 45.2K)
- 1M+: show with M suffix (e.g., 1.2M)
- Revenue: use $X.XM or XM VND format
- Space Mono 700 for ALL numbers in this theme

---

## Achievement Cards

Cards that highlight awards, milestones, recognitions:

```html
<!-- Achievement card — coral top border "award ribbon" -->
<div style="background:#ffffff;border-radius:14px;border:1px solid #e5e7eb;border-top:4px solid #e8533a;
            padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <!-- Icon or year -->
  <div style="font-family:'Space Mono',monospace;font-size:0.75rem;color:#e8533a;font-weight:700;
              letter-spacing:0.08em;margin-bottom:8px;">2022</div>
  <!-- Achievement title -->
  <div style="font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;color:#111827;
              margin-bottom:6px;">Forbes 30 Under 30</div>
  <!-- Description -->
  <div style="font-family:'Inter',sans-serif;font-size:0.85rem;color:#6b7280;line-height:1.5;">
    Vietnam Social Impact category
  </div>
</div>
```

---

## Before/After Client Transformation Cards

Core proof pattern for coaching/education personal brands:

```html
<div class="transformation-card" style="background:#fff;border-radius:14px;border:1px solid #e5e7eb;
            border-left:4px solid #e8533a;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <!-- Before state -->
  <div style="padding:20px 24px 14px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
    <div style="font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:600;color:#9ca3af;
                text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Trước khi học</div>
    <p style="font-family:'Inter',sans-serif;font-size:0.9rem;color:#374151;line-height:1.5;">
      [Before state — pain/struggle, specific and relatable]
    </p>
  </div>
  <!-- After result -->
  <div style="padding:14px 24px 20px;">
    <div style="font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:600;color:#e8533a;
                text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Sau [X] tháng</div>
    <!-- Big result number -->
    <div style="font-family:'Space Mono',monospace;font-weight:700;font-size:1.5rem;color:#111827;margin-bottom:4px;">
      [RESULT NUMBER]
    </div>
    <p style="font-family:'Inter',sans-serif;font-size:0.85rem;color:#374151;line-height:1.5;">
      [After state — specific outcome, ideally with metrics]
    </p>
  </div>
  <!-- Person -->
  <div style="padding:0 24px 20px;display:flex;align-items:center;gap:10px;">
    <div style="width:36px;height:36px;border-radius:50%;background:#f3f4f6;
                border:1.5px solid #e5e7eb;overflow:hidden;">
      <!-- Avatar -->
    </div>
    <div>
      <div style="font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:600;color:#111827;">[Name]</div>
      <div style="font-family:'Inter',sans-serif;font-size:0.75rem;color:#9ca3af;">[Business type / Industry]</div>
    </div>
  </div>
</div>
```

---

## Geometric SVG Accents

These are the ONLY decorative elements allowed in bold-persona (no illustrations):

### Dot Grid SVG Background
```svg
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
    <circle cx="12" cy="12" r="1" fill="#e5e7eb"/>
  </pattern>
  <rect width="200" height="200" fill="url(#dots)"/>
</svg>
```

### Diagonal Line Accent
```svg
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="120" x2="120" y2="0" stroke="#e8533a" stroke-width="1" opacity="0.15"/>
  <line x1="0" y1="90"  x2="90"  y2="0" stroke="#e8533a" stroke-width="1" opacity="0.10"/>
  <line x1="0" y1="60"  x2="60"  y2="0" stroke="#e8533a" stroke-width="1" opacity="0.07"/>
  <line x1="0" y1="30"  x2="30"  y2="0" stroke="#e8533a" stroke-width="1" opacity="0.05"/>
</svg>
```

### Coral Underline Squiggle (for accent headlines)
```svg
<svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="#e8533a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
```

### Bold Strike Through (for "crossed out" pricing)
```css
.price-original {
  font-family: 'Space Mono', monospace;
  color: #9ca3af;
  text-decoration: line-through;
  text-decoration-color: #e8533a;
  text-decoration-thickness: 2px;
}
```

### Live Pulse Dot (announcement bar)
```html
<span style="display:inline-flex;align-items:center;gap:6px;">
  <span style="width:8px;height:8px;border-radius:50%;background:#e8533a;
               animation:pulse-dot 1.8s ease-in-out infinite;display:inline-block;"></span>
  LIVE
</span>
```

---

## Platform SVG Icons

Inline SVGs for social platform icons (used in impact-numbers pattern):

### Instagram
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
</svg>
```

### YouTube
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" stroke-width="1.8"/>
  <path d="M10 9.5l5 2.5-5 2.5V9.5z" fill="currentColor"/>
</svg>
```

### TikTok
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### LinkedIn
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.8"/>
  <line x1="7" y1="10" x2="7" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="7" y1="7" x2="7" y2="7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M11 17v-4a2 2 0 0 1 4 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="11" y1="10" x2="11" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>
```

---

## Portrait Slot Placeholder SVG

Use during development before real photos are available:

```html
<div style="width:100%;height:100%;background:#f3f4f6;border-radius:16px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <!-- Dot grid bg -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.4" xmlns="http://www.w3.org/2000/svg">
    <pattern id="dotbg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="1" fill="#9ca3af"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#dotbg)"/>
  </svg>
  <!-- Person silhouette -->
  <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:relative;z-index:1;opacity:0.25">
    <circle cx="60" cy="40" r="28" stroke="#e8533a" stroke-width="2" fill="rgba(232,83,58,0.08)"/>
    <path d="M10 150 C10 110 30 90 60 90 C90 90 110 110 110 150" stroke="#e8533a" stroke-width="2" stroke-linecap="round" fill="rgba(232,83,58,0.06)"/>
  </svg>
  <p style="position:absolute;bottom:16px;font-family:'Inter',sans-serif;font-size:0.75rem;color:#9ca3af;text-align:center;">
    [ Thêm ảnh chân dung thực tế ]
  </p>
</div>
```
