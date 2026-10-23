# Customer Portal Setup — Troubleshooting

> Reference này load khi setup CRM gặp lỗi giữa chừng. Coach Agent dùng để diagnose + suggest fix.

## Lỗi chung — diagnose order

Khi setup fail, check theo thứ tự:

1. **Pre-flight**: Node 18+, npm, supabase CLI, vercel CLI có không?
2. **3 tokens**: format đúng chưa? (sbp_, vercel 24 char, re_)
3. **Bước nào fail**: project/db/admin/deploy?
4. **Log gốc**: console output có error message cụ thể không?

## Bước cụ thể fail

### Bước 1 — Pre-flight check fail

```bash
npm run setup:check
```

| Lỗi | Fix |
|-----|-----|
| `node: command not found` | User phải install Node 18+ từ https://nodejs.org |
| `npm version too old` | Update npm: `npm install -g npm@latest` |
| `supabase CLI not found` | Auto-install: `npm install -g supabase` |
| `vercel CLI not found` | Auto-install: `npm install -g vercel` |

### Bước 3 — Supabase project create fail

→ Load chi tiết: `skills/setup/supabase/references/troubleshooting.md`

Common:
- Token expired → re-generate
- Free tier full (2 project) → pause old project hoặc dùng token khác
- Region not available → fallback `us-east-1`

### Bước 4 — Migrations fail

→ Load chi tiết: `skills/setup/supabase/references/troubleshooting.md` (section "Lỗi khi setup:db")

Common:
- Supabase project chưa fully provisioned (đợi 2 phút)
- Docker chưa chạy (cho edge function deploy)
- Migration conflict → reset hoặc tạo project mới

### Bước 6 — Vercel deploy fail

→ Load chi tiết: `skills/setup/vercel/references/troubleshooting.md`

Common:
- Token sai/expired
- `vercel link` cần manual login lần đầu
- env vars chưa sync — re-add từng env

### Bước 7 — SePay webhook không nhận

→ Load chi tiết: `skills/setup/sepay/references/troubleshooting.md`

Common:
- Webhook chưa active
- URL paste sai
- API Key mismatch
- Filter loại bỏ test payload

## Recovery patterns

### Pattern A: Setup fail giữa chừng — clean retry

```bash
# 1. Backup .env.local hiện tại (chứa tokens user đã paste)
cp apps/customer-portal/.env.local apps/customer-portal/.env.local.backup

# 2. Delete Supabase project dở (nếu đã tạo)
# Vào dashboard → Settings → Delete project

# 3. Reset state
cd apps/customer-portal
rm -rf node_modules .vercel dist
npm install

# 4. Re-run setup
npm run setup:project
```

### Pattern B: Token wrong — chỉ update token

```bash
# Mở .env.local
# Replace token cũ bằng token mới
# Re-run setup từ bước đang fail
cd apps/customer-portal
npm run setup:project  # nếu fail ở bước 3
# hoặc
npm run setup:db       # nếu fail ở bước 4
# v.v.
```

### Pattern C: Portal deployed nhưng SePay không kết nối

```bash
# Verify webhook URL trên Vercel deploy
cd apps/customer-portal
vercel inspect --prod
# Lấy production URL

# User vào SePay dashboard, sửa webhook URL khớp
# Test bằng "Gửi thử"
# Coach query Supabase webhook_logs để confirm
```

## Sao lưu trước khi reset

Trước khi delete project hoặc reset, save:

```bash
# Export schema (nếu cần migrate sau)
cd apps/customer-portal
supabase db dump --linked > backup-schema-{date}.sql

# Export data orders/customers (nếu có data thật)
supabase db dump --linked --data-only > backup-data-{date}.sql
```

## Khi nào nên báo support thay vì tự fix

User nên báo support thay vì cố fix tự nếu:

- Setup fail sau khi đã thử Pattern A 2 lần
- Có lỗi không match bất kỳ pattern nào ở trên
- Customer Portal deployed nhưng UI bị broken (CSS/JS không load)
- Webhook nhận được nhưng order không update sau 5 phút

Coach response template:
```
"Em đã thử fix nhưng không xử lý được lỗi này. 
Anh/chị gửi cho team support:
- Lỗi cụ thể: [paste error]
- Bước đang stuck: [X]
- Token nào dùng: (KHÔNG paste token thật — chỉ nói loại)
Email: support@... 
Em sẽ pause setup tại đây, lúc nào có fix thì /coach setup-crm tiếp."
```

## Logs để debug

Khi user báo lỗi, request 3 thứ:

1. **Console output** từ `npm run setup:*` (last 30 dòng)
2. **`.env.local`** với tokens MASKED (chỉ giữ 8 ký tự đầu/cuối)
3. **Step đang fail** (1-7)

Với 3 thông tin này, support team diagnose được 90% case.
