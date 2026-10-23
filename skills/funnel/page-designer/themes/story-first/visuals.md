# Story First — Visual Language

## Core Visual Philosophy

In story-first, **the human face is the most powerful visual**. Not a professional headshot — a candid moment, a real expression, an image that says "this person has actually lived this."

The visual system is built to feel like a **beautifully designed personal journal** or an independent literary magazine — warm paper tones, generous white space, handcrafted-feeling layouts, and typography that reads like a letter from a friend.

---

## Portrait Photography

### Style

**What to shoot / select:**
- Candid moments — mid-laugh, thoughtful gaze, looking off-camera at something real
- Warm lighting (golden hour, indoor lamp light, soft window light — never flash)
- Natural settings: home office, outdoor café, garden, bookshelf-lined room
- Casual but intentional styling — NOT formal business wear, NOT activewear
- Depth of field: subject in focus, background soft (creates intimacy)

**What to avoid:**
- Corporate headshot pose (arms crossed, power stance against neutral background)
- Studio lighting with perfectly even, shadowless setup
- Stock photo aesthetic (model-like perfection, generic settings)
- Overly edited skin (smooth AI-look destroys authenticity)

### CSS Treatment

```css
/* Standard portrait — warm, not cold */
.portrait {
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44,31,20,0.12);
  /* No filter — natural color, let warmth come from subject + bg */
}

/* Portrait with warm vignette frame */
.portrait-framed {
  border-radius: 22px;
  box-shadow:
    0 8px 32px rgba(44,31,20,0.12),
    inset 0 0 40px rgba(192,85,61,0.06);
  border: 3px solid rgba(192,85,61,0.15);
}
```

### Portrait Placeholder (SVG)

When no real photo is available, use a warm illustrated silhouette — NOT a grey rectangle:

```html
<div class="portrait-placeholder" style="
  background: var(--surface);
  border-radius: 22px;
  border: 2px solid var(--faint);
  box-shadow: 0 8px 32px rgba(44,31,20,0.10);
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
">
  <!-- Warm organic blob bg -->
  <div style="
    position:absolute; inset:0;
    background: radial-gradient(ellipse at 40% 35%, rgba(192,85,61,0.08) 0%, transparent 65%),
                radial-gradient(ellipse at 60% 70%, rgba(107,143,113,0.06) 0%, transparent 60%);
  "></div>

  <!-- Human silhouette — warm line art -->
  <svg viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg"
       style="width:65%; position:relative; z-index:1">
    <!-- Head -->
    <ellipse cx="80" cy="52" rx="28" ry="32"
             fill="rgba(192,85,61,0.08)" stroke="var(--subtle)" stroke-width="1.5"/>
    <!-- Shoulders / torso -->
    <path d="M30 110C30 110 40 88 80 88C120 88 130 110 130 110L125 180H35L30 110Z"
          fill="rgba(192,85,61,0.06)" stroke="var(--subtle)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Arms suggestion -->
    <path d="M35 115C20 125 15 150 18 170" stroke="var(--subtle)" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M125 115C140 125 145 150 142 170" stroke="var(--subtle)" stroke-width="1.3" stroke-linecap="round"/>
    <!-- Book (optional — author/coach prop) -->
    <rect x="60" y="140" width="40" height="30" rx="3"
          fill="rgba(61,90,128,0.10)" stroke="var(--slate)" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="80" y1="140" x2="80" y2="170" stroke="var(--slate)" stroke-width="0.8" stroke-dasharray="2 2"/>
  </svg>
</div>
```

---

## Book & Podcast Cover Display

A key visual element for author/podcaster personal brands — treated with care, not as a small thumbnail.

### Book Cover Treatment

```html
<div class="book-display" style="
  position: relative;
  display: inline-block;
">
  <!-- Book cover card -->
  <div style="
    width: 160px;
    height: 220px;
    border-radius: 6px 14px 14px 6px; /* Spine on left */
    background: var(--surface);
    border: 1px solid var(--faint);
    box-shadow:
      -4px 4px 0 rgba(44,31,20,0.12),   /* Spine shadow */
      0 8px 32px rgba(44,31,20,0.12);   /* Drop shadow */
    overflow: hidden;
    position: relative;
  ">
    <!-- Book cover image slot -->
    <div class="media-slot" data-role="BOOK_COVER" style="
      width:100%; height:100%;
      background: linear-gradient(145deg, var(--surface) 0%, var(--raised) 100%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 16px;
      text-align: center;
    ">
      <!-- Leaf decoration -->
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="margin-bottom:8px">
        <path d="M4 28C4 28 10 12 20 8C30 4 32 18 24 24C18 28 8 28 4 28Z"
              fill="rgba(107,143,113,0.20)" stroke="var(--sage)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M4 28L16 16" stroke="var(--sage)" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="2 2"/>
      </svg>
      <span style="
        font-family:'Libre Baskerville',serif; font-weight:700; font-size:11px;
        color:var(--ink); line-height:1.3; display:block;
      ">[TÊN SÁCH]</span>
      <span style="
        font-family:'Libre Franklin',sans-serif; font-size:9px; font-weight:400;
        color:var(--subtle); margin-top:6px; display:block;
      ">[Tên tác giả]</span>
    </div>

    <!-- Spine effect -->
    <div style="
      position:absolute; left:0; top:0; bottom:0; width:8px;
      background: linear-gradient(90deg, rgba(44,31,20,0.12) 0%, transparent 100%);
    "></div>
  </div>

  <!-- Edition badge -->
  <div style="
    position:absolute; top:-8px; right:-8px;
    background:var(--accent); color:white;
    border-radius:50%; width:36px; height:36px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Libre Franklin',sans-serif; font-weight:600; font-size:9px;
    text-align:center; line-height:1.2;
    box-shadow: 0 2px 10px rgba(192,85,61,0.35);
  ">[N]K<br>bản</div>
</div>
```

### Podcast Cover Treatment

```html
<!-- Podcast cover — square with warm rounded corners -->
<div style="
  width:140px; height:140px;
  border-radius:18px;
  background:var(--raised);
  border:1.5px solid var(--faint);
  box-shadow: 0 6px 24px rgba(44,31,20,0.12);
  overflow:hidden; position:relative;
  display:flex; align-items:center; justify-content:center;
">
  <!-- Waveform graphic -->
  <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%">
    <rect x="2"  y="15" width="6" height="10" rx="3" fill="rgba(192,85,61,0.40)"/>
    <rect x="12" y="8"  width="6" height="24" rx="3" fill="rgba(192,85,61,0.60)"/>
    <rect x="22" y="5"  width="6" height="30" rx="3" fill="var(--accent)"/>
    <rect x="32" y="10" width="6" height="20" rx="3" fill="rgba(192,85,61,0.70)"/>
    <rect x="42" y="3"  width="6" height="34" rx="3" fill="var(--accent)"/>
    <rect x="52" y="8"  width="6" height="24" rx="3" fill="rgba(192,85,61,0.60)"/>
    <rect x="62" y="14" width="6" height="12" rx="3" fill="rgba(192,85,61,0.40)"/>
    <rect x="72" y="17" width="6" height="6"  rx="3" fill="rgba(192,85,61,0.25)"/>
  </svg>
  <div style="
    position:absolute; bottom:0; left:0; right:0;
    background:linear-gradient(0deg,rgba(44,31,20,0.10) 0%,transparent 100%);
    padding:8px; text-align:center;
  ">
    <span style="
      font-family:'Libre Baskerville',serif; font-size:8px; font-weight:700;
      color:var(--ink);
    ">[TÊN PODCAST]</span>
  </div>
</div>
```

---

## Quote Pull-Out Cards

The most signature visual element of Story First — oversized italic Baskerville quotes with terracotta left accent border.

### Large Pull Quote (editorial section divider)

```html
<div style="
  border-left: 5px solid var(--accent);
  padding: 20px 28px;
  background: var(--surface);
  border-radius: 0 18px 18px 0;
  margin: 32px 0;
">
  <p style="
    font-family:'Libre Baskerville',serif;
    font-style: italic;
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    line-height: 1.5;
    color: var(--ink);
    margin:0 0 12px;
  ">
    "[QUOTE TEXT — the most honest, human thing you could say]"
  </p>
  <span style="
    font-family:'Libre Franklin',sans-serif;
    font-size:13px;
    font-weight:600;
    color:var(--accent);
    letter-spacing:0.04em;
  ">— [Name / Source]</span>
</div>
```

### Floating Quote Card (testimonial style)

```html
<div style="
  background: var(--raised);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(44,31,20,0.08);
  position:relative;
">
  <!-- Quotation mark decoration -->
  <div style="
    position:absolute; top:16px; left:20px;
    font-family:'Libre Baskerville',serif;
    font-size:60px; line-height:1;
    color:rgba(192,85,61,0.12);
    user-select:none; pointer-events:none;
  ">"</div>

  <p style="
    font-family:'Libre Baskerville',serif;
    font-style:italic;
    font-size:1.0625rem;
    line-height:1.65;
    color:var(--ink);
    position:relative; z-index:1;
    padding-top:8px;
  ">[Quote text]</p>

  <div style="
    display:flex; align-items:center; gap:10px;
    margin-top:16px; padding-top:16px;
    border-top:1px dashed var(--faint);
  ">
    <!-- Avatar circle -->
    <div style="
      width:36px; height:36px;
      border-radius:50%;
      background:linear-gradient(135deg,rgba(192,85,61,0.15),rgba(107,143,113,0.12));
      border:2px solid var(--faint);
      flex-shrink:0;
    "></div>
    <div>
      <p style="font-family:'Libre Franklin',sans-serif;font-weight:600;font-size:13px;color:var(--ink)">[Tên]</p>
      <p style="font-family:'Libre Franklin',sans-serif;font-size:11px;color:var(--subtle)">[Role/context]</p>
    </div>
  </div>
</div>
```

---

## Nature & Organic Illustration Accents

Lightweight SVG motifs that reinforce the warm, grounded aesthetic. Used as background decoration only.

### Leaf Cluster

```svg
<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="120" height="100" style="opacity:0.6">
  <!-- Main leaf -->
  <path d="M20 80C20 80 35 45 65 35C95 25 105 55 85 70C68 82 35 85 20 80Z"
        fill="rgba(107,143,113,0.15)" stroke="var(--sage)" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Stem -->
  <path d="M20 80L52 55" stroke="var(--sage)" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="3 3"/>
  <!-- Small leaf -->
  <path d="M75 30C75 30 85 18 95 22C105 26 100 38 90 38C82 38 74 32 75 30Z"
        fill="rgba(107,143,113,0.12)" stroke="var(--sage)" stroke-width="1.3" stroke-linecap="round"/>
  <!-- Small stem -->
  <path d="M90 38L78 48" stroke="var(--sage)" stroke-width="1.1" stroke-linecap="round"/>
</svg>
```

### Concentric Circles (growth, continuity)

```svg
<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="120" height="120" style="opacity:0.5">
  <circle cx="60" cy="60" r="55" stroke="rgba(192,85,61,0.12)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="60" cy="60" r="40" stroke="rgba(192,85,61,0.09)" stroke-width="1.2" stroke-dasharray="3 4"/>
  <circle cx="60" cy="60" r="25" stroke="rgba(192,85,61,0.07)" stroke-width="1" stroke-dasharray="2 4"/>
</svg>
```

### Wave / Breath Line

```svg
<svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg"
     width="200" height="40" style="opacity:0.5">
  <path d="M0 20C25 20 25 8 50 8C75 8 75 32 100 32C125 32 125 8 150 8C175 8 175 20 200 20"
        stroke="rgba(107,143,113,0.35)" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Organic Blob Frame (portrait background)

```svg
<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"
     style="position:absolute; inset:0; width:100%; height:100%; z-index:0">
  <path d="M30 40C50 10 140 5 175 35C210 65 195 150 170 180C145 210 55 215 25 185C-5 155 10 70 30 40Z"
        fill="rgba(192,85,61,0.07)"/>
  <path d="M30 40C50 10 140 5 175 35C210 65 195 150 170 180C145 210 55 215 25 185C-5 155 10 70 30 40Z"
        stroke="rgba(192,85,61,0.15)" stroke-width="1.5" fill="none"/>
</svg>
```

---

## Journal / Notebook Aesthetic

Certain sections adopt a notebook/journal visual feel — ruled lines, margin annotations, handwritten-feeling text styling.

### Ruled Line Divider

```html
<div style="
  position:relative;
  padding:24px 0;
  border-bottom:1px solid var(--faint);
">
  <!-- Margin rule line -->
  <div style="
    position:absolute; left:48px; top:0; bottom:0;
    border-left:2px solid rgba(192,85,61,0.15);
  "></div>
</div>
```

### Margin Note (sidebar annotation)

```html
<!-- Used alongside milestone timeline or story sections -->
<div style="
  position:absolute; left:-80px; top:0;
  width:64px; text-align:right;
  font-family:'Libre Baskerville',serif;
  font-style:italic;
  font-size:11px;
  color:var(--subtle);
  line-height:1.4;
">2019</div>
```

### Ink Underline Highlight

```html
<!-- Key phrase highlighting — feels like pen underline -->
<span style="
  background: linear-gradient(0deg, rgba(192,85,61,0.18) 35%, transparent 35%);
  padding: 0 2px;
">key phrase</span>
```

---

## Milestone Timeline (Emotional Arc Visual)

The most distinctive section for story-first personal brands — displays the founder's real journey with honest emotional labeling.

### Timeline Node Styling

```css
.timeline-node {
  display: flex;
  gap: 24px;
  position: relative;
  padding-bottom: 32px;
}

.timeline-node::before {
  content: '';
  position: absolute;
  left: 20px; top: 40px; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--accent) 0%, var(--faint) 100%);
}

.timeline-dot {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 11px;
  color: white;
  background: var(--accent);
  box-shadow: 0 3px 12px rgba(192,85,61,0.25);
}

/* Low point nodes use slate instead of terracotta */
.timeline-dot.low {
  background: var(--slate);
  box-shadow: 0 3px 12px rgba(61,90,128,0.25);
}

/* Current/now node uses sage */
.timeline-dot.now {
  background: var(--sage);
  box-shadow: 0 3px 12px rgba(107,143,113,0.25);
}
```

---

## What NOT to Use Visually

| Forbidden | Why |
|-----------|-----|
| Corporate headshot (power pose, neutral BG) | Kills authenticity — the opposite of this theme's energy |
| Flat color illustration (cartoon style) | Too playful, loses the literary weight |
| Dark or black photo filters | This theme is warm light, not drama |
| Neon or high-saturation color accents | Jarring against the warm palette |
| Icon libraries (Heroicons, Lucide default style) | Generic — use custom SVG organics instead |
| Stock-style "success" imagery (fancy car, money) | Wrong transformation type for this theme |
| Perfect symmetry in every section | Organic asymmetry feels more human |
| Animated elements faster than 0.5s | Rushed animations break the contemplative mood |
| Sans-serif for display / headings | Must be Libre Baskerville — this is non-negotiable |
