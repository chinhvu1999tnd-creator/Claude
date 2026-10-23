---
blueprint: webinar
page_count: 1 (+ thank-you)
copy_ref: skills/funnel/webinar-funnel/SKILL.md
pattern_ref: skills/funnel/page-designer/themes/patterns/
---

# Webinar Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `webinar-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.

---

## Persuasion Arc — 5 Phases

```
HOOK → PROOF → VALUE → TRUST → ACTION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **HOOK** | Grab attention — event frame creates immediacy | Tò mò, muốn biết thêm về sự kiện |
| **PROOF** | Break skepticism early — "người khác đã có kết quả" | Tin tưởng rằng webinar này có giá trị thật |
| **VALUE** | Show exactly what they'll learn + why this approach is different | Hứng thú, muốn tham dự |
| **TRUST** | Authority + social validation from past attendees | Đủ tin để đăng ký |
| **ACTION** | Low-friction registration — they've already decided | Sẵn sàng điền form |

**Quy tắc thứ tự:** PROOF (S2) bắt buộc phải xuất hiện TRƯỚC VALUE (S3) — đây là "proof bomb" technique. Skepticism phải bị phá vỡ trước khi trình bày nội dung. Form xuất hiện tại S1 và S8.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Hero + Form | HOOK | ✅ | Event-framed — date, time, countdown timer prominent. Form integrated trong hero |
| S2 | Results Proof | PROOF | ✅ | Proof bomb TRƯỚC content — 2–3 kết quả cụ thể từ người thật, số thật |
| S3 | What You'll Learn | VALUE | ✅ | 3–5 takeaways cụ thể — scannable bullets, không prose |
| S4 | Solution / Mechanism | VALUE | ✅ | Tại sao approach này khác — new mechanism, diagram OK |
| S5 | Host Credibility | TRUST | ✅ | Authority positioning — sau promise, không phải trước |
| S6 | Testimonials | TRUST | ✅ | 2–4 cards từ past attendees — specific outcomes |
| S7 | FAQ | ACTION | ✅ (3–5 items max) | Xử lý last-minute objections trước final CTA |
| S8 | Final CTA | ACTION | ✅ | Repeat form hoặc scroll-to-form button — không thêm info mới |

**Mandatory count:** 8 sections, tất cả bắt buộc. Không có optional sections — mỗi section phục vụ vai trò persuasion rõ ràng.

---

## Zone Design Intent — Creative Mode

Mỗi phase có visual language riêng. Creative Mode phải follow intent này, layout tự do.

### HOOK (S1)
- **Energy:** Urgent, event-forward — người xem phải biết ngay đây là live training, khi nào diễn ra
- **Background:** Dark gradient hoặc theme hero — tạo event atmosphere
- **Typography:** Event date/time prominent, không nhỏ hơn H3. Countdown timer là visual anchor
- **Motion:** Countdown timer animated — real time. Blob drift hoặc editorial element OK
- **Key:** Form phải visible above fold. Countdown tạo urgency tự nhiên, không phải fake scarcity

### PROOF (S2)
- **Energy:** High contrast, specific — không generic claims
- **Background:** `var(--surface)` với accent touches — distinguish từ hero
- **Typography:** Tên người thật bold, số liệu prominent. Không dùng initials hay "student A"
- **Motion:** `.card-lift` trên proof cards — subtle
- **Forbidden:** Vague testimonials ("great webinar!"), unnamed sources, stock photos

### VALUE (S3–S4)
- **Energy:** Informative, confident — "đây là những gì cụ thể bạn sẽ học"
- **Background:** `var(--bg)` → `var(--surface)` alternating
- **Typography:** Numbered list hoặc icon list cho takeaways — không prose paragraph
- **Key:** S4 Mechanism nên có visual element (diagram, comparison table) — không chỉ text

### TRUST (S5–S6)
- **Energy:** Calm authority — không hype, không oversell
- **Background:** `var(--bg)` → `var(--surface)` alternating
- **Typography:** Host credentials compact. Testimonial quotes prominent
- **Motion:** Minimal — `.reveal` scroll chỉ
- **Forbidden:** Host section dài hơn S1 hero — authority phục vụ promise, không thay thế

### ACTION (S7–S8)
- **Energy:** Frictionless close — họ đã quyết định tại S2–S3
- **Background:** FAQ = `var(--bg)`. Final CTA = `var(--accent)` solid hoặc dark canvas
- **Typography:** CTA button to nhất page tại S8. Form tại S8 identical với S1
- **Forbidden:** Thêm proof mới, thêm content description, thêm host info tại đây

---

## Background Rhythm

```
S1  Hero + Form       → dark gradient hoặc theme hero bg
S2  Results Proof     → var(--surface) với accent touches
S3  What You'll Learn → var(--bg)
S4  Mechanism         → var(--surface)
S5  Host Credibility  → var(--bg)
S6  Testimonials      → var(--surface)
S7  FAQ               → var(--bg)
S8  Final CTA         → var(--accent) solid hoặc dark canvas
```

**Quy tắc:** Không để 3 section liên tiếp cùng background. S1 dark → S2 surface tạo visual break rõ ràng sau hero. S8 phải visually distinct để signal "đây là điểm đăng ký".

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S2 Results PHẢI xuất hiện TRƯỚC S3 What You'll Learn — thứ tự này không thể đảo
2. Form xuất hiện đúng 2 lần: S1 (above fold) và S8 (final CTA) — không ít hơn
3. S1 PHẢI có countdown timer và event date/time — không chỉ là opt-in generic
4. Không có pricing trên page này — webinar là free, page chỉ là registration
5. Host section (S5) phải đứng sau content sections — promise trước, authority sau

**Được tự do:**
- Layout countdown: inline trong hero text hoặc standalone block
- S2 proof format: cards, quotes, hoặc stat highlights — tuỳ theme
- S4 Mechanism: diagram, comparison table, hoặc bold bullet list
- S8 final CTA: repeat full form hoặc single scroll-to-top button nếu form ngắn
- Combine S7 FAQ vào inline collapsible accordion nếu muốn compact layout
