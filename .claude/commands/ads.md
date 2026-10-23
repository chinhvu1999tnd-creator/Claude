---
description: Ads Agent — tạo ad copy, audience targeting, creative brief cho Facebook Ads, TikTok Ads, Google Ads. 2 modes: generate fresh creative hoặc iterate từ performance data.
argument-hint: [ý định tự nhiên] VD: "Facebook Ads cho khóa học TikTok" | "tối ưu ads đang chạy CTR thấp" | "TikTok Ads cold traffic" | "setup pixel Meta"
agent: ads-content
---

<args>$ARGUMENTS</args>

## Intent Detection

| Tín hiệu | Task |
|----------|------|
| "facebook ads", "meta ads", "fb ads" | → **copy** · platform = facebook |
| "tiktok ads", "tiktok creative" | → **copy** · platform = tiktok |
| "google ads", "google search", "google display" | → **copy** · platform = google |
| "ad copy", "viết quảng cáo", "copy ads", "tạo ad" | → **copy** · hỏi platform |
| "audience", "target", "nhắm đối tượng", "lookalike" | → **audience** |
| "optimize", "tối ưu", "CTR thấp", "ROAS thấp", "CPC cao", "ads không hiệu quả" | → **optimize** |
| "creative", "ảnh quảng cáo", "video ad", "brief creative" | → **creative** |
| "setup", "pixel", "tracking", "conversion tracking", "cài đặt" | → **setup** |
| "checklist", "launch", "trước khi chạy" | → **setup** |
| Không rõ | → Hỏi: "Anh cần: (A) Tạo ad copy, (B) Audience strategy, (C) Tối ưu ads đang chạy, (D) Creative brief, hay (E) Setup tracking?" |

---

## Execution

**Trước tất cả:** Đọc `BUSINESS.md` — lấy product, pricing, audience, offer.

**Brand reference:** Kiểm tra `output/design/` — nếu có `brand-book-a4.pdf` → ghi đường dẫn vào `creative-brief.md` như design reference (màu sắc, font, logo style) để gửi kèm cho designer hoặc video editor.

### copy — Tạo Ad Copy

1. Load `agents/ads-content/agent.md`
2. Load `skills/ads/SKILL.md`
3. Load `skills/ads/references/ad-copy-templates.md`
4. Load `skills/ads/references/platform-specs.md`
5. Xác định: platform + objective + audience temperature (cold/warm/hot)
6. Define 3-5 angles trước khi viết
7. Viết copy theo từng angle, áp dụng đúng character limits
8. Output: copy đầy đủ sẵn sàng upload

### audience — Audience Strategy

1. Load `skills/ads/SKILL.md`
2. Load `skills/ads/references/audience-targeting.md`
3. Xác định: platform + funnel stage (cold/warm/hot)
4. Output: audience structure đầy đủ cho campaign

### optimize — Tối Ưu Ads Đang Chạy

1. Load `skills/ads/SKILL.md`
2. Yêu cầu user cung cấp: ad copy hiện tại + metrics (CTR, CPC, ROAS, CPM, frequency)
3. Diagnose: vấn đề ở hook, angle, audience, offer, hay landing page?
4. Output: hypothesis + variations mới để test + A/B test framework

### creative — Creative Brief

1. Load `skills/ads/SKILL.md`
2. Load `skills/ads/references/platform-specs.md`
3. Xác định: platform + format (image/video/carousel)
4. Nếu cần gen ảnh: load `skills/content/image/SKILL.md`
5. Nếu cần gen video: load `skills/content/video/SKILL.md`
6. Output: creative brief với dimensions, visual direction, text overlay

### setup — Pixel & Tracking Setup

1. Load `skills/ads/references/platform-setup.md`
2. Xác định platform(s) cần setup
3. Output: checklist setup + troubleshooting guide

---

## Ví Dụ Hoạt Động

```
/ads Facebook Ads cho khóa học TikTok Ads giá 1.997k
→ copy | platform = facebook | product = "khóa TikTok Ads 1.997k"

/ads TikTok Ads cold traffic, bán kit AI Agent
→ copy | platform = tiktok | audience = cold | product = kit

/ads ads đang chạy CTR 0.5%, ROAS 1.2x, muốn tối ưu
→ optimize | metrics provided | diagnose + recommendations

/ads cần brief creative cho Meta Ads, format carousel 5 cards
→ creative | platform = meta | format = carousel | cards = 5

/ads setup Meta Pixel cho landing page
→ setup | platform = meta | output = checklist
```

---

## Output — Lưu File

```
output/content/[YYYY-MM-DD]/ads-[slug]/
├── copy.md           ← ad copy variations theo angle
├── audience.md       ← audience strategy
└── creative-brief.md ← visual direction + specs
```
