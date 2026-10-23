---
name: section-types
description: "15 section types — vocabulary cho Copy Brief. Mỗi type gợi ý layout mà AI designer sẽ reason toward khi đọc Copy Brief."
---

# Section Types

## Cách Dùng

Khi viết Copy Brief, mỗi section phải có **Type**. Type không prescribe layout — nó cho AI designer biết *loại nội dung này là gì* để tự quyết định layout phù hợp nhất với copy cụ thể đó.

**Nguyên tắc:** Type mô tả nội dung, không mô tả layout. Cùng một type có thể có nhiều layout khác nhau tuỳ theo copy và style template.

---

## 15 Section Types

---

### 1. `hero-claim`

**Là gì:** Tuyên bố lớn, mạnh, thường là headline chính của trang. Không có visual cạnh tranh — copy là thứ duy nhất.

**Intent thường thấy:** Làm reader gật đầu ngay, muốn đọc tiếp / muốn xem video / muốn scroll xuống

**Layout AI sẽ reason toward:**
- Centered hoặc left-aligned với heading rất lớn
- Nhiều whitespace — copy cần không gian để thở
- Sub-headline nhỏ hơn, muted color
- Có hoặc không có CTA ở đây (tuỳ intent)
- Background thường tối giản — không cạnh tranh với copy

**Visual:** Thường `none`. Nếu có thì `image-placeholder` đặt sau copy, không song song.

**Ví dụ copy signal:** Single transformation promise, counterintuitive claim, bold statement

---

### 2. `hero-split`

**Là gì:** Headline + visual đặt song song, thường 2 cột. Visual là một phần của storytelling, không phải decoration.

**Intent thường thấy:** Establish credibility ngay lập tức bằng cả lời và hình

**Layout AI sẽ reason toward:**
- 2 cột: copy 1 bên, visual 1 bên (ratio tuỳ theo copy length)
- Copy bên trái nếu muốn lead với ngôn ngữ, bên phải nếu visual mạnh hơn
- Visual không phải stock photo — phải cụ thể (ảnh tác giả, screenshot sản phẩm, mockup)

**Visual:** `image-placeholder` hoặc `screenshot` — bắt buộc có

---

### 3. `video-section`

**Là gì:** Video là trung tâm. Text xung quanh chỉ phục vụ video.

**Intent thường thấy:** Người xem video trước khi làm bất kỳ hành động nào / Video thuyết phục thay copy dài

**Layout AI sẽ reason toward:**
- Video centered, full-width trong container
- Text trước video: tối thiểu — chỉ đủ để dẫn dắt người xem
- Text sau video: hành động tiếp theo (scroll xuống, điền form...)
- Không có visual element nào cạnh tranh với video

**Visual:** `video-embed` — bắt buộc

---

### 4. `process-steps`

**Là gì:** Quy trình tuần tự, thường 3–5 bước. Mỗi bước có số thứ tự rõ ràng.

**Intent thường thấy:** Làm reader hiểu "sẽ xảy ra gì tiếp theo" / Giảm anxiety về sự phức tạp / Build trust bằng transparency

**Layout AI sẽ reason toward:**
- Horizontal sequence trên desktop (số lớn → title → description)
- Vertical stack trên mobile
- Connector giữa các bước (line, arrow, hoặc visual)
- Số thứ tự là visual anchor — cần nổi bật

**Visual:** Thường `none` hoặc `svg-icon` nhỏ cho từng bước

---

### 5. `comparison`

**Là gì:** 2 cột đối lập nhau — thường NOT/FOR, before/after, wrong vs. right approach.

**Intent thường thấy:** Filter out wrong leads + make right leads self-qualify / Tạo tension để resolve / Agitate pain bằng contrast

**Layout AI sẽ reason toward:**
- 2 cột, tint màu khác nhau (đỏ/xanh, muted/vivid)
- Mỗi item trong cột là mini-card riêng, không phải plain list
- Label cột rõ ràng, font nhỏ, uppercase
- Không có CTA trong section này — chỉ qualify

**Visual:** `none`

---

### 6. `deliverables`

**Là gì:** Liệt kê cụ thể những thứ reader sẽ nhận được — không phải features, mà là outcomes.

**Intent thường thấy:** Làm offer cụ thể đến mức reader có thể hình dung ngay / Justify giá trị trước khi reveal giá

**Layout AI sẽ reason toward:**
- Card grid 2–4 cột (tuỳ số items)
- Mỗi card: title ngắn (outcome) + description ngắn (context/proof)
- Không có icon nếu không có icon thật — watermark decorative thay thế
- Hover effect nhẹ để cards cảm giác interactive

**Visual:** Thường `none`. Icon nếu có icon set nhất quán.

---

### 7. `benefits-list`

**Là gì:** Danh sách lợi ích, thường dạng checklist hoặc bullet. Khác `deliverables` ở chỗ: benefits = WHY, deliverables = WHAT.

**Intent thường thấy:** Build desire nhanh / Cho reader scan và tìm thứ họ muốn / Xử lý nhiều objections cùng lúc

**Layout AI sẽ reason toward:**
- Nếu ≤5 items: single column list
- Nếu 6–12 items: 2-column grid
- Checkmark hoặc custom icon trước mỗi item
- Items ngắn: 1–2 dòng tối đa

**Visual:** `svg-icon` cho checkmark (không dùng emoji)

---

### 8. `qualification`

**Là gì:** Card hoặc box mô tả điều kiện để tham gia/apply. Thường single focus — ai phù hợp.

**Intent thường thấy:** Tạo exclusivity / Làm reader muốn "qualify" mình trước khi apply

**Layout AI sẽ reason toward:**
- Card centered với border accent
- Text inside: clear, direct, không apologetic
- Có thể include short checklist
- CTA bên trong hoặc ngay sau

**Visual:** `none`

---

### 9. `social-proof`

**Là gì:** Testimonial, case study, hoặc quote từ người thật với kết quả thật.

**Intent thường thấy:** Reduce skepticism / Làm reader thấy người giống mình đã thành công / Proof không phải claim

**Layout AI sẽ reason toward:**
- 1 quote lớn (pull quote): centered, italic, prominent
- Multiple testimonials: card grid 2–3 cột
- Case study mini: 2-col với context bên trái và result bên phải
- Tên thật + chức vụ/thành phố — không anonymous

**Visual:** Avatar thumbnail nếu có ảnh thật. Không dùng stock photo.

---

### 10. `stats-row`

**Là gì:** Số liệu credibility — thường 3–5 con số với label ngắn.

**Intent thường thấy:** Build trust nhanh bằng cụ thể / Không làm gián đoạn flow nhưng plant credibility

**Layout AI sẽ reason toward:**
- Horizontal strip, các số chia đều với divider
- Số lớn (display font), label nhỏ (uppercase muted)
- Không nhiều hơn 5 số — nhiều hơn làm mất impact
- Background khác với sections xung quanh để tạo visual break

**Visual:** `none`

---

### 11. `narrative`

**Là gì:** Đoạn văn kể chuyện — origin story, case study dài, insight quan trọng. Copy nhiều, visual ít.

**Intent thường thấy:** Build deep trust / Tạo connection cảm xúc / Explain mechanism không thể tóm tắt trong bullets

**Layout AI sẽ reason toward:**
- Single column, max-width hẹp (60–70ch) — đọc như bài editorial
- Generous line-height, paragraph breaks thường xuyên
- Có thể có pull quote bên trong
- Không có sidebar hay visual cạnh tranh

**Visual:** `none` hoặc `image-placeholder` nhỏ inline

---

### 12. `faq`

**Là gì:** Câu hỏi thường gặp — thực ra là objection handling ở dạng Q&A.

**Intent thường thấy:** Xử lý các lý do KHÔNG mua còn lại / Giảm anxiety trước CTA / Trả lời câu hỏi người không dám hỏi trực tiếp

**Layout AI sẽ reason toward:**
- Accordion (expand/collapse) nếu nhiều hơn 5 items
- Q&A list tĩnh nếu ≤5 items
- Question bold, answer normal weight, muted color
- Không chia thành nhiều cột — đọc theo sequence

**Visual:** `none`

---

### 13. `cta-strip`

**Là gì:** Section tập trung hoàn toàn vào 1 CTA. Không có gì khác.

**Intent thường thấy:** Convert reader đã được warm up / Repeat CTA sau long-form content / Close với urgency

**Layout AI sẽ reason toward:**
- Centered, minimal
- Headline ngắn (urgency hoặc reminder of value)
- 1 button duy nhất — large, prominent
- Micro-copy dưới button (trust/friction removal)
- Background khác với section trước để tạo break

**Visual:** `none`

---

### 14. `application-gate`

**Là gì:** Card giải thích process để apply/register + CTA để bắt đầu. Đặc thù của booking funnel.

**Intent thường thấy:** Biến "đăng ký" thành "được chọn" — reader muốn được accept, không phải đang bị bán

**Layout AI sẽ reason toward:**
- Card với border (không phải plain section)
- Badge hoặc label ở đầu ("BY APPLICATION ONLY" hoặc tương đương)
- Process steps visual bên trong card (3 bước)
- CTA bên trong card — không float ngoài
- Note italic dưới CTA

**Visual:** `none`

---

### 15. `pricing`

**Là gì:** Hiển thị giá và các option. Có thể 1 giá duy nhất hoặc so sánh nhiều tier.

**Intent thường thấy:** Justify giá sau khi đã build value / Make the "yes" decision easy / Handle price objection bằng contrast

**Layout AI sẽ reason toward:**
- 1 tier: card centered, featured look
- 2–3 tiers: card grid, 1 card highlighted (recommended)
- Luôn có giá trị so sánh (giá gốc vs. giá hiện tại, hoặc giá vs. cost of problem)
- Guarantee hoặc risk reversal gần với giá

**Visual:** `none`

---

## Quick Reference — Copy Signal → Section Type

| Copy này trông như thế nào | Type nên dùng |
|---------------------------|--------------|
| "Làm X trong Y ngày không cần Z" — 1 câu mạnh | `hero-claim` |
| Tên + ảnh tác giả + tagline | `hero-split` |
| "Xem video trước khi..." | `video-section` |
| "Bước 1... Bước 2... Bước 3..." | `process-steps` |
| "Không dành cho... / Dành cho..." | `comparison` |
| "Sau buổi này bạn sẽ có: [list]" | `deliverables` |
| "✓ Không cần... ✓ Dù bạn..." | `benefits-list` |
| "Buổi này dành cho ai?" | `qualification` |
| "[Tên] đã làm được X trong Y..." | `social-proof` |
| "10 năm / 3 năm / [X] người..." | `stats-row` |
| Đoạn story/discovery/origin | `narrative` |
| "Câu hỏi thường gặp..." | `faq` |
| "[Urgency]. [CTA]." | `cta-strip` |
| "Tại sao có application? [Process]" | `application-gate` |
| "Đầu tư: [giá] — bao gồm: [list]" | `pricing` |
