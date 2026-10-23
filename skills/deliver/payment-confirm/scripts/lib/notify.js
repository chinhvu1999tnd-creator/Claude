/**
 * notify.js
 * After payment confirmed:
 * 1. Send Telegram notification to seller
 * 2. Trigger Deliver Agent (Option A: Telegram, Option B: webhook)
 *
 * Requires env vars:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *   DELIVER_WEBHOOK_URL (optional — for Option C direct trigger)
 */

const TELEGRAM_API = 'https://api.telegram.org';

function formatVND(amount) {
  return parseInt(amount).toLocaleString('vi-VN') + 'đ';
}

function formatDatetime(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

/**
 * Send message via Telegram Bot API
 */
async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram not configured — skipping notification');
    return;
  }

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Telegram send failed:', err);
  }
}

/**
 * Build order confirmation message (Vietnamese)
 */
function buildConfirmMessage(order, payload) {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`;

  return [
    '<b>DON MOI XAC NHAN THANH TOAN</b>',
    '',
    `Ma don: <code>${order.order_id}</code>`,
    `Khach: <b>${order.name || order.ho_ten || 'N/A'}</b>`,
    `Email: ${order.email || 'N/A'}`,
    `San pham: ${order.product || order.san_pham || 'N/A'}`,
    `So tien: <b>${formatVND(payload.transferAmount)}</b>`,
    `Thoi gian: ${formatDatetime(payload.transactionDate)}`,
    `Ma GD: <code>${payload.referenceCode}</code>`,
    '',
    `<a href="${sheetUrl}">Xem don hang →</a>`,
  ].join('\n');
}

/**
 * Trigger deliver webhook (Option C)
 */
async function triggerDeliver(order) {
  const deliverUrl = process.env.DELIVER_WEBHOOK_URL;
  if (!deliverUrl) return;

  await fetch(deliverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: order.name || order.ho_ten,
      email: order.email,
      product: order.product || order.san_pham,
      order_id: order.order_id,
      amount: order.amount,
    }),
  });
}

/**
 * Main: notify seller + trigger delivery
 */
export async function notifyConfirmed(order, payload) {
  const message = buildConfirmMessage(order, payload);

  // Send Telegram notification
  await sendTelegram(message);

  // Trigger deliver if webhook URL configured
  await triggerDeliver(order);
}
