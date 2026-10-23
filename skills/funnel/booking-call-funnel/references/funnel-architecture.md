# Funnel Architecture — Booking Call Funnel

## Core Stack (5 Stages)

```
[Traffic]
    ↓
[VSL Landing Page]   — video + CTA điền form
    ↓
[Survey / Application Form]   — qualify + gather context
    ↓
[Thank You Page]   — confirm booking + pre-call priming + homework
    ↓
[Pre-Call Sequence]   — Zalo/email: indoctrination + show-up reminders
    ↓
[Sales Call]   — 45–60 phút, CLOSER framework
```

---

## Page Specs

### Stage 1 — VSL Landing Page

**Mục đích:** Pre-sell. Người xem xong VSL đã "sold" — form chỉ là bước confirm.

**Elements:**
- VSL video (4–8 phút): Story → Problem → Mechanism → Teaser về chương trình → CTA điền form
- Headline dưới video: "[Kết quả cụ thể] trong [timeframe] — ngay cả khi [rào cản phổ biến]"
- 3 bullets: ai phù hợp nhận call này
- CTA button: "Điền form để đặt lịch →"
- Social proof nhỏ: số người đã tham gia / kết quả tiêu biểu
- Không có: giá, navigation menu, external links

**Variants:**
- Full VSL (5–8 phút): cho cold/warm audience
- Short VSL (2–3 phút): cho hot audience (referral, warm list)

---

### Stage 2 — Survey / Application Form

**Mục đích:** Qualify + gather context để closer chuẩn bị trước call + tạo perceived exclusivity.

**Headline pattern:**
> "Trước khi đặt lịch, cho tôi biết thêm về tình huống của bạn — để buổi nói chuyện thực sự có ích."

**Format:** Embedded form trên page riêng HOẶC popup sau khi click CTA trên VSL landing.

**7 core questions (xem chi tiết: `application-form.md`):**
1. Thông tin liên hệ (Zalo, email)
2. Tình huống hiện tại
3. Mục tiêu muốn đạt
4. Rào cản lớn nhất
5. Đã thử gì rồi
6. Sẵn sàng đầu tư không (investment readiness)
7. Tại sao ngay bây giờ

**After submit:**
- Qualified → redirect thẳng sang Thank You (confirm + meeting info + homework)
- Not qualified → Not-a-Fit page với lower-ticket redirect

**Trigger qualify/disqualify:** xem `application-form.md` → Scoring section.

---

### Stage 3 — Thank You Page

**Mục đích:** 3 việc cùng lúc:
1. Confirm: ngày giờ + meeting link rõ ràng
2. Prime: bắt đầu indoctrination ngay — gửi video đầu tiên
3. Commit: homework assignment tạo accountability

**Booking flow (không dùng Calendly):**
- Người submit form → admin nhận notification (Telegram Bot hoặc Google Sheet)
- Admin confirm slot qua Zalo trong < 30 phút: "Mình đặt lịch cho bạn [ngày/giờ] nhé?"
- Sau khi confirm → Thank You page hiển thị meeting info đầy đủ
- Hoặc: survey form có step cuối chọn ngày/giờ preferred → admin confirm qua Zalo

**Elements trên Thank You page:**
1. Checkmark animation + "Đã nhận application của bạn!"
2. "[Tên] sẽ nhắn Zalo / Telegram xác nhận lịch trong vòng [X giờ]"
3. Meeting platform: [Zoom / Google Meet / Zalo Video]
4. **Homework assignment** — highlight rõ, có checklist:
   - 2–3 việc cụ thể cần chuẩn bị trước call
   - Ví dụ: "Viết ra 3 mục tiêu lớn nhất 90 ngày tới"
5. "Trong lúc chờ, xem video này:" → link Video 1 (Story)

**Không có:** Upsell, distraction, nhiều CTA.

---

### Stage 4 — Pre-Call Sequence

**Mục đích:** Maximize show-up rate + warm them up so call is easier to close.

**4-Video Indoctrination Sequence (gửi qua Zalo / Telegram trước call):**
1. **Story video** — "Tại sao tôi làm điều này, và tôi đã đến đây thế nào"
2. **Concept video** — "Lý do tại sao [cách cũ] thất bại và mechanism khác biệt"
3. **Training video** — Mini training / case study — taste of what they'll get
4. **Values video** — "Ai phù hợp, ai không phù hợp — và tại sao tôi selective"

**Show-up reminder sequence:**
- Immediate (sau khi book): xác nhận + meeting link + homework reminder
- 24h trước: reminder + "Tôi đã xem application của bạn, có ý tưởng cụ thể cho tình huống của bạn"
- 1h trước: link meeting + "Đến đúng giờ nhé"

**Xem chi tiết: `pre-call-sequence.md`**

---

### Stage 5 — Sales Call

**Format:** 45–60 phút, 1-on-1, Zoom hoặc Zalo Video.

**Framework:** CLOSER (Alex Hormozi) — 6 phases.

**Xem chi tiết: `call-structure.md`**

---

## Not-a-Fit Page

**Trigger:** Survey answers không pass qualification threshold.

**Copy pattern:**
> "Cảm ơn bạn đã dành thời gian điền form. Dựa trên tình huống bạn chia sẻ, tôi nghĩ [tên chương trình] chưa phải lựa chọn phù hợp nhất cho bạn lúc này.
>
> Điều đó không có nghĩa là bạn không thể đạt được [outcome] — chỉ là con đường phù hợp hơn với giai đoạn của bạn hiện tại là: [lower-ticket offer hoặc free resource]"

**Elements:**
1. Explanation ngắn (không blame — blame timing/fit)
2. Alternative offer với CTA rõ ràng
3. "Nếu tình huống thay đổi, liên hệ tôi qua [Zalo/email]"

---

## Funnel Variants

| Variant | Stack | Dùng khi |
|---------|-------|----------|
| **Full** | VSL → Survey → Thank You → Zalo confirm → Pre-call → Call | Default, cold/warm traffic |
| **Lite** | VSL → Direct booking via Zalo → Confirmation message → Pre-call → Call | Warm audience, referral, offer < 10M VND |
| **Selective** | VSL → Survey → Manual Review (24h) → Booking link via Zalo → Pre-call → Call | Offer > 50M VND, rất selective |
| **Setter/Closer** | VSL → Survey → Setter call (15') → Closer call (45') | Scale > 20 calls/tuần |

---

## Traffic Sources

| Source | Variant phù hợp | Close rate expected |
|--------|----------------|---------------------|
| Referral trực tiếp | Lite hoặc Full | 40–60% |
| Warm Zalo/email list | Full | 20–35% |
| Organic content | Full | 10–20% |
| Paid ads | Full hoặc Setter/Closer | 5–15% |
