---
description: Funnel Agent — xây phễu hoàn chỉnh từ ý tưởng đến live. Hỗ trợ mọi loại funnel.
argument-hint: [ý định tự nhiên] VD: "xây phễu lead với ý tưởng X" | "làm sales page khóa Y" | "deploy lên vercel"
agent: sale-funnel
---

<args>$ARGUMENTS</args>

## Tier Availability Check (CHẠY TRƯỚC TIÊN)

Trước khi load skill cho sub-action đã detect, verify skill tồn tại:
- Check folder: `skills/funnel/{type}-funnel/` (vd: `skills/funnel/webinar-funnel/`)
- Nếu KHÔNG tồn tại → đây là tier không hỗ trợ sub-action này. Respond:

```
"[Type] Funnel không có trong tier hiện tại (có trong gói PRO/ALL).
 Em đề xuất alternative trong BASIC:
 - 'webinar' → /funnel booking (1-1 consult) hoặc /funnel leads (mass enrollment + email)
 - 'challenge' → /funnel leads + Post Content Agent (5-7 bài content series)
 - 'vsl' → /funnel sales + Simple Reels Agent (video embed trong sales page)
 Anh/chị muốn em route sang option nào?"
```

→ KHÔNG tiếp tục load skill nếu folder không tồn tại.

## Intent Detection

Đọc <args> — không cần đúng cú pháp, hiểu ý định tự nhiên:

| Tín hiệu | Funnel type |
|----------|------------|
| "lead", "opt-in", "danh sách", "thu email", "thu contact", "phễu lead", "lead magnet", "free", "miễn phí" | → **leads** |
| "sales page", "bán hàng", "bán khóa", "landing page bán", "trang bán", "checkout", "order" | → **sales-page** |
| "webinar", "hội thảo", "workshop online", "live training", "buổi học online" | → **webinar** |
| "booking", "đặt lịch", "tư vấn", "book call", "lịch hẹn", "application", "apply" | → **booking** |
| "challenge", "thử thách", "5 ngày", "3 ngày", "7 ngày", "challenge funnel", "multi-day" | → **challenge** |
| "deploy", "đăng lên", "vercel", "live", "sepay", "thanh toán", "telegram bot", "go live" | → **deploy** |
| Không rõ | → Hỏi 1 câu: "Anh/chị muốn build loại funnel nào? leads / sales page / webinar / booking / challenge / deploy" |

---

## Execution Mode

**Mặc định: Step-by-Step** — không build one-shot trừ khi args có từ `automode`.

```
STEP 1 → Thu thập input (hỏi nếu thiếu)
STEP 2 → Viết copy từng trang → CHỜ DUYỆT từng trang
STEP 3 → Build HTML từng trang → CHỜ DUYỆT từng trang
```

Nếu args chứa "automode" → bỏ qua checkpoint, build toàn bộ một lần.

---

## Execution

**Trước tất cả:** Đọc `BUSINESS.md` và `THEME.md`. Nếu chưa điền → nhắc `/setup` trước.

**Brand reference:** Kiểm tra `output/design/` — nếu có subfolder → đọc `design-system.html` làm visual reference khi build HTML (màu sắc, font, component style chính xác). Nếu chưa có → dùng THEME.md và gợi ý chạy `/brand` sau khi hoàn tất funnel.

### leads — Lead Generation Funnel
1. Load `agents/leads-funnel/agent.md`
2. Load `skills/funnel/leads-funnel/SKILL.md` — full workflow: lead magnet → opt-in page → thank-you page → email sequence
3. Extract topic/ý tưởng từ args
4. Output: Lead magnet HTML + PDF conversion command + opt-in page + thank-you page + 7-email sequence

### sales-page — Sales Page Funnel
1. Load `agents/sale-funnel/agent.md`
2. Load designer skill (4 files trên)
3. Load `skills/funnel/sales-page-funnel/SKILL.md`
4. Extract tên sản phẩm/offer từ args
5. Output: Sales page đầy đủ + order form + upsell + thank you page

### webinar — Webinar Funnel (PRO/ALL only)
→ Refuse + suggest alternative theo Tier Availability Check ở đầu file.

### booking — Booking Call Funnel
1. Load `agents/booking-funnel/agent.md`
2. Load `skills/funnel/booking-call-funnel/SKILL.md`
3. Extract offer/dịch vụ từ args
4. Output: Application page + calendar setup + pre-call sequence + call script

### challenge — Challenge Funnel (PRO/ALL only)
→ Refuse + suggest alternative theo Tier Availability Check ở đầu file.

### deploy — Technical Deployment
1. Load skill `skills/funnel/deploy/SKILL.md` (không cần agent riêng — đây là utility step)
2. Đọc `THEME.md` → inject CSS vars vào HTML theo `skills/funnel/page-designer/SKILL.md` Bước 1
3. Output: Vercel deploy steps + SePay VietQR embed + Telegram bot setup + test checklist

---

## Ví Dụ Hoạt Động

```
/funnel xây phễu lead với ý tưởng dạy TikTok Ads cho chủ shop
→ leads | topic = "TikTok Ads cho chủ shop"

/funnel làm sales page cho khóa học Facebook Ads giá 1.997.000đ
→ sales-page | product = "khóa Facebook Ads, 1.997.000đ"

/funnel tôi cần hội thảo online về automation cho SME
→ webinar | topic = "automation cho SME"

/funnel book call tư vấn chiến lược marketing 1-1
→ booking | offer = "tư vấn chiến lược marketing 1-1"

/funnel xây challenge 5 ngày về AI Agent cho marketer
→ challenge | topic = "AI Agent cho marketer" | duration = 5 ngày | default (no VIP)

/funnel challenge 5 ngày về copywriting thêm VIP upsell sau đăng ký
→ challenge | topic = "copywriting" | duration = 5 ngày | VIP upsell = true

/funnel deploy funnel lên vercel và kết nối SePay
→ deploy
```

---

## Dual Mode

**In-Kit:** Đọc BUSINESS.md + THEME.md có sẵn — không hỏi lại thông tin đã có.

**Standalone (BUSINESS.md chưa điền):** Hỏi 3 câu nhanh:
1. Offer/ý tưởng cụ thể là gì?
2. Target audience là ai?
3. Mục tiêu funnel: thu lead / bán hàng / tư vấn?

---

## Output — Scaffold Bắt Buộc

Sau khi tạo nội dung, **dùng Write tool scaffold đúng cấu trúc này**:

### Leads Funnel
```
output/funnel/leads/[funnel-slug]/
├── index.html              ← opt-in page
├── thank-you/
│   └── index.html          ← thank you page
├── assets/
│   └── lead-magnet.html    ← lead magnet (in ra PDF)
├── vercel.json
└── funnel.json             ← manifest: status, form_id, checklist
```

### Sales Page Funnel
```
output/funnel/sales/[funnel-slug]/
├── index.html              ← sales page
├── order/
│   └── index.html          ← order form + VietQR
├── upsell/
│   └── index.html          ← upsell offer (optional)
├── thank-you/
│   └── index.html
├── assets/
├── vercel.json
└── funnel.json
```

### Webinar / Booking
```
output/funnel/[type]/[funnel-slug]/
├── [entry-page]/index.html ← register / apply
├── thank-you/index.html
├── assets/
├── vercel.json
└── funnel.json
```

### Wiring bắt buộc
- Form `action` → `https://formspree.io/f/[ID]`
- Hidden field `_next` → `https://[domain]/thank-you/`
- Thank-you download link → `../assets/lead-magnet.html`
- `funnel.json` checklist điền đúng status

**Tên slug:** lowercase, dấu gạch ngang, không dấu. VD: `claude-ai-blueprint`, `fb-ads-course-997k`

---

## Email Sequence Setup — Sau Khi Build HTML Xong

Sau khi scaffold funnel files, chạy lệnh này để tự động setup Brevo:

```bash
# Leads funnel:
node skills/integrations/email/scripts/setup-funnel-email.js --type leads --slug [slug]

# Sales funnel (onboarding sequence):
node skills/integrations/email/scripts/setup-funnel-email.js --type sales --slug [slug]

# Abandoned cart (thêm sau khi có order form):
node skills/integrations/email/scripts/setup-funnel-email.js --type abandoned --slug [slug]
```

Script tự động:
- ✅ Tạo Brevo list riêng cho funnel: `"Leads — [slug]"`
- ✅ Parse email sequence từ markdown files
- ✅ Tạo Brevo email templates với content đầy đủ
- ✅ Ghi list ID + template IDs vào `funnel.json`
- ✅ Print hướng dẫn setup Brevo Automation (1 lần click, ~5 phút)

**Điều kiện:** `BREVO_API_KEY` đã có trong `.env`. Nếu chưa → chạy `setup-email.js` trước.

### funnel.json — Email section (auto-filled)

```json
{
  "email": {
    "provider": "brevo",
    "lists": {
      "leads": { "id": 123, "name": "Leads — [slug]" }
    },
    "templates": {
      "leads": [
        { "id": 456, "name": "[slug] Leads Email 1 — Ngay lập tức", "timing_label": "Gửi ngay (delay = 0)" },
        { "id": 457, "name": "[slug] Leads Email 2 — Ngày 2",        "timing_label": "Sau 2 ngày" }
      ]
    }
  },
  "checklist": {
    "brevo_leads_list":       true,
    "brevo_leads_templates":  true,
    "brevo_leads_automation": false
  }
}
```
