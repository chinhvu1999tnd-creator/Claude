---
name: designer
description: "Landing page HTML generation. Stack: Tailwind CSS CDN + dark-bold-neon theme. Workflow: copy-brief → design brief → HTML using pattern library."
version: 8.0.0
agent: funnel
tags: [designer, landing-page, html, tailwind, design-brief]
---

# Designer Skill — Tailwind Landing Page Generator

**Stack:** HTML + Tailwind CSS CDN + CSS Variables + dark-bold-neon patterns

---

## Landing Pattern — Chọn theo Intent

Trước khi chọn Mode A/B, xác định **landing pattern** phù hợp với mục tiêu conversion. Pattern này ảnh hưởng đến section order và CTA placement.

| Intent | Pattern | Section Order chính | CTA Placement |
|--------|---------|---------------------|---------------|
| Bán khóa học / coaching | **Hero + Testimonials + CTA** | Hero → Problem → Solution → Proof → CTA | Hero (sticky) + sau testimonials |
| Giới thiệu tool / SaaS | **Product Demo + Features** | Hero → Demo/mockup → Features → So sánh → CTA | Video center + CTA cuối |
| Thu lead / opt-in | **Lead Magnet + Form** | Hero (benefit) → Preview lead magnet → Form (≤3 fields) → CTA submit | Form submit button |
| Webinar / event | **Webinar Registration** | Hero (topic + countdown + form) → Nội dung học → Speaker → Urgency → Form lại | Hero right-side form + bottom |
| Chốt deal / sales page dài | **Scroll-Triggered Storytelling** | Hook → Problem (ch.1) → Hành trình (ch.2) → Solution (ch.3) → CTA climax | Cuối mỗi chapter (mini) + climax |
| Show kết quả / transformation | **Before-After Transformation** | Hero (pain state) → Transformation reveal → How it works → CTA | Sau transformation + bottom |
| Sản phẩm physical / e-commerce | **Feature-Rich Showcase** | Hero → Feature grid → Use cases → Social proof → CTA | Hero (sticky) + sau features + bottom |
| Tạo authority / B2B | **Trust & Authority + Conversion** | Hero (credibility) → Logos/stats → Solution → CTA rõ | Contact/Quote (primary) + nav |
| Launch / waitlist | **Waitlist / Coming Soon** | Hero + countdown → Preview → Email capture → Waitlist count | Form nổi bật above fold |
| One-page đơn giản | **Minimal Single Column** | Hero headline → 3 benefits max → CTA → Footer | Center, 1 CTA lớn |

**Ghi chú áp dụng cho VN market:**
- Coaching/education: pattern "Hero + Testimonials" + thêm **kết quả học viên cụ thể** (không chỉ quote) trước CTA
- Lead funnel: form email-only mặc định — xem `leads-funnel/SKILL.md`
- Webinar: thêm **múi giờ VN** (GMT+7) vào countdown timer
- Trust & Authority: **logo báo chí VN** (VnExpress, Tuổi Trẻ) có weight cao hơn quốc tế với người VN

---

## Chọn Mode

```
USER INTENT                          → MODE
─────────────────────────────────────────────────────────────────
Cần page nhanh, nhất quán            → A: Template
Muốn page độc đáo, layout sáng tạo  → B: Creative
Không chắc                           → hỏi user 1 câu rồi quyết
```

---

## Load Order

### Mode A — Template
> Themes + Patterns dùng đầy đủ. frontend-design chỉ polish aesthetic nhẹ.

```
1. BUSINESS.md + THEME.md             → brand colors → :root variables
2. themes/{theme}/DESIGN.md           → aesthetic guardrails (colors, typography, motion rules)
3. themes/{theme}/tailwind.config.js  → paste vào <script>
4. themes/{theme}/patterns/*.html     → theme-specific overrides (ưu tiên trước shared)
5. themes/patterns/*.html             → shared fallback patterns
6. themes/shared/base.css             → utility classes · animations  ⚠️ inline bắt buộc
7. themes/shared/vn-context.md        → VN market rules
8. frontend-design/SKILL.md           → font override + editorial moments (subordinate)
9. references/ai-tells-audit.md       → ⚠️ pre-output audit · banned patterns · VN-specific tells
```

### Mode B — Creative
> Theme chỉ cung cấp foundation. frontend-design dẫn dắt layout + aesthetic.

```
1. BUSINESS.md + THEME.md             → brand colors → :root variables
2. blueprints/{page-type}.md          → visual intent · section order từ funnel skill nếu active ⚠️ load trước khi design
3. themes/shared/base.css             → utility classes · animations  ⚠️ inline bắt buộc
4. themes/shared/vn-context.md        → VN market rules
5. frontend-design/SKILL.md           → aesthetic direction + LAYOUT (dominant)
6. themes/patterns/*.html             → đọc CONTENT SCHEMA only, không copy layout
   (DESIGN.md và tailwind.config KHÔNG load — frontend-design tự quyết)
7. references/ai-tells-audit.md       → ⚠️ pre-output audit · banned patterns · VN-specific tells
```

**Blueprint load rule:** Xác định page type từ funnel skill đang active → load blueprint tương ứng:

| Page type | Blueprint |
|-----------|-----------|
| Sales page chính | `blueprints/sales-page.md` |
| Opt-in / Lead magnet | `blueprints/lead-magnet.md` |
| Webinar registration | `blueprints/webinar.md` |
| Booking call landing | `blueprints/booking-call.md` |
| Challenge registration | `blueprints/challenge.md` |
| OTO page | `blueprints/oto.md` |
| Thank You — sau mua | `blueprints/ty-purchase.md` |
| Thank You — lead magnet | `blueprints/ty-lead.md` |
| Thank You — webinar | `blueprints/ty-webinar.md` |
| Thank You — booking | `blueprints/ty-booking.md` |

**Sự khác biệt cốt lõi giữa 2 modes:**

| | Template Mode | Creative Mode |
|---|---|---|
| Theme | Đầy đủ (DESIGN.md + config + overrides) | Colors + base.css only |
| Patterns | Scaffold đầy đủ (layout + content) | Content Schema only |
| frontend-design | Polish nhẹ (font, editorial moments) | Dominant (layout + aesthetic) |
| Output | Nhất quán với theme system | Độc đáo, không giống template nào |

**Theme hiện tại:** Xác định qua `theme-advisor` (tự động) hoặc user chỉ định.
**Thêm theme mới thủ công:** Chỉ tạo `themes/{name}/DESIGN.md` + `themes/{name}/tailwind.config.js`.
**Tạo theme tự động:** Load `theme-generator/SKILL.md` — derive từ brand color + industry.

### ⚠️ frontend-design — Bắt buộc load sau base.css

`frontend-design/SKILL.md` **PHẢI được load** cho mọi page build — không ngoại lệ.

**Phân công rõ ràng:**

| Layer | Skill | Vai trò |
|-------|-------|---------|
| **Foundation** | page-designer | base.css · patterns · section rhythm · VN context · SePay |
| **Aesthetic** | frontend-design | font direction · color philosophy · motion philosophy · distinctiveness |

**Quy tắc kết hợp:**
- page-designer cung cấp **scaffold** (pattern files, base classes, section phase arc)
- frontend-design cung cấp **aesthetic override** lên scaffold đó:
  - Font display: thay Inter Tight bằng font distinctive hơn (Bricolage Grotesque, Syne, v.v.)
  - Thêm editorial font (DM Serif Display, Playfair Display) cho italic moments trong headline
  - Giữ màu accent của theme HOẶC override nếu context cần direction khác hẳn
  - Không được viết CSS từ đầu — chỉ override trên base.css đã có
- **KHÔNG** dùng frontend-design để thay thế patterns — chỉ để nâng aesthetic của patterns lên

### ⚠️ base.css — Bắt buộc inline vào HTML output

`themes/shared/base.css` **KHÔNG được import bằng `<link>`** — file này không tồn tại trên server khi deploy.

**Quy tắc:** Toàn bộ nội dung `base.css` phải được copy nguyên vào `<style>` block của HTML output, ngay sau `:root` block.

```html
<style>
  /* 1. CSS Variables từ THEME.md */
  :root { ... }

  /* 2. base.css — inline toàn bộ nội dung file tại đây */
  /* BẮT ĐẦU base.css */
  .bg-grid { ... }
  .bg-dots { ... }
  .btn-glow { ... }
  .reveal { ... }
  /* ... toàn bộ nội dung base.css ... */
  /* KẾT THÚC base.css */
</style>
```

**Lý do:** Các class `.bg-grid`, `.bg-dots`, `.bg-grid-lg`, `.btn-glow`, `.glass`, `.reveal`, `.animate-live` v.v. được định nghĩa trong `base.css`. Nếu không inline, Tailwind CDN không nhận ra — background patterns, animations, glass cards sẽ không render. Đây là nguyên nhân phổ biến nhất khiến page trông "plain" (nền solid, không có texture).

---

## Theme Selection Flow

```
Trước khi generate HTML, luôn xác định theme theo thứ tự:

1. User đã chỉ định theme? → dùng theme đó
2. THEME.md có --theme-slug? → dùng slug đó
3. Chưa có → load theme-advisor/SKILL.md
   ├── Score ≥ 5 → recommend existing theme
   └── Score < 5 → load theme-generator/SKILL.md → tạo custom theme
```

## Brand Color Override (luôn áp dụng)

```
THEME.md: --color-primary: [HEX]
    ↓
Trong :root block của HTML:
  --accent:     [HEX]          ← thay màu accent của theme bằng brand color
  --accent-rgb: [R, G, B]      ← tính từ HEX
  [Tất cả vars khác giữ nguyên của theme]
```

## Available Themes — 16 themes

| Slug | Ngành | Bg | Font |
|------|-------|----|------|
| `dark-bold-neon` | AI, Tech, SaaS, Marketing automation | Dark | Inter Tight |
| `bright-learn` | Khóa học, E-learning, Kỹ năng | Light | Plus Jakarta Sans |
| `trust-navy` | Tài chính, Đầu tư, Luật, B2B formal | Dark | IBM Plex Serif |
| `warm-earth` | Nông sản, Thực phẩm, SME local, Handmade | Light warm | Nunito |
| `prestige-dark` | Luxury, BĐS cao cấp, Xe hơi, Premium | Dark | Cormorant Garamond |
| `clean-clinic` | Y tế, Phòng khám, Dược phẩm, Wellness | Light clinical | Inter |
| `bold-appetite` | Nhà hàng, F&B, Cafe, Ẩm thực | Dark warm | Fraunces |
| `minimal-mono` | Thời trang, Creative agency, Portfolio | Light minimal | Space Grotesk |
| `energy-sport` | Gym, Thể thao, Supplement, Fitness | Dark | Barlow Condensed |
| `soft-luxe` | Skincare, Beauty, Spa, Mỹ phẩm | Light soft | Playfair Display |
| `warm-authority` | Business coach, Consultant, Career coach | Light warm | Lora |
| `bold-persona` | Speaker, Entrepreneur, Thought leader | Light modern | Syne |
| `story-first` | Life coach, Podcaster, Author, Creator | Light warm | Libre Baskerville |
| `[custom]` | Bất kỳ ngành nào không có sẵn | Derived | Derived |

---

## Pattern Load Rule — Theme Overrides

Khi cần dùng một pattern, **kiểm tra theme-specific folder trước, fallback về shared:**

```
1. themes/{theme-name}/patterns/{pattern}.html   ← theme-specific override (ưu tiên)
2. themes/patterns/{pattern}.html               ← shared fallback
```

**Ví dụ với dark-bold-neon:**
- `themes/dark-bold-neon/patterns/stats-bar.html` tồn tại → dùng override (dark cards + neon glow)
- `themes/dark-bold-neon/patterns/hero.html` không tồn tại → dùng `themes/patterns/hero.html`

**Override hiện có cho dark-bold-neon** (`themes/dark-bold-neon/patterns/`):

| Pattern | Override so với shared |
|---------|----------------------|
| `announcement-bar.html` | Dark surface bg + neon text + live dot (vs. accent bg) |
| `stats-bar.html` | Dark raised cards per stat + neon metric glow (vs. dividers) |
| `pricing-card.html` | Neon box-shadow glow + price text-shadow (vs. gradient border only) |
| `countdown-cta.html` | All timer boxes glow + seconds pulse (vs. surface border only) |
| `guarantee-card.html` | Pulsing ring behind shield + animated neon border (vs. static) |
| `cta-strip.html` | Oversized blobs + dark-on-neon button + micro trust row (vs. standard) |
| `testimonials.html` | Dark raised cards + neon quote marks + result tag glow (vs. glass cards) |

**Override hiện có cho bright-learn** (`themes/bright-learn/patterns/`):

| Pattern | Layout change | Override so với shared |
|---------|--------------|----------------------|
| `announcement-bar.html` | Không | Orange bg + white live dot (vs. neon lime strip) |
| `stats-bar.html` | Không | White dividers + multi-color numbers (vs. dark glow cards) |
| `hero.html` | **2-col split** | Text trái + floating result cards phải (vs. centered dark canvas) |
| `pricing-card.html` | Không | Purple 2px border + soft shadow + teal checks (vs. neon glow) |
| `countdown-cta.html` | **Side-by-side** | Timer trái + headline+CTA phải (vs. stacked centered) |
| `guarantee-card.html` | **2-col** | Seal/icon trái + text phải (vs. centered pulsing dark) |
| `testimonials.html` | **2-col masonry** | White cards + star ratings + colored badges (vs. dark 3-col) |
| `cta-strip.html` | **2-col split** | Text+trust trái + form phải (vs. centered stacked) |
| `curriculum-progress.html` | **New pattern** | Accordion modules + progress bars + lesson list (education-only) |

**Shared patterns thêm mới cho Personal Brand** (`themes/patterns/`):

| Pattern | Mô tả | Dùng cho |
|---------|-------|---------|
| `hero-portrait.html` | 2-col: copy+credentials trái · portrait photo phải · floating badges | warm-authority · bold-persona · story-first |
| `speaker-credibility.html` | Media logos strip + book/podcast/speaking featured items | Mọi personal brand theme |
| `milestone-timeline.html` | Vertical timeline hành trình: turning point + low point + present | Mọi personal brand theme |

**Shared patterns — Modal Popup** (`themes/patterns/`):

| Pattern | Variant | Trigger | Dùng khi |
|---------|---------|---------|---------|
| `modal-popup.html` | A — Exit-intent lead capture | `mouseleave` document | Visitor sắp rời trang · cần capture email |
| `modal-popup.html` | B — Timed offer / downsell | `setTimeout` (default 20s) | Muốn interrupt sau khi visitor đọc đủ lâu |
| `modal-popup.html` | C — Scroll-triggered corner strip | scroll ≥ 60% page | Remind nhẹ · không muốn block content |

**Quy tắc dùng modal:**
- Chỉ dùng **1 modal** trên 1 trang — không chồng nhiều trigger
- Variant A (exit-intent) cho sales page dài — recover visitor trước khi mất
- Variant B (timed) cho opt-in page — introduce offer sau khi visitor warm up
- Variant C (scroll corner) cho blog / content page — least intrusive
- Tất cả variants: localStorage cooldown tránh show lặp · ESC + click-outside để close
- Xưng hô trong copy: **bạn/tôi** — KHÔNG anh/chị

**Override hiện có cho trust-navy** (`themes/trust-navy/patterns/`):

| Pattern | Layout change | Override so với shared |
|---------|--------------|----------------------|
| `announcement-bar.html` | Không | Navy bg + gold left border + mono text (vs. colored bg) |
| `stats-bar.html` | **Data panel** | Dense rows + positive/negative coloring + disclaimer timestamp |
| `hero.html` | **2-col split** | Serif headline trái + metrics panel phải (vs. centered neon) |
| `pricing-card.html` | **3-col table** | Horizontal comparison table (vs. single vertical card) |
| `countdown-cta.html` | **Enrollment date** | Calendar date display thay ticking clock (vs. countdown boxes) |
| `guarantee-card.html` | **Formal doc** | Numbered terms + signature + reference code (vs. shield graphic) |
| `testimonials.html` | **Case study rows** | Table rows + metrics inline (vs. card grid + star ratings) |
| `cta-strip.html` | Không | Gold bg + diagonal texture + minimal copy (vs. colored bg + form) |
| `trust-signals.html` | **New pattern** | Credentials + certifications + media bar (finance-specific) |

---

## Pattern Variant System

Các shared pattern core có **2-3 VARIANT blocks** — AI đọc tất cả và chọn 1 phù hợp nhất cho context.

### Format trong pattern file

```html
<!-- ═══════════════════════════════════════════════════════════════════
     VARIANT A: [Tên] (DEFAULT)
     Dùng khi: [scenario]
     ═══════════════════════════════════════════════════════════════════ -->
<section>... DEFAULT HTML ...</section>

<!-- ═══════════════════════════════════════════════════════════════════
     VARIANT B: [Tên]
     Dùng khi: [scenario]
     ═══════════════════════════════════════════════════════════════════ -->
<section>... VARIANT B HTML ...</section>
```

### Cách chọn variant

| Tín hiệu | → Variant |
|---|---|
| Theme dark + high-energy | A (Default) |
| Theme light / warm / editorial | B hoặc C |
| Creative Mode (Mode B) | Chọn variant phù hợp nhất HOẶC tự viết layout mới từ Content Schema |
| Theme-specific override tồn tại | Dùng override (luôn ưu tiên hơn shared variants) |

**Quy tắc output:** Chỉ output **1 variant** per section. Không bao giờ output cả 3. Không copy-paste cả file — chỉ section cần dùng.

### Variants có sẵn (shared patterns)

| Pattern | A (Default) | B | C |
|---------|-------------|---|---|
| `hero.html` | Centered canvas + blobs | 2-col split: copy left + stat panel right | Editorial oversized: H1 fills viewport |
| `stats-bar.html` | 4-col dividers, compact | Large centered metrics, editorial | Dashboard dense rows, B2B |
| `card-grid.html` | Glass cards 2-3 col | Numbered list rows | Compact horizontal gap-grid |
| `pricing-card.html` | Single card centered | 2-col: pitch left + card right | Full-width horizontal card · Variant D: 3-col compare + billing toggle (monthly/yearly) |
| `testimonials.html` | Featured case + 3-col cards | 2-col masonry + star ratings | Case study rows, horizontal |
| `cta-strip.html` | Centered + countdown + blobs | 2-col split: copy left + CTA right | Minimal stark: accent solid bg |

---

## Bento Grid — Hairline-as-Gap Trick

Khi build bento grid (features, agent grid, use cases), dùng technique này để tạo 1px hairline border giữa các cell — sạch hơn `gap` + `border` thông thường.

```css
/* Grid wrapper: background = màu hairline */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(180px, auto);
  background: var(--rim);   /* ← hairline color làm background */
  gap: 1px;                 /* ← 1px gap để background "lộ ra" thành border */
  border: 1px solid var(--rim); /* ← outer border cùng màu */
  border-radius: 16px;
  overflow: hidden;         /* ← clip border-radius vào cells */
}

/* Cell: background đặc để che background của grid */
.bento-cell {
  background: var(--surface);  /* ← cover grid background */
  padding: 32px;
}
```

**Bento cell spanning:**
```html
<div class="bento">
  <div class="bento-cell" style="grid-column: span 2; grid-row: span 2;">
    [Feature lớn]
  </div>
  <div class="bento-cell">[Feature nhỏ]</div>
  <div class="bento-cell">[Feature nhỏ]</div>
  <div class="bento-cell" style="grid-column: span 3;">[Feature full-width]</div>
</div>
```

**Ưu điểm so với `border: 1px solid` trên từng cell:**
- Không bị double border ở chỗ 2 cell chạm nhau
- Border-radius hoạt động đúng với `overflow: hidden` trên wrapper
- Swap theme: chỉ đổi `var(--rim)` là xong — không cần update từng cell

### Bento Grid — Nâng cấp (Apple-tier techniques)

**Hover scale + staggered reveal:**
```css
/* Hover: cell nhẹ nhàng phóng to khi mouse vào */
.bento-cell {
  transition: transform 300ms var(--ease-spring), box-shadow 300ms ease;
}
.bento-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  z-index: 2; /* nổi lên trên cells khác */
}

/* Staggered reveal — cells xuất hiện lần lượt khi scroll vào view */
.bento-cell { opacity: 0; transform: translateY(16px); }
.bento-cell.revealed { opacity: 1; transform: translateY(0); transition: opacity 500ms ease, transform 500ms ease; }
.bento-cell:nth-child(2).revealed { transition-delay: 80ms; }
.bento-cell:nth-child(3).revealed { transition-delay: 160ms; }
.bento-cell:nth-child(4).revealed { transition-delay: 240ms; }
```

```js
// Stagger IntersectionObserver
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1 }).observe(document.querySelector('.bento'));
```

**Video-inside bento cell:**
```html
<div class="bento-cell" style="grid-column: span 2; grid-row: span 2; padding: 0; overflow: hidden;">
  <video autoplay muted loop playsinline
         style="width:100%;height:100%;object-fit:cover;"
         aria-hidden="true">
    <source src="demo.mp4" type="video/mp4">
  </video>
  <!-- overlay label -->
  <div style="position:absolute;bottom:20px;left:20px;">
    <p style="color:var(--ink);font-family:var(--font-display);font-weight:700;">Demo trực tiếp</p>
  </div>
</div>
```

**Note:** `autoplay muted loop playsinline` — bộ 4 attribute bắt buộc để video tự play trên mobile Safari. Thiếu 1 trong 4 → video không chạy.

---

## Media Slot Rule — SVG vs. Placeholder

**Quy tắc cốt lõi:** Phân biệt rõ 2 loại visual. Không được dùng SVG art cho content image slots.

### SVG được phép (decorative)
- Section backgrounds: mountain silhouette, fog, stars, forest scene
- Section dividers: pine treeline strip, wave separator, grid lines
- Feature/activity icons: ≤ 36×36px, `stroke-linecap:round`
- Ambient effects: radial glow, campfire gradient, blob shapes
- Brand decorations: corner elements, watermarks

### SVG KHÔNG được dùng (content image slots)
Các slot sau **phải dùng placeholder ảnh**, không dùng SVG art:

| `data-role` | Loại ảnh | Placeholder emoji |
|-------------|----------|-------------------|
| `CONTEXT` | Hero full-bleed, lifestyle shot | 🖼️ |
| `PRODUCT` | Ảnh sản phẩm, cabin, course mockup | 📸 |
| `AVATAR` | Ảnh người dùng, instructor, testimonial | 👤 |
| `VIDEO` | Video embed (YouTube/Vimeo) | ▶️ |

### Standard Placeholder — dùng cho mọi content image slot

**Inline image (PRODUCT / card photo):**
```html
<div class="relative w-full aspect-video overflow-hidden media-slot" data-role="PRODUCT"
     style="background:var(--surface);border:2px dashed var(--faint)">
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
    <span style="font-size:2rem;opacity:0.35">📸</span>
    <p class="font-body text-xs font-medium" style="color:var(--subtle)">[Tên ảnh — VD: Ảnh cabin 1]</p>
    <p class="font-body text-[10px]" style="color:var(--faint)">16:9 · min 1200px wide</p>
  </div>
</div>
```

**Full-bleed hero (CONTEXT):**
```html
<div class="absolute inset-0 media-slot" data-role="CONTEXT"
     style="background:var(--surface);border:2px dashed var(--faint)">
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style="font-size:2.5rem;opacity:0.3">🖼️</span>
    <p class="font-body text-sm font-medium" style="color:var(--subtle)">[Ảnh hero full-bleed]</p>
    <p class="font-body text-xs" style="color:var(--faint)">1920×1080px · object-fit:cover · filter:brightness(0.5)</p>
  </div>
</div>
```

**Avatar / person photo (AVATAR):**
```html
<div class="media-slot" data-role="AVATAR"
     style="width:80px;height:80px;border-radius:50%;background:var(--surface);border:2px dashed var(--faint);display:flex;align-items:center;justify-content:center">
  <span style="font-size:1.5rem;opacity:0.4">👤</span>
</div>
```

**Video embed (VIDEO):**
```html
<div class="relative w-full aspect-video media-slot" data-role="VIDEO"
     style="background:var(--surface);border:2px dashed var(--faint)">
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style="font-size:2.5rem;opacity:0.35">▶️</span>
    <p class="font-body text-xs" style="color:var(--subtle)">[Embed YouTube/Vimeo URL]</p>
  </div>
</div>
```

### Swap ảnh thật — chỉ thay nội dung bên trong media-slot

```html
<!-- Trước (placeholder) -->
<div class="relative w-full aspect-video overflow-hidden media-slot" data-role="PRODUCT"
     style="background:var(--surface);border:2px dashed var(--faint)">
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
    <span style="font-size:2rem;opacity:0.35">📸</span>
    ...
  </div>
</div>

<!-- Sau (ảnh thật) -->
<div class="relative w-full aspect-video overflow-hidden media-slot" data-role="PRODUCT">
  <img src="cabin-01.jpg" alt="Cabin A"
       class="w-full h-full object-cover"
       style="filter:saturate(1.1) sepia(0.08) brightness(0.88)">
</div>
```

**Giữ nguyên div `media-slot` ngoài cùng** — chỉ thay nội dung bên trong.

---

## Bước 1 — Map THEME.md → CSS Variables

Đọc THEME.md, tạo `:root` block. **Tất cả màu sắc trong page đi qua đây — không hardcode hex trong HTML.**

```css
:root {
  /* Brand — từ THEME.md */
  --accent:      #B6FF00;        /* THEME.md: --color-primary */
  --accent-rgb:  182, 255, 0;    /* cho rgba(var(--accent-rgb), opacity) */
  --cyan:        #00C2FF;
  --cyan-rgb:    0, 194, 255;
  --alert:       #F0226A;
  --alert-rgb:   240, 34, 106;

  /* Aesthetic — dark-bold-neon */
  --bg:          #141413;
  --bg-rgb:      20, 20, 19;
  --surface:     #1E1E1C;
  --ink:         #faf9f5;
  --body:        #e8e6dc;
  --subtle:      #b0aea5;
  --faint:       #4a4845;
  --rim:         rgba(255,255,255,0.07);
  --rim-strong:  rgba(255,255,255,0.13);

  /* Semantic derived */
  --accent-dim:    rgba(var(--accent-rgb), 0.10);
  --accent-glow:   rgba(var(--accent-rgb), 0.22);
  --danger-dim:    rgba(239,68,68,0.07);
  --danger-border: rgba(239,68,68,0.18);
}
```

**Khi user đổi màu:** chỉ cần update `--accent` và `--accent-rgb` → toàn bộ page cập nhật.

---

## Bước 2 — Generate Design Brief (MANDATORY trước HTML)

**Từ copy-brief.md, generate design brief per section:**

```markdown
## [Tên Section]

Layout:     [flex/grid structure · alignment · max-width · responsive]
Background: [color/gradient · pattern/grid · blobs · dark|light variant]
Elements:   [danh sách UI elements — buttons, cards, text blocks, forms]
Visuals:    [images · SVG icons · blobs · decorative shapes · video]
Motion:     [animation classes · float · flow-light · reveal · intensity]
Pattern:    [tên file pattern sẽ dùng]
```

### Motion Intensity — hỏi user khi bắt đầu design brief

Trước khi generate brief, hỏi 1 câu:

```
Anh/chị muốn page có mức độ animation như thế nào?
A) Subtle — chỉ hover effects + scroll reveal (professional, ít distraction)
B) Medium — thêm float nhẹ, flow light trên timeline/workflow (recommended)
C) Bold — đầy đủ: blobs drift, shimmer borders, icon breathe, scan lines
```

Map intensity → classes:
| Intensity | Classes được dùng |
|-----------|-------------------|
| Subtle | `.reveal` · `.card-lift` · `.btn-glow` · hover only |
| Medium | + `.float-sm` · `.flow-line-v` · `.flow-line-h` · `.animate-live` |
| Bold | + `.float-gentle` · `.float-lg` · `.blob` · `.shimmer-border` · `.icon-breathe` · `.scan-line` |

Mặc định nếu user không trả lời: **Medium**.

**Ví dụ:**

```markdown
## Hero

Layout:     full-width · min-h-screen · flex items-center · text-center
            max-w-3xl centered
Background: radial-gradient #8B5CF6 top-center → #0D0B1E
            + grid 56px rgba(255,255,255,0.03)
Elements:
  - HOT badge pill: red label + copy text + 3 colored dots
  - H1: 3 lines · clamp(2.75rem→5.5rem) · white/purple/orange per word
  - Subtitle: 2 sentences · text-subtle · max-w-xl
  - 2 CTA buttons: gradient-purple primary + ghost secondary
  - Social proof row: avatar-stack + star rating (4.8/5) + shield guarantee
Visuals:
  - Blob 1: 500px · #8B5CF6 · blur-3xl · opacity-12 · top-left · animate-blob
  - Blob 2: 300px · #F97316 · blur-3xl · opacity-8 · bottom-right · animate-blob-2
Pattern:    hero-multicolor.html

## Problem Cards

Layout:     2-col grid · gap-3 · max-w-4xl · collapse 1-col mobile
Background: var(--bg) · no effects
Elements:
  - Section label + H2 headline (center)
  - 6 glass cards: danger icon-wrap (36px) + title + description text
Visuals:
  - SVG icons 16×16 · stroke var(--alert) · danger semantic
Pattern:    card-grid.html
```

**Workflow:**
```
Step 1: Đọc copy-brief → generate toàn bộ design brief
Step 2: Trình bày brief → CHỜ DUYỆT (hoặc automode)
Step 3: Build HTML từng section theo brief đã duyệt
```

---

## Bước 3 — Pattern Index (38 patterns · `themes/patterns/`)

### Navigation & Frame
| Section | File | Layout |
|---------|------|--------|
| Top navigation | `nav.html` | fixed · logo left · links center · CTA right |
| Announcement bar | `announcement-bar.html` | top strip · countdown · promo text |
| Sticky bottom bar | `sticky-bottom-bar.html` | fixed bottom · price left · CTA right |
| Footer | `footer.html` | 3-col grid · links · copyright |

### Hero
| Section | File | Layout |
|---------|------|--------|
| Hero — single gradient | `hero.html` | centered · blob bg · H1 + CTA |
| Hero — 3-color words | `hero-multicolor.html` | centered · HOT badge · multi-color H1 · avatar stack |
| Hero — split | `hero-split.html` | 2-col · text left · mockup right |
| Hero — minimal | `hero-minimal.html` | clean centered · warm traffic · no blobs |

### Social Proof & Trust
| Section | File | Layout |
|---------|------|--------|
| Stats numbers | `stats-bar.html` | 4-col horizontal · dividers · metric + label |
| Trust logos | `trust-logos.html` | flex wrap · grayscale logos · opacity hover |
| Badge row | `badge-row.html` | flex wrap · pill badges · icon + label |
| Testimonial cards | `testimonials.html` | featured case + 3-col testi cards · **luôn có [PERSON] ảnh** + tên + role/chức danh · CTA repeat ngay sau testimonials (+28% vs không repeat) |
| Review grid | `review-grid.html` | 3-col · star rating · avatar · verified |
| Tweet wall | `tweet-wall.html` | 3-col masonry · tweet cards · like count |
| Case study | `case-study-full.html` | surface card · metrics row · story + quote |
| Results counter | `results-counter.html` | 3-col · animated count-up · impact statement |

### Problem & Solution
| Section | File | Layout |
|---------|------|--------|
| Problem cards | `card-grid.html` | 2–3 col grid · danger icons · glass cards |
| Step mechanism | `problem.html` | 3-col steps · result bar · proof strip · dùng kết hợp với **3-step color progression** (red→orange→green) tăng narrative impact 3× time-on-page |
| Old vs New | `comparison.html` | 2-col split · strikethrough left · win right |
| Before / After | `before-after.html` | 2-col · **Before = desaturated/muted/grey tint** (discomfort) · **After = vibrant/accent tint** (relief) · specific metrics bắt buộc · **+45% conversion** vs text-only proof |
| Two paths | `two-paths.html` | 2-col · without vs with · VS badge center |

**Before-After color convention (bắt buộc):**
- **Before column:** `filter: grayscale(0.4) saturate(0.6)` + `--phase-accent: var(--destructive)` — visual discomfort, dùng red/muted
- **After column:** `filter: none` + `--phase-accent: var(--accent)` — vibrant, dùng accent color
- Bắt buộc có **metric cụ thể** trong After column: "Từ 3 giờ/ngày → 30 phút", "Từ 0 → 47 học viên tháng đầu"
- Không dùng generic copy như "Trước khi dùng" / "Sau khi dùng" — quá nhạt, không convert

### Features & Content
| Section | File | Layout |
|---------|------|--------|
| Feature alternating rows | `feature-rows.html` | 2-col alternating · image + text · +86% engagement khi có video demo |
| Bento grid | `bento-grid.html` | CSS grid · large cell + small cells · hairline-as-gap trick · hover `scale(1.02)` · hỗ trợ video-inside card · staggered reveal |
| Benefits grid | `card-grid.html` (accent variant) | 2–3 col · accent icons |
| Checklist | `checklist.html` | 2-col · check items · total value row |
| Curriculum modules | `curriculum.html` | 3-col grid · numbered · lesson list |
| Curriculum accordion | `curriculum-accordion.html` | single col · expand/collapse modules |
| Instructor bio | `instructor-bio.html` | 2-col · avatar + credentials + bio |

### Offer & Pricing
| Section | File | Layout |
|---------|------|--------|
| Offer stack | `offer-stack.html` | gradient border · divide-y · bonus tags |
| Pricing card | `pricing-card.html` | centered · gradient border · single tier |
| Pricing compare | `pricing-compare.html` | 3-col · center elevated · "Most popular" · pre-select tier giữa (+35% vs no pre-selection) · show annual discount 20–30% |
| Payment methods | `payment-methods.html` | centered · pill badges · security icons |
| Guarantee card | `guarantee-card.html` | centered · shield icon · gradient border |

### Qualification & Objections
| Section | File | Layout |
|---------|------|--------|
| For / Not for | `qual-grid.html` | 2-col · green check / red X |
| FAQ | `faq.html` | single col accordion · one-open-at-a-time |
| Objection handler | `objection-handler.html` | stacked cards · shield icon · Q+A |

### Urgency & CTA
| Section | File | Layout |
|---------|------|--------|
| Seats remaining | `seats-remaining.html` | danger bar · progress fill · pulsing dot |
| Countdown CTA | `countdown-cta.html` | 4-box timer · headline · CTA · grid bg |
| Final CTA strip | `cta-strip.html` | full accent bg · blobs · CTA + P.S. |
| Social proof ticker | `ticker-scroll.html` | horizontal marquee · logo/name/result scrolls infinitely · `aria-hidden` |

**Ticker/marquee pattern — khi nào dùng:** Trust bar phía trên hero, logo strip, kết quả khách hàng chạy ngang. Duplicate items để loop liền mạch.

```html
<!-- ticker-scroll: logo/name strip chạy vô tận -->
<div class="ticker-outer" aria-hidden="true">
  <div class="ticker-track">
    <!-- Duplicate items để loop liền mạch -->
    <span class="ticker-item">🎓 Nguyễn Minh — tăng 3× doanh thu</span>
    <span class="ticker-sep" aria-hidden="true">·</span>
    <span class="ticker-item">💼 Trần Hoa — 200 học viên tháng đầu</span>
    <span class="ticker-sep" aria-hidden="true">·</span>
    <!-- ...thêm items... -->
    <!-- duplicate toàn bộ để loop -->
    <span class="ticker-item">🎓 Nguyễn Minh — tăng 3× doanh thu</span>
    <span class="ticker-sep" aria-hidden="true">·</span>
  </div>
</div>
```

```css
.ticker-outer { overflow: hidden; white-space: nowrap; padding: 10px 0; }
.ticker-track {
  display: inline-flex; gap: 32px;
  animation: ticker-scroll 24s linear infinite;
}
@keyframes ticker-scroll { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
}
```

### Webinar Registration Page — specific patterns
| Section | File | Layout |
|---------|------|--------|
| Results proof | `webinar-results.html` | metric strip + 2–3 result cards · [PERSON] + [RESULT] slots |
| Solution / mechanism | `webinar-solution.html` | why old ways fail + mechanism card + [PROCESS] diagram slot |

### Challenge Funnel — specific patterns
> Chỉ dùng khi build challenge funnel. Default: registration + thank you đơn giản.

| Section | File | Layout |
|---------|------|--------|
| Transformation arc | `challenge-transformation.html` | Before/After 2-col · pain list left · result list right |
| Community proof | `challenge-community.html` | member count + activity feed · [CONTEXT] screenshot slot |
| Days preview | `challenge-days-preview.html` | vertical timeline · Day 1–N · quick win per day |
| For / Not For | `challenge-for-not-for.html` | 2-col · green check list / red X list · waitlist link |
| What happens next | `challenge-next-steps.html` | 4 numbered steps · timing per step · reduce anxiety |
| Thank you page | `challenge-ty.html` | confirmed + schedule + Zalo join · **[OPTIONAL: VIP upsell]** comment block |

**Challenge pattern rules:**
- `challenge-ty.html` mặc định KHÔNG có VIP upsell — chỉ uncomment khi user yêu cầu rõ ("thêm VIP upsell")
- VIP upsell block đặt trên Zalo Group join — vị trí convert cao nhất (15–30%)

### One Time Offer (OTO) — post-purchase page
> Chỉ dùng khi user yêu cầu. Trigger: SePay xác nhận đơn chính → redirect OTO page.

| Section | File | Layout |
|---------|------|--------|
| OTO header | `oto-header.html` | centered · order confirmed badge · momentum headline · **[OPTIONAL: VSL]** built-in · one-time warning |
| OTO video (VSL) | `oto-video.html` | standalone VSL pattern — dùng khi cần đặt video ở vị trí khác ngoài header |
| OTO offer block | `oto-offer.html` | centered card · [PRODUCT] slot · checklist · price anchor |
| OTO proof strip | `oto-proof.html` | 2-col · compact testimonials · [PERSON] avatar · result tag |
| OTO countdown | `oto-countdown.html` | centered · 3-box timer (HH:MM:SS) · auto-disable YES on expire |
| OTO CTA + QR | `oto-cta-qr.html` | 2 states: YES/NO → QR slides in · "Đã chuyển khoản" fallback |

**OTO page layout order (recommended):**
```
oto-header (VSL built-in, uncomment nếu có video) → oto-offer → oto-proof → oto-countdown → oto-cta-qr
```
**OTO Rules:**
- Không có nav, không có header/footer — chỉ YES hoặc NO, cả hai đều dẫn về Thank You
- YES → QR hiện ra ngay tại trang (State 2 của `oto-cta-qr.html`)
- NO → redirect Thank You không có OTO
- SePay webhook xác nhận OTO → redirect Thank You có OTO (hoặc dùng nút "Đã chuyển khoản" fallback)
- Chỉ 1 OTO offer — không có lựa chọn, không có tier
- VSL đã được tích hợp trong `oto-header.html` — uncomment `[OPTIONAL: VSL]` block khi user có video
- `oto-video.html` dùng khi cần đặt VSL ở vị trí khác ngoài header (hiếm)

### Thank You Pages — 4 loại, mỗi loại có layout riêng
> Chọn đúng nhóm pattern theo loại phễu. Shared patterns dùng chung được.

**1 — Post-Purchase (sau mua hàng)**
| Section | File | Layout |
|---------|------|--------|
| Purchase header | `ty-purchase-header.html` | confirmed checkmark · order summary · email notice |
| Product access | `ty-access.html` | primary CTA lớn · copy link backup · support contact |
| Next steps | `ty-next-steps.html` | 3–4 numbered steps · step 1 = hành động ngay |
| Community join | `ty-community.html` | Zalo Group primary · [OPTIONAL FB Group] · member count |
| Refer / Share | `ty-refer.html` | pre-filled message · Facebook + Zalo share · copy link |

**2 — Lead Magnet (sau opt-in)**
| Section | File | Layout |
|---------|------|--------|
| Lead magnet header | `ty-leadmag-header.html` | check email icon · 3-step instruction · spam tip |
| Direct download | `ty-download.html` | file card · download button · format + size — dùng nếu có file tải thẳng |
| Social follow | `ty-social-follow.html` | FB Page + Zalo OA + [OPTIONAL YouTube] pills |
| While you wait | `ty-while-you-wait.html` | soft bridge → main offer · ghost CTA, không push hard |

**3 — Webinar / Event (sau đăng ký)**
| Section | File | Layout |
|---------|------|--------|
| Webinar header | `ty-webinar-header.html` | purple badge · event detail card · join link |
| Notification + group | `ty-notification-group-join.html` | Zalo Group primary · [OPTIONAL chatbot] · calendar add phụ |
| Show-up tips | `ty-show-up-tips.html` | 4-tip grid · block lịch / vào sớm / tắt notif / chuẩn bị câu hỏi |
| Pre-event content | `ty-pre-event-content.html` | 1–2 content cards · [CONTEXT] thumbnail · warm-up |

**4 — Booking Call (sau đặt lịch)**
| Section | File | Layout |
|---------|------|--------|
| Booking header | `ty-booking-header.html` | confirmed badge · call detail card · [PERSON] host · join + reschedule link |
| Notification + group | `ty-notification-group-join.html` | *(dùng chung với webinar)* |
| Pre-call prep | `ty-pre-call-prep.html` | 3 câu hỏi chuẩn bị · textarea không submit · reduce anxiety |
| Pre-sell | `ty-pre-sell.html` | [RESULT] case study · 2 compact testimonials · [PERSON] avatar · build authority |

**Thank You Rules:**
- Post-purchase: `ty-access.html` phải là CTA to nhất trang — resolve buyer's remorse ngay
- Lead magnet: không redirect sang offer ngay — deliver trước, `ty-while-you-wait.html` pitch nhẹ sau
- Webinar: mọi element phục vụ show-up rate — `ty-notification-group-join.html` là quan trọng nhất
- Booking call: không pitch — chỉ warm up và reduce no-show, `ty-pre-sell.html` build authority ngầm
- `ty-notification-group-join.html`: Zalo Group/chatbot là primary ở VN, calendar add là phụ bên dưới

**Payment Rules:**
- `payment-form.html` và `payment-methods.html`: mặc định chỉ hiển thị VietQR
- Chỉ thêm MoMo / VNPAY / chuyển khoản / thẻ khi user **yêu cầu rõ ràng** trong lệnh build
  - "thêm MoMo" → uncomment MoMo pill + MoMo panel + tab switching script
  - "thêm chuyển khoản" → uncomment bank panel + tab switching script
  - "tất cả phương thức" → uncomment toàn bộ, dùng tabbed layout
- Nếu có nhiều hơn 1 phương thức → bắt buộc thêm tab UI và tab switching script

---

## Bước 4 — HTML Scaffold

```html
<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;0,900;1,400&family=Gentium+Book+Plus:ital,wght@1,400&family=Playfair+Display:ital,wght@1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>/* Paste tailwind.config.js content here */</script>
  <style>
    /* Step 1: CSS Variables từ THEME.md */
    :root { --accent: #B6FF00; --accent-rgb: 182,255,0; /* ... */ }
    /* Step 2: base.css (glass · btn-glow · text-gradient · reveal · section-label) */
  </style>
</head>
```

---

## Bước 5 — VN Context

- Touch targets ≥ 44px (min-h-[44px])
- Mobile: grids collapse về 1 col (sm: prefix)
- CTA: động từ hành động ("Tham gia ngay", "Xem ưu đãi")
- Giá: 297K / 997K / 1.997K charm pricing
- Payment: VietQR + Momo mention
- Trust: số học viên, bảo đảm hoàn tiền

---

## Pre-Delivery Checklist

- [ ] `:root` variables match THEME.md — không hardcode hex trong HTML
- [ ] Tailwind config block đã paste
- [ ] Fonts loaded với `font-display=swap` trong URL param
- [ ] Mobile: grids collapse sm:
- [ ] Touch targets ≥ 44px (min-h-[44px] cho mọi button/link)
- [ ] SVG icons — không dùng emoji structural
- [ ] CTA xuất hiện ≥ 3 lần
- [ ] Design brief đã duyệt trước khi build
- [ ] Hero dùng `min-height: 100dvh` — không phải `100vh` (trên iOS cũ dùng `100svh` an toàn hơn: `min(100dvh, 100svh)`)
- [ ] Body copy / paragraph blocks có `max-width: 68ch` (không span full container)
- [ ] Animation chỉ dùng `transform` và `opacity` — không `width/height/top/left`
- [ ] Form opt-in: tối đa 3 fields, mặc định email-only
- [ ] `inputmode` attribute trên input tel/email/number
- [ ] `@media (prefers-reduced-motion: reduce)` wrap tất cả `@keyframes` animation (blob, ticker, shimmer)

---

## Visual Content Guide

### 5 Slot Types — Universal across all business types

| Type | Vai trò | Travel | SaaS/Tool | Supplements | Coaching | E-commerce |
|------|---------|--------|-----------|-------------|----------|------------|
| **PRODUCT** | Sản phẩm/dịch vụ trông như thế nào | Ảnh địa điểm, tour highlight | Product screenshot, UI demo | Ảnh hộp, lifestyle shot | Ảnh tài liệu, buổi học | Ảnh sản phẩm, unboxing |
| **PERSON** | Ai đứng sau | Hướng dẫn viên, local guide | Founder, team | Chuyên gia dinh dưỡng, bác sĩ | Coach, instructor | Brand owner, artisan |
| **RESULT** | Bằng chứng kết quả | Ảnh chuyến đi của khách, review | Dashboard, metric graph, screenshot | Before/after, xét nghiệm | Kết quả học viên, certificate | Review ảnh khách dùng thật |
| **PROCESS** | Cách hoạt động | Hành trình tour từng chặng | UI walkthrough, demo video | Cơ chế tác dụng từng bước | Lộ trình học từng module | Cách đặt hàng, giao hàng |
| **CONTEXT** | Môi trường / không khí | Local culture, food, landscape | Team office, event, conference | Lab, certificate, facility | Classroom, community | Brand story, factory |

---

### Media Slot Patterns

| Pattern | Slots bên trong | Khi nào dùng |
|---------|----------------|--------------|
| `video-hero.html` | [PROCESS] 16:9 video | Có video demo / testimonial video |
| `product-showcase.html` | [PRODUCT] 4:3 main + [PRODUCT] 1:1 ×3 thumbnails | Muốn show sản phẩm chi tiết |
| `results-gallery.html` | [RESULT] 4:3 ×6 | Có nhiều bằng chứng kết quả |
| `testimonial-face.html` | [PERSON] circular ×4 + [RESULT] 4:3 featured | Testimonial với ảnh người thật |
| `instructor-photo.html` | [PERSON] 3:4 + [CONTEXT] logo ×3 | Giới thiệu tác giả / chuyên gia |
| `proof-notification.html` | [PERSON] circular ×N (auto-cycle) | Social proof toast bottom-left |
| `offer-item-visual.html` | [PRODUCT] 4:3 per item | Breakdown từng item trong offer |
| `process-visual.html` | [PROCESS] 1:1 per step + [RESULT] 1:1 final | Visualize phương pháp / cách làm |

---

### Media Availability Question (bắt buộc hỏi trước khi build)

Khi user ra lệnh `/funnel sales page [product]`, agent hỏi:

```
Trước khi build, em cần biết anh/chị có sẵn những media nào:

□ Video demo / testimonial video     → sẽ thêm video-hero
□ Ảnh sản phẩm / service             → sẽ thêm product-showcase
□ Screenshots / ảnh kết quả khách   → sẽ thêm results-gallery
□ Ảnh mặt khách hàng thật           → sẽ dùng testimonial-face (có ảnh)
□ Ảnh tác giả / chuyên gia          → sẽ thêm instructor-photo
□ Chưa có gì                        → dùng placeholder đẹp, thay sau

Chưa có media không sao — page vẫn đầy đủ với placeholder.
Khi có ảnh thật: thay thế placeholder bằng <img src="..." class="slot-img">.
```

---

### Placeholder Rules

- Placeholder phải trông **intentional**, không broken
- Mỗi slot có `data-role` attribute rõ ràng (PRODUCT / PERSON / RESULT / PROCESS / CONTEXT)
- Slot label mô tả chính xác content type và spec kỹ thuật (tỷ lệ, size)
- Khi replace: xóa toàn bộ `.slot-placeholder` div, thêm `<img src="..." class="slot-img" alt="...">`
- Circular person slot: thêm `border-radius:9999px` cho `<img>`

---

### Design Brief — Visual Spec (bổ sung vào Bước 2)

Mọi section trong design brief phải có dòng Visuals đầy đủ:

```markdown
## [Tên Section]
Layout:     ...
Background: ...
Elements:   ...
Visuals:
  - [SLOT_TYPE]: mô tả content · tỷ lệ · ghi chú kỹ thuật
  - [SLOT_TYPE]: ...
Pattern:    tên-pattern.html
```

Ví dụ cho travel business:
```markdown
## Testimonials
Visuals:
  - [PERSON]: Ảnh mặt khách thật · 1:1 circular · nền trung tính
  - [RESULT]: Ảnh chụp trong chuyến đi · 4:3 · authentic, không stock photo
  - [CONTEXT]: Logo công ty khách hoặc job title LinkedIn
Pattern: testimonial-face.html
```

Ví dụ cho SaaS:
```markdown
## How It Works
Visuals:
  - [PROCESS]: Screenshot UI bước 1 · 1:1 · annotated arrow highlight
  - [PROCESS]: Screenshot UI bước 2 · 1:1
  - [RESULT]: Dashboard sau khi dùng · 1:1 · show key metric
Pattern: process-visual.html
```

---

## HTML Quality Standards — Checklist Bắt Buộc

Áp dụng cho **mọi HTML được generate**, không ngoại lệ.

### 1. Không dùng emoji trong HTML — luôn dùng SVG

❌ Sai:
```html
<span>📸</span>
<div>✓ Tính năng A</div>
<p>🔥 Ưu đãi hôm nay</p>
```

✅ Đúng:
```html
<!-- Icon từ heroicons / custom inline SVG, stroke var(--accent) -->
<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M5 13l4 4L19 7" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Ngoại lệ duy nhất: `media-slot` placeholder (role label) — nhưng ngay cả đó nên dùng SVG.

---

### 2. Cards và Lists luôn có SVG icon

Mọi card (feature card, agent card, checklist item, step) đều phải có icon SVG đi kèm.

❌ Sai — card chỉ có text:
```html
<div class="card">
  <h3>Offer Agent</h3>
  <p>Nghiên cứu thị trường</p>
</div>
```

✅ Đúng — card có icon wrap + text:
```html
<div class="card card-lift group">
  <div style="width:40px;height:40px;border-radius:10px;background:var(--accent-dim);
              border:1px solid rgba(var(--accent-rgb),0.2);
              display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="..." stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  </div>
  <h3>Offer Agent</h3>
  <p>Nghiên cứu thị trường</p>
</div>
```

Checklist item:
```html
<div style="display:flex;align-items:flex-start;gap:10px;">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;margin-top:2px;">
    <path d="M5 13l4 4L19 7" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span>[Nội dung checklist]</span>
</div>
```

---

### 3. Mọi section phải có decoration

"Decoration" = yếu tố visual làm section không trông như plain text trên nền màu.

**Tối thiểu 1 trong các loại sau per section:**

| Decoration | Class / cách dùng | Khi nào |
|-----------|-------------------|---------|
| Background pattern | `.bg-grid` · `.bg-dots` · `.bg-dots-lg` | Hầu hết section |
| Radial glow | `.bg-glow-top` · `.bg-glow-dual` · `.hero-purple` | Hero, CTA |
| Animated blob | `.blob .blob-accent .blob-lg` (absolute inside relative) | Hero, attention sections |
| Section label line | `.section-label` (có `::before` line) | Mọi section có H2 |
| Top/bottom gradient fade | `linear-gradient` overlay absolute | Khi section cần transition mềm |
| Corner / divider SVG | Inline SVG decoration (theme-specific) | Theme có visual identity mạnh |

❌ Không chấp nhận: section chỉ có `background:var(--bg)` và text, không có bất kỳ decoration nào.

---

### 4. Industry Anti-Pattern Rules — Effects bị cấm theo ngành

Trước khi build, xác định industry của offer → check danh sách bên dưới. Effects trong cột "❌ KHÔNG DÙNG" sẽ phá vỡ trust ngay cả khi đẹp về mặt visual.

| Industry | ✅ Phù hợp | ❌ KHÔNG DÙNG |
|----------|-----------|--------------|
| **Tài chính / Đầu tư / Luật** | trust-navy theme · serif · dense data · formal tone | AI purple/pink gradients · neon glow · blobs · playful fonts |
| **Y tế / Phòng khám / Dược** | clean-clinic theme · teal/navy · whitespace nhiều | Neon · dark mode · harsh animations · red dominance (gợi danger) |
| **Beauty / Spa / Wellness** | soft-luxe theme · pastel · gold accent · gentle fade | Neon · dark mode · harsh animations · blobs nổi bật |
| **Luxury / BĐS cao cấp** | prestige-dark · gold · serif · minimal · no clutter | Bright neon · cartoon icons · busy backgrounds · cheap glow |
| **F&B / Restaurant** | bold-appetite · warm reds · food photography dominant | Cold blue · monochrome · dark techy feel |
| **Trẻ em / Giáo dục phổ thông** | bright colors · rounded fonts · playful icons | Dark mode · sharp edges · dense text · complex navigation |
| **AI / SaaS / Tech** | dark-bold-neon · grid lines · scan lines · code snippets | Warm earth tones · handwritten fonts · no tech signals |
| **Coaching / Education (người lớn)** | warm-authority · testimonial-heavy · portrait photos | Overly tech feel · cold blue · no human element |

**Decision rule khi không chắc industry:**
```
If luxury → liquid-glass cards + gold accent (override dark-bold-neon)
If children → increase playfulness, rounded corners ≥24px, font size +20%
If gamification → add progress-animation, achievement badges
If formal/legal → remove all blobs, remove animations except scroll-reveal
If wellness → no dark backgrounds, no neon, ambient mesh opacity ≤0.04
```

---

### 5. Accessibility — aria-hidden, role, form validation

**Decorative elements luôn có `aria-hidden="true"`:**
```html
<!-- ĐÚNG — screen reader bỏ qua decorative noise -->
<div class="blob blob-accent" aria-hidden="true"></div>
<div class="ambient-mesh" aria-hidden="true"></div>
<svg class="bg-deco" aria-hidden="true">...</svg>
<div class="ticker-scroll" aria-hidden="true">...</div>

<!-- SAI — blob, mesh, ticker không có thông tin gì cho screen reader -->
<div class="blob blob-accent"></div>
```

**Form success message dùng `role="status"` (ARIA live region):**
```html
<!-- Khi form submit → ẩn form → hiện success message này -->
<div id="success-msg" role="status" style="display:none">
  <p>Đã gửi thành công! Kiểm tra email để nhận tài liệu.</p>
</div>
```
```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  form.style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
});
```

**Native form validation — không cần thư viện:**
```html
<input type="email" required placeholder="Email của bạn" inputmode="email">
<input type="tel" pattern="(0|\+84)[0-9]{8,9}" placeholder="Số điện thoại">
```
```js
// checkValidity() trước khi submit — hiện browser validation tooltip tự nhiên
submitBtn.addEventListener('click', () => {
  if (!form.checkValidity()) { form.reportValidity(); return; }
  // proceed with submission
});
```

---

### 5. Timeline và Process → SVG graphic, không phải image slot

Khi section có dạng **sequence / process / timeline / workflow**:

- **Dùng SVG/HTML/CSS** để vẽ diagram thật — nodes, arrows, connecting lines
- **KHÔNG dùng** `media-slot` placeholder cho phần diagram
- **CÓ THỂ** có `media-slot` nhỏ bên cạnh mỗi step để show screenshot/ảnh minh họa

**Quy tắc phân biệt:**

| Loại content | Cách handle |
|-------------|-------------|
| Workflow 6 agents → pipeline flow | SVG/HTML diagram với animated arrows |
| Timeline 3 bước → vertical steps | SVG vertical line + step nodes + `.flow-line-v` |
| Process diagram → circular/linear | SVG paths + arrow markers |
| Screenshot của từng bước | `media-slot data-role="PROCESS"` nhỏ (4:3 hoặc 1:1) bên phải |

---

### 5. Motion — tối thiểu bắt buộc

Mọi page phải có ít nhất:

| Element | Motion tối thiểu |
|---------|-----------------|
| Hero | Blob drift (`.blob.blob-drift`) hoặc floating SVG (`.float-gentle`) |
| CTA button | `.btn-glow` hover effect |
| Cards | `.card-lift` hover lift |
| Timeline/workflow line | `.flow-line-v` hoặc `.flow-line-h` |
| Section reveal | `.reveal` + IntersectionObserver script |
| Live indicators | `.animate-live` cho dot pulse |

Motion style cụ thể (keyframe, speed, color) → xem `DESIGN.md` của từng theme.

---

## Bước 4 — Self-Review Checklist (MANDATORY trước khi output HTML)

**Chạy checklist này trước khi trả file cho user. Nếu bất kỳ mục nào ❌ → fix trước, không output.**

### A. Foundation
- [ ] `base.css` đã được **inline đầy đủ** vào `<style>` block (không dùng `<link>`)
- [ ] `:root` có đủ CSS vars: `--accent-rgb`, `--cyan-rgb`, `--bg`, `--surface`, `--rim`, `--rim-strong`
- [ ] Tailwind config script có `fontFamily` override đúng theme
- [ ] Google Fonts loaded đúng (font-display + font-body của theme)

### B. Visual Quality
- [ ] **Không có emoji** trong HTML — tất cả icon là inline SVG
- [ ] Mọi **card và list item** đều có SVG icon wrap (40×40 rounded square hoặc inline icon)
- [ ] Mọi **section** đều có ít nhất 1 decoration (`.bg-stack-*`, blob, glow, `.section-label`)
- [ ] **Section separator = hairline**, không phải background switch: `border-top: 1px solid var(--rim)` + `padding: 80px 0` — chỉ Hero và Final CTA được đổi background
- [ ] **Bento grid** dùng hairline-as-gap trick (`gap:1px` + `background:var(--rim)` trên wrapper) — không dùng `border` trên từng cell
- [ ] **Eyebrow label** trên mọi H2 section: `[NUM] · [TÊN]` + 24px accent bar bên trái
- [ ] **Section Rhythm** đúng với DESIGN.md — không để 2 section liền nhau cùng loại bg

### C. Background Patterns
- [ ] Hero dùng `.bg-stack-hero` hoặc `.bg-stack-hero-grid` (không dùng plain `.bg-grid`)
- [ ] Gradient và grid được stack đúng thứ tự trong `background-image` (gradient trước, grid sau)
- [ ] Blob trong hero dùng `radial-gradient` + `filter:blur` inline style — không phụ thuộc class conflict
- [ ] Hero section có `position:relative; overflow:hidden`

### D. Media Slots
- [ ] Không có SVG art trong `media-slot` content slots (PRODUCT, CONTEXT, AVATAR, VIDEO)
- [ ] Placeholder dùng dashed border + label text — không dùng emoji
- [ ] Timeline / process / workflow → SVG/HTML diagram, không phải `media-slot`

### E. Motion
- [ ] Hero có animated element (blob drift hoặc `.float-gentle` trên SVG)
- [ ] Tất cả primary CTA buttons có `.btn-glow`
- [ ] Tất cả cards có `.card-lift` hoặc `.card-lift-accent`
- [ ] Timeline/workflow line có `.flow-line-v` hoặc `.flow-line-h`
- [ ] Tất cả sections có `.reveal` class + IntersectionObserver script ở cuối `<body>`

### F. Mobile & Responsive
- [ ] Hero layout: `grid-cols-1` trên mobile, 2-col trên desktop (min `lg:`)
- [ ] Agent/feature grid: `minmax(280px, 1fr)` hoặc responsive breakpoints
- [ ] Pricing card: max-width centered, full-width trên mobile
- [ ] Font sizes dùng `clamp()` cho H1/H2 — không fixed px
- [ ] CTA buttons: `width:100%` trên mobile

### G. Content
- [ ] BUSINESS.md đã được đọc — không dùng generic placeholder nếu có dữ liệu thật
- [ ] `[CHECKOUT_URL]` placeholder ở tất cả payment/CTA links
- [ ] Giá hiển thị đúng format VND (997.000đ, không phải 997K hay $997)
- [ ] Tất cả `[...]` placeholder đã được điền nếu BUSINESS.md có data

### H. Technical
- [ ] Không có broken `<img src="">` — chỉ dùng `media-slot` placeholder hoặc ảnh thật
- [ ] Không có hardcoded hex trong HTML (chỉ dùng `var(--token)`)
- [ ] `<details>` FAQ có CSS rotate icon khi open
- [ ] Smooth scroll: `html { scroll-behavior: smooth; }`
- [ ] Page title đã điền đúng sản phẩm/brand

### I. Accessibility
- [ ] Mọi decorative element (blob, mesh, ticker, bg SVG) có `aria-hidden="true"`
- [ ] Form success/error message có `role="status"` (ARIA live region)
- [ ] `@media (prefers-reduced-motion: reduce)` có mặt cho tất cả `@keyframes` animations
- [ ] `body` có `-webkit-font-smoothing: antialiased` và `text-rendering: optimizeLegibility`
- [ ] Form submit dùng `form.checkValidity()` + `form.reportValidity()` trước khi gửi

### J. AI Tells Audit (load `references/ai-tells-audit.md`)
- [ ] **Em-dash zero** — không có `—` hoặc `–` ở bất kỳ vị trí user thấy được (headlines, eyebrows, body, quote, attribution, button text, alt text). Zero, không "dùng ít thôi"
- [ ] **Hero stack ≤ 4 elements** — eyebrow OR brand-strip (chọn 1), headline, subtext (≤ 20 từ), CTAs. Không tagline/trust-strip/pricing-teaser nhồi vào hero
- [ ] **Section eyebrow alternation** — tối đa nửa số sections có eyebrow, không phải mọi section
- [ ] **Layout repetition ban** — 1 layout family chỉ xuất hiện 1 lần per page; 8 sections dùng ≥ 4 families khác nhau
- [ ] **Bento N items → N cells** — không cell rỗng giữa hoặc cuối grid
- [ ] **Bento background diversity** — ≥ 2-3 cells có visual variation (image/gradient/pattern/screenshot), không phải 6 ô white-on-white text
- [ ] **CTA wrap ≤ 1 dòng desktop** — label "ĐĂNG KÝ NGAY KHÓA HỌC THIẾT KẾ" wrap = broken, cắt còn 3 từ
- [ ] **Page theme lock** — không section invert mid-page (dark sandwich light, hay ngược lại) trừ khi deliberate Color Block Story
- [ ] **Color/Shape consistency lock** — 1 accent color + 1 corner-radius scale dùng nguyên page
- [ ] **Filler verbs VN** — không "đột phá / tối ưu / nâng tầm / khai phá / chinh phục" làm primary copy
- [ ] **Generic step labels** — không "Bước 1/2/3" đứng standalone; dùng verb-noun trực tiếp
- [ ] **Generic names** — không "Anh A · Học viên", "Acme Corp"; dùng tên đầy đủ + role cụ thể
- [ ] **Section numbering eyebrows** — không "01 / INDEX", "06 · How it works"
- [ ] **Decorative status dots** — không chấm xanh giả "live" trước nav/badge/list row
- [ ] **Locale/weather/time strips** — không "TPHCM 14:23 · 28°C" trừ khi brand thực sự là travel/multi-location
- [ ] **Scroll cues** — không "↓ Cuộn xuống / Scroll to explore"
- [ ] **Fake live counters** — không "Còn 4/10 suất" / "12 người đang xem" mà không có real data source
- [ ] **Hero strip decoration** — không "BRAND. MOTION. SPATIAL." mono-caps strip ngang ở bottom hero
- [ ] **Pills/captions overlay on images** — không `<span>` "Plate 03 · House archive" trên ảnh
- [ ] **Version labels in hero** — không "V0.6 / BETA / EARLY ACCESS" trừ khi brief là explicit launch
- [ ] **AI-purple random** — không neon glow / purple gradient nếu brand không có purple
- [ ] **Inter as default** — dùng font từ theme system (Inter Tight, Bricolage, Satoshi, Cabinet Grotesque...) không default Inter trừ clinical/B2B formal
- [ ] **Real testimonial proof** — mỗi testimonial trên sales page cold traffic có ảnh + tên đầy đủ + role + result cụ thể
- [ ] **Real urgency backing** — countdown / "còn X suất" phải có real constraint (cohort limit, bonus expire, time-bound)
- [ ] **Multi-color heading words** — max 1 từ accent color trong cùng headline, không 3 màu khác nhau

---

**Nếu pass tất cả → output HTML.**
**Nếu có mục ❌ → fix ngay, không báo user về checklist, chỉ output bản đã fix.**
