# Mini CRM — Setup Guide

Google Sheets + Apps Script. Không cần third-party. Không cần email. Không cần CLI.

## Setup (5 phút)

### Bước 1 — Tạo Google Sheet

1. Vào [sheets.google.com](https://sheets.google.com) → **Tạo bảng tính mới**
2. Đặt tên: `AI Agent Business Kit — CRM`

### Bước 2 — Mở Apps Script từ trong Sheet

3. Trong Sheet: **Extensions → Apps Script**
   (Script editor mở, tự động gắn vào Sheet này — không cần Drive scope)
4. Đặt tên project: `AI Agent CRM`
5. Xoá toàn bộ code mặc định
6. Copy toàn bộ nội dung `Bootstrap.gs` → Paste → **Save** (Ctrl+S)

### Bước 3 — Khởi tạo 4 tab

7. Chọn function `setup` → **▶ Run**
8. Lần đầu: **Review permissions → Allow**
   - Chỉ xin 2 quyền: **Google Sheets** + **External requests** (Telegram)
   - Không có Gmail, không có Drive
9. Kiểm tra Log: phải thấy `✅ CRM đã sẵn sàng!`

### Bước 4 — Deploy Web App

10. **Deploy → New deployment**
    - Type: **Web app**
    - Execute as: **Me**
    - Who has access: **Anyone**
11. Copy **Web App URL** → dán vào `.env`:
    ```
    CRM_WEBHOOK_URL=https://script.google.com/macros/s/AKfycby.../exec
    ```

---

## Sau Khi Setup

### Điền Funnel Settings

Mở Google Sheet → tab **🎯 Funnel Settings** → thêm row cho từng funnel:

| Cột | Điền gì |
|-----|---------|
| Funnel Slug | Tên ngắn, không dấu. VD: `claude-ai-blueprint` |
| Tên hiển thị | Tên đầy đủ trong notification |
| Type | `leads` / `sales` / `webinar` / `booking` |
| Link nhóm Zalo | URL nhóm Zalo để giao tài liệu |
| Link Telegram | URL channel/group Telegram |
| Tin nhắn giao tài liệu | Hiển thị trên thank-you page (optional) |
| Trạng thái | `🟢 Active` để kích hoạt |
| Telegram notify | `TRUE` / `FALSE` |

### Kết Nối Form

Trong opt-in page HTML, thay `[CRM_WEBHOOK_URL]` bằng URL vừa deploy:

```javascript
const CRM_WEBHOOK = 'https://script.google.com/macros/s/AKfycby.../exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch(CRM_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({
      action:       'lead',
      name:         form.querySelector('[name="name"]').value,
      phone:        form.querySelector('[name="phone"]').value,
      source:       'claude-ai-blueprint',  // ← funnel slug
      utm_source:   new URLSearchParams(location.search).get('utm_source')   || '',
      utm_medium:   new URLSearchParams(location.search).get('utm_medium')   || '',
      utm_campaign: new URLSearchParams(location.search).get('utm_campaign') || '',
    }),
  });
  window.location.href = '/thank-you/';
});
```

### Setup Telegram (optional)

Sau khi có `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` trong `.env`, chạy trong Apps Script editor:

```javascript
saveTelegramConfig('YOUR_BOT_TOKEN', 'YOUR_CHAT_ID');
testTelegramConnection();
```

---

## Data Flow

```
Form submit (opt-in page)
    POST {action:"lead", name, phone, source, utm_*}
    → Apps Script doPost()
    → Check duplicate (theo phone)
    → Ghi Leads tab
    → Telegram notify (nếu bật)
    → Return {status: 200}
    → JS redirect → /thank-you/
    → Thank-you page hiển thị nút Zalo / Telegram để nhận tài liệu

Đơn hàng (SePay webhook)
    POST {action:"order", phone, product, amount, order_id}
    → Apps Script doPost()
    → Ghi Customers tab + update Leads status → Converted
    → Telegram notify
```

---

## Files

| File | Mô tả |
|------|-------|
| `Bootstrap.gs` | Toàn bộ CRM trong 1 file — paste vào script.google.com |
