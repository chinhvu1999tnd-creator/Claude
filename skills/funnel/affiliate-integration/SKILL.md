# Affiliate Integration Skill

⚠️ **Load skill này MỌI lần build funnel** — sales, leads, webinar, booking, challenge. KHÔNG đợi user mention "affiliate". Snippet vô hại nếu funnel chưa có affiliate active, nhưng thiếu thì sau muốn enable phải re-deploy toàn bộ.

Skill này định nghĩa: (1) JS snippet chuẩn, (2) rule inject vào từng loại funnel, (3) checklist verify, (4) **kiến trúc cross-domain với Customer Portal**.

---

## Kiến Trúc Tổng — Funnel ↔ Customer Portal

```
┌─────────────────────────────────────────────────────────┐
│  AFFILIATE DASHBOARD (Customer Portal)                  │
│  customer-portal.vercel.app/affiliate                   │
│  ↳ thấy danh sách funnels + share link per funnel       │
└─────────────────┬───────────────────────────────────────┘
                  │ affiliate share link
                  ↓
┌─────────────────────────────────────────────────────────┐
│  FUNNEL (deploy riêng — domain khác)                    │
│  funnel-A.vercel.app/?ref=XYZ789                        │
│  ↳ JS snippet detect ref → localStorage 30 ngày         │
└─────────────────┬───────────────────────────────────────┘
                  │ visitor opt-in / mua hàng
                  ↓
┌─────────────────────────────────────────────────────────┐
│  CUSTOMER PORTAL — Single Source of Truth               │
│  • POST /api/capture-lead   (lưu utm)                   │
│  • POST /api/webhook-sepay  (last-click attribution)    │
└─────────────────────────────────────────────────────────┘
```

**Nguyên tắc:** Funnel deploy ở 1 domain, Customer Portal ở domain khác. Funnel cross-domain call vào Portal. Cần config `CUSTOMER_PORTAL_URL` trong `.env` của funnel.

---

## ⚠️ Hard Gate: CUSTOMER_PORTAL_URL Bắt Buộc

Trước khi build funnel có affiliate tracking:

1. **Đọc** `.env` của kit (root) — check `CUSTOMER_PORTAL_URL`
2. Nếu thiếu → DỪNG, nhắc user setup Customer Portal trước:
   ```
   ⚠️ Cần CUSTOMER_PORTAL_URL trong .env trước khi build funnel có affiliate.
   Chạy: vercel --prod ở apps/customer-portal/ → copy URL → add vào .env:
   CUSTOMER_PORTAL_URL=https://customer-portal-xxx.vercel.app
   ```
3. Nếu có → inject vào HTML, **KHÔNG để placeholder** `[PORTAL_URL]`
4. Sau khi deploy funnel → admin phải đăng ký funnel này vào portal:
   - Vào `/admin/funnels` → "Thêm Funnel" → nhập URL funnel vừa deploy
   - Affiliate dashboard sẽ tự thấy link `funnel-url/?ref=XYZ`

---

## Cách Hoạt Động Trong Funnel

```
Visitor click link affiliate: https://funnel.com/?ref=ABC123
          ↓
[JS snippet] detect ?ref=, lưu vào localStorage (30 ngày)
          ↓
Opt-in form submit → capture-lead API nhận { ref: "ABC123" }
          ↓ (server validate + store utm_source='affiliate', utm_campaign='ABC123')
Lead tạo trong CRM với affiliate attribution

          — HOẶC —

Order form (sales page) → SePay QR description = "THANHTOAN slug email REF-ABC123"
          ↓
SePay webhook detect "REF-ABC123" → affiliate_conversion tạo tự động
```

---

## JS Snippet Chuẩn — Copy Nguyên Vào Mọi Funnel

Đặt snippet này trong thẻ `<head>` hoặc ngay trên closing `</body>` của **mọi page trong funnel** (landing, order, thank-you):

```html
<!-- Affiliate Tracking -->
<script>
(function(){
  // 1. Detect ?ref= từ URL hiện tại, lưu 30 ngày qua localStorage
  var p = new URLSearchParams(window.location.search);
  var ref = p.get('ref');
  if (ref) {
    localStorage.setItem('aff_ref', ref.toUpperCase());
    localStorage.setItem('aff_ref_ts', Date.now().toString());
  }
  // 2. Clear nếu quá 30 ngày
  var ts = parseInt(localStorage.getItem('aff_ref_ts') || '0');
  if (Date.now() - ts > 30 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem('aff_ref');
    localStorage.removeItem('aff_ref_ts');
  }
})();

// Helper: lấy ref hiện tại (dùng trong form submit)
function getAffiliateRef() {
  return localStorage.getItem('aff_ref') || null;
}
</script>
<!-- End Affiliate Tracking -->
```

**Tại sao localStorage thay vì cookie?**
- Cookie cần `Set-Cookie` từ server hoặc `document.cookie` JS — phức tạp hơn
- localStorage đủ dùng cho single-domain funnel và persist qua navigation
- 30-day expiry check thủ công tương đương cookie expires

---

## Rule 1 — Opt-in Funnel (Leads Funnel)

### Vị trí inject snippet
- `index.html` (opt-in page): trong `<head>`
- `thank-you.html`: trong `<head>` (để capture ref nếu visitor share link có ref)

### Form Submit Handler — thêm `ref`

Tìm function `handleSubmit` hoặc `submitForm` trong HTML, thêm `ref`:

```javascript
async function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Đang xử lý...';

  const payload = {
    name:         document.getElementById('name')?.value || '',
    email:        document.getElementById('email').value.trim(),
    phone:        document.getElementById('phone')?.value || '',
    source:       'funnel',
    page_url:     window.location.href,
    utm_source:   new URLSearchParams(location.search).get('utm_source'),
    utm_campaign: new URLSearchParams(location.search).get('utm_campaign'),
    utm_medium:   new URLSearchParams(location.search).get('utm_medium'),
    ref:          getAffiliateRef(), // ← THÊM DÒNG NÀY
  };

  try {
    const res = await fetch('[PORTAL_URL]/api/capture-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = './thank-you/';
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Nhận ngay';
  }
}
```

**Quan trọng:** Không cần thay đổi gì thêm — `capture-lead.ts` tự validate ref, tự lưu attribution.

---

## Rule 2 — Sales Page Funnel (Có Payment SePay)

### Vị trí inject snippet
- `index.html` (sales page): trong `<head>`
- `order/index.html` (order form): trong `<head>` — **quan trọng nhất**
- `thank-you/index.html`: trong `<head>`

### Order Form — inject ref vào SePay description

Tìm đoạn code generate SePay QR code hoặc payment description trong `order/index.html`.
Thay dòng tạo `description`:

```javascript
// TRƯỚC (không có affiliate):
const description = `THANHTOAN ${slug} ${email}`;

// SAU (có affiliate tracking):
const affRef = getAffiliateRef();
const description = affRef
  ? `THANHTOAN ${slug} ${email} REF-${affRef}`
  : `THANHTOAN ${slug} ${email}`;
```

### Tại sao dùng description thay vì capture-lead?

Sales funnel không nhất thiết có opt-in step trước payment. Khách có thể:
1. Click link affiliate → thẳng tới sales page → order form → thanh toán
2. Không để lại email trước khi mua

Description trong lệnh chuyển khoản là cách duy nhất truyền ref đến SePay webhook.
SePay webhook đã handle: `tokens.find(t => t.startsWith('REF-'))?.replace('REF-', '')`

### Nếu funnel có cả opt-in + sales page (double-funnel)

Ref tự động persist qua localStorage. Không cần làm gì thêm — affiliate ref lưu từ lúc opt-in, dùng lại khi order.

---

## Rule 3 — Webinar / Booking Funnel (Có Registration Form)

Webinar và booking funnel đều có registration form. Apply Rule 1 (opt-in approach):
- Inject snippet vào tất cả pages
- Thêm `ref: getAffiliateRef()` vào payload của registration form submit

```javascript
// Registration form payload cho webinar/booking:
const payload = {
  name:     nameInput.value,
  email:    emailInput.value,
  source:   'webinar_registration', // hoặc 'booking_registration'
  ref:      getAffiliateRef(), // ← THÊM
  page_url: window.location.href,
};
```

---

## Rule 4 — Challenge Funnel

Challenge funnel thường có cả registration + payment. Apply cả hai rules:
- Registration step → Rule 1 (capture-lead với ref)
- Payment step → Rule 2 (SePay description với REF-)

---

## funnel.json — Thêm Affiliate Config

Khi funnel có affiliate integration, thêm block này vào `funnel.json`:

```json
{
  "affiliate": {
    "enabled": true,
    "tracking": "localStorage + capture-lead",
    "param": "?ref=AFFILIATE_CODE",
    "portal_capture_url": "[PORTAL_URL]/api/capture-lead",
    "note": "ref auto-detected, 30-day window, last-click attribution"
  }
}
```

---

## Checklist Verify Affiliate Tracking

Sau khi inject, test theo flow sau:

### Test 1 — Opt-in tracking
```
1. Mở: https://[funnel-url]/?ref=TEST01
2. DevTools → Application → localStorage → kiểm tra key "aff_ref" = "TEST01"
3. Submit form opt-in với email test
4. Mở Customer Portal → admin → Leads → tìm email test
5. Kiểm tra: utm_source = "affiliate", utm_campaign = "TEST01"
✓ Nếu đúng: opt-in tracking OK
```

### Test 2 — Payment tracking
```
1. Mở: https://[funnel-url]/order/?ref=TEST01 (hoặc persist từ Test 1)
2. Điền order form → xem preview SePay description
3. Description phải chứa "REF-TEST01"
4. Sau khi thanh toán test: Customer Portal → admin → Affiliates
5. Affiliate với code TEST01 phải có 1 conversion mới
✓ Nếu đúng: payment tracking OK
```

### Test 3 — Cross-page persistence
```
1. Mở: https://[funnel-url]/?ref=TEST01
2. Navigate sang: https://[funnel-url]/order/ (KHÔNG có ?ref= trong URL này)
3. DevTools → localStorage → "aff_ref" vẫn = "TEST01"
✓ localStorage persist qua navigation
```

---

## Lỗi Thường Gặp

| Vấn đề | Nguyên nhân | Fix |
|--------|-------------|-----|
| ref không lưu | Snippet chưa được thêm vào page | Kiểm tra `<head>` của tất cả pages |
| ref lưu nhưng capture-lead không nhận | `ref` field không có trong payload | Thêm `ref: getAffiliateRef()` vào payload |
| SePay description không có REF- | Code generate description chưa gọi `getAffiliateRef()` | Thêm affRef vào description string |
| Affiliate không thấy conversion | Affiliate chưa approved trong portal | Admin vào `/admin/affiliates` → approve |
| ref expire | Visitor click link > 30 ngày trước khi mua | Normal behavior — 30-day window |

---

## PORTAL_URL — Inject Bắt Buộc Khi Build

Trong tất cả snippets trên, `[PORTAL_URL]` PHẢI được replace bằng URL thực **trước khi deploy**.

**Quy trình:**
1. Đọc `CUSTOMER_PORTAL_URL` từ `.env` của kit
2. Find/replace toàn bộ `[PORTAL_URL]` trong:
   - `index.html`, `thank-you.html`, `order/index.html` (mọi page có form)
3. Verify: grep `[PORTAL_URL]` trong output folder → phải không còn match

**Nếu funnel không dùng Customer Portal (Scenario B):**
- `capture-lead` không cần gọi → lead lưu vào Google Sheets via CRM webhook khác
- Attribution chỉ hoạt động qua SePay description (REF- token trong webhook)
- Affiliate dashboard không hiển thị funnel này (vì không có data về)

---

## Last-Click Attribution Logic (Đã Implement)

SePay webhook xử lý theo thứ tự:

1. **Ưu tiên 1 — REF token trong description** (= last click)
   - Visitor mới click affiliate ngay trước khi mua → REF có trong payment description
   - → Affiliate này ăn hoa hồng
2. **Fallback — utm trong leads table** (= first click)
   - Visitor opt-in từ lâu, mua sau qua link khác không có ref
   - → Affiliate ban đầu ăn hoa hồng

**Implication cho funnel design:**
- Sales page → order form → SePay → **luôn inject REF vào description** (snippet trên đã làm)
- Nếu skip bước này → mất attribution khi visitor click multi-funnel
- Lead capture (opt-in) chỉ là backup attribution, không phải primary
