# Brevo Automations — Setup Guide

> Làm 1 lần, chạy mãi mãi. Ước tính: 30–45 phút cho Onboarding sequence đầu tiên.

---

## Trước khi bắt đầu

Đảm bảo đã chạy `setup-brevo.js` thành công:
- ✅ Contact list "Customers" đã tạo
- ✅ Attributes: FIRSTNAME, PRODUCT, PURCHASE_DATE, FUNNEL_SLUG

---

## Tổng quan — Brevo Automations

```
Brevo Dashboard
  → Automations (menu trái)
    → Create an automation
      → Chọn trigger
      → Add steps (email, wait, condition, tag)
      → Activate
```

Mỗi sequence = 1 Automation. Copy email từ `templates/email-copy.md`.

---

## Automation 1 — Onboarding (Bắt đầu từ đây)

### Bước 1 — Tạo automation mới

```
Automations → Create an automation → Start from scratch
Name: "Onboarding — [Tên sản phẩm]"
```

### Bước 2 — Chọn Trigger

```
Trigger: "A contact is added to a list"
Select list: "Customers"
```

> Mỗi khi `enrollContact()` được gọi từ webhook → Brevo tự kích hoạt automation này.

### Bước 3 — Add steps

Bấm **"+"** sau trigger để thêm từng bước:

```
[Trigger] Contact added to "Customers"
    ↓
[Send email] Email 1 — Welcome (gửi ngay, delay = 0)
    ↓
[Wait] 1 day
    ↓
[Send email] Email 2 — Quick win
    ↓
[Wait] 1 day
    ↓
[Send email] Email 3 — Community
    ↓
[Wait] 2 days
    ↓
[Send email] Email 4 — Nghi ngờ
    ↓
[Wait] 1 day
    ↓
[Send email] Email 5 — Insider tip
    ↓
[Wait] 2 days
    ↓
[Send email] Email 6 — Celebrate
    ↓
[Wait] 3 days
    ↓
[Send email] Email 7 — Testimonial request
    ↓
[Add tag] "onboarding-complete"
```

### Bước 4 — Tạo từng email

Với mỗi **"Send email"** step:

```
1. Click "Send email"
2. Create new email → chọn "Design email"
3. Dùng "Rich text" editor (đơn giản nhất)
4. Paste subject từ email-copy.md
5. Paste body từ email-copy.md
6. Thay [TÊN BẠN] bằng tên thật
7. Thêm personalization: click "+" → chọn FIRSTNAME
   → hiện thành {{ contact.FIRSTNAME }} trong Brevo
8. Save email
```

**Personalization variables trong Brevo:**
```
{{ contact.FIRSTNAME }}    → tên khách hàng
{{ contact.PRODUCT }}      → tên sản phẩm
{{ contact.PURCHASE_DATE}} → ngày mua
```

### Bước 5 — Activate

```
Góc trên phải → Toggle "Active"
Confirm → Done
```

---

## Automation 2 — Re-engagement

### Trigger options (chọn 1)

**Option A — Dựa trên thời gian không mở email:**
```
Trigger: "No email opened"
Duration: 30 days after joining list
```
*Brevo Business plan trở lên*

**Option B — Đơn giản hơn, free plan:**
```
Trigger: "A contact attribute is updated"
Condition: FUNNEL_SLUG = [slug của funnel]
Wait until: 30 days after PURCHASE_DATE
```

**Option C — Manual (dễ nhất):**
Export contacts không active mỗi tháng → Import vào list "Re-engagement" → Automation trigger từ list đó.

### Steps

```
[Trigger]
    ↓
[Send email] Email 1 — Check-in
    ↓
[Wait] 2 days
    ↓
[Send email] Email 2 — Reframe
    ↓
[Wait] 4 days
    ↓
[Send email] Email 3 — Lời đề nghị cuối
    ↓
[Add tag] "re-engagement-complete"
```

---

## Automation 3 — Referral

### Trigger

```
Trigger: "A contact gets a tag"
Tag: "milestone-1"   ← set tag này trong webhook.js khi user đạt milestone
```

Hoặc manual: sau khi nhận được testimonial từ Email 7, tự thêm tag "milestone-1" cho contact đó.

### Steps

```
[Trigger] Tag "milestone-1" added
    ↓
[Wait] 1 day  (để họ digest milestone trước)
    ↓
[Send email] Email 1 — Plant seed
    ↓
[Wait] 4 days
    ↓
[Send email] Email 2 — Referral CTA
    ↓
[Add tag] "referral-sent"
```

---

## Automation 4 — Renewal

### Trigger

```
Trigger: "A specific date"
Date: {{ contact.EXPIRY_DATE }} - 30 days
```

*Cần thêm attribute EXPIRY_DATE vào contact khi enroll.*

Hoặc đơn giản hơn: chạy manual campaign 30/14/2 ngày trước ngày renewal.

### Steps

```
[Trigger] 30 days before EXPIRY_DATE
    ↓
[Send email] Email 1 — Nhắc nhở
    ↓
[Wait] 6 days (Day 7)
    ↓
[Send email] Email 2 — Value reminder
    ↓
[Wait] 5 days (Day 12)
    ↓
[Condition] Did contact renew? (check tag "renewed")
  → YES: [End]
  → NO:  [Send email] Email 3 — Urgency
         [Wait] 2 days
         [Send email] Email 4 — Last call
```

---

## Tips Để Email Không Vào Spam

### 1. Verify sender domain (quan trọng nhất)

```
Brevo → Settings → Senders & IP → Domains
→ Add a domain → Làm theo DNS instructions
```

Nếu dùng domain riêng (vd: hello@yourdomain.com) → verify domain = deliverability tốt hơn nhiều.

### 2. Dùng "From name" là tên người thật

```
From: "Hoàng Bá Tầu" <hello@yourdomain.com>
```
Không phải: `"AI Agent Kit" <noreply@domain.com>`

### 3. Tránh spam trigger words trong subject

❌ Tránh: "FREE", "MIỄN PHÍ HOÀN TOÀN", "CLICK NGAY", "!!!", "100% guaranteed"
✅ Dùng: câu hỏi, tên người, số cụ thể, kết quả thật

### 4. Text-to-image ratio

Email nhiều text > nhiều hình ảnh về mặt deliverability. Brevo rich text editor = tốt.

### 5. Test trước khi activate

```
Trong email editor → Send test email → Gửi về Gmail của bạn
Check: inbox hay spam? Hiển thị đúng không?
```

---

## Stop Conditions — Quan Trọng

Tránh gửi email chồng chéo cho cùng 1 người:

| Nếu contact... | Thì stop... |
|----------------|-------------|
| Mua upsell | Upsell sequence |
| Gia hạn | Renewal sequence |
| Unsubscribe | Tất cả sequences |
| Tag "re-engagement-complete" | Re-engagement sequence |

**Cách setup stop condition trong Brevo:**
```
Trong automation → Add exit condition
→ "Contact gets a specific tag" → [tag tương ứng]
```

---

## Checklist Sau Setup

- [ ] Automation 1 (Onboarding) đã Active
- [ ] Test email gửi từng bước nhận được đúng
- [ ] Personalization {{ contact.FIRSTNAME }} hiển thị đúng
- [ ] From name là tên thật, không phải brand
- [ ] Domain đã verify (nếu có domain riêng)
- [ ] Stop conditions đã cấu hình
- [ ] Unsubscribe link có trong mọi email (Brevo tự thêm — kiểm tra)
