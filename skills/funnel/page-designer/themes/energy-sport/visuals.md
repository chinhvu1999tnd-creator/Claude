# Energy Sport — Visuals Reference

## Athletic SVG Icon Library

All icons: stroke-based, sharp corners, 2px stroke, accent/ink colored. Use `currentColor` for theming.

---

### Dumbbell Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
  <!-- Left plates -->
  <rect x="2" y="18" width="6" height="12" rx="1"/>
  <rect x="8" y="16" width="4" height="16" rx="1"/>
  <!-- Bar -->
  <line x1="12" y1="24" x2="36" y2="24"/>
  <!-- Right plates -->
  <rect x="36" y="16" width="4" height="16" rx="1"/>
  <rect x="40" y="18" width="6" height="12" rx="1"/>
</svg>
```

### Lightning Bolt Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
  <polygon points="26,4 10,26 22,26 20,44 38,20 26,20"/>
</svg>
```

### Trophy Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
  <!-- Cup -->
  <path d="M14 6h20v18c0 7-4.5 12-10 12S14 31 14 24V6z"/>
  <!-- Handles -->
  <path d="M14 10H8a6 6 0 0 0 6 10"/>
  <path d="M34 10h6a6 6 0 0 1-6 10"/>
  <!-- Stem -->
  <line x1="24" y1="36" x2="24" y2="42"/>
  <line x1="16" y1="42" x2="32" y2="42"/>
</svg>
```

### Stopwatch Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
  <!-- Crown + buttons -->
  <line x1="20" y1="6" x2="28" y2="6"/>
  <line x1="24" y1="6" x2="24" y2="10"/>
  <line x1="36" y1="10" x2="40" y2="6"/>
  <!-- Circle -->
  <circle cx="24" cy="28" r="16"/>
  <!-- Hand -->
  <line x1="24" y1="18" x2="24" y2="26"/>
  <line x1="24" y1="26" x2="30" y2="30"/>
</svg>
```

### Fire Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
  <path d="M24 4 C16 14 10 18 12 26 C14 34 20 36 24 44 C28 36 36 34 36 26 C36 18 32 14 24 4z
           M24 28 C21 28 18 25 18 22 C18 19 21 16 24 14 C27 16 30 19 30 22 C30 25 27 28 24 28z"/>
</svg>
```

### Heart Rate / Pulse Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter">
  <polyline points="2,24 10,24 16,10 22,38 28,16 34,30 38,24 46,24"/>
</svg>
```

### Shield / Guarantee Icon
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
  <path d="M24 4L6 12v14c0 10 8 18 18 20 10-2 18-10 18-20V12L24 4z"/>
  <polyline points="16,24 22,30 32,18"/>
</svg>
```

### Arrow Right (CTA)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
  <line x1="3" y1="12" x2="21" y2="12"/>
  <polyline points="14,5 21,12 14,19"/>
</svg>
```

### Star (Rating)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
</svg>
```

---

## Progress & Achievement System

### Progress Bar Component
```html
<!-- Standard progress bar — red fill -->
<div class="progress-container">
  <div class="progress-label">
    <span class="progress-name">STRENGTH</span>
    <span class="progress-value">85%</span>
  </div>
  <div class="progress-track">
    <div class="progress-fill" style="width: 85%"></div>
  </div>
</div>

<style>
.progress-container { margin-bottom: 12px; }
.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.progress-name {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
}
.progress-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 0.9rem;
  color: var(--accent);
}
.progress-track {
  height: 6px;
  background: var(--faint);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #ff5252);
  border-radius: 2px;
  position: relative;
}
.progress-fill::after {
  content: '';
  position: absolute;
  right: 0; top: 50%;
  transform: translateY(-50%);
  width: 10px; height: 10px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255,45,45,0.6);
}
</style>
```

### Intensity Level Dots
```html
<!-- Intensity: 1-5 dots. Red = active, grey = inactive -->
<div class="intensity">
  <span class="dot dot-active"></span>
  <span class="dot dot-active"></span>
  <span class="dot dot-active"></span>
  <span class="dot dot-inactive"></span>
  <span class="dot dot-inactive"></span>
  <span class="intensity-label">HARD</span>
</div>

<style>
.intensity { display: flex; align-items: center; gap: 4px; }
.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}
.dot-active   { background: var(--accent); }
.dot-inactive { background: var(--faint); }
.intensity-label {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--subtle);
  margin-left: 4px;
}
</style>
```

### Achievement Badge
```html
<!-- Achievement badge — awarded state -->
<div class="achievement">
  <div class="achievement-icon">🏆</div>
  <div class="achievement-info">
    <div class="achievement-title">GOAL ACHIEVED</div>
    <div class="achievement-desc">Lost 10kg in 60 days</div>
  </div>
</div>

<style>
.achievement {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(245,197,0,0.1);
  border: 1px solid rgba(245,197,0,0.3);
  border-radius: 4px;
  width: fit-content;
}
.achievement-icon { font-size: 1.5rem; }
.achievement-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--yellow);
  letter-spacing: 0.05em;
}
.achievement-desc {
  font-family: 'Barlow', sans-serif;
  font-size: 0.8rem;
  color: var(--body);
}
</style>
```

---

## Before/After Transformation Panel

```html
<div class="transformation-card">
  <!-- Photo slot area -->
  <div class="transformation-photos">
    <div class="photo-slot photo-before">
      <!-- Slot for before image -->
      <div class="photo-label">BEFORE</div>
    </div>
    <div class="photo-divider">→</div>
    <div class="photo-slot photo-after">
      <!-- Slot for after image -->
      <div class="photo-label">AFTER</div>
    </div>
  </div>

  <!-- Stats row -->
  <div class="transformation-stats">
    <div class="stat-block">
      <div class="stat-label">BEFORE</div>
      <div class="stat-value before-value">88 KG</div>
    </div>
    <div class="stat-sep">→</div>
    <div class="stat-block">
      <div class="stat-label">AFTER</div>
      <div class="stat-value after-value">74 KG</div>
    </div>
    <div class="stat-block stat-delta">
      <div class="stat-label">LOST</div>
      <div class="stat-value delta-value">−14 KG</div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="transformation-timeline">IN 90 DAYS</div>
</div>

<style>
.transformation-card {
  background: var(--raised);
  border-radius: 6px;
  border: 1px solid var(--faint);
  border-left: 3px solid var(--accent);
  overflow: hidden;
}

.transformation-photos {
  display: flex;
  align-items: center;
  gap: 0;
}

.photo-slot {
  flex: 1;
  height: 200px;
  position: relative;
  overflow: hidden;
  background: var(--grey);
  /* Replace with actual image: background-image: url(...); background-size: cover; */
  background-image: repeating-linear-gradient(-45deg,
    rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px,
    transparent 1px, transparent 8px);
}

.photo-before { filter: grayscale(60%); }
.photo-after  { filter: none; }

.photo-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 10px;
  background: rgba(0,0,0,0.7);
  color: var(--subtle);
}
.photo-after .photo-label { color: var(--accent); }

.photo-divider {
  width: 40px;
  text-align: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--accent);
  background: var(--bg);
  z-index: 1;
}

.transformation-stats {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
  border-top: 1px solid var(--faint);
}

.stat-block { text-align: center; }

.stat-label {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--subtle);
  margin-bottom: 2px;
}

.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 1.75rem;
  line-height: 1;
}

.before-value { color: var(--subtle); }
.after-value  { color: var(--ink); }
.delta-value  { color: var(--accent); }

.stat-sep {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--accent);
  margin: 0 4px;
}

.stat-delta { margin-left: auto; }

.transformation-timeline {
  padding: 8px 20px;
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--yellow);
  background: rgba(245,197,0,0.08);
  border-top: 1px solid rgba(245,197,0,0.15);
}
</style>
```

---

## Workout Schedule Grid

```html
<div class="schedule-wrapper">
  <table class="schedule-grid">
    <thead>
      <tr>
        <th class="schedule-th time-col">TIME</th>
        <th class="schedule-th">MON</th>
        <th class="schedule-th">TUE</th>
        <th class="schedule-th">WED</th>
        <th class="schedule-th">THU</th>
        <th class="schedule-th">FRI</th>
        <th class="schedule-th">SAT</th>
        <th class="schedule-th schedule-th-weekend">SUN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="schedule-td time-cell">06:00</td>
        <td class="schedule-td"><div class="class-slot slot-hard">HIIT<div class="slot-details"><span class="slot-time">45 MIN</span><div class="intensity-dots"><span class="d d-on"></span><span class="d d-on"></span><span class="d d-on"></span><span class="d d-on"></span><span class="d d-off"></span></div></div></div></td>
        <!-- ... more cells -->
      </tr>
    </tbody>
  </table>
</div>

<style>
.schedule-wrapper { overflow-x: auto; }

.schedule-grid {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Barlow', sans-serif;
}

.schedule-th {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--subtle);
  padding: 10px 8px;
  border-bottom: 2px solid var(--accent);
  text-align: center;
  background: var(--surface);
}

.schedule-th-weekend { color: var(--accent); }
.time-col { text-align: left; padding-left: 16px; width: 80px; }

.schedule-td {
  padding: 4px;
  border: 1px solid var(--faint);
  vertical-align: top;
  min-width: 110px;
}

.time-cell {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: var(--subtle);
  text-align: left;
  padding-left: 16px;
  background: var(--surface);
}

.class-slot {
  padding: 8px 10px;
  border-radius: 4px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 0.95rem;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--raised);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.03em;
}

.class-slot:hover { background: var(--grey); border-left: 2px solid var(--accent); }

.slot-hard   { border-left: 2px solid var(--accent); }
.slot-medium { border-left: 2px solid var(--yellow); }
.slot-easy   { border-left: 2px solid var(--subtle); }

.slot-details {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.slot-time {
  font-family: 'Barlow', sans-serif;
  font-weight: 400;
  font-size: 0.7rem;
  color: var(--subtle);
  text-transform: none;
}

.intensity-dots { display: flex; gap: 2px; }
.d { display: inline-block; width: 5px; height: 5px; border-radius: 50%; }
.d-on  { background: var(--accent); }
.d-off { background: var(--faint); }
</style>
```

---

## Athlete SVG Silhouette (Hero Right Panel)

A dynamic muscular silhouette for use in the hero section when photos are unavailable.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500" fill="none">
  <!-- Silhouette — dynamic pose, arms raised in power flex -->
  <!-- Head -->
  <ellipse cx="150" cy="60" rx="28" ry="32" fill="#1e1e1e" stroke="var(--accent)" stroke-width="1"/>
  <!-- Neck -->
  <rect x="138" y="88" width="24" height="20" rx="2" fill="#1e1e1e"/>
  <!-- Torso -->
  <path d="M100 108 C90 120 85 160 90 200 L120 205 L150 210 L180 205 L210 200 C215 160 210 120 200 108 Z"
        fill="#1e1e1e" stroke="rgba(255,45,45,0.3)" stroke-width="1"/>
  <!-- Left arm raised -->
  <path d="M100 115 C80 100 55 80 40 55" stroke="#2a2a2a" stroke-width="22" stroke-linecap="round"/>
  <path d="M100 115 C80 100 55 80 40 55" stroke="#1e1e1e" stroke-width="20" stroke-linecap="round"/>
  <!-- Right arm raised -->
  <path d="M200 115 C220 100 245 80 260 55" stroke="#2a2a2a" stroke-width="22" stroke-linecap="round"/>
  <path d="M200 115 C220 100 245 80 260 55" stroke="#1e1e1e" stroke-width="20" stroke-linecap="round"/>
  <!-- Left fist -->
  <ellipse cx="40" cy="52" rx="14" ry="16" fill="#1e1e1e" stroke="var(--accent)" stroke-width="1.5"/>
  <!-- Right fist -->
  <ellipse cx="260" cy="52" rx="14" ry="16" fill="#1e1e1e" stroke="var(--accent)" stroke-width="1.5"/>
  <!-- Left leg -->
  <path d="M120 205 C110 250 105 310 100 360" stroke="#2a2a2a" stroke-width="30" stroke-linecap="round"/>
  <path d="M120 205 C110 250 105 310 100 360" stroke="#1e1e1e" stroke-width="28" stroke-linecap="round"/>
  <!-- Right leg -->
  <path d="M180 205 C190 250 195 310 200 360" stroke="#2a2a2a" stroke-width="30" stroke-linecap="round"/>
  <path d="M180 205 C190 250 195 310 200 360" stroke="#1e1e1e" stroke-width="28" stroke-linecap="round"/>
  <!-- Shoes -->
  <ellipse cx="98"  cy="365" rx="22" ry="10" fill="#1a1a1a" stroke="var(--accent)" stroke-width="1"/>
  <ellipse cx="202" cy="365" rx="22" ry="10" fill="#1a1a1a" stroke="var(--accent)" stroke-width="1"/>
  <!-- Accent glow lines on body -->
  <path d="M130 120 L130 190" stroke="rgba(255,45,45,0.2)" stroke-width="1"/>
  <path d="M150 115 L150 200" stroke="rgba(255,45,45,0.15)" stroke-width="1"/>
  <path d="M170 120 L170 190" stroke="rgba(255,45,45,0.2)" stroke-width="1"/>
</svg>
```

---

## Dark Athletic Photography Slots

When real photos are used, apply these CSS treatments for visual consistency:

```css
/* Photo overlay — ensures readability over any photo */
.athlete-photo {
  position: relative;
  overflow: hidden;
  background: var(--grey);
}

.athlete-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: contrast(1.15) brightness(0.85) saturate(0.9);
}

/* Dark vignette overlay */
.athlete-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(14,14,14,0.7) 100%
  );
}

/* Red accent overlay (subtle) */
.athlete-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255,45,45,0.08) 0%, transparent 70%);
  z-index: 1;
}

/* Grayscale variant for BEFORE photos */
.athlete-photo.before-state img {
  filter: grayscale(100%) contrast(1.1) brightness(0.8);
}
```

---

## Metric Number Display

For large impact numbers (stats, counters, achievements):

```html
<div class="metric">
  <span class="metric-number">2,400</span>
  <span class="metric-suffix">+</span>
  <div class="metric-label">ACTIVE MEMBERS</div>
</div>

<style>
.metric { text-align: center; }

.metric-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.metric-suffix {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--accent);
  vertical-align: super;
}

.metric-label {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--subtle);
  margin-top: 4px;
}
</style>
```
