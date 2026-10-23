# Cách lấy Supabase Personal Access Token

> Token này cho phép Setup Agent tạo Supabase project tự động. Chỉ cần lấy **1 lần**, dùng mãi.

## 3 bước (~2 phút)

### Bước 1: Mở Supabase Tokens page
- URL: https://supabase.com/dashboard/account/tokens
- Nếu chưa login, đăng nhập bằng email (hoặc GitHub OAuth)

### Bước 2: Generate token
- Click nút **"Generate new token"** (góc phải trên)
- Đặt tên: `AI Business Kit` (hoặc bất kỳ tên dễ nhớ)
- Click **"Generate token"**

### Bước 3: Copy ngay
- Token sẽ hiển thị **1 lần duy nhất** — copy ngay
- Format: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Paste vào Claude Code chat khi Coach hỏi

> ⚠️ Đóng tab ngay sau khi copy — không lưu token ở chỗ public.

## Permission của token này

Token này có quyền:
- ✅ Tạo project mới (sẽ dùng)
- ✅ Liệt kê project hiện có
- ✅ Xoá project
- ❌ KHÔNG access data trong database (cần SERVICE_ROLE_KEY riêng)

## Revoke (nếu cần)

Quay lại https://supabase.com/dashboard/account/tokens → tìm token → "Delete"

## FAQ

**Q: Có giới hạn project miễn phí không?**
A: Free tier: 2 project active. Pause project cũ không dùng để tạo mới.

**Q: Token có expiration không?**
A: Không. Token dùng mãi đến khi user revoke.

**Q: Mất token rồi làm sao?**
A: Generate token mới. Token cũ không thể recover.

## Troubleshooting

| Lỗi | Cách fix |
|-----|---------|
| "Forbidden — insufficient permissions" | Token đã hết hạn hoặc revoke. Generate mới. |
| "Project limit reached" | Free tier: max 2 active project. Pause cái cũ. |
| "Invalid region" | Region mặc định `ap-southeast-1` (Singapore). Nếu lỗi, thử `us-east-1`. |
