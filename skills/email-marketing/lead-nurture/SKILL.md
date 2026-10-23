---
name: lead-nurture
description: "Chuỗi email 5 bài sau opt-in — warm lead từ vừa đăng ký đến sẵn sàng mua trong 7 ngày. Content template: email-lead-nurture.md. Transport: integrations/email/email.js. Trigger: enrollLead(). Moved from funnel/leads-funnel/references/."
version: 2.0.0
agent: email-marketing
tags: [lead-nurture, email, sequence, opt-in, funnel]
---

# Lead Nurture Skill

**Mục tiêu:** Warm up lead từ "vừa để email" → sẵn sàng mua trong 7 ngày.  
**Trigger:** `enrollLead()` → Brevo "Leads — [slug]" list → Automation fires.  
**Setup:** `node skills/integrations/email/scripts/setup-funnel-email.js --type leads --slug [slug]`

---

## Sequence Structure

5 emails · 7 ngày · Progressive nurture (không pitch ở email 1-3):

| Email | Timing | Mục tiêu |
|-------|--------|----------|
| 1 | Ngay lập tức | Giao lead magnet + welcome |
| 2 | Ngày 2 | Insight có giá trị, không pitch |
| 3 | Ngày 4 | Story + shift nhận thức |
| 4 | Ngày 5 | Solution reveal + soft CTA |
| 5 | Ngày 7 | Direct offer |

**Stop condition:** Lead mua sản phẩm → tự động chuyển sang "Customers" list → onboarding sequence.

---

## Content Template

Xem và chỉnh sửa nội dung: **`email-lead-nurture.md`** (cùng thư mục này).

Tất cả `[...]` placeholders phải điền trước khi chạy `setup-funnel-email.js`.

---

## Integration — Trong leads-funnel

```js
const { enrollLead } = require('./email');

// Trong api/capture-lead.js — sau khi save lead vào CRM:
if (process.env.EMAIL_PROVIDER) {
  await enrollLead({
    email:  req.body.email,
    name:   req.body.name || '',
    source: '[funnel-slug]',
  }).catch(err => console.error('[enrollLead]', err.message));
}
```

---

## Personalization Variables

| Variable | Brevo syntax | Nguồn |
|----------|-------------|-------|
| Tên lead | `{{ contact.FIRSTNAME }}` | `enrollLead({ name })` |
| Nguồn lead | `{{ contact.SOURCE }}` | `enrollLead({ source })` |

---

## Xưng hô trong email copy

**"bạn"** với người đọc · **"tôi"** khi sender tự xưng · KHÔNG dùng anh/chị.
