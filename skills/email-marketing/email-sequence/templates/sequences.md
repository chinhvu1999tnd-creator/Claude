# Email Sequences — Deliver Agent

> Copy cho 4 post-purchase sequences.
> Auto-setup: `node skills/integrations/email/scripts/setup-funnel-email.js --type sales --slug [slug]`
> Script tự tạo Brevo list + templates, sau đó in hướng dẫn 1 bước manual còn lại.
> Trigger: Brevo Automation chạy khi contact được thêm vào list "Customers — [slug]"
>
> Xưng hô: **bạn** (người đọc) · **tôi** (sender). KHÔNG dùng anh/chị trong email copy.

---

## SEQUENCE 1 — Onboarding (7 emails · 10 ngày)

**List trigger:** "Customers"
**Goal:** Kích hoạt sớm, tạo quick win, giữ học viên đến ngày 10

---

### Email 1 — Ngay lập tức: Welcome + Bước đầu tiên

**Subject:** Chào mừng bạn đến với {{PRODUCT}}! Bắt đầu từ đây...

---

Chào {{FIRSTNAME}},

Link truy cập vừa được gửi vào email của bạn (hoặc trong cùng hộp thư này).

Nhưng trước khi bắt đầu — tôi muốn nói một điều:

Hầu hết người mua {{PRODUCT}} đạt kết quả rõ rệt trong tuần đầu tiên. Không phải vì họ giỏi hơn. Mà vì họ làm đúng **một việc** ngay hôm nay thay vì để sau.

**Việc đó là gì?**

→ [Link đến bước 1 cụ thể — điền khi setup]

Chỉ cần 20 phút. Xong rồi nhắn lại cho tôi kết quả — tôi đọc từng tin.

[TÊN BẠN]

---

### Email 2 — Ngày 1: Quick win

**Subject:** Bài học đầu tiên quan trọng nhất là...

---

Chào {{FIRSTNAME}},

Hôm qua bạn bắt đầu. Hôm nay tôi muốn chia sẻ điều mà 80% người dùng {{PRODUCT}} bỏ qua ở tuần đầu.

**Đó là:** [Insight cụ thể — điền khi setup]

Ví dụ cụ thể: [Case ngắn 2-3 câu — điền khi setup]

**Hôm nay bạn thử làm:**

→ [Hành động cụ thể dưới 30 phút — điền khi setup]

Làm xong, reply cho tôi biết kết quả.

[TÊN BẠN]

---

### Email 3 — Ngày 2: Cộng đồng + Accountability

**Subject:** Có người đang chờ bạn trong group...

---

Chào {{FIRSTNAME}},

Một mình làm việc khó hơn làm cùng người khác rất nhiều.

Đó là lý do tôi tạo group cho người dùng {{PRODUCT}}.

Trong group hôm nay, [tên học viên] vừa chia sẻ: [kết quả cụ thể — điền khi setup].

**Tham gia:**
→ [Link group Telegram/Zalo — điền khi setup]

Giới thiệu bản thân và nói bạn đang ở đâu — mọi người sẽ chào đón bạn.

[TÊN BẠN]

---

### Email 4 — Ngày 4: Xử lý nghi ngờ

**Subject:** Bình thường nếu bạn đang cảm thấy thế này...

---

Chào {{FIRSTNAME}},

Ngày 3–5 thường là giai đoạn khó nhất.

Bạn đã làm được một vài thứ. Nhưng kết quả chưa thấy rõ. Và một phần trong bạn bắt đầu tự hỏi: *"Liệu cái này có work với mình không?"*

Đây chính xác là lúc người tiếp tục tách biệt khỏi người bỏ cuộc.

**Câu hỏi cho bạn:** Bạn đang ở đâu rồi? Reply cho tôi biết — tôi sẽ gợi ý bước tiếp theo.

[TÊN BẠN]

---

### Email 5 — Ngày 5: Insider tip

**Subject:** Bí mật mà tôi chưa kể trong {{PRODUCT}}...

---

Chào {{FIRSTNAME}},

Có một thứ tôi biết nhưng không đưa vào tài liệu chính — vì nó chỉ có ý nghĩa sau khi bạn đã trải qua tuần đầu tiên.

**Đó là:** [Insight / shortcut nâng cao — điền khi setup]

Tại sao nó work? [Giải thích 2-3 câu]

Cách áp dụng: [Bước cụ thể]

Chỉ người dùng {{PRODUCT}} mới nhận email này.

[TÊN BẠN]

---

### Email 6 — Ngày 7: Celebrate + Week 2 preview

**Subject:** Bạn đã hoàn thành tuần đầu tiên 🎉

---

Chào {{FIRSTNAME}},

7 ngày. Bạn không bỏ cuộc.

Hầu hết người mua không đến được đây.

Tuần tới chúng ta sẽ đi sâu hơn vào: [Preview week 2 — tạo curiosity]

Nhưng trước khi bắt đầu tuần 2 — **kết quả lớn nhất bạn thấy sau tuần đầu là gì?**

Reply cho tôi.

[TÊN BẠN]

---

### Email 7 — Ngày 10: Xin testimonial

**Subject:** Tôi có thể nhờ bạn một điều không?

---

Chào {{FIRSTNAME}},

10 ngày kể từ khi bạn bắt đầu {{PRODUCT}}.

Tôi muốn hỏi thẳng: bạn đã thấy kết quả gì chưa?

Nếu có — tôi muốn share câu chuyện của bạn (nếu bạn cho phép).

Chỉ cần 2-3 câu: bạn ở đâu trước khi dùng, và bây giờ thế nào.

Reply ngay email này.

[TÊN BẠN]

---

## SEQUENCE 2 — Re-engagement (3 emails · 7 ngày)

**List trigger:** "Re-engagement" (thêm manual hoặc script sau 30 ngày inactive)
**Goal:** Kéo lại người dùng không active

---

### Email 1 — Ngày 1: Check-in nhẹ

**Subject:** Bạn có ổn không? Tôi lo một chút...

---

Chào {{FIRSTNAME}},

Tôi nhận ra đã lâu không thấy bạn active với {{PRODUCT}}.

Không có ý phán xét — cuộc sống bận, điều đó xảy ra với tất cả mọi người.

Tôi chỉ muốn hỏi: **Bạn đang gặp khó khăn gì không?**

Reply email này — hoặc bắt đầu lại từ chỗ dễ nhất:
→ [Link bước dễ nhất — điền khi setup]

[TÊN BẠN]

---

### Email 2 — Ngày 3: Reframe

**Subject:** Điều này xảy ra với 80% người mua — và cách fix trong 15 phút

---

Chào {{FIRSTNAME}},

80% người mua bất kỳ sản phẩm số nào không dùng nó sau tháng đầu tiên.

Không phải vì sản phẩm tệ. Mà vì **ma sát ban đầu** quá lớn.

Cách fix trong 15 phút:
→ [Quick-win task cụ thể nhất — điền khi setup]

[TÊN BẠN]

---

### Email 3 — Ngày 7: Lời đề nghị cuối

**Subject:** Lời đề nghị cuối của tôi...

---

Chào {{FIRSTNAME}},

Tôi đã gửi 2 email nhưng chưa thấy bạn phản hồi.

Lời đề nghị: **Nếu bạn gặp khó khăn gì với {{PRODUCT}}, reply email này.**

Tôi sẽ sắp xếp 15 phút call để giúp bạn đi tiếp — không tốn thêm gì.

[TÊN BẠN]

---

## SEQUENCE 3 — Referral (2 emails · 5 ngày)

**List trigger:** Tag "milestone-1" (thêm khi customer đạt kết quả đầu tiên)
**Goal:** Khai thác word-of-mouth từ người đã có kết quả

---

### Email 1 — Ngày 1: Plant the seed

**Subject:** Bạn đã đạt được [kết quả] — người tiếp theo là ai?

---

Chào {{FIRSTNAME}},

[Kết quả họ đạt được] — tôi rất vui khi thấy bạn tiến xa thế này.

Tôi muốn hỏi: **Bạn có ai trong network đang gặp vấn đề tương tự như bạn trước đây không?**

Nếu có — bạn có thể là người thay đổi được cho họ.

Không cần làm gì ngay. Tôi chỉ muốn bạn nghĩ xem ai xứng đáng biết đến {{PRODUCT}}.

[TÊN BẠN]

---

### Email 2 — Ngày 5: Referral CTA

**Subject:** Cách chia sẻ {{PRODUCT}} (đơn giản nhất)

---

Chào {{FIRSTNAME}},

Đây là cách dễ nhất để chia sẻ:

**Option 1 — Forward email này:**
Thêm: *"Tôi đang dùng cái này và thấy [kết quả của bạn]."*

**Option 2 — Share link:**
→ [Link sales page — điền khi setup]

[Nếu có affiliate]: Nhắn tôi để lấy link referral riêng, nhận [X%] mỗi người giới thiệu mua.

Cảm ơn bạn rất nhiều.

[TÊN BẠN]

---

## SEQUENCE 4 — Renewal (4 emails · 14 ngày)

**List trigger:** 30 ngày trước ngày expiry (dùng Brevo scheduled automation hoặc manual)
**Goal:** Gia hạn trước khi giá tăng

---

### Email 1 — Ngày 1: Nhắc nhở

**Subject:** {{PRODUCT}} của bạn sắp hết hạn — một điều bạn nên biết

---

Chào {{FIRSTNAME}},

{{PRODUCT}} của bạn sẽ hết hạn vào **[NGÀY]** — còn 30 ngày.

Không cần làm gì ngay. Tôi chỉ muốn bạn biết sớm.

Trong khi đó — bạn đã khai thác hết thứ này trong {{PRODUCT}} chưa?
→ [Feature/content ít người dùng — điền khi setup]

[TÊN BẠN]

---

### Email 2 — Ngày 7: Value reminder

**Subject:** Bạn đã dùng {{PRODUCT}} để làm gì trong [X tháng] qua?

---

Chào {{FIRSTNAME}},

[X tháng] kể từ khi bạn bắt đầu. Những thứ bạn đã có access vào:

→ [Value 1 cụ thể]
→ [Value 2 cụ thể]
→ [Value 3 cụ thể]

Còn [X ngày] để gia hạn ở mức giá cũ.

→ [Link renewal — điền khi setup]

[TÊN BẠN]

---

### Email 3 — Ngày 12: Urgency

**Subject:** Còn 2 ngày — sau đó giá tăng

---

Chào {{FIRSTNAME}},

Còn 2 ngày để gia hạn {{PRODUCT}} ở mức giá [GIÁ CŨ].

Sau ngày [NGÀY], giá sẽ là [GIÁ MỚI].

→ [Link renewal — điền khi setup]

[TÊN BẠN]

---

### Email 4 — Ngày 14: Last call

**Subject:** Hôm nay là ngày cuối

---

Chào {{FIRSTNAME}},

Hôm nay là ngày cuối để gia hạn ở giá [GIÁ CŨ].

Nếu {{PRODUCT}} đã giúp bạn [kết quả cụ thể] — gia hạn để tiếp tục:
→ [Link renewal]

Dù bạn quyết định thế nào, cảm ơn bạn.

[TÊN BẠN]

---

## Ghi chú khi setup Brevo Automations

- Mỗi sequence = 1 Automation riêng trong Brevo
- Xem hướng dẫn step-by-step: `skills/integrations/brevo/sequence-setup-guide.md`
- Copy email từ file này paste vào Brevo email editor
- Personalization variables Brevo: `{{ contact.FIRSTNAME }}`, `{{ contact.PRODUCT }}`
- Stop condition: nếu contact mua upsell → stop upsell sequence
