# Order Matching Logic

How to extract an Order ID from a SePay webhook and match it to a pending order in the Google Sheet CRM.

## Order ID Format

```
DH-[BASE36_TIMESTAMP]-[RANDOM_4CHARS]
```

| Part | Example | Description |
|------|---------|-------------|
| Prefix | `DH` | Fixed — stands for "Don Hang" (order) |
| Separator | `-` | Fixed |
| Timestamp | `LK3M9P2A` | Base-36 encoded Unix timestamp (milliseconds) — sortable, compact |
| Separator | `-` | Fixed |
| Random suffix | `K7X2` | 4 uppercase alphanumeric chars — prevents collisions same millisecond |

**Full example:** `DH-LK3M9P2A-K7X2`

### Generating an Order ID (Node.js)

```javascript
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DH-${timestamp}-${random}`;
}

// Example output: DH-LK3M9P2A-K7X2
```

## Extraction Regex

```javascript
const ORDER_ID_REGEX = /DH-[A-Z0-9]+-[A-Z0-9]+/i;

function extractOrderId(content) {
  if (!content) return null;
  const match = content.toUpperCase().match(/DH-[A-Z0-9]+-[A-Z0-9]+/);
  return match ? match[0] : null;
}

// Examples
extractOrderId('DH-LK3M9P2A-K7X2 thanh toan');     // 'DH-LK3M9P2A-K7X2'
extractOrderId('Thanh toan DH-LK3M9P2A-K7X2');       // 'DH-LK3M9P2A-K7X2'
extractOrderId('DH-LK3M9P2A-K7X2TT');                // 'DH-LK3M9P2A-K7X2' (extra chars ignored)
extractOrderId('random text no order id');            // null
```

Also search the `description` field as a fallback:

```javascript
function extractOrderIdFromPayload(body) {
  return extractOrderId(body.content) || extractOrderId(body.description);
}
```

## Matching Steps

### Step-by-Step Flow

```
1. Extract Order ID from webhook content field
       |
       | extractOrderIdFromPayload(body)
       v
2. Lookup row in Google Sheet where order_id = extracted ID
       |
       | rows.find(row => row.order_id === orderId)
       v
3. Verify transferAmount matches expected amount (±1000 VND)
       |
       | Math.abs(row.amount - body.transferAmount) <= 1000
       v
4. Confirm status = 'pending_payment' (not already paid)
       |
       | row.status === 'pending_payment'
       v
5. Deduplication: check referenceCode not already processed
       |
       | !processedRefs.has(body.referenceCode)
       v
6. Update Google Sheet row: status=paid, paid_at, reference_code
       |
       v
7. Return { matched: true, row }
```

### Full Matching Function (Node.js)

```javascript
const AMOUNT_TOLERANCE = 1000; // VND

async function matchOrder(webhookBody, sheetRows) {
  // Step 1: Extract Order ID
  const orderId = extractOrderIdFromPayload(webhookBody);

  if (!orderId) {
    // Fallback: try matching by unique amount
    return matchByAmountOnly(webhookBody, sheetRows);
  }

  // Step 2: Find the row
  const row = sheetRows.find(r => r.order_id === orderId);

  if (!row) {
    console.warn(`[match] No row found for order_id: ${orderId}`);
    return { matched: false, reason: 'order_not_found', orderId };
  }

  // Step 3: Verify amount
  const expectedAmount = parseInt(row.amount);
  const paidAmount = parseInt(webhookBody.transferAmount);
  const diff = Math.abs(expectedAmount - paidAmount);

  if (diff > AMOUNT_TOLERANCE) {
    console.warn(`[match] Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`);
    return { matched: false, reason: 'amount_mismatch', orderId, expectedAmount, paidAmount };
  }

  // Step 4: Check status
  if (row.status !== 'pending_payment') {
    console.warn(`[match] Order ${orderId} has status: ${row.status} — skipping`);
    return { matched: false, reason: 'wrong_status', orderId, status: row.status };
  }

  return { matched: true, row, orderId };
}

function matchByAmountOnly(webhookBody, sheetRows) {
  const amount = parseInt(webhookBody.transferAmount);
  const pending = sheetRows.filter(
    r => r.status === 'pending_payment' && Math.abs(parseInt(r.amount) - amount) <= AMOUNT_TOLERANCE
  );

  if (pending.length === 1) {
    console.log('[match] Matched by unique amount:', pending[0].order_id);
    return { matched: true, row: pending[0], orderId: pending[0].order_id, method: 'amount_only' };
  }

  // Ambiguous or none — skip
  return {
    matched: false,
    reason: pending.length === 0 ? 'no_amount_match' : 'ambiguous_amount',
    amount
  };
}
```

## Edge Cases

### Wrong Amount (Partial or Incorrect Payment)

**Scenario:** Customer paid 1,800,000 but order is 1,990,000.

**Behavior:**
- `diff > 1000` fails the amount check
- Log the mismatch with order ID and amounts
- Send Telegram alert to seller: "Payment amount mismatch — manual review needed"
- Do NOT update status to `paid`
- Order stays `pending_payment` until resolved

```javascript
if (!matchResult.matched && matchResult.reason === 'amount_mismatch') {
  await sendTelegramAlert(
    `Amount mismatch\nOrder: ${matchResult.orderId}\nExpected: ${matchResult.expectedAmount}d\nReceived: ${matchResult.paidAmount}d`
  );
}
```

### No Order ID in Content

**Scenario:** Customer forgot to include the Order ID in their transfer description.

**Behavior:**
1. Try `matchByAmountOnly()` — if exactly one pending order has that amount, match it
2. If multiple pending orders share the same amount, skip and alert seller
3. If no amount match, log and alert seller for manual lookup

```javascript
// Alert format for no-match
await sendTelegramAlert(
  `No Order ID found in transfer\nAmount: ${webhookBody.transferAmount}d\nContent: "${webhookBody.content}"\nRef: ${webhookBody.referenceCode}\nCheck CRM manually.`
);
```

### Duplicate Webhook (Same Transaction Fires Twice)

**Scenario:** SePay retries the webhook, or network issues cause duplicate delivery.

**Behavior:**
- Check `referenceCode` against a processed set before any matching
- If already processed: return `200` immediately (so SePay stops retrying), log, do nothing

### Content Has Extra Text

**Scenario:** Customer types "DH-LK3M9P2A-K7X2 khoa hoc chay ads sep 2026"

**Behavior:** Regex `/DH-[A-Z0-9]+-[A-Z0-9]+/i` still extracts `DH-LK3M9P2A-K7X2` correctly. No action needed.

### Order Already Paid (Status Not `pending_payment`)

**Scenario:** Webhook fires after order was already manually marked paid, or duplicate payment.

**Behavior:**
- `row.status !== 'pending_payment'` check catches this
- Log and skip silently — no double-delivery
- If status is `paid` and a second payment came in, alert seller (possible accidental double-payment by customer)

## Amount Tolerance

Bank customers sometimes send a slightly different amount due to:
- Bank transfer fees deducted from the transfer (some banks do this)
- Manual entry rounding errors

**Tolerance:** ±1000 VND — matches the vast majority of real-world cases without false positives.

## Deduplication

Use a persistent set of processed `referenceCode` values. For production, store in Google Sheet or a database. For low-volume setups, an in-memory Set works:

```javascript
// In-memory (resets on redeploy — fine for serverless with persistent Sheet)
const processedRefs = new Set();

function isDuplicate(referenceCode) {
  if (processedRefs.has(referenceCode)) return true;
  processedRefs.add(referenceCode);
  // Limit memory usage
  if (processedRefs.size > 5000) {
    processedRefs.delete(processedRefs.values().next().value);
  }
  return false;
}

// Persistent check via Google Sheet (recommended)
async function isDuplicateInSheet(referenceCode, rows) {
  return rows.some(r => r.reference_code === referenceCode);
}
```

## Google Sheet Update

After a successful match, update the row with 3 fields:

| Column | New Value | Description |
|--------|-----------|-------------|
| `status` | `paid` | Confirms payment received |
| `paid_at` | ISO timestamp | `new Date().toISOString()` |
| `reference_code` | e.g. `FT26133...` | SePay bank reference for reconciliation |

```javascript
async function updateSheetRow(sheets, spreadsheetId, rowIndex, referenceCode) {
  const range = `Sheet1!H${rowIndex}:J${rowIndex}`; // Adjust column letters to match your Sheet

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [['paid', new Date().toISOString(), referenceCode]]
    }
  });
}
```

Row index is 1-based and offset by 1 for the header row, so the first data row is row 2.
