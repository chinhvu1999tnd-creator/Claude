---
name: telegram-notification
description: "Setup Telegram bot để nhận thông báo real-time khi có lead mới, đơn hàng mới, hoặc abandoned cart. Free, không cần backend server."
version: 1.0.0
agent: funnel
tags: [telegram, notification, webhook, real-time, alerts]
---

# Telegram Notification Skill

Telegram bot làm channel notify lead/đơn hàng real-time. Miễn phí, setup 3 phút, không cần backend riêng.

---

## Khi Nào Dùng

- User muốn nhận noti ngay khi có lead opt-in trên landing page
- User muốn nhận noti khi có thanh toán SePay thành công
- User muốn alert team khi có abandoned cart
- Setup lần đầu — sau đó mọi funnel tự động đẩy noti về

---

## Khi Nào KHÔNG Dùng

- Email-only workflow (Mailchimp / ConvertKit notify đủ rồi)
- High-volume noti (>100/giờ) — Telegram rate limit
- Sensitive data cần audit trail — dùng CRM thay vì Telegram

---

## Setup Flow

### Cách 1 — Script tự động (khuyến nghị)

```bash
node skills/funnel/deploy/scripts/setup-telegram.js
```

Script sẽ:
1. Hỏi BotFather token (user lấy từ @BotFather trên Telegram)
2. Tự động lấy Chat ID khi user nhắn `/start` vào bot
3. Test gửi noti
4. Ghi `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` vào `.env`

### Cách 2 — Manual

User tự làm 4 bước:

```
1. Mở Telegram → tìm @BotFather → /newbot → đặt tên bot
2. Copy BOT_TOKEN (dạng "123456:ABC-DEF...")
3. Mở bot vừa tạo → nhấn Start → nhắn /start
4. Lấy Chat ID:
   curl "https://api.telegram.org/bot<TOKEN>/getUpdates" | grep '"id"'
   → tìm số "id" trong "chat" → đó là CHAT_ID
5. Thêm vào .env:
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=987654321
```

### Test sau setup

```bash
node skills/funnel/deploy/scripts/setup-telegram.js --test
```

Nếu thấy noti hiện trong Telegram → done.

---

## Integration vào Funnel

### 1. Lead opt-in form → Telegram noti

Inject vào form handler (sau khi POST CRM webhook):

```js
async function notifyTelegram(message) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // graceful skip nếu chưa setup

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    chatId,
      text:       message,
      parse_mode: 'HTML',
    }),
  });
}

// Khi có lead:
await notifyTelegram(
  `🎯 <b>Lead mới</b>\n` +
  `Email: ${email}\n` +
  `Lead magnet: ${leadMagnetName}\n` +
  `Time: ${new Date().toLocaleString('vi-VN')}`
);
```

### 2. SePay webhook → Telegram noti

Trong webhook handler của order page:

```js
await notifyTelegram(
  `💰 <b>Đơn hàng mới</b>\n` +
  `Sản phẩm: ${productName}\n` +
  `Số tiền: ${amount.toLocaleString('vi-VN')}đ\n` +
  `Khách: ${customerName} (${customerEmail})\n` +
  `Thời gian: ${new Date().toLocaleString('vi-VN')}`
);
```

### 3. Abandoned cart alert

Trigger sau X giờ user click order button nhưng không thanh toán:

```js
await notifyTelegram(
  `⚠️ <b>Abandoned cart</b>\n` +
  `Khách: ${name} (${phone})\n` +
  `Sản phẩm: ${product}\n` +
  `Stuck tại bước: ${stuckStep}\n` +
  `Time stuck: ${hoursAgo}h`
);
```

---

## Message Format Best Practices

**Dùng emoji prefix để scan nhanh:**
- 🎯 Lead mới
- 💰 Đơn hàng
- ⚠️ Abandoned / cảnh báo
- ✅ Thanh toán xác nhận
- ❌ Lỗi / failed
- 📊 Báo cáo daily/weekly

**HTML format trong Telegram:**
- `<b>bold</b>`, `<i>italic</i>`, `<code>code</code>`
- `<a href="https://...">link</a>` — useful cho link sang CRM/admin panel

**Giới hạn:**
- Max 4096 chars/message
- Rate limit: 30 msg/giây cho 1 bot — không lo trừ khi spam

---

## Multi-Chat (team notification)

Nếu cần noti đến nhiều người (team), tạo Telegram group → add bot vào group → dùng group's Chat ID.

```js
// .env
TELEGRAM_CHAT_IDS=123456,789012,345678

// Code
const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',');
await Promise.all(chatIds.map(id => sendToChat(id, message)));
```

Hoặc chia nhóm theo loại noti:
```
TELEGRAM_CHAT_ID_LEADS=...    ← sales team
TELEGRAM_CHAT_ID_ORDERS=...   ← founder + finance
TELEGRAM_CHAT_ID_ERRORS=...   ← tech team
```

---

## Debugging

### Bot không gửi noti
1. Check `.env` có `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` chưa
2. Test với `node setup-telegram.js --test`
3. Verify user đã `/start` bot ít nhất 1 lần (bot không gửi cho user chưa start)

### Lỗi 403 Forbidden
- User đã block bot → user phải unblock và `/start` lại

### Lỗi 400 Bad Request
- Sai `chat_id` format (phải là số, không phải username)
- Lỗi HTML syntax trong message

### Verify token còn valid
```bash
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

---

## .env Variables

| Var | Required | Mô tả |
|-----|----------|-------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Token từ @BotFather (giữ secret) |
| `TELEGRAM_CHAT_ID` | ✅ | Chat ID nhận noti (số nguyên) |
| `TELEGRAM_CHAT_IDS` | Optional | Comma-separated nhiều ID nếu cần multi-chat |

---

## Tích Hợp Với Skills Khác

- `funnel/crm/SKILL.md` — sau khi push lead vào CRM, call `notifyTelegram()`
- `deliver/payment-confirm/SKILL.md` — sau khi SePay webhook xác nhận → noti
- `sales/abandoned-order/SKILL.md` — trigger alert khi cart abandoned
- `analysis/revenue-report/SKILL.md` — daily/weekly summary qua Telegram

---

## Files Liên Quan

| File | Vai trò |
|------|---------|
| `skills/funnel/deploy/scripts/setup-telegram.js` | Interactive setup script |
| `.env` (project root) | Lưu `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` |
