# SVG / CSS Toolkit — Copy-Adapt-Paste Primitives

> Loaded by `prompts/html-generator.md` (conditional — chỉ khi scene cần SVG primitive cụ thể).
> Tách ra từ `layout-patterns.md` (lines 230-287 cũ) để giảm token waste khi load layout patterns.

Các snippet này là **building blocks**, KHÔNG phải pattern. Copy → adapt theo content/palette → paste vào scene HTML.

═══════════════════════════════════════════════════════════════════
CHART PRIMITIVES
═══════════════════════════════════════════════════════════════════

📈 LINE CHART (stroke-dasharray draw-on):
```html
<svg viewBox="0 0 800 400">
  <path class="chart-line" d="M 50,300 L 200,250 L 350,180 L 500,220 L 650,90 L 750,110"
        stroke="#DFFF00" stroke-width="6" fill="none" stroke-linecap="round"
        stroke-dasharray="900" stroke-dashoffset="900"/>
  <circle class="end-dot" cx="750" cy="110" r="14" fill="#DFFF00"/>
</svg>
```
GSAP: `tl.to(".chart-line", { strokeDashoffset: 0, duration: 1.4, ease: "power2.in" }, 0.5);`

📊 BAR CHART (CSS only):
```html
<div class="bars">
  <div class="bar" style="--h:70%"><span>2023</span></div>
  <div class="bar" style="--h:45%"><span>2024</span></div>
  <div class="bar" style="--h:90%"><span>2025</span></div>
</div>
```
```css
.bar { width: 80px; height: var(--h); background: linear-gradient(180deg, #DFFF00, #BFFF00);
       transform-origin: bottom; transform: scaleY(0); }
```
GSAP: `tl.to(".bar", { scaleY: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 0.3);`

═══════════════════════════════════════════════════════════════════
GEO PRIMITIVES
═══════════════════════════════════════════════════════════════════

🌍 GEO PATH (simplified region):
```html
<svg viewBox="0 0 1080 800">
  <path d="M 200,300 C 350,250 550,280 700,320 C 750,400 720,500 600,520 C 400,540 250,480 220,400 Z"
        fill="rgba(191,255,0,0.06)" stroke="#BFFF00" stroke-width="2"/>
</svg>
```

═══════════════════════════════════════════════════════════════════
OBJECT PRIMITIVES (CSS shapes — không cần asset)
═══════════════════════════════════════════════════════════════════

🪙 COIN (CSS gold coin):
```html
<div class="coin">$</div>
```
```css
.coin { width:120px; height:120px; border-radius:50%;
        background: radial-gradient(circle at 30% 30%, #FFE066 0%, #FFD700 50%, #B8860B 100%);
        display:flex; align-items:center; justify-content:center;
        font-size:64px; font-weight:900; color:#5C4400;
        box-shadow: 0 0 30px rgba(255,215,0,0.6), inset 0 -8px 16px rgba(0,0,0,0.3); }
```

⚡ LIGHTNING / BOLT:
```html
<svg viewBox="0 0 100 200">
  <path d="M 60,0 L 20,100 L 50,100 L 30,200 L 80,80 L 50,80 Z"
        fill="#DFFF00" filter="drop-shadow(0 0 8px #DFFF00)"/>
</svg>
```

🎯 TARGET / CIRCLES NESTED:
```html
<div class="target">
  <div class="ring r1"></div>
  <div class="ring r2"></div>
  <div class="ring r3"></div>
  <div class="bull"></div>
</div>
```
```css
.ring { position:absolute; border:2px solid #BFFF00; border-radius:50%;
        top:50%; left:50%; transform:translate(-50%,-50%); }
.r1 { width:200px; height:200px; opacity:0.3 }
.r2 { width:140px; height:140px; opacity:0.5 }
.r3 { width:80px; height:80px; opacity:0.7 }
.bull { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
        width:30px; height:30px; border-radius:50%; background:#DFFF00;
        box-shadow:0 0 20px #DFFF00 }
```

═══════════════════════════════════════════════════════════════════
ANIMATION PRIMITIVES (GSAP recipes)
═══════════════════════════════════════════════════════════════════

- **Draw-on path:** `stroke-dasharray="L"` + `stroke-dashoffset="L"` → tween `strokeDashoffset: 0`
- **Scale-in elastic:** `from { scale: 0, opacity: 0 }` ease `back.out(1.6)` hoặc `elastic.out(1, 0.5)`
- **Stagger reveal:** `tl.from(items, { y: 30, opacity: 0, stagger: 0.12 })`
- **Slide-in from edge:** `from { x: ±60, opacity: 0 }`
- **Pulse glow finite:** `tl.to(el, { boxShadow: "...", repeat: 2-3, yoyo: true })`
- **Counter count-up:** KHÔNG runtime — pre-compute final value, animate scale/opacity
- **Conic gradient sweep:** animate `--angle` CSS var qua GSAP `--angle`

═══════════════════════════════════════════════════════════════════
SHAPE PRIMITIVES (CSS-only)
═══════════════════════════════════════════════════════════════════

- **Tròn:** `border-radius: 50%`
- **Pill:** `border-radius: 999px` (badge, button, capsule)
- **Tam giác:** `width/height: 0` + border tricks
- **Glow:** `box-shadow: 0 0 Npx <color>` hoặc `filter: drop-shadow(...)`
- **Blur orb (atmosphere):** big div + `filter: blur(40px)` + radial gradient
- **Card neon border:** border + box-shadow neon outer + inner subtle
- **Connection curve giữa 2 element:** SVG `<path d="M x1,y1 Q midX,midY x2,y2"/>`
- **Conic gradient (sectors, dial):** `conic-gradient(from Xdeg, ...)`
- **Repeating grid bg:** `linear-gradient` với transparent + colored stripes
- **Hand-drawn border:** `border-radius: "63% 37% 54% 46% / 55% 48% 52% 45%"`
