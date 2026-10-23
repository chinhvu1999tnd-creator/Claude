# Cách lấy SePay API Token (cho Revenue Query)

> Token này cho phép query doanh thu + số dư từ SePay. KHÁC với webhook secret.

## ⚠️ Phân biệt 2 loại SePay credential

| Credential | Dùng cho | Lấy ở đâu |
|-----------|----------|-----------|
| `SEPAY_API_TOKEN` | Query transactions/revenue/balance | my.sepay.vn → API Access |
| `SEPAY_WEBHOOK_API_KEY` | Auth webhook nhận payment | Tự generate khi setup webhook |

→ Đây là hướng dẫn lấy `SEPAY_API_TOKEN` (query).

## 3 bước (~2 phút)

### Bước 1: Login SePay
- URL: https://my.sepay.vn
- Đăng nhập tài khoản

### Bước 2: Tạo API Token
- Sidebar → **"API Access"** (hoặc "Cấu hình" → "API")
- Click **"Tạo API Token"** / "Add API Token"
- Đặt tên: `AI Business Kit - Revenue Query`
- Permission: **Read transactions** (đủ — không cần write)
- Copy token

### Bước 3: Add vào .env
```
SEPAY_API_TOKEN=your_token_here
```

## Account number

Revenue query cần biết account_number nhận tiền. Lấy từ:
- BUSINESS.md Section 7 (SePay account)
- Hoặc .env (nếu đã lưu)
- Hoặc SePay dashboard → Tài khoản ngân hàng

Nếu chỉ có 1 account → không cần truyền account_number (API trả tất cả).

## Test token

```bash
node -e "
import('./skills/integrations/sepay-query/sepay-client.mjs').then(async m => {
  const bal = await m.getBalance();
  console.log('Số dư:', m.formatVND(bal));
});
"
```

## Free / Rate limit

- SePay API token miễn phí với tài khoản SePay
- Rate limit: tài liệu không nêu rõ, nhưng query mỗi vài phút là an toàn
- Max 5000 transactions/request

## Troubleshooting

| Lỗi | Fix |
|-----|-----|
| 401 Unauthorized | Token sai/hết hạn → tạo lại |
| Empty result | Check account_number đúng + có giao dịch trong range |
| Permission denied | Token cần quyền "Read transactions" |
