---
blueprint: oto
page_count: 1 (standalone — shown after main offer payment confirmed)
copy_ref: skills/funnel/sales-page-funnel/SKILL.md
---

# OTO (One Time Offer) Page Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `sales-page-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
>
> **Context:** Visitor vừa hoàn tất thanh toán cho offer chính. Họ đang ở trạng thái purchase momentum cao nhất. OTO page khai thác trạng thái này — không restart selling, không tạo tension mới. Đây là lời mời bổ sung, không phải offer mới.

---

## Persuasion Arc — 5 Phases

```
MOMENTUM → VALUE → PROOF → URGENCY → DECISION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **MOMENTUM** | Affirm purchase decision — "bạn vừa làm đúng" — trước khi giới thiệu upsell | Tự tin, tâm trạng tích cực, cởi mở |
| **VALUE** | Đặt anchor price cao → reveal discounted price — vì visitor vừa mua | Cảm thấy được ưu đãi đặc biệt |
| **PROOF** | 2–3 testimonials compact, specific cho upsell này — không phải testimonial main offer | Tin tưởng upsell có giá trị thực |
| **URGENCY** | Timer đếm ngược thật (15–30 phút) — cơ hội sẽ qua | Áp lực quyết định nhẹ nhưng thật |
| **DECISION** | YES = QR inline. NO = redirect to thank-you. Cả hai đều resolve clean | Quyết định không bị kẹt |

**Quy tắc thứ tự:** MOMENTUM phải là phase đầu tiên — không được mở bằng offer. Visitor phải được affirm purchase decision TRƯỚC khi thấy upsell. URGENCY không được xuất trước PROOF.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | OTO Header | MOMENTUM | ✅ | Affirm + introduce — "order confirmed" energy, optional VSL slot |
| S2 | OTO Offer | VALUE | ✅ | Price anchor vs. discounted price — offer card prominent |
| S3 | OTO Proof | PROOF | ✅ | 2–3 compact testimonials specific to the upsell |
| S4 | OTO Countdown | URGENCY | ✅ | Functional JS countdown timer — sole urgency mechanism |
| S5 | OTO CTA | DECISION | ✅ | YES (QR inline) / NO (redirect to thank-you) — two distinct visual states |

**Mandatory count:** Tất cả 5 sections bắt buộc. Không có optional sections. Không thêm sections ngoài 5 này — page phải ngắn.

---

## Zone Design Intent — Creative Mode

### MOMENTUM (S1)
- **Energy:** Warm, affirming — không dramatic, không urgent
- **Background:** Dark canvas hoặc hero gradient — positive, momentum energy (không stark, không flat)
- **Typography:** H1 là "bổ sung đặc biệt", không phải "vấn đề mới". Tone = celebratory + curious
- **Elements:** Checkmark hoặc confirmation badge hiển thị "order confirmed" TRƯỚC headline upsell. Optional: VSL embed nếu có video giải thích upsell
- **Motion:** Subtle — blob drift hoặc accent glow, không quá mạnh
- **Forbidden:** Tạo problem/tension mới. Bắt đầu bằng offer mà không affirm trước

### VALUE (S2)
- **Energy:** Generous — "đặc biệt dành riêng cho bạn vì vừa mua"
- **Background:** `var(--surface)` với accent gradient border quanh offer card
- **Typography:** Anchor price strikethrough rõ ràng. Discounted price oversized. Lý do giảm giá explicit ("vì bạn vừa mua [main offer]")
- **Motion:** `.shimmer-border` trên offer card — OK ở đây vì đây là value reveal
- **Forbidden:** Không hiện giá trước khi giải thích what it is

### PROOF (S3)
- **Energy:** Calm confidence — compact, specific
- **Background:** `var(--bg)` flat
- **Typography:** Quote text compact — không cần layout rộng. Tên + kết quả cụ thể từ upsell này
- **Motion:** `.card-lift` hover subtle — không glow mạnh
- **Forbidden:** Testimonials chung chung hoặc copy từ main sales page

### URGENCY (S4)
- **Energy:** Real time pressure — không dramatic, không hype
- **Background:** `var(--surface)` — timer centered, không cạnh tranh với element khác
- **Typography:** Countdown timer to, mono font, digits prominent
- **Motion:** Timer JavaScript functional — không phải CSS animation trang trí
- **Forbidden:** Text scarcity giả ("chỉ còn 3 suất"). Timer phải real — fake countdown phá trust của khách vừa mua

### DECISION (S5)
- **Energy:** Decisive, clear — không ambiguous
- **Background:** YES state = `var(--accent)` solid. NO state = muted/transparent
- **Typography:** YES button = primary, oversized, `btn-glow`. NO link = small, muted, dưới YES — không dùng "NO" literal, dùng "No thanks, I'll pass on this one-time offer"
- **Motion:** YES button có hover glow. NO link không có hover emphasis
- **Forbidden:** Hai buttons cùng visual weight. Guilt-trip language trong NO link

---

## Background Rhythm

```
S1 OTO Header    → dark canvas hoặc hero gradient — positive, momentum energy
S2 OTO Offer     → var(--surface) với accent gradient border trên offer card
S3 OTO Proof     → var(--bg) flat
S4 OTO Countdown → var(--surface) — timer centered, không decoration cạnh tranh
S5 OTO CTA       → var(--accent) solid cho YES state
```

**Quy tắc:** Page không có nav, không có footer. Không để 2 `var(--surface)` liên tiếp — S2 và S4 đều surface nên S3 phải flat `var(--bg)` để tạo visual break.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. NO nav, NO footer — không có exit points ngoài YES và NO
2. S1 PHẢI affirm purchase ("Great choice", "Order confirmed") TRƯỚC khi introduce upsell — không được mở bằng offer headline
3. S4 countdown timer phải là functional JavaScript — không phải decorative element hay fake reset
4. S5 YES và NO phải là hai visual states khác biệt rõ ràng — không phải hai buttons ngang hàng
5. Single offer only — không có tiers, không có choices, không có "hoặc chọn gói..."
6. Price trong S2 phải rẻ hơn đáng kể so với perceived standalone value — lý do giảm giá phải explicit

**Được tự do:**
- Layout của offer card trong S2 (horizontal vs. vertical, spotlight vs. card)
- Video embed trong S1 (có hoặc không — tùy có VSL)
- Số testimonials trong S3 (2 hoặc 3, không quá 3)
- Thời lượng countdown (15–30 phút, tuỳ offer)
- Wording của NO link (miễn là không guilt-trip và không bold)
- Stack S3 và S4 gần nhau nếu proof ngắn — giữ page ngắn là ưu tiên
