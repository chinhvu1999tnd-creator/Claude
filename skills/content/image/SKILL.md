# Image Production Skill

This comprehensive guide helps create marketing visuals using AI generation, design tools, and optimization practices.

---

## Skill Map — 3 Image Skills Trong Kit

| Skill | Dùng khi | Output |
|-------|---------|--------|
| **`content/image/`** (file này) | Cần strategy: model nào, prompt ra sao, dimensions, Canva workflow | Prompt + hướng dẫn |
| **`content/post-image-card/`** | Cần HTML→PNG card cho social posts / carousel | `card.html` + `card.png` |
| **`funnel/image-generator/`** | Gọi GPT Image 2 API để gen ảnh cho landing page | Image file |

---

## Key Approaches

**AI Generation** works best for original images from text prompts — blog heroes, social graphics, and lifestyle scenes. Models excel in different areas:
- **Ideogram** — text-in-images (best in class)
- **Flux** — photorealism + multi-image reference
- **Gemini** — versatile editing, same API as text
- **GPT Image (gpt-image-1)** — quick one-offs, conversational

**Design Tools** suit templated, brand-consistent work:
- Canva Magic Resize — one design → all platform sizes
- Figma — pixel-perfect design system needs

---

## Critical Practices

- **Đừng dùng AI cho product UI mockups** — models hallucinate interfaces. Chụp screenshot thật.
- Luôn specify dimensions trước khi generate
- Optimize aggressively: WebP + JPEG fallback, 75-85% quality, lazy loading below-fold
- Add dimension attributes vào `<img>` để prevent CLS

---

## Platform Dimensions

| Use Case | Ratio | Pixels | Notes |
|----------|-------|--------|-------|
| Blog hero / OG image | 1.91:1 | 1200×630 | Universal web standard |
| Full-width hero | 16:9 | 1920×1080 | Website headers |
| Instagram Feed | 1:1 | 1080×1080 | Square |
| Instagram Feed (tall) | 4:5 | 1080×1350 | More screen real estate |
| Stories / Reels | 9:16 | 1080×1920 | Vertical full screen |
| LinkedIn cover | 4:1 | 1584×396 | Personal profile |
| Twitter/X header | 3:1 | 1500×500 | Profile banner |
| Product Hunt gallery | 5:3 | 1270×760 | Launch page |
| GitHub social preview | 2:1 | 1280×640 | Repo link card |

---

## Model Comparison

| Model | Dùng cho | Điểm mạnh | API? |
|-------|---------|-----------|------|
| **Gemini Image** | Marketing general | Editing, versatile, rẻ | ✅ |
| **Flux** | Brand consistency | Multi-reference, photorealism | ✅ |
| **Ideogram** | Cần text trong ảnh | Best text rendering | ✅ |
| **GPT Image** | Quick one-offs | Conversational, kit đang dùng | ✅ |
| **Midjourney** | Hero images đẹp nhất | Chất lượng cao nhất | ❌ Discord only |

---

## Prompt Formula

```
[Subject] + [Setting] + [Style] + [Lighting] + [Composition] + [Technical specs]
```

**Ví dụ — Blog hero SaaS:**
```
A clean workspace with laptop showing analytics dashboard,
minimalist desk with coffee cup, bright natural window lighting from right,
shallow depth of field, commercial photography style, 1200x630, high resolution
```

Xem prompt templates chi tiết: `references/ai-image-prompting.md`

---

## Batch Generation Workflow

Khi cần nhiều ảnh cùng style (blog series, social campaign):

1. Generate 3-4 test images với style prompts khác nhau
2. Chọn style phù hợp brand nhất
3. Save exact prompt làm template
4. Dùng Flux multi-reference — upload winning image làm style reference
5. Batch generate variations cùng style, khác subjects
6. Post-process — thêm text overlay, logo, crop theo platform sizes

---

## Image Optimization Checklist

- [ ] Format: WebP với JPEG fallback
- [ ] Compression: 75-85% quality
- [ ] Dimensions: resize đúng display size trước khi serve
- [ ] CLS prevention: thêm `width` + `height` attributes
- [ ] Lazy loading: `loading="lazy"` cho ảnh below-fold
- [ ] Alt text: mô tả nội dung, không để trống
- [ ] CDN: serve qua CDN nếu có

---

## Output Template

```markdown
## Image Request: [tên task]

**Use case:** [blog hero / social post / banner / OG image]
**Platform:** [web / Instagram / LinkedIn / Twitter/X]
**Dimensions:** [WxH]
**Model:** [Gemini / Flux / Ideogram / GPT Image]

**Prompt:**
[full prompt theo formula trên]

**Style reference:** [link ảnh reference nếu có]
**Post-processing:** [text overlay, logo placement, crop]
```
