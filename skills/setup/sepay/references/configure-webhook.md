# Cấu hình SePay Webhook — Step-by-step

> SePay không có API set webhook → user phải tự paste URL vào dashboard. Hướng dẫn này có chi tiết từng click.

## Trước khi bắt đầu

Coach cần đã chuẩn bị sẵn:
- ✅ Webhook URL: `https://{vercel-domain}/api/sepay-webhook` (đã copy vào clipboard)
- ✅ API Key: random 32-char (đã save vào Supabase env)

## Step-by-step (3 phút)

### 1. Login SePay dashboard
- URL: https://my.sepay.vn
- Đăng nhập bằng email + password đã đăng ký SePay

### 2. Vào Webhooks page
- Sidebar trái → chọn **"Webhooks"**
- Hoặc URL trực tiếp: https://my.sepay.vn/webhooks

### 3. Click "Tạo webhook mới"
- Nút xanh góc phải trên
- Form modal/wizard 4 trang xuất hiện

### 4. Trang 1 — URL & Method
```
┌─────────────────────────────────────────┐
│ Bước 1/4: URL endpoint                  │
├─────────────────────────────────────────┤
│                                          │
│  URL: [_______________________________] │
│       Paste webhook URL ở đây            │
│                                          │
│  Method:  ◉ POST  ◯ GET                 │
│                                          │
│  [Hủy]                       [Tiếp →]   │
└─────────────────────────────────────────┘
```
- **URL**: Paste (Cmd+V / Ctrl+V) — đã copy sẵn trong clipboard
- **Method**: Để mặc định **POST**
- Click **"Tiếp"**

### 5. Trang 2 — Authentication
```
┌─────────────────────────────────────────┐
│ Bước 2/4: Xác thực                      │
├─────────────────────────────────────────┤
│  Phương thức:                            │
│   ◯ Không xác thực                      │
│   ◯ HMAC-SHA256                          │
│   ◉ API Key                              │
│   ◯ OAuth 2.0                            │
│                                          │
│  Header name: Authorization              │
│  Value template: Apikey {API_KEY}        │
│                                          │
│  API Key: [_______________________]      │
│           Paste API Key của Portal       │
│                                          │
│  [← Quay lại]                [Tiếp →]   │
└─────────────────────────────────────────┘
```
- Chọn **"API Key"**
- **API Key**: Paste key Coach đã generate (32 ký tự)
- Header name và Value template giữ mặc định
- Click **"Tiếp"**

### 6. Trang 3 — Filter (tài khoản nhận tiền)
```
┌─────────────────────────────────────────┐
│ Bước 3/4: Bộ lọc                        │
├─────────────────────────────────────────┤
│  Tài khoản:                              │
│   [Dropdown - chọn account]              │
│                                          │
│  VA prefix (mã giao dịch):               │
│   [____________________]                 │
│   (Để trống nếu nhận tất cả)             │
│                                          │
│  Số tiền tối thiểu:                      │
│   [____________________] VND             │
│                                          │
│  [← Quay lại]                [Tiếp →]   │
└─────────────────────────────────────────┘
```
- **Tài khoản**: Chọn account ngân hàng nhận tiền cho business
- **VA prefix**: Để trống (Portal handle prefix linh động qua `code` field trong payload)
- **Số tiền tối thiểu**: Để trống hoặc 1000 (lọc giao dịch test 1k)
- Click **"Tiếp"**

### 7. Trang 4 — Confirm & Save
```
┌─────────────────────────────────────────┐
│ Bước 4/4: Xác nhận                      │
├─────────────────────────────────────────┤
│  Review:                                 │
│   URL: https://....vercel.app/api/...    │
│   Method: POST                           │
│   Auth: API Key                          │
│   Tài khoản: VCB-1234...                 │
│                                          │
│  ☐ Webhook active (bật ngay sau save)   │
│                                          │
│  [← Quay lại]              [Lưu]        │
└─────────────────────────────────────────┘
```
- Review thông tin
- Tick **"Webhook active"**
- Click **"Lưu"**

### 8. Test webhook bằng "Gửi thử"

Sau khi save, webhook xuất hiện trong list:

```
┌──────────────────────────────────────────────────────┐
│ Webhook                                              │
├──────────────────────────────────────────────────────┤
│ ID: wh_abc123                                        │
│ URL: https://....vercel.app/api/sepay-webhook        │
│ Status: ✓ Active                                    │
│                                                      │
│ [Gửi thử]  [Xem log]  [Sửa]  [Xoá]                  │
└──────────────────────────────────────────────────────┘
```
- Click **"Gửi thử"** — SePay sẽ gửi 1 payload mẫu cho Portal
- Quay lại Claude Code, gõ "**done**"

## Payload mẫu SePay gửi (FYI)

```json
{
  "id": 123456,
  "gateway": "VCB",
  "transactionDate": "2026-05-27 14:30:00",
  "accountNumber": "1234567890",
  "code": "ORDERS001",
  "content": "ORDERS001",
  "transferType": "in",
  "description": "MBVCB.123456",
  "transferAmount": 997000,
  "referenceCode": "FT26148123456"
}
```

Portal `api/sepay-webhook` endpoint sẽ:
1. Verify `Authorization` header = `Apikey {SEPAY_WEBHOOK_API_KEY}`
2. Parse `code` để match với pending order
3. Update order status → paid
4. Trigger delivery email via Resend
5. Trigger Telegram alert cho owner

## Sau khi xong

Anh/chị có thể test bằng cách:
1. Tạo 1 order test trong Portal dashboard
2. Chuyển khoản thật vào account đã setup (chuyển nhỏ 1000-2000 VND)
3. Trong vòng 5 giây Portal nhận webhook + update order
4. Khách (anh/chị) nhận email delivery
5. Telegram bot ping owner

Test thành công = setup hoàn tất.
