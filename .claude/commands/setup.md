---
description: Khởi tạo kit — phỏng vấn business, tạo THEME.md, setup mini CRM, hoặc setup integration (Telegram, SePay).
argument-hint: [update | theme | business | crm | telegram | sepay] hoặc bỏ trống
---

<args>$ARGUMENTS</args>

## Intent Detection

| Args | Hành động | Skill load |
|------|----------|-----------|
| Trống hoặc "start" | Setup đầy đủ (BUSINESS.md + THEME.md + CRM + gợi ý Telegram) | — |
| "update", "cập nhật" | Hỏi lại toàn bộ hoặc từng phần | — |
| "theme", "màu sắc", "giao diện" | Chỉ cập nhật THEME.md (2 câu) | — |
| "business", "thông tin" | Chỉ cập nhật BUSINESS.md | — |
| "crm" | Setup/redeploy mini CRM | `skills/funnel/crm/SKILL.md` |
| "minicrm", "mini crm", "portal" | Kết nối MiniCRM portal với funnel | — (inline) |
| "telegram", "noti", "thông báo" | Setup Telegram bot notification | `skills/deliver/telegram-notification/SKILL.md` |
| "sepay", "thanh toán", "vietqr" | Setup SePay payment webhook | `skills/deliver/payment-confirm/SKILL.md` |
| "webhook" | Custom webhook endpoint | `skills/funnel/crm/SKILL.md` (custom integration section) |

---

## Execution — Setup Đầy Đủ

---

## Execution — Setup MiniCRM (khi args = "minicrm")

Chạy khi user muốn kết nối MiniCRM portal với kit funnels.
**Điều kiện:** MiniCRM đã deploy lên Vercel. Nếu chưa → hướng dẫn deploy trước.

### Bước 1 — Hỏi thông tin kết nối

Hỏi từng câu, chờ trả lời xong mới hỏi tiếp:

**Câu 1:** "Portal URL của anh là gì?"
→ VD: `https://ten-project.vercel.app` (không có dấu `/` cuối)

**Câu 2:** "Webhook secret? (Copy từ Admin → Cài đặt → Webhook → Webhook Secret)"
→ Nếu chưa có: hướng dẫn vào admin panel → Settings → Webhook → nhấn "Tạo secret mới"

### Bước 2 — Fetch catalog tự động

Gọi endpoint để lấy courses + products. Dùng Bash tool:

```bash
curl -s -H "X-Webhook-Secret: {webhook_secret}" {portal_url}/api/catalog
```

Nếu 401 → "Secret không đúng — vào Admin → Cài đặt → Webhook → kiểm tra lại"
Nếu connection refused → "Portal chưa live — kiểm tra Vercel dashboard"

### Bước 3 — Hỏi defaults

**Câu 3:** "Cohort mặc định khi provision là gì?" → VD: K3

**Câu 4:** "Gửi magic link email cho khách mới sau khi mua không?" → yes / no

### Bước 4 — Tạo MINICRM.md

Tạo file `MINICRM.md` ở root project với đúng format — điền giá trị thật từ các bước trên và từ catalog API response:

```
# MiniCRM Config

## Portal

portal_url: {portal_url}
webhook_secret: {webhook_secret}

## Khoá học

{list từng course trong catalog response}
- id: {course.id}
  title: {course.title}
  cohort: {default_cohort từ câu 3}
  price: {course.price}

## Sản phẩm số

{list từng product trong catalog response}
- id: {product.id}
  name: {product.name}
  type: {product.type}
  price: {product.price}

## Defaults

default_source: landing_page
default_cohort: {câu 3}
send_magic_link: {câu 4}
```

### Bước 5 — Hỏi .gitignore

"Repo này có public không?"
- Có → Thêm dòng `MINICRM.md` vào `.gitignore`
- Không → Bỏ qua

### Bước 6 — Confirm xong

```
✅ MINICRM.md đã tạo!

Từ giờ:
• Mọi funnel HTML từ kit → tự động kết nối CRM
• Kết nối Ladipage/no-code: gõ "kết nối CRM" → chạy crm-connect skill
• Thêm khoá học mới: chạy /setup minicrm lại để sync

SePay webhook URL (điền vào SePay dashboard):
{portal_url}/api/webhook/provision
Header: X-Webhook-Secret: {webhook_secret}
```

---

### Bước 0 — Kiểm tra trạng thái

Đọc `BUSINESS.md`. Nếu `Tên thương hiệu` vẫn là `[Chưa điền...]`:

```
Chào anh/chị! Em cần hỏi vài câu để hiểu business —
sau đó tất cả lệnh trong kit sẽ hoạt động đúng ngay, không cần hỏi lại.
```

Nếu đã điền và không có argument `update`:
```
BUSINESS.md đã có thông tin. Anh/chị muốn:
A) Cập nhật toàn bộ
B) Cập nhật một phần — nói section nào
C) Bỏ qua, xem dependency status
```

---

### TẦNG 1 — Checkpoint (3 câu, luôn hỏi)

Hỏi **từng câu một**, chờ trả lời xong mới hỏi tiếp.

**Câu 1:** Tên thương hiệu hoặc tên business là gì?

**Câu 2:**
```
Anh/chị đang ở giai đoạn nào?
A) Đang khám phá — chưa có sản phẩm, đang tìm hướng
B) Mới bắt đầu — đã có ý tưởng hoặc sản phẩm đầu tiên
C) Đang phát triển — đã có khách hàng, muốn scale
```
→ Lưu giai đoạn để routing Tầng 2.

**Câu 3:** Anh/chị muốn giúp ai? (VD: "Chủ shop Shopee mới mở", "Coach muốn tự động hoá marketing")

---

### TẦNG 2 — Conditional (tuỳ giai đoạn)

**Nếu A — Đang khám phá:**
- Câu 4: Vấn đề lớn nhất muốn giúp họ giải quyết?
- Câu 5: Kênh dự định dùng? (Facebook, TikTok, Zalo...)

**Nếu B — Mới bắt đầu:**
- Câu 4: Sản phẩm/dịch vụ là gì? (tên + loại + giá nếu có)
- Câu 5: Khách hàng đạt kết quả gì sau khi dùng? (một câu cụ thể)
- Câu 6: Kênh đang hoặc dự định dùng?

**Nếu C — Đang phát triển:**
- Câu 4: Sản phẩm chính hiện tại? (tên + giá)
- Câu 5: Khách hàng đạt kết quả gì cụ thể?
- Câu 6: Đối thủ cạnh tranh? (2–3 tên)
- Câu 7: Điểm khác biệt so với họ? (một câu)
- Câu 8: Kênh đang dùng?

---

### TẦNG 3 — Quick Close (1 câu)

Ưu tiên lớn nhất trong 30 ngày tới? (VD: "Ra mắt khóa học", "Tăng leads", "Xây landing page")

---

### Ghi BUSINESS.md

Ghi đè toàn bộ theo template đúng giai đoạn (A/B/C). Xem chi tiết template tại `skills/` nếu cần.

**Template A (Đang khám phá):**
```
# BUSINESS.md
> Cập nhật: [hôm nay] | Giai đoạn: Đang khám phá
**Tên thương hiệu:** [câu 1]
**Target audience:** [câu 3]
**Vấn đề muốn giải quyết:** [câu 4]
**Kênh dự kiến:** [câu 5]
**Ưu tiên 30 ngày:** [câu 6]
```

**Template B (Mới bắt đầu):**
```
# BUSINESS.md
> Cập nhật: [hôm nay] | Giai đoạn: Mới bắt đầu
**Tên thương hiệu:** [câu 1] | **Audience:** [câu 3]
**Sản phẩm:** [câu 4] | **Kết quả khách hàng:** [câu 5]
**Kênh:** [câu 6] | **Ưu tiên 30 ngày:** [câu 7]
```

**Template C (Đang phát triển):**
```
# BUSINESS.md
> Cập nhật: [hôm nay] | Giai đoạn: Đang phát triển
**Tên thương hiệu:** [câu 1] | **Audience:** [câu 3]
**Sản phẩm chính:** [câu 4] | **Kết quả KH:** [câu 5]
**Đối thủ:** [câu 6] | **Khác biệt:** [câu 7]
**Kênh:** [câu 8] | **Ưu tiên 30 ngày:** [câu 9]
```

---

### TẦNG 4 — Brand Theme (2 câu, luôn hỏi)

```
Cuối cùng, 2 câu về hình ảnh thương hiệu —
để landing page và email sau này nhất quán.
```

**Câu theme 1:** Màu chủ đạo thương hiệu là gì? (hex như #FF6B35 hoặc mô tả: "xanh navy", "cam"...)

**Câu theme 2:**
```
Phong cách thương hiệu muốn trông như thế nào?
A) Chuyên nghiệp & tin cậy — màu trầm, font cứng cáp
B) Năng động & trẻ trung — màu sặc sỡ, bo góc lớn
C) Tối giản & hiện đại — ít màu, nhiều whitespace
D) Ấm áp & gần gũi — màu đất, font có chân
```

→ Auto-generate THEME.md từ 2 câu này — dùng preset A/B/C/D tương ứng với lựa chọn phong cách.

---

### TẦNG 4.5 — Brand System (ngay sau THEME.md)

Sau khi ghi THEME.md, gợi ý ngay — không hỏi thêm câu nào:

```
⚡ Muốn gen brand book & design system cho thương hiệu luôn không?
   /brand → tạo design-system.html + brand-book-a4.pdf (~1 phút)
   Hoặc bỏ qua, gen sau bất cứ lúc nào.
```

Nếu user đồng ý → chạy `/brand` inline.
Nếu đã có subfolder trong `output/design/` → `✅ Brand system đã có` và bỏ qua.

---

### TẦNG 5 — Setup CRM (luôn chạy sau THEME, giai đoạn B và C)

Sau khi ghi THEME.md, hỏi user:

```
Bạn muốn dùng CRM nào?

A) Tạo mini CRM mới (Google Sheets + Apps Script) — miễn phí, 5 phút
B) Kết nối CRM có sẵn — cung cấp API docs + endpoint + key, tôi cấu hình
C) Bỏ qua — kết nối sau

Gõ A / B / C:
```

Thực hiện theo lựa chọn — xem chi tiết tại `skills/funnel/crm/SKILL.md`.

Nếu CRM đã setup (có `CRM_WEBHOOK_URL` trong `.env`):
```
✅ CRM đã sẵn sàng — bỏ qua bước này.
```

---

### TẦNG 6 — Setup Telegram (optional, giai đoạn B và C)

Sau khi CRM xong, gợi ý ngay — không hỏi thêm câu nào:

```
⚡ Muốn nhận thông báo Telegram ngay khi có lead hoặc đơn hàng mới không?
   Setup 3 phút: node skills/funnel/deploy/scripts/setup-telegram.js
   Hoặc bỏ qua, setup sau bất cứ lúc nào.
```

Nếu user muốn setup ngay → chạy lệnh đó và hướng dẫn từng bước.
Nếu đã có `TELEGRAM_BOT_TOKEN` trong `.env` → hiện `✅ Telegram đã kết nối` và bỏ qua.

---

### Dependency Report (tự suy luận, không hỏi)

**Giai đoạn A:** "Chưa cần setup kỹ thuật. Bắt đầu bằng `/offer research [niche]`."

**Giai đoạn B hoặc C:**
```
Setup hoàn tất!

✅ Mini CRM       — Google Sheets tự động
✅ Telegram Bot   — thông báo real-time  (nếu đã setup)
⚠️ Telegram Bot  — chưa setup → node skills/funnel/deploy/scripts/setup-telegram.js
⚠️ SePay VietQR  — nhận thanh toán → hướng dẫn trong /funnel deploy
○  Vercel        — host landing page (miễn phí) → /funnel deploy
```

### Gợi ý lệnh tiếp theo

Mapping từ ưu tiên câu cuối:
- "validate niche / tìm hướng" → `/offer research [niche]`
- "xây sản phẩm / đóng gói" → `/offer build [product]`
- "ra mắt / bán hàng" → `/funnel sales page [product]`
- "tăng leads / xây danh sách" → `/funnel leads [topic]`
- "xây content / tăng followers" → `/content facebook batch`
- "phân tích đối thủ" → `/offer competitor [niche]`

---

## Quy Tắc

1. Hỏi từng câu một — không liệt kê toàn bộ
2. "Chưa biết" và "chưa có" là hợp lệ — ghi nguyên văn
3. Không validate hay phán xét câu trả lời
4. Ghi đè hoàn toàn BUSINESS.md và THEME.md
5. Toàn bộ setup không quá 10 phút
