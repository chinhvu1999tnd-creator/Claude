# Apify — Troubleshooting

## Lỗi `APIFY_TOKEN missing`

User chưa setup Apify. Fix:
1. Hỏi user có Apify account chưa?
   - Chưa → guide tạo: https://apify.com/sign-up (free)
2. Lấy token: https://console.apify.com/account/integrations
3. Add vào `.env`: `APIFY_TOKEN=apify_api_...`

## Lỗi `APIFY_TOKEN invalid hoặc đã revoke`

Token sai hoặc hết hạn:
1. Verify token tại https://console.apify.com/account/integrations
2. Nếu token bị revoke → generate token mới
3. Update `.env`

## Lỗi `Monthly usage limit exceeded`

Free tier $5/tháng đã hết:
1. Check usage hiện tại: `https://console.apify.com/account/billing`
2. Options:
   - Đợi đầu tháng (reset)
   - Upgrade Apify plan ($49/month — 49 USD credit)
   - Switch sang FREE actor: `clockworks/free-tiktok-scraper`
   - Skip auto mode, dùng manual paste cho tháng còn lại

## Actor timeout (>5 phút)

Apify actor đôi khi chạy lâu (target server slow, retry logic):
1. Default timeout 5 phút — tăng nếu cần:
   ```js
   runActor(actorId, input, { timeoutSecs: 600 })  // 10 phút
   ```
2. Hoặc giảm `resultsLimit` để actor finish nhanh hơn

## Target URL invalid / Account private

User truyền URL không hợp lệ hoặc target IG/FB account đã private:
1. Verify URL syntax (đúng format `https://instagram.com/handle`)
2. Test thử trên browser — public account access được không?
3. Nếu account private → Apify không scrape được. Fallback sang manual paste.

## Data trống / không chứa metrics

Một số actor không return engagement metrics nếu account quá mới hoặc post quá ít:
1. Check raw output qua `apify console → Runs → run-id → Output`
2. Verify schema match docs Apify
3. Có thể cần actor khác cho cùng platform (em update actor-catalog.md)

## Em không gọi được Apify từ Claude Code

Apify actor run = call HTTP API. Claude Code cần network access:
1. Verify network connection
2. Verify `fetch` available (Node 18+)
3. Test minimal: `node -e "fetch('https://api.apify.com').then(r=>console.log(r.status))"`

## Cost tăng bất ngờ

User mở Apify dashboard thấy cost cao hơn estimate:
1. Check Runs history — actor nào tốn nhất?
2. Common cause: `resultsLimit` quá cao (vd: limit 1000 thay vì 30)
3. Verify input passed vào actor có đúng không

## Khi nên upgrade từ Free → Apify Personal ($49/month)

- User /analyze daily nhiều channel = vượt $5
- User /offer competitor cho nhiều niche = vượt $5  
- User scrape competitor large scale (1000+ posts/run)

→ Đây là dấu hiệu user đã sẵn sàng PRO/ALL tier — gợi ý upgrade kit + Apify.
