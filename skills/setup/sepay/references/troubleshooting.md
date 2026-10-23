# SePay Webhook — Troubleshooting

## User gõ "done" nhưng Portal không thấy webhook log

### Step 1: Check SePay dashboard
- Vào https://my.sepay.vn/webhooks → click webhook → "Xem log"
- Logs hiển thị status code Portal trả:
  - `200 OK` → Portal nhận thành công, vấn đề ở chỗ khác
  - `401 Unauthorized` → API Key sai
  - `404 Not Found` → URL sai
  - `500 Server Error` → Portal lỗi backend
  - No log at all → Webhook chưa active, hoặc filter loại bỏ

### Step 2: Match status code → fix

#### `401 Unauthorized`
- API Key Portal expect ≠ key user paste vào SePay
- Fix:
  ```bash
  # Coach show key đã save:
  cd apps/customer-portal
  vercel env ls | grep SEPAY_WEBHOOK_API_KEY
  vercel env pull
  # Mở .env.local, copy SEPAY_WEBHOOK_API_KEY value
  # User vào SePay dashboard, sửa API Key webhook → save
  ```

#### `404 Not Found`
- URL paste sai
- Fix: Verify URL trên Vercel deploy
  ```bash
  cd apps/customer-portal
  vercel inspect --prod
  # Lấy URL → user sửa trên SePay dashboard
  ```

#### `500 Server Error`
- Portal backend lỗi (vd: Supabase connection fail)
- Fix: Check Vercel function logs
  ```bash
  vercel logs --prod | grep sepay-webhook
  ```
- Common cause: env var Supabase chưa sync
  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  vercel env add SUPABASE_SERVICE_ROLE_KEY production
  vercel deploy --prod  # redeploy với env mới
  ```

#### Không có log nào (webhook chưa fire)
- Webhook chưa active
- Filter loại bỏ payload test
- Fix:
  - Bật `Active` toggle trong SePay dashboard
  - Xoá VA prefix filter nếu có
  - Click "Gửi thử" lại

## Production: payment thật không trigger

Sau khi setup xong, user transfer 10k VND test thật mà Portal không update:

### Check 1: Đúng tài khoản nhận chưa
- Webhook chỉ fire cho account đã chọn trong filter
- Verify: SePay dashboard → Webhook → Filter → đúng account

### Check 2: Code/description đúng format chưa
- Portal match order qua `code` field
- Format chuẩn: `ORDERS{order_id}` hoặc `ORD-{random_8char}`
- Nếu user transfer không có code → Portal không biết match đơn nào → log "unmatched payment"

### Check 3: Order status pending chưa
- Portal chỉ match transactions với orders đang `status: pending`
- Order `completed`, `cancelled`, `expired` → ignore

### Check 4: Amount match
- Portal có thể strict check amount = order amount
- Nếu user transfer 1000 VND thay vì 997000 → mismatch → unmatched

→ Có debug log trong table `webhook_logs` với reason rõ ràng.

## SePay webhook delivery delay

- SePay claim webhook fire ngay khi giao dịch confirm bank
- Thực tế delay ~2-30 giây tuỳ bank
- Nếu test 5 phút mà chưa thấy → check SePay dashboard log có fire chưa

## Multiple webhook (advanced)

User có thể setup nhiều webhook cho nhiều mục đích:
1. Production webhook → Portal production URL
2. Staging webhook → Portal preview URL (test trước khi prod)

Filter theo VA prefix:
- Webhook prod: VA prefix `ORDERS` (orders thật)
- Webhook staging: VA prefix `TEST` (orders test)

## Khi nào cần re-setup webhook

- Portal đổi domain (vd: vercel preview → custom domain)
- Đổi tài khoản ngân hàng nhận tiền
- API Key rò rỉ → generate lại + update cả 2 (Portal + SePay)

User chạy `/setup sepay` để Coach re-run guide.
