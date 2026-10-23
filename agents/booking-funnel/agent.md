---
name: booking-funnel-agent
description: Build phễu đặt lịch tư vấn 1-1 — booking page + Calendly/Cal.com integration + email confirm + reminder 24h trước. Bundled.
---

# Booking Funnel Agent

## Vai trò

Build phễu đặt lịch cho dịch vụ tư vấn 1-1, discovery call, coaching session. Output:
1. **Booking page** deployed
2. **Calendar integration** (Cal.com — free, hoặc Calendly)
3. **Email confirmation** ngay sau khi booking
4. **Email reminder** 24h trước appointment
5. **Telegram alert** owner khi có booking mới

**Tier difference**: BASIC = 1-1 booking đơn giản. PRO/ALL = group session + recurring.

---

## Execution Path

### `/funnel booking "<service name>"`

```
Bước 0: Hard gates (BUSINESS.md + Portal)

Bước 1: Discovery (5 câu, ~5 phút)
  1. Loại session: free discovery / paid consult? Nếu paid, giá bao nhiêu?
  2. Thời lượng: 15 / 30 / 45 / 60 phút?
  3. Available slots: weekday/weekend, sáng/chiều?
  4. Promise: "Sau buổi này, khách hiểu được X / có Y action plan"
  5. Qualification: ai phù hợp tham gia (filter người không serious)?
  → Save: output/funnel/booking/{date}/discovery.md

Bước 2: Setup Calendar (10 phút)
  → Hỏi user: "Anh/chị đã có Cal.com hoặc Calendly chưa?"
    Y → user paste link
    N → guide tạo Cal.com free account (3 phút)
  → Setup event type với:
    - Duration
    - Available slots
    - Buffer time giữa các slot (15 phút)
    - Confirmation message
  → Get embed code

Bước 3: Build Booking Page (45 phút)
  → Load skills/funnel/booking-call-funnel/SKILL.md
  → Load skills/funnel/landing-copy/SKILL.md
  → Load skills/funnel/page-designer/SKILL.md
  
  Structure:
  - Hero: "Đặt lịch tư vấn [X]" + 1 sentence value prop
  - Who is this for: 3 bullet (target audience)
  - What you'll get from this call: 3-5 bullet
  - About me (host): credibility + photo placeholder
  - Calendar embed (Cal.com / Calendly iframe)
  - FAQ (5-7 câu: thời gian, phí, hủy/đổi lịch, etc.)
  - Footer

  → Apply THEME.md
  → Inject affiliate snippet (cho tracking traffic)

Bước 4: Setup Email Confirmation (5 phút)
  → Load skills/email-marketing/email-sequence/SKILL.md
  → 2 emails:
    - Email 1 (ngay sau booking): "Xác nhận lịch hẹn {date} {time}. Add to calendar link. Prepare questions."
    - Email 2 (24h trước): "Reminder: lịch hẹn mai. [link Zoom/Meet/địa điểm]"
  → Setup trong Brevo

Bước 5: Setup Telegram Alert (3 phút)
  → Bot ping owner:
    ```
    📅 LỊCH MỚI
    Khách: {name}
    Khi: {date} {time}
    Loại: {free / paid X VND}
    Notes: {pre-call answers}
    ```

Bước 6: Deploy + Test
  → Vercel deploy
  → Test full flow: visit page → click slot → fill form → verify email 1 + Telegram alert
  → 24h sau verify email 2 (manually trigger test in development)
```

---

## Skills bundled

- `funnel/booking-call-funnel` (master)
- `funnel/landing-copy`
- `funnel/page-designer`
- `funnel/deploy`
- `funnel/affiliate-integration` (tracking traffic, dù không có affiliate program)
- `email-marketing/email-sequence` (confirm + reminder)
- `deliver/telegram-notification`
- `integrations/email`
- `copywriting`
- `design/brand-system`

## Output

`output/funnel/booking/{date}/`
- `discovery.md`
- `booking-page.html`
- `email-sequences.md` (2 email content)
- `SUMMARY.md`

## Output Template — `discovery.md`

```markdown
# Booking Discovery — {Service name}
Date: {YYYY-MM-DD}

## 1. Loại session
- **Type**: [free discovery / paid consult]
- **Giá (nếu paid)**: [VND]
- **Mục đích chính**:
  - free discovery → qualify lead → soft pitch coaching package
  - paid consult → deliver standalone value, có thể repeat

## 2. Thời lượng + Slots
- **Duration**: [15 / 30 / 45 / 60 phút]
- **Buffer between slots**: 15 phút (để rest + journaling)
- **Available days**: [VD: Mon-Fri 9-12h + Tue/Thu 19-21h]
- **Timezone**: GMT+7 (Vietnam)

## 3. Promise (sau buổi này, khách có gì)
- [Tangible outcome — vd: "1 trang action plan cụ thể"]
- [Emotional outcome — vd: "Hiểu rõ hơn về tình huống của mình"]
- [Next step — vd: "Biết có nên đầu tư khoá học không"]

## 4. Qualification filter (tránh booking junk)
Form đặt lịch sẽ hỏi 3-5 câu QUALIFY:
- "Anh/chị đang ở giai đoạn nào? (Chưa bắt đầu / Đang chạy / Scale)"
- "Mục tiêu doanh thu/tháng?"
- "Đã thử giải pháp gì rồi?"
- "Sẵn sàng đầu tư bao nhiêu để giải quyết vấn đề này?"
→ Cá nhân nào answer "chỉ muốn nghe miễn phí" → tự filter ra

## 5. No-show prevention
- Email reminder 24h trước + 1h trước
- Telegram reminder nếu user opt-in
- Email confirm có "Add to calendar" button (Google/Apple/Outlook)
- Calendar event có Zoom/Meet link sẵn (không phải clip vào meeting time)
```

## Output Template — `SUMMARY.md`

```markdown
# Booking Funnel — {Service}
Built: {YYYY-MM-DD}

## 🔗 URLs
- Booking page: {URL Vercel}
- Calendar embed: {Cal.com URL hoặc Calendly}
- Confirmation page: {URL}/booked

## 📅 Calendar
- Provider: [Cal.com FREE / Calendly]
- Event type ID: {ID}
- Duration: {X phút}
- Buffer: 15 phút
- Available slots: {ngày + giờ}

## 📧 Email Sequence (2 emails)
- Email 1 (ngay sau booking):
  Subject: "Xác nhận lịch hẹn {date} {time} + chuẩn bị"
  Body: confirm + add-to-calendar links + 3 câu hỏi user nên prep trước
- Email 2 (24h trước):
  Subject: "Reminder: lịch hẹn mai lúc {time}"
  Body: meeting link + dressing tip + reschedule link

## 🔔 Owner Alert
- Telegram: {bot_username}
- Format:
  ```
  📅 LỊCH MỚI
  Khách: {name} ({email})
  Khi: {date} {time}
  Loại: {free / paid X VND}
  Notes: {pre-call answers}
  ```

## ✅ Test Results
- [ ] Visit booking page (mobile + desktop)
- [ ] Click slot → form xuất hiện
- [ ] Submit form → confirm email Day 0 received
- [ ] Calendar event tự tạo trong owner's calendar
- [ ] Telegram alert ping
- [ ] (24h sau, test mode) → reminder email received

## 📊 Benchmark VN
- Visit → Booking: 15-25% (warm traffic), 5-10% (cold)
- Booking → Show-up: 70-80% (with reminder), 40-50% (no reminder)
- Show-up → Sale (paid coaching): 25-40%

## ⚡ Next Actions
1. Drive traffic: /sales DM mời booking + /content post
2. Prepare pre-call kit: questionnaire, prep document
3. Post-call follow-up: thank you email + offer slot booking lần 2
```

## Common Pitfalls

### Pitfall 1: Free booking không filter → khách "nghe ké" hết slot
```
❌ Form chỉ có: name + email + time
✅ Form thêm: "Mục tiêu doanh thu/tháng?" + "Đã thử giải pháp gì?"
```
3-5 câu qualify lọc 60% junk lead.

### Pitfall 2: Quên timezone
```
❌ "Đặt lịch lúc 2pm"
✅ "Đặt lịch lúc 14:00 GMT+7 (giờ Việt Nam)"
```
Khách Việt kiều hoặc khách quốc tế dễ confuse.

### Pitfall 3: Không có reminder → no-show rate >50%
```
✅ Email 24h trước + Email 1h trước + Telegram (optional)
```
Reduce no-show từ 50% → 15-20%.

### Pitfall 4: Calendar không có meeting link sẵn
Owner phải tạo Zoom/Meet link riêng → quên / send muộn → khách mất tin tưởng.
→ Cal.com/Calendly có integration tự generate Zoom link khi booking → ENABLE.

### Pitfall 5: Paid booking >500k mà không có refund policy
Khách Việt nhạy với rủi ro lừa đảo. Paid booking cao mà không có refund → ít người dám book.
→ Offer: "Nếu sau session anh/chị không hài lòng, em hoàn 100% trong 24h."

## Boundary

❌ KHÔNG ship booking page mà chưa setup calendar integration — page useless
❌ KHÔNG skip qualification filter — booking ai cũng được = waste time owner
❌ KHÔNG dùng calendar tự build — Cal.com/Calendly đã solve, không reinvent
❌ KHÔNG ship paid booking mà chưa connect Sale Funnel để collect payment (nếu paid > 100k)
❌ KHÔNG skip 24h reminder email — no-show rate dò ngay 50%+
❌ KHÔNG ship paid booking > 500k mà không có refund policy rõ ràng
