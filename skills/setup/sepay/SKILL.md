---
name: setup-sepay
description: Hướng dẫn user paste webhook URL vào SePay dashboard (manual step) + verify webhook nhận được. Đây là bước duy nhất user phải tự làm trong setup CRM Portal.
---

# Setup SePay Skill

## Tại sao manual?

SePay **KHÔNG có API set webhook URL** (kiểm tra docs: https://docs.sepay.vn/tich-hop-webhooks.html). User phải tự vào dashboard paste URL.

Coach giảm thiểu friction xuống ~3 phút bằng cách:
1. **Generate API Key sẵn** — random 32-char, save vào Supabase env
2. **Copy URL + Key vào clipboard** (Mac: `pbcopy`, Windows: `clip.exe`)
3. **Hướng dẫn từng bước có ảnh chụp** (references/configure-webhook.md)
4. **Verify webhook** sau khi user save

## Flow chi tiết

### Bước 1: Coach generate credentials

```js
// Coach tự generate khi setup tới bước này
const SEPAY_WEBHOOK_API_KEY = crypto.randomBytes(32).toString('hex')
// Save vào Supabase env qua Vercel:
//   vercel env add SEPAY_WEBHOOK_API_KEY production
// Webhook URL từ Vercel deploy:
const WEBHOOK_URL = `${CUSTOMER_PORTAL_URL}/api/sepay-webhook`
```

### Bước 2: Copy vào clipboard

```bash
# Mac
echo "$WEBHOOK_URL" | pbcopy

# Windows (qua bash WSL hoặc PowerShell)
echo "$WEBHOOK_URL" | clip.exe

# Linux
echo "$WEBHOOK_URL" | xclip -selection clipboard
```

### Bước 3: Hướng dẫn user

Coach show step-by-step (kèm screenshot guide nếu có):

```
📋 Cấu hình SePay webhook (~3 phút):

1. Mở: https://my.sepay.vn/webhooks
2. Click 'Tạo webhook mới' (nút xanh góc phải)
3. Form 4 trang xuất hiện:

   Trang 1: URL
   ─────────
   - URL: [đã copy vào clipboard — paste Ctrl+V hoặc Cmd+V]
   - Method: POST (đã default)
   → Click Next

   Trang 2: Authentication  
   ────────────────────
   - Chọn: 'API Key'
   - API Key: [em sẽ show key — paste vào]
   - Header name: Authorization (default)
   → Click Next

   Trang 3: Filter
   ──────────────
   - Tài khoản: Chọn tài khoản nhận tiền của anh/chị
   - VA prefix: để trống (nhận tất cả)
   → Click Next

   Trang 4: Confirm
   ──────────────
   - Review thông tin
   - Click 'Lưu webhook'

4. Sau khi save, click nút 'Gửi thử' (góc phải webhook row)
5. Quay lại Claude Code, gõ 'done' cho em.
```

Coach show API Key (chỉ 1 lần, sau đó hide vì sensitive):

```
🔑 API Key của anh/chị (paste vào Trang 2 trên SePay):
{SEPAY_WEBHOOK_API_KEY}

⚠️ Sau khi paste xong KHÔNG share key này cho ai khác.
```

### Bước 4: Verify webhook nhận được

User gõ "done" → Coach verify:

```js
// Coach query Supabase
const result = await supabase
  .from('webhook_logs')
  .select('*')
  .eq('source', 'sepay')
  .order('created_at', { ascending: false })
  .limit(1)

if (result.data && result.data.length > 0) {
  // ✓ Webhook hoạt động
  Coach: "✓ Webhook test received tại [time]. SePay đã connect với Portal."
} else {
  Coach: "Em chưa thấy webhook nào. Anh/chị check lại:
   (A) Đã click 'Gửi thử' trên SePay dashboard chưa?
   (B) URL paste có đúng không? URL phải là: {WEBHOOK_URL}
   (C) API Key paste có đúng không?"
}
```

## References

- `references/configure-webhook.md` — Step-by-step chi tiết với screenshot description
- `references/test-webhook.md` — Cách test bằng SePay "Gửi thử" + verify Portal nhận
- `references/troubleshooting.md` — Lỗi common: 401, 404, signature mismatch

## Hard Constraint

Coach **PHẢI dừng setup tại bước này** nếu webhook không verify được. Không skip qua plan-generator vì:
- Sales Funnel sẽ build payment flow giả định webhook works
- Nếu webhook fail, payment đến nhưng Portal không nhận → đơn miss
- Khách BASIC sẽ complain "kit không nhận đơn"

→ Verify webhook = blocker bắt buộc trước khi sang Mode 3.

## Re-run sau này

User có thể `/setup sepay` để re-configure webhook (vd: đổi tài khoản ngân hàng, đổi domain Portal).
