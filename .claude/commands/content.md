---
description: Content Agent — tạo bài đăng, script video, carousel, lịch content cả tuần, hoặc phân tích số liệu
argument-hint: [ý định tự nhiên] VD: "7 bài facebook cả tuần" | "script tiktok bán hàng" | "phân tích instagram tháng này"
agent: post-content
---

<args>$ARGUMENTS</args>

## Tier Availability Check (CHẠY TRƯỚC TIÊN)

Trước khi load skill cho sub-action `organic` (SEO/organic traffic) hoặc `personal-brand`, verify:
- `organic` → check folder: `skills/organic-traffic/`
- `personal-brand` → check folder: `skills/personal-branding/`
- Nếu KHÔNG tồn tại → respond:

```
"Sub-action [X] có trong gói PRO/ALL:
 - 'organic' (SEO + organic traffic strategy) → có trong PRO
 - 'personal-brand' (personal branding strategy) → có trong ALL
 
 Trong BASIC, em hỗ trợ:
 - post (bài đăng FB/IG/TikTok)
 - post-image / carousel (ảnh + carousel 10 slide)
 - script (kịch bản video)
 - reels (video ngắn 1 cảnh)
 - image (AI image gen)
 - analytics, social (strategy basic)
 
 Anh/chị muốn sub-action nào trong các option trên?"
```

→ KHÔNG tiếp tục load skill nếu folder không tồn tại.

## Intent Detection

Đọc <args> và xác định task:

| Tín hiệu | Task | Platform / Type |
|----------|------|----------------|
| "analytics", "phân tích", "số liệu", "metrics", "thống kê", "reach", "engagement" | → **analytics** | Extract platform + period |
| "strategy", "chiến lược", "content pillar", "kế hoạch content", "xây kênh" | → **social** | social strategy |
| "hook", "hook formula", "viết hook", "dòng đầu tiên" | → **social** | hook formulas |
| "repurpose", "tái sử dụng", "1 bài thành nhiều bài", "từ podcast", "từ video dài" | → **social** | repurposing system |
| "engagement", "tương tác", "comment", "build audience", "grow following" | → **social** | engagement strategy |
| "optimize", "tối ưu", "tại sao reach thấp", "cải thiện performance" | → **social** | analytics & optimization |
| "short-form video", "hook video", "3 second rule", "structure reels", "cách làm tiktok" | → **social** | short-form video |
| "reverse engineer", "analyze viral", "học từ top creator" | → **social** | reverse engineering |
| "facebook", "fb" + bất kỳ content intent | → **post** | platform = facebook |
| "tiktok" + bất kỳ | → **post** | platform = tiktok |
| "instagram", "ig", "reels" | → **post** | platform = instagram |
| "youtube", "shorts" | → **post** | platform = youtube |
| "zalo", "zalo oa" | → **post** | platform = zalo |
| "batch", "cả tuần", "lịch content", "7 bài", "5 bài" | → **post** | type = batch |
| "script", "video", "kịch bản" | → **post** | type = script |
| "carousel", "slide" | → **post-image** | type = carousel (multi-card) |
| "story" | → **post** | type = story |
| "card", "ảnh kèm bài", "post kèm ảnh", "image card", "visual cho idea", "infographic" | → **post-image** | type = image-card |
| "blog hero", "og image", "banner", "ảnh cho landing page", "gen ảnh", "tạo ảnh AI", "prompt ảnh" | → **image** | AI image generation strategy |
| "SEO", "rank google", "từ khóa", "keyword", "organic traffic", "free traffic", "tự nhiên", "không tốn tiền", "youtube seo", "tiktok seo", "xây kênh youtube", "topical authority" | → **organic** | organic traffic strategy |
| "personal brand", "thương hiệu cá nhân", "định vị", "xây dựng tên tuổi", "thought leader", "positioning", "bio", "story", "origin story", "ikigai", "niche" | → **personal-brand** | personal branding strategy |
| Không rõ | → Hỏi: "Anh/chị cần: (A) Tạo bài post cụ thể, (B) Strategy/engagement/analytics, (C) Tạo ảnh/video, hay (D) SEO/Organic traffic?" |

---

## Execution

**Trước tất cả:** Đọc `BUSINESS.md` — lấy audience, tone, sản phẩm, kênh đang dùng.

**Brand reference:** Khi build `post-image-card` (HTML → PNG), kiểm tra `output/design/` — nếu có `design-system.html` → đọc để dùng đúng màu sắc, font và component style trong cards.

### post — Tạo Content (text-only)
1. Detect type:
   - "reels", "video ngắn", "tiktok video", "1-cảnh" → Load `agents/simple-reels/agent.md`
   - Còn lại (post text, carousel, image card) → Load `agents/post-content/agent.md`
2. Load `skills/content/content-creation/SKILL.md`
3. Xác định platform + type từ args
4. Áp dụng hook formula đúng platform (xem agent.md)
5. Output: Content hoàn chỉnh với caption + hashtag, sẵn sàng đăng

### social — Strategy, Engagement, Analytics, Short-Form Video

1. Load `agents/post-content/agent.md`
2. Load `skills/content/social/SKILL.md`
3. Xác định sub-task từ args:
   - `strategy` / `pillar` → Content Pillars Framework + Weekly Calendar template
   - `hook` → Hook Formulas (4 types) + ví dụ theo platform
   - `repurpose` → Repurposing System (podcast/video/blog/newsletter → social atoms)
   - `short-form video` / `tiktok structure` → 3-Second Rule + Video Structures
   - `engagement` → Daily Engagement Routine + quality comment guide
   - `analytics` → Metrics framework + weekly review + optimization actions
   - `reverse engineer` → 5-step framework analyze top creators
4. Đọc `BUSINESS.md` — lấy platform, audience, tone, offer
5. Output: Framework + plan đầy đủ sẵn sàng áp dụng

**Phân biệt `social` vs `post`:**
- `social` → strategy, framework, system (không tạo bài post cụ thể)
- `post` → tạo ngay bài viết cụ thể sẵn sàng đăng

### post-image — Tạo Content + Ảnh Card (HTML → PNG)
1. Load `agents/post-content/agent.md`
2. Load `skills/content/post-image-card/SKILL.md` ⚡ chính
3. Load `skills/content/content-creation/SKILL.md` cho hook formula + caption framework
4. Workflow 4 bước (analyze idea → write copy → build HTML 680×680 → render PNG)
5. Output: `output/content/cards/{idea-slug}.html` + `.png` + Facebook copy đầy đủ
6. Với carousel: lặp Bước 3-4 cho từng slide, giữ layout nhất quán

**Type mapping:**
- `batch` → 7 bài cho cả tuần, theo content calendar (T2-CN)
- `script` → script theo timestamp (0:00, 0:05, 0:15...)
- `carousel` → nội dung từng slide (slide 1: hook, slide 2-N: nội dung, slide cuối: CTA)
- `post` → bài viết text đầy đủ + caption
- `story` → content story ngắn gọn

### image — AI Image Strategy + Prompt

1. Load `agents/post-content/agent.md`
2. Load `skills/content/image/SKILL.md`
3. Load `skills/content/image/references/ai-image-prompting.md` cho prompt templates
4. Xác định: platform + dimensions + model phù hợp
5. Output: prompt đầy đủ theo formula + model recommendation + optimization checklist

**Khi nào dùng `image/` vs `post-image-card/`:**
- `image/` → cần prompt để gen ảnh bằng AI (Flux, Ideogram, Gemini...) cho blog, OG, banner
- `post-image-card/` → cần HTML→PNG card cho social posts / carousel, với brand styling

---

### personal-brand — Xây Dựng Thương Hiệu Cá Nhân (PRO/ALL only)
→ Refuse + suggest alternative theo Tier Availability Check ở đầu file.
Master tier dùng:

1. Load `agents/post-content/agent.md`
2. Load `skills/personal-branding/SKILL.md`
3. Xác định sub-task từ args:
   - `positioning` / `định vị` / `niche` → Framework 1 (Personal Monopoly) + Ikigai discovery
   - `story` / `origin story` / `bio` → Story Architecture + Bio Templates
   - `platform` / `kênh nào` → Load `references/platform-playbook-vn.md`
   - `content plan` / `lịch content` → Load `references/content-pillars.md` + weekly calendar
   - `thought leader` / `archetype` → Framework 3 (Thought Leadership Archetypes)
   - `roadmap` / `kế hoạch` → 90-Day Personal Brand Roadmap
4. Đọc `BUSINESS.md` — lấy niche, audience, platform hiện tại, credentials
5. Output: Plan/template cụ thể sẵn sàng thực thi

### organic — SEO & Organic Traffic (PRO/ALL only)
→ Refuse + suggest alternative theo Tier Availability Check ở đầu file.
Master tier dùng:

1. Load `agents/post-content/agent.md`
2. Load `skills/organic-traffic/SKILL.md`
3. Xác định sub-task từ args:
   - `keyword research` / `từ khóa` → Load `references/keyword-research.md` + quy trình tìm keyword
   - `google seo` / `rank google` → Load `references/platform-seo.md` → section Google
   - `youtube seo` / `tối ưu youtube` → Load `references/platform-seo.md` → section YouTube
   - `tiktok seo` / `tối ưu tiktok` → Load `references/platform-seo.md` → section TikTok
   - `content cluster` / `pillar page` / `topical authority` → SKILL.md Framework 1 + 2
   - `strategy` / `plan` → Full organic traffic strategy cho business
4. Đọc `BUSINESS.md` — lấy niche, platform đang dùng, bandwidth
5. Output: Plan/checklist cụ thể sẵn sàng thực thi

### analytics — Phân Tích Số Liệu
⚠️ Tạm dùng Analysis Agent cho đến khi Social Agent đầy đủ được xây dựng.
1. Load `agents/analysis/agent.md`
2. Hỏi user cung cấp số liệu (hoặc screenshot) từ platform
3. Phân tích: reach, engagement, follower growth, top posts
4. Output: Social Performance Report + khuyến nghị content tuần tới

---

## Ví Dụ Hoạt Động

```
/content 7 bài facebook cho cả tuần về chủ đề FB Ads
→ post | platform = facebook | type = batch | topic = "FB Ads"

/content script tiktok 60 giây bán khóa học
→ post | platform = tiktok | type = script | topic = "bán khóa học"

/content carousel instagram về 5 lỗi khi chạy ads
→ post | platform = instagram | type = carousel | topic = "5 lỗi chạy ads"

/content phân tích số liệu facebook tháng này
→ analytics | platform = facebook | period = "tháng này"

/content lên lịch content zalo cả tuần
→ post | platform = zalo | type = batch
```

---

## Quy Tắc Content

- Value-first: 80% giá trị, 20% promotion
- Platform-native: không copy-paste giữa các platform
- Hook quyết định tất cả — 3 giây đầu video, dòng đầu bài viết
- Consistency beats virality

---

## Output Structure (date → idea)

**Group theo NGÀY → theo IDEA**, không group theo platform. Mỗi idea = 1 folder self-contained.

```
output/content/
├── calendars/                                ← Planning artifacts (giữ nguyên)
│   └── 2026-05-content-calendar.md
└── {YYYY-MM-DD}/                             ← Production by date
    └── {idea-slug}/                          ← 1 folder = 1 idea
        ├── brief.md                          ← idea summary, layout, hook
        ├── card.html                         ← HTML source (image-card)
        ├── card.png                          ← Rendered 1080×1080 retina 2x
        ├── slide-1.html ... slide-N.png      ← carousel slides
        ├── facebook.md                       ← FB caption
        ├── instagram.md                      ← IG caption
        ├── zalo.md                           ← Zalo OA article
        └── script.md                         ← Video/Reel script
```

**Ví dụ:**
```
output/content/2026-05-14/ai-agent-loi-the-bat-cong/
├── brief.md
├── card.html · card.png
└── facebook.md

output/content/2026-05-14/5-loi-fb-ads/
├── brief.md
├── slide-1.html · slide-1.png ... slide-5
└── instagram.md

output/content/calendars/2026-05-content-calendar.md
```

**Rules:**
- 1 idea = 1 folder, dù 1 hay 10 file
- Date format: `YYYY-MM-DD` (sort tự nhiên)
- `calendars/` giữ nguyên — planning artifacts (không date-scoped)
- Platform captions (.md) đặt CÙNG folder với media, KHÔNG ở folder platform riêng
- Folders cũ (`facebook/`, `instagram/`, `tiktok/`, `zalo/`, `youtube/`, `cards/`) → **deprecated**, chỉ dùng cho content cũ. Content mới luôn dùng structure date-based

**Dùng Write tool để tạo file** — không chỉ hiện trong conversation.
