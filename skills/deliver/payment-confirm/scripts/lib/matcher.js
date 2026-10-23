/**
 * matcher.js
 * Match a SePay webhook payload to an order in Google Sheet CRM
 *
 * Requires env vars:
 *   GOOGLE_SHEET_ID
 *   GOOGLE_SERVICE_ACCOUNT_KEY (JSON string of service account credentials)
 */

import { google } from 'googleapis';

const ORDER_ID_REGEX = /DH-[A-Z0-9]+-[A-Z0-9]+/;
const AMOUNT_TOLERANCE = 1000; // VND — some banks deduct fee from amount
const SHEET_NAME = 'Orders'; // Tab name in Google Sheet

/**
 * Extract Order ID from transfer content/description
 */
function extractOrderId(content = '') {
  const match = content.toUpperCase().match(ORDER_ID_REGEX);
  return match ? match[0] : null;
}

/**
 * Get Google Sheets client
 */
async function getSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

/**
 * Read all orders from Google Sheet
 * Returns array of objects with header row as keys
 */
async function getOrders(sheets) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A1:Z1000`,
  });

  const rows = res.data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'));
  return rows.slice(1).map((row, index) => {
    const obj = { _row: index + 2 }; // 1-indexed, +1 for header
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}

/**
 * Update order status in Google Sheet
 */
async function updateOrderStatus(sheets, rowIndex, referenceCode) {
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Find column indices for status, paid_at, reference_code
  // Assumes columns: ..., status, paid_at, reference_code
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!H${rowIndex}:J${rowIndex}`, // Adjust columns as needed
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['paid', now, referenceCode]],
    },
  });
}

/**
 * Main matching function
 */
export async function matchOrder(payload) {
  const { content, transferAmount, referenceCode, transactionDate } = payload;

  // 1. Check deduplication — already processed this reference?
  // Simple approach: we'll check during sheet lookup

  // 2. Extract Order ID from transfer content
  const orderId = extractOrderId(content);

  const sheets = await getSheetsClient();
  const orders = await getOrders(sheets);

  // 3. Find matching order
  let matchedOrder = null;

  if (orderId) {
    // Primary: match by Order ID
    matchedOrder = orders.find(o =>
      o.order_id === orderId &&
      o.status === 'pending_payment'
    );
  }

  if (!matchedOrder) {
    // Fallback: match by amount (only if unique)
    const amountMatches = orders.filter(o =>
      o.status === 'pending_payment' &&
      Math.abs(parseInt(o.amount || 0) - transferAmount) <= AMOUNT_TOLERANCE
    );
    if (amountMatches.length === 1) {
      matchedOrder = amountMatches[0];
    }
  }

  if (!matchedOrder) {
    return {
      matched: false,
      reason: orderId
        ? `Order ID ${orderId} not found or already paid`
        : `No unique amount match for ${transferAmount}VND`,
    };
  }

  // 4. Verify amount
  const expectedAmount = parseInt(matchedOrder.amount || 0);
  if (Math.abs(expectedAmount - transferAmount) > AMOUNT_TOLERANCE) {
    return {
      matched: false,
      reason: `Amount mismatch: expected ${expectedAmount}, got ${transferAmount}`,
    };
  }

  // 5. Check duplicate referenceCode
  const alreadyProcessed = orders.some(o => o.reference_code === referenceCode && o.status === 'paid');
  if (alreadyProcessed) {
    return { matched: false, reason: `Duplicate: referenceCode ${referenceCode} already processed` };
  }

  // 6. Update sheet status
  await updateOrderStatus(sheets, matchedOrder._row, referenceCode);

  return { matched: true, order: matchedOrder };
}
