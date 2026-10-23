---
blueprint: ty-lead
page_count: 1 (shown immediately after lead magnet opt-in form submit)
copy_ref: skills/funnel/leads-funnel/SKILL.md
---

# Thank You — Lead Magnet Blueprint

> **Mục đích của file này:** Định nghĩa cấu trúc bắt buộc và visual intent cho Creative Mode (Mode B).
> Copy guideline → xem `leads-funnel/SKILL.md`. Pattern HTML → xem `themes/patterns/`.
> File này chỉ trả lời: *section nào bắt buộc, thứ tự nào, và visual phải communicate gì.*
>
> ⚠️ **Authority rule:** Khi funnel skill được load cùng, section sequence của funnel skill là source of truth. Blueprint chỉ add visual intent (zone design, background rhythm, creative mode rules) — không override section order của funnel skill.
>
> **Context:** Visitor vừa cho email để đổi lấy lead magnet. Trust level thấp — họ chưa mua gì, chỉ mới đủ tò mò để opt-in. Nhiệm vụ của trang này: (1) giao lead magnet ngay và rõ ràng, (2) bắt đầu xây relationship qua social follow, (3) soft bridge sang main offer — không push, không urgency. Đây là gift delivery, không phải sales continuation.

---

## Persuasion Arc — 3 Phases

```
DELIVER → CONNECT → TEASE
```

| Phase | Mục tiêu tâm lý | Visitor state sau phase |
|-------|----------------|------------------------|
| **DELIVER** | Xác nhận họ sẽ nhận được gì và khi nào — không ambiguity | Nhẹ nhõm, tin tưởng đã nhận |
| **CONNECT** | Mời follow trên social trước khi ask anything else | Ấm áp, muốn biết thêm |
| **TEASE** | Soft mention về what's possible với full offer — không push | Tò mò, không bị áp lực |

**Quy tắc:** TEASE phải là phase cuối — không được xuất trước CONNECT. Visitor phải được deliver value và connect trước khi nhận bất kỳ pitch nào, dù nhẹ.

---

## Section Map

| # | Section | Phase | Bắt buộc | Visual intent |
|---|---------|-------|----------|--------------|
| S1 | Lead Magnet Header | DELIVER | ✅ | "Check inbox" instruction + 3-step process + spam folder tip |
| S2 | Direct Download | DELIVER | Optional | Chỉ có nếu file deliver trực tiếp — skip nếu email delivery |
| S3 | Social Follow | CONNECT | ✅ | FB Page + Zalo OA primary, YouTube optional |
| S4 | While You Wait | TEASE | ✅ | Soft bridge — 1–2 sentences + ghost CTA to main offer |

**Mandatory count:** S1, S3, S4 bắt buộc. S2 optional — chỉ thêm nếu file có download link trực tiếp (PDF, template, v.v.). Phần lớn trường hợp email delivery → S2 bỏ qua.

---

## Zone Design Intent — Creative Mode

### DELIVER (S1 + S2)

**S1 — Lead Magnet Header:**
- **Energy:** Instructional, clear — không celebratory quá mức (visitor chưa mua gì)
- **Background:** `var(--surface)` clean — delivery confirmation feel, không dramatic
- **Typography:** Check icon hoặc email icon to. Headline ngắn: "Almost there — check your inbox." 3 numbered micro-steps bên dưới: (1) mở email, (2) click link, (3) enjoy
- **Motion:** Minimal — icon có subtle bounce hoặc fade-in khi load
- **Detail:** Spam folder warning ở step cuối — nhỏ, muted color, nhưng visible
- **Forbidden:** Không có offer, không có pricing, không có urgency ngay S1

**S2 — Direct Download (nếu có):**
- **Energy:** Clean utility — đây là action button, không cần decoration
- **Background:** `var(--bg)` flat
- **Typography:** Download button rõ ràng với file type và size ("Download PDF — 2.3MB")
- **Motion:** Không cần animation
- **Forbidden:** Không để S2 to hơn S1 header — delivery confirmation quan trọng hơn download button

### CONNECT (S3)
- **Energy:** Warm community invite — "join us where we post more of this"
- **Background:** `var(--surface)`
- **Typography:** Platform icons to và recognizable. Member/follower count nếu có. CTA = "Follow for more [topic]" — không phải "Follow our page"
- **Motion:** `.card-lift` hover trên platform cards
- **Layout:** FB Page và Zalo OA side-by-side primary. YouTube nếu có = smaller, secondary row
- **Tone:** "Nơi chúng tôi chia sẻ thêm" — connection-first, không selling
- **Forbidden:** Không biến S3 thành pitch cho course. Không có pricing ở đây

### TEASE (S4)
- **Energy:** Curious, understated — deliberately low-key
- **Background:** `var(--bg)` flat — deliberately understated, không visual competition
- **Typography:** 1–2 sentences về what becomes possible with full offer. Ghost/outline CTA button — NOT `btn-glow`, NOT accent solid, NOT primary style
- **Motion:** Không có hover glow, không có pulse — ghost button phải feel optional
- **Layout:** Centered text block, ghost button centered bên dưới. Section padding nhỏ hơn các sections khác
- **Forbidden:** Countdown timer, urgency language ("limited spots", "offer expires"), scarcity, pricing visible, primary/filled CTA button style

---

## Background Rhythm

```
S1 Lead Magnet Header → var(--surface) clean — delivery confirmation feel
S2 Direct Download    → var(--bg) flat (nếu có)
S3 Social Follow      → var(--surface)
S4 While You Wait     → var(--bg) flat — deliberately understated
```

**Quy tắc:** Page ngắn — 4 sections (hoặc 3 nếu S2 bỏ). S4 luôn là `var(--bg)` flat để maintain low-key feel của TEASE phase. Không để S4 có background nổi bật.

---

## Creative Mode Rules

**Không được bỏ qua (hard rules):**
1. S4 CTA phải là ghost/outline style — tuyệt đối không dùng `btn-glow`, accent fill, hoặc primary button style
2. Không có countdown, không có urgency, không có scarcity trên toàn trang
3. S3 Social Follow phải xuất TRƯỚC S4 Tease — build relationship trước khi mention offer
4. Nếu lead magnet delivery bằng email (trường hợp phổ biến nhất), S2 bỏ hoàn toàn — không placeholder
5. Page phải feel như gift delivery, không phải sales continuation

**Được tự do:**
- Số platforms trong S3 (FB + Zalo minimum, YouTube nếu kênh active)
- Wording của 3 steps trong S1 (miễn là rõ ràng và có spam tip)
- Download button label trong S2 nếu có (file type + size = best practice)
- 1 hoặc 2 sentences trong S4 (ngắn hơn thường tốt hơn)
- Có hoặc không có lead magnet thumbnail/cover image trong S1
- Tone ấm áp hay professional (tuỳ brand) — miễn là không salesy
