# Platform Setup Checklists

---

## Universal Pre-Launch Checklist

Trước khi launch bất kỳ campaign nào:

- [ ] Conversion tracking test với real conversion
- [ ] Landing page load < 3 giây (test trên mobile)
- [ ] Landing page mobile-friendly
- [ ] UTM parameters trong tất cả ad URLs
- [ ] Budget đặt đúng (daily vs lifetime)
- [ ] Start/end dates đúng
- [ ] Targeting match intended audience
- [ ] Ad creative đã approved
- [ ] Reporting dashboard ready

---

## Meta Ads Setup (Facebook/Instagram)

### Business Manager Foundation
- [ ] Business Manager tạo tại business.facebook.com
- [ ] Ad account tạo trong Business Manager
- [ ] Payment method added
- [ ] Team access configured

### Pixel & Tracking
- [ ] Meta Pixel install trên tất cả pages
- [ ] Standard events configured:
  - PageView (automatic)
  - ViewContent (product/feature pages)
  - Lead (form submissions)
  - Purchase (conversions)
- [ ] Conversions API (CAPI) setup — bắt buộc nếu spend > $3K/tháng
- [ ] Event Match Quality score > 6
- [ ] Test events trong Events Manager

### Domain & Aggregated Events (iOS 14+)
- [ ] Domain verified trong Business Manager
- [ ] Aggregated Event Measurement configured
- [ ] Top 8 events prioritized theo thứ tự quan trọng

### Audience Setup
- [ ] Custom audiences tạo:
  - Website visitors (30/60/90/180 ngày)
  - Key page visitors (pricing, checkout)
  - Video viewers (25%, 50%, 75%, 95%)
  - Page/Instagram engagers
  - Customer list uploaded
- [ ] Lookalike audiences (1%, 1-3%)

### Creative Assets
- [ ] Images đúng kích thước:
  - Feed: 1080×1080 (1:1)
  - Stories/Reels: 1080×1920 (9:16)
  - Landscape: 1200×628 (1.91:1)
- [ ] Ad copy variations ready
- [ ] UTM parameters trong destination URLs

---

## TikTok Ads Setup

### Account Foundation
- [ ] TikTok Ads Manager account tạo
- [ ] Business verification completed
- [ ] Payment method added

### Pixel & Tracking
- [ ] TikTok Pixel install
- [ ] Events configured (ViewContent, Purchase, etc.)
- [ ] Events API setup (recommended)
- [ ] Test pixel firing

### Creative
- [ ] Vertical video (9:16) ready
- [ ] Native-feeling content (không quá polished)
- [ ] 3 giây đầu là compelling hook
- [ ] Captions added
- [ ] Music/sounds licensed nếu cần

---

## Google Ads Setup

### Account Foundation
- [ ] Google Ads account tạo và verified
- [ ] Billing added
- [ ] Time zone: GMT+7 (Vietnam)
- [ ] Currency: VND

### Conversion Tracking
- [ ] Google Tag install trên tất cả pages
- [ ] Conversion actions tạo (purchase, lead, signup)
- [ ] Enhanced conversions enabled
- [ ] Test conversions firing

### Audience Setup
- [ ] Remarketing tag verified
- [ ] Website visitor audiences:
  - All visitors (180 ngày)
  - Key page visitors
  - Converters (để exclude)
- [ ] Customer match lists uploaded

### Campaign Readiness
- [ ] Negative keyword lists:
  - Universal negatives (free, việc làm, careers, đánh giá)
  - Irrelevant terms
- [ ] Location targeting: Vietnam (hoặc specific cities)
- [ ] Language: Vietnamese
- [ ] Device bid adjustments

---

## Pixel Troubleshooting

| Vấn đề | Fix |
|--------|-----|
| Pixel không fire | Kiểm tra tag đã paste đúng vào `<head>` chưa |
| Events không show | Dùng Meta Pixel Helper Chrome extension debug |
| CAPI mismatch | Check deduplication event_id giữa pixel và server |
| iOS tracking thấp | Setup CAPI + Aggregated Event Measurement |
| Purchase event sai | Verify chỉ fire sau khi payment confirmed, không phải khi click button |
