---
name: theme-generator
description: "Generate custom theme từ đầu khi không có theme sẵn phù hợp. Derive palette + typography + radius từ brand color + industry. Save thành theme folder tái dùng được."
version: 1.0.0
agent: funnel
tags: [theme, generator, custom, brand]
---

# Theme Generator Skill

## Mục đích

Được gọi bởi `theme-advisor` khi không có theme sẵn phù hợp, hoặc user muốn theme
hoàn toàn theo thương hiệu của họ. Tạo ra một theme đầy đủ (DESIGN.md + tailwind.config.js +
visuals.md) lưu vào `themes/[brand-slug]/`, sau đó page-designer dùng theme mới này.

---

## Input

```
brand_color:   #HEX (từ THEME.md --color-primary)
brand_secondary: #HEX (từ THEME.md --color-secondary, nếu có)
industry:      text (từ BUSINESS.md)
brand_name:    text (từ BUSINESS.md)
style_mood:    A/B/C/D (từ THEME.md, nếu có)
audience:      text (từ BUSINESS.md)
```

---

## Step 1 — Color Palette Derivation

### 1a. Phân tích brand color

Convert `#HEX` → HSL:
- **Hue (H):** góc màu (0–360)
- **Saturation (S%):** độ bão hòa
- **Lightness (L%):** độ sáng

### 1b. Xác định Bg type

```
Quy tắc:

Industry formality score:
  Luxury / Finance / Legal / Medical  → FORMAL (score 8–10)
  Tech / SaaS / Education / Coaching  → SEMI-FORMAL (score 5–7)
  Food / Lifestyle / Creative / Sport → CASUAL (score 2–4)

Brand color lightness:
  L < 30%  → màu tối
  L 30–70% → màu trung
  L > 70%  → màu sáng

Bg type decision:
  FORMAL + màu tối   → DARK bg (near-black with warm/cool tint)
  FORMAL + màu sáng  → LIGHT bg (clean white/cream)
  SEMI-FORMAL        → LIGHT bg preferred (trừ khi user chọn style A/B dark)
  CASUAL             → LIGHT bg warm (cream/beige) hoặc DARK warm (F&B)
  Style mood A + dark brand → DARK bg
```

### 1c. Derive toàn bộ palette

**DARK bg theme:**
```
--bg:      Darken brand hue: H [S-60%] [L 8-12%]   # near-black với hue tint
--surface: H [S-55%] [L 12-16%]
--raised:  H [S-50%] [L 18-22%]
--ink:     H [S-10%] [L 92-96%]                     # near-white
--body:    H [S-15%] [L 75-80%]
--subtle:  H [S-20%] [L 45-55%]
--faint:   H [S-30%] [L 22-28%]
--accent:  brand_color (giữ nguyên)
--accent-rgb: R, G, B
```

**LIGHT bg theme:**
```
--bg:      H [S 20-30%] [L 97-99%]                  # near-white với warm/cool tint
--surface: H [S 25-35%] [L 93-96%]
--raised:  H [S 30-40%] [L 88-92%]
--ink:     H [S 50-60%] [L 10-15%]                  # dark version của hue
--body:    H [S 35-45%] [L 30-40%]
--subtle:  H [S 20-30%] [L 55-65%]
--faint:   H [S 25-35%] [L 80-88%]
--accent:  brand_color (giữ nguyên)
--accent-rgb: R, G, B
```

**Secondary color derive:**
```
Nếu có brand_secondary → dùng làm --secondary
Không có → complementary: H+30° hoặc H+180° (tùy industry mood)
```

---

## Step 2 — Typography Selection

### Decision matrix:

```
Industry → Font personality → Google Font pair

LUXURY / HIGH-END:
  → Premium serif display + lightweight sans
  → Display: Fraunces | Body: Jost
  → Radius: 2–6px (sharp = exclusive)

FINANCE / LEGAL / INSTITUTIONAL:
  → Authoritative serif display + technical mono hints
  → Display: IBM Plex Serif | Body: IBM Plex Sans | Mono: IBM Plex Mono
  → Radius: 4–8px

HEALTHCARE / CLINICAL:
  → Neutral sans only (trust through clarity)
  → Display: Epilogue | Body: Source Sans 3
  → Radius: 8–12px

EDUCATION / COURSE / COACHING:
  → Friendly grotesque + readable body
  → Display: Cabinet Grotesk | Body: Libre Franklin
  → Radius: 10–16px (approachable)

FOOD / RESTAURANT / ARTISAN:
  → Editorial serif + clean sans
  → Display: Fraunces | Body: Libre Franklin
  → Radius: 6–12px

SPORT / FITNESS / ENERGY:
  → Condensed bold sans
  → Display: Barlow Condensed | Body: Barlow
  → Radius: 4–8px

BEAUTY / SKINCARE / FEMININE:
  → Premium editorial serif
  → Display: DM Serif Display | Body: Lato
  → Radius: 12–20px (soft)

TECH / SAAS / DIGITAL:
  → Bold editorial grotesque
  → Display: Bricolage Grotesque | Body: Source Sans 3
  → Radius: 6–10px

PERSONAL BRAND / COACHING (warm):
  → Warm serif + approachable sans
  → Display: Lora | Body: Source Sans 3
  → Radius: 10–16px

CREATIVE / FASHION / EDITORIAL:
  → Sharp condensed or distinctive grotesque
  → Display: Cabinet Grotesk | Body: Source Sans 3
  → Radius: 0–6px (editorial)

ORGANIC / LOCAL / ARTISAN:
  → Rounded friendly + script accent
  → Display: Nunito | Body: Source Sans 3 | Script: Caveat (sparingly)
  → Radius: 8–14px

DEFAULT (if no match):
  → Display: Epilogue | Body: Source Sans 3
  → Radius: 8–12px
```

---

## Step 3 — Visual Language Rules

Derive từ industry + bg type:

```
DARK bg themes:
  texture:    Grain overlay (opacity 0.03–0.05) hoặc grid lines
  decoration: Blobs (subtle), geometric overlays
  shadows:    Colored glow matching accent (opacity 0.2–0.3)
  cards:      Raised dark surfaces, accent borders

LIGHT bg themes:
  texture:    Paper grain (organic) hoặc dot grid (tech) hoặc linen (artisan)
  decoration: Soft radial glows, botanical SVGs (organic), geometric accents (tech)
  shadows:    Warm/cool soft shadows (opacity 0.06–0.12), no glow
  cards:      White on surface, accent top border or border

LUXURY:
  No texture, no blobs — just whitespace and precision lines
  Gold/champagne as accent only (< 15% elements)

HEALTHCARE:
  No texture, no decoration — clinical whitespace
  Trust signals (certifications) prominent
```

---

## Step 4 — Generate Files

### 4a. Theme slug

```
brand_name → lowercase, remove spaces/special chars, max 20 chars
Append industry keyword nếu generic: "nguyen-coaching" → "nguyen-coaching"
Output: themes/[brand-slug]/
```

### 4b. Generate `tailwind.config.js`

```js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"[Display Font]"', ...fallbacks],
        body:    ['"[Body Font]"',    ...fallbacks],
        mono:    ['"[Mono Font]"',    'monospace'],
        // script nếu artisan/organic:
        // script: ['"Caveat"', 'cursive'],
      },
      borderRadius: {
        btn:  '[N]px',
        card: '[N]px',
        xl2:  '[N]px',
        xl3:  '[N]px',
      },
      // Animations phù hợp với industry mood
      animation: {
        'fade-up': '...',
        'live':    '...',
        // float nếu organic/luxury
        // pulse nếu sport/energy
      },
    }
  }
}
```

### 4c. Generate `DESIGN.md`

Template (fill theo derived values):

```markdown
---
version: "1.0.0"
name: "[Brand Name] Theme"
mood: "[Derived mood — 3 words]"
best_for: "[Industry description]"
generated_from: "theme-generator · [date]"
brand_color: "[#HEX]"
---

# [Brand Name] — Design Reference

## Colors
[Derived CSS vars block với explanation từng màu]

## Typography
[Derived font pair với usage rules]

## Background Catalog
[Derived textures và overlays phù hợp với industry]

## Visual Vocabulary
[Derived icon style, shadow rules, decoration rules]

## Section Rhythm
[Standard alternating bg pattern cho industry]

## Guardrails
[Specific rules derived từ industry + mood]
```

### 4d. Generate `visuals.md`

Brief visual language guide derived từ industry — icon style, photo treatment, SVG motifs.

### 4e. Update SKILL.md reference

Thêm vào page-designer SKILL.md phần theme list:
```
| `[brand-slug]` | Custom — [Brand Name] | [industry] |
```

---

## Step 5 — Output

```
✅ Theme "[brand-slug]" đã được tạo

📁 Saved: themes/[brand-slug]/
   ├── DESIGN.md
   ├── tailwind.config.js
   └── visuals.md

🎨 Palette:
   Background:  [#HEX] ([dark/light])
   Accent:      [#HEX] (màu thương hiệu)
   Text:        [#HEX]
   Surface:     [#HEX]

🔤 Typography: [Display Font] + [Body Font]
📐 Radius: [N]px buttons · [N]px cards

→ Tạo landing page với theme này ngay?
```

---

## Reuse Detection

Trước khi generate, check `themes/` folder:
```
Nếu themes/[brand-slug]/ đã tồn tại:
  → "Theme '[brand-slug]' đã có. Dùng lại hay tạo mới?"
  → Nếu tạo mới: overwrite hoặc save as [brand-slug]-v2
```

---

## Ví dụ thực tế

**Input:**
```
brand_color: #2c3e50 (dark navy)
industry: nội thất cao cấp, interior design
brand_name: ArtHome
audience: khách hàng muốn nội thất premium
style_mood: A (chuyên nghiệp)
```

**Derived:**
```
Industry: Luxury/High-end → FORMAL (score 9)
Brand color: L=23% → màu tối
Bg type: DARK (formal + dark color)

Palette:
  --bg:      #0d1117 (navy near-black)
  --surface: #131a22
  --ink:     #e8edf4
  --accent:  #2c3e50 (brand)

Typography: Cormorant Garamond + Jost (luxury)
Radius: 4px buttons · 6px cards

Slug: arthome
Output: themes/arthome/
```
