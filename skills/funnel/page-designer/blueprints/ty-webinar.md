---
blueprint: ty-webinar
page_count: 1 (shown immediately after webinar registration form submit)
copy_ref: skills/funnel/webinar-funnel/SKILL.md
---

# Thank You — Webinar Registration Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `webinar-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
>
> **Context:** Visitor vừa đăng ký webinar. Họ có intent nhưng commitment thấp — đăng ký miễn phí không tạo loss aversion như mua hàng. Metric duy nhất quan trọng của trang này là **show-up rate**. Mọi element phải serve metric đó. Không có sales content — pitch xảy ra trên webinar.

---

## Persuasion Arc — 4 Phases

```
CONFIRM → COMMIT → PREPARE → WARM-UP
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **CONFIRM** | Xác nhận đăng ký thành công — event details rõ ràng, không ambiguity | Biết chính xác khi nào và ở đâu |
| **COMMIT** | Tạo commitment mechanism — Zalo Group join tăng show-up rate đáng kể | Đã commit bằng action (join group) |
| **PREPARE** | Actionable tips cụ thể — không generic, không vague | Cảm thấy prepared và excited |
| **WARM-UP** | Pre-event content build anticipation — preview without revealing the hook | Tò mò về những gì sẽ được học |

**Quy tắc:** COMMIT phải xảy ra TRƯỚC PREPARE — join group là commitment mechanism, không phải nice-to-have. Không có phase nào có sales content hay pricing.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Webinar Header | CONFIRM | ✅ | Confirmed badge + event detail card (date/time/platform/link) + calendar add |
| S2 | Notification + Group Join | COMMIT | ✅ | Zalo Group/chatbot PRIMARY, calendar add secondary |
| S3 | Show-Up Tips | PREPARE | ✅ | 4 specific actionable tips — icon-list format |
| S4 | Pre-Event Content | WARM-UP | Optional | 1–2 warm-up pieces — only if actual content exists |

**Mandatory count:** S1, S2, S3 bắt buộc. S4 optional — chỉ thêm nếu có actual warm-up content (article, video, exercise). Không placeholder hay generic content ở S4.

---

## Zone Design Intent — Creative Mode

### CONFIRM (S1)
- **Energy:** Clean, professional — event confirmation feel
- **Background:** `var(--surface)` với accent top border — event-card feel
- **Typography:** Checkmark confirmed badge to. Event detail card là visual centerpiece: date + time + timezone + platform name + join link — tất cả visible không cần scroll
- **Layout:** Event card = bordered box, scannable at a glance. Calendar add button bên dưới card — secondary, outline style
- **Motion:** Subtle — checkmark fade-in hoặc scale-in khi load
- **Detail:** Join link trong event card phải clickable/copyable. Timezone phải explicit (GMT+7 / ICT)
- **Forbidden:** Không để event details bị ẩn hay cần scroll để thấy. Không có sales copy trong S1

### COMMIT (S2)
- **Energy:** Community invite — "everyone meets here beforehand"
- **Background:** `var(--bg)`
- **Typography:** Zalo Group CTA là button to nhất trang. Frame = "where registrants connect before the event" — không phải "join our group"
- **Motion:** Button có hover glow nhẹ — không pulse, không urgent
- **Layout:** Zalo join button = primary, large, center. Calendar add = secondary, smaller, bên dưới hoặc bên cạnh
- **Key metric:** Zalo Group join rate tương quan trực tiếp với show-up rate — phải feel important
- **Forbidden:** Để calendar add to hơn Zalo join. Không có pricing hay sales copy

### PREPARE (S3)
- **Energy:** Helpful, practical — collegial không patronizing
- **Background:** `var(--surface)`
- **Typography:** 4 tips với icons rõ ràng. Tone helpful: "block 90 mins on your calendar", "join 5 mins early for tech check", "mute notifications so you can focus", "prepare 1 question you want answered"
- **Layout:** Icon-list hoặc 2x2 grid. Không quá 4 tips — mỗi tip phải specific và actionable
- **Motion:** `.reveal` stagger trên từng tip
- **Forbidden:** Generic tips ("be excited", "stay curious"). Quá 4 tips. Sales language trong tips

### WARM-UP (S4 — optional)
- **Energy:** Anticipation, preview — không reveal the hook
- **Background:** `var(--bg)` flat
- **Typography:** 1–2 content pieces với title + brief description. Link to read/watch. Framing: "While you wait, this might interest you..."
- **Motion:** Minimal — card hover subtle
- **Layout:** 1 featured piece hoặc 2-column nếu có 2 pieces
- **Forbidden:** Sales content, testimonials, pricing. Generic "check out our blog" không qualify. S4 chỉ có nếu content thật sự relevant và warm-up worthy

---

## Background Rhythm

```
S1 Webinar Header         → var(--surface) với accent top border — event-card feel
S2 Notification + Group   → var(--bg) — Zalo CTA prominent
S3 Show-Up Tips           → var(--surface) — 4-item grid hoặc list
S4 Pre-Event Content      → var(--bg) flat (nếu có)
```

**Quy tắc:** Alternating `var(--surface)` / `var(--bg)` thông suốt. S4 nếu có = `var(--bg)` để feel understated so với S3.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S2 Zalo Group CTA phải to hơn bất kỳ CTA nào khác trên trang — kể cả calendar add button
2. Event card trong S1 phải bao gồm đủ 5 thông tin: date, time, timezone, platform, join link — tất cả visible không cần scroll
3. S3 tips phải specific và actionable — không được generic
4. Không có sales copy, pricing, testimonials, hay CTAs đến sales page ở bất kỳ đâu
5. S4 là optional — nếu không có warm-up content thật, bỏ S4 hoàn toàn

**Được tự do:**
- Layout của event card trong S1 (card style, highlight màu gì)
- Wording của Zalo Group invite trong S2
- Icon set cho S3 tips (emoji, icon library, SVG)
- Số warm-up pieces trong S4 nếu có (1 hoặc 2)
- Có hoặc không có webinar thumbnail/speaker photo trong S1
- Thêm countdown đến event time trong S1 nếu muốn — optional và phải functional
