# Vietnam Market Adaptations — Booking Call Funnel

## Core Differences vs. Western Booking Funnels

| Element | Western Default | VN Adaptation |
|---------|---------------|---------------|
| Primary contact channel | Email | Zalo |
| Booking flow | Calendly self-serve | Zalo confirm thủ công (personal, higher trust) |
| Call platform | Zoom | Zoom / Google Meet / Zalo Video |
| Payment timing | Card on file / instant | Link sau call, bank transfer hoặc MoMo/VNPay |
| Relationship before close | Minimal | Extended — cần trust cao hơn |
| Price disclosure | Direct | Tránh trong application, reveal on call |
| Decision speed | Faster | Slower — gia đình thường involve |
| SMS reminders | Standard | Replace bằng Zalo message |

---

## Zalo vs. Email

**Thực tế:** Email open rate ở VN thị trường B2C: 15–25%. Zalo open rate: 70–90%.

**Setup chuẩn:**
- Zalo là primary channel cho mọi reminder và follow-up
- Email là backup và record-keeping
- Với Zalo OA (Official Account): có thể tự động gửi, tracking delivery
- Với Zalo cá nhân: manual nhưng conversion cao hơn vì cá nhân hơn

**Zalo OA vs. Zalo cá nhân:**

| | Zalo OA | Zalo Cá Nhân |
|---|---------|-------------|
| Broadcast | ✅ | ❌ (manual) |
| Auto message | ✅ (Zalo API) | ❌ |
| Trust level | Trung bình | Cao |
| Setup cost | Có phí + verify | Miễn phí |
| Best for | > 100 leads/tháng | < 100 leads/tháng |

**Khuyến nghị:** Dùng Zalo cá nhân cho booking call funnel — 1-on-1 vibe phù hợp hơn. Zalo OA cho mass nurture.

---

## Booking Flow — Zalo Manual

Không dùng Calendly. Lý do: thêm friction, UX không quen, mất đi personal touch quan trọng với high-ticket.

**Flow chuẩn:**

```
Người submit form
       ↓
Admin nhận notification (Telegram Bot hoặc Google Sheet row)
       ↓
Admin nhắn Zalo trong < 30 phút:
"[Tên], mình đã nhận application của bạn rồi.
Mình có slot vào [ngày A] lúc [X giờ] hoặc [ngày B] lúc [Y giờ].
Slot nào tiện hơn với bạn?"
       ↓
Người chọn slot
       ↓
Admin confirm + gửi meeting link:
"Xác nhận rồi! [Ngày, Giờ].
Link Zoom: [link]
Mình sẽ nhắc lại bạn trước 24h nhé."
```

**Tại sao manual tốt hơn cho high-ticket:**
- Mỗi tin nhắn confirm là 1 điểm chạm — build trust trước call
- Người cảm thấy được đối xử cá nhân, không phải automation
- Admin có thể gauge warmth của lead từ cách họ reply
- Không bị miss slot do timezone confusion

**Khi nào scale lên automation:**
- > 30 qualified leads/tuần → mới cần automation
- Lúc đó: form có step chọn ngày/giờ preferred → auto-confirm nếu slot free

**Available slots template (chia sẻ khi người hỏi về lịch):**
```
Mình available các khung giờ sau (GMT+7):
• Thứ 2–5: 9:00–11:30 và 14:00–17:00
• Thứ 6: 9:00–11:30
• Cuối tuần: theo yêu cầu

Buffer giữa các call: 15 phút
Max calls/ngày: [tự xác định, thường 3–5]
```

---

## Pricing & Payment

### Price Anchoring trong Call

**Không reveal giá trong application form.** Reveal trên call sau khi paint transformation.

**VND pricing format:**
- Không dùng: 10,000,000đ (khó đọc)
- Dùng: 10 triệu / 10M

**Pricing psychology VN:**

Giá cuối nên là số lẻ (perceived discount): 9.7M > 10M
Hoặc số tròn dễ nhớ: 15M, 20M, 50M

**Installment pattern phổ biến:**
```
Option 1: Thanh toán 1 lần — [giá full], tiết kiệm [X%]
Option 2: 2 lần — [X/2 VND] × 2 (tháng 1 và tháng 2)
Option 3: 3 lần — [X/3 VND] × 3 (tháng 1, 2, 3)
```

**Payment methods:**
- Bank transfer (Vietcombank / Techcombank / BIDV — phổ biến nhất)
- MoMo (nhanh, không cần account ngân hàng)
- VNPay QR
- SePay VietQR (nếu dùng trong AI Agent Business Kit)

**Gửi link sau call:**
```
"[Tên], cảm ơn buổi nói chuyện! Tôi gửi bạn thông tin thanh toán:

Option 1 (Full): [giá] → [payment link hoặc STK]
Option 2 (2 lần): [giá × 2] → [payment link]

[Tên ngân hàng]: [số tài khoản]
Chủ TK: [tên]
Nội dung: [Tên] - [Tên chương trình]

Câu hỏi gì cứ nhắn tôi nhé 🙏"
```

---

## Relationship Building

**VN buyers cần trust cao hơn trước khi close.** Đây không phải objection — đây là cultural norm.

### Trust builders trước call:
- VSL với face + voice (không slide only)
- Story video cá nhân (indoctrination #1) — người thấy bạn "thật" sẽ commit nhanh hơn
- Testimonial từ người cùng background (VN, cùng vấn đề, cùng ngành)
- Thời gian phản hồi nhanh sau khi họ submit form — < 30 phút tạo ấn tượng mạnh

### Trong call:
- Spend thêm 2–3 phút warm-up (không vội vào business)
- Hỏi thêm về người, không chỉ về business
- Dùng tên thường xuyên hơn so với Western norm

### Sau khi họ nói "cần suy nghĩ":
- Không push hard ngay — gửi summary + case study
- Câu hỏi mở thay vì ultimatum
- 5-day follow-up nhẹ nhàng hơn nhưng persistent hơn

---

## Decision-Making Patterns

**"Cần hỏi vợ/chồng"** là objection thật, không phải smoke screen trong thị trường VN.

**Cách handle:**
```
"Hoàn toàn ủng hộ — đây là quyết định lớn.
Thường thì vợ/chồng bạn concern về điều gì khi 
bạn muốn đầu tư vào thứ gì đó như thế này?

[Nghe]

Để tôi gợi ý — bạn có thể chia sẻ [1–2 điểm cụ thể] với vợ/chồng.
Hoặc nếu muốn, tôi có thể gửi thêm thông tin để bạn show cho họ xem.
Bạn nghĩ sẽ nói chuyện với họ khi nào?"
```

**Option:** Offer buổi call ngắn (15–20 phút) với cả 2 nếu deal size lớn (> 30M VND).

---

## Call Platform Recommendations

| Platform | Pros | Cons | Dùng khi |
|----------|------|------|----------|
| Zoom | Professional, recording, screen share | Cần account, firewall đôi khi block | Default cho B2B, offer > 20M |
| Google Meet | Không cần app, link đơn giản | Chất lượng video đôi khi kém | Audience ít tech-savvy |
| Zalo Video | Familiar với người VN, không cần setup | Chất lượng hơi kém, không record | Casual offer < 10M, warm audience |

**Khuyến nghị:** Zoom default, Google Meet backup link, offer Zalo Video như last resort.

**Setup:** Luôn send link ít nhất 24h trước — không gửi chỉ 1h trước.

---

## Show-Up Rate VN Market

Benchmark VN thường thấp hơn Western (50–65% vs 70–80%) vì:
- Scheduling culture khác — confirm hôm nay, cancel sáng hôm sau
- Zalo message dễ bị ignore hơn phone call
- Chưa quen với "appointment culture" trong B2C

**Tăng show-up cho VN market:**
1. **Voice note** thay vì text reminder — cá nhân, khó ignore
2. **Call ngắn** ngày hôm trước (30 giây) — "Chỉ xác nhận nhanh..."
3. **Frame call là valuable cho họ** — "Tôi đã chuẩn bị ý tưởng cụ thể cho tình huống của bạn"
4. **Không chỉ 1 channel** — Zalo + email, cả 2
5. **Sáng vs chiều:** Tỷ lệ show-up cao hơn với call buổi sáng (9–11h) hơn buổi chiều muộn

---

## Language & Tone

**Xưng hô:** Tùy thuộc vào audience —
- Bạn/tôi: phù hợp với người cùng generation, informal
- Anh/em hoặc Chị/em: formal, nếu người lớn tuổi hơn rõ ràng
- Trong script template: dùng [Tên] để closer fill in theo context

**Tone trong call:** Direct nhưng không aggressive. Quan tâm thật, không perform care.

**Tránh:** Quá nhiều "anh ơi/chị ơi" — nghe sycophantic. Dùng tên thay thế.

**Testimonials nên từ người cùng bối cảnh VN:** Người học từ giáo trình nước ngoài → không resonant bằng người cùng thành phố / cùng ngành / cùng vấn đề.
