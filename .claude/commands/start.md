---
description: Khởi động kit lần đầu — Coach onboarding business info + setup Customer Portal + tạo plan 30 ngày
argument-hint: (không cần args) — hoặc tuỳ ý: "muốn bán X" / "thu lead cho Y"
agent: coach
---

<args>$ARGUMENTS</args>

## Vai trò

Đây là **entry point** của toàn bộ kit. Lần đầu user mở kit → gõ `/start`. Coach Agent take it from there.

## Execution Flow

### Step 0: Detect trạng thái kit (5 giây)

Đọc parallel:
- `BUSINESS.md` — có placeholder `[Chưa điền...]` không?
- `THEME.md` — đã fill chưa?
- `.env` — có `CUSTOMER_PORTAL_URL` chưa?
- `output/coach/active-plan.md` — có plan đang chạy không?

Decide flow:

```
BUSINESS.md trống + Portal chưa setup + không có plan
  → FULL ONBOARDING (20-25 phút)

BUSINESS.md đã fill + Portal chưa setup
  → SKIP onboarding intake → SETUP PORTAL + PLAN

BUSINESS.md fill + Portal có + không có plan
  → SKIP intake + setup → tạo PLAN ngay

Có active-plan + BUSINESS.md fill + Portal có
  → "Welcome back. Em thấy anh/chị đang dở plan [X]. Continue?"
```

### Step 1: Welcome message

```
"Em chào anh/chị 👋

Em là Coach Agent — em sẽ giúp anh/chị setup kit BASIC trong ~20 phút và bắt đầu bán hàng:

📋 Em sẽ làm gì hôm nay:
  1. Hỏi 8 câu về business của anh/chị (~6 phút)
  2. Hỏi 5 câu về brand (màu, font...) (~3 phút)
  3. Setup Customer Portal — em chạy giúp (~15 phút, cần 3 token API)
  4. Tạo plan 30 ngày cụ thể cho mục tiêu của anh/chị

Anh/chị sẵn sàng chưa? (Y / chưa / có gì hỏi em)"
```

### Step 2: Load Coach onboarding skill

User confirm Y → Coach:
1. Load `agents/coach/agent.md`
2. Load `skills/coach/onboarding/SKILL.md`
3. Bắt đầu Phần A (BUSINESS.md intake, 8 câu)
4. Sau đó Phần B (THEME.md intake, 5 câu)

### Step 3: Chọn hướng bắt đầu (content-first hay setup bán hàng)

Sau onboarding, hỏi (KHÔNG ép Portal):
```
"OK em đã có business + brand. Anh/chị muốn bắt đầu từ đâu?

🎨 (A) TẠO CONTENT TRƯỚC — khuyến nghị người mới
   → Offer, bài đăng, carousel, lead magnet, ad copy, kịch bản chốt
   → KHÔNG cần setup gì, làm được NGAY

💰 (B) SETUP BÁN HÀNG — khi sẵn sàng nhận đơn
   → Customer Portal (~15 phút): nhận thanh toán + giao hàng + CRM
   → Chỉ cần khi build funnel bán hàng

Anh/chị chọn?"
```

→ A: Skip Portal → Step 4 (plan content-first, KHÔNG cần Portal)
→ B: Load `skills/setup/crm-portal/SKILL.md` → 7-step → rồi Step 4

⚠️ Content creation KHÔNG cần Portal. Chỉ Sale/Leads/Booking Funnel mới cần. Đừng ép khách setup Portal nếu họ chỉ muốn tạo content.

### Step 4: Plan Generator

```
"Mục tiêu chính của anh/chị tuần/tháng này là gì?

(1) Bán sản phẩm X (sales funnel)
(2) Thu lead cho khoá học (leads funnel)  
(3) Đặt lịch tư vấn 1-1 (booking funnel)
(4) Build content + brand trước (chưa bán)
(5) Tự định nghĩa..."
```

User chọn → Load `skills/coach/plan-generator/SKILL.md` → output plan + hỏi approve.

### Step 5: Execute Plan với Checkpoint

User approve plan → Load `skills/coach/checkpoint/SKILL.md` → bắt đầu Bước 1.

## Handle args (nếu user gõ /start với context)

### Case: `/start "muốn bán khoá học pottery 2 triệu"`
- Skip Step 1 welcome → đi thẳng vào onboarding
- Pre-fill: sản phẩm = "khoá pottery", giá = "2tr" trong BUSINESS.md
- Hỏi các câu còn lại bình thường
- Plan generator tự match template "Bán sản phẩm X"

### Case: `/start setup-only`
- Skip onboarding intake (giả định BUSINESS.md đã fill)
- Đi thẳng vào setup Portal
- Sau setup, không tạo plan (user sẽ gõ /coach plan riêng)

### Case: `/start no-portal`
- Onboarding bình thường
- Skip setup Portal step
- Tạo plan (nhưng warn các bước Funnel sẽ thiếu Portal)

## Edge cases

### User đã onboard rồi gõ /start lần 2
```
Coach: "Em thấy anh/chị đã onboarding rồi (BUSINESS.md đã có).
        Anh/chị muốn:
        (A) Re-onboarding (reset BUSINESS.md)
        (B) Re-setup Portal (nếu có thay đổi token/domain)
        (C) Tạo plan mới
        (D) Continue plan đang dở"
```

### User skip step nào đó giữa chừng
- Save state vào `output/coach/onboarding-paused.md`
- Lần sau `/start` Coach detect: "Em thấy anh/chị bỏ dở onboarding tại Câu [X]. Continue?"

## Output sau khi /start hoàn tất

- `BUSINESS.md` — fully filled
- `THEME.md` — fully filled
- `.env` — `CUSTOMER_PORTAL_URL` filled (nếu chọn A)
- `output/coach/onboarding-{date}.md` — onboarding log
- `output/coach/setup-crm-{date}.md` — setup log (nếu chọn A)
- `output/coach/active-plan.md` — plan 30 ngày sẵn sàng execute
