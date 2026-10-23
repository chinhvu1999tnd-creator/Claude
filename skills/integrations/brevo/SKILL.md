---
name: brevo
description: "Brevo-specific docs: sequence setup guide, Brevo UI walkthrough, list/attribute config. Xem skills/integrations/email/ để dùng email transport layer provider-agnostic."
version: 2.1.0
agent: funnel, deliver
tags: [email, brevo, marketing, automation, sequence, integration]
superseded_by: skills/integrations/email/
---

# Brevo Integration

> **⚠️ Xem `skills/integrations/email/SKILL.md` cho transport layer mới.**
> File này giữ Brevo-specific docs: sequence setup guide, list config, UI walkthrough.
> Code trong webhooks nên dùng `require('./email')` thay vì `require('./brevo')`.

**Vai trò của Brevo trong hệ thống:**
Brevo là **marketing email layer** — xử lý toàn bộ sequence tự động (nurture, onboarding, re-engagement, upsell, renewal). **Không thay thế** Resend/Customer Portal trong việc gửi thông tin đăng nhập.

---

## Phân công email rõ ràng

| | Resend (Customer Portal) | Brevo |
|---|---|---|
| Magic link đăng nhập | ✅ | ❌ |
| Thông tin tài khoản | ✅ | ❌ |
| Reset password | ✅ | ❌ |
| Email giao hàng (Scenario B) | ❌ | ✅ |
| Lead nurture sequence | ❌ | ✅ |
| Onboarding marketing | ❌ | ✅ |
| Re-engagement | ❌ | ✅ |
| Upsell / Renewal | ❌ | ✅ |

---

## 2 Scenarios

### Scenario A — Có deploy Customer Portal

```
Lead opt-in (funnel)
    → POST /api/capture-lead (Customer Portal)
    → brevo.enrollLead()  ← Brevo "Leads" list → lead-nurture sequence

Thanh toán SePay
    → POST /api/webhook-sepay (Customer Portal)
    → Portal tạo Supabase account
    → Resend gửi magic link  ← thông tin đăng nhập
    → brevo.enrollCustomer() ← Brevo "Customers" list → onboarding sequence
```

**Env cần có:**
```env
CUSTOMER_PORTAL_URL=https://your-portal.vercel.app
CUSTOMER_PORTAL_WEBHOOK_SECRET=xxx
BREVO_API_KEY=xkeysib-xxx
BREVO_SENDER_EMAIL=hello@domain.com
BREVO_SENDER_NAME=Tên của bạn
```

### Scenario B — Không có Customer Portal

```
Thanh toán SePay
    → POST /api/webhook.js (funnel trực tiếp)
    → brevo.sendDeliveryEmail()  ← gửi link sản phẩm (GitHub/Drive/...)
    → brevo.enrollCustomer()     ← Brevo "Customers" list → onboarding sequence
```

**Env cần có:**
```env
BREVO_API_KEY=xkeysib-xxx
BREVO_SENDER_EMAIL=hello@domain.com
BREVO_SENDER_NAME=Tên của bạn
PRODUCT_NAME=Tên sản phẩm
ACCESS_LINK=https://link-san-pham
# CUSTOMER_PORTAL_URL để trống
```

---

## Setup — 3 Bước

### Bước 1 — Tài khoản + API key (2 phút)

```
1. Vào brevo.com → Sign up (free: 300 email/ngày)
2. Settings → API Keys → Generate a new API key
3. Thêm vào .env:
   BREVO_API_KEY=xkeysib-...
   BREVO_SENDER_EMAIL=email@domain.com
   BREVO_SENDER_NAME=Tên thật của bạn
```

### Bước 2 — Chạy setup script (30 giây)

```bash
node skills/integrations/brevo/scripts/setup-brevo.js
```

Tự động:
- ✅ Verify API key
- ✅ Tạo 3 contact lists: Leads / Customers / Re-engagement
- ✅ Tạo contact attributes: FIRSTNAME, PRODUCT, PURCHASE_DATE, SOURCE
- ✅ Detect scenario (CUSTOMER_PORTAL_URL có hay không)
- ✅ Generate `api/brevo.js` phù hợp với scenario
- ✅ Gửi test email verify
- ✅ Print patch instructions cho webhook

### Bước 3 — Setup sequences trong Brevo UI (30 phút)

Làm theo `sequence-setup-guide.md`.
Copy email từ `templates/email-copy.md`.

---

## Brevo Lists & Sequences

| List | Trigger | Sequence |
|------|---------|----------|
| **Leads** | `enrollLead()` — sau opt-in | Lead nurture (5 emails, 7 ngày) |
| **Customers** | `enrollCustomer()` — sau payment | Onboarding (7 emails, 10 ngày) |
| **Re-engagement** | Manual hoặc script | Re-engagement (3 emails, 7 ngày) |
| **Abandoned Cart** | `enrollAbandoned()` — order pending 30 phút | Recovery (3 emails, 48h) · Stop khi payment confirmed |

---

## brevo.js API

File được `setup-brevo.js` generate tại `api/brevo.js`:

```js
// Scenario A + B: thêm lead sau opt-in
enrollLead({ email, name, source })

// Scenario B only: gửi transactional email giao hàng
// Caller load HTML template, replace variables, rồi truyền htmlContent vào
// Template: skills/deliver/delivery-automation/templates/delivery-email.html
sendEmail({ email, name, subject, htmlContent })

// Scenario A + B: enroll customer sau payment
enrollCustomer({ email, name, product, purchaseDate, funnelSlug })

// Funnel: enroll abandoned cart sau 30 phút order chưa thanh toán
// Stop condition: contact mua hàng → Brevo Automation stop khi added to "Customers"
enrollAbandoned({ email, name, product, amount, orderId, checkoutLink })

// Cập nhật attribute của contact
updateContact({ email, attributes })
```

---

## Integration Points

### Funnel — leads-funnel (capture-lead)

Trong `api/capture-lead.js` hoặc landing page POST handler:

```js
const { enrollLead } = require('./email'); // provider-agnostic — không require('./brevo') trực tiếp

// Sau khi lưu lead vào Customer Portal (hoặc Google Sheets):
if (process.env.BREVO_API_KEY) {
  await enrollLead({
    email: req.body.email,
    name:  req.body.name || '',
    source: req.body.source || 'landing-page',
  });
}
```

### Funnel — sales-page (webhook-sepay)

**Scenario A** — patch `/api/webhook-sepay` trong Customer Portal:

```js
const { enrollCustomer } = require('./email');

// Sau khi Portal đã tạo account (cuối webhook handler):
if (process.env.BREVO_API_KEY) {
  await enrollCustomer({
    email: customerEmail,
    name:  customerName,
    product: productName,
    purchaseDate: new Date().toLocaleDateString('vi-VN'),
    funnelSlug: funnelSlug,
  });
}
```

**Scenario B** — trong `api/webhook.js` funnel trực tiếp:

```js
const fs = require('fs');
const path = require('path');
const { sendEmail, enrollCustomer } = require('./email');

// Load template (owner: skills/deliver/delivery-automation/templates/delivery-email.html)
// Copy file này vào api/ khi setup
const tpl = fs.readFileSync(path.join(__dirname, 'delivery-email.html'), 'utf8');
const html = tpl
  .replace(/\{\{NAME\}\}/g,  name)
  .replace(/\{\{PRODUCT\}\}/g, product)
  .replace(/\{\{ACCESS_LINK\}\}/g, accessLink)
  .replace(/\{\{PURCHASE_DATE\}\}/g, purchaseDate);

await Promise.all([
  sendEmail({ email, name, subject: `✅ Link truy cập ${product}`, htmlContent: html }),
  enrollCustomer({ email, name, product, purchaseDate, funnelSlug }),
]);
```

---

## Checklist

- [ ] `BREVO_API_KEY` trong `.env`
- [ ] `setup-brevo.js` đã chạy thành công
- [ ] 3 lists đã tạo trong Brevo: Leads / Customers / Re-engagement
- [ ] `api/brevo.js` đã generated
- [ ] Test email nhận được trong inbox
- [ ] Webhook đã patch (đúng scenario)
- [ ] Brevo Automations: ít nhất Onboarding sequence đã active
- [ ] Test end-to-end: lead → email → customer → email

---

## Troubleshooting

| Vấn đề | Fix |
|--------|-----|
| Email vào spam | Verify sender domain trong Brevo → Settings → Senders |
| API key invalid | Kiểm tra `.env` — không có space, không có quotes |
| enrollCustomer không trigger sequence | Kiểm tra List ID trong Brevo Automations trigger khớp với `BREVO_LIST_ID_CUSTOMERS` |
| Scenario detect sai | Kiểm tra `CUSTOMER_PORTAL_URL` trong `.env` |
| `@getbrevo/brevo` not found | Chạy `npm install @getbrevo/brevo` trong thư mục funnel |
