---
name: booking-call-funnel
description: "Booking call funnel skill — từ application page đến call script và post-call follow-up. Dùng cho high-ticket offers cần qualification trước khi close."
version: 1.0.0
agent: funnel
tags: [booking, call-funnel, high-ticket, application, sales-call, closing]
---

# Booking Call Funnel Skill

Booking call funnel là cơ chế close phù hợp nhất cho offer từ 10M VND trở lên — hoặc bất kỳ offer nào cần đánh giá fit trước khi nhận khách. Kết quả phụ thuộc 80% vào chất lượng qualification và pre-call priming, không phải vào kỹ năng bán hàng trên call.

## Khi Nào Dùng

- High-ticket coaching, mentoring, masterclass (10M–200M+ VND)
- Done-for-you services (marketing, tech, agency)
- Consulting packages cần đánh giá tình huống cụ thể
- Bất kỳ offer nào mà "wrong client" gây ra nhiều vấn đề hơn doanh thu

## Load Order

```
1. BUSINESS.md                                                   → audience, offer, pricing
2. skills/funnel/booking-call-funnel/SKILL.md                    → workflow (file này)
3. skills/funnel/vsl/SKILL.md                                    → VSL skill (Bước 2)
4. skills/funnel/landing-copy/SKILL.md                           → Copy Brief trước khi HTML (Bước 3–4)
5. skills/funnel/landing-copy/references/masters-principles.md   → stack theo page type
6. skills/funnel/landing-copy/references/copy-booking.md         → copy spec cho booking page
7. skills/funnel/landing-copy/references/headline-formulas.md    → headline options
8. skills/funnel/landing-copy/references/fascination-bullets.md  → bullets
9. skills/funnel/landing-copy/references/vn-market-adaptations.md → VN copy norms
10. skills/funnel/page-designer/SKILL.md                              → Template selection → Section Design Brief → HTML
11. skills/funnel/booking-call-funnel/references/funnel-architecture.md   → page stack
12. skills/funnel/booking-call-funnel/references/application-form.md      → qualification
13. skills/funnel/booking-call-funnel/references/pre-call-sequence.md     → indoctrination + show-up
14. skills/funnel/booking-call-funnel/references/call-structure.md        → CLOSER + call script
15. skills/funnel/booking-call-funnel/references/vn-market-adaptations.md → Zalo, VND, norms
```

**Thứ tự thực thi bắt buộc: Copy Brief → (duyệt) → Chọn template → Section Design Brief → (duyệt) → HTML**

---

## ⚠️ Offer Agent Dependency

**Trước khi build call script và pitch section, kiểm tra:**
```
1. Đọc output/offer/[slug]/ — có output từ /offer build không?
2. Đọc BUSINESS.md — offer đã định nghĩa chưa?
```
- **Có** → pull: tên, giá, bonuses, guarantee, ROI proof, case studies → dùng trong call script + pre-sell
- **Chưa** → nhắc: *"Chạy `/offer build [tên sản phẩm]` trước — call script và pre-sell section cần offer hoàn chỉnh."*

---

## Quy Trình 6 Bước

### Bước 1 — Qualify the Offer

Trước khi build bất kỳ thứ gì, xác định:

| Câu hỏi | Ảnh hưởng đến |
|---------|--------------|
| Offer giá bao nhiêu? | Application required hay không |
| Ai là ideal client? (profile cụ thể) | Qualification questions + VSL Big Idea |
| Ai là wrong client? (disqualifier) | Rejection criteria |
| Setter và closer có tách biệt không? | Call structure |
| Booking flow: Zalo manual hay automation? | Thank you page + admin workflow |

**Application threshold:**
- < 5M VND → thường không cần application, booking thẳng qua Zalo
- 5M–20M VND → application ngắn (3–5 câu), auto-approve qualified
- 20M VND+ → application đầy đủ, human review trước khi confirm lịch

### Bước 2 — Build VSL (gọi VSL Skill)

**Load `skills/funnel/vsl/SKILL.md`** → chạy đủ quy trình VSL:

1. Develop Big Idea cho offer này (load `vsl/references/big-idea-framework.md`)
2. Chọn Lead Type phù hợp với awareness level (load `vsl/references/lead-types.md`)
3. Viết script VSL (load `vsl/references/script-architecture.md`)
4. Tạo production brief (load `vsl/references/production-brief.md`)

**Output VSL embedded trong booking funnel:**
```
output/funnel/booking/[slug]/vsl/
├── vsl-big-idea.md
├── vsl-script.md
└── vsl-production-brief.md
```

VSL script này dùng cho `index.html` — trang đầu tiên người xem trước khi điền survey.

### Bước 3 — Build Survey / Application Page

Load `application-form.md` → xây survey page với:
- Headline đặt kỳ vọng đúng (không phải "đặt lịch tư vấn miễn phí")
- 7 core questions + conditional logic
- Qualification scoring (câu nào là must-pass)
- Accept flow → Thank You page + admin nhận notification
- Reject flow → Not-a-Fit page với lower-ticket redirect

### Bước 4 — Build Thank You Page + Not-a-Fit Page

Load `funnel-architecture.md` → page specs cho:
- Thank you page: xác nhận nhận application, homework, link video #1, hướng dẫn admin confirm lịch qua Zalo
- Not-a-Fit page: redirect nhẹ nhàng, không blame, alternative offer

**Thank You page — Pattern Stack** (từ `skills/funnel/page-designer/themes/patterns/`):
```
ty-booking-header          ← confirmed badge · call detail card · [PERSON] host · join + reschedule link
ty-notification-group-join ← Zalo group/chatbot PRIMARY · calendar add phụ
ty-pre-call-prep           ← 3 câu hỏi chuẩn bị · reduce no-show anxiety
ty-pre-sell                ← [RESULT] case study + 2 testimonials · build authority ngầm
```
**Rule:** Không pitch mạnh — người dùng đã commit. Mục tiêu: warm up + reduce no-show.

### Bước 5 — Build Pre-Call Sequence

Load `pre-call-sequence.md` → tạo:
- Zalo/Telegram messages: immediate + 24h + 1h (primary channel)
- Email confirmation backup (dài hơn, có full context)
- 4-video indoctrination sequence (Story → Concept → Training → Values) — outline + script gợi ý cho từng video
- Homework assignment cụ thể theo niche

### Bước 6 — Build Call Script + Post-Call

Load `call-structure.md` → tạo:
- CLOSER framework script đầy đủ 60 phút
- Setter script (nếu có setter/closer model)
- Objection handling cho top 5 objections
- Post-call follow-up: YES path / Think-about-it / Not-a-fit

---

## Output

### Standalone (`/funnel booking [offer]`)

```
output/funnel/booking/[slug]/
├── funnel.json                        ← manifest: status, urls, checklist
│
│   — VSL (từ VSL Skill) —
└── vsl/
    ├── vsl-big-idea.md                ← Big Idea + 4 tests
    ├── vsl-script.md                  ← Script đầy đủ với timestamp
    └── vsl-production-brief.md        ← Shot list + slides + embed HTML
│
│   — Pages —
├── index.html                         ← VSL landing page (embed vsl script) + CTA điền form
├── survey.html                        ← application / survey form
├── thank-you.html                     ← confirm booking + homework + link video #1
└── not-a-fit.html                     ← graceful redirect + alternative offer
│
│   — Pre-Call Sequence —
└── pre-call-sequence/
    ├── zalo-1-confirmation.md         ← Zalo/Tele: gửi ngay sau book
    ├── zalo-2-24h.md                  ← Zalo/Tele: 24 giờ trước call
    ├── zalo-3-1h.md                   ← Zalo/Tele: 1 giờ trước call
    ├── email-1-confirmation.md        ← Email backup (dài hơn, có full context)
    └── indoctrination/
        ├── video-1-story.md           ← Outline + script gợi ý: Story video
        ├── video-2-concept.md         ← Outline + script gợi ý: Concept/Mechanism
        ├── video-3-training.md        ← Outline + script gợi ý: Mini training/case study
        └── video-4-values.md          ← Outline + script gợi ý: Who it's for/not for
│
│   — Call Scripts —
└── call-scripts/
    ├── closer-script.md               ← Full CLOSER script 60 phút
    ├── setter-script.md               ← Setter script 15 phút (nếu dùng)
    ├── objection-handling.md          ← Top 5 objections + response scripts
    └── post-call/
        ├── yes-path.md                ← Payment message + onboarding steps
        ├── think-about-it.md          ← 5-day Zalo/email follow-up sequence
        └── not-a-fit.md               ← Post-call redirect message
│
│   — Infra —
├── api/
│   └── webhook.js        ← SePay payment webhook (copy từ payment-confirm/scripts/api/webhook.js)
├── vercel.json           ← Vercel config
└── package.json          ← dependencies: googleapis
```

**Không deploy lên Vercel:** `pre-call-sequence/` và `call-scripts/` — thêm vào `.vercelignore`.

**Webhook tự động đi kèm funnel:** Copy từ `skills/deliver/payment-confirm/scripts/` vào output khi build. Deploy 1 lần = static HTML + webhook serverless cùng domain.

### Embedded trong workflow lớn hơn

```
output/funnel/[type]/[slug]/booking/
├── index.html
├── survey.html
├── thank-you.html
├── not-a-fit.html
├── pre-call-sequence/   ← không deploy
└── call-scripts/        ← không deploy
```

---

## Checklist Trước Khi Launch

**Qualification:**
- [ ] Application questions xác định đúng ideal client
- [ ] Có ít nhất 1 "investment readiness" question
- [ ] Rejection path không để lại cảm giác xấu hổ
- [ ] Accept email đến trong < 5 phút sau khi submit

**Show-Up:**
- [ ] Homework assignment có trong thank-you.html
- [ ] Chuỗi reminder Zalo/Telegram: immediate + 24h + 1h
- [ ] Email backup cho immediate confirmation
- [ ] Target show-up rate: 70%+

**Call:**
- [ ] Closer script cover đủ 6 phase CLOSER
- [ ] Top 5 objections đã chuẩn bị response
- [ ] Payment link ready để gửi trong 30 phút sau call

**Post-Call:**
- [ ] YES path: payment link gửi trong 30 phút
- [ ] Think-about-it: có 5-day follow-up plan
- [ ] Not-a-fit: có lower-ticket redirect

---

## Conversion Benchmarks

| Metric | Target VN Market | World-class |
|--------|-----------------|-------------|
| Application completion rate | 40–60% | 65%+ |
| Application → Booking (qualified) | 60–75% | 80%+ |
| Booking → Show-up | 60–70% | 80%+ |
| Call → Close (same call) | 15–25% | 30–40% |
| Think-about-it → Close (follow-up) | 20–35% | 40%+ |
| Revenue per call | 5M–20M VND | 20M+ VND |
