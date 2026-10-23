# Bright Learn — Visual Language

## Triết lý

Visuals phải **giải thích, không chỉ trang trí**. Mỗi visual element phải truyền tải một ý cụ thể:
kết quả học viên, tiến trình học, nội dung khóa học, sự đồng hành của cộng đồng.
Không dùng abstract shapes thuần túy.

---

## Icon Style

| Thuộc tính | Spec |
|-----------|------|
| Style | Rounded fill + stroke kết hợp — friendly, không quá flat |
| Stroke width | 1.5–2px |
| Corner radius | 4–6px trên các shape |
| Size chuẩn | 20×20px (inline), 32×32px (feature card), 48×48px (section hero) |
| Color | `var(--accent)` purple chính, `var(--teal)` cho completion/success, `var(--orange)` cho bonus/urgency |
| Background | Circle hoặc rounded-square với `rgba(var(--accent-rgb), 0.10)` |

### Icon catalog — dùng inline SVG, không dùng icon font

| Context | Icon | SVG key shape |
|---------|------|--------------|
| Video lessons | Play button in rounded rect | `<rect rx="4"/>` + triangle |
| Live Q&A | Mic + chat bubble | Circle + rectangle + arc |
| Certificate | Ribbon/medal | Circle + ribbon paths |
| Community | 3 overlapping circles (people) | `<circle>` × 3 |
| Templates | Layered documents | Stacked `<rect>` |
| AI / bonus | Sparkle / circuit node | Star path + dot |
| Completion | Checkmark in circle | `<circle>` + check path |
| Progress | Arc/donut segment | `<path>` arc SVG |
| Guarantee | Shield + check | Shield path + check |

---

## Illustration Style

**Flat + light depth** — không shadow mạnh, không 3D, không photorealistic.

### Hero illustration

Hiển thị **"course dashboard" concept**:
- Laptop/screen outline (stroke only, không fill đặc)
- Bên trong màn hình: progress bars, module list với checkmarks
- Floating cards xung quanh: achievement badge, result metric card
- Màu sắc: accent purple, teal, orange — không dùng màu ngoài CSS vars

```svg
<!-- Template cấu trúc hero illustration -->
<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Laptop frame -->
  <rect x="60" y="30" width="280" height="180" rx="12" stroke="var(--faint)" stroke-width="2"/>
  <!-- Screen content: progress bars -->
  <!-- Floating badge cards -->
  <!-- Achievement icons -->
</svg>
```

### Feature illustration

Mỗi feature section dùng một **icon lớn + background shape**:
- Rounded square background (`rgba(accent, 0.08)`)
- Icon fill accent color
- Optional: small decorative dots/lines xung quanh

---

## Photo Treatment

| Context | Treatment |
|---------|-----------|
| Instructor photo | Rounded-card (`border-radius:16px`), no filter, border `1px solid var(--rim)` |
| Student testimonial avatar | Circle, `background:rgba(accent,0.10)`, initials nếu không có ảnh |
| Screenshot/dashboard | Rounded card, slight shadow `0 8px 32px rgba(108,71,255,0.08)`, border `1px solid var(--faint)` |
| Before/After results | Side-by-side với divider, before=subtle, after=accent highlight |

**Không dùng:**
- Dark overlay trên ảnh
- Grayscale filter
- Harsh drop shadows

---

## Chart & Data Visualization

| Type | Style | Colors |
|------|-------|--------|
| Progress arc | SVG `<path>` arc, stroke only | Accent purple (#6c47ff) |
| Completion bar | `<rect>` gradient | Accent → teal |
| Score/rating | Star SVG | Yellow #facc15 |
| Before/After metric | Two `<text>` elements, before=subtle, after=accent bold | — |
| Module completion % | Circle arc donut | Teal trên faint bg |

---

## Animation rules

- Floating cards: `animate-float` / `animate-float-2` — gentle 5–6s loop
- Progress bars: CSS `width` transition on page load (0 → target%)
- Icons: `hover:scale-110 transition-transform` — subtle, không dramatic
- **Không:** spinning loaders, complex keyframe animations, parallax

---

## Pattern files có visual

| Pattern file | Visual element |
|-------------|---------------|
| `hero.html` | Course dashboard SVG illustration (right col) + 2 floating result cards |
| `feature-icons.html` | 6 colorful SVG icon cards |
| `result-visual.html` | Completion donut + before/after metric comparison |
| `stats-bar.html` | Số liệu với icon đi kèm (no chart) |
| `curriculum-progress.html` | Progress bars (đã có) |
| `testimonials.html` | Avatar initials + star rating SVG |
| `guarantee-card.html` | Shield SVG illustration |
