# Cách lấy Apify Token

> Optional — chỉ cần nếu muốn auto social analytics + competitor scraping. Setup ~2 phút.

## Bước 1: Tạo Apify account (1 phút)

- URL: https://apify.com/sign-up
- Đăng ký bằng:
  - Google (nhanh nhất, click 1 phát) ✅
  - GitHub
  - Email + password
- Verify email nếu dùng email signup

## Bước 2: Lấy API Token (30 giây)

- Vào: https://console.apify.com/account/integrations
- Section **"Personal API tokens"**
- Click vào token mặc định (đã tạo sẵn) — copy ngay
- Format: `apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ Token này có quyền full account — không share cho ai.

## Bước 3: Paste cho Coach

Quay lại Claude Code, paste token. Coach verify + save vào `.env`.

## Free Tier — Anh/chị nhận được gì

- **$5/tháng credit** (reset đầu mỗi tháng)
- Đủ cho:
  - 50 actor runs (mix các actor)
  - Hoặc 100+ TikTok scrapes (TikTok actor FREE)
  - Hoặc 50 FB/IG scrapes
- Limit: 30 runs concurrent, không có lifetime hard cap

## Upgrade Plan (nếu cần)

| Plan | $/tháng | Credit |
|------|---------|--------|
| Free | $0 | $5 |
| Personal | $49 | $49 |
| Team | $499 | $499 |

→ BASIC user: Free đủ. Heavy user (PRO/ALL): Personal.

## Permission của token

Token có quyền:
- ✅ Run actors
- ✅ Read your dataset results
- ✅ Check usage/billing
- ❌ KHÔNG access payment method
- ❌ KHÔNG delete account

## Revoke (nếu cần)

https://console.apify.com/account/integrations → token → "Delete"

Sau đó regenerate token mới + update `.env`.

## FAQ

**Q: Apify có legal không?**
A: Apify operate từ EU, scrape public data. ToS gray area với Meta (FB/IG) — Apify đã hoạt động nhiều năm, risk low.

**Q: Có scrape được private profile không?**
A: Không. Apify chỉ scrape public data. Private profile cần auth cookie (không recommend).

**Q: Data có chính xác bằng official Insights API không?**
A: ~95% chính xác. Engagement metrics có thể lệch nhẹ. Đủ cho trend analysis.

**Q: Apify có log Vietnamese encoding không?**
A: Có, UTF-8 full support. Caption tiếng Việt parse được.

**Q: Có rate limit không?**
A: Có — free tier 30 concurrent runs. Đủ cho personal/small biz use.

## Troubleshooting

→ Load `skills/integrations/apify/references/troubleshooting.md` nếu gặp lỗi.
