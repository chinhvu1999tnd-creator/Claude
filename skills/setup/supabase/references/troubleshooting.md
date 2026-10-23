# Supabase Setup — Troubleshooting

## Lỗi thường gặp khi `npm run setup:project`

### `Error: Unauthorized — invalid access token`
- Token sai hoặc bị revoke
- Fix: Re-generate token tại https://supabase.com/dashboard/account/tokens
- Update `.env.local`: `SUPABASE_ACCESS_TOKEN=sbp_...`

### `Error: Project limit reached — free tier allows 2 projects`
- User đã có 2 project active
- Fix:
  1. Vào https://supabase.com/dashboard
  2. Tìm project cũ không dùng → Settings → Pause project
  3. Re-run `npm run setup:project`

### `Error: Region 'ap-southeast-1' not available`
- Hiếm — Supabase đôi khi maintenance region
- Fix: Sửa script tạm thời:
  ```js
  // apps/customer-portal/setup.mjs - tìm phần region
  region: 'us-east-1'  // tạm dùng US instead
  ```

### `Error: Database password too weak`
- Setup.mjs auto-generate password, nếu lỗi:
- Fix: Re-run, hoặc set manual:
  ```bash
  export SUPABASE_DB_PASSWORD="StrongPassword123!"
  npm run setup:project
  ```

### `Project provisioning timed out`
- Supabase đôi khi mất 5-10 phút để provision
- Fix: Đợi 5 phút, sau đó:
  ```bash
  npm run setup:check
  ```
  Nếu project đã ready → continue với `npm run setup:db`

## Lỗi khi `npm run setup:db`

### `Error: supabase CLI not found`
- Fix: `npm install -g supabase`
- Verify: `supabase --version`

### `Error: Cannot connect to database`
- Project chưa fully provisioned
- Fix: Đợi 2 phút, retry

### `Migration failed: relation "users" already exists`
- Project đã có data từ lần setup trước
- Fix:
  ```bash
  cd apps/customer-portal/supabase
  supabase db reset --linked  # WARNING: xoá data
  ```
- Hoặc tạo project Supabase mới (clean slate)

### `Edge function deploy failed: docker not running`
- Một số phiên bản CLI cần Docker
- Fix:
  - Install Docker Desktop, start nó
  - Hoặc dùng `--use-api` flag: `supabase functions deploy --use-api sepay-webhook`

## Manual recovery

Nếu setup bị fail giữa chừng, manual cleanup:

```bash
# 1. Xoá .env.local (sẽ regenerate)
rm apps/customer-portal/.env.local

# 2. Delete Supabase project (nếu đã tạo dở)
# Vào dashboard → Project Settings → Delete project

# 3. Re-run từ đầu
cd apps/customer-portal
npm run setup:project
```

## Free tier limits

Quan trọng để user biết:

| Resource | Free tier limit |
|----------|-----------------|
| Database storage | 500 MB |
| Auth users | 50,000 MAU |
| Edge function invocations | 500K/month |
| Realtime concurrent connections | 200 |
| Storage | 1 GB |
| Bandwidth | 5 GB/month |

→ Đủ cho ~5,000 khách. Khi scale lên upgrade Pro $25/month.

## Khi nào nên upgrade Supabase Pro

- Khách đông (>10k MAU)
- Database > 500MB (lúc này >50,000 orders)
- Cần PITR backup
- Cần custom domain cho Auth
