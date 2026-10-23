---
name: post-image-card
description: "Tạo bài viết mạng xã hội kèm ảnh card 1080×1080 cho FB/IG/Zalo. Workflow: idea → analyze layout → write copy → build HTML → render PNG via Playwright (2x retina, sharp). 8 layout patterns (2-col-compare, flowchart, timeline, list-cards, keyword-cloud, geometric, polygon-star, single-statement). Kích hoạt khi user muốn: 'tạo bài fb có ảnh', 'content kèm visual', 'card cho idea', 'post + image', 'carousel', 'infographic'."
version: 2.0.0
agent: content
tags: [facebook, instagram, zalo, image-card, social-media, html-to-png, playwright]
---

# Post Image Card Skill

Tạo bài viết social + ảnh card 1080×1080 (render 2x retina = 2160×2160 actual pixels, sharp trên mọi display) — fully self-contained.

**Output:** 1 file `.html` + 1 file `.png` + caption text, đặt trong folder theo ngày + theo idea.

Skill này **không dùng API gen ảnh** (DALL-E/GPT Image). Build HTML card pixel-perfect → render qua Playwright. Lý do: text trong ảnh chính xác 100%, brand consistent, free, control hoàn toàn.

---

## Khi Nào Dùng

- User muốn post Facebook/Instagram/Zalo có **ảnh card minh hoạ insight/concept**
- Cần ảnh có **text dày** (so sánh, danh sách, framework, quote)
- Cần ảnh **brand-consistent** (logo bar, palette nhất quán)
- Carousel single-frame style (5-10 cards cùng layout, khác content)

## Khi Nào KHÔNG Dùng

- Cần **ảnh chụp thật** (sản phẩm, người, phong cảnh) → dùng `skills/funnel/image-generator/` (GPT Image 2)
- Cần **video/reel** → dùng `references/video-script-framework.md` xuất brief, user dựng CapCut
- Cần **infographic phức tạp >680×680** → tăng size hoặc dùng Canva manual

---

## Workflow 4 Bước

### Bước 1 — Phân tích idea

Từ topic/idea, xác định:

| Câu hỏi | Output |
|---------|--------|
| Chủ đề cốt lõi cần truyền đạt? | 1 câu summary |
| Dạng thông tin? | so sánh / quy trình / danh sách / timeline / concept / quote |
| Layout phù hợp? | Chọn từ Layout Library bên dưới |
| Hook cho bài viết? | 1-2 dòng đầu |

### Bước 2 — Viết Facebook copy

Theo Brand Voice (xem section bên dưới). Cấu trúc:
- Hook mạnh (1-2 dòng đầu)
- Body: 3-6 đoạn ngắn, câu ngắn dễ đọc mobile
- CTA rõ ràng
- Hashtag 4-6 tag

### Bước 3 — Build HTML card 1080×1080

Chọn layout từ library → áp dụng design system → build 1 file HTML hoàn chỉnh.

**Output structure:** Mỗi idea = 1 folder riêng theo ngày.

```
output/content/{YYYY-MM-DD}/{idea-slug}/
├── brief.md       ← idea summary, layout chosen, hook
├── card.html      ← HTML source
├── card.png       ← Rendered image (sau Bước 4)
├── facebook.md    ← FB caption
└── instagram.md   ← IG caption (nếu cross-post)
```

Với **carousel**, multiple slides trong cùng folder:
```
output/content/{YYYY-MM-DD}/{idea-slug}/
├── brief.md
├── slide-1.html · slide-1.png
├── slide-2.html · slide-2.png
├── ... slide-N
├── facebook.md
└── instagram.md
```

### Bước 4 — Render PNG (2x retina, sharp)

```bash
PLAYWRIGHT_BROWSERS_PATH="/Users/hoangbatau/Desktop/Vibe Code/AI Agent Business Kit/.playwright" \
python3 skills/content/post-image-card/scripts/render-card.py \
  --html  output/content/{YYYY-MM-DD}/{idea-slug}/card.html \
  --out   output/content/{YYYY-MM-DD}/{idea-slug}/card.png
```

**Defaults:** 1080×1080 display × 2x scale = **2160×2160 actual pixels** → sharp trên mọi retina screen, sharp khi FB/IG compress.

**Lần đầu:** Script tự install Chromium (~135MB, 2 phút). Lưu trong `.playwright/` cùng project.
**Lần sau:** Render 3-5 giây.

---

## Layout Library — 8 patterns

Chọn **theo nội dung**, không phải theo sở thích.

| Layout | Khi nào dùng | Ví dụ idea |
|--------|-------------|-----------|
| `2-col-compare` | So sánh A vs B, đối lập | Agent vs Automation · Free vs Paid · DIY vs Hire |
| `flowchart` | Quy trình các bước tuần tự | Funnel 5 bước · Cách chạy campaign · Onboarding flow |
| `timeline` | Hành trình theo thời gian | 0→100k/tháng trong 6 tháng · Roadmap năm |
| `list-cards` | Tips, rules, danh sách rời | 5 sai lầm · 7 nguyên tắc · 10 mistakes |
| `keyword-cloud` | Định nghĩa, mindmap, từ khoá cụm | Hệ sinh thái AI tools · Marketing terms |
| `geometric` | Framework trừu tượng, mô hình | Tam giác chiến lược · Vòng tròn vô tận |
| `polygon-star` | Đánh giá đa chiều, radar chart | 6 yếu tố thành công · Strengths/weaknesses |
| `single-statement` | Quote, truth bomb, insight 1 câu | Câu nói đáng nhớ · Contrarian take |

### CSS templates cho từng layout (scaled cho 1080×1080)

#### `2-col-compare`
```css
.cards { display: grid; grid-template-columns: 1fr 80px 1fr; gap: 0; height: 100%; align-items: stretch; }
.col { background: #1E1E1C; border-radius: 16px; padding: 38px 30px; border: 1px solid #2e2e2c; display: flex; flex-direction: column; }
.col-title { font-size: 19px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; }
.col-a .col-title { color: #b0aea5; }
.col-b .col-title { color: #B6FF00; }
.col-rows { display: flex; flex-direction: column; flex: 1; justify-content: space-between; padding-top: 4px; /* anchor first row near title, last row at bottom */ }
.row { display: flex; align-items: flex-start; gap: 16px; }
.row-mark { font-size: 24px; font-weight: 900; line-height: 1; flex-shrink: 0; }
.row-text { font-size: 22px; line-height: 1.4; color: #e8e6dc; font-weight: 500; }
.col-a .row-mark { color: #666; }
.col-b .row-mark { color: #B6FF00; text-shadow: 0 0 12px rgba(182,255,0,.4); }
.vs { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; align-self: stretch; }
.vs-text { font-size: 24px; font-weight: 900; color: #666; letter-spacing: 2px; }
.vs-line { width: 1px; flex: 1; background: linear-gradient(to bottom, transparent, #333 30%, #333 70%, transparent); }
```

#### `flowchart`
```css
.flow { display: flex; flex-direction: column; gap: 0; height: 100%; justify-content: center; }
.flow-step { display: flex; align-items: center; gap: 20px; padding: 20px 26px; background: #1E1E1C; border-radius: 16px; border-left: 5px solid #B6FF00; }
.flow-num { font-size: 28px; font-weight: 900; color: #B6FF00; min-width: 38px; }
.flow-text { font-size: 19px; color: #e8e6dc; line-height: 1.4; }
.flow-arrow { text-align: center; color: #444; font-size: 28px; margin: 6px 0; }
```

#### `timeline`
```css
.timeline { display: flex; flex-direction: column; gap: 0; position: relative; padding: 12px 0; }
.timeline::before { content:''; position:absolute; left:32px; top:0; bottom:0; width:3px;
  background: linear-gradient(to bottom, transparent, #B6FF00 20%, #B6FF00 80%, transparent); }
.tl-item { display: flex; gap: 26px; align-items: flex-start; padding: 14px 0 14px 70px; position: relative; }
.tl-dot { position:absolute; left:20px; top:18px; width:26px; height:26px; border-radius:50%;
  background:#B6FF00; border:3px solid #141413; box-shadow: 0 0 0 2px #B6FF00; }
.tl-time { font-size: 16px; font-weight: 800; color: #B6FF00; letter-spacing: 1.5px; }
.tl-text { font-size: 18px; color: #e8e6dc; line-height: 1.4; margin-top: 4px; }
```

#### `list-cards`
```css
.list { display: flex; flex-direction: column; gap: 14px; padding: 6px 0; }
.list-item { display: flex; align-items: center; gap: 20px; padding: 18px 24px; background: #1E1E1C; border-radius: 16px; border: 1px solid #2e2e2c; }
.list-num { font-size: 22px; font-weight: 900; color: #B6FF00; min-width: 40px; }
.list-text { font-size: 19px; color: #e8e6dc; line-height: 1.4; }
```

#### `keyword-cloud`
```css
.cloud { display: flex; flex-wrap: wrap; gap: 14px; align-content: center; justify-content: center; height: 100%; padding: 26px; }
.pill { padding: 14px 26px; border-radius: 100px; font-size: 19px; font-weight: 700; }
.pill-lime  { background: rgba(182,255,0,.15); border: 2px solid rgba(182,255,0,.5); color: #B6FF00; }
.pill-cyan  { background: rgba(0,194,255,.12); border: 2px solid rgba(0,194,255,.4); color: #00C2FF; }
.pill-white { background: rgba(250,249,245,.06); border: 2px solid #333; color: #e8e6dc; }
```

#### `geometric`
Dùng SVG inline. ViewBox scale theo 1080×1080:
```html
<svg viewBox="0 0 580 510" style="width:100%;height:100%">
  <line x1="100" y1="380" x2="290" y2="100" stroke="#B6FF00" stroke-width="2.5" stroke-dasharray="6 6"/>
  <line x1="290" y1="100" x2="480" y2="380" stroke="#B6FF00" stroke-width="2.5" stroke-dasharray="6 6"/>
  <line x1="100" y1="380" x2="480" y2="380" stroke="#B6FF00" stroke-width="2.5" stroke-dasharray="6 6"/>
  <circle cx="290" cy="100" r="64" fill="#1E1E1C" stroke="#B6FF00" stroke-width="3"/>
  <text x="290" y="108" text-anchor="middle" fill="#faf9f5" font-size="18" font-weight="900">NODE 1</text>
</svg>
```

#### `polygon-star` (radar/spider)
```html
<svg viewBox="0 0 580 510" style="width:100%;height:100%">
  <polygon points="290,60 510,220 430,460 150,460 70,220"
           fill="rgba(182,255,0,.05)" stroke="#2e2e2c" stroke-width="2"/>
  <polygon points="290,130 450,240 380,400 200,420 130,250"
           fill="rgba(182,255,0,.3)" stroke="#B6FF00" stroke-width="3"/>
  <text x="290" y="40" text-anchor="middle" fill="#faf9f5" font-size="16" font-weight="800">FACTOR 1</text>
</svg>
```

#### `single-statement`
```css
.statement { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 40px; }
.quote-mark { font-size: 130px; color: #B6FF00; line-height: 0.5; margin-bottom: 20px; font-family: Georgia, serif; }
.quote-text { font-size: 40px; font-weight: 800; color: #faf9f5; line-height: 1.3; letter-spacing: -0.8px; max-width: 90%; }
.quote-source { font-size: 18px; color: #b0aea5; margin-top: 26px; letter-spacing: 3px; text-transform: uppercase; }
```

---

## Design System

**Đọc từ THEME.md** — nếu user dùng theme khác dark-bold-neon, thay palette tương ứng. Default dưới đây phù hợp với `dark-bold-neon`:

### Colors
```
Background:  #141413   (nền chính)
Surface:     #1E1E1C   (card, panel)
CTA/Accent:  #B6FF00   (neon lime — highlight chính)
Cyan:        #00C2FF   (accent phụ)
Text White:  #faf9f5   (chữ chính)
Text Mid:    #e8e6dc   (body text)
Text Dim:    #b0aea5   (label, phụ)
Border:      #2e2e2c   (line, divider)
```

**Theme khác:** Đọc `THEME.md` → swap màu primary (B6FF00 → màu brand) và keep structure.

### Typography (scaled cho 1080×1080)
```
Font: Inter (Google Fonts)
Headline:    900, 100-120px, letter-spacing: -4px, UPPERCASE
Subheading:  700, 22-28px
Body:        500-600, 16-19px
Label:       700-800, letter-spacing: 4px, UPPERCASE, 13-14px
```

### Grid Background (luôn dùng, 54px ô)
```css
.grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 54px 54px;
}
```

### Brand Bar (top, 56px)

**Đọc tên brand từ `BUSINESS.md`** (`**Tên thương hiệu:**`) + niche/category từ ngành hoặc audience:

```html
<div class="brand">
  <span class="bn">[BRAND NAME từ BUSINESS.md] · [Niche tagline]</span>
  <span class="bt">[Category tag]</span>
</div>
```

### Bottom Bar (96px, luôn có)

```html
<div class="bot">
  <span class="bq">"[Câu hỏi chốt / insight ngắn]"</span>
  <span class="bp bpl">[CTA A]</span>
  <span class="bp bpb">[CTA B]</span>
</div>
```

---

## HTML Card Template Base (1080×1080)

**Headline: 2 dòng**, với highlight inline trên 1 trong 2 dòng. Subtitle thành **eyebrow** ở trên đỉnh hero (không bị che bởi content area).

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;overflow:hidden;background:#141413}
.card{width:1080px;height:1080px;background:#141413;position:relative;overflow:hidden;font-family:'Inter',sans-serif}

.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);
  background-size:54px 54px}

.brand{position:absolute;top:0;left:0;right:0;height:56px;
  display:flex;align-items:center;justify-content:space-between;padding:0 36px;
  border-bottom:1px solid #222;z-index:10}
.bn{font-size:14px;font-weight:700;letter-spacing:4px;color:#b0aea5;text-transform:uppercase}
.bt{font-size:13px;font-weight:600;color:#b0aea5;border:1px solid #333;padding:4px 14px;border-radius:30px}

/* Hero — 2-line heading + eyebrow trên đỉnh */
.hero{position:absolute;top:56px;left:0;right:0;height:300px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 40px;text-align:center;gap:22px}
.eyebrow{font-size:15px;font-weight:700;letter-spacing:5px;color:#b0aea5;text-transform:uppercase;
  display:flex;align-items:center;gap:14px}
.eyebrow::before,.eyebrow::after{content:'';width:32px;height:1px;background:#444}
.title{font-size:92px;font-weight:900;line-height:1.08;color:#faf9f5;text-transform:uppercase;letter-spacing:-4px}
.title .hl{display:inline-block;background:#B6FF00;color:#141413;padding:4px 22px 4px;border-radius:6px;line-height:1.0}

.content{position:absolute;top:360px;left:64px;right:64px;bottom:96px;/* DEFAULT cho 1-col; 2-col override 26-30px */}

.bot{position:absolute;bottom:0;left:0;right:0;height:96px;
  border-top:1px solid #222; /* same bg as card, only line divider — tránh section break */
  display:flex;align-items:center;justify-content:center;gap:16px;padding:0 36px}
.bq{font-size:18px;font-weight:500;color:#b0aea5;font-style:italic}
.bp{padding:8px 20px;border-radius:30px;font-size:16px;font-weight:800;white-space:nowrap;letter-spacing:.5px}
.bpl{background:#B6FF00;color:#141413}
.bpb{background:#00C2FF;color:#141413}
/* ── Layout-specific CSS đặt ở đây ── */
</style></head><body>
<div class="card">
  <div class="grid"></div>
  <div class="brand">
    <span class="bn">[BRAND] · [Niche]</span>
    <span class="bt">[Category]</span>
  </div>
  <div class="hero">
    <div class="eyebrow">[Subtitle ngắn UPPERCASE]</div>
    <h1 class="title">
      [DÒNG 1 word] <span class="hl">[HIGHLIGHT]</span><br>
      [DÒNG 2]
    </h1>
  </div>
  <div class="content">
    <!-- Layout-specific HTML — chọn 1 trong 8 layouts trên -->
  </div>
  <div class="bot">
    <span class="bq">"[Câu hỏi chốt]"</span>
    <span class="bp bpl">[CTA A]</span>
    <span class="bp bpb">[CTA B]</span>
  </div>
</div></body></html>
```

**Highlight rule:** Đặt `<span class="hl">` trên word/cụm từ ấn tượng nhất. Có thể ở dòng 1 HOẶC dòng 2, tùy ý. Tránh đặt highlight ở giữa dòng (dài) — đặt cuối dòng đẹp hơn.

---

## Brand Voice — viết Facebook copy

### Quy tắc xưng hô (BẮT BUỘC)

**Dùng "bạn" (người đọc) và "tôi" (mình/founder).** KHÔNG dùng "anh/chị" trong copy bất kỳ trường hợp nào.

### Giọng văn

Tự nhiên, nói chuyện trực tiếp, không hoa mỹ. Dạy-học nhưng không giảng đạo.

### Cấu trúc

```
[HOOK — 1-2 dòng, gây tò mò hoặc phản bác quan điểm thông thường]

[BODY — 3-6 đoạn ngắn, mỗi đoạn 2-4 câu]
[Xuống dòng nhiều, câu ngắn, dễ đọc trên mobile]
[Có thể dùng số thứ tự hoặc dấu →]

[CTA — 1-2 câu, rõ ràng, không sến]

[HASHTAG — 4-6 tags]
```

### Tránh

- Emoji rác (✅❌🔥💯🚀) trừ khi thật sự cần
- Câu hỏi tu từ sáo rỗng ("Bạn có biết không?")
- Kết bài kiểu influencer ("Theo dõi mình để học thêm nhé!")
- Chữ HOA la hét giữa body text
- "anh/chị" — luôn dùng "bạn/tôi"

### Ví dụ hook tốt

- "90% marketer đang nhầm lẫn giữa 2 thứ này."
- "Tôi đã mất 6 tháng để hiểu ra điều này."
- "AI Agent ≠ AI Automation. Dùng sai mất tiền."
- "Có một sai lầm bạn đang làm hàng ngày mà không biết."

---

## Carousel Workflow (5-10 cards cùng layout)

Để tạo carousel IG/FB với style nhất quán:

1. Chọn **1 layout duy nhất** áp dụng cho tất cả slides (vd: `list-cards` cho 5 tips)
2. Brand bar + bottom bar **giống hệt** mọi slide
3. Hero text khác nhau theo slide:
   - Slide 1: Cover/Hook (single-statement hoặc t1+t2 lớn)
   - Slide 2-N: Content theo layout chính
   - Slide cuối: CTA + summary
4. Save toàn bộ slides trong cùng 1 folder idea:
   ```
   output/content/{YYYY-MM-DD}/{idea-slug}/
   ├── slide-1.html · slide-1.png
   ├── slide-2.html · slide-2.png
   ├── ... slide-N
   ├── facebook.md
   └── instagram.md
   ```
5. Render từng slide (1080×1080, 2x retina):
   ```bash
   python3 skills/content/post-image-card/scripts/render-card.py \
     --html output/content/2026-05-14/5-loi-fb-ads/slide-1.html \
     --out  output/content/2026-05-14/5-loi-fb-ads/slide-1.png
   # Lặp cho slide-2 → slide-N
   ```
6. User upload tuần tự lên IG/FB carousel

---

## Design Quality Rules — BẮT BUỘC tuân thủ

### Rule 1: Render và verify trước khi finalize
Sau khi tạo HTML, **LUÔN render PNG và mở xem** trước khi giao output cho user. Đừng đoán — visual issues chỉ thấy khi render thật.

### Rule 2: Hero không được vượt height định sẵn
- Hero height 300px → max 2 dòng heading 108px (với line-height 1.0)
- Nếu cần 3 dòng → giảm font xuống 80-90px HOẶC tăng hero height
- Highlight box `.hl` phải có cùng `line-height` với parent → tránh chèn lên hàng trên/dưới

### Rule 3: Content area không được trống >20% chiều cao
- Dùng `justify-content: space-around` trên `.col-rows` để rows tự stretch full height
- HOẶC tăng padding/font/gap cho rows lấp đầy
- 5 rows trong height 600px → mỗi row ~120px space, rows phải có font + padding tương xứng (không phải 18px text với 18px gap)

### Rule 4: Flex children phải stretch đúng
- `.vs` divider phải có `align-self: stretch` để stretch full chiều cao card
- `.cards { align-items: stretch }` để 2 columns cùng chiều cao
- VS lines: `flex: 1` để fill empty space giữa text "VS"

### Rule 5: Test với content thực tế
- Đếm số rows trong layout (5? 6? 7?) — content area phải fit số rows đó
- Test với text dài nhất có thể xuất hiện — kiểm tra không bị wrap/cut

### Rule 6: KHÔNG tách section bằng background color khác
- Brand bar (top) + Bottom bar **dùng CÙNG background** với card chính (`#141413`)
- Chỉ phân tách bằng `border-top: 1px solid #222` mảnh — đủ để divide visually mà không break visual flow
- Tránh `background: #1E1E1C` cho bottom bar — tạo cảm giác "section break" làm card trông rỗng/chia mảnh
- `.col` cards trong content area thì OK dùng bg #1E1E1C — đó là CONTENT BLOCK chứ không phải section divider

### Rule 7: Content fills 75-90% chiều cao content area
- Số rows/items phải scale theo height available
- Layout 5-item trong 600px height → ép thành 6-7 items HOẶC tăng card size + gap
- Bottom empty >20% = **REJECT**, return làm lại với nhiều content hoặc layout khác
- Khi không thể tăng content → tăng card padding + font + gap để fill space

### Rule 8: Bottom bar quote VARY per slide trong carousel
Khi build carousel (multi-slide):
- Quote ở bottom bar PHẢI khác nhau mỗi slide — 1 câu insight/takeaway riêng
- Lặp boilerplate "Swipe để xem tiếp" = reader scroll qua không có hook để dừng
- Standalone card thì OK dùng quote chung

### Rule 9: Eyebrow phải có hierarchy rõ
- **Standalone card:** category tag (vd: "AI MARKETING · 2026")
- **Carousel slide:** progress indicator (vd: "TOOL · 01 / 07" hoặc accent số đầu lime)
- Eyebrow xám nhỏ default → dễ miss → tăng accent (lime trên số) hoặc size 15→17px

### Rule 10: Mỗi slide cần ≥1 visual element ngoài text
Pure text → slide weak, easy to scroll past. Cần ít nhất 1 trong:
- **Background card với border accent** (như list-cards)
- **Ghost number lớn mờ** phía sau hero (vd: "01" opacity 0.05)
- **SVG icon/badge** trên tool name hoặc category
- **Decorative line/divider** strategic
- **Color accent block** (highlight box, accent bar)

### Rule 11: Content side padding khác nhau theo loại layout
1-col layouts (cards span full width) cần breathing room rộng hơn 2-col:

| Layout type | Content side padding | Lý do |
|------------|---------------------|-------|
| **1-col** (list-cards, flowchart, timeline, single-statement) | **60-72px** mỗi bên | Card spans full width → cần margin breathing |
| **2-col** (2-col-compare) | 26-30px mỗi bên | 2 cards + VS gap đã tạo internal margin |
| **SVG** (geometric, polygon-star) | 20-30px (gần full bleed) | SVG cần space để render |
| **Cloud** (keyword-cloud) | 40-50px | Pills wrap tự nhiên, padding vừa phải |

Default cũ 30px cho mọi layout = sai cho 1-col → cards quá sát edge slide.

---

## Layout-Specific Quality Bar

Mỗi layout có rules riêng để đạt chất lượng cao. Áp dụng cùng với 10 universal rules.

### `2-col-compare`
- 5-7 rows mỗi col — ít hơn → trống, nhiều hơn → overload
- VS divider phải visible (line + text), `align-self: stretch`
- Col-b (winner) có border accent đậm hơn col-a
- Row text 22px+, gap đủ rộng để fill space (`justify-content: space-between`)

### `flowchart`
- Steps numbered prominent (01, 02, 03 — không "1, 2, 3")
- Arrow ↓ giữa steps phải visible (font-size 24px+)
- Step cuối (kết quả) có styling khác — lime border đậm hoặc bg lime nhạt
- Max 5-6 steps — nhiều hơn → split slide khác

### `timeline`
- Time label dominant (Q1 2024, Day 1, 6 tháng) — font 16px+ lime
- Khoảng cách giữa items có thể vary (cluster events gần thời điểm quan trọng)
- "Now" marker (chấm khác màu) nếu show vị trí hiện tại
- Last item = destination/result, styled distinct

### `list-cards`
- **5-7 items** — không phải 3 (trống bottom)
- Hero item đầu có thể lime background fill (killer point)
- Icon nhỏ (SVG hoặc unicode) trong từng row → easier scan
- Row text 22px, padding 22px+, gap 16-20px

### `keyword-cloud`
- 15-25 pills — thiếu trống, nhiều rối
- Size hierarchy: pills quan trọng to hơn 1.3x
- Color groups kể chuyện: lime (chính), cyan (related), white (neutral)
- Wrap tự nhiên, không force center-align

### `geometric`
- SVG fill 85%+ content area
- Connecting lines có direction arrow (data flow)
- Mỗi node có label rõ + value/description ngắn
- Center node hoặc result label highlight

### `polygon-star`
- Axes labels prominent — mỗi axis 1 yếu tố cụ thể
- 2 polygons compare: current (lime fill) + target (dashed outline)
- Background polygon faint, data polygon strong
- Score numerical bên dưới (vd: "38/50")

### `single-statement`
- Quote SHORT (8-15 từ) — long quote dùng layout khác
- Attribution + role (vd: "— John / Founder X")
- Quote mark `"` decorative size lớn
- Optional context line dưới quote

---

## Carousel-Specific Rules

Khi build carousel (chuỗi slides), thêm rules:

### Slide roles
- **Slide 1 (Cover):** Hook lớn — big number/headline + topic + "swipe →" hint
- **Slides giữa (Tools/Tips/Points):** Cùng template, chỉ thay content + accent
- **Slide cuối (CTA):** Question + 2 action pills lớn (lime + cyan/outline)

### Bottom bar quote progression (Rule 8 applied)
- Each middle slide có **unique quote/insight** về slide đó
- Cover: "Swipe để khám phá" + "Lưu lại"
- CTA: "Comment / Follow" + "Lưu post"

### Eyebrow progression (Rule 9 applied)
- Pattern: `[TOOL/STEP/TIP] · 01 / N`
- Số đầu (01) **accent lime**, "/ N" giữ xám
- Cover + CTA có thể skip progress, dùng category label

### Visual consistency
- Hero structure giống nhau across middle slides
- Color accent đồng nhất (không dùng cyan slide 2 + purple slide 5)
- Brand bar + bottom bar IDENTICAL layout (chỉ vary quote)
- Ghost number "01..N" mờ phía sau hero để mark slide identity (optional)

---

## Checklist trước khi output

- [ ] Folder structure đúng: `output/content/{YYYY-MM-DD}/{idea-slug}/`
- [ ] Layout khớp với dạng thông tin của idea (so sánh, quy trình, danh sách...)
- [ ] Card 1080×1080 — không phải 680 (default cũ)
- [ ] Render với `--scale 2` (retina sharp) — file size ~200-400KB là OK
- [ ] Headline **2 dòng** (không 3) — UPPERCASE, có 1 highlight inline
- [ ] Eyebrow trên đỉnh hero — uppercase + 2 dashes
- [ ] **Đã render thử và mở xem** — confirm không overlap, không trống >20% (Rule 1)
- [ ] Brand bar top + Bottom bar đều có
- [ ] Grid background hiển thị (54px ô)
- [ ] Brand name kéo đúng từ BUSINESS.md
- [ ] Colors khớp THEME.md (default dark-bold-neon)
- [ ] Facebook copy: hook + body + CTA + hashtag
- [ ] Pronoun: **bạn/tôi** — không "anh/chị"
- [ ] Files saved: `brief.md`, `card.html`, `card.png`, `facebook.md` (+ `instagram.md` nếu cross-post)

---

## Tích Hợp Với Skills Khác

| Skill liên quan | Khi nào dùng |
|----------------|-------------|
| `skills/content/content-creation/SKILL.md` | Reference platform best practices, content calendar |
| `skills/content/content-creation/references/social-post-templates-library.md` | Lấy hook formulas, caption templates |
| `skills/funnel/image-generator/` | KHÔNG dùng — đó là cho landing page photo (PERSON, PRODUCT) |
| `skills/funnel/page-designer/themes/{theme}/DESIGN.md` | Reference color palette nếu theme khác dark-bold-neon |

---

## Files Liên Quan

| File | Vai trò |
|------|---------|
| `skills/content/post-image-card/SKILL.md` | File này — workflow + layouts + brand voice |
| `skills/content/post-image-card/scripts/render-card.py` | Playwright script render HTML → PNG |
| `.playwright/` (project root) | Chromium binary cache, lưu 1 lần dùng mãi |
| `output/content/cards/` | Output folder (tạo tự động khi render lần đầu) |
| `BUSINESS.md` | Brand name + niche cho brand bar |
| `THEME.md` | Color palette nếu theme khác default |
