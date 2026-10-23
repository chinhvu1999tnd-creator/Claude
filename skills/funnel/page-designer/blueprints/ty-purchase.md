---
blueprint: ty-purchase
page_count: 1 (shown after OTO or directly after payment if no OTO)
copy_ref: skills/funnel/sales-page-funnel/SKILL.md
---

# Thank You — Purchase Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `sales-page-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
>
> **Context:** Đây không phải sales page. Không có persuasion. Visitor vừa mua — nhiệm vụ duy nhất là xác nhận quyết định, giao sản phẩm ngay lập tức, và onboard họ vào community. Buyer's remorse xuất hiện trong vài phút đầu sau mua — page này ngăn điều đó bằng clarity và immediate delivery.

---

## Persuasion Arc — 5 Phases

```
CONFIRM → DELIVER → GUIDE → CONNECT → AMPLIFY
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **CONFIRM** | Resolve uncertainty — "giao dịch thành công, không sao cả" | Nhẹ nhõm, tin tưởng |
| **DELIVER** | Giao sản phẩm ngay — access link là CTA to nhất trang | Hành động ngay, không chờ đợi |
| **GUIDE** | Numbered steps rõ ràng — Step 1 luôn là immediate action | Biết phải làm gì tiếp theo |
| **CONNECT** | Join community — Zalo Group tăng LTV và giảm refund | Cảm thấy thuộc về một cộng đồng |
| **AMPLIFY** | Share — pre-filled message giảm friction | Muốn chia sẻ vì đang hưng phấn |

**Quy tắc:** Không có selling, không có urgency, không có pricing trên trang này. DELIVER phải là visual anchor của toàn bộ trang — to nhất, nổi bật nhất.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Purchase Header | CONFIRM | ✅ | Green checkmark + order summary + "check your inbox" instruction |
| S2 | Access CTA | DELIVER | ✅ | Largest, most prominent CTA on entire page — cannot be missed |
| S3 | Next Steps | GUIDE | ✅ | 3–4 numbered steps, Step 1 = immediate action, not passive |
| S4 | Community Join | CONNECT | ✅ | Zalo Group primary, FB Group optional secondary |
| S5 | Refer / Share | AMPLIFY | ✅ | Pre-filled share message, FB + Zalo share, copy link button |

**Mandatory count:** Tất cả 5 sections bắt buộc. Không có optional sections. Không thêm offers, không thêm upsells — upsell đã ở OTO page trước đó.

---

## Zone Design Intent — Creative Mode

### CONFIRM (S1)
- **Energy:** Relief — calm, warm, reassuring
- **Background:** `var(--surface)` với accent top border màu xanh lá/success
- **Typography:** Checkmark icon to và rõ ràng (không phải chữ — phải là icon hoặc SVG). Order number hiển thị. Email notice nhỏ bên dưới ("Receipt sent to your email")
- **Motion:** Minimal — checkmark có subtle scale-in animation khi load
- **Tone:** "Bạn vừa làm đúng rồi" — không phải "Cảm ơn đã mua"
- **Forbidden:** Không có giá, không có offer, không có urgency

### DELIVER (S2)
- **Energy:** Maximum action — đây là visual center của trang
- **Background:** `var(--bg)` flat — CTA button là visual element duy nhất, không background cạnh tranh
- **Typography:** Button text to nhất trang (`clamp(1.2rem, 3vw, 1.8rem)`). Label rõ ràng: "Access Your [Product Name] Now →"
- **Motion:** `btn-glow` pulse animation — gentle nhưng không tắt
- **Layout:** Button centered, max-width 480px, đủ tall để tap dễ trên mobile
- **Forbidden:** Để S2 bị lẫn với S1 — phải có visual break rõ. Không thêm copy giải thích dài dưới button

### GUIDE (S3)
- **Energy:** Calm, instructional — numbered clarity
- **Background:** `var(--surface)`
- **Typography:** Number badges to, steps text rõ ràng. Step 1 luôn là immediate action ("Click Access Now above", "Open the course link") — không phải "Wait for your email" hay "Check your inbox"
- **Motion:** `.reveal` stagger trên từng step
- **Layout:** 3–4 steps, vertical list hoặc 2-column grid nếu content đủ ngắn
- **Forbidden:** Step 1 là passive instruction. Quá 4 steps — sẽ overwhelm

### CONNECT (S4)
- **Energy:** Warm community invite
- **Background:** `var(--bg)`
- **Typography:** Member count nếu có ("Join 1,200+ members in..."). Zalo Group CTA button là primary. FB Group nếu có = secondary/outlined
- **Motion:** Subtle card lift trên community card
- **Messaging:** Frame as "where the real learning happens" hoặc "where other students get help" — not just "join our group"
- **Forbidden:** Để community join trở thành optional feel — nó phải feel quan trọng

### AMPLIFY (S5)
- **Energy:** Celebratory, natural — không forced
- **Background:** `var(--surface)`
- **Typography:** Pre-filled share text hiển thị trong styled quote box. Share buttons cho FB và Zalo. Copy link button nhỏ bên dưới
- **Motion:** Minimal — share buttons có hover state rõ
- **Layout:** Quote box editable (textarea) + share row bên dưới
- **Tone:** "Share your win" — không "Help us grow"
- **Forbidden:** Incentivized sharing với discount code (đây là thank-you page, không phải referral campaign)

---

## Background Rhythm

```
S1 Purchase Header → var(--surface) với accent top border — confirmation/success feel
S2 Access CTA      → var(--bg) flat — CTA là visual anchor duy nhất
S3 Next Steps      → var(--surface)
S4 Community Join  → var(--bg)
S5 Refer / Share   → var(--surface)
```

**Quy tắc:** Alternating `var(--surface)` / `var(--bg)` thông suốt — không để 2 sections cùng background liên tiếp. S1 exception: có accent top border để phân biệt với nav (page này không có nav nhưng có thể render top).

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S2 Access CTA PHẢI là element to và nổi bật nhất toàn trang — không element nào được to hơn
2. S3 Step 1 phải là immediate action — "Click the button above", "Open the link now" — không phải passive ("check your email", "wait for...")
3. Không có pricing, không có upsells, không có new offers trên trang này
4. Không có countdown timer, không có scarcity, không có urgency language
5. Community join (S4) phải feel quan trọng — không thể bị skip visually

**Được tự do:**
- Layout của checkmark header trong S1 (centered vs. left-aligned)
- Số steps trong S3 (3 hoặc 4)
- Thứ tự Zalo/FB trong S4 (Zalo luôn primary, FB optional)
- Pre-filled share message content
- Có hoặc không có product image trong S2 bên cạnh CTA button
- Tone ngôn ngữ (ấm áp hơn hoặc professional hơn — tuỳ brand)
