---
name: setup-crm-portal
description: Setup Customer Portal end-to-end — gọi apps/customer-portal/setup.mjs theo đúng thứ tự, hỏi 3 API tokens, deploy Supabase + Vercel, hướng dẫn user paste SePay webhook. ~15-20 phút từ A đến Z.
---

# Setup CRM Portal Skill

## Khi Nào Dùng

- Coach Agent gọi trong onboarding flow (Bước 2 của `/start`)
- User gõ `/coach setup-crm` để re-run setup
- User gõ `/setup crm` direct

---

## Yêu cầu trước khi chạy

User PHẢI có:
1. **Supabase account** — https://supabase.com (free tier OK)
2. **Vercel account** — https://vercel.com (free tier OK)
3. **Resend account** — https://resend.com (free 3000 emails/tháng)
4. **SePay account** — https://my.sepay.vn (đã có VietQR sẵn sàng)

Local máy user phải có:
- **Node.js 18+** — check qua `node --version`
- **npm** — đi kèm Node
- **Supabase CLI** — sẽ check + auto-install nếu thiếu

---

## Flow 7 bước (~15-20 phút)

### Pre-flight check (30 giây)

```
Coach: "Em check môi trường trước..."
  → cd apps/customer-portal && npm run setup:check
  → Verify: Node 18+, npm, supabase CLI
  → Nếu thiếu Supabase CLI: tự install qua `npm install -g supabase`
  → Nếu Node < 18: STOP, hỏi user upgrade
```

### Bước 1: Lấy 3 API tokens (~5 phút user effort)

Coach show 3 link rõ ràng:

```
Em cần 3 token từ anh/chị (lần đầu duy nhất). Mỗi cái 2 phút:

[1/3] SUPABASE ACCESS TOKEN
  → Mở: https://supabase.com/dashboard/account/tokens
  → Click "Generate new token"
  → Name: "AI Business Kit"
  → Copy token (bắt đầu bằng `sbp_...`)
  → Paste cho em ở đây.
```

User paste → Coach save vào memory + show next.

```
[2/3] VERCEL TOKEN
  → Mở: https://vercel.com/account/tokens
  → Click "Create Token"
  → Name: "AI Business Kit"
  → Scope: "Full Account"
  → Expiration: "No expiration"
  → Copy → paste cho em.
```

```
[3/3] RESEND API KEY (cho magic link email)
  → Mở: https://resend.com/api-keys
  → Click "Create API Key"
  → Name: "AI Business Kit"
  → Permission: "Sending access"
  → Copy `re_...` → paste cho em.
```

→ Tham khảo chi tiết: `skills/setup/supabase/references/get-access-token.md`, `skills/setup/vercel/references/get-token.md`, `skills/setup/resend/references/get-api-key.md`

### Bước 2: Generate .env.local (10 giây)

Coach tạo file `apps/customer-portal/.env.local` với:

```bash
# Supabase
SUPABASE_ACCESS_TOKEN={user paste}
# Project URL + keys sẽ fill sau setup:project

# Vercel
VERCEL_TOKEN={user paste}

# Resend (cho magic link)
RESEND_API_KEY={user paste}
RESEND_FROM_EMAIL=onboarding@resend.dev  # default, user có thể đổi sau

# Admin (sẽ dùng cho setup:admin)
ADMIN_EMAIL={từ BUSINESS.md}
ADMIN_NAME={từ BUSINESS.md}

# SePay (sẽ fill ở Bước 6 sau khi user setup webhook)
SEPAY_WEBHOOK_API_KEY=  # auto-generate trong Bước 6
```

### ⭐⭐ CLI RESILIENCE — flags hay thay đổi (ĐỌC TRƯỚC)

⚠️ **supabase/vercel CLI update thường xuyên, flag/subcommand có thể đổi.** Agent KHÔNG được chạy command hardcoded một cách mù quáng. Các command bên dưới là **REFERENCE (expected)**, KHÔNG phải tuyệt đối.

**Pattern bắt buộc khi chạy CLI:**

```
1. TRƯỚC khi chạy command quan trọng → verify capability:
   - supabase --version  /  vercel --version   (biết version đang dùng)
   - <cli> <subcommand> --help                 (xem flag THẬT hiện có)
   → Build command từ flag trong --help, KHÔNG từ memory/reference cứng

2. KHI command FAIL với "unknown flag" / "unexpected argument" / "unknown command":
   a. Đọc error message
   b. Chạy: <cli> <subcommand> --help
   c. Tìm flag/subcommand tương đương (vd: --org-id → --org, projects create → project create)
   d. Retry với syntax đúng
   e. Nếu vẫn fail sau 2 lần → báo user + show error, đừng loop vô hạn

3. KHI subcommand đổi tên:
   - Chạy <cli> --help xem subcommand list hiện có
   - Map intent (vd "tạo project") → subcommand đúng

4. Agent LÀ coding agent — đọc --help output + adapt được.
   → Reference commands bên dưới chỉ là điểm khởi đầu. Help output là SỰ THẬT.
```

**Ví dụ self-heal:**
```
Agent chạy: supabase projects create "x" --org-id "y" --region ap-southeast-1
Error: "unknown flag: --org-id"
   ↓
Agent chạy: supabase projects create --help
   → Thấy flag là "--org" (không phải "--org-id")
   ↓
Agent retry: supabase projects create "x" --org "y" --region ap-southeast-1
   → ✓ Success
```

→ Nhờ pattern này, kit **self-healing** khi CLI update, không cần em sửa SKILL.md mỗi lần.

---

### ⭐ NGUYÊN TẮC SETUP (Issue 1 + 2)

**Agent DRIVE CLI TRỰC TIẾP — KHÔNG dùng `setup.mjs` interactive.**
- setup.mjs có readline prompts (ask org, ask pick project) → khó pipe + nguy hiểm
- Agent gọi từng CLI command với token + flags non-interactive, parse JSON output, xử lý error
- setup.mjs chỉ là fallback manual nếu Agent CLI fail

**LUÔN TẠO MỚI project — KHÔNG list existing để pick** (tránh overwrite production khác):
- Supabase: tạo project mới tên `ai-business-kit-{slug}`
- Vercel: tạo project mới, KHÔNG link existing
- Chỉ list+pick existing nếu user CHỦ ĐỘNG yêu cầu (`/coach setup-crm --use-existing`)

### Bước 3: Tạo Supabase project MỚI (~3 phút) — CLI trực tiếp

```
Coach: "Em đang tạo Supabase project mới... (~3 phút)"

# 3a. Lấy org_id (non-interactive, lấy org đầu tiên — KHÔNG hỏi user pick)
  → supabase orgs list --output json
  → Parse JSON, lấy org đầu tiên (đa số user 1 org)
  → Nếu nhiều org → confirm với user "Tạo trong org {name}?" (chỉ confirm, không bắt pick từ list dài)

# 3b. Tạo project MỚI (KHÔNG list+pick existing)
  → DB_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
  → PROJECT_NAME="ai-business-kit-{slug từ BUSINESS.md}"
  → supabase projects create "$PROJECT_NAME" \
      --org-id "$ORG_ID" \
      --region ap-southeast-1 \
      --db-password "$DB_PASSWORD" \
      --output json
  → Parse JSON → lấy project ref (id)
  → Save DB_PASSWORD vào .env.local (cần cho link)

# 3c. Đợi provisioned (~2 phút)
  → Poll: supabase projects list --output json → check project status = ACTIVE_HEALTHY
  → Lấy ANON_KEY + SERVICE_ROLE_KEY:
    supabase projects api-keys --project-ref "$REF" --output json
  → Append vào .env.local
```

⚠️ Token sai/quota → load `skills/setup/supabase/references/troubleshooting.md`

### Bước 4: Link + migrations + edge functions (~2 phút) — CLI trực tiếp

```
Coach: "Em đang chạy schema + deploy functions..."

# 4a. Link project (non-interactive với password)
  → cd apps/customer-portal
  → supabase link --project-ref "$REF" --password "$DB_PASSWORD"

# 4b. Push migrations
  → supabase db push

# 4c. Deploy edge functions
  → supabase functions deploy sepay-webhook
  → supabase functions deploy send-email
  → supabase functions deploy enroll-customer
  (RLS policies + Storage buckets nằm trong migrations — tự apply qua db push)
```

### Bước 5: Tạo admin account (~30 giây) — CLI/SQL trực tiếp

```
Coach: "Em tạo admin account cho anh/chị..."

# 5a. Generate admin password backup (cho Issue 5 — trả credentials)
  → ADMIN_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))")

# 5b. Create auth user qua Supabase (non-interactive)
  → Dùng Supabase Management API hoặc SQL qua supabase db:
    - Create user với ADMIN_EMAIL + ADMIN_PASSWORD
    - Insert vào admin_users table
  → Hoặc gọi edge function create-admin nếu Portal có

# 5c. Gửi magic link qua Resend (primary login method)
  → Trigger Portal send magic link tới ADMIN_EMAIL

# 5d. Save ADMIN_PASSWORD (backup login) — xem Bước 6.6 (Issue 5)
```

### Bước 6: Tạo Vercel project MỚI + deploy (~3 phút) — CLI trực tiếp

```
Coach: "Em đang deploy Portal lên Vercel..."

# 6a. Tạo project MỚI (KHÔNG link existing)
  → cd apps/customer-portal
  → vercel link --yes --project "ai-business-kit-{slug}" --token "$VERCEL_TOKEN"
    (--yes = non-interactive; tên mới = tạo mới, không pick existing)

# 6b. Sync env vars (non-interactive qua stdin pipe)
  → Mỗi key trong .env.local:
    echo "$VALUE" | vercel env add "$KEY" production --token "$VERCEL_TOKEN" --yes
    (hoặc dùng vercel env add với --force nếu key đã tồn tại)

# 6c. Build + deploy production
  → vercel deploy --prod --yes --token "$VERCEL_TOKEN"
  → Parse output → lấy production URL

  → Output: "Portal online tại: https://ai-business-kit-{slug}.vercel.app"
```

⚠️ Vercel lỗi → load `skills/setup/vercel/references/troubleshooting.md`

### Bước 6.5: Save config — CRITICAL cho CRM auto-detection

⭐ **Sau khi có production URL, Coach BẮT BUỘC làm 2 việc** (đây là mắt xích để CRM skill auto-detect Portal, không phải hỏi user lại):

**1. Save `CUSTOMER_PORTAL_URL` vào `.env` root project:**
```
CUSTOMER_PORTAL_URL=https://customer-portal-{hash}.vercel.app
```
→ `skills/funnel/crm/SKILL.md` detect biến này → tự dùng MiniCRM, không hỏi menu CRM.

**2. Tạo `MINICRM.md` ở root project** (từ template MINICRM.example.md):
```markdown
# MiniCRM Config

## Portal
portal_url: https://customer-portal-{hash}.vercel.app
webhook_secret: {webhook_secret từ Portal admin settings}

## Khoá học
(Trống — sẽ fill khi user tạo product trong Portal dashboard)

## Sản phẩm số
(Trống — sẽ fill khi user tạo product)

## Defaults
default_source: landing_page
send_magic_link: true
```
→ CRM skill đọc `MINICRM.md` lấy product catalog (course/product IDs) khi enroll khách.
→ Lúc setup chưa có product → để trống, user tạo product trong Portal sau thì update lại.

**3. Ensure `.gitignore` có `MINICRM.md`** (chứa webhook_secret — không commit):
```
echo "MINICRM.md" >> .gitignore  (nếu chưa có)
```

→ Sau Bước 6.5, chain hoàn chỉnh:
```
Portal deployed → CUSTOMER_PORTAL_URL trong .env + MINICRM.md created
                → CRM skill auto-detect → dùng Portal, KHÔNG hỏi user
                → Funnel agents inject MiniCRM snippet tự động
```

### Bước 6.6: TRẢ ADMIN CREDENTIALS cho user (Issue 5)

⭐ Sau khi deploy xong, Coach BẮT BUỘC show credentials rõ ràng — user cần để đăng nhập Portal:

**1. Save credentials vào file (gitignored):**
```
output/coach/portal-credentials.md:

# Customer Portal — Admin Credentials
⚠️ FILE NÀY CHỨA MẬT KHẨU — KHÔNG share, KHÔNG commit git.

Portal URL: https://ai-business-kit-{slug}.vercel.app
Admin login: {Portal URL}/admin/login

Email: {ADMIN_EMAIL từ BUSINESS.md}
Password: {ADMIN_PASSWORD generated ở Bước 5a}

Magic link: đã gửi qua email (cách login chính)
Password trên: backup login nếu magic link fail

Supabase project: ai-business-kit-{slug} (ref: {REF})
Created: {timestamp}
```

**2. Ensure `.gitignore` có dòng này:**
```
output/coach/portal-credentials.md
```

**3. Show user trong chat (response cuối Setup CRM):**
```
✅ Customer Portal Setup Complete!

🔗 Portal URL: https://ai-business-kit-{slug}.vercel.app

👤 Admin login ({Portal URL}/admin/login):
   Email: {admin_email}
   Password: {admin_password}   ← em đã save vào output/coach/portal-credentials.md

📧 Magic link đã gửi qua email {admin_email} — click link đó để vào (cách nhanh nhất).
   Nếu không nhận được trong 5 phút:
   - Check spam folder
   - Hoặc login bằng email + password ở trên tại {Portal URL}/admin/login

⚠️ Password lưu tại output/coach/portal-credentials.md — KHÔNG share file này.
```

**Fallback nếu magic link fail (Resend quota/spam)**:
- User dùng password backup login trực tiếp
- Hoặc Coach hướng dẫn reset password qua Supabase dashboard

### Bước 7: Cấu hình SePay webhook (MANUAL — ~3 phút user)

Đây là **bước duy nhất user phải tự làm** (SePay không có API set webhook):

```
Coach: "OK Portal đã online. Còn 1 việc cuối — anh/chị làm 3 phút:

📋 Cấu hình SePay webhook:

1. Mở: https://my.sepay.vn/webhooks (em copy URL vào clipboard rồi)
2. Click 'Tạo webhook mới'
3. Webhook URL: [em copy sẵn — paste vào]
4. Authentication: 'API Key'
5. API Key: [em copy sẵn — paste vào]  
6. Lọc theo: 'Tất cả tài khoản' (hoặc account của anh/chị)
7. Save

Sau khi save, anh/chị click nút 'Gửi thử' trên SePay dashboard.
Em sẽ check Portal nhận được test signal.

Anh/chị làm xong gõ 'done' cho em biết nhé."
```

Coach auto:
- Generate `SEPAY_WEBHOOK_API_KEY` random (32 char)
- Save vào Supabase env (qua Vercel env sync)
- Copy webhook URL + API key vào clipboard (qua `pbcopy` trên Mac, `clip.exe` Windows)

→ Chi tiết: `skills/setup/sepay/references/configure-webhook.md`

### Verification (~30 giây)

Sau khi user nói "done":

```
Coach: "Em kiểm tra webhook nhận được..."
  → Gọi Supabase API: query table `webhook_logs` xem có log mới không
  → Nếu có: "✓ Webhook hoạt động. Setup hoàn tất!"
  → Nếu không có: hỏi user check lại bước SePay, debug guide
```

---

## Output sau khi xong

Files đã update:
- `apps/customer-portal/.env.local` — đầy đủ secrets
- `.env` root project — `CUSTOMER_PORTAL_URL=...`, `SEPAY_WEBHOOK_API_KEY=...`
- Supabase project created với schema + functions deployed
- Vercel project deployed với production URL
- SePay webhook configured + tested

Output file: `output/coach/setup-crm-{YYYY-MM-DD}.md`

```markdown
# Setup CRM Portal — {Date}

## Status: ✅ Complete

## Created
- Supabase project: ai-business-kit-{slug}
- Project URL: https://{ref}.supabase.co
- Portal URL: https://customer-portal-{hash}.vercel.app
- Admin: {email từ BUSINESS.md}

## Integrations active
- ✅ SePay webhook
- ✅ Resend magic link
- ✅ Vercel hosting
- ✅ Supabase Auth + Database + Edge Functions

## Next step
Quay lại Coach để tạo plan 30 ngày: /coach plan
```

---

## Edge Cases

### User chỉ có 2/3 token

```
Coach: "Anh/chị có thể setup Portal sau khi có đủ 3 token. Em pause setup tại đây.
        Khi nào sẵn sàng, gõ /coach setup-crm để em tiếp tục."
```

→ Save state vào `output/coach/setup-crm-paused.md`

### Supabase free tier full quota

```
Coach: "Free tier Supabase max 2 project. Anh/chị có thể:
        (A) Delete project Supabase cũ không dùng
        (B) Upgrade Pro plan ($25/month)
        (C) Em tạo project mới với token khác"
```

### Vercel deploy fail

```
- Catch error từ vercel CLI
- Common fixes:
  - "missing env var" → re-run setup:deploy sau khi sync env
  - "no node_modules" → cd apps/customer-portal && npm install
  - "vercel link failed" → user phải vercel login manually 1 lần
```

→ Load `skills/setup/vercel/references/troubleshooting.md` cho list full.

### User muốn skip Portal hoàn toàn

```
Coach: "OK em skip. Lưu ý anh/chị sẽ không có:
       - Auto confirm payment SePay
       - Auto deliver email cho khách
       - CRM dashboard quản lý orders
       Anh/chị sẽ phải làm thủ công. Vẫn skip không?"
```

Y: mark Portal = skipped, plan các bước Funnel sẽ warn về thiếu Portal.

---

## Time Budget Tổng

| Phase | Active user time | Wait time |
|-------|------------------|-----------|
| Pre-flight check | 0 | 30s |
| Bước 1 (3 tokens) | 5 phút | 0 |
| Bước 2 (gen .env) | 0 | 10s |
| Bước 3 (Supabase) | 0 | 3 phút |
| Bước 4 (migrations) | 0 | 2 phút |
| Bước 5 (admin) | 0 | 30s |
| Bước 6 (Vercel) | 0 | 3 phút |
| Bước 7 (SePay manual) | 3 phút | 0 |
| Verification | 0 | 30s |
| **TỔNG** | **~8 phút** | **~10 phút** |

→ User active work ~8 phút. Tổng wall-clock ~18 phút.

---

## Tone Trong Setup

- **Trước khi bắt đầu**: "Việc này em làm hết, anh/chị chỉ cần ngồi đợi + cung cấp 3 token + làm 1 bước SePay cuối. 18 phút tổng."
- **Trong khi đợi (Supabase/Vercel deploy)**: "Em đang đợi Supabase tạo project... khoảng 2-3 phút. Anh/chị nghỉ uống nước trong lúc đó."
- **Khi fail**: không panic — "Có vấn đề ở bước [X]. Lỗi: [details]. Em đề xuất fix: [suggestion]. Anh/chị muốn em retry hay debug sâu hơn?"
- **Khi xong**: "✓ Xong! Portal online tại [URL]. Magic link em đã gửi vào email [admin email] — anh/chị click vào để vào dashboard nhé. Sau đó quay lại em làm plan 30 ngày."
