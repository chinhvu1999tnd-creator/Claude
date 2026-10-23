---
name: email
description: "Provider-agnostic email transport layer. Skills và webhooks dùng email.js — không import provider trực tiếp. Switch provider bằng EMAIL_PROVIDER trong .env (brevo | resend)."
version: 1.0.0
agent: funnel, deliver
tags: [email, transport, brevo, resend, automation, sequences, integration]
replaces: integrations/brevo
---

# Email Integration — Provider-Agnostic Layer

**Triết lý:** Skills không biết email được gửi bằng gì. Chỉ biết interface: `enrollLead()`, `enrollCustomer()`, `enrollAbandoned()`, `sendEmail()`. Provider là chi tiết cấu hình, không phải chi tiết code.

---

## File Structure

```
skills/integrations/email/
├── email.js                  ← Unified interface (skills chỉ import file này)
├── providers/
│   ├── brevo.js              ← Brevo implementation (sequences + transactional)
│   └── resend.js             ← Resend implementation (transactional only)
└── scripts/
    └── setup-email.js        ← Provider-aware setup script
```

---

## Provider Comparison

| Capability | Brevo | Resend |
|-----------|-------|--------|
| `sendEmail()` — one-off transactional | ✅ | ✅ |
| `enrollLead()` — drip sequence 5 emails | ✅ Automation | ⚠️ Email 1 only |
| `enrollCustomer()` — onboarding 7 emails | ✅ Automation | ⚠️ Email 1 only |
| `enrollAbandoned()` — recovery 3 emails | ✅ Automation | ⚠️ Email 1 only |
| `updateContact()` — attribute management | ✅ | ❌ |
| Free tier | 300 emails/ngày | 3000 emails/tháng |
| Phù hợp cho | Full automation kit | Transactional + tự build scheduler |

**Khuyến nghị:** `EMAIL_PROVIDER=brevo` cho hầu hết use case. Brevo là provider duy nhất hỗ trợ full sequence automation miễn phí.

---

## Setup — 1 Lệnh

```bash
node skills/integrations/email/scripts/setup-email.js
```

Script tự detect `EMAIL_PROVIDER` từ `.env`:
- **brevo** → verify key, tạo 4 lists, tạo attributes, test email, ghi list IDs
- **resend** → verify key, cảnh báo về limitation sequence
- → Deploy `email.js` + provider vào funnel outputs

---

## .env Config

```env
# Provider (default: brevo)
EMAIL_PROVIDER=brevo

# Brevo credentials
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=hello@domain.com
BREVO_SENDER_NAME=Tên của bạn

# Brevo list IDs (auto-filled by setup-email.js)
BREVO_LIST_ID_LEADS=
BREVO_LIST_ID_CUSTOMERS=
BREVO_LIST_ID_REENGAGEMENT=
BREVO_LIST_ID_ABANDONED=

# Resend credentials (nếu dùng EMAIL_PROVIDER=resend)
RESEND_API_KEY=re_...
RESEND_SENDER_EMAIL=hello@domain.com
RESEND_SENDER_NAME=Tên của bạn
```

---

## Usage — Trong Webhooks

```js
// ✅ Import từ email.js — provider-agnostic
const { enrollLead, enrollCustomer, enrollAbandoned, sendEmail } = require('./email');

// ❌ Không import trực tiếp từ provider
// const { enrollLead } = require('./brevo');  ← hardcoded, cần tránh
```

### enrollLead — Sau opt-in

```js
const { enrollLead } = require('./email');

// Trong api/capture-lead.js hoặc opt-in POST handler:
if (process.env.EMAIL_PROVIDER) {
  await enrollLead({
    email:  req.body.email,
    name:   req.body.name || '',
    source: 'landing-page',
  }).catch(err => console.error('[enrollLead]', err.message));
}
```

### enrollCustomer — Sau payment (Scenario A)

```js
const { enrollCustomer } = require('./email');

// Trong Customer Portal api/webhook-sepay.js (sau khi account tạo):
await enrollCustomer({
  email:        customerEmail,
  name:         customerName,
  product:      productName,
  purchaseDate: new Date().toLocaleDateString('vi-VN'),
  funnelSlug:   funnelSlug || '',
}).catch(console.error);
```

### sendEmail — Delivery email (Scenario B)

```js
const fs = require('fs');
const path = require('path');
const { sendEmail, enrollCustomer } = require('./email');

// Load và render template
const tpl = fs.readFileSync(path.join(__dirname, 'delivery-email.html'), 'utf8');
const html = tpl
  .replace(/\{\{NAME\}\}/g,        name)
  .replace(/\{\{PRODUCT\}\}/g,     product)
  .replace(/\{\{ACCESS_LINK\}\}/g, accessLink)
  .replace(/\{\{PURCHASE_DATE\}\}/g, purchaseDate);

await Promise.all([
  sendEmail({ email, name, subject: `✅ Link truy cập ${product}`, htmlContent: html }),
  enrollCustomer({ email, name, product, purchaseDate, funnelSlug }),
]);
```

### enrollAbandoned — Order pending 30 phút

```js
const { enrollAbandoned } = require('./email');

// Sau khi phát hiện order pending (xem skills/funnel/abandoned-order/SKILL.md):
await enrollAbandoned({
  email,
  name,
  product:      process.env.PRODUCT_NAME,
  amount:       amount.toLocaleString('vi-VN'),
  orderId,
  checkoutLink: `${process.env.SITE_URL}/order/?ref=${orderId}`,
}).catch(console.error);
```

---

## Content Ownership (Không thay đổi)

Email content **không sống trong integration này** — transport layer không biết nội dung:

| Content | Owner skill |
|---------|-------------|
| Lead nurture sequence (5 emails) | `skills/email-marketing/lead-nurture/email-lead-nurture.md` |
| Onboarding sequence (7 emails) | `skills/email-marketing/email-sequence/templates/sequences.md` |
| Abandoned cart sequence (3 emails) | `skills/email-marketing/abandoned-cart/SKILL.md` |
| Delivery email template | `skills/email-marketing/delivery-automation/templates/delivery-email.html` |

---

## Delivery Scenarios

```
CUSTOMER_PORTAL_URL có trong .env?
  YES → Scenario A: Portal tạo account → Resend gửi magic link → email.enrollCustomer()
  NO  → Scenario B: email.sendEmail() giao hàng trực tiếp → email.enrollCustomer()
```

---

## Brevo Lists & Sequences (khi EMAIL_PROVIDER=brevo)

| List | Trigger function | Sequence |
|------|-----------------|---------|
| **Leads** | `enrollLead()` | Lead nurture (5 emails · 7 ngày) |
| **Customers** | `enrollCustomer()` | Onboarding (7 emails · 10 ngày) |
| **Re-engagement** | Manual hoặc script | Re-engagement (3 emails · 7 ngày) |
| **Abandoned Cart** | `enrollAbandoned()` | Recovery (3 emails · 48h) |

Brevo Automation trigger: "Contact added to list X" → send sequence.
Stop condition Abandoned Cart: contact mua hàng → added to "Customers" → stop Abandoned sequence.

---

## Switching Provider

```bash
# Chuyển từ Brevo sang Resend:
# 1. .env: EMAIL_PROVIDER=resend + RESEND_API_KEY=...
# 2. node skills/integrations/email/scripts/setup-email.js
# 3. Re-deploy funnel (Vercel sẽ pick up email.js mới)

# Code trong webhooks KHÔNG cần thay đổi gì — vẫn require('./email')
```

**Lưu ý khi chuyển sang Resend:** Brevo Automation sequences sẽ ngừng. Cần tự build scheduler nếu muốn tiếp tục gửi follow-up.

---

## Checklist

- [ ] `EMAIL_PROVIDER` trong `.env`
- [ ] `setup-email.js` đã chạy thành công
- [ ] Test email nhận được trong inbox
- [ ] Webhook đã patch: `require('./brevo')` → `require('./email')`
- [ ] Brevo Automations active (nếu dùng brevo)
- [ ] Test end-to-end: opt-in → email 1 → purchase → onboarding email 1
