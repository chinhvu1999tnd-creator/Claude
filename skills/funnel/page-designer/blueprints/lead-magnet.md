---
blueprint: lead-magnet
page_count: 1 (+ thank-you)
copy_ref: skills/funnel/leads-funnel/SKILL.md
pattern_ref: skills/funnel/page-designer/themes/patterns/
---

# Lead Magnet Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `leads-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.

---

## Persuasion Arc — 4 Phases

```
HOOK → PROMISE → TRUST → ACTION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **HOOK** | Grab attention — "đây là thứ tôi cần" | Tò mò, muốn biết thêm |
| **PROMISE** | Show the transformation — quick win, not full course | Hứng thú, tin rằng có thể đạt được |
| **TRUST** | Credibility anchor — visitor cảm thấy người trao là đáng tin | Đủ tin để điền form |
| **ACTION** | Low-friction email capture — không phải mua, chỉ là "lấy miễn phí" | Sẵn sàng submit |

**Quy tắc thứ tự:** Không có TENSION zone — opt-in page leads with positive promise, không phải pain agitation. Form phải xuất hiện trên fold (S3).

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Announcement Bar | HOOK | Nếu có deadline/promo | Urgency strip — contrast cao, ngắn gọn |
| S2 | Nav | HOOK | ✅ | Minimal — logo + optional 1 link. Không có menu. |
| S3 | Hero + Opt-in Form | HOOK → ACTION | ✅ | Promise lớn + form tích hợp trong hero — không để form bên dưới fold |
| S4 | Social Proof / Stats | TRUST | ✅ | 3 metrics nổi bật HOẶC trust logos — không cần cả hai |
| S5 | Lead Magnet Preview | PROMISE | ✅ | Cover/mockup visual + what's inside — show, don't just describe |
| S6 | About (brief) | TRUST | ✅ | 3–4 dòng credibility — không phải full bio |
| S7 | FAQ | ACTION | Optional (2–3 items max) | Reduce last hesitation — chỉ đặt nếu có rào cản rõ ràng |
| S8 | Footer | ACTION | ✅ | Minimal — privacy, copyright. Không distract. |

**Mandatory count:** 6 sections bắt buộc. Optional: S1, S7.

---

## Zone Design Intent — Creative Mode

Mỗi phase có visual language riêng. Creative Mode phải follow intent này, layout tự do.

### HOOK (S1–S3)
- **Energy:** Energetic, promise-forward — người xem phải hiểu offer trong 3 giây
- **Background:** Light clean hero hoặc soft gradient — không dark canvas (opt-in pages không phải sales pages)
- **Typography:** H1 oversized — promise, không phải feature. Form integrated trong hero block
- **Motion:** Subtle only — `.reveal` scroll trên bullets. Không blob drift nặng nề
- **Forbidden:** Form dưới fold, menu links nhiều, dark dramatic hero trừ khi theme dark

### PROMISE (S5)
- **Energy:** Aspirational — "đây là thứ bạn sẽ nhận được"
- **Background:** `var(--surface)` — nhẹ, tạo contrast với hero
- **Typography:** Scannable bullets or module list — ngắn, outcome-focused
- **Key:** Lead magnet mockup/cover PHẢI có — visual sản phẩm, không chỉ text mô tả

### TRUST (S4, S6)
- **Energy:** Calm, credible — không hype
- **Background:** Alternating `var(--bg)` / `var(--surface)`
- **Typography:** Numbers lớn cho stats. About section text nhỏ, compact
- **Motion:** Minimal — `.card-lift` optional trên logos
- **Forbidden:** Full author biography, dài hơn 4 dòng

### ACTION (S7–S8)
- **Energy:** Frictionless close — "chỉ cần điền email"
- **Background:** FAQ = flat `var(--bg)`. Footer = `var(--bg)` minimal
- **Typography:** CTA button lặp lại từ S3 — đồng nhất, không thay đổi copy
- **Forbidden:** Thêm mới info, price mentions, upsell tại đây

---

## Background Rhythm

```
S2  Nav              → transparent hoặc var(--bg)
S3  Hero + Form      → light hero gradient hoặc var(--surface) soft
S4  Social Proof     → var(--bg) flat
S5  Magnet Preview   → var(--surface)
S6  About            → var(--bg)
S7  FAQ              → var(--surface)
S8  Footer           → var(--bg)
```

**Quy tắc:** Light và clean — alternating `var(--surface)` / `var(--bg)`. Không dùng dark canvas, không blob nặng trừ khi theme là dark theme. Không để 3 section liên tiếp cùng background.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. Form PHẢI nằm trong S3 hero — visible without scroll trên desktop 1280px
2. Lead magnet PHẢI có visual mockup hoặc cover image tại S5 — không chỉ text list
3. Không có TENSION zone — không agitate pain, không list "problems"
4. No pricing, no offer stack — đây là top of funnel, capture email only
5. About section (S6) tối đa 4 dòng — không phải autobiography

**Được tự do:**
- Layout hero: form bên phải, bên trái, hoặc centered dưới headline
- Stats có thể là logos hoặc numbers — không cần cả hai
- S7 FAQ có thể bỏ nếu offer đủ đơn giản để không cần giải thích
- Combine S6 + S7 thành 1 section compact nếu FAQ chỉ có 2 items
- Thêm inline CTA button sau S5 nếu muốn repeat action sớm
