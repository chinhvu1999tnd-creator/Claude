# Cách lấy Resend API Key

> Resend gửi magic link login cho Customer Portal + transactional email sau payment.

## Tạo Resend account + API key (~3 phút)

### Bước 1: Đăng ký Resend
- URL: https://resend.com
- Click **"Sign up"** — đăng ký bằng email
- Verify email → vào dashboard

### Bước 2: Generate API key
- Vào https://resend.com/api-keys
- Click **"Create API Key"**
- **Name**: `AI Business Kit`
- **Permission**: `Sending access` (đủ rồi, không cần full)
- **Domain**: `All Domains` (default)
- Click **"Add"**

### Bước 3: Copy key
- Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
- Paste vào Claude Code khi Coach hỏi
- Đóng tab sau khi copy

## Free tier

| Feature | Free tier |
|---------|-----------|
| Emails/tháng | 3,000 |
| Emails/ngày | 100 |
| Sender domain | 1 |
| Webhooks | Có |

→ Đủ cho ~30 đơn/ngày + magic link login.

## Default sender

Mặc định Portal dùng `onboarding@resend.dev` (Resend cấp sẵn) — không cần verify domain.

→ Email vào inbox của khách nhưng hiển thị từ `resend.dev` (không pro lắm).

## Custom domain (recommended cho production)

Setup domain riêng để email gửi từ `noreply@business-cua-anh.com`:

### Bước 1: Add domain
- Vào https://resend.com/domains
- Click **"Add Domain"** → nhập domain của user (vd: `business-cua-anh.com`)

### Bước 2: Verify DNS
Resend show 3-5 DNS records cần add. User add vào DNS provider (Cloudflare, Namecheap...):
- 1 TXT (SPF)
- 1 TXT (DKIM)
- 1 MX (optional - cho receiving)

### Bước 3: Đợi verify (~10-30 phút)
- Resend tự check DNS
- Sau khi verify: status "Verified" ✓

### Bước 4: Update `.env.local`
```bash
RESEND_FROM_EMAIL=noreply@business-cua-anh.com
```

### Bước 5: Redeploy Portal
```bash
cd apps/customer-portal
vercel env add RESEND_FROM_EMAIL production
vercel deploy --prod
```

## Troubleshooting

### `Error: Domain not verified`
- Đợi DNS propagate (10-30 phút sau add records)
- Check DNS qua: https://mxtoolbox.com/SuperTool.aspx
- Nếu sau 24h vẫn chưa verify → check lại DNS records anh đã add đúng chưa

### `Error: Sending limit exceeded`
- Free tier: 100 emails/ngày
- Fix: Upgrade Resend Pro ($20/month — 50,000 emails/tháng)
- Hoặc đợi reset 00:00 UTC

### Email vào spam
- Setup custom domain (Step 1-5 ở trên)
- Add DMARC record (TXT): `v=DMARC1; p=quarantine; rua=mailto:dmarc@business-cua-anh.com`
- Warm up domain: gửi từ từ trong tuần đầu (10-20 email/ngày)
