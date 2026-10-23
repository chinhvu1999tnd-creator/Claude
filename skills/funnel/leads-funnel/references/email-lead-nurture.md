# Email Lead Nurture Sequence — Leads Funnel

> Copy cho chuỗi email sau khi khách opt-in vào phễu lead.
> Trigger: contact được thêm vào Brevo "Leads" list qua `enrollLead()`
> Setup Brevo Automation: `skills/integrations/brevo/sequence-setup-guide.md`
>
> Xưng hô: **bạn** (người đọc) · **tôi** (sender). KHÔNG dùng anh/chị.

---

## SEQUENCE — Lead Nurture (5 emails · 7 ngày)

**Mục tiêu:** Warm up lead từ "vừa để email" → sẵn sàng mua.
**Không pitch** ở email 1–3. Pitch mềm ở email 4. Offer rõ ở email 5.

---

### Email 1 — Ngay lập tức: Deliver lead magnet + Welcome

**Subject:** [Tên lead magnet] của bạn đây →

---

Chào {{FIRSTNAME}},

Đây là [tên lead magnet] tôi đã hứa:

→ [Link download/xem — điền khi setup]

[1-2 câu hướng dẫn dùng lead magnet — điền khi setup]

Trong tuần tới tôi sẽ gửi cho bạn [số] thứ liên quan đến [chủ đề] mà tôi nghĩ bạn sẽ thấy có ích.

Nếu bạn không muốn nhận, unsubscribe ngay bên dưới — không giận.

[TÊN BẠN]

---

### Email 2 — Ngày 2: Insight có giá trị

**Subject:** [Insight ngắn gọn, gợi curiosity — điền khi setup]

---

Chào {{FIRSTNAME}},

Hôm qua bạn tải [lead magnet]. Hôm nay tôi muốn chia sẻ thêm một thứ liên quan.

**[Tên insight]:**

[Nội dung 3-5 đoạn — giá trị thật, không pitch. Điền khi setup]

Ví dụ thực tế: [Case/ví dụ cụ thể]

Ngày mai tôi sẽ gửi tiếp [preview email 3 — tạo curiosity].

[TÊN BẠN]

---

### Email 3 — Ngày 4: Story + Shift nhận thức

**Subject:** Tôi đã sai về [vấn đề] trong [X năm]...

---

Chào {{FIRSTNAME}},

[Story ngắn 4-6 đoạn — honest, vulnerable. Điền khi setup]

Điều tôi học được: [Insight lớn, dẫn tới cách nhìn mới về vấn đề]

Ngày mai tôi muốn chia sẻ với bạn cách tôi giải quyết vấn đề này — cụ thể hơn.

[TÊN BẠN]

---

### Email 4 — Ngày 5: Solution reveal + soft CTA

**Subject:** Cách tôi [kết quả cụ thể] — và bạn có thể làm tương tự

---

Chào {{FIRSTNAME}},

Sau khi hiểu ra [insight từ email 3], tôi bắt đầu làm theo cách này:

[Mô tả cách tiếp cận — 4-6 đoạn. Dẫn đến sản phẩm một cách tự nhiên]

Đây là hệ thống tôi đã đóng gói thành [tên sản phẩm].

Nếu bạn tò mò muốn tìm hiểu thêm:
→ [Link trang giới thiệu — điền khi setup]

Không cần quyết định gì hôm nay — chỉ xem thử.

[TÊN BẠN]

---

### Email 5 — Ngày 7: Direct offer

**Subject:** Dành cho bạn — [offer cụ thể]

---

Chào {{FIRSTNAME}},

Trong tuần qua tôi đã chia sẻ với bạn về [chủ đề].

Hôm nay tôi muốn nói thẳng:

Nếu bạn muốn [kết quả cụ thể] mà không phải [pain point], [tên sản phẩm] được build chính xác cho điều đó.

**[Tên sản phẩm]** giúp bạn:
→ [Benefit 1]
→ [Benefit 2]
→ [Benefit 3]

**Giá:** [GIÁ] — [framing: "bằng X ly cà phê/tháng" hoặc "one-time"]

→ [Link sales page — điền khi setup]

Nếu không phải thời điểm phù hợp, không sao. Email tiếp theo sẽ là [nội dung tiếp theo].

[TÊN BẠN]

---

## Ghi chú

**Personalization variables Brevo:**
- `{{ contact.FIRSTNAME }}` → tên lead
- `{{ contact.SOURCE }}` → nguồn lead (landing page slug)

**Stop condition:**
- Nếu lead mua sản phẩm → stop sequence này, Brevo tự chuyển sang "Customers" list → trigger onboarding

**Brevo Automation trigger:**
- "Contact added to list **Leads**"
- Send Email 1 immediately (delay = 0)

**Thay thế placeholder:**
Tất cả `[...]` trong file này phải được điền trước khi setup Brevo Automation.
Đây là content mẫu — cần customize theo offer và voice của từng business.
