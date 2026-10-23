---
name: theme-advisor
description: "Phân tích industry + brand colors → recommend theme phù hợp từ danh sách có sẵn, hoặc trigger theme-generator nếu không có theme nào match."
version: 1.0.0
agent: funnel
tags: [theme, advisor, recommendation, brand]
---

# Theme Advisor Skill

## Mục đích

Khi user cần landing page, không yêu cầu chọn theme thủ công — skill này tự phân tích
BUSINESS.md + THEME.md và đưa ra theme phù hợp nhất. Nếu không theme nào khớp đủ tốt,
chuyển sang `theme-generator` để tạo theme mới từ đầu.

---

## Load Order

```
1. BUSINESS.md   → industry, audience, product type
2. THEME.md      → brand colors (--color-primary, --color-secondary, style mood)
```

---

## Step 1 — Phân tích Input

Trích xuất từ BUSINESS.md:
- **Industry keywords** — ngành nghề cụ thể
- **Audience** — B2B / B2C / age group
- **Product type** — digital / physical / service / coaching

Trích xuất từ THEME.md:
- **Brand primary color** → hex → convert sang HSL để phân tích
- **Style mood** (A/B/C/D nếu đã set)

---

## Step 2 — Theme Matching Matrix

### Existing themes — 16 themes

| Theme slug | Industry keywords | Audience | Bg type |
|-----------|------------------|----------|---------|
| `dark-bold-neon` | AI, SaaS, tech, marketing automation, agency, growth hacking, developer tool | B2B, tech-savvy | Dark |
| `bright-learn` | online course, e-learning, khóa học, kỹ năng, giáo dục, certification, coaching skill | B2C học viên | Light |
| `trust-navy` | tài chính, đầu tư, chứng khoán, bảo hiểm, banking, luật, tư vấn chiến lược doanh nghiệp | B2B, B2C HNW | Dark |
| `warm-earth` | nông sản, thực phẩm sạch, handmade, craft, SME local, organic, artisan, chợ | B2C local | Light warm |
| `prestige-dark` | bất động sản cao cấp, luxury, xe hơi, đồng hồ, fashion luxury, premium B2B | B2C high-end | Dark |
| `clean-clinic` | y tế, phòng khám, nha khoa, dược phẩm, sức khỏe, wellness, supplement | B2C health | Light clinical |
| `bold-appetite` | nhà hàng, cafe, F&B, food brand, ẩm thực, catering, food delivery | B2C | Dark warm |
| `minimal-mono` | thời trang, fashion brand, creative agency, portfolio, nghệ thuật | B2C creative | Light minimal |
| `energy-sport` | gym, fitness, thể thao, supplement, personal training, sports coaching | B2C active | Dark |
| `soft-luxe` | skincare, làm đẹp, beauty brand, spa, mỹ phẩm, women's fashion | B2C feminine | Light soft |
| `warm-authority` | business coach, consultant, marketing advisor, career coach, management trainer | B2B coaching | Light warm |
| `bold-persona` | speaker, entrepreneur, startup founder, social media influencer, thought leader | B2C/B2B mix | Light modern |
| `story-first` | life coach, podcaster, author, content creator, YouTuber, mindset coach, wellness | B2C community | Light warm |

---

## Step 3 — Matching Algorithm

### Score mỗi theme (0–10):

```
Score = industry_match (0-5) + audience_match (0-2) + mood_match (0-2) + color_compat (0-1)
```

**Industry match (0–5):**
- 5: Industry keyword trực tiếp match
- 3: Adjacent industry (e.g., "workshop offline" → bright-learn score 3, warm-earth score 3)
- 1: Weak match

**Audience match (0–2):**
- 2: B2B → trust-navy / dark-bold-neon / warm-authority exact match
- 2: B2C feminine → soft-luxe / story-first
- 1: General match

**Mood match (0–2):**
- 2: Brand style A (professional) + dark theme
- 2: Brand style D (warm/organic) + warm theme
- 1: Partial match

**Color compatibility (0–1):**
- 1: Brand color luminance compatible với theme bg type
  - Light brand color on dark theme = OK
  - Very dark brand color on light theme = warning (still 1, but flag)

### Decision:

```
Top score ≥ 7  → Recommend theme đó (confident)
Top score 5–6  → Recommend 2 themes, ask user to pick
Top score < 5  → No good match → trigger theme-generator
```

---

## Step 4 — Brand Color Override Rule

Khi recommend một theme, **luôn inject brand color**:

```
THEME.md: --color-primary: [HEX]
              ↓
theme's :root block:
  --accent:     [HEX from THEME.md]
  --accent-rgb: [R, G, B derived from HEX]
```

Tất cả CSS vars khác của theme giữ nguyên (bg, surface, ink, typography, radius).

**Contrast check:**
- Convert brand color và theme bg sang relative luminance
- Nếu contrast ratio < 3.0 → cảnh báo trong HTML comment:
  ```html
  <!-- ⚠️ Brand color contrast ratio: 2.1:1 — consider lightening/darkening --accent -->
  ```

---

## Step 5 — Output Format

### Nếu match theme có sẵn:

```
✅ Theme đề xuất: [theme-slug]

Lý do:
• [Industry match explanation]
• [Mood/style fit]
• [1 theme khác gần nhất nếu có]

Màu thương hiệu [#HEX] sẽ thay thế --accent trong theme.
[Nếu có contrast issue] ⚠️ Cần điều chỉnh độ sáng: gợi ý [#lighter/darker HEX]

→ Tiếp theo: generate landing page với theme này?
```

### Nếu không match:

```
🔧 Không có theme sẵn phù hợp hoàn toàn với [industry].
Theme gần nhất: [slug] (score X/10)

→ Tạo theme mới từ thương hiệu của anh/chị?
   Sẽ mất ~30 giây. Theme được lưu lại để tái dùng.
```
→ Load `skills/funnel/page-designer/theme-generator/SKILL.md`

---

## Edge Cases

| Situation | Xử lý |
|-----------|-------|
| THEME.md chưa có màu | Hỏi 1 câu: "Màu thương hiệu chính của anh/chị là gì?" |
| BUSINESS.md chưa có industry | Hỏi 1 câu: "Ngành kinh doanh / sản phẩm là gì?" |
| User muốn chọn tay | Hiển thị full theme list với mô tả 1 dòng |
| User muốn theme khác sau khi recommend | Accept, dùng theme đó + brand color override |
