---
name: crm
description: "Kết nối funnel với CRM — MiniCRM (Supabase), Google Sheets, hoặc external CRM"
version: 3.0.0
agent: funnel
tags: [crm, minicrm, google-sheets, leads, automation, webhook]
---

# CRM Skill

Kết nối form opt-in trên landing page với CRM để tự động lưu leads.

## Phát hiện CRM tự động (Customer Portal = default)

⭐ **Customer Portal (Supabase) là CRM mặc định của kit** — bundled + auto-setup qua `/coach setup-crm`. Google Sheets chỉ là fallback nhẹ cho khách KHÔNG muốn deploy Portal.

**Detection order (KHÔNG hỏi menu nếu Portal đã có):**

```
1. CUSTOMER_PORTAL_URL có trong .env?
   → CÓ → Portal đã deploy → dùng MiniCRM (Option D), KHÔNG hỏi gì
      → Đọc MINICRM.md (nếu có) lấy product catalog (course/product IDs)
      → Inject MiniCRM snippet ngay

2. CUSTOMER_PORTAL_URL trống nhưng MINICRM.md tồn tại?
   → Đọc portal_url từ MINICRM.md → dùng MiniCRM (legacy path)

3. CRM_WEBHOOK_URL có trong .env?
   → Đã setup Google Sheets từ trước → dùng Sheets, bỏ qua bước hỏi

4. Không có gì (Portal chưa setup)?
   → Gợi ý setup Portal TRƯỚC (recommended), fallback Sheets nếu user từ chối:
```

**Khi Portal chưa setup — gợi ý (KHÔNG phải menu 4 option ngang hàng):**

```
"CRM mặc định của kit là Customer Portal (Supabase) — quản lý orders + customers
+ affiliate + member dashboard, tự động hoá đầy đủ.

Anh/chị chưa setup Portal. Em đề xuất:

(A) Setup Customer Portal ngay — /coach setup-crm (~15 phút) [KHUYẾN NGHỊ]
    → Full CRM: orders, customers, affiliate, auto-delivery, email sequences

(B) Dùng Google Sheets tạm — fallback nhẹ (5 phút, không cần deploy Supabase/Vercel)
    → Chỉ lưu leads vào Sheet, không có member dashboard / auto-delivery
    → Phù hợp nếu anh/chị chưa sẵn sàng deploy, muốn test nhanh

Anh/chị chọn? (A khuyến nghị mạnh — Portal là core của kit)"
```

→ Google Sheets (Option B) = **fallback rõ ràng**, không ngang hàng với Portal.
→ External CRM (HubSpot/Notion/Airtable): chỉ khi user chủ động yêu cầu — không show trong default flow.

## Option D — MiniCRM (khi MINICRM.md tồn tại)

Đọc `MINICRM.md` → lấy `portal_url` và `webhook_secret`.

Inject script block sau vào HTML page trước `</body>` (thay {{portal_url}} và {{webhook_secret}} bằng giá trị thật):

```html
<!-- MiniCRM Connect — auto by funnel skill -->
<script>
(function(){
  var URL    = '{{portal_url}}';
  var SECRET = '{{webhook_secret}}';
  function utms(){var p=new URLSearchParams(location.search);return{utm_source:p.get('utm_source'),utm_campaign:p.get('utm_campaign'),utm_medium:p.get('utm_medium'),utm_term:p.get('utm_term'),utm_content:p.get('utm_content')};}
  function capture(d){fetch(URL+'/api/webhook/lead',{method:'POST',headers:{'Content-Type':'application/json','X-Webhook-Secret':SECRET},body:JSON.stringify(Object.assign({},d,utms(),{source:'landing_page',page_url:location.href}))}).catch(function(){});}
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('form').forEach(function(f){
      f.addEventListener('submit',function(){
        var e=f.querySelector('[name=email],[type=email]'),n=f.querySelector('[name=name],[name=ho-ten]'),p=f.querySelector('[name=phone],[name=sdt]');
        if(e&&e.value)capture({email:e.value,name:n?n.value:'',phone:p?p.value:''});
      });
    });
  });
  window.CRM={capture:capture};
})();
</script>
```

**Nguyên tắc bất biến:**
- Script dùng `.catch(function(){})` — lỗi webhook **không bao giờ** block form submit
- Auto-detect form bằng `[name=email]` hoặc `[type=email]` — không cần đặt attribute
- `window.CRM.capture(data)` expose global để dùng thủ công trong onclick hoặc custom JS

---

# Mini CRM Skill

Google Sheets làm database, Apps Script làm webhook backend. Zero monthly cost. Không Gmail, không Drive scope, không bị Google chặn.

Lead magnet giao qua nút Zalo / Telegram trên thank-you page — không cần email.

## Khi Nào Dùng

- Setup lần đầu: làm thủ công 1 lần theo hướng dẫn bên dưới (~5 phút)
- Mọi funnel sau này tự động đẩy data về đây qua `CRM_WEBHOOK_URL`

## Fallback CRM (CHỈ khi user từ chối Customer Portal)

⚠️ **Section này chỉ dùng khi**: `CUSTOMER_PORTAL_URL` trống VÀ user chọn (B) Google Sheets / external CRM ở bước "Phát hiện CRM tự động" phía trên.

→ Nếu Portal đã setup → BỎ QUA section này, dùng MiniCRM (Option D).

Khi user chọn fallback:

```
Fallback nào?

A) Google Sheets + Apps Script — miễn phí, 5 phút, không cần deploy
   → Chỉ lưu leads, KHÔNG có member dashboard / auto-delivery / affiliate
   → Phù hợp test nhanh hoặc chưa sẵn sàng deploy Portal

B) Kết nối CRM có sẵn (HubSpot, Notion, Airtable...)
   → Chỉ khi user CHỦ ĐỘNG yêu cầu — cung cấp API docs + key

C) Bỏ qua — chỉ form redirect, leads không lưu
   → Funnel vẫn chạy, kết nối CRM sau
```

> 💡 Sau khi dùng fallback, nếu user muốn upgrade lên Portal đầy đủ → `/coach setup-crm` bất kỳ lúc nào.

### Nếu chọn B — Kết Nối CRM Bên Ngoài

User cung cấp:
1. **API docs URL** — trang tài liệu API của CRM (ví dụ: `developers.hubspot.com/docs/api/crm/contacts`)
2. **Endpoint nhận lead** — URL endpoint để tạo contact/lead mới
3. **API key hoặc Bearer token** — để xác thực request

Tôi sẽ:
1. Đọc API docs
2. Viết `fetch()` đúng format (method, headers, body mapping)
3. Thay thế Google Sheets webhook trong form bằng CRM endpoint
4. Lưu API key vào `.env`: `CRM_API_KEY=...`
5. Test bằng cách submit form thử

**Ví dụ các CRM phổ biến:**
| CRM | Endpoint thường dùng |
|-----|---------------------|
| HubSpot | `POST /crm/v3/objects/contacts` |
| Airtable | `POST /v0/{baseId}/{tableId}` |
| Notion | `POST /v1/pages` |
| Brevo (Sendinblue) | `POST /v3/contacts` |
| GetResponse | `POST /contacts` |

> Lưu ý: API key nhạy cảm — không commit vào git, chỉ lưu trong `.env`

## Setup Google Sheets (quan trọng: đúng thứ tự)

```
1. sheets.google.com → Tạo bảng tính mới → đặt tên "AI Agent Business Kit — CRM"
2. Trong Sheet: Extensions → Apps Script   ← PHẢI từ trong Sheet, không phải script.google.com
3. Paste toàn bộ scripts/Bootstrap.gs → Save
4. Chọn function "setup" → ▶ Run → Allow
   (Chỉ xin 2 quyền: Sheets + External requests — không có Gmail/Drive)
5. Deploy → New deployment → Web App
   Execute as: Me | Who has access: Anyone
6. Copy Webhook URL → dán vào .env: CRM_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

> Tại sao phải mở từ trong Sheet? Container-bound script chỉ cần Sheets scope.
> Nếu tạo từ script.google.com, Apps Script yêu cầu Drive scope → Google chặn.

## Cấu Trúc 4 Tab

| Tab | Mục đích |
|-----|---------|
| 📥 Leads | Tất cả contact từ mọi funnel — deduplicated theo số điện thoại |
| 💰 Customers | Tất cả người đã thanh toán |
| 🎯 Funnel Settings | Config Zalo/Telegram link theo từng funnel |
| 📊 Dashboard | Metrics tự động — leads, revenue, conversion rate |

## Funnel Settings — Các Trường

| Cột | Giải thích |
|-----|-----------|
| Funnel Slug | Tên ngắn khớp với `source` trong form POST. VD: `claude-ai-blueprint` |
| Tên hiển thị | Hiện trong Telegram notification |
| Type | `leads` / `sales` / `webinar` / `booking` |
| Link nhóm Zalo | URL nhóm Zalo để nhận tài liệu |
| Link Telegram | URL channel/group Telegram |
| Tin nhắn giao tài liệu | Hiển thị trên thank-you page (optional) |
| Trạng thái | `🟢 Active` để kích hoạt |
| Telegram notify | `TRUE` / `FALSE` |

## Kết Nối Form

Form POST lên `CRM_WEBHOOK_URL` với payload:

```javascript
// Lead từ opt-in page
{
  action:       'lead',
  name:         'Nguyễn Văn A',
  phone:        '0901234567',
  source:       'claude-ai-blueprint',   // ← phải khớp Funnel Slug
  utm_source:   'facebook',
  utm_medium:   'cpc',
  utm_campaign: 'spring-2025'
}

// Đơn hàng từ SePay webhook
{
  action:   'order',
  phone:    '0901234567',
  product:  'Khóa học Facebook Ads',
  amount:   1997000,
  order_id: 'ORD-20250509-1234'
}
```

## Deduplication

- Leads dedup theo **số điện thoại**
- Nếu submit lại (re-opt-in): không tạo row mới, chỉ ghi note + cập nhật `Ngày liên hệ cuối`

## Telegram Setup (optional)

Sau khi có bot token và chat ID, chạy trong Apps Script editor:

```javascript
setupTelegram('YOUR_BOT_TOKEN', 'YOUR_CHAT_ID');
```

## Scripts

```
scripts/
├── Bootstrap.gs   ← 1 file duy nhất, paste vào Extensions → Apps Script
└── README.md      ← hướng dẫn chi tiết
```
