---
blueprint: booking-call
page_count: 2 (index.html + survey.html + thank-you.html + not-a-fit.html)
copy_ref: skills/funnel/booking-call-funnel/SKILL.md
pattern_ref: skills/funnel/page-designer/themes/patterns/
---

# Booking Call Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `booking-call-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
> Funnel gồm 2 trang: VSL Landing (`index.html`) và Application Survey (`survey.html`).

---

## Persuasion Arc — 5 Phases (Page 1: VSL Landing)

```
HOOK → PROOF → EDUCATE → QUALIFY → ACTION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **HOOK** | VSL captures attention — video làm phần nặng | Tò mò, commit xem video |
| **PROOF** | Specific client outcomes — credibility qua kết quả thật | Tin tưởng rằng kết quả có thể đạt được |
| **EDUCATE** | Demystify the call — visitor biết chính xác what to expect | Lo lắng giảm, sẵn sàng hơn |
| **QUALIFY** | For/Not For — restriction creates desire | Tự qualify, muốn "được chọn" |
| **ACTION** | Single CTA: Apply Now — không có alternatives | Quyết định apply |

**Quy tắc thứ tự:** Đây là high-ticket funnel — trust-building nặng hơn, qualification bắt buộc, không có price reveal trên landing page. VSL là hero — tất cả text copy hỗ trợ video, không thay thế.

---

## Section Map — Page 1: VSL Landing (index.html)

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Nav | HOOK | ✅ | Minimal — logo + 1 CTA button only. Không có navigation links |
| S2 | Hero + VSL | HOOK | ✅ | Video frame chiếm dominant space. Headline ngắn, CTA dưới video |
| S3 | Results Proof | PROOF | ✅ | Specific client outcomes — tên thật, số thật, không generic claims |
| S4 | What Happens on the Call | EDUCATE | ✅ | Agenda, duration, who it's for — reduce unknown anxiety |
| S5 | Host Credibility | QUALIFY | ✅ | Authority positioning — không phải biography |
| S6 | For / Not For | QUALIFY | ✅ | Qualification section — creates desire through restriction |
| S7 | Final CTA | ACTION | ✅ | Single CTA: "Apply for a Call" — không có alternatives |

**Mandatory count:** 7 sections, tất cả bắt buộc.

---

## Section Map — Page 2: Application Survey (survey.html)

| # | Element | Bắt buộc | Intent |
|---|---------|----------|--------|
| — | Progress Bar | ✅ | Reduces drop-off anxiety — always visible |
| — | 5–7 Qualification Questions | ✅ | Qualify: budget, timeline, readiness, specific problem |
| — | Conditional Logic | ✅ | Accept → thank-you.html / Reject → not-a-fit.html |
| — | Not-a-Fit Page | ✅ | Kind redirect to lower-ticket offer — no blame |

**Quy tắc Page 2:** Form only — không có sales copy, không images, không testimonials. Clinical và focused. Questions phải qualify thật sự, không chỉ collect data.

---

## Zone Design Intent — Creative Mode

### HOOK (S1–S2) — Page 1
- **Energy:** Focused, minimal — VSL phải dominate hoàn toàn
- **Background:** Dark canvas — video stands out, không distract
- **Typography:** Headline ngắn (1 dòng nếu có thể). Sub-headline optional. CTA button dưới video
- **Motion:** Không motion xung quanh video player — không distract viewer từ VSL
- **Key:** Video frame phải lớn nhất page. Text chỉ để support, không compete
- **Forbidden:** Nav links, secondary CTAs, sidebar content bên cạnh video

### PROOF (S3) — Page 1
- **Energy:** Credibility qua specificity — không hype, không exclamation
- **Background:** `var(--surface)` — visual break sau dark hero
- **Typography:** Client name bold, outcome metric prominent. Format: "[Name] went from X to Y in Z days"
- **Motion:** `.card-lift` hover trên proof items — subtle
- **Forbidden:** Generic testimonials, unnamed "clients", stock photos

### EDUCATE (S4) — Page 1
- **Energy:** Calm, informative — reduce anxiety not create excitement
- **Background:** `var(--bg)` flat
- **Typography:** Agenda as numbered list hoặc icon list. Duration và format prominent
- **Key:** Answer "what happens next" explicitly — visitor cần biết exact expectations

### QUALIFY (S5–S6) — Page 1
- **Energy:** Authority + selectivity — "không phải ai cũng được nhận"
- **Background:** `var(--surface)` → `var(--bg)` alternating
- **Typography:** For/Not For dùng checkmark/X visual treatment rõ ràng — không plain prose
- **Key:** For/Not For PHẢI có 2 cột hoặc 2 list rõ ràng — "Đây là cho bạn nếu..." vs "Đây KHÔNG phải cho bạn nếu..."
- **Forbidden:** Host biography dài. Authority được establish qua kết quả, không qua credentials list

### ACTION (S7) — Page 1
- **Energy:** Decisive single point — không alternatives, không hesitation
- **Background:** `var(--accent)` solid — signal rõ ràng "đây là điểm hành động"
- **Typography:** CTA button to nhất page. Brief reinforcement text (1–2 lines max)
- **Forbidden:** Second CTA, links ra ngoài, thêm proof, thêm info

### Survey Design Intent — Page 2
- **Energy:** Clinical, efficient — applicant đã quyết định, chỉ cần complete form
- **Background:** `var(--bg)` clean — không decoration
- **Typography:** Question text clear. Progress bar always visible at top
- **Motion:** Không motion — focus trên completion
- **Forbidden:** Sales copy, images, testimonials, host photos trong survey

---

## Background Rhythm

**Page 1 (index.html):**
```
S1  Nav              → transparent on scroll / var(--bg)
S2  Hero + VSL       → dark canvas — video centered
S3  Results Proof    → var(--surface)
S4  What Happens     → var(--bg)
S5  Host Credibility → var(--surface)
S6  For / Not For    → var(--bg)
S7  Final CTA        → var(--accent) solid
```

**Page 2 (survey.html):**
```
Header              → var(--bg) với progress bar
Questions           → var(--bg) clean — không alternating
```

**Quy tắc:** Page 1 dark hero contrast mạnh với rest of page — tạo focus trên VSL. Page 2 đồng nhất hoàn toàn — không visual noise.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. VSL video frame PHẢI là dominant element trên page — larger than any text block
2. Nav KHÔNG được có internal navigation links — logo + CTA button only
3. Không có pricing trên index.html — price discussion on call only
4. For/Not For (S6) PHẢI có — qualification không thể bỏ cho high-ticket
5. Single CTA throughout page 1: Apply Now / Book a Call — không thêm offer khác
6. Survey page: không có sales copy, không images — form only, always

**Được tự do:**
- Video placeholder treatment: thumbnail + play button hoặc embed iframe frame
- Proof format: cards, quote blocks, hoặc before/after strips
- S4 "What Happens" layout: numbered steps, timeline, hoặc icon + text rows
- For/Not For: 2-column grid hoặc side-by-side list
- Not-a-fit page tone và redirect offer — tuỳ product ecosystem
- Progress bar style trên survey — stepped dots hoặc fill bar
