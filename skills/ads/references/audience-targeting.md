# Audience Targeting Reference

---

## Meta Audiences (Facebook/Instagram) — Priority 1 cho VN

### Core Audiences (Interest/Demographic)

**Interest targeting:**
- Layer interests với AND logic để tăng precision
- Bắt đầu broad, để algorithm optimize
- Luôn exclude existing customers

**Demographic:**
- Tuổi + giới tính nếu product-specific
- Location: Vietnam, hoặc TP.HCM + Hà Nội + Đà Nẵng cho local
- Language: Tiếng Việt

### Custom Audiences (Warm Traffic)

| Audience | Setup |
|----------|-------|
| Website visitors (all) | Pixel — 30/60/90/180 ngày |
| Key page visitors | Pricing page, checkout page, thank you page |
| Video viewers | 25%, 50%, 75%, 95% |
| Page/IG engagers | Tất cả engagement 30/60/90 ngày |
| Customer list | Upload email/SĐT — match rate ~30-70% |
| Form openers | Người mở lead form nhưng chưa submit |

### Lookalike Audiences (Prospecting)

**Source quality quan trọng nhất:**
- Purchasers > leads > all visitors
- Minimum 100 users nguồn, ideal 1.000+
- Dùng high-LTV customers, không phải all customers

**Size recommendations:**
- 1% — giống nhất, reach nhỏ nhất, dùng khi budget hạn chế
- 1-3% — balance tốt cho hầu hết campaigns
- 3-5% — broader, tốt khi muốn scale
- 5-10% — rất broad, awareness only

**Layering:**
- Lookalike + interest = precision hơn khi mới bắt đầu
- Lookalike-only khi đã scale và có data
- Luôn exclude source audience

### Exclusion Strategy (Quan Trọng)

Luôn exclude:
- Existing customers (trừ upsell campaigns)
- Recent converters (7-14 ngày)
- Bounced visitors (< 10 giây trên site)
- People who've seen ad X times (tránh ad fatigue)

---

## TikTok Audiences — Priority 2 cho VN

### Key Principle

**Creative matters MORE hơn targeting trên TikTok.** Broad targeting thường hoạt động tốt hơn narrow targeting vì TikTok's algorithm optimize dựa trên video engagement.

### Targeting Options

- Demographics (tuổi, giới tính, location)
- Interests (TikTok categories — khá broad)
- Behaviors (video interactions, hashtag interactions)
- Custom audiences (pixel, customer file)
- Lookalike audiences

### Best Practices

- Broad targeting trước, let algorithm learn
- Creative iteration > audience iteration trên TikTok
- Younger skew (18-34 primarily) — adjust nếu audience khác
- Exclude existing customers như Meta

---

## Google Ads Audiences

### Search Campaign Targeting

**Keyword match types:**
- Exact match `[keyword]` — precise nhất, volume thấp nhất
- Phrase match `"keyword"` — balance tốt
- Broad match `keyword` — highest volume, dùng với smart bidding

**RLSA (Remarketing Lists for Search):**
- Bid cao hơn với past visitors đang search terms của anh
- Show different ads cho returning searchers
- Exclude converters khỏi prospecting campaigns

### Display/YouTube Targeting

- **Custom intent** — dựa trên recent search behavior, high intent
- **In-market** — đang research solutions, pre-built by Google
- **Customer match** — upload email lists, retarget + create lookalikes

---

## Audience Size Guidelines

| Platform | Minimum | Ideal Range |
|----------|---------|-------------|
| Meta (prospecting) | 500K+ | 1M-10M |
| Meta (retargeting) | 1K+ | 10K-500K |
| Google Display | 100K+ | 500K-5M |
| TikTok | 100K+ | 1M+ |

**Too narrow** = đắt, slow learning, ad fatigue nhanh
**Too broad** = waste spend, low relevance

---

## Funnel Audience Structure

```
COLD (awareness)
├── Broad interest targeting
├── Lookalike 1-3% từ customers
└── TikTok broad

WARM (consideration)
├── Website visitors 30-90 ngày
├── Video viewers 50%+
└── Page engagers

HOT (conversion)
├── Website visitors 7-14 ngày
├── Checkout abandoners
├── Pricing page visitors
└── Form openers (không submit)

RETENTION (upsell)
└── Existing customers — separate campaign, different message
```
