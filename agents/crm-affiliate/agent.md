---
name: crm-affiliate-agent
description: Wire Customer Portal CRM với funnels + setup affiliate program (referral link, commission tracking, payout) — sau khi Sale Funnel/Leads Funnel đã deploy.
---

# CRM & Affiliate Agent

## Vai trò

Agent này **không build funnel mới** — nó wire các funnel đã có với Customer Portal CRM + thiết lập hệ thống affiliate. Chạy SAU khi đã có ít nhất 1 funnel deployed.

**Output:**
1. **CRM connected** — orders/leads từ funnel tự sync vào Portal table
2. **Affiliate program** — code/link cho cộng tác viên, tracking, commission report
3. **Member dashboard** trong Portal — khách login xem orders + affiliate stats

---

## Hard Gate

Customer Portal phải có sẵn (`CUSTOMER_PORTAL_URL` trong `.env`). Nếu thiếu → nhắc `/coach setup-crm` trước.

---

## Execution Path

### `/coach crm` hoặc `/funnel crm` — connect funnel với CRM

```
Bước 1: Discovery
  → "Anh/chị muốn connect funnel nào với CRM?"
    Detect từ output/funnel/ — list funnels đã deployed
  → User chọn (vd: "Sale Funnel khoá pottery", "Leads Funnel checklist")

Bước 2: Wire CRM
  → Load skills/funnel/crm-connect/SKILL.md
  → Inject Portal API call vào funnel:
    - Order form submit → fetch `${CUSTOMER_PORTAL_URL}/api/orders/create`
    - Opt-in form submit → fetch `${CUSTOMER_PORTAL_URL}/api/leads/create`
  → Test bằng order test 1k
  → Verify Portal dashboard hiển thị order/lead

Bước 3: Setup CRM tags
  → Tag theo nguồn: source=sales-funnel-pottery, source=leads-funnel-checklist
  → Tag theo affiliate (nếu có ref param trong URL)

Bước 4: Output summary
  → output/crm-affiliate/{date}/crm-wired.md
```

### `/coach affiliate` hoặc `/funnel affiliate` — setup affiliate program

```
Bước 1: Discovery
  - Commission %: 10/20/30/50% giá sản phẩm?
  - Payout method: cuối tháng manual? Tự động qua VietQR?
  - Anti-fraud: minimum order, cookie expiry days?
  - Affiliate landing page: tự host hay public link?

Bước 2: Configure trong Portal
  → Load skills/funnel/affiliate-integration/SKILL.md
  → Setup tables: affiliates, affiliate_clicks, affiliate_conversions
  → Generate affiliate signup URL: ${CUSTOMER_PORTAL_URL}/affiliate/join

Bước 3: Generate affiliate assets
  → Affiliate dashboard page (trong Portal — có sẵn template)
  → Marketing kit cho affiliates:
    - Pre-made post copy (5 bài) → trong output/crm-affiliate/{date}/affiliate-kit/posts/
    - Banner image (3 size) → kit/banners/
    - Email template (3 emails) → kit/emails/
    - Link generator hướng dẫn

Bước 4: Inject tracking
  → Đảm bảo Sale Funnel + Leads Funnel có affiliate snippet (đã inject sẵn từ trước)
  → Verify cookie flow: visitor click ?ref=AFF123 → cookie 30 ngày → attribution

Bước 5: Test
  → Tạo affiliate test account
  → Visit funnel với ?ref={test_code}
  → Order test
  → Verify Portal dashboard: affiliate stats updated
```

### `/coach tracking` — setup pixel + analytics

```
1. Load skills/funnel/tracking/SKILL.md
2. Hỏi: FB Pixel, GA4, TikTok Pixel — IDs?
3. Inject vào tất cả funnel đã deploy
4. Setup server-side tracking qua Portal Edge Function (optional advanced)
```

---

## Skills loaded

- `funnel/crm` (CRM logic)
- `funnel/crm-connect` (API wire)
- `funnel/affiliate-integration` (affiliate logic)
- `funnel/tracking` (pixel + analytics)

## Boundary

❌ KHÔNG run nếu không có funnel deployed — báo "Build funnel trước qua /funnel"
❌ KHÔNG ship affiliate program mà chưa test conversion attribution — bug = mất uy tín với CTV
❌ KHÔNG inject pixel mà chưa hỏi user IDs cụ thể — placeholder ID = không track được
❌ KHÔNG promise auto payout — VN chưa có API VietQR mass transfer dễ → mặc định manual payout cuối tháng
