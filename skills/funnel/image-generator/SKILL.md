---
name: image-generator
description: "Generate semantic image prompts for landing page media-slots. Reads actual section HTML + BUSINESS.md + THEME.md to reason about what each image should show — then writes image-plan-prompt.md. Auto mode calls OpenAI API directly."
version: 3.1.0
agent: funnel
tags: [image, generation, media-slot, gpt-image-2, prompt-plan, semantic]
---

# Image Generator Skill

Tạo ảnh cho tất cả `media-slot` placeholder trong landing page.
Claude đọc context thực tế của từng section → suy luận → viết prompt — không dùng template cứng.

---

## Hai chế độ

```
Có OPENAI_API_KEY?
│
├── YES → Auto mode
│         Claude viết prompt → node generate.js --prompt "..." --filename name.png
│         Lặp cho từng slot → node generate.js --update-html index.html
│
└── NO  → Plan mode  ← Claude làm trực tiếp
          Claude đọc HTML + context → viết image-plan-prompt.md
          User copy prompt → ChatGPT → save ảnh → patch HTML
```

**Lấy danh sách slots:**
```bash
node skills/funnel/image-generator/scripts/generate.js --list-slots path/to/index.html
```

---

## Khi nào dùng AI generation vs. code mockup

Không phải slot nào cũng nên dùng AI generation. Rule:

| Slot type | Approach tốt nhất | Lý do |
|-----------|------------------|-------|
| PERSON (portraits) | ✅ AI generation | Không có ảnh người thật sẵn |
| RESULT proof thumbnail | ✅ AI generation | Cần composite người + screen |
| CONTEXT (hero bg, atmosphere) | ✅ AI generation | Cần mood/atmosphere |
| PROCESS (terminal, UI, browser) | ⚡ **Code HTML mockup** | Pixel-perfect, font đúng, dễ sửa |
| PRODUCT (dashboard, app UI) | ⚡ **Real screenshot** hoặc code mockup | AI hallucinate UI details |

### PROCESS slots — build HTML mockup thay vì AI generation

Khi slot là terminal, browser preview, code output, file explorer:

1. **Claude tự build HTML mockup** — tạo file HTML/CSS simulate đúng giao diện, mở trong browser, screenshot
2. **Real screenshot** — thực sự chạy workflow, capture màn hình
3. **AI generation** — chỉ dùng khi không có thời gian cho 1 hoặc 2

**Prompt cho Claude để build terminal mockup:**
```
Build an HTML file that visually simulates a terminal screenshot showing:
- macOS window chrome (traffic light dots, title: "funnel-agent")
- Dark background #0d0d0d, monospace font
- Prompt: user@funnel-agent:~$ [command]
- Output lines with lime green (#B6FF00) → arrows
- Last output line highlighted with lime background
Export as a standalone HTML file to be screenshotted.
```

Kết quả: file HTML → mở browser → screenshot → ảnh chuẩn pixel, đúng brand, dễ update.

---

## Plan Mode — Claude làm trực tiếp

Khi không có API key hoặc user muốn review prompts trước:

### Bước 1 — Thu thập context

Với mỗi `data-role="..."` element trong HTML, đọc:

| Context | Cách lấy | Tại sao quan trọng |
|---------|----------|-------------------|
| `data-role` | Attribute trên slot | PERSON / PRODUCT / PROCESS / RESULT / CONTEXT |
| `data-section` | Attribute trên slot | Section identifier |
| Section headline | `<h1>` hoặc `<h2>` gần nhất trước slot | Section đang NÓI GÌ |
| Section copy | `<p>` text gần slot | Tone, emotion, argument |
| Section intent | Đọc copy → suy ra | Tension? Discovery? Proof? Trust? Urgency? |
| BUSINESS.md | `loadBusinessContext()` | Audience, product, result, industry |
| THEME.md | `--theme-slug:` | Accent color, visual aesthetic |

### Bước 2 — Suy luận narrative

Đừng hỏi "ảnh này role là gì?" — hỏi **"section này đang làm gì với người đọc?"**

```
Section copy nói về pain/vấn đề  → Ảnh: BEFORE state — chaos, overwhelm
Section copy nói về solution      → Ảnh: discovery moment — person + product
Section copy nói về proof/kết quả → Ảnh: proof thumbnail — person + screen + số liệu
Section copy nói về ai dùng       → Ảnh: after-state portrait — relaxed, genuine
Section copy là guarantee          → Ảnh: authority pledge — direct gaze, sincere
Section copy là CTA cuối           → Ảnh: direct invitation — eye contact, forward lean
Section copy giải thích cách dùng → Ảnh: UI walkthrough — clean interface, step visible
```

### Bước 3 — Ngôn ngữ trong ảnh

**RULE: Tất cả text hiển thị TRONG ảnh phải là tiếng Việt.**

Áp dụng cho:
- Text overlay (headlines, số liệu, badge)
- Card labels (tên agent, mô tả)
- UI text trên màn hình (menu, button, placeholder)
- Bất kỳ chữ nào GPT render vào ảnh

**Cách enforce trong prompt:**
1. Viết nội dung text bằng tiếng Việt trực tiếp: `"Agent Funnel — Xây & Triển khai phễu"` thay vì `"Funnel Agent — Build & Launch"`
2. Thêm instruction rõ ở đầu prompt: `IMPORTANT: ALL TEXT VISIBLE IN THE IMAGE MUST BE IN VIETNAMESE.`
3. Reinforce ở cuối: `All text in the image is Vietnamese — no English text anywhere.`

---

### Bước 4 — Viết prompt theo 5 lớp

Mỗi prompt là một đoạn văn liên tục, 5 lớp chảy vào nhau:

#### Lớp 1 — Genre (thể loại nhiếp ảnh)
Chọn thể loại phù hợp với narrative intent:
- `Environmental portrait photography:` — người trong môi trường tự nhiên
- `Documentary evidence photography:` — bằng chứng thực tế, candid
- `Social proof thumbnail graphic:` — proof thumbnail style
- `Editorial lifestyle product photography:` — người dùng sản phẩm
- `Direct engagement portrait:` — nhìn thẳng vào camera
- `Authentic direct portrait photography:` — chân thực, không dàn dựng
- `Clean instructional UI screenshot:` — giao diện rõ ràng

#### Lớp 2 — Scene (kịch bản cụ thể)
Mô tả **khoảnh khắc đang diễn ra** — không mô tả đối tượng đứng yên:

**Cho PERSON:** `[gender] Vietnamese [occupation], [age] years old, [clothing]. [action đang xảy ra]. [environment]. Expression: [emotion cụ thể — không phải "happy", mà là "quiet disbelief turning to satisfaction"].`

**Người phải đang LÀM GÌ ĐÓ:**
- Leaning toward screen, mid-scroll, caught at the moment a number lands
- Slightly turned as if recalling a success to someone off-camera
- Facing camera directly, hands visible, not smiling — sincere and accountable
- Looking directly into camera, slight forward lean, invitation energy

**Cho PRODUCT hero:** Visualize hệ thống, không phải người dùng laptop.
Ví dụ AI Agent Business Kit: 6 agent card nổi trong dark space, stacked perspective, lime glow trên edges.
Tên card phải bằng tiếng Việt: "Agent Offer — Nghiên cứu & Đóng gói", "Agent Content — Tạo & Phân phối nội dung", "Agent Funnel — Xây & Triển khai phễu", "Agent Sales — Chuyển đổi & Chốt deal", "Agent Deliver — Tự động hóa giao hàng", "Agent Analysis — Đo lường & Tối ưu".

**Cho PROOF/RESULT:** Person foreground + screen dominant background
- Person: left 35%, foreground, face lit by screen glow, 3/4 turn
- Screen: right 60%, dominant, analytics rõ ràng với số liệu từ BUSINESS.md
- Vietnamese conversion headline visible in image

**Cho PROCESS:** Màn hình UI cụ thể, rõ ràng — KHÔNG generic.
Mô tả đúng bước đó thực sự hiển thị gì:
- Bước 01: Text editor mở BUSINESS.md, fields đã điền
- Bước 02: Terminal với lệnh đang stream output
- Bước 03: Browser preview landing page hoàn chỉnh

**Kéo từ BUSINESS.md:**
- `audience` → gender, occupation, age range của người trong ảnh
- `result` → số liệu cụ thể hiển thị trên màn hình (₫847M, +312%, v.v.)
- `product` → tên sản phẩm, loại UI/dashboard
- `industry` → môi trường, trang phục, vibe

#### Lớp 3 — Lighting (ánh sáng khớp với emotion)

| Section emotion | Lighting |
|----------------|---------|
| Discovery / proof | Screen glow là nguồn sáng chính, chiếu lên mặt từ phía screen. Deep shadow phía sau |
| Authority / guarantee | Clean 3-point studio. Key từ upper-left, soft fill, rim light. Không dramatic |
| Testimonial / recall | Soft natural window light, warm 5200K, café conversation feel |
| CTA / invitation | Clean frontal soft-box, even tones, open và approachable |
| Proof thumbnail | Dramatic high-contrast. Dark background. Screen accent color glow trên mặt |
| Product visualization | Dark void. Cards self-illuminated. Accent color rim glow |

**Accent color từ THEME.md:**
```
signal / dark-bold-neon  → lime green #B6FF00
bright-learn             → amber yellow #FFB800
trust-navy               → royal blue #2563EB
prestige-dark            → champagne gold #C9A96E
warm-earth               → terracotta #D4824A
energy-sport             → electric red #FF3D00
```
Dùng accent color cho: metric highlights, card edges, chart lines, text overlay.

#### Lớp 4 — Composition (bố cục cho landing page)

```
Copy ở LEFT của ảnh  → Subject fills RIGHT 55%, left 45% empty
Copy ở ABOVE ảnh     → Subject centered, space at top
Proof thumbnail      → Person LEFT 35% foreground, screen RIGHT 60% background
Product hero         → Visual element RIGHT 55%, left 45% DARK EMPTY for text
Avatar / circle crop → Centered, fills 80% of frame
```

#### Lớp 5 — Technical directives

```
Luôn include:
- Photorealistic, not an illustration unless noted
- No AI-generated artifacts, no uncanny valley faces
- No watermarks, no logos, no stock photo aesthetic
- Screen content must be sharp and readable — never blurred
- All text visible in the image is in Vietnamese — no English text anywhere

Cho PERSON: Shot on Sony A7, 85mm f/1.8, film grain, Southeast Asian skin tones
Cho PRODUCT screen: Medium format, tilt-shift, product sharp throughout
Cho PROOF thumbnail: 35mm f/2, cinematic color grade, Vietnamese text correctly spelled
Cho PROCESS UI: High resolution, crisp edges, all UI elements legible, Vietnamese UI text
```

---

## Proof Thumbnail — Chi tiết

Style: YouTube/social proof thumbnail, người thật + màn hình thật + chữ thật.

```
IMPORTANT: ALL TEXT VISIBLE IN THE IMAGE MUST BE IN VIETNAMESE.

[Genre] Social proof thumbnail graphic:
[Person] [gender] Vietnamese [occupation], [age], [clothing] — left foreground, 3/4 turn,
         face partially illuminated by screen glow in [accent color], expression: [emotion].
[Screen] Behind and right: analytics dashboard showing [metric từ BUSINESS.md] highlighted
         in [accent color + hex], upward trend chart, supporting Vietnamese KPI labels readable.
[Text]   Bold Vietnamese text overlay: "[HEADLINE TIẾNG VIỆT]" — large, bold, [accent color] or white on dark.
[Comp]   Person left 35%, screen right 60% dominant. Composition: person = credibility, screen = proof.
[Light]  Dramatic. Screen glow in [accent color] is primary light source on face.
         Dark background makes [accent color] metrics pop.
[Grade]  Dark cinematic base. [accent color] as dominant accent throughout.
[Tech]   Photorealistic. Screen numbers readable. All text in Vietnamese — no English anywhere. Shot 35mm f/2.
```

**Vietnamese headlines (conversion-focused, có số cụ thể):**
- Có %: `"TĂNG [X]% DOANH THU — CHỈ MẤT 30 NGÀY"`
- Có revenue: `"ĐẠT [X]/THÁNG VỚI 1 NGƯỜI + AI"`
- Có customers: `"[X] KHÁCH HÀNG MỚI — KHÔNG CẦN TEAM"`
- Default: `"TỪ 1 NGƯỜI → HỆ THỐNG 6 AI AGENT"`

---

## Testimonial Variety — 3 người khác nhau

3 slot testimonial = 3 người thật sự khác nhau. Không bao giờ generate giống nhau.

| Slot | Profile |
|------|---------|
| 1 | Woman, 28-35, e-commerce shop owner, light floral blouse, warm Vietnamese café |
| 2 | Man, 38-45, digital agency owner, navy polo, modern home office with bookshelves |
| 3 | Woman, 42-50, business coach, structured blazer, co-working space |
| 4+ | Cycle lại hoặc tạo variation mới từ audience profile trong BUSINESS.md |

---

## Size theo loại slot

| Slot type | Size | Lý do |
|-----------|------|-------|
| Hero, proof, process (16:9) | 1536×1024 | Landscape sections |
| Testimonial avatar, guarantee avatar, CTA avatar | **1024×1024** | Circle crop — square tránh bị crop xấu |
| Portrait sections (3:4) | 768×1024 | |
| Story/mobile (9:16) | 1024×1536 | |

**Rule:** Nếu slot HTML có `border-radius: 50%` hoặc `border-radius: 9999px` → luôn dùng 1024×1024.

---

## Output — image-plan-prompt.md

File đặt **cùng folder với HTML file**.

Mỗi ảnh include:
```markdown
### Ảnh [N/total] — [ROLE] · [section]

| | |
|---|---|
| **Section** | [section id] |
| **Slot role** | `ROLE` |
| **File name** | `role-section-N.png` |
| **Save to** | `assets/images/role-section-N.png` |
| **Size** | [từ ratio của slot] |

> ⚠️ [Nếu PRODUCT/PROCESS]: Upload screenshot thực tế vào ChatGPT cùng prompt
> để màn hình hiển thị đúng UI thật của sản phẩm.

**Prompt:**

```
[Full 5-layer prompt — một đoạn văn liên tục]
```

> 💡 Nếu ảnh chưa đúng: thêm "Make it more [realistic/dramatic/warm] — landing page use"
```

Kết thúc file: patch command.

---

## Auto Mode — Scripts

Claude viết prompt → script call OpenAI API → save PNG → patch HTML.

```bash
# 1. Lấy danh sách slots
node skills/funnel/image-generator/scripts/generate.js \
  --list-slots output/funnel/sales/my-funnel/index.html

# 2. Generate từng ảnh (Claude cung cấp prompt)
node skills/funnel/image-generator/scripts/generate.js \
  --prompt "Dark cinematic product visualization: ..." \
  --filename product-hero-1.png \
  --size 1536x1024 \
  --out output/funnel/sales/my-funnel/assets/images

# 3. Patch HTML sau khi có đủ ảnh
node skills/funnel/image-generator/scripts/generate.js \
  --update-html output/funnel/sales/my-funnel/index.html
```

**Setup:**
```bash
# Thêm vào .env ở project root
OPENAI_API_KEY=sk-proj-...
```

---

## Lưu ý kỹ thuật

**Model ảnh:** `gpt-image-2` (quality: high)
**Sizes:** 1536×1024 (16:9) · 1024×1024 (1:1) · 768×1024 (3:4) · 1024×1536 (9:16)
**Output:** Base64 PNG → `assets/images/`
**Filename:** `{role}-{section}-{index}.png`
**Node:** >= 22.0.0
