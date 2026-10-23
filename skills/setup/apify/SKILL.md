---
name: setup-apify
description: Hướng dẫn lấy APIFY_TOKEN cho Analysis/Offer/Ads Agent. Optional integration — kit hoạt động không cần Apify nhưng analytics social tự động cần có.
---

# Setup Apify Skill

## Khi Nào Coach Load Skill Này

- User gõ `/coach setup apify` hoặc `/setup apify`
- Analysis Agent detect APIFY_TOKEN missing → đề xuất setup
- Coach onboarding step optional: "Anh/chị muốn setup Apify để có social analytics tự động không?"

## Optional, không bắt buộc

⚠️ **Apify KHÔNG bắt buộc** cho kit BASIC. Kit chạy được mà không có Apify:
- ✅ Customer Portal data (revenue, orders) — không cần Apify
- ✅ Funnel build, payment, email — không cần Apify
- ✅ Content/Reels generation — không cần Apify

Apify chỉ cần khi user muốn:
- **`/analyze social --auto`** — scrape FB/IG/TikTok analytics
- **`/analyze competitor`** — scrape đối thủ
- **`/offer competitor`** — auto competitor research (thay vì user paste thủ công)

→ Coach chỉ recommend khi thấy user dùng các sub-action trên.

## Flow Setup (~3 phút)

```
Coach: "Em sẽ giúp setup Apify để có social analytics tự động:

📋 Steps:
1. Tạo Apify account: https://apify.com/sign-up (đăng ký bằng Google nhanh nhất)
2. Verify email
3. Lấy token: https://console.apify.com/account/integrations
4. Paste cho em ở đây

Free tier: $5/tháng credit — đủ cho weekly analytics.
Anh/chị sẵn sàng chưa?"
```

User confirm → guide chi tiết qua `references/get-token.md`.

User paste token → Coach verify + save:

```javascript
// Verify token
import { verifyToken } from 'skills/integrations/apify/apify-client.mjs'
const userInfo = await verifyToken(userPastedToken)

if (userInfo) {
  // Append vào .env
  // APIFY_TOKEN=apify_api_...
  Coach: "✓ Token OK. Account: {email}, Plan: {plan}.
          Em đã save vào .env. Anh/chị giờ có thể dùng:
          - /analyze social --auto
          - /analyze competitor
          - /offer competitor --auto"
}
```

## Verify usage

User có thể check usage qua command:

```
/setup apify usage

→ Coach query getUsage():
  "Apify usage tháng này:
   - Used: $2.30
   - Remaining: $2.70
   - Plan: FREE
   
   Còn dư đủ cho ~25 actor runs nữa."
```

## References

- `references/get-token.md` — Step-by-step lấy token (~2 phút)
- `skills/integrations/apify/references/actor-catalog.md` — Actor recommended
- `skills/integrations/apify/references/troubleshooting.md` — Lỗi common

## Hard Constraint

Setup Apify KHÔNG block các Agent khác. Nếu user skip Apify:
- Analysis Agent fallback sang manual paste mode
- Offer/Ads Agent fallback sang manual research mode

→ Apify là **enhancement**, không phải dependency.
