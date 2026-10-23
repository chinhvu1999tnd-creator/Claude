# Vercel Deploy — Troubleshooting

## Lỗi `npm run setup:deploy`

### `Error: vercel CLI not found`
- Fix: Script tự install qua `npm install -g vercel`
- Verify: `vercel --version`

### `Error: No project linked`
- `vercel link` fail
- Fix: Manual link:
  ```bash
  cd apps/customer-portal
  vercel login  # mở browser, login với account của user
  vercel link
  # Chọn: Yes link to existing project? No
  # Project name: ai-business-kit-{slug}
  # Team: (chọn personal account hoặc team)
  ```
- Re-run `npm run setup:deploy`

### `Error: env var NEXT_PUBLIC_SUPABASE_URL not set`
- env vars chưa sync từ .env.local
- Fix:
  ```bash
  cd apps/customer-portal
  vercel env pull  # lấy env hiện tại
  # rồi push lại:
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  # paste value khi prompted
  ```

### `Error: Build failed — TypeScript error`
- Build production strict hơn dev
- Fix: Run local build trước
  ```bash
  cd apps/customer-portal
  npm run build  # check lỗi local
  ```
  Fix lỗi TypeScript, sau đó deploy lại

### `Error: Deployment exceeded 100MB limit`
- Hiếm — Portal nhỏ hơn 50MB
- Có thể do user thêm asset lớn vào public/
- Fix: Xoá assets không cần trong public/

### Deploy timeout
- Vercel free tier có build timeout 45 phút
- Portal mặc định build trong ~2 phút
- Nếu timeout: check `npm run build` local có chạy bình thường không

## Sync env vars sau khi deploy

Khi user đổi env (vd: thêm RESEND_API_KEY mới):

```bash
cd apps/customer-portal
vercel env add RESEND_API_KEY production
# paste value

# Trigger redeploy để pickup env mới:
vercel deploy --prod
```

## Custom domain (advanced)

Nếu user muốn `portal.business-cua-anh.com`:

1. Vào https://vercel.com/dashboard → project → Settings → Domains
2. Add domain: `portal.business-cua-anh.com`
3. Vercel show DNS records cần add (A hoặc CNAME)
4. Add records vào DNS provider của user (Cloudflare, Namecheap, etc.)
5. Đợi DNS propagate (~10-30 phút)
6. Vercel auto-issue SSL

## Khi nào nên upgrade Vercel Pro

- Đông traffic (>100GB bandwidth/month)
- Cần >100 GB-hour serverless function execution
- Cần team collaboration
- Cần password protection cho preview deployments

Pro: $20/month — đủ cho Portal scale lên đáng kể.
