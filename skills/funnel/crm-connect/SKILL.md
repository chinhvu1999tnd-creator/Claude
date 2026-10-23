---
name: crm-connect
description: "Kết nối CRM vào landing page đã có — kit HTML hoặc no-code tools (Ladipage, Webflow, WordPress)"
version: 1.0.0
agent: funnel
tags: [crm, minicrm, ladipage, webflow, wordpress, connect]
---

# CRM Connect Skill

Dùng khi landing page đã được build xong và cần kết nối với MiniCRM.
Khác với `crm` skill (dùng khi đang build), skill này inject vào page có sẵn.

## Điều kiện tiên quyết

Đọc `MINICRM.md` ở root project.

Nếu không tìm thấy:
```
MINICRM.md chưa có. Chạy /setup minicrm trước để kết nối portal.
```

Nếu có → đọc `portal_url` và `webhook_secret`.

## Script Template

Template script — thay `{{portal_url}}` và `{{webhook_secret}}` bằng giá trị thật từ MINICRM.md trước khi đưa cho user:

```html
<!-- MiniCRM Connect -->
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

## Luồng Xử Lý

Hỏi user: **"Anh đang kết nối với platform nào?"**

### [A] Kit HTML (file .html có sẵn)

1. Đọc file HTML (user cung cấp path hoặc tìm trong `output/funnel/`)
2. Tìm `</body>` tag
3. Chèn script template (đã điền URL + secret thật) ngay trước `</body>`
4. Lưu file
5. Thông báo: "✅ Đã inject CRM script vào {filename}. Deploy lại để có hiệu lực."

### [B] Ladipage

Điền URL + secret thật vào script template, sau đó output:

```
✅ Copy toàn bộ đoạn script bên dưới:

{SCRIPT ĐÃ ĐIỀN URL + SECRET}

📋 Các bước trong Ladipage:
1. Mở trang cần kết nối → nhấn "Chỉnh sửa"
2. Click ⚙️ (Cài đặt trang) góc trên phải
3. Tab "Mã HTML" → mục "Trước thẻ đóng </body>"
4. Dán script vào → Lưu
5. Nhấn "Xuất bản"

🔍 Verify:
- Submit thử form với email test@example.com
- Vào MiniCRM Admin → KHTN → email vừa điền có xuất hiện không?
```

### [C] Webflow

Điền URL + secret thật vào script template, sau đó output:

```
✅ Copy toàn bộ đoạn script bên dưới:

{SCRIPT ĐÃ ĐIỀN URL + SECRET}

📋 Các bước trong Webflow:
1. Mở project → Page Settings của trang cần kết nối
2. Cuộn xuống "Custom Code" → mục "Before </body> tag"
3. Dán script → Save
4. Publish site

🔍 Verify: Submit form test → check MiniCRM Admin → KHTN
```

### [D] WordPress

Điền URL + secret thật vào script template, sau đó output:

```
✅ Copy toàn bộ đoạn script bên dưới:

{SCRIPT ĐÃ ĐIỀN URL + SECRET}

📋 Cách 1 — Plugin (dễ nhất):
1. Cài plugin "Insert Headers and Footers" (miễn phí)
2. Settings → Insert Headers and Footers
3. Dán script vào mục "Scripts in Footer"
4. Save

📋 Cách 2 — Theme Editor:
1. Appearance → Theme Editor → footer.php
2. Dán script trước dòng </body>
3. Update File

🔍 Verify: Submit form test → check MiniCRM Admin → KHTN
```

### [E] Platform khác

Điền URL + secret thật vào script template, sau đó output:

```
✅ Copy toàn bộ đoạn script bên dưới:

{SCRIPT ĐÃ ĐIỀN URL + SECRET}

📋 Hướng dẫn chung:
Dán script này vào phần Custom HTML / Footer Code của platform,
ngay trước thẻ đóng </body> của trang cần kết nối.

Nếu platform không cho phép custom HTML:
→ Liên hệ support của platform
→ Hoặc dùng Google Tag Manager (GTM) để inject script
```

## Lý do không dùng native form webhook của Ladipage

Ladipage gửi POST dạng `application/x-www-form-urlencoded`, không cho phép set custom header.
Không truyền được `X-Webhook-Secret` theo cách này.
Script inject qua Custom HTML là cách duy nhất hoạt động ổn định trên mọi no-code tool.
