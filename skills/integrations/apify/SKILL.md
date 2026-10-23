---
name: integrations-apify
description: Wrapper Apify API — scrape social media data (FB, IG, TikTok, YouTube, Google) cho Analysis Agent + Offer Agent + Ads Agent + Sale DM Agent. Public data, no OAuth required.
---

# Apify Integration Skill

## Khi Nào Dùng

- **Analysis Agent**: `/analyze social --auto`, `/analyze competitor`
- **Offer Agent**: scrape competitor IG/FB/TikTok cho market research
- **Ads Content Agent**: scrape top performing ads/posts để inspire creative
- **Sale DM Agent**: scrape Shopee reviews để hiểu objection thật của khách VN

## Tại sao Apify?

Apify giải quyết "auto data social mà không cần OAuth":
- ❌ Without Apify: User phải setup Meta Business Manager, GA Property, TikTok Developer — 30+ phút, OAuth flow phức tạp
- ✅ With Apify: 1 token (~2 phút setup), scrape được FB/IG/TikTok/YouTube/Google

Trade-off: chỉ public data (đủ 80% use case BASIC), pay-per-use ($0.05-0.10/run, free tier $5/tháng).

## API Pattern

Tất cả Apify call qua module `apify-client.mjs`:

```javascript
import { runActor } from './apify-client.mjs'

// Scrape FB page
const data = await runActor('apify/facebook-pages-scraper', {
  startUrls: [{ url: 'https://facebook.com/yourpage' }],
  resultsLimit: 30
})

// data = JSON parsed result, ready to use
```

## Actor Catalog (em đề xuất dùng)

→ Load chi tiết: `references/actor-catalog.md`

| Use case | Actor ID | Cost/run | Note |
|----------|----------|----------|------|
| FB Page posts + insights | `apify/facebook-pages-scraper` | ~$0.10 | Public posts, engagement |
| IG profile + posts | `apify/instagram-scraper` | ~$0.10 | Profile data + recent posts |
| TikTok profile + videos | `clockworks/free-tiktok-scraper` | **FREE** | ✨ Best value |
| YouTube channel + videos | `streamers/youtube-scraper` | ~$0.05 | Channel stats + recent videos |
| Google search competitor | `apify/google-search-results-scraper` | ~$0.05 | Tìm đối thủ qua keyword |
| Shopee reviews scraper | `epctex/shopee-scraper` | ~$0.05 | Review data tiếng Việt |

## Cost Management

```
Free tier: $5/tháng credit
  ↓
~50 actor runs/tháng
  ↓
Đủ cho: /analyze social weekly cho 3-4 channels
```

Heavy use → upgrade Apify $49/tháng tier (PRO/ALL khách thường cần).

Agent **luôn show cost estimate trước khi run**:
```
"Em sẽ scrape:
 - FB page của anh/chị: ~$0.10
 - IG profile: ~$0.10
 - TikTok profile: FREE
 Total: ~$0.20 (còn ~$4.50 free tier tháng này)
 
 OK chạy không?"
```

## Error Handling

Apify có 3 lỗi phổ biến — load `references/troubleshooting.md`:
1. Actor run timeout (>5 phút)
2. Quota exceeded (free tier hết)
3. Target URL invalid hoặc account private

Agent gracefully fallback sang manual paste mode nếu Apify fail.

## Setup

User cần `APIFY_TOKEN` trong `.env`. Load `skills/setup/apify/SKILL.md` để guide.

## Reusable Across Agents

Module `apify-client.mjs` được import bởi:
- `skills/analysis/social-analytics/scripts/scrape.js`
- `skills/offer/competitor-analysis/scripts/scrape-competitor.js`
- `skills/ads/scripts/scrape-top-ads.js`
- `skills/sales/objection-handler/scripts/scrape-reviews.js`

→ 1 source of truth cho Apify API calls.
