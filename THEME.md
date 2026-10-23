# THEME.md — Brand Identity của bạn

> Brand Agent đọc file này khi tạo landing page, email design, image card.
> **Đừng tự điền** — Coach sẽ hỏi bạn qua `/start`, hoặc dùng `/brand` để generate.

---

## 1. Brand Identity

- **Brand name**: [Chưa điền]
- **Brand voice (3 từ)**: [VD: ấm áp, tin cậy, chuyên nghiệp]
- **Brand personality (1 câu)**: [VD: "Như một người bạn am hiểu, kể chuyện gần gũi nhưng không bao giờ nói dối"]

## 2. Bảng màu

### Primary (màu chính)
- **HEX**: [#000000]
- **Dùng cho**: button chính, link, accent

### Secondary (màu phụ)
- **HEX**: [#000000]
- **Dùng cho**: badge, tag, secondary button

### Accent (màu nhấn — CTA, alert)
- **HEX**: [#000000]
- **Dùng cho**: CTA chính ("MUA NGAY"), urgency, sale

### Neutral
- **Background**: [#FFFFFF]
- **Text**: [#1A1A1A]
- **Border / muted**: [#E5E5E5]

## 3. Typography

### Headings (h1-h3)
- **Font family**: [VD: "Inter", "Be Vietnam Pro", "Manrope"]
- **Weight**: [600-700]
- **Style**: [normal / italic / condensed]

### Body
- **Font family**: [VD: "Inter", "Be Vietnam Pro"]
- **Weight**: [400-500]
- **Size cơ bản**: 16px

### Accent / Display (cho hero, quote)
- **Font family**: [VD: "Playfair Display", "Plus Jakarta Sans"]
- **Weight**: [400-700]

## 4. Logo

- **SVG path**: [output/brand/logo.svg — Brand Agent sẽ tạo]
- **Light version (cho dark bg)**: [output/brand/logo-light.svg]
- **Favicon**: [output/brand/favicon.svg]

## 5. Visual Style

- **Aesthetic**: [editorial / minimalist / brutalist / glassmorphism / claymorphism / soft / playful / elegant]
- **Shadow style**: [no shadow / soft / hard / colored]
- **Border radius**: [0 (sharp) / 4 / 8 / 16 / 24 / pill]
- **Animation**: [none / subtle / playful]

## 6. Photography / Illustration

- **Style**: [stock photo realistic / illustration vector / 3D render / mixed]
- **Mood**: [warm / cool / vibrant / muted]
- **Subject matter**: [VD: "phụ nữ Việt 25-40 tại nhà, không bị stock-y"]

## 7. Card / Component Patterns

### Button primary
```
bg: {primary}
text: {neutral-bg}
padding: 16px 32px
border-radius: 8px
shadow: 0 4px 12px rgba(primary, 0.2)
hover: scale 1.02 + shadow lớn hơn
```

### Card
```
bg: {neutral-bg}
border: 1px solid {neutral-border}
border-radius: 16px
padding: 24px
shadow: 0 2px 8px rgba(0,0,0,0.04)
```

## 8. Tone trong design

- **Whitespace**: [generous / compact]
- **Hierarchy**: [strong contrast / subtle]
- **Density**: [airy / dense]

---

> ⚠️ Nếu file này còn `[Chưa điền...]` — chạy `/start` (Coach hỏi qua onboarding) hoặc `/brand` (Brand Agent generate full brand book).
