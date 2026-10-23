# Paid Ads Skill

---

## Skill Map — Ads Trong Kit

| Skill | Dùng khi | Output |
|-------|---------|--------|
| **`content/ads/`** (file này) | Tạo ad copy, audience targeting, creative, setup checklist | Ad content + strategy |
| **`content/social/`** | Organic social content strategy | Social plan |
| **`funnel/sales-page-funnel/`** | Landing page mà ads dẫn traffic đến | HTML page |
| **`analysis/`** | Phân tích performance, tối ưu ROAS | Report |

---

## Platform Priority (VN Market)

| Platform | Ưu tiên | Phù hợp khi |
|----------|---------|------------|
| **Facebook Ads** | ★★★★★ | Mọi loại sản phẩm, warm + cold traffic |
| **TikTok Ads** | ★★★★☆ | Brand awareness, cold traffic trẻ, video content |
| **Google Display** | ★★★☆☆ | Retargeting, visual product |
| **Google Search** | ★★★☆☆ | High-intent keywords, phải có search volume VN |
| LinkedIn | ★★☆☆☆ | B2B, HR, professional services |
| Twitter/X | ★☆☆☆☆ | Ít dùng ở VN |

---

## Trước Khi Bắt Đầu

Cần biết:
1. **Campaign Goal** — Awareness / Traffic / Leads / Sales? Target CPA/ROAS? Budget?
2. **Product & Offer** — Đang promote gì? Landing page URL? Value proposition?
3. **Audience** — ICP, pain points, behavior online
4. **Current State** — Đã chạy ads chưa? Conversion data? Pixel đã setup chưa?

Đọc `BUSINESS.md` trước — lấy product, audience, pricing, tone.

---

## 2 Modes

### Mode 1 — Generate Fresh Creative

Tạo ad copy từ product context và audience insights.

**Flow:**
```
1. Xác định angle (3-5 angles khác nhau — xem bên dưới)
2. Viết variations theo từng angle
3. Chọn platform → apply character limits
4. Output: copy ready để upload
```

### Mode 2 — Iterate từ Performance Data

Tối ưu dựa trên data đang chạy.

**Flow:**
```
1. User cung cấp: ad đang chạy + metrics (CTR, CPC, ROAS, CPM)
2. Diagnose: vấn đề ở hook, angle, hay offer?
3. Generate: variations mới test
4. Framework A/B test
```

---

## Creative Angles

Establish **3-5 distinct angles** trước khi viết variations. Mỗi angle = 1 lý do khác nhau người ta sẽ click.

| Angle | Approach | VD |
|-------|---------|---|
| **Pain point** | Đặt tên vấn đề họ đang gặp | "Mất 3 tiếng/ngày làm báo cáo thủ công?" |
| **Outcome** | Kết quả họ muốn | "Tăng doanh thu 30% mà không cần thêm nhân sự" |
| **Social proof** | Người khác đã làm được | "1.000+ solopreneur VN đang dùng..." |
| **Curiosity** | Tạo gap thông tin | "Lý do 90% khóa học online thất bại — và cách tránh" |
| **Contrarian** | Đi ngược belief phổ biến | "Đừng chạy Facebook Ads nếu chưa làm điều này" |
| **Urgency** | Tạo FOMO thật | "Chỉ còn 5 suất — đóng đơn thứ 6" |
| **Identity** | Ai họ muốn trở thành | "Dành cho solopreneur muốn sống theo lịch của mình" |
| **Comparison** | So với giải pháp cũ | "Không cần thuê agency — làm được tất cả trong 1 tool" |

---

## Ad Copy Formulas

### Primary Text Formulas

**Problem-Agitate-Solve (PAS):**
```
[Nêu vấn đề]
[Làm nặng hơn vấn đề]
[Giới thiệu giải pháp]
[CTA]
```

**Before-After-Bridge (BAB):**
```
Before: [Trạng thái đau khổ hiện tại]
After: [Trạng thái mong muốn]
[Sản phẩm là cầu nối]
```

**Social Proof Lead:**
```
"[Quote kết quả cụ thể]" — Tên, mô tả
[Sản phẩm làm gì]
[CTA]
```

**Direct Response:**
```
[Bold claim / outcome cụ thể]
[Proof point]
[CTA kèm urgency nếu thật]
```

Xem chi tiết + headline formulas + CTA variations: `references/ad-copy-templates.md`

---

## Character Limits Quick Reference

| Platform | Element | Limit |
|----------|---------|-------|
| **Facebook/Instagram** | Primary text | 125 visible (2,200 max) |
| **Facebook/Instagram** | Headline | 40 chars |
| **TikTok** | Ad text | 80 chars (100 max) |
| **Google RSA** | Headline | 30 chars (×15) |
| **Google RSA** | Description | 90 chars (×4) |
| **LinkedIn** | Intro text | 150 recommended (600 max) |

Xem đầy đủ: `references/platform-specs.md`

---

## Audience Strategy

### Meta Audiences (Facebook/Instagram)

**Cold traffic (prospecting):**
- Interest targeting → broad, let algorithm optimize
- Lookalike 1-3% từ customer list
- Loại trừ: existing customers + recent converters

**Warm traffic (retargeting):**
- Website visitors (30/60/90 ngày)
- Video viewers 50%+
- Page engagers
- Form openers

**Best practice:** Luôn exclude existing customers khỏi prospecting campaigns.

### TikTok Audiences

- Creative matters **hơn** targeting — broad targeting thường tốt hơn narrow
- Interest targeting khá broad, để algorithm optimize
- Pixel custom audiences + lookalike từ converters

Xem chi tiết + Google + LinkedIn targeting: `references/audience-targeting.md`

---

## Ad Creative Production

### Static Images

| Cần gì | Tool |
|--------|------|
| Text trong ảnh (headline, tagline) | Ideogram |
| Photorealistic lifestyle | Flux, Gemini Image |
| Brand consistency across variations | Flux (multi-reference) |
| Quick iterations | GPT Image (kit đang dùng) |

→ Xem `content/image/SKILL.md` cho prompt formulas

### Video Ads

| Cần gì | Tool |
|--------|------|
| Short video 15-30s từ prompt | Veo 3, Kling, Sora 2 |
| Batch nhiều variations từ template | Remotion, Hyperframes |
| Talking-head presenter | HeyGen (có MCP server) |
| Voiceover cho video | ElevenLabs, OpenAI TTS |

→ Xem `content/video/SKILL.md` cho video workflow

### Ad Creative Specs

| Platform | Format | Kích thước |
|----------|--------|-----------|
| Meta Feed | Square | 1080×1080 |
| Meta Stories/Reels | Vertical | 1080×1920 |
| TikTok | Vertical | 1080×1920 |
| Google Display | Landscape | 1200×628 |
| LinkedIn Feed | Landscape | 1200×627 |

---

## Conversion Tracking — Bắt Buộc Trước Khi Chạy Ads

**Không có tracking = platform không optimize được cho mục tiêu thật.**

Priority setup:
1. **Meta Pixel** — install trên mọi page, setup Events (Lead, Purchase, ViewContent)
2. **Meta Conversions API (CAPI)** — bắt buộc nếu spend > $3K/tháng (iOS 14+)
3. **TikTok Pixel** — tương tự Meta Pixel
4. **Google Tag** — nếu dùng Google Ads
5. **UTM parameters** — tất cả ad URLs phải có UTM

Test bắt buộc trước launch: fire real test conversion, kiểm tra Events Manager.

---

## A/B Testing Framework

**Test 1 element mỗi lần** — không test nhiều thứ cùng lúc.

**Thứ tự impact giảm dần:**
1. Hook / angle (impact lớn nhất)
2. Visual / format (image vs video vs carousel)
3. Headline
4. Primary benefit
5. CTA
6. Proof points

**Budget cho test:** Mỗi ad set cần ít nhất 50 conversions để algorithm học. Với budget nhỏ (< 3tr/tháng): test angle qua copy, không qua audience.

---

## Platform Setup Checklists

Trước khi launch bất kỳ campaign nào, check: `references/platform-setup.md`

**Universal pre-launch:**
- [ ] Conversion tracking test với real conversion
- [ ] Landing page load < 3 giây
- [ ] Landing page mobile-friendly
- [ ] UTM parameters trong tất cả URLs
- [ ] Budget đặt đúng (daily vs lifetime)
- [ ] Audience size hợp lý (Meta: 500K+ cho prospecting)

---

## Output Template

```markdown
## Ad Campaign: [tên campaign]

**Platform:** [Facebook / TikTok / Google]
**Objective:** [Leads / Sales / Traffic / Awareness]
**Budget:** [VND/ngày hoặc tháng]
**Audience:** [Mô tả targeting]
**Landing page:** [URL]

### Angle 1: [tên angle]
Primary text:
[copy]

Headline: [copy max 40 chars]
CTA: [button text]

### Angle 2: [tên angle]
...

### Creative Brief
Format: [image / video / carousel]
Visual: [mô tả hoặc prompt]
Dimensions: [WxH]
```

**Lưu output:**
```
output/content/[YYYY-MM-DD]/ads-[product-slug]/
├── copy.md          ← ad copy variations
└── creative-brief.md ← visual brief
```
