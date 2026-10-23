---
name: follow-up-sequence
description: Design multi-touch follow-up sequences for leads who didn't convert — by lead temperature, channel, and time since last interaction.
---

# Follow-Up Sequence Skill

## When to Use
Activate when leads have entered the funnel (attended webinar, visited sales page, booked a call, downloaded a lead magnet) but did not purchase. Goal: re-engage without being pushy.

## Lead Temperature Classification

| Temperature | Definition | Approach |
|-------------|-----------|----------|
| Hot | Expressed strong interest, asked price, started checkout | Urgency + remove friction |
| Warm | Engaged with content, opened emails, attended webinar | Value + social proof + gentle nudge |
| Cold | Downloaded lead magnet, no further engagement in 14+ days | Re-education + new angle + re-qualify |
| Ghost | No engagement in 30+ days | Re-activation campaign or sunset |

## Follow-Up Principles

### The 48-Hour Rule
Follow up within 48 hours while memory is fresh. Leads go cold fast — delay kills conversions.

### Value Before Ask
Every follow-up message should give something useful (insight, case study, tip) before making an ask. Ratio: 3 value : 1 ask.

### Multi-Channel Sequencing
Don't rely on one channel. Vietnamese buyers respond differently by channel:
- Zalo: Highest open rate, most personal
- Facebook DM: Good for FB-sourced leads
- Email: Lower open rate but good for longer content
- Comment reply: Public visibility, drives social proof

## Sequence Templates

### Hot Lead (Started Checkout — Didn't Complete)

**Day 1 — Hour 2** (Zalo/DM)
```
Anh/chị [tên] ơi, em thấy anh/chị đang xem qua [tên khóa học/chương trình].
Không biết anh/chị gặp vấn đề gì khi đăng ký không? Em có thể hỗ trợ ngay bây giờ ạ 😊
```

**Day 1 — Evening** (Email)
Subject: "Anh/chị [tên] — link đăng ký vẫn còn hiệu lực"
```
Em muốn chắc chắn anh/chị không gặp vấn đề kỹ thuật nào.
Link đăng ký vẫn hoạt động: [link]
Nếu có câu hỏi, nhắn em qua Zalo: [số]
```

**Day 2** (Zalo)
```
Anh/chị [tên], em hiểu đây là quyết định quan trọng.
Nếu anh/chị còn băn khoăn điều gì, em sẵn sàng nói chuyện 5 phút để giải đáp.
Anh/chị có thời gian không ạ?
```

**Day 3 — Final** (Email)
Subject: "Chỗ của anh/chị trong [khóa học] — hết hạn [ngày]"
```
Em muốn thông báo link đăng ký sẽ hết hạn vào [ngày/giờ].
Sau đó anh/chị sẽ phải đợi đến lớp tiếp theo (chưa có lịch cụ thể).

Nếu anh/chị đã quyết định, đây là link: [link]
Nếu có câu hỏi: [Zalo/phone]
```

---

### Warm Lead (Attended Webinar / Visited Sales Page)

**Day 1** (Email + Zalo)
Subject: "3 điều em muốn anh/chị biết về [chương trình]"
- Key benefit recap
- Answer the most common question
- Light CTA: "Nếu có câu hỏi, reply email này nhé"

**Day 2** (Email)
Subject: "[Tên học viên] đã làm được [kết quả] sau [thời gian]"
- Relevant case study matching their profile
- "Anh/chị có muốn kết quả tương tự không?"

**Day 3** (Zalo DM)
```
Anh/chị [tên] ơi, em muốn hỏi thẳng một câu:
Điều gì đang khiến anh/chị chưa quyết định?
Em hỏi vì muốn biết mình có thể giúp được không — không phải để thuyết phục.
```

**Day 5** (Email)
Subject: "Bonus đặc biệt hết hạn [ngày]"
- Remind of offer
- Add urgency (closing date, bonus expiry)
- Clear CTA

**Day 7** (Final — Email)
Subject: "Lần cuối em nhắn anh/chị về [chương trình]"
- Final check-in
- Leave door open: "Nếu thời điểm chưa phù hợp, không sao — em ở đây khi anh/chị sẵn sàng"

---

### Cold Lead (Downloaded Lead Magnet — No Further Action)

**Day 14 after opt-in** (Email)
Subject: "Anh/chị có áp dụng [lead magnet topic] chưa?"
- Check in on the free resource
- Share one additional tip on the same topic
- No pitch

**Day 17** (Email)
Subject: "Sai lầm phổ biến nhất về [topic]"
- Educational content, new angle
- Soft mention of how the program solves this

**Day 21** (Email)
Subject: "Câu chuyện của [học viên tên] — bắt đầu từ đúng điểm anh/chị đang ở"
- Relatable case study
- Bridge to offer

**Day 28** (Email — Re-qualify)
Subject: "Anh/chị còn muốn [desired outcome] không?"
- Direct re-qualification question
- "Nếu đây vẫn là ưu tiên của anh/chị, em có thể giúp..."
- CTA or sunset

---

### Ghost Lead (30+ days silent)

**Re-activation message** (Zalo)
```
Anh/chị [tên] ơi, lâu rồi không gặp!
Em có một [tài liệu/video/bài viết] mới về [topic] em nghĩ anh/chị sẽ thích.
Anh/chị có muốn em gửi không?
```

**If no response in 7 days** → Sunset email:
Subject: "Em sẽ không nhắn nữa — trừ khi..."
- "Em nghĩ thời điểm chưa phù hợp và em tôn trọng điều đó."
- "Nếu anh/chị muốn tiếp tục nhận thông tin từ em, reply 'CÓ' nhé."
- "Nếu không, em sẽ không liên hệ nữa. Chúc anh/chị thành công!"

## Personalization Variables

Always customize with:
- `[tên]` — first name
- `[sản phẩm/chương trình]` — specific product they showed interest in
- `[kết quả cụ thể]` — their stated goal from opt-in or call
- `[nguồn]` — where they came from (webinar, sales page, lead magnet)

## Output Template

```markdown
## Follow-Up Sequence: [Lead Source] — [Temperature]

**Lead Segment:** [hot/warm/cold/ghost]
**Primary Channel:** [Zalo/email/DM]
**Sequence Length:** [X messages over Y days]

Message 1 — [Day/Hour]:
Channel: [channel]
Message: [content]
CTA: [action]

Message 2 — [Day]:
[repeat...]

**Personalization Notes:**
- [What to customize per lead]
- [How to find their name/info]

**Exit Conditions:**
- Stop sequence if: [purchased / replied / unsubscribed]
- Hand off to: [Sales Agent closing script / sunset]
```
