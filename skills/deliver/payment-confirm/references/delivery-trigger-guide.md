# Delivery Trigger Guide

How `payment-confirm` triggers the Deliver Agent after a payment is verified.

## Overview

Once a payment is matched and the Google Sheet row is updated to `status: paid`, one of three trigger methods activates the Deliver Agent to fulfill the order.

## Trigger Options

Choose the option that fits your volume and automation level:

### Option A — Telegram Notification (Simplest)

**How it works:**
- `payment-confirm` sends a Telegram message to the seller with order details
- Seller manually fulfills (sends download link, grants course access, etc.) or clicks a link to trigger delivery

**Best for:**
- Low order volume (under 20/day)
- Digital products that require a manual step (e.g., adding to a private group, personalizing a document)
- Sellers who want to stay hands-on with each customer

**What to implement:**
- Add Telegram notification call after Sheet update (see format below)
- Include a link to the Google Sheet row or a pre-filled email draft

**Limitation:** Does not scale. If you're away, orders queue up unfulfilled.

---

### Option B — Google Sheet Status Watch (Recommended)

**How it works:**
- `payment-confirm` updates Sheet row to `status: paid`
- A separate automation (n8n, Make.com, or Google Apps Script) watches the Sheet for rows where `status` changed to `paid`
- That automation triggers the Deliver Agent: sends product email, grants access, etc.

**Best for:**
- Automated digital delivery (courses, templates, ebooks)
- Teams using n8n or Make.com already
- Businesses scaling past 20 orders/day

**Implementation — Google Apps Script trigger:**

```javascript
// In Google Apps Script — runs every 5 minutes
function checkForPaidOrders() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const statusCol = headers.indexOf('status');
  const deliveredCol = headers.indexOf('delivered_at');
  const emailCol = headers.indexOf('email');
  const nameCol = headers.indexOf('name');
  const productCol = headers.indexOf('product');
  const orderIdCol = headers.indexOf('order_id');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[statusCol] === 'paid' && !row[deliveredCol]) {
      // Trigger delivery
      sendDeliveryEmail({
        email: row[emailCol],
        name: row[nameCol],
        product: row[productCol],
        orderId: row[orderIdCol]
      });
      // Mark as delivered
      sheet.getRange(i + 1, deliveredCol + 1).setValue(new Date().toISOString());
    }
  }
}
```

**Implementation — n8n / Make.com:**
1. Trigger: Google Sheets → Watch Rows (filter: `status = paid`)
2. Action: Send email via Gmail / Brevo / Mailchimp
3. Action: Update row `delivered_at` = now

---

### Option C — Direct Webhook to Deliver Endpoint (Advanced)

**How it works:**
- `payment-confirm` POSTs order data directly to a Deliver Agent webhook URL
- Deliver endpoint sends product immediately — no polling, no delay

**Best for:**
- High volume (100+ orders/day)
- Fully automated pipeline with no human steps
- Teams with a dedicated deliver service already running

**Implementation:**

```javascript
async function triggerDeliverWebhook(orderData) {
  const deliverUrl = process.env.DELIVER_WEBHOOK_URL;

  if (!deliverUrl) {
    console.warn('[deliver] DELIVER_WEBHOOK_URL not set — skipping direct trigger');
    return;
  }

  const payload = {
    order_id: orderData.orderId,
    name: orderData.name,
    email: orderData.email,
    product: orderData.product,
    amount: orderData.amount,
    paid_at: new Date().toISOString()
  };

  try {
    const res = await fetch(deliverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      throw new Error(`Deliver webhook returned ${res.status}`);
    }

    console.log('[deliver] Deliver webhook triggered successfully');
  } catch (err) {
    console.error('[deliver] Webhook failed:', err.message);
    // Fallback: log to file for manual retry
    logFailedDelivery(payload, err.message);
  }
}
```

---

## Deliver Agent Integration

### Data to Pass

Regardless of trigger method, always include these fields:

| Field | Source | Description |
|-------|--------|-------------|
| `name` | Google Sheet row | Customer full name for personalization |
| `email` | Google Sheet row | Delivery destination |
| `product` | Google Sheet row | Product ID or name — determines which template to use |
| `order_id` | Extracted from webhook | For customer reference |
| `amount` | Webhook `transferAmount` | Confirmation of amount paid |
| `paid_at` | Current timestamp | When payment was confirmed |

### Email Template Selection

Map `product` value to the correct Deliver Agent email template:

```javascript
const PRODUCT_TEMPLATES = {
  'khoa-hoc-ads':      'deliver-digital-course',
  'template-pack':     'deliver-template-download',
  'coaching-1on1':     'deliver-booking-confirm',
  'membership':        'deliver-membership-access',
};

function getDeliveryTemplate(product) {
  return PRODUCT_TEMPLATES[product] || 'deliver-generic';
}
```

### Formspree Thank-You Redirect

Set Formspree's `_next` field on the order form to redirect customers to a thank-you page immediately after submit (before payment):

```html
<input type="hidden" name="_next" value="https://your-site.vercel.app/thank-you" />
```

The thank-you page should show payment instructions (QR code + Order ID) and set expectations for delivery time.

---

## Telegram Notification Format

Send this message to the seller after every confirmed payment. Use as a template — adjust for your products.

```
[BUSINESS NAME] — DON MOI XAC NHAN

Ma don:    DH-xxx
Khach:     [name] / [email] / [phone]
San pham:  [product]
So tien:   [amount]d
Thoi gian: [datetime]
Ngan hang: [bankBrandName]
Ma GD:     [referenceCode]

Trang thai: DA THANH TOAN

Xem CRM va giao hang tai:
[Google Sheet URL]
```

Note: The above is a plain-text template. In your actual Telegram message you may use Markdown formatting (`*bold*`, `` `code` ``). Keep emoji usage minimal to avoid rendering issues across Telegram clients.

### Telegram Send Function

```javascript
async function sendTelegramNotification(orderData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`;

  const message = [
    '*DON MOI XAC NHAN*',
    '',
    `Ma don: \`${orderData.orderId}\``,
    `Khach: ${orderData.name} (${orderData.email})`,
    `San pham: ${orderData.product}`,
    `So tien: ${Number(orderData.amount).toLocaleString('vi-VN')}d`,
    `Thoi gian: ${new Date().toLocaleString('vi-VN')}`,
    `Ngan hang: ${orderData.bankName}`,
    '',
    `Xem CRM: ${sheetUrl}`
  ].join('\n');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    }),
    signal: AbortSignal.timeout(5000)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Telegram API error: ${JSON.stringify(err)}`);
  }

  return res.json();
}
```

## Error Handling

### Telegram Fails

```javascript
async function sendTelegramWithRetry(orderData, maxRetries = 1) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await sendTelegramNotification(orderData);
      return; // Success
    } catch (err) {
      console.error(`[telegram] Attempt ${attempt + 1} failed:`, err.message);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
      } else {
        // Final fallback: write to log file
        const fs = require('fs');
        const logEntry = JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'telegram_failed',
          orderData,
          error: err.message
        }) + '\n';
        fs.appendFileSync('failed-notifications.log', logEntry);
        console.error('[telegram] Logged to failed-notifications.log');
      }
    }
  }
}
```

### Deliver Webhook Fails

If Option C (direct webhook) fails, fall back to Option A (Telegram alert) so the seller can manually deliver:

```javascript
async function triggerDeliveryWithFallback(orderData) {
  try {
    await triggerDeliverWebhook(orderData);
  } catch (err) {
    console.error('[deliver] Direct webhook failed, falling back to Telegram alert');
    await sendTelegramNotification({
      ...orderData,
      note: 'Deliver webhook failed — manual delivery required'
    });
  }
}
```

## Testing Deliver Trigger Without Real Payment

Use the test script to simulate a confirmed payment and test the trigger:

```javascript
// scripts/test-delivery-trigger.js
require('dotenv').config();

const testOrder = {
  orderId: 'DH-TEST001-ABCD',
  name: 'Nguyen Van A',
  email: 'test@example.com',
  phone: '0901234567',
  product: 'khoa-hoc-ads',
  amount: 990000,
  bankName: 'MB Bank',
  referenceCode: 'FT26133000000001'
};

async function runTest() {
  console.log('Testing Telegram notification...');
  await sendTelegramWithRetry(testOrder);
  console.log('Telegram: OK');

  console.log('Testing Deliver webhook...');
  await triggerDeliveryWithFallback(testOrder);
  console.log('Deliver trigger: OK');
}

runTest().catch(console.error);
```

Run with:

```bash
node scripts/test-delivery-trigger.js
```
