# Cách lấy Vercel Access Token

> Token này cho phép Setup Agent deploy Customer Portal tự động. Chỉ cần lấy **1 lần**.

## 3 bước (~2 phút)

### Bước 1: Mở Vercel Tokens
- URL: https://vercel.com/account/tokens
- Đăng nhập (email, GitHub, hoặc GitLab)

### Bước 2: Create token
- Click **"Create Token"** (góc phải trên)
- **Name**: `AI Business Kit`
- **Scope**: `Full Account` (để deploy + manage env vars)
- **Expiration**: `No Expiration`
- Click **"Create"**

### Bước 3: Copy ngay
- Token hiển thị **1 lần** — copy ngay
- Format: chuỗi 24 ký tự alphanumeric
- Paste vào Claude Code chat

> ⚠️ Đóng tab sau khi copy — token có quyền full account.

## Permission

Token này có quyền:
- ✅ Tạo project mới
- ✅ Deploy code lên Vercel
- ✅ Set/get env variables
- ✅ Manage domains
- ❌ KHÔNG access billing/team management

## Revoke

https://vercel.com/account/tokens → token → "Revoke"

## FAQ

**Q: Free tier có giới hạn gì?**
A:
- Bandwidth: 100 GB/month
- Builds: 6,000 phút/month
- Serverless functions: 100 GB-hour
- Deployments: unlimited
→ Đủ cho Customer Portal với ~50,000 visits/month

**Q: Có hỗ trợ custom domain không?**
A: Có. Free tier cho phép custom domain. Cần verify DNS qua Vercel dashboard.

**Q: Token có expire không?**
A: Tuỳ chọn lúc tạo. Nếu chọn "No Expiration" thì dùng mãi.
