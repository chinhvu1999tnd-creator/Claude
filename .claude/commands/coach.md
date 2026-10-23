---
description: Re-invoke Coach Agent giữa chừng — tạo plan mới, continue plan đang dở, hoặc re-setup integration
argument-hint: [sub-command] VD: "plan muốn bán X" / "next" / "setup-crm" / "crm"
agent: coach
---

<args>$ARGUMENTS</args>

## Vai trò

Command thứ 2 (sau `/start`) để user gọi Coach Agent **giữa chừng**, khi đã có BUSINESS.md + Portal nhưng cần:
- Tạo plan mới cho mục tiêu khác
- Continue plan đang dở
- Re-run setup integration
- Hỏi "tiếp theo làm gì"

## Intent Detection

Đọc `<args>` và route:

| Args content | Sub-action |
|--------------|-----------|
| trống (chỉ `/coach`) | Status check + đề xuất next action |
| `plan ...` hoặc `plan "muốn ..."` | Tạo plan mới |
| `next` hoặc `tiếp theo` | Continue plan đang active |
| `setup-crm` hoặc `setup crm` | Re-run setup Customer Portal |
| `crm` hoặc `affiliate` | Open CRM & Affiliate Agent setup flow |
| `sepay` | Re-run SePay webhook config |
| `status` hoặc `progress` | Show progress overview |
| `onboarding` hoặc `reset` | Re-do BUSINESS.md intake |

## Execution Flow

### Case 1: `/coach` (trống)

```
1. Đọc BUSINESS.md, THEME.md, .env, output/coach/active-plan.md
2. Tổng hợp status:
   ```
   📊 Status hiện tại:
   - BUSINESS.md: ✓ filled
   - Customer Portal: ✓ deployed (https://...)
   - Active plan: "Bán khoá pottery 2tr"
     Progress: Bước 3/8 (Sale Funnel) - chưa xong
   - Output có:
     ✓ Offer package
     ✓ Brand book
     ✗ Sales page (đang dở)
   ```
3. Đề xuất:
   ```
   Em đề xuất tiếp theo:
   (A) Continue Bước 3 (Sale Funnel) — chạy /coach next
   (B) Tạo plan khác — chạy /coach plan "[mục tiêu]"
   (C) Re-setup integration nào đó
   (D) Khác — anh/chị mô tả
   ```
```

### Case 2: `/coach plan "muốn bán khoá học X"`

```
1. Load skills/coach/plan-generator/SKILL.md
2. Đọc BUSINESS.md → lấy context (sản phẩm hiện tại, giá, audience)
3. Match args với 4 plan templates:
   - "bán X" → Sales Funnel template
   - "thu lead Y" → Leads Funnel template
   - "đặt lịch" → Booking Funnel template
   - "content / brand" → Content Plan template
   - Khác → generate from scratch
4. Output plan bảng + hỏi user approve
5. User approve → save active-plan.md → invoke checkpoint flow Bước 1
```

### Case 3: `/coach next`

```
1. Đọc output/coach/active-plan.md
2. Tìm bước đầu tiên status = "in-progress" hoặc "pending"
3. Show: "Bước tiếp theo là [X]: [Agent] — [job]. Em chạy giờ nhé?"
4. Y: Load skills/coach/checkpoint/SKILL.md → execute step
5. N: "OK, lúc nào sẵn sàng /coach next lại nhé."
```

Nếu không có active-plan:
```
Coach: "Em không thấy plan đang active. Anh/chị muốn:
        (A) Tạo plan mới — /coach plan '[mục tiêu]'
        (B) Khôi phục plan cũ trong output/coach/?"
```

### Case 4: `/coach setup-crm`

```
1. Load skills/setup/crm-portal/SKILL.md
2. Detect state:
   - .env có CUSTOMER_PORTAL_URL chưa?
   - apps/customer-portal/.env.local đã có chưa?
3. Branch:
   - Chưa setup: full 7-step flow
   - Đã setup: hỏi "Anh/chị muốn (A) Re-setup từ đầu, (B) Update env var, (C) Chỉ verify status?"
```

### Case 5: `/coach crm` (CRM & Affiliate setup)

```
1. Detect Portal đã setup chưa
   - Chưa: gợi ý /coach setup-crm trước
2. Load skills/funnel/crm-connect/SKILL.md + skills/funnel/affiliate-integration/SKILL.md
3. Walk through:
   - Wire CRM to Portal API
   - Setup affiliate commission rate
   - Generate affiliate landing pages
   - Output: setup-crm-affiliate-{date}.md
```

### Case 6: `/coach sepay`

```
1. Load skills/setup/sepay/SKILL.md
2. Check webhook đã active chưa (query webhook_logs table)
3. Branch:
   - Chưa active: full SePay configure flow
   - Active nhưng có issue: load references/troubleshooting.md
   - Verify only: show last 5 webhook logs
```

### Case 7: `/coach status`

```
Show progress overview:

📊 Kit Status

Business Setup:
  - BUSINESS.md: ✓ (8/8 fields filled)
  - THEME.md: ✓ (5/5 fields)

Integrations:
  - Customer Portal: ✓ https://...
  - Supabase: ✓ project provisioned
  - Vercel: ✓ deployed
  - Resend: ✓ API key active
  - SePay: ✓ webhook active

Output created (last 7 days):
  - Offer packages: 1
  - Brand books: 1
  - Sales pages: 1 (deployed)
  - Posts: 5
  - Reels: 0
  - Ad copies: 0

Active plan: "Bán khoá pottery 2tr"
  - Progress: 3/8 steps complete
  - Next: Bước 4 — Post Content Agent (5 posts)

Suggested next: /coach next
```

### Case 8: `/coach onboarding` (reset)

```
Coach: "Anh/chị muốn re-do onboarding?
        ⚠️ Việc này sẽ overwrite BUSINESS.md và THEME.md.
        Em sẽ backup vào output/coach/business-backup-{date}.md trước.
        Continue? (Y/N)"
```

Y: Backup → Load onboarding/SKILL.md → run 8+5 câu intake.

## Sub-commands ngoài routing tự nhiên

Coach Agent (qua `agents/coach/agent.md`) cũng handle:
- `/coach update business` — Update vài field trong BUSINESS.md không reset toàn bộ
- `/coach update theme` — Update THEME.md
- `/coach help` — Show available sub-commands

## Edge Cases

### User gõ `/coach` khi chưa từng `/start`
```
Coach: "Em thấy anh/chị chưa onboarding (BUSINESS.md còn trống).
        Anh/chị gõ /start để em hỏi business info trước nhé."
```

### Plan archive — xem plan cũ
```
/coach plan list
  → List file output/coach/plan-*.md
  → User chọn 1 để review
```
