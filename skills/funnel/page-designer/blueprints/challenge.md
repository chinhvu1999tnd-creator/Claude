---
blueprint: challenge
page_count: 1 (+ thank-you)
copy_ref: skills/funnel/challenge-funnel/SKILL.md
pattern_ref: skills/funnel/page-designer/themes/patterns/
---

# Challenge Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `challenge-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.

---

## Persuasion Arc — 7 Phases

```
HOOK → TRANSFORMATION → PROOF → COMMUNITY → VALUE → QUALIFY → ACTION
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **HOOK** | Grab attention — event countdown creates urgency | Tò mò, nhận ra đây là cơ hội có thời hạn |
| **TRANSFORMATION** | Show the arc: where they are now → where they'll be after Day N | Hứng thú với kết quả có thể đạt được |
| **PROOF** | Past participant results — "người thật đã làm được" | Tin tưởng transformation là thật |
| **COMMUNITY** | Social proof qua community size/activity — "có người đồng hành" | Cảm giác belong, giảm cô đơn trong journey |
| **VALUE** | Day-by-day preview — each day as a micro-promise | Hiểu rõ commitment, thấy path forward |
| **QUALIFY** | For/Not For + Host credibility — restriction creates demand | Muốn "được chọn" vào community |
| **ACTION** | FAQ → anxiety reduction → close — low-friction registration | Sẵn sàng đăng ký |

**Quy tắc thứ tự:** COMMUNITY (S4) phải đứng sau PROOF (S3) — kết quả cá nhân trước, sau đó reinforce bằng community momentum. S9 "What Happens After Register" là bắt buộc — show-up rate phụ thuộc vào việc người đăng ký biết chính xác next steps.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Hero + Form | HOOK | ✅ | Transformation promise + form + countdown to challenge start + social proof strip |
| S2 | Transformation Arc | TRANSFORMATION | ✅ | Before/After visual contrast — dark for "before", accent-tinted for "after" |
| S3 | Results Proof | PROOF | ✅ | Past participant results — names, specifics, not generic |
| S4 | Community Proof | COMMUNITY | ✅ | Member count, activity level, community screenshots (Zalo/FB) |
| S5 | Challenge Days Preview | VALUE | ✅ | Day 1... Day N: scannable timeline — one quick win per day |
| S6 | For / Not For | QUALIFY | ✅ | Pre-qualify + creates scarcity feeling through restriction |
| S7 | Host Credibility | QUALIFY | ✅ | Authority + personal story — brief, outcome-focused |
| S8 | FAQ | ACTION | ✅ (4–5 items) | Cost? Commitment? What if I miss a day? — anxiety removal |
| S9 | What Happens After Register | ACTION | ✅ | Next steps: Zalo group join, Day 1 time, what to prepare |
| S10 | Final CTA | ACTION | ✅ | Repeat form hoặc scroll-to-form — S1 và S10 share same form |

**Mandatory count:** 10 sections, tất cả bắt buộc.

---

## Zone Design Intent — Creative Mode

Mỗi phase có visual language riêng. Creative Mode phải follow intent này, layout tự do.

### HOOK (S1)
- **Energy:** Energetic, transformation-forward — excitement, không phải fear
- **Background:** Hero gradient — vibrant, aligned với challenge theme
- **Typography:** H1 = transformation promise. Countdown timer prominent. Form integrated above fold
- **Motion:** Countdown timer animated (live). Social proof strip có ticker hoặc static numbers
- **Key:** Form PHẢI visible without scroll trên desktop. Countdown tạo urgency tự nhiên từ ngày bắt đầu thật sự
- **Forbidden:** Dark oppressive hero, pain agitation, TENSION atmosphere

### TRANSFORMATION (S2)
- **Energy:** Aspirational contrast — stark visual difference giữa before và after
- **Background:** `var(--bg)` flat — Before side dark/muted, After side accent-tinted hoặc bright
- **Typography:** Before/After labels clear. State descriptions concise — bullets not paragraphs
- **Key:** PHẢI có visual contrast — không thể là text-only section. 2-column split hoặc card contrast
- **Forbidden:** Text block mô tả transformation không có visual treatment

### PROOF (S3)
- **Energy:** Grounded, specific — community-flavored (names, faces, relatable outcomes)
- **Background:** `var(--surface)`
- **Typography:** Participant name bold. Outcome specific — "lost 5kg in 7 days", không phải "amazing results"
- **Motion:** `.card-lift` hover — subtle
- **Forbidden:** Anonymous testimonials, stock photos, vague outcomes

### COMMUNITY (S4)
- **Energy:** Warm, social — "bạn không đơn độc"
- **Background:** `var(--bg)` — softer than proof section
- **Typography:** Member count prominent. Activity description energetic
- **Key:** PHẢI có visual community element — screenshot slot (Zalo group, FB group) hoặc member count badge. Không chỉ text
- **Forbidden:** Placeholder "community screenshot" text — nếu không có ảnh thật, dùng member count + activity numbers thay thế

### VALUE (S5)
- **Energy:** Structured, progressive — visitor thấy journey rõ ràng
- **Background:** `var(--surface)` — timeline/calendar visual treatment
- **Typography:** Day labels bold. Each day = 1 line outcome, không paragraph
- **Key:** PHẢI là scannable timeline hoặc calendar grid — không phải paragraph mô tả từng ngày
- **Forbidden:** Prose description, day descriptions dài hơn 2 dòng

### QUALIFY (S6–S7)
- **Energy:** Selective, authoritative — challenge không phải cho tất cả mọi người
- **Background:** `var(--bg)` → `var(--surface)` alternating
- **Typography:** For/Not For hai cột hoặc hai list rõ ràng. Host section compact
- **Key:** Restriction language tạo desire — "không phải cho bạn nếu..." phải có
- **Forbidden:** Host biography dài, credentials list không liên quan đến challenge topic

### ACTION (S8–S10)
- **Energy:** Calm close — FAQ removes friction, S9 removes anxiety, S10 closes
- **Background:** FAQ = `var(--bg)`. S9 = `var(--surface)`. S10 = `var(--accent)` solid
- **Typography:** S9 next steps dùng numbered list — clear sequence. S10 CTA button to nhất page
- **Key:** S9 "What Happens After Register" KHÔNG được bỏ — anxiety về "sau khi điền form thì sao?" trực tiếp ảnh hưởng show-up rate
- **Forbidden:** Thêm new proof, new content, new host info tại S8–S10

---

## Background Rhythm

```
S1  Hero + Form             → hero gradient
S2  Transformation Arc      → var(--bg) flat — Before dark, After accent-tinted
S3  Results Proof           → var(--surface)
S4  Community Proof         → var(--bg)
S5  Days Preview            → var(--surface) — timeline/calendar visual
S6  For / Not For           → var(--bg)
S7  Host Credibility        → var(--surface)
S8  FAQ                     → var(--bg)
S9  What Happens Next       → var(--surface)
S10 Final CTA               → var(--accent) solid
```

**Quy tắc:** Không để 3 section liên tiếp cùng background. S10 `var(--accent)` phải visually distinct và final — không có gì sau ngoài footer nếu cần.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S1 form phải visible without scroll trên desktop 1280px — không dời form xuống dưới
2. S2 Transformation PHẢI có visual contrast treatment — không thể là text-only block
3. S4 Community PHẢI có visual community element — screenshot slot hoặc member count badge
4. S5 Days Preview PHẢI là scannable timeline hoặc calendar grid — không prose paragraphs
5. S9 "What Happens After Register" không được bỏ — anxiety reduction trực tiếp impact show-up rate
6. S1 và S10 share cùng form — repeat form, không link đến form khác

**Được tự do:**
- Layout S2: 2-column split, card comparison, hoặc before/after slider treatment
- S3 proof format: quote cards, result strips, hoặc stat highlights
- S4 community visual: screenshot frame, member count badge, hoặc activity feed mockup
- S5 timeline format: horizontal scroll, vertical list, hoặc grid calendar
- S6 For/Not For: 2-column grid hoặc side-by-side checklist
- Countdown placement trong S1: inline trong hero hoặc dedicated countdown block
- Combine S8 FAQ và S9 next steps thành 1 section nếu FAQ ngắn (2–3 items)
