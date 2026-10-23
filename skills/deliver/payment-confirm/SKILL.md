---
name: payment-confirm
description: "Tu dong xac nhan thanh toan SePay -> update CRM -> trigger Deliver Agent. Ket noi order form funnel voi quy trinh giao hang."
agent: funnel
---

# Payment Confirm

## When to Use

Activate this skill when you need to:
- Auto-confirm bank transfer payments after a sales page or order form goes live
- Connect a SePay QR payment flow to your Google Sheet CRM
- Trigger the Deliver Agent automatically after a verified payment
- Eliminate manual payment checking for digital product orders
- Set up end-to-end order-to-delivery automation on Vercel

## How It Works

```
Order Form (Formspree)
    |
    | Customer submits — Order ID DH-xxx written to Google Sheet (status: pending_payment)
    v
SePay QR Code
    |
    | Customer scans QR, enters DH-xxx in transfer description
    v
Bank Transfer Processed
    |
    | SePay detects transfer via bank API
    v
SePay Webhook POST --> /api/webhook (Vercel serverless)
    |
    | 1. Verify HMAC-SHA256 signature
    | 2. Extract Order ID from content field
    | 3. Lookup row in Google Sheet
    | 4. Verify amount matches (±1000 VND tolerance)
    | 5. Check status = pending_payment (not duplicate)
    v
Google Sheet Updated
    |
    | status: paid | paid_at: timestamp | reference_code: FT...
    v
Telegram Notification Sent
    |
    | Seller receives order details + delivery link
    v
Deliver Agent Triggered
    |
    | Email delivery sent to customer automatically
    v
Done — Order fulfilled, customer notified
```

## Integration Points

| Component | Role | Detail |
|-----------|------|--------|
| Order form | Generates Order ID | Format `DH-xxx`, embedded in QR description + Formspree hidden field |
| Google Sheet (CRM) | Order database | Row created on form submit with `status: pending_payment` |
| SePay webhook | Payment detection | Fires HTTP POST to your Vercel endpoint when transfer is detected |
| Vercel `/api/webhook.js` | Webhook handler | Verifies, matches, updates Sheet, notifies, triggers delivery |
| Deliver Agent | Fulfillment | Activated after Sheet status = `paid` |

## Setup Checklist

### Phase 1 — SePay Configuration
- [ ] Log in to SePay dashboard → Settings → Webhook
- [ ] Set webhook URL: `https://your-project.vercel.app/api/webhook`
- [ ] Enable HMAC signature and copy the webhook secret
- [ ] Save `SEPAY_WEBHOOK_SECRET` to `.env` and Vercel environment variables

### Phase 2 — Vercel Serverless Function
- [ ] Create `scripts/api/webhook.js` (see reference files for full code)
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Confirm endpoint returns 200 on GET `/api/webhook` (health check)
- [ ] Test with SePay dashboard webhook simulator

### Phase 3 — CRM (Google Sheet)
- [ ] Ensure Google Sheet has these columns (exact order matters):

| Column | Description |
|--------|-------------|
| `timestamp` | Form submission time |
| `name` | Customer full name |
| `email` | Customer email address |
| `phone` | Customer phone number |
| `product` | Product name or ID |
| `order_id` | Generated Order ID (DH-xxx) |
| `amount` | Expected payment amount (VND) |
| `status` | `pending_payment` → `paid` |
| `paid_at` | Timestamp when payment confirmed |
| `reference_code` | SePay transaction reference (FT...) |

- [ ] Share Sheet with Google Service Account email (Editor access)
- [ ] Save `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY` to Vercel env vars

### Phase 4 — Testing
- [ ] Run local test: `node scripts/test-webhook.js`
- [ ] Use SePay dashboard simulator to send test payload
- [ ] Confirm Google Sheet row updates from `pending_payment` to `paid`
- [ ] Confirm Telegram notification arrives
- [ ] Confirm Deliver Agent email is sent (or trigger is logged)

## Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `SEPAY_WEBHOOK_SECRET` | HMAC signing secret | SePay dashboard → Webhook settings |
| `GOOGLE_SHEET_ID` | ID from Sheet URL | URL: `/spreadsheets/d/{ID}/edit` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON key (base64 encoded) | Google Cloud Console → Service Accounts |
| `TELEGRAM_BOT_TOKEN` | Bot API token | @BotFather on Telegram |
| `TELEGRAM_CHAT_ID` | Your chat or group ID | @userinfobot on Telegram |

Add all to `.env` for local development and to Vercel project settings for production.

## Script Usage

```bash
# Test webhook locally (simulates SePay POST with test payload)
node scripts/test-webhook.js

# Deploy to Vercel
vercel --prod

# View webhook logs in real-time
vercel logs --follow
```

## Reference Files

| File | Content |
|------|---------|
| [SePay Webhook Spec](./references/sepay-webhook-spec.md) | Payload structure, HMAC verification, retry policy, test payloads |
| [Order Matching Logic](./references/order-matching-logic.md) | Order ID extraction, amount verification, edge cases, deduplication |
| [Delivery Trigger Guide](./references/delivery-trigger-guide.md) | 3 trigger options, Deliver Agent integration, Telegram format, error handling |

## Related Skills

- `funnel/sales-page-funnel` — Builds the sales page that generates orders
- `funnel/deploy` — Deploys the full funnel to Vercel (includes webhook endpoint)
- `deliver` — Deliver Agent that fulfills orders after payment confirmed

## Integration Effort Estimate

| Task | Time |
|------|------|
| SePay webhook config | 15 min |
| Vercel function deploy | 30-60 min |
| Google Sheet setup | 15-30 min |
| Testing end-to-end | 30-60 min |
| **Total** | **~2-3 hours** |
