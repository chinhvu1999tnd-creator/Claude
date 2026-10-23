---
name: setup-resend
description: Hướng dẫn lấy Resend API key cho magic link email + setup sender domain. Sub-skill của setup/crm-portal.
---

# Setup Resend Skill

Resend cung cấp transactional email (magic link, reset password, order confirmation) cho Customer Portal.

## References

- `references/get-api-key.md` — Lấy RESEND_API_KEY (~2 phút)
- `references/sender-domain.md` — Setup domain riêng để gửi từ `noreply@business-cua-anh.com` (optional)

## Vai trò

| Email type | Provider |
|-----------|----------|
| Magic link login | **Resend** (qua Portal) |
| Welcome / receipt sau khi mua | **Resend** (qua Portal Edge Function) |
| Lead nurture / Sales funnel email | **email.js** (Brevo qua transport layer) |

→ Resend lo **transactional** (1-1, ngay lập tức). Brevo lo **marketing** (broadcast, sequence).
