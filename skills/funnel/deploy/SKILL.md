---
name: deploy
description: Technical deployment skill for launching funnels — build and deploy landing pages on Vercel, integrate SePay VietQR payment, set up Telegram bot notifications, and configure domain and SSL.
---

# Deploy Skill

## Dep Check (BẮT BUỘC trước deploy)

Trước khi deploy, verify vercel CLI:
```
→ which vercel (Mac/Linux) / where vercel (Windows)
→ THIẾU → BLOCK + install: npm install -g vercel → wait 'done' → re-check
```
(Qua /start onboarding thì Phase 0 đã block vercel rồi — bước này cho edge case gõ /funnel trực tiếp.)

## Scripts (Chạy được trực tiếp)

```
skills/funnel/deploy/scripts/
├── generate-page.js   → Tạo HTML từ THEME.md (node generate-page.js --type leads)
├── deploy.sh          → Deploy Vercel (Unix only — Windows dùng lệnh CLI bên dưới)
├── setup-telegram.js  → Setup + test bot      (node setup-telegram.js)
└── check-sepay.js     → Xác nhận thanh toán  (node check-sepay.js --recent)
```

⚠️ **Cross-platform (Windows/Mac/Linux)**: KHÔNG dùng `deploy.sh`. Deploy bằng Vercel CLI trực tiếp:
```
vercel deploy --prod --yes
```
Vercel CLI chạy mọi OS. deploy.sh chỉ là Unix convenience wrapper.

Xem chi tiết: `skills/funnel/deploy/scripts/README.md`

---

## When to Use
Activate after a funnel has been designed (by any funnel sub-skill) and needs to go live. Handles all technical deployment tasks:
- Landing page build and Vercel deployment
- SePay VietQR payment integration
- Telegram bot order notifications
- Domain setup and SSL configuration
- Webhook pipeline testing

## Deployment Checklist

```
[ ] Landing page HTML complete + mobile tested
[ ] Vercel project created and page deployed
[ ] Custom domain connected (if applicable)
[ ] SSL certificate active (HTTPS)
[ ] SePay account verified + API keys obtained
[ ] VietQR embed code added to order form
[ ] Telegram bot created + webhook configured
[ ] Test payment completed (end-to-end)
[ ] Order notification received in Telegram
[ ] Thank you page redirect working
[ ] Analytics/tracking installed (UTM ready)
[ ] Backup payment method visible (bank transfer)
```

## Step 1: Build Landing Page

### Using Existing Templates
Templates available in `skills/funnel/deploy/templates/`:
- `landing-page-template.html` — Standard light
- `landing-page-dark-modern.html` — Dark + gradient
- `landing-page-minimal-clean.html` — Minimal clean
- `landing-page-creative-bold.html` — Bold, high-energy
- `landing-page-mobile-app.html` — App/SaaS style
- `landing-page-portfolio-personal.html` — Personal brand
- `landing-page-restaurant-food.html` — F&B businesses

### Page Build Requirements
- Single HTML file (inline CSS + JS, no external dependencies)
- Mobile-first responsive
- Load time < 3 seconds (no heavy images)
- All fonts from Google Fonts CDN
- Payment section clearly marked with VietQR placeholder

## Step 2: Deploy to Vercel

### Method A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# In your project folder
vercel

# Follow prompts:
# - Link to existing project or create new
# - Framework: Other
# - Root directory: ./
# - Build command: (leave empty)
# - Output directory: ./

# Production deploy
vercel --prod
```

### Method B: Drag & Drop (No CLI)
1. Go to vercel.com → New Project
2. Drag the project folder into the deploy zone
3. Click Deploy
4. Copy the `.vercel.app` URL

### Method C: GitHub Integration
1. Push project to GitHub repo
2. Import repo in Vercel dashboard
3. Auto-deploy on every push to main branch

### Custom Domain Setup
```
Vercel Dashboard → Project → Settings → Domains
→ Add domain: yourdomain.com
→ Add DNS records at your registrar:
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
→ SSL auto-provisioned within 5–10 minutes
```

## Step 3: SePay VietQR Integration

### Prerequisites
1. Register at sepay.vn
2. Verify bank account
3. Get API credentials from dashboard

### Embed VietQR on Order Form

**Static QR (simplest — manual verification)**
```html
<img src="https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NUMBER}-{TEMPLATE}.png
  ?amount={AMOUNT}
  &addInfo={ORDER_ID}
  &accountName={YOUR_NAME}"
  alt="VietQR Payment"
  style="width: 250px; border-radius: 12px;">
```

**Dynamic QR via SePay API (auto-verification)**
```javascript
// After user submits order form
const response = await fetch('https://my.sepay.vn/userapi/transactions/list', {
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});
// Poll for transaction matching amount + reference code
// On match: redirect to thank you page
```

### Bank IDs (common Vietnamese banks)
- VCB — Vietcombank
- TCB — Techcombank
- MB — MB Bank
- ACB — ACB
- VPB — VPBank
- BIDV — BIDV

### Payment Description Format
`ORDER-{timestamp}-{random4digits}` — unique per transaction for matching

## Step 4: Telegram Bot Notification

### Create Bot
1. Message @BotFather on Telegram
2. `/newbot` → choose name → choose username
3. Save the **bot token**

### Get Chat ID
1. Add bot to your group or start a DM
2. Send any message
3. Visit: `https://api.telegram.org/bot{TOKEN}/getUpdates`
4. Find `"chat":{"id": XXXXXXXX}` — that's your chat ID

### Set Up Webhook (via n8n, Make, or direct API)

**Direct API (simplest)**
```javascript
// Call this when order is confirmed
async function sendTelegramNotification(order) {
  const message = `
🎉 ĐƠN HÀNG MỚI!

👤 Khách: ${order.name}
📱 SĐT: ${order.phone}
📦 Sản phẩm: ${order.product}
💰 Số tiền: ${order.amount.toLocaleString('vi-VN')}đ
🕐 Thời gian: ${new Date().toLocaleString('vi-VN')}
  `;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
}
```

**Via n8n (no-code)**
1. Create Webhook node (receive SePay callback)
2. Parse order data
3. Telegram node → Send message to chat

## Step 5: End-to-End Test

### Test Checklist
```
[ ] Open landing page on mobile (iPhone + Android)
[ ] Submit test form
[ ] Generate VietQR with test amount (1,000đ)
[ ] Complete payment from bank app
[ ] Confirm Telegram notification received (< 30 seconds)
[ ] Confirm redirect to thank you page
[ ] Check order recorded in SePay dashboard
[ ] Verify email confirmation sent (if applicable)
[ ] Test with slow 3G connection (Thai, mobile data)
```

## Common Issues & Fixes

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| QR not generating | Wrong bank ID or account format | Check SePay docs for correct bank code |
| Telegram not receiving | Wrong chat ID or bot not added to group | Re-check chat ID via getUpdates |
| Page loads slow on mobile | Uncompressed images | Use WebP, max 200KB per image |
| Payment not detected | Amount mismatch or description format | Ensure exact VND amount + unique reference |
| Vercel deploy failing | File path issues | Check all paths are relative, not absolute |
| SSL not active | DNS not propagated | Wait 24–48 hours, check with dnschecker.org |

## Output Template

```markdown
## Deployment Report: [Project Name]

**Deploy Date:** [YYYY-MM-DD]
**Live URL:** [https://...]
**Custom Domain:** [domain if applicable]

### Pages Deployed
- [Page name]: [URL]
- [Page name]: [URL]

### Payment Setup
- Gateway: SePay VietQR
- Bank: [bank name + last 4 digits]
- Test transaction: [completed / pending]

### Telegram Notification
- Bot: [@botname]
- Chat/Group: [name]
- Test notification: [sent ✓ / pending]

### Checklist Status
[paste checklist with completion status]

### Issues Found
- [issue + resolution]

### Next Steps
- [what Deliver Agent needs to set up]
- [any manual steps remaining]
```

## Unresolved Questions to Ask User
- Which funnel pages need to be deployed?
- Is a custom domain available or will .vercel.app be used?
- Which bank account should receive payments?
- Which Telegram group/chat should receive order notifications?
- Is n8n or Make available for automation, or will direct API be used?
