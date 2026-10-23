# SePay Webhook Specification

Technical reference for receiving and verifying SePay payment webhooks.

## Webhook Payload Structure

SePay sends an HTTP POST with `Content-Type: application/json` to your endpoint when a bank transfer is detected.

### Full Payload Example

```json
{
  "id": "87654321",
  "gateway": "VietQR",
  "transactionDate": "2026-05-13 15:30:45",
  "accountNumber": "0123456789",
  "subAccount": null,
  "code": null,
  "content": "DH-LK3M9P2A-K7X2 thanh toan khoa hoc",
  "transferType": "in",
  "transferAmount": 1990000,
  "accumulated": 25000000,
  "referenceCode": "FT26133123456789",
  "description": "MB NGUYEN VAN A chuyen tien DH-LK3M9P2A-K7X2",
  "bankBrandName": "MB Bank",
  "virtualAccount": "0123456789DH-LK3M9P2A-K7X2"
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | SePay internal transaction ID |
| `gateway` | string | Payment method (`VietQR`, `ATM`, etc.) |
| `transactionDate` | string | Bank-reported datetime (`YYYY-MM-DD HH:mm:ss`) |
| `accountNumber` | string | Your registered bank account number |
| `subAccount` | string\|null | Sub-account if applicable |
| `code` | string\|null | SePay payment code (if used) |
| `content` | string | Transfer description entered by customer — **extract Order ID from here** |
| `transferType` | string | `in` = money received, `out` = money sent |
| `transferAmount` | number | Amount transferred (VND, integer) |
| `accumulated` | number | Running total for the day |
| `referenceCode` | string | Unique bank transaction reference (e.g. `FT26133...`) — use for deduplication |
| `description` | string | Full bank transfer description including customer name |
| `bankBrandName` | string | Bank short name (e.g. `MB Bank`, `Vietcombank`) |
| `virtualAccount` | string\|null | Virtual account number if used |

**Important:** Only process webhooks where `transferType === "in"`.

## HMAC-SHA256 Signature Verification

SePay signs every webhook with HMAC-SHA256 so you can verify the request is authentic.

### Signature Header

SePay sends the signature in one of these headers (check both for compatibility):

```
X-Webhook-Signature: abc123...
Checksum: abc123...
```

### Signing Algorithm

1. Take the **raw request body** as a UTF-8 string
2. Compute `HMAC-SHA256(rawBody, SEPAY_WEBHOOK_SECRET)`
3. Encode as lowercase hex
4. Compare with timing-safe equality

### Node.js Verification Code

```javascript
const crypto = require('crypto');

function verifyHMAC(req) {
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-webhook-signature']
    || req.headers['checksum']
    || '';

  if (!signature || !secret) {
    return false;
  }

  // Use raw body string — must be captured before JSON.parse
  const rawBody = typeof req.rawBody === 'string'
    ? req.rawBody
    : JSON.stringify(req.body);

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Timing-safe comparison prevents timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}
```

### Vercel Serverless Handler (capture raw body)

```javascript
// api/webhook.js
import crypto from 'crypto';

// Vercel: disable body parsing to access rawBody
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const body = JSON.parse(rawBody);

  const signature = req.headers['x-webhook-signature'] || req.headers['checksum'] || '';
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  let sigValid = false;
  try {
    sigValid = crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    sigValid = false;
  }

  if (!sigValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Respond immediately — process async
  res.status(200).json({ success: true });

  // Continue processing after response sent
  processPayment(body).catch(err => console.error('Payment processing error:', err));
}
```

### Why Timing-Safe Comparison Matters

- Regular string comparison (`===`) leaks timing information about how many characters matched
- An attacker can brute-force signatures by measuring response time
- `crypto.timingSafeEqual()` always takes the same time regardless of match position

## Retry Policy

| Attempt | Delay | Notes |
|---------|-------|-------|
| 1st | Immediate | Original request |
| 2nd | ~30 seconds | If no 200 response |
| 3rd | ~5 minutes | Final attempt |

SePay stops retrying after 3 failed attempts. The transaction remains in SePay's logs but your system will not receive another callback.

**Response requirement:** Your endpoint must return HTTP `200` with body `{"success": true}` within **5 seconds**. Use async processing — respond first, then process.

## Content Field Format

The `content` field is free text entered by the customer during their bank transfer. Examples:

```
DH-LK3M9P2A-K7X2
DH-LK3M9P2A-K7X2 thanh toan
Thanh toan DH-LK3M9P2A-K7X2 khoa hoc ads
DH-LK3M9P2A-K7X2TT (typo, still extractable with regex)
```

Your Order ID (`DH-xxx`) must be extractable via regex from this field. See [Order Matching Logic](./order-matching-logic.md) for extraction details.

## Test Payload for Local Testing

Use this payload with `scripts/test-webhook.js` to simulate SePay locally:

```json
{
  "id": "TEST-001",
  "gateway": "VietQR",
  "transactionDate": "2026-05-13 10:00:00",
  "accountNumber": "0123456789",
  "subAccount": null,
  "code": null,
  "content": "DH-TEST001-ABCD thanh toan",
  "transferType": "in",
  "transferAmount": 990000,
  "accumulated": 990000,
  "referenceCode": "FT26133000000001",
  "description": "MB NGUYEN VAN A chuyen tien DH-TEST001-ABCD",
  "bankBrandName": "MB Bank",
  "virtualAccount": null
}
```

Generate the correct HMAC for this payload when running local tests:

```javascript
const crypto = require('crypto');
const payload = JSON.stringify(require('./test-payload.json'));
const secret = process.env.SEPAY_WEBHOOK_SECRET;
const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
console.log('X-Webhook-Signature:', sig);
```

## Common Issues and Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Signature mismatch | 401 response, logs show `Invalid signature` | Ensure you're hashing the raw request body, not `JSON.stringify(req.body)` (which may reorder keys) |
| Timeout / no 200 | SePay retries 3x | Respond 200 immediately, process async after `res.status(200).json(...)` |
| Missing `transferType` filter | Outgoing transfers trigger webhook | Add `if (body.transferType !== 'in') return` check |
| Duplicate webhooks | Order confirmed twice | Deduplicate on `referenceCode` — see Order Matching Logic |
| Wrong header name | Signature never found | Check both `x-webhook-signature` and `checksum` headers |
| Buffer length mismatch | `timingSafeEqual` throws | Wrap in try/catch, return false if buffers differ in length |
