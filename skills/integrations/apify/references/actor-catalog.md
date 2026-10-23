# Apify Actor Catalog — Curated cho BASIC Kit

> Em recommend các actor sau dựa trên: stability, cost, VN data quality. Updated 2026-05.

## Social Media

### Facebook Pages

**Actor**: `apify/facebook-pages-scraper`
**Cost**: ~$0.10/run
**Input cơ bản**:
```json
{
  "startUrls": [{ "url": "https://www.facebook.com/yourpage" }],
  "resultsLimit": 30
}
```
**Output**: page info + recent posts (text, image, likes, comments, shares, reactions)
**Use case**: FB Page performance analytics, top post identification

### Instagram

**Actor**: `apify/instagram-scraper`
**Cost**: ~$0.10/run
**Input**:
```json
{
  "directUrls": ["https://www.instagram.com/yourhandle"],
  "resultsType": "posts",
  "resultsLimit": 30
}
```
**Output**: profile + posts/reels (caption, likes, comments, video views, hashtags)
**Use case**: IG content performance, hashtag analysis, competitor IG audit

### TikTok ⭐ (FREE)

**Actor**: `clockworks/free-tiktok-scraper`
**Cost**: **FREE** — ưu tiên dùng cho BASIC
**Input**:
```json
{
  "profiles": ["yourhandle"],
  "resultsPerPage": 30
}
```
**Output**: profile info + videos (views, likes, comments, shares, hashtags, music)
**Use case**: TikTok analytics, viral video identification

### YouTube

**Actor**: `streamers/youtube-scraper`
**Cost**: ~$0.05/run
**Input**:
```json
{
  "startUrls": [{ "url": "https://www.youtube.com/@yourchannel" }],
  "maxResults": 20
}
```
**Output**: channel stats + recent videos (views, likes, duration, comments)
**Use case**: YouTube performance, video benchmarking

## Competitor Intelligence

### Google Search (find competitors)

**Actor**: `apify/google-search-results-scraper`
**Cost**: ~$0.05/run
**Input**:
```json
{
  "queries": "khóa học pottery online việt nam",
  "resultsPerPage": 30,
  "countryCode": "vn",
  "languageCode": "vi"
}
```
**Output**: search results với title + URL + snippet
**Use case**: Tìm đối thủ qua keyword, monitor SERP ranking

### Shopee Reviews (VN-specific)

**Actor**: `epctex/shopee-scraper`
**Cost**: ~$0.05/run
**Input**:
```json
{
  "startUrls": [{ "url": "https://shopee.vn/product-url" }],
  "maxReviews": 100
}
```
**Output**: reviews tiếng Việt (rating, comment, time)
**Use case**: Hiểu pain point thật của khách VN trong category, generate objection scripts

## Cost Summary cho BASIC Workflows

### Workflow 1: `/analyze social` weekly (3 channels)
```
FB: $0.10 + IG: $0.10 + TikTok: FREE = $0.20/week
Tháng: ~$0.80
```
→ **Đủ trong free tier $5/tháng**, còn dư $4.20 cho usage khác

### Workflow 2: `/offer competitor` lần đầu (5 đối thủ)
```
Google search: $0.05 (find 5 đối thủ) +
5 × IG scrape: $0.50 +
5 × FB scrape: $0.50
= $1.05 one-time
```
→ One-time research khi đóng gói offer mới

### Workflow 3: `/ads inspire` (top performing ads)
```
Google search "[niche] facebook ads": $0.05 +
3 × FB page scrape: $0.30
= $0.35
```

### Workflow 4: `/sales objection` từ Shopee
```
3 × Shopee scrape: $0.15 (100 reviews each)
```
→ Một lần research category, generate được 10-20 objection real

**Total tháng cho BASIC user**: ~$2-3/month (đủ free tier).

## Tips

1. **TikTok FREE** — ưu tiên scrape TikTok thay vì FB/IG khi có thể
2. **Batch scrape** — chạy nhiều profile 1 actor run (cost giống nhau)
3. **Cache 24h** — nếu user run lại trong 24h, dùng cached result không re-scrape
4. **Off-peak time** — Apify actor có thể nhanh hơn ngoài giờ peak (12-3 PM US)

## Khi Actor fail

→ Load `troubleshooting.md`

Common causes:
- Target profile đã private hoặc bị xoá
- Apify quota exceeded
- Actor maintenance (rare — Apify maintainer fix nhanh)
