---
blueprint: ty-booking
page_count: 1 (shown immediately after booking/discovery call form submit)
copy_ref: skills/funnel/booking-call-funnel/SKILL.md
---

# Thank You — Booking / Discovery Call Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `booking-call-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
>
> **Context:** Visitor vừa book một discovery call hoặc strategy session. Họ có high intent nhưng cũng có high anxiety — "Liệu cuộc gọi có phải là sales pitch không?", "Họ có thực sự hiểu situation của tôi không?". Mục tiêu của trang: giảm no-show anxiety, tạo commitment qua preparation, và warm up prospect mà không pitch. Pitch xảy ra trên call — không phải ở đây.

---

## Persuasion Arc — 4 Phases

```
CONFIRM → COMMIT → PREPARE → ANTICIPATE
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **CONFIRM** | Resolve uncertainty — call details rõ ràng, reschedule dễ dàng | Biết chính xác khi nào, ai, ở đâu — không anxiety |
| **COMMIT** | Tạo commitment bằng reminder — Zalo/chatbot reminder giảm no-show | Đã set reminder, feel accountable |
| **PREPARE** | Thought-provoking questions — giảm anxiety, prime thinking trước call | Cảm thấy prepared, không bị caught off guard |
| **ANTICIPATE** | Soft authority building qua case study + testimonials — plant seeds | Tò mò về kết quả, excited cho call |

**Quy tắc:** Không có pricing, không có offer, không có urgency trên trang này. PREPARE phải có textarea — không phải quiz hay form submit. ANTICIPATE phải feel như social proof, không phải sales pitch.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Booking Header | CONFIRM | ✅ | Confirmed badge + call detail card + reschedule link visible |
| S2 | Notification + Group Join | COMMIT | ✅ | Zalo/chatbot reminder PRIMARY, calendar add secondary |
| S3 | Pre-Call Prep | PREPARE | ✅ | 3 thought-provoking questions với textarea — no submit button |
| S4 | Pre-Sell | ANTICIPATE | ✅ | 1 case study + 2 compact testimonials — soft authority |

**Mandatory count:** Tất cả 4 sections bắt buộc. Không có optional sections cho booking blueprint — mỗi section serve một no-show reduction mechanism cụ thể.

---

## Zone Design Intent — Creative Mode

### CONFIRM (S1)
- **Energy:** Professional, calm — business meeting confirmation feel
- **Background:** `var(--surface)` clean — call card as primary visual element
- **Typography:** Checkmark confirmation badge to. Call detail card = bordered box với: date + time + timezone + host name + host photo (nếu có) + join URL + reschedule link
- **Layout:** Reschedule link phải visible ngay trong hoặc ngay bên dưới call card — không ẩn. Reducing friction for rescheduling = reducing no-shows
- **Motion:** Minimal — confirmation badge fade-in khi load
- **Detail:** Host photo trong call card tăng personal connection. Join URL phải clickable. Reschedule link = muted color, không prominent nhưng không hidden
- **Forbidden:** Không ẩn reschedule link. Không có sales copy trong S1

### COMMIT (S2)
- **Energy:** Helpful reminder setup — "we'll remind you so you don't miss it"
- **Background:** `var(--bg)`
- **Typography:** Zalo reminder CTA là primary button. Framing: "Get a reminder 1 hour before your call" — practical, not community-focused (khác với webinar)
- **Layout:** Zalo/chatbot CTA = primary, center. Calendar add = secondary, bên dưới hoặc side-by-side
- **Motion:** Subtle hover state trên primary button
- **Forbidden:** Để calendar add to hơn Zalo reminder. Không có sales copy

### PREPARE (S3)
- **Energy:** Collegial, thoughtful — "to make the most of our time together"
- **Background:** `var(--surface)`
- **Typography:** Section intro: "Take 2 minutes to think through these before our call". 3 questions với textarea dưới mỗi câu. Placeholder text gợi ý cách trả lời
- **Layout:** Questions stacked vertically. Textarea = 3–4 rows height, comfortable to type. No submit button anywhere in S3
- **Questions should probe:** (1) Current situation / challenge, (2) What they've tried that didn't work, (3) What success looks like for them
- **Motion:** Textarea có focus ring accent color khi clicked
- **Key design signal:** Textarea without submit button = signals "this is for you, not for us" — privacy feel reduces anxiety
- **Forbidden:** Submit button, required field validation, data collection feel. Questions về budget hay timeline (too salesy)

### ANTICIPATE (S4)
- **Energy:** Calm confidence — "others have been where you are"
- **Background:** `var(--bg)` flat — deliberately understated
- **Typography:** Case study = brief narrative (3–4 sentences): situation → what changed → result. 2 testimonials compact = name + title + 2–3 sentence quote specific to call experience
- **Layout:** Case study featured top. 2 testimonials side-by-side bên dưới (hoặc stacked trên mobile)
- **Motion:** `.card-lift` hover subtle trên testimonial cards
- **Tone:** "Here's what others have experienced" — không "Here's why you should buy"
- **Forbidden:** Pricing bất kỳ đâu. CTA button. Urgency language. Testimonials về product/course (phải về call experience hoặc outcomes từ working together). Section header như "Why Choose Us"

---

## Background Rhythm

```
S1 Booking Header      → var(--surface) clean — call card as primary element
S2 Notification        → var(--bg)
S3 Pre-Call Prep       → var(--surface) — textarea inputs prominent
S4 Pre-Sell            → var(--bg) flat — deliberately understated
```

**Quy tắc:** Alternating `var(--surface)` / `var(--bg)` thông suốt. S4 luôn là `var(--bg)` flat để maintain understated feel của ANTICIPATE phase — không để authority building trở nên pushy qua visual weight.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S3 textarea tuyệt đối không có submit button — đây là prep tool cho prospect, không phải data capture form
2. Reschedule link trong S1 là mandatory — visible nhưng không prominent. Ẩn reschedule link tăng no-show rate
3. S4 không có pricing, không có CTA button, không có urgency — chỉ case study và testimonials
4. S2 Zalo reminder phải là primary CTA — to hơn calendar add
5. Trang này không có sales copy ở bất kỳ đâu — pitch xảy ra trên call

**Được tự do:**
- Host photo trong S1 (có hoặc không — có thì tốt hơn)
- Wording của 3 prep questions trong S3 (tuỳ offer/service type)
- Placeholder text trong textarea
- 1 hoặc 2 sentences intro cho S3
- Case study format trong S4 (narrative prose vs. before/after format)
- Testimonial layout trong S4 (side-by-side vs. stacked)
- Có hoặc không có section giữa S4 và S3 nếu prospect journey phức tạp hơn
