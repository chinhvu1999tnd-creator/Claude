---
blueprint: sales-page
page_count: 1 (+ order + oto optional + thank-you)
copy_ref: skills/funnel/sales-page-funnel/SKILL.md
pattern_ref: skills/funnel/page-designer/themes/patterns/
---

# Sales Page Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `sales-page-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.

---

## Persuasion Arc — 6 Phases

```
HOOK → TENSION → SHIFT → PROOF → OFFER → ACTION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **HOOK** | Grab attention, confirm "đây là trang cho tôi" | Tò mò, muốn đọc tiếp |
| **TENSION** | Name & agitate pain — visitor cảm thấy được hiểu | Đồng cảm, thừa nhận vấn đề |
| **SHIFT** | Introduce mechanism mới — "cách cũ sai vì..." | Hy vọng, tò mò về giải pháp |
| **PROOF** | Credibility + social proof — "người khác đã làm được" | Tin tưởng, muốn biết giá |
| **OFFER** | Value stack → price reveal → guarantee | Cảm thấy xứng đáng, rủi ro thấp |
| **ACTION** | Urgency + final CTA — lower activation energy | Sẵn sàng quyết định |

**Quy tắc thứ tự:** PROOF không được xuất trước SHIFT. OFFER không được xuất trước PROOF. Visitor phải tin vào mechanism trước khi thấy giá.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Announcement Bar | HOOK | Nếu có deadline/scarcity | Urgency — contrast cao, số đếm ngược |
| S2 | Nav | HOOK | ✅ | Trust anchor — logo + minimal links + 1 CTA |
| S3 | Hero | HOOK | ✅ | First impression — H1 là promise, không phải feature list |
| S4 | Stats Bar | HOOK | ✅ | Credibility ngay sau hook — numbers lớn, scannable |
| S5 | Problem | TENSION | ✅ | Stark, không decoration nặng — TENSION cần không khí nặng nề |
| S6 | Agitate | TENSION | Optional | Đào sâu hơn S5 — consequences nếu không giải quyết |
| S7 | New Mechanism | SHIFT | ✅ | Visual mới mẻ — diagram/pipeline thể hiện "cách này khác" |
| S8 | Solution | SHIFT | ✅ | Before/after contrast — light sau dark |
| S9 | What's Inside | SHIFT | ✅ | Curriculum / modules — scannable, không overwhelming |
| S10 | Benefits | SHIFT | Optional | 3-col hoặc numbered list — concrete outcomes |
| S10.5 | Use Cases | SHIFT | Optional | 3–5 personas · mỗi card: Vấn đề → Giải pháp → Kết quả. Dùng khi product serve multiple personas |
| S11 | For / Not For | PROOF | ✅ | Qualification — tăng desire bằng cách restrict |
| S12 | Testimonials | PROOF | ✅ | Social proof — real names, specific results, không generic |
| S13 | Results Counter | PROOF | Optional | Animated numbers — impact at scale |
| S14 | Credibility / About | PROOF | ✅ | Authority — ai là người đứng sau |
| S14.5 | Vs Alternative | OFFER | Optional | Bảng so sánh: DIY / Agency / Không làm gì / Product. Reframe price perception ngay trước Offer Stack. KHÔNG so với competitor trực tiếp |
| S15 | Offer Stack | OFFER | ✅ | Value stacking — total value vs. price |
| S16 | Pricing | OFFER | ✅ | Price reveal SAU value — không đặt trước S15 |
| S17 | Guarantee | OFFER | ✅ | Risk reversal — giảm rào cản cuối cùng |
| S18 | Objections / FAQ | ACTION | ✅ | Xử lý last-minute doubts trước final CTA |
| S19 | Urgency | ACTION | Nếu có thật | Scarcity phải thật — fake urgency giết trust |
| S20 | Final CTA | ACTION | ✅ | Repeat offer + CTA — không thêm info mới |
| S21 | Footer | ACTION | ✅ | Legal + contact — minimal, không distract |

**Mandatory count:** 15 sections bắt buộc. Optional: S1, S6, S10, S10.5, S13, S14.5, S19.

---

## Zone Design Intent — Creative Mode

Mỗi phase có visual language riêng. Creative Mode phải follow intent này, layout tự do.

### HOOK (S1–S4)
- **Energy:** High — attract, excite, promise
- **Background:** Dark canvas hoặc hero gradient — dramatic
- **Typography:** H1 oversized, social proof numbers prominent
- **Motion:** Blob drift hoặc editorial accent line — phải có animated element ≥ 1
- **Forbidden:** Busy layouts, many CTA, information overload

### TENSION (S5–S6)
- **Energy:** Heavy, uncomfortable — đúng mục đích
- **Background:** Flat `var(--bg)` — không decoration, không blur, không glow
- **Typography:** Smaller, dense — lists of pain points
- **Motion:** Minimal — chỉ `.reveal` scroll, không float hay drift
- **Forbidden:** Bright accents, upbeat color, rounded cards — tất cả tín hiệu "positive" sẽ phá TENSION

### SHIFT (S7–S10)
- **Energy:** Rising hope — từ heavy → lighter
- **Background:** `var(--surface)` — nhẹ hơn TENSION, chưa full bright
- **Typography:** Diagram/pipeline cho mechanism — visual thinking, không chỉ prose
- **Motion:** `.flow-line-h` trên pipeline, `.reveal` stagger trên features
- **Key:** S7 (Mechanism) phải có SVG diagram — không thể chỉ là text block

### PROOF (S11–S14)
- **Energy:** Calm confidence — không hype
- **Background:** Alternating `var(--bg)` / `var(--surface)`
- **Typography:** Testimonial quotes prominent, metrics bold
- **Motion:** `.card-lift` trên testimonials — subtle hover, không glow
- **Forbidden:** Fake testimonials feel (no stock photos, no generic names)

### OFFER (S15–S17)
- **Energy:** Peak value — generous, abundant
- **Background:** `var(--surface)` với accent touches — featured card glow OK ở đây
- **Typography:** Price oversized — `clamp(2.5rem, 5vw, 4.5rem)`, mono font
- **Motion:** `.shimmer-border` cho featured pricing card — max 1 element
- **Key:** Guarantee phải visually prominent — shield icon, border accent

### ACTION (S18–S21)
- **Energy:** Decisive — close, không mở thêm câu hỏi
- **Background:** FAQ = flat. Final CTA = `var(--accent)` solid hoặc dark canvas
- **Typography:** CTA button to nhất page ở S20
- **Forbidden:** Thêm new info, new features, new proof — chỉ close

---

## Background Rhythm

Alternating backgrounds theo zone để tạo visual sectioning tự nhiên:

```
S3  Hero            → dark gradient / hero bg
S4  Stats           → var(--surface) + thin border
S5  Problem         → var(--bg) flat — STARK
S6  Agitate         → var(--bg) flat
S7  Mechanism       → var(--surface)
S8  Solution        → var(--bg)
S9  What's Inside   → var(--surface)
S10 Benefits        → var(--bg)
S11 For/Not For     → var(--surface)
S12 Testimonials    → var(--bg)
S13 Counter         → var(--surface)
S14 Credibility     → var(--bg)
S15 Offer Stack     → var(--surface)
S16 Pricing         → var(--bg) — spotlight on card
S17 Guarantee       → var(--surface)
S18 FAQ             → var(--bg)
S19 Urgency         → var(--surface) + countdown
S20 Final CTA       → var(--accent) solid hoặc dark canvas
S21 Footer          → var(--bg)
```

**Quy tắc:** Không để 3 section liên tiếp cùng background. TENSION zone (S5–S6) là exception — cả 2 flat `var(--bg)` để maintain heavy atmosphere.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. 15 mandatory sections phải có mặt đủ — có thể merge 2 optional sections vào 1 nhưng không được xóa mandatory
2. PROOF không được xuất hiện trước SHIFT — thứ tự phase là bất di bất dịch
3. TENSION zone (S5–S6) không được dùng accent color, glow, hay rounded cards
4. S7 Mechanism PHẢI có visual diagram (SVG/HTML) — không phải text list
5. S16 Pricing PHẢI đặt sau S15 Offer Stack — không reveal giá trước value

**Được tự do:**
- Layout của từng section (columns, alignment, grid)
- Typography scale và font pairing (theo `frontend-design/SKILL.md`)
- Section background depth (flat vs. layered, grain vs. clean)
- Combine S5+S6 thành 1 section nếu copy không đủ dài
- Combine S18+S19 thành 1 section nếu urgency là inline trong FAQ
- Thêm section ngoài blueprint nếu có lý do conversion rõ ràng

