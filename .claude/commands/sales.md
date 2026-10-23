---
description: Sales Agent — xử lý từ chối, follow-up, chốt sale, DM scripts (tư vấn + bán hàng có sự tham gia của con người)
argument-hint: [ý định tự nhiên] VD: "xử lý khách nói đắt" | "follow up lead chưa mua" | "chốt sale qua zalo"
agent: sale-dm
---

<args>$ARGUMENTS</args>

## Tier Availability Check (CHẠY TRƯỚC TIÊN)

Trước khi load skill cho sub-action `enablement` (deck/one-pager/proposal), verify:
- Check folder: `skills/sales/sales-enablement/`
- Nếu KHÔNG tồn tại → respond:

```
"Sales Enablement (deck/one-pager/proposal) có trong gói PRO/ALL.
 Trong BASIC, em hỗ trợ:
 - objection (xử lý từ chối)
 - followup (theo dõi lead)
 - dm (kịch bản inbox/Zalo)
 - close (chốt sale)
 Anh/chị muốn sub-action nào trong 4 cái trên?"
```

→ KHÔNG tiếp tục load skill nếu folder không tồn tại.

## Intent Detection

| Tín hiệu | Task |
|----------|------|
| "objection", "từ chối", "phản đối", "xử lý", "khách nói", "đắt", "để suy nghĩ", "không có tiền" | → **objection** |
| "followup", "follow up", "follow-up", "chưa mua", "theo dõi", "nurture", "lead nguội", "lead ấm", "lead lạnh" | → **followup** |
| "dm", "nhắn tin", "inbox", "zalo", "messenger", "direct message", "tiếp cận" | → **dm** |
| "close", "chốt", "closing", "chốt sale", "call chốt", "kịch bản chốt" | → **close** |
| "deck", "pitch deck", "sales deck", "presentation", "slide thuyết trình" | → **enablement** |
| "one-pager", "tài liệu giới thiệu", "proposal", "báo giá", "leave-behind" | → **enablement** |
| "demo script", "kịch bản demo", "call script", "discovery call" | → **enablement** |
| "objection guide", "objection library", "16 objections", "bộ xử lý từ chối" | → **enablement** |
| "abandoned", "bỏ giỏ", "chưa thanh toán", "unpaid", "đơn hủy", "recover", "khôi phục đơn" | → ⚠️ **Đây là automation funnel** — trỏ sang `/email abandoned-cart` thay vì xử lý ở đây |
| Không rõ | → Hỏi: "Anh/chị cần: (A) Xử lý từ chối, (B) Follow-up, (C) DM scripts, (D) Chốt sale, hay (E) Sales materials (deck/one-pager/demo script)?" |

---

## Execution

**Trước tất cả:** Đọc `BUSINESS.md` — lấy sản phẩm, giá, audience.

### objection — Xử Lý Từ Chối
1. Load `agents/sale-dm/agent.md`
2. Load `skills/sales/objection-handler/SKILL.md`
3. Extract loại từ chối từ args (giá / thời gian / tin tưởng / cần hỏi ý kiến...)
4. Output: Script xử lý cho inbox, comment, và call — 3 phiên bản

### followup — Follow-Up Sequence
1. Load `agents/sale-dm/agent.md`
2. Load `skills/sales/follow-up-sequence/SKILL.md`
3. Extract "nhiệt độ" lead từ args: hot (hỏi nhiều) / warm (quan tâm nhẹ) / cold (ít tương tác) / ghost (mất liên lạc)
4. Output: Chuỗi tin nhắn 3-7 ngày cho đúng nhiệt độ lead

### dm — DM Scripts
1. Load `agents/sale-dm/agent.md`
2. Load `skills/sales/dm-scripts/SKILL.md`
3. Extract scenario từ args: inbound (họ nhắn trước) / outbound (mình chủ động) / comment-to-DM
4. Extract channel: Zalo / Facebook / Instagram
5. Output: Script theo đúng scenario + channel

### close — Closing Scripts
1. Load `agents/sale-dm/agent.md`
2. Load `skills/sales/closing-scripts/SKILL.md`
3. Xác định format: call (tư vấn điện thoại/video) hoặc chat (Zalo/inbox)
4. Output: Kịch bản chốt đầy đủ + xử lý 5 objection phổ biến cuối cùng

### enablement — Sales Materials

1. Load `agents/sale-dm/agent.md`
2. Load `skills/sales/sales-enablement/SKILL.md`
3. Xác định asset type từ args:
   - deck/pitch → load `references/deck-frameworks.md` → build 11-slide outline
   - one-pager → load `references/one-pager-templates.md` → chọn đúng template type
   - objection guide → load `references/objection-library.md` → customize theo product
   - demo script → load `references/demo-scripts.md` → chọn call type
4. Đọc `BUSINESS.md` — điền product, offer, audience vào template
5. Output: Draft material hoàn chỉnh sẵn sàng dùng

---

## Ví Dụ Hoạt Động

```
/sales xử lý khách nói "để tôi suy nghĩ thêm"
→ objection | type = "cần thời gian suy nghĩ"

/sales follow up lead warm chưa mua sau 3 ngày qua zalo
→ followup | temperature = warm | channel = zalo | days = 3

/sales tôi cần kịch bản nhắn tin chủ động cho khách outbound trên facebook
→ dm | scenario = outbound | channel = facebook

/sales kịch bản chốt sale qua zalo cho khóa coaching 5 triệu
→ close | format = chat | product = "coaching 5.000.000đ"

/sales recover đơn chưa thanh toán khóa học 1.997.000đ
→ ⚠️ Đây là automation, không phải human sales
→ Trả lời: "Abandoned order là automation funnel. Dùng /funnel abandoned-order để setup."
```

---

## Output

Sau khi tạo xong, **lưu vào file** tại:

```
output/sales/[YYYY-MM-DD]-[task]-[topic-slug].md

Ví dụ:
output/sales/2026-05-09-objection-scripts-fbads.md
output/sales/2026-05-09-followup-warm-zalo.md
output/sales/2026-05-09-dm-scripts-outbound-facebook.md
```

**Dùng Write tool để tạo file** — không chỉ hiện trong conversation.
