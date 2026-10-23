---
description: Hiển thị toàn bộ commands kit BASIC + suggest learning roadmap dựa trên state hiện tại
argument-hint: (không cần args) — hoặc tuỳ ý "stuck" / "roadmap" / "next" để xem suggestion cụ thể
agent: coach
---

<args>$ARGUMENTS</args>

## Vai trò

Reference toàn bộ slash commands trong kit BASIC + suggest **next step** thông minh dựa trên user state hiện tại.

## Execution

### Bước 1: Detect user state (giống welcome-hook)

Đọc parallel:
- `BUSINESS.md` — filled chưa?
- `.env` — Portal đã setup chưa?
- `output/` — folders nào đã có (offer/, brand/, funnel/, content/, ads/, sales/, analysis/)?
- `output/coach/active-plan.md` — active plan?

### Bước 2: Hiển thị FULL COMMAND REFERENCE

```markdown
# 📚 AI Agent Business Kit BASIC — Hướng dẫn

> 💬 **KHÔNG cần nhớ lệnh!** Cứ chat tự nhiên — "anh muốn bán khoá X" / "viết bài FB" —
> kit tự hiểu + route đúng agent. Slash command bên dưới chỉ là shortcut optional.
> (Cheat sheet 1 trang: xem file CHEATSHEET.md ở thư mục gốc)

## ⚡ 3 lệnh cần nhớ DUY NHẤT
| Command | Use case |
|---------|----------|
| `/start` | LẦN ĐẦU mở kit — Coach onboarding |
| `/coach` | Không biết làm gì tiếp — Coach gợi ý |
| `/kit-help` | (đang xem) — hướng dẫn + roadmap |

→ Còn lại cứ nói chuyện bình thường, hoặc dùng shortcut bên dưới.

---

## 🧠 Coach Agent — Não bộ điều phối

| Command | Job |
|---------|-----|
| `/start` | Onboarding lần đầu (dep check + business + brand + Portal + plan) |
| `/coach` | Menu nhanh + status |
| `/coach plan "<mục tiêu>"` | Tạo plan N-bước cho mục tiêu cụ thể |
| `/coach next` | Continue plan đang chạy (bước tiếp theo) |
| `/coach status` | Xem progress tổng quan |
| `/coach setup-crm` | Re-setup Customer Portal |
| `/coach update business` | Update BUSINESS.md |
| `/coach update theme` | Update THEME.md |

---

## 🎯 Offer Agent — Đóng gói sản phẩm

| Command | Job |
|---------|-----|
| `/offer` | Default — research + competitor + packaging |
| `/offer research "<niche>"` | Market validation (Web search 6 queries VN) |
| `/offer competitor "<niche|tên>"` | Phân tích 5-10 đối thủ |
| `/offer packaging` | Đóng gói value + pricing + guarantee |

---

## 🎨 Brand Agent — Bộ nhận diện thương hiệu

| Command | Job |
|---------|-----|
| `/brand` | Tạo brand đầy đủ — 3 input modes (URL/ảnh/text) |
| `/brand quick-preview` | Generate 3 brand book options A/B/C cho anh/chị pick |
| `/brand logo` | Chỉ tạo logo SVG |
| `/brand update "<target>"` | Targeted edit ("đổi màu xanh đậm hơn"...) |
| `/brand redesign "<combined>"` | Combine URL + ảnh + text trong 1 prompt |

---

## 📝 Content Agents (split 2 sub-agent)

| Command | Job |
|---------|-----|
| `/content post` | Bài đăng FB/IG/LinkedIn (text + hashtag) |
| `/content carousel` | Carousel 10 slide (render PNG) |
| `/content image` | Image card / AI image |
| `/content reels` | **Simple Reels Agent** — video ngắn 1 cảnh + voiceover |
| `/content reels batch 3` | Batch 3 reels |
| `/content batch 7` | 7 bài posts cho cả tuần |
| `/lead-magnet "<topic>"` | **Lead Magnet Agent** — tạo PDF checklist/cheat sheet/quiz/template (không cần funnel) |

---

## 🌐 Funnel Agents (split 3 sub-agent)

| Command | Job |
|---------|-----|
| `/funnel leads "<niche>"` | **Leads Funnel** — opt-in + PDF magnet + email nurture |
| `/funnel sales "<sản phẩm>"` | **Sale Funnel** — sales page + SePay + delivery + Telegram |
| `/funnel booking "<service>"` | **Booking Funnel** — booking page + email confirm/reminder |
| `/funnel webinar` | (PRO/ALL — không có trong BASIC) |
| `/funnel challenge` | (PRO/ALL) |

---

## 💬 Sales + Ads + CRM

| Command | Job |
|---------|-----|
| `/sales` | DM scripts — FAQ + objection + closing + follow-up (5 sample ready) |
| `/sales objection "<scenario>"` | Custom objection script |
| `/ads "<sản phẩm>"` | Ad copy + headlines + creative brief (FB/TikTok/Google) |
| `/ads iterate` | Iterate ad từ performance data |
| `/coach crm` | Wire funnel với Portal CRM |
| `/coach affiliate` | Setup affiliate program |

---

## 📊 Analysis Agent — Báo cáo + Tối ưu

| Command | Job | Data source |
|---------|-----|-------------|
| `/analyze revenue` | Doanh thu, AOV, LTV, top products | Portal Supabase (auto) |
| `/analyze social --auto` | FB/IG/TikTok performance | Apify (cần token) |
| `/analyze social --manual` | Social phân tích | User paste CSV/screenshot |
| `/analyze funnel` | Diagnostic 3-layer (traffic/conversion/AOV) | Portal + tracking |
| `/analyze competitor` | Scrape 3-5 đối thủ + gap analysis | Apify |
| `/analyze optimize` | Top 3 actions next week | Aggregate |

---

## 🔧 Setup integrations (Coach handle giúp)

| Command | Setup |
|---------|-------|
| `/setup` | Menu setup tất cả integrations |
| `/coach setup-crm` | Customer Portal (Supabase + Vercel + SePay + Resend) — ~15 phút |
| `/setup apify` | Apify token cho social analytics (optional, free $5/tháng) |
| `/setup sepay` | Re-config SePay webhook |

---

## 🗺 Learning Roadmap (gợi ý từng giai đoạn)

### 📅 NGÀY 1 — Khởi đầu
1. `/start` — onboarding full (BUSINESS + Brand + Portal)
2. Coach lo setup Customer Portal qua /coach setup-crm

### 📅 TUẦN 1 — Đóng gói + Phễu đầu tiên
1. `/offer research "<niche>"` — validate niche
2. `/offer packaging` — đóng gói offer
3. `/brand` — setup brand (nếu chưa)
4. `/funnel sales "<sản phẩm>"` — build phễu bán

### 📅 TUẦN 2-3 — Content + Traffic
1. `/content batch 7` — 7 posts hằng ngày
2. `/content reels batch 3` — video TikTok/Reels
3. `/ads "<sản phẩm>"` — ad copy cho paid traffic
4. `/sales` — kịch bản chốt qua inbox

### 📅 TUẦN 4 — Tối ưu + Phân tích
1. `/analyze revenue` — báo cáo tuần
2. `/analyze funnel` — diagnose bottleneck
3. `/analyze optimize` — top 3 actions tuần kế

### 📅 THÁNG 2+ — Scale
1. `/coach affiliate` — setup affiliate
2. `/analyze competitor` — competitor intel  
3. `/coach plan "scale lên 100tr/tháng"` — plan tăng trưởng
```

### Bước 3: Suggest NEXT STEP dựa trên user state

Sau full reference, **thêm section "🎯 Em đề xuất cho anh/chị bây giờ"** dựa trên state:

```
🎯 Em đề xuất cho anh/chị bây giờ
─────────────────────────────────

State của anh/chị: {detected state}
```

#### State: Fresh (BUSINESS.md chưa fill)
```
"Anh/chị chưa onboarding. Em đề xuất:
→ Gõ `/start` để em hướng dẫn setup (~25 phút)"
```

#### State: Partial (BUSINESS filled, Portal chưa)
```
"Anh/chị đã onboarding business, nhưng chưa setup Customer Portal.
Portal cần cho payment auto + email delivery + CRM.

→ Gõ `/coach setup-crm` để em setup giúp (~15 phút)
Hoặc skip Portal nếu chưa cần payment: `/coach plan` để bắt đầu plan"
```

#### State: Setup done, no active plan
```
"Anh/chị đã setup đủ. Tiếp theo cần mục tiêu cụ thể.

→ Gõ `/coach plan '<mục tiêu>'` để em tạo plan
Examples:
- /coach plan "bán khoá pottery 2tr"
- /coach plan "thu lead 1000 email trong 1 tháng"
- /coach plan "đặt 30 lịch tư vấn tuần này"

Hoặc đi thẳng vào worker: /offer, /brand, /funnel, /content, /ads"
```

#### State: Active plan in progress
```
"Anh/chị đang plan '<tên plan>'. Progress: Bước {N}/{M}.

→ Gõ `/coach next` để continue bước tiếp
Hoặc xem chi tiết: `/coach status`"
```

#### State: Plan done, mature user (đã có output từ nhiều agents)
```
"Anh/chị đã build {X funnel + Y content + Z ads}. Tiếp theo nên optimize hoặc scale.

→ Tối ưu: `/analyze optimize` — em diagnose top 3 actions
→ Scale: `/coach affiliate` setup CTV
→ Hoặc plan mới: `/coach plan 'scale lên ...'`"
```

### Bước 4: Handle args

#### `/kit-help` (trống) → Show full + state-based suggest

#### `/kit-help stuck`
```
"Anh/chị đang stuck ở giai đoạn nào?
(1) Em chưa biết bán gì → /offer research
(2) Có offer rồi nhưng chưa có trang → /funnel sales
(3) Có funnel nhưng không có traffic → /ads + /content
(4) Có traffic nhưng ít đơn → /analyze funnel
(5) Đang bán nhưng muốn scale → /coach affiliate

Chọn số → em hướng dẫn lệnh cụ thể."
```

#### `/kit-help roadmap`
→ Show full Learning Roadmap (Day 1 → Month 2+)

#### `/kit-help next`
→ Aliased với `/coach next` — show bước tiếp trong active plan

---

## Output

Không tạo file output — `/kit-help` là reference, không persist.
