# Warm Authority — Visuals Reference

## Portrait Photo Treatment

### Warm Professional Filter
All portrait photos get this CSS filter for a warm, approachable look:
```css
/* Standard portrait */
filter: sepia(0.08) saturate(1.1) brightness(1.02) contrast(0.97);

/* Hero portrait — slightly richer */
filter: sepia(0.10) saturate(1.12) brightness(1.00) contrast(0.98);

/* Background / subtle use */
filter: sepia(0.05) saturate(1.05) brightness(1.03);
```

### Portrait Container (Hero)
```html
<div class="portrait-wrap">
  <img src="[PORTRAIT_IMAGE]"
       alt="[Name]"
       class="portrait-img"
       style="filter:sepia(0.08) saturate(1.1) brightness(1.02);">
  <!-- Warm glow ring -->
  <div class="portrait-glow"></div>
</div>
```
```css
.portrait-wrap {
  position: relative;
  display: inline-block;
}
.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}
.portrait-glow {
  position: absolute;
  inset: -8px;
  border-radius: 24px;
  background: radial-gradient(ellipse at center, rgba(181,115,42,0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}
```

### Portrait SVG Placeholder
```html
<div style="width:100%;height:100%;background:#efe6d8;border-radius:20px;
            display:flex;align-items:center;justify-content:center;
            border:1px solid #ddd0be;">
  <svg viewBox="0 0 160 200" fill="none" style="width:60%;opacity:0.35">
    <circle cx="80" cy="65" r="38" stroke="#b5732a" stroke-width="1.5"
            fill="rgba(181,115,42,0.06)"/>
    <path d="M18 188 C18 152 44 132 80 132 C116 132 142 152 142 188"
          stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"
          fill="rgba(181,115,42,0.04)"/>
  </svg>
</div>
```

---

## Media Logo Display (Speaker Credibility)

Show press logos / publication logos in muted warm style:
```html
<div class="media-logos">
  <span class="media-label">Được đề cập bởi</span>
  <div class="logo-row">
    <!-- Each logo as SVG text or grayscale img, hover to amber -->
    <div class="logo-item">
      <span style="font-family:'Lora',serif;font-weight:700;
                   font-size:1.1rem;color:#8a7560;letter-spacing:-0.02em;">Forbes</span>
    </div>
    <!-- Or real logo: -->
    <div class="logo-item">
      <img src="[LOGO_URL]" alt="CafeF"
           style="height:24px;filter:grayscale(1) sepia(0.3) brightness(0.7);
                  transition:filter 0.2s;">
    </div>
  </div>
</div>
```
```css
.logo-item:hover img {
  filter: grayscale(0) sepia(0.2) saturate(1.1);
}
```

---

## Achievement Badge Style

Amber-bordered, serif label — floats near portrait:
```html
<!-- Amber credential badge -->
<div class="achievement-badge">
  <div class="badge-icon">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke="#b5732a" stroke-width="1.5"/>
      <path d="M10 5 L11.6 8.4 L15.4 8.9 L12.7 11.5 L13.4 15.3 L10 13.5
               L6.6 15.3 L7.3 11.5 L4.6 8.9 L8.4 8.4 Z"
            fill="#b5732a" opacity="0.85"/>
    </svg>
  </div>
  <div>
    <p class="badge-title">[Achievement — Forbes 30 Under 30]</p>
    <p class="badge-sub">[Year]</p>
  </div>
</div>
```
```css
.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fdf9f4;
  border: 1px solid rgba(181,115,42,0.25);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(30,22,10,0.06);
}
.badge-title {
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 0.78rem;
  color: #1e160a;
}
.badge-sub {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.68rem;
  color: #8a7560;
  margin-top: 1px;
}
```

---

## Before/After Client Results Format

Used in case studies and testimonial cards:
```html
<div class="before-after">
  <div class="ba-col before">
    <span class="ba-label">Trước</span>
    <div class="ba-metric">
      <span class="ba-num" style="font-family:'Source Code Pro',monospace;color:#8a7560;">2.3 tỷ</span>
    </div>
    <p class="ba-desc">Doanh thu hàng năm, tăng trưởng chậm</p>
  </div>
  <div class="ba-arrow">→</div>
  <div class="ba-col after">
    <span class="ba-label" style="color:#2d5016;">Sau 12 tháng</span>
    <div class="ba-metric">
      <span class="ba-num" style="font-family:'Source Code Pro',monospace;color:#b5732a;">7.8 tỷ</span>
    </div>
    <p class="ba-desc">Tăng 239% · Hệ thống vận hành tự động</p>
  </div>
</div>
```
```css
.before-after {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: #efe6d8;
  border-radius: 12px;
  border: 1px solid #ddd0be;
}
.ba-col { flex: 1; }
.ba-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a7560;
}
.ba-num {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  display: block;
  margin: 6px 0 4px;
}
.ba-desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.75rem;
  color: #8a7560;
  line-height: 1.4;
}
.ba-arrow {
  font-size: 1.2rem;
  color: #b5732a;
  font-weight: 600;
}
```

---

## Handshake / Collaboration Icon (Thin Line, Amber)

```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Left hand -->
  <path d="M4 20 L12 14 L18 16 L22 14 L26 14" stroke="#b5732a" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right hand -->
  <path d="M36 20 L28 14 L22 16" stroke="#b5732a" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Handshake center -->
  <path d="M18 16 L22 18 L26 14 L30 16 L28 20 L22 22 L16 20 L18 16 Z"
        stroke="#b5732a" stroke-width="1.5" stroke-linejoin="round" fill="rgba(181,115,42,0.08)"/>
  <!-- Bottom arms -->
  <path d="M12 20 L10 26" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M28 20 L30 26" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

## Growth / Upward Arrow Icon
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 24 L14 14 L18 18 L26 8" stroke="#2d5016" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 8 L26 8 L26 12" stroke="#2d5016" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Consultant Toolkit / Briefcase Icon
```svg
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="13" width="28" height="18" rx="3" stroke="#b5732a" stroke-width="1.5" fill="rgba(181,115,42,0.06)"/>
  <path d="M12 13 L12 9 C12 7.3 13.3 6 15 6 L21 6 C22.7 6 24 7.3 24 9 L24 13"
        stroke="#b5732a" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="4" y1="21" x2="32" y2="21" stroke="#b5732a" stroke-width="1" opacity="0.4"/>
  <line x1="18" y1="19" x2="18" y2="23" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

## Document / Strategy Icon
```svg
<svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="28" height="32" rx="3" stroke="#b5732a" stroke-width="1.5"
        fill="rgba(181,115,42,0.04)"/>
  <line x1="8" y1="11" x2="24" y2="11" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="16" x2="24" y2="16" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="21" x2="18" y2="21" stroke="#b5732a" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="23" cy="27" r="5" stroke="#2d5016" stroke-width="1.5" fill="rgba(45,80,22,0.08)"/>
  <path d="M21 27 L22.5 28.5 L25.5 25.5" stroke="#2d5016" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

---

## Credential Seal (Amber Ring)

Circular seal for guarantee, certification:
```html
<div class="credential-seal">
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer ring -->
    <circle cx="36" cy="36" r="33" stroke="#b5732a" stroke-width="1.5"
            stroke-dasharray="4 3" opacity="0.4"/>
    <!-- Inner ring -->
    <circle cx="36" cy="36" r="27" stroke="#b5732a" stroke-width="1.5" fill="rgba(181,115,42,0.06)"/>
    <!-- Star -->
    <path d="M36 18 L39 29 L51 29 L41.5 36 L44.5 47 L36 40 L27.5 47
             L30.5 36 L21 29 L33 29 Z"
          fill="#b5732a" opacity="0.8"/>
  </svg>
</div>
```

---

## Result Metric Display (Source Code Pro)

Used in stats-bar and testimonial results:
```html
<div class="metric-display">
  <span class="metric-number">45M+</span>
  <span class="metric-label">doanh thu tạo ra</span>
  <span class="metric-unit">VND</span>
</div>
```
```css
.metric-number {
  font-family: 'Source Code Pro', monospace;
  font-weight: 600;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #b5732a;
  line-height: 1;
}
.metric-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  color: #8a7560;
  display: block;
  margin-top: 4px;
}
.metric-unit {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.65rem;
  color: #8a7560;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Forest Green Checkmark (Results)

Used in pricing and feature lists:
```html
<div class="check-item">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px">
    <circle cx="8" cy="8" r="7.5" fill="rgba(45,80,22,0.10)" stroke="rgba(45,80,22,0.30)"/>
    <path d="M5 8 L7 10 L11 6" stroke="#2d5016" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span style="font-family:'Source Sans 3',sans-serif;font-size:0.88rem;color:#4a3520;">[Feature text]</span>
</div>
```

---

## Warm Separator

Replace plain `<hr>` with warm separator:
```html
<div style="display:flex;align-items:center;gap:12px;margin:32px 0;">
  <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#ddd0be);"></div>
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1 L7.2 4.8 L11 4.8 L7.8 7.2 L9 11 L6 8.8 L3 11 L4.2 7.2 L1 4.8 L4.8 4.8 Z"
          fill="#b5732a" opacity="0.5"/>
  </svg>
  <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#ddd0be);"></div>
</div>
```
