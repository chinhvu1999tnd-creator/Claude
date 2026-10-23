---
name: delivery-automation
description: "Tự động giao link sản phẩm sau payment (Scenario B — không có Customer Portal). Scenario A: Resend + Customer Portal lo. Moved from deliver/ → email-marketing/."
version: 2.0.0
agent: email-marketing
tags: [delivery, email, digital-product, scenario-b, webhook]
---

# Delivery Automation Skill

## When to Use
Activate after a customer completes payment. Goal: deliver the product instantly and automatically, without manual intervention.

## ⭐ DELIVERY_METHOD — Agent tự detect, không hỏi menu

Trước khi setup delivery, đọc `DELIVERY_METHOD` từ BUSINESS.md Section 8 / `.env`.

**Agent KHÔNG show menu "chọn email/telegram/zalo".** Sale Funnel Agent đã detect method từ hội thoại tự nhiên với user (xem `agents/sale-funnel/agent.md` Bước 4). Skill này chỉ ĐỌC config + thực thi.

```
DELIVERY_METHOD=email    → gửi link/file qua email khách
DELIVERY_METHOD=telegram → email confirm + Telegram invite ({DELIVERY_TELEGRAM_INVITE})
DELIVERY_METHOD=zalo     → email confirm + Zalo group ({DELIVERY_ZALO_GROUP})
DELIVERY_METHOD=hybrid   → email + Telegram/Zalo
```

Nếu config trống → default `email`, note với user "dùng email mặc định, muốn đổi cứ nói em".

### Cách detect (nếu Agent cần tự detect, vd ngoài Sale Funnel flow)

Scan hội thoại tìm signal:
| User nói | Method |
|----------|--------|
| "vào nhóm Telegram", "join Telegram nhận khoá" | telegram |
| "gửi email", "file PDF qua mail" | email |
| "nhóm Zalo", "group Zalo" | zalo |
| "vừa email vừa Telegram" | hybrid |

Sau detect → hỏi follow-up link còn thiếu (Telegram invite / Zalo group) → save BUSINESS.md + .env.

## Delivery Flow — 2 Scenarios

Trước khi chọn flow, kiểm tra `.env`:

```
CUSTOMER_PORTAL_URL=  # Có giá trị → Scenario A
                      # Để trống  → Scenario B
```

### Scenario A — Có deploy Customer Portal

```
SePay payment confirmed
    ↓
POST /api/webhook-sepay (Customer Portal)
    ↓
Portal tạo Supabase account + enrollment
    ↓
Resend gửi magic link → khách nhận thông tin đăng nhập
    ↓
Brevo enrollCustomer() → onboarding marketing sequence
    ↓
Telegram notify admin
```

**Delivery email = Resend (Customer Portal lo).** Brevo chỉ xử lý marketing sequences.

### Scenario B — Không có Customer Portal

```
SePay payment confirmed
    ↓
POST /api/webhook.js (funnel trực tiếp)
    ↓
Brevo sendDeliveryEmail() → gửi link sản phẩm (GitHub/Drive/...)
    ↓
Brevo enrollCustomer()    → onboarding marketing sequence
    ↓
Telegram notify admin
```

**Delivery email = Brevo** (gửi link file/GitHub/Drive trực tiếp, không tạo tài khoản).

---

## Detect Scenario khi build

```
CUSTOMER_PORTAL_URL có trong .env?
  YES → Scenario A: tích hợp Brevo vào Customer Portal webhook
  NO  → Scenario B: dùng Brevo sendDeliveryEmail() trong webhook.js
```

Load `skills/integrations/email/SKILL.md` để setup email provider cho đúng scenario.

## Delivery Methods by Product Type

| Product Type | Scenario A (có Portal) | Scenario B (không Portal) |
|-------------|------------------------|--------------------------|
| Online course / Membership | Portal auto-enrollment + Resend magic link | Brevo email với Drive/Notion link |
| Digital product (PDF, template) | Portal grants access, customer downloads | Brevo email với download link |
| Coaching / Service | Portal tạo account + onboarding form | Brevo email với booking link |
| Kit / Code (GitHub) | Portal tạo account, Brevo email với repo invite | Brevo email với GitHub link |

## Webhook Automation (n8n)

**Nodes:**
1. Webhook → receive SePay POST on payment confirmed
2. Parse → extract name, email, phone, product, amount
3. Branch → route by product type
4. Email → send delivery email
5. Telegram → notify admin
6. Google Sheets → log order

## Email Templates

### Course Access
```
Subject: 🎉 Chào mừng đến với [Khóa Học]!

Chào [Tên], thanh toán đã xác nhận!

🔗 TRUY CẬP: [link]
Login: [email] | Pass tạm: [auto]

📱 CỘNG ĐỒNG: [group link]

Bắt đầu: → [step 1] → [step 2]
Hỗ trợ: [contact]
```

### Digital Download
```
Subject: Tài liệu sẵn sàng 📎
🔗 TẢI VỀ: [link — hết hạn 48h]
Hết hạn? Nhắn: [contact]
```

## Zalo OA Message
```
Chào [Tên]! 🎉 Thanh toán xác nhận.
🔗 [Tên SP]: [link]
Câu hỏi? Nhắn vào đây nhé!
```

## Telegram Admin Alert
```
✅ ĐƠN HOÀN TẤT
👤 [name] | 📧 [email] | 📱 [phone]
📦 [product] | 💰 [amount]đ | 🕐 [time]
Giao hàng: ✅
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Email vào spam | Resend + whitelist hướng dẫn |
| Login fails | Manual reset password |
| Download expired | Resend fresh link |
| Webhook không fire | Re-check SePay webhook URL |

## Output Template

```markdown
## Delivery Setup: [Product Name]

Product Type: [type]
Method: [email / Zalo / Telegram / platform]
Tool: [n8n / Make / manual]

Triggers: payment confirmed → [action list]
Admin Alert: [yes/no]

Test Checklist:
[ ] Payment processed
[ ] Delivery sent  
[ ] Admin notified
[ ] Access verified
```

# Auto Delivery Setup Guide

Automated fulfillment system for digital products. Delivers purchases immediately after payment using email, redirect links, or Telegram bots.

## When to Use

- Setting up first-time product delivery automation
- Replacing manual send-after-payment workflow
- Configuring multi-channel delivery (email + Telegram)
- Building scalable fulfillment without platforms like Gumroad
- Ensuring instant access to digital products

## Delivery Methods Comparison

| Method | Setup Time | Cost | Best For | Reliability |
|--------|-----------|------|----------|-------------|
| Email | 30 min | Free-$10/mo | Documents, courses, files <50MB | High |
| Redirect | 15 min | Free | Links to hosted content | Very High |
| Telegram | 45 min | Free | Community + content, ongoing engagement | High |
| Hybrid | 60 min | $0-10/mo | Premium products, maximum reach | Highest |

## Quick Setup Workflow

```
1. Choose delivery method(s)
   └─> Email: Setup transactional service + template
   └─> Redirect: Create access page + token system
   └─> Telegram: Build bot + webhook handler

2. Configure webhook receiver
   └─> Parse payment data
   └─> Trigger delivery function
   └─> Log transaction

3. Implement delivery logic
   └─> Generate secure access link
   └─> Send via chosen channel(s)
   └─> Confirm delivery

4. Setup error handling
   └─> Retry failed deliveries
   └─> Alert on critical failures
   └─> Manual override option

5. Test end-to-end
   └─> Test payment → delivery flow
   └─> Verify access links work
   └─> Check delivery timing
```

## Architecture Overview

```
Payment Gateway (Stripe/PayPal/etc)
    ↓ (webhook)
Webhook Handler (Node.js/Express)
    ↓ (validates payment)
Delivery Orchestrator
    ├─> Email Service → Buyer Inbox
    ├─> Redirect Generator → Access Page
    └─> Telegram Bot → Direct Message / Private Channel
```

## Reference Files

### [digital-product-delivery-methods.md](references/digital-product-delivery-methods.md)
Detailed comparison of email, redirect, and Telegram delivery. Security considerations, setup instructions, pros/cons for each method.

### [automated-delivery-workflow.md](references/automated-delivery-workflow.md)
Full technical implementation. Webhook handling, delivery code examples, error handling, retry mechanisms, monitoring.

### [post-purchase-engagement-sequence.md](references/post-purchase-engagement-sequence.md)
7-touchpoint sequence from purchase to upsell. Email/Telegram templates, timing strategy, automation setup.

## Key Principles

**Instant delivery** — Buyer receives access within 60 seconds of payment
**Redundancy** — Use 2+ channels for high-value products
**Security** — Time-limited tokens, one-time access links
**Monitoring** — Log all deliveries, alert on failures
**Simplicity** — Use existing infrastructure, avoid platform lock-in

## Implementation Notes

- Email: Use transactional service (not marketing email provider)
- Redirect: Host on same domain as sales page for trust
- Telegram: Best for ongoing engagement, not just one-time delivery
- Always include support contact in delivery message
- Test with real payment (refund later) before launch

## Common Pitfalls

- Using marketing email for transactional sends (deliverability issues)
- No retry mechanism when delivery fails
- Insecure links that can be shared publicly
- Missing delivery confirmation logs
- Complex setup that breaks easily

## Success Metrics

- Delivery success rate >99%
- Average delivery time <60 seconds
- Support requests about access <2%
- Link security breach incidents: 0
